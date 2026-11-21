'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { twMerge as cn } from 'tailwind-merge';

import { assetUrl } from './assets';
import { ArrowUpRight, SectionHeader } from './primitives';
import { profile, projects } from './profile';

const SPANS = [
  'md:col-span-7',
  'md:col-span-5',
  'md:col-span-5',
  'md:col-span-7',
  'md:col-span-12 md:grid md:grid-cols-[3fr_2fr] md:items-center',
];

export const SelectedWorks = () => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [active, setActive] = React.useState<(typeof projects)[number] | null>(null);

  return (
    <section id="work" className="py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          lead="Featured"
          accent="projects"
          viewAll={{ label: 'GitHub profile', href: profile.github }}
          className="mb-10 md:mb-14"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6"
        >
          {projects.map((project, index) => (
            <motion.button
              key={project.id}
              type="button"
              aria-haspopup="dialog"
              aria-label={'View ' + project.title}
              aria-describedby={'summary-' + project.id}
              onClick={() => {
                setActive(project);
                dialogRef.current?.showModal();
              }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                'group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-3xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] text-start transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-4',
                SPANS[index],
              )}
            >
              <span className="block h-56 w-full overflow-hidden border-b border-[hsl(var(--stroke))] md:h-72">
                <img
                  src={assetUrl(project.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="hover-media size-full object-cover"
                />
              </span>
              <span className="block w-full p-5 sm:p-6">
                <span className="block text-xs text-[hsl(var(--muted))]">{project.category} · {project.visibility}</span>
                <span className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-display text-3xl leading-none sm:text-4xl">{project.title}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 transition-colors group-hover:bg-white group-hover:text-black group-focus-visible:bg-white group-focus-visible:text-black">
                    <ArrowUpRight className="size-4" />
                  </span>
                </span>
                <span id={'summary-' + project.id} className="mt-3 block text-sm text-[hsl(var(--muted))]">
                  {project.summary}
                </span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active?.title ?? 'Project details'}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="exploration-dialog m-auto max-h-[90dvh] w-11/12 max-w-3xl overflow-y-auto overscroll-contain rounded-3xl border border-white/15 bg-[hsl(var(--surface))] text-[hsl(var(--text))] backdrop:bg-black/80"
      >
        <div className="relative p-5 sm:p-8">
          <form method="dialog" className="absolute end-5 top-5 sm:end-8 sm:top-8">
            <button className="cursor-pointer rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">
              Close
            </button>
          </form>
          {active ? (
            <>
              <p className="pe-16 text-xs text-[hsl(var(--muted))]">{active.category} · {active.visibility}</p>
              <h2 className="font-display mt-2 pe-12 text-3xl leading-none sm:text-5xl">{active.title}</h2>
              <img src={assetUrl(active.image)} alt={active.imageAlt} className="mt-6 w-full rounded-2xl border border-white/10" />
              <p className="mt-5 text-sm leading-6 text-white/80">{active.details}</p>
              <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-2">
                {active.stack.map((item) => (
                  <li key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/75">{item}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {active.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/85">
                    {link.label} <ArrowUpRight />
                  </a>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </dialog>
    </section>
  );
};
