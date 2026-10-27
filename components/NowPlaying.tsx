"use client";

// components/NowPlaying.tsx
import { useEffect, useRef, useState } from "react";

type Track = {
  name: string;
  artist: string;
  album: string;
  url: string;
  image: string | null;
  nowPlaying: boolean;
  paused: boolean;
  durationMs: number;
  elapsedMs: number | null; // real playback position, or null if unknown
};

const fmt = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));

  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [receivedAt, setReceivedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const loadRef = useRef<() => void>(() => {});
  const lastEndFetch = useRef(0);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const sent = Date.now();

        const res = await fetch(`/api/now-playing?t=${sent}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!active) return;

        // The position was measured mid-request, so anchor to the midpoint.
        const at = Math.round((sent + Date.now()) / 2);
        setTrack(data.track ?? null);
        setReceivedAt(at);
        setNow(Date.now());
      } catch {
        // keep showing the last known track
      } finally {
        if (active) setLoaded(true);
      }
    }

    loadRef.current = load;
    load();
    const id = setInterval(load, 10_000);

    // browsers pause timers in background tabs, so refresh when you come back
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", load);

    return () => {
      active = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", load);
    };
  }, []);

  // Between refreshes, move the bar forward locally once a second.
  // Each refresh re-syncs it to Spotify's real position, so any seek, pause
  // or skip is corrected. At the end of a song, fetch the next track at once.
  const ticking =
    !!track &&
    track.nowPlaying &&
    !track.paused &&
    track.elapsedMs !== null &&
    track.durationMs > 0;

  useEffect(() => {
    if (!ticking || !track || track.elapsedMs === null) return;
    const base = track.elapsedMs;
    const duration = track.durationMs;

    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);

      if (base + (t - receivedAt) >= duration && t - lastEndFetch.current > 3000) {
        lastEndFetch.current = t;
        loadRef.current();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [ticking, track, receivedAt]);

  if (!loaded) {
    return <div className="h-full w-full animate-pulse bg-neutral-800" />;
  }

  if (!track) {
    return (
      <div className="flex h-full items-end p-4">
        <p className="text-sm opacity-70">Nothing playing</p>
      </div>
    );
  }

  const showProgress = track.durationMs > 0 && track.elapsedMs !== null;
  const live = track.nowPlaying && !track.paused;

  const elapsed = showProgress
    ? Math.min(
        Math.max((track.elapsedMs ?? 0) + (live ? now - receivedAt : 0), 0),
        track.durationMs,
      )
    : 0;

  const pct = showProgress ? (elapsed / track.durationMs) * 100 : 0;
  const label = track.paused ? "Paused" : track.nowPlaying ? "Now playing" : "Last played";

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noreferrer"
      className="group relative block h-full w-full"
    >
      {track.image && (
        // oxlint-disable-next-line nextjs/no-img-element
        <img
          src={track.image}
          alt={`Cover of ${track.album || track.name}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-4 text-white">
        <p className="w-fit rounded-full bg-black/60 px-3 py-1 text-sm backdrop-blur-md">{label}</p>
        <div>
          <p className="line-clamp-2 text-lg font-semibold leading-tight desk:text-xl">
            {track.name}
          </p>
          <p className="line-clamp-1 text-sm opacity-80">{track.artist}</p>

          {showProgress && (
            <div
              className="mt-3"
              role="progressbar"
              aria-label="Track progress"
              aria-valuemin={0}
              aria-valuemax={track.durationMs}
              aria-valuenow={elapsed}
            >
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs tabular-nums opacity-80">
                <span>{fmt(elapsed)}</span>
                <span>{fmt(track.durationMs)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
