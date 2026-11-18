# Mẫu hồ sơ rà soát

Sao chép các phần dưới đây vào `docs/content-review/<chủ-đề>/`.

## `review.md`

```markdown
# Rà soát kiến thức phần <chủ đề>

- Ngày rà soát: YYYY-MM-DD
- Phạm vi: <file dữ liệu, sơ đồ, số câu>
- Phiên bản đối chiếu: <phiên bản công nghệ>
- Trạng thái: <đang rà soát / đã sửa ở commit ...>

## 1. Sai, cần sửa trước

- `file.js:12` Nội dung sai, nội dung đúng và cách sửa. **[Docs]**

## 2. Chưa chính xác hoặc đã lỗi thời

- `file.js:34` Nội dung cần chỉnh. **[Source]**

## 3. Lỗi nhỏ

- `file.js:56` Lỗi chữ hoặc số liệu nhỏ. **[Đọc nội dung]**

## 4. Giới hạn

- Phần chưa chạy được, chưa có nguồn hoặc phụ thuộc phiên bản.

## 5. Điểm đã rút lại

- `file.js:78` Lý do không còn coi đây là lỗi.
```

## `history.md`

```markdown
# Lịch sử rà soát <chủ đề>

| Ngày | Mốc | Kết quả | Kiểm tra | Commit |
| --- | --- | --- | --- | --- |
| YYYY-MM-DD | Rà soát ban đầu | N điểm | Nguồn đã dùng | |

## Diễn biến

### YYYY-MM-DD: <tên đợt>

- Đã làm:
- Phát hiện chính:
- Quyết định:
- Chưa kiểm chứng:
```

## `sources.md`

```markdown
# Nguồn đối chiếu <chủ đề>

Ngày truy cập: YYYY-MM-DD

| Chủ đề | Nguồn | Phiên bản | Dùng để kiểm tra |
| --- | --- | --- | --- |
| <nội dung> | <link> | <phiên bản> | <điểm trong review.md> |
```
