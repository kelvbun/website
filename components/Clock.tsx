"use client";

// components/Clock.tsx
// Live clock for a fixed time zone. Text scales with the tile (container
// query units), so it fits in a small square at any screen size.
import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const getNow = () => Math.floor(Date.now() / 1000) * 1000;

type Props = {
  timeZone?: string; // any IANA zone; America/New_York follows EST/EDT automatically
  label?: string;
};

export default function Clock({
  timeZone = "America/New_York",
  label = "New York",
}: Props) {
  // 0 on the server and during hydration, so server and client markup match
  const now = useSyncExternalStore(subscribe, getNow, () => 0);

  if (!now) return <div className="h-full" aria-hidden="true" />;

  const date = new Date(now);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hour = get("hour");
  const minute = get("minute");
  const period = get("dayPeriod");
  const zone = get("timeZoneName"); // EST in winter, EDT in summer

  const h24 = Number(
    new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hourCycle: "h23" }).format(date),
  );
  const isDay = h24 >= 6 && h24 < 18;

  return (
    <div
      className="relative h-full [container-type:size]"
      role="timer"
      aria-label={`${label} time: ${hour}:${minute} ${period} ${zone}`}
    >
      {/* top-left: place */}
      <span className="absolute left-0 top-0 text-[9cqw] font-medium uppercase tracking-wider opacity-60">
        {label}
      </span>

      {/* top-right: day / night marker */}
      <svg
        viewBox="0 0 24 24"
        className="absolute right-0 top-0 h-[11cqw] w-[11cqw] opacity-60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isDay ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
        )}
      </svg>

      {/* bottom-left: the time */}
      <p className="absolute bottom-0 left-0 flex items-baseline gap-[2cqw] leading-none tabular-nums">
        <span className="text-[27cqw] font-semibold tracking-tight">
          {hour}
          <span className="motion-safe:animate-pulse">:</span>
          {minute}
        </span>
        <span className="text-[9cqw] font-medium opacity-60">{period}</span>
      </p>

      {/* bottom-right: zone */}
      <span className="absolute bottom-0 right-0 text-[9cqw] font-medium opacity-60">
        {zone}
      </span>
    </div>
  );
}
