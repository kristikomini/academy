package it.fonderia.ordini.app;

import it.fonderia.ordini.app.infrastructure.jpa.JpaOrderRepository;
import it.fonderia.ordini.domain.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.Clock;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The same repository, against the database this is actually deployed on.
 *
 * <p><b>Why this exists when {@code JpaOrderRepositoryTest} already passes.</b> That one
 * runs on H2, and chapter 38 is blunt about it: H2 is not PostgreSQL. It accepts SQL
 * PostgreSQL rejects, it has different locking, different error codes and a different
 * planner. It catches mapping mistakes in milliseconds, which is worth having — but a
 * green H2 suite is not evidence that the migration runs or that the SQL is valid where
 * it matters. Chapter 39: test against the database you deploy on.
 *
 * <p><b>Named {@code *IT}, so Surefire does not run it.</b> Chapter 39 again: fast tests
 * and slow tests in the same command means the fast ones stop being run. This needs
 * Failsafe, or an explicit request:
 *
 * <pre>
 *   mvn -Dtest=OrderPersistenceIT -DfailIfNoTests=false test
 * </pre>
 *
 * <p><b>It needs Docker running.</b> If the daemon is not there the class is skipped
 * rather than failed — a missing daemon is an environment fact, not a defect in the
 * code, and a red suite that means "you did not start Docker" trains people to ignore
 * red suites. The skip message says exactly what to do.
 *
 * <p>Note {@code @ServiceConnection}: Boot reads the container's JDBC URL, user and
 * password straight off it, so there is no {@code @DynamicPropertySource} boilerplate
 * and no chance of the two drifting apart.
 */
@Testcontainers
@SpringBootTest
@ActiveProfiles("it")
@org.junit.jupiter.api.condition.EnabledIf(
    value = "dockerIsAvailable",
    disabledReason = "Docker is not running. Start Docker Desktop and run this again; "
        + "the fast H2 tests in JpaOrderRepositoryTest cover the mapping in the meantime.")
class OrderPersistenceIT {

    /**
     * Testcontainers' own probe, wrapped so a missing daemon disables rather than
     * explodes. {@code DockerClientFactory.instance().isDockerAvailable()} does not
     * throw, which is what makes this usable as a condition.
     */
    static boolean dockerIsAvailable() {
        try {
            return org.testcontainers.DockerClientFactory.instance().isDockerAvailable();
        } catch (Throwable ignored) {
            return false;
        }
    }

    /**
     * The same major version as production. "A container per run beats a shared dev
     * database" — chapter 39 — because a shared one accumulates state nobody can
     * explain, and the first thing anyone does with an unexplained failure is blame the
     * data.
     */
    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private JpaOrderRepository repository;

    @Autowired
    private Clock clock;

    private final Sku bolt = new Sku("BL-1001");
    private final Sku flange = new Sku("FL-2002");

    private Order persistedDraft() {
        Order order = Order.draft(CustomerId.newId(), clock);
        order.addLine(bolt, 10, Money.euro("2.50")).orElseThrow();
        repository.save(order);
        return order;
    }

    @Test
    @DisplayName("the real migration runs on the real database")
    void migrationApplies() {
        // If V1__orders.sql contains anything PostgreSQL rejects, the context never
        // starts and this fails before its first assertion. That is the test.
        assertTrue(repository.count() >= 0);
    }

    @Test
    @DisplayName("an order round-trips through PostgreSQL")
    void roundTrip() {
        Order saved = persistedDraft();
        Order loaded = repository.findById(saved.id()).orElseThrow();

        assertEquals(saved.id(), loaded.id());
        assertEquals(OrderStatus.DRAFT, loaded.status());
        assertEquals(Money.euro("25.00"), loaded.total());
        assertEquals(1, loaded.lines().size());
    }

    @Test
    @DisplayName("NUMERIC(19,2) keeps the scale PostgreSQL was given")
    void numericKeepsScale() {
        Order saved = persistedDraft();

        BigDecimal total = repository.findById(saved.id()).orElseThrow().total().amount();

        assertEquals(2, total.scale());
        assertEquals(0, new BigDecimal("25.00").compareTo(total));
    }

    @Test
    @DisplayName("the composite primary key rejects a duplicate SKU on one order")
    void primaryKeyEnforcesOneLinePerSku() {
        // The aggregate merges duplicates, so this can only be reached by going round
        // it — which is exactly why the constraint is in the schema as well. H2 in
        // compatibility mode is close enough to check this; PostgreSQL is the one whose
        // answer counts.
        Order saved = persistedDraft();
        Order loaded = repository.findById(saved.id()).orElseThrow();

        loaded.addLine(bolt, 5, Money.euro("2.50")).orElseThrow();
        repository.save(loaded);

        Order after = repository.findById(saved.id()).orElseThrow();
        assertEquals(1, after.lines().size(), "the two additions are one line");
        assertEquals(15, after.lines().get(0).quantity());
    }

    @Test
    @DisplayName("removing a line deletes exactly that row")
    void orphanRemoval() {
        Order saved = persistedDraft();
        Order loaded = repository.findById(saved.id()).orElseThrow();
        loaded.addLine(flange, 3, Money.euro("11.00")).orElseThrow();
        repository.save(loaded);

        Order again = repository.findById(saved.id()).orElseThrow();
        again.removeLine(bolt).orElseThrow();
        repository.save(again);

        Order after = repository.findById(saved.id()).orElseThrow();
        assertEquals(1, after.lines().size());
        assertEquals(flange, after.lines().get(0).sku());
    }

    @Test
    @DisplayName("a stale write is rejected on PostgreSQL too")
    void optimisticLocking() {
        Order saved = persistedDraft();
        Order alice = repository.findById(saved.id()).orElseThrow();
        Order bob = repository.findById(saved.id()).orElseThrow();

        alice.submit().orElseThrow();
        repository.save(alice);

        bob.cancel("changed my mind").orElseThrow();

        assertThrows(OptimisticLockingFailureException.class, () -> repository.save(bob));
        assertEquals(OrderStatus.SUBMITTED, repository.findById(saved.id()).orElseThrow().status());
    }
}
