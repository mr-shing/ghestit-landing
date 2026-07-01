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

// Plain "any" icon: logo fills the canvas.
async function plain(size) {
  await sharp(src, { density: 24, limitInputPixels: false })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, `icon-${size}.png`));
}

// Maskable icon: logo scaled to ~72% inside a solid plate (Android safe zone is 80%).
async function maskable(size) {
  const inner = Math.round(size * 0.72);
  const logo = await sharp(src, { density: 24, limitInputPixels: false })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const pad = Math.round((size - inner) / 2);
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: logo, top: pad, left: pad }])
    .png()
    .toFile(path.join(outDir, `maskable-${size}.png`));
}

await plain(192);
await plain(512);
await maskable(192);
await maskable(512);
// Apple touch icon (opaque, no transparency).
await sharp({ create: { width: 180, height: 180, channels: 4, background: BG } })
  .composite([{ input: await sharp(src, { density: 24, limitInputPixels: false }).resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(), top: 15, left: 15 }])
  .png()
  .toFile(path.join(outDir, 'apple-touch-icon.png'));

console.log('icons written to public/icons/');
