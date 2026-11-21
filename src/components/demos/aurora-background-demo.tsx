'use client';

import { motion, useReducedMotion } from 'motion/react';
import { AuroraBackground } from '@/components/ui/aurora-background';

export function AuroraBackgroundDemo() {
  const reduceMotion = useReducedMotion();

  return (
    <AuroraBackground>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
        className="relative flex flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <div className="text-3xl font-bold md:text-7xl">Background lights are cool you know.</div>
        <div className="py-4 text-base font-extralight dark:text-neutral-200 md:text-4xl">
          And this, is chemical burn.
        </div>
        <button type="button" className="w-fit rounded-full bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          Debug now
        </button>
      </motion.div>
    </AuroraBackground>
  );
}
