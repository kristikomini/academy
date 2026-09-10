/* ==========================================================================
   quizzes-1.js — the question bank, part 1.

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

  /* ------------------------------------------------------- 00-the-job-posting --- */
  "00-the-job-posting": [
    { q: "What did phase 1 of this course find when it collected Kafka postings for Emilia-Romagna and Milano?",
      a: ["A healthy market of dedicated Kafka roles", "No standalone Kafka job at all: every Kafka line came from a Java or backend advert", "That Kafka appears only in data-engineering roles", "That RabbitMQ is requested more often"],
      c: 1,
      why: "Companies hire a Java backend developer and list Kafka among the things that developer must know. This course prepares you for one line of the job you were already applying for." },

    { q: "Why do 29 of this subject's 46 chapters carry an 'extra' rather than a 'req'?",
      a: ["The chapters are optional", "The adverts name the tool and stop, so most of what the work turns on was never written down in a posting", "The manifest has not been finished", "They duplicate chapters in the Java subject"],
      c: 1,
      why: "No advert mentions partitions, offsets, consumer groups, delivery semantics or replication. That gap between the word and the work is what the course exists to fill, and the home page splits the two lists so the claim stays checkable." },

    { q: "What separates candidates who list Kafka from those who can defend it?",
      a: ["Knowing the configuration property names", "Being able to answer the follow-ups: what happens when a consumer is slow, what guarantees you actually have, how you would reprocess yesterday", "Having a Confluent certification", "Having used Kafka Streams rather than a plain consumer"],
      c: 1,
      why: "Almost everyone who lists Kafka has sent a message and watched it arrive. The highest-value chapters here are offsets, rebalancing, delivery semantics, idempotent consumers and the outbox, and none of them is named in an advert." },

    { q: "What is the honest claim this course supports on a CV?",
      a: ["Production experience operating a Kafka cluster", "Understanding the model and having built producers and consumers against a local cluster", "Expertise in Kafka Streams and Connect at scale", "Certification-level knowledge of the whole ecosystem"],
      c: 1,
      why: "Kafka is unusually easy to list and unusually hard to defend, because the interviewer is often the person who runs it. Naming your own boundary is what makes the rest of your claims credible." },

    { q: "Which Milano posting quotes a specific RAL, and what is it?",
      a: ["Sinergidea, 45 to 50k", "Esprimo, 35 to 38k under CCNL Metalmeccanico", "The remote backend role, 30 to 35k", "None of them quote a figure"],
      c: 1,
      why: "It is a useful reference point for a mid-level Milano backend role, and it is the kind of concrete detail worth having before the first phone call." },

    { q: "One posting asks for 'Familiarity with Kafka tools such as Kafka Streams, Connect, and Zookeeper'. What should you notice about that line?",
      a: ["It is a complete list of the ecosystem", "It is already dated, since Kafka 4.0 removed ZooKeeper entirely", "Streams and Connect are the same component", "It implies the company uses Confluent Cloud"],
      c: 1,
      why: "Answering in the past tense about ZooKeeper, and asking whether they have migrated to KRaft, turns the advert's line into information about them." },

    { q: "Why is this subject deliberately separate from the Java academy, against the advert evidence?",
      a: ["Because the two markets do not overlap", "So that Kafka is treated as a system with its own model, rather than as one chapter at the back of a Spring course", "Because Kafka questions appear in different interviews", "To keep each subject under fifty chapters"],
      c: 1,
      why: "The cost is real: two manifests quote overlapping advert lines and a reader doing both meets Spring twice. What it buys is that partitions, offsets and delivery semantics get the space they need to be reasoned about." },

    { q: "Which chapter pair is deliberately kept from converging between the two subjects?",
      a: ["Kafka 23 and Java 30", "Kafka 41 (Spring Kafka) and Java 33 (messaging from inside a Spring application)", "Kafka 34 and Java 20", "Kafka 12 and Java 25"],
      c: 1,
      why: "There, messaging is one option seen from inside a Spring app; here, Spring is one client seen from inside the broker's model. If those two chapters start describing the same thing, one should be deleted." },
  ],

  /* ------------------------------------------------------- 01-why-a-log --- */
  "01-why-a-log": [
    { q: "What is the single idea everything else in Kafka follows from?",
      a: ["Messages are replicated across brokers", "An append-only log that each reader tracks its own position in", "Producers and consumers are decoupled by a broker", "Messages are stored in memory for speed"],
      c: 1,
      why: "Partitions, offsets, consumer groups, replay and every delivery guarantee are consequences of that sentence rather than separate features to memorise." },

    { q: "How does Kafka differ from a traditional message queue in what the broker tracks?",
      a: ["Kafka tracks delivery per consumer more precisely", "Kafka tracks almost nothing about consumers; each consumer stores its own position", "Kafka tracks acknowledgements per message", "Both track the same state, stored differently"],
      c: 1,
      why: "In a traditional broker, delivery is destructive and the broker removes consumed messages. Kafka retains records for a configured time or size and lets readers move their own bookmark." },

    { q: "Which capability does the log model give you that a queue cannot?",
      a: ["Higher throughput", "Replay: moving a position back and reprocessing history", "Per-message priority", "Guaranteed exactly-once delivery"],
      c: 1,
      why: "It is how you rebuild a downstream projection after finding a bug, and it is the main reason companies choose Kafka. A log you never replay is a queue with extra disk." },

    { q: "Why can several independent consumers read the same Kafka topic without coordinating?",
      a: ["The broker duplicates each message per consumer", "Reading is not destroying, so each consumer group simply tracks its own offsets", "Consumers lock the partition while reading", "The broker fans out to registered subscribers"],
      c: 1,
      why: "Adding a second service that needs the same events costs nothing and requires no change to the producer. That is the decoupling the model buys." },

    { q: "Why is Kafka fast?",
      a: ["It keeps all messages in memory", "It does less: sequential appends, the OS page cache, zero-copy transfer and aggressive batching", "It compresses every message individually", "It uses a custom binary protocol over UDP"],
      c: 1,
      why: "No per-message index, no per-consumer state, no in-place deletion. Appending sequentially and reading sequentially from an offset is the one thing disks and page caches are best at." },

    { q: "A consumer falls behind in Kafka. What happens to the producer?",
      a: ["It is back-pressured until the consumer catches up", "Nothing: the consumer is only falling behind a position in the log", "The broker buffers messages in memory for that consumer", "The broker rejects new writes for that topic"],
      c: 1,
      why: "Slow consumers do not affect producers, which is a direct consequence of consumers owning their own offsets. In a queue, an unconsumed backlog is the broker's problem." },

    { q: "Which capability is Kafka a poor fit for?",
      a: ["Event streams read by several services", "Per-message routing by attribute, per-message priority, and delayed delivery", "High-throughput ingestion", "Reprocessing historical data"],
      c: 1,
      why: "Kafka can be bent into those shapes and the result is uncomfortable. If you need each job delivered to exactly one worker with a retry count and a dead-letter queue, that is a queue." },

    { q: "A candidate describes Kafka as 'a message queue'. Why does that answer cost them?",
      a: ["It is a terminology error with no practical consequence", "It signals they have not understood the model, and everything that follows from it: replay, multiple consumers, per-consumer offsets", "Queues are considered outdated technology", "It implies they have only used RabbitMQ"],
      c: 1,
      why: "The interviewer's real question is whether you can reason about the consequences. Using it as a queue in practice, one topic per consumer with a single partition, has the same tell." },
  ],

  /* ------------------------------------------------------- 02-topics-partitions --- */
  "02-topics-partitions": [
    { q: "What is the relationship between a Kafka topic and a partition?",
      a: ["A topic is a partition with a name", "A topic is a logical name for a set of partitions, and each partition is a separate append-only log", "A partition is a replica of the topic", "A topic contains one partition per consumer"],
      c: 1,
      why: "Partitions are distributed across brokers, which is how a topic scales beyond one machine. Each holds an ordered sequence of records with monotonically increasing offsets." },

    { q: "Where does Kafka guarantee ordering?",
      a: ["Across the whole topic", "Within a partition, and nowhere else", "Within a consumer group", "Across all topics sharing a key"],
      c: 1,
      why: "There is no global order across a topic and there cannot be, since partitions live on different brokers and are written concurrently. Expecting one is the most common design error." },

    { q: "A topic has three partitions and a consumer group has four members. What does the fourth consumer do?",
      a: ["It shares a partition with another member", "Nothing: a partition goes to exactly one member, so it sits idle", "It reads from all three as a backup", "It causes a rebalance loop"],
      c: 1,
      why: "The partition count is the ceiling on consumer parallelism within a group. Scaling a deployment past it changes nothing, which surprises people running ten replicas against six partitions." },

    { q: "How does the default partitioner choose a partition for a keyed record?",
      a: ["Round robin, ignoring the key", "By hashing the key modulo the partition count, so the same key always maps to the same partition", "By choosing the partition with the least lag", "By the producer's client id"],
      c: 1,
      why: "That determinism is what makes per-key ordering possible. It also means the mapping changes if the partition count changes." },

    { q: "What ordering guarantee do you have when producing with a null key?",
      a: ["Global ordering across the topic", "None: records are spread across partitions", "Ordering per producer instance", "Ordering by timestamp"],
      c: 1,
      why: "Modern clients use sticky batching rather than strict round robin, which is a throughput optimisation. Either way there is no ordering guarantee to lose, which is fine for independent telemetry and wrong for a lifecycle." },

    { q: "What happens to per-key ordering when you increase a topic's partition count?",
      a: ["Nothing; Kafka migrates existing keys", "It breaks permanently for existing keys, because the hash now maps them to different partitions while old records stay where they were", "Ordering is preserved but throughput drops", "The topic must be recreated first"],
      c: 1,
      why: "There is no operation that repairs it short of reprocessing into a new topic. That is why the initial count deserves ten minutes of thought." },

    { q: "Can a topic's partition count be reduced?",
      a: ["Yes, with a rebalance operation", "No: there is no operation for it, and the only route is producing into a new topic and migrating every consumer", "Yes, but only when the topic is empty", "Yes, by deleting partitions individually"],
      c: 1,
      why: "Easy to increase, impossible to decrease, and increasing breaks ordering. Both directions are painful, which is the argument for sizing deliberately at creation." },

    { q: "For a topic of order lifecycle events, which key preserves the ordering the domain actually needs?",
      a: ["A null key, for even distribution", "The orderId, so events for one order stay ordered while different orders proceed in parallel", "The customerId, for stronger ordering", "A timestamp, so events sort naturally"],
      c: 1,
      why: "Pick the smallest scope that preserves the ordering you require. customerId gives stronger ordering and worse distribution, and risks a hot partition if one customer dominates." },
  ],

  /* ------------------------------------------------------- 03-brokers-cluster --- */
  "03-brokers-cluster": [
    { q: "What is a Kafka broker?",
      a: ["A client library that routes messages", "One Kafka server, storing some partitions and serving reads and writes for the ones it leads", "A proxy in front of the cluster", "The component that tracks consumer offsets"],
      c: 1,
      why: "A cluster is several brokers sharing partitions between them. Each partition has one leader and zero or more followers replicating from it." },

    { q: "Where do produce and consume requests for a given partition go?",
      a: ["To any broker, which forwards them", "To that partition's leader broker", "To the controller", "To whichever broker the client connected to first"],
      c: 1,
      why: "Which is why clients need every broker to be individually addressable, and why advertised.listeners causes so much trouble in Docker and Kubernetes." },

    { q: "What is bootstrap.servers for?",
      a: ["A permanent proxy the client always talks through", "A starting point: the client fetches cluster metadata and then connects directly to partition leaders", "The list of brokers allowed to serve this client", "A fallback used only when the primary broker fails"],
      c: 1,
      why: "List several. A single address is a needless single point of failure at connection time: the cluster is fine, but a client starting while that broker is down cannot join at all." },

    { q: "A client connects successfully and then times out producing, in a containerised environment. What is the likely cause?",
      a: ["The topic does not exist", "advertised.listeners returns a hostname the client cannot resolve, so it reaches bootstrap but not the leader", "The producer's batch size is too large", "TLS negotiation failed silently"],
      c: 1,
      why: "It looks like a Kafka problem and is a networking one. The client got metadata naming a broker address that is valid inside the cluster and meaningless outside it." },

    { q: "How is a partition stored on a broker's disk?",
      a: ["As a single file that grows indefinitely", "As a directory of segment files with an index alongside each", "As rows in an embedded database", "In memory, with periodic snapshots"],
      c: 1,
      why: "Retention deletes whole segment files rather than individual records, which is why it is cheap and why a record can outlive its nominal retention until its segment is eligible." },

    { q: "What is the controller's job in a Kafka cluster?",
      a: ["Routing client requests to the right broker", "Maintaining cluster metadata and performing leader election when a broker fails or rejoins", "Storing consumer offsets", "Compressing and compacting segments"],
      c: 1,
      why: "In KRaft mode it lives in an internal Raft-replicated metadata log with a quorum of controllers electing one active controller among themselves." },

    { q: "What actually happens when a broker fails?",
      a: ["Its partitions are copied to another broker before traffic resumes", "Leadership for its partitions moves to in-sync followers; clients see retryable errors, refresh metadata and continue", "The cluster stops accepting writes until it returns", "Consumers switch to a backup cluster"],
      c: 1,
      why: "Failover is a metadata operation: leadership moves, data does not. If the replication factor is 1, though, those partitions are simply unavailable until it returns." },

    { q: "How many active controllers should a Kafka cluster have?",
      a: ["One per broker", "Exactly one", "One per topic", "One per availability zone"],
      c: 1,
      why: "It is one of the three metrics worth alerting on: active controller count exactly one, under-replicated partitions zero, offline partitions zero." },
  ],

  /* ------------------------------------------------------- 04-replication-isr --- */
  "04-replication-isr": [
    { q: "What is the ISR in Kafka?",
      a: ["The set of brokers hosting a topic", "The in-sync replica set: the replicas currently keeping up with the leader", "The index of segment records", "The internal state replication protocol"],
      c: 1,
      why: "A follower staying within replica.lag.time.max.ms is in the ISR and can rejoin after falling behind. Durability guarantees are expressed in terms of the ISR, not the replication factor." },

    { q: "Three replicas exist but two have fallen behind. What durability do you actually have?",
      a: ["That of three replicas, since they will catch up", "That of one, because only one is in sync", "None, since the ISR is incomplete", "It depends on the acks setting alone"],
      c: 1,
      why: "Nothing tells you unless you watch the under-replicated partitions metric. It is the clearest reason that metric is worth alerting on." },

    { q: "What does acks=1 mean, and what does it risk?",
      a: ["Wait for one follower; risks reordering", "Wait for the leader's local write only; if the leader dies before a follower replicates, that record is gone", "Wait for one acknowledgement from any broker; risks duplicates", "Wait for the controller; risks latency"],
      c: 1,
      why: "acks=0 is fire-and-forget and loses more; acks=all waits for the full ISR. For anything with business meaning, acks=all is the default to argue for." },

    { q: "Why is acks=all alone not sufficient for durability?",
      a: ["Because it does not wait for the followers", "Because if the ISR has shrunk to one member, 'all' means that one", "Because it only applies to keyed records", "Because the leader may still be behind"],
      c: 1,
      why: "min.insync.replicas=2 with acks=all is the pair that means something: the write is rejected unless at least two replicas are in sync." },

    { q: "What is the standard durable configuration for an important Kafka topic?",
      a: ["replication.factor=3, min.insync.replicas=3", "replication.factor=3, min.insync.replicas=2", "replication.factor=2, min.insync.replicas=2", "replication.factor=1, acks=all"],
      c: 1,
      why: "RF 3 with min ISR 2 tolerates one broker failure and still guarantees two copies. Setting min ISR equal to RF stops writes the moment any broker goes down, trading availability for nothing." },

    { q: "A producer with acks=all receives NotEnoughReplicasException. What should you conclude?",
      a: ["The producer is misconfigured", "The system is telling you the truth: it cannot protect this write right now, which is better than accepting it silently", "The topic does not exist", "The replication factor is too high"],
      c: 1,
      why: "A rejected write is a signal you can act on. The alternative, accepting a write with less durability than configured, is the failure you find out about after losing data." },

    { q: "What does unclean.leader.election.enable=true allow?",
      a: ["Leader election without the controller", "Promoting an out-of-sync replica when no in-sync one is available, discarding records that were acknowledged to producers", "Electing a leader from another cluster", "Skipping leader election entirely for that partition"],
      c: 1,
      why: "The default is false, which keeps the partition unavailable until an in-sync replica returns. It is the clearest CAP trade-off in Kafka, and it is a decision rather than a fact." },

    { q: "When is enabling unclean leader election defensible?",
      a: ["For payments, to maximise availability", "For a metrics topic where a gap is genuinely harmless", "Never, under any circumstances", "Whenever the replication factor is 3 or higher"],
      c: 1,
      why: "Consistency by default, availability if you explicitly ask for it. Being able to name the topic where you would choose differently is what makes it an informed answer." },
  ],

  /* ------------------------------------------------------- 05-zookeeper-kraft --- */
  "05-zookeeper-kraft": [
    { q: "What did ZooKeeper hold for a Kafka cluster?",
      a: ["Consumer offsets", "Cluster metadata, broker registration, topic configuration and controller election", "The message log itself", "The schema registry contents"],
      c: 1,
      why: "Reusing a proven consensus implementation was a reasonable choice in 2011. The costs accumulated: a second distributed system to run, and a metadata scalability ceiling." },

    { q: "Where have Kafka consumer offsets been stored since version 0.9?",
      a: ["In ZooKeeper", "In the internal compacted topic __consumer_offsets", "In the broker's local file system", "In the client, persisted to disk"],
      c: 1,
      why: "Saying ZooKeeper stores offsets is a precise signal that your knowledge comes from an old blog post rather than from a cluster." },

    { q: "What is KRaft?",
      a: ["A rewrite of Kafka in Rust", "Kafka's own Raft-replicated internal metadata log, replacing ZooKeeper", "A client-side load balancing protocol", "The compaction algorithm for internal topics"],
      c: 1,
      why: "Metadata becomes an event log like everything else in Kafka. Failover and start-up get substantially faster because a new controller replays a log rather than loading state from an external store." },

    { q: "Which Kafka version removed ZooKeeper support entirely?",
      a: ["3.0", "3.3", "3.5", "4.0"],
      c: 3,
      why: "KRaft was production-ready in 3.3 and ZooKeeper was deprecated in 3.5. So 'we are on ZooKeeper' now implies a version ceiling, which is why the migration is a live project in many companies." },

    { q: "How does the ZooKeeper to KRaft migration affect application code?",
      a: ["Producers must be reconfigured to use the new protocol", "Not at all: clients have connected to brokers rather than to ZooKeeper since 0.9", "Consumer group ids must be recreated", "Serialisers must be updated"],
      c: 1,
      why: "It is an operations project: fewer moving parts, faster recovery, and a documented in-place path through dual-write mode. Client-side it is invisible." },

    { q: "An advert lists ZooKeeper among the Kafka tools you should know. What is the best use of that information?",
      a: ["Study ZooKeeper administration before the interview", "Treat it as information about them, and ask whether they have migrated to KRaft", "Assume the advert is out of date and ignore it", "Mention that ZooKeeper is deprecated to correct them"],
      c: 1,
      why: "Asking the question shows you know the difference without making a point of it, and the answer tells you how current their platform is." },

    { q: "Why did ZooKeeper create a metadata scalability ceiling for Kafka?",
      a: ["It limited the number of brokers to sixteen", "Propagating metadata changes for very large numbers of partitions became slow", "It could not store more than 1 MB of configuration", "It required a full cluster restart to add a topic"],
      c: 1,
      why: "KRaft raised that ceiling considerably, which is part of why very high partition counts became more practical, though they still carry a cost." },

    { q: "In KRaft mode, how is the active controller chosen?",
      a: ["By the broker with the lowest id", "A quorum of controller nodes elects one among themselves via Raft", "By an external coordination service", "It is configured statically"],
      c: 1,
      why: "Consensus moves inside Kafka rather than being delegated. That is what removes the second distributed system from the operational picture." },
  ],

  /* ------------------------------------------------------- 06-producer-api --- */
  "06-producer-api": [
    { q: "What does KafkaProducer.send do when you call it?",
      a: ["Sends the record to the broker and waits for acknowledgement", "Serialises the record, chooses a partition, appends it to an in-memory batch and returns a Future", "Blocks until the batch is full", "Writes the record to a local disk buffer"],
      c: 1,
      why: "A separate I/O thread drains batches to brokers. Nothing has been sent when send returns, which is the source of most producer surprises." },

    { q: "Why must a Kafka producer be closed?",
      a: ["To release the network socket", "Because close flushes the buffer, and records still in memory are lost if the process exits first", "To commit the offsets", "To unregister from the consumer group"],
      c: 1,
      why: "It fails silently: no error, no log line, just records that never existed as far as anyone downstream is concerned." },

    { q: "What happens if you ignore the callback and the Future returned by send?",
      a: ["Nothing; failures are retried indefinitely", "A delivery failure becomes a silent loss, because nothing observes the exception", "The producer throws on the next send", "The record is written to a dead-letter topic"],
      c: 1,
      why: "send(record, callback) gives you the partition and offset on success or the exception on failure. Handling it is the difference between at-least-once and at-most-once at the producer." },

    { q: "What is the cost of calling .get() on the Future returned by send?",
      a: ["Nothing; it is a local operation", "It makes the send synchronous and collapses throughput, correct only when you genuinely need per-record confirmation", "It disables batching permanently", "It forces acks=all"],
      c: 1,
      why: "Batching is what makes Kafka fast on the producer side, and a synchronous round trip per record removes it. Reserve it for the rare case that needs it." },

    { q: "What is a Kafka record's key primarily for?",
      a: ["Uniquely identifying the message for deduplication", "Choosing the partition, and therefore deciding what stays ordered", "Authenticating the producer", "Indexing the record for lookup"],
      c: 1,
      why: "It is not a message id, which is a common confusion. If you need an event id for consumer-side deduplication, carry it in the payload or a header." },

    { q: "What are Kafka record headers useful for?",
      a: ["Storing the message key when it is too large", "Trace context, schema id, event type and correlation id, without polluting the payload schema", "Broker-side routing rules", "Compression metadata"],
      c: 1,
      why: "A consumer can route or filter on a header without deserialising the value at all, and a distributed trace only survives the broker if the context travels in headers." },

    { q: "Which producer setting actually bounds how long a send can take?",
      a: ["retries", "delivery.timeout.ms", "request.timeout.ms", "max.block.ms"],
      c: 1,
      why: "The client retries retryable errors itself up to that deadline. retries is a count that, with idempotence enabled, is effectively unlimited within the delivery timeout." },

    { q: "Why can an asynchronous send() still block your request thread?",
      a: ["Serialisation is synchronous", "If the buffer is full it waits up to max.block.ms before throwing", "The partitioner performs a network lookup", "The callback runs on the caller's thread"],
      c: 1,
      why: "The producer is not a fire-and-forget escape hatch from back-pressure; it moves where the back-pressure appears. A slow or unreachable broker eventually reaches your threads." },
  ],

  /* ------------------------------------------------------- 07-partitioning-keys --- */
  "07-partitioning-keys": [
    { q: "How does Kafka's default partitioner map a key to a partition?",
      a: ["By the key's natural ordering", "murmur2 hash of the key, modulo the partition count", "By consistent hashing across a ring", "By the producer's assigned partition range"],
      c: 1,
      why: "Deterministic for a given partition count, which is exactly why changing that count remaps keys and breaks ordering for existing ones." },

    { q: "What do modern Kafka clients do with a null key?",
      a: ["Strict round robin across partitions", "Sticky partitioning: fill one partition's batch, send it, then switch", "Send everything to partition 0", "Reject the record"],
      c: 1,
      why: "Sticky batching is a throughput optimisation over the old strict round robin, which produced many small batches. For design purposes nothing changes: no key means no ordering guarantee." },

    { q: "Why do ordering and parallelism pull in opposite directions when choosing a Kafka message key?",
      a: ["They do not; a good key improves both", "A coarse key gives strong ordering and poor distribution; a fine key gives good distribution and orders only a narrow scope", "Parallelism is set by the consumer count, independently of the key", "Ordering depends on the producer, parallelism on the broker"],
      c: 1,
      why: "Pick the smallest scope that preserves the ordering your domain actually requires. For an order lifecycle that is orderId, not customerId." },

    { q: "What is a hot partition, and what causes it?",
      a: ["A partition with more replicas than the others", "A partition receiving a disproportionate share of traffic, caused by a skewed key distribution", "A partition whose leader is on an overloaded broker", "A partition with a longer retention setting"],
      c: 1,
      why: "If one customer is 60 per cent of traffic and the key is customerId, one consumer does most of the work and adding consumers changes nothing." },

    { q: "Lag is climbing on exactly one partition while the others are idle. What does that indicate?",
      a: ["The consumer group is rebalancing", "A hot key, so more consumers will not help", "The broker leading that partition is failing", "The retention period is too short"],
      c: 1,
      why: "Lag on all partitions is a capacity or availability problem; lag on one is a keying problem. Reading which shape it is takes seconds and points at completely different fixes." },

    { q: "What is the usual fix for a hot partition caused by a skewed key?",
      a: ["Increase the number of consumers", "Use a composite key, accepting that the ordering guarantee changes with it", "Increase the replication factor", "Enable compression"],
      c: 1,
      why: "It is a design decision rather than a tuning knob: composite keys spread the load and narrow what stays ordered, so the domain has to tolerate that." },

    { q: "When is a custom Partitioner implementation justified?",
      a: ["Whenever the default distribution is uneven", "Rarely: isolating one very large tenant onto dedicated partitions, or preserving a mapping during a migration", "Whenever records have no natural key", "To implement priority ordering"],
      c: 1,
      why: "The mapping becomes invisible knowledge: every producer must use the same partitioner or the ordering guarantee silently breaks, and anyone debugging must find and read your class." },

    { q: "Why is a composite key usually preferable to a custom partitioner?",
      a: ["It is faster to compute", "The logic is in the data and therefore self-documenting, rather than hidden in a class every producer must share", "It allows more partitions", "It avoids the murmur2 hash"],
      c: 1,
      why: "Achieving the same distribution effect while keeping the rule visible in the record is the better trade in almost every case." },
  ],

  /* ------------------------------------------------------- 08-batching-compression --- */
  "08-batching-compression": [
    { q: "What do batch.size and linger.ms each control on a Kafka producer?",
      a: ["Both control the number of records per batch", "batch.size is a byte ceiling per partition batch; linger.ms is a time ceiling, and either triggers a send", "batch.size is per topic; linger.ms is per broker", "batch.size sets the buffer and linger.ms the retry delay"],
      c: 1,
      why: "Raising batch.size alone does nothing when traffic is low: with linger.ms at zero, batches are sent immediately and stay tiny. It is the pair that matters." },

    { q: "Does linger.ms=0 mean no batching at all?",
      a: ["Yes, each record is sent individually", "No: records accumulating while the previous request is in flight still batch together; the producer simply never waits on purpose", "Yes, unless compression is enabled", "No, it means batches are unbounded"],
      c: 1,
      why: "Which is why the default is not as bad as it sounds, and why a small deliberate linger is usually a large win rather than a rescue." },

    { q: "Why does setting linger.ms to 5 to 20 ms often improve throughput substantially?",
      a: ["It reduces the number of partitions used", "Fewer, larger requests mean less per-request overhead on both sides and better compression ratios", "It allows the broker to skip acknowledgements", "It reduces the number of TCP connections"],
      c: 1,
      why: "It is the tuning change with the best effort-to-benefit ratio in Kafka, at a small and bounded latency cost." },

    { q: "What does Kafka compression apply to?",
      a: ["Each record individually", "The whole batch, which is why larger batches compress better", "The segment file on disk only", "The network frame, transparently"],
      c: 1,
      why: "Batching and compression reinforce each other, and the broker normally stores and serves the batch still compressed, so the saving extends to disk and to consumer network." },

    { q: "Which compression codec is usually the right default for Kafka now?",
      a: ["gzip, for the best ratio", "zstd, for noticeably better ratios at moderate CPU cost", "none, since compression costs more than it saves", "snappy, because it is the only one supported by all clients"],
      c: 1,
      why: "lz4 and snappy are fast with moderate ratios and remain reasonable choices. gzip is slow and rarely the right answer." },

    { q: "What happens if a topic's compression type differs from the producer's?",
      a: ["The broker rejects the batch", "The broker decompresses and recompresses every batch, which is a large and invisible CPU cost", "The consumer fails to deserialise", "Nothing; the topic setting is advisory"],
      c: 1,
      why: "The saving normally extends all the way to the consumer because the batch is stored as received. Forcing recompression removes that and adds broker CPU nobody attributed to it." },

    { q: "You raise batch.size and see no change in throughput. What is the likely limiting factor?",
      a: ["The broker's disk", "linger.ms, because batches are being sent before they can fill", "The replication factor", "The number of consumer threads"],
      c: 1,
      why: "Check batch-size-avg on the producer: far below the configured ceiling means time, not size, is closing the batches." },

    { q: "Which producer metrics tell you whether batching is actually working?",
      a: ["records-lag-max and fetch-rate", "batch-size-avg, compression-rate-avg, record-send-rate and request-latency-avg", "under-replicated-partitions and offline-partitions", "commit-rate and rebalance-rate"],
      c: 1,
      why: "Those are producer-side; lag and fetch metrics belong to consumers, and under-replicated partitions to brokers. Measuring rather than guessing is the point." },
  ],

  /* ------------------------------------------------------- 09-producer-acks --- */
  "09-producer-acks": [
    { q: "Before Kafka 0.11, why could a producer retry create a duplicate?",
      a: ["The broker deduplicated only keyed records", "The broker wrote the record and the acknowledgement was lost, so the producer sent it again with no way to detect the repeat", "Retries always resent the whole batch", "The producer id changed on each retry"],
      c: 1,
      why: "So retries greater than zero meant at-least-once at the producer as well as at the consumer. Idempotence closed that gap." },

    { q: "How could producer retries reorder records within a partition?",
      a: ["The broker sorts by timestamp", "With more than one request in flight, a later batch could succeed while an earlier one was being retried", "Retries were sent to a different partition", "The partitioner re-evaluated the key on retry"],
      c: 1,
      why: "That quietly broke the one ordering guarantee Kafka offers. The old advice was max.in.flight.requests.per.connection=1, at a large throughput cost." },

    { q: "How does the idempotent producer prevent duplicates from retries?",
      a: ["It hashes the payload and compares", "Each record carries a producer id and a per-partition sequence number, and the broker discards a repeat and rejects out-of-order sequences", "It waits for acknowledgement before sending the next record", "It writes to a deduplication topic first"],
      c: 1,
      why: "That is what makes retries safe while still allowing up to five in-flight requests, so ordering holds without giving up throughput." },

    { q: "Since which Kafka version is enable.idempotence the default?",
      a: ["0.11", "2.0", "3.0", "It is still off by default"],
      c: 2,
      why: "It also sets acks=all, effectively infinite retries and max.in.flight at most 5. Explicitly setting acks=1 alongside it is a configuration conflict rather than a tuning choice." },

    { q: "What exactly does producer idempotence deduplicate?",
      a: ["Any two identical payloads", "Retries by one producer session for one partition", "Duplicate events published by your application logic", "Records replayed from an earlier offset"],
      c: 1,
      why: "It does not deduplicate your application sending the same logical event twice, which is the outbox and consumer-idempotency problem in chapters 16 and 39." },

    { q: "Does Kafka guarantee ordering, and under what condition?",
      a: ["Yes, globally across a topic", "Yes within a partition, provided the producer does not reorder its own retries", "No, ordering is best effort", "Only when max.in.flight is set to 1"],
      c: 1,
      why: "Stating the condition is what separates people who have read about it from people who have configured it. Idempotence is what makes it hold with several in-flight requests." },

    { q: "Why is the latency cost of acks=all smaller than people expect?",
      a: ["Replication happens before the write is durable", "You wait once per batch, not once per record, so it overlaps with batching", "The broker acknowledges optimistically", "Followers acknowledge in parallel with the leader's write"],
      c: 1,
      why: "Combined with a small linger, the extra replication round trip is amortised across many records, which is why acks=all is affordable for most workloads." },

    { q: "When is acks=0 a defensible choice?",
      a: ["For payments, where speed matters most", "For data you are genuinely willing to lose, such as high-volume telemetry where a gap is harmless", "Whenever the replication factor is 3", "Never; it is always wrong"],
      c: 1,
      why: "It does not even wait for a network round trip, so throughput is highest and a broker failure loses whatever was in flight, silently." },
  ],

  /* ------------------------------------------------------- 10-consumer-api --- */
  "10-consumer-api": [
    { q: "What does KafkaConsumer.poll do besides fetching records?",
      a: ["Nothing else; it is purely a fetch", "It drives group membership: joining, receiving partition assignments, and participating in rebalances", "It commits offsets automatically in all configurations", "It sends heartbeats synchronously in modern clients"],
      c: 1,
      why: "Modern clients heartbeat on a background thread, but max.poll.interval.ms still bounds the time between polls. Exceeding it gets you evicted." },

    { q: "What happens if processing a batch takes longer than max.poll.interval.ms?",
      a: ["The consumer is throttled by the broker", "The coordinator considers the consumer dead and rebalances its partitions away, mid-processing", "The poll call throws immediately", "The offsets are committed automatically to avoid loss"],
      c: 1,
      why: "Another consumer picks up the same records from the last committed offset, throughput collapses, and nothing reports an obvious error. It is the classic Kafka consumer failure." },

    { q: "What are the correct fixes when a handler exceeds max.poll.interval.ms?",
      a: ["Raise session.timeout.ms", "Reduce max.poll.records, raise max.poll.interval.ms, or move the slow work off the poll thread", "Increase the partition count", "Disable auto-commit"],
      c: 1,
      why: "Raising session.timeout.ms treats a different symptom and only slows genuine failure detection. The setting that governs a slow handler is max.poll.interval.ms." },

    { q: "Is KafkaConsumer thread-safe?",
      a: ["Yes, fully", "No: only wakeup() may be called from another thread, to interrupt a blocked poll for shutdown", "Yes, for reads but not commits", "Yes, if each thread uses a different topic"],
      c: 1,
      why: "The two standard models are one consumer per thread, or one consumer handing records to a worker pool, which decouples processing speed and makes offset management substantially harder." },

    { q: "What is the effect of running more consumer instances than a topic has partitions?",
      a: ["Throughput increases proportionally", "The extra consumers sit idle, because a partition goes to exactly one member of a group", "Partitions are split between them", "The group fails to stabilise"],
      c: 1,
      why: "People scale a deployment to ten replicas against six partitions and are surprised nothing improves. The ceiling is the partition count." },

    { q: "What is the difference between subscribe and assign on a Kafka consumer?",
      a: ["subscribe is for multiple topics, assign for one", "subscribe joins a group with dynamic assignment and rebalancing; assign takes specific partitions with no group and no rebalancing", "assign is the asynchronous version", "subscribe requires a group id, assign requires a client id"],
      c: 1,
      why: "With assign there is no rebalancing, so a crashed instance is simply not replaced and its partitions stop being consumed with nothing noticing. Right for a debugging script, wrong for a service." },

    { q: "Why does a worker pool inside the consumer complicate offset management?",
      a: ["Workers cannot access the consumer object", "Records may complete out of order, so you can no longer simply commit the last offset of the batch", "The poll loop stops while workers run", "Offsets must be committed per thread"],
      c: 1,
      why: "You take on the job of tracking which offsets are genuinely safe to commit. Start with one consumer per thread and reach for the pool only when one thread cannot keep up with one partition." },

    { q: "Which exception is expected when wakeup() is called during shutdown?",
      a: ["InterruptedException", "WakeupException", "IllegalStateException", "CommitFailedException"],
      c: 1,
      why: "It is the designed way to break out of a blocking poll, so catching it in the shutdown path is normal rather than an error condition." },
  ],

  /* ------------------------------------------------------- 11-consumer-groups --- */
  "11-consumer-groups": [
    { q: "What does group.id determine in Kafka?",
      a: ["Which topics a consumer may read", "Both the unit of scaling and the unit of independence: members of one group share partitions, while different groups each see everything", "The offset retention period", "The consumer's position in the partition assignment order"],
      c: 1,
      why: "It answers two questions at once: 'how do I process faster' is more instances in the same group, and 'how do two services read the same events' is different group ids." },

    { q: "Two different services accidentally share one group.id. What happens?",
      a: ["One of them fails to start", "They share the partition assignment, so each sees roughly half the records and neither sees all of them", "Both receive every record", "The broker rejects the second consumer"],
      c: 1,
      why: "Nothing errors, which is what makes it painful. Group ids should name the purpose, such as billing or search-indexer, rather than the application or the environment." },

    { q: "Which assignment strategy should a modern Kafka consumer group use?",
      a: ["Range, for contiguous assignment", "CooperativeSticky, which rebalances incrementally rather than revoking everything", "RoundRobin, for even distribution", "Sticky, without the cooperative protocol"],
      c: 1,
      why: "It matters most for stateful consumers, where reassignment means rebuilding local state. Range also consistently overloads the same members across several topics." },

    { q: "What problem does the Range assignor have?",
      a: ["It cannot handle more than one topic", "It distributes badly when the partition count is not a multiple of the member count, and consistently overloads the same members across topics", "It requires static membership", "It cannot be used with cooperative rebalancing"],
      c: 1,
      why: "RoundRobin spreads more evenly, and Sticky additionally minimises movement during a rebalance. Cooperative Sticky combines both properties." },

    { q: "What does group.instance.id enable?",
      a: ["Multiple groups per consumer", "Static membership: a consumer restarting within session.timeout.ms reclaims its partitions without triggering a rebalance", "Per-instance offset storage", "Priority assignment of partitions"],
      c: 1,
      why: "In Kubernetes, where a rolling deploy restarts every pod in sequence, that turns N rebalances into none." },

    { q: "What is the cost of static membership?",
      a: ["Higher memory usage on the broker", "A genuinely dead member is not replaced until its session times out, so its partitions stop being consumed for that window", "Offsets are committed less frequently", "Cooperative rebalancing is disabled"],
      c: 1,
      why: "You have chosen slower failover in exchange for calmer deploys. Set the timeout to match how quickly your platform restarts a pod." },

    { q: "How should Kafka consumer group ids be named?",
      a: ["After the application and environment, such as billing-service-prod", "After the purpose, such as billing or search-indexer", "After the topic they consume", "With a random unique id per instance"],
      c: 1,
      why: "Encoding the environment risks two environments sharing a cluster and a group; encoding the instance means every restart starts from scratch. The purpose is the stable thing." },

    { q: "A new service must consume the same topic an existing service already reads. What do you change?",
      a: ["Add partitions to the topic", "Nothing but its group.id: it gets its own offsets and sees every record", "Create a mirrored copy of the topic", "Add the new service to the existing group"],
      c: 1,
      why: "No change to the producer and no coordination with the existing consumer. That is the decoupling the log model buys, made concrete." },
  ],

  /* ------------------------------------------------------- 12-offsets --- */
  "12-offsets": [
    { q: "Where are Kafka consumer offsets stored?",
      a: ["In ZooKeeper", "In the internal compacted topic __consumer_offsets, keyed by group, topic and partition", "On the consumer's local disk", "In the broker's metadata log"],
      c: 1,
      why: "Because the topic is compacted, only the latest offset per key is retained, which is the stream-table duality applied to Kafka's own bookkeeping." },

    { q: "What is the difference between a consumer's position and its committed offset?",
      a: ["They are the same value", "Position is where it will read next in memory; the committed offset is what has been durably recorded for the group", "Position is per partition, committed offset is per topic", "Position is set by the broker, committed offset by the client"],
      c: 1,
      why: "Only the committed one matters after a crash or a rebalance. Consumption resumes from there, not from where the process happened to have got to." },

    { q: "What does enable.auto.commit actually do?",
      a: ["Commits after each record is successfully processed", "Commits during poll on a timer, regardless of whether your processing succeeded", "Commits when the consumer shuts down", "Commits only when the batch is fully processed"],
      c: 1,
      why: "It is on by default and wrong for nearly every workload, because the timer has no idea whether your handler finished." },

    { q: "With auto-commit enabled, what happens if the commit lands before processing completes and the process then dies?",
      a: ["The records are reprocessed on restart", "Those records are never reprocessed: silent loss", "The broker detects the gap and redelivers", "The offsets are rolled back"],
      c: 1,
      why: "The other timing gives duplicates instead, which is fine if you are idempotent. Auto-commit gives you both failure modes depending on where the crash lands." },

    { q: "What offset should you commit after processing a record?",
      a: ["record.offset()", "record.offset() + 1, the offset of the next record to read", "The partition's high watermark", "The first offset of the batch"],
      c: 1,
      why: "Committing the current offset makes every restart reprocess exactly one record per partition: a duplicate rare enough to survive testing and surface as a data anomaly months later." },

    { q: "When does auto.offset.reset apply?",
      a: ["Every time a consumer starts", "Only when there is no valid committed offset for that group and partition", "Whenever a rebalance occurs", "When the requested offset is beyond the log end"],
      c: 1,
      why: "latest is the default, which is why a freshly deployed service appears to receive nothing: it only sees records produced after it started." },

    { q: "A new projection service must rebuild state from the whole topic. Which auto.offset.reset do you want?",
      a: ["latest", "earliest", "none", "It does not matter with a new group id"],
      c: 1,
      why: "For a notifier you almost certainly want latest, or you will email everyone about last month. The choice is per consumer and per purpose." },

    { q: "How do you replay a topic for an existing consumer group?",
      a: ["Delete and recreate the topic", "Stop the group, then use kafka-consumer-groups.sh --reset-offsets to a timestamp or the earliest offset", "Change the group id and restart", "Set auto.offset.reset to earliest and restart"],
      c: 1,
      why: "The group must be stopped, and --dry-run first. Changing the group id also works but abandons the old group's position rather than moving it." },
  ],

  /* ------------------------------------------------------- 13-rebalancing --- */
  "13-rebalancing": [
    { q: "Which of these triggers a consumer group rebalance?",
      a: ["A producer sending to a new partition", "A member joining or leaving, a member failing to heartbeat, a member exceeding max.poll.interval.ms, or the topic gaining partitions", "A change in the compression codec", "The broker compacting a segment"],
      c: 1,
      why: "Two of those are under your control: a rolling deploy restarts every pod, and a slow handler looks exactly like a crash to the coordinator." },

    { q: "What does eager rebalancing cost the group?",
      a: ["Nothing; assignment changes are incremental", "Every consumer gives up all its partitions and waits, so consumption stops group-wide for the duration", "Only the joining member pauses", "Offsets must be recommitted for every partition"],
      c: 1,
      why: "Typically seconds, and much longer for stateful consumers that must rebuild local state after being handed different partitions." },

    { q: "A consumer group logs 'Attempt to heartbeat failed since group is rebalancing' repeatedly and makes no progress. What is happening?",
      a: ["The brokers are overloaded", "A rebalance loop: a slow handler is evicted, rejoins, triggers another rebalance and is evicted again", "The topic has too many partitions", "The consumers are using different assignors"],
      c: 1,
      why: "Every broker metric looks healthy while the group achieves nothing. The cause is on the consumer side, and the fix is to make the batch finish in time." },

    { q: "Which setting governs how long a slow handler may take between polls?",
      a: ["session.timeout.ms", "max.poll.interval.ms", "heartbeat.interval.ms", "request.timeout.ms"],
      c: 1,
      why: "Raising session.timeout.ms treats the symptom and slows genuine failure detection. Reducing max.poll.records so the batch finishes is usually the real fix." },

    { q: "What does the CooperativeStickyAssignor do differently?",
      a: ["It assigns partitions by broker locality", "It revokes only the partitions that must change hands, letting consumers keep processing everything else", "It prevents rebalances entirely", "It assigns two consumers per partition for redundancy"],
      c: 1,
      why: "For a group of ten where one member leaves, that is a handful of partitions moving rather than all of them. It is the default in modern clients." },

    { q: "How do you migrate an older application to cooperative rebalancing?",
      a: ["Change the assignor and restart all consumers at once", "A two-step rolling change: first configure both assignors, then cooperative only", "Recreate the consumer group", "It requires a broker upgrade"],
      c: 1,
      why: "The two protocols cannot be mixed arbitrarily in one group, so the intermediate step is what makes the rollout safe." },

    { q: "How many rebalances does a rolling deploy of an N-pod consumer deployment cause, without static membership?",
      a: ["One", "Up to 2N, as each pod leaves and rejoins", "N divided by the partition count", "None, if the pods restart quickly"],
      c: 1,
      why: "Static membership through group.instance.id removes them, at the cost of slower detection of a genuinely dead member." },

    { q: "Why do stateful consumers suffer most from rebalancing?",
      a: ["They commit offsets more often", "Being handed different partitions means rebuilding local state before they can process anything", "They cannot use cooperative rebalancing", "Their heartbeats are slower"],
      c: 1,
      why: "Which is why Kafka Streams pairs cooperative rebalancing with standby replicas and static membership: the goal is for a reassignment to move as little state as possible." },
  ],

  /* ------------------------------------------------------- 14-lag --- */
  "14-lag": [
    { q: "How is consumer lag defined in Kafka?",
      a: ["The time since the last poll", "The log end offset minus the committed offset, per partition", "The number of consumers below the partition count", "The delay between produce and acknowledge"],
      c: 1,
      why: "It is the single most informative Kafka metric because it is end-to-end: it captures producer rate, consumer throughput and failures in one number." },

    { q: "Which matters more when reading a lag metric: the value or the trend?",
      a: ["The value, compared against a fixed threshold", "The trend, because a large flat lag can be healthy while a small climbing one has already lost", "Neither; only the maximum matters", "The value, compared across consumer groups"],
      c: 1,
      why: "A lag of fifty thousand that is flat means a constant offset in a fast stream. Five hundred that climbs steadily means you will not catch up on your own." },

    { q: "Lag is rising on every partition of a topic at a similar rate. Which causes fit?",
      a: ["A hot key", "A genuine load increase, slower processing, or a group that is rebalancing and not consuming at all", "An under-replicated partition", "A compaction backlog"],
      c: 1,
      why: "Lag concentrated on one partition is a keying problem where more consumers will not help. Reading which shape it is takes seconds and points at different fixes." },

    { q: "Which tool reports lag for every consumer group without each application exporting it?",
      a: ["The JMX exporter on the brokers alone", "A dedicated exporter such as Kafka Lag Exporter or Burrow, reading __consumer_offsets centrally", "kafka-topics.sh --describe", "The schema registry"],
      c: 1,
      why: "It covers applications that export no metrics of their own, which in practice is most of the ones you did not write." },

    { q: "What should a lag alert fire on?",
      a: ["A fixed record count", "Sustained growth, and ideally time behind rather than record count", "Any non-zero lag", "The maximum lag ever observed"],
      c: 1,
      why: "'Billing is twenty minutes behind' is actionable and comprehensible to everyone. 'Lag is 847,000' means nothing without knowing the rate." },

    { q: "Why is a consumer group reporting zero lag not necessarily healthy?",
      a: ["Zero lag is impossible in practice", "It may have stopped entirely, or disappeared from the metrics, and a dead group looks exactly like a well-behaved one", "Zero lag indicates auto-commit is misconfigured", "It means the topic has no producers"],
      c: 1,
      why: "Alert on a group vanishing from the metrics as well as on its lag, or the most complete failure produces the healthiest-looking dashboard." },

    { q: "Lag is computed from the committed offset. What does that mean for a consumer that commits before processing?",
      a: ["Lag will be overstated", "Lag looks healthy while records are silently dropped", "Lag cannot be computed at all", "Lag will oscillate"],
      c: 1,
      why: "Lag measures commits, not work done. That gap is exactly why chapter 12 insists on committing after success rather than before it." },

    { q: "A consumer stops committing because its commit path throws, but continues processing fine. What does lag show?",
      a: ["Zero, since processing continues", "Rising lag, even though the work is being done", "Negative lag", "No change, since lag is computed from position"],
      c: 1,
      why: "The metric is telling the truth about the recorded position rather than about the work. It is the mirror image of the commit-before-processing case." },
  ],

  /* ------------------------------------------------------- 15-delivery-semantics --- */
  "15-delivery-semantics": [
    { q: "What determines whether a consumer has at-most-once or at-least-once semantics?",
      a: ["A broker configuration setting", "The order of two operations: whether you commit the offset before or after processing", "The acks setting on the producer", "Whether the topic is compacted"],
      c: 1,
      why: "Saying it in exactly those terms shows the semantics are a consequence of ordering two operations rather than a feature you switch on." },

    { q: "Which delivery semantic results from committing the offset first, then processing?",
      a: ["At-least-once", "At-most-once", "Exactly-once", "It depends on the partition count"],
      c: 1,
      why: "Fast, no duplicates, and it loses records on any failure. Legitimate for high-volume telemetry where a gap is harmless, and wrong for almost everything else." },

    { q: "Which delivery semantic does nearly every real Kafka system run?",
      a: ["At-most-once, for speed", "At-least-once, with idempotent handlers", "Exactly-once, via transactions", "It varies randomly with load"],
      c: 1,
      why: "Process, then commit. No loss, duplicates on failure, and correctness comes from making the handler safe to repeat rather than from a broker setting." },

    { q: "Why is exactly-once delivery impossible over a network?",
      a: ["Because clocks are not synchronised", "The two-generals problem: the sender can never be certain the acknowledgement arrived", "Because TCP does not guarantee ordering", "Because brokers can lose messages"],
      c: 1,
      why: "Exactly-once processing is achievable, by making duplicates harmless or by making the write and the offset commit atomic. Delivery versus effect is the distinction that makes the phrase honest." },

    { q: "What is the boundary of Kafka's exactly-once semantics?",
      a: ["It covers any consumer with transactions enabled", "Consume-transform-produce entirely inside Kafka, where output records and the offset commit are one transaction", "It covers writes to any database with XA support", "It applies per partition regardless of the sink"],
      c: 1,
      why: "The moment your consumer writes to Oracle, sends an email or calls an HTTP API, that boundary is crossed and you are back to designing for idempotency." },

    { q: "If you have not thought about delivery semantics, what are you most likely running?",
      a: ["At-most-once, since that is the default", "At-least-once with auto-commit, which gives duplicates and occasional silent loss depending on where the crash lands", "Exactly-once, since Kafka enables it by default", "Nothing is delivered until you configure it"],
      c: 1,
      why: "It is the worst of both, and it is the actual default state of most Kafka consumers in production." },

    { q: "How should you choose delivery semantics?",
      a: ["Once for the whole system, at design time", "Per consumer, by asking what a duplicate would cost and what a loss would cost", "Always exactly-once where technically possible", "By the throughput requirement alone"],
      c: 1,
      why: "A duplicated metrics point is noise; a duplicated payment is a refund and a phone call. Charging a card and updating a dashboard do not need the same guarantee." },

    { q: "For which pipeline shape are Kafka transactions genuinely worth the cost?",
      a: ["Any consumer writing to a relational database", "A Kafka-to-Kafka pipeline where correctness matters more than the throughput cost, such as a Kafka Streams topology", "A consumer sending emails", "A producer writing telemetry"],
      c: 1,
      why: "Streams enables it with processing.guarantee=exactly_once_v2, and its topologies are Kafka-to-Kafka by construction, which is exactly the boundary the guarantee covers." },
  ],

});
