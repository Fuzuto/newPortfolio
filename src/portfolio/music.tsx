import { useCallback, useEffect, useRef, useState } from 'react';
import { assetUrl } from './assets';
import { PlaybackIcon } from './primitives';

const VOLUME_KEY = 'trung-le-portfolio.music-volume';

const loadVolume = () => {
  try {
    const saved = Number.parseInt(window.localStorage.getItem(VOLUME_KEY) ?? '', 10);
    if (saved >= 0 && saved <= 100) return saved;
  } catch {
    // The control remains usable when storage is disabled.
  }
  return 60;
};

export const Music = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicButtonRef = useRef<HTMLButtonElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(loadVolume);
  const [unavailable, setUnavailable] = useState(false);
  const [hoverSounds, setHoverSounds] = useState<boolean | null>(() => typeof AudioContext === 'function' ? true : null);

  const startMusic = useCallback((manual = false) => {
    setUnavailable(false);
    void audioRef.current?.play().catch((error: DOMException) => {
      if (error.name === 'AbortError' || (!manual && error.name === 'NotAllowedError')) return;
      setUnavailable(true);
    });
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const removeListeners = () => {
      document.removeEventListener('click', activateAudio, true);
      document.removeEventListener('keydown', activateAudio, true);
    };

    const unlockHover = () => {
      if (typeof AudioContext !== 'function') return;
      try {
        const context = (contextRef.current ??= new AudioContext());
        if (context.state !== 'running') {
          void context.resume().catch((error: DOMException) => {
            if (error.name !== 'NotAllowedError' && context === contextRef.current) setHoverSounds(null);
          });
        }
      } catch {
        setHoverSounds(null);
      }
    };

    function activateAudio(event: MouseEvent | KeyboardEvent) {
      if (!event.isTrusted || navigator.userActivation?.isActive === false) return;
      removeListeners();
      // Let the music button handle its own gesture so it cannot toggle twice.
      if (audio?.paused && !(event.target instanceof Node && musicButtonRef.current?.contains(event.target))) {
        startMusic();
      }
      unlockHover();
    }

    audio.addEventListener('playing', unlockHover);
    document.addEventListener('click', activateAudio, true);
    document.addEventListener('keydown', activateAudio, true);
    startMusic();

    return () => {
      removeListeners();
      audio.removeEventListener('playing', unlockHover);
      void contextRef.current?.close().catch(() => {});
      contextRef.current = null;
    };
  }, [startMusic]);

  useEffect(() => {
    const root = audioRef.current?.closest<HTMLElement>('[data-slot="portfolio"]');
    if (!root || !hoverSounds || volume === 0) return;

    let lastCue = -Infinity;
    const playHover = (event: PointerEvent) => {
      const context = contextRef.current;
      if (event.pointerType !== 'mouse' || context?.state !== 'running' || !(event.target instanceof Element)) return;

      const control = event.target.closest('a[href], button:not(:disabled), summary');
      if (!control || control.getAttribute('aria-disabled') === 'true') return;
      if (event.relatedTarget instanceof Node && control.contains(event.relatedTarget)) return;

      const now = context.currentTime;
      if (now - lastCue < 0.1) return;
      lastCue = now;

      const tone = context.createOscillator();
      const gain = context.createGain();
      const end = now + 0.065;
      tone.frequency.setValueAtTime(520, now);
      tone.frequency.exponentialRampToValueAtTime(390, end);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035 * volume / 100, now + 0.008);
      gain.gain.linearRampToValueAtTime(0, end);
      tone.connect(gain).connect(context.destination);
      tone.onended = () => {
        tone.disconnect();
        gain.disconnect();
      };
      tone.start(now);
      tone.stop(end);
    };

    root.addEventListener('pointerover', playHover);
    return () => root.removeEventListener('pointerover', playHover);
  }, [hoverSounds, volume]);

  const updateVolume = (next: number) => {
    setVolume(next);
    try {
      window.localStorage.setItem(VOLUME_KEY, String(next));
    } catch {
      // A blocked storage write does not stop playback.
    }
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }

    startMusic(true);
  };

  return (
    <div role="group" aria-label="Portfolio audio" className="fixed end-4 bottom-4 z-40 sm:end-6 sm:bottom-6">
      <audio
        ref={audioRef}
        src={assetUrl('/media/portfolio/background-music.mp3')}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setUnavailable(true);
        }}
      />
      <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/80 p-1 text-white shadow-lg backdrop-blur-md">
        <button
          ref={musicButtonRef}
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause music' : 'Play music'}
          title={playing ? 'Pause music' : 'Play music'}
          className="grid size-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15"
        >
          <PlaybackIcon playing={playing} />
        </button>
        <details className="relative">
          <summary
            aria-label="Audio settings"
            title="Audio settings"
            className="grid size-10 cursor-pointer list-none place-items-center rounded-full transition-colors hover:bg-white/15 [&::-webkit-details-marker]:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
              <path d="M3 9v6h4l5 4V5L7 9H3zM16 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12" />
            </svg>
          </summary>
          <div className="absolute end-0 bottom-full mb-3 w-52 rounded-2xl border border-white/15 bg-[#151515] px-3 py-2 shadow-xl">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                aria-label="Audio volume"
                aria-valuetext={volume + '%'}
                value={volume}
                onChange={(event) => updateVolume(event.currentTarget.valueAsNumber)}
                className="min-w-0 flex-1 cursor-pointer accent-amber-300"
              />
              <span aria-hidden="true" className="w-9 text-end text-xs tabular-nums text-white/75">{volume}%</span>
            </div>
            <label className="mt-2 flex min-h-7 cursor-pointer items-center justify-between gap-2 text-xs text-white/85">
              Hover sounds
              <input
                type="checkbox"
                checked={hoverSounds === true}
                disabled={hoverSounds === null}
                onChange={(event) => setHoverSounds(event.currentTarget.checked)}
                className="size-4 accent-amber-300"
              />
            </label>
          </div>
        </details>
      </div>
      {unavailable && <p role="status" className="absolute end-0 bottom-full mb-3 w-max rounded-xl bg-[#151515] px-3 py-2 text-xs text-white">Music could not start.</p>}
    </div>
  );
};
