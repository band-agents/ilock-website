/* Product page: product.html?id=<woo id> */
(function () {
  'use strict';
  const { P, byId, GROUPS, TAGS, CONTACT, fmt, esc, url, pct, cardHTML, platesHTML, addToCart } = window.ILOCK;
  const $ = s => document.querySelector(s);
  const id = +new URLSearchParams(location.search).get('id');
  const p = byId[id] || byId[12326];
  const g = GROUPS.find(x => x.id === p.group);

  document.title = p.ar + ' | iLOCK';
  document.querySelector('meta[name=description]').content = (p.bullets[0] || p.ar) + ' — ' + fmt(p.price) + ' ج.م';

  $('#crumbs').innerHTML = `<a href="index.html">الرئيسية</a><span aria-hidden="true">/</span><a href="shop.html#${g.id}">${g.ar}</a><span aria-hidden="true">/</span><span>${esc(p.ar)}</span>`;

  // spec rows derived from the name, labelled in Arabic
  const LABEL = [[/W$/, 'القدرة'], [/mAh$/, 'السعة'], [/×$/, 'عدد المخارج'], [/M$/, 'طول الكابل'], [/A$/, 'التيار'], [/K$/, 'لون الإضاءة'], [/^USB-C$/, 'منفذ'], [/^IP44$/, 'الحماية']];
  const rows = p.specs.map(s => [(LABEL.find(([r]) => r.test(s)) || [0, 'مواصفة'])[1], s]);
  rows.push(['القسم', g.ar]);
  p.tags.filter(t => TAGS[t]).forEach(t => rows.push(['النوع', TAGS[t]]));

  const save = pct(p);
  const priceBlock = `<div class="price">${p.max ? '<span class="from">يبدأ من</span>' : ''}<b>${fmt(p.price)}<small>ج.م</small></b>${save ? `<s>${fmt(p.regular)}</s><span class="save">وفّر ${fmt(p.regular - p.price)} ج.م</span>` : ''}</div>`;

  $('#pdp').innerHTML = `
    <div class="gallery">
      <div class="thumbs" role="tablist" aria-label="صور المنتج">${p.imgs.map((src, i) => `<button type="button" role="tab" aria-current="${i === 0}" data-img="${src}" aria-label="صورة ${i + 1}"><img src="${src}" alt=""></button>`).join('')}</div>
      <div class="mainimg" id="mainimg"><div class="badges">${save ? `<span class="badge sale">خصم ${save}%</span>` : ''}${p.stock ? '' : '<span class="badge out">نفد</span>'}</div><img id="big" src="${p.imgs[0]}" alt="${esc(p.ar)}"></div>
    </div>
    <div class="buy">
      <div style="display:grid;gap:8px">
        ${platesHTML(p, 4)}
        <h1>${esc(p.ar)}</h1>
        <div class="en">${esc(p.en)}</div>
      </div>
      ${priceBlock}
      <span class="stock ${p.stock ? '' : 'out'}">${p.stock ? 'متوفر ويتشحن' : 'غير متوفر حاليًا'}</span>
      ${p.max ? `<p class="note">السعر بيختلف حسب اللون أو الشكل (من ${fmt(p.price)} لحد ${fmt(p.max)} ج.م).</p>` : ''}
      <div class="buyrow">
        <div class="qty" aria-label="الكمية"><button type="button" id="qPlus" aria-label="زوّد">+</button><output id="qv">1</output><button type="button" id="qMinus" aria-label="قلّل">−</button></div>
        <button class="btn btn-y" type="button" id="addBtn" data-add="${p.id}" data-qty="1" ${p.stock ? '' : 'disabled'}>${p.stock ? 'أضف للسلة' : 'غير متوفر'}</button>
      </div>
      <a class="btn btn-line btn-block" href="${esc(p.url)}" target="_blank" rel="noopener">شوف المنتج على متجر iLOCK</a>
      ${p.bullets.length ? `<ul class="feats">${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      <div class="perks">
        <div class="perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke-linecap="round"/></svg><div><b>منتج iLOCK أصلي</b>من المتجر الرسمي مباشرة.</div></div>
        <div class="perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"/></svg><div><b>محتاج مساعدة في الاختيار؟</b><span class="ltr num">${CONTACT.phone}</span> · ${CONTACT.hours}</div></div>
      </div>
      <div class="acc">
        <details open><summary>المواصفات</summary><div class="in"><table class="spec-table"><tbody>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div></details>
        <details><summary>نصايح الاستخدام الآمن</summary><div class="in"><ul class="feats">
          <li>متشغلش أجهزة مجموع قدرتها أكبر من القدرة المكتوبة على المنتج.</li>
          <li>متوصلش مشترك في مشترك تاني.</li>
          <li>فك الكابل كله لو ملفوف قبل ما تشغل أجهزة قدرتها عالية.</li>
          <li>بعّد المنتج عن المية والأماكن الرطبة إلا لو مكتوب عليه غير كده.</li>
        </ul></div></details>
      </div>
    </div>`;

  // gallery
  const big = $('#big'), main = $('#mainimg');
  document.querySelector('.thumbs').addEventListener('click', e => {
    const b = e.target.closest('[data-img]'); if (!b) return;
    big.src = b.dataset.img;
    document.querySelectorAll('.thumbs button').forEach(x => x.setAttribute('aria-current', x === b));
  });
  main.addEventListener('mousemove', e => {
    const r = main.getBoundingClientRect();
    big.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });
  main.addEventListener('click', () => main.classList.toggle('zoom'));
  main.addEventListener('mouseleave', () => main.classList.remove('zoom'));

  // qty
  let q = 1;
  const setQ = n => { q = Math.max(1, Math.min(20, n)); $('#qv').textContent = q; $('#addBtn').dataset.qty = q; };
  $('#qPlus').addEventListener('click', () => setQ(q + 1));
  $('#qMinus').addEventListener('click', () => setQ(q - 1));

  // sticky buy bar on phones
  const sb = $('#stickyBuy');
  sb.innerHTML = `${priceBlock}<button class="btn btn-y" type="button" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'أضف للسلة' : 'غير متوفر'}</button>`;
  new IntersectionObserver(([en]) => sb.classList.toggle('on', !en.isIntersecting && en.boundingClientRect.top < 0)).observe($('#addBtn'));

  // related
  const rel = P.filter(x => x.group === p.group && x.id !== p.id).sort((a, b) => (b.stock - a.stock) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price)).slice(0, 4);
  $('#related').innerHTML = rel.map(cardHTML).join('');
})();
