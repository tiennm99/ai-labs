import { add, scale, sub, vec } from '~/geom-engine/vec';
import { angleAtVertex } from '~/geom-engine/circle';
import { sides, triangle as makeTriangle } from '~/geom-engine/triangle';

/** @typedef {import('~/geom-engine/vec').Vec2} Vec2 */
/** @typedef {import('~/geom-engine/triangle').Triangle} Triangle */

const VIEW_W = 400;
const VIEW_H = 300;

const PAIR1 = '#D7263D';
const PAIR2 = '#1B998B';
const PAIR3 = '#F46036';

// Scalene triangle; centroid at (101.67, 146.67) — close to (100, 147).
/** @type {Vec2} */
const A = vec(70, 110);
/** @type {Vec2} */
const B = vec(140, 130);
/** @type {Vec2} */
const C = vec(95, 200);
/** @type {Vec2} */
const CENTROID_ABC = vec(
  (A.x + B.x + C.x) / 3,
  (A.y + B.y + C.y) / 3,
);
/** @type {Vec2} */
const CENTROID_TARGET = vec(300, 145);

/**
 * @param {number} k
 * @returns {Triangle}
 */
function scaledTriangle(k) {
  /** @param {Vec2} p */
  const make = (p) => add(CENTROID_TARGET, scale(sub(p, CENTROID_ABC), k));
  return makeTriangle(make(A), make(B), make(C));
}

/**
 * @typedef {object} Refs
 * @property {SVGCircleElement} ap
 * @property {SVGCircleElement} bp
 * @property {SVGCircleElement} cp
 * @property {SVGTextElement} apLabel
 * @property {SVGTextElement} bpLabel
 * @property {SVGTextElement} cpLabel
 * @property {SVGLineElement} apbp
 * @property {SVGLineElement} bpcp
 * @property {SVGLineElement} cpap
 * @property {SVGGElement} tickApBp Tick group for triangle 2
 * @property {SVGGElement} tickBpCp Tick group for triangle 2
 * @property {SVGGElement} tickCpAp Tick group for triangle 2
 * @property {HTMLElement} kReadout k display
 * @property {HTMLInputElement} kSlider k display
 * @property {HTMLElement} apbpReadout Side-length & ratio readouts
 * @property {HTMLElement} bpcpReadout Side-length & ratio readouts
 * @property {HTMLElement} cpapReadout Side-length & ratio readouts
 * @property {HTMLElement} ratioAB Side-length & ratio readouts
 * @property {HTMLElement} ratioBC Side-length & ratio readouts
 * @property {HTMLElement} ratioCA Side-length & ratio readouts
 */

const TICK_LEN = 6;
const TICK_SPACING = 5;

/**
 * @param {SVGLineElement} line
 * @param {Vec2} p1
 * @param {Vec2} p2
 */
function setLine(line, p1, p2) {
  line.setAttribute('x1', p1.x.toFixed(2));
  line.setAttribute('y1', p1.y.toFixed(2));
  line.setAttribute('x2', p2.x.toFixed(2));
  line.setAttribute('y2', p2.y.toFixed(2));
}

/**
 * @param {SVGGElement} group
 * @param {Vec2} p1
 * @param {Vec2} p2
 * @param {1 | 2 | 3} count
 * @param {string} color
 */
function renderTicks(group, p1, p2, count, color) {
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

/**
 * @param {Refs} refs
 * @param {number} k
 */
function update(refs, k) {
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

/**
 * @param {SVGSVGElement} svg
 * @returns {Refs | null}
 */
function getRefs(svg) {
  /**
   * @template {Element} T
   * @param {string} sel
   * @param {ParentNode} [root]
   * @returns {T | null}
   */
  const q = (sel, root = document) => /** @type {T | null} */ (root.querySelector(sel));

  const ap = /** @type {SVGCircleElement | null} */ (q('[data-vertex="ap"]', svg));
  const bp = /** @type {SVGCircleElement | null} */ (q('[data-vertex="bp"]', svg));
  const cp = /** @type {SVGCircleElement | null} */ (q('[data-vertex="cp"]', svg));
  const apLabel = /** @type {SVGTextElement | null} */ (q('[data-vertex-label="ap"]', svg));
  const bpLabel = /** @type {SVGTextElement | null} */ (q('[data-vertex-label="bp"]', svg));
  const cpLabel = /** @type {SVGTextElement | null} */ (q('[data-vertex-label="cp"]', svg));
  const apbp = /** @type {SVGLineElement | null} */ (q('[data-side="apbp"]', svg));
  const bpcp = /** @type {SVGLineElement | null} */ (q('[data-side="bpcp"]', svg));
  const cpap = /** @type {SVGLineElement | null} */ (q('[data-side="cpap"]', svg));
  const tickApBp = /** @type {SVGGElement | null} */ (q('[data-ticks="apbp"]', svg));
  const tickBpCp = /** @type {SVGGElement | null} */ (q('[data-ticks="bpcp"]', svg));
  const tickCpAp = /** @type {SVGGElement | null} */ (q('[data-ticks="cpap"]', svg));

  const kReadout = /** @type {HTMLElement | null} */ (q('[data-readout="k"]'));
  const kSlider = /** @type {HTMLInputElement | null} */ (q('[data-control="k-slider"]'));
  const apbpReadout = /** @type {HTMLElement | null} */ (q('[data-readout-side="apbp"]'));
  const bpcpReadout = /** @type {HTMLElement | null} */ (q('[data-readout-side="bpcp"]'));
  const cpapReadout = /** @type {HTMLElement | null} */ (q('[data-readout-side="cpap"]'));
  const ratioAB = /** @type {HTMLElement | null} */ (q('[data-readout-ratio="ab"]'));
  const ratioBC = /** @type {HTMLElement | null} */ (q('[data-readout-ratio="bc"]'));
  const ratioCA = /** @type {HTMLElement | null} */ (q('[data-readout-ratio="ca"]'));

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

/** @param {string} svgSelector */
export function setupSimilarityScale(svgSelector) {
  const svg = /** @type {SVGSVGElement | null} */ (document.querySelector(svgSelector));
  if (!svg) return;
  const refs = getRefs(svg);
  if (!refs) return;

  const ctrl = new AbortController();
  const opts = /** @type {AddEventListenerOptions} */ ({ signal: ctrl.signal });

  // Static ticks for triangle 1 (ABC) — render once, never change.
  const tickAB = /** @type {SVGGElement | null} */ (svg.querySelector('[data-ticks="ab"]'));
  const tickBC = /** @type {SVGGElement | null} */ (svg.querySelector('[data-ticks="bc"]'));
  const tickCA = /** @type {SVGGElement | null} */ (svg.querySelector('[data-ticks="ca"]'));
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
