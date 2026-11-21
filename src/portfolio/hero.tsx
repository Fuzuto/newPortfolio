'use client';

import * as React from 'react';
import gsap from 'gsap';
import { useInView, useReducedMotion } from 'motion/react';
import { twMerge as cn } from 'tailwind-merge';

import { AuroraBackground } from '@/components/ui/aurora-background';
import { assetUrl } from './assets';
import { ArrowUpRight, onAnchorClick, PlaybackIcon, RingLink } from './primitives';
import { profile } from './profile';

const NAV_LINKS = [
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Minecraft', href: '#minecraft', id: 'minecraft' },
  { label: 'Stack', href: '#stack', id: 'stack' },
];
const ROLES = ['web applications', 'game systems', 'interactive tools'];
const ROLE_INTERVAL = 2000;
const SHOP_ANIMATION = assetUrl('/media/portfolio/shop-animation.webp');
const SHOP_STILL = assetUrl('/media/portfolio/shop-still.webp');

const Logo = ({ active }: { active: boolean }) => {
  return (
    <a
      href="#home"
      aria-label="Home"
      aria-current={active ? 'page' : undefined}
      onClick={(e) => onAnchorClick(e, '#home')}
      className="group relative flex size-9 shrink-0 items-center justify-center rounded-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105"
    >
      <span className="pf-gradient absolute inset-0 rounded-full" />
      <span className="absolute inset-0 rounded-full bg-[linear-gradient(270deg,color-mix(in_oklch,var(--primary)_55%,var(--background))_0%,var(--primary)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute inset-[1.5px] rounded-full bg-[hsl(var(--bg))]" />
      <span className="font-display relative text-[13px] leading-none italic">{profile.initials}</span>
    </a>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState('home');

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    for (const id of ['home', ...NAV_LINKS.map((link) => link.id)]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-4 md:px-4 md:pt-6">
      <div
        className={cn(
          'inline-flex items-center rounded-full border border-white/10 bg-[hsl(var(--surface))] px-2 py-2 backdrop-blur-md transition-shadow duration-300',
          scrolled && 'shadow-md shadow-black/10',
        )}
      >
        <Logo active={active === 'home'} />
        <span className="mx-1 hidden h-5 w-px bg-[hsl(var(--stroke))] sm:block" />
        <div className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => onAnchorClick(e, link.href)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-full px-2 py-1.5 text-xs whitespace-nowrap transition-colors duration-200 min-[360px]:px-3 sm:px-4 sm:py-2 sm:text-sm',
                  isActive
                    ? 'bg-[hsl(var(--stroke))]/50 text-[hsl(var(--text))]'
                    : 'text-[hsl(var(--muted))] hover:bg-[hsl(var(--stroke))]/50 hover:text-[hsl(var(--text))]',
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <span className="mx-1 hidden h-5 w-px bg-[hsl(var(--stroke))] sm:block" />
        <RingLink
          href="#contact"
          innerClassName="bg-[hsl(var(--surface))] px-2.5 py-1.5 text-xs whitespace-nowrap text-[hsl(var(--text))] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
        >
          Say hi
          <ArrowUpRight className="size-3 rtl:-scale-x-100" />
        </RingLink>
      </div>
    </nav>
  );
};

interface HeroProps {
  start?: boolean;
}

export const Hero = ({ start = true }: HeroProps) => {
  const rootRef = React.useRef<HTMLElement>(null);
  // Anchor navigation can leave the hero touching the viewport without any visible area.
  const inView = useInView(rootRef, { initial: true, margin: '-1px 0px' });
  const reduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = React.useState(0);
  const [animated, setAnimated] = React.useState(true);
  const playBackground = !reduceMotion && inView && animated;

  React.useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), ROLE_INTERVAL);

    return () => clearInterval(id);
  }, [reduceMotion]);

  React.useEffect(() => {
    if (!start) return;
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        gsap.set(['.name-reveal', '.lead-rise', '.blur-in'], {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        });

        return;
      }
      // The name and lead only slide: text that starts at opacity 0 holds back Largest Contentful Paint.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.name-reveal', { y: 50 }, { y: 0, duration: 1.2, delay: 0.1 })
        .fromTo('.lead-rise', { y: 20 }, { y: 0, duration: 1, stagger: 0.1 }, 0.3)
        .fromTo(
          '.blur-in',
          { opacity: 0, y: 20, filter: 'blur(10px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.1,
          },
          0.3,
        );
    }, rootRef);

    return () => ctx.revert();
  }, [start]);

  return (
    <section
      ref={rootRef}
      id="home"
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden"
    >
      <Navbar />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 isolate [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
        <img
          src={playBackground ? SHOP_ANIMATION : SHOP_STILL}
          alt=""
          className="size-full scale-[1.12] object-cover [image-rendering:pixelated] md:origin-left md:scale-[1.16]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/55 to-[hsl(var(--bg))]" />
        <AuroraBackground
          animate={playBackground}
          className="absolute inset-0 min-h-0 bg-transparent mix-blend-screen dark:bg-transparent"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="mb-8 text-xs tracking-[0.3em] text-white/85 uppercase opacity-0 blur-in">
          {profile.alias} · Software developer
        </span>
        <h1 className="name-reveal font-display mb-6 [transform:translateY(50px)] text-6xl leading-[0.9] tracking-tight italic motion-reduce:[transform:none] md:text-8xl lg:text-9xl">
          {profile.name}
        </h1>
        <p className="lead-rise mb-3 [transform:translateY(20px)] text-lg text-[hsl(var(--text))] motion-reduce:[transform:none] sm:text-xl">
          I build{' '}
          <span
            key={roleIndex}
            className="animate-role-fade-in font-display inline-block text-[hsl(var(--text))] italic"
          >
            {ROLES[roleIndex]}
          </span>.
        </p>
        <p className="lead-rise mb-12 max-w-md [transform:translateY(20px)] text-sm text-white/85 motion-reduce:[transform:none] md:text-base">
          {profile.bio}
        </p>
        <div className="inline-flex flex-wrap items-center justify-center gap-4 opacity-0 blur-in">
          <RingLink
            href="#work"
            innerClassName="bg-[hsl(var(--text))] px-7 py-3.5 text-sm text-[hsl(var(--bg))] group-hover:bg-[hsl(var(--bg))] group-hover:text-[hsl(var(--text))]"
          >
            View projects
          </RingLink>
          <RingLink
            href="#contact"
            innerClassName="border-2 border-[hsl(var(--stroke))] bg-[hsl(var(--bg))] px-7 py-3.5 text-sm text-[hsl(var(--text))] group-hover:border-transparent"
          >
            Get in touch
          </RingLink>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs tracking-[0.2em] text-[hsl(var(--muted))] uppercase">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-[hsl(var(--stroke))]">
          <span className="pf-gradient animate-scroll-down absolute inset-x-0 top-0 block h-1/2 w-full" />
        </span>
      </div>
      {!reduceMotion && (
        <button
          type="button"
          aria-label={animated ? 'Pause hero animation' : 'Play hero animation'}
          title={animated ? 'Pause hero animation' : 'Play hero animation'}
          onClick={() => setAnimated((value) => !value)}
          className="absolute start-4 bottom-5 z-10 grid size-10 cursor-pointer place-items-center rounded-full border border-white/15 bg-black/60 text-white/80 hover:bg-white/15 sm:start-6 sm:bottom-7"
        >
          <PlaybackIcon playing={animated} />
        </button>
      )}
    </section>
  );
};
