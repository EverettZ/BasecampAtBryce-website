import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { activities, bedrooms, photos, property, recommendations, soundtrack } from '../src/content';

assert.equal(property.bookingUrl, 'https://airbnb.com/h/thebasecampatbryce');
assert.equal(bedrooms.length, 4);
const required = ['exterior', 'living', 'deck', 'kitchen', 'coffee', 'game-room', 'kids', 'lake', ...bedrooms.map(room => room.id)];
for (const id of required) assert(photos.some(photo => photo.id === id), `Required photo missing: ${id}`);
assert.equal(new Set(photos.map(photo => photo.id)).size, photos.length, 'Duplicate photo IDs');
for (const photo of photos) {
  assert(photo.alt && photo.caption && photo.width > 0 && photo.height > 0, `Photo metadata incomplete: ${photo.id}`);
  await access(`public/${photo.src.replace(/^\.\//, '')}`);
  for (const source of photo.srcSet.split(',')) {
    const asset = source.trim().split(' ')[0];
    await access(`public/${asset.replace(/^\.\//, '')}`);
  }
}
for (const item of [...activities, ...recommendations]) assert.equal(new URL(item.url).protocol, 'https:');
const soundPath = soundtrack.src.replace(/^\.\//, '');
await access(`public/${soundPath}`);
await access(`dist/${soundPath}`);
const html = await readFile('dist/index.html', 'utf8');
assert(/<audio\b[^>]*preload="none"/.test(html), 'Soundtrack must use preload=none before playback is attempted');
assert(!/<audio\b[^>]*autoplay/.test(html), 'Autoplay must be coordinated in JavaScript so gain and rejected permission are handled');
assert(html.includes('Slow mornings.'), 'Production HTML must contain prerendered page content');
assert(html.includes('id="lake-laura"'));
assert(!html.includes('<!--app-html-->'));
assert(!html.includes('Original photography coming soon'), 'Production must not contain missing-photo placeholders');
assert.equal((html.match(/<h1[ >]/g) || []).length, 1, 'Exactly one primary heading');
console.log(`Content and production checks passed: ${photos.length} photos, 4 bedrooms, ${activities.length + recommendations.length} activity links.`);
