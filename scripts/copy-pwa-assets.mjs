import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src', 'assets', 'QT_V2.png');
const publicDir = path.join(root, 'public');
const iconsDir = path.join(publicDir, 'icons');

const copies = [
  [source, path.join(publicDir, 'og-image.png')],
  [source, path.join(publicDir, 'favicon.png')],
  [source, path.join(publicDir, 'apple-touch-icon.png')],
  [source, path.join(iconsDir, 'icon-192.png')],
  [source, path.join(iconsDir, 'icon-512.png')],
];

fs.mkdirSync(iconsDir, { recursive: true });

for (const [from, to] of copies) {
  if (!fs.existsSync(from)) {
    console.warn(`[copy-pwa-assets] Missing source: ${from}`);
    continue;
  }
  fs.copyFileSync(from, to);
  console.log(`[copy-pwa-assets] ${path.relative(root, to)}`);
}
