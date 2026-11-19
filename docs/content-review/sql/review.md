# Rà soát kiến thức phần SQL

- Ngày rà soát: 2026-11-19
- Phạm vi: 5 file `src/data/sql-*.js` (100 câu) và `assets/diagrams/sql.js`
- Phiên bản đối chiếu: PostgreSQL 18.7, MySQL 9.7.4 (tag `lts` của image Docker), SQLite 3.50.6. SQL Server chỉ đối chiếu tài liệu
- Trạng thái: toàn bộ 74 điểm đã sửa trong commit `e1109b8`
- Lịch sử: [history.md](history.md)
- Nguồn: [sources.md](sources.md)
- Phép thử: [verify/](verify/)

Số dòng là vị trí trước khi sửa. Tên file viết tắt: `01` là `sql-01-fundamentals.js`, tương tự cho `02` đến `05`.

## 1. Sai, đã sửa

- `01:638-654,686-688` `MERGE` không phải upsert an toàn khi chạy đồng thời. Postgres báo lỗi unique khi hai phiên cùng chèn một khoá; `ON CONFLICT` xử lý được. **[Chạy] [Docs]**
- `01:669` Demo upsert chỉ so `price` nên bỏ qua trường hợp chỉ đổi `name`. **[Chạy]**
- `01:739-741` `NO ACTION` không mặc nhiên kiểm tra cuối transaction. Không deferrable thì lỗi ngay ở cuối câu lệnh. **[Chạy] [Docs]**
- `01:1018,1028,1044-1046,1054-1060` Postgres báo lỗi khi so cột chuỗi với số, không chuyển sang Seq Scan. MySQL mới so theo số và không dùng được index của cột chuỗi. **[Chạy]**
- `01:1194,1208` Trong Postgres, `date - date` ra số nguyên, không ra `interval`. **[Chạy]**
- `01:1263,1272` SQL Server không có quy tắc phụ thuộc hàm vào PK như mô tả. Bỏ khẳng định chung cho SQL Server và Oracle. **[Docs]**
- `01:1303` `SET sql_mode = 'ONLY_FULL_GROUP_BY'` xoá các mode khác, gồm `STRICT_TRANS_TABLES`. **[Chạy]**
- `02:154-160` Demo nói `status` nằm sau `created_at`, trong khi index là `(customer_id, status, created_at)`. Cả ba điều kiện đều vào Index Cond. **[Chạy]**
- `02:395,401,408` Merge join của Postgres không xử lý bất đẳng thức. MySQL có thể dùng hash join rồi lọc bất đẳng thức. **[Chạy]**
- `02:473-476,1194,1201-1202` Generated column và expression index trên `timestamptz` dùng biểu thức không immutable nên bị từ chối. Đổi sang chốt `AT TIME ZONE 'UTC'`. **[Chạy] [Docs]**
- `02:1167` MySQL không tạo được functional index trực tiếp trên giá trị JSON của `JSON_EXTRACT`. **[Chạy]**
- `02:443` `CREATE INDEX ON t (YEAR(created_at))` sai cú pháp MySQL, cần thêm một cặp ngoặc và tên index. **[Chạy]**
- `02:729,737,741,752-757` Điều kiện `OR` trên hai index không mặc nhiên là seq scan: Postgres ra `BitmapOr`, MySQL ra index merge. Tiêu đề `UNION ALL` cũng không khớp code `UNION`. **[Chạy]**
- `02:797,805` Update cột có index không thể là HOT. Phép thử có 0 HOT trên 100 update `last_seen`. **[Chạy]**
- `02:647` Thống kê không reset khi restart sạch; crash hoặc reset thủ công mới xoá. **[Chạy] [Docs]**
- `02:650-652` Truy vấn chỉ bắt index trùng hệt, không bắt `(a)` với `(a, b)`. **[Chạy]**
- `02:1045,1058` `(tenant_id, status, created_at)` không có `status` ở cột đầu. **[Đọc nội dung]**
- `03:190` "Chỉ Serializable chặn được write skew" mâu thuẫn với cách khoá đúng hàng ở phần trả lời. **[Đọc nội dung]**
- `03:315` Ví dụ trừ tồn kho đảo kết quả: không khoá thì `qty` ra -1, có khoá thì request sau bị từ chối. **[Đọc nội dung]**
- `03:406-407` Một câu `UPDATE ... IN` không bảo đảm thứ tự khoá. Phép thử với hai plan khác nhau gây deadlock. **[Chạy]**
- `03:780` `pg_advisory_xact_lock(int, bigint)` không tồn tại. **[Chạy]**
- `03:958-960,978` Từ Spring 6 hai exception trong demo đã deprecated và translator mặc định không còn sinh chúng cho 40001/40P01. Thứ tự retry do thứ tự advice quyết định, không do vị trí annotation. **[Source]**
- `03:1240-1241` Mốc wraparound sai. Failsafe mặc định ở tuổi 1,6 tỉ, cảnh báo khi còn 40 triệu XID, dừng cấp XID khi còn 3 triệu. **[Chạy] [Docs]**
- `04:241` Câu `SELECT` nằm trong `CREATE TABLE` làm demo lỗi cú pháp. **[Chạy]**
- `04:403,415` MySQL thêm giá trị ENUM vào cuối có thể chạy `INSTANT`; đổi thứ tự mới cần rebuild. **[Chạy]**
- `04:443` Postgres đổi tên giá trị enum được bằng `RENAME VALUE`. **[Chạy]**
- `04:876,879-880` Điều kiện chỉ có cận dưới quét cả hai partition. `DROP` rồi `DETACH` cùng partition cũng không chạy được. **[Chạy]**
- `04:935-938` Chủ bảng bỏ qua RLS nếu thiếu `FORCE ROW LEVEL SECURITY`. Đổi `SET` sang `SET LOCAL` để an toàn với pool. **[Chạy] [Docs]**
- `04:1011` Demo tạo unique index trên cột `order_number` chưa khai báo. **[Chạy]**
- `04:1311,1317,1325` Update cột khác không ghi lại giá trị TOAST không đổi. Kích thước TOAST giữ nguyên trong phép thử. **[Chạy]**
- `05:627,633` `DISTINCT ON` có index vẫn đọc mọi hàng của nhóm: 200.000 hàng để ra 2.000 nhóm. **[Chạy]**
- `05:662` Tên tham số đúng là `enable_partition_pruning`. **[Chạy]**
- `05:789,830` Postgres 18.7 không có `pg_wal_replay_wait`. Đổi sang poll `pg_last_wal_replay_lsn()`. **[Chạy]**
- `05:833` `synchronous_commit = on` không bảo đảm query trên standby thấy dữ liệu mới; cần `remote_apply`. **[Docs]**
- `05:958-963` `SET UNLOGGED` rồi `SET LOGGED` không giảm WAL ở `wal_level = replica`: cùng khoảng 31 MB trong phép thử. **[Chạy]**

## 2. Chưa chính xác hoặc đã lỗi thời, đã sửa

- `01:78,88` `NULL = x` cho `UNKNOWN`, không phải `FALSE`. **[Đọc nội dung]**
- `01:218` Không thể chuyển điều kiện `order_date` sang `HAVING` khi cột đó không được group. **[Đọc nội dung]**
- `01:266-270` Postgres đẩy `HAVING customer_id > 100` xuống scan nên không "gom cả nhóm sẽ bỏ". **[Chạy]**
- `01:372,379,397` Không phải mọi phép toán với NULL đều ra NULL, ví dụ `TRUE OR NULL`. **[Đọc nội dung]**
- `01:416,860` Số NULL trong UNIQUE tuỳ DB; SQL Server chỉ cho một NULL. **[Chạy] [Docs]**
- `01:537` MySQL hiện chạy được `EXCEPT` và `INTERSECT`. **[Chạy]**
- `01:562,565,574` Ghi rõ `FILTER` chạy trên Postgres và SQLite, MySQL báo lỗi cú pháp. **[Chạy]**
- `01:677` `VALUES(col)` trong `ON DUPLICATE KEY UPDATE` đã deprecated. **[Chạy]**
- `01:1051-1052` `code = 0` khớp các chuỗi không bắt đầu bằng số, không phải luôn gần toàn bảng. **[Chạy]**
- `01:1301` Giá trị ngoài group là không xác định, không phải ngẫu nhiên. **[Đọc nội dung]**
- `02:12,34,669,683,695,701-707` `LIKE 'abc%'` trên database `en_US` không dùng index mặc định; cần `text_pattern_ops` hoặc collation `C`. **[Chạy] [Docs]**
- `02:121,124,130,132,150-152` Thiếu cột đầu vẫn có thể dùng skip scan trên Postgres 18 và MySQL. **[Chạy] [Docs]**
- `02:281-283` Partial index cho giá trị chiếm 60% bảng không minh hoạ đúng lợi ích. **[Đọc nội dung]**
- `02:658-660` Bỏ hướng dẫn sửa tay catalog `pg_index`; thêm cách lưu định nghĩa và `INVISIBLE` của MySQL. **[Đọc code] [Chạy]**
- `02:792` Fillfactor mặc định là 90 cho B-tree và 100 cho bảng. **[Docs]**
- `02:834` `REINDEX` không áp fillfactor của bảng cho dữ liệu đã có. **[Docs]**
- `02:1206-1207` Postgres 18 có virtual generated column nhưng chưa index được. **[Chạy] [Docs]**
- `03:723-725` `READ ONLY DEFERRABLE` có thể chờ lúc lấy snapshot. **[Docs]**
- `03:866,887-895` Chuyển tiền ngược chiều vẫn có thể deadlock với cách `UPDATE` có điều kiện. **[Chạy]**
- `03:1180-1185` Đoạn gắn nhãn CTE thực ra là subquery; đổi sang CTE và tăng `attempts`. **[Chạy]**
- `03:1204,1225` Chỉnh mô tả freeze và việc VACUUM thường không trả đĩa về OS. **[Docs]**
- `04:375` Dùng `@SQLRestriction` của Hibernate 6.3+ thay `@Where`. **[Source]**
- `04:931` Không phải mọi index đều buộc bắt đầu bằng `tenant_id`. **[Đọc nội dung]**
- `04:975,1005-1008` `(customer_id)` thừa khi đã có `(customer_id, created_at DESC)`. **[Đọc nội dung]**
- `04:1084,1092` Đổi kiểu cột không phải lúc nào cũng viết lại bảng; `statement_timeout` ngắn có thể cắt thao tác migration dài. **[Đọc nội dung]**
- `04:1231` Tên quá dài bị cắt kèm NOTICE, giới hạn tính theo byte. **[Chạy]**
- `05:93,104,106` Viết đầy đủ `RANGE BETWEEN` và `ROWS BETWEEN`. **[Đọc code]**
- `05:564-565` `DISTINCT ON` hoặc `ROW_NUMBER` không mặc nhiên nhanh hơn LATERAL; tuỳ số nhóm. **[Chạy]**
- `05:588` LATERAL không chỉ có ở Postgres. **[Chạy]**
- `05:690-691` Thêm cận trên để ví dụ pruning đúng khi có nhiều partition. **[Chạy]**
- `05:892` PgBouncer transaction mode không hỗ trợ `LISTEN`, còn `NOTIFY` dùng được. **[Docs]**
- `05:915-917,928-932,947,954` Bỏ hệ số tốc độ không có nguồn; biểu đồ dùng phép đo thật và ghi rõ điều kiện đo. **[Chạy]**
- `05:1153` DynamoDB công bố độ trễ cỡ vài mili giây, không phải dưới mili giây. **[Docs]**
- `05:1245,1257,1259` `PREPARE` của Postgres phân tích trước, plan được lập khi `EXECUTE`. **[Docs]**
- `assets/diagrams/sql.js:115,154` Sơ đồ snapshot cố định đúng với Repeatable Read; snapshot được lấy ở câu lệnh đầu. **[Đọc nội dung]**

## 3. Lỗi nhỏ, đã sửa

- `04:208` Sửa `MySYQL`. **[Đọc nội dung]**
- `04:1227-1228` Quy tắc đặt tên có ví dụ tự đổi thành chính nó. **[Đọc nội dung]**
- `05:146-148` Chú thích nói trung bình nhưng code dùng `SUM`. **[Đọc code]**
- `assets/diagrams/sql.js:104` Bước đi tới nút `[20 | 40]` tô nhầm cạnh xuống lá đầu. **[Đọc code]**

## 4. Giới hạn

- Tài liệu MySQL trả về trang lỗi cho công cụ tải nên chưa đối chiếu được. Hành vi MySQL dựa trên phép chạy 9.7.4. Các mốc phiên bản MySQL có sẵn trong nội dung, như LATERAL từ 8.0.14, chưa được xác nhận lại.
- Chưa chạy SQL Server, Oracle, replication, PgBouncer, Spring và Hibernate. Các điểm đó dựa trên tài liệu hoặc mã nguồn đã ghi.
- Biểu đồ tốc độ nạp dựa trên 5.000 hàng qua socket cục bộ, có cả chi phí khởi động `psql`. Không dùng làm hệ số chung.
- Các con số trong ví dụ tình huống, như thời gian truy vấn hay mức tăng throughput, là minh hoạ và không được đo.
- Nhiều demo là đoạn minh hoạ dùng chung schema giả định, nên không chạy tuần tự được từ đầu đến cuối.

## 5. Điểm đã rút lại

- `03:825-828` Gap lock trong demo đúng: có record lock ở 20, gap lock tới 30, chèn 15, 18, 25 đều bị chặn và 35 chèn được.
- `04:595-597` `COALESCE(NEW, OLD)` chạy đúng với cả INSERT, UPDATE và DELETE.
- `04:1359-1360` Thứ tự cột làm đổi kích thước hàng: 40 byte so với 44 byte.
- `05:146-148` Khung `RANGE` với `INTERVAL` trên cột `date` chạy được; chỉ tên hàm trong demo cần sửa.
- `01:1020` `id = '5abc'` khớp `id = 5` trên MySQL, kèm cảnh báo.
