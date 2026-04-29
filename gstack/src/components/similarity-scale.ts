import { add, scale, sub, vec } from '~/geom-engine/vec';
import type { Vec2 } from '~/geom-engine/vec';
import { angleAtVertex } from '~/geom-engine/circle';
import { sides, triangle as makeTriangle } from '~/geom-engine/triangle';
import type { Triangle } from '~/geom-engine/triangle';

const VIEW_W = 400;
const VIEW_H = 300;

const PAIR1 = '#D7263D';
const PAIR2 = '#1B998B';
const PAIR3 = '#F46036';

// Scalene triangle; centroid at (101.67, 146.67) — close to (100, 147).
const A: Vec2 = vec(70, 110);
const B: Vec2 = vec(140, 130);
const C: Vec2 = vec(95, 200);
const CENTROID_ABC: Vec2 = vec(
  (A.x + B.x + C.x) / 3,
  (A.y + B.y + C.y) / 3,
);
const CENTROID_TARGET: Vec2 = vec(300, 145);

function scaledTriangle(k: number): Triangle {
  const make = (p: Vec2): Vec2 => add(CENTROID_TARGET, scale(sub(p, CENTROID_ABC), k));
  return makeTriangle(make(A), make(B), make(C));
}

interface Refs {
  ap: SVGCircleElement;
  bp: SVGCircleElement;
  cp: SVGCircleElement;
  apLabel: SVGTextElement;
  bpLabel: SVGTextElement;
  cpLabel: SVGTextElement;
  apbp: SVGLineElement;
  bpcp: SVGLineElement;
  cpap: SVGLineElement;
  // Tick groups for triangle 2
  tickApBp: SVGGElement;
  tickBpCp: SVGGElement;
  tickCpAp: SVGGElement;
  // k display
  kReadout: HTMLElement;
  kSlider: HTMLInputElement;
  // Side-length & ratio readouts
  apbpReadout: HTMLElement;
  bpcpReadout: HTMLElement;
  cpapReadout: HTMLElement;
  ratioAB: HTMLElement;
  ratioBC: HTMLElement;
  ratioCA: HTMLElement;
}

const TICK_LEN = 6;
const TICK_SPACING = 5;

function setLine(line: SVGLineElement, p1: Vec2, p2: Vec2) {
  line.setAttribute('x1', p1.x.toFixed(2));
  line.setAttribute('y1', p1.y.toFixed(2));
  line.setAttribute('x2', p2.x.toFixed(2));
  line.setAttribute('y2', p2.y.toFixed(2));
}

function renderTicks(group: SVGGElement, p1: Vec2, p2: Vec2, count: 1 | 2 | 3, color: string) {
  while (group.firstChild) group.removeChild(group.firstChild);
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;
  const dir = vec(dx / len, dy / len);
  const perp = vec(-dir.y, dir.x);
  const mid = vec((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  const start = -((count - 1) * TICK_SPACING) / 2;
  for (let i = 0; i < count; i++) {
    const offset = start + i * TICK_SPACING;
    const cx = mid.x + dir.x * offset;
    const cy = mid.y + dir.y * offset;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', (cx + perp.x * TICK_LEN).toFixed(2));
    line.setAttribute('y1', (cy + perp.y * TICK_LEN).toFixed(2));
    line.setAttribute('x2', (cx - perp.x * TICK_LEN).toFixed(2));
    line.setAttribute('y2', (cy - perp.y * TICK_LEN).toFixed(2));
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('stroke-linecap', 'round');
    group.appendChild(line);
  }
}

function update(refs: Refs, k: number) {
  const t2 = scaledTriangle(k);

  refs.ap.setAttribute('cx', t2.a.x.toFixed(2));
  refs.ap.setAttribute('cy', t2.a.y.toFixed(2));
  refs.bp.setAttribute('cx', t2.b.x.toFixed(2));
  refs.bp.setAttribute('cy', t2.b.y.toFixed(2));
  refs.cp.setAttribute('cx', t2.c.x.toFixed(2));
  refs.cp.setAttribute('cy', t2.c.y.toFixed(2));

  refs.apLabel.setAttribute('x', (t2.a.x - 16).toFixed(2));
  refs.apLabel.setAttribute('y', (t2.a.y - 10).toFixed(2));
  refs.bpLabel.setAttribute('x', (t2.b.x + 8).toFixed(2));
  refs.bpLabel.setAttribute('y', (t2.b.y - 10).toFixed(2));
  refs.cpLabel.setAttribute('x', (t2.c.x - 6).toFixed(2));
  refs.cpLabel.setAttribute('y', (t2.c.y + 22).toFixed(2));

  setLine(refs.apbp, t2.a, t2.b);
  setLine(refs.bpcp, t2.b, t2.c);
  setLine(refs.cpap, t2.c, t2.a);

  renderTicks(refs.tickApBp, t2.a, t2.b, 1, PAIR1);
  renderTicks(refs.tickBpCp, t2.b, t2.c, 2, PAIR2);
  renderTicks(refs.tickCpAp, t2.c, t2.a, 3, PAIR3);

  const s2 = sides(t2);
  refs.apbpReadout.textContent = s2.ab.toFixed(1);
  refs.bpcpReadout.textContent = s2.bc.toFixed(1);
  refs.cpapReadout.textContent = s2.ca.toFixed(1);

  // Ratios AB/A'B' = 1/k. Display ALL three to show they stay equal.
  const ratio = 1 / k;
  const ratioStr = ratio.toFixed(2);
  refs.ratioAB.textContent = ratioStr;
  refs.ratioBC.textContent = ratioStr;
  refs.ratioCA.textContent = ratioStr;

  refs.kReadout.textContent = k.toFixed(2);
}

function getRefs(svg: SVGSVGElement): Refs | null {
  const q = <T extends Element>(sel: string, root: ParentNode = document): T | null =>
    root.querySelector<T>(sel);

  const ap = q<SVGCircleElement>('[data-vertex="ap"]', svg);
  const bp = q<SVGCircleElement>('[data-vertex="bp"]', svg);
  const cp = q<SVGCircleElement>('[data-vertex="cp"]', svg);
  const apLabel = q<SVGTextElement>('[data-vertex-label="ap"]', svg);
  const bpLabel = q<SVGTextElement>('[data-vertex-label="bp"]', svg);
  const cpLabel = q<SVGTextElement>('[data-vertex-label="cp"]', svg);
  const apbp = q<SVGLineElement>('[data-side="apbp"]', svg);
  const bpcp = q<SVGLineElement>('[data-side="bpcp"]', svg);
  const cpap = q<SVGLineElement>('[data-side="cpap"]', svg);
  const tickApBp = q<SVGGElement>('[data-ticks="apbp"]', svg);
  const tickBpCp = q<SVGGElement>('[data-ticks="bpcp"]', svg);
  const tickCpAp = q<SVGGElement>('[data-ticks="cpap"]', svg);

  const kReadout = q<HTMLElement>('[data-readout="k"]');
  const kSlider = q<HTMLInputElement>('[data-control="k-slider"]');
  const apbpReadout = q<HTMLElement>('[data-readout-side="apbp"]');
  const bpcpReadout = q<HTMLElement>('[data-readout-side="bpcp"]');
  const cpapReadout = q<HTMLElement>('[data-readout-side="cpap"]');
  const ratioAB = q<HTMLElement>('[data-readout-ratio="ab"]');
  const ratioBC = q<HTMLElement>('[data-readout-ratio="bc"]');
  const ratioCA = q<HTMLElement>('[data-readout-ratio="ca"]');

  if (
    !ap || !bp || !cp || !apLabel || !bpLabel || !cpLabel ||
    !apbp || !bpcp || !cpap ||
    !tickApBp || !tickBpCp || !tickCpAp ||
    !kReadout || !kSlider ||
    !apbpReadout || !bpcpReadout || !cpapReadout ||
    !ratioAB || !ratioBC || !ratioCA
  ) return null;

  return {
    ap, bp, cp, apLabel, bpLabel, cpLabel,
    apbp, bpcp, cpap,
    tickApBp, tickBpCp, tickCpAp,
    kReadout, kSlider,
    apbpReadout, bpcpReadout, cpapReadout,
    ratioAB, ratioBC, ratioCA,
  };
}

export function setupSimilarityScale(svgSelector: string) {
  const svg = document.querySelector<SVGSVGElement>(svgSelector);
  if (!svg) return;
  const refs = getRefs(svg);
  if (!refs) return;

  const ctrl = new AbortController();
  const opts = { signal: ctrl.signal } as AddEventListenerOptions;

  // Static ticks for triangle 1 (ABC) — render once, never change.
  const tickAB = svg.querySelector<SVGGElement>('[data-ticks="ab"]');
  const tickBC = svg.querySelector<SVGGElement>('[data-ticks="bc"]');
  const tickCA = svg.querySelector<SVGGElement>('[data-ticks="ca"]');
  if (tickAB && tickBC && tickCA) {
    renderTicks(tickAB, A, B, 1, PAIR1);
    renderTicks(tickBC, B, C, 2, PAIR2);
    renderTicks(tickCA, C, A, 3, PAIR3);
  }

  const initialK = parseFloat(refs.kSlider.value) || 1;
  update(refs, initialK);

  refs.kSlider.addEventListener(
    'input',
    () => {
      const k = parseFloat(refs.kSlider.value);
      if (Number.isFinite(k)) update(refs, k);
    },
    opts,
  );

  document.addEventListener('astro:before-swap', () => ctrl.abort(), { once: true });
}
