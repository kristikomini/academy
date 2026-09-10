package it.fonderia.ordini.app.infrastructure.jpa;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.fonderia.ordini.app.infrastructure.outbox.OutboxEntry;
import it.fonderia.ordini.app.infrastructure.outbox.OutboxPayload;
import it.fonderia.ordini.app.infrastructure.outbox.OutboxRepository;
import it.fonderia.ordini.domain.CustomerId;
import it.fonderia.ordini.domain.DomainEvent;
import it.fonderia.ordini.domain.Order;
import it.fonderia.ordini.domain.OrderId;
import it.fonderia.ordini.domain.OrderRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;
import java.util.Optional;

/**
 * The JPA adapter for the domain's {@link OrderRepository} port.
 *
 * <p><b>The port has not changed.</b> That is the return on having declared it in the
 * domain: swapping an in-memory map for Hibernate, a connection pool and a migrated
 * schema touched nothing above this class. `OrderService` does not know which one it
 * is talking to, and `OrderServiceTest` still runs in milliseconds against the map.
 *
 * <p><b>{@code @Primary}</b> because {@code InMemoryOrderRepository} is still on the
 * classpath and still a bean. Two candidates for one type is an ambiguity the container
 * cannot resolve, and this is module 14's rule applied: the default is marked once
 * rather than every injection point being qualified.
 *
 * <p><b>The transaction boundary is here</b>, at the outermost operation, not around
 * each statement. Chapter 25: keep transactions short, and hold a connection for as
 * little as possible — but a read that loads an aggregate with a lazy collection has to
 * be inside one, or you get {@code LazyInitializationException} when the collection is
 * touched. {@code findById} is {@code readOnly}, which lets Hibernate skip dirty
 * checking on the way out and tells the driver it can use a replica.
 *
 * <p>Covered in: course/module-23-transactions/README.md
 */
@Repository
@Primary
public class JpaOrderRepository implements OrderRepository {

    private final SpringDataOrderRepository rows;
    private final OutboxRepository outbox;
    private final ObjectMapper json;
    private final Clock clock;

    public JpaOrderRepository(SpringDataOrderRepository rows, OutboxRepository outbox,
                              ObjectMapper json, Clock clock) {
        this.rows = rows;
        this.outbox = outbox;
        this.json = json;
        this.clock = clock;
    }

    /**
     * {@code @EntityGraph} on the query, not EAGER on the mapping.
     *
     * <p>Chapter 26's rule. This is the one place that genuinely needs the lines, so
     * this is the place that says so. Making the mapping EAGER instead would load them
     * for every query in the application, including the ones that only wanted a status.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Order> findById(OrderId id) {
        return rows.findWithLinesById(id.value())
            .map(entity -> OrderMapper.toDomain(entity, clock));
    }

    /**
     * Insert or update, decided by whether the row is already there.
     *
     * <p>The {@code findById} first is not free, and it is deliberate: it gives us the
     * managed instance to copy onto, so dirty checking issues an UPDATE with the
     * version check. The alternative — building a detached entity and calling
     * {@code merge} — would need the version carried by hand and would silently do the
     * wrong thing if it were stale.
     */
    @Override
    @Transactional
    public void save(Order order) {
        rows.findWithLinesById(order.id().value())
            .ifPresentOrElse(
                existing -> {
                    /* The version check has to happen here, explicitly.
                     *
                     * Hibernate's own @Version check compares the value it loaded in
                     * THIS transaction — and this method just loaded it, so it is always
                     * current and the check can never fail. Re-reading to get a managed
                     * instance is what makes the framework's protection useless, and it
                     * is a genuinely easy thing to get wrong: the annotation is present,
                     * the column increments, and nothing is actually guarded.
                     *
                     * So compare against the revision the caller's aggregate was loaded
                     * from. If the row has moved on, somebody else wrote in between and
                     * this write is based on a state that no longer exists. */
                    if (existing.getVersion() != order.baseVersion()) {
                        throw new OptimisticLockingFailureException(
                            "Order " + order.id() + " was modified by someone else: expected version "
                                + order.baseVersion() + ", found " + existing.getVersion() + ".");
                    }
                    OrderMapper.copyOnto(order, existing);
                },
                () -> rows.save(OrderMapper.newEntity(order)));

        /* The whole point of the outbox, in one line inside the same @Transactional
         * method: the events and the order commit together or not at all. There is no
         * broker call here — publishing to a broker inside a database transaction is the
         * dual-write bug this exists to avoid. */
        appendEventsToOutbox(order);
    }

    /**
     * Drains the aggregate's events into the outbox table.
     *
     * <p>{@code pullEvents()} drains rather than reads, so a retry of this method cannot
     * write the same event twice — the aggregate owns the "these have been taken" fact
     * because it is the only object that knows.
     */
    private void appendEventsToOutbox(Order order) {
        for (DomainEvent event : order.pullEvents()) {
            outbox.save(new OutboxEntry(
                event.orderId().value(),
                event.getClass().getSimpleName(),
                serialise(event),
                event.occurredAt()));
        }
    }

    private String serialise(DomainEvent event) {
        try {
            return json.writeValueAsString(OutboxPayload.of(event));
        } catch (JsonProcessingException e) {
            /* An event that cannot be serialised is a programming error — a new event
             * type with a component Jackson cannot handle — not a condition any caller
             * can act on. Chapter 08: that is what unchecked exceptions are for. And it
             * must not be swallowed: doing so would commit the order while silently
             * dropping the fact that it changed, which is precisely the outcome the
             * outbox exists to make impossible. */
            throw new IllegalStateException(
                "Cannot serialise " + event.getClass().getSimpleName() + " for the outbox", e);
        }
    }

    /**
     * The list, using the entity-graph query rather than the naive derived one.
     *
     * <p>Both exist on {@code SpringDataOrderRepository}; this picks the one that does
     * not produce an N+1, and {@code NPlusOneTest} keeps the other honest by measuring
     * what it costs.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Order> findByCustomer(CustomerId customer) {
        return rows.findAllByCustomerIdOrderByLastChangedAtDesc(customer.value()).stream()
            .map(entity -> OrderMapper.toDomain(entity, clock))
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return rows.count();
    }
}
