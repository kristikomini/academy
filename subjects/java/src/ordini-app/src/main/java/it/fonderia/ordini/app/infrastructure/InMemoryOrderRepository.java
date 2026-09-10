package it.fonderia.ordini.app.infrastructure;

import it.fonderia.ordini.domain.CustomerId;
import it.fonderia.ordini.domain.Order;
import it.fonderia.ordini.domain.OrderId;
import it.fonderia.ordini.domain.OrderRepository;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * The adapter, in memory, until modules 21–25 replace it with JPA.
 *
 * <p>It is here to prove the port works and to let the web tier be built and tested
 * before there is a database — not as a suggestion that this is how to store orders.
 * The honest limitation is stated rather than hidden: <b>this map does not implement
 * optimistic concurrency.</b> It stores the object by reference, so two callers
 * holding the same {@link Order} see each other's changes immediately and no version
 * check ever runs. A real repository compares the version on write and reports a
 * conflict. Module 23 is where that becomes true.
 *
 * <p>{@link ConcurrentHashMap} rather than a synchronised map, per chapter 04: it is
 * the right structure for a shared map, and the class-level lock the alternative takes
 * would serialise every request in the application.
 *
 * <p>Covered in: course/module-14-dependency-injection/README.md
 */
@Repository
public class InMemoryOrderRepository implements OrderRepository {

    private final Map<OrderId, Order> byId = new ConcurrentHashMap<>();

    @Override
    public Optional<Order> findById(OrderId id) {
        return Optional.ofNullable(byId.get(id));
    }

    @Override
    public void save(Order order) {
        byId.put(order.id(), order);
    }

    @Override
    public List<Order> findByCustomer(CustomerId customer) {
        return byId.values().stream()
            .filter(order -> order.customerId().equals(customer))
            .sorted(Comparator.comparing(Order::lastChangedAt).reversed())
            .toList();
    }

    @Override
    public long count() {
        return byId.size();
    }
}
