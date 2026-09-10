package it.fonderia.ordini.app;

import it.fonderia.ordini.app.application.OrderService;
import it.fonderia.ordini.app.infrastructure.InMemoryOrderRepository;
import it.fonderia.ordini.app.web.OrderController;
import it.fonderia.ordini.domain.CustomerId;
import it.fonderia.ordini.domain.OrderRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * The web tier, as a slice.
 *
 * <p>{@code @WebMvcTest} starts the MVC infrastructure — routing, binding, validation,
 * Jackson, the {@code @RestControllerAdvice} — and nothing else. No database, no
 * embedded server, no component scan of the whole application. Chapter 38's rule:
 * slices over {@code @SpringBootTest}, because a suite that boots everything for every
 * test becomes a suite people stop running.
 *
 * <p><b>No mocks.</b> The collaborators below are the real service over the real
 * in-memory repository, with a fixed clock. Chapter 37 prefers state verification, and
 * the difference shows: these tests assert on the JSON that came back, so they would
 * catch a controller wired to a service that never saves. A mocked service would let
 * that pass.
 */
@WebMvcTest(OrderController.class)
@Import(OrderControllerTest.RealCollaborators.class)
class OrderControllerTest {

    private static final Instant T0 = Instant.parse("2026-03-14T09:15:00Z");

    @Autowired
    private MockMvc mvc;

    /**
     * A slice does not scan {@code @Service} or {@code @Repository}, so the graph is
     * assembled here instead. Note that this is only possible because those classes
     * take their dependencies through constructors — with field injection there would
     * be no way to build one outside a container.
     */
    @TestConfiguration
    static class RealCollaborators {

        @Bean
        Clock clock() {
            return Clock.fixed(T0, ZoneOffset.UTC);
        }

        @Bean
        OrderRepository orderRepository() {
            return new InMemoryOrderRepository();
        }

        @Bean
        OrderService orderService(OrderRepository repository, Clock clock) {
            return new OrderService(repository, clock);
        }
    }

    private String createOrder() throws Exception {
        MvcResult result = mvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"customerId\":\"" + CustomerId.newId() + "\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("DRAFT"))
            .andReturn();

        return com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), "$.id");
    }

    @Test
    @DisplayName("creating an order returns 201 and the created resource")
    void createReturns201() throws Exception {
        createOrder();
    }

    @Test
    @DisplayName("the response is a DTO, not the entity — no internal fields leak")
    void responseIsADto() throws Exception {
        String id = createOrder();

        mvc.perform(get("/api/orders/" + id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.total").value("0.00"))
            .andExpect(jsonPath("$.currency").value("EUR"))
            // Fields the aggregate has that the wire type deliberately does not.
            .andExpect(jsonPath("$.pendingEvents").doesNotExist())
            .andExpect(jsonPath("$.cancellationReason").doesNotExist());
    }

    @Test
    @DisplayName("money crosses the wire as a decimal string, never a JSON number")
    void moneyIsAString() throws Exception {
        String id = createOrder();

        mvc.perform(post("/api/orders/" + id + "/lines")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"BL-1001\",\"quantity\":10,\"unitPrice\":\"2.50\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.total").value("25.00"))
            .andExpect(jsonPath("$.lines[0].lineTotal").value("25.00"));
    }

    @Test
    @DisplayName("an illegal transition is 409 with an RFC 7807 body, not 200 with an error")
    void illegalTransitionIs409() throws Exception {
        String id = createOrder();
        mvc.perform(post("/api/orders/" + id + "/lines")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"sku\":\"BL-1001\",\"quantity\":1,\"unitPrice\":\"2.50\"}"));
        mvc.perform(post("/api/orders/" + id + "/submit")).andExpect(status().isOk());

        mvc.perform(post("/api/orders/" + id + "/ship")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"tracking\":\"TNT-1\"}"))
            .andExpect(status().isConflict())
            .andExpect(header().string("Content-Type", "application/problem+json"))
            .andExpect(jsonPath("$.title").value("order.illegal-transition"))
            .andExpect(jsonPath("$.detail").value(org.hamcrest.Matchers.containsString("CONFIRMED")));
    }

    @Test
    @DisplayName("submitting an empty order is 422, not 409 — it parsed, it was just wrong")
    void emptyOrderIs422() throws Exception {
        String id = createOrder();

        mvc.perform(post("/api/orders/" + id + "/submit"))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$.title").value("order.empty"));
    }

    @Test
    @DisplayName("an unknown order is 404")
    void unknownOrderIs404() throws Exception {
        mvc.perform(get("/api/orders/" + java.util.UUID.randomUUID()))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.title").value("order.not-found"));
    }

    @Test
    @DisplayName("a validation failure is 400 and names the field")
    void validationIs400() throws Exception {
        String id = createOrder();

        mvc.perform(post("/api/orders/" + id + "/lines")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"BL-1001\",\"quantity\":0,\"unitPrice\":\"2.50\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.title").value("validation.failed"))
            .andExpect(jsonPath("$.errors.quantity").value("quantity must be positive"));
    }

    @Test
    @DisplayName("a malformed id is 400 with the value object's own message")
    void malformedIdIs400() throws Exception {
        mvc.perform(get("/api/orders/not-a-uuid"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.detail").value(org.hamcrest.Matchers.containsString("Not a valid order id")));
    }

    @Test
    @DisplayName("malformed JSON is a 400, not a 500")
    void malformedJsonIs400() throws Exception {
        mvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"customerId\": "))
            .andExpect(status().isBadRequest());
    }
}
