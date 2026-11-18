# Lịch sử rà soát Kafka

| Ngày | Mốc | Kết quả | Kiểm tra | Commit |
| --- | --- | --- | --- | --- |
| 2026-11-18 | Rà soát và sửa | 81 điểm: 36 sai, 38 chưa chính xác hoặc lỗi thời, 7 lỗi nhỏ; rút lại 4 điểm | Tài liệu và mã nguồn Kafka 4.4.0, JDK 17 cho phép thử không cần broker; build đạt 749 câu, không đổi `q` | `d70938b` |

## Phạm vi

- 101 câu trong `src/data/kafka-01` đến `kafka-05`.
- Sơ đồ `assets/diagrams/kafka.js`.
- 65 câu đổi nội dung, cùng một dòng trong sơ đồ.

## Diễn biến

### 2026-11-18: rà soát ban đầu

- Đã làm: đọc toàn bộ `answer`, `essence`, `example`, `viz`, `demo` và sơ đồ. Đối chiếu với tài liệu Kafka 4.4, KIP và mã nguồn tag `4.4.0`. Viết phép thử JDK cho `Math.abs`, shutdown hook và phép tính sizing.
- Phát hiện chính:
  - Auto-commit bị mô tả là luôn có thể mất message, trong khi classic consumer commit trong `poll()`.
  - `send()` không ném timeout của `max.block.ms`, nên demo circuit breaker không hoạt động như mô tả.
  - Topic compacted từ chối key null ngay lúc ghi.
  - Demo consume-transform-produce bỏ qua lô sau khi abort vì không `seek`.
  - Nhiều lệnh và cấu hình đã đổi ở Kafka 4.x, như `linger.ms`, công cụ CLI, quy trình nâng cấp KRaft và Strimzi.
- Quyết định: chỉ kết luận về auto-commit cho classic consumer. Giữ nguyên các điểm chưa đủ bằng chứng và ghi vào mục rút lại hoặc giới hạn.
- Kiểm tra sau sửa: `node src/build.mjs` đạt 749 câu. Đối chiếu với `HEAD` cho thấy không đổi `q` hoặc `id`; `viz` `compare` đúng số cột và `flow` có `to` hợp lệ.
- Chưa kiểm chứng: chưa chạy broker Kafka vì lệnh khởi tạo broker bị chế độ phân quyền từ chối. Các demo chưa được biên dịch trong dự án thật.

## Kinh nghiệm cho chủ đề khác

- Với công nghệ đổi nhanh, cần xác định bản phát hành hiện tại trước khi đọc nội dung.
- Lệnh CLI nên được đối chiếu với mã nguồn đúng tag, vì tài liệu cũ và blog thường giữ tên class đã bị gỡ.
- Demo bất đồng bộ cần được đọc theo luồng lỗi thật, không chỉ theo luồng thành công.
