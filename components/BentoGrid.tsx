// components/BentoGrid.tsx
// Layout copied from the reference: a 6 x 6 mosaic where most cells are 1x1
// and a few are wide (2x1), tall (1x2 / 1x3) or large (2x2 / 3x2).
//
// Desktop (md+): fixed 6x6 square grid, every tile placed explicitly.
// Mobile: 2 columns, big tiles go full-width, the rest flow in order.

import Link from "next/link";
import type { ReactNode } from "react";
import NowPlaying from "./NowPlaying";
import PandaHead from "./PandaHead";
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
    id: "panda",
    place: "desk:col-start-3 desk:row-start-1",
    tone: "bare",
    flush: true,
    body: <PandaHead />,
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
    id: "location",
    place: "desk:col-start-1 desk:row-start-2",
    tone: "stone",
    body: <p className="text-sm">City, Country</p>,
  },
  {
    id: "about",
    place: "col-span-2 row-span-2 desk:col-start-2 desk:col-span-3 desk:row-start-2 desk:row-span-2",
    tone: "paper",
    body: (
      <div className="flex h-full flex-col justify-center">
        <p className="max-w-[28ch] text-2xl font-medium leading-snug desk:text-3xl">
          I build fast, accessible websites and the tools behind them.
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
    place: "desk:col-start-3 desk:row-start-4",
    href: "mailto:you@example.com",
    tone: "ink",
    body: <p className="text-sm font-medium">Email</p>,
  },
  {
    id: "blog",
    place: "desk:col-start-4 desk:row-start-4",
    href: "/blog",
    tone: "line",
    body: <p className="text-sm font-medium">Writing</p>,
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
    body: (
      <div className="flex h-full flex-col justify-end">
        <h3 className="text-xl font-semibold">Project three</h3>
        <p className="text-sm opacity-70">Short description.</p>
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
    href: "/contact",
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
    id: "project-5",
    place: "col-span-2 desk:col-start-5 desk:col-span-2 desk:row-start-6",
    href: "/projects/five",
    tone: "paper",
    body: <p className="text-sm font-medium">Project five</p>,
  },
];

const tones: Record<Tile["tone"], string> = {
  paper: "bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50",
  ink: "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900",
  stone: "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
  line: "border border-neutral-300 bg-transparent text-neutral-900 dark:border-neutral-700 dark:text-neutral-100",
  bare: "bg-transparent text-neutral-900 dark:text-neutral-100", // no box: the content is the shape
};

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
          const cls = `${t.place} ${tones[t.tone]} ${t.tone === "bare" ? "overflow-visible" : "overflow-hidden"} rounded-lg ${t.flush ? "p-0" : "p-4"} transition-transform motion-reduce:transition-none
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            ${t.href ? "hover:-translate-y-0.5" : ""}`;
          return t.href ? (
            <Link key={t.id} href={t.href} className={cls}>
              {t.body}
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
