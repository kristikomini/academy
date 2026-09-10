package it.fonderia.accounts.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

/**
 * Turns a bearer token into a user id, or a 401.
 *
 * <p><b>Filter order is behaviour, not taste.</b> Blueprint §5.4 decision 6. This runs
 * <em>after</em> the rate limiter, because rejecting a flood should be cheap — verifying a
 * signature for a request you are about to throw away is work an attacker gets for free.
 *
 * <p>The public list is explicit rather than "everything except". An endpoint added later
 * is protected by default, which is the direction you want that mistake to fall.
 *
 * <p>The authenticated id goes on the request as an attribute and controllers take it as
 * {@code @RequestAttribute}. That keeps the whole authentication story in one readable
 * file instead of spread across a Spring Security configuration — this service is meant to
 * be read in one sitting.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    public static final String USER_ID = "accounts.userId";

    private static final Set<String> PUBLIC_PATHS = Set.of(
        "/api/health",
        "/api/auth/register",
        "/api/auth/login",
        "/api/auth/refresh",
        "/api/auth/logout",
        "/api/auth/forgot-password",
        "/api/auth/reset-password");

    private final JwtService jwt;

    public JwtAuthFilter(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String path = request.getRequestURI();

        /* Anything that is not the API is a static page or an unknown path, and must be
           served — or 404 — anonymously, never 401. Blueprint §5.6. */
        if (!path.startsWith("/api/") || PUBLIC_PATHS.contains(path)
            || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            unauthorised(response, "No bearer token.");
            return;
        }

        UUID userId = jwt.verify(header.substring(7)).orElse(null);
        if (userId == null) {
            unauthorised(response, "The token is not valid.");
            return;
        }

        request.setAttribute(USER_ID, userId);
        chain.doFilter(request, response);
    }

    /**
     * Written here rather than thrown, because an exception from a filter never reaches
     * the {@code @RestControllerAdvice} — that runs inside the dispatcher and this does
     * not. Producing the same problem-details shape by hand is the price of that, and it
     * is why so many APIs answer a bad token with an HTML error page.
     */
    private void unauthorised(HttpServletResponse response, String detail) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/problem+json");
        response.getWriter().write(
            "{\"type\":\"about:blank\",\"title\":\"unauthorized\",\"status\":401,\"detail\":\""
                + detail + "\"}");
    }
}
