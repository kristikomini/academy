/* ==========================================================================
   quizzes-3.js — the question bank, part 3.

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

  /* ------------------------------------------------------- 32-sizing-topics --- */
  "32-sizing-topics": [
    { q: "What is the practical starting point for choosing a partition count?",
      a: ["One partition per consumer instance you plan to run", "Measured per-consumer throughput divided into the peak you must sustain, plus headroom", "The number of brokers in the cluster", "A fixed default such as twelve"],
      c: 1,
      why: "The consumer side usually dominates. Doubling your estimate is cheap at these scales; discovering the ceiling during a traffic peak is not." },

    { q: "Why does the partition count deserve deliberate thought at topic creation?",
      a: ["It cannot be changed after the first record", "It is easy to increase, impossible to decrease, and increasing it breaks per-key ordering for existing keys", "It determines the replication factor", "It fixes the retention period"],
      c: 1,
      why: "Both directions are painful, which is exactly why ten minutes at design time is worth it." },

    { q: "What costs scale with the total partition count across a Kafka cluster?",
      a: ["Only disk usage", "Open file handles and memory per replica on brokers, client-side buffers and fetch state, and longer elections and rebalances", "Only network bandwidth", "Nothing; partitions are free"],
      c: 1,
      why: "KRaft raised the practical ceiling considerably, but it is a ceiling rather than an absence of cost." },

    { q: "A topic has 50 partitions and receives three records per second. What is that?",
      a: ["A sensible margin for growth", "Over-partitioning: pure overhead, and a mistake in the cheaper direction", "Required for the replication factor to work", "Optimal for consumer parallelism"],
      c: 1,
      why: "A few dozen partitions on a busy topic is ordinary; tens of thousands across a cluster needs a reason and a plan. Matching the count to the traffic is the point." },

    { q: "Can a topic's partition count be reduced in Kafka?",
      a: ["Yes, when the topic is idle", "No: the only route is producing into a new topic and migrating every consumer", "Yes, with a partition reassignment", "Yes, but only by an odd number"],
      c: 1,
      why: "There is no operation for it. Combined with the ordering break on increase, the initial number is close to a one-way door." },

    { q: "When should several event types share one topic rather than having one topic each?",
      a: ["Whenever they belong to the same domain", "When their relative order matters, such as an order's placed, paid and shipped events keyed by order id", "When they have the same schema", "When they are consumed by the same service"],
      c: 1,
      why: "Splitting them across topics discards the ordering guarantee you needed, because ordering is per partition and partitions belong to topics." },

    { q: "What is a sensible topic naming convention?",
      a: ["The consuming service's name", "domain.entity.event, such as sales.order.placed", "A short unique code per topic", "The producing application plus a sequence number"],
      c: 1,
      why: "Decide it once, because topic names are effectively permanent: renaming means migrating every producer and consumer. Prefer separate clusters to encoding the environment in the name." },

    { q: "What is the default advantage of a topic per event type?",
      a: ["Higher throughput", "Independent retention, schemas and access control", "Guaranteed ordering across types", "Fewer partitions overall"],
      c: 1,
      why: "It is the right default, and grouping is the deliberate exception you make when relative ordering between the types is part of the requirement." },
  ],

  /* ------------------------------------------------------- 33-monitoring --- */
  "33-monitoring": [
    { q: "How do Kafka brokers expose their metrics?",
      a: ["A Prometheus endpoint built in", "JMX MBeans, which a JMX exporter running as a Java agent translates for Prometheus", "A REST admin API", "Log files parsed by an agent"],
      c: 1,
      why: "Client-side metrics matter as much and are often forgotten; in Spring, Micrometer binds Kafka client metrics automatically." },

    { q: "Why use a dedicated lag exporter rather than relying on each application's own metrics?",
      a: ["It is more accurate", "It reads __consumer_offsets centrally and reports lag for every group, including applications that export nothing", "Application metrics cannot measure lag", "It reduces load on the brokers"],
      c: 1,
      why: "In practice most of the consumers on a cluster are ones you did not write, and those are exactly the ones you want visibility into." },

    { q: "Which value should under-replicated partitions have on a healthy cluster?",
      a: ["Below the replication factor", "Zero", "Equal to the partition count", "It varies with load"],
      c: 1,
      why: "Anything else means the ISR has shrunk and your durability guarantee is not what you configured. It is one of the three numbers worth paging on." },

    { q: "What does a non-zero offline partition count mean?",
      a: ["Some partitions are idle", "Data is unavailable right now: those partitions have no leader", "Replication is lagging", "Some brokers are rebalancing"],
      c: 1,
      why: "Unlike under-replicated partitions, which is a degraded durability warning, this is an active outage for the affected data." },

    { q: "Which of these should page somebody at night?",
      a: ["High broker CPU", "Consumer lag growing steadily on a consumer that matters", "A high message rate", "Disk I/O above a threshold"],
      c: 1,
      why: "High CPU with healthy latency is Kafka working. Alert on symptoms a user would notice and on durability that has degraded." },

    { q: "Why is time-based lag preferable to a record count in an alert?",
      a: ["It is cheaper to compute", "'Billing is twenty minutes behind' is actionable and comprehensible, while 'lag is 847,000' means nothing without knowing the rate", "Record counts are not exported", "Time-based lag is less noisy"],
      c: 1,
      why: "It is the Kafka instance of the general rule: alert on what a person would notice rather than on a number that needs context to interpret." },

    { q: "Why should you alert on a consumer group disappearing from the metrics?",
      a: ["It indicates a broker failure", "A group that has stopped entirely produces no growing lag, so total failure looks like perfect health", "It means offsets have expired", "It signals a rebalance in progress"],
      c: 1,
      why: "It is the blind spot in lag-based alerting, and closing it costs one extra rule." },

    { q: "Which metric shows the rebalance loop from chapter 13 as a picture?",
      a: ["records-lag-max", "The consumer rebalance rate", "under-replicated-partitions", "request-latency-avg"],
      c: 1,
      why: "A sustained non-zero rebalance rate on a group that should be stable is the signature, and it is far easier to spot on a graph than in log lines." },
  ],

  /* ------------------------------------------------------- 34-security --- */
  "34-security": [
    { q: "Which three concerns must be configured separately to secure a Kafka cluster?",
      a: ["Firewall, VPN and TLS", "Encryption in transit, authentication of clients, and authorisation of operations", "Replication, retention and quotas", "Certificates, keystores and truststores"],
      c: 1,
      why: "Having one does not give you the others, and stopping after the first two is the mistake that leaves every authenticated client able to read every topic." },

    { q: "Which SASL mechanism is the usual default choice for Kafka authentication?",
      a: ["SASL/PLAIN", "SASL/SCRAM", "SASL/GSSAPI", "SASL/OAUTHBEARER"],
      c: 1,
      why: "SCRAM is salted challenge-response. PLAIN sends credentials and must only ever be used over TLS; GSSAPI is Kerberos, common in Italian banks and public administration." },

    { q: "What does allow.everyone.if.no.acl.found default to, and why does it matter?",
      a: ["false, so nothing is permitted until granted", "true, so a cluster with authentication but no ACLs lets any authenticated client read every topic", "true, but only for internal topics", "It depends on the authoriser implementation"],
      c: 1,
      why: "That is why TLS plus SASL is not security on its own. It is a compliance problem in exactly the banking and public administration work the Milano adverts describe." },

    { q: "Which ACLs does a Kafka consumer need?",
      a: ["Read on the topic only", "Read on the topic and Read on its consumer group", "Read on the topic and Write on the offsets topic", "Describe on the cluster and Read on the topic"],
      c: 1,
      why: "Missing the group ACL produces an authorisation error naming a resource people do not expect, which is why it is worth knowing before you meet it." },

    { q: "What extra ACL does a transactional producer require?",
      a: ["Read on the topic", "Write on its transactional.id", "Describe on the consumer group", "Alter on the cluster"],
      c: 1,
      why: "It is the resource type people forget exists, alongside topics, groups and the cluster itself." },

    { q: "Why use prefixed ACLs?",
      a: ["They evaluate faster", "A team can own an entire domain such as sales.* rather than needing a rule per topic", "They are required for wildcard principals", "They apply to consumer groups automatically"],
      c: 1,
      why: "Per-topic rules do not survive contact with a growing system: either they are not maintained, or somebody grants a wildcard to stop maintaining them." },

    { q: "What is the consequence of setting allow.everyone.if.no.acl.found=false on a running cluster?",
      a: ["Nothing until the brokers restart", "Everything not yet explicitly granted is denied, so it is a migration rather than a switch", "Existing connections are unaffected permanently", "Only new topics are affected"],
      c: 1,
      why: "Grant the ACLs first, verify them, then flip the flag. Doing it the other way round is an outage with a very simple root cause." },

    { q: "Does TLS protect Kafka data at rest?",
      a: ["Yes, records are stored encrypted", "No: TLS protects the wire, and anyone with access to a broker's disk or a backup reads the records", "Yes, if SASL/SCRAM is also enabled", "Only for compacted topics"],
      c: 1,
      why: "Disk-level encryption covers the medium; field-level protection means encrypting in the producer and decrypting in the consumer, with key management and the loss of filtering on those fields." },
  ],

  /* ------------------------------------------------------- 35-kubernetes --- */
  "35-kubernetes": [
    { q: "Why must Kafka brokers run as a StatefulSet rather than a Deployment?",
      a: ["Deployments cannot mount volumes", "Brokers have stable identity, own their partition data, and must be individually addressable", "StatefulSets schedule faster", "Deployments do not support probes"],
      c: 1,
      why: "Broker 2 is not broker 5: partition assignments and replica placement refer to specific ids, and each must reattach to the same volume after a restart." },

    { q: "Why does every Kafka broker need an individually addressable endpoint?",
      a: ["For health checking", "Because clients connect directly to the leader of each partition after fetching metadata", "For inter-broker replication only", "To support TLS certificates per broker"],
      c: 1,
      why: "It is the advertised.listeners problem from chapter 03, now with a Kubernetes Service and possibly a service mesh in the way." },

    { q: "What is Strimzi?",
      a: ["A Kafka client library", "A Kubernetes operator that manages Kafka clusters declaratively, and the basis of Red Hat's AMQ Streams", "A monitoring stack for Kafka", "A managed Kafka service"],
      c: 1,
      why: "It manages StatefulSets, certificates, ordered rolling upgrades and rebalancing. Attempting Kafka on Kubernetes without an operator means writing that logic yourself." },

    { q: "What is the strongest argument for using a Kafka operator, beyond cluster management?",
      a: ["It reduces broker memory usage", "Topics and users become Kubernetes resources, so topic configuration and ACLs live in git and are applied by your pipeline", "It enables tiered storage", "It removes the need for a schema registry"],
      c: 1,
      why: "It solves the problem from chapters 28 and 34 of configuration existing only inside a running cluster with no review and no history." },

    { q: "Why does storage class matter so much for Kafka on Kubernetes?",
      a: ["It determines the maximum partition count", "Kafka wants fast local disk; network storage adds latency to every write and every replication fetch", "It controls the retention policy", "It decides the replication factor"],
      c: 1,
      why: "It is the single configuration choice with the largest effect on cluster performance, and it is easy to get wrong by accepting a cluster default." },

    { q: "What happens if a broker's volume cannot reattach because the pod was rescheduled to another zone?",
      a: ["The broker serves from the other replicas transparently", "It comes up empty and must re-replicate everything, which is hours of degraded durability on a large cluster", "The StatefulSet blocks the pod from starting", "Kubernetes migrates the volume automatically"],
      c: 1,
      why: "Pin brokers to zones and match volumes to them. It is the failure mode that turns a routine node replacement into an incident." },

    { q: "What is the honest framing of 'should we run Kafka ourselves on Kubernetes'?",
      a: ["A technical question about cluster capability", "A team-capacity question: can we is yes, should we depends on whether somebody will be on call for it", "A cost question only", "A compliance question"],
      c: 1,
      why: "Managed makes sense when Kafka is infrastructure rather than a product for you, which for most of the companies behind these adverts it is." },

    { q: "Which OpenShift constraint also applies to your own application images alongside the brokers?",
      a: ["Images must come from the internal registry", "Security Context Constraints run containers with an arbitrary non-root UID", "Only Routes may expose services", "Persistent volumes must be ReadWriteMany"],
      c: 1,
      why: "The operator handles it for the brokers; your own images still have to be built for a UID you do not know, with a group-writable working directory." },
  ],

  /* ------------------------------------------------------- 36-disaster --- */
  "36-disaster": [
    { q: "What two conditions make replaying a Kafka topic safe?",
      a: ["A stopped consumer group and a dry run", "Idempotent consumers, and retention that reaches back far enough to cover the period", "Exactly-once semantics and transactions", "A second cluster and MirrorMaker"],
      c: 1,
      why: "Without idempotency, reprocessing doubles every side effect. Without retention, the data is simply gone and the discussion ends there." },

    { q: "Why replay into a new topic or a new consumer group rather than overwriting in place?",
      a: ["It is faster", "You build the corrected projection alongside the broken one, compare them, and only then switch, which makes the operation reversible", "Kafka forbids resetting an active group", "It avoids a rebalance"],
      c: 1,
      why: "It converts an irreversible operation into a reversible one, and it is the version of this answer that sounds like experience." },

    { q: "What must you check before replaying a month of events through a consumer?",
      a: ["The partition count", "Which external side effects it performs, and disable or gate the ones that must not repeat", "The schema version", "The consumer group's assignor"],
      c: 1,
      why: "Reprocessing a month of OrderPlaced through a consumer that sends confirmation emails sends a month of emails. Obvious afterwards, routinely forgotten beforehand." },

    { q: "Which flag should you use before executing a consumer group offset reset?",
      a: ["--force", "--dry-run", "--verbose", "--all-topics"],
      c: 1,
      why: "Always look before you move a production group. The command will happily reset to the earliest offset of a topic with a year of retention." },

    { q: "What does MirrorMaker 2 replicate between clusters?",
      a: ["Only topic data", "Topics, configuration and consumer-group offsets, asynchronously", "The full broker state, synchronously", "Only the metadata log"],
      c: 1,
      why: "Asynchronous means a failover loses whatever had not replicated, so an RPO of zero is not on offer and saying so early avoids designing toward a promise you cannot keep." },

    { q: "What is the genuinely hard part of failing consumers over to a mirrored cluster?",
      a: ["Reconfiguring bootstrap.servers", "Offset translation: a record has a different offset on the target cluster, so a consumer cannot resume at the same number", "Recreating the consumer groups", "Re-registering the schemas"],
      c: 1,
      why: "MirrorMaker 2 maintains a mapping for it, and whether your consumers use it correctly is the thing nobody tests. Confluent's Cluster Linking preserves offsets directly instead." },

    { q: "What do RPO and RTO determine?",
      a: ["The monitoring thresholds", "The architecture: asynchronous replication makes an RPO of zero impossible, so stating them early avoids an undeliverable promise", "The retention configuration only", "The number of mirrored clusters"],
      c: 1,
      why: "They are inputs to the design rather than outputs of it, and defining them explicitly is what turns disaster recovery from a document into a decision." },

    { q: "What is the most valuable artefact of rehearsing a replay?",
      a: ["An updated runbook", "A measured number: how long a full replay of this topic actually takes", "A list of the consumers involved", "Confirmation that retention is sufficient"],
      c: 1,
      why: "That number is worth more in an incident than any runbook, and it is the kind of concrete detail that makes an interview answer credible." },
  ],

  /* ------------------------------------------------------- 37-event-driven --- */
  "37-event-driven": [
    { q: "Which couplings does an event-driven architecture remove?",
      a: ["All of them", "Address coupling and temporal coupling, but not schema coupling", "Only temporal coupling", "Schema coupling and address coupling"],
      c: 1,
      why: "Everyone still agrees on the event's shape, which is why the schema registry and compatibility chapters exist. Being precise about which couplings go is what makes the answer credible." },

    { q: "What is the practical benefit that most changes how a team works?",
      a: ["Higher throughput", "Adding a consumer requires no change to the producer", "Lower latency for the caller", "Simpler error handling"],
      c: 1,
      why: "A new service wanting order events subscribes, and nobody deploys anything else. That is the thing worth naming rather than the abstract decoupling." },

    { q: "What is the difference between choreography and orchestration?",
      a: ["Choreography is synchronous, orchestration asynchronous", "In choreography each service reacts to events and the process emerges; in orchestration one component drives the steps", "Choreography uses Kafka, orchestration uses HTTP", "Orchestration is always slower"],
      c: 1,
      why: "Choreography keeps services independent and makes the process invisible; orchestration puts it in one readable, testable place at the cost of a component that knows about everyone." },

    { q: "Which rule best decides between choreography and orchestration?",
      a: ["Choreography for internal services, orchestration for external", "Choreography for notification; orchestration for a business process with a defined outcome somebody must own", "Orchestration whenever there are more than two services", "Choreography whenever using Kafka"],
      c: 1,
      why: "'An order was placed' broadcast to whoever cares is choreography. 'Take payment, reserve stock, book shipping, compensate on failure' is a saga with an owner." },

    { q: "What is the simple test that a choreographed process has become unmanageable?",
      a: ["More than five services are involved", "Nobody can draw the flow on a whiteboard, because the process exists only as the sum of reactions", "The average latency exceeds a threshold", "Two services consume the same topic"],
      c: 1,
      why: "At that point introducing an orchestrator is a correction rather than a retreat, and every change has become an archaeology exercise." },

    { q: "Why is eventual consistency a product decision rather than only a technical one?",
      a: ["It affects database licensing", "Someone must decide whether a customer seeing a stale order list for a second is acceptable, and how the UI handles it", "It determines the replication factor", "It changes the schema compatibility mode"],
      c: 1,
      why: "Presenting it as purely technical is how teams ship a system whose behaviour nobody signed off on." },

    { q: "What becomes a requirement rather than a nicety once the system is event-driven?",
      a: ["A schema registry", "Distributed tracing, because the failure now happens elsewhere, later, on another thread", "Exactly-once semantics", "A service mesh"],
      c: 1,
      why: "Debugging an asynchronous flow without a propagated trace context is guesswork, which is why the trace must travel in the message headers." },

    { q: "What is the honest answer to 'should we go event-driven'?",
      a: ["Yes, it is the modern approach", "It buys decoupling and independent evolution and charges you consistency and observability, so it is worth it when several consumers need the same facts", "Only for systems above a certain scale", "No, unless you already run Kafka"],
      c: 1,
      why: "It is the same shape as the microservices answer: a response to a problem you can name, rather than a default." },
  ],

  /* ------------------------------------------------------- 38-events-vs-commands --- */
  "38-events-vs-commands": [
    { q: "What distinguishes an event from a command?",
      a: ["Events are asynchronous, commands synchronous", "An event is a fact in the past tense with no intended recipient; a command is an instruction addressed to someone and can be refused", "Events carry state, commands carry ids", "Commands are always HTTP"],
      c: 1,
      why: "That difference in addressing is the entire architectural consequence: a publisher of events knows nothing about consumers, while a sender of commands necessarily knows its recipient." },

    { q: "What does a topic named invoice.send tell you about the design?",
      a: ["That invoicing is event-driven", "That it is a command channel: the publisher has decided what should happen and who should do it, so it is coupled to the invoicing service", "That the topic is compacted", "That the consumer group is named invoice"],
      c: 1,
      why: "A topic named sales.order.placed is a fact, and the decision to invoice then lives in the invoicing service, where it belongs." },

    { q: "Why is a command-shaped topic a subtle problem rather than an obvious one?",
      a: ["It fails under load", "It works perfectly and simply does not deliver the decoupling everyone assumes it does", "It cannot be compacted", "It breaks ordering"],
      c: 1,
      why: "The discovery comes two years later, when the invoicing rule must change and it turns out to live in the ordering service." },

    { q: "What is the recommended topic naming shape for events?",
      a: ["service.action", "domain.entity.past-tense-verb, such as sales.order.placed", "verb.entity, such as create.order", "entity.version.event"],
      c: 1,
      why: "Keeping the tense honest is what makes the architecture follow the naming rather than drift away from it." },

    { q: "A 'command' topic whose sender waits for a reply on a second topic is what?",
      a: ["A well-designed asynchronous request", "A synchronous call implemented with two topics: the latency of messaging, the coupling of RPC, correlation ids to manage and no timeout semantics", "The standard saga pattern", "An acceptable use of Kafka for request-response"],
      c: 1,
      why: "If you need a request and a response, use HTTP, and say so. Knowing when not to use Kafka is part of the answer." },

    { q: "What is the difference between notification and event-carried state transfer?",
      a: ["Notification is push, state transfer is pull", "Notification says 'order 42 changed, go and look', reintroducing a callback; state transfer puts the relevant state in the event so consumers need no callback", "Notification uses compacted topics", "State transfer requires a schema registry"],
      c: 1,
      why: "Notification is tiny and brings back temporal coupling plus a load spike on the publisher whenever it emits." },

    { q: "Why should you not publish the entire aggregate in every event?",
      a: ["It exceeds the message size limit", "It couples every consumer to your full internal model, which is schema coupling at maximum strength", "It cannot be compacted", "It slows down serialisation"],
      c: 1,
      why: "Publish the fields consumers actually need, plus a version number so they can discard out-of-order arrivals." },

    { q: "Is sending a command over Kafka ever legitimate?",
      a: ["No, Kafka is only for events", "Yes: it is a reasonable way to get durability and back-pressure for a work queue, provided the naming is honest about what it is", "Only with transactions enabled", "Only between services owned by the same team"],
      c: 1,
      why: "What is not legitimate is confusing the two, because the naming then lies about the coupling and the design is misread by everyone who comes after." },
  ],

  /* ------------------------------------------------------- 39-outbox --- */
  "39-outbox": [
    { q: "What is the dual-write problem?",
      a: ["Writing the same record to two partitions", "Writing to a database and to Kafka in one method: there are three outcomes, and the third is that only one succeeds", "Two producers writing to the same key", "A consumer writing to two topics"],
      c: 1,
      why: "There is no transaction spanning your database and Kafka, and that third case is silent." },

    { q: "You save the order, then publish, and the process crashes in between. What is the result?",
      a: ["The order is rolled back automatically", "The order exists and nobody was told, so the invoice is never raised", "The event is published on restart", "Kafka detects the gap and requests a resend"],
      c: 1,
      why: "Reversing the order gives the opposite failure: consumers acting on an order that does not exist. Neither ordering is safe." },

    { q: "Why is publishing to Kafka inside the database transaction the most dangerous variant?",
      a: ["It holds the transaction open too long", "The record is visible to consumers immediately, and then the transaction can roll back, leaving consumers acting on something that never happened", "It cannot be rolled back by Kafka", "It causes a deadlock"],
      c: 1,
      why: "At least the other ordering fails in a direction you can detect. Here there is nothing to correct it with." },

    { q: "What does the outbox pattern do?",
      a: ["Buffers events in memory until the transaction commits", "Writes the event into a table in the same local transaction as the business change, and relays it to Kafka separately", "Uses Kafka transactions to include the database write", "Publishes twice and deduplicates downstream"],
      c: 1,
      why: "One atomic write, no distributed transaction. It converts an impossible problem into two solved ones: a local transaction and idempotent consumption." },

    { q: "How is the outbox table relayed to Kafka?",
      a: ["By the application's request thread, after commit", "By CDC reading the transaction log, or by a poller selecting unpublished rows", "By a Kafka Connect sink connector", "By a database trigger writing directly to the broker"],
      c: 1,
      why: "Debezium has a dedicated outbox transform for the CDC route. Either way the relay is at-least-once, which is fine because consumers are idempotent." },

    { q: "Why does the outbox relay not need exactly-once delivery?",
      a: ["Because the database guarantees it", "Because consumers are idempotent, so publishing an event twice is harmless", "Because CDC deduplicates automatically", "Because the outbox table has a unique constraint"],
      c: 1,
      why: "That is the elegance of the design: at-least-once relay plus idempotent consumption is equivalent to exactly-once effect, without any distributed transaction." },

    { q: "What preserves per-entity ordering when relaying from an outbox?",
      a: ["Reading rows in primary key order only", "Reading in insertion order and using the aggregate id as the Kafka message key", "Using a single-partition topic", "Enabling transactions on the relay producer"],
      c: 1,
      why: "The key chooses the partition, so all events for one aggregate stay ordered while different aggregates proceed in parallel." },

    { q: "Which alternative removes the dual-write problem entirely rather than solving it?",
      a: ["Kafka transactions", "Event sourcing, where the events are the state so there is no second write to make", "Two-phase commit", "Synchronous publishing with retries"],
      c: 1,
      why: "It is a much larger commitment that solves this as a side effect. The outbox is the middle path and the one that fits an existing application." },
  ],

  /* ------------------------------------------------------- 40-saga --- */
  "40-saga": [
    { q: "Why is two-phase commit avoided across microservices?",
      a: ["It is not implemented by any modern database", "It holds locks across services for the duration, blocks if the coordinator fails at the wrong moment, and requires every participant to support it", "It is slower than a saga by a constant factor", "It cannot span more than two services"],
      c: 1,
      why: "Kafka and most modern services do not support it at all, which settles the question before the trade-offs are even reached." },

    { q: "What replaces atomicity in a saga?",
      a: ["A distributed lock held for the duration", "A sequence of local transactions, each with a compensating action that semantically undoes it", "A single transaction on a shared database", "Retrying until every step succeeds"],
      c: 1,
      why: "There is no rollback; there is a refund. Compensation is a business operation, visible to the customer, rather than a technical one." },

    { q: "Which saga style should you choose for a process with three or more steps and a defined outcome?",
      a: ["Choreographed, to keep services independent", "Orchestrated, so the state machine is readable and testable in one place", "Either; the difference is stylistic", "Neither; use a distributed transaction"],
      c: 1,
      why: "In choreography the process exists nowhere, so nobody can answer 'where did this order get stuck' without reading five services." },

    { q: "Where should irreversible steps be placed in a saga?",
      a: ["First, so failures happen early", "Last, after everything that might fail has already succeeded", "In parallel with the reversible ones", "In a separate saga"],
      c: 1,
      why: "You cannot un-send an email, un-ship a parcel or un-tell a customer. A saga that emails in step two and fails in step four has no way back." },

    { q: "What must be true of every saga step and every compensation?",
      a: ["They must be synchronous", "They must be idempotent, because retries are certain", "They must complete within one second", "They must write to the same database"],
      c: 1,
      why: "It is the same property the consumers need, for the same reason: at-least-once delivery means every handler will eventually run twice." },

    { q: "Where should saga state be held?",
      a: ["In memory in the orchestrator, for speed", "Persisted, so a crash resumes the saga rather than abandoning it mid-flight", "In the Kafka topic itself", "In the consumer group's offsets"],
      c: 1,
      why: "An orchestrator that loses its state on restart leaves business processes half-completed with nothing tracking them, which is worse than not having one." },

    { q: "What must a realistic saga design include that is often forgotten?",
      a: ["A timeout on the whole saga", "A manual intervention queue for when compensation itself fails", "A second orchestrator for redundancy", "A compensating action for each compensation"],
      c: 1,
      why: "At that point automation has run out and a human must look. A design with no story for 'compensation also failed' is incomplete, and interviewers notice when you volunteer it." },

    { q: "What do sagas actually achieve?",
      a: ["They make distributed failure impossible", "They make failure bounded and visible, rather than atomic", "They provide ACID guarantees across services", "They eliminate the need for idempotency"],
      c: 1,
      why: "Saying that plainly is what distinguishes a considered answer from a memorised pattern name." },
  ],

  /* ------------------------------------------------------- 41-spring-kafka --- */
  "41-spring-kafka": [
    { q: "What runs the poll loop behind a Spring @KafkaListener?",
      a: ["The application's request thread pool", "A MessageListenerContainer, which owns the consumer, the commits and the error handling", "The Kafka broker", "A scheduled task"],
      c: 1,
      why: "Its concurrency setting controls how many consumer threads the listener runs, capped as always by the partition count." },

    { q: "What are Spring Boot's defaults for Kafka consumer commits?",
      a: ["Auto-commit enabled on a five-second timer", "enable.auto.commit=false with AckMode.BATCH, committing after the batch is processed", "Manual commits required, with no default", "Commit per record, synchronously"],
      c: 1,
      why: "That is the at-least-once behaviour chapter 12 argues for, so the default is right here. Your handler still has to be idempotent." },

    { q: "What is true of the thread a @KafkaListener method runs on?",
      a: ["It has the SecurityContext of the original request", "It is the container's thread: no SecurityContext, no request-scoped beans, and the transaction boundary is yours to declare", "It is a virtual thread by default", "It is shared with the scheduler"],
      c: 1,
      why: "Injecting a request-scoped bean fails at runtime, and code assuming an authenticated principal finds none." },

    { q: "Which Spring Kafka component publishes unprocessable records to a dead-letter topic?",
      a: ["RetryTemplate", "DeadLetterPublishingRecoverer, used as the recoverer of a DefaultErrorHandler", "ErrorHandlingDeserializer", "SeekToCurrentErrorHandler only"],
      c: 1,
      why: "It publishes to topic.DLT with the exception in the headers, which is what makes the dead-letter topic diagnosable rather than a silent bucket." },

    { q: "Why classify exceptions with addNotRetryableExceptions?",
      a: ["To reduce log noise", "So failures that will fail identically forever, such as deserialisation or validation errors, go straight to the DLT instead of retrying", "To enable exponential backoff", "To route different exceptions to different topics"],
      c: 1,
      why: "Retrying a deserialisation failure five times is a loop, not a recovery, and it delays every record behind it for no benefit." },

    { q: "What does @RetryableTopic trade away?",
      a: ["Throughput, for reliability", "Ordering: a retried record is processed after records that came behind it", "Exactly-once semantics", "The ability to use a DLT"],
      c: 1,
      why: "It gives non-blocking retries through timed retry topics, which is right when throughput matters and wrong when a status lifecycle must stay in sequence." },

    { q: "Why is a dead-letter topic that nobody monitors described as 'a delete with extra steps'?",
      a: ["Records expire from it faster", "Records land there silently, the consumer keeps up, every dashboard is green, and the business data is quietly incomplete", "Kafka deletes DLT topics automatically", "The DLT has no retention configured"],
      c: 1,
      why: "Alert on any record arriving in a DLT. It should be rare enough that an alert is reasonable, and if it is not, that is itself the finding." },

    { q: "Which tool lets you unit-test a Kafka Streams topology with no broker at all?",
      a: ["EmbeddedKafka", "TopologyTestDriver", "MockConsumer", "Testcontainers"],
      c: 1,
      why: "It runs the topology in milliseconds, which is the capability ksqlDB lacks and a good reason to prefer Streams for anything whose correctness matters." },
  ],

  /* ------------------------------------------------------- 42-agile-scrum --- */
  "42-agile-scrum": [
    { q: "What is a stand-up for?",
      a: ["Reporting progress to a manager", "Synchronising between peers, which is why blockers matter more than a list of activity", "Assigning tasks for the day", "Reviewing yesterday's commits"],
      c: 1,
      why: "Lead with what is blocking you, because that is the part somebody else in the room can act on." },

    { q: "Which refinement questions matter most for event-driven work?",
      a: ["Which framework version to use", "Who else consumes this event, what happens if it arrives twice, and does the order matter", "How many story points it is worth", "Which team owns the topic"],
      c: 1,
      why: "Asking those before anyone estimates is most of what a good backend developer contributes to a planning meeting." },

    { q: "What do story points measure?",
      a: ["Hours of effort", "Relative size: complexity, uncertainty and effort together", "Business value", "Individual productivity"],
      c: 1,
      why: "Velocity is a planning input for a team, not a measure of a person, and comparing two teams' velocity is an organisational problem rather than an estimation one." },

    { q: "What is the better answer than a guess when you cannot estimate?",
      a: ["Take the team's average", "Ask for a time-boxed spike first", "Estimate high to be safe", "Split the task arbitrarily"],
      c: 1,
      why: "A guess dressed as an estimate becomes a commitment. Saying you do not know enough yet reads as experience rather than evasion." },

    { q: "When should slippage be flagged?",
      a: ["At the end of the sprint", "As soon as you know, because early notice preserves the options to rescope, add help or move the date", "Only if the sprint goal is threatened", "In the retrospective"],
      c: 1,
      why: "Nobody minds a task taking longer. They mind finding out too late to react to it." },

    { q: "How should you present your process experience to an Italian software house?",
      a: ["As strict Scrum, since it is the standard", "Describe how you actually worked, then ask how they work", "Emphasise Agile certifications", "Say process is secondary to code quality"],
      c: 1,
      why: "Most run something between Scrum and fixed-date commessa work, and a candidate who insists on doctrine reads as someone who will be difficult about reality." },

    { q: "Why is documenting an event's contract a disproportionately visible contribution?",
      a: ["It is required by the schema registry", "An event is a public API with more consumers than an HTTP endpoint and usually less documentation", "It speeds up onboarding of new developers", "It is needed for compliance"],
      c: 1,
      why: "The schema, the key and the ordering guarantee are the three things other teams need and almost never find written down." },

    { q: "What makes a pull request easy to review?",
      a: ["A detailed description of every change", "Being small enough that it is actually read rather than approved", "Including the tests in a separate commit", "Being submitted early in the sprint"],
      c: 1,
      why: "A review that rubber-stamps is worse than no review, because it creates the appearance of a check that did not happen." },
  ],

  /* ------------------------------------------------------- 43-english --- */
  "43-english": [
    { q: "What English level do these Kafka adverts practically require?",
      a: ["Native fluency", "About B2: follow a technical discussion, disagree clearly, and write documentation someone can act on", "Reading comprehension only", "C1 with a certificate"],
      c: 1,
      why: "The failure companies screen for is going silent in a call because you did not understand and did not say so, not imperfect grammar." },

    { q: "Which Kafka terms stay English in an Italian technical conversation?",
      a: ["All of them, including partition", "Topic, offset, consumer group, lag and replay; partizione is the one that does translate", "None; Italian equivalents are standard", "Only the product names"],
      c: 1,
      why: "Translating lag as 'lo scarto' or the log as 'il registro' marks you instantly as someone who learned the subject from a textbook rather than from a codebase." },

    { q: "What does 'eventually' mean in English?",
      a: ["Possibly, or if needed", "In the end, or finally", "Occasionally", "Currently"],
      c: 1,
      why: "A false friend for eventualmente. The confusion changes a hedge into a commitment, which matters when you are describing what a system will do." },

    { q: "What does 'actually' mean in English?",
      a: ["Currently", "In reality, or in fact", "Eventually", "Actively"],
      c: 1,
      why: "A false friend for attualmente. 'Actually we are on Kafka 3.6' sounds like a correction rather than a statement of fact." },

    { q: "What is the most useful habit in an English technical call?",
      a: ["Speaking slowly and carefully", "Asking for repetition without apologising", "Taking notes and replying by email afterwards", "Avoiding technical vocabulary"],
      c: 1,
      why: "'Sorry, could you repeat that?' and 'Just to confirm, you mean X?' are ordinary professional sentences that native speakers use with each other constantly." },

    { q: "How should written technical English be structured for an international team?",
      a: ["Background first, conclusion last", "Conclusion first, then detail, in short sentences", "As a single detailed paragraph", "As bullet points with no prose"],
      c: 1,
      why: "People skim. Short sentences and simple tenses are what good technical writing looks like in any language." },

    { q: "What should an asynchronous message across time zones include?",
      a: ["A full history of the problem", "What you need and by when", "A proposed call time", "An apology for the interruption"],
      c: 1,
      why: "A reply may be twelve hours away, so a message that does not state the deadline costs a full day rather than an hour." },

    { q: "How should you answer 'how would you describe your English level'?",
      a: ["State a CEFR level and move on", "Answer in English, briefly, with evidence, and name the weaker skill and how you handle it", "Say it is sufficient for the role", "List any certificates you hold"],
      c: 1,
      why: "Naming the weaker skill and your strategy for it demonstrates the ability while describing it, which a level claim cannot do." },
  ],

  /* ------------------------------------------------------- 44-the-cv --- */
  "44-the-cv": [
    { q: "What does an applicant tracking system read from a CV?",
      a: ["The rendered page as an image", "The extracted text layer, which a multi-column layout can scramble", "Only the file metadata", "A generated summary"],
      c: 1,
      why: "Single column, real text, standard headings. If the text cannot be extracted cleanly, a human may never see the document at all." },

    { q: "What is the risk specific to putting Kafka on a CV?",
      a: ["It is too niche to be recognised", "It is easy to list and hard to defend, and the interviewer is often the person who runs it", "ATS systems do not index it", "It implies you want a data engineering role"],
      c: 1,
      why: "The follow-ups are specific: what were your partitions keyed on, what happened when a consumer fell behind, how did you handle duplicates." },

    { q: "Which is the stronger CV line?",
      a: ["Apache Kafka (advanced)", "Built an event-driven flow on Kafka: 4 topics, Avro with Schema Registry, an idempotent consumer keyed on event id, replay from a chosen offset", "Experience with message brokers including Kafka and RabbitMQ", "Kafka, Kafka Streams, Kafka Connect, ksqlDB"],
      c: 1,
      why: "Every noun in it is defensible after this course, and each invites a question you can answer. A bare skills-list entry invites the same question with nothing prepared." },

    { q: "What is the test for whether a claim belongs on your CV?",
      a: ["Whether the advert asks for it", "Whether you would be happy discussing it for five minutes", "Whether you used it in the last two years", "Whether it is on your certificate"],
      c: 1,
      why: "A shorter CV you can defend beats a longer one you cannot, because an inflated claim makes your true ones suspect." },

    { q: "Which ATS technique is legitimate?",
      a: ["Hidden white text with extra keywords", "Using the advert's exact wording for things you have genuinely done", "Repeating keywords in the footer", "An invisible keyword layer behind the header"],
      c: 1,
      why: "Hidden text is detectable, and being caught is disqualification rather than a lower score." },

    { q: "What should a portfolio Kafka project contain to be convincing?",
      a: ["The largest possible throughput benchmark", "A producer, two consumer groups on the same topic, an idempotent handler with a dedup table, a registered schema, a DLT, and a README explaining the decisions", "Every component of the ecosystem", "A Kubernetes deployment of a three-broker cluster"],
      c: 1,
      why: "It demonstrates precisely what the adverts cannot verify and the interview will probe: deliberate key choice, understanding of at-least-once, and knowing what a DLT is for." },

    { q: "How should the project be described?",
      a: ["As a tutorial you completed", "As engineering: problem, decision, trade-off", "By listing the technologies used", "By the time it took to build"],
      c: 1,
      why: "A named trade-off is what makes it sound like engineering. 'I used orderId as the key because I need per-order ordering, and the risk is a hot partition if one customer dominates' is the shape." },

    { q: "Why should the project run with one command?",
      a: ["To demonstrate Docker knowledge", "Because a reviewer who cannot run it will not read it, and a working link is evidence you finish things", "Because ATS systems check the repository", "To reduce the README length"],
      c: 1,
      why: "A dead link or a project that will not start is worse than no project, because it demonstrates the opposite of the thing you were trying to show." },
  ],

  /* ------------------------------------------------------- 45-the-interview --- */
  "45-the-interview": [
    { q: "What should you establish first in a system-design round?",
      a: ["The technology choices", "Scale, staleness tolerance and ordering requirements, because those answers determine the design", "The team structure", "The deployment target"],
      c: 1,
      why: "Asking them shows you know the design follows from them. Committing to a shape before asking is the most common way the round goes wrong." },

    { q: "Which four moves cover most of what a Kafka design round is assessing?",
      a: ["Naming the broker version, the client library, the serialiser and the compression codec", "Choosing the key and saying what it makes ordered, stating that delivery is at-least-once so consumers are idempotent, raising the dual-write problem, and answering how you would know it was broken", "Drawing the topology, sizing the cluster, choosing the retention and setting the replication factor", "Describing Streams, Connect, ksqlDB and the registry"],
      c: 1,
      why: "Those four come from chapters 02, 15, 39 and 14, and none of them is named in any advert." },

    { q: "An interviewer describes a request-response integration with a fixed contract. What is the strong answer?",
      a: ["Propose Kafka with a reply topic", "Say it is synchronous with a fixed contract and you would use HTTP", "Propose Kafka with exactly-once semantics", "Propose a REST proxy in front of Kafka"],
      c: 1,
      why: "They are often checking whether you will reach for a broker regardless. Knowing when not to use Kafka is part of knowing Kafka." },

    { q: "Why does admitting the limits of your Kafka knowledge strengthen the rest of your answers?",
      a: ["Interviewers reward humility as a personality trait", "The surface is large and nobody knows all of it, so claiming complete knowledge signals inexperience rather than expertise", "It lowers the difficulty of subsequent questions", "It is required by most interview scoring rubrics"],
      c: 1,
      why: "An interviewer who runs Kafka in production knows how much there is. Naming your own boundary is what makes your other claims credible." },

    { q: "How should you answer the RAL question?",
      a: ["With a monthly net figure", "With a gross annual range, noting it is negotiable on the whole package", "By refusing until an offer is made", "By asking their budget and nothing else"],
      c: 1,
      why: "Also ask which CCNL and level, indeterminato or apprendistato, and how many mensilita. The Esprimo posting's 35 to 38k under CCNL Metalmeccanico is a useful reference point." },

    { q: "Which question reveals most about what a Kafka-adjacent job is actually like?",
      a: ["Which Kafka version do you run?", "Who owns topic design: each team, or a platform team?", "How many topics do you have?", "Do you use Confluent or Apache?"],
      c: 1,
      why: "The answer tells you whether the job is building on a platform or building the platform, which is a completely different role with the same advert." },

    { q: "What does asking whether they have a schema registry with enforced compatibility signal?",
      a: ["Nothing; it is a routine question", "That you have thought about the operational side, since it is a question only someone who has hit the problem asks", "That you prefer Confluent Platform", "That you expect to own the registry"],
      c: 1,
      why: "The good questions do double duty: they get you information and they demonstrate knowledge better than answering would." },

    { q: "What is the effect of having no questions at the end of an interview?",
      a: ["It is neutral", "It reads as not being interested, and wastes the one part of the interview you control", "It signals confidence", "It is expected for technical roles"],
      c: 1,
      why: "'What would a good first three months look like?' makes them articulate what success means, and their answer tells you whether they have thought about it at all." },
  ],

});
