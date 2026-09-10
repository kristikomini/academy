package it.fonderia.ordini.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

/**
 * The clock, as a bean.
 *
 * <p>Chapter 37's rule — inject a {@link Clock} — needs somewhere for the real one to
 * come from. This is it, and it is the smallest useful example of the other half of
 * chapter 11: {@code @Bean} in a {@code @Configuration} class is for types you do not
 * own and therefore cannot annotate. You cannot put {@code @Component} on
 * {@code java.time.Clock}.
 *
 * <p>The payoff appears in the tests: a {@code @TestConfiguration} supplying
 * {@code Clock.fixed(...)} replaces this one, and every timestamp in the application
 * becomes deterministic without a single mock.
 *
 * <p>Covered in: course/module-13-the-spring-container/README.md
 */
@Configuration
public class ClockConfig {

    @Bean
    public Clock clock() {
        // UTC, not the system zone. A server's zone is an accident of where it was
        // provisioned, and letting it into timestamps is how two replicas disagree
        // about what time an order was submitted.
        return Clock.systemUTC();
    }
}
