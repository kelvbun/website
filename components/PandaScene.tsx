"use client";

// components/PandaScene.tsx
// Hosts your Three.js panda. The scene code lives in ./panda-scene.ts and is
// loaded on demand, so three.js stays out of the first page load.
import { useEffect, useRef, useState } from "react";

export default function PandaScene() {
  const ref = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import("./PandaModel")
      .then(({ mountPanda }) => {
        if (cancelled) return; // unmounted (or React strict mode) before it loaded
        cleanup = mountPanda(el);
      })
      .catch((err) => {
        console.warn("Panda scene failed to load", err);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Panda. Click to make it cheer."
      className="
        relative block h-full w-full cursor-pointer overflow-hidden
        focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4
        [&>canvas]:absolute [&>canvas]:inset-0 [&>canvas]:h-full! [&>canvas]:w-full!
      "
    >
      {failed && (
        <span className="absolute inset-0 flex items-center justify-center text-sm opacity-60">
          Panda
        </span>
      )}
    </button>
  );
}
