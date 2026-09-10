/* ==========================================================================
   quizzes-2.js — the question bank, part 2.

   Split across three files only so each stays editable. All three merge into
   one map keyed by chapter id.

   THE RULE THAT IS NOT NEGOTIABLE:
   A question's id is "<chapter-id>#<index>", and the index is its position in
   this array. That id is the key a learner's spaced-repetition schedule is
   stored under. APPEND ONLY. Never reorder, never delete. Reordering silently
   reassigns somebody's review history to the wrong questions, and nothing will
   tell you it happened. quiz-ids.lock exists to catch exactly this.

   `why` is shown on CORRECT answers too. Feedback that only appears on failure
   teaches people to guess and check.

   Every stem must stand alone two weeks later, out of context — each question
   doubles as a flashcard. "Which of these is true?" is a bad stem for that
   reason; name the subject.
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {

  /* ------------------------------------------------------- 16-idempotent-consumers --- */
  "16-idempotent-consumers": [
    { q: "What makes an operation idempotent?",
      a: ["It always succeeds", "Performing it twice leaves the world in the same state as performing it once", "It can be rolled back", "It runs inside a transaction"],
      c: 1,
      why: "'Set the status to PAID' is idempotent; 'add 10 to the balance' is not. Reformulating a handler from a delta to a state assignment is often the entire fix, and it costs nothing at runtime." },

    { q: "What is the cheapest form of consumer idempotency?",
      a: ["A deduplication table keyed by event id", "An upsert keyed by a business identifier, so repeating the operation changes nothing", "A distributed lock per key", "Exactly-once transactions"],
      c: 1,
      why: "You get it from the operation's shape rather than from extra machinery. Explicit deduplication is what you reach for when the operation genuinely cannot be reshaped." },

    { q: "Why is checking whether an event id has been seen, and then acting, incorrect?",
      a: ["The check is too slow", "It is a race: two concurrent deliveries both read 'not seen' and both act", "Event ids are not unique across partitions", "The check cannot be done inside a transaction"],
      c: 1,
      why: "Insert the id under a unique constraint in the same transaction as the work, and treat the violation as 'already done'. The database is the only component that can arbitrate." },

    { q: "What must share a transaction for explicit deduplication to be correct?",
      a: ["The Kafka offset commit and the database write", "The insert of the event id and the business work, in the consumer's own database", "The producer send and the consumer commit", "The read of the dedup table and the offset commit"],
      c: 1,
      why: "One local transaction, arbitrated by a unique constraint. Kafka's offset commit cannot join it, which is why at-least-once plus idempotency is the practical design." },

    { q: "Why must a deduplication store be bounded in time?",
      a: ["Because unique constraints degrade with size", "Duplicates arise from retries and rebalances and arrive within minutes, so retaining ids forever is a slow-motion outage", "Because Kafka expires event ids after seven days", "Because the table cannot be indexed beyond a certain size"],
      c: 1,
      why: "Keep processed ids for a window comfortably longer than your worst redelivery, a few days being generous, and delete older rows on a schedule." },

    { q: "Your handler calls an external HTTP API that is not idempotent. What is the remedy?",
      a: ["Wrap the call in your local transaction", "Push idempotency to that system with an idempotency key, since your transaction cannot cover it", "Retry until it succeeds", "Use Kafka transactions"],
      c: 1,
      why: "A local transaction can only protect local state. The remote effect needs the remote system to deduplicate, which is the same pattern as REST idempotency keys." },

    { q: "Why is idempotent at-least-once usually preferred over Kafka's exactly-once?",
      a: ["It is easier to configure", "It is what production actually runs: exactly-once only covers Kafka-to-Kafka, and most consumers write somewhere else", "Exactly-once is deprecated", "It gives higher throughput in every case"],
      c: 1,
      why: "Being able to design an idempotent handler is a stronger signal than being able to define exactly-once, because it is the one that survives contact with a database." },

    { q: "A handler both writes to its database and produces to Kafka. Which problem does it now have?",
      a: ["Reordering", "The dual-write problem: two systems with no shared transaction, so one can succeed alone", "Excessive lag", "Schema incompatibility"],
      c: 1,
      why: "Idempotency does not solve it, because the failure is that the event was never published at all. That is the outbox pattern in chapter 39." },
  ],

  /* ------------------------------------------------------- 17-transactions --- */
  "17-transactions": [
    { q: "What does a Kafka transactional producer make atomic?",
      a: ["Writes to Kafka and to an external database", "Several Kafka writes together with the consumer's offset commit", "Only writes within a single partition", "The producer's batch and its retries"],
      c: 1,
      why: "sendOffsetsToTransaction puts the offset commit into the producer's transaction, so either the downstream records exist and the position moved, or neither happened." },

    { q: "What is the transactional.id used for?",
      a: ["Correlating records across topics", "Fencing a previous producer instance with the same id, so a zombie cannot commit after a replacement takes over", "Naming the transaction in the logs", "Partitioning transactional records"],
      c: 1,
      why: "That fencing is what makes the guarantee hold across restarts rather than only within one process lifetime." },

    { q: "What happens to records from an aborted Kafka transaction?",
      a: ["They are removed from the log", "They are written to the log but marked aborted, and never delivered to a read-committed consumer", "They are moved to a dead-letter topic", "They are retained but compacted away immediately"],
      c: 1,
      why: "Which is why isolation.level matters on the consumer: the default, read_uncommitted, delivers them like any other record." },

    { q: "A team sets up transactional producers carefully but sees no benefit. What is the most likely omission?",
      a: ["The transactional.id was not unique", "The consumers were left on the default isolation.level=read_uncommitted", "The topics were not compacted", "acks was not set to all"],
      c: 1,
      why: "It is a common and embarrassing configuration miss: the producer side is correct and the consumer never opts in, so the whole arrangement quietly does nothing." },

    { q: "What is the effect of a long-running or hung Kafka transaction on consumers?",
      a: ["Nothing; they skip uncommitted records", "Read-committed consumers stall on that partition, because they cannot read past an open transaction without breaking ordering", "They receive the records and must filter them", "They are disconnected by the broker"],
      c: 1,
      why: "transaction.timeout.ms bounds the damage. Keep transactions short, for the same reason as database transactions." },

    { q: "Which pattern are Kafka transactions designed for?",
      a: ["Write-behind caching", "Consume-transform-produce: read from one topic, transform, write to another, and record how far you have read, atomically", "Request-response over two topics", "Fan-out to many consumer groups"],
      c: 1,
      why: "Kafka Streams enables it with one setting because its topologies are exactly that shape by construction." },

    { q: "Can a distributed transaction span Kafka and an Oracle database?",
      a: ["Yes, using XA", "No: Kafka transactions are atomic across Kafka partitions and the offset topic, and nothing else", "Yes, if both use the same transaction coordinator", "Only with Kafka Connect"],
      c: 1,
      why: "If your handler writes to a database, the atomic unit you need is the database's own transaction plus deduplication, or the outbox pattern." },

    { q: "What do Kafka transactions cost?",
      a: ["Nothing measurable", "Extra coordination round trips, a transaction marker per partition, and higher end-to-end latency because consumers wait for commits", "Twice the disk space", "Loss of ordering guarantees"],
      c: 1,
      why: "Which is why they are most often worth it inside Streams, where the whole topology is Kafka-to-Kafka and the alternative is hand-rolled state management." },
  ],

  /* ------------------------------------------------------- 18-ordering --- */
  "18-ordering": [
    { q: "What is the precise statement of Kafka's ordering guarantee?",
      a: ["Records are ordered across a topic by timestamp", "Records within a partition are read in the order they were written; across partitions there is no order", "Records are ordered per consumer group", "Records are ordered per producer"],
      c: 1,
      why: "Since the key chooses the partition, ordering is really per key, and the size of the guarantee is the size of the key." },

    { q: "What does a design requiring total ordering across a topic actually require?",
      a: ["A higher replication factor", "One partition, therefore one consumer, and a throughput ceiling", "Transactional producers", "A single producer instance"],
      c: 1,
      why: "The right question is whether they need total order or only order per entity, and the answer is almost always the second." },

    { q: "Kafka delivered records in order and your consumer processed them out of order. What is the likely cause?",
      a: ["Offsets were committed asynchronously", "The batch was handed to a worker pool, so records from one partition were processed concurrently", "The producer used a null key", "The partition leader changed mid-batch"],
      c: 1,
      why: "If you need parallelism and ordering, partition the work by key across your workers so all records for one key go to the same worker." },

    { q: "Why do retry topics break ordering, and when does that matter?",
      a: ["They reorder only if the retry delay is long", "A record that fails and is republished is processed later than records that came after it, which corrupts a status lifecycle", "They do not; retry topics preserve order", "Only if the retry topic has a different partition count"],
      c: 1,
      why: "Applying 'shipped' before 'paid' for the same order is the concrete failure. If ordering matters for a key, failure has to block that key rather than being deferred past it." },

    { q: "Which technique makes late or out-of-order arrival harmless?",
      a: ["Increasing the consumer's fetch size", "Carrying a version or timestamp in the event and ignoring anything older than the state you already hold", "Enabling exactly-once semantics", "Reducing the partition count to one"],
      c: 1,
      why: "A last-write-wins guard turns an ordering requirement into a data property. Combined with sending state rather than deltas, it removes the dependency on arrival order." },

    { q: "Why is sending state preferable to sending deltas in an event payload?",
      a: ["State payloads are smaller", "'The status is now SHIPPED, version 4' is safe to apply in any order relative to version 3; 'advance the status' is not", "Deltas cannot be serialised with Avro", "State payloads compress better"],
      c: 1,
      why: "It is the same property that makes a handler idempotent, which is why the two design rules reinforce each other." },

    { q: "A null key means what for ordering?",
      a: ["Ordering by arrival time at the broker", "There was never a guarantee to lose, since records are spread across partitions", "Ordering within the producer's batch only", "Global ordering, since no partitioning applies"],
      c: 1,
      why: "Fine for independent telemetry, wrong for anything with a lifecycle. The key is the first question to ask about any topic design." },

    { q: "Which answer moves an interview conversation from 'how do I force ordering' to a stronger place?",
      a: ["Use a single partition and accept the ceiling", "Design so ordering is not required: version the events and make handlers idempotent", "Use transactions to serialise writes", "Increase max.in.flight to preserve batch order"],
      c: 1,
      why: "It is the design most distributed systems arrive at anyway, and proposing it unprompted signals experience rather than recall." },
  ],

  /* ------------------------------------------------------- 19-serialization --- */
  "19-serialization": [
    { q: "What does a Kafka broker know about the format of your records?",
      a: ["It validates them against the topic's schema", "Nothing: key and value are byte arrays as far as the broker is concerned", "It infers the format from the first record", "It requires a registered serialiser per topic"],
      c: 1,
      why: "That is why the broker is fast and why nothing validates your data. The mismatch is discovered by the consumer, later, at deserialisation time." },

    { q: "What is the main cost of JSON as a Kafka payload format?",
      a: ["It cannot represent nested structures", "It repeats every field name in every record, and carries no schema unless you add one", "It cannot be compressed", "Consumers must parse it twice"],
      c: 1,
      why: "The verbosity compresses away reasonably well but never stops costing CPU. For a high-volume topic with many consumers, Avro or Protobuf is usually the better trade." },

    { q: "What is Avro's particular strength for Kafka?",
      a: ["The smallest possible payloads", "Schema-first design with resolution between writer and reader schemas, which is built for evolution", "Human readability", "Native support in every language without a library"],
      c: 1,
      why: "A reader with a newer schema can read older data when new fields have defaults, and a reader with an older schema can ignore unknown fields. Protobuf is comparable with slightly different evolution semantics." },

    { q: "What is a poison pill in a Kafka consumer?",
      a: ["A message that causes the broker to crash", "A record that cannot be deserialised, so the consumer throws, restarts, reads the same offset and throws again", "A message with an expired timestamp", "A record larger than the fetch size"],
      c: 1,
      why: "It has no queue equivalent, because in a queue the bad message can be rejected individually. Here the partition stops until somebody intervenes." },

    { q: "Why can a consumer not simply skip a record it cannot deserialise?",
      a: ["The broker forbids it", "Skipping means committing an offset for a record it never processed, which is a decision the client must be told to make", "The offset is not known until deserialisation succeeds", "It can, by default"],
      c: 1,
      why: "An ErrorHandlingDeserializer plus a DeadLetterPublishingRecoverer is how you say 'set this aside and continue' explicitly, rather than losing records silently." },

    { q: "Which Spring Kafka component prevents a poison pill from blocking a partition?",
      a: ["A custom Partitioner", "ErrorHandlingDeserializer wrapping the real deserialiser, with a DefaultErrorHandler routing to a dead-letter topic", "A RetryTemplate around the listener", "Setting isolation.level to read_committed"],
      c: 1,
      why: "Configure it before you need it. The day you need it, the partition is already stopped and the backlog is already growing." },

    { q: "Should a deserialisation failure be retried?",
      a: ["Yes, with exponential backoff", "No: it will fail identically forever, so it should go straight to the dead-letter topic", "Yes, three times, then skipped", "Only if the schema registry was unreachable"],
      c: 1,
      why: "addNotRetryableExceptions(DeserializationException.class) is the explicit way to say so. Retrying is a loop rather than a recovery." },

    { q: "Where does the schema live when using Avro with the Confluent serialiser?",
      a: ["Embedded in every record", "In the registry, with only a five-byte magic byte and schema id on the wire", "In the topic's configuration", "In the consumer's local cache only"],
      c: 1,
      why: "That is why the overhead is five bytes rather than a repeated schema, and why reading an Avro topic with a plain string consumer shows leading rubbish." },
  ],

  /* ------------------------------------------------------- 20-schema-registry --- */
  "20-schema-registry": [
    { q: "What is the primary value of a schema registry?",
      a: ["It reduces payload size", "It refuses a schema registration that violates the subject's compatibility rule, so the error appears in the producer's pipeline", "It validates every record as it passes through the broker", "It stores the messages alongside their schemas"],
      c: 1,
      why: "Without it, an incompatible change is discovered by a consumer at three in the morning. The refusal is the entire point." },

    { q: "Under what subject name is a topic's value schema registered by default?",
      a: ["the topic name", "topicName-value", "value-topicName", "the schema's fully qualified class name"],
      c: 1,
      why: "Keys use topicName-key. Other subject naming strategies exist for cases where one topic carries several record types." },

    { q: "What does the Confluent wire format put in front of the payload?",
      a: ["The full schema, compressed", "One magic byte and a four-byte schema id", "A checksum of the schema", "The subject name as a string"],
      c: 1,
      why: "Five bytes rather than a repeated schema, and clients cache schemas by id so the registry is not on the hot path. It is also why reading an Avro topic with a plain string consumer shows leading rubbish." },

    { q: "Is the schema registry on the hot path for every record?",
      a: ["Yes, every record triggers a lookup", "No: clients cache by id, but it is on the start-up path, so an unreachable registry means a consumer that cannot decode anything", "Only for producers", "Only when the schema changes"],
      c: 1,
      why: "It belongs in your availability planning as a dependency, even though it costs nothing per record once warm." },

    { q: "Why should auto.register.schemas be turned off in production?",
      a: ["It slows down the producer", "It lets any producer, including a developer laptop, register a new version on the fly, so compatibility rules are enforced against whatever ran last", "It duplicates schemas across subjects", "It prevents schema deletion"],
      c: 1,
      why: "Register schemas through your pipeline instead, so the check happens where it can fail a build rather than where it can surprise a consumer." },

    { q: "What makes adding a field to an Avro schema a safe change?",
      a: ["Adding fields is always safe", "Giving the new field a default, so readers using the older schema and newer schema can both resolve it", "Adding it at the end of the record", "Registering it under a new subject"],
      c: 1,
      why: "Forgetting the default is the most common evolution mistake, and it turns an addition into a breaking change." },

    { q: "How should a field rename be handled in an event schema?",
      a: ["Rename it and bump the schema version", "Add the new field, write both, migrate readers, then remove the old field in a later release", "Rename it and set compatibility to NONE temporarily", "Create a new topic with the corrected name"],
      c: 1,
      why: "A rename is a delete plus an add. It is the same expand-and-contract discipline as a database column migration, for exactly the same reason." },

    { q: "Is the Confluent Schema Registry part of Apache Kafka?",
      a: ["Yes, it ships with the broker", "No: it is a Confluent component under its own licence, which is why alternatives such as Apicurio exist", "Yes, since Kafka 3.0", "It is part of Kafka Connect"],
      c: 1,
      why: "A distinction that matters commercially in some organisations, and one worth stating precisely when asked what you have used." },
  ],

  /* ------------------------------------------------------- 21-compatibility --- */
  "21-compatibility": [
    { q: "What does BACKWARD compatibility mean in a schema registry?",
      a: ["An old consumer can read data written with the new schema", "A consumer using the new schema can read data written with the previous one", "Both directions are guaranteed", "Old data is migrated to the new schema"],
      c: 1,
      why: "Under BACKWARD you may delete a field or add an optional one with a default. The names are easy to state backwards, which is why defining them precisely is worth the effort." },

    { q: "What does FORWARD compatibility permit?",
      a: ["A consumer on the new schema reading old data", "A consumer on the old schema reading data written with the new one, so you may add a field or delete an optional one", "Any change, since readers ignore unknown fields", "Only additive changes with defaults"],
      c: 1,
      why: "FULL is both, so only fully optional changes are allowed. Choosing between them is really choosing your deployment order." },

    { q: "Under BACKWARD compatibility, which side do you deploy first?",
      a: ["Producers, then consumers", "Consumers, because they can read both old and new data", "Either order; compatibility makes it irrelevant", "Both simultaneously"],
      c: 1,
      why: "Getting the order wrong shows up as consumers unable to deserialise records produced in the last few minutes, which is a confusing symptom for a deployment-sequence cause." },

    { q: "What do the _TRANSITIVE compatibility variants add?",
      a: ["Checking against the immediately preceding version only", "Checking against all previous versions, not just the last one", "Automatic migration of stored records", "Compatibility across different subjects"],
      c: 1,
      why: "Without it, three individually compatible changes can leave you unable to read data from two versions ago, which is precisely the data still sitting in a topic with 30-day retention." },

    { q: "Why is a field rename rejected under FULL compatibility?",
      a: ["Renames are forbidden by Avro", "Because it is a delete plus an add, and a delete breaks forward compatibility while an add without a default breaks backward", "Because the subject name would change", "Because the schema id would be reused"],
      c: 1,
      why: "Under BACKWARD it passes and breaks old consumers that are still running, which is worse than being rejected." },

    { q: "Where should compatibility be configured?",
      a: ["Globally, for consistency", "Per subject, stricter the more consumers a topic has", "Per consumer group", "Per broker"],
      c: 1,
      why: "A topic consumed by three teams deserves FULL_TRANSITIVE; an internal topic with one consumer you deploy together can be more relaxed." },

    { q: "Where should the compatibility check run?",
      a: ["In the consumer, at start-up", "In CI, so an incompatible change fails the producer's build with the offending field named", "In the broker, on every produce", "Manually, before each release"],
      c: 1,
      why: "The error then belongs to the producer's pipeline rather than the consumer's night. The Maven and Gradle registry plugins exist for exactly this." },

    { q: "Which evolution mistake can no tooling catch for you?",
      a: ["Adding a field without a default", "Reusing an existing field name for a different meaning: the schema is compatible and the data is now wrong", "Deleting a required field", "Changing a field's type"],
      c: 1,
      why: "The registry validates structure, not semantics. Never reuse a field name for a new purpose, and treat it as a rename instead." },
  ],

  /* ------------------------------------------------------- 22-retention-compaction --- */
  "22-retention-compaction": [
    { q: "What is the default retention period for a Kafka topic?",
      a: ["24 hours", "seven days", "30 days", "unlimited"],
      c: 1,
      why: "Set it from the replay window you actually want rather than from a default. If a new consumer must rebuild state from the beginning, retention has to cover the whole history, or you need compaction." },

    { q: "At what granularity does Kafka delete retained data?",
      a: ["Per record", "Per segment file, so a record can outlive its nominal retention until its segment is eligible", "Per partition", "Per batch"],
      c: 1,
      why: "That is why retention is cheap: deleting a whole file rather than rewriting a log to remove individual records." },

    { q: "What does cleanup.policy=compact guarantee?",
      a: ["Every record is retained forever", "At least the most recent value per key is retained", "Records are compressed on disk", "Duplicate payloads are removed"],
      c: 1,
      why: "It turns a topic into a current-state table keyed by message key, which is the mechanism behind __consumer_offsets, KTables and Streams changelog topics." },

    { q: "What is a tombstone in a compacted Kafka topic?",
      a: ["A record with an expired timestamp", "A record with a null value, marking that key as deleted", "A marker written at the end of a segment", "A record from an aborted transaction"],
      c: 1,
      why: "It is retained for delete.retention.ms so consumers have time to see the deletion before it disappears. It is also the only way to remove a key's data, which matters for GDPR." },

    { q: "Why is a compacted topic a poor audit trail?",
      a: ["It cannot be replayed", "It guarantees the latest value per key, not every intermediate value, so history is lost silently", "It is not durable", "Tombstones corrupt the ordering"],
      c: 1,
      why: "A consumer reading it from the beginning gets a valid snapshot of current state rather than the full sequence of events. Using it as an audit log loses exactly what an audit needs." },

    { q: "What does cleanup.policy=compact,delete do?",
      a: ["Compacts, then deletes the topic", "Keeps the latest value per key, but also drops anything older than the retention window", "Deletes tombstones only", "Compacts only the closed segments"],
      c: 1,
      why: "It bounds a compacted topic in time as well as by key, which is useful when the key space grows without limit." },

    { q: "Why is GDPR erasure difficult on a Kafka topic?",
      a: ["Kafka encrypts records at rest", "You cannot delete a single record, so personal data must live in a compacted topic where a tombstone can remove it, or not go in the log at all", "Retention cannot be shortened after creation", "Replication copies records to other regions"],
      c: 1,
      why: "Raising it unprompted is a strong signal in a public-administration or banking interview, where it is a genuine constraint rather than a theoretical one." },

    { q: "What does tiered storage change about long retention?",
      a: ["It compresses old segments more aggressively", "Older segments move to object storage while remaining readable, so retention stops being a broker-sizing problem", "It replicates old data to a second cluster", "It converts old segments into a compacted form"],
      c: 1,
      why: "Reads from the tier are slower, so it suits replay and backfill rather than live consumption. It changes 'can we keep everything' from 'not affordably' to 'yes, with a latency caveat'." },
  ],

  /* ------------------------------------------------------- 23-streams-intro --- */
  "23-streams-intro": [
    { q: "What is Kafka Streams?",
      a: ["A separate cluster you submit jobs to", "A Java library that runs inside your application, with no extra infrastructure to deploy", "A broker plugin", "A SQL engine over Kafka topics"],
      c: 1,
      why: "That is the main difference from Flink or Spark. You deploy it like any other Spring Boot service, and coordination happens through Kafka's own consumer group protocol." },

    { q: "What are the sources and sinks of a Kafka Streams topology?",
      a: ["Any JDBC or HTTP endpoint", "Kafka topics only", "Kafka topics and state stores", "Whatever the configured connector supports"],
      c: 1,
      why: "If you need to read from a database or write to Elasticsearch as part of the job, that is Kafka Connect or a different tool. Streams is Kafka-to-Kafka by construction." },

    { q: "What does topology.describe() give you before deploying?",
      a: ["The estimated throughput", "The whole processor graph, including the internal repartition and changelog topics Streams will create", "A list of the input partitions", "The serialisation formats in use"],
      c: 1,
      why: "Reading it is a genuinely useful habit: it shows where an accidental repartition is about to cost you a full extra round trip through Kafka." },

    { q: "How is parallelism derived in a Kafka Streams application?",
      a: ["From num.stream.threads alone", "One task per partition of the sub-topology's input, distributed across threads and instances", "From the number of state stores", "From the number of application instances"],
      c: 1,
      why: "So maximum parallelism is the partition count of the input topics, and a Streams application scales no further than the topics it reads." },

    { q: "What is application.id in Kafka Streams?",
      a: ["A display name in the logs", "The consumer group id, which also prefixes every internal topic Streams creates", "The client id for metrics", "The name of the output topic"],
      c: 1,
      why: "It must be unique per application and stable. Changing it orphans the old state and starts from nothing, which is occasionally what you want and usually an accident." },

    { q: "When is Kafka Streams a better choice than a plain consumer?",
      a: ["Whenever the topic has more than one partition", "When the work is stateful and stays inside Kafka: aggregations, joins, windowing", "Whenever exactly-once is required", "For any high-throughput workload"],
      c: 1,
      why: "With a plain consumer you manage state and its recovery yourself. Streams gives you local state stores with changelog topics, so recovery is already solved." },

    { q: "How do Kafka Streams instances coordinate work between themselves?",
      a: ["Through a ZooKeeper ensemble", "Through Kafka's consumer group protocol, so adding an instance rebalances tasks", "Through a shared database", "Through direct peer-to-peer connections"],
      c: 1,
      why: "Which means everything about rebalancing from chapter 13 applies, and is why cooperative rebalancing and standby replicas matter so much for stateful topologies." },

    { q: "Which Streams setting turns on exactly-once processing?",
      a: ["enable.idempotence=true", "processing.guarantee=exactly_once_v2", "isolation.level=read_committed", "transactional.id set on the producer"],
      c: 1,
      why: "It is where Kafka transactions most often genuinely pay off, because a Streams topology is consume-transform-produce by construction." },
  ],

  /* ------------------------------------------------------- 24-ktable-kstream --- */
  "24-ktable-kstream": [
    { q: "What is the difference between a KStream and a KTable?",
      a: ["A KStream is bounded and a KTable is unbounded", "A KStream is a record stream of independent facts; a KTable is a changelog where a later record for the same key replaces the earlier one", "A KStream is in memory and a KTable is on disk", "A KStream is keyed and a KTable is not"],
      c: 1,
      why: "It is the same relationship as a bank statement and a balance: neither is more real, and each can be derived from the other." },

    { q: "Reading a compacted topic as a KTable is an example of what?",
      a: ["Log replay", "Stream-table duality made concrete: the topic keeps the latest value per key and the table materialises it", "Interactive querying", "Windowed aggregation"],
      c: 1,
      why: "The reverse also holds: a table changing over time emits a stream of updates, which is what a database changelog and Debezium are." },

    { q: "Which should model 'customer address' in a Streams topology?",
      a: ["A KStream, since each change is an event", "A KTable, since two records for one key are one thing updated", "A GlobalKTable, always", "A windowed KStream"],
      c: 1,
      why: "Ask whether two records for one key both happened or are one thing that changed. Two payments are two events; two addresses are one address, updated." },

    { q: "What goes wrong if you aggregate a KTable's updates as though they were events?",
      a: ["A compile error", "Double counting, because the aggregate must subtract the old value and add the new one", "The state store grows without bound", "Ordering is lost"],
      c: 1,
      why: "Streams does the subtraction automatically when you aggregate a table and not when you aggregate a stream. Choosing the wrong abstraction gives a total that is quietly too large." },

    { q: "What is distinctive about a GlobalKTable?",
      a: ["It is stored on the brokers rather than locally", "Every instance replicates every partition, so it needs no co-partitioning and does not scale with your data", "It is read-only", "It supports windowed joins"],
      c: 1,
      why: "Right for small, slow-moving reference data such as currency codes. Wrong for anything large, where it silently multiplies your memory footprint by the number of instances." },

    { q: "What does co-partitioning require for a Kafka Streams join?",
      a: ["The same serialisation format on both sides", "The same key, the same partition count and the same partitioning strategy", "Both topics on the same broker", "Both topics compacted"],
      c: 1,
      why: "Task n holds partition n of both sides and cannot see any other. A mismatched partition count fails at start-up; a different key silently inserts a repartition topic." },

    { q: "What is the cost of a repartition topic that Streams inserts automatically?",
      a: ["Extra memory on the instance", "A full extra round trip through Kafka: the data is written back and re-read", "Loss of exactly-once semantics", "The join becomes windowed"],
      c: 1,
      why: "topology.describe() shows it as a KSTREAM-REPARTITION node. Keying the input correctly in the first place removes it." },

    { q: "Which join type requires a window, and why?",
      a: ["Stream-table, because the table changes", "Stream-stream, because you must decide how long to wait for the other side to arrive", "Table-table, because both sides are unbounded", "None; windows are always optional"],
      c: 1,
      why: "Stream-table joins are the common enrichment case and need no window, because the table always has a current value to look up." },
  ],

  /* ------------------------------------------------------- 25-windowing --- */
  "25-windowing": [
    { q: "What is the difference between event time and processing time?",
      a: ["Event time is UTC; processing time is local", "Event time is when the thing happened; processing time is when your code got round to it", "Event time is set by the broker; processing time by the producer", "They differ only under clock skew"],
      c: 1,
      why: "A phone offline for an hour sends events with an old event time and a new processing time. Which one you count by changes the answer." },

    { q: "Why does Kafka Streams default to event time for windowing?",
      a: ["It is cheaper to compute", "It is what the business means, and it makes reprocessing deterministic: replay the topic and you get the same windows", "Processing time is unavailable in the record", "It avoids the need for a grace period"],
      c: 1,
      why: "'Sales in September' means sales that happened in September, not sales your consumer processed then. Determinism under replay is the strongest technical argument." },

    { q: "Where does the record timestamp come from by default?",
      a: ["The broker, on append", "The producer, as CreateTime, unless the topic is configured for LogAppendTime", "The consumer, on poll", "The schema registry"],
      c: 1,
      why: "A custom TimestampExtractor lets you take it from a field in the payload, which is usually the most honest source when the event carries its own occurrence time." },

    { q: "Which window type is closed by a gap of inactivity rather than by the clock?",
      a: ["Tumbling", "Hopping", "Sliding", "Session"],
      c: 3,
      why: "It is the natural fit for user activity, because it defines the window from behaviour rather than by an arbitrary boundary." },

    { q: "What is the cost of a one-hour hopping window advancing every minute?",
      a: ["It cannot be expressed in Streams", "Each record contributes to sixty windows, so state size and downstream volume grow accordingly", "Late records are always dropped", "It requires a GlobalKTable"],
      c: 1,
      why: "Worth checking before choosing one. Tumbling windows put every record in exactly one window, which is far cheaper when it fits the requirement." },

    { q: "What does a grace period on a window control?",
      a: ["How long the aggregate is retained after emission", "How long the window stays open for late records after its end, before they are dropped", "How long Streams waits before starting the window", "The maximum clock skew tolerated"],
      c: 1,
      why: "It is a direct trade between completeness and latency, and between completeness and memory, since every open window occupies state store space." },

    { q: "Which metric tells you your grace period is too short?",
      a: ["Consumer lag", "A count of records dropped for being too late", "The number of open windows", "State store size"],
      c: 1,
      why: "If it is not zero, your numbers are wrong in a way nothing else will reveal. Emitting that metric is the cheapest correctness check in a streaming application." },

    { q: "A partition stops receiving records. What happens to its open windows in Kafka Streams?",
      a: ["They close after the grace period elapses in wall-clock time", "They never close, because stream time advances from records rather than from the clock", "They are emitted immediately", "They are discarded on the next rebalance"],
      c: 1,
      why: "Results simply stop being emitted for that partition while everything looks healthy. On a low-traffic or unevenly-keyed topic this looks exactly like a bug in your aggregation." },
  ],

  /* ------------------------------------------------------- 26-state-stores --- */
  "26-state-stores": [
    { q: "Where does a Kafka Streams state store keep its data?",
      a: ["In the broker's log", "Locally, in RocksDB on the instance's disk, with an in-memory cache", "In a shared Redis cluster", "In the consumer group's offsets topic"],
      c: 1,
      why: "Local means a disk lookup rather than a network round trip per record, which is what lets Streams handle high throughput with state at all." },

    { q: "How does Kafka Streams make local state durable?",
      a: ["By replicating it to other instances synchronously", "By writing every update to a compacted changelog topic in Kafka", "By snapshotting to object storage", "It does not; state is lost on restart"],
      c: 1,
      why: "Compaction means the changelog is the size of the state rather than the size of its history. Local for speed, changelog for durability, is the whole design." },

    { q: "An instance starts on a new node with an empty disk. What happens before it can process anything?",
      a: ["It processes immediately and rebuilds state lazily", "It replays the entire changelog for its assigned partitions, which can take minutes to hours for large state", "It queries the other instances for their state", "It starts from the current offset with empty state"],
      c: 1,
      why: "It happens exactly when you least want it: during a rolling deploy where every pod gets a new empty volume." },

    { q: "Which three mitigations reduce the cost of state restoration?",
      a: ["Larger heaps, more partitions, and shorter retention", "Persistent volumes, num.standby.replicas, and static membership", "Compaction, compression, and tiered storage", "More stream threads, larger caches, and exactly-once"],
      c: 1,
      why: "Naming those three together is a strong answer, because it is clearly the answer of someone who has operated a Streams application rather than only written one." },

    { q: "What does num.standby.replicas do?",
      a: ["Replicates the changelog topic to another cluster", "Keeps warm copies of the state on other instances, so a failover has somewhere to go without a full restore", "Duplicates each task for redundancy of processing", "Increases the replication factor of internal topics"],
      c: 1,
      why: "It trades memory and disk on the standby instances for a dramatically shorter recovery, which is usually the right trade for anything with meaningful state." },

    { q: "Why can a Kafka Streams application be OOM-killed with a healthy-looking heap?",
      a: ["The JVM reports the heap incorrectly in containers", "RocksDB's block cache and write buffers are off-heap, so they do not appear in heap metrics and are not bounded by -Xmx", "The changelog topic is buffered in the heap", "Standby replicas duplicate the heap"],
      c: 1,
      why: "It is the exit-code-137 problem with a cause that is invisible in every heap dump you take. Size the container for heap plus RocksDB, not heap alone." },

    { q: "What do interactive queries allow?",
      a: ["Running SQL against a Kafka topic", "Reading a state store directly from your application, so a Streams job can serve current state over HTTP", "Querying the broker for aggregate values", "Ad-hoc queries against the changelog"],
      c: 1,
      why: "It can remove a whole read database from some architectures, provided you accept the catch below." },

    { q: "What is the catch with interactive queries?",
      a: ["They are eventually consistent", "State is partitioned across instances, so an instance must either hold the key or forward the request to the one that does", "They can only read, never aggregate", "They bypass exactly-once guarantees"],
      c: 1,
      why: "Streams gives you the metadata to find the right instance; you build the forwarding. That extra hop is why many teams project to a database anyway." },
  ],

  /* ------------------------------------------------------- 27-ksqldb --- */
  "27-ksqldb": [
    { q: "What runs underneath ksqlDB?",
      a: ["A custom streaming engine", "Kafka Streams: the same topologies, state stores and changelogs, expressed as SQL", "Apache Flink", "The broker's own query engine"],
      c: 1,
      why: "CREATE STREAM and CREATE TABLE map exactly onto KStream and KTable, which is why the concepts from chapter 24 transfer directly." },

    { q: "What is the difference between a push and a pull query in ksqlDB?",
      a: ["Push writes, pull reads", "A push query runs continuously and emits each update; a pull query reads current state from a materialised table like a database lookup", "Push is synchronous, pull is asynchronous", "Push queries are limited to one partition"],
      c: 1,
      why: "EMIT CHANGES marks a push query. The distinction matters because one is a streaming job and the other is a request." },

    { q: "What is ksqlDB best at?",
      a: ["Running core production pipelines", "Exploration: finding out what is actually on an unfamiliar topic in seconds, without writing a consumer", "Replacing Kafka Connect", "Managing schemas"],
      c: 1,
      why: "That alone justifies having it in a development environment, and it lowers the barrier for analysts who will not write a Java topology." },

    { q: "What is ksqlDB's most significant weakness for production use?",
      a: ["It cannot join streams", "Testing: there is no equivalent of TopologyTestDriver, so continuous SQL runs in production with no unit tests", "It cannot read Avro", "It requires a separate Kafka cluster"],
      c: 1,
      why: "Complex logic also becomes an unreadable pile of nested queries or a Java UDF, at which point you have written Java anyway with worse tooling." },

    { q: "Why is a ksqlDB query left running in a shared cluster a risk?",
      a: ["It consumes broker memory", "It is a production job with no repository, no review, no test and no owner", "It blocks other queries", "It cannot be stopped once started"],
      c: 1,
      why: "That is how a temporary exploration becomes load-bearing. If a query is going to stay, it belongs in git and in the pipeline like any other code." },

    { q: "When is choosing ksqlDB over Kafka Streams defensible?",
      a: ["For any pipeline, since SQL is simpler", "For simple filtering and enrichment, and for analyst-facing work where lowering the barrier is worth more than the tooling", "Whenever exactly-once is required", "For stateful joins across many topics"],
      c: 1,
      why: "Knowing when a tool is unnecessary is a senior signal, and so is knowing when the cheaper tool is genuinely good enough." },

    { q: "What operational cost does ksqlDB add?",
      a: ["None; it runs inside the brokers", "Another server to run, scale and monitor", "A second Kafka cluster", "A dedicated schema registry"],
      c: 1,
      why: "For a team already deploying Spring services, that may be more cost than the SQL saves, which is a legitimate reason to prefer a Streams application." },

    { q: "Which ksqlDB statement materialises state you can query like a database?",
      a: ["CREATE STREAM ... EMIT CHANGES", "CREATE TABLE ... AS SELECT ... GROUP BY", "INSERT INTO ... VALUES", "CREATE SOURCE CONNECTOR"],
      c: 1,
      why: "A table is keyed current state, so a pull query against it is a lookup. A stream is a sequence of facts, and only a push query makes sense over it." },
  ],

  /* ------------------------------------------------------- 28-connect --- */
  "28-connect": [
    { q: "What is the main argument for a Kafka Connect sink over a hand-written consumer?",
      a: ["It is faster", "Correctness: offset tracking, retries and exact resumption after a crash are already solved", "It requires no configuration", "It supports more data formats"],
      c: 1,
      why: "The version you write in an afternoon usually gets resumption subtly wrong, and the bug appears months later as missing rows." },

    { q: "What is the difference between a source and a sink connector?",
      a: ["Source is streaming, sink is batch", "A source pulls data from elsewhere into Kafka; a sink pushes it from Kafka to somewhere else", "Source runs on the broker, sink on a worker", "Source is push-based, sink is pull-based"],
      c: 1,
      why: "Debezium is a source connector reading a database transaction log; a JDBC sink writes topic records into a table." },

    { q: "Where does Kafka Connect in distributed mode store connector configuration, offsets and status?",
      a: ["In a relational database", "In internal Kafka topics", "On the worker's local disk", "In ZooKeeper"],
      c: 1,
      why: "Workers coordinate through Kafka's own consumer group protocol and redistribute tasks when one dies. Standalone mode is for a laptop." },

    { q: "How is Kafka Connect managed operationally?",
      a: ["By editing files on each worker", "Through a REST API: create, pause, resume, restart and inspect status", "Through the Kafka CLI tools", "Through the schema registry"],
      c: 1,
      why: "Which makes it scriptable, and also means connector configuration is state inside a running cluster, so it belongs in version control and should be applied by your pipeline." },

    { q: "What can a Single Message Transform do?",
      a: ["Join two topics", "Operate on one record at a time: mask a field, extract a nested value, set the key, route by content", "Aggregate over a window", "Deduplicate records"],
      c: 1,
      why: "No joins, no aggregation, no access to other records. Connect moves data; Streams transforms it." },

    { q: "You find yourself chaining six SMTs on a connector. What does that indicate?",
      a: ["The connector is misconfigured", "The logic has outgrown Connect and wants a Streams application or ksqlDB in the middle", "SMTs should be combined into one custom transform", "The source system's schema is wrong"],
      c: 1,
      why: "Source connector into a raw topic, Streams into a clean topic, sink connector out. That division keeps each tool doing what it is good at." },

    { q: "What is the default behaviour of a Connect task when it hits a record it cannot process?",
      a: ["It skips the record and logs a warning", "It fails the task, which stops the connector", "It writes the record to a dead-letter queue", "It retries indefinitely"],
      c: 1,
      why: "Set errors.tolerance and a dead-letter queue deliberately, and monitor connector status: a stopped connector produces no alerts by default, so it fails silently." },

    { q: "Which setting routes unprocessable records to a dead-letter topic in Kafka Connect?",
      a: ["errors.retry.timeout", "errors.deadletterqueue.topic.name, together with errors.tolerance", "errors.log.enable", "consumer.override.auto.offset.reset"],
      c: 1,
      why: "Adding errors.deadletterqueue.context.headers.enable puts the failure reason in the headers, which is what makes the DLQ diagnosable rather than just a bucket." },
  ],

  /* ------------------------------------------------------- 29-cdc-debezium --- */
  "29-cdc-debezium": [
    { q: "What does change data capture read?",
      a: ["A polling query against the table", "The database's own transaction log, such as the MySQL binlog or Oracle LogMiner", "Triggers installed on each table", "The application's audit table"],
      c: 1,
      why: "It emits a record per row change with before and after images and the operation type, without modifying the application at all." },

    { q: "Why is CDC better than polling an updated_at column?",
      a: ["It is easier to configure", "Polling misses deletes entirely and misses intermediate states between polls, and it puts query load on the source database", "Polling cannot be scheduled frequently enough", "CDC guarantees exactly-once delivery"],
      c: 1,
      why: "The log has every change, in commit order, and reading it costs the database almost nothing. That comparison is the answer to 'why not just poll'." },

    { q: "How does Debezium run?",
      a: ["As a broker plugin", "As a Kafka Connect source connector", "As a sidecar next to the database", "As a library inside the application"],
      c: 1,
      why: "Which means everything about Connect's distributed workers, REST management and dead-letter handling applies to it directly." },

    { q: "Why is CDC the usual way Kafka arrives in an established Italian company?",
      a: ["Because it is the cheapest option", "Because it gets events out of a gestionale nobody is allowed to modify, without touching that application", "Because it requires no Kafka expertise", "Because it is mandated by fatturazione elettronica"],
      c: 1,
      why: "It is the only proposal that survives the meeting, and it is also the enabler for the strangler pattern: stream the old system's changes, build the new service as a consumer." },

    { q: "What is the operationally risky part of starting a Debezium connector?",
      a: ["Configuring the topic naming", "The initial snapshot, which reads existing rows before switching to the log and can be very long on a large table", "Registering the schema", "Setting the replication factor"],
      c: 1,
      why: "Incremental snapshotting makes it interruptible and resumable, and is the feature to ask about when someone proposes CDC on a large production table." },

    { q: "What ordering does CDC give you by default?",
      a: ["Global ordering across all tables", "Per row: topic per table, primary key as the message key, so changes to one row are ordered", "Ordering by transaction, across tables", "No ordering guarantee at all"],
      c: 1,
      why: "Cross-table transaction ordering requires consuming the transaction metadata topic, which is a deliberate extra step rather than the default." },

    { q: "Why should raw CDC records not be published directly to downstream consumers?",
      a: ["They are too large", "Every consumer becomes coupled to the legacy database schema, so a column rename breaks them all", "They contain the before image, which is redundant", "They cannot be serialised with Avro"],
      c: 1,
      why: "Put a Streams stage between the raw CDC topic and the topics consumers read: raw in, domain events out, so the legacy schema stops at your boundary." },

    { q: "When the application can be modified, what is usually preferred over plain CDC?",
      a: ["Polling with a change table", "The outbox pattern, so the events published are domain events rather than table rows", "Triggers writing to a queue table", "Dual writes with retries"],
      c: 1,
      why: "Debezium even has a dedicated outbox transform for it. CDC on business tables is the option for systems you genuinely cannot change." },
  ],

  /* ------------------------------------------------------- 30-rest-proxy-clients --- */
  "30-rest-proxy-clients": [
    { q: "What underpins most non-JVM Kafka clients?",
      a: ["A REST proxy", "librdkafka, the C implementation, which is why their configuration vocabulary is shared", "A gRPC gateway", "Independent reimplementations per language"],
      c: 1,
      why: "A configuration answer for confluent-kafka-python usually translates directly to the .NET client, which is useful to know when documentation is Java-first." },

    { q: "Which Kafka capability is JVM-only?",
      a: ["Consumer groups", "Kafka Streams", "Idempotent producers", "Schema registry integration"],
      c: 1,
      why: "A stateful streaming job in Python means a different tool entirely: Flink, Faust, or a plain consumer with your own state management." },

    { q: "For which direction is the Kafka REST Proxy the better fit?",
      a: ["Consuming, since HTTP polling is natural", "Producing, because it is nearly stateless, whereas consuming needs a server-side consumer held between calls", "Both equally", "Neither; it is for administration only"],
      c: 1,
      why: "Consuming over HTTP fights the model: consumer groups and rebalancing become awkward when the consumer lives inside a proxy between polling calls." },

    { q: "What does adding a REST Proxy cost you architecturally?",
      a: ["Schema registry compatibility", "An extra hop that is a single point of failure and a bottleneck, which must be sized, monitored and made redundant", "Exactly-once semantics", "Message ordering"],
      c: 1,
      why: "Reaching for it because HTTP feels simpler than a client library trades a library dependency for an operational one, and the operational one is more expensive." },

    { q: "When is the REST Proxy a legitimate choice?",
      a: ["Whenever the team prefers HTTP", "A language with no good client, a system behind a firewall permitting only HTTP, a browser, or a partner you will not ship a client to", "For all internal services, for uniformity", "For high-throughput ingestion"],
      c: 1,
      why: "Those are cases where the alternative is no integration at all, which is a very different situation from preferring a familiar protocol." },

    { q: "A factory PLC cannot speak the Kafka protocol. What is the standard approach?",
      a: ["Install a Kafka client on the PLC", "A gateway service that subscribes or polls, normalises readings into domain events, and produces them", "Expose Kafka directly on the factory network", "Write the readings to a file the broker reads"],
      c: 1,
      why: "It is the industrial integration pattern from the Java course seen from the Kafka side, and it is exactly what advert 1 describes." },

    { q: "What should a bridge emit to Kafka?",
      a: ["The source system's raw values and identifiers", "Domain events, so no consumer inherits a vendor's register numbers or a partner's CSV column order", "One record per protocol frame", "A single aggregated record per poll cycle"],
      c: 1,
      why: "Translate at the edge. It is the same principle as not exposing database columns as your API, and it is what makes the gateway worth building." },

    { q: "What property must a bridge or gateway have, given it will be restarted mid-stream?",
      a: ["Exactly-once delivery", "Idempotence and resumability, so duplicate readings are harmless and it can continue from where it stopped", "A persistent local queue", "Transactional writes"],
      c: 1,
      why: "It will be restarted mid-file and mid-poll, routinely. Designing for that from the start is much cheaper than discovering it during a production line's night shift." },
  ],

  /* ------------------------------------------------------- 31-confluent-vs-apache --- */
  "31-confluent-vs-apache": [
    { q: "What does Apache Kafka itself include, under the Apache 2.0 licence?",
      a: ["Broker and clients only", "Broker, clients, Kafka Streams and Kafka Connect", "Everything including the Schema Registry", "Broker, Connect and ksqlDB"],
      c: 1,
      why: "The Schema Registry and REST Proxy are Confluent components under the Community License, and ksqlDB and the enterprise features are Confluent's too." },

    { q: "What is Redpanda?",
      a: ["A managed Kafka service", "A wire-compatible reimplementation of the Kafka protocol in C++, with no JVM and no ZooKeeper", "A Kafka monitoring tool", "A fork of Apache Kafka"],
      c: 1,
      why: "Existing clients work unchanged. The trade is a smaller ecosystem and less operational precedent, which matters more than raw benchmark numbers for most teams." },

    { q: "What does a managed Kafka service remove, and what does it not?",
      a: ["It removes all Kafka expertise requirements", "It removes broker operations, not Kafka operations: partition sizing, key design, lag, schema evolution and retention are still yours", "It removes the need for a schema registry", "It removes the need to monitor consumer lag"],
      c: 1,
      why: "Saying that shows you understand where the work actually is, and it is everything this course covers." },

    { q: "How does managed Kafka pricing typically surprise teams migrating from a self-hosted cluster?",
      a: ["Storage is billed per partition", "Egress is billed per gigabyte read, so a topic read by six consumer groups is billed six times", "Brokers are billed per topic", "Schema registrations carry a fee"],
      c: 1,
      why: "Adding another consumer group, or lengthening retention, is free on your own cluster and has a direct monthly cost on a managed one." },

    { q: "Which managed option runs Apache Kafka in your own AWS account, with less managed for you?",
      a: ["Confluent Cloud", "Amazon MSK", "Aiven", "Redpanda Cloud"],
      c: 1,
      why: "Confluent Cloud is the most complete and the most expensive; Aiven and equivalents sit in between and are common in European companies for data-residency reasons." },

    { q: "What does the CCDAK certification cover?",
      a: ["Cluster administration and tuning", "Roughly Parts 1 to 6 of this course: the log, producers and consumers, delivery semantics, Streams basics and schemas", "Kafka Connect and CDC in depth", "Confluent Cloud operations"],
      c: 1,
      why: "Preparing for it forces coverage of the areas people skip, which is a genuine benefit independent of the certificate itself." },

    { q: "For whom is the Confluent certification most worth taking?",
      a: ["Someone with production Kafka experience", "Someone with no Kafka on their CV, as an external signal that gets past a screening filter", "Anyone applying for a senior role", "Nobody; it is never worth the cost"],
      c: 1,
      why: "The adverts list it under 'a completamento del profilo' rather than requisiti, so treat it as a tie-breaker rather than a decisive credential." },

    { q: "Why does it matter that the Schema Registry is not part of Apache Kafka?",
      a: ["It has a different release cycle", "Its licence is a real consideration in some organisations, which is why alternatives such as Apicurio exist", "It cannot be used with Apache Kafka brokers", "It requires Confluent Platform to run"],
      c: 1,
      why: "Stating it precisely when asked what you have used is a small, checkable signal that you know the ecosystem rather than one vendor's packaging of it." },
  ],

});
