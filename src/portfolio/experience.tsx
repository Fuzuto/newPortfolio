import { assetUrl } from './assets';
import { ArrowUpRight, RingLink } from './primitives';

const TRAILER = 'https://www.youtube.com/watch?v=b7SJ1Yg68L0';

export const Experience = () => (
  <section id="experience" aria-labelledby="experience-title" className="py-16 md:py-24">
    <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
      <h2 id="experience-title" className="mb-10 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">Experience</h2>
      <article className="grid overflow-hidden rounded-3xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 sm:p-9">
          <p className="text-xs tracking-widest text-[hsl(var(--muted))] uppercase">6-month internship</p>
          <h3 className="font-display mt-3 text-4xl leading-none italic sm:text-5xl">Minebox</h3>
          <p className="mt-3 text-base text-white/85">Design &amp; Development Intern</p>
          <ul aria-label="Minebox technologies" className="mt-5 flex flex-wrap gap-2">
            {['Minecraft', 'Java', 'Blockbench'].map((item) => (
              <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">{item}</li>
            ))}
          </ul>
          <RingLink
            href="https://minebox.co/"
            target="_blank"
            outerClassName="mt-6 w-fit"
            innerClassName="border border-white/15 bg-[hsl(var(--surface))] px-4 py-2 text-sm hover:bg-white/10"
          >
            Minebox website <ArrowUpRight />
          </RingLink>
        </div>
        <a href={TRAILER} target="_blank" rel="noreferrer" className="group relative grid min-h-60 items-end overflow-hidden">
          <img
            src={assetUrl('/media/portfolio/minebox-trailer.jpg')}
            alt=""
            loading="lazy"
            decoding="async"
            className="hover-media absolute inset-0 size-full object-cover"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent" />
          <span className="relative m-6 flex items-center justify-between gap-2 text-sm font-medium text-white">
            Watch the official Minebox trailer
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/30 bg-black/40 transition-colors group-hover:bg-white group-hover:text-black group-focus-visible:bg-white group-focus-visible:text-black">
              <ArrowUpRight className="size-4" />
            </span>
          </span>
        </a>
      </article>
    </div>
  </section>
);
