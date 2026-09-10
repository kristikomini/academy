package it.fonderia.ordini.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * The entry point.
 *
 * <p>{@code @SpringBootApplication} is three annotations in a trench coat:
 * {@code @SpringBootConfiguration}, {@code @EnableAutoConfiguration} and
 * {@code @ComponentScan}. The third one is why the position of this class matters —
 * scanning starts at <em>this package</em> and goes down. Move it one package deeper
 * and half the beans below stop being found, with no error other than a
 * NoSuchBeanDefinitionException at start-up that names a symptom rather than a cause.
 *
 * <p>Covered in: course/module-16-boot-and-autoconfiguration/README.md
 */
@SpringBootApplication
@ConfigurationPropertiesScan
// The outbox relay is a @Scheduled method, and @Scheduled does nothing at all without
// this — no error, no warning, just a method that never runs. Worth knowing, because
// "the relay is not publishing" is a confusing thing to debug from the other end.
@EnableScheduling
public class OrdiniApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrdiniApplication.class, args);
    }
}
