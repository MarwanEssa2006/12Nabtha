# Future phase — "preview your artwork on a real 12 Nabta product"

Not built yet. This note describes how the current structure leaves room for it.

## Principle
The preview places a customer's image on **real photographs of real products**, inside a defined print or appliqué area.
It never uses a generated mock-up.

## Data model (extend each product in `js/data.js`)

```js
views: [
  {
    id: 'front',
    photo: img('pouch-blank-front', [900, 1300]),   // real photo of a blank pouch
    area: { x: 0.18, y: 0.30, w: 0.55, h: 0.45 },    // relative box where artwork can go
    perspective: null,                               // or 4 corner points for angled shots
    mask: 'pouch-front-mask.png',                    // optional: hides zip and edges
    blend: 'multiply',                               // lets the canvas texture show through
  },
  { id: 'angle', ... }
]
```

## Steps when the phase starts
1. Photograph each product type blank, with the same light, from 2–3 angles. Also shoot a mask for each angle.
2. Build a `<canvas>` renderer. It should:
   - load the view photo;
   - clip the artwork to `area` (or warp it to the four `perspective` points);
   - apply `multiply` so the weave shows;
   - add the mask.
3. Use the existing upload field in the order form as the source of the artwork.
   Send the rendered preview with the order: today as a copy or WhatsApp step, later via the endpoint.
4. Show the preview as "approximate". Appliqué and embroidery are made by hand, so the final piece will differ.

No new dependency is needed. Canvas 2D is enough for flat areas, and a small homography helper covers angled views.
