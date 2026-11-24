// Image pipeline for 12 Nabta.
// Reads originals from /source-images and writes optimized WebP files to /assets.
// Run:  node scripts/build-images.mjs   (needs the "sharp" package: npm i -D sharp)
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let sharp;
try { sharp = require('sharp'); }
catch { sharp = require('/opt/npm-tools/node_modules/sharp'); } // fallback for the build machine

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'source-images');
const OUT = path.join(root, 'public', 'assets', 'img');

const jobs = [
  // folder, widths, quality
  { dir: 'products', widths: [480, 900, 1300], quality: 72 },
  { dir: 'workshop', widths: [640, 1280], quality: 76 },
];

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  const files = (await readdir(path.join(SRC, job.dir))).filter(f => /\.(jpe?g|png)$/i.test(f));
  for (const f of files) {
    const base = f.replace(/\.[^.]+$/, '');
    for (const w of job.widths) {
      await sharp(path.join(SRC, job.dir, f))
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: job.quality, effort: 5 })
        .toFile(path.join(OUT, `${base}-${w}.webp`));
    }
    console.log('✓', job.dir, base);
  }
}

// Fixed page background: the real workshop table, softened so text stays readable.
const bgSrc = path.join(SRC, 'workshop', 'table-pieces-and-tags.jpg');
await sharp(bgSrc).resize({ width: 1600 }).blur(1.2).webp({ quality: 70 }).toFile(path.join(OUT, 'bg-workshop-1600.webp'));
await sharp(bgSrc).resize({ width: 900, height: 1600, fit: 'cover', position: 'left' }).blur(1.2).webp({ quality: 68 }).toFile(path.join(OUT, 'bg-workshop-portrait.webp'));

// Logo: extract the white mark from the green tile into transparent PNGs (white + green).
const BRAND = path.join(root, 'public', 'assets', 'brand');
await mkdir(BRAND, { recursive: true });
const logo = sharp(path.join(SRC, 'brand', 'logo-original.png'));
const { data, info } = await logo.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
const makeMark = (rgb) => {
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    // background is ~ (47,64,36); white strokes are ~255. Map luminance distance to alpha.
    const lum = (r + g + b) / 3;
    const a = Math.max(0, Math.min(255, Math.round(((lum - 50) / (245 - 50)) * 255)));
    out[i * 4] = rgb[0]; out[i * 4 + 1] = rgb[1]; out[i * 4 + 2] = rgb[2]; out[i * 4 + 3] = a;
  }
  return out;
};
const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
// full lockup (Arabic mark + "12 Nabta")
const lockup = { left: 205, top: 222, width: 590, height: 222 };
// Arabic/12 mark only
const mark = { left: 198, top: 220, width: 394, height: 170 };
for (const [name, rgb] of [['white', [255, 255, 255]], ['green', [47, 64, 36]]]) {
  await sharp(makeMark(rgb), raw).extract(lockup).png().toFile(path.join(BRAND, `logo-lockup-${name}.png`));
  await sharp(makeMark(rgb), raw).extract(mark).png().toFile(path.join(BRAND, `logo-mark-${name}.png`));
}
console.log('✓ brand + background');
