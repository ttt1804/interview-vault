# Lịch sử rà soát SQL

| Ngày | Mốc | Kết quả | Kiểm tra | Commit |
| --- | --- | --- | --- | --- |
| 2026-11-19 | Rà soát và sửa | 74 điểm: 35 sai, 35 chưa chính xác hoặc lỗi thời, 4 lỗi nhỏ; rút lại 5 điểm | PostgreSQL 18.7, MySQL 9.7.4, SQLite 3.50.6, tài liệu và mã nguồn; build đạt 749 câu, không đổi `q` | `e1109b8` |

## Phạm vi

- 100 câu trong `src/data/sql-01` đến `sql-05`.
- Sơ đồ `assets/diagrams/sql.js`.
- 49 câu đổi nội dung, cùng hai sơ đồ động được chỉnh chữ hoặc đường tô.

## Diễn biến

### 2026-11-19: rà soát ban đầu

- Đã làm: đọc toàn bộ `answer`, `essence`, `example`, `viz`, `demo`, `code` và sơ đồ. Chạy các phép thử trên container PostgreSQL và MySQL riêng trong Docker của Ubuntu WSL. Đối chiếu tài liệu PostgreSQL 18, SQL Server, PgBouncer, AWS và mã nguồn Spring, Hibernate.
- Phát hiện chính:
  - `MERGE` bị mô tả như upsert nguyên tử, trong khi hai phiên chèn đồng thời có thể gây lỗi unique.
  - Nhiều demo Postgres không chạy được: generated column trên `timestamptz`, advisory lock với `bigint`, `pg_wal_replay_wait`, `SELECT` trong `CREATE TABLE`.
  - RLS không có tác dụng với chủ bảng nếu thiếu `FORCE`.
  - Một câu `UPDATE ... IN` không bảo đảm thứ tự khoá.
  - Demo retry dùng exception mà Spring 6 không còn sinh theo đường dịch mặc định.
  - Mốc wraparound, HOT update, TOAST và `DISTINCT ON` bị mô tả sai cơ chế.
- Quyết định: nội dung nhắm tới PostgreSQL 18 và MySQL bản LTS hiện tại của image Docker. Với hành vi khác nhau giữa hệ, ghi rõ tên hệ thay vì nói chung cho mọi DB. Bỏ hệ số tốc độ không có nguồn.
- Kiểm tra sau sửa: `node src/build.mjs` đạt 749 câu; đối chiếu với `HEAD` cho thấy không đổi `q` hoặc `id`; `check-data.mjs` đạt 97 `viz` và 10 bài tập; trang `/sql/` hiển thị 100 câu, 97 vùng hình và không có lỗi console.
- Chưa kiểm chứng: tài liệu MySQL không tải được; chưa chạy SQL Server, Oracle, replication, PgBouncer, Spring và Hibernate.

## Kinh nghiệm cho chủ đề khác

- Demo SQL nên chạy trên kiểu dữ liệu thật của nội dung. Nhiều lỗi chỉ lộ ra với `timestamptz`, locale `en_US` hoặc `bigint`.
- Khẳng định về đồng thời cần phép thử hai phiên, không suy ra từ một câu lệnh.
- Dùng container riêng tên rõ ràng để không đụng database đang chạy của người dùng.
