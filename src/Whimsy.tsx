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

function Skier() {
  return <g className="skier-motion" stroke="#284b43" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m-24 28 58 9q8 1 10-4M-30 36l54 10q7 1 10-4" fill="none"/><path d="m0 1-12 13 18 16m-4-15 20 9 4 10" fill="none" strokeWidth="5"/><path d="m-2-18 5 18 20 6" fill="none" stroke="#b75f3d" strokeWidth="10"/><path d="m0-13-13 13-13-3m45 9 7 26m-52-29-3 25" fill="none"/><circle cx="-4" cy="-29" r="8" fill="#e0ab7c"/><path d="M-13-30q0-13 13-10l6 10Z" fill="#d9b65e" stroke="none"/><path d="m-17-38-21-5" stroke="#b75f3d" strokeWidth="5"/><path d="m0-29 7 1" stroke="#284b43" strokeWidth="4"/></g>;
}

function Biker() {
  return <g className="biker-motion" stroke="#284b43" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" fill="none"><g transform="translate(-33 24)"><g className="bike-wheel"><circle r="19"/><path d="M-15-11 15 11M-11 15 11-15" strokeWidth="1"/></g></g><g transform="translate(33 24)"><g className="bike-wheel"><circle r="19"/><path d="M-15-11 15 11M-11 15 11-15" strokeWidth="1"/></g></g><path d="m-33 24 18-29 20 29h-38L-5-5H17l16 29M11-15h9l-3 10M-22-8h15"/><path d="m-7-32-9 20 21 8L0 17m-11-30-8 19 12 12" strokeWidth="5"/><path d="m-4-37 18 10 1 15" stroke="#b75f3d" strokeWidth="10"/><path d="m14-28 12 8-6 7"/><circle cx="4" cy="-51" r="8" fill="#dfaa79"/><path d="M-5-53q2-13 15-6l4 7Z" fill="#d9b65e" stroke="none"/></g>;
}

function Kayaker() {
  return <g className="kayak-motion" stroke="#284b43" strokeLinecap="round" strokeLinejoin="round"><path d="M-55 11Q0-11 55 11 8 37-55 11Z" fill="#d5a756" strokeWidth="2"/><ellipse cy="9" rx="17" ry="6" fill="#526f60" strokeWidth="2"/><path d="M-4-10 2 7" stroke="#b75f3d" strokeWidth="14"/><circle cx="-6" cy="-24" r="8" fill="#e3ad7c" strokeWidth="2"/><path d="M-16-25q0-12 12-9l7 8" fill="#e5c976" strokeWidth="2"/><g className="paddle-motion"><path d="m-30-22 59 48" strokeWidth="3"/><path d="m-38-32 14 8-5 7-12-10Zm63 51 13 8-3 8-15-11Z" fill="#f4e8cb" strokeWidth="2"/><path d="m-8-6-10-6m22 8 9 7" stroke="#e3ad7c" strokeWidth="5"/></g></g>;
}

function Golfer() {
  return <g className="golfer-motion" stroke="#284b43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"><path d="m-6 2-9 35m14-34 15 30 8 3" strokeWidth="6"/><path d="m-5-24 3 25" stroke="#b75f3d" strokeWidth="13"/><circle cx="-8" cy="-39" r="8" fill="#e3ad7c"/><path d="M-18-42q2-11 14-6l3 8h-21" fill="#d9b65e" strokeWidth="2"/><path d="m-6-21 17 10 15-11m-29 4 16 2 11-8m-1 1 20 53 6-1"/><circle cx="48" cy="32" r="2" fill="#fff" strokeWidth="1"/></g>;
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
