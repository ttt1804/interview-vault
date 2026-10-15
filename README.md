# Interview Vault

> 🌐 **Website trực tuyến:** [https://ttt1804.github.io/interview-vault/](https://ttt1804.github.io/interview-vault/)

Trang web tÄ©nh Ã´n táº­p **700+ cÃ¢u há»i phá»ng váº¥n cáº¥p Ä‘á»™ Middle** cho 7 chá»§ Ä‘á»:
**Java / Spring Boot Â· Apache Kafka Â· AWS Â· Redis Â· SQL Â· Microservices Â· Design Patterns**.

Má»—i cÃ¢u gá»“m bá»‘n pháº§n: **Tráº£ lá»i** (chi tiáº¿t) Â· **Báº£n cháº¥t** (cá»‘t lÃµi Ä‘á»ƒ nhá»› nhanh) Â· **VÃ­ dá»¥ thá»±c táº¿**
Â· **Code & cáº¥u hÃ¬nh** (tÃ´ mÃ u cÃº phÃ¡p sáºµn, giáº£i thÃ­ch ngay trong comment).
Ná»™i dung tiáº¿ng Viá»‡t, giá»¯ nguyÃªn thuáº­t ngá»¯ ká»¹ thuáº­t tiáº¿ng Anh.

Trang Ä‘Æ°á»£c **render sáºµn thÃ nh HTML tÄ©nh** (tá»‘i Æ°u SEO), hoáº¡t Ä‘á»™ng **khÃ´ng cáº§n JavaScript**;
JavaScript chá»‰ thÃªm tiá»‡n Ã­ch (lá»c, Ä‘Ã¡nh dáº¥u "Ä‘Ã£ thuá»™c", thu gá»n, giao diá»‡n sÃ¡ng/tá»‘i).

CÃ³ trang **`/luyen-tap/`** kiá»ƒu LeetCode: duyá»‡t & lá»c toÃ n bá»™ 702 cÃ¢u theo chá»§ Ä‘á» / tráº¡ng thÃ¡i,
rá»“i vÃ o **phiÃªn luyá»‡n chá»§ Ä‘á»™ng** â€” hiá»‡n cÃ¢u há»i, tá»± nhá»› láº¡i, má»Ÿ Ä‘Ã¡p Ã¡n, tá»± cháº¥m
(KhÃ´ng nhá»› / KhÃ³ / ÄÃ£ thuá»™c). CÃ¢u chÆ°a cháº¯c Ä‘Æ°á»£c láº·p láº¡i sá»›m hÆ¡n (spaced repetition).
Tiáº¿n Ä‘á»™ (`iv-srs`, `iv-questions-learned`, `iv-practice-log`) lÆ°u á»Ÿ localStorage, Ä‘á»“ng bá»™ vá»›i nÃºt
"Ä‘Ã£ thuá»™c" trÃªn trang chá»§ Ä‘á». Má»—i trang chá»§ Ä‘á» cÃ³ nÃºt *ðŸŽ¯ Luyá»‡n táº­p chá»§ Ä‘á»* dáº«n tá»›i
`/luyen-tap/?topic=<id>`.

**BÃ i táº­p code SQL**: cÃ¢u SQL phÃ¹ há»£p cÃ³ thÃªm `code: { lang:'sql', prompt, tables, datasets, starter,
solution, ordered }`. Trong trÃ¬nh luyá»‡n, cÃ¢u Ä‘Ã³ hiá»‡n **IDE**: xem schema + dá»¯ liá»‡u máº«u, viáº¿t truy váº¥n,
"â–¶ Cháº¡y & cháº¥m" â†’ SQLite cháº¡y trong trÃ¬nh duyá»‡t (`assets/vendor/sql-wasm.*`, táº£i on-demand), so
result set cá»§a báº¡n vá»›i lá»i giáº£i trÃªn **2 bá»™ dá»¯ liá»‡u** (chá»‘ng hard-code) â†’ Accepted / diff "mong Ä‘á»£i vs
nháº­n Ä‘Æ°á»£c". Lá»c "CÃ³ bÃ i táº­p code" trong bá»™ lá»c tráº¡ng thÃ¡i. (Java qua CheerpJ: káº¿ hoáº¡ch tiáº¿p theo.)

## Cháº¡y táº¡i mÃ¡y

KhÃ´ng cáº§n cÃ i package (chá»‰ dÃ¹ng Node core).

```bash
node src/build.mjs      # sinh trang tÄ©nh vÃ o dist/
node src/serve.mjs      # xem thá»­ táº¡i http://localhost:4173
# hoáº·c gá»™p cáº£ hai:
npm run serve
```

## Triá»ƒn khai lÃªn GitHub Pages

ÄÃ£ cÃ³ sáºµn workflow `.github/workflows/deploy.yml` (build báº±ng Node, deploy qua GitHub Pages).

1. Táº¡o má»™t repo trÃªn GitHub (vÃ­ dá»¥ `iv-process`), rá»“i:
   ```bash
   git remote add origin https://github.com/<username>/iv-process.git
   git push -u origin main
   ```
2. TrÃªn GitHub: **Settings â†’ Pages â†’ Build and deployment â†’ Source: GitHub Actions**.
3. Má»—i láº§n push lÃªn nhÃ¡nh `main`, workflow tá»± build vÃ  deploy.
   URL: `https://<username>.github.io/iv-process/`
   (workflow tá»± láº¥y Ä‘Ãºng base URL, khÃ´ng cáº§n sá»­a gÃ¬).

> Náº¿u muá»‘n dÃ¹ng lÃ m **user site** (`<username>.github.io`): Ä‘áº·t tÃªn repo lÃ  `<username>.github.io`
> â€” má»i thá»© váº«n cháº¡y, base URL thÃ nh `https://<username>.github.io/`.

## Thá»‘ng kÃª truy cáº­p (tuá»³ chá»n)

Backend riÃªng trong [`analytics/`](analytics/) â€” **Cloudflare Worker + D1** (SQLite), miá»…n phÃ­.
Xem [`analytics/README.md`](analytics/README.md) Ä‘á»ƒ set up database vÃ  deploy.

Sau khi deploy Worker, Ä‘áº·t **repo variable** `ANALYTICS_URL` = URL Worker
(*Settings â†’ Secrets and variables â†’ Actions â†’ Variables*) rá»“i build láº¡i (push hoáº·c re-run Actions).

- CÃ³ `ANALYTICS_URL`: footer hiá»‡n **sá»‘ tháº­t**, thÃªm trang **`/stats`** (tá»•ng lÆ°á»£t truy cáº­p, khÃ¡ch duy
  nháº¥t, khÃ¡ch quay láº¡i, biá»ƒu Ä‘á»“ 30 ngÃ y, lÆ°á»£t truy cáº­p theo chá»§ Ä‘á», vÃ  báº£ng Ä‘á»‹a chá»‰ IP).
- ChÆ°a cÃ³: footer dÃ¹ng bá»™ Ä‘áº¿m táº¡m phÃ­a client, `/stats` bÃ¡o "chÆ°a cáº¥u hÃ¬nh".

**Má»™t lÆ°á»£t truy cáº­p = má»™t phiÃªn**: `enhance.js` chá»‰ gá»­i `/collect` khi phiÃªn má»›i â€” phiÃªn háº¿t háº¡n sau
**30 phÃºt khÃ´ng hoáº¡t Ä‘á»™ng** (cá»­a sá»• trÆ°á»£t, chung má»i tab, má»‘c lÆ°u á»Ÿ `localStorage['iv-ses']`).
Táº£i láº¡i trang / má»Ÿ nhiá»u tab trong phiÃªn khÃ´ng cá»™ng thÃªm. "KhÃ¡ch duy nháº¥t" vÃ  "khÃ¡ch quay láº¡i"
váº«n tÃ­nh theo `iv-vid` + ngÃ y nhÆ° cÅ©.

Visitor id lÃ  chuá»—i ngáº«u nhiÃªn trong `localStorage` (**khÃ´ng cookie**); tÃ´n trá»ng Do Not Track
(báº­t DNT thÃ¬ client khÃ´ng gá»­i gÃ¬ cáº£); bot bá»‹ lá»c theo User-Agent.

**Thá»‘ng kÃª theo Ä‘á»‹a chá»‰ IP**: Worker lÆ°u IP khÃ¡ch (`CF-Connecting-IP`) vÃ o báº£ng `visitor_ip` cÃ¹ng
quá»‘c gia/thÃ nh phá»‘ Cloudflare suy ra, sá»‘ phiÃªn, láº§n Ä‘áº§u & láº§n gáº§n nháº¥t. Trang `/stats` hiá»ƒn thá»‹
**cÃ´ng khai** báº£ng 100 IP nhiá»u lÆ°á»£t nháº¥t (sáº¯p theo lÆ°á»£t hoáº·c theo thá»i gian gáº§n nháº¥t) vÃ  biá»ƒu Ä‘á»“
theo quá»‘c gia.

> âš ï¸ IP lÃ  **dá»¯ liá»‡u cÃ¡ nhÃ¢n** theo GDPR vÃ  trang `/stats` khÃ´ng cÃ³ xÃ¡c thá»±c â€” ai biáº¿t URL Ä‘á»u xem
> Ä‘Æ°á»£c. `/privacy/` Ä‘Ã£ ghi rÃµ Ä‘iá»u nÃ y. Muá»‘n giáº£m má»©c nháº¡y cáº£m: gá»i `maskIp()` (cÃ³ sáºµn trong
> `analytics/src/analytics.js`) trÆ°á»›c khi ghi DB Ä‘á»ƒ che 8 bit cuá»‘i (IPv4) / giá»¯ /64 (IPv6).

## ÄÄƒng nháº­p Google (tuá»³ chá»n)

DÃ¹ng chung Worker `analytics/`. Äáº·t **repo variable** `GOOGLE_CLIENT_ID` + secret `SESSION_SECRET`
cho Worker â€” xem [`analytics/README.md`](analytics/README.md) pháº§n **C**. ChÆ°a cáº¥u hÃ¬nh thÃ¬ nÃºt
"ÄÄƒng nháº­p" tá»± áº©n, site cháº¡y y nhÆ° cÅ©.

Khi báº­t, ngÆ°á»i dÃ¹ng Ä‘Äƒng nháº­p Google (sau **mÃ n hÃ¬nh Ä‘á»“ng Ã½** nÃªu rÃµ dá»¯ liá»‡u Ä‘Æ°á»£c lÆ°u) Ä‘á»ƒ:
- Äá»“ng bá»™ tiáº¿n Ä‘á»™ luyá»‡n táº­p (`iv-srs` / cÃ¢u Ä‘Ã£ thuá»™c / log) giá»¯a cÃ¡c thiáº¿t bá»‹ â€” merge kiá»ƒu union,
  Ä‘áº©y lÃªn server sau má»—i láº§n cháº¥m (debounce 2.5s).
- Trang **`/tai-khoan/`**: dashboard cÃ¡ nhÃ¢n (Ä‘Ã£ thuá»™c / cáº§n Ã´n / streak / theo chá»§ Ä‘á»), cÃ i Ä‘áº·t
  tÃªn hiá»ƒn thá»‹, **xoÃ¡ tÃ i khoáº£n + toÃ n bá»™ dá»¯ liá»‡u**.
- Trang **`/bang-xep-hang/`**: top 7 ngÃ y, chá»‰ hiá»‡n ngÆ°á»i tá»± báº­t.
- **`/privacy/`**: chÃ­nh sÃ¡ch báº£o máº­t (báº¯t buá»™c cho OAuth consent screen cá»§a Google).
- Quyá»n **premium**: Ä‘Æ°á»ng á»‘ng entitlement cÃ³ sáºµn (`tier` trong `/me`), cáº¥p thá»§ cÃ´ng qua
  `POST /admin/grant`. ChÆ°a cÃ³ ná»™i dung premium.

LÆ°á»£t xem trang vÃ  Ä‘á»‹a chá»‰ IP **khÃ´ng** gáº¯n vá»›i danh tÃ­nh ngÆ°á»i Ä‘Äƒng nháº­p â€” hai pháº§n dá»¯ liá»‡u nÃ y
tÃ¡ch biá»‡t hoÃ n toÃ n trong database.

## SEO

- Má»—i chá»§ Ä‘á» lÃ  má»™t URL riÃªng (`/java/`, `/kafka/`â€¦) vá»›i toÃ n bá»™ ná»™i dung trong HTML.
- `<title>`, `meta description`, canonical, Open Graph riÃªng cho tá»«ng trang.
- Structured data **FAQPage** (JSON-LD) cho má»—i trang chá»§ Ä‘á».
- `sitemap.xml`, `robots.txt`, trang `404.html` tá»± chá»©a.
- HTTPS do GitHub Pages tá»± cáº¥p.

> **ÄÆ°á»£c index chÆ°a?** CÃ³ tháº» SEO â‰  cÃ³ máº·t trÃªn Google. Site má»›i pháº£i: (1) thÃªm vÃ o
> **Google Search Console** â€” xÃ¡c minh báº±ng cÃ¡ch bá» file `googleâ€¦.html` vÃ o [`static/`](static/);
> (2) ná»™p `sitemap.xml`; (3) *URL Inspection â†’ Request Indexing* cho trang chá»§ + 7 trang chá»§ Ä‘á».
> Index máº¥t vÃ i ngÃ yâ€“2 tuáº§n; xáº¿p háº¡ng tá»« khoÃ¡ cáº¡nh tranh máº¥t nhiá»u thÃ¡ng + cáº§n backlink.

## Cáº¥u trÃºc

```
src/
  data/                 # 35 file cÃ¢u há»i + _topics.js (ná»™i dung, tá»± Ä‘Äƒng kÃ½ qua SS.addQuestions)
  format.mjs            # markdown-lite -> HTML, slug, hash id, strip
  highlight.mjs         # tÃ´ mÃ u cÃº phÃ¡p lÃºc build cho khá»‘i demo (tokenizer tá»± viáº¿t)
  templates.mjs         # <head> Ä‘áº§y Ä‘á»§ SEO, header, footer, breadcrumb, khung trang
  render.mjs            # sinh trang chá»§, trang chá»§ Ä‘á», /stats, /luyen-tap, sitemap, 404
  render-user.mjs      # sinh /tai-khoan, /bang-xep-hang, /privacy
  build.mjs             # Ä‘á»c data -> kiá»ƒm tra toÃ n váº¹n -> ghi dist/  (env ANALYTICS_URL, GOOGLE_CLIENT_ID)
  serve.mjs             # mÃ¡y chá»§ tÄ©nh tá»‘i giáº£n Ä‘á»ƒ xem thá»­
assets/
  styles.css           # thiáº¿t káº¿ (IBM Plex Sans/Mono + Lora; mÃ u theo chá»§ Ä‘á»; sÃ¡ng/tá»‘i)
  practice.js          # trang /luyen-tap: lá»c + phiÃªn luyá»‡n + spaced repetition
  enhance.js            # tiá»‡n Ã­ch client + gá»­i lÆ°á»£t xem (khÃ´ng báº¯t buá»™c)
  auth.js              # Ä‘Äƒng nháº­p Google + modal Ä‘á»“ng Ã½ + Ä‘á»“ng bá»™ tiáº¿n Ä‘á»™
  account.js           # trang /tai-khoan
  leaderboard.js       # trang /bang-xep-hang
  stats.js             # náº¡p & váº½ sá»‘ liá»‡u cho trang /stats
tools/
  add-demos.mjs        # chÃ¨n field demo hÃ ng loáº¡t tá»« file patch (khÃ´ng tham gia build)
analytics/             # Cloudflare Worker + D1 â€” thá»‘ng kÃª truy cáº­p + IP + tÃ i khoáº£n Google (deploy riÃªng)
  src/{worker,analytics,auth,users,lib}.js
static/                # file copy nguyÃªn tráº¡ng ra gá»‘c site (googleâ€¦.html, BingSiteAuth.xml, CNAMEâ€¦)
.github/workflows/deploy.yml
```

### ThÃªm cÃ¢u há»i

Sá»­a file trong `src/data/`. Má»—i má»¥c:

```js
SS.addQuestions('java', [
  {
    cat: 'TÃªn má»¥c con',
    q: 'CÃ¢u há»i?',
    answer: 'Há»— trá»£ **Ä‘áº­m**, `code`, ```khá»‘i code```, danh sÃ¡ch "- ", "1. ", báº£ng "| a | b |".',
    essence: 'Cá»‘t lÃµi 1â€“2 cÃ¢u.',
    example: 'VÃ­ dá»¥ thá»±c táº¿ 1â€“2 cÃ¢u.',
  },
]);
```

`id` sinh tá»± Ä‘á»™ng tá»« hash ná»™i dung cÃ¢u há»i (á»•n Ä‘á»‹nh khi thÃªm/sáº¯p xáº¿p láº¡i).
Cháº¡y láº¡i `node src/build.mjs` â€” build sáº½ dá»«ng náº¿u thiáº¿u field hoáº·c trÃ¹ng id.

Tuá»³ chá»n thÃªm cho má»—i cÃ¢u:

- `related: ['java-xxxx', ...]` â€” ghi Ä‘Ã¨ thá»§ cÃ´ng danh sÃ¡ch cÃ¢u liÃªn quan (máº·c Ä‘á»‹nh tá»± suy ra).
- `viz: { type, ... }` â€” hÃ¬nh minh hoáº¡ tÆ°Æ¡ng tÃ¡c. `type` lÃ  má»™t trong: `compare`, `layers`,
  `tree`, `bars`, `flow`, `sequence`, `states`, `cycle`, `timeline`, `quadrant`
  (xem `assets/viz/viz-static.js` vÃ  `assets/viz/viz-anim.js` Ä‘á»ƒ biáº¿t cáº¥u trÃºc dá»¯ liá»‡u tá»«ng loáº¡i).
- `demo: [{ lang, title, code }]` â€” vÃ­ dá»¥ **code & cáº¥u hÃ¬nh**, hiá»‡n dÆ°á»›i pháº§n "VÃ­ dá»¥ thá»±c táº¿"
  (má»™t object cÅ©ng Ä‘Æ°á»£c, khÃ´ng cáº§n bá»c máº£ng). Pháº§n giáº£i thÃ­ch viáº¿t ngay trong **comment cá»§a
  Ä‘oáº¡n code**, khÃ´ng cÃ³ field riÃªng.

### VÃ­ dá»¥ code (`demo`)

Code Ä‘Æ°á»£c **tÃ´ mÃ u cÃº phÃ¡p sáºµn lÃºc build** (`src/highlight.mjs` â€” tokenizer tá»± viáº¿t, khÃ´ng thÃªm
dependency, khÃ´ng cáº§n JavaScript á»Ÿ phÃ­a trÃ¬nh duyá»‡t). NgÃ´n ngá»¯ há»— trá»£: `java`, `sql`, `yaml`,
`properties`, `json`, `xml`, `bash`, `dockerfile`, `js`, `lua` (kÃ¨m alias `yml`, `sh`, `ini`â€¦).
Má»—i khá»‘i cÃ³ nÃºt *Sao chÃ©p* (chá»‰ hiá»‡n khi báº­t JavaScript).

Soáº¡n hÃ ng loáº¡t báº±ng file patch thay vÃ¬ sá»­a tay:

```bash
node tools/add-demos.mjs patch.txt src/data/java-01-core-oop.js
```

**ÄÃ£ phá»§ 702/702 cÃ¢u** á»Ÿ cáº£ 7 chá»§ Ä‘á» â€” tá»•ng cá»™ng 793 khá»‘i code
(Java 338 Â· Shell 247 Â· SQL 109 Â· YAML 46 Â· Properties 26 Â· JSON 17 Â· Lua/Dockerfile/XML 10).

