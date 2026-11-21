import type { CSSProperties } from 'react';
import { assetUrl } from './assets';
import { stackGroups } from './profile';
import { SectionHeader } from './primitives';

export const Stack = () => (
  <section id="stack" className="py-16 md:py-24">
    <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
      <SectionHeader eyebrow="Stack" lead="Languages &" accent="tools" className="mb-10 md:mb-14" />
      <div className="grid gap-4 md:grid-cols-3">
        {stackGroups.map((group) => (
          <section key={group.title} className="rounded-3xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]/50 p-6">
            <h3 className="mb-5 text-sm font-medium text-[hsl(var(--text))]">{group.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item.label}
                  className="tech-badge inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs"
                  style={{ '--tech-color': item.color } as CSSProperties}
                >
                  <span
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                    style={{ backgroundColor: item.color, mask: `url("${assetUrl(`/icons/${item.icon}.svg`)}") center / contain no-repeat` }}
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  </section>
);
