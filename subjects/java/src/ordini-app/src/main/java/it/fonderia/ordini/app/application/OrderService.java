package it.fonderia.ordini.app.application;

import it.fonderia.ordini.domain.*;
import org.springframework.stereotype.Service;

import java.time.Clock;

/**
 * The application service: one method per thing a user can do.
 *
 * <p><b>Constructor injection, and no {@code @Autowired}.</b> Since Spring 4.3 a class
 * with a single constructor needs no annotation — the container works it out. Chapter
 * 12's rule, and the reasons are worth having ready: the fields can be {@code final},
 * the object cannot exist half-built, and a test constructs it with {@code new} and no
 * reflection at all. {@code OrderServiceTest} does exactly that.
 *
 * <p><b>The long-constructor argument.</b> Field injection hides how many
 * collaborators a class has; a constructor with eight parameters is ugly on purpose,
 * because the class is doing eight things. That visibility is the feature, and losing
 * it is the real cost of {@code @Autowired} on fields.
 *
 * <p><b>This class is thin, deliberately.</b> It orchestrates — load, call the
 * aggregate, save — and holds no rules of its own. Every business decision lives in
 * {@link Order}. When a service starts growing {@code if (order.status() == ...)} the
 * rule has escaped the aggregate, and the next copy of it will disagree.
 *
 * <p>Covered in: course/module-14-dependency-injection/README.md
 */
@Service
public class OrderService {

    private final OrderRepository orders;
    private final Clock clock;

    public OrderService(OrderRepository orders, Clock clock) {
        this.orders = orders;
        this.clock = clock;
    }

    public Order createDraft(CustomerId customer) {
        Order order = Order.draft(customer, clock);
        orders.save(order);
        return order;
    }

    public Result<Order> addLine(OrderId id, Sku sku, int quantity, Money unitPrice) {
        return withOrder(id, order -> order.addLine(sku, quantity, unitPrice));
    }

    public Result<Order> submit(OrderId id) {
        return withOrder(id, Order::submit);
    }

    public Result<Order> confirm(OrderId id) {
        return withOrder(id, Order::confirm);
    }

    public Result<Order> ship(OrderId id, String tracking) {
        return withOrder(id, order -> order.ship(tracking));
    }

    public Result<Order> cancel(OrderId id, String reason) {
        return withOrder(id, order -> order.cancel(reason));
    }

    public Result<Order> find(OrderId id) {
        return orders.findById(id)
            .map(Result::ok)
            .orElseGet(() -> notFound(id));
    }

    /**
     * Load, act, save — and save only when the aggregate said yes.
     *
     * <p>The {@code isOk()} check is the interesting line. Without it a refused
     * operation would still write the row, bumping the version and, once there is a
     * real database underneath, invalidating another session's optimistic lock for a
     * change that never happened.
     */
    private Result<Order> withOrder(OrderId id, java.util.function.Function<Order, Result<Order>> action) {
        return orders.findById(id)
            .map(order -> {
                Result<Order> outcome = action.apply(order);
                if (outcome.isOk()) {
                    orders.save(order);
                }
                return outcome;
            })
            .orElseGet(() -> notFound(id));
    }

    private Result<Order> notFound(OrderId id) {
        return Result.err("order.not-found", "No order with id " + id + ".");
    }
}
