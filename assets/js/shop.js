/* Shop page: filters, sort, search, driven by #hash and ?q= */
(function () {
  'use strict';
  const { P, GROUPS, TAGS, cardHTML, searchProducts, esc } = window.ILOCK;
  const $ = s => document.querySelector(s);
  const HASH_TAG = { 'tag-mini': 'Mini Series', 'tag-usb': 'with USB', 'tag-schuko': 'Schuko Outlets', 'tag-universal': 'Universal Outlets', 'tag-heavy': 'Heavy Duity', 'tag-reels': 'Reels' };
  const state = { group: '', tags: new Set(), min: '', max: '', stock: true, sale: false, sort: 'rel', q: '' };

  function fromURL() {
    const h = decodeURIComponent(location.hash.slice(1));
    state.group = ''; state.tags.clear(); state.sale = false;
    if (GROUPS.some(g => g.id === h)) state.group = h;
    else if (HASH_TAG[h]) state.tags.add(HASH_TAG[h]);
    else if (h === 'sale') state.sale = true;
    state.q = new URLSearchParams(location.search).get('q') || '';
  }

  // filter UI
  $('#fGroups').innerHTML = `<label class="fopt"><input type="radio" name="g" value=""> كل الأقسام <small>${P.length}</small></label>` +
    GROUPS.map(g => `<label class="fopt"><input type="radio" name="g" value="${g.id}"> ${g.ar} <small>${g.count}</small></label>`).join('');
  $('#fTags').innerHTML = Object.entries(TAGS).map(([k, v]) => {
    const n = P.filter(p => p.tags.includes(k)).length;
    return `<label class="fopt"><input type="checkbox" value="${esc(k)}"> ${v} <small>${n}</small></label>`;
  }).join('');

  function syncUI() {
    document.querySelectorAll('#fGroups input').forEach(i => (i.checked = i.value === state.group));
    document.querySelectorAll('#fTags input').forEach(i => (i.checked = state.tags.has(i.value)));
    $('#fStock').checked = state.stock; $('#fSale').checked = state.sale;
    $('#sort').value = state.sort; $('#pmin').value = state.min; $('#pmax').value = state.max;
  }

  function apply() {
    let list = state.q ? searchProducts(state.q) : P.slice();
    list = list.filter(p =>
      (!state.group || p.group === state.group) &&
      [...state.tags].every(t => p.tags.includes(t)) &&
      (!state.stock || p.stock) &&
      (!state.sale || (p.sale && p.regular > p.price)) &&
      (state.min === '' || p.price >= +state.min) &&
      (state.max === '' || p.price <= +state.max));
    if (state.sort === 'asc') list.sort((a, b) => a.price - b.price);
    else if (state.sort === 'desc') list.sort((a, b) => b.price - a.price);
    else if (state.sort === 'new') list.sort((a, b) => b.id - a.id);
    else if (!state.q) list.sort((a, b) => (b.stock - a.stock) || (b.imgs.length - a.imgs.length) || (b.id - a.id));

    const g = GROUPS.find(x => x.id === state.group);
    const title = state.q ? `نتايج "${state.q}"` : g ? g.ar : state.sale ? 'العروض' : state.tags.size === 1 ? TAGS[[...state.tags][0]] : 'كل المنتجات';
    $('#title').textContent = title; $('#crumb').textContent = title;
    document.title = title + ' | iLOCK';
    if (g) $('#subtitle').textContent = g.sub + '. كل الأسعار بالجنيه المصري.';

    $('#count').innerHTML = `<b>${list.length}</b> منتج`;
    const chips = [];
    if (state.q) chips.push(['q', 'بحث: ' + state.q]);
    if (g) chips.push(['group', g.ar]);
    state.tags.forEach(t => chips.push(['tag:' + t, TAGS[t]]));
    if (state.sale) chips.push(['sale', 'العروض']);
    if (state.min !== '' || state.max !== '') chips.push(['price', `${state.min || 0} – ${state.max || '∞'} ج.م`]);
    $('#chips').innerHTML = chips.map(([k, v]) => `<button class="chip" type="button" data-chip="${esc(k)}">${esc(v)}</button>`).join('');

    $('#grid').innerHTML = list.length ? list.map(cardHTML).join('')
      : `<div class="empty"><b style="font-family:var(--display);font-size:20px;color:var(--ink)">مفيش منتجات بالفلاتر دي</b><p>جرّب تشيل فلتر أو اتنين، أو شيل "المتوفر بس".</p><button class="btn btn-y btn-sm" type="button" id="reset2">امسح الفلاتر</button></div>`;
  }

  function reset() { state.group = ''; state.tags.clear(); state.min = state.max = ''; state.stock = true; state.sale = false; state.q = ''; history.replaceState(null, '', 'shop.html'); syncUI(); apply(); }

  $('#filters').addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'g') { state.group = t.value; history.replaceState(null, '', 'shop.html' + (state.q ? '?q=' + encodeURIComponent(state.q) : '') + (t.value ? '#' + t.value : '')); }
    else if (t.closest('#fTags')) { t.checked ? state.tags.add(t.value) : state.tags.delete(t.value); }
    else if (t.id === 'fStock') state.stock = t.checked;
    else if (t.id === 'fSale') state.sale = t.checked;
    apply();
  });
  ['#pmin', '#pmax'].forEach(s => $(s).addEventListener('input', () => { state.min = $('#pmin').value; state.max = $('#pmax').value; apply(); }));
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; apply(); });
  $('#freset').addEventListener('click', reset);
  document.addEventListener('click', e => {
    if (e.target.id === 'reset2') reset();
    const c = e.target.closest('[data-chip]'); if (!c) return;
    const k = c.dataset.chip;
    if (k === 'q') { state.q = ''; history.replaceState(null, '', 'shop.html' + location.hash); }
    else if (k === 'group') state.group = '';
    else if (k === 'sale') state.sale = false;
    else if (k === 'price') state.min = state.max = '';
    else if (k.startsWith('tag:')) state.tags.delete(k.slice(4));
    syncUI(); apply();
  });
  const fl = $('#filters');
  $('#fopen').addEventListener('click', () => { fl.classList.add('open'); document.body.style.overflow = 'hidden'; });
  const closeF = () => { fl.classList.remove('open'); document.body.style.overflow = ''; };
  $('#fclose').addEventListener('click', closeF); $('#fapply').addEventListener('click', closeF);
  window.addEventListener('hashchange', () => { fromURL(); syncUI(); apply(); scrollTo({ top: 0 }); });

  fromURL(); syncUI(); apply();
})();
