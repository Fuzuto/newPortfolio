# Trung Le · Portfolio

Personal portfolio for Trung Le (furyZ), a software developer working on web applications and game systems. [GitHub profile](https://github.com/Fuzuto)

## Run locally

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

`npm run build` type-checks the app and writes the static site to `dist/`. `npm run preview` serves the build. `npm test` verifies the bundled media references.

## UI components

Portfolio sections live in `src/portfolio`. Reusable shadcn-style components live in `src/components/ui`, which matches the `@/components/ui` import path used by registry components. The `@` alias points to `src`, and Tailwind CSS 4 loads from `src/index.css`.

The hero uses `AuroraBackground` from `src/components/ui/aurora-background.tsx`. The standalone Motion example is in `src/components/demos/aurora-background-demo.tsx`.

To manage components with the shadcn CLI, run `npx shadcn@latest init` in the project root. In the generated `components.json`, use `@/components/ui` for `aliases.ui` and `src/index.css` for `tailwind.css`. Leave `tailwind.config` blank for Tailwind 4. [shadcn Vite setup](https://ui.shadcn.com/docs/installation/vite) · [shadcn configuration](https://ui.shadcn.com/docs/components-json)

## Content and images

Edit profile, project descriptions, links, and technologies in `src/portfolio/profile.ts`.

- The NOIR landing screenshot and sample workspace images come from its public product tour. [NOIR workspace](https://www.noirnail.store/#workspace)
- REA captured the Paper Crane folding workspace and the Xiangqi board from local builds. The Paper Crane collection image uses a test fixture. [Paper Crane repository](https://github.com/Fuzuto/paper-crane) · [Xiangqi repository](https://github.com/Fuzuto/xiangqi-online)
- REA captured the Anatomy Atlas full-body and focused views from the live atlas. [Anatomy Atlas](https://fuzuto.github.io/Anatomy-Atlas/)
- The Meowize cover uses the repository's published dashboard screenshot. [Meowize Optimize](https://github.com/Fuzuto/Meowize-Optimize)
- The Minebox experience entry links to the official trailer and uses its preview thumbnail. [Minebox](https://minebox.co/) · [Official trailer](https://www.youtube.com/watch?v=b7SJ1Yg68L0)
- The hero layers a CSS aurora over an animated WebP from the supplied background GIF. The hero's pause button controls both layers. The Minecraft section uses a silent web encode of the supplied Medal clip and links to four dev logs. Both sections use still images with reduced motion.
- Background music from the original bio and hover sounds are on by default. If autoplay is blocked, music starts after the first click or keypress. The audio settings use a shared volume stored on the device and a separate hover sound switch. [Original portfolio](https://github.com/Fuzuto/bio)
- Technology icons use Simple Icons, Devicon, and three local symbols. [Simple Icons](https://github.com/simple-icons/simple-icons) · [Devicon](https://github.com/devicons/devicon)
