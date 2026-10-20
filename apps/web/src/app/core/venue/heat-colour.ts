const SOLD_OUT = '#9AA0A6';

// availability ratio stops: scarce -> plenty
const STOPS: [number, [number, number, number]][] = [
  [0, [215, 48, 39]],
  [0.5, [244, 180, 0]],
  [1, [29, 158, 117]],
];

/** Maps an availability ratio (0..1) to a red -> amber -> green colour. */
export function heatColour(available: number, total: number): string {
  if (total <= 0 || available <= 0) return SOLD_OUT;
  const ratio = Math.min(1, available / total);
  const upper = STOPS.findIndex(([at]) => ratio <= at);
  const [fromAt, from] = STOPS[Math.max(0, upper - 1)];
  const [toAt, to] = STOPS[upper];
  const t = toAt === fromAt ? 0 : (ratio - fromAt) / (toAt - fromAt);
  const [r, g, b] = from.map((c, i) => Math.round(c + (to[i] - c) * t));
  return `rgb(${r}, ${g}, ${b})`;
}
