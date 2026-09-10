package it.fonderia.ordini.app;

import it.fonderia.ordini.app.application.OrderService;
import it.fonderia.ordini.app.config.OrdiniProperties;
import it.fonderia.ordini.domain.OrderRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import java.time.Clock;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The one test that boots the whole application.
 *
 * <p>Chapter 38's rule is slices over {@code @SpringBootTest}, and this is the
 * exception that earns its keep: a context-loads test catches the wiring mistakes no
 * slice can — a bean that two configurations both define, a @ConfigurationProperties
 * class nothing scans, a circular dependency. It is worth one slow test.
 *
 * <p>Note what it does <em>not</em> do: exercise behaviour. That is the slices' job.
 * A codebase where every test is {@code @SpringBootTest} pays this start-up cost
 * hundreds of times and ends up with a suite nobody runs before pushing.
 */
@SpringBootTest
class OrdiniApplicationTests {

    @Autowired
    private ApplicationContext context;

    @Test
    @DisplayName("the context loads and the graph is complete")
    void contextLoads() {
        assertNotNull(context.getBean(OrderService.class));
        assertNotNull(context.getBean(OrderRepository.class));
        assertNotNull(context.getBean(Clock.class));
        assertNotNull(context.getBean(OrdiniProperties.class));
    }

    @Test
    @DisplayName("beans are singletons by default, and the same instance is injected everywhere")
    void singletonIsTheDefaultScope() {
        // Chapter 11: singleton is the default scope, which is why a bean holding
        // mutable per-request state is a bug that only appears under concurrency.
        assertSame(context.getBean(OrderService.class), context.getBean(OrderService.class));
    }

    @Test
    @DisplayName("src/test/resources/application.yaml shadows the main one")
    void testResourcesWinOverMainResources() {
        // Both files are called application.yaml and both are on the classpath; the
        // test one comes first, so this reads "test" and not the "local" in
        // src/main/resources. That is the same later-sources-win rule from module 15,
        // applied to the classpath rather than to the environment — and it is worth a
        // test, because a value silently overridden in tests is how a configuration bug
        // reaches production green.
        OrdiniProperties props = context.getBean(OrdiniProperties.class);
        assertEquals("test", props.environmentName());
        assertEquals(100, props.maxPageSize());
    }
}
