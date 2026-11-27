import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), {
    name: 'basecamp-site-metadata',
    transformIndexHtml(html) {
      const siteUrl = process.env.SITE_URL;
      if (!siteUrl) return html;
      const url = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
      if (url.protocol !== 'https:') throw new Error('SITE_URL must use https://');
      const image = new URL('images/social-cover.jpg', url).href;
      return html.replace('content="./images/social-cover.jpg"', `content="${image}"`)
        .replace('</head>', `<link rel="canonical" href="${url.href}" /><meta property="og:url" content="${url.href}" /></head>`);
    },
  }],
  base: './',
});
