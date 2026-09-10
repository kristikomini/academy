/* ==========================================================================
   chapters.js — the single source of truth for the whole site.
   The sidebar, the home-page cards and every prev/next button are generated
   from this array. Add a chapter here and it appears everywhere.

   Each entry:
     n     chapter number shown in the sidebar ("" for the home page)
     id    file name inside /chapters (without .html)
     title sidebar + card title
     part  section heading it sits under
     blurb one line, shown on the home-page card
     tags  extra words the sidebar search should match
     req   which line of the job posting this chapter answers
     extra set INSTEAD of req when the chapter is not in that advert at all,
           but the regional market asks for it anyway. The home page renders
           these as a second table so the advert coverage stays honest.

   ---------------------------------------------------------------------------
   THE ADVERTS, AND AN HONEST NOTE ABOUT THIS PARTICULAR CORPUS.

   Phase 1 for this subject produced a THINNER and less Italian corpus than the
   Java one, and that is a finding rather than a shortfall to hide:

     * There is no standalone Kafka job in Emilia-Romagna. Every Kafka line
       collected came from a Java or backend posting, most of them Milano or
       remote, several written in English.
     * The Kafka-specific detail in those postings is shallow. Adverts say
       "Apache Kafka" and stop; they rarely name partitions, offsets or
       delivery semantics — the things the job actually turns on.

   The postings behind the `req` fields below:

     1. Backend Developer mid-senior, Milano (hybrid) — Java 17, Spring Boot,
        OpenShift/Kubernetes, Kafka/RabbitMQ, MongoDB, Oracle.
     2. Esprimo S.R.L., Milano — 5+ years, application architectures, REST,
        SQL and Apache Kafka. CCNL Metalmeccanico, 35–38k.
     3. Sinergidea Srl, Milano — "Sviluppatore Java e Kafka".
     4. Java Backend Developer, Microservices & Kafka — remote, Italy.
     5. Aggregated Kafka-developer requirement lines from Italian listings:
        Kafka Streams, Connect, ZooKeeper, Schema Registry, Prometheus/Grafana,
        and the Confluent certification.

   WHAT THAT MEANS FOR THIS MANIFEST. Far more chapters here carry an `extra`
   than in the Java subject, and that ratio is the point: the adverts ask for
   "Kafka" as one word, and this course is the expansion of that word. Where a
   chapter exists because the system cannot be understood without it — offsets,
   rebalancing, delivery semantics — it says so in `extra` rather than being
   given a `req` that no advert actually wrote.

   ON THE OVERLAP WITH THE JAVA SUBJECT. Chapter 41 covers Spring Kafka, which
   the Java academy also touches in its chapter 33. The split is deliberate:
   there, messaging is one option seen from inside a Spring app; here, Spring is
   one client seen from inside the broker's model. Keep it that way — if these
   two chapters start describing the same thing, delete one.
   ========================================================================== */

const PARTS = [
  "Start here",
  "Part 1 — The log, and why it is a log",
  "Part 2 — Producing",
  "Part 3 — Consuming",
  "Part 4 — Delivery guarantees",
  "Part 5 — Data on the wire",
  "Part 6 — Kafka Streams",
  "Part 7 — Connect and the ecosystem",
  "Part 8 — Running it",
  "Part 9 — Designing event-driven systems",
  "Part 10 — The human requirements",
];

const CHAPTERS = [
  {
    n: "00", id: "00-the-job-posting", part: PARTS[0],
    title: "The job posting, decoded",
    blurb: "Five adverts that say 'Apache Kafka' and stop. This course is the rest of that sentence.",
    tags: "requisiti annuncio requirements roadmap start offerta mercato milano bologna",
    req: "the whole advert",
  },

  /* ---------- Part 1 — The log, and why it is a log ---------- */
  {
    n: "01", id: "01-why-a-log", part: PARTS[1],
    title: "Why a log, and not a queue",
    blurb: "The one idea the whole system follows from: an append-only log that readers track a position in.",
    tags: "log append-only queue jms broker durable replay position mental-model commit-log",
    extra: "No advert explains this and nothing else in Kafka makes sense without it. A candidate who describes Kafka as 'a message queue' has already answered the interviewer's real question.",
  },
  {
    n: "02", id: "02-topics-partitions", part: PARTS[1],
    title: "Topics, partitions and keys",
    blurb: "The unit of parallelism, the unit of ordering, and the decision you cannot easily undo.",
    tags: "topic partition key parallelism ordering repartition design throughput scaling",
    req: "architetture applicative con competenze su REST, SQL e Apache Kafka",
  },
  {
    n: "03", id: "03-brokers-cluster", part: PARTS[1],
    title: "Brokers, the cluster and the controller",
    blurb: "What a broker holds, how a cluster agrees, and what the controller is responsible for.",
    tags: "broker cluster controller metadata bootstrap-servers leader coordinator topology",
    extra: "The adverts name Kafka as a technology; this is the part that makes it an operable system rather than a library. It is also where 'why is one broker doing all the work' gets answered.",
  },
  {
    n: "04", id: "04-replication-isr", part: PARTS[1],
    title: "Replication, ISR and leader election",
    blurb: "Replication factor, in-sync replicas, min.insync.replicas — and how data is actually lost.",
    tags: "replication isr min-insync replica leader follower unclean-election durability data-loss",
    extra: "The combination of acks=all and min.insync.replicas is the single configuration pair that decides whether Kafka loses your data. Nobody advertises it; every production incident review reaches it.",
  },
  {
    n: "05", id: "05-zookeeper-kraft", part: PARTS[1],
    title: "ZooKeeper, KRaft and the migration",
    blurb: "Why ZooKeeper was there, why it is being removed, and what you will meet in an existing cluster.",
    tags: "zookeeper kraft quorum metadata migration raft consensus legacy version",
    req: "Familiarity with Kafka tools (such as Kafka Streams, Connect, and Zookeeper)",
  },

  /* ---------- Part 2 — Producing ---------- */
  {
    n: "06", id: "06-producer-api", part: PARTS[2],
    title: "The producer API",
    blurb: "send(), the callback, the buffer, and what 'asynchronous' actually means here.",
    tags: "producer send callback future buffer async record producerrecord client api",
    req: "Sviluppatore Java e Kafka",
  },
  {
    n: "07", id: "07-partitioning-keys", part: PARTS[2],
    title: "Partitioning: how a key chooses a partition",
    blurb: "The default partitioner, null keys, hot partitions, and custom strategies.",
    tags: "partitioner key hash murmur sticky round-robin hot-partition skew custom",
    extra: "Choosing the key is the most consequential design decision in a Kafka system, and it is made in one line of code by someone who often has not been told that.",
  },
  {
    n: "08", id: "08-batching-compression", part: PARTS[2],
    title: "Batching, linger, compression and throughput",
    blurb: "batch.size, linger.ms, compression.type — the three knobs behind most performance work.",
    tags: "batch linger compression throughput latency snappy lz4 zstd tuning buffer-memory",
    extra: "The latency/throughput trade-off in Kafka is explicit and configurable, which makes it a favourite interview topic: there is a right answer only once you have asked what the system is for.",
  },
  {
    n: "09", id: "09-producer-acks", part: PARTS[2],
    title: "acks, retries and the idempotent producer",
    blurb: "What each acks setting promises, and how a retry silently duplicated your message before 0.11.",
    tags: "acks retries idempotent producer-id sequence duplicate max-in-flight enable-idempotence",
    extra: "This is where 'at-least-once' stops being a phrase and becomes a configuration. It also explains why enable.idempotence became the default and what it cost.",
  },

  /* ---------- Part 3 — Consuming ---------- */
  {
    n: "10", id: "10-consumer-api", part: PARTS[3],
    title: "The consumer API",
    blurb: "poll(), the fetch loop, max.poll.interval, and why the consumer is not thread-safe.",
    tags: "consumer poll fetch loop max-poll-records max-poll-interval thread-safety heartbeat",
    req: "Sviluppatore Java e Kafka",
  },
  {
    n: "11", id: "11-consumer-groups", part: PARTS[3],
    title: "Consumer groups and the assignment",
    blurb: "How partitions are shared, why more consumers than partitions is wasted, and the strategies.",
    tags: "consumer-group group-id assignment range round-robin sticky cooperative scaling idle",
    extra: "The rule that a partition goes to exactly one consumer in a group is what makes Kafka scale, and the reason adding an eleventh consumer to a ten-partition topic does nothing at all.",
  },
  {
    n: "12", id: "12-offsets", part: PARTS[3],
    title: "Offsets: committing, resetting and replaying",
    blurb: "__consumer_offsets, auto-commit and the message you processed twice — or not at all.",
    tags: "offset commit auto-commit manual seek reset earliest latest replay consumer-offsets",
    extra: "Auto-commit is on by default and is wrong for most workloads: it commits on a timer, not on success, so a crash mid-processing loses or repeats work with no error anywhere.",
  },
  {
    n: "13", id: "13-rebalancing", part: PARTS[3],
    title: "Rebalancing, and the pause everyone blames on the network",
    blurb: "What triggers one, the stop-the-world cost, and cooperative rebalancing.",
    tags: "rebalance stop-the-world cooperative incremental static-membership session-timeout pause",
    extra: "A slow message handler exceeds max.poll.interval.ms, the consumer is evicted, the group rebalances, and throughput collapses in a way that looks like a broker problem and is not.",
  },
  {
    n: "14", id: "14-lag", part: PARTS[3],
    title: "Consumer lag: measuring it and fixing it",
    blurb: "The one metric that tells you whether the system is healthy, and the four causes of it rising.",
    tags: "lag consumer-lag metric burrow monitoring backlog throughput scaling alerting",
    req: "monitoring systems (e.g., Prometheus, Grafana)",
  },

  /* ---------- Part 4 — Delivery guarantees ---------- */
  {
    n: "15", id: "15-delivery-semantics", part: PARTS[4],
    title: "At-most-once, at-least-once, exactly-once",
    blurb: "What each one really promises, what it costs, and which one you are actually running.",
    tags: "delivery-semantics at-least-once at-most-once exactly-once eos guarantee duplicate loss",
    extra: "The highest-value twenty minutes in this course. Almost every candidate can recite the three names; very few can say which one their last system had, or why.",
  },
  {
    n: "16", id: "16-idempotent-consumers", part: PARTS[4],
    title: "Idempotent consumers and deduplication",
    blurb: "Making at-least-once safe, which is what nearly every real system does instead of EOS.",
    tags: "idempotent deduplication dedupe natural-key upsert processed-ids state design pattern",
    extra: "Exactly-once gets the attention; idempotent handling of at-least-once is what production actually runs. Being able to design one is a stronger signal than being able to define the other.",
  },
  {
    n: "17", id: "17-transactions", part: PARTS[4],
    title: "Kafka transactions and read-committed",
    blurb: "The transactional producer, consume-transform-produce, and the boundary EOS does not cross.",
    tags: "transaction transactional-id read-committed isolation-level eos consume-transform-produce abort",
    extra: "The limit is the part worth knowing: Kafka's exactly-once covers Kafka-to-Kafka. The moment your consumer writes to Oracle, you are back to designing for idempotency.",
  },
  {
    n: "18", id: "18-ordering", part: PARTS[4],
    title: "Ordering: what Kafka guarantees and what it does not",
    blurb: "Per-partition ordering, and every way a system accidentally gives it up.",
    tags: "ordering per-partition global-order key retry max-in-flight parallelism guarantee",
    extra: "Kafka orders within a partition and nowhere else. Systems break when someone assumes global ordering, and the assumption is usually invisible until volume rises.",
  },

  /* ---------- Part 5 — Data on the wire ---------- */
  {
    n: "19", id: "19-serialization", part: PARTS[5],
    title: "Serialisation: JSON, Avro and Protobuf",
    blurb: "Serialisers, deserialisers, and the size and evolution cost of each format.",
    tags: "serialization serde avro protobuf json schema binary size deserializer poison-pill",
    extra: "A poison-pill message that no consumer can deserialise will stop a partition forever. The format choice is where that risk is either created or contained.",
  },
  {
    n: "20", id: "20-schema-registry", part: PARTS[5],
    title: "Schema Registry and schema evolution",
    blurb: "Subjects, versions, the magic byte, and how producers and consumers stop breaking each other.",
    tags: "schema-registry subject version confluent magic-byte avro evolution compatibility governance",
    req: "Apache Kafka — producer/consumer development, topic design, schema registry",
  },
  {
    n: "21", id: "21-compatibility", part: PARTS[5],
    title: "Compatibility modes, and the change that breaks consumers",
    blurb: "Backward, forward, full — and which one lets you deploy producers and consumers independently.",
    tags: "compatibility backward forward full transitive breaking-change default-value deployment-order",
    extra: "The compatibility mode decides the deployment order of your services. Teams discover this during an incident, having changed a field name on a Friday.",
  },
  {
    n: "22", id: "22-retention-compaction", part: PARTS[5],
    title: "Retention, compaction and tiered storage",
    blurb: "Time and size retention, log compaction as a table, and keeping seven years of events affordably.",
    tags: "retention compaction tombstone cleanup-policy segment tiered-storage disk gdpr delete",
    extra: "Log compaction turns a topic into a table keyed by message key, which is the mechanism behind KTables in Part 6 and behind most 'Kafka as a database' arguments.",
  },

  /* ---------- Part 6 — Kafka Streams ---------- */
  {
    n: "23", id: "23-streams-intro", part: PARTS[6],
    title: "Kafka Streams: the topology",
    blurb: "A library, not a cluster — the processor topology, tasks, and how parallelism is derived.",
    tags: "kafka-streams topology processor task library dsl stream-thread application-id",
    req: "Familiarity with Kafka tools (such as Kafka Streams, Connect, and Zookeeper)",
  },
  {
    n: "24", id: "24-ktable-kstream", part: PARTS[6],
    title: "KStream, KTable and the duality",
    blurb: "A stream of events and a table of latest-values are the same data, read two ways.",
    tags: "kstream ktable globalktable duality changelog aggregate join materialize semantics",
    extra: "Stream-table duality is the concept that makes streaming click, and the one that most reliably impresses in an architecture conversation.",
  },
  {
    n: "25", id: "25-windowing", part: PARTS[6],
    title: "Windowing, time and out-of-order events",
    blurb: "Event time vs processing time, tumbling and hopping windows, grace periods and late data.",
    tags: "window tumbling hopping session sliding event-time processing-time grace late-arrival watermark",
    extra: "Every real event stream is out of order. Systems that ignore this produce numbers that are quietly wrong, which is worse than producing none.",
  },
  {
    n: "26", id: "26-state-stores", part: PARTS[6],
    title: "State stores, RocksDB and interactive queries",
    blurb: "Where streaming state lives, how it survives a restart, and querying it directly.",
    tags: "state-store rocksdb changelog standby-replica interactive-query restore local-state disk",
    extra: "Stateful streaming keeps state on local disk with a changelog topic behind it. Understanding that recovery path is the difference between a restart taking seconds and taking an hour.",
  },
  {
    n: "27", id: "27-ksqldb", part: PARTS[6],
    title: "ksqlDB, and when SQL is enough",
    blurb: "Streaming SQL, what it is genuinely good at, and where you will outgrow it.",
    tags: "ksqldb sql streaming-sql push-query pull-query materialized-view prototype limits",
    extra: "Useful for the honest answer to 'do we need a Streams application for this' — often not. Knowing when a tool is unnecessary is a senior signal.",
  },

  /* ---------- Part 7 — Connect and the ecosystem ---------- */
  {
    n: "28", id: "28-connect", part: PARTS[7],
    title: "Kafka Connect: sources and sinks",
    blurb: "Moving data in and out without writing a producer, and the distributed worker model.",
    tags: "kafka-connect source sink connector worker distributed converter transform smt offset",
    req: "Familiarity with Kafka tools (such as Kafka Streams, Connect, and Zookeeper)",
  },
  {
    n: "29", id: "29-cdc-debezium", part: PARTS[7],
    title: "Change data capture with Debezium",
    blurb: "Turning an Oracle or MySQL binlog into a topic — the pattern behind most Kafka adoptions.",
    tags: "cdc debezium binlog logminer oracle mysql postgres snapshot outbox replication legacy",
    extra: "This is how Kafka usually arrives in an Italian company: not greenfield, but as a way to get events out of a gestionale nobody is allowed to rewrite.",
  },
  {
    n: "30", id: "30-rest-proxy-clients", part: PARTS[7],
    title: "REST Proxy, and clients in other languages",
    blurb: "librdkafka, the non-JVM clients, and integrating a system that cannot speak the protocol.",
    tags: "rest-proxy librdkafka python dotnet nodejs client protocol interoperability legacy",
    extra: "Advert 2 asks for application architectures. Architecture means the systems that cannot use the Java client, and the bridges built for them.",
  },
  {
    n: "31", id: "31-confluent-vs-apache", part: PARTS[7],
    title: "Confluent, Apache, Redpanda and the managed options",
    blurb: "What is open, what is licensed, what MSK and Confluent Cloud change — and the certification.",
    tags: "confluent apache redpanda msk cloud licence community-licence managed certification ccdak",
    req: "relevant certifications like Confluent Certified Developer for Apache Kafka",
  },

  /* ---------- Part 8 — Running it ---------- */
  {
    n: "32", id: "32-sizing-topics", part: PARTS[8],
    title: "Sizing: partitions, throughput and how many is too many",
    blurb: "Choosing a partition count you can live with, and the cost of getting it wrong in each direction.",
    tags: "sizing partition-count throughput capacity planning rebalance-time file-handles limits",
    extra: "Partition count is easy to increase and impossible to decrease, and increasing it breaks key-based ordering for existing keys. It deserves a chapter, not a default.",
  },
  {
    n: "33", id: "33-monitoring", part: PARTS[8],
    title: "Monitoring with Prometheus and Grafana",
    blurb: "The metrics that matter, JMX exporters, and alerting on lag rather than on CPU.",
    tags: "monitoring prometheus grafana jmx exporter metric alert lag under-replicated dashboard",
    req: "monitoring systems (e.g., Prometheus, Grafana)",
  },
  {
    n: "34", id: "34-security", part: PARTS[8],
    title: "Security: TLS, SASL and ACLs",
    blurb: "Encrypting the wire, authenticating clients, and authorising topics.",
    tags: "security tls ssl sasl scram kerberos acl authorization mtls principal encryption",
    extra: "A Kafka cluster with no ACLs lets any client read every topic, which is a compliance problem in exactly the banking and public-administration work these Milano adverts describe.",
  },
  {
    n: "35", id: "35-kubernetes", part: PARTS[8],
    title: "Kafka on Kubernetes and OpenShift",
    blurb: "Strimzi, operators, StatefulSets and persistent volumes — running a stateful system on K8s.",
    tags: "kubernetes openshift strimzi operator statefulset persistent-volume storage-class rolling-update",
    req: "Java 17 (Spring Boot), OpenShift/Kubernetes, Apache Kafka/RabbitMQ, MongoDB e Oracle DB",
  },
  {
    n: "36", id: "36-disaster", part: PARTS[8],
    title: "Disaster, replay and the day you must reprocess",
    blurb: "MirrorMaker, multi-region, and rebuilding downstream state from the log.",
    tags: "disaster-recovery mirrormaker replication multi-region replay reprocess backup rpo rto",
    extra: "The ability to replay is the reason to choose a log over a queue, and almost nobody rehearses it. Being the person who has is a differentiator.",
  },

  /* ---------- Part 9 — Designing event-driven systems ---------- */
  {
    n: "37", id: "37-event-driven", part: PARTS[9],
    title: "Event-driven architecture: the shape",
    blurb: "Choreography vs orchestration, coupling, and what you give up for what you gain.",
    tags: "event-driven architecture choreography orchestration coupling asynchronous eventual-consistency design",
    req: "a solid understanding of distributed systems and event-driven architecture",
  },
  {
    n: "38", id: "38-events-vs-commands", part: PARTS[9],
    title: "Events, commands and the naming that decides your coupling",
    blurb: "OrderPlaced vs SendInvoice — why the tense of a topic name is an architectural decision.",
    tags: "event command naming past-tense coupling notification event-carried-state-transfer contract",
    extra: "A topic named as a command turns a publisher into a caller and rebuilds the coupling Kafka was introduced to remove. It is a five-minute idea with a decade-long effect.",
  },
  {
    n: "39", id: "39-outbox", part: PARTS[9],
    title: "The outbox pattern and dual writes",
    blurb: "Why writing to the database and to Kafka in the same method is a bug, and the standard fix.",
    tags: "outbox dual-write atomicity transaction cdc debezium consistency pattern reliability",
    extra: "The dual-write problem is the most common correctness defect in event-driven systems and the one with the cleanest, most explainable solution. Ideal interview material.",
  },
  {
    n: "40", id: "40-saga", part: PARTS[9],
    title: "Sagas and distributed consistency",
    blurb: "Long-running transactions without a distributed lock, and compensating actions.",
    tags: "saga compensation distributed-transaction two-phase-commit consistency state-machine orchestrator",
    extra: "The follow-up question to microservices in every architecture interview: 'and how do you keep them consistent?' Sagas are the answer expected, with their costs named.",
  },
  {
    n: "41", id: "41-spring-kafka", part: PARTS[9],
    title: "Spring Kafka in practice",
    blurb: "@KafkaListener, containers, error handlers, retry topics and the dead-letter topic.",
    tags: "spring-kafka kafkalistener kafkatemplate container error-handler retry dlt dead-letter backoff",
    req: "Back-end development experience with Java and skills in modern technologies like Springboot and Kafka",
  },

  /* ---------- Part 10 — The human requirements ---------- */
  {
    n: "42", id: "42-agile-scrum", part: PARTS[10],
    title: "Agile, Scrum and the ceremonies",
    blurb: "Sprint, standup, refinement, retro — and what a team actually expects of you in each.",
    tags: "agile scrum sprint standup retrospective refinement story-point kanban jira ceremony",
    req: "Full-time participation in projects working collaboratively with development teams in Agile Scrum methodology",
  },
  {
    n: "43", id: "43-english", part: PARTS[10],
    title: "The English the advert means",
    blurb: "Standup English, code review English, and the twenty phrases that carry a technical call.",
    tags: "english inglese b2 standup call meeting review phrases vocabulary international",
    req: "Excellent knowledge of English language for international work environments",
  },
  {
    n: "44", id: "44-the-cv", part: PARTS[10],
    title: "The CV and the ATS",
    blurb: "Claiming Kafka honestly when your experience is a course and a local cluster.",
    tags: "cv curriculum ats screening keyword linkedin honesty overclaim portfolio evidence",
    extra: "This subject carries a specific risk the others do not: Kafka is easy to list and hard to defend. The chapter is about what you can truthfully say after this course, and what you cannot.",
  },
  {
    n: "45", id: "45-the-interview", part: PARTS[10],
    title: "The interview",
    blurb: "The system-design round, RAL and contracts, and the questions you must ask them.",
    tags: "interview colloquio system-design ral ccnl metalmeccanico contratto domande negoziazione",
    req: "the whole advert",
  },
];

/* Make available to plain <script> pages (no modules — this must run on file://).

   `self`, not `window`. They are the same object in a page, and in a SERVICE WORKER
   there is no `window` at all — so writing `window.CHAPTERS` here would throw the
   moment sw.js does importScripts() on this file. It does exactly that, so the
   offline precache list is generated from this array rather than being a second
   copy of it that goes stale. */
self.PARTS = PARTS;
self.CHAPTERS = CHAPTERS;
