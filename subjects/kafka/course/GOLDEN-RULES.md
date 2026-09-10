# Golden rules — the whole course on one page

**GENERATED FILE.** Written by `tools/viva-extract.php` from the `.rules` block of
every chapter, and read by `tools/viva-deck.php` to produce `site/assets/rules.js`.
Edit the chapter, not this file.

Blueprint §3.4 has this file authored by hand and the chapters referring to it. In this
subject the chapters were written first, so the arrow runs the other way — but the
principle it protects is the same one: the rule exists in exactly one place, and
everything downstream is derived from it.

The tiers below come from `course/viva-tiers.json`, which is the one part of this
document that is an editorial judgement rather than an extraction.

## The twelve that decide interviews

If you only rehearse twelve, rehearse these. Each links to the chapter that earns it.

1. **An append-only log, and each consumer owns its position.** Everything follows from that. — [01](../site/chapters/01-why-a-log.html)
2. **Ordering is per partition, therefore per key.** There is no topic-wide order. — [18](../site/chapters/18-ordering.html)
3. **The key chooses the partition,** and therefore what stays ordered. — [02](../site/chapters/02-topics-partitions.html)
4. **A partition goes to exactly one member of a group.** That is the whole scaling rule. — [11](../site/chapters/11-consumer-groups.html)
5. **`acks=all` alone is not enough.** Pair it with `min.insync.replicas=2`. — [04](../site/chapters/04-replication-isr.html)
6. **Auto-commit commits on a timer, not on success.** Turn it off. — [12](../site/chapters/12-offsets.html)
7. **At-least-once is the sane default** process, then commit. — [15](../site/chapters/15-delivery-semantics.html)
8. **Exactly-once delivery is impossible; exactly-once effect is not.** — [15](../site/chapters/15-delivery-semantics.html)
9. **Insert the id under a unique constraint, in the same transaction as the work.** — [16](../site/chapters/16-idempotent-consumers.html)
10. **There is no transaction across your database and Kafka.** Ever. — [39](../site/chapters/39-outbox.html)
11. **A poison pill blocks its partition forever.** There is no per-record reject. — [19](../site/chapters/19-serialization.html)
12. **Compaction keeps the latest value per key.** A topic becomes a table. — [22](../site/chapters/22-retention-compaction.html)

## The six that separate a senior candidate

Not harder, but the ones that show you have operated something rather than only built it.

1. **RF 3 + min ISR 2** is the standard. Min ISR = RF trades availability for nothing. — [04](../site/chapters/04-replication-isr.html)
2. **A slow handler looks exactly like a crash.** That is the rebalance loop. — [13](../site/chapters/13-rebalancing.html)
3. **Lag measures commits, not work.** Commit-before-processing shows healthy lag while losing data. — [14](../site/chapters/14-lag.html)
4. **A group that disappears looks healthy.** Alert on its absence too. — [33](../site/chapters/33-monitoring.html)
5. **Offset translation is the hard part of failover,** and the untested part. — [36](../site/chapters/36-disaster.html)
6. **Write the event to an outbox table in the same transaction.** One atomic write. — [39](../site/chapters/39-outbox.html)

## [Chapter 00 — The job posting, decoded](../site/chapters/00-the-job-posting.html)

*Start here*

1. **There is no standalone Kafka job here.** It is one line of a Java advert. — [00](../site/chapters/00-the-job-posting.html)
2. **The adverts name the tool and not the model.** That gap is what this course fills. — [00](../site/chapters/00-the-job-posting.html)
3. **29 of 46 chapters are beyond the advert.** The coverage table says which. — [00](../site/chapters/00-the-job-posting.html)
4. **The valuable chapters are offsets, rebalancing, delivery semantics, idempotency and the outbox.** — [00](../site/chapters/00-the-job-posting.html)
5. **Claim the model and a local cluster.** Not production experience you do not have. — [00](../site/chapters/00-the-job-posting.html)

## [Chapter 01 — Why a log, and not a queue](../site/chapters/01-why-a-log.html)

*Part 1 — The log, and why it is a log*

1. **Reading is not destroying.** Many independent consumers, no coordination. — [01](../site/chapters/01-why-a-log.html)
2. **Replay is an ordinary operation,** not a recovery procedure. — [01](../site/chapters/01-why-a-log.html)
3. **Fast because it does less** sequential appends, page cache, zero-copy, batching. — [01](../site/chapters/01-why-a-log.html)
4. **No per-message routing, priority or individual ack.** Those are queue features. — [01](../site/chapters/01-why-a-log.html)
5. **If you need a queue, say so.** Bending Kafka into one costs and buys nothing. — [01](../site/chapters/01-why-a-log.html)

## [Chapter 02 — Topics, partitions and keys](../site/chapters/02-topics-partitions.html)

*Part 1 — The log, and why it is a log*

1. **A partition is the log; a topic is a name for a set of them.** — [02](../site/chapters/02-topics-partitions.html)
2. **Ordering is per-partition.** There is no global order, and assuming one is the classic bug. — [02](../site/chapters/02-topics-partitions.html)
3. **Partition count caps consumer parallelism** in a group. — [02](../site/chapters/02-topics-partitions.html) · [32](../site/chapters/32-sizing-topics.html)
4. **A null key means no ordering guarantee.** Fine for telemetry, wrong for a lifecycle. — [02](../site/chapters/02-topics-partitions.html)
5. **Adding partitions breaks per-key ordering for existing keys,** and you cannot remove them. — [02](../site/chapters/02-topics-partitions.html)

## [Chapter 03 — Brokers, the cluster and the controller](../site/chapters/03-brokers-cluster.html)

*Part 1 — The log, and why it is a log*

1. **One leader per partition.** All produce and consume traffic for it goes there. — [03](../site/chapters/03-brokers-cluster.html)
2. **A partition on disk is segment files.** Retention deletes segments, not records. — [03](../site/chapters/03-brokers-cluster.html)
3. **`bootstrap.servers` is a starting point;** clients then talk to leaders directly. — [03](../site/chapters/03-brokers-cluster.html)
4. **`advertised.listeners` is the Docker/Kubernetes trap.** Connects, then times out. — [03](../site/chapters/03-brokers-cluster.html)
5. **List several bootstrap servers.** One is a needless single point of failure. — [03](../site/chapters/03-brokers-cluster.html)
6. **Failover is a metadata operation.** Leadership moves; data does not. — [03](../site/chapters/03-brokers-cluster.html)

## [Chapter 04 — Replication, ISR and leader election](../site/chapters/04-replication-isr.html)

*Part 1 — The log, and why it is a log*

1. **Durability is expressed in terms of the ISR,** not the replication factor. — [04](../site/chapters/04-replication-isr.html)
2. **A rejected write is the system being honest.** Prefer it to a silent one. — [04](../site/chapters/04-replication-isr.html)
3. **Unclean leader election off** unless a gap in that topic is genuinely harmless. — [04](../site/chapters/04-replication-isr.html)
4. **Watch under-replicated partitions.** Nothing else tells you the ISR shrank. — [04](../site/chapters/04-replication-isr.html)

## [Chapter 05 — ZooKeeper, KRaft and the migration](../site/chapters/05-zookeeper-kraft.html)

*Part 1 — The log, and why it is a log*

1. **ZooKeeper held cluster metadata and elected the controller.** Never consumer offsets, since 0.9. — [05](../site/chapters/05-zookeeper-kraft.html)
2. **KRaft puts metadata in Kafka’s own Raft log.** One system, faster failover. — [05](../site/chapters/05-zookeeper-kraft.html)
3. **Kafka 4.0 removed ZooKeeper.** Still running it implies a version ceiling. — [05](../site/chapters/05-zookeeper-kraft.html)
4. **Clients never talked to ZooKeeper anyway.** The migration is an operations project. — [05](../site/chapters/05-zookeeper-kraft.html)
5. **Offsets live in `__consumer_offsets`.** Saying otherwise dates you. — [05](../site/chapters/05-zookeeper-kraft.html)

## [Chapter 06 — The producer API](../site/chapters/06-producer-api.html)

*Part 2 — Producing*

1. **`send()` buffers and returns.** Nothing has been sent yet. — [06](../site/chapters/06-producer-api.html)
2. **Always close the producer.** Unflushed records disappear silently. — [06](../site/chapters/06-producer-api.html)
3. **Handle the callback.** Ignoring it turns a failure into silent loss. — [06](../site/chapters/06-producer-api.html)
4. **`.get()` makes it synchronous** and costs an order of magnitude. — [06](../site/chapters/06-producer-api.html)
5. **Use headers** for trace context, event type and correlation id. — [06](../site/chapters/06-producer-api.html)
6. **`delivery.timeout.ms` bounds a send,** not `retries`. — [06](../site/chapters/06-producer-api.html)
7. **A full buffer blocks.** Back-pressure moves; it does not vanish. — [06](../site/chapters/06-producer-api.html)

## [Chapter 07 — Partitioning: how a key chooses a partition](../site/chapters/07-partitioning-keys.html)

*Part 2 — Producing*

1. **`murmur2(key) % partitions`** deterministic, and changes when the count does. — [07](../site/chapters/07-partitioning-keys.html)
2. **Null key means no ordering guarantee.** Sticky batching is about throughput, not order. — [07](../site/chapters/07-partitioning-keys.html)
3. **The key is ordering and parallelism at once.** They pull opposite ways. — [07](../site/chapters/07-partitioning-keys.html)
4. **Pick the smallest scope your domain actually needs ordered.** — [07](../site/chapters/07-partitioning-keys.html)
5. **Skewed keys make hot partitions,** and more consumers will not help. — [07](../site/chapters/07-partitioning-keys.html)
6. **Prefer a composite key to a custom partitioner.** Logic in the data beats logic in a class. — [07](../site/chapters/07-partitioning-keys.html)

## [Chapter 08 — Batching, linger, compression and throughput](../site/chapters/08-batching-compression.html)

*Part 2 — Producing*

1. **`batch.size` is bytes, `linger.ms` is time.** Either one triggers a send. — [08](../site/chapters/08-batching-compression.html)
2. **`linger.ms=0` still batches** it just never waits on purpose. — [08](../site/chapters/08-batching-compression.html)
3. **5–20 ms of linger is usually a large win** for a bounded latency cost. — [08](../site/chapters/08-batching-compression.html)
4. **Compression is per batch,** so bigger batches compress better. `zstd` by default. — [08](../site/chapters/08-batching-compression.html)
5. **Mismatched compression forces broker recompression.** Invisible, expensive. — [08](../site/chapters/08-batching-compression.html)
6. **Check `batch-size-avg`.** Far below the ceiling means linger is the limit. — [08](../site/chapters/08-batching-compression.html)

## [Chapter 09 — acks, retries and the idempotent producer](../site/chapters/09-producer-acks.html)

*Part 2 — Producing*

1. **`acks=all` + `min.insync.replicas=2`** for anything with business meaning. — [09](../site/chapters/09-producer-acks.html)
2. **The latency cost is per batch, not per record.** Smaller than people assume. — [09](../site/chapters/09-producer-acks.html)
3. **A lost acknowledgement plus a retry used to mean a duplicate.** — [09](../site/chapters/09-producer-acks.html)
4. **Retries could also reorder,** breaking the only ordering guarantee there is. — [09](../site/chapters/09-producer-acks.html)
5. **`enable.idempotence` is the default since 3.0** and sets acks, retries and in-flight for you. — [09](../site/chapters/09-producer-acks.html)
6. **It deduplicates retries, not your application logic.** Different problem, chapter 39. — [09](../site/chapters/09-producer-acks.html)

## [Chapter 10 — The consumer API](../site/chapters/10-consumer-api.html)

*Part 3 — Consuming*

1. **`poll()` is the fetch loop and group participation together.** — [10](../site/chapters/10-consumer-api.html)
2. **`max.poll.interval.ms` bounds processing time,** not just idle time. — [10](../site/chapters/10-consumer-api.html)
3. **A slow handler gets you evicted** and triggers a rebalance, with no error. — [10](../site/chapters/10-consumer-api.html)
4. **`KafkaConsumer` is not thread-safe.** One consumer per thread. — [10](../site/chapters/10-consumer-api.html)
5. **More consumers than partitions do nothing.** The partition count is the ceiling. — [10](../site/chapters/10-consumer-api.html)
6. **`subscribe` for services, `assign` for tools.** — [10](../site/chapters/10-consumer-api.html)

## [Chapter 11 — Consumer groups and the assignment](../site/chapters/11-consumer-groups.html)

*Part 3 — Consuming*

1. **Same group id shares the work; different group ids each get everything.** — [11](../site/chapters/11-consumer-groups.html)
2. **Name group ids by purpose,** never by application or environment. — [11](../site/chapters/11-consumer-groups.html)
3. **Sharing a group id between two different consumers splits the stream.** Silently. — [11](../site/chapters/11-consumer-groups.html)
4. **CooperativeSticky.** Incremental rebalancing, minimal movement. — [11](../site/chapters/11-consumer-groups.html) · [13](../site/chapters/13-rebalancing.html)
5. **Static membership removes rolling-restart rebalances** at the cost of slower failover. — [11](../site/chapters/11-consumer-groups.html)

## [Chapter 12 — Offsets: committing, resetting and replaying](../site/chapters/12-offsets.html)

*Part 3 — Consuming*

1. **Offsets are per group, per partition, in `__consumer_offsets`.** — [12](../site/chapters/12-offsets.html)
2. **Only the committed offset survives a crash.** The in-memory position does not. — [12](../site/chapters/12-offsets.html)
3. **Commit `offset + 1`.** Off by one means a permanent duplicate per restart. — [12](../site/chapters/12-offsets.html)
4. **`auto.offset.reset` only applies when there is no committed offset.** — [12](../site/chapters/12-offsets.html)
5. **Replay is `--reset-offsets` with the group stopped.** Dry-run first. — [12](../site/chapters/12-offsets.html)

## [Chapter 13 — Rebalancing, and the pause everyone blames on the network](../site/chapters/13-rebalancing.html)

*Part 3 — Consuming*

1. **Membership change means reassignment.** Joins, leaves, timeouts, partition-count changes. — [13](../site/chapters/13-rebalancing.html)
2. **Eager rebalancing stops the whole group.** Longer still for stateful consumers. — [13](../site/chapters/13-rebalancing.html)
3. **`max.poll.interval.ms` governs processing time,** not `session.timeout.ms`. — [13](../site/chapters/13-rebalancing.html)
4. **Reduce `max.poll.records`** before raising any timeout. — [13](../site/chapters/13-rebalancing.html)

## [Chapter 14 — Consumer lag: measuring it and fixing it](../site/chapters/14-lag.html)

*Part 3 — Consuming*

1. **Lag = log end offset − committed offset,** per partition. — [14](../site/chapters/14-lag.html)
2. **The trend matters, not the value.** Flat-and-large is fine; small-and-climbing is not. — [14](../site/chapters/14-lag.html)
3. **One partition lagging is a hot key.** All of them is capacity or a rebalance loop. — [14](../site/chapters/14-lag.html)
4. **Alert on sustained growth and on time behind,** not on a fixed record count. — [14](../site/chapters/14-lag.html)

## [Chapter 15 — At-most-once, at-least-once, exactly-once](../site/chapters/15-delivery-semantics.html)

*Part 4 — Delivery guarantees*

1. **The order of processing and committing decides the semantics.** That is the whole mechanism. — [15](../site/chapters/15-delivery-semantics.html)
2. **Auto-commit gives you duplicates and occasional loss.** The worst of both. — [15](../site/chapters/15-delivery-semantics.html)
3. **Kafka’s EOS is Kafka-to-Kafka.** Writing to a database crosses the boundary. — [15](../site/chapters/15-delivery-semantics.html)
4. **Choose per consumer,** by what a duplicate and a loss each cost. — [15](../site/chapters/15-delivery-semantics.html)

## [Chapter 16 — Idempotent consumers and deduplication](../site/chapters/16-idempotent-consumers.html)

*Part 4 — Delivery guarantees*

1. **Reshape the operation first.** “Set to PAID” beats “add 10”. — [16](../site/chapters/16-idempotent-consumers.html)
2. **Check-then-act is a race.** Two concurrent deliveries both pass the check. — [16](../site/chapters/16-idempotent-consumers.html)
3. **Treat the constraint violation as success.** It means somebody already did it. — [16](../site/chapters/16-idempotent-consumers.html)
4. **Bound the dedup store.** Duplicates arrive in minutes; keep days, not years. — [16](../site/chapters/16-idempotent-consumers.html)
5. **External side effects need their own idempotency key.** — [16](../site/chapters/16-idempotent-consumers.html)

## [Chapter 17 — Kafka transactions and read-committed](../site/chapters/17-transactions.html)

*Part 4 — Delivery guarantees*

1. **A transaction spans Kafka writes and the offset commit,** atomically. — [17](../site/chapters/17-transactions.html)
2. **`transactional.id` fences zombies.** That is what makes it survive restarts. — [17](../site/chapters/17-transactions.html)
3. **Consumers must set `read_committed`,** or the whole thing does nothing. — [17](../site/chapters/17-transactions.html)
4. **An open transaction stalls read-committed consumers** on that partition. — [17](../site/chapters/17-transactions.html)
5. **The boundary is Kafka.** A database write is outside it, always. — [17](../site/chapters/17-transactions.html)
6. **Streams with `exactly_once_v2`** is where this pays off most. — [17](../site/chapters/17-transactions.html)

## [Chapter 18 — Ordering: what Kafka guarantees and what it does not](../site/chapters/18-ordering.html)

*Part 4 — Delivery guarantees*

1. **Total ordering means one partition,** one consumer, and a throughput ceiling. — [18](../site/chapters/18-ordering.html)
2. **Adding partitions breaks ordering for existing keys.** Permanently. — [18](../site/chapters/18-ordering.html)
3. **A worker pool inside the consumer undoes the guarantee.** Partition workers by key. — [18](../site/chapters/18-ordering.html)
4. **Retry topics reorder.** If order matters, failure must block the key. — [18](../site/chapters/18-ordering.html)
5. **Version your events and send state, not deltas.** Then late arrival is harmless. — [18](../site/chapters/18-ordering.html)

## [Chapter 19 — Serialisation: JSON, Avro and Protobuf](../site/chapters/19-serialization.html)

*Part 5 — Data on the wire*

1. **The broker stores bytes and validates nothing.** The contract is yours to keep. — [19](../site/chapters/19-serialization.html)
2. **JSON is readable and repeats every field name.** Fine at low volume, costly at high. — [19](../site/chapters/19-serialization.html)
3. **Avro or Protobuf for anything high-volume or long-lived.** — [19](../site/chapters/19-serialization.html)
4. **Wrap deserialisers in an error handler and route to a DLT** before you need it. — [19](../site/chapters/19-serialization.html)
5. **Deserialisation failures are never retryable.** Retrying is a loop, not a recovery. — [19](../site/chapters/19-serialization.html)

## [Chapter 20 — Schema Registry and schema evolution](../site/chapters/20-schema-registry.html)

*Part 5 — Data on the wire*

1. **The registry enforces the contract the broker will not.** Its refusals are the value. — [20](../site/chapters/20-schema-registry.html)
2. **Wire format: magic byte, schema id, payload.** Five bytes, not a repeated schema. — [20](../site/chapters/20-schema-registry.html)
3. **Clients cache by id,** but the registry is a start-up dependency. — [20](../site/chapters/20-schema-registry.html)
4. **Turn off `auto.register.schemas` in production.** — [20](../site/chapters/20-schema-registry.html)
5. **Every new field gets a default.** That is what makes addition safe. — [20](../site/chapters/20-schema-registry.html)
6. **Renames are expand-and-contract,** exactly as in a database. — [20](../site/chapters/20-schema-registry.html)

## [Chapter 21 — Compatibility modes, and the change that breaks consumers](../site/chapters/21-compatibility.html)

*Part 5 — Data on the wire*

1. **BACKWARD: new consumer reads old data.** FORWARD: old consumer reads new data. — [21](../site/chapters/21-compatibility.html)
2. **The mode decides deployment order.** BACKWARD means consumers first. — [21](../site/chapters/21-compatibility.html)
3. **Use the `_TRANSITIVE` variants,** or old retained data can become unreadable. — [21](../site/chapters/21-compatibility.html)
4. **A rename is a delete plus an add.** Expand and contract instead. — [21](../site/chapters/21-compatibility.html)
5. **Set compatibility per subject,** stricter the more consumers there are. — [21](../site/chapters/21-compatibility.html)
6. **Check it in CI.** The failure belongs to the producer’s build. — [21](../site/chapters/21-compatibility.html)

## [Chapter 22 — Retention, compaction and tiered storage](../site/chapters/22-retention-compaction.html)

*Part 5 — Data on the wire*

1. **Retention is time or size, whichever first,** and deletion is per segment. — [22](../site/chapters/22-retention-compaction.html)
2. **Set retention from the replay window you want.** The default is seven days. — [22](../site/chapters/22-retention-compaction.html)
3. **A null value is a tombstone.** That is how a key is deleted. — [22](../site/chapters/22-retention-compaction.html)
4. **A compacted topic is a snapshot, not an audit trail.** Intermediate values are lost. — [22](../site/chapters/22-retention-compaction.html)
5. **Tiered storage makes long retention affordable,** at read latency. — [22](../site/chapters/22-retention-compaction.html)

## [Chapter 23 — Kafka Streams: the topology](../site/chapters/23-streams-intro.html)

*Part 6 — Kafka Streams*

1. **A library in your JVM.** No cluster, no scheduler, deploy it like any service. — [23](../site/chapters/23-streams-intro.html)
2. **Kafka-to-Kafka only.** Other sources and sinks are Connect’s job. — [23](../site/chapters/23-streams-intro.html)
3. **Print `topology.describe()`** and read the internal topics it names. — [23](../site/chapters/23-streams-intro.html)
4. **One task per input partition.** Partition count is the parallelism ceiling. — [23](../site/chapters/23-streams-intro.html)
5. **`application.id` is the group id** and prefixes every internal topic. — [23](../site/chapters/23-streams-intro.html)
6. **Changing `application.id` orphans all state.** — [23](../site/chapters/23-streams-intro.html)

## [Chapter 24 — KStream, KTable and the duality](../site/chapters/24-ktable-kstream.html)

*Part 6 — Kafka Streams*

1. **A KStream is facts; a KTable is the latest value per key.** — [24](../site/chapters/24-ktable-kstream.html)
2. **A compacted topic read as a table** is the duality made concrete. — [24](../site/chapters/24-ktable-kstream.html)
3. **Ask whether two records for one key both happened, or are one thing updated.** — [24](../site/chapters/24-ktable-kstream.html)
4. **Aggregating a table subtracts the old value.** Aggregating a stream does not — wrong choice, wrong totals. — [24](../site/chapters/24-ktable-kstream.html)
5. **GlobalKTable replicates everything everywhere.** Small reference data only. — [24](../site/chapters/24-ktable-kstream.html)
6. **Joins require co-partitioning,** or you pay for a repartition topic. — [24](../site/chapters/24-ktable-kstream.html)

## [Chapter 25 — Windowing, time and out-of-order events](../site/chapters/25-windowing.html)

*Part 6 — Kafka Streams*

1. **Event time is when it happened; processing time is when you saw it.** — [25](../site/chapters/25-windowing.html)
2. **Event time makes reprocessing deterministic.** That is the strongest argument for it. — [25](../site/chapters/25-windowing.html)
3. **Tumbling, hopping, sliding, session.** Session windows come from behaviour, not the clock. — [25](../site/chapters/25-windowing.html)
4. **Hopping windows multiply output and state.** Check before choosing one. — [25](../site/chapters/25-windowing.html)
5. **Grace trades completeness against latency and memory.** — [25](../site/chapters/25-windowing.html)
6. **Count dropped-late records.** Non-zero means your numbers are wrong. — [25](../site/chapters/25-windowing.html)
7. **Stream time advances from records, not the clock.** A quiet partition never closes its windows. — [25](../site/chapters/25-windowing.html)

## [Chapter 26 — State stores, RocksDB and interactive queries](../site/chapters/26-state-stores.html)

*Part 6 — Kafka Streams*

1. **Local RocksDB for speed, compacted changelog topic for durability.** — [26](../site/chapters/26-state-stores.html)
2. **A restore from an empty disk replays the whole changelog.** Minutes to hours. — [26](../site/chapters/26-state-stores.html)
3. **Persistent volumes, standby replicas, static membership.** The three mitigations. — [26](../site/chapters/26-state-stores.html)
4. **RocksDB memory is off-heap.** Heap metrics will not show it, and the container will kill you. — [26](../site/chapters/26-state-stores.html)
5. **Interactive queries can replace a read database** if you build the forwarding. — [26](../site/chapters/26-state-stores.html)
6. **State is partitioned.** A key lives on exactly one instance. — [26](../site/chapters/26-state-stores.html)

## [Chapter 27 — ksqlDB, and when SQL is enough](../site/chapters/27-ksqldb.html)

*Part 6 — Kafka Streams*

1. **Kafka Streams underneath, SQL on top.** Same topologies, same state stores. — [27](../site/chapters/27-ksqldb.html)
2. **Push queries stream; pull queries read state.** — [27](../site/chapters/27-ksqldb.html)
3. **Best for exploration** the fastest way to see what is on a topic. — [27](../site/chapters/27-ksqldb.html)
4. **Testing is the real weakness.** No `TopologyTestDriver` equivalent. — [27](../site/chapters/27-ksqldb.html)
5. **A query left running is an unowned production job.** Put it in git. — [27](../site/chapters/27-ksqldb.html)
6. **Knowing a tool is unnecessary is worth saying.** — [27](../site/chapters/27-ksqldb.html)

## [Chapter 28 — Kafka Connect: sources and sinks](../site/chapters/28-connect.html)

*Part 7 — Connect and the ecosystem*

1. **Configuration, not code** and the reason is correctness, not effort. — [28](../site/chapters/28-connect.html)
2. **Distributed mode in production.** Config, offsets and status live in Kafka topics. — [28](../site/chapters/28-connect.html)
3. **Managed over a REST API.** So keep the configs in git and apply from the pipeline. — [28](../site/chapters/28-connect.html)
4. **SMTs are per record.** No joins, no aggregation. — [28](../site/chapters/28-connect.html)
5. **Connect moves, Streams transforms.** Six chained SMTs means you crossed the line. — [28](../site/chapters/28-connect.html)
6. **Set `errors.tolerance` and a DLQ,** and monitor connector status. — [28](../site/chapters/28-connect.html)

## [Chapter 29 — Change data capture with Debezium](../site/chapters/29-cdc-debezium.html)

*Part 7 — Connect and the ecosystem*

1. **Read the transaction log, not the table.** Polling misses deletes and intermediate states. — [29](../site/chapters/29-cdc-debezium.html)
2. **Runs as a Connect source connector.** — [29](../site/chapters/29-cdc-debezium.html)
3. **This is how Kafka arrives in a legacy shop** without touching the application. — [29](../site/chapters/29-cdc-debezium.html)
4. **The initial snapshot is the risky part.** Ask about incremental snapshotting. — [29](../site/chapters/29-cdc-debezium.html)
5. **Ordering is per row, not across tables.** — [29](../site/chapters/29-cdc-debezium.html)
6. **Raw CDC couples consumers to the legacy schema.** Put a translation stage in front. — [29](../site/chapters/29-cdc-debezium.html)

## [Chapter 30 — REST Proxy, and clients in other languages](../site/chapters/30-rest-proxy-clients.html)

*Part 7 — Connect and the ecosystem*

1. **Most non-JVM clients are librdkafka,** so their configuration vocabulary is shared. — [30](../site/chapters/30-rest-proxy-clients.html)
2. **Streams and transactions are JVM-only.** Stateful streaming in Python is a different tool. — [30](../site/chapters/30-rest-proxy-clients.html)
3. **REST Proxy for produce, reluctantly for consume.** Consuming over HTTP fights the model. — [30](../site/chapters/30-rest-proxy-clients.html)
4. **The proxy is a hop you must size, monitor and make redundant.** — [30](../site/chapters/30-rest-proxy-clients.html)
5. **Bridges translate at the edge.** Domain events out, never the vendor’s vocabulary. — [30](../site/chapters/30-rest-proxy-clients.html)
6. **Assume the bridge restarts mid-stream.** Idempotent and resumable. — [30](../site/chapters/30-rest-proxy-clients.html)

## [Chapter 31 — Confluent, Apache, Redpanda and the managed options](../site/chapters/31-confluent-vs-apache.html)

*Part 7 — Connect and the ecosystem*

1. **Schema Registry is Confluent, not Apache.** Its licence is a real consideration. — [31](../site/chapters/31-confluent-vs-apache.html)
2. **Redpanda is wire-compatible** no JVM, no ZooKeeper, smaller ecosystem. — [31](../site/chapters/31-confluent-vs-apache.html)
3. **Managed removes broker operations, not Kafka operations.** — [31](../site/chapters/31-confluent-vs-apache.html)
4. **Managed pricing bills egress per consumer group.** Another group has a monthly cost. — [31](../site/chapters/31-confluent-vs-apache.html)
5. **CCDAK is a screening signal,** worth more the less Kafka experience you have. — [31](../site/chapters/31-confluent-vs-apache.html)

## [Chapter 32 — Sizing: partitions, throughput and how many is too many](../site/chapters/32-sizing-topics.html)

*Part 8 — Running it*

1. **Size from measured per-consumer throughput,** then add headroom. — [32](../site/chapters/32-sizing-topics.html)
2. **You cannot reduce the count,** and increasing it breaks per-key ordering. — [32](../site/chapters/32-sizing-topics.html)
3. **Partitions cost file handles, memory, election and rebalance time.** — [32](../site/chapters/32-sizing-topics.html)
4. **Group event types on one topic when their relative order matters.** — [32](../site/chapters/32-sizing-topics.html)
5. **Decide a naming convention once.** Topic names are effectively permanent. — [32](../site/chapters/32-sizing-topics.html)

## [Chapter 33 — Monitoring with Prometheus and Grafana](../site/chapters/33-monitoring.html)

*Part 8 — Running it*

1. **JMX exporter for brokers, a lag exporter for groups.** The second covers apps that export nothing. — [33](../site/chapters/33-monitoring.html)
2. **Under-replicated and offline partitions should be zero;** active controllers exactly one. — [33](../site/chapters/33-monitoring.html)
3. **Lag per group and per partition** is the most informative number you have. — [33](../site/chapters/33-monitoring.html)
4. **Alert on symptoms and durability,** never on CPU or message rate. — [33](../site/chapters/33-monitoring.html)
5. **Time-based lag beats record counts.** “Twenty minutes behind” is actionable. — [33](../site/chapters/33-monitoring.html)

## [Chapter 34 — Security: TLS, SASL and ACLs](../site/chapters/34-security.html)

*Part 8 — Running it*

1. **Encryption, authentication and authorisation are three settings.** One does not imply another. — [34](../site/chapters/34-security.html)
2. **SCRAM usually; Kerberos in banks and public administration.** — [34](../site/chapters/34-security.html)
3. **`allow.everyone.if.no.acl.found` defaults to true.** Authentication alone protects nothing. — [34](../site/chapters/34-security.html)
4. **A consumer needs Read on the topic and on the group.** — [34](../site/chapters/34-security.html)
5. **Prefixed ACLs per team,** not one rule per topic. — [34](../site/chapters/34-security.html)
6. **TLS is not encryption at rest,** and you cannot delete one record for GDPR. — [34](../site/chapters/34-security.html)

## [Chapter 35 — Kafka on Kubernetes and OpenShift](../site/chapters/35-kubernetes.html)

*Part 8 — Running it*

1. **Brokers have identity, disks and per-broker addressability.** StatefulSet, never Deployment. — [35](../site/chapters/35-kubernetes.html)
2. **Use an operator.** Strimzi, or AMQ Streams on OpenShift. — [35](../site/chapters/35-kubernetes.html)
3. **Declarative topics and ACLs in git** is the operator’s best feature. — [35](../site/chapters/35-kubernetes.html)
4. **Storage class decides your latency.** Local disk beats network storage. — [35](../site/chapters/35-kubernetes.html)
5. **A volume that cannot reattach means a broker re-replicating from empty.** — [35](../site/chapters/35-kubernetes.html)
6. **“Should we?” is a team-capacity question,** not a technical one. — [35](../site/chapters/35-kubernetes.html)

## [Chapter 36 — Disaster, replay and the day you must reprocess](../site/chapters/36-disaster.html)

*Part 8 — Running it*

1. **Replay is only safe if consumers are idempotent** and retention reaches back far enough. — [36](../site/chapters/36-disaster.html)
2. **Replay into a new topic or group,** compare, then switch. — [36](../site/chapters/36-disaster.html)
3. **Replay re-fires every side effect.** Enumerate and gate them first. — [36](../site/chapters/36-disaster.html)
4. **MirrorMaker 2 replicates asynchronously.** RPO of zero is not on offer. — [36](../site/chapters/36-disaster.html)
5. **Rehearse and time it.** An untested procedure is a document. — [36](../site/chapters/36-disaster.html)

## [Chapter 37 — Event-driven architecture: the shape](../site/chapters/37-event-driven.html)

*Part 9 — Designing event-driven systems*

1. **It removes address and temporal coupling, not schema coupling.** — [37](../site/chapters/37-event-driven.html)
2. **Adding a consumer requires no producer change.** That is the real benefit. — [37](../site/chapters/37-event-driven.html)
3. **Choreography for notification, orchestration for a process with an outcome.** — [37](../site/chapters/37-event-driven.html)
4. **If nobody can draw the flow, the process is implicit.** Time for an orchestrator. — [37](../site/chapters/37-event-driven.html)
5. **Eventual consistency is a product decision,** and the UI has to handle it. — [37](../site/chapters/37-event-driven.html)
6. **Distributed tracing is not optional** once the failure happens elsewhere. — [37](../site/chapters/37-event-driven.html)

## [Chapter 38 — Events, commands and the naming that decides your coupling](../site/chapters/38-events-vs-commands.html)

*Part 9 — Designing event-driven systems*

1. **Events are facts in the past; commands are instructions with a recipient.** — [38](../site/chapters/38-events-vs-commands.html)
2. **A command-shaped topic name means the publisher knows its consumer.** — [38](../site/chapters/38-events-vs-commands.html)
3. **`<domain>.<entity>.<past-tense>`,** and the architecture follows. — [38](../site/chapters/38-events-vs-commands.html)
4. **Request–reply over two topics is RPC with worse ergonomics.** Use HTTP. — [38](../site/chapters/38-events-vs-commands.html)
5. **Event-carried state transfer over notification,** or you rebuild the callback. — [38](../site/chapters/38-events-vs-commands.html)
6. **Do not publish the whole aggregate.** That is maximum schema coupling. — [38](../site/chapters/38-events-vs-commands.html)

## [Chapter 39 — The outbox pattern and dual writes](../site/chapters/39-outbox.html)

*Part 9 — Designing event-driven systems*

1. **Either ordering has a silent failure case.** Retrying in a catch does not close it. — [39](../site/chapters/39-outbox.html)
2. **Publishing inside the transaction is the worst version** consumers act on a rollback. — [39](../site/chapters/39-outbox.html)
3. **Relay with CDC or a poller.** At-least-once, so consumers dedup. — [39](../site/chapters/39-outbox.html)
4. **Key the message by aggregate id** to keep per-entity ordering. — [39](../site/chapters/39-outbox.html)

## [Chapter 40 — Sagas and distributed consistency](../site/chapters/40-saga.html)

*Part 9 — Designing event-driven systems*

1. **Two-phase commit holds locks across services and blocks on coordinator failure.** — [40](../site/chapters/40-saga.html)
2. **A saga is local transactions plus compensating actions.** A refund, not a rollback. — [40](../site/chapters/40-saga.html)
3. **Orchestration for a process with a defined outcome.** Choreography hides it. — [40](../site/chapters/40-saga.html)
4. **Put irreversible steps last.** You cannot un-send an email. — [40](../site/chapters/40-saga.html)
5. **Every step and every compensation is idempotent,** and the state is persisted. — [40](../site/chapters/40-saga.html)
6. **Have a manual queue for failed compensation.** That is where automation ends. — [40](../site/chapters/40-saga.html)

## [Chapter 41 — Spring Kafka in practice](../site/chapters/41-spring-kafka.html)

*Part 9 — Designing event-driven systems*

1. **The container owns the poll loop.** `concurrency` is capped by partitions. — [41](../site/chapters/41-spring-kafka.html)
2. **Boot’s defaults commit after the batch** at-least-once, as you want. — [41](../site/chapters/41-spring-kafka.html)
3. **Classify exceptions.** Non-retryable ones go straight to the DLT. — [41](../site/chapters/41-spring-kafka.html)
4. **`@RetryableTopic` trades ordering for throughput.** Know which you need. — [41](../site/chapters/41-spring-kafka.html)
5. **A DLT nobody watches is a delete.** Alert on arrivals. — [41](../site/chapters/41-spring-kafka.html)
6. **Testcontainers, and test that processing twice is safe.** — [41](../site/chapters/41-spring-kafka.html)

## [Chapter 42 — Agile, Scrum and the ceremonies](../site/chapters/42-agile-scrum.html)

*Part 10 — The human requirements*

1. **Stand-up is synchronisation.** Lead with blockers. — [42](../site/chapters/42-agile-scrum.html)
2. **Refinement is the leverage point.** Ask who else consumes it, and what a duplicate costs. — [42](../site/chapters/42-agile-scrum.html)
3. **“I need a spike” beats a guess,** and flag slippage early. — [42](../site/chapters/42-agile-scrum.html)
4. **Describe how you worked, then ask how they work.** Doctrine reads badly. — [42](../site/chapters/42-agile-scrum.html)
5. **Small PRs; commit messages say why.** — [42](../site/chapters/42-agile-scrum.html)
6. **An event is a public API.** Document its schema, key and ordering guarantee. — [42](../site/chapters/42-agile-scrum.html)

## [Chapter 43 — The English the advert means](../site/chapters/43-english.html)

*Part 10 — The human requirements*

1. **B2: follow, be understood, write clearly.** The accent is not the problem. — [43](../site/chapters/43-english.html)
2. **Ask for repetition without apologising.** Silence is what they screen for. — [43](../site/chapters/43-english.html)
3. **The technical vocabulary stays English.** Translating it marks you as bookish. — [43](../site/chapters/43-english.html)
4. **Learn fixed phrases** for disagreeing, buying time and reporting delay. — [43](../site/chapters/43-english.html)
5. **Eventually ≠ eventualmente; actually ≠ attualmente.** — [43](../site/chapters/43-english.html)
6. **Conclusion first. Say what you need and by when.** — [43](../site/chapters/43-english.html)

## [Chapter 44 — The CV and the ATS](../site/chapters/44-the-cv.html)

*Part 10 — The human requirements*

1. **Single column, real text, the advert’s own words.** Alignment, never stuffing. — [44](../site/chapters/44-the-cv.html)
2. **Verify the extracted text layer.** Layout changes reorder it silently. — [44](../site/chapters/44-the-cv.html)
3. **Never a bare “Apache Kafka” in a skills list.** Say what you built. — [44](../site/chapters/44-the-cv.html)
4. **The test: would you be happy discussing this line for five minutes?** — [44](../site/chapters/44-the-cv.html)
5. **Kafka is often interviewed by whoever operates it.** The follow-ups are specific. — [44](../site/chapters/44-the-cv.html)
6. **One small complete system beats certificates.** — [44](../site/chapters/44-the-cv.html)

## [Chapter 45 — The interview](../site/chapters/45-the-interview.html)

*Part 10 — The human requirements*

1. **Ask about scale, staleness and ordering first.** Those answers decide the design. — [45](../site/chapters/45-the-interview.html)
2. **Name the key, the guarantee, and how you would detect failure.** — [45](../site/chapters/45-the-interview.html)
3. **Raise the dual-write problem before they do.** — [45](../site/chapters/45-the-interview.html)
4. **Do not propose Kafka for request–response.** Knowing when not to is the answer. — [45](../site/chapters/45-the-interview.html)
5. **“I do not know, but…” beats a confident guess.** Always. — [45](../site/chapters/45-the-interview.html)
6. **RAL as a gross annual range;** ask about CCNL, level and mensilità. — [45](../site/chapters/45-the-interview.html)
7. **Ask who owns topic design.** The answer tells you what the job really is. — [45](../site/chapters/45-the-interview.html)
