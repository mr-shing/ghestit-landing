// Renders PWA icons from public/ghestitlogo.svg. Run: node scripts/gen-pwa-icons.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'public', 'ghestitlogo.svg');
const outDir = path.join(root, 'public', 'icons');
await mkdir(outDir, { recursive: true });

const BG = { r: 255, g: 255, b: 255, alpha: 1 }; // white plate behind maskable safe zone
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

// The SVG's viewBox is mostly empty canvas with the artwork in one corner, so a
// naive resize renders the logo tiny. Rasterize large, trim the empty border,
// and use the cropped logo for every icon.
const logoFull = await sharp(src, { density: 24, limitInputPixels: false })
  .resize(2048, 2048, { fit: 'contain', background: TRANSPARENT })
  .png()
  .toBuffer();
const logo = await sharp(logoFull).trim().png().toBuffer();

function fit(size) {
  return sharp(logo).resize(size, size, { fit: 'contain', background: TRANSPARENT }).png().toBuffer();
}

// Plain "any" icon: logo fills the canvas.
async function plain(size) {
  await sharp(await fit(size)).toFile(path.join(outDir, `icon-${size}.png`));
}

// Maskable icon: logo fills the full canvas on a solid plate. Android's mask may
// crop up to ~10% at the edges; acceptable for this logo per product request.
async function maskable(size) {
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: await fit(size) }])
    .png()
    .toFile(path.join(outDir, `maskable-${size}.png`));
}

await plain(192);
await plain(512);
await maskable(192);
await maskable(512);
// Apple touch icon (opaque, no transparency).
await sharp({ create: { width: 180, height: 180, channels: 4, background: BG } })
  .composite([{ input: await fit(180) }])
  .png()
  .toFile(path.join(outDir, 'apple-touch-icon.png'));

console.log('icons written to public/icons/');
