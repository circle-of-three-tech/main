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

export function markSvg({ fg = "#F5F7FF", bg = "none", accent = "#05061A", text = true } = {}) {
  const cubes = CUBES.map(
    (c) =>
      `<polygon points="${c.top}" fill="${bg === "none" ? "none" : bg}" stroke="${fg}" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<polygon points="${c.left}" fill="${bg === "none" ? "none" : bg}" stroke="${fg}" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<polygon points="${c.right}" fill="${fg}" stroke="${fg}" stroke-width="1.4" stroke-linejoin="round"/>`,
  ).join("");
  const label = text
    ? `<text x="50" y="84" text-anchor="middle" font-family="Exo, Arial, sans-serif" font-weight="700" font-size="11" letter-spacing="1" fill="${fg}">Co3</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="${bg === "none" ? accent : bg}" stroke="${fg}" stroke-width="2.2"/>${cubes}${label}</svg>`;
}
