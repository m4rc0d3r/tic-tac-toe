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

export { circumference, distanceBetweenPoints };
export type { Vec2 };
