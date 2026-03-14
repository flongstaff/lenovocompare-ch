/** Convert polar coordinates to cartesian SVG coordinates */
export const polarToCartesian = (cx: number, cy: number, radius: number, angleRad: number): [number, number] => [
  cx + radius * Math.cos(angleRad),
  cy + radius * Math.sin(angleRad),
];

/** Convert array of [x,y] pairs to SVG polygon points string */
export const pointsToPolygon = (points: readonly [number, number][]): string =>
  points.map(([x, y]) => `${x},${y}`).join(" ");

/** Generate N evenly-spaced angles starting from top (-PI/2) */
export const equalAngles = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);

/** Generate grid ring polygon points for a given radius and axis count */
export const gridRingPoints = (cx: number, cy: number, radius: number, axes: number): string =>
  pointsToPolygon(equalAngles(axes).map((a) => polarToCartesian(cx, cy, radius, a)));

interface FrontierPoint {
  readonly id: string;
  readonly price: number;
  readonly perf: number;
}

/**
 * Compute the efficiency frontier — the set of models where no cheaper model
 * has equal or better performance.
 * Returns models sorted by price ascending.
 */
export const computeEfficiencyFrontier = <T extends FrontierPoint>(models: readonly T[]): T[] => {
  const sorted = [...models].sort((a, b) => a.price - b.price || b.perf - a.perf);
  const frontier: T[] = [];
  let maxPerf = -Infinity;

  for (const m of sorted) {
    if (m.perf > maxPerf) {
      frontier.push(m);
      maxPerf = m.perf;
    }
  }

  return frontier;
};

/** Clamp a value between min and max. */
export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** Linear interpolation between two values. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Map a value from one range to another. */
export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number =>
  lerp(outMin, outMax, clamp((value - inMin) / (inMax - inMin), 0, 1));
