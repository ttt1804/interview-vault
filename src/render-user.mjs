/* Trang tài khoản, chính sách bảo mật.
   Khung tĩnh — dữ liệu do assets/account.js nạp từ Worker. */
import { head, header, footer, breadcrumb, page } from './templates.mjs';

const common = (o) => ({ root: '../', analyticsUrl: o.analyticsUrl, googleClientId: o.googleClientId });

/* /tai-khoan/ — hồ sơ + dashboard cá nhân + cài đặt + xoá dữ liệu */
export function renderAccountPage(o) {
  const url = `${o.siteUrl}tai-khoan/`;
  const body = `${header({ root: '../', topics: o.topics, current: null })}
<main id="main" class="acct-page">
  <div class="wrap acct-wrap">
    ${breadcrumb([{ name: 'Trang chủ', href: '../' }, { name: 'Tài khoản' }])}
    <h1 class="topic-h1"><span class="topic-h1-icon" aria-hidden="true">👤</span>Tài khoản</h1>

    <section class="acct-guest" data-acct-guest hidden>
      <p class="lede">Đăng nhập bằng Google để <strong>đồng bộ tiến độ học</strong> giữa các thiết bị,
        và mở khoá nội dung premium (khi có).</p>
      <div data-acct-signin></div>
      <p class="acct-note muted" data-acct-disabled hidden>Đăng nhập chưa được cấu hình trên bản deploy này.</p>
    </section>

    <section class="acct-user" data-acct-user hidden>
      <div class="acct-id">
        <img class="acct-avatar" data-acct-avatar alt="" width="56" height="56">
        <div>
          <p class="acct-name" data-acct-name></p>
          <p class="acct-email muted" data-acct-email></p>
          <p class="acct-tier" data-acct-tier></p>
        </div>
        <button type="button" class="btn-ghost" data-acct-signout>Đăng xuất</button>
      </div>

      <div class="acct-stats" data-acct-stats>
        <div class="acct-stat"><b data-k="learned">0</b><span>câu đã đọc</span></div>
        <div class="acct-stat"><b data-k="due">0</b><span>câu cần ôn</span></div>
        <div class="acct-stat"><b data-k="streak">0</b><span>ngày liên tục</span></div>
        <div class="acct-stat"><b data-k="week">0</b><span>câu luyện / 7 ngày</span></div>
      </div>

      <section class="acct-block">
        <h2>Tiến độ theo chủ đề</h2>
        <div class="acct-topics" data-acct-topics></div>
      </section>
      <script type="application/json" id="acct-topics-data">${JSON.stringify(
        o.topics.map((t) => ({ id: t.id, name: t.name, icon: t.icon, count: (o.counts || {})[t.id] || 0 }))
      ).replace(/</g, '\\u003c')}</script>

      <section class="acct-block acct-danger">
        <h2>Dữ liệu của bạn</h2>
        <p class="muted">Chúng tôi lưu: email, tên, ảnh đại diện Google, và tiến độ học (câu đã đọc,
          lịch ôn tập).</p>
        <button type="button" class="btn-danger" data-acct-delete>Xoá tài khoản &amp; toàn bộ dữ liệu</button>
      </section>
    </section>
  </div>
</main>
${footer('../')}`;

  return page({
    root: '../',
    scripts: ['assets/account.js'],
    head: head({
      ...common(o),
      title: 'Tài khoản — Interview Vault',
      description: 'Đăng nhập Google để đồng bộ tiến độ luyện tập giữa các thiết bị.',
      canonical: url,
      robots: 'noindex, follow',
    }),
    body,
  });
}

/* /privacy/ — bắt buộc cho OAuth consent screen của Google */
export function renderPrivacyPage(o) {
  const url = `${o.siteUrl}privacy/`;
  /* Chỉ nêu việc lưu tài khoản khi build thật sự bật đăng nhập, cùng điều kiện với ENABLED trong auth.js */
  const loginEnabled = !!(o.googleClientId && o.analyticsUrl);
  const body = `${header({ root: '../', topics: o.topics, current: null })}
<main id="main" class="prose-page">
  <div class="wrap prose-wrap">
    ${breadcrumb([{ name: 'Trang chủ', href: '../' }, { name: 'Chính sách bảo mật' }])}
    <h1 class="topic-h1"><span class="topic-h1-icon" aria-hidden="true">🔒</span>Chính sách bảo mật</h1>
    <p class="muted">Cập nhật: ${new Date().toISOString().slice(0, 10)}</p>

    <h2>Dữ liệu trên trình duyệt của bạn</h2>
    <p>Tiến độ học (câu đã đọc, lịch ôn tập) và lựa chọn giao diện được lưu trong
      <code>localStorage</code> của trình duyệt bạn. Xoá dữ liệu trang web trong trình duyệt là xoá hết.</p>

    <h2>Thống kê truy cập</h2>
    <p>Trang web <strong>không đo lượt truy cập</strong>: không cookie, không công cụ phân tích,
      không dịch vụ theo dõi.</p>

    <h2>Dịch vụ bên ngoài</h2>
    <p>Trang được lưu trữ trên <strong>GitHub Pages</strong> và tải phông chữ từ <strong>Google Fonts</strong>.
      Khi bạn mở trang, trình duyệt kết nối tới các dịch vụ này nên họ có thể nhận địa chỉ IP của bạn
      theo chính sách riêng của họ.</p>

${loginEnabled ? `    <h2>Tài khoản Google (tuỳ chọn)</h2>
    <p>Bạn có thể đăng nhập bằng Google. Khi đó chúng tôi nhận và lưu từ hồ sơ Google của bạn:
      <strong>mã định danh (sub), địa chỉ email, tên, và ảnh đại diện</strong>. Chúng tôi dùng các
      thông tin này chỉ để:</p>
    <ul>
      <li>Đồng bộ tiến độ học của bạn (câu đã đọc, lịch ôn tập) giữa các thiết bị;</li>
      <li>Xác định quyền truy cập nội dung premium (nếu bạn được cấp).</li>
    </ul>
    <p>Chúng tôi không bán dữ liệu, không dùng cho quảng cáo, và không chia sẻ với bên thứ ba.
      Dữ liệu lưu trên Cloudflare D1 (khu vực do Cloudflare quản lý).</p>

    <h2>Xoá dữ liệu</h2>
    <p>Vào <a href="../tai-khoan/">Tài khoản → Xoá tài khoản</a> để xoá ngay toàn bộ hồ sơ và tiến độ
      khỏi máy chủ. Bạn cũng có thể thu hồi quyền truy cập tại
      <a href="https://myaccount.google.com/permissions" rel="noopener">Google Account → Bên thứ ba</a>.</p>

` : ''}    <h2>Liên hệ</h2>
    <p>Thắc mắc về dữ liệu: mở issue tại kho mã nguồn của dự án.</p>
  </div>
</main>
${footer('../')}`;

  return page({
    root: '../',
    head: head({
      ...common(o),
      title: 'Chính sách bảo mật — Interview Vault',
      description: 'Cách Interview Vault xử lý dữ liệu: tiến độ lưu trên trình duyệt, không đo lượt truy cập, không cookie.',
      canonical: url,
    }),
    body,
  });
}
