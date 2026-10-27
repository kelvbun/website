"use client";

// components/DrawingBoard.tsx
// A pixel drawing board shared by every visitor. You paint locally at once;
// strokes are sent to /api/board in small batches, and everyone's strokes are
// pulled back every few seconds.
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { BOARD_H as H, BOARD_W as W, MAX_COLOR } from "@/lib/board-config";
import { drainBoardQueue } from "@/lib/board-outbox.js";

// Stored values 1..8 map to these; 0 is blank (the eraser).
const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#737373",
];

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixels = useRef(new Uint8Array(W * H));
  const pending = useRef(new Map<number, number>()); // not yet acknowledged by the server
  const recent = useRef(new Map<number, { c: number; until: number }>()); // sent, may not be in cached reads yet
  const sending = useRef(false);
  const saveFailed = useRef(false);
  const retryAt = useRef(0);
  const retryDelay = useRef(500);
  const mounted = useRef(false);
  const flushRef = useRef<() => Promise<void>>(async () => {});
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const keyboardCursor = useRef({ x: Math.floor(W / 2), y: Math.floor(H / 2) });
  const keyboardActive = useRef(false);
  const colorRef = useRef(5);

  const [color, setColor] = useState(5);
  const [status, setStatus] = useState<"loading" | "live" | "offline">("loading");
  const [empty, setEmpty] = useState(true);

  const redraw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    let any = false;

    for (let i = 0; i < W * H; i++) {
      const c = pixels.current[i];

      if (!c) continue;
      any = true;
      ctx.fillStyle = COLORS[c - 1];
      ctx.fillRect(i % W, Math.floor(i / W), 1, 1);
    }

    if (keyboardActive.current) {
      const { x, y } = keyboardCursor.current;
      ctx.lineWidth = 0.2;
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(x + 0.04, y + 0.04, 0.92, 0.92);
      ctx.lineWidth = 0.08;
      ctx.strokeStyle = "#111";
      ctx.strokeRect(x + 0.16, y + 0.16, 0.68, 0.68);
    }

    setEmpty(!any);
  }, []);

  // pull everyone's drawing
  const sync = useCallback(async () => {
    try {
      const res = await fetch("/api/board", { cache: "no-store" });

      if (!res.ok) throw new Error("bad response");
      // SAFETY: The same-origin GET handler returns a string `data` field on each successful response.
      const { data } = (await res.json()) as { data: string };

      if (!mounted.current) return;

      const next = new Uint8Array(W * H);

      for (let i = 0; i < W * H; i++) {
        const ch = data[i];
        const v = ch ? parseInt(ch, 36) : 0;
        next[i] = Number.isNaN(v) || v > MAX_COLOR ? 0 : v;
      }

      // keep my own fresh strokes on top so they don't flicker away
      const now = Date.now();

      for (const [idx, r] of recent.current) {
        if (r.until < now) recent.current.delete(idx);
        else next[idx] = r.c;
      }

      for (const [idx, c] of pending.current) next[idx] = c;

      pixels.current = next;
      redraw();
      setStatus(saveFailed.current ? "offline" : "live");
    } catch {
      setStatus("offline");
    }
  }, [redraw]);

  // send my strokes
  const flush = useCallback(async () => {
    if (sending.current || Date.now() < retryAt.current || pending.current.size === 0) return;

    sending.current = true;

    try {
      await drainBoardQueue(
        pending.current,
        async (batch) => {
          const res = await fetch("/api/board", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ px: batch.flat() }),
          });

          if (!res.ok) throw new Error("Could not save strokes");
        },
        (batch) => {
          const until = Date.now() + 8000;

          for (const [idx, c] of batch) recent.current.set(idx, { c, until });
        },
      );

      retryAt.current = 0;
      retryDelay.current = 500;
      saveFailed.current = false;

      if (mounted.current) setStatus("live");
    } catch {
      retryAt.current = Date.now() + retryDelay.current;
      retryDelay.current = Math.min(retryDelay.current * 2, 8000);
      saveFailed.current = true;

      if (mounted.current) setStatus("offline");
    } finally {
      sending.current = false;

      if (pending.current.size > 0) {
        const delay = Math.max(retryAt.current - Date.now(), 0);

        window.setTimeout(() => void flushRef.current(), delay);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    flushRef.current = flush;
    mounted.current = true;
    let visible = true;
    sync();

    const poll = setInterval(() => {
      if (visible && !document.hidden) sync();
    }, 5000);

    const send = setInterval(flush, 500);

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);

      if (visible) sync();
    });

    observer.observe(canvas);

    const onVisible = () => {
      if (!document.hidden) sync();
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted.current = false;
      clearInterval(poll);
      clearInterval(send);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      flush();
    };
  }, [sync, flush]);

  const plot = useCallback((x: number, y: number) => {
    const idx = y * W + x;
    const c = colorRef.current;

    if (pixels.current[idx] === c) return;
    pixels.current[idx] = c;

    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      if (c === 0) ctx.clearRect(x, y, 1, 1);
      else {
        ctx.fillStyle = COLORS[c - 1];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    pending.current.set(idx, c);

    if (c) setEmpty(false);
  }, []);

  // connect two points so fast strokes have no gaps (Bresenham)
  const line = useCallback(
    (x0: number, y0: number, x1: number, y1: number) => {
      const dx = Math.abs(x1 - x0);
      const dy = -Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;

      for (;;) {
        plot(x0, y0);

        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;

        if (e2 >= dy) {
          err += dy;
          x0 += sx;
        }

        if (e2 <= dx) {
          err += dx;
          y0 += sy;
        }
      }
    },
    [plot],
  );

  function cellAt(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * W);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * H);

    return {
      x: Math.min(Math.max(x, 0), W - 1),
      y: Math.min(Math.max(y, 0), H - 1),
    };
  }

  function onPointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    keyboardActive.current = false;
    redraw();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const cell = cellAt(event);
    plot(cell.x, cell.y);
    last.current = cell;
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLCanvasElement>) {
    const cursor = keyboardCursor.current;

    if (event.key.startsWith("Arrow")) {
      event.preventDefault();

      if (event.key === "ArrowLeft") cursor.x = Math.max(0, cursor.x - 1);

      if (event.key === "ArrowRight") cursor.x = Math.min(W - 1, cursor.x + 1);

      if (event.key === "ArrowUp") cursor.y = Math.max(0, cursor.y - 1);

      if (event.key === "ArrowDown") cursor.y = Math.min(H - 1, cursor.y + 1);

      keyboardActive.current = true;
      redraw();

      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      plot(cursor.x, cursor.y);
      redraw();
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const cell = cellAt(event);
    line(last.current.x, last.current.y, cell.x, cell.y);
    last.current = cell;
  }

  function endStroke() {
    drawing.current = false;
    last.current = null;
    flush();
  }

  function pick(c: number) {
    colorRef.current = c;
    setColor(c);
  }

  return (
    <div className="group/board relative h-full w-full select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        tabIndex={0}
        role="img"
        aria-label="Shared drawing board. Use arrow keys to move, then Space or Enter to draw with the selected color."
        aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Space Enter"
        onFocus={() => {
          keyboardActive.current = true;
          redraw();
        }}
        onBlur={() => {
          keyboardActive.current = false;
          redraw();
        }}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        className="absolute inset-0 h-full w-full cursor-crosshair touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current [image-rendering:pixelated]"
      />

      {/* empty-board hint */}
      {empty && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm opacity-40">
          Draw something
        </p>
      )}

      {/* label + connection dot */}
      <div className="pointer-events-none absolute left-2 top-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider opacity-60">
        <span
          className={`size-1.5 rounded-full ${
            status === "live"
              ? "bg-emerald-500"
              : status === "offline"
                ? "bg-neutral-400"
                : "bg-amber-400"
          }`}
        />
        Shared board
      </div>

      {/* palette: shows on hover/focus, always visible on touch screens */}
      <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-center gap-1 rounded-full bg-black/45 px-2 py-1 opacity-0 backdrop-blur-md transition-opacity duration-200 group-focus-within/board:opacity-100 group-hover/board:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100">
        {COLORS.map((hex, i) => (
          <button
            key={hex}
            type="button"
            aria-label={`Draw with color ${i + 1}`}
            aria-pressed={color === i + 1}
            onClick={() => pick(i + 1)}
            style={{ backgroundColor: hex }}
            className={`size-3 rounded-full transition-transform [@media(hover:none)]:size-4 ${
              color === i + 1 ? "scale-125 ring-2 ring-white" : "hover:scale-110"
            }`}
          />
        ))}
        <button
          type="button"
          aria-label="Eraser"
          aria-pressed={color === 0}
          onClick={() => pick(0)}
          className={`size-3 rounded-full border border-white/80 bg-transparent transition-transform [@media(hover:none)]:size-4 ${
            color === 0 ? "scale-125 ring-2 ring-white" : "hover:scale-110"
          }`}
        />
      </div>
    </div>
  );
}
