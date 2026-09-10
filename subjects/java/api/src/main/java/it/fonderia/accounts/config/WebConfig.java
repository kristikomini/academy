package it.fonderia.accounts.config;

import it.fonderia.accounts.security.JwtAuthFilter;
import it.fonderia.accounts.security.RateLimitFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.time.Clock;
import java.util.List;

/**
 * Filter order, which is behaviour rather than taste.
 *
 * <pre>
 *   CORS  →  rate limiter  →  authentication  →  dispatcher  →  controllers
 * </pre>
 *
 * <p><b>CORS first</b>, because a preflight {@code OPTIONS} carries no credentials. Put
 * authentication before it and every cross-origin request fails with a 401 that the
 * browser reports as a CORS error — the single most confusing symptom in this area, and a
 * filter-ordering bug rather than a CORS one.
 *
 * <p><b>Rate limiting before authentication</b>, because rejecting a flood should be
 * cheap. Verifying a signature for a request you are about to discard is work an attacker
 * gets for free.
 */
@Configuration
public class WebConfig {

    /**
     * One clock, injected.
     *
     * <p>Token expiry, lockout windows and rate-limit windows are all time-dependent, and
     * a test that has to wait fifteen real minutes to prove a token expired is a test
     * nobody runs. Two clocks are one clock — blueprint §5.4.
     */
    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter(AccountsProperties properties) {
        CorsConfiguration cors = new CorsConfiguration();
        /* "null" is in the allowed list on purpose: it is the literal Origin header a page
           opened from file:// sends, and these sites are meant to work from file://. */
        cors.setAllowedOrigins(properties.allowedOrigins());
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        cors.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cors);

        var registration = new FilterRegistrationBean<>(new CorsFilter(source));
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }

    @Bean
    public FilterRegistrationBean<RateLimitFilter> rateLimitRegistration(RateLimitFilter filter) {
        var registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 10);
        return registration;
    }

    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtRegistration(JwtAuthFilter filter) {
        var registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 20);
        return registration;
    }
}
