/* Nâng cao trải nghiệm cho trang tĩnh — không bắt buộc, trang vẫn dùng được nếu tắt JS */
(function () {
  'use strict';
  var store = {
    k: 'iv-questions-learned',
    read: function () { try { return JSON.parse(localStorage.getItem(this.k)) || {}; } catch (e) { return {}; } },
    write: function (v) { try { localStorage.setItem(this.k, JSON.stringify(v)); } catch (e) {} },
    toggle: function (id) { var v = this.read(); if (v[id]) delete v[id]; else v[id] = 1; this.write(v); return !!v[id]; },
  };

  /* ---- Sao chép khối code minh hoạ (uỷ quyền: khớp cả code do trình luyện tập chèn động) ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.demo-copy') : null;
    if (!btn) return;
    var box = btn.closest('.demo');
    var code = box && box.querySelector('.demo-pre code');
    if (!code) return;
    var text = code.textContent;
    var done = function (ok) {
      btn.textContent = ok ? '✓ Đã chép' : 'Lỗi';
      btn.classList.toggle('is-done', ok);
      setTimeout(function () { btn.textContent = 'Sao chép'; btn.classList.remove('is-done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
      done(ok);
    }
  });

  /* ---- Theme toggle ---- */
  (function themeToggle() {
    var nav = document.querySelector('.site-header-inner');
    if (!nav) return;
    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Đổi giao diện sáng/tối');
    var cur = document.documentElement.dataset.theme || '';
    var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = cur === 'dark' || (cur === '' && systemDark);
    btn.textContent = isDark ? '☀' : '☾';
    btn.addEventListener('click', function () {
      var d = document.documentElement;
      var nowDark = !(d.dataset.theme === 'dark' || (!d.dataset.theme && systemDark));
      d.dataset.theme = nowDark ? 'dark' : 'light';
      try { localStorage.setItem('iv-theme', d.dataset.theme); } catch (e) {}
      btn.textContent = nowDark ? '☀' : '☾';
    });
    nav.appendChild(btn);
  })();

  /* ---- Menu mobile: dùng <details> nên tắt JS vẫn mở được; JS chỉ thêm việc tự đóng ---- */
  var mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      /* nút bỏ đánh dấu cần bấm hai lần nên tự đóng menu sau khi thực hiện */
      if (e.target.closest('[data-action="reset-learned"]')) return;
      if (e.target.closest('.mm-panel a, .mm-panel button')) mobileMenu.open = false;
    });
    document.addEventListener('click', function (e) {
      if (mobileMenu.open && !mobileMenu.contains(e.target)) mobileMenu.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !mobileMenu.open) return;
      mobileMenu.open = false;
      mobileMenu.querySelector('summary').focus();
    });
  }

  /* ---- Mục lục nhỏ cho câu trả lời dài: dùng chung cho trang chủ đề và trình luyện tập.
     Nút thay vì link #id để không đụng tới permalink của câu hỏi. ---- */
  window.IVOutline = function (box) {
    var ans = box.querySelector('.qa-answer');
    if (!ans || ans.querySelector('.qa-outline')) return;
    var heads = ans.querySelectorAll('h5');
    if (heads.length < 3) return;
    var nav = document.createElement('nav');
    nav.className = 'qa-outline';
    nav.setAttribute('aria-label', 'Các phần của câu trả lời');
    [].forEach.call(heads, function (h) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = h.textContent;
      b.addEventListener('click', function () { h.scrollIntoView({ block: 'start' }); });
      nav.appendChild(b);
    });
    ans.insertBefore(nav, heads[0]);
  };

  var main = document.querySelector('.topic-page');
  if (!main) return;

  var root = document.documentElement;
  var topicId = main.getAttribute('data-topic');
  var articles = [].slice.call(document.querySelectorAll('.qa'));
  var sections = [].slice.call(document.querySelectorAll('.cat'));
  var learned = store.read();
  var current = null;     // câu đang mở (chỉ một câu tại một thời điểm)
  var hideLearned = false;

  function isLearned(a) { return a.classList.contains('is-learned'); }
  function isShown(a) { return a.style.display !== 'none'; }
  function shownArticles() { return articles.filter(isShown); }
  function numberOf(a) { return articles.indexOf(a) + 1; }

  /* ---- Nhớ câu đang đọc theo từng chủ đề ---- */
  var LAST_KEY = 'iv-last-question';
  function readLast() {
    try { return (JSON.parse(localStorage.getItem(LAST_KEY)) || {})[topicId] || null; } catch (e) { return null; }
  }
  function saveLast(id) {
    try {
      var v = JSON.parse(localStorage.getItem(LAST_KEY)) || {};
      v[topicId] = id;
      localStorage.setItem(LAST_KEY, JSON.stringify(v));
    } catch (e) {}
  }

  function forgetLast() {
    try {
      var v = JSON.parse(localStorage.getItem(LAST_KEY)) || {};
      delete v[topicId];
      localStorage.setItem(LAST_KEY, JSON.stringify(v));
    } catch (e) {}
  }

  /* ---- Mở/đóng câu hỏi ---- */
  function paintOpen(a, on) {
    a.classList.toggle('is-open', on);
    var t = a.querySelector('.qa-toggle');
    if (t) t.setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  /* opts.remember: lưu làm vị trí đọc; lần tự mở lúc tải trang thì không lưu */
  function openQuestion(a, opts) {
    opts = opts || {};
    if (current && current !== a) paintOpen(current, false);
    current = a;
    if (a) {
      paintOpen(a, true);
      window.IVOutline(a);
      if (opts.remember) {
        saveLast(a.id);
        removeResume();
        /* URL đang trỏ tới một câu thì đi theo câu đang đọc, nếu không tải lại sẽ về câu cũ */
        if (location.hash && location.hash.slice(1) !== a.id) history.replaceState(null, '', '#' + a.id);
      }
      if (opts.scroll) scrollToQuestion(a);
    }
    paintPosition();
  }

  /* Luôn cuộn tức thì: đóng câu cũ làm bố cục đổi, cuộn hoạt ảnh (html có smooth) bị ngắt giữa chừng và dừng sai chỗ */
  function scrollToQuestion(a) {
    pauseToolbar();
    if (root.classList.contains('is-focus')) window.scrollTo({ top: 0, behavior: 'instant' });
    else a.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  /* Câu đích đang bị lọc/ẩn thì gỡ bộ lọc, nếu không link sẽ không đưa tới đâu cả */
  function reveal(a) {
    if (isShown(a)) return;
    if (input) input.value = '';
    setHideLearned(false);
    applyVisibility();
  }

  function goTo(a, opts) {
    reveal(a);
    openQuestion(a, { remember: true, scroll: !(opts && opts.noScroll) });
  }

  /* Câu kế tiếp trong danh sách đang hiển thị; onlyNew: chỉ tính câu chưa đọc (vòng lại từ đầu) */
  function nextFrom(a, step, onlyNew) {
    var list = shownArticles();
    if (!list.length) return null;
    var i = list.indexOf(a);
    if (!onlyNew) {
      if (i === -1) return list[0];
      return list[i + step] || null;
    }
    for (var n = 1; n <= list.length; n++) {
      var c = list[(Math.max(i, 0) + n) % list.length];
      if (c !== a && !isLearned(c)) return c;
    }
    return null;
  }

  /* ---- Per-question: tiêu đề bấm được + đánh dấu đã đọc ---- */
  articles.forEach(function (art) {
    var btn = art.querySelector('.qa-learn');
    var q = art.querySelector('.qa-q');
    if (learned[art.id]) { art.classList.add('is-learned'); if (btn) btn.setAttribute('aria-pressed', 'true'); }
    if (btn) btn.addEventListener('click', function () {
      var on = store.toggle(art.id);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      art.classList.toggle('is-learned', on);
      updateProgress();
      if (window.IVAuth && window.IVAuth.pushProgress) window.IVAuth.pushProgress();
      var wasCurrent = art === current;
      var next = on && wasCurrent ? nextFrom(art, 1, true) : null;
      if (hideLearned) applyVisibility();
      if (next) openQuestion(next, { remember: true, scroll: true });
    });
    /* Bọc tiêu đề trong <button> để mở được bằng bàn phím mà vẫn giữ <h3> cho cấu trúc trang */
    if (q) {
      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'qa-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = q.textContent;
      q.textContent = '';
      q.appendChild(toggle);
      toggle.addEventListener('click', function () {
        if (art === current) {
          /* chế độ tập trung chỉ hiện câu đang mở: đóng nó là màn hình trống */
          if (root.classList.contains('is-focus')) return;
          paintOpen(art, false); current = null; paintPosition(); return;
        }
        openQuestion(art, { remember: true, scroll: true });
      });
    }
  });

  /* ---- Progress ring ---- */
  var ringFg = document.querySelector('.ring-fg');
  var progWrap = document.querySelector('.toc-progress');
  var progLabel = document.querySelector('.toc-progress-label');
  /* Tính năng của trang chủ đề trong menu mobile; cần JS nên mới dựng ở đây. Xử lý click dùng chung với toolbar qua data-action */
  var mmPage = document.querySelector('[data-mm-page]');
  if (mmPage) {
    mmPage.hidden = false;
    mmPage.innerHTML =
      '<p class="mm-title">Trang này</p>' +
      '<button type="button" class="mm-link" data-action="focus">🧘 Tập trung</button>' +
      '<a class="mm-link" href="../luyen-tap/?topic=' + encodeURIComponent(topicId) + '">🎯 Luyện tập chủ đề này</a>' +
      '<button type="button" class="mm-link" data-action="toggle-learned" hidden>Ẩn đã đọc</button>' +
      '<button type="button" class="mm-link" data-action="reset-learned">Bỏ đánh dấu tất cả</button>';
  }
  var hideBtns = [].slice.call(document.querySelectorAll('[data-action="toggle-learned"]'));
  function updateProgress() {
    if (!progWrap) return;
    var total = articles.length;
    var done = articles.filter(isLearned).length;
    progWrap.hidden = false;
    if (progLabel) progLabel.firstChild.textContent = String(done);
    if (ringFg) ringFg.style.strokeDashoffset = String(100.5 * (1 - done / total));
    hideBtns.forEach(function (b) { b.hidden = done === 0; });
    document.querySelectorAll('[data-action="reset-learned"]').forEach(function (b) {
      /* trong menu luôn hiện, chỉ làm mờ khi chưa có gì để bỏ: nút ẩn đi thì người dùng tưởng không có tính năng này */
      if (b.classList.contains('mm-link')) {
        b.disabled = done === 0;
        b.textContent = 'Bỏ đánh dấu tất cả (' + done + ' câu)';
      } else {
        b.hidden = done === 0;
      }
    });
  }

  /* ---- Bỏ đánh dấu cả chủ đề để đọc lại từ đầu. Nút ở mục lục và màn Tiến độ dùng chung ---- */
  var tocProgress = document.querySelector('.toc-progress');
  if (tocProgress) {
    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'link-reset';
    resetBtn.setAttribute('data-action', 'reset-learned');
    resetBtn.textContent = 'Bỏ đánh dấu tất cả';
    tocProgress.appendChild(resetBtn);
  }
  /* Xác nhận ngay trên nút, không dùng confirm(): trình duyệt nhúng có thể chặn hộp thoại và tự trả về huỷ */
  var armedReset = null, armedAt = 0, armTimer;
  function disarmReset() {
    clearTimeout(armTimer);
    if (!armedReset) return;
    armedReset.classList.remove('is-armed');
    armedReset.textContent = 'Bỏ đánh dấu tất cả';
    armedReset = null;
    updateProgress();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-action="reset-learned"]') : null;
    if (!b) { disarmReset(); return; }
    if (!window.IVAuth) return;
    if (armedReset !== b) {
      disarmReset();
      armedReset = b;
      armedAt = Date.now();
      b.classList.add('is-armed');
      b.textContent = 'Bấm lần nữa để bỏ ' + articles.filter(isLearned).length + ' câu (xoá cả lịch ôn)';
      armTimer = setTimeout(disarmReset, 5000);
      return;
    }
    /* cú bấm đúp vô tình không được tính là xác nhận */
    if (Date.now() - armedAt < 400) return;
    disarmReset();
    if (mobileMenu) mobileMenu.open = false;
    window.IVAuth.resetTopic(topicId);
    applyVisibility();
    forgetLast();
    removeResume();
    openQuestion(shownArticles()[0] || null);
    /* ở màn Tiến độ thì đứng yên để thấy lưới đã trống; ở danh sách thì về câu đầu */
    if (current && !main.classList.contains('is-graph-view')) scrollToQuestion(current);
    window.dispatchEvent(new Event('iv-progress'));
  });

  /* ---- Vị trí "Câu N/M": ở mục lục (desktop), toolbar (mobile) và thanh tập trung ---- */
  var posEls = [];
  function addPosition(parent) {
    var el = document.createElement('p');
    el.className = 'qa-position';
    parent.appendChild(el);
    posEls.push(el);
  }
  var tocInner = document.querySelector('.toc-progress');
  if (tocInner) addPosition(tocInner);
  var toolbarEl = document.querySelector('.toolbar');
  if (toolbarEl) addPosition(toolbarEl);

  var focusBar = document.createElement('div');
  focusBar.className = 'focus-bar';
  focusBar.innerHTML =
    '<span class="focus-bar-pos"></span>' +
    '<button type="button" class="btn-ghost" data-nav="-1">‹ Trước <kbd>K</kbd></button>' +
    '<button type="button" class="btn-ghost" data-nav="1">Sau › <kbd>J</kbd></button>' +
    '<button type="button" class="btn-ghost" data-focus-exit>Thoát <kbd>Esc</kbd></button>';
  main.insertBefore(focusBar, main.firstChild);
  addPosition(focusBar.querySelector('.focus-bar-pos'));

  function paintPosition() {
    var text = current ? 'Câu ' + numberOf(current) + '/' + articles.length : articles.length + ' câu';
    posEls.forEach(function (el) { el.textContent = text; });
  }

  /* ---- Nút "Đọc tiếp": không tự nhảy trang, để người đọc chủ động quay lại ---- */
  var resumeBtn = null;
  function removeResume() {
    if (resumeBtn) { resumeBtn.parentNode.removeChild(resumeBtn); resumeBtn = null; }
  }
  function showResume(a) {
    resumeBtn = document.createElement('button');
    resumeBtn.type = 'button';
    resumeBtn.className = 'qa-resume';
    var q = a.querySelector('.qa-q');
    resumeBtn.innerHTML = '<b></b><span></span>';
    resumeBtn.firstChild.textContent = 'Đọc tiếp câu ' + numberOf(a);
    resumeBtn.lastChild.textContent = q ? q.textContent : '';
    resumeBtn.addEventListener('click', function () { goTo(a); });
    sections[0].parentNode.insertBefore(resumeBtn, sections[0]);
  }

  /* ---- Toolbar: lọc + ẩn câu đã đọc tính chung một chỗ ---- */
  var input = document.querySelector('.filter-input');
  var emptyMsg = document.querySelector('.filter-empty');
  var t;
  function applyVisibility() {
    var term = input ? (input.value || '').trim().toLowerCase() : '';
    var anyVisible = false;
    /* đang lọc thì mở mọi câu khớp để thấy đoạn chứa từ khoá; xoá lọc thì về lại một câu */
    main.classList.toggle('is-filtering', !!term);
    articles.forEach(function (a) {
      var hit = (!term || a.textContent.toLowerCase().indexOf(term) !== -1) && !(hideLearned && isLearned(a));
      a.style.display = hit ? '' : 'none';
      if (hit) anyVisible = true;
    });
    sections.forEach(function (s) {
      var any = [].some.call(s.querySelectorAll('.qa'), isShown);
      s.style.display = any ? '' : 'none';
    });
    if (emptyMsg) emptyMsg.hidden = anyVisible || !term;
    /* câu đang mở vừa bị ẩn thì sang câu sau nó, không nhảy về đầu trang */
    var from = current ? articles.indexOf(current) : -1;
    if (current && !isShown(current)) openQuestion(null);
    if (!current && !term) {
      var unread = shownArticles().filter(function (a) { return !isLearned(a); });
      var first = unread.filter(function (a) { return articles.indexOf(a) > from; })[0] || unread[0];
      if (first) openQuestion(first);
    }
    /* chế độ tập trung luôn phải có một câu: đã đọc hết thì mở câu đầu, không còn câu nào để hiện thì tạm thoát (không đổi lựa chọn đã lưu) */
    if (!current && root.classList.contains('is-focus')) {
      var shown = shownArticles()[0];
      if (shown) openQuestion(shown);
      else root.classList.remove('is-focus');
    }
  }
  if (input) input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(applyVisibility, 140); });

  /* persist: chỉ lựa chọn của người dùng mới được lưu, link tới câu đang ẩn chỉ tắt tạm trong trang này */
  function setHideLearned(on, persist) {
    hideLearned = on;
    if (persist) {
      try { if (on) localStorage.setItem('iv-hide-learned', '1'); else localStorage.removeItem('iv-hide-learned'); } catch (e) {}
    }
    hideBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? 'Hiện đã đọc' : 'Ẩn đã đọc';
    });
  }
  hideBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      setHideLearned(!hideLearned, true);
      applyVisibility();
      updateProgress();
    });
  });

  /* ---- Đồng bộ từ tài khoản: cập nhật lại trạng thái "đã đọc", không tự chuyển câu ---- */
  window.addEventListener('iv-progress', function () {
    learned = store.read();
    articles.forEach(function (art) {
      var on = !!learned[art.id], btn = art.querySelector('.qa-learn');
      art.classList.toggle('is-learned', on);
      if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    updateProgress();
    if (hideLearned) applyVisibility();
  });

  /* ---- Điều hướng bằng #id: permalink, câu liên quan, mục lục, ô tiến độ ---- */
  function navigateTo(id, noScroll) {
    var el = id && document.getElementById(id);
    if (!el) return false;
    if (el.classList.contains('qa')) { goTo(el, { noScroll: noScroll }); return true; }
    if (el.classList.contains('cat')) {
      var inCat = [].slice.call(el.querySelectorAll('.qa'));
      var pick = inCat.filter(function (a) { return isShown(a) && !isLearned(a); })[0] || inCat.filter(isShown)[0];
      if (pick) openQuestion(pick, { remember: true });
      pauseToolbar();
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      return true;
    }
    return false;
  }
  window.addEventListener('hashchange', function () { navigateTo(location.hash.slice(1)); });
  /* Bấm lại đúng hash hiện tại không phát hashchange nên phải bắt cả click */
  main.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a && a.getAttribute('href').slice(1) === location.hash.slice(1)) navigateTo(location.hash.slice(1));
  });

  /* ---- Chế độ tập trung: chỉ còn một câu trên màn hình ---- */
  function setFocus(on, persist) {
    /* bộ lọc đang không khớp câu nào thì không có gì để tập trung vào */
    if (on && !current && !shownArticles().length) return;
    root.classList.toggle('is-focus', on);
    if (persist !== false) {
      try { if (on) localStorage.setItem('iv-focus', '1'); else localStorage.removeItem('iv-focus'); } catch (e) {}
    }
    if (on && !current) {
      var first = shownArticles()[0];
      if (first) openQuestion(first, { remember: true });
    }
    if (current) scrollToQuestion(current);
    else if (on) window.scrollTo({ top: 0, behavior: 'instant' });
  }
  /* topic-graph.js gọi khi chuyển sang Tiến độ: hai chế độ không dùng chung được, không đổi lựa chọn đã lưu */
  window.IVFocus = { exit: function () { root.classList.remove('is-focus'); } };
  document.querySelectorAll('[data-action="focus"]').forEach(function (b) {
    b.addEventListener('click', function () {
      /* menu mobile vẫn bấm được khi đang ở màn Tiến độ */
      var listBtn = document.querySelector('.vt-btn[data-view="list"]');
      if (main.classList.contains('is-graph-view') && listBtn) listBtn.click();
      setFocus(true);
    });
  });
  focusBar.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    if (b.hasAttribute('data-focus-exit')) setFocus(false);
    else step(+b.getAttribute('data-nav'));
  });

  function step(dir) {
    var n = nextFrom(current, dir, false);
    if (n) openQuestion(n, { remember: true, scroll: true });
    return n;
  }

  document.addEventListener('keydown', function (e) {
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.isComposing) return;
    if (main.classList.contains('is-graph-view')) return;
    if (e.code === 'KeyF') { e.preventDefault(); setFocus(!root.classList.contains('is-focus')); }
    else if (e.code === 'Escape' && root.classList.contains('is-focus')) setFocus(false);
    else if (e.code === 'KeyJ' || e.code === 'KeyK') {
      e.preventDefault();
      var n = step(e.code === 'KeyJ' ? 1 : -1);
      var tg = n && n.querySelector('.qa-toggle');
      if (tg) tg.focus({ preventScroll: true });
    }
  });

  /* ---- Toolbar nhường chỗ khi đọc: cuộn xuống thì ẩn, cuộn lên hoặc focus vào thì hiện ---- */
  var lastY = window.pageYOffset, pausedUntil = 0, ticking = false;
  /* Cuộn do code (mở câu, chuyển câu) không được làm toolbar hiện đè lên đầu câu */
  function pauseToolbar() {
    pausedUntil = Date.now() + 900;
    if (toolbarEl && toolbarEl.getBoundingClientRect().top <= 61) toolbarEl.classList.add('is-away');
  }
  if (toolbarEl) {
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = window.pageYOffset, d = y - lastY;
        var stuck = toolbarEl.getBoundingClientRect().top <= 61;
        if (Date.now() < pausedUntil) {
          if (d > 0 && stuck) toolbarEl.classList.add('is-away');
          lastY = y;
          return;
        }
        if (Math.abs(d) < 8) return;
        toolbarEl.classList.toggle('is-away', d > 0 && stuck && !toolbarEl.contains(document.activeElement));
        lastY = y;
      });
    }, { passive: true });
    toolbarEl.addEventListener('focusin', function () { toolbarEl.classList.remove('is-away'); });
  }

  /* ---- Khởi tạo: ưu tiên hash; chế độ tập trung thì về thẳng câu đang đọc dở ---- */
  updateProgress();
  var savedHide = false;
  try { savedHide = localStorage.getItem('iv-hide-learned') === '1'; } catch (e) {}
  if (savedHide) { setHideLearned(true); applyVisibility(); }
  var lastId = readLast();
  var lastArt = lastId ? document.getElementById(lastId) : null;
  if (lastArt && (!lastArt.classList.contains('qa') || isLearned(lastArt))) lastArt = null;
  if (!navigateTo(location.hash.slice(1), true)) {
    if (root.classList.contains('is-focus') && lastArt) openQuestion(lastArt);
    else {
      applyVisibility();
      if (lastArt && lastArt !== current && !root.classList.contains('is-focus')) showResume(lastArt);
    }
    if (root.classList.contains('is-focus') && !current) applyVisibility();
  }
  paintPosition();

  /* ---- TOC: active section highlight + mobile collapse ---- */
  var tocLinks = [].slice.call(document.querySelectorAll('.toc-list a'));
  if ('IntersectionObserver' in window && tocLinks.length) {
    var byId = {};
    tocLinks.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var link = byId[e.target.id];
        if (link && e.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-120px 0px -70% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  var toc = document.querySelector('.toc');
  if (toc && window.matchMedia('(max-width: 940px)').matches) {
    var title = toc.querySelector('.toc-title');
    if (title) {
      var tg = document.createElement('button');
      tg.className = 'toc-toggle'; tg.type = 'button';
      tg.textContent = 'Mục lục ▾';
      title.replaceWith(tg);
      toc.setAttribute('data-collapsed', '');
      tg.addEventListener('click', function () {
        var open = toc.hasAttribute('data-collapsed');
        if (open) toc.removeAttribute('data-collapsed'); else toc.setAttribute('data-collapsed', '');
        tg.textContent = 'Mục lục ' + (open ? '▴' : '▾');
      });
      toc.addEventListener('click', function (e) { if (e.target.tagName === 'A') toc.setAttribute('data-collapsed', ''); });
    }
  }
})();
