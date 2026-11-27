import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const originalDirectory = process.argv[2] ?? 'photos/originals';
const entries = JSON.parse(await readFile('photos/source-map.json', 'utf8'));
await mkdir('public/images', { recursive: true });
const manifest = [];
for (const { file, ...photo } of entries) {
  const original = path.join(originalDirectory, file);
  const metadata = await sharp(original).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Invalid photo: ${file}`);
  const widths = [...new Set([...([240, 480, 800, 1200, 1600, 2200].filter(width => width <= metadata.width)), Math.min(2200, metadata.width)])].sort((a, b) => a - b);
  for (const width of widths) {
    await sharp(original).rotate().resize({ width, withoutEnlargement: true })
      .webp({ quality: width <= 480 ? 76 : 82, effort: 5 })
      .toFile(`public/images/${photo.id}-${width}.webp`);
    if (photo.id === 'exterior') {
      await sharp(original).rotate().resize({ width, withoutEnlargement: true })
        .avif({ quality: 47, effort: 6 }).toFile(`public/images/${photo.id}-${width}.avif`);
    }
  }
  const defaultWidth = widths.includes(1200) ? 1200 : widths.at(-1);
  manifest.push({ ...photo, width: metadata.width, height: metadata.height,
    src: `./images/${photo.id}-${defaultWidth}.webp`,
    srcSet: widths.map(width => `./images/${photo.id}-${width}.webp ${width}w`).join(', '),
    ...(photo.id === 'exterior' ? { avifSrcSet: widths.map(width => `./images/${photo.id}-${width}.avif ${width}w`).join(', ') } : {}),
  });
  console.log(`Prepared ${photo.id} (${metadata.width} × ${metadata.height})`);
}
await writeFile('src/photos.json', `${JSON.stringify(manifest, null, 2)}\n`);
// Use a regular JPEG for broad social-card compatibility.
await sharp(path.join(originalDirectory, entries[0].file)).rotate()
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85 }).toFile('public/images/social-cover.jpg');
console.log(`Optimized ${manifest.length} owner-supplied photos and generated the photo manifest.`);
