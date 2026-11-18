# Lịch sử rà soát Java

| Ngày | Mốc | Kết quả | Kiểm tra | Commit |
| --- | --- | --- | --- | --- |
| 2026-11-18 | Rà soát ban đầu | 91 điểm: 22 sai, 42 chưa chính xác hoặc lỗi thời, 27 lỗi nhỏ | JDK 17, tài liệu và mã nguồn cho một phần | |
| 2026-11-18 | Đối chiếu nốt 47 điểm | 90 điểm: 24 sai, 39 chưa chính xác hoặc lỗi thời, 27 lỗi nhỏ; rút lại 1 điểm | Đặc tả, tài liệu, mã nguồn, JDK 17 | |
| 2026-11-18 | Sửa nhóm lỗi chính | 24 điểm | Build đạt 749 câu, không đổi `q`, chạy lại ví dụ Java | `14b60ba` |
| 2026-11-18 | Sửa phần còn lại | 66 điểm | Build đạt 749 câu, không đổi `q`, kiểm tra `viz` `compare` và `flow` | `14b60ba` |

## Phạm vi

- 147 câu trong `src/data/java-01` đến `java-08`.
- Sơ đồ `assets/diagrams/java.js`.
- Commit `14b60ba` đổi 9 file, thêm 268 dòng và xoá 242 dòng.

## Diễn biến

### 1. Rà soát ban đầu

Đã đọc toàn bộ nội dung, gồm câu trả lời, ví dụ, `viz` và `demo`. Các khẳng định về Java core được chạy thử trên JDK 17.0.12. Một phần khẳng định về Spring, Boot và Hibernate được đối chiếu tài liệu hoặc mã nguồn.

Phát hiện chính:

- Demo `h ^ (h >>> 16)` dùng bit không ảnh hưởng tới bucket.
- Ví dụ xoá `"b"` trong for-each không ném `ConcurrentModificationException`.
- Treeify không đảm bảo O(log n) khi key trùng hash và không `Comparable`.
- Nhiều nội dung Spring và Boot đã lỗi thời, như validation starter và validate tham số controller.

### 2. Đối chiếu nốt

Sau đợt đầu còn 47 điểm chưa được xác nhận đầy đủ. Đợt này tải đặc tả, tài liệu và mã nguồn về để tìm nguyên văn, đồng thời chạy thêm các phép thử.

Thay đổi quan trọng:

- Rút lại nhận xét về công thức thread pool ở `java-05:865`, vì công thức này suy ra được từ định luật Little.
- Xác nhận `HashMap` vẫn có thể treo khi dùng đa luồng trên JDK 17. Phép thử bị kẹt ở `TreeNode.split` và có `ClassCastException`.
- Xác nhận native query có flush khi dùng `EntityManager`.
- Xác nhận cảnh báo của Spring Boot về container `static` và context cache.

### 3. Sửa nhóm lỗi chính

Sửa 24 điểm trong 8 file Java. Cập nhật cả các chỗ lặp cùng ý trong `essence`, `example`, `viz` và `demo`. Không đổi `q` để giữ id, permalink và tiến độ đã lưu.

### 4. Sửa phần còn lại

Sửa 39 điểm chưa chính xác hoặc lỗi thời và 27 lỗi nhỏ. Ghi mốc phiên bản ở các chỗ phụ thuộc phiên bản, như `jarmode=tools` từ Boot 3.3 và pattern switch ở Java 21. Sửa thêm hai câu về resize của `ConcurrentHashMap` để tránh hiểu rằng nó luôn tệ hơn.

## Chưa kiểm chứng

- Các demo Spring, JPA, Security và Dockerfile chưa được biên dịch hoặc chạy trong ứng dụng thật.
- Trường hợp thiếu `spring-boot-maven-plugin` mới được kiểm chứng ở mức JVM với jar không có `Main-Class`.
- Tài liệu Spring và Boot lấy từ bản mới nhất tại ngày truy cập; một số mã nguồn Boot lấy ở v3.5.0.

## Kinh nghiệm cho chủ đề khác

- Phải đọc comment trong `demo` và ô trong `viz`, vì nhiều lỗi nằm ở đó.
- Ví dụ có kết quả cụ thể nên được chạy, kể cả khi trông hiển nhiên.
- Khi sửa một khái niệm, cần tìm các chỗ nhắc lại khái niệm đó trong cùng câu và câu liên quan.
- Tài liệu dài nên được tải về và tìm nguyên văn.
- Nhận xét chưa có nguồn phải được kiểm tra lại, vì có thể chính nhận xét đó sai.
