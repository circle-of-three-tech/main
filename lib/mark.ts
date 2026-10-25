/** Geometry for the Co3 mark: three isometric cubes inside a ring (viewBox 0 0 100 100). */
const K = 0.866;

export type Cube = { top: string; left: string; right: string };

function cube(cx: number, cy: number, s: number): Cube {
  const p = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  return {
    top: p([[cx, cy - s], [cx + K * s, cy - s / 2], [cx, cy], [cx - K * s, cy - s / 2]]),
    left: p([[cx - K * s, cy - s / 2], [cx, cy], [cx, cy + s], [cx - K * s, cy + s / 2]]),
    right: p([[cx, cy], [cx + K * s, cy - s / 2], [cx + K * s, cy + s / 2], [cx, cy + s]]),
  };
}

export const CUBES: Cube[] = [cube(50, 33, 12), cube(38.6, 55, 12), cube(61.4, 55, 12)];

/** Blue shades for the three cube faces: lit top, mid left, deep right (matches --mark-* tokens). */
export const MARK_BLUES = { top: "#9BD6FF", left: "#38A6F7", right: "#1F86EC", ringFrom: "#8FD0FF", ringTo: "#2EA3F7" };
/** Sun-amber accent shades for the top cube. */
export const MARK_ACCENT = { top: "#FFD28F", left: "#FFAD33", right: "#F08C00" };

/** Standalone SVG of the mark for icons, OG images and structured data. `bg` fills the ring (and the whole tile when `tile` is set). */
export function markSvg({ fg = "#FFFFFF", bg = "#08325F", text = true, tile = false } = {}) {
  const b = MARK_BLUES;
  const face = (pts: string, fill: string) => `<polygon points="${pts}" fill="${fill}" stroke="${fg}" stroke-width="1.4" stroke-linejoin="round"/>`;
  const cubes = CUBES.map((c, i) => {
    const f = i === 0 ? MARK_ACCENT : b;
    return face(c.top, f.top) + face(c.left, f.left) + face(c.right, f.right);
  }).join("");
  const label = text
    ? `<text x="50" y="84" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="11" letter-spacing="1" fill="${fg}">Co3</text>`
    : "";
  const back = tile ? `<rect width="100" height="100" fill="${bg}"/>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b.ringFrom}"/><stop offset="1" stop-color="${b.ringTo}"/></linearGradient></defs>` +
    `${back}<circle cx="50" cy="50" r="46" fill="${bg}" stroke="url(#r)" stroke-width="2.6"/>${cubes}${label}</svg>`
  );
}
