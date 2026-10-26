// app/api/now-playing/route.ts
import { NextResponse } from "next/server";

const API = "https://ws.audioscrobbler.com/2.0/";
const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f"; // Last.fm's "no artwork" image

type LastfmImage = { size: string; "#text": string };

// Track lengths never change, so remember them between requests.
const durations = new Map<string, number>(); // milliseconds

async function lastfm(params: Record<string, string>) {
  const qs = new URLSearchParams({
    ...params,
    api_key: process.env.LASTFM_API_KEY!,
    format: "json",
  });
  const res = await fetch(`${API}?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Last.fm responded ${res.status}`);
  return res.json();
}

// Fallback: Apple's free search API knows the length of most songs.
async function itunesDuration(artist: string, name: string): Promise<number> {
  try {
    const qs = new URLSearchParams({
      term: `${artist} ${name}`,
      entity: "song",
      limit: "5",
    });
    const res = await fetch(`https://itunes.apple.com/search?${qs}`, {
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const a = artist.toLowerCase();
    const hit = (data?.results ?? []).find((r: { artistName?: string }) => {
      const found = (r.artistName ?? "").toLowerCase();
      return found.includes(a) || a.includes(found);
    });
    return Number(hit?.trackTimeMillis) || 0;
  } catch {
    return 0;
  }
}

async function getDuration(artist: string, name: string): Promise<number> {
  const key = `${artist}::${name}`.toLowerCase();
  const cached = durations.get(key);
  if (cached !== undefined) return cached;

  let ms = 0;
  try {
    const data = await lastfm({
      method: "track.getInfo",
      artist,
      track: name,
      autocorrect: "1",
    });
    ms = Number(data?.track?.duration) || 0; // 0 = Last.fm doesn't know
  } catch {
    // fall through to the fallback
  }

  if (!ms) ms = await itunesDuration(artist, name);

  durations.set(key, ms);
  return ms;
}

export async function GET() {
  if (!process.env.LASTFM_API_KEY || !process.env.LASTFM_USERNAME) {
    return NextResponse.json(
      { error: "Set LASTFM_API_KEY and LASTFM_USERNAME in .env.local" },
      { status: 500 },
    );
  }

  try {
    const data = await lastfm({
      method: "user.getrecenttracks",
      user: process.env.LASTFM_USERNAME,
      limit: "2",
    });

    const list = data?.recenttracks?.track;
    const tracks = Array.isArray(list) ? list : list ? [list] : [];
    const t = tracks[0];
    if (!t) return NextResponse.json({ track: null });

    const artist: string = t.artist?.["#text"] ?? "";
    const name: string = t.name;
    const nowPlaying = t["@attr"]?.nowplaying === "true";

    const images: LastfmImage[] = t.image ?? [];
    const art =
      images.find((i) => i.size === "extralarge")?.["#text"] ||
      images.at(-1)?.["#text"] ||
      "";

    let durationMs = 0;
    let elapsedMs: number | null = null;

    if (nowPlaying) {
      const prev = tracks[1];
      const prevStartSec = Number(prev?.date?.uts) || 0;

      const [current, previous] = await Promise.all([
        getDuration(artist, name),
        prev && prevStartSec
          ? getDuration(prev.artist?.["#text"] ?? "", prev.name)
          : Promise.resolve(0),
      ]);
      durationMs = current;

      // Last.fm doesn't say where in the song you are. Best guess: this track
      // started when the previous scrobble started plus its length.
      if (durationMs > 0 && previous > 0) {
        const elapsed = Date.now() - (prevStartSec * 1000 + previous);
        if (elapsed >= 0 && elapsed <= durationMs + 5000) {
          elapsedMs = Math.min(elapsed, durationMs);
        }
      }
    }

    return NextResponse.json({
      track: {
        name,
        artist,
        album: t.album?.["#text"] ?? "",
        url: t.url,
        image: art && !art.includes(PLACEHOLDER) ? art : null,
        nowPlaying,
        durationMs,
        elapsedMs,
      },
    });
  } catch {
    return NextResponse.json({ track: null }, { status: 502 });
  }
}
