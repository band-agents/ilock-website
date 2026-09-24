/* iLOCK revamp — shared chrome: header, footer, cart, search, product cards. */
(function () {
  'use strict';
  const P = window.ILOCK_PRODUCTS || [];
  const byId = Object.fromEntries(P.map(p => [p.id, p]));

  // ---------- icons ----------
  const I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1.2 12.2a1 1 0 01-1 .8H7.2a1 1 0 01-1-.8z"/><path d="M9 8V6.5a3 3 0 016 0V8"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 5h5v5M19 5l-8 8M10 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke-linecap="round"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16"/><path d="M9 20v-6h6v6"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.5-3h-3V8.7c0-.9.3-1.5 1.6-1.5h1.6V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.1H8v3h2.5V21z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z"/></svg>',
  };

  const GROUPS = [
    { id: 'strips', ar: 'المشتركات', sub: 'شوكو، يونيفرسال، ميني، بمنافذ USB', pid: 12326 },
    { id: 'mobile', ar: 'الشحن والموبايل', sub: 'شواحن، كابلات، باور بانك', pid: 6561 },
    { id: 'extensions', ar: 'الوصلات والبكرات', sub: 'من 3 لحد 50 متر', pid: 3344 },
    { id: 'lights', ar: 'الإضاءة', sub: 'شرائط LED وباور سبلاي', pid: 10576 },
    { id: 'accessories', ar: 'الإكسسوارات', sub: 'فيش، محولات، شريط عازل', pid: 3304 },
    { id: 'gulf', ar: 'إصدار الخليج', sub: 'فيشة G للسعودية والخليج', pid: 7048 },
  ];
  GROUPS.forEach(g => { g.count = P.filter(p => p.group === g.id).length; g.img = byId[g.pid] ? byId[g.pid].imgs[0] : ''; });

  const TAGS = {
    'Mini Series': 'سلسلة ميني', 'with USB': 'بمنافذ USB', 'Schuko Outlets': 'مخارج شوكو',
    'Universal Outlets': 'مخارج يونيفرسال', 'Heavy Duity': 'للاستخدام الشاق', 'Reels': 'بكرات',
    'Plugs': 'فيش', 'Adapters': 'محولات', 'PVC Tape': 'شريط عازل', 'Cables': 'كابلات',
  };

  const CONTACT = {
    phone: '+20 1555 593 739', tel: '+201555593739', mail: 'info@ilock.eg',
    hours: 'كل يوم · 9 الصبح لـ 7 بالليل',
    fb: 'https://www.facebook.com/iLock.eg', ig: 'https://www.instagram.com/ilock.eg/',
    yt: 'https://www.youtube.com/watch?v=NHx9W53ZcGY',
  };

  const fmt = n => Number(n).toLocaleString('en-US');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const url = p => 'product.html?id=' + p.id;
  const pct = p => p.sale && p.regular > p.price ? Math.round((1 - p.price / p.regular) * 100) : 0;

  function priceHTML(p) {
    const from = p.max ? '<span class="from">يبدأ من</span>' : '';
    const old = p.sale && p.regular > p.price ? `<s>${fmt(p.regular)}</s>` : '';
    return `<div class="price">${from}<b>${fmt(p.price)}<small>ج.م</small></b>${old}</div>`;
  }
  function platesHTML(p, n) {
    return p.specs.length ? `<div class="plates">${p.specs.slice(0, n || 3).map(s => `<span class="plate">${esc(s)}</span>`).join('')}</div>` : '';
  }
  function cardHTML(p) {
    const b = [];
    if (pct(p)) b.push(`<span class="badge sale">خصم ${pct(p)}%</span>`);
    if (!p.stock) b.push('<span class="badge out">نفد</span>');
    else if (p.id > 10000 && !pct(p)) b.push('<span class="badge new">جديد</span>');
    const alt = p.imgs[1] ? `<img class="alt" src="${p.imgs[1]}" alt="" loading="lazy">` : '';
    return `<article class="card">
      <a class="ph" href="${url(p)}" aria-label="${esc(p.ar)}">
        <div class="badges">${b.join('')}</div>
        <img class="main" src="${p.imgs[0]}" alt="${esc(p.ar)}" loading="lazy" width="600" height="600">${alt}
      </a>
      <div class="body">
        ${platesHTML(p)}
        <h3><a href="${url(p)}">${esc(p.ar)}</a></h3>
        ${priceHTML(p)}
        <span class="stock ${p.stock ? '' : 'out'}">${p.stock ? 'متوفر' : 'غير متوفر حاليًا'}</span>
        <button class="add" type="button" data-add="${p.id}" ${p.stock ? '' : 'disabled'} aria-label="أضف ${esc(p.ar)} للسلة">${I.plus}</button>
      </div>
    </article>`;
  }

  // ---------- cart ----------
  const KEY = 'ilock-cart-v1';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || '[]').filter(l => byId[l.id]); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} renderCart(); };
  function addToCart(id, q) {
    const p = byId[id]; if (!p || !p.stock) return;
    const l = cart.find(x => x.id === id);
    if (l) l.q += q || 1; else cart.push({ id, q: q || 1 });
    save(); toast(`<span>اتضاف للسلة: <b>${esc(p.ar)}</b></span><button type="button" data-open-cart>السلة</button>`);
  }
  function renderCart() {
    const n = cart.reduce((a, l) => a + l.q, 0);
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = n; el.dataset.n = n; });
    const body = document.getElementById('cartBody'); if (!body) return;
    const total = cart.reduce((a, l) => a + byId[l.id].price * l.q, 0);
    body.innerHTML = cart.length ? cart.map(l => {
      const p = byId[l.id];
      return `<div class="cline"><img src="${p.imgs[0]}" alt="">
        <div><h4><a href="${url(p)}">${esc(p.ar)}</a></h4>
          <div class="row"><div class="qty"><button type="button" data-q="${p.id}" data-d="1" aria-label="زوّد">+</button><output>${l.q}</output><button type="button" data-q="${p.id}" data-d="-1" aria-label="قلّل">−</button></div>
          <b class="num">${fmt(p.price * l.q)} ج.م</b></div>
          <button class="rm" type="button" data-rm="${p.id}">شيل من السلة</button></div></div>`;
    }).join('') : `<div class="cart-empty">${I.bag}<p>السلة فاضية لسه.</p><a class="btn btn-y btn-sm" href="shop.html">ابدأ التسوق</a></div>`;
    document.getElementById('cartTotal').textContent = fmt(total) + ' ج.م';
    document.getElementById('cartFoot').hidden = !cart.length;
  }

  // ---------- toast ----------
  let tt;
  function toast(html) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = html; t.classList.add('on');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 3200);
  }

  // ---------- drawers ----------
  function openDrawer(id) {
    const d = document.getElementById(id); if (!d) return;
    d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    const f = d.querySelector('button,a'); f && f.focus();
  }
  function closeDrawers() {
    document.querySelectorAll('.drawer.open').forEach(d => { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); });
    document.querySelector('.sov')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---------- search ----------
  const norm = s => s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ً-ْ]/g, '');
  function searchProducts(q) {
    const t = norm(q.trim()); if (!t) return [];
    const words = t.split(/\s+/);
    return P.map(p => {
      const hay = norm(p.ar + ' ' + p.en + ' ' + p.specs.join(' ') + ' ' + p.tags.join(' '));
      const score = words.reduce((a, w) => a + (hay.includes(w) ? 1 : 0), 0);
      return { p, score: score + (p.stock ? .1 : 0) };
    }).filter(x => x.score >= words.length).sort((a, b) => b.score - a.score).map(x => x.p);
  }
  function renderSearch(q) {
    const box = document.getElementById('sres');
    const r = searchProducts(q);
    if (!q.trim()) {
      box.innerHTML = `<div class="shint">جرّب: ${['مشترك 9 مخارج', 'شاحن 65', 'وصلة 10 متر', 'LED', 'محول سفر', 'باور بانك'].map(s => `<button type="button" data-sq="${s}">${s}</button>`).join('')}</div>`;
      return;
    }
    box.innerHTML = r.length ? r.slice(0, 8).map(p => `<a class="sres" href="${url(p)}"><img src="${p.imgs[0]}" alt=""><div><b>${esc(p.ar)}</b><small>${esc(p.en)}</small></div><span>${fmt(p.price)} ج.م</span></a>`).join('') +
      (r.length > 8 ? `<a class="shint" href="shop.html?q=${encodeURIComponent(q)}">شوف كل النتايج (${r.length}) ←</a>` : '')
      : `<div class="shint">مفيش نتايج لـ "${esc(q)}". جرّب كلمة تانية.</div>`;
  }

  // ---------- chrome ----------
  const page = document.body.dataset.page || '';
  function header() {
    const links = GROUPS.map(g => `<a href="shop.html#${g.id}">${g.ar}</a>`).join('');
    return `
    <div class="topbar"><div class="wrap">
      <div class="tick"><span>متاح كمان على أمازون ونون وجوميا وB.TECH</span><span>خدمة العملاء ${CONTACT.hours}</span></div>
      <div class="side"><a href="tel:${CONTACT.tel}" class="ltr">${CONTACT.phone}</a></div>
    </div></div>
    <header class="hdr"><div class="wrap">
      <button class="icon-btn burger" type="button" data-open="menu" aria-label="القائمة">${I.menu}</button>
      <a class="logo" href="index.html" aria-label="iLOCK الرئيسية"><img src="assets/img/logo.webp" alt="iLOCK" width="75" height="30"></a>
      <nav class="nav" aria-label="الأقسام">${links}</nav>
      <div class="tools">
        <button class="search-pill" type="button" data-open-search aria-label="بحث">${I.search}<span>دوّر على منتج…</span><kbd>/</kbd></button>
        <button class="icon-btn" type="button" data-open="cart" aria-label="السلة">${I.bag}<span class="cart-count" data-n="0">0</span></button>
      </div>
    </div></header>`;
  }
  function drawers() {
    return `
    <div class="drawer" id="menu" aria-hidden="true" role="dialog" aria-label="القائمة"><div class="scrim" data-close></div><div class="panel">
      <div class="ph"><img src="assets/img/logo.webp" alt="iLOCK" style="height:26px"><button class="icon-btn" type="button" data-close aria-label="قفل">${I.close}</button></div>
      <div class="pb"><nav class="mnav">
        <a href="index.html">الرئيسية</a>
        <a href="shop.html">كل المنتجات <small>${P.length}</small></a>
        ${GROUPS.map(g => `<a href="shop.html#${g.id}">${g.ar} <small>${g.count}</small></a>`).join('')}
        <a href="shop.html#sale">العروض</a>
        <a href="index.html#calc">احسب حمل المشترك</a>
      </nav></div>
      <div class="pf"><a class="btn btn-ink" href="tel:${CONTACT.tel}">${I.phone}<span class="ltr">${CONTACT.phone}</span></a><p class="note">${CONTACT.hours}</p></div>
    </div></div>
    <div class="drawer left" id="cart" aria-hidden="true" role="dialog" aria-label="السلة"><div class="scrim" data-close></div><div class="panel">
      <div class="ph"><h2>سلة المشتريات</h2><button class="icon-btn" type="button" data-close aria-label="قفل">${I.close}</button></div>
      <div class="pb" id="cartBody"></div>
      <div class="pf" id="cartFoot">
        <div class="sum"><span>الإجمالي</span><b id="cartTotal">0</b></div>
        <a class="btn btn-y btn-block" href="https://ilock.eg/shop/" target="_blank" rel="noopener">كمّل الطلب</a>
        <p class="note">دي نسخة تصميم مقترحة؛ السلة هنا للتجربة، والطلب الحقيقي بيكمل على متجر iLOCK.</p>
      </div>
    </div></div>
    <div class="sov" role="dialog" aria-label="بحث"><div class="sbox">
      <div class="in">${I.search}<input id="sq" type="search" placeholder="دوّر على مشترك، شاحن، وصلة…" autocomplete="off" aria-label="كلمة البحث"><button class="icon-btn" type="button" data-close aria-label="قفل">${I.close}</button></div>
      <div class="res" id="sres"></div>
    </div></div>`;
  }
  function footer() {
    return `
    <footer class="ftr"><div class="stripe" aria-hidden="true"></div><div class="wrap">
      <div class="top">
        <div class="brand"><img src="assets/img/logo.webp" alt="iLOCK" style="filter:invert(1)">
          <p>iLOCK بتقدّم جيل جديد من وصلات الأمان الكهربائية، متصممة عشان تحمي الناس والأجهزة من مخاطر الكهربا اللي بتحصل كل يوم.</p>
          <div class="soc"><a href="${CONTACT.fb}" target="_blank" rel="noopener" aria-label="فيسبوك">${I.fb}</a><a href="${CONTACT.ig}" target="_blank" rel="noopener" aria-label="إنستجرام">${I.ig}</a><a href="${CONTACT.yt}" target="_blank" rel="noopener" aria-label="يوتيوب">${I.yt}</a></div>
        </div>
        <div><h4>تسوق</h4><ul>${GROUPS.map(g => `<li><a href="shop.html#${g.id}">${g.ar}</a></li>`).join('')}<li><a href="shop.html#sale">العروض</a></li></ul></div>
        <div><h4>مساعدة</h4><ul><li><a href="index.html#calc">احسب حمل المشترك</a></li><li><a href="index.html#guide">شوكو ولا يونيفرسال؟</a></li><li><a href="index.html#faq">أسئلة شائعة</a></li><li><a href="https://ilock.eg/contact-us/" target="_blank" rel="noopener">تواصل معانا</a></li></ul></div>
        <div><h4>كلمنا</h4><ul>
          <li><a href="tel:${CONTACT.tel}" class="ltr num">${CONTACT.phone}</a></li>
          <li><a href="mailto:${CONTACT.mail}" class="ltr">${CONTACT.mail}</a></li>
          <li>${CONTACT.hours}</li></ul></div>
      </div>
      <div class="bottom"><span>© 2026 iLOCK · كل الحقوق محفوظة</span><span>نسخة تصميم مقترحة · الأسعار من ilock.eg يوم 24 سبتمبر 2026</span></div>
    </div></footer>`;
  }

  function mount() {
    const h = document.getElementById('site-header');
    if (h) h.outerHTML = header();
    const f = document.getElementById('site-footer');
    if (f) f.outerHTML = footer();
    document.body.insertAdjacentHTML('beforeend', drawers());
    if (page) document.querySelectorAll('.nav a').forEach(a => { if (location.hash && a.getAttribute('href').endsWith(location.hash)) a.setAttribute('aria-current', 'page'); });
    renderCart();
    renderSearch('');

    document.addEventListener('click', e => {
      const t = e.target.closest('[data-add],[data-open],[data-open-cart],[data-close],[data-open-search],[data-q],[data-rm],[data-sq]');
      if (!t) return;
      if (t.dataset.add) { addToCart(+t.dataset.add, +(t.dataset.qty || 1)); }
      else if (t.dataset.open) { openDrawer(t.dataset.open); }
      else if ('openCart' in t.dataset) { closeDrawers(); openDrawer('cart'); }
      else if ('close' in t.dataset) { closeDrawers(); }
      else if ('openSearch' in t.dataset) { openSearch(); }
      else if (t.dataset.q) { const l = cart.find(x => x.id === +t.dataset.q); l.q += +t.dataset.d; if (l.q < 1) cart = cart.filter(x => x !== l); save(); }
      else if (t.dataset.rm) { cart = cart.filter(x => x.id !== +t.dataset.rm); save(); }
      else if (t.dataset.sq) { const i = document.getElementById('sq'); i.value = t.dataset.sq; renderSearch(i.value); i.focus(); }
    });
    document.querySelector('.sov').addEventListener('click', e => { if (e.target.classList.contains('sov')) closeDrawers(); });
    document.getElementById('sq').addEventListener('input', e => renderSearch(e.target.value));
    document.getElementById('sq').addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.value.trim()) location.href = 'shop.html?q=' + encodeURIComponent(e.target.value.trim());
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawers();
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
    });
    window.addEventListener('storage', e => { if (e.key === KEY) { try { cart = JSON.parse(e.newValue || '[]'); } catch (x) {} renderCart(); } });
  }
  function openSearch() {
    const o = document.querySelector('.sov'); o.classList.add('open'); document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('sq').focus(), 30);
  }

  window.ILOCK = { P, byId, GROUPS, TAGS, CONTACT, I, fmt, esc, url, pct, cardHTML, priceHTML, platesHTML, addToCart, toast, searchProducts, norm };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
