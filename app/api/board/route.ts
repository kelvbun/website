// app/api/board/route.ts
//
// The shared board is one Redis string: one character per pixel (0 = blank,
// 1-8 = palette colour). Everyone reads and paints the same string.
// With no Redis configured (local dev) it falls back to server memory.
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { BOARD_H, BOARD_W, MAX_COLOR } from "@/lib/board-config";

const KEY = "board:v1";
const SIZE = BOARD_W * BOARD_H;
const MAX_PIXELS_PER_REQUEST = 600;
const MAX_REQUESTS_PER_10S = 20;

// Vercel's Upstash integration names these KV_REST_API_*; Upstash itself
// calls them UPSTASH_REDIS_REST_*. Either works.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

// automaticDeserialization off: a board that is all digits must stay a string.
const redis = url && token ? new Redis({ url, token, automaticDeserialization: false }) : null;
const productionWithoutRedis = !redis && process.env.NODE_ENV === "production";

const memory: string[] = Array(SIZE).fill("0"); // dev-only fallback

export async function GET() {
  if (productionWithoutRedis) {
    return NextResponse.json({ error: "Board storage is not configured" }, { status: 503 });
  }

  try {
    let data = "";

    if (redis) {
      const raw = await redis.get<string>(KEY);
      data = raw ?? "";
    } else {
      data = memory.join("");
    }

    // Let Vercel's CDN share one Redis read between all visitors.
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=2, stale-while-revalidate=10",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Board unavailable" }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (productionWithoutRedis) {
    return NextResponse.json({ error: "Board storage is not configured" }, { status: 503 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  // px is a flat list: [index, colour, index, colour, ...]
  const px: unknown = Object(body).px;

  if (!Array.isArray(px) || px.length % 2 !== 0 || px.length > MAX_PIXELS_PER_REQUEST * 2) {
    return NextResponse.json({ error: "Bad pixels" }, { status: 400 });
  }

  const pairs: [number, number][] = [];

  for (let i = 0; i < px.length; i += 2) {
    const idx = px[i];
    const color = px[i + 1];

    if (
      !isInteger(idx) ||
      !isInteger(color) ||
      idx < 0 ||
      idx >= SIZE ||
      color < 0 ||
      color > MAX_COLOR
    ) {
      return NextResponse.json({ error: "Bad pixel" }, { status: 400 });
    }

    pairs.push([idx, color]);
  }

  if (pairs.length === 0) return NextResponse.json({ ok: true });

  try {
    if (redis) {
      // simple per-visitor rate limit
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
      const limitKey = `board:rl:${ip}`;
      const count = await redis.incr(limitKey);

      if (count === 1) await redis.expire(limitKey, 10);

      if (count > MAX_REQUESTS_PER_10S) {
        return NextResponse.json({ error: "Slow down" }, { status: 429 });
      }

      const pipe = redis.pipeline();

      for (const [idx, color] of pairs) pipe.setrange(KEY, idx, color.toString(36));
      await pipe.exec();
    } else {
      for (const [idx, color] of pairs) memory[idx] = color.toString(36);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Board unavailable" }, { status: 502 });
  }
}

function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}
