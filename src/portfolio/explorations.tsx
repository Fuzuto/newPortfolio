'use client';

import * as React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { assetUrl } from './assets';
import { ArrowUpRight, RingLink } from './primitives';
import { profile } from './profile';

const ITEMS = [
  {
    image: '/media/portfolio/noir-turns.webp',
    label: 'NOIR technician turn rotation',
    rotate: -4,
  },
  {
    image: '/media/portfolio/meowize-optimize.png',
    label: 'Meowize Optimize dashboard',
    rotate: 3,
  },
  {
    image: '/media/portfolio/anatomy-focus.png',
    label: 'Anatomy Atlas muscle focus',
    rotate: -2,
  },
  {
    image: '/media/portfolio/xiangqi-board.png',
    label: 'Xiangqi Online game board',
    rotate: 4,
  },
  {
    image: '/media/portfolio/noir-dashboard.webp',
    label: 'NOIR sample salon floor plan',
    rotate: -3,
  },
  {
    image: '/media/portfolio/paper-crane-collection.png',
    label: 'A saved crane in the Paper Crane collection',
    rotate: 2,
  },
];

interface CardProps {
  image: string;
  label: string;
  rotate: number;
  onOpen: () => void;
}

const Card = ({ image, label, rotate, onOpen }: CardProps) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={'Preview ' + label}
      aria-haspopup="dialog"
      style={{ rotate: `${rotate}deg` }}
      className="pointer-events-auto block w-full max-w-[320px] cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <img
        src={assetUrl(image)}
        alt=""
        loading="lazy"
        decoding="async"
        className="hover-media aspect-square w-full rounded-2xl border border-[hsl(var(--stroke))] object-cover"
      />
    </button>
  );
};

export const Explorations = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);
  const col1Ref = React.useRef<HTMLDivElement>(null);
  const col2Ref = React.useRef<HTMLDivElement>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [active, setActive] = React.useState<(typeof ITEMS)[number] | null>(null);

  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinRef.current,
        pinSpacing: false,
      });
      const scrub = (yPercent: number) => ({
        yPercent,
        ease: 'none' as const,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
      gsap.to(col1Ref.current, scrub(-10));
      gsap.to(col2Ref.current, scrub(-26));
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const open = (item: (typeof ITEMS)[number]) => {
    setActive(item);
    dialogRef.current?.showModal();
  };

  return (
    <section ref={sectionRef} id="explorations" className="relative min-h-[300vh] overflow-clip">
      <div ref={pinRef} className="pointer-events-none relative z-10 flex h-svh items-center justify-center">
        <div className="px-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[hsl(var(--stroke))]" />
            <span className="text-xs tracking-[0.3em] text-[hsl(var(--muted))] uppercase">Gallery</span>
            <span className="h-px w-8 bg-[hsl(var(--stroke))]" />
          </div>
          <h2 className="mt-5 text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Projects <span className="font-display font-normal italic">in view</span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-[hsl(var(--muted))]">
            A closer look at the interfaces and interactions.
          </p>
          <div className="pointer-events-auto mt-7 flex justify-center">
            <RingLink
              href={profile.github}
              target="_blank"
              innerClassName="bg-[hsl(var(--surface))] px-5 py-2.5 text-sm text-[hsl(var(--text))] backdrop-blur-md"
            >
              GitHub
              <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
            </RingLink>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-2 gap-12 px-6 md:gap-40">
          <div ref={col1Ref} className="flex flex-col items-center gap-[28vh] pt-[36vh]">
            {ITEMS.slice(0, 3).map((item) => (
              <Card key={item.image} {...item} onOpen={() => open(item)} />
            ))}
          </div>
          <div ref={col2Ref} className="flex flex-col items-center gap-[28vh] pt-[64vh]">
            {ITEMS.slice(3, 6).map((item) => (
              <Card key={item.image} {...item} onOpen={() => open(item)} />
            ))}
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active?.label ?? 'Project screenshot'}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="exploration-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overscroll-contain items-center justify-center bg-black/90 p-6 text-white open:flex backdrop:bg-transparent"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => dialogRef.current?.close()}
          className="absolute end-6 top-6 inline-grid size-10 cursor-pointer place-items-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-4"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        {active ? (
          <img src={assetUrl(active.image)} alt={active.label} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain" />
        ) : null}
      </dialog>
    </section>
  );
};
