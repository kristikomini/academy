package it.fonderia.ordini.domain;

import java.util.List;
import java.util.Optional;

/**
 * How the domain asks for orders to be stored and found.
 *
 * <p><b>The interface lives here, the implementation does not.</b> That is the whole
 * of dependency inversion in one file: the domain declares what it needs, and the
 * outer layer supplies it. The arrow of dependency points inwards — `ordini-app`
 * knows about `ordini-domain`, and never the reverse.
 *
 * <p>The practical test of whether that is real rather than aspirational: this
 * interface mentions no framework, no SQL, no annotations, and it compiles in a module
 * whose classpath contains JUnit and nothing else. An interface that has quietly
 * acquired a `@Repository` or a `Pageable` has stopped being a port and become a
 * description of the database.
 *
 * <p><b>Why it returns {@code Optional} and not {@code null}.</b> "There might be no
 * such order" is part of the signature, so no caller can forget it. Note the
 * distinction from {@link Result}: {@code Optional} says there might be nothing,
 * {@code Result} says there might be nothing <em>and here is why</em>. A lookup has no
 * interesting "why" — the id was not there — so {@code Optional} is right. An
 * operation that can be refused for a reason the user needs to hear is a
 * {@code Result}.
 *
 * <p>Covered in: course/module-14-dependency-injection/README.md
 */
public interface OrderRepository {

    /** The order with this id, if there is one. */
    Optional<Order> findById(OrderId id);

    /**
     * Stores the order.
     *
     * <p>Deliberately one method rather than {@code insert} and {@code update}: the
     * caller has an aggregate and wants it saved, and making it decide which SQL verb
     * applies would be the persistence layer's job leaking upwards.
     */
    void save(Order order);

    /**
     * Every order for one customer, newest first.
     *
     * <p>A list, and therefore the operation that makes fetching strategy matter. One
     * aggregate loaded by id is one query whatever you do; twenty aggregates in a list
     * is one query or twenty-one, depending on a decision made in the adapter. Module 24
     * is about that decision.
     */
    List<Order> findByCustomer(CustomerId customer);

    /** How many orders are stored. Small, and useful to assert against in a test. */
    long count();
}
