package it.fonderia.ordini.app.infrastructure.outbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * The stand-in broker: it logs.
 *
 * <p>Covered in: course/module-26-messaging-and-the-outbox/README.md
 */
@Component
public class LoggingEventPublisher implements EventPublisher {

    private static final Logger log = LoggerFactory.getLogger(LoggingEventPublisher.class);

    @Override
    public void publish(String key, String eventType, String payload) {
        log.info("published event type={} key={} payload={}", eventType, key, payload);
    }
}
