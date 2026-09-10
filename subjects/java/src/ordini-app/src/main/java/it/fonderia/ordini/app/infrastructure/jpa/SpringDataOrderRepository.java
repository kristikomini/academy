package it.fonderia.ordini.app.infrastructure.jpa;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data, doing the boring half.
 *
 * <p>Note the layering: this interface is <em>not</em> the domain's port. The domain
 * asks for {@link it.fonderia.ordini.domain.OrderRepository}, and
 * {@link JpaOrderRepository} implements it using this. Letting Spring Data's interface
 * be the port would put {@code JpaRepository}, {@code Pageable} and the entity type
 * into the domain, which is the leak the whole arrangement exists to prevent.
 *
 * <p><b>Derived queries are parsed at start-up.</b> Chapter 24: a method name Spring
 * Data cannot parse fails when the context builds, not on the first call — which is one
 * of the few places in this stack where a mistake is caught early and loudly.
 *
 * <p>Covered in: course/module-22-jpa-and-hibernate/README.md
 */
public interface SpringDataOrderRepository extends JpaRepository<OrderEntity, UUID> {

    /**
     * The one query that needs the lines, saying so.
     *
     * <p>{@code @EntityGraph} makes this a single SELECT with a join instead of one for
     * the order and one for its lines. It is the per-query fetching decision chapter 26
     * argues for — the alternative, EAGER on the mapping, would pay this cost on every
     * read in the application including the ones below that never touch the collection.
     */
    @EntityGraph(attributePaths = "lines")
    @Query("select o from OrderEntity o where o.id = :id")
    Optional<OrderEntity> findWithLinesById(@Param("id") UUID id);

    /**
     * A derived query, with no fetching instruction. <b>This one causes an N+1</b> the
     * moment a caller touches {@code getLines()} on the results: one SELECT for the
     * orders, then one per order for its lines.
     *
     * <p>It is kept — not deleted — because module 24 needs something to measure, and
     * because this is precisely the shape N+1 arrives in: a perfectly reasonable query
     * that becomes twenty-one queries somewhere else entirely, in the code that reads
     * the result.
     */
    List<OrderEntity> findByCustomerIdOrderByLastChangedAtDesc(UUID customerId);

    /**
     * The same list, in one query.
     *
     * <p>{@code @EntityGraph} tells Hibernate to join the lines in. Chapter 26's rule —
     * the fetching decision belongs to the query that knows what it needs, not to the
     * mapping — and {@code NPlusOneTest} measures the difference rather than asserting
     * it.
     */
    @EntityGraph(attributePaths = "lines")
    List<OrderEntity> findAllByCustomerIdOrderByLastChangedAtDesc(UUID customerId);
}
