"use client";

// components/PandaCover.tsx
// Your Three.js panda as a non-interactive "cover image" for a link tile.
// It is a plain <div> (not a button), so it can sit inside a <Link>. The panda
// still follows the cursor, and it cheers when you hover the tile.
import { useEffect, useRef } from "react";

export default function PandaCover() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const tile = el.closest("a") ?? el.parentElement; // the whole tile
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Hovering the tile fires the same "cheer" your click handler runs.
    // A non-bubbling event reaches the panda without clicking the link.
    const cheer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      el.dispatchEvent(new Event("click"));
    };

    import("./PandaModel")
      .then(({ mountPanda }) => {
        if (cancelled) return;
        cleanup = mountPanda(el);
        tile?.addEventListener("pointerenter", cheer);
      })
      .catch((err) => console.warn("Panda scene failed to load", err));

    return () => {
      cancelled = true;
      tile?.removeEventListener("pointerenter", cheer);
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 [&>canvas]:absolute [&>canvas]:inset-0 [&>canvas]:h-full! [&>canvas]:w-full!"
    />
  );
}
