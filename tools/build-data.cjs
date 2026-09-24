// Pulls the live iLOCK catalogue (ilock.eg, WooCommerce Store API), downloads
// product images, and writes assets/data/products.js for the static site.
// Run: node tools/build-data.cjs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'assets', 'p');
const OUT = path.join(ROOT, 'assets', 'data', 'products.js');
const MAX_IMAGES = 4;

const AR = {
  12326: 'مشترك 9 مخارج شوكو · 1.5 متر',
  12269: 'مشترك 9 مخارج شوكو · 3 متر',
  11440: 'باور بانك لاسلكي مغناطيسي فائق النحافة',
  11384: 'شاحن حائط 65 واط GaN · ‏2 USB-C + USB-A',
  10967: 'شريط عازل بلية · 1.5 متر',
  10750: 'مشترك ميني يونيفرسال 3 مخارج بمفتاح',
  10745: 'مشترك يونيفرسال 3 مخارج + ‏2 USB-A',
  10740: 'مشترك يونيفرسال 3 مخارج + USB-C وUSB-A',
  10618: 'شريط LED صفين · 120 ليد/متر · 100 متر',
  10611: 'شريط LED ‏3 صفوف · 180 ليد/متر · 100 متر',
  10576: 'شريط LED ‏COB · 240 ليد/متر · 100 متر',
  9940: 'مشترك ميني 3 مخارج بمفتاح',
  9602: 'فيشة أنثى 10 أمبير',
  9335: 'محول سفر · فيشة خليجي',
  9210: 'مشترك ميني 3 مخارج · 2 شوكو + 1 يونيفرسال',
  9073: 'فيشة ذكر 10 أمبير',
  8832: 'مشترك يونيفرسال 3 مخارج + 4 USB',
  8429: 'كابل 100 واط USB-C · مضفر بمؤشر أخضر',
  8364: 'شريط LED ‏4000K · 5 متر · 240 ليد',
  7795: 'شريط LED ‏6500K · 5 متر · 240 ليد',
  7791: 'شريط LED ‏6500K · 5 متر · 120 ليد',
  7786: 'شريط LED ‏3000K · 5 متر · 120 ليد',
  7684: 'كابل 100 واط USB-C · بمؤشر LED',
  7352: 'باور سبلاي LED بريميوم 12 فولت',
  7323: 'شريط LED ‏3000K · 5 متر · 240 ليد',
  7056: 'مشترك خليجي 3 مخارج يونيفرسال · فيشة G',
  7048: 'مشترك خليجي 5 مخارج يونيفرسال · فيشة G',
  6959: 'شاحن ميني خليجي · USB-C + USB-A',
  6945: 'شاحن ميني برو خليجي · USB + مخارج',
  6927: 'مشترك ميني 3 اتجاهات · فيشة G خليجي',
  6827: 'شاحن ميني برو · ‏2 USB-A + مخرجين',
  6808: 'شاحن ميني برو · USB-C وUSB-A + مخرجين',
  6795: 'شاحن ميني · ‏2 USB-A',
  6773: 'شاحن ميني · USB-C وUSB-A',
  6687: 'محول سفر عالمي · أمريكي لبريطاني وأوروبي وأسترالي',
  6671: 'كابل USB-A إلى Type-C',
  6657: 'كابل USB-A إلى آيفون',
  6637: 'كابل USB-A إلى Micro USB',
  6626: 'كابل 240 واط PD · USB-C مضفر',
  6623: 'كابل 30 واط · USB-C إلى آيفون مضفر',
  6606: 'كابل 65 واط · USB-C مضفر',
  6561: 'باور بانك 10,000 مللي أمبير · 4 منافذ',
  6551: 'شاحن عربية 60 واط · USB-C + USB-A',
  6539: 'شاحن عربية 30 واط · Quick Charge 3.0',
  6531: 'شاحن حائط 30 واط · USB-A + USB-C',
  6516: 'شاحن حائط 20 واط · USB-A + USB-C',
  5852: 'مشترك بيسك 3 مخارج · 3 متر',
  5840: 'مشترك بيسك 3 مخارج · 1.5 متر',
  5835: 'مشترك بيسك 5 مخارج · 1.5 متر',
  5821: 'مشترك بيسك 5 مخارج · 3 متر',
  4943: 'مشترك بيسك 3 مخارج يونيفرسال',
  4914: 'مشترك ميني 3 مخارج · 1.5 متر',
  4902: 'مشترك ميني 3 مخارج · 3 متر',
  4744: 'مشترك بيسك 5 مخارج يونيفرسال',
  4721: 'شريط عازل · 30 متر',
  4562: 'مشابك تنظيم كابلات · 3 قطع',
  4557: 'مشابك كابلات دائرية · 6 قطع',
  4544: 'وصلة كهرباء · 3 متر',
  4351: 'محول فيشة سفر · 3 قطع',
  4034: 'بكرة معدن 4 مخارج شوكو · 50 متر',
  4032: 'فيشة أنثى 16 أمبير',
  3923: 'مشترك 5 مخارج + 2 USB بغطاء سيليكون',
  3920: 'مشترك ألومنيوم بريميوم 6 مخارج',
  3916: 'مشترك ألومنيوم بريميوم 4 مخارج',
  3565: 'مشترك 3 مخارج + 2 USB معتمد',
  3562: 'مشترك بريميوم 5 مخارج · كابل 5 متر',
  3557: 'مشترك 9 مخارج بمفتاح',
  3552: 'مشترك 6 مخارج بمفتاح',
  3547: 'مشترك 5 مخارج بمفتاح',
  3539: 'مشترك 3 مخارج بمفتاح',
  3386: 'مشترك احترافي 4 مخارج · فيشة IP44',
  3381: 'مشترك 4 مخارج · 2 شوكو + 2 يونيفرسال',
  3376: 'مشترك 3 مخارج يونيفرسال بحماية زيادة الحمل',
  3344: 'بكرة 4 مخارج · 25 متر',
  3339: 'بكرة 4 مخارج · 50 متر',
  3337: 'وصلة 40 متر بمخرج قفل',
  3335: 'وصلة كهرباء · 20 متر',
  3322: 'وصلة كهرباء · 15 متر',
  3320: 'وصلة كهرباء · 10 متر',
  3318: 'وصلة كهرباء · 5 متر',
  3316: 'شريط عازل · 10 متر',
  3314: 'شريط عازل · 20 متر',
  3306: 'محول فيشة سفر',
  3304: 'فيشة أنثى 16 أمبير بقفل',
  3298: 'فيشة ذكر باور 16 أمبير',
  375: 'مشترك 5 مخارج يونيفرسال بحماية زيادة الحمل',
  362: 'مشترك حائط 3 اتجاهات',
};

// Woo category -> site group (one group per product, first match wins)
const GROUPS = [
  ['gulf', ['Gulf Edition']],
  ['mobile', ['Mobile Accessories']],
  ['lights', ['Lights']],
  ['extensions', ['Extensions', 'Reels', 'Cables']],
  ['strips', ['Power Strips', 'Heavy Duity', 'Schuko Outlets', 'Universal Outlets', 'Mini Series', 'with USB']],
  ['accessories', ['Accessories', 'Plugs', 'Adapters', 'PVC Tape']],
];

const decode = s => s
  .replace(/&#8211;/g, '–').replace(/&#038;|&amp;/g, '&').replace(/&#8217;/g, '’')
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#[0-9]+;/g, '');

function specs(name) {
  const n = decode(name);
  const out = [];
  const w = n.match(/(\d{2,4})\s?(?:W\b|Watt|w\b)/i); if (w) out.push(w[1] + 'W');
  const mah = n.match(/([\d,]+)\s?mAh/i); if (mah) out.push(mah[1] + ' mAh');
  const o = n.match(/(\d+)\s*(?:Universal\s|Schuko\s)?(?:outlets|Outlets|Sockets)/); if (o) out.push(o[1] + '×');
  const m = n.match(/(\d+(?:\.\d+)?)\s?(?:m\b|M\b|Meters|meters)/); if (m) out.push(m[1] + 'M');
  const a = n.match(/(\d{2})A\b/); if (a) out.push(a[1] + 'A');
  const k = n.match(/(\d{4})K\b/); if (k) out.push(k[1] + 'K');
  if (/USB-C|Type-C/i.test(n)) out.push('USB-C');
  if (/IP44/.test(n)) out.push('IP44');
  if (/GaN/.test(n) || /65W/.test(n)) {}
  return [...new Set(out)].slice(0, 4);
}

function bullets(html) {
  return decode(html)
    .split(/<\/p>|<br\s*\/?>|\n/)
    .map(s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter(s => s.length > 8)
    .slice(0, 8);
}

function pickSrc(img) {
  const m = (img.srcset || '').match(/(\S+)\s+600w/);
  return m ? m[1] : img.src;
}

async function download(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return true;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
      return true;
    } catch (e) { await new Promise(r => setTimeout(r, 800)); }
  }
  console.warn('failed', url);
  return false;
}

(async () => {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const res = await fetch('https://ilock.eg/wp-json/wc/store/v1/products?per_page=100');
  const all = await res.json();
  const cats = {};
  const products = [];
  for (const p of all) {
    let wc = p.categories.map(c => decode(c.name));
    if (!wc.length) wc = ['Mobile Accessories'];
    const group = (GROUPS.find(([, list]) => wc.some(c => list.includes(c))) || ['accessories'])[0];
    const imgs = [];
    for (const [i, img] of p.images.slice(0, MAX_IMAGES).entries()) {
      const src = pickSrc(img);
      const ext = (src.match(/\.(jpe?g|png|webp)$/i) || ['', 'jpg'])[1].toLowerCase();
      const rel = `assets/p/${p.id}-${i}.${ext}`;
      if (await download(src, path.join(ROOT, rel))) imgs.push(rel);
    }
    const range = p.prices.price_range;
    const item = {
      id: p.id,
      ar: AR[p.id] || decode(p.name),
      en: decode(p.name),
      group,
      tags: wc,
      price: +(range ? range.min_amount : p.prices.price),
      max: range ? +range.max_amount : null,
      regular: +p.prices.regular_price,
      sale: !!p.on_sale,
      stock: !!p.is_in_stock,
      specs: specs(p.name),
      bullets: bullets(p.short_description),
      imgs,
      url: p.permalink,
    };
    products.push(item);
    wc.forEach(c => (cats[c] = (cats[c] || 0) + 1));
    process.stdout.write('.');
  }
  fs.writeFileSync(OUT,
    '// Generated by tools/build-data.cjs from ilock.eg — do not edit by hand.\n' +
    'window.ILOCK_PRODUCTS = ' + JSON.stringify(products) + ';\n');
  console.log('\n', products.length, 'products', Object.entries(cats).map(([k, v]) => k + ':' + v).join(' '));
  console.log('groups', GROUPS.map(([g]) => g + ':' + products.filter(p => p.group === g).length).join(' '));
  console.log('no-ar', products.filter(p => !AR[p.id]).map(p => p.id).join(','));
  console.log('no-img', products.filter(p => !p.imgs.length).map(p => p.id).join(','));
})();
