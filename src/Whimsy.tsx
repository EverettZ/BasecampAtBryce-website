import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

const MotionContext = createContext({ paused: false, reduced: false, toggle: () => {} });

/** Decorative motion stays local to this design, and never moves reading content. */
export function WhimsyFrame({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const scenes = root.current?.querySelectorAll<HTMLElement>('.motion-scene') ?? [];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting)), { rootMargin: '40px' });
    scenes.forEach(scene => observer.observe(scene));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const layers = [...(root.current?.querySelectorAll<HTMLElement>('[data-parallax]') ?? [])];
    if (paused || reduced) {
      layers.forEach(layer => layer.style.setProperty('--parallax-y', '0px'));
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      layers.forEach(layer => {
        const bounds = layer.parentElement!.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        const progress = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) / window.innerHeight;
        const distance = window.innerWidth < 700 ? 9 : 22;
        layer.style.setProperty('--parallax-y', `${Math.max(-distance, Math.min(distance, progress * distance))}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [paused, reduced]);
  return <MotionContext.Provider value={{ paused, reduced, toggle: () => setPaused(value => !value) }}><div ref={root} className="whimsical-site" data-motion={paused || reduced ? 'off' : 'on'}>{children}</div></MotionContext.Provider>;
}

export function MotionToggle() {
  const { paused, reduced, toggle } = useContext(MotionContext);
  return <button className="motion-toggle" onClick={toggle} disabled={reduced} aria-pressed={paused || reduced} aria-label={reduced ? 'Motion off: reduced motion preference' : paused ? 'Resume decorative motion' : 'Pause decorative motion'} title={reduced ? 'Your reduced motion preference is on' : undefined}>{paused || reduced ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}<span>{paused || reduced ? 'Motion off' : 'Motion on'}</span></button>;
}

function Pine({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 10V-42" stroke="#37594b" strokeWidth="3"/><path d="M-17-5 0-29 17-5H-12L0-43 12-19H-9L0-54 9-32" fill="#52755c" stroke="#37594b" strokeWidth="1.5" strokeLinejoin="round"/></g>;
}

// Absolute paths share joint coordinates; separate limbs never inherit a prior endpoint.
function Skier() {
  return <g className="skier-motion" stroke="#284b43" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M-24 31 34 40Q42 41 44 36M-30 39 24 48Q31 49 34 44" />
    <path d="M-24-5-29 30M23 4 31 33" strokeWidth="2" />
    <path d="M3 1-12 20-6 42 1 43M3 1 21 20 18 36 25 38" strokeWidth="5" />
    <path d="M-4-23-2-15" strokeWidth="4" />
    <path d="M-2-15 3 1" stroke="#b75f3d" strokeWidth="10" />
    <path d="M-2-14-15-1M-2-14 9-2" stroke="#b75f3d" strokeWidth="6" />
    <path d="M-15-1-24-5M9-2 23 4" stroke="#e0ab7c" strokeWidth="4" />
    <path d="M-4-22-19-25-33-32" stroke="#b75f3d" strokeWidth="4" />
    <circle cx="-4" cy="-31" r="8" fill="#e0ab7c" />
    <path d="M-13-32Q-13-45 0-42L6-32Z" fill="#d9b65e" stroke="none" />
    <path d="M0-31 7-30" strokeWidth="4" />
  </g>;
}

function Biker() {
  return <g className="biker-motion" stroke="#284b43" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <g transform="translate(-33 24)"><g className="bike-wheel"><circle r="19" /><path d="M-15-11 15 11M-11 15 11-15" strokeWidth="1" /></g></g>
    <g transform="translate(33 24)"><g className="bike-wheel"><circle r="19" /><path d="M-15-11 15 11M-11 15 11-15" strokeWidth="1" /></g></g>
    <path d="M-33 24-15-5 0 24H-33M-15-5H17L0 24M17-5 33 24M11-15H20L17-5M-22-8H-7M0 24-2 17M0 24-2 29" />
    <path d="M-15-9-23 7-7 17H-1M-15-9 5 3-1 29H5" strokeWidth="5" />
    <path d="M10-36 7-31" strokeWidth="4" />
    <path d="M7-31-15-9" stroke="#b75f3d" strokeWidth="10" />
    <path d="M7-31 22-24M7-31 11-19" stroke="#b75f3d" strokeWidth="6" />
    <path d="M22-24 20-15M11-19 17-15" stroke="#dfaa79" strokeWidth="4" />
    <circle cx="12" cy="-44" r="8" fill="#dfaa79" />
    <path d="M3-46Q5-59 18-52L22-45Z" fill="#d9b65e" stroke="none" />
  </g>;
}

function Kayaker() {
  return <g className="kayak-motion" stroke="#284b43" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M-55 11Q0-11 55 11 8 37-55 11Z" fill="#d5a756" strokeWidth="2" />
    <ellipse cy="9" rx="17" ry="6" fill="#526f60" strokeWidth="2" />
    {/* Torso, head, arms, hands, and paddle rotate together around the seated hip. */}
    <g className="paddle-motion">
      <path d="M-6-17-4-10" strokeWidth="4" />
      <path d="M-4-10 2 7" stroke="#b75f3d" strokeWidth="14" />
      <path d="M-4-10-13-13M-4-10 12-6" stroke="#b75f3d" strokeWidth="6" />
      <path d="M-13-13-20-14M12-6 15 15" stroke="#e3ad7c" strokeWidth="4" />
      <circle cx="-6" cy="-24" r="8" fill="#e3ad7c" strokeWidth="2" />
      <path d="M-16-25Q-16-37-4-34L3-26" fill="#e5c976" strokeWidth="2" />
      <path d="M-30-22 29 26" strokeWidth="3" />
      <path d="M-38-32-24-24-29-17-41-27ZM25 19 38 27 35 35 20 24Z" fill="#f4e8cb" strokeWidth="2" />
      <circle cx="-20" cy="-14" r="2.5" fill="#e3ad7c" stroke="none" />
      <circle cx="15" cy="15" r="2.5" fill="#e3ad7c" stroke="none" />
    </g>
  </g>;
}

function Golfer() {
  return <g className="golfer-motion" stroke="#284b43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M-2 1-11 21-15 36H-9M-2 1 7 18 14 34 22 36" strokeWidth="6" />
    <path d="M-8-31-5-24" strokeWidth="4" />
    <path d="M-5-24-2 1" stroke="#b75f3d" strokeWidth="13" />
    <path d="M-5-21 10-11 24-22M-5-21 6-6 25-19" />
    <path d="M-5-21 4-15M-5-21 1-13" stroke="#b75f3d" strokeWidth="6" />
    <path d="M25-21 45 31 51 30" />
    <circle cx="-8" cy="-39" r="8" fill="#e3ad7c" />
    <path d="M-18-42Q-16-53-4-48L-1-40H-22" fill="#d9b65e" strokeWidth="2" />
    <circle cx="48" cy="32" r="2" fill="#fff" strokeWidth="1" />
  </g>;
}

export function AdventureLandscape() {
  return <div className="adventure-landscape motion-scene" aria-hidden="true"><svg className="landscape-back parallax-layer" data-parallax viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice"><circle cx="1155" cy="76" r="43" fill="#e8c879"/><path d="m0 220 170-140 128 92L478 18l215 179L865 66l228 141 151-106 196 125v94H0Z" fill="#c3cfbb"/><path d="m373 110 105-92 111 93-66-20-37 14-31-34-31 42Z" fill="#faf5e8"/><path d="m735 167 130-101 122 101-79-25-29 13-26-29-47 31Z" fill="#e9eedf"/><path d="M0 240Q181 115 366 236 538 112 756 244 1012 123 1171 227 1344 137 1440 231V320H0Z" fill="#90a98a"/></svg><svg className="landscape-front" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice"><path d="M0 260q202-66 369-12 148 65 360 8 245-74 421-9 173-52 290-5v78H0Z" fill="#6d8b70"/><path d="m525 238 63-83 75 104q-70-34-138-21Z" fill="#f4f1e2"/><path d="M115 222q145-15 244 43t316 18" stroke="#ecdfbf" strokeWidth="18" fill="none"/><path d="M115 222q145-15 244 43t316 18" stroke="#8e7959" strokeWidth="1.5" strokeDasharray="5 9" fill="none"/><ellipse cx="1100" cy="292" rx="215" ry="58" fill="#a6c6b9"/><path d="M954 285h53m157 14h65m-177 12h43m94-39h25" stroke="#e8efe0" strokeWidth="2" strokeLinecap="round"/><Pine x={66} y={266} scale={1.25}/><Pine x={100} y={263} scale={.8}/><Pine x={730} y={291} scale={1.25}/><Pine x={773} y={293} scale={.85}/><Pine x={1310} y={275} scale={1.4}/><Pine x={1355} y={278} scale={.9}/><g transform="translate(332 219) scale(.64)"><Biker/></g><g transform="translate(597 191) scale(.58) rotate(10)"><Skier/></g><g transform="translate(1120 280) scale(.7)"><Kayaker/></g><path d="m106 97 8-4 8 4m11-15 7-4 7 4" fill="none" stroke="#6b8268" strokeWidth="2" strokeLinecap="round"/></svg></div>;
}

export function ActivityScene({ kind, season }: { kind: string; season: string }) {
  return <div className={`activity-art illustrated-art motion-scene scene-${kind}`} aria-hidden="true"><svg viewBox="0 0 360 225" fill="none"><circle cx="290" cy="43" r="21" fill="#e4c879"/>{kind === 'ski' ? <><path d="m0 174 107-132 91 101 70-92 92 118v56H0Z" fill="#c2d1c8"/><path d="m65 94 42-52 46 52-28-11-15 10-12-19-13 19Z" fill="#fffaf0"/><path d="M0 178q106-70 210 6t150-9v50H0Z" fill="#fffaf0"/><path d="M142 166q-68 12-19 29t-18 21" stroke="#a5b9b0" strokeDasharray="4 6"/><g transform="translate(172 132) rotate(-8)"><Skier/></g><Pine x={310} y={203} scale={.9}/></> : kind === 'bike' ? <><path d="M0 163Q80 64 183 141T360 99v126H0Z" fill="#a7bc94"/><path d="M0 203q149-105 360-14v36H0Z" fill="#77936d"/><path d="M0 210q146-72 360-14" stroke="#e7d9b7" strokeWidth="14"/><Pine x={55} y={155} scale={1.4}/><Pine x={304} y={139} scale={1}/><g transform="translate(181 156) rotate(-7)"><Biker/></g></> : <><path d="M0 172Q120 86 219 156t141-10v79H0Z" fill="#a9bd8e"/><path d="M0 210q135-69 360-19v34H0Z" fill="#7d9a6d"/><ellipse cx="259" cy="181" rx="53" ry="13" fill="#d0d8a5"/><path d="M265 180V79l28 11-28 11" fill="#b75f3d" stroke="#385c48" strokeWidth="2"/><g transform="translate(141 156)"><Golfer/></g><Pine x={35} y={171} scale={.8}/></>}<path d="m35 40 8-4 8 4m6-12 7-3 7 3" stroke="#698269" strokeWidth="1.7" strokeLinecap="round"/></svg><span>{season}</span></div>;
}

export function LakeDoodle() {
  return <div className="lake-doodle motion-scene" aria-hidden="true"><svg viewBox="0 0 250 145" fill="none"><ellipse cx="125" cy="105" rx="115" ry="30" fill="#a6c6b9"/><path d="M31 108h33m119-10h40M76 124h32m41-2h35" stroke="#f7f1e2" strokeWidth="2" strokeLinecap="round"/><g transform="translate(127 76) scale(.95)"><Kayaker/></g></svg></div>;
}
