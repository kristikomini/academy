/* ==========================================================================
   rules.js — the viva deck. GENERATED FILE, DO NOT EDIT.

   Source:      course/GOLDEN-RULES.md
   Regenerate:  php tools/viva-extract.php kafka && php tools/viva-deck.php kafka

   One card per Golden rule. `kind` is "explain" (say why the claim is true)
   or "complete" (finish the sentence), the second being for the rules the
   course states without a written justification — there has to be something
   on paper to mark yourself against, or self-marking drifts generous.

   `id` is the spaced-repetition key. It is derived from the claim text, so
   reordering the rules costs nothing and rewording one resets that card only.

   The chain starts at the chapters, not here: the `.rules` block of each
   chapter is the only place a rule is written by hand.
   ========================================================================== */
window.RULES = [
    {
        "id": "t12-an-append-only-log-and-each-consumer-owns-its-position",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/01-why-a-log.html",
        "claim": "An append-only log, and each consumer owns its position.",
        "why": "Everything follows from that.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "t12-ordering-is-per-partition-therefore-per-key",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/18-ordering.html",
        "claim": "Ordering is per partition, therefore per key.",
        "why": "There is no topic-wide order.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "t12-the-key-chooses-the-partition",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/02-topics-partitions.html",
        "claim": "The key chooses the partition,",
        "why": "and therefore what stays ordered.",
        "continues": true,
        "refs": [
            "02"
        ]
    },
    {
        "id": "t12-a-partition-goes-to-exactly-one-member-of-a-group",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/11-consumer-groups.html",
        "claim": "A partition goes to exactly one member of a group.",
        "why": "That is the whole scaling rule.",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "t12-acks-all-alone-is-not-enough",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/04-replication-isr.html",
        "claim": "`acks=all` alone is not enough.",
        "why": "Pair it with `min.insync.replicas=2`.",
        "continues": false,
        "checkpoints": [
            "acks=all",
            "min.insync.replicas=2"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "t12-auto-commit-commits-on-a-timer-not-on-success",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/12-offsets.html",
        "claim": "Auto-commit commits on a timer, not on success.",
        "why": "Turn it off.",
        "continues": false,
        "refs": [
            "12"
        ]
    },
    {
        "id": "t12-at-least-once-is-the-sane-default",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/15-delivery-semantics.html",
        "claim": "At-least-once is the sane default",
        "why": "process, then commit.",
        "continues": true,
        "refs": [
            "15"
        ]
    },
    {
        "id": "t12-exactly-once-delivery-is-impossible-exactly-once-effect-is-not",
        "kind": "complete",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/15-delivery-semantics.html",
        "claim": "Exactly-once delivery is impossible; exactly-once effect is not.",
        "why": "",
        "stem": "Exactly-once delivery is impossible;",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "t12-insert-the-id-under-a-unique-constraint-in-the-same-transaction-as-the-work",
        "kind": "complete",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/16-idempotent-consumers.html",
        "claim": "Insert the id under a unique constraint, in the same transaction as the work.",
        "why": "",
        "stem": "Insert the id under a unique constraint,",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "t12-there-is-no-transaction-across-your-database-and-kafka",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/39-outbox.html",
        "claim": "There is no transaction across your database and Kafka.",
        "why": "Ever.",
        "continues": false,
        "refs": [
            "39"
        ]
    },
    {
        "id": "t12-a-poison-pill-blocks-its-partition-forever",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/19-serialization.html",
        "claim": "A poison pill blocks its partition forever.",
        "why": "There is no per-record reject.",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "t12-compaction-keeps-the-latest-value-per-key",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/22-retention-compaction.html",
        "claim": "Compaction keeps the latest value per key.",
        "why": "A topic becomes a table.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "s6-rf-3-min-isr-2",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/04-replication-isr.html",
        "claim": "RF 3 + min ISR 2",
        "why": "is the standard. Min ISR = RF trades availability for nothing.",
        "continues": true,
        "refs": [
            "04"
        ]
    },
    {
        "id": "s6-a-slow-handler-looks-exactly-like-a-crash",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/13-rebalancing.html",
        "claim": "A slow handler looks exactly like a crash.",
        "why": "That is the rebalance loop.",
        "continues": false,
        "refs": [
            "13"
        ]
    },
    {
        "id": "s6-lag-measures-commits-not-work",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/14-lag.html",
        "claim": "Lag measures commits, not work.",
        "why": "Commit-before-processing shows healthy lag while losing data.",
        "continues": false,
        "refs": [
            "14"
        ]
    },
    {
        "id": "s6-a-group-that-disappears-looks-healthy",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/33-monitoring.html",
        "claim": "A group that disappears looks healthy.",
        "why": "Alert on its absence too.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "s6-offset-translation-is-the-hard-part-of-failover",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/36-disaster.html",
        "claim": "Offset translation is the hard part of failover,",
        "why": "and the untested part.",
        "continues": true,
        "refs": [
            "36"
        ]
    },
    {
        "id": "s6-write-the-event-to-an-outbox-table-in-the-same-transaction",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/39-outbox.html",
        "claim": "Write the event to an outbox table in the same transaction.",
        "why": "One atomic write.",
        "continues": false,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m00-there-is-no-standalone-kafka-job-here",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "There is no standalone Kafka job here.",
        "why": "It is one line of a Java advert.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-the-adverts-name-the-tool-and-not-the-model",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "The adverts name the tool and not the model.",
        "why": "That gap is what this course fills.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-29-of-46-chapters-are-beyond-the-advert",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "29 of 46 chapters are beyond the advert.",
        "why": "The coverage table says which.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-the-valuable-chapters-are-offsets-rebalancing-delivery-semantics-idempotency-and-the-outbox",
        "kind": "complete",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "The valuable chapters are offsets, rebalancing, delivery semantics, idempotency and the outbox.",
        "why": "",
        "stem": "The valuable chapters are offsets,",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-claim-the-model-and-a-local-cluster",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "Claim the model and a local cluster.",
        "why": "Not production experience you do not have.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m01-reading-is-not-destroying",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — Why a log, and not a queue",
        "href": "site/chapters/01-why-a-log.html",
        "claim": "Reading is not destroying.",
        "why": "Many independent consumers, no coordination.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-replay-is-an-ordinary-operation",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — Why a log, and not a queue",
        "href": "site/chapters/01-why-a-log.html",
        "claim": "Replay is an ordinary operation,",
        "why": "not a recovery procedure.",
        "continues": true,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-fast-because-it-does-less",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — Why a log, and not a queue",
        "href": "site/chapters/01-why-a-log.html",
        "claim": "Fast because it does less",
        "why": "sequential appends, page cache, zero-copy, batching.",
        "continues": true,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-no-per-message-routing-priority-or-individual-ack",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — Why a log, and not a queue",
        "href": "site/chapters/01-why-a-log.html",
        "claim": "No per-message routing, priority or individual ack.",
        "why": "Those are queue features.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-if-you-need-a-queue-say-so",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — Why a log, and not a queue",
        "href": "site/chapters/01-why-a-log.html",
        "claim": "If you need a queue, say so.",
        "why": "Bending Kafka into one costs and buys nothing.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m02-a-partition-is-the-log-a-topic-is-a-name-for-a-set-of-them",
        "kind": "complete",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Topics, partitions and keys",
        "href": "site/chapters/02-topics-partitions.html",
        "claim": "A partition is the log; a topic is a name for a set of them.",
        "why": "",
        "stem": "A partition is the log;",
        "continues": false,
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-ordering-is-per-partition",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Topics, partitions and keys",
        "href": "site/chapters/02-topics-partitions.html",
        "claim": "Ordering is per-partition.",
        "why": "There is no global order, and assuming one is the classic bug.",
        "continues": false,
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-partition-count-caps-consumer-parallelism",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Topics, partitions and keys",
        "href": "site/chapters/02-topics-partitions.html",
        "claim": "Partition count caps consumer parallelism",
        "why": "in a group.",
        "continues": true,
        "refs": [
            "02",
            "32"
        ]
    },
    {
        "id": "m02-a-null-key-means-no-ordering-guarantee",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Topics, partitions and keys",
        "href": "site/chapters/02-topics-partitions.html",
        "claim": "A null key means no ordering guarantee.",
        "why": "Fine for telemetry, wrong for a lifecycle.",
        "continues": false,
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-adding-partitions-breaks-per-key-ordering-for-existing-keys",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Topics, partitions and keys",
        "href": "site/chapters/02-topics-partitions.html",
        "claim": "Adding partitions breaks per-key ordering for existing keys,",
        "why": "and you cannot remove them.",
        "continues": true,
        "refs": [
            "02"
        ]
    },
    {
        "id": "m03-one-leader-per-partition",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Brokers, the cluster and the controller",
        "href": "site/chapters/03-brokers-cluster.html",
        "claim": "One leader per partition.",
        "why": "All produce and consume traffic for it goes there.",
        "continues": false,
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-a-partition-on-disk-is-segment-files",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Brokers, the cluster and the controller",
        "href": "site/chapters/03-brokers-cluster.html",
        "claim": "A partition on disk is segment files.",
        "why": "Retention deletes segments, not records.",
        "continues": false,
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-bootstrap-servers-is-a-starting-point",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Brokers, the cluster and the controller",
        "href": "site/chapters/03-brokers-cluster.html",
        "claim": "`bootstrap.servers` is a starting point;",
        "why": "clients then talk to leaders directly.",
        "continues": true,
        "checkpoints": [
            "bootstrap.servers"
        ],
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-advertised-listeners-is-the-docker-kubernetes-trap",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Brokers, the cluster and the controller",
        "href": "site/chapters/03-brokers-cluster.html",
        "claim": "`advertised.listeners` is the Docker/Kubernetes trap.",
        "why": "Connects, then times out.",
        "continues": false,
        "checkpoints": [
            "advertised.listeners"
        ],
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-list-several-bootstrap-servers",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Brokers, the cluster and the controller",
        "href": "site/chapters/03-brokers-cluster.html",
        "claim": "List several bootstrap servers.",
        "why": "One is a needless single point of failure.",
        "continues": false,
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-failover-is-a-metadata-operation",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Brokers, the cluster and the controller",
        "href": "site/chapters/03-brokers-cluster.html",
        "claim": "Failover is a metadata operation.",
        "why": "Leadership moves; data does not.",
        "continues": false,
        "refs": [
            "03"
        ]
    },
    {
        "id": "m04-durability-is-expressed-in-terms-of-the-isr",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Replication, ISR and leader election",
        "href": "site/chapters/04-replication-isr.html",
        "claim": "Durability is expressed in terms of the ISR,",
        "why": "not the replication factor.",
        "continues": true,
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-a-rejected-write-is-the-system-being-honest",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Replication, ISR and leader election",
        "href": "site/chapters/04-replication-isr.html",
        "claim": "A rejected write is the system being honest.",
        "why": "Prefer it to a silent one.",
        "continues": false,
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-unclean-leader-election-off",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Replication, ISR and leader election",
        "href": "site/chapters/04-replication-isr.html",
        "claim": "Unclean leader election off",
        "why": "unless a gap in that topic is genuinely harmless.",
        "continues": true,
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-watch-under-replicated-partitions",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Replication, ISR and leader election",
        "href": "site/chapters/04-replication-isr.html",
        "claim": "Watch under-replicated partitions.",
        "why": "Nothing else tells you the ISR shrank.",
        "continues": false,
        "refs": [
            "04"
        ]
    },
    {
        "id": "m05-zookeeper-held-cluster-metadata-and-elected-the-controller",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — ZooKeeper, KRaft and the migration",
        "href": "site/chapters/05-zookeeper-kraft.html",
        "claim": "ZooKeeper held cluster metadata and elected the controller.",
        "why": "Never consumer offsets, since 0.9.",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-kraft-puts-metadata-in-kafka-s-own-raft-log",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — ZooKeeper, KRaft and the migration",
        "href": "site/chapters/05-zookeeper-kraft.html",
        "claim": "KRaft puts metadata in Kafka’s own Raft log.",
        "why": "One system, faster failover.",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-kafka-4-0-removed-zookeeper",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — ZooKeeper, KRaft and the migration",
        "href": "site/chapters/05-zookeeper-kraft.html",
        "claim": "Kafka 4.0 removed ZooKeeper.",
        "why": "Still running it implies a version ceiling.",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-clients-never-talked-to-zookeeper-anyway",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — ZooKeeper, KRaft and the migration",
        "href": "site/chapters/05-zookeeper-kraft.html",
        "claim": "Clients never talked to ZooKeeper anyway.",
        "why": "The migration is an operations project.",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-offsets-live-in-consumer-offsets",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — ZooKeeper, KRaft and the migration",
        "href": "site/chapters/05-zookeeper-kraft.html",
        "claim": "Offsets live in `__consumer_offsets`.",
        "why": "Saying otherwise dates you.",
        "continues": false,
        "checkpoints": [
            "__consumer_offsets"
        ],
        "refs": [
            "05"
        ]
    },
    {
        "id": "m06-send-buffers-and-returns",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — The producer API",
        "href": "site/chapters/06-producer-api.html",
        "claim": "`send()` buffers and returns.",
        "why": "Nothing has been sent yet.",
        "continues": false,
        "checkpoints": [
            "send()"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-always-close-the-producer",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — The producer API",
        "href": "site/chapters/06-producer-api.html",
        "claim": "Always close the producer.",
        "why": "Unflushed records disappear silently.",
        "continues": false,
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-handle-the-callback",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — The producer API",
        "href": "site/chapters/06-producer-api.html",
        "claim": "Handle the callback.",
        "why": "Ignoring it turns a failure into silent loss.",
        "continues": false,
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06--get-makes-it-synchronous",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — The producer API",
        "href": "site/chapters/06-producer-api.html",
        "claim": "`.get()` makes it synchronous",
        "why": "and costs an order of magnitude.",
        "continues": true,
        "checkpoints": [
            ".get()"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-use-headers",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — The producer API",
        "href": "site/chapters/06-producer-api.html",
        "claim": "Use headers",
        "why": "for trace context, event type and correlation id.",
        "continues": true,
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-delivery-timeout-ms-bounds-a-send",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — The producer API",
        "href": "site/chapters/06-producer-api.html",
        "claim": "`delivery.timeout.ms` bounds a send,",
        "why": "not `retries`.",
        "continues": true,
        "checkpoints": [
            "delivery.timeout.ms",
            "retries"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-a-full-buffer-blocks",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — The producer API",
        "href": "site/chapters/06-producer-api.html",
        "claim": "A full buffer blocks.",
        "why": "Back-pressure moves; it does not vanish.",
        "continues": false,
        "refs": [
            "06"
        ]
    },
    {
        "id": "m07-murmur2-key-partitions",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Partitioning: how a key chooses a partition",
        "href": "site/chapters/07-partitioning-keys.html",
        "claim": "`murmur2(key) % partitions`",
        "why": "deterministic, and changes when the count does.",
        "continues": true,
        "checkpoints": [
            "murmur2(key) % partitions"
        ],
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-null-key-means-no-ordering-guarantee",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Partitioning: how a key chooses a partition",
        "href": "site/chapters/07-partitioning-keys.html",
        "claim": "Null key means no ordering guarantee.",
        "why": "Sticky batching is about throughput, not order.",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-the-key-is-ordering-and-parallelism-at-once",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Partitioning: how a key chooses a partition",
        "href": "site/chapters/07-partitioning-keys.html",
        "claim": "The key is ordering and parallelism at once.",
        "why": "They pull opposite ways.",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-pick-the-smallest-scope-your-domain-actually-needs-ordered",
        "kind": "complete",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Partitioning: how a key chooses a partition",
        "href": "site/chapters/07-partitioning-keys.html",
        "claim": "Pick the smallest scope your domain actually needs ordered.",
        "why": "",
        "stem": "Pick the smallest scope your",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-skewed-keys-make-hot-partitions",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Partitioning: how a key chooses a partition",
        "href": "site/chapters/07-partitioning-keys.html",
        "claim": "Skewed keys make hot partitions,",
        "why": "and more consumers will not help.",
        "continues": true,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-prefer-a-composite-key-to-a-custom-partitioner",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Partitioning: how a key chooses a partition",
        "href": "site/chapters/07-partitioning-keys.html",
        "claim": "Prefer a composite key to a custom partitioner.",
        "why": "Logic in the data beats logic in a class.",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m08-batch-size-is-bytes-linger-ms-is-time",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Batching, linger, compression and throughput",
        "href": "site/chapters/08-batching-compression.html",
        "claim": "`batch.size` is bytes, `linger.ms` is time.",
        "why": "Either one triggers a send.",
        "continues": false,
        "checkpoints": [
            "batch.size",
            "linger.ms"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-linger-ms-0-still-batches",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Batching, linger, compression and throughput",
        "href": "site/chapters/08-batching-compression.html",
        "claim": "`linger.ms=0` still batches",
        "why": "it just never waits on purpose.",
        "continues": true,
        "checkpoints": [
            "linger.ms=0"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-5-20-ms-of-linger-is-usually-a-large-win",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Batching, linger, compression and throughput",
        "href": "site/chapters/08-batching-compression.html",
        "claim": "5–20 ms of linger is usually a large win",
        "why": "for a bounded latency cost.",
        "continues": true,
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-compression-is-per-batch",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Batching, linger, compression and throughput",
        "href": "site/chapters/08-batching-compression.html",
        "claim": "Compression is per batch,",
        "why": "so bigger batches compress better. `zstd` by default.",
        "continues": true,
        "checkpoints": [
            "zstd"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-mismatched-compression-forces-broker-recompression",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Batching, linger, compression and throughput",
        "href": "site/chapters/08-batching-compression.html",
        "claim": "Mismatched compression forces broker recompression.",
        "why": "Invisible, expensive.",
        "continues": false,
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-check-batch-size-avg",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Batching, linger, compression and throughput",
        "href": "site/chapters/08-batching-compression.html",
        "claim": "Check `batch-size-avg`.",
        "why": "Far below the ceiling means linger is the limit.",
        "continues": false,
        "checkpoints": [
            "batch-size-avg"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m09-acks-all-min-insync-replicas-2",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — acks, retries and the idempotent producer",
        "href": "site/chapters/09-producer-acks.html",
        "claim": "`acks=all` + `min.insync.replicas=2`",
        "why": "for anything with business meaning.",
        "continues": true,
        "checkpoints": [
            "acks=all",
            "min.insync.replicas=2"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-the-latency-cost-is-per-batch-not-per-record",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — acks, retries and the idempotent producer",
        "href": "site/chapters/09-producer-acks.html",
        "claim": "The latency cost is per batch, not per record.",
        "why": "Smaller than people assume.",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-a-lost-acknowledgement-plus-a-retry-used-to-mean-a-duplicate",
        "kind": "complete",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — acks, retries and the idempotent producer",
        "href": "site/chapters/09-producer-acks.html",
        "claim": "A lost acknowledgement plus a retry used to mean a duplicate.",
        "why": "",
        "stem": "A lost acknowledgement plus a retry",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-retries-could-also-reorder",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — acks, retries and the idempotent producer",
        "href": "site/chapters/09-producer-acks.html",
        "claim": "Retries could also reorder,",
        "why": "breaking the only ordering guarantee there is.",
        "continues": true,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-enable-idempotence-is-the-default-since-3-0",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — acks, retries and the idempotent producer",
        "href": "site/chapters/09-producer-acks.html",
        "claim": "`enable.idempotence` is the default since 3.0",
        "why": "and sets acks, retries and in-flight for you.",
        "continues": true,
        "checkpoints": [
            "enable.idempotence"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-it-deduplicates-retries-not-your-application-logic",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — acks, retries and the idempotent producer",
        "href": "site/chapters/09-producer-acks.html",
        "claim": "It deduplicates retries, not your application logic.",
        "why": "Different problem, chapter 39.",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m10-poll-is-the-fetch-loop-and-group-participation-together",
        "kind": "complete",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — The consumer API",
        "href": "site/chapters/10-consumer-api.html",
        "claim": "`poll()` is the fetch loop and group participation together.",
        "why": "",
        "stem": "`poll()` is the fetch loop",
        "continues": false,
        "checkpoints": [
            "poll()"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-max-poll-interval-ms-bounds-processing-time",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — The consumer API",
        "href": "site/chapters/10-consumer-api.html",
        "claim": "`max.poll.interval.ms` bounds processing time,",
        "why": "not just idle time.",
        "continues": true,
        "checkpoints": [
            "max.poll.interval.ms"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-a-slow-handler-gets-you-evicted",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — The consumer API",
        "href": "site/chapters/10-consumer-api.html",
        "claim": "A slow handler gets you evicted",
        "why": "and triggers a rebalance, with no error.",
        "continues": true,
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-kafkaconsumer-is-not-thread-safe",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — The consumer API",
        "href": "site/chapters/10-consumer-api.html",
        "claim": "`KafkaConsumer` is not thread-safe.",
        "why": "One consumer per thread.",
        "continues": false,
        "checkpoints": [
            "KafkaConsumer"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-more-consumers-than-partitions-do-nothing",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — The consumer API",
        "href": "site/chapters/10-consumer-api.html",
        "claim": "More consumers than partitions do nothing.",
        "why": "The partition count is the ceiling.",
        "continues": false,
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-subscribe-for-services-assign-for-tools",
        "kind": "complete",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — The consumer API",
        "href": "site/chapters/10-consumer-api.html",
        "claim": "`subscribe` for services, `assign` for tools.",
        "why": "",
        "stem": "`subscribe` for services,",
        "continues": false,
        "checkpoints": [
            "subscribe",
            "assign"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m11-same-group-id-shares-the-work-different-group-ids-each-get-everything",
        "kind": "complete",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Consumer groups and the assignment",
        "href": "site/chapters/11-consumer-groups.html",
        "claim": "Same group id shares the work; different group ids each get everything.",
        "why": "",
        "stem": "Same group id shares the work;",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-name-group-ids-by-purpose",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Consumer groups and the assignment",
        "href": "site/chapters/11-consumer-groups.html",
        "claim": "Name group ids by purpose,",
        "why": "never by application or environment.",
        "continues": true,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-sharing-a-group-id-between-two-different-consumers-splits-the-stream",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Consumer groups and the assignment",
        "href": "site/chapters/11-consumer-groups.html",
        "claim": "Sharing a group id between two different consumers splits the stream.",
        "why": "Silently.",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-cooperativesticky",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Consumer groups and the assignment",
        "href": "site/chapters/11-consumer-groups.html",
        "claim": "CooperativeSticky.",
        "why": "Incremental rebalancing, minimal movement.",
        "continues": false,
        "refs": [
            "11",
            "13"
        ]
    },
    {
        "id": "m11-static-membership-removes-rolling-restart-rebalances",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Consumer groups and the assignment",
        "href": "site/chapters/11-consumer-groups.html",
        "claim": "Static membership removes rolling-restart rebalances",
        "why": "at the cost of slower failover.",
        "continues": true,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m12-offsets-are-per-group-per-partition-in-consumer-offsets",
        "kind": "complete",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Offsets: committing, resetting and replaying",
        "href": "site/chapters/12-offsets.html",
        "claim": "Offsets are per group, per partition, in `__consumer_offsets`.",
        "why": "",
        "stem": "Offsets are per group,",
        "continues": false,
        "checkpoints": [
            "__consumer_offsets"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-only-the-committed-offset-survives-a-crash",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Offsets: committing, resetting and replaying",
        "href": "site/chapters/12-offsets.html",
        "claim": "Only the committed offset survives a crash.",
        "why": "The in-memory position does not.",
        "continues": false,
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-commit-offset-1",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Offsets: committing, resetting and replaying",
        "href": "site/chapters/12-offsets.html",
        "claim": "Commit `offset + 1`.",
        "why": "Off by one means a permanent duplicate per restart.",
        "continues": false,
        "checkpoints": [
            "offset + 1"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-auto-offset-reset-only-applies-when-there-is-no-committed-offset",
        "kind": "complete",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Offsets: committing, resetting and replaying",
        "href": "site/chapters/12-offsets.html",
        "claim": "`auto.offset.reset` only applies when there is no committed offset.",
        "why": "",
        "stem": "`auto.offset.reset` only applies when there",
        "continues": false,
        "checkpoints": [
            "auto.offset.reset"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-replay-is-reset-offsets-with-the-group-stopped",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Offsets: committing, resetting and replaying",
        "href": "site/chapters/12-offsets.html",
        "claim": "Replay is `--reset-offsets` with the group stopped.",
        "why": "Dry-run first.",
        "continues": false,
        "checkpoints": [
            "--reset-offsets"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "m13-membership-change-means-reassignment",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Rebalancing, and the pause everyone blames on the network",
        "href": "site/chapters/13-rebalancing.html",
        "claim": "Membership change means reassignment.",
        "why": "Joins, leaves, timeouts, partition-count changes.",
        "continues": false,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-eager-rebalancing-stops-the-whole-group",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Rebalancing, and the pause everyone blames on the network",
        "href": "site/chapters/13-rebalancing.html",
        "claim": "Eager rebalancing stops the whole group.",
        "why": "Longer still for stateful consumers.",
        "continues": false,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-max-poll-interval-ms-governs-processing-time",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Rebalancing, and the pause everyone blames on the network",
        "href": "site/chapters/13-rebalancing.html",
        "claim": "`max.poll.interval.ms` governs processing time,",
        "why": "not `session.timeout.ms`.",
        "continues": true,
        "checkpoints": [
            "max.poll.interval.ms",
            "session.timeout.ms"
        ],
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-reduce-max-poll-records",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Rebalancing, and the pause everyone blames on the network",
        "href": "site/chapters/13-rebalancing.html",
        "claim": "Reduce `max.poll.records`",
        "why": "before raising any timeout.",
        "continues": true,
        "checkpoints": [
            "max.poll.records"
        ],
        "refs": [
            "13"
        ]
    },
    {
        "id": "m14-lag-log-end-offset-committed-offset",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Consumer lag: measuring it and fixing it",
        "href": "site/chapters/14-lag.html",
        "claim": "Lag = log end offset − committed offset,",
        "why": "per partition.",
        "continues": true,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-the-trend-matters-not-the-value",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Consumer lag: measuring it and fixing it",
        "href": "site/chapters/14-lag.html",
        "claim": "The trend matters, not the value.",
        "why": "Flat-and-large is fine; small-and-climbing is not.",
        "continues": false,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-one-partition-lagging-is-a-hot-key",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Consumer lag: measuring it and fixing it",
        "href": "site/chapters/14-lag.html",
        "claim": "One partition lagging is a hot key.",
        "why": "All of them is capacity or a rebalance loop.",
        "continues": false,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-alert-on-sustained-growth-and-on-time-behind",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Consumer lag: measuring it and fixing it",
        "href": "site/chapters/14-lag.html",
        "claim": "Alert on sustained growth and on time behind,",
        "why": "not on a fixed record count.",
        "continues": true,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m15-the-order-of-processing-and-committing-decides-the-semantics",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — At-most-once, at-least-once, exactly-once",
        "href": "site/chapters/15-delivery-semantics.html",
        "claim": "The order of processing and committing decides the semantics.",
        "why": "That is the whole mechanism.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-auto-commit-gives-you-duplicates-and-occasional-loss",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — At-most-once, at-least-once, exactly-once",
        "href": "site/chapters/15-delivery-semantics.html",
        "claim": "Auto-commit gives you duplicates and occasional loss.",
        "why": "The worst of both.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-kafka-s-eos-is-kafka-to-kafka",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — At-most-once, at-least-once, exactly-once",
        "href": "site/chapters/15-delivery-semantics.html",
        "claim": "Kafka’s EOS is Kafka-to-Kafka.",
        "why": "Writing to a database crosses the boundary.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-choose-per-consumer",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — At-most-once, at-least-once, exactly-once",
        "href": "site/chapters/15-delivery-semantics.html",
        "claim": "Choose per consumer,",
        "why": "by what a duplicate and a loss each cost.",
        "continues": true,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m16-reshape-the-operation-first",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — Idempotent consumers and deduplication",
        "href": "site/chapters/16-idempotent-consumers.html",
        "claim": "Reshape the operation first.",
        "why": "“Set to PAID” beats “add 10”.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-check-then-act-is-a-race",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — Idempotent consumers and deduplication",
        "href": "site/chapters/16-idempotent-consumers.html",
        "claim": "Check-then-act is a race.",
        "why": "Two concurrent deliveries both pass the check.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-treat-the-constraint-violation-as-success",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — Idempotent consumers and deduplication",
        "href": "site/chapters/16-idempotent-consumers.html",
        "claim": "Treat the constraint violation as success.",
        "why": "It means somebody already did it.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-bound-the-dedup-store",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — Idempotent consumers and deduplication",
        "href": "site/chapters/16-idempotent-consumers.html",
        "claim": "Bound the dedup store.",
        "why": "Duplicates arrive in minutes; keep days, not years.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-external-side-effects-need-their-own-idempotency-key",
        "kind": "complete",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — Idempotent consumers and deduplication",
        "href": "site/chapters/16-idempotent-consumers.html",
        "claim": "External side effects need their own idempotency key.",
        "why": "",
        "stem": "External side effects need",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m17-a-transaction-spans-kafka-writes-and-the-offset-commit",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Kafka transactions and read-committed",
        "href": "site/chapters/17-transactions.html",
        "claim": "A transaction spans Kafka writes and the offset commit,",
        "why": "atomically.",
        "continues": true,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-transactional-id-fences-zombies",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Kafka transactions and read-committed",
        "href": "site/chapters/17-transactions.html",
        "claim": "`transactional.id` fences zombies.",
        "why": "That is what makes it survive restarts.",
        "continues": false,
        "checkpoints": [
            "transactional.id"
        ],
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-consumers-must-set-read-committed",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Kafka transactions and read-committed",
        "href": "site/chapters/17-transactions.html",
        "claim": "Consumers must set `read_committed`,",
        "why": "or the whole thing does nothing.",
        "continues": true,
        "checkpoints": [
            "read_committed"
        ],
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-an-open-transaction-stalls-read-committed-consumers",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Kafka transactions and read-committed",
        "href": "site/chapters/17-transactions.html",
        "claim": "An open transaction stalls read-committed consumers",
        "why": "on that partition.",
        "continues": true,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-the-boundary-is-kafka",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Kafka transactions and read-committed",
        "href": "site/chapters/17-transactions.html",
        "claim": "The boundary is Kafka.",
        "why": "A database write is outside it, always.",
        "continues": false,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-streams-with-exactly-once-v2",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Kafka transactions and read-committed",
        "href": "site/chapters/17-transactions.html",
        "claim": "Streams with `exactly_once_v2`",
        "why": "is where this pays off most.",
        "continues": true,
        "checkpoints": [
            "exactly_once_v2"
        ],
        "refs": [
            "17"
        ]
    },
    {
        "id": "m18-total-ordering-means-one-partition",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Ordering: what Kafka guarantees and what it does not",
        "href": "site/chapters/18-ordering.html",
        "claim": "Total ordering means one partition,",
        "why": "one consumer, and a throughput ceiling.",
        "continues": true,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-adding-partitions-breaks-ordering-for-existing-keys",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Ordering: what Kafka guarantees and what it does not",
        "href": "site/chapters/18-ordering.html",
        "claim": "Adding partitions breaks ordering for existing keys.",
        "why": "Permanently.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-a-worker-pool-inside-the-consumer-undoes-the-guarantee",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Ordering: what Kafka guarantees and what it does not",
        "href": "site/chapters/18-ordering.html",
        "claim": "A worker pool inside the consumer undoes the guarantee.",
        "why": "Partition workers by key.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-retry-topics-reorder",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Ordering: what Kafka guarantees and what it does not",
        "href": "site/chapters/18-ordering.html",
        "claim": "Retry topics reorder.",
        "why": "If order matters, failure must block the key.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-version-your-events-and-send-state-not-deltas",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Ordering: what Kafka guarantees and what it does not",
        "href": "site/chapters/18-ordering.html",
        "claim": "Version your events and send state, not deltas.",
        "why": "Then late arrival is harmless.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m19-the-broker-stores-bytes-and-validates-nothing",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Serialisation: JSON, Avro and Protobuf",
        "href": "site/chapters/19-serialization.html",
        "claim": "The broker stores bytes and validates nothing.",
        "why": "The contract is yours to keep.",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-json-is-readable-and-repeats-every-field-name",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Serialisation: JSON, Avro and Protobuf",
        "href": "site/chapters/19-serialization.html",
        "claim": "JSON is readable and repeats every field name.",
        "why": "Fine at low volume, costly at high.",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-avro-or-protobuf-for-anything-high-volume-or-long-lived",
        "kind": "complete",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Serialisation: JSON, Avro and Protobuf",
        "href": "site/chapters/19-serialization.html",
        "claim": "Avro or Protobuf for anything high-volume or long-lived.",
        "why": "",
        "stem": "Avro or Protobuf for",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-wrap-deserialisers-in-an-error-handler-and-route-to-a-dlt",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Serialisation: JSON, Avro and Protobuf",
        "href": "site/chapters/19-serialization.html",
        "claim": "Wrap deserialisers in an error handler and route to a DLT",
        "why": "before you need it.",
        "continues": true,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-deserialisation-failures-are-never-retryable",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Serialisation: JSON, Avro and Protobuf",
        "href": "site/chapters/19-serialization.html",
        "claim": "Deserialisation failures are never retryable.",
        "why": "Retrying is a loop, not a recovery.",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m20-the-registry-enforces-the-contract-the-broker-will-not",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Schema Registry and schema evolution",
        "href": "site/chapters/20-schema-registry.html",
        "claim": "The registry enforces the contract the broker will not.",
        "why": "Its refusals are the value.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-wire-format-magic-byte-schema-id-payload",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Schema Registry and schema evolution",
        "href": "site/chapters/20-schema-registry.html",
        "claim": "Wire format: magic byte, schema id, payload.",
        "why": "Five bytes, not a repeated schema.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-clients-cache-by-id",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Schema Registry and schema evolution",
        "href": "site/chapters/20-schema-registry.html",
        "claim": "Clients cache by id,",
        "why": "but the registry is a start-up dependency.",
        "continues": true,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-turn-off-auto-register-schemas-in-production",
        "kind": "complete",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Schema Registry and schema evolution",
        "href": "site/chapters/20-schema-registry.html",
        "claim": "Turn off `auto.register.schemas` in production.",
        "why": "",
        "stem": "Turn off `auto.register.schemas`",
        "continues": false,
        "checkpoints": [
            "auto.register.schemas"
        ],
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-every-new-field-gets-a-default",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Schema Registry and schema evolution",
        "href": "site/chapters/20-schema-registry.html",
        "claim": "Every new field gets a default.",
        "why": "That is what makes addition safe.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-renames-are-expand-and-contract",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Schema Registry and schema evolution",
        "href": "site/chapters/20-schema-registry.html",
        "claim": "Renames are expand-and-contract,",
        "why": "exactly as in a database.",
        "continues": true,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m21-backward-new-consumer-reads-old-data",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Compatibility modes, and the change that breaks consumers",
        "href": "site/chapters/21-compatibility.html",
        "claim": "BACKWARD: new consumer reads old data.",
        "why": "FORWARD: old consumer reads new data.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-the-mode-decides-deployment-order",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Compatibility modes, and the change that breaks consumers",
        "href": "site/chapters/21-compatibility.html",
        "claim": "The mode decides deployment order.",
        "why": "BACKWARD means consumers first.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-use-the-transitive-variants",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Compatibility modes, and the change that breaks consumers",
        "href": "site/chapters/21-compatibility.html",
        "claim": "Use the `_TRANSITIVE` variants,",
        "why": "or old retained data can become unreadable.",
        "continues": true,
        "checkpoints": [
            "_TRANSITIVE"
        ],
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-a-rename-is-a-delete-plus-an-add",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Compatibility modes, and the change that breaks consumers",
        "href": "site/chapters/21-compatibility.html",
        "claim": "A rename is a delete plus an add.",
        "why": "Expand and contract instead.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-set-compatibility-per-subject",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Compatibility modes, and the change that breaks consumers",
        "href": "site/chapters/21-compatibility.html",
        "claim": "Set compatibility per subject,",
        "why": "stricter the more consumers there are.",
        "continues": true,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-check-it-in-ci",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Compatibility modes, and the change that breaks consumers",
        "href": "site/chapters/21-compatibility.html",
        "claim": "Check it in CI.",
        "why": "The failure belongs to the producer’s build.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m22-retention-is-time-or-size-whichever-first",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Retention, compaction and tiered storage",
        "href": "site/chapters/22-retention-compaction.html",
        "claim": "Retention is time or size, whichever first,",
        "why": "and deletion is per segment.",
        "continues": true,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-set-retention-from-the-replay-window-you-want",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Retention, compaction and tiered storage",
        "href": "site/chapters/22-retention-compaction.html",
        "claim": "Set retention from the replay window you want.",
        "why": "The default is seven days.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-a-null-value-is-a-tombstone",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Retention, compaction and tiered storage",
        "href": "site/chapters/22-retention-compaction.html",
        "claim": "A null value is a tombstone.",
        "why": "That is how a key is deleted.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-a-compacted-topic-is-a-snapshot-not-an-audit-trail",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Retention, compaction and tiered storage",
        "href": "site/chapters/22-retention-compaction.html",
        "claim": "A compacted topic is a snapshot, not an audit trail.",
        "why": "Intermediate values are lost.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-tiered-storage-makes-long-retention-affordable",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Retention, compaction and tiered storage",
        "href": "site/chapters/22-retention-compaction.html",
        "claim": "Tiered storage makes long retention affordable,",
        "why": "at read latency.",
        "continues": true,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m23-a-library-in-your-jvm",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Kafka Streams: the topology",
        "href": "site/chapters/23-streams-intro.html",
        "claim": "A library in your JVM.",
        "why": "No cluster, no scheduler, deploy it like any service.",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-kafka-to-kafka-only",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Kafka Streams: the topology",
        "href": "site/chapters/23-streams-intro.html",
        "claim": "Kafka-to-Kafka only.",
        "why": "Other sources and sinks are Connect’s job.",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-print-topology-describe",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Kafka Streams: the topology",
        "href": "site/chapters/23-streams-intro.html",
        "claim": "Print `topology.describe()`",
        "why": "and read the internal topics it names.",
        "continues": true,
        "checkpoints": [
            "topology.describe()"
        ],
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-one-task-per-input-partition",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Kafka Streams: the topology",
        "href": "site/chapters/23-streams-intro.html",
        "claim": "One task per input partition.",
        "why": "Partition count is the parallelism ceiling.",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-application-id-is-the-group-id",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Kafka Streams: the topology",
        "href": "site/chapters/23-streams-intro.html",
        "claim": "`application.id` is the group id",
        "why": "and prefixes every internal topic.",
        "continues": true,
        "checkpoints": [
            "application.id"
        ],
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-changing-application-id-orphans-all-state",
        "kind": "complete",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Kafka Streams: the topology",
        "href": "site/chapters/23-streams-intro.html",
        "claim": "Changing `application.id` orphans all state.",
        "why": "",
        "stem": "Changing `application.id` orphans",
        "continues": false,
        "checkpoints": [
            "application.id"
        ],
        "refs": [
            "23"
        ]
    },
    {
        "id": "m24-a-kstream-is-facts-a-ktable-is-the-latest-value-per-key",
        "kind": "complete",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — KStream, KTable and the duality",
        "href": "site/chapters/24-ktable-kstream.html",
        "claim": "A KStream is facts; a KTable is the latest value per key.",
        "why": "",
        "stem": "A KStream is facts;",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-a-compacted-topic-read-as-a-table",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — KStream, KTable and the duality",
        "href": "site/chapters/24-ktable-kstream.html",
        "claim": "A compacted topic read as a table",
        "why": "is the duality made concrete.",
        "continues": true,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-ask-whether-two-records-for-one-key-both-happened-or-are-one-thing-updated",
        "kind": "complete",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — KStream, KTable and the duality",
        "href": "site/chapters/24-ktable-kstream.html",
        "claim": "Ask whether two records for one key both happened, or are one thing updated.",
        "why": "",
        "stem": "Ask whether two records for one key both happened,",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-aggregating-a-table-subtracts-the-old-value",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — KStream, KTable and the duality",
        "href": "site/chapters/24-ktable-kstream.html",
        "claim": "Aggregating a table subtracts the old value.",
        "why": "Aggregating a stream does not — wrong choice, wrong totals.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-globalktable-replicates-everything-everywhere",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — KStream, KTable and the duality",
        "href": "site/chapters/24-ktable-kstream.html",
        "claim": "GlobalKTable replicates everything everywhere.",
        "why": "Small reference data only.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-joins-require-co-partitioning",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — KStream, KTable and the duality",
        "href": "site/chapters/24-ktable-kstream.html",
        "claim": "Joins require co-partitioning,",
        "why": "or you pay for a repartition topic.",
        "continues": true,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m25-event-time-is-when-it-happened-processing-time-is-when-you-saw-it",
        "kind": "complete",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Windowing, time and out-of-order events",
        "href": "site/chapters/25-windowing.html",
        "claim": "Event time is when it happened; processing time is when you saw it.",
        "why": "",
        "stem": "Event time is when it happened;",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-event-time-makes-reprocessing-deterministic",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Windowing, time and out-of-order events",
        "href": "site/chapters/25-windowing.html",
        "claim": "Event time makes reprocessing deterministic.",
        "why": "That is the strongest argument for it.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-tumbling-hopping-sliding-session",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Windowing, time and out-of-order events",
        "href": "site/chapters/25-windowing.html",
        "claim": "Tumbling, hopping, sliding, session.",
        "why": "Session windows come from behaviour, not the clock.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-hopping-windows-multiply-output-and-state",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Windowing, time and out-of-order events",
        "href": "site/chapters/25-windowing.html",
        "claim": "Hopping windows multiply output and state.",
        "why": "Check before choosing one.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-grace-trades-completeness-against-latency-and-memory",
        "kind": "complete",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Windowing, time and out-of-order events",
        "href": "site/chapters/25-windowing.html",
        "claim": "Grace trades completeness against latency and memory.",
        "why": "",
        "stem": "Grace trades completeness against",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-count-dropped-late-records",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Windowing, time and out-of-order events",
        "href": "site/chapters/25-windowing.html",
        "claim": "Count dropped-late records.",
        "why": "Non-zero means your numbers are wrong.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-stream-time-advances-from-records-not-the-clock",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Windowing, time and out-of-order events",
        "href": "site/chapters/25-windowing.html",
        "claim": "Stream time advances from records, not the clock.",
        "why": "A quiet partition never closes its windows.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m26-local-rocksdb-for-speed-compacted-changelog-topic-for-durability",
        "kind": "complete",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — State stores, RocksDB and interactive queries",
        "href": "site/chapters/26-state-stores.html",
        "claim": "Local RocksDB for speed, compacted changelog topic for durability.",
        "why": "",
        "stem": "Local RocksDB for speed,",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-a-restore-from-an-empty-disk-replays-the-whole-changelog",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — State stores, RocksDB and interactive queries",
        "href": "site/chapters/26-state-stores.html",
        "claim": "A restore from an empty disk replays the whole changelog.",
        "why": "Minutes to hours.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-persistent-volumes-standby-replicas-static-membership",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — State stores, RocksDB and interactive queries",
        "href": "site/chapters/26-state-stores.html",
        "claim": "Persistent volumes, standby replicas, static membership.",
        "why": "The three mitigations.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-rocksdb-memory-is-off-heap",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — State stores, RocksDB and interactive queries",
        "href": "site/chapters/26-state-stores.html",
        "claim": "RocksDB memory is off-heap.",
        "why": "Heap metrics will not show it, and the container will kill you.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-interactive-queries-can-replace-a-read-database",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — State stores, RocksDB and interactive queries",
        "href": "site/chapters/26-state-stores.html",
        "claim": "Interactive queries can replace a read database",
        "why": "if you build the forwarding.",
        "continues": true,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-state-is-partitioned",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — State stores, RocksDB and interactive queries",
        "href": "site/chapters/26-state-stores.html",
        "claim": "State is partitioned.",
        "why": "A key lives on exactly one instance.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m27-kafka-streams-underneath-sql-on-top",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — ksqlDB, and when SQL is enough",
        "href": "site/chapters/27-ksqldb.html",
        "claim": "Kafka Streams underneath, SQL on top.",
        "why": "Same topologies, same state stores.",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-push-queries-stream-pull-queries-read-state",
        "kind": "complete",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — ksqlDB, and when SQL is enough",
        "href": "site/chapters/27-ksqldb.html",
        "claim": "Push queries stream; pull queries read state.",
        "why": "",
        "stem": "Push queries stream;",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-best-for-exploration",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — ksqlDB, and when SQL is enough",
        "href": "site/chapters/27-ksqldb.html",
        "claim": "Best for exploration",
        "why": "the fastest way to see what is on a topic.",
        "continues": true,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-testing-is-the-real-weakness",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — ksqlDB, and when SQL is enough",
        "href": "site/chapters/27-ksqldb.html",
        "claim": "Testing is the real weakness.",
        "why": "No `TopologyTestDriver` equivalent.",
        "continues": false,
        "checkpoints": [
            "TopologyTestDriver"
        ],
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-a-query-left-running-is-an-unowned-production-job",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — ksqlDB, and when SQL is enough",
        "href": "site/chapters/27-ksqldb.html",
        "claim": "A query left running is an unowned production job.",
        "why": "Put it in git.",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-knowing-a-tool-is-unnecessary-is-worth-saying",
        "kind": "complete",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — ksqlDB, and when SQL is enough",
        "href": "site/chapters/27-ksqldb.html",
        "claim": "Knowing a tool is unnecessary is worth saying.",
        "why": "",
        "stem": "Knowing a tool is",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m28-configuration-not-code",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Kafka Connect: sources and sinks",
        "href": "site/chapters/28-connect.html",
        "claim": "Configuration, not code",
        "why": "and the reason is correctness, not effort.",
        "continues": true,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-distributed-mode-in-production",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Kafka Connect: sources and sinks",
        "href": "site/chapters/28-connect.html",
        "claim": "Distributed mode in production.",
        "why": "Config, offsets and status live in Kafka topics.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-managed-over-a-rest-api",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Kafka Connect: sources and sinks",
        "href": "site/chapters/28-connect.html",
        "claim": "Managed over a REST API.",
        "why": "So keep the configs in git and apply from the pipeline.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-smts-are-per-record",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Kafka Connect: sources and sinks",
        "href": "site/chapters/28-connect.html",
        "claim": "SMTs are per record.",
        "why": "No joins, no aggregation.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-connect-moves-streams-transforms",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Kafka Connect: sources and sinks",
        "href": "site/chapters/28-connect.html",
        "claim": "Connect moves, Streams transforms.",
        "why": "Six chained SMTs means you crossed the line.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-set-errors-tolerance-and-a-dlq",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Kafka Connect: sources and sinks",
        "href": "site/chapters/28-connect.html",
        "claim": "Set `errors.tolerance` and a DLQ,",
        "why": "and monitor connector status.",
        "continues": true,
        "checkpoints": [
            "errors.tolerance"
        ],
        "refs": [
            "28"
        ]
    },
    {
        "id": "m29-read-the-transaction-log-not-the-table",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Change data capture with Debezium",
        "href": "site/chapters/29-cdc-debezium.html",
        "claim": "Read the transaction log, not the table.",
        "why": "Polling misses deletes and intermediate states.",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-runs-as-a-connect-source-connector",
        "kind": "complete",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Change data capture with Debezium",
        "href": "site/chapters/29-cdc-debezium.html",
        "claim": "Runs as a Connect source connector.",
        "why": "",
        "stem": "Runs as a",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-this-is-how-kafka-arrives-in-a-legacy-shop",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Change data capture with Debezium",
        "href": "site/chapters/29-cdc-debezium.html",
        "claim": "This is how Kafka arrives in a legacy shop",
        "why": "without touching the application.",
        "continues": true,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-the-initial-snapshot-is-the-risky-part",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Change data capture with Debezium",
        "href": "site/chapters/29-cdc-debezium.html",
        "claim": "The initial snapshot is the risky part.",
        "why": "Ask about incremental snapshotting.",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-ordering-is-per-row-not-across-tables",
        "kind": "complete",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Change data capture with Debezium",
        "href": "site/chapters/29-cdc-debezium.html",
        "claim": "Ordering is per row, not across tables.",
        "why": "",
        "stem": "Ordering is per row,",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-raw-cdc-couples-consumers-to-the-legacy-schema",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Change data capture with Debezium",
        "href": "site/chapters/29-cdc-debezium.html",
        "claim": "Raw CDC couples consumers to the legacy schema.",
        "why": "Put a translation stage in front.",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m30-most-non-jvm-clients-are-librdkafka",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — REST Proxy, and clients in other languages",
        "href": "site/chapters/30-rest-proxy-clients.html",
        "claim": "Most non-JVM clients are librdkafka,",
        "why": "so their configuration vocabulary is shared.",
        "continues": true,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-streams-and-transactions-are-jvm-only",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — REST Proxy, and clients in other languages",
        "href": "site/chapters/30-rest-proxy-clients.html",
        "claim": "Streams and transactions are JVM-only.",
        "why": "Stateful streaming in Python is a different tool.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-rest-proxy-for-produce-reluctantly-for-consume",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — REST Proxy, and clients in other languages",
        "href": "site/chapters/30-rest-proxy-clients.html",
        "claim": "REST Proxy for produce, reluctantly for consume.",
        "why": "Consuming over HTTP fights the model.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-the-proxy-is-a-hop-you-must-size-monitor-and-make-redundant",
        "kind": "complete",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — REST Proxy, and clients in other languages",
        "href": "site/chapters/30-rest-proxy-clients.html",
        "claim": "The proxy is a hop you must size, monitor and make redundant.",
        "why": "",
        "stem": "The proxy is a hop you must size,",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-bridges-translate-at-the-edge",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — REST Proxy, and clients in other languages",
        "href": "site/chapters/30-rest-proxy-clients.html",
        "claim": "Bridges translate at the edge.",
        "why": "Domain events out, never the vendor’s vocabulary.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-assume-the-bridge-restarts-mid-stream",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — REST Proxy, and clients in other languages",
        "href": "site/chapters/30-rest-proxy-clients.html",
        "claim": "Assume the bridge restarts mid-stream.",
        "why": "Idempotent and resumable.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m31-schema-registry-is-confluent-not-apache",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Confluent, Apache, Redpanda and the managed options",
        "href": "site/chapters/31-confluent-vs-apache.html",
        "claim": "Schema Registry is Confluent, not Apache.",
        "why": "Its licence is a real consideration.",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-redpanda-is-wire-compatible",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Confluent, Apache, Redpanda and the managed options",
        "href": "site/chapters/31-confluent-vs-apache.html",
        "claim": "Redpanda is wire-compatible",
        "why": "no JVM, no ZooKeeper, smaller ecosystem.",
        "continues": true,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-managed-removes-broker-operations-not-kafka-operations",
        "kind": "complete",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Confluent, Apache, Redpanda and the managed options",
        "href": "site/chapters/31-confluent-vs-apache.html",
        "claim": "Managed removes broker operations, not Kafka operations.",
        "why": "",
        "stem": "Managed removes broker operations,",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-managed-pricing-bills-egress-per-consumer-group",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Confluent, Apache, Redpanda and the managed options",
        "href": "site/chapters/31-confluent-vs-apache.html",
        "claim": "Managed pricing bills egress per consumer group.",
        "why": "Another group has a monthly cost.",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-ccdak-is-a-screening-signal",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Confluent, Apache, Redpanda and the managed options",
        "href": "site/chapters/31-confluent-vs-apache.html",
        "claim": "CCDAK is a screening signal,",
        "why": "worth more the less Kafka experience you have.",
        "continues": true,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m32-size-from-measured-per-consumer-throughput",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Sizing: partitions, throughput and how many is too many",
        "href": "site/chapters/32-sizing-topics.html",
        "claim": "Size from measured per-consumer throughput,",
        "why": "then add headroom.",
        "continues": true,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-you-cannot-reduce-the-count",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Sizing: partitions, throughput and how many is too many",
        "href": "site/chapters/32-sizing-topics.html",
        "claim": "You cannot reduce the count,",
        "why": "and increasing it breaks per-key ordering.",
        "continues": true,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-partitions-cost-file-handles-memory-election-and-rebalance-time",
        "kind": "complete",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Sizing: partitions, throughput and how many is too many",
        "href": "site/chapters/32-sizing-topics.html",
        "claim": "Partitions cost file handles, memory, election and rebalance time.",
        "why": "",
        "stem": "Partitions cost file handles,",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-group-event-types-on-one-topic-when-their-relative-order-matters",
        "kind": "complete",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Sizing: partitions, throughput and how many is too many",
        "href": "site/chapters/32-sizing-topics.html",
        "claim": "Group event types on one topic when their relative order matters.",
        "why": "",
        "stem": "Group event types on one topic",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-decide-a-naming-convention-once",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Sizing: partitions, throughput and how many is too many",
        "href": "site/chapters/32-sizing-topics.html",
        "claim": "Decide a naming convention once.",
        "why": "Topic names are effectively permanent.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m33-jmx-exporter-for-brokers-a-lag-exporter-for-groups",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Monitoring with Prometheus and Grafana",
        "href": "site/chapters/33-monitoring.html",
        "claim": "JMX exporter for brokers, a lag exporter for groups.",
        "why": "The second covers apps that export nothing.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-under-replicated-and-offline-partitions-should-be-zero",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Monitoring with Prometheus and Grafana",
        "href": "site/chapters/33-monitoring.html",
        "claim": "Under-replicated and offline partitions should be zero;",
        "why": "active controllers exactly one.",
        "continues": true,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-lag-per-group-and-per-partition",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Monitoring with Prometheus and Grafana",
        "href": "site/chapters/33-monitoring.html",
        "claim": "Lag per group and per partition",
        "why": "is the most informative number you have.",
        "continues": true,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-alert-on-symptoms-and-durability",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Monitoring with Prometheus and Grafana",
        "href": "site/chapters/33-monitoring.html",
        "claim": "Alert on symptoms and durability,",
        "why": "never on CPU or message rate.",
        "continues": true,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-time-based-lag-beats-record-counts",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Monitoring with Prometheus and Grafana",
        "href": "site/chapters/33-monitoring.html",
        "claim": "Time-based lag beats record counts.",
        "why": "“Twenty minutes behind” is actionable.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m34-encryption-authentication-and-authorisation-are-three-settings",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Security: TLS, SASL and ACLs",
        "href": "site/chapters/34-security.html",
        "claim": "Encryption, authentication and authorisation are three settings.",
        "why": "One does not imply another.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-scram-usually-kerberos-in-banks-and-public-administration",
        "kind": "complete",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Security: TLS, SASL and ACLs",
        "href": "site/chapters/34-security.html",
        "claim": "SCRAM usually; Kerberos in banks and public administration.",
        "why": "",
        "stem": "SCRAM usually;",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-allow-everyone-if-no-acl-found-defaults-to-true",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Security: TLS, SASL and ACLs",
        "href": "site/chapters/34-security.html",
        "claim": "`allow.everyone.if.no.acl.found` defaults to true.",
        "why": "Authentication alone protects nothing.",
        "continues": false,
        "checkpoints": [
            "allow.everyone.if.no.acl.found"
        ],
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-a-consumer-needs-read-on-the-topic-and-on-the-group",
        "kind": "complete",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Security: TLS, SASL and ACLs",
        "href": "site/chapters/34-security.html",
        "claim": "A consumer needs Read on the topic and on the group.",
        "why": "",
        "stem": "A consumer needs Read on the",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-prefixed-acls-per-team",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Security: TLS, SASL and ACLs",
        "href": "site/chapters/34-security.html",
        "claim": "Prefixed ACLs per team,",
        "why": "not one rule per topic.",
        "continues": true,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-tls-is-not-encryption-at-rest",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Security: TLS, SASL and ACLs",
        "href": "site/chapters/34-security.html",
        "claim": "TLS is not encryption at rest,",
        "why": "and you cannot delete one record for GDPR.",
        "continues": true,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m35-brokers-have-identity-disks-and-per-broker-addressability",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Kafka on Kubernetes and OpenShift",
        "href": "site/chapters/35-kubernetes.html",
        "claim": "Brokers have identity, disks and per-broker addressability.",
        "why": "StatefulSet, never Deployment.",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-use-an-operator",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Kafka on Kubernetes and OpenShift",
        "href": "site/chapters/35-kubernetes.html",
        "claim": "Use an operator.",
        "why": "Strimzi, or AMQ Streams on OpenShift.",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-declarative-topics-and-acls-in-git",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Kafka on Kubernetes and OpenShift",
        "href": "site/chapters/35-kubernetes.html",
        "claim": "Declarative topics and ACLs in git",
        "why": "is the operator’s best feature.",
        "continues": true,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-storage-class-decides-your-latency",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Kafka on Kubernetes and OpenShift",
        "href": "site/chapters/35-kubernetes.html",
        "claim": "Storage class decides your latency.",
        "why": "Local disk beats network storage.",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-a-volume-that-cannot-reattach-means-a-broker-re-replicating-from-empty",
        "kind": "complete",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Kafka on Kubernetes and OpenShift",
        "href": "site/chapters/35-kubernetes.html",
        "claim": "A volume that cannot reattach means a broker re-replicating from empty.",
        "why": "",
        "stem": "A volume that cannot reattach means",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35--should-we-is-a-team-capacity-question",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Kafka on Kubernetes and OpenShift",
        "href": "site/chapters/35-kubernetes.html",
        "claim": "“Should we?” is a team-capacity question,",
        "why": "not a technical one.",
        "continues": true,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m36-replay-is-only-safe-if-consumers-are-idempotent",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Disaster, replay and the day you must reprocess",
        "href": "site/chapters/36-disaster.html",
        "claim": "Replay is only safe if consumers are idempotent",
        "why": "and retention reaches back far enough.",
        "continues": true,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-replay-into-a-new-topic-or-group",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Disaster, replay and the day you must reprocess",
        "href": "site/chapters/36-disaster.html",
        "claim": "Replay into a new topic or group,",
        "why": "compare, then switch.",
        "continues": true,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-replay-re-fires-every-side-effect",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Disaster, replay and the day you must reprocess",
        "href": "site/chapters/36-disaster.html",
        "claim": "Replay re-fires every side effect.",
        "why": "Enumerate and gate them first.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-mirrormaker-2-replicates-asynchronously",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Disaster, replay and the day you must reprocess",
        "href": "site/chapters/36-disaster.html",
        "claim": "MirrorMaker 2 replicates asynchronously.",
        "why": "RPO of zero is not on offer.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-rehearse-and-time-it",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Disaster, replay and the day you must reprocess",
        "href": "site/chapters/36-disaster.html",
        "claim": "Rehearse and time it.",
        "why": "An untested procedure is a document.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m37-it-removes-address-and-temporal-coupling-not-schema-coupling",
        "kind": "complete",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Event-driven architecture: the shape",
        "href": "site/chapters/37-event-driven.html",
        "claim": "It removes address and temporal coupling, not schema coupling.",
        "why": "",
        "stem": "It removes address and temporal coupling,",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-adding-a-consumer-requires-no-producer-change",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Event-driven architecture: the shape",
        "href": "site/chapters/37-event-driven.html",
        "claim": "Adding a consumer requires no producer change.",
        "why": "That is the real benefit.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-choreography-for-notification-orchestration-for-a-process-with-an-outcome",
        "kind": "complete",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Event-driven architecture: the shape",
        "href": "site/chapters/37-event-driven.html",
        "claim": "Choreography for notification, orchestration for a process with an outcome.",
        "why": "",
        "stem": "Choreography for notification,",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-if-nobody-can-draw-the-flow-the-process-is-implicit",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Event-driven architecture: the shape",
        "href": "site/chapters/37-event-driven.html",
        "claim": "If nobody can draw the flow, the process is implicit.",
        "why": "Time for an orchestrator.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-eventual-consistency-is-a-product-decision",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Event-driven architecture: the shape",
        "href": "site/chapters/37-event-driven.html",
        "claim": "Eventual consistency is a product decision,",
        "why": "and the UI has to handle it.",
        "continues": true,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-distributed-tracing-is-not-optional",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Event-driven architecture: the shape",
        "href": "site/chapters/37-event-driven.html",
        "claim": "Distributed tracing is not optional",
        "why": "once the failure happens elsewhere.",
        "continues": true,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m38-events-are-facts-in-the-past-commands-are-instructions-with-a-recipient",
        "kind": "complete",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Events, commands and the naming that decides your coupling",
        "href": "site/chapters/38-events-vs-commands.html",
        "claim": "Events are facts in the past; commands are instructions with a recipient.",
        "why": "",
        "stem": "Events are facts in the past;",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-a-command-shaped-topic-name-means-the-publisher-knows-its-consumer",
        "kind": "complete",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Events, commands and the naming that decides your coupling",
        "href": "site/chapters/38-events-vs-commands.html",
        "claim": "A command-shaped topic name means the publisher knows its consumer.",
        "why": "",
        "stem": "A command-shaped topic name means",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38--domain-entity-past-tense",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Events, commands and the naming that decides your coupling",
        "href": "site/chapters/38-events-vs-commands.html",
        "claim": "`<domain>.<entity>.<past-tense>`,",
        "why": "and the architecture follows.",
        "continues": true,
        "checkpoints": [
            "<domain>.<entity>.<past-tense>"
        ],
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-request-reply-over-two-topics-is-rpc-with-worse-ergonomics",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Events, commands and the naming that decides your coupling",
        "href": "site/chapters/38-events-vs-commands.html",
        "claim": "Request–reply over two topics is RPC with worse ergonomics.",
        "why": "Use HTTP.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-event-carried-state-transfer-over-notification",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Events, commands and the naming that decides your coupling",
        "href": "site/chapters/38-events-vs-commands.html",
        "claim": "Event-carried state transfer over notification,",
        "why": "or you rebuild the callback.",
        "continues": true,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-do-not-publish-the-whole-aggregate",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Events, commands and the naming that decides your coupling",
        "href": "site/chapters/38-events-vs-commands.html",
        "claim": "Do not publish the whole aggregate.",
        "why": "That is maximum schema coupling.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m39-either-ordering-has-a-silent-failure-case",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — The outbox pattern and dual writes",
        "href": "site/chapters/39-outbox.html",
        "claim": "Either ordering has a silent failure case.",
        "why": "Retrying in a catch does not close it.",
        "continues": false,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m39-publishing-inside-the-transaction-is-the-worst-version",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — The outbox pattern and dual writes",
        "href": "site/chapters/39-outbox.html",
        "claim": "Publishing inside the transaction is the worst version",
        "why": "consumers act on a rollback.",
        "continues": true,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m39-relay-with-cdc-or-a-poller",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — The outbox pattern and dual writes",
        "href": "site/chapters/39-outbox.html",
        "claim": "Relay with CDC or a poller.",
        "why": "At-least-once, so consumers dedup.",
        "continues": false,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m39-key-the-message-by-aggregate-id",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — The outbox pattern and dual writes",
        "href": "site/chapters/39-outbox.html",
        "claim": "Key the message by aggregate id",
        "why": "to keep per-entity ordering.",
        "continues": true,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m40-two-phase-commit-holds-locks-across-services-and-blocks-on-coordinator-failure",
        "kind": "complete",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Sagas and distributed consistency",
        "href": "site/chapters/40-saga.html",
        "claim": "Two-phase commit holds locks across services and blocks on coordinator failure.",
        "why": "",
        "stem": "Two-phase commit holds locks across services",
        "continues": false,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-a-saga-is-local-transactions-plus-compensating-actions",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Sagas and distributed consistency",
        "href": "site/chapters/40-saga.html",
        "claim": "A saga is local transactions plus compensating actions.",
        "why": "A refund, not a rollback.",
        "continues": false,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-orchestration-for-a-process-with-a-defined-outcome",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Sagas and distributed consistency",
        "href": "site/chapters/40-saga.html",
        "claim": "Orchestration for a process with a defined outcome.",
        "why": "Choreography hides it.",
        "continues": false,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-put-irreversible-steps-last",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Sagas and distributed consistency",
        "href": "site/chapters/40-saga.html",
        "claim": "Put irreversible steps last.",
        "why": "You cannot un-send an email.",
        "continues": false,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-every-step-and-every-compensation-is-idempotent",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Sagas and distributed consistency",
        "href": "site/chapters/40-saga.html",
        "claim": "Every step and every compensation is idempotent,",
        "why": "and the state is persisted.",
        "continues": true,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-have-a-manual-queue-for-failed-compensation",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Sagas and distributed consistency",
        "href": "site/chapters/40-saga.html",
        "claim": "Have a manual queue for failed compensation.",
        "why": "That is where automation ends.",
        "continues": false,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m41-the-container-owns-the-poll-loop",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Spring Kafka in practice",
        "href": "site/chapters/41-spring-kafka.html",
        "claim": "The container owns the poll loop.",
        "why": "`concurrency` is capped by partitions.",
        "continues": false,
        "checkpoints": [
            "concurrency"
        ],
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-boot-s-defaults-commit-after-the-batch",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Spring Kafka in practice",
        "href": "site/chapters/41-spring-kafka.html",
        "claim": "Boot’s defaults commit after the batch",
        "why": "at-least-once, as you want.",
        "continues": true,
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-classify-exceptions",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Spring Kafka in practice",
        "href": "site/chapters/41-spring-kafka.html",
        "claim": "Classify exceptions.",
        "why": "Non-retryable ones go straight to the DLT.",
        "continues": false,
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41--retryabletopic-trades-ordering-for-throughput",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Spring Kafka in practice",
        "href": "site/chapters/41-spring-kafka.html",
        "claim": "`@RetryableTopic` trades ordering for throughput.",
        "why": "Know which you need.",
        "continues": false,
        "checkpoints": [
            "@RetryableTopic"
        ],
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-a-dlt-nobody-watches-is-a-delete",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Spring Kafka in practice",
        "href": "site/chapters/41-spring-kafka.html",
        "claim": "A DLT nobody watches is a delete.",
        "why": "Alert on arrivals.",
        "continues": false,
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-testcontainers-and-test-that-processing-twice-is-safe",
        "kind": "complete",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Spring Kafka in practice",
        "href": "site/chapters/41-spring-kafka.html",
        "claim": "Testcontainers, and test that processing twice is safe.",
        "why": "",
        "stem": "Testcontainers, and test that",
        "continues": false,
        "refs": [
            "41"
        ]
    },
    {
        "id": "m42-stand-up-is-synchronisation",
        "kind": "explain",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/42-agile-scrum.html",
        "claim": "Stand-up is synchronisation.",
        "why": "Lead with blockers.",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42-refinement-is-the-leverage-point",
        "kind": "explain",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/42-agile-scrum.html",
        "claim": "Refinement is the leverage point.",
        "why": "Ask who else consumes it, and what a duplicate costs.",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42--i-need-a-spike-beats-a-guess",
        "kind": "explain",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/42-agile-scrum.html",
        "claim": "“I need a spike” beats a guess,",
        "why": "and flag slippage early.",
        "continues": true,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42-describe-how-you-worked-then-ask-how-they-work",
        "kind": "explain",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/42-agile-scrum.html",
        "claim": "Describe how you worked, then ask how they work.",
        "why": "Doctrine reads badly.",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42-small-prs-commit-messages-say-why",
        "kind": "complete",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/42-agile-scrum.html",
        "claim": "Small PRs; commit messages say why.",
        "why": "",
        "stem": "Small PRs;",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42-an-event-is-a-public-api",
        "kind": "explain",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/42-agile-scrum.html",
        "claim": "An event is a public API.",
        "why": "Document its schema, key and ordering guarantee.",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m43-b2-follow-be-understood-write-clearly",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — The English the advert means",
        "href": "site/chapters/43-english.html",
        "claim": "B2: follow, be understood, write clearly.",
        "why": "The accent is not the problem.",
        "continues": false,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-ask-for-repetition-without-apologising",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — The English the advert means",
        "href": "site/chapters/43-english.html",
        "claim": "Ask for repetition without apologising.",
        "why": "Silence is what they screen for.",
        "continues": false,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-the-technical-vocabulary-stays-english",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — The English the advert means",
        "href": "site/chapters/43-english.html",
        "claim": "The technical vocabulary stays English.",
        "why": "Translating it marks you as bookish.",
        "continues": false,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-learn-fixed-phrases",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — The English the advert means",
        "href": "site/chapters/43-english.html",
        "claim": "Learn fixed phrases",
        "why": "for disagreeing, buying time and reporting delay.",
        "continues": true,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-eventually-eventualmente-actually-attualmente",
        "kind": "complete",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — The English the advert means",
        "href": "site/chapters/43-english.html",
        "claim": "Eventually ≠ eventualmente; actually ≠ attualmente.",
        "why": "",
        "stem": "Eventually ≠ eventualmente;",
        "continues": false,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-conclusion-first-say-what-you-need-and-by-when",
        "kind": "complete",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — The English the advert means",
        "href": "site/chapters/43-english.html",
        "claim": "Conclusion first. Say what you need and by when.",
        "why": "",
        "stem": "Conclusion first. Say what you",
        "continues": false,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m44-single-column-real-text-the-advert-s-own-words",
        "kind": "explain",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — The CV and the ATS",
        "href": "site/chapters/44-the-cv.html",
        "claim": "Single column, real text, the advert’s own words.",
        "why": "Alignment, never stuffing.",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-verify-the-extracted-text-layer",
        "kind": "explain",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — The CV and the ATS",
        "href": "site/chapters/44-the-cv.html",
        "claim": "Verify the extracted text layer.",
        "why": "Layout changes reorder it silently.",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-never-a-bare-apache-kafka-in-a-skills-list",
        "kind": "explain",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — The CV and the ATS",
        "href": "site/chapters/44-the-cv.html",
        "claim": "Never a bare “Apache Kafka” in a skills list.",
        "why": "Say what you built.",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-the-test-would-you-be-happy-discussing-this-line-for-five-minutes",
        "kind": "complete",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — The CV and the ATS",
        "href": "site/chapters/44-the-cv.html",
        "claim": "The test: would you be happy discussing this line for five minutes?",
        "why": "",
        "stem": "The test:",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-kafka-is-often-interviewed-by-whoever-operates-it",
        "kind": "explain",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — The CV and the ATS",
        "href": "site/chapters/44-the-cv.html",
        "claim": "Kafka is often interviewed by whoever operates it.",
        "why": "The follow-ups are specific.",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-one-small-complete-system-beats-certificates",
        "kind": "complete",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — The CV and the ATS",
        "href": "site/chapters/44-the-cv.html",
        "claim": "One small complete system beats certificates.",
        "why": "",
        "stem": "One small complete",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m45-ask-about-scale-staleness-and-ordering-first",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — The interview",
        "href": "site/chapters/45-the-interview.html",
        "claim": "Ask about scale, staleness and ordering first.",
        "why": "Those answers decide the design.",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-name-the-key-the-guarantee-and-how-you-would-detect-failure",
        "kind": "complete",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — The interview",
        "href": "site/chapters/45-the-interview.html",
        "claim": "Name the key, the guarantee, and how you would detect failure.",
        "why": "",
        "stem": "Name the key,",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-raise-the-dual-write-problem-before-they-do",
        "kind": "complete",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — The interview",
        "href": "site/chapters/45-the-interview.html",
        "claim": "Raise the dual-write problem before they do.",
        "why": "",
        "stem": "Raise the dual-write problem",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-do-not-propose-kafka-for-request-response",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — The interview",
        "href": "site/chapters/45-the-interview.html",
        "claim": "Do not propose Kafka for request–response.",
        "why": "Knowing when not to is the answer.",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45--i-do-not-know-but-beats-a-confident-guess",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — The interview",
        "href": "site/chapters/45-the-interview.html",
        "claim": "“I do not know, but…” beats a confident guess.",
        "why": "Always.",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-ral-as-a-gross-annual-range",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — The interview",
        "href": "site/chapters/45-the-interview.html",
        "claim": "RAL as a gross annual range;",
        "why": "ask about CCNL, level and mensilità.",
        "continues": true,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-ask-who-owns-topic-design",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — The interview",
        "href": "site/chapters/45-the-interview.html",
        "claim": "Ask who owns topic design.",
        "why": "The answer tells you what the job really is.",
        "continues": false,
        "refs": [
            "45"
        ]
    }
];
