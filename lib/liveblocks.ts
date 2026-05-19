import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#F87171", // red
  "#FB923C", // orange
  "#FACC15", // yellow
  "#4ADE80", // green
  "#34D399", // emerald
  "#22D3EE", // cyan
  "#60A5FA", // blue
  "#A78BFA", // violet
  "#F472B6", // pink
  "#E879F9", // fuchsia
];

export function getUserCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash * 31) + userId.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

declare global {
  // eslint-disable-next-line no-var
  var __liveblocks: Liveblocks | undefined;
}

// Lazy singleton — defers construction until first call so that the
// missing-key validation inside new Liveblocks() does not fire during
// Next.js static page collection at build time.
export function getLiveblocks(): Liveblocks {
  if (!global.__liveblocks) {
    global.__liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    });
  }
  return global.__liveblocks;
}
