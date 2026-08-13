# website

Redirect stub. Every path 307s to <https://baobun.dev>.

The redirect lives in [next.config.ts](next.config.ts); [src/app/page.tsx](src/app/page.tsx)
is a fallback for hosts that ignore config-level redirects. Flip `permanent: true`
to make it a 308 once the move is final.

The previous site is in git history — see the commits before this one on `v2`.

```bash
bun install
bun run dev
```
