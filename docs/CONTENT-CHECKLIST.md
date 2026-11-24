# Content to confirm before publishing

Nothing below was invented. Every fact came from the photos or from the internal document "أسئلة نموذج منحة 12 نبتة وإجاباتها" (August 2026).
That document is a grant application, so the team should approve what becomes public.

## 1. Product photos
Eight product photos were supplied with file names starting `Gemini_Generated_Image_…`:
painted-daisy, red-sun-rays, cactus, red-flower-in-hand, red-flower-flat, twin-alliums, little-house, denim-turtle.
(The tic-tac-toe photo was named `222.jpg` and is not affected.)
**Confirm these are real photos of real products, only edited.** If any were generated, replace it with the original photo.
Each product in `js/data.js` carries an `imageNote` field for this.

## 2. Product facts still missing (shown as "Price on request / ask us")
For every product: size, price, exact fabric, lining, zip type, availability, and whether each design is one of a kind.
Product names are descriptive working names that I wrote from what the photos show. Rename them freely.

## 3. Grant facts used on the site (`confirm: true` in `js/data.js`)
- Location: Hod 12, Montaza 2, Alexandria.
- First workshop: 5 sessions, 5 women, each finished an appliqué prototype.
- 450 pencil cases in one week for Life Makers Association, Alexandria (4 women).
- 250 pencil cases for the closing event of the British Council's IYE programme (six women and one man).
- Next phase: training 10 women over six months, then paid orders. Part of the revenue is reinvested.
- Partners: the Dei initiative (literacy) and Life Makers Association (venue).
Before naming the British Council and Life Makers publicly, check that they are happy to be named.

## 4. Left out on purpose
- "about 11 orders: 7 individuals and 5 organisations". The numbers don't add up (7 + 5 = 12). Add the figure once confirmed.
- Budget, equipment prices, the target age range of participants, and anything about disability accommodations (internal plan, not public copy).
- Caftans (قفاطين) are mentioned in the document but not in the website brief. Add a category if wanted.
- Testimonials. None were supplied, and none were written.

## 5. Contact details
WhatsApp, phone, email and social links are all empty in `js/config.js`.
