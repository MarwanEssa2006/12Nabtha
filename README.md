# 12 Nabta — website

A bilingual (Arabic RTL / English LTR) website for **12 Nabta**, the handmade appliqué initiative in Hod 12, Alexandria.
Built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**.

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

### Type checking

```bash
npm run typecheck
```

## Project structure

```
app/
  layout.tsx            root layout, metadata, Alexandria & IBM Plex Sans Arabic fonts
  page.tsx              main entry route
  globals.css           Tailwind CSS v4 + design tokens + preserved component styles
components/             shared UI & orchestration (Navbar, Footer, ProductDetailModal, BackgroundStage, ResponsiveImage, TechniqueTags, NabtaPage)
sections/               page sections (Hero, Featured, Make, Story, Process, Impact, Gallery, Order)
context/                LanguageContext (Arabic RTL / English LTR state & helpers)
hooks/                  useReveal (IntersectionObserver scroll reveals)
lib/
  config.ts             contact details + order delivery settings        ← edit
  i18n.ts               interface text in Arabic and English              ← edit
  data.ts               products, categories, process, facts, gallery     ← edit
  images.ts             responsive WebP srcset helpers
types/
  nabta.ts              TypeScript domain types
public/assets/
  img/                  optimised WebP images (generated)
  brand/                logo, extracted to transparent PNG (white + green)
source-images/          original photos
scripts/
  build-images.mjs      rebuilds public/assets/ from source-images/ (needs `sharp`)
  shoot.mjs             visual QA screenshots with Playwright
docs/                   integrations, content checklist, future custom-preview plan
screenshots/            QA captures
```

## Editing content

- **Add a product.** Put the photo in `source-images/products/`, run `npm run images`, then add an entry to `products` in `lib/data.ts`. Copy an existing entry and keep the `{ en, ar }` pairs.
- **Show a category's products.** Set a product's `category` to `totes`, `laptop`, `makeup` or `custom`. Categories with no products show as "Photos coming soon" cards.
- **Change interface text.** Edit `lib/i18n.ts`.
- **Add contact details.** Edit `lib/config.ts`. Empty values are hidden. When a WhatsApp number is added, the order form shows a "Send on WhatsApp" button with the prepared message.

## Image pipeline

```bash
npm run images
```

The script writes product images at 480, 900 and 1300 px and workshop images at 640 and 1280 px, all as WebP, into `public/assets/img/`, along with background crops and transparent logo PNGs in `public/assets/brand/`.
