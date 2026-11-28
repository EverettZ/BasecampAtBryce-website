import { readFile, writeFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import { photos } from '../src/content';

const html = await readFile('dist/index.html', 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('Prerender marker is missing.');
const hero = photos.find(photo => photo.id === 'exterior');
const preload = hero?.avifSrcSet ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${hero.avifSrcSet}" imagesizes="(max-width: 700px) 90vw, 42vw" fetchpriority="high">` : '';
await writeFile('dist/index.html', html.replace('<!--app-html-->', renderToString(<App />)).replace('</head>', `${preload}</head>`));
console.log('Prerendered the complete page for search engines and immediate reading.');
