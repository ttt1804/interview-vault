/* Trang chủ đề: nút chuyển "Danh sách / Tiến độ" + lưới theo mục để thấy phần nào đã đọc, phần nào chưa.
   Mỗi mục một hàng, mỗi câu một ô: màu ô chỉ nói trạng thái đọc, vị trí ô giữ đúng thứ tự học.
   Mục, số câu và tên câu đọc từ chính danh sách trong trang. */
(function () {
  'use strict';
  var page = document.querySelector('.topic-page');
  if (!page) return;
  var toggle = document.querySelector('.view-toggle');
  var mount = document.querySelector('.topic-graph');
  var VKEY = 'iv-topic-view';

  function flash(t) {
    t.classList.remove('is-flash');
    void t.offsetWidth;
    t.classList.add('is-flash');
    setTimeout(function () { t.classList.remove('is-flash'); }, 1400);
  }

  /* ---- nhấp nháy câu đích khi bấm chip "Câu liên quan" ---- */
  document.querySelectorAll('.related-chip').forEach(function (a) {
    a.addEventListener('click', function () {
      if (page.classList.contains('is-graph-view')) setView('list');
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) flash(t);
    });
  });

  if (!toggle || !mount) return;
  if (document.querySelectorAll('.qa').length < 3) return;

  toggle.hidden = false;
  var btns = toggle.querySelectorAll('.vt-btn');
  var built = false;
  var cells = [];     // { art, el, id, n, label }
  var rows = [];      // { cells, count }
  var summary, detail, resetBtn;

  function setView(v) {
    var graphView = v === 'graph';
    if (graphView && window.IVFocus) window.IVFocus.exit();
    page.classList.toggle('is-graph-view', graphView);
    mount.hidden = !graphView;
    btns.forEach(function (b) {
      var on = b.dataset.view === v;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(VKEY, v); } catch (e) {}
    if (graphView) {
      if (!built) { built = true; build(); }
      paint();
    }
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { setView(b.dataset.view); }); });

  /* Vẽ lại trạng thái từ danh sách câu: enhance.js là nơi duy nhất giữ "đã đọc" và câu đang mở */
  function paint() {
    var doneAll = 0;
    cells.forEach(function (c) {
      var learned = c.art.classList.contains('is-learned');
      var current = c.art.classList.contains('is-open');
      c.el.classList.toggle('is-learned', learned);
      c.el.classList.toggle('is-current', current);
      c.el.setAttribute('aria-label', 'Câu ' + c.n + ': ' + c.label + (learned ? ' (đã đọc)' : '') + (current ? ' (đang đọc)' : ''));
      if (learned) doneAll++;
    });
    rows.forEach(function (r) {
      var done = r.cells.filter(function (c) { return c.el.classList.contains('is-learned'); }).length;
      r.count.textContent = done + '/' + r.cells.length;
      r.row.classList.toggle('is-done', done === r.cells.length);
    });
    if (summary) summary.textContent = 'Đã đọc ' + doneAll + '/' + cells.length + ' câu';
    if (resetBtn) resetBtn.hidden = doneAll === 0;
  }
  window.addEventListener('iv-progress', function () { if (built) paint(); });

  function build() {
    var head = document.createElement('div');
    head.className = 'gm-head';
    summary = document.createElement('p');
    summary.className = 'gm-summary';
    head.appendChild(summary);
    resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'link-reset';
    resetBtn.setAttribute('data-action', 'reset-learned');
    resetBtn.textContent = 'Bỏ đánh dấu tất cả';
    head.appendChild(resetBtn);
    var legend = document.createElement('div');
    legend.className = 'gm-legend';
    legend.innerHTML =
      '<span><i class="gm-swatch"></i>Chưa đọc</span>' +
      '<span><i class="gm-swatch is-learned"></i>Đã đọc</span>' +
      '<span><i class="gm-swatch is-current"></i>Đang đọc</span>';
    head.appendChild(legend);
    mount.appendChild(head);

    var IDLE = 'Rê chuột vào một ô để xem tên câu. Bấm để mở câu.';
    detail = document.createElement('p');
    detail.className = 'gm-detail';
    detail.textContent = IDLE;

    var grid = document.createElement('div');
    grid.className = 'gm-grid';
    var byId = {};
    document.querySelectorAll('.cat').forEach(function (sec) {
      var title = sec.querySelector('.cat-title');
      var row = document.createElement('section');
      row.className = 'gm-row';
      var name = document.createElement('a');
      name.className = 'gm-name';
      name.href = '#' + sec.id;
      var nameText = document.createElement('span');
      nameText.textContent = title && title.firstChild ? title.firstChild.textContent.trim() : sec.id;
      var count = document.createElement('span');
      count.className = 'gm-count';
      name.appendChild(nameText);
      name.appendChild(count);
      row.appendChild(name);
      var list = document.createElement('div');
      list.className = 'gm-cells';
      var rowCells = [];
      sec.querySelectorAll('.qa').forEach(function (art) {
        var num = art.querySelector('.qa-num');
        var q = art.querySelector('.qa-q');
        var a = document.createElement('a');
        a.className = 'gm-cell';
        a.href = '#' + art.id;
        a.textContent = num ? num.textContent : '';
        var c = { art: art, el: a, id: art.id, n: a.textContent, label: q ? q.textContent.trim() : art.id };
        a.title = c.label;
        cells.push(c);
        rowCells.push(c);
        byId[art.id] = c;
        list.appendChild(a);
      });
      row.appendChild(list);
      rows.push({ cells: rowCells, count: count, row: row });
      grid.appendChild(row);
    });
    mount.appendChild(grid);
    mount.appendChild(detail);

    function cellOf(target) {
      var el = target.closest ? target.closest('.gm-cell') : null;
      if (!el) return null;
      return byId[el.getAttribute('href').slice(1)] || null;
    }
    function light(c) {
      detail.textContent = c ? 'Câu ' + c.n + ': ' + c.label : IDLE;
    }
    /* Bàn phím dùng focus như chuột dùng hover */
    grid.addEventListener('mouseover', function (e) { var c = cellOf(e.target); if (c) light(c); });
    grid.addEventListener('mouseleave', function () { light(null); });
    grid.addEventListener('focusin', function (e) { var c = cellOf(e.target); if (c) light(c); });
    grid.addEventListener('focusout', function () { light(null); });

    /* Chuyển về danh sách trước khi trình duyệt nhảy tới hash; enhance.js lo việc mở đúng câu */
    grid.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (!link) return;
      setView('list');
      var c = cellOf(link);
      if (c) flash(c.art);
    });
  }

  var saved;
  try { saved = localStorage.getItem(VKEY); } catch (e) {}
  if (saved === 'graph') setView('graph');
})();
