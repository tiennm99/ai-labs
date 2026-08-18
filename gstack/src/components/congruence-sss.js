import { vec } from '~/geom-engine/vec';
import {
  congruentSSS,
  sides,
  triangle as makeTriangle,
} from '~/geom-engine/triangle';

/** @typedef {import('~/geom-engine/vec').Vec2} Vec2 */

const VIEW_W = 400;
const VIEW_H = 300;
const TICK_LEN = 6;
const TICK_SPACING = 5;

const PAIR1 = '#D7263D';
const PAIR2 = '#1B998B';
const PAIR3 = '#F46036';

/** @typedef {'a' | 'b' | 'c' | 'ap' | 'bp' | 'cp'} VertexId */

/** @typedef {'ab' | 'bc' | 'ca' | 'apbp' | 'bpcp' | 'cpap'} SideKey */

/** @type {readonly VertexId[]} */
const VERTEX_IDS = ['a', 'b', 'c', 'ap', 'bp', 'cp'];

/** @type {Record<VertexId, Vec2>} */
const INITIAL = {
  a: vec(60, 80),
  b: vec(180, 80),
  c: vec(120, 220),
  ap: vec(220, 80),
  bp: vec(340, 80),
  cp: vec(280, 220),
};

/**
 * @typedef {object} Refs
 * @property {SVGSVGElement} svg
 * @property {Record<VertexId, SVGCircleElement>} vertices
 * @property {Record<VertexId, SVGTextElement>} labels
 * @property {Record<SideKey, SVGLineElement>} sides
 * @property {Record<SideKey, SVGGElement>} ticks
 * @property {Record<SideKey, HTMLElement>} readouts
 * @property {HTMLElement} badge
 */

/**
 * @param {SVGSVGElement} svg
 * @param {number} x
 * @param {number} y
 * @returns {Vec2}
 */
function clientToSvg(svg, x, y) {
  const r = svg.getBoundingClientRect();
  return vec(((x - r.left) / r.width) * VIEW_W, ((y - r.top) / r.height) * VIEW_H);
}

/**
 * @param {Vec2} v
 * @param {number} [pad]
 * @returns {Vec2}
 */
function clamp(v, pad = 16) {
  return vec(
    Math.max(pad, Math.min(VIEW_W - pad, v.x)),
    Math.max(pad, Math.min(VIEW_H - pad, v.y)),
  );
}

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
 * @param {Record<VertexId, Vec2>} state
 */
function update(refs, state) {
  for (const id of VERTEX_IDS) {
    const v = state[id];
    refs.vertices[id].setAttribute('cx', v.x.toFixed(2));
    refs.vertices[id].setAttribute('cy', v.y.toFixed(2));
    // Position label slightly offset from vertex
    const offsetX = id === 'b' || id === 'bp' ? 12 : id === 'c' || id === 'cp' ? -4 : -16;
    const offsetY = id === 'c' || id === 'cp' ? 22 : -10;
    refs.labels[id].setAttribute('x', (v.x + offsetX).toFixed(2));
    refs.labels[id].setAttribute('y', (v.y + offsetY).toFixed(2));
  }

  const t1 = makeTriangle(state.a, state.b, state.c);
  const t2 = makeTriangle(state.ap, state.bp, state.cp);

  setLine(refs.sides.ab, t1.a, t1.b);
  setLine(refs.sides.bc, t1.b, t1.c);
  setLine(refs.sides.ca, t1.c, t1.a);
  setLine(refs.sides.apbp, t2.a, t2.b);
  setLine(refs.sides.bpcp, t2.b, t2.c);
  setLine(refs.sides.cpap, t2.c, t2.a);

  renderTicks(refs.ticks.ab, t1.a, t1.b, 1, PAIR1);
  renderTicks(refs.ticks.apbp, t2.a, t2.b, 1, PAIR1);
  renderTicks(refs.ticks.bc, t1.b, t1.c, 2, PAIR2);
  renderTicks(refs.ticks.bpcp, t2.b, t2.c, 2, PAIR2);
  renderTicks(refs.ticks.ca, t1.c, t1.a, 3, PAIR3);
  renderTicks(refs.ticks.cpap, t2.c, t2.a, 3, PAIR3);

  const s1 = sides(t1);
  const s2 = sides(t2);
  refs.readouts.ab.textContent = s1.ab.toFixed(1);
  refs.readouts.bc.textContent = s1.bc.toFixed(1);
  refs.readouts.ca.textContent = s1.ca.toFixed(1);
  refs.readouts.apbp.textContent = s2.ab.toFixed(1);
  refs.readouts.bpcp.textContent = s2.bc.toFixed(1);
  refs.readouts.cpap.textContent = s2.ca.toFixed(1);

  const congruent = congruentSSS(t1, t2);
  refs.badge.style.display = congruent ? 'inline-block' : 'none';
}

/**
 * @param {SVGSVGElement} svg
 * @returns {Refs | null}
 */
function getRefs(svg) {
  /** @type {Partial<Record<VertexId, SVGCircleElement>>} */
  const vertices = {};
  /** @type {Partial<Record<VertexId, SVGTextElement>>} */
  const labels = {};
  for (const id of VERTEX_IDS) {
    const v = /** @type {SVGCircleElement | null} */ (svg.querySelector(`[data-vertex="${id}"]`));
    const l = /** @type {SVGTextElement | null} */ (
      svg.querySelector(`[data-vertex-label="${id}"]`)
    );
    if (!v || !l) return null;
    vertices[id] = v;
    labels[id] = l;
  }

  /** @type {readonly SideKey[]} */
  const sideKeys = ['ab', 'bc', 'ca', 'apbp', 'bpcp', 'cpap'];
  /** @type {Partial<Record<SideKey, SVGLineElement>>} */
  const sides = {};
  /** @type {Partial<Record<SideKey, SVGGElement>>} */
  const ticks = {};
  /** @type {Partial<Record<SideKey, HTMLElement>>} */
  const readouts = {};
  for (const key of sideKeys) {
    const s = /** @type {SVGLineElement | null} */ (svg.querySelector(`[data-side="${key}"]`));
    const t = /** @type {SVGGElement | null} */ (svg.querySelector(`[data-ticks="${key}"]`));
    const r = /** @type {HTMLElement | null} */ (
      document.querySelector(`[data-readout-side="${key}"]`)
    );
    if (!s || !t || !r) return null;
    sides[key] = s;
    ticks[key] = t;
    readouts[key] = r;
  }

  const badge = /** @type {HTMLElement | null} */ (
    document.querySelector('[data-badge="congruent"]')
  );
  if (!badge) return null;

  return {
    svg,
    vertices: /** @type {Record<VertexId, SVGCircleElement>} */ (vertices),
    labels: /** @type {Record<VertexId, SVGTextElement>} */ (labels),
    sides: /** @type {Record<SideKey, SVGLineElement>} */ (sides),
    ticks: /** @type {Record<SideKey, SVGGElement>} */ (ticks),
    readouts: /** @type {Record<SideKey, HTMLElement>} */ (readouts),
    badge,
  };
}

/** @param {string} svgSelector */
export function setupCongruenceSSS(svgSelector) {
  const svg = /** @type {SVGSVGElement | null} */ (document.querySelector(svgSelector));
  if (!svg) return;
  const refs = getRefs(svg);
  if (!refs) return;

  /** @type {Record<VertexId, Vec2>} */
  const state = { ...INITIAL };
  update(refs, state);

  /** @type {{ id: number, vertex: VertexId } | null} */
  let active = null;
  const ctrl = new AbortController();
  const opts = /** @type {AddEventListenerOptions} */ ({ signal: ctrl.signal });

  for (const id of VERTEX_IDS) {
    const el = refs.vertices[id];
    el.addEventListener(
      'pointerdown',
      (e) => {
        active = { id: e.pointerId, vertex: id };
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
      },
      opts,
    );
    el.addEventListener(
      'pointermove',
      (e) => {
        if (!active || active.id !== e.pointerId) return;
        const raw = clientToSvg(svg, e.clientX, e.clientY);
        state[active.vertex] = clamp(raw);
        update(refs, state);
      },
      opts,
    );
    /** @param {PointerEvent} e */
    const release = (e) => {
      if (!active || active.id !== e.pointerId) return;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      active = null;
    };
    el.addEventListener('pointerup', release, opts);
    el.addEventListener('pointercancel', release, opts);
  }

  document.addEventListener('astro:before-swap', () => ctrl.abort(), { once: true });
}
