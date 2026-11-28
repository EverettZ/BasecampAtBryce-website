import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { soundtrack } from './content';

export function Soundtrack() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<{ context: AudioContext; gain: GainNode } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [volume, setVolume] = useState(25);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (panelRef.current) observer.observe(panelRef.current);
    const audio = audioRef.current;
    const leave = () => {
      if (document.hidden) {
        audio?.pause();
        void graphRef.current?.context.suspend();
      }
    };
    document.addEventListener('visibilitychange', leave);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', leave);
      audio?.pause();
      void graphRef.current?.context.close();
      graphRef.current = null;
    };
  }, []);

  const pause = () => {
    audioRef.current?.pause();
    void graphRef.current?.context.suspend();
  };

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setPending(true);
    setError(false);
    try {
      if (audio.error) audio.load();
      // Create the audio graph only in a user gesture. No audio request on page load.
      if (!graphRef.current && 'AudioContext' in window) {
        const context = new AudioContext();
        const gain = context.createGain();
        context.createMediaElementSource(audio).connect(gain);
        gain.connect(context.destination);
        graphRef.current = { context, gain };
      }
      const graph = graphRef.current;
      if (graph) {
        graph.gain.gain.cancelScheduledValues(graph.context.currentTime);
        graph.gain.gain.setValueAtTime(0, graph.context.currentTime);
        await Promise.all([graph.context.resume(), audio.play()]);
        graph.gain.gain.linearRampToValueAtTime(volume / 100, graph.context.currentTime + 1.5);
      } else {
        audio.volume = volume / 100;
        await audio.play();
      }
      if (document.hidden) pause();
    } catch (cause) {
      pause();
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) setError(true);
    } finally {
      setPending(false);
    }
  };

  const changeVolume = (value: number) => {
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
      <button className="soundtrack-play" disabled={pending} onClick={playing ? pause : () => void play()} aria-pressed={playing} aria-label={pending ? 'Loading soundtrack' : playing ? `Pause ${soundtrack.title}` : `Play ${soundtrack.title}`}>{playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}</button>
      <div className="soundtrack-copy"><span>{soundtrack.title}</span><span>{soundtrack.description}</span></div>
      <label className="soundtrack-volume"><Volume2 size={14} aria-hidden="true" /><span className="sr-only">Soundtrack volume</span><input type="range" min="0" max="100" value={volume} aria-valuetext={`${volume}%`} onChange={event => changeVolume(Number(event.target.value))} /></label>
      <audio ref={audioRef} src={soundtrack.src} preload="none" loop playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setPending(false); setError(true); }} />
      {error && <p className="soundtrack-error" role="status">The soundtrack couldn’t load. Please try again.</p>}
    </div>
    {mobileDock && createPortal(<button className="soundtrack-mobile-pause" onClick={pause} aria-label="Pause background soundtrack" title="Pause ambience"><VolumeX size={19} aria-hidden="true" /></button>, mobileDock)}
    {playing && !inView && createPortal(<button className="soundtrack-dock" onClick={pause} aria-label="Pause background soundtrack"><VolumeX size={20} aria-hidden="true" /><span className="sr-only">Pause ambience</span></button>, document.body)}
  </>;
}
