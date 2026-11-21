import { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { assetUrl } from './assets';
import { ArrowUpRight, PlaybackIcon, SectionHeader } from './primitives';

const STILL = assetUrl('/media/portfolio/minecraft-still.webp');

const DEV_LOGS = [
  { id: 'rF1zqZPg2l4', title: 'Boss development, part 3', image: '/media/portfolio/minecraft-boss.jpg' },
  { id: '64d1ysI9420', title: 'HNPE reforge system', image: '/media/portfolio/minecraft-reforge.jpg' },
  { id: 'aNxy0unvDGk', title: 'Job and class system', image: '/media/portfolio/minecraft-classes.jpg' },
  { id: '8IRspHLNfEA', title: 'Dungeon demo', image: '/media/portfolio/minecraft-dungeon.jpg' },
];

export const Minecraft = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef);
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const showVideo = inView && !reduceMotion;

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setManuallyPaused(false);
      void video.play().catch(() => setPlaying(false));
    } else {
      setManuallyPaused(true);
      video.pause();
    }
  };

  return (
    <section ref={sectionRef} id="minecraft" aria-label="Minecraft dev logs" className="relative isolate scroll-mt-8 overflow-hidden bg-[hsl(var(--bg))] py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {showVideo ? (
          <video
            ref={videoRef}
            src={assetUrl('/media/portfolio/minecraft-background.mp4')}
            poster={STILL}
            autoPlay={!manuallyPaused}
            muted
            loop
            playsInline
            tabIndex={-1}
            onLoadStart={() => setPlaying(false)}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="size-full object-cover opacity-80"
          />
        ) : (
          <img src={STILL} alt="" loading="lazy" className="size-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-[#0c0c0c]/75 via-[#0c0c0c]/40 to-[hsl(var(--bg))]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">
        <div className="mb-8 flex items-end justify-between gap-3 md:mb-11">
          <SectionHeader
            eyebrow="Game development"
            lead="Minecraft"
            accent="dev logs"
            subtext="Boss encounters, item reforging, class systems, and dungeon builds from my server projects."
            className="[--muted:0_0%_70%]"
          />
          {showVideo && (
            <button
              type="button"
              aria-label={playing ? 'Pause Minecraft background video' : 'Play Minecraft background video'}
              title={playing ? 'Pause Minecraft background video' : 'Play Minecraft background video'}
              onClick={toggleVideo}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/65 text-white transition-colors hover:bg-white/15"
            >
              <PlaybackIcon playing={playing} />
            </button>
          )}
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {DEV_LOGS.map((log) => (
            <li key={log.id} className="min-w-0">
              <a
                href={'https://www.youtube.com/watch?v=' + log.id}
                target="_blank"
                rel="noreferrer"
                className="group block h-full overflow-hidden rounded-2xl border border-white/15 bg-[#111111] transition-colors hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={assetUrl(log.image)} alt="" loading="lazy" decoding="async" className="hover-media size-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-black/20">
                    <span className="grid size-10 place-items-center rounded-full border border-white/35 bg-black/70 text-white transition-colors group-hover:bg-white group-hover:text-black group-focus-visible:bg-white group-focus-visible:text-black">
                      <PlaybackIcon playing={false} />
                    </span>
                  </span>
                </div>
                <span className="flex items-start justify-between gap-1.5 px-3 py-3 text-xs leading-snug font-medium text-white/90 sm:px-4 sm:text-sm">
                  {log.title} <ArrowUpRight className="size-3.5 shrink-0" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
