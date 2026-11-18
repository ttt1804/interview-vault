# Nguồn đối chiếu Kafka

Ngày truy cập: 2026-11-18. Môi trường chạy thử: Java HotSpot 17.0.12, chỉ cho các phép thử không cần broker.

## Tài liệu Apache Kafka

| Nội dung | Nguồn | Phiên bản |
| --- | --- | --- |
| Cấu hình producer | [Producer Configs](https://kafka.apache.org/44/configuration/producer-configs/) | 4.4 |
| Cấu hình consumer | [Consumer Configs](https://kafka.apache.org/44/configuration/consumer-configs/) | 4.4 |
| Cấu hình broker | [Broker Configs](https://kafka.apache.org/44/configuration/broker-configs/) | 4.4 |
| Cấu hình topic | [Topic Configs](https://kafka.apache.org/44/configuration/topic-configs/) | 4.4 |
| Replication, ISR, đĩa | [Design](https://kafka.apache.org/44/design/design/) | 4.4 |
| Thay đổi theo phiên bản | [Upgrade](https://kafka.apache.org/44/getting-started/upgrade/) | 4.4 |
| Vận hành, reassign, shutdown | [Basic Kafka Operations](https://kafka.apache.org/44/operations/basic-kafka-operations/) | 4.4 |
| Tiered storage | [Tiered Storage](https://kafka.apache.org/44/operations/tiered-storage/), [thông báo 3.9](https://kafka.apache.org/blog/2024/11/06/apache-kafka-3.9.0-release-announcement/) | 4.4, 3.9 |
| ACL | [Authorization and ACLs](https://kafka.apache.org/44/security/authorization-and-acls/) | 4.4 |
| Streams | [Streams Config](https://kafka.apache.org/44/streams/developer-guide/config-streams/) | 4.4 |

## KIP

| Nội dung | Nguồn |
| --- | --- |
| Sticky partitioner | [KIP-794](https://cwiki.apache.org/confluence/display/KAFKA/KIP-794%3A+Strictly+Uniform+Sticky+Partitioner) |
| Transaction treo | [KIP-664](https://cwiki.apache.org/confluence/display/KAFKA/KIP-664%3A+Provide+tooling+to+detect+and+abort+hanging+transactions) |
| Producer theo thread | [KIP-447](https://cwiki.apache.org/confluence/display/KAFKA/KIP-447%3A+Producer+scalability+for+exactly+once+semantics) |
| `exactly_once_v2` | [KIP-732](https://cwiki.apache.org/confluence/display/KAFKA/KIP-732%3A+Deprecate+eos-alpha+and+replace+eos-beta+with+eos-v2) |
| zstd | [KIP-110](https://cwiki.apache.org/confluence/display/KAFKA/KIP-110%3A+Add+Codec+for+ZStandard+Compression) |

## Mã nguồn Apache Kafka, tag `4.4.0`

| Nội dung | File |
| --- | --- |
| `send()`, timeout, serializer | [`KafkaProducer.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java) |
| Sticky partitioning | [`BuiltInPartitioner.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/producer/internals/BuiltInPartitioner.java) |
| Auto-commit, poll | [`ConsumerCoordinator.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/consumer/internals/ConsumerCoordinator.java), [`ClassicKafkaConsumer.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/consumer/internals/ClassicKafkaConsumer.java) |
| Heartbeat | [`AbstractCoordinator.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/consumer/internals/AbstractCoordinator.java) |
| Rebalance listener và assignor | [`ConsumerRebalanceListener.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/consumer/ConsumerRebalanceListener.java), [`ConsumerPartitionAssignor.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/consumer/ConsumerPartitionAssignor.java) |
| Cấu hình KIP-848 | [`ConsumerConfig.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/consumer/ConsumerConfig.java) |
| Lỗi deserialize | [`CompletedFetch.java`](https://github.com/apache/kafka/blob/4.4.0/clients/src/main/java/org/apache/kafka/clients/consumer/internals/CompletedFetch.java) |
| Key null trên topic compacted | [`LogValidator.java`](https://github.com/apache/kafka/blob/4.4.0/storage/src/main/java/org/apache/kafka/storage/internals/log/LogValidator.java) |
| Sequence và 5 batch | [`ProducerAppendInfo.java`](https://github.com/apache/kafka/blob/4.4.0/storage/src/main/java/org/apache/kafka/storage/internals/log/ProducerAppendInfo.java), [`ProducerStateEntry.java`](https://github.com/apache/kafka/blob/4.4.0/storage/src/main/java/org/apache/kafka/storage/internals/log/ProducerStateEntry.java), [`UnifiedLog.java`](https://github.com/apache/kafka/blob/4.4.0/storage/src/main/java/org/apache/kafka/storage/internals/log/UnifiedLog.java) |
| High watermark | [`Partition.scala`](https://github.com/apache/kafka/blob/4.4.0/core/src/main/scala/kafka/cluster/Partition.scala) |
| Lỗi log dir | [`ReplicaManager.scala`](https://github.com/apache/kafka/blob/4.4.0/core/src/main/scala/kafka/server/ReplicaManager.scala) |
| Trạng thái transaction | [`TransactionState.java`](https://github.com/apache/kafka/blob/4.4.0/transaction-coordinator/src/main/java/org/apache/kafka/coordinator/transaction/TransactionState.java) |
| Cấu hình Streams | [`StreamsConfig.java`](https://github.com/apache/kafka/blob/4.4.0/streams/src/main/java/org/apache/kafka/streams/StreamsConfig.java) |
| Công cụ CLI | [`tools`](https://github.com/apache/kafka/tree/4.4.0/tools/src/main/java/org/apache/kafka/tools), gồm `ConfigCommand`, `GetOffsetShell`, `DumpLogSegments`, `TransactionsCommand`, `ReassignPartitionsCommand`, `ProducerPerformance`, `ConsumerPerformance`, `ConsoleProducer` |

## Hệ sinh thái

| Nội dung | Nguồn | Phiên bản |
| --- | --- | --- |
| Kinesis | [Quotas and limits](https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html) | Bản hiện hành |
| Schema Registry | [Schema Evolution](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html) | Bản hiện hành |
| Strimzi | [Deploying](https://strimzi.io/docs/operators/latest/deploying) | Bản hiện hành |
| Kubernetes QoS | [Pod QoS](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/) | Bản hiện hành |
| `kafka_exporter` | [README](https://github.com/danielqsj/kafka_exporter/blob/master/README.md) | `master` |
| Spring Kafka | [`KafkaHeaders.java`](https://github.com/spring-projects/spring-kafka/blob/main/spring-kafka/src/main/java/org/springframework/kafka/support/KafkaHeaders.java) | `main` |

## Chạy lại kiểm chứng

Cần JDK 17 trở lên và Bash:

```bash
docs/content-review/kafka/verify/run.sh
```
