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
  durationMs: number;
  elapsedMs: number | null; // null = server couldn't estimate it
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

  // Fallback clock: when this page first saw the current song.
  const firstSeen = useRef<{ key: string; at: number }>({ key: "", at: 0 });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`/api/now-playing?t=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!active) return;

        const next: Track | null = data.track ?? null;
        if (next) {
          const key = `${next.artist}::${next.name}`;
          if (firstSeen.current.key !== key) {
            firstSeen.current = { key, at: Date.now() };
          }
        }
        setTrack(next);
        setReceivedAt(Date.now());
        setNow(Date.now());
      } catch {
        // keep showing the last known track
      } finally {
        if (active) setLoaded(true);
      }
    }

    load();
    const id = setInterval(load, 15_000);

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

  // Tick once a second so the progress bar moves between refreshes.
  const playing = !!track?.nowPlaying;
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [playing]);

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

  const showProgress = track.nowPlaying && track.durationMs > 0;
  const rawElapsed =
    track.elapsedMs !== null
      ? track.elapsedMs + (now - receivedAt)
      : now - firstSeen.current.at;
  const elapsed = Math.min(Math.max(rawElapsed, 0), track.durationMs);
  const pct = showProgress ? (elapsed / track.durationMs) * 100 : 0;
  const sinceSeen = Math.max(0, now - firstSeen.current.at);

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noreferrer"
      className="group relative block h-full w-full"
    >
      {track.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={track.image}
          alt={`Cover of ${track.album || track.name}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-4 text-white">
        <p className="w-fit rounded-full bg-black/60 px-3 py-1 text-sm backdrop-blur-md">
          {track.nowPlaying ? "Now playing" : "Last played"}
        </p>
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

          {track.nowPlaying && !showProgress && (
            <p className="mt-2 text-xs tabular-nums opacity-80">
              {fmt(sinceSeen)}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
