# Atmosphere and sound

The owner approved merging and publishing the `design/atmosphere-and-sound` changes on November 27, 2026. These notes document the implementation and pre-publication review.

## Parallax

The mountain backdrop keeps its layered movement. The opening property photograph, living-room photograph, deck photograph, and Lake Laura photograph now drift gently within their stationary frames as the page scrolls. Text, buttons, captions, and image frames stay still. Photo travel is capped at 10–18px on larger screens and 4–7.2px on phones, with extra image area to prevent exposed edges.

The existing motion control freezes parallax as well as illustrated motion. Reduced-motion preferences remove scrolling movement. Scroll updates use requestAnimationFrame only after scroll/resize events, and offscreen layers are skipped.

## Soundtrack

**Twilight at Basecamp** is a 60-second original soundtrack generated with ElevenLabs Music v2. The direction was a quiet twilight lake and fireside evening: warm pads, sparse piano and acoustic harmonics, with gentle nature-like textures, no strong beat or vocals requested. These are generated sounds, not recordings from the property.

- Stored locally at `public/audio/twilight-at-basecamp.mp3` (stereo MP3, 192kbps, about 1.46MB).
- The player attempts quiet autoplay once when the page opens visibly, where the browser allows it. A blocked autoplay attempt falls back to the Play button without an error or stuck loading state. The audio uses `preload="none"`, but the playback attempt may fetch music on arrival.
- Starts quietly at 25%, with a short fade-in. Volume is controlled with a Web Audio gain node where supported, including on mobile browsers; HTML audio is the fallback.
- Loops while enabled. A small pause-sound button appears when the main player scrolls out of view. On phones it sits inside the existing booking bar so it does not float over reading text.
- Leaving the tab pauses playback. Returning to the tab does not automatically resume. An explicit Pause is remembered for that tab’s browsing session, including reloads; pressing Play enables sound again.
- Playback and motion are independent controls.

Generation provenance: ElevenLabs flow `aP24OfbuUDXtOTr1RBUS`, generation `mz23gBsk1518qUusXXqc`, model `eleven_music_v2`, generated November 27, 2026 (America/New_York). Prompt requested a 60-second instrumental; the exported file is approximately 60.024 seconds.

To replace the track, replace the MP3 and edit the typed `soundtrack` entry in `src/content.ts`. The player is in `src/Soundtrack.tsx`; photo motion and player styles are in `src/atmosphere.css`.

## Review

Run `sh scripts/npm run build` and `sh scripts/npm run check:content`, then `sh scripts/npm run preview -- --port 4175 --strictPort` in this worktree. Review at http://127.0.0.1:4175/ on the development computer. Listen with headphones or speakers and confirm the musical direction and motion level before publication.

Validation of the original click-to-play draft: TypeScript, production build, and content/asset checks pass. Reviewed at 360, 390, 768, and 1440px; playback, keyboard volume adjustment, offscreen pause controls, and motion freezing were checked. Mobile Lighthouse scored 93 performance / 100 accessibility, with no audio requests on initial page load. No console errors were observed. This initial review was performed locally before publication approval.


Autoplay revision: the owner requested automatic playback after reviewing the first draft. Browsers can require a click or tap for audible playback; this implementation respects that restriction and retains explicit Play. Autoplay is coordinated in JavaScript so the gain starts at zero, fades in at 25%, and native policy rejection is handled. Suspended AudioContext startup is bounded so the controls remain usable. The owner subsequently approved this revision for publication. See https://developer.chrome.com/blog/autoplay for the browser policy.

Final autoplay validation: build and content/asset checks pass. Mobile Lighthouse: 94 performance / 100 accessibility, zero blocking time, and no audio download when Chrome blocks the attempt. Browser review confirmed a clean Play fallback, successful manual playback after that fallback, and a paused state after an explicit Pause and reload. Autoplay acceptance still depends on the visitor's browser settings and interaction history. Rejected autoplay is checked before constructing the audio engine to keep the blocked path lightweight.
