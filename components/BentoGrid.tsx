// components/BentoGrid.tsx
// Layout copied from the reference: a 6 x 6 mosaic where most cells are 1x1
// and a few are wide (2x1), tall (1x2 / 1x3) or large (2x2 / 3x2).
//
// Desktop (md+): fixed 6x6 square grid, every tile placed explicitly.
// Mobile: 2 columns, big tiles go full-width, the rest flow in order.

import Link from "next/link";
import type { ReactNode } from "react";
import NowPlaying from "./NowPlaying";
import PandaCover from "./PandaCover";
import Clock from "./Clock";
import DrawingBoard from "./DrawingBoard";
import ThemeToggle from "./ThemeToggle";

type Tile = {
  id: string;
  // Full literal class strings so Tailwind can see them.
  place: string;
  tone: "paper" | "ink" | "stone" | "line" | "bare";
  href?: string;
  flush?: boolean; // no padding, for tiles that fill themselves
  body: ReactNode;
};

const tiles: Tile[] = [
  // ROW 1
  {
    id: "name",
    place: "col-span-2 desk:col-start-1 desk:col-span-2 desk:row-start-1",
    tone: "ink",
    body: (
      <div className="flex h-full flex-col justify-end">
        <p className="text-lg font-semibold leading-tight desk:text-xl">Your Name</p>
        <p className="text-sm opacity-70">Frontend developer</p>
      </div>
    ),
  },
  {
    id: "blob",
    place: "desk:col-start-3 desk:row-start-1",
    tone: "line",
    body: <p className="text-sm font-medium">Blob</p>,
  },
  {
    id: "github",
    place: "desk:col-start-4 desk:row-start-1",
    href: "https://github.com/yourname",
    tone: "line",
    body: <p className="text-sm font-medium">GitHub</p>,
  },
  {
    id: "now-playing",
    place: "col-span-2 row-span-2 desk:col-start-5 desk:col-span-2 desk:row-start-1 desk:row-span-2",
    tone: "ink",
    flush: true,
    body: <NowPlaying />,
  },

  // ROW 2-3
  {
    id: "clock",
    place: "desk:col-start-1 desk:row-start-2",
    tone: "stone",
    body: <Clock timeZone="America/New_York" label="New York" />,
  },
  {
    id: "about",
    place: "col-span-2 row-span-2 desk:col-start-2 desk:col-span-3 desk:row-start-2 desk:row-span-2",
    tone: "paper",
    body: (
      <div className="flex h-full flex-col justify-center">
        <p className="max-w-[28ch] text-2xl font-medium leading-snug desk:text-3xl">
          I play pickleball. <br />
          I listen to krnb & crnb. <br />
          I explore new things. <br />
        </p>
      </div>
    ),
  },
  {
    id: "skills",
    place: "row-span-2 desk:col-start-1 desk:row-start-3 desk:row-span-2",
    tone: "ink",
    body: (
      <ul className="space-y-1 text-sm">
        <li>TypeScript</li>
        <li>React</li>
        <li>Next.js</li>
        <li>Node</li>
      </ul>
    ),
  },
  {
    id: "resume",
    place: "desk:col-start-5 desk:row-start-3",
    href: "/resume.pdf",
    tone: "line",
    body: <p className="text-sm font-medium">Résumé</p>,
  },
  {
    id: "theme",
    place: "desk:col-start-6 desk:row-start-3",
    tone: "stone",
    flush: true,
    body: <ThemeToggle />,
  },

  // ROW 4
  {
    id: "linkedin",
    place: "desk:col-start-2 desk:row-start-4",
    href: "https://linkedin.com/in/yourname",
    tone: "line",
    body: <p className="text-sm font-medium">LinkedIn</p>,
  },
  {
    id: "email",
    place: "desk:col-start-3 desk:col-span-2 desk:row-start-4",
    href: "mailto:you@example.com",
    tone: "ink",
    body: <p className="text-sm font-medium">Email</p>,
  },
  {
    id: "project-2",
    place: "col-span-2 desk:col-start-5 desk:col-span-2 desk:row-start-4",
    href: "/projects/two",
    tone: "paper",
    body: <p className="text-sm font-medium">Project two</p>,
  },

  // ROW 5-6
  {
    id: "project-3",
    place: "col-span-2 row-span-2 desk:col-start-1 desk:col-span-2 desk:row-start-5 desk:row-span-2",
    href: "/projects/three",
    tone: "paper",
    flush: true,
    body: (
      <div className="relative h-full w-full">
        <PandaCover />
        {/* readable caption over the scene */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent p-4 pt-12 text-white">
          <h3 className="text-xl font-semibold">Project three</h3>
          <p className="text-sm opacity-80">Short description.</p>
        </div>
      </div>
    ),
  },
  {
    id: "stack",
    place: "desk:col-start-3 desk:row-start-5",
    tone: "stone",
    body: <p className="text-sm">Stack</p>,
  },
  {
    id: "contact",
    place: "row-span-2 desk:col-start-4 desk:row-start-5 desk:row-span-2",
    tone: "ink",
    body: (
      <div className="flex h-full items-center justify-center">
        <p className="text-xl font-semibold [writing-mode:vertical-rl]">
          Let’s work together
        </p>
      </div>
    ),
  },
  {
    id: "project-4",
    place: "col-span-2 desk:col-start-5 desk:col-span-2 desk:row-start-5",
    href: "/projects/four",
    tone: "paper",
    body: <p className="text-sm font-medium">Project four</p>,
  },
  {
    id: "now",
    place: "desk:col-start-3 desk:row-start-6",
    tone: "line",
    body: <p className="text-sm">Now</p>,
  },
  {
    id: "board",
    place: "col-span-2 desk:col-start-5 desk:col-span-2 desk:row-start-6",
    tone: "paper",
    flush: true,
    body: <DrawingBoard />,
  },
];

const tones: Record<Tile["tone"], string> = {
  paper: "bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50",
  ink: "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900",
  stone: "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
  line: "border border-neutral-300 bg-transparent text-neutral-900 dark:border-neutral-700 dark:text-neutral-100",
  bare: "bg-transparent text-neutral-900 dark:text-neutral-100", // no box: the content is the shape
};

// Every tile eases its movement and shadow with a soft "settle" curve.
const base =
  "relative rounded-lg transition-[translate,scale,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

// Clickable tiles lift, grow slightly and gain a shadow on hover or keyboard
// focus, then press down when clicked. Reduced-motion users get no movement.
const linkFx = [
  "group hover:z-10",
  "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/50",
  "focus-visible:z-10 focus-visible:-translate-y-1 focus-visible:scale-[1.02] focus-visible:shadow-xl",
  "active:translate-y-0 active:scale-[0.98] active:duration-100",
  "motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
  "motion-reduce:focus-visible:translate-y-0 motion-reduce:focus-visible:scale-100",
].join(" ");

export default function BentoGrid() {
  return (
    <section className="flex w-full justify-center pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] desk:h-dvh desk:items-center">
      <div
        className="
          grid w-full grid-cols-2 auto-rows-[9rem] gap-3
          desk:aspect-square desk:w-[min(100%,calc(100dvh-2rem))]
          desk:grid-cols-[repeat(6,minmax(0,1fr))]
          desk:grid-rows-[repeat(6,minmax(0,1fr))]
          desk:auto-rows-auto desk:gap-3
        "
      >
        {tiles.map((t) => {
          const cls = [
            t.place,
            base,
            tones[t.tone],
            t.tone === "bare" ? "overflow-visible" : "overflow-hidden",
            t.flush ? "p-0" : "p-4",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            t.href ? linkFx : "",
          ].join(" ");

          return t.href ? (
            <Link key={t.id} href={t.href} className={cls}>
              {t.body}
              {/* corner arrow that slides in on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3 -translate-x-1 translate-y-1 text-sm opacity-0 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
              >
                ↗
              </span>
            </Link>
          ) : (
            <div key={t.id} className={cls}>
              {t.body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
