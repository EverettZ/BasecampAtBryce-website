import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { soundtrack } from './content';

const mutedPreference = 'basecamp-soundtrack-paused';
function rememberPause(paused: boolean) {
  try { sessionStorage.setItem(mutedPreference, String(paused)); } catch { /* Playback works without storage. */ }
}
function wasPaused() {
  try { return sessionStorage.getItem(mutedPreference) === 'true'; } catch { return false; }
}

export function Soundtrack() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<{ context: AudioContext; gain: GainNode } | null>(null);
  const attemptRef = useRef(0);
  const volumeRef = useRef(25);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [volume, setVolume] = useState(25);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(true);

  const pause = useCallback((remember = true) => {
    attemptRef.current++;
    audioRef.current?.pause();
    void graphRef.current?.context.suspend();
    setPlaying(false);
    setPending(false);
    if (remember) rememberPause(true);
  }, []);

  const play = useCallback(async (automatic = false) => {
    const audio = audioRef.current;
    if (!audio || document.hidden) return;
    const attempt = ++attemptRef.current;
    let resumeTimer: number | undefined;
    if (!automatic) rememberPause(false);
    setPending(true);
    setError(false);
    try {
      if (audio.error) audio.load();
      // Let the browser reject a blocked attempt before paying for an audio graph.
      if (automatic && !graphRef.current) {
        audio.volume = volumeRef.current / 100;
        await audio.play();
        if (attempt !== attemptRef.current) return;
      }
      // Audible autoplay is best effort; browser permission is never bypassed.
      if (!graphRef.current && 'AudioContext' in window) {
        const context = new AudioContext();
        const gain = context.createGain();
        gain.gain.value = 0;
        context.createMediaElementSource(audio).connect(gain);
        gain.connect(context.destination);
        graphRef.current = { context, gain };
        audio.volume = 1;
      }
      const graph = graphRef.current;
      if (graph) {
        graph.gain.gain.cancelScheduledValues(graph.context.currentTime);
        graph.gain.gain.setValueAtTime(0, graph.context.currentTime);
        const resume = graph.context.resume();
        // Some browsers leave resume() pending when a gesture is required.
        const ready = automatic ? Promise.race([resume, new Promise<void>((_, reject) => {
          resumeTimer = window.setTimeout(() => reject(new DOMException('Autoplay requires interaction', 'NotAllowedError')), 750);
        })]) : resume;
        await Promise.all([ready, audio.play()]);
        if (attempt !== attemptRef.current) return;
        graph.gain.gain.linearRampToValueAtTime(volumeRef.current / 100, graph.context.currentTime + 1.5);
      } else {
        audio.volume = volumeRef.current / 100;
        await audio.play();
      }
      if (attempt !== attemptRef.current) return;
      if (document.hidden) pause(false);
      else setPlaying(true);
    } catch (cause) {
      if (attempt !== attemptRef.current) return;
      pause(false);
      const expected = cause instanceof DOMException && (cause.name === 'AbortError' || (automatic && cause.name === 'NotAllowedError'));
      if (!expected) setError(true);
    } finally {
      window.clearTimeout(resumeTimer);
      if (attempt === attemptRef.current) setPending(false);
    }
  }, [pause]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (panelRef.current) observer.observe(panelRef.current);
    const audio = audioRef.current;
    const leave = () => { if (document.hidden) pause(false); };
    document.addEventListener('visibilitychange', leave);
    // The cancellable task avoids a duplicate attempt during React's dev remount.
    const start = window.setTimeout(() => { if (soundtrack.autoplay && !wasPaused()) void play(true); }, 0);
    return () => {
      window.clearTimeout(start);
      attemptRef.current++;
      observer.disconnect();
      document.removeEventListener('visibilitychange', leave);
      audio?.pause();
      void graphRef.current?.context.close();
      graphRef.current = null;
    };
  }, [pause, play]);

  const changeVolume = (value: number) => {
    volumeRef.current = value;
    setVolume(value);
    const graph = graphRef.current;
    if (graph) {
      graph.gain.gain.cancelScheduledValues(graph.context.currentTime);
      graph.gain.gain.setTargetAtTime(value / 100, graph.context.currentTime, .08);
    } else if (audioRef.current) audioRef.current.volume = value / 100;
  };

  const mobileDock = playing && !inView ? document.getElementById('mobile-sound-slot') : null;

  return <>
    <div ref={panelRef} className="soundtrack-panel" role="group" aria-label="Optional background soundtrack">
      <button className="soundtrack-play" onClick={playing || pending ? () => pause() : () => void play()} aria-busy={pending} aria-pressed={playing} aria-label={pending ? 'Cancel soundtrack playback' : playing ? `Pause ${soundtrack.title}` : `Play ${soundtrack.title}`}>{playing || pending ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}</button>
      <div className="soundtrack-copy"><span>{soundtrack.title}</span><span>{soundtrack.description}</span></div>
      <label className="soundtrack-volume"><Volume2 size={14} aria-hidden="true" /><span className="sr-only">Soundtrack volume</span><input type="range" min="0" max="100" value={volume} aria-valuetext={`${volume}%`} onChange={event => changeVolume(Number(event.target.value))} /></label>
      <audio ref={audioRef} src={soundtrack.src} preload="none" loop playsInline onPause={() => setPlaying(false)} onError={() => { pause(false); setError(true); }} />
      {error && <p className="soundtrack-error" role="status">The soundtrack couldn’t load. Please try again.</p>}
    </div>
    {mobileDock && createPortal(<button className="soundtrack-mobile-pause" onClick={() => pause()} aria-label="Pause background soundtrack" title="Pause ambience"><VolumeX size={19} aria-hidden="true" /></button>, mobileDock)}
    {playing && !inView && createPortal(<button className="soundtrack-dock" onClick={() => pause()} aria-label="Pause background soundtrack"><VolumeX size={20} aria-hidden="true" /><span className="sr-only">Pause ambience</span></button>, document.body)}
  </>;
}
