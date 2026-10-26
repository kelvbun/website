// app/api/now-playing/route.ts
//
// Spotify is the source of truth when it is playing: its API reports the real
// playback position, so the progress bar is genuinely in sync.
// Last.fm is the fallback (it only knows *what* played, never *where* in the
// song you are), so in that case no progress bar is shown.
import { NextResponse } from "next/server";

const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f"; // Last.fm's "no artwork" image

type Result = {
  name: string;
  artist: string;
  album: string;
  url: string;
  image: string | null;
  nowPlaying: boolean;
  paused: boolean;
  durationMs: number;
  elapsedMs: number | null; // only set when it is the real position
};

// ---------- Spotify ----------

let cached: { token: string; expires: number } | null = null;

async function spotifyToken(): Promise<string | null> {
  if (cached && cached.expires > Date.now() + 30_000) return cached.token;

  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = await res.json();
  cached = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 1000,
  };
  return cached.token;
}

type SpotifyItem = {
  name: string;
  duration_ms?: number;
  external_urls?: { spotify?: string };
  artists?: { name: string }[];
  album?: { name: string; images?: { url: string }[] };
  show?: { name: string; publisher?: string };
  images?: { url: string }[];
};

async function fromSpotify(): Promise<Result | null> {
  const token = await spotifyToken();
  if (!token) return null;

  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode",
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (res.status === 204 || !res.ok) return null; // 204 = nothing playing

  const d = await res.json();
  const item: SpotifyItem | null = d?.item ?? null;
  if (!item) return null;

  return {
    name: item.name,
    artist:
      item.artists?.map((a) => a.name).join(", ") ??
      item.show?.publisher ??
      "",
    album: item.album?.name ?? item.show?.name ?? "",
    url: item.external_urls?.spotify ?? "",
    image: (item.album?.images ?? item.images)?.[0]?.url ?? null,
    nowPlaying: true,
    paused: !d.is_playing,
    durationMs: item.duration_ms ?? 0,
    elapsedMs: typeof d.progress_ms === "number" ? d.progress_ms : null,
  };
}

// ---------- Last.fm (fallback) ----------

type LastfmImage = { size: string; "#text": string };

async function fromLastfm(): Promise<Result | null> {
  const key = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USERNAME;
  if (!key || !user) return null;

  const qs = new URLSearchParams({
    method: "user.getrecenttracks",
    user,
    api_key: key,
    format: "json",
    limit: "1",
  });
  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${qs}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = await res.json();
  const list = data?.recenttracks?.track;
  const t = Array.isArray(list) ? list[0] : list;
  if (!t) return null;

  const images: LastfmImage[] = t.image ?? [];
  const art =
    images.find((i) => i.size === "extralarge")?.["#text"] ||
    images.at(-1)?.["#text"] ||
    "";

  return {
    name: t.name,
    artist: t.artist?.["#text"] ?? "",
    album: t.album?.["#text"] ?? "",
    url: t.url,
    image: art && !art.includes(PLACEHOLDER) ? art : null,
    nowPlaying: t["@attr"]?.nowplaying === "true",
    paused: false,
    durationMs: 0,
    elapsedMs: null,
  };
}

export async function GET() {
  const hasSpotify = !!process.env.SPOTIFY_REFRESH_TOKEN;
  const hasLastfm = !!process.env.LASTFM_API_KEY && !!process.env.LASTFM_USERNAME;

  if (!hasSpotify && !hasLastfm) {
    return NextResponse.json(
      { error: "Set the Spotify or Last.fm variables in .env.local" },
      { status: 500 },
    );
  }

  try {
    const spotify = await fromSpotify().catch(() => null);
    const track = spotify ?? (await fromLastfm().catch(() => null));
    return NextResponse.json({ track });
  } catch {
    return NextResponse.json({ track: null }, { status: 502 });
  }
}
