package it.fonderia.accounts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * The accounts service.
 *
 * <p>Blueprint §5.1, twice over. For the learner: the site saves everything in the
 * browser, which is fine until you want it on your phone as well. For the portfolio: it
 * is small enough to read in one sitting and contains, in about a dozen files, most of
 * what a junior advert asks about — routing, dependency injection, an ORM, JWT
 * authentication, refresh-token rotation, password hashing, filter order, CORS, rate
 * limiting and optimistic concurrency, every non-obvious decision commented with why.
 *
 * <p>It references nothing else in this repository and nothing references it.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class AccountsApplication {

    public static void main(String[] args) {
        SpringApplication.run(AccountsApplication.class, args);
    }
}
