# Rà soát kiến thức phần Kafka

- Ngày rà soát: 2026-11-18
- Phạm vi: 5 file `src/data/kafka-*.js` (101 câu) và `assets/diagrams/kafka.js`
- Phiên bản đối chiếu: Apache Kafka 4.4.0. Hành vi phụ thuộc phiên bản được ghi mốc trong nội dung
- Trạng thái: toàn bộ 81 điểm đã sửa trong commit `d70938b`
- Lịch sử: [history.md](history.md)
- Nguồn: [sources.md](sources.md)

Số dòng là vị trí trước khi sửa. Tên file viết tắt: `01` là `kafka-01-fundamentals.js`, tương tự cho `02` đến `05`.

## 1. Sai, đã sửa

- `01:207`, `02:68` `acks=all` không ack khi đủ `min.insync.replicas`. Leader chờ mọi replica đang ở ISR; `min.insync.replicas` chỉ là điều kiện về kích thước ISR. **[Docs]**
- `01:286,298`, `02:1009,1014,1022` Message key null không "bị bỏ khi compaction": broker từ chối ghi vào topic compacted bằng lỗi invalid record. **[Source]**
- `01:325`, `05:263` `cleanup.policy=compact,delete` trong `--add-config` phải đặt trong ngoặc vuông. **[Source]**
- `01:379,410-412`, `03:216,227-229,237-241` Auto-commit của classic consumer chạy trong `poll()`. Vòng lặp đồng bộ xử lý hết lô rồi mới poll vẫn at-least-once; rủi ro mất message nằm ở xử lý bất đồng bộ. **[Source]**
- `01:605-607`, `02:387` Broker không sắp xếp lại batch theo sequence. Nó từ chối batch sai thứ tự để client gửi lại. **[Source]**
- `01:612`, `02:288-289`, `03:704`, `04:631` `Math.abs(hashCode) % n` có thể ra số âm. Với key `polygenelubricants`, `% 7` ra `-2`; đổi sang `Math.floorMod`. **[Chạy]**
- `01:626,636,647` High watermark là LEO nhỏ nhất trong ISR, tức offset ngay sau phần đã replicate đủ, không phải offset cuối đã replicate. **[Source]**
- `01:659-660` `acks=all` không phải lý do consumer phải chờ HW. HW được tính từ ISR, độc lập với `acks` của producer. **[Source]**
- `01:745-751` Cấu hình tiered storage dùng chính interface `RemoteStorageManager` làm class, kèm option của plugin riêng và thiếu `remote.storage.enable`. **[Docs]**
- `01:818,823` Số partition phải đáp ứng cả hai nhu cầu nên là `max`, không phải `min`. **[Đọc nội dung]**
- `02:307,312,322,336` Hết `max.block.ms`, `send()` trả lỗi qua `Future` và callback, không ném ra ngoài. **[Source]**
- `02:456,469,501` `SerializationException` bị ném thẳng từ `send()`, không vào callback. **[Source]**
- `02:583` Ví dụ BACKWARD mô tả nhầm thành consumer cũ đọc dữ liệu mới. **[Docs]**
- `02:686,699,706,709`, `03:759-762` Fetch limit không phải trần tuyệt đối. Batch đầu tiên vượt giới hạn vẫn được trả về nên consumer không treo vì lý do này. **[Docs]**
- `02:792,798,802,805` Không thể ghi outbox "cùng transaction với đơn hàng" sau khi gửi Kafka đã thất bại. Tách fallback store khỏi transactional outbox. **[Đọc nội dung]**
- `02:818` Với `linger.ms=5` mặc định từ 4.0, đặt `delivery.timeout.ms=30000` cùng `request.timeout.ms` mặc định gây `ConfigException`. **[Source]**
- `02:822-825` Circuit breaker không thấy lỗi của `send()` bất đồng bộ. Demo phải chờ `Future`. **[Source]**
- `03:8,19` Heartbeat chạy ở thread nền, không do `poll()` gửi. **[Source]**
- `03:119` `CooperativeStickyAssignor` không phải assignor được dùng mặc định. Danh sách mặc định có Range đứng đầu nên group dùng Range. **[Docs]**
- `03:548,560,593` `onPartitionsLost` không chỉ dành cho cooperative. **[Source]**
- `03:640` Demo gọi thêm `poll()` rồi bỏ kết quả làm mất record của partition chưa pause. **[Đọc code]**
- `03:646` `poll(Duration.ZERO)` không bảo đảm đã có assignment. **[Source]**
- `03:106`, `04:1165` Shutdown hook chỉ gọi `wakeup()` thì JVM có thể thoát trước khi `close()` chạy. Phép thử chỉ in kết quả dọn dẹp khi hook chờ luồng chính. **[Chạy]**
- `04:227,239,272,843` Sau `abortTransaction()`, vị trí đọc trong bộ nhớ đã đi tiếp. Tiến trình còn chạy phải `seek` về đầu lô, nếu không lô bị bỏ qua. **[Đọc code]**
- `04:1070-1071` Polling publisher đánh dấu đã gửi khi `send()` chưa được ack nên có thể mất sự kiện. **[Source]**
- `04:528,533,543,545,571-573` EOS v2 dùng một producer cho mỗi stream thread, không phải mỗi instance. Tên `exactly_once_v2` có từ 3.0. **[Docs]**
- `04:682` `--max-transaction-timeout` tính bằng phút. **[Source]**
- `05:145` Output của `--generate` có hai khối và dòng tiêu đề, không dùng trực tiếp làm `plan.json`. **[Source]**
- `05:279,313` Tên đúng là `offsets.retention.minutes`. **[Docs]**
- `05:307` Formatter cũ không còn; dùng `org.apache.kafka.tools.consumer.OffsetsMessageFormatter`. **[Source]**
- `05:595` Có authorizer mà resource chưa có ACL thì mặc định chỉ super user truy cập được. **[Docs]**
- `05:724` 389 TB cộng 35% headroom cần khoảng 18 broker 30 TB, không phải 15. 500 MB/s chia 10 MB/s là 50 partition. **[Chạy]**
- `05:747` Công thức dùng sai đơn vị; kết quả là khoảng 112 TiB. **[Chạy]**
- `05:922-924` Preferred election không đưa leader ra khỏi broker sắp restart. Controlled shutdown mới làm việc đó. **[Docs]**
- `05:1195` CPU request khác limit thì pod không đạt QoS Guaranteed. **[Docs]**
- `05:1170-1198` Manifest Strimzi cũ đặt replica và storage trong `Kafka`. Bản hiện hành dùng `kafka.strimzi.io/v1` và `KafkaNodePool`. **[Docs]**

## 2. Chưa chính xác hoặc đã lỗi thời, đã sửa

- `01:93-96,566,652-653`, `05:1130-1131` Đổi lệnh cũ sang `kafka-get-offsets.sh` và `kafka-dump-log.sh`. **[Source]**
- `01:655` `--topic-white-list` không còn; dùng `--topics-include`. Công cụ đã deprecated. **[Source]**
- `01:156,180,187` KRaft production-ready từ 3.3, không phải mặc định từ 3.3. Controller có thể không phải broker. **[Docs]**
- `01:203`, `05:8,19`, `assets/diagrams/kafka.js:109` Bổ sung ELR và bỏ cách nói "ISR rỗng". **[Docs]**
- `01:243,866,879`, `02:455,468`, `05:899` `NotLeaderForPartitionException` đã bị gỡ ở 4.0; dùng `NotLeaderOrFollower`. **[Docs]**
- `01:267,275` Demo `seek` cần partition đã được gán và `offsetsForTimes` có thể trả `null`. **[Source]**
- `01:339` Bổ sung share group, production-ready từ 4.2. **[Docs]**
- `01:428,438,461-462`, `02:254,264,275-276,1008,1021,1034-1035` Từ 3.3, sticky partitioning đổi partition theo khoảng `batch.size` byte. **[Docs]**
- `01:501-502` Bỏ so sánh HDD tuần tự với SSD ngẫu nhiên không có nguồn, thay bằng số trong tài liệu Kafka. **[Docs]**
- `01:529,541` Compaction viết lại segment, không phải xoá nguyên file. **[Docs]**
- `01:698-699` Kinesis hiện cho record tới 10 MiB và có chế độ on-demand. **[Docs]**
- `01:720` Tiered storage production-ready từ 3.9. **[Docs]**
- `02:42,91` Bỏ cách nói tuyệt đối về `min.insync.replicas`. **[Docs]**
- `02:104,117,134-135`, `04:114-115,128-129,147-148` Khử trùng dựa trên 5 batch gần nhất; sequence khác kỳ vọng bị từ chối. **[Source]**
- `02:143`, `04:157-158` `transactional.id` dùng để fence và kết thúc transaction dang dở, không khử record do ứng dụng gửi lại. **[Docs]**
- `02:153,162,179` `linger.ms` mặc định là 5 từ 4.0. **[Docs]**
- `02:203,206,216,229,233` Bỏ khẳng định gzip luôn nén tốt nhất. **[Docs]**
- `03:9,21,46` Khi vượt `max.poll.interval.ms`, chính client rời group. **[Source]**
- `03:68` `group.initial.rebalance.delay.ms` chỉ áp dụng cho group mới; rolling restart có thể gây tới hai lần rebalance mỗi pod. **[Docs]**
- `03:118,126,139` `StickyAssignor` cũng dùng giao thức eager. **[Source]**
- `03:156-157` KIP-848 GA từ 4.0, client vẫn mặc định `classic`. **[Docs]**
- `03:166,188` Range vẫn đứng đầu danh sách mặc định. **[Docs]**
- `03:205` Assignor tự viết nên cài đặt interface công khai `ConsumerPartitionAssignor`. **[Source]**
- `03:387` Với `group.protocol=consumer`, client không đặt `session.timeout.ms` và `heartbeat.interval.ms`. **[Source]**
- `03:528` Bảng dedup và xử lý phải cùng transaction. **[Đọc code]**
- `04:647,651` Tách transaction chờ timeout với transaction treo do lệch trạng thái; `kafka-transactions.sh` dùng subcommand. **[Docs]**
- `04:699,732` Coordinator có trạng thái prepare, nên nói rõ khác biệt là không phải XA giữa nhiều hệ thống. **[Source]**
- `04:804,809,834` Deserializer lỗi làm `poll()` ném `RecordDeserializationException`, trước khi vào vòng lặp. **[Source]**
- `04:850` Dùng `DESERIALIZATION_EXCEPTION_HANDLER_CLASS_CONFIG`. **[Source]**
- `05:481` Cửa sổ cập nhật mỗi 5 phút cần `advanceBy`. **[Đọc nội dung]**
- `05:694` README của `kafka_exporter` không có metric lag theo thời gian. **[Docs]**
- `05:720,735` Replication thêm RF-1 lần lưu lượng ghi, không phải luôn nhân đôi. **[Đọc nội dung]**
- `05:757` Lưu lượng ra là RF-1 cộng số consumer group. **[Đọc nội dung]**
- `05:767,770,1121,1123,1136` Cập nhật option CLI của Kafka 4.x. **[Source]**
- `05:839,868,871` Broker đã dừng thì giảm retention không dọn được đĩa của nó. Broker thay thế cùng `node.id` không cần reassign sang chính nó. **[Source]**
- `05:894,907,936-941` KRaft chốt nâng cấp bằng `kafka-features.sh`. **[Docs]**
- `05:1009,1021,1059` `leader.imbalance.per.broker.percentage` không còn trong cấu hình 4.4. **[Docs]**
- `05:1148,1220` Strimzi hiện dùng StrimziPodSet và chỉ hỗ trợ KRaft. **[Docs]**

## 3. Lỗi nhỏ, đã sửa

- `01:401`, `03:243` Bỏ cách nói phải "luôn tắt" auto-commit. **[Đọc nội dung]**
- `01:482` Con số hàng trăm MB/s mâu thuẫn nếu tính trên mỗi partition. **[Đọc nội dung]**
- `01:694` Thêm `--bootstrap-server` cho lệnh tạo topic. **[Source]**
- `02:611` Avro không bắt buộc sinh code. **[Đọc nội dung]**
- `02:869` Partition không "biến mất" khi cụm thay đổi. **[Đọc nội dung]**
- `03:471` Sửa câu nói ngược ý về `session.timeout.ms`. **[Đọc nội dung]**
- `04:367` `repo.save` chưa phải lúc DB commit. **[Đọc code]**

## 4. Giới hạn

- Chưa chạy broker Kafka. Bản 4.4.0 đã tải và khớp checksum, nhưng lệnh khởi tạo broker bị chế độ phân quyền từ chối. Vì vậy các điểm về broker và client mang nhãn `[Source]` hoặc `[Docs]`, không phải `[Chạy]`.
- Các demo Java, Spring, Strimzi, Debezium và Connect chưa được biên dịch hoặc triển khai thật.
- Auto-commit của consumer dùng `group.protocol=consumer` chưa được phân tích đầy đủ, nên nội dung chỉ kết luận cho classic consumer.
- Chưa có nguồn chính thức cho các số kinh nghiệm: `04:507` (giảm 3-20% throughput), `01:849` (2-4 partition mỗi core), `01:813` (10-50 MB/s mỗi partition).
- README của `kafka-lag-exporter` không tải được khi kiểm tra, nên chưa xác nhận riêng khả năng tính lag theo thời gian của công cụ này.

## 5. Điểm đã rút lại

- `03:818` `KafkaHeaders.EXCEPTION_MESSAGE` vẫn tồn tại. Chưa đủ bằng chứng để nói header này sai trong `@DltHandler`, nên giữ nguyên.
- `05:1088` `--to-datetime` không có phần mili giây: tài liệu ghi định dạng có `.sss`, nhưng chưa chạy nên không kết luận là lỗi.
- `01:517` Không tìm được ghi chú chính thức đủ rõ về down-conversion trong tài liệu đã tải, nên giữ nguyên.
- `02:127-129` Đặt tường minh `enable.idempotence=true` cùng cấu hình xung đột đúng là gây `ConfigException`.
