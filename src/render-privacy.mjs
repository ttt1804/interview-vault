/* Trang chính sách bảo mật */
import { head, header, footer, breadcrumb, page } from './templates.mjs';

/* /privacy/ — nói đúng những gì site xử lý: chỉ có dữ liệu trên trình duyệt và hai dịch vụ bên ngoài */
export function renderPrivacyPage(o) {
  const url = `${o.siteUrl}privacy/`;
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

    <h2>Liên hệ</h2>
    <p>Thắc mắc về dữ liệu: mở issue tại kho mã nguồn của dự án.</p>
  </div>
</main>
${footer('../')}`;

  return page({
    root: '../',
    head: head({
      root: '../',
      title: 'Chính sách bảo mật — Interview Vault',
      description: 'Cách Interview Vault xử lý dữ liệu: tiến độ lưu trên trình duyệt, không đo lượt truy cập, không cookie.',
      canonical: url,
    }),
    body,
  });
}
