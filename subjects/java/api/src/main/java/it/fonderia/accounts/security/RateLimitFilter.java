package it.fonderia.accounts.security;

import it.fonderia.accounts.config.AccountsProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * A fixed-window limiter on {@code /api/auth/*}, per IP.
 *
 * <p><b>Lockout and rate limiting are different defences and neither substitutes for the
 * other.</b> Blueprint §5.4 decision 5. The account lockout stops credential stuffing
 * against <em>one</em> login; this stops a spray across <em>many</em> accounts, which no
 * per-account counter would ever see.
 *
 * <p><b>{@code /api/health} is deliberately outside it.</b> A liveness probe that gets
 * rate-limited reports the service as down, and the orchestrator restarts a healthy
 * process — an outage caused entirely by the protection.
 *
 * <p>Three honest limitations, stated rather than hidden:
 *
 * <ul>
 *   <li>It is a <b>fixed window</b>, so twice the limit can pass across a boundary. A
 *       sliding window or token bucket is the better algorithm.</li>
 *   <li>The counters are <b>in memory</b>, so with two instances the effective limit
 *       doubles. A shared store is the fix, and it is the same class of problem as the
 *       outbox relay running twice.</li>
 *   <li>The client IP comes from the socket, so <b>behind a proxy every request appears to
 *       come from one address</b>. Honouring {@code X-Forwarded-For} is the fix and must
 *       only be done when a trusted proxy is known to set it — otherwise the header is
 *       attacker-controlled and the limiter is trivially bypassed.</li>
 * </ul>
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private record Window(Instant startedAt, AtomicInteger count) {
    }

    private final Map<String, Window> windows = new ConcurrentHashMap<>();
    private final AccountsProperties properties;
    private final Clock clock;

    public RateLimitFilter(AccountsProperties properties, Clock clock) {
        this.properties = properties;
        this.clock = clock;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        if (!request.getRequestURI().startsWith("/api/auth/")) {
            chain.doFilter(request, response);
            return;
        }

        Instant now = clock.instant();
        String ip = request.getRemoteAddr();

        Window window = windows.compute(ip, (key, existing) -> {
            if (existing == null || Duration.between(existing.startedAt(), now).toSeconds() >= 60) {
                return new Window(now, new AtomicInteger(0));
            }
            return existing;
        });

        if (window.count().incrementAndGet() > properties.authRequestsPerMinute()) {
            response.setStatus(429);
            response.setContentType("application/problem+json");
            response.setHeader("Retry-After", "60");
            response.getWriter().write(
                "{\"type\":\"about:blank\",\"title\":\"too-many-requests\",\"status\":429,"
                    + "\"detail\":\"Too many attempts. Wait a minute and try again.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    /** Test seam: the counters are process-wide, and tests need a clean slate. */
    public void reset() {
        windows.clear();
    }
}
