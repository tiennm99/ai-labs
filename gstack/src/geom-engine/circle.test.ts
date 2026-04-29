import { describe, expect, it } from 'vitest';
import { angleAtVertex, circle, pointOnCircle, projectToCircle } from './circle';
import { dist, vec } from './vec';

describe('projectToCircle', () => {
  const c = circle(100, 100, 50);

  it('leaves an on-circle point unchanged (within float tolerance)', () => {
    const onCircle = pointOnCircle(c, 30);
    const projected = projectToCircle(onCircle, c);
    expect(dist(onCircle, projected)).toBeCloseTo(0, 9);
  });

  it('projects an outside point to the circle along the radial direction', () => {
    const outside = vec(200, 100);
    const projected = projectToCircle(outside, c);
    expect(dist(projected, c.center)).toBeCloseTo(c.radius, 9);
    expect(projected).toEqual(vec(150, 100));
  });

  it('projects an inside point outward to the circle', () => {
    const inside = vec(110, 100);
    const projected = projectToCircle(inside, c);
    expect(dist(projected, c.center)).toBeCloseTo(c.radius, 9);
    expect(projected).toEqual(vec(150, 100));
  });

  it('returns a deterministic point when given the center (degenerate)', () => {
    const projected = projectToCircle(c.center, c);
    expect(dist(projected, c.center)).toBe(c.radius);
    expect(projected).toEqual(vec(150, 100));
  });
});

describe('pointOnCircle', () => {
  const c = circle(0, 0, 10);

  it('returns the +x point at angle 0', () => {
    const p = pointOnCircle(c, 0);
    expect(p.x).toBeCloseTo(10, 9);
    expect(p.y).toBeCloseTo(0, 9);
  });

  it('returns the +y point at angle 90', () => {
    const p = pointOnCircle(c, 90);
    expect(p.x).toBeCloseTo(0, 9);
    expect(p.y).toBeCloseTo(10, 9);
  });

  it('the resulting point lies on the circle', () => {
    for (const a of [0, 30, 90, 150, 210, 359]) {
      expect(dist(pointOnCircle(c, a), c.center)).toBeCloseTo(c.radius, 9);
    }
  });
});

describe('angleAtVertex', () => {
  it('returns 90 for a right angle', () => {
    // Vertex at origin; a along +x; b along +y.
    expect(angleAtVertex(vec(1, 0), vec(0, 0), vec(0, 1))).toBeCloseTo(90, 9);
  });

  it('returns 60 for an equilateral triangle vertex', () => {
    const a = vec(0, 0);
    const b = vec(1, 0);
    const c = vec(0.5, Math.sqrt(3) / 2);
    expect(angleAtVertex(a, b, c)).toBeCloseTo(60, 9);
    expect(angleAtVertex(b, c, a)).toBeCloseTo(60, 9);
    expect(angleAtVertex(c, a, b)).toBeCloseTo(60, 9);
  });

  it('returns 180 for a straight line through the vertex', () => {
    expect(angleAtVertex(vec(-1, 0), vec(0, 0), vec(1, 0))).toBeCloseTo(180, 9);
  });

  it('returns 0 when the vertex coincides with either ray endpoint (degenerate)', () => {
    expect(angleAtVertex(vec(0, 0), vec(0, 0), vec(1, 0))).toBe(0);
    expect(angleAtVertex(vec(1, 0), vec(0, 0), vec(0, 0))).toBe(0);
  });
});

describe('inscribed-angle invariance (the killer-demo property)', () => {
  // For two fixed points A, B on a circle and any point M on the same arc,
  // the inscribed angle ∠AMB stays constant. This is the entire reason
  // Module 3 (Góc nội tiếp) exists. If this test ever fails, the module is wrong.
  const c = circle(0, 0, 100);
  const A = pointOnCircle(c, 150);
  const B = pointOnCircle(c, 30);

  // Major arc from A→B going through the bottom: angles in (180°, 360°).
  // Sample 7 different M positions on the major arc.
  const majorArcAngles = [200, 230, 260, 270, 290, 320, 350];
  const inscribedAngles = majorArcAngles.map((a) =>
    angleAtVertex(A, pointOnCircle(c, a), B),
  );

  it('all sampled M on the major arc give the same inscribed angle (within 0.5°)', () => {
    const reference = inscribedAngles[0]!;
    for (const angle of inscribedAngles) {
      expect(Math.abs(angle - reference)).toBeLessThan(0.5);
    }
  });

  it('the inscribed angle on the major arc is half the central angle of the minor arc subtended by AB', () => {
    // A is at 150°, B at 30°. Minor arc from A→B going through 90° spans 120°.
    // Inscribed angle on the major arc = 120° / 2 = 60°.
    expect(inscribedAngles[0]).toBeCloseTo(60, 9);
  });
});
