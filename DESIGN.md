# Whimsical Basecamp — staged design

Branch: `design/whimsical-basecamp`. This is a reviewable alternative to the live design; it is not deployed by the Pages workflow, which only publishes `main`.

## Direction

An illustrated mountain field guide, with warm paper, forest ink, rust accents, soft lake greens, and sun-washed yellow. Original property photography stays central: the opening photo becomes a taped postcard, bedrooms get gently arched frames, and the living room feels like a window into the home.

A small illustrated world connects the activities: a skier carving a slope, a rider on a winding trail, a golfer on the green, and a paddler on the water. These are decorative SVG illustrations, not representations of property amenities or invented property photographs.

## Motion

- Mountain scenery shifts slightly with scrolling (at most 22px on larger screens and 9px on small screens).
- Small figures move gently, bike wheels turn, and a kayak and paddle rock slowly.
- Animation pauses when scenes are offscreen. Scroll work is scheduled only on scroll or resize.
- A header control pauses all decorative motion. The operating system's reduced-motion preference disables animation and parallax automatically.
- Reading content, navigation, booking buttons, and photo gallery controls stay still and fully visible.

## Content and staging

The central content module, property facts, recommendations, FAQs, original photos, gallery behavior, booking destinations, and domain configuration are preserved. No dependencies or outside services are added.

Run `sh scripts/npm run build`, `sh scripts/npm run check:content`, then `sh scripts/npm run preview -- --port 4174 --strictPort` to review this worktree without replacing the main preview on port 4173. Before merging, review the desktop and mobile compositions, decide how playful the opening should feel, and confirm the preferred motion level. Merging into `main` is the separate publication step.

## Validation of this draft

- TypeScript, production build, and content/photo checks pass.
- Reviewed at 360, 390, 768, and 1440px widths; no horizontal page overflow.
- Checked mobile navigation, Escape, visible keyboard focus, gallery arrow keys, gallery focus cycling/restoration, and the motion pause/resume control.
- Confirmed offscreen scenes pause. Reduced-motion rules disable both animation and parallax; the system preference is also observed by React.
- Lighthouse mobile audit: performance **94**, accessibility **100** (local production preview; scores vary by device and network).
- No new dependencies; production content module, original images, domain, and deployment workflow are unchanged.
