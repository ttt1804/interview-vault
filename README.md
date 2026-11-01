# Interview Vault

> 🌐 **Website trực tuyến:** [https://ttt1804.github.io/interview-vault/](https://ttt1804.github.io/interview-vault/)

Trang web tĩnh ôn tập **700+ câu hỏi phỏng vấn cấp độ Middle** cho 7 chủ đề:
**Java / Spring Boot · Apache Kafka · AWS · Redis · SQL · Microservices · Design Patterns**.

Mỗi câu gồm bốn phần: **Trả lời** (chi tiết) · **Bản chất** (cốt lõi để nhớ nhanh) · **Ví dụ thực tế**
· **Code & cấu hình** (tô màu cú pháp sẵn, giải thích ngay trong comment).
Nội dung tiếng Việt, giữ nguyên thuật ngữ kỹ thuật tiếng Anh.

Trang được **render sẵn thành HTML tĩnh** (tối ưu SEO), hoạt động **không cần JavaScript**;
JavaScript chỉ thêm tiện ích (lọc, đánh dấu "đã đọc", thu gọn, giao diện sáng/tối).

Có trang **`/luyen-tap/`** kiểu LeetCode: duyệt & lọc toàn bộ 702 câu theo chủ đề / trạng thái,
rồi vào **phiên luyện chủ động** — hiện câu hỏi, tự nhớ lại, mở đáp án, tự chấm
(Không nhớ / Khó / Nhớ rõ). Câu chưa chắc được lặp lại sớm hơn (spaced repetition).
Tiến độ (`iv-srs`, `iv-questions-learned`, `iv-practice-log`) lưu ở localStorage, đồng bộ với nút
"đã đọc" trên trang chủ đề. Mỗi trang chủ đề có nút *🎯 Luyện tập chủ đề* dẫn tới
`/luyen-tap/?topic=<id>`.

**Bài tập code SQL**: câu SQL phù hợp có thêm `code: { lang:'sql', prompt, tables, datasets, starter,
solution, ordered }`. Trong trình luyện, câu đó hiện **IDE**: xem schema + dữ liệu mẫu, viết truy vấn,
"▶ Chạy & chấm" → SQLite chạy trong trình duyệt (`assets/vendor/sql-wasm.*`, tải on-demand), so
result set của bạn với lời giải trên **2 bộ dữ liệu** (chống hard-code) → Accepted / diff "mong đợi vs
nhận được". Lọc "Có bài tập code" trong bộ lọc trạng thái. (Java qua CheerpJ: kế hoạch tiếp theo.)

## Chạy tại máy

Không cần cài package (chỉ dùng Node core).

```bash
node src/build.mjs      # sinh trang tĩnh vào dist/
node src/serve.mjs      # xem thử tại http://localhost:4173
# hoặc gộp cả hai:
npm run serve
```

## Triển khai lên GitHub Pages

Đã có sẵn workflow `.github/workflows/deploy.yml` (build bằng Node, deploy qua GitHub Pages).

1. Tạo một repo trên GitHub (ví dụ `interview-vault`), rồi:
   ```bash
   git remote add origin https://github.com/<username>/interview-vault.git
   git push -u origin main
   ```
2. Trên GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Mỗi lần push lên nhánh `main`, workflow tự build và deploy.
   URL: `https://<username>.github.io/interview-vault/`
   (workflow tự lấy đúng base URL, không cần sửa gì).

> Nếu muốn dùng làm **user site** (`<username>.github.io`): đặt tên repo là `<username>.github.io`
> — mọi thứ vẫn chạy, base URL thành `https://<username>.github.io/`.

## Đăng nhập Google (tuỳ chọn)

Backend riêng trong [`analytics/`](analytics/) — **Cloudflare Worker + D1**. Đặt **repo variable** `ANALYTICS_URL`
= URL Worker, `GOOGLE_CLIENT_ID` + secret `SESSION_SECRET`
cho Worker — xem [`analytics/README.md`](analytics/README.md) phần **C**. Chưa cấu hình thì nút
"Đăng nhập" tự ẩn, site chạy y như cũ.

Khi bật, người dùng đăng nhập Google (sau **màn hình đồng ý** nêu rõ dữ liệu được lưu) để:
- Đồng bộ tiến độ luyện tập (`iv-srs` / câu đã đọc / log) giữa các thiết bị — merge kiểu union (trừ chủ đề vừa "Bỏ đánh dấu tất cả"),
  đẩy lên server sau mỗi lần chấm (debounce 2.5s).
- Trang **`/tai-khoan/`**: dashboard cá nhân (đã đọc / cần ôn / streak / theo chủ đề),
  **xoá tài khoản + toàn bộ dữ liệu**.
- **`/privacy/`**: chính sách bảo mật (bắt buộc cho OAuth consent screen của Google).
- Quyền **premium**: đường ống entitlement có sẵn (`tier` trong `/me`), cấp thủ công qua
  `POST /admin/grant`. Chưa có nội dung premium.

## SEO

- Mỗi chủ đề là một URL riêng (`/java/`, `/kafka/`…) với toàn bộ nội dung trong HTML.
- `<title>`, `meta description`, canonical, Open Graph riêng cho từng trang.
- Structured data **FAQPage** (JSON-LD) cho mỗi trang chủ đề.
- `sitemap.xml`, `robots.txt`, trang `404.html` tự chứa.
- HTTPS do GitHub Pages tự cấp.

> **Được index chưa?** Có thẻ SEO ≠ có mặt trên Google. Site mới phải: (1) thêm vào
> **Google Search Console** — xác minh bằng cách bỏ file `google….html` vào [`static/`](static/);
> (2) nộp `sitemap.xml`; (3) *URL Inspection → Request Indexing* cho trang chủ + 7 trang chủ đề.
> Index mất vài ngày–2 tuần; xếp hạng từ khoá cạnh tranh mất nhiều tháng + cần backlink.

## Cấu trúc

```
src/
  data/                 # 35 file câu hỏi + _topics.js (nội dung, tự đăng ký qua SS.addQuestions)
  format.mjs            # markdown-lite -> HTML, slug, hash id, strip
  highlight.mjs         # tô màu cú pháp lúc build cho khối demo (tokenizer tự viết)
  templates.mjs         # <head> đầy đủ SEO, header, footer, breadcrumb, khung trang
  render.mjs            # sinh trang chủ, trang chủ đề, /luyen-tap, sitemap, 404
  render-user.mjs      # sinh /tai-khoan, /privacy
  build.mjs             # đọc data -> kiểm tra toàn vẹn -> ghi dist/  (env ANALYTICS_URL, GOOGLE_CLIENT_ID)
  serve.mjs             # máy chủ tĩnh tối giản để xem thử
assets/
  styles.css           # thiết kế (IBM Plex Sans/Mono + Lora; màu theo chủ đề; sáng/tối)
  practice.js          # trang /luyen-tap: lọc + phiên luyện + spaced repetition
  enhance.js            # tiện ích client (không bắt buộc)
  auth.js              # đăng nhập Google + modal đồng ý + đồng bộ tiến độ
  account.js           # trang /tai-khoan
tools/
  add-demos.mjs        # chèn field demo hàng loạt từ file patch (không tham gia build)
analytics/             # Cloudflare Worker + D1 — thống kê truy cập + IP + tài khoản Google (deploy riêng)
  src/{worker,analytics,auth,users,lib}.js
static/                # file copy nguyên trạng ra gốc site (google….html, BingSiteAuth.xml, CNAME…)
.github/workflows/deploy.yml
```

### Thêm câu hỏi

Sửa file trong `src/data/`. Mỗi mục:

```js
SS.addQuestions('java', [
  {
    cat: 'Tên mục con',
    q: 'Câu hỏi?',
    answer: 'Hỗ trợ **đậm**, `code`, ```khối code```, danh sách "- ", "1. ", bảng "| a | b |".',
    essence: 'Cốt lõi 1–2 câu.',
    example: 'Ví dụ thực tế 1–2 câu.',
  },
]);
```

`id` sinh tự động từ hash nội dung câu hỏi (ổn định khi thêm/sắp xếp lại).
Chạy lại `node src/build.mjs` — build sẽ dừng nếu thiếu field hoặc trùng id.

Tuỳ chọn thêm cho mỗi câu:

- `related: ['java-xxxx', ...]` — ghi đè thủ công danh sách câu liên quan (mặc định tự suy ra).
- `viz: { type, ... }` — hình minh hoạ tương tác. `type` là một trong: `compare`, `layers`,
  `tree`, `bars`, `flow`, `sequence`, `states`, `cycle`, `timeline`, `quadrant`
  (xem `assets/viz/viz-static.js` và `assets/viz/viz-anim.js` để biết cấu trúc dữ liệu từng loại).
- `demo: [{ lang, title, code }]` — ví dụ **code & cấu hình**, hiện dưới phần "Ví dụ thực tế"
  (một object cũng được, không cần bọc mảng). Phần giải thích viết ngay trong **comment của
  đoạn code**, không có field riêng.

### Ví dụ code (`demo`)

Code được **tô màu cú pháp sẵn lúc build** (`src/highlight.mjs` — tokenizer tự viết, không thêm
dependency, không cần JavaScript ở phía trình duyệt). Ngôn ngữ hỗ trợ: `java`, `sql`, `yaml`,
`properties`, `json`, `xml`, `bash`, `dockerfile`, `js`, `lua` (kèm alias `yml`, `sh`, `ini`…).
Mỗi khối có nút *Sao chép* (chỉ hiện khi bật JavaScript).

Soạn hàng loạt bằng file patch thay vì sửa tay:

```bash
node tools/add-demos.mjs patch.txt src/data/java-01-core-oop.js
```

**Đã phủ 702/702 câu** ở cả 7 chủ đề — tổng cộng 793 khối code
(Java 338 · Shell 247 · SQL 109 · YAML 46 · Properties 26 · JSON 17 · Lua/Dockerfile/XML 10).

