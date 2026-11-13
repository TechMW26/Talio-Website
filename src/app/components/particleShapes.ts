const shapes = {
  orbit: 'M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M2 17c-2-2 2-7 8-11s12-5 13-2-3 7-9 11-11 5-12 2z M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
  workspace: 'M2 4h20v16H2z M2 8h20 M8 8v12 M11 11h7 M11 14h9 M11 17h5 M4 6h1 M6 6h1',
  project: 'M3 6h7l2 2h9v12H3z M3 8V4h7l2 2h7v2 M7 12h10 M7 15h7 M7 17h4',
  tasks: 'M4 4h16v16H4z M8 8l1 1 2-2 M13 8h4 M8 13l1 1 2-2 M13 13h4 M8 17h3 M13 17h4',
  checklist: 'M6 4h12v16H6z M9 4V2h6v2 M9 8l1 1 2-2 M14 8h2 M9 12l1 1 2-2 M14 12h2 M9 16l1 1 2-2 M14 16h2',
  chat: 'M3 4h15q2 0 2 2v7q0 2-2 2H9l-5 4v-4H3q-2 0-2-2V6q0-2 2-2z M6 8h9 M6 11h6 M21 9h2v11h-3v3l-4-3h-4v-3',
  file: 'M5 2h9l5 5v15H5z M14 2v5h5 M8 11h8 M8 14h8 M8 17h5',
  calendar: 'M3 5h18v16H3z M3 10h18 M7 3v4 M17 3v4 M7 13h1 M12 13h1 M17 13h1 M7 17h1 M12 17h1 M17 17h1',
  clock: 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M12 6v6l4 2 M12 3v1 M20 12h1 M12 20v1 M3 12h1',
  pin: 'M5 9a7 7 0 1 1 14 0c0 5-7 11-7 11S5 14 5 9z M9 9a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M7 20c-3 0-4 2 0 2h10c4 0 3-2 0-2',
  shield: 'M12 2c3 2 6 3 9 3v6c0 5-4 9-9 11-5-2-9-6-9-11V5c3 0 6-1 9-3z M7 12l3 3 7-7',
  check: 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M7 12l3.5 3.5L17 9',
  person: 'M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1z',
  team: 'M9 7a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2z M7 7a3 3 0 0 0 0 6 M17 7a3 3 0 0 1 0 6 M4 14q-3 1-3 5v2 M20 14q3 1 3 5v2',
  chart: 'M3 3v18h18 M7 17v-4 M11 17v-6 M15 17v-8 M19 17V6 M6 10l5-4 4 1 5-4',
  target: 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M6 12a6 6 0 1 0 12 0a6 6 0 1 0-12 0 M10 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M12 12l8-8',
  wallet: 'M3 6q0-2 2-2l13-1v4 M3 6v13q0 2 2 2h15V7H5q-2 0-2-1z M20 11h-6a3 3 0 0 0 0 6h6 M14 14h1',
  workflow: 'M3 3h5v5H3z M16 10h5v5h-5z M3 17h5v5H3z M8 5h3q3 0 3 4v3h2 M8 19h3q3 0 3-4v-3',
  network: 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M10 3a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M10 21a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M1 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M19 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M12 5v3 M12 16v3 M5 12h3 M16 12h3',
  video: 'M3 5h12q2 0 2 2v10q0 2-2 2H3q-2 0-2-2V7q0-2 2-2z M17 10l6-4v12l-6-4 M7 9l5 3-5 3z',
  board: 'M2 3h20v16H2z M8 22l4-3 4 3 M5 7h6v5H5z M14 7h4v4h-4z M9 15h9 M18 11v4 M8 12v3',
  briefcase: 'M3 7h18q1 0 1 1v11q0 1-1 1H3q-1 0-1-1V8q0-1 1-1z M8 7V4h8v3 M2 12q10 4 20 0 M10 13h4v3h-4z',
  bell: 'M4 18q2-3 2-9a6 6 0 0 1 12 0q0 6 2 9z M9 20a3 3 0 0 0 6 0 M2 8q0-3 3-5 M22 8q0-3-3-5',
  laptop: 'M4 4h16v12H4z M4 16l-3 3q0 1 2 1h18q2 0 2-1l-3-3 M9 18h6 M7 7h10v6H7z',
  phone: 'M8 2h8q2 0 2 2v16q0 2-2 2H8q-2 0-2-2V4q0-2 2-2z M6 6h12 M6 18h12 M10 4h4 M11 20h2',
  globe: 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M2 12h20 M4 7q8 3 16 0 M4 17q8-3 16 0 M12 2c-5 4-5 16 0 20 M12 2c5 4 5 16 0 20',
  download: 'M12 2v13 M7 10l5 5 5-5 M3 15v6h18v-6',
  spark: 'M12 2l2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7z M19 2v4 M17 4h4 M5 17v5 M2.5 19.5h5',
  headset: 'M3 14v-3a9 9 0 0 1 18 0v4 M3 12h4v7H3z M17 12h4v7h-4z M20 19q0 3-4 3h-4',
  compass: 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M16 7l-2.5 6.5L7 16l2.5-6.5z M12 2v2 M22 12h-2 M12 22v-2 M2 12h2',
  layers: 'M2 8l10-5 10 5-10 5z M2 12l10 5 10-5 M2 16l10 5 10-5',
  bolt: 'M13 2L3 14h8l-1 8L21 10h-8z M4 5l-2 2 M22 16l-2 2',
  inbox: 'M4 4h16l3 12v4H1v-4z M1 16h6l2 2h6l2-2h6 M12 7v7 M9 11l3 3 3-3',
  lock: 'M6 10h12q2 0 2 2v8q0 2-2 2H6q-2 0-2-2v-8q0-2 2-2z M7 10V7a5 5 0 0 1 10 0v3 M12 14a1.4 1.4 0 1 0 0 2.8v2',
  fingerprint: 'M4 11a8 8 0 0 1 16 0v4 M7 11a5 5 0 0 1 10 0v5q0 3-1 5 M10 12a2 2 0 0 1 4 0v5q0 4-2 6 M7 14v2q0 3-2 5 M10 15q0 4-2 7 M20 17v3 M4 14v2',
  sliders: 'M6 2v4 M6 11v11 M12 2v12 M12 19v3 M18 2v6 M18 13v9 M3 6h6v5H3z M9 14h6v5H9z M15 8h6v5h-6z',
  route: 'M5 2a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M19 16a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M8 5h8q4 0 4 4t-4 4H7q-4 0-4 3t4 3h9 M9 10l3 3-3 3',
  database: 'M3 6c0-2.3 4-4 9-4s9 1.7 9 4-4 4-9 4-9-1.7-9-4z M3 6v12c0 2.3 4 4 9 4s9-1.7 9-4V6 M3 12c0 2.3 4 4 9 4s9-1.7 9-4',
  flag: 'M5 22V3 M5 4q4-3 8-1t7 0v11q-3 2-7 0t-8 1 M2 22h8',
  sun: 'M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M12 1v3 M12 20v3 M1 12h3 M20 12h3 M4 4l2 2 M18 18l2 2 M20 4l-2 2 M6 18l-2 2',
} as const;

export type ParticleShape = keyof typeof shapes;

export function particleShapePath(shape: ParticleShape): string {
  return shapes[shape];
}

const svgNs = 'http://www.w3.org/2000/svg';
const cache = new Map<string, { points: Float32Array; bottom: number }>();

function random(index: number) {
  const x = Math.sin(index * 78.233 + 11.21) * 43758.5453;
  return x - Math.floor(x);
}

export function particleTargets(shape: ParticleShape, count: number) {
  const key = `${shape}:${count}`;
  const existing = cache.get(key);
  if (existing) return existing;

  const path = document.createElementNS(svgNs, 'path');
  path.setAttribute('d', particleShapePath(shape));
  const length = path.getTotalLength();
  const points = new Float32Array(count * 2);
  let bottom = -Infinity;

  for (let i = 0; i < count; i++) {
    const point = path.getPointAtLength(length * (i + 0.5) / count);
    const spread = i % 13 === 0 ? 0.88 : 0.41;
    points[i * 2] = (point.x - 12 + (random(i * 2) - 0.5) * spread) / 12;
    const y = (point.y - 12 + (random(i * 2 + 1) - 0.5) * spread) / 12;
    points[i * 2 + 1] = y;
    bottom = Math.max(bottom, y);
  }

  const result = { points, bottom };
  cache.set(key, result);
  return result;
}
