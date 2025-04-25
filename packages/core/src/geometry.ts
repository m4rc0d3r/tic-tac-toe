type Vec2 = {
  x: number;
  y: number;
};

function distanceBetweenPoints(a: Vec2, b: Vec2) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function circumference(radius: number) {
  return 2 * Math.PI * radius;
}

function lerp(from: number, to: number, weight: number) {
  return from * (1 - weight) + to * weight;
}

export { circumference, distanceBetweenPoints, lerp };
export type { Vec2 };
