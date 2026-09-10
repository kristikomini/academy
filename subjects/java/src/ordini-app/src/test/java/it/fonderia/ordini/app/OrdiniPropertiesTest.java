package it.fonderia.ordini.app;

import it.fonderia.ordini.app.config.OrdiniProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.env.SystemEnvironmentPropertySource;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Configuration binding, and the failure it is supposed to cause.
 *
 * <p>{@link ApplicationContextRunner} builds a tiny context per test with the property
 * values it is given, so this runs in milliseconds and needs no application. It is the
 * right tool for testing configuration and auto-configuration, and it is worth knowing
 * about — most people reach for {@code @SpringBootTest} and pay a second per case.
 *
 * <p>The point being proved is chapter 13's: with {@code @ConfigurationProperties} and
 * {@code @Validated}, bad configuration stops the application from starting. That is
 * the whole argument over {@code @Value}, where a missing or nonsensical value is
 * discovered by the first request that happens to need it.
 */
class OrdiniPropertiesTest {

    private final ApplicationContextRunner runner = new ApplicationContextRunner()
        .withConfiguration(org.springframework.boot.autoconfigure.AutoConfigurations
            .of(ConfigurationPropertiesAutoConfiguration.class))
        .withUserConfiguration(EnableProperties.class);

    @Configuration
    @EnableConfigurationProperties(OrdiniProperties.class)
    static class EnableProperties {
    }

    @Test
    @DisplayName("valid properties bind to the record")
    void bindsToTheRecord() {
        runner.withPropertyValues("ordini.environment-name=collaudo", "ordini.max-page-size=50")
            .run(context -> {
                assertThat(context).hasNotFailed();
                OrdiniProperties props = context.getBean(OrdiniProperties.class);
                assertThat(props.environmentName()).isEqualTo("collaudo");
                assertThat(props.maxPageSize()).isEqualTo(50);
            });
    }

    @Test
    @DisplayName("kebab-case and camelCase bind to the same property")
    void relaxedBindingWithinAPropertySource() {
        runner.withPropertyValues("ordini.environmentName=collaudo", "ordini.max-page-size=10")
            .run(context -> assertThat(context.getBean(OrdiniProperties.class).environmentName())
                .isEqualTo("collaudo"));
    }

    @Test
    @DisplayName("ORDINI_ENVIRONMENTNAME binds — but only from a system-environment source")
    void relaxedBindingFromTheEnvironment() {
        // This is the form a container supplies, and it is what makes "one artefact,
        // many environments" work without a rebuild.
        //
        // The subtlety, which cost this test a rewrite: SCREAMING_SNAKE_CASE is not a
        // spelling the binder accepts from just any property source. It is decoded by
        // SystemEnvironmentPropertySource specifically, because only there is the
        // mangling known to be the operating system's rather than the author's. Adding
        // "ORDINI_ENVIRONMENTNAME=x" through withPropertyValues() binds nothing at all,
        // and the context fails to start on the missing @NotBlank — which is a
        // confusing way to learn the rule.
        runner.withInitializer(context -> context.getEnvironment().getPropertySources()
                .addFirst(new SystemEnvironmentPropertySource(
                    StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,
                    Map.of("ORDINI_ENVIRONMENTNAME", "produzione",
                           "ORDINI_MAXPAGESIZE", "25"))))
            .run(context -> {
                assertThat(context).hasNotFailed();
                OrdiniProperties props = context.getBean(OrdiniProperties.class);
                assertThat(props.environmentName()).isEqualTo("produzione");
                assertThat(props.maxPageSize()).isEqualTo(25);
            });
    }

    @Test
    @DisplayName("a value outside the allowed range stops the context from starting")
    void invalidValueFailsFast() {
        runner.withPropertyValues("ordini.environment-name=local", "ordini.max-page-size=100000")
            .run(context -> assertThat(context)
                .hasFailed()
                .getFailure()
                // The offending field is named in the root cause, not in the top-level
                // "Could not bind properties to 'OrdiniProperties'" message — so assert
                // on the whole trace, or the test passes for the wrong binding failure.
                .hasStackTraceContaining("maxPageSize"));
    }

    @Test
    @DisplayName("a missing required value stops the context from starting")
    void missingValueFailsFast() {
        runner.withPropertyValues("ordini.max-page-size=50")
            .run(context -> assertThat(context).hasFailed());
    }
}
