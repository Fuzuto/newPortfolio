'use client';

import * as React from 'react';
import gsap from 'gsap';

import { assetUrl } from './assets';
import { ArrowUpRight, RingLink } from './primitives';
import { profile, socialLinks } from './profile';

const Marquee = () => {
  const trackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex overflow-hidden" aria-hidden="true">
      <div ref={trackRef} className="flex w-max shrink-0">
        {Array.from({ length: 2 }).map((_, group) => (
          <div key={group} className="flex shrink-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="font-display px-6 text-4xl tracking-tight whitespace-nowrap text-[hsl(var(--text))]/90 uppercase italic md:text-6xl"
              >
                Web apps &amp; game systems
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Contact = () => (
  <footer id="contact" className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-24">
    <Marquee />

    <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
      <div className="flex flex-col items-center py-16 text-center md:py-24">
        <h2 className="mb-6 text-xs tracking-[0.3em] text-[hsl(var(--muted))] uppercase">Contact</h2>
        <RingLink
          href={'mailto:' + profile.email}
          outerClassName="max-w-full"
          innerClassName="border border-[hsl(var(--stroke))] bg-[hsl(var(--bg))]/70 px-4 py-4 font-display text-2xl italic text-[hsl(var(--text))] backdrop-blur-md group-hover:border-transparent sm:px-6 sm:text-3xl md:text-4xl"
        >
          <span className="min-w-0 break-all">{profile.email}</span>
          <ArrowUpRight className="size-5 shrink-0" />
        </RingLink>
      </div>

      <div className="grid gap-8 border-t border-[hsl(var(--stroke))] pt-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.35fr]">
        <div>
          <p className="font-display text-4xl leading-none italic">{profile.name}</p>
          <p className="mt-2 text-sm text-[hsl(var(--muted))]">{profile.alias} · {profile.location}</p>
        </div>
        <section aria-label="Education">
          <p className="text-xs tracking-widest text-[hsl(var(--muted))] uppercase">Education</p>
          <a href={profile.school.href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium hover:underline">
            {profile.school.name} <ArrowUpRight className="size-3" />
          </a>
          <p className="mt-1 text-xs text-[hsl(var(--muted))]">Current student</p>
        </section>
        <nav aria-label="Social media" className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs tracking-widest text-[hsl(var(--muted))] uppercase">Socials</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm text-white/90 transition-colors hover:border-white/35 hover:bg-white/10"
                >
                  <span
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                    style={{ backgroundColor: social.color, mask: `url(${assetUrl('/icons/' + social.icon + '.svg')}) center / contain no-repeat` }}
                  />
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </footer>
);
