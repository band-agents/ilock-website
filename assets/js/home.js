/* Home page sections that render from the catalogue. */
(function () {
  'use strict';
  const { P, byId, GROUPS, fmt, esc, url, cardHTML } = window.ILOCK;
  const $ = s => document.querySelector(s);
  const inStock = P.filter(p => p.stock);
  const minOf = list => Math.min(...list.map(p => p.price));

  $('#factCount').textContent = P.length;

  // ---- hero slider ----
  const walls = [6516, 6531, 11384].map(id => byId[id]).filter(Boolean);
  const minis = inStock.filter(p => p.tags.includes('Mini Series'));
  const SLIDES = [
    { name: 'شواحن الحائط السريعة', price: 'من ' + fmt(minOf(walls)) + ' ج.م', href: 'shop.html#mobile' },
    { name: 'سلسلة ميني', price: 'من ' + fmt(minOf(minis)) + ' ج.م', href: 'shop.html#tag-mini' },
    { name: byId[3306].ar, price: fmt(byId[3306].price) + ' ج.م', href: url(byId[3306]) },
  ];
  const slides = [...document.querySelectorAll('#stage .slide')];
  const dots = $('#stage .dots');
  dots.innerHTML = slides.map((_, i) => `<button type="button" role="tab" aria-label="صورة ${i + 1}" aria-current="${i === 0}"></button>`).join('');
  let cur = 0, timer;
  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('on', k === cur));
    [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === cur));
    $('#tagName').textContent = SLIDES[cur].name;
    $('#tagPrice').textContent = SLIDES[cur].price;
    $('#tagcard').href = SLIDES[cur].href;
  }
  const play = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(cur + 1), 5000); };
  [...dots.children].forEach((d, i) => d.addEventListener('click', () => { show(i); play(); }));
  show(0); play();

  // ---- categories ----
  $('#cats').innerHTML = GROUPS.map((g, i) => `
    <a class="cat${i === 0 ? ' hl' : ''}" href="shop.html#${g.id}">
      <h3>${g.ar}</h3><small>${g.count} منتج</small>
      <img src="${g.img}" alt="" loading="lazy">
    </a>`).join('');

  // ---- best sellers ----
  const FEATURED = [6808, 6623, 6561, 6531, 4902, 3381, 3318, 3306, 3304, 3314];
  const TABS = [
    { id: 'all', ar: 'الكل' }, { id: 'strips', ar: 'مشتركات' }, { id: 'mobile', ar: 'شحن' },
    { id: 'extensions', ar: 'وصلات' }, { id: 'accessories', ar: 'إكسسوارات' },
  ];
  function best(tab) {
    const feat = FEATURED.map(id => byId[id]).filter(p => p && p.stock);
    let list = tab === 'all' ? feat : feat.filter(p => p.group === tab);
    const rest = inStock.filter(p => (tab === 'all' || p.group === tab) && !list.includes(p)).sort((a, b) => b.id - a.id);
    return list.concat(rest).slice(0, 8);
  }
  const tabs = $('#bestTabs');
  tabs.innerHTML = TABS.map((t, i) => `<button class="tab" type="button" role="tab" aria-selected="${i === 0}" data-tab="${t.id}">${t.ar}</button>`).join('');
  const renderBest = id => { $('#bestGrid').innerHTML = best(id).map(cardHTML).join(''); };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    tabs.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t === b));
    renderBest(b.dataset.tab);
  });
  renderBest('all');

  // ---- mini series ----
  $('#minis').innerHTML = [6808, 6773, 4914, 10750].map(id => byId[id]).filter(Boolean).map(p => `
    <a class="mini" href="${url(p)}"><img src="${p.imgs[0]}" alt="" loading="lazy"><div><b>${esc(p.ar)}</b><span>${p.max ? 'من ' : ''}${fmt(p.price)} ج.م</span></div></a>`).join('');

  // ---- watts band ----
  $('#watts').innerHTML = [[6516, '20W'], [11384, '65W'], [8429, '100W'], [6626, '240W']].map(([id, w]) => {
    const p = byId[id]; if (!p) return '';
    return `<a class="watt" href="${url(p)}"><span class="w">${w}</span><b>${esc(p.ar)}</b><span>${fmt(p.price)} ج.م</span></a>`;
  }).join('');

  // ---- sale ----
  $('#saleGrid').innerHTML = P.filter(p => p.sale && p.regular > p.price).sort((a, b) => b.stock - a.stock).slice(0, 4).map(cardHTML).join('');

  // ---- gulf ----
  $('#gulfRow').innerHTML = P.filter(p => p.group === 'gulf').slice(0, 5).map(p => `
    <a class="gp" href="${url(p)}"><img src="${p.imgs[0]}" alt="" loading="lazy"><b>${esc(p.ar)}</b><span>${fmt(p.price)} ج.م</span></a>`).join('');

  // ---- load calculator ----
  const ic = d => `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const APPS = [
    { id: 'phone', ar: 'شاحن موبايل', w: 20, heat: 0, i: ic('<rect x="10" y="4" width="12" height="24" rx="3"/><path d="M14 24h4"/>') },
    { id: 'laptop', ar: 'لابتوب', w: 65, heat: 0, i: ic('<rect x="6" y="7" width="20" height="13" rx="2"/><path d="M3 24h26"/>') },
    { id: 'tv', ar: 'تلفزيون', w: 120, heat: 0, i: ic('<rect x="4" y="6" width="24" height="15" rx="2"/><path d="M12 26h8M16 21v5"/>') },
    { id: 'router', ar: 'راوتر', w: 12, heat: 0, i: ic('<rect x="5" y="17" width="22" height="8" rx="2"/><path d="M10 17l-2-8M22 17l2-8M10 21h.01M14 21h.01"/>') },
    { id: 'console', ar: 'بلايستيشن', w: 200, heat: 0, i: ic('<path d="M9 11h14a5 5 0 015 5v2a4 4 0 01-7 2.6L19 19h-6l-2 1.6A4 4 0 014 18v-2a5 5 0 015-5z"/><path d="M10 14v4M8 16h4M21 15h.01M23 17h.01"/>') },
    { id: 'pc', ar: 'كمبيوتر مكتبي', w: 350, heat: 0, i: ic('<rect x="4" y="5" width="16" height="12" rx="2"/><path d="M9 22h6M12 17v5"/><rect x="23" y="7" width="6" height="18" rx="1.5"/>') },
    { id: 'fan', ar: 'مروحة', w: 60, heat: 0, i: ic('<circle cx="16" cy="13" r="8"/><circle cx="16" cy="13" r="1.5"/><path d="M16 21v6M11 27h10"/>') },
    { id: 'lamp', ar: 'إضاءة LED', w: 15, heat: 0, i: ic('<path d="M12 22h8M13 26h6M16 4a7 7 0 00-4 12.7V20h8v-3.3A7 7 0 0016 4z"/>') },
    { id: 'microwave', ar: 'ميكروويف', w: 1200, heat: 1, i: ic('<rect x="3" y="7" width="26" height="18" rx="2"/><rect x="6" y="10" width="15" height="12" rx="1"/><path d="M25 11v.01M25 15v.01"/>') },
    { id: 'hair', ar: 'سشوار', w: 1800, heat: 1, i: ic('<path d="M5 12a7 7 0 017-7h14v10H12a7 7 0 01-7-3z"/><path d="M14 15l-2 12h4l2-12"/>') },
    { id: 'iron', ar: 'مكواة', w: 2000, heat: 1, i: ic('<path d="M4 23h24l-2-8a8 8 0 00-8-6H9"/><path d="M4 23c0-5 3-8 8-8"/>') },
    { id: 'kettle', ar: 'غلاية', w: 2200, heat: 1, i: ic('<path d="M9 10h14l-1 16H10z"/><path d="M23 13h3a2 2 0 010 4h-3M12 10V7h8v3"/>') },
  ];
  const qty = {};
  $('#apps').innerHTML = APPS.map(a => `
    <div class="app" role="button" tabindex="0" aria-pressed="false" data-app="${a.id}">
      ${a.i}<b>${a.ar}</b><span class="ltr">~${a.w}W</span>
      <div class="ctrl"><em data-d="-1" aria-label="قلّل">−</em><i class="num" data-n>1</i><em data-d="1" aria-label="زوّد">+</em></div>
    </div>`).join('');
  $('#apps').addEventListener('click', e => {
    const card = e.target.closest('.app'); if (!card) return;
    const id = card.dataset.app;
    const d = e.target.closest('[data-d]');
    if (d) { qty[id] = Math.max(0, (qty[id] || 0) + +d.dataset.d); }
    else if (!qty[id]) qty[id] = 1;
    else if (!e.target.closest('.ctrl')) qty[id] = 0;
    card.setAttribute('aria-pressed', qty[id] > 0);
    card.querySelector('[data-n]').textContent = qty[id] || 1;
    calc();
  });
  $('#apps').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('app')) { e.preventDefault(); e.target.click(); } });

  const outlets = p => { const m = p.specs.join(' ').match(/(\d+)×/); return m ? +m[1] : 0; };
  function calc() {
    const chosen = APPS.filter(a => qty[a.id] > 0);
    const total = chosen.reduce((s, a) => s + a.w * qty[a.id], 0);
    const devices = chosen.reduce((s, a) => s + qty[a.id], 0);
    const heaters = chosen.filter(a => a.heat).reduce((s, a) => s + qty[a.id], 0);
    const LIMIT = 3500, ratio = total / LIMIT;
    $('#loadW').textContent = fmt(total);
    const g = $('#gauge');
    g.style.width = Math.min(100, ratio * 100) + '%';
    g.style.background = ratio > 1 ? '#FF7A68' : ratio > .7 ? '#FFC928' : '#3FBF7A';
    const v = $('#verdict');
    if (!devices) { v.className = 'verdict ok'; v.innerHTML = '<b>ابدأ باختيار الأجهزة</b>دوس على أي جهاز من القايمة.'; $('#recs').innerHTML = ''; return; }
    if (ratio > 1) { v.className = 'verdict bad'; v.innerHTML = `<b>الحمل أكبر من 3500 واط</b>وزّع الأجهزة على أكتر من مخرج في الحيطة. ${heaters ? 'ابدأ بالأجهزة الحرارية: كل واحد فيها يتوصّل لوحده.' : ''}`; }
    else if (ratio > .7 || heaters > 1) { v.className = 'verdict mid'; v.innerHTML = `<b>قريب من الحد، خلي بالك</b>${heaters > 1 ? 'عندك أكتر من جهاز حراري؛ متشغلهمش مع بعض في نفس الوقت.' : 'شغال، بس الأحسن متضيفش أجهزة كبيرة تانية.'}`; }
    else { v.className = 'verdict ok'; v.innerHTML = `<b>آمن</b>الحمل حوالي ${Math.round(ratio * 100)}% من قدرة مشترك 3500 واط.`; }
    const needUSB = qty.phone > 0;
    const recs = inStock.filter(p => p.group === 'strips' && outlets(p) >= devices)
      .sort((a, b) => (needUSB ? (b.tags.includes('with USB') - a.tags.includes('with USB')) : 0) || outlets(a) - outlets(b) || a.price - b.price)
      .slice(0, 2);
    $('#recs').innerHTML = recs.length
      ? '<span class="lbl" style="font-size:13px;color:#B4A99F;font-family:var(--display)">ترشيحنا لـ ' + devices + ' ' + (devices > 2 ? 'أجهزة' : 'جهاز') + '</span>' +
        recs.map(p => `<a class="rec" href="${url(p)}"><img src="${p.imgs[0]}" alt=""><b>${esc(p.ar)}</b><span>${fmt(p.price)} ج.م</span></a>`).join('')
      : '<span class="note" style="color:#CFC5BC">عدد الأجهزة أكبر من مخارج أي مشترك متوفر دلوقتي؛ قسّمهم على مشتركين.</span>';
  }
  // start with a realistic desk so the tool shows what it does
  ['laptop', 'phone', 'router', 'lamp'].forEach(id => { qty[id] = 1; const c = document.querySelector(`[data-app="${id}"]`); c.setAttribute('aria-pressed', 'true'); });
  calc();
})();
