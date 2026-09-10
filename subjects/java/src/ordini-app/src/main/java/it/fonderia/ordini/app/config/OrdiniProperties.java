package it.fonderia.ordini.app.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Configuration, bound to a record.
 *
 * <p>Chapter 13's rule is {@code @ConfigurationProperties} over {@code @Value}, and
 * binding to a record rather than a bean with setters. Three reasons, in order of how
 * much they matter:
 *
 * <ol>
 *   <li><b>It fails at start-up, not at first use.</b> A missing {@code @Value} is
 *       discovered when the code path that reads it finally runs — which may be a
 *       Tuesday in production. A record that cannot be constructed stops the
 *       application from starting, which is the failure you want.</li>
 *   <li><b>The configuration has a shape.</b> One type lists everything the
 *       application can be told, so "what is configurable?" has an answer you can
 *       read, rather than being the set of all {@code @Value} strings in the
 *       codebase.</li>
 *   <li><b>It is immutable.</b> No setters, so nothing rebinds it at run time.</li>
 * </ol>
 *
 * <p>{@code @Validated} makes the constraints below start-up failures too. Without it
 * the annotations are documentation.
 *
 * <p>Covered in: course/module-15-configuration/README.md
 */
@Validated
@ConfigurationProperties(prefix = "ordini")
public record OrdiniProperties(

    /** Shown in the API's own metadata, so an operator can tell environments apart. */
    @NotBlank String environmentName,

    /**
     * The largest page a client may ask for. Chapter 17's rule that page size is
     * capped server-side: a client that asks for a million rows should get the cap,
     * not a timeout, and the cap belongs in configuration because it is an
     * operational decision rather than a domain one.
     */
    @Min(1) @Max(500) int maxPageSize
) {
}
