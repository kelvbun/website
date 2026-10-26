"use client";

// components/PandaHead.tsx
// The whole tile IS the panda: ears poke out of the top corners and the round
// head fills the rest of the square. Pupils follow the pointer.
import { useEffect, useRef, useState } from "react";

const MAX = 2.2; // how far the pupils can move, in SVG units

export default function PandaHead() {
  const ref = useRef<SVGSVGElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      const k = Math.min(len / 120, 1) * MAX; // ease in close to the panda
      setLook({ x: (dx / len) * k, y: (dy / len) * k });
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Panda"
      className="h-full w-full drop-shadow-md"
    >
      {/* ears */}
      <circle cx="19" cy="19" r="17" fill="#171717" />
      <circle cx="81" cy="19" r="17" fill="#171717" />

      {/* head */}
      <ellipse
        cx="50"
        cy="57"
        rx="48"
        ry="42"
        fill="#ffffff"
        stroke="#d4d4d4"
        strokeWidth="1.5"
      />

      {/* eye patches */}
      <ellipse cx="31" cy="52" rx="11" ry="14" transform="rotate(-22 31 52)" fill="#171717" />
      <ellipse cx="69" cy="52" rx="11" ry="14" transform="rotate(22 69 52)" fill="#171717" />

      {/* eyes */}
      <circle cx="32" cy="50" r="5" fill="#ffffff" />
      <circle cx="68" cy="50" r="5" fill="#ffffff" />
      <circle cx={32 + look.x} cy={50 + look.y} r="2.8" fill="#171717" />
      <circle cx={68 + look.x} cy={50 + look.y} r="2.8" fill="#171717" />

      {/* nose and mouth */}
      <ellipse cx="50" cy="68" rx="6.5" ry="4.5" fill="#171717" />
      <path
        d="M42 77 Q50 85 50 74 Q50 85 58 77"
        fill="none"
        stroke="#171717"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
