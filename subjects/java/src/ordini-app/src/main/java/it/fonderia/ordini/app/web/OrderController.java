package it.fonderia.ordini.app.web;

import it.fonderia.ordini.app.application.OrderService;
import it.fonderia.ordini.app.web.OrderDtos.*;
import it.fonderia.ordini.domain.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.function.Supplier;

/**
 * The web edge. Thin, on purpose.
 *
 * <p>Chapter 16's rule: a controller binds and validates input, calls one thing, and
 * shapes the output. It holds no business rules — every {@code if} about what an order
 * may do lives in {@link Order}. The test of whether that held is whether you could
 * add a second delivery mechanism (a message consumer, a scheduled job) without
 * copying anything out of this file.
 *
 * <p><b>Nouns in the path, verbs from HTTP</b> — except where the verb is a domain
 * transition rather than a CRUD operation. {@code POST /orders/{id}/submit} is not
 * REST purism, and it is the right call: "submit" is a state transition with its own
 * rules, not an update to a field, and modelling it as {@code PATCH {"status":
 * "SUBMITTED"}} would invite clients to invent transitions the machine does not allow.
 *
 * <p><b>Domain failures are not thrown.</b> The service returns a {@link Result} and
 * this class turns it into a response. Throwing here to be caught by an advice would
 * undo the argument module 12 makes: an expected outcome should not travel by
 * exception just because the framework offers a convenient place to catch one.
 *
 * <p>Covered in: course/module-17-the-request-cycle/README.md
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        CustomerId customer = CustomerId.parse(request.customerId());
        return OrderResponse.from(orders.createDraft(customer));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        return respond(() -> orders.find(OrderId.parse(id)));
    }

    @PostMapping("/{id}/lines")
    public ResponseEntity<?> addLine(@PathVariable String id, @Valid @RequestBody AddLineRequest request) {
        return respond(() -> orders.addLine(
            OrderId.parse(id),
            new Sku(request.sku()),
            request.quantity(),
            new Money(new BigDecimal(request.unitPrice()), Money.EUR)));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submit(@PathVariable String id) {
        return respond(() -> orders.submit(OrderId.parse(id)));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String id) {
        return respond(() -> orders.confirm(OrderId.parse(id)));
    }

    @PostMapping("/{id}/ship")
    public ResponseEntity<?> ship(@PathVariable String id, @Valid @RequestBody ShipRequest request) {
        return respond(() -> orders.ship(OrderId.parse(id), request.tracking()));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id, @Valid @RequestBody CancelRequest request) {
        return respond(() -> orders.cancel(OrderId.parse(id), request.reason()));
    }

    /**
     * One place turns a {@link Result} into a response, so no endpoint can invent its
     * own status code for the same failure.
     */
    private ResponseEntity<?> respond(Supplier<Result<Order>> action) {
        Result<Order> outcome = action.get();
        return switch (outcome) {
            case Result.Ok<Order> ok -> ResponseEntity.ok(OrderResponse.from(ok.value()));
            case Result.Err<Order> err -> ResponseEntity
                .status(FailureStatus.statusFor(err.failure()))
                .body(FailureStatus.problem(err.failure()));
        };
    }
}
