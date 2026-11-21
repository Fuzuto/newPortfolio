'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps extends ComponentProps<'div'> {
  showRadialGradient?: boolean;
  animate?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  animate = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      {...props}
      className={cn(
        'relative isolate flex min-h-dvh flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900 dark:text-white',
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={cn(
            'aurora-glow motion-safe:after:animate-aurora',
            showRadialGradient && 'mask-[radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]',
            !animate && '[--aurora-play-state:paused]',
          )}
        />
      </div>
      {children}
    </div>
  );
}
