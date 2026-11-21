'use client';

import * as React from 'react';
import { MotionConfig } from 'motion/react';

import { KineticGrid } from '@/components/ui/kinetic-grid';
import { Contact } from './contact';
import { Experience } from './experience';
import { Explorations } from './explorations';
import { Hero } from './hero';
import { Journal } from './journal';
import { LoadingScreen } from './loading-screen';
import { Minecraft } from './minecraft';
import { Music } from './music';
import { SelectedWorks } from './selected-works';
import { Stack } from './stack';
import { Stats } from './stats';
import { PORTFOLIO_STYLES } from './styles';

const Portfolio = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div
      data-slot="portfolio"
      className="relative isolate min-h-svh bg-[hsl(var(--bg))] text-[hsl(var(--text))] antialiased"
    >
      <style dangerouslySetInnerHTML={{ __html: PORTFOLIO_STYLES }} />
      <KineticGrid />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[10000] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <MotionConfig reducedMotion="user">
        {isLoading ? <LoadingScreen onComplete={() => setIsLoading(false)} /> : null}

        <main id="main-content" tabIndex={-1}>
          <Hero start={!isLoading} />
          <SelectedWorks />
          <Experience />
          <Minecraft />
          <Journal />
          <Explorations />
          <Stats />
          <Stack />
        </main>
        <Contact />
        <Music />
      </MotionConfig>
    </div>
  );
};

export default Portfolio;
