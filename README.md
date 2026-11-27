# The Basecamp at Bryce

A static, mobile-friendly React + TypeScript website for The Basecamp at Bryce in Basye, Virginia. Bookings link to Airbnb. Vite builds the assets, then React renders the entire page into the production HTML so visitors and search engines can read it before JavaScript loads.

## Run locally

This project already has a project-local official Node.js runtime in `.tools/`. The wrapper uses it without changing your computer’s global Node installation:

```sh
sh scripts/npm run dev
```

For a fresh checkout, use an installed Node.js LTS version compatible with Vite (Node 22.19 or newer), or install the pinned official runtime locally on macOS/Linux:

```sh
sh scripts/setup-node.sh
sh scripts/npm ci
sh scripts/npm run dev
```

The setup script downloads Node.js from nodejs.org and verifies its SHA-256 checksum. Runtime files and dependencies are excluded from version control.

## Build and verify

```sh
sh scripts/npm run typecheck
sh scripts/npm run build
sh scripts/npm run check:content
sh scripts/npm run preview -- --port 4173
```

The preview is at http://127.0.0.1:4173/. Stop a terminal’s server with Ctrl+C. The `build` command includes type checking. `check:content` verifies the required photos, local image variants, booking URL, bedroom count, and prerendered production content.

To run the mobile Lighthouse audit with Google Chrome installed:

```sh
sh scripts/npm exec -- lighthouse http://127.0.0.1:4173/ --output=html --output-path=.cache/lighthouse-mobile.html --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless"
```

## Edit content and photos

- `src/content.ts`: property facts, bedroom descriptions, amenities, FAQs, navigation, activities, and recommendation links.
- `src/App.tsx`: page sections, navigation, and accessible photo gallery.
- `src/styles.css`: colors, typography, layouts, and responsive breakpoints.
- `photos/source-map.json`: the selected original filenames, captions, alt text, and crop positions.
- `src/photos.json`: generated image manifest. Regenerate rather than editing it manually.

The site uses 18 selected photos from the owner-provided `14-vickie-way-photo-download-1of1-webres` folder. Original copies are kept locally in ignored `photos/originals/`; they are never published. The supplied files are web-resolution images, mostly 1024 pixels wide. The optimizer preserves that limit rather than enlarging them. Replace them with higher-resolution matching originals to improve large-screen sharpness.

To regenerate image variants after changing originals or the selection:

```sh
sh scripts/npm run photos
```

Or supply a directory containing the source files:

```sh
sh scripts/npm run photos -- "/absolute/path/to/originals"
```

The script makes responsive WebP files, AVIF variants for the opening photo, a JPEG social cover, and the manifest. It strips image metadata. Optimized images live in `public/images/` and are included in the finished build. Keep the provided photos and photographer’s usage rights with the property owner.

Fonts are self-hosted from the Fontsource packages (DM Sans and Cormorant Garamond); there are no runtime requests to Google Fonts. Their licenses are included in `public/licenses/`.

## Static hosting

Upload the contents of `dist/` to any static host. No Node process, backend, API keys, account system, or database is required in production. Relative asset paths support a subdirectory deployment. The site has one page with section anchors, so it needs no route rewrites.

When the final public URL is known, include it at build time to generate an absolute social image URL, canonical link, and Open Graph URL:

```sh
SITE_URL=https://your-domain.example/ sh scripts/npm run build
```

Use the full path if deploying in a subdirectory. Without `SITE_URL`, local preview works and social-image metadata remains relative. A sitemap can be added once the final domain is known. `public/robots.txt` allows indexing; the local preview is only bound to this computer.

Suggested hosting settings: build command `npm run build`, output directory `dist`. Cache fingerprinted `assets/` files for one year with `immutable`; revalidate HTML. Revalidate stable image filenames when replacing photos, or purge the host’s image cache. Enable HTTPS and text compression through the host.

## Content sources and boundaries

Property amenities, sleeping arrangements, host introduction, and check-in (after 4 PM) / checkout (before 10 AM) were checked against the owner’s [Airbnb listing](https://www.airbnb.com/rooms/1809783027232604288).

Activity and guide links:

- [Lake Laura](https://bryceresort.com/summer/lake-laura) — seasonal lake access, rentals, and trail information.
- [Lake Laura loop distance](https://gohikevirginia.com/lake-laura/) — approximately 2.5 miles; natural trail conditions vary.
- [Bryce skiing](https://bryceresort.com/winter/ski-and-snowboard), [bike park](https://bryceresort.com/summer/bike-park), and [golf](https://bryceresort.com/summer/golf-course).
- [Pale Fire Basye](https://www.palefirebrewing.com/basye/), [Shenandoah Caverns](https://shenandoahcaverns.com/tickets-and-tours/), [Cave Ridge Vineyard](https://www.caveridge.com/visitus), and [Shenandoah Valley Music Festival](https://musicfest.org/about/venue/).

No rates, availability, review scores, testimonials, exact travel times, or included resort privileges are invented. Airbnb remains the source for bookings and current house policies. External sites remain the source for activity operations. There is no analytics or tracking code.
