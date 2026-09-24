# iLOCK — website revamp (proposal)

A static, Arabic-first (RTL) redesign of the iLOCK storefront, built by BAND as a proposal.

- `index.html` — homepage: hero, categories, best sellers, a load calculator ("المشترك بتاعك شايل كام واط؟"), Mini Series, charging, buying guide, sale, Gulf Edition, video, marketplaces, FAQ.
- `shop.html` — all products with category / type / price / stock / sale filters, sort and search. Deep links: `shop.html#strips`, `#mobile`, `#extensions`, `#lights`, `#accessories`, `#gulf`, `#sale`, `#tag-mini`, `#tag-schuko`, `#tag-universal`, `#tag-usb`, `shop.html?q=…`.
- `product.html?id=<id>` — gallery, spec plates, Arabic feature list, related products.
- `audit/` — the review of the current Odoo homepage (HTML + PDF).

The cart is a working demo (stored in the browser); checkout hands off to ilock.eg.

## Data

Products, prices, Arabic descriptions and photos come from the live iLOCK store (ilock.eg, WooCommerce Store API), captured 24 Sep 2026. Arabic product names are hand-written in `tools/build-data.cjs`.

```bash
node tools/build-data.cjs   # refresh assets/data/products.js and assets/p/
node tools/serve.cjs 5230   # preview on http://localhost:5230
```
