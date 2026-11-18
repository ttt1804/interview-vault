# Rà soát nội dung kiến thức

Thư mục này lưu quy trình và hồ sơ kiểm tra độ chính xác của nội dung trong `src/data`. Mục tiêu là mỗi lần sửa kiến thức đều có bằng chứng, có lịch sử và làm lại được cho chủ đề khác.

## Trạng thái

| Chủ đề | Số câu | Trạng thái | Kết quả | Hồ sơ |
| --- | ---: | --- | --- | --- |
| `java` | 147 | Đã rà soát và sửa ngày 2026-11-18 | 90 điểm, commit `14b60ba` | [java/](java/review.md) |
| `kafka` | 101 | Chưa rà soát | | |
| `aws` | 100 | Chưa rà soát | | |
| `redis` | 100 | Chưa rà soát | | |
| `sql` | 100 | Chưa rà soát | | |
| `microservices` | 101 | Chưa rà soát | | |
| `design-patterns` | 100 | Chưa rà soát | | |

Nội dung `java` còn được thay dần theo PDF của chủ site. Phần mới thay cần được rà soát lại theo quy trình này.

## Cấu trúc

```text
docs/content-review/
├── README.md        quy trình và trạng thái
├── TEMPLATE.md      mẫu hồ sơ cho chủ đề mới
└── <chủ-đề>/
    ├── review.md    danh sách điểm, nguồn và trạng thái
    ├── history.md   diễn biến điều tra và các đợt sửa
    ├── sources.md   nguồn đã đối chiếu và phiên bản
    └── verify/      chương trình hoặc script kiểm chứng, nếu có
```

## Quy trình

1. **Xác định phạm vi.** Liệt kê mọi file dữ liệu và sơ đồ của chủ đề. Ghi phiên bản công nghệ mà nội dung nhắm tới.
2. **Đọc hết nội dung.** Đọc cả `answer`, `essence`, `example`, `viz`, `demo`, `code` và `diagram`. Lỗi thường nằm ở comment trong demo hoặc ô trong sơ đồ.
3. **Ghi điểm nghi vấn.** Mỗi điểm có file, dòng, nội dung sai và cách sửa đề xuất. Chưa có bằng chứng thì chưa kết luận.
4. **Kiểm chứng.** Chạy thử khi có thể, sau đó đối chiếu nguồn theo thứ tự ưu tiên bên dưới.
5. **Phân mức.** Xếp vào lỗi sai, chưa chính xác hoặc lỗi thời, và lỗi nhỏ. Rút lại điểm không đứng vững và ghi lý do trong hồ sơ.
6. **Sửa theo đợt.** Sửa lỗi sai trước. Tìm cả các chỗ lặp cùng ý trong `essence`, `example`, `viz` và `demo`.
7. **Kiểm tra sau sửa.** Chạy `node src/build.mjs`, chạy lại phép kiểm chứng liên quan và kiểm tra cấu trúc `viz` đã đổi.
8. **Lưu hồ sơ.** Cập nhật `review.md`, `history.md`, `sources.md` và bảng trạng thái ở trên.

## Thứ tự ưu tiên nguồn

1. Chạy thử trên đúng phiên bản đang nói tới.
2. Đặc tả chính thức, ví dụ JLS, Jakarta Persistence, RFC, Fetch Standard.
3. Tài liệu chính thức của dự án.
4. Mã nguồn và Javadoc của dự án, ghi rõ tag hoặc nhánh.
5. Blog, sách và câu trả lời cộng đồng chỉ dùng để tìm hướng, không đủ để kết luận.

Trang tài liệu dài nên được tải về rồi tìm nguyên văn. Công cụ tóm tắt có thể bỏ sót đoạn cần tìm, như đã xảy ra với mục flush của Hibernate.

## Nhãn kiểm chứng

| Nhãn | Ý nghĩa |
| --- | --- |
| `[Chạy]` | Đã chạy thử, ghi phiên bản trong hồ sơ |
| `[Docs]` | Đối chiếu tài liệu hoặc đặc tả chính thức |
| `[Source]` | Đối chiếu mã nguồn hoặc Javadoc trong mã nguồn |
| `[Đọc nội dung]`, `[Đọc code]` | Lỗi chữ, lỗi đếm hoặc lỗi logic thấy trực tiếp |

Một điểm chưa có nhãn hoặc mới là suy luận thì chưa được coi là đã kiểm chứng.

## Quy tắc khi sửa

- Không đổi dòng `q:` hoặc `id:`, vì việc đó làm hỏng permalink và tiến độ đã lưu.
- Giữ văn phong và định dạng trong `CLAUDE.md`.
- Ghi mốc phiên bản khi hành vi phụ thuộc phiên bản.
- Không chép nguyên văn dài từ tài liệu. Hồ sơ chỉ ghi kết luận và link nguồn.
- Sửa nội dung và tạo hồ sơ thành hai commit riêng khi có thể.

## Áp bản vá

Dùng `tools/apply-content-patch.mjs` cho các đợt sửa nhiều chỗ:

```text
@@ src/data/java-01-oop.js
<<<
đoạn cũ, phải khớp đúng một chỗ
===
đoạn mới
>>>
```

```bash
node tools/apply-content-patch.mjs patch.txt --check
```

```bash
node tools/apply-content-patch.mjs patch.txt
```

```bash
node src/build.mjs
```

Công cụ không ghi file nào nếu có một khối không khớp đúng một chỗ, hoặc khối đó đụng vào dòng `q:` hay `id:`.

## Điều kiện hoàn tất

- Đã đọc hết phạm vi và mọi điểm còn lại đều có nhãn kiểm chứng.
- Các điểm được chọn đã sửa hoặc có lý do chưa sửa trong hồ sơ.
- Build đạt và không đổi `q`.
- Hồ sơ ghi rõ phần chưa chạy được, phiên bản đã dùng và mã commit.
