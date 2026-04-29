import { vec } from '~/geom-engine/vec';
import type { Vec2 } from '~/geom-engine/vec';
import {
  congruentSSS,
  sides,
  triangle as makeTriangle,
} from '~/geom-engine/triangle';

const VIEW_W = 400;
const VIEW_H = 300;
const TICK_LEN = 6;
const TICK_SPACING = 5;

const PAIR1 = '#D7263D';
const PAIR2 = '#1B998B';
const PAIR3 = '#F46036';

type VertexId = 'a' | 'b' | 'c' | 'ap' | 'bp' | 'cp';

const VERTEX_IDS: readonly VertexId[] = ['a', 'b', 'c', 'ap', 'bp', 'cp'];

const INITIAL: Record<VertexId, Vec2> = {
  a: vec(60, 80),
  b: vec(180, 80),
  c: vec(120, 220),
  ap: vec(220, 80),
  bp: vec(340, 80),
  cp: vec(280, 220),
};

interface Refs {
  svg: SVGSVGElement;
  vertices: Record<VertexId, SVGCircleElement>;
  labels: Record<VertexId, SVGTextElement>;
  sides: Record<'ab' | 'bc' | 'ca' | 'apbp' | 'bpcp' | 'cpap', SVGLineElement>;
  ticks: Record<'ab' | 'bc' | 'ca' | 'apbp' | 'bpcp' | 'cpap', SVGGElement>;
  readouts: Record<'ab' | 'bc' | 'ca' | 'apbp' | 'bpcp' | 'cpap', HTMLElement>;
  badge: HTMLElement;
}

function clientToSvg(svg: SVGSVGElement, x: number, y: number): Vec2 {
  const r = svg.getBoundingClientRect();
  return vec(((x - r.left) / r.width) * VIEW_W, ((y - r.top) / r.height) * VIEW_H);
}

function clamp(v: Vec2, pad = 16): Vec2 {
  return vec(
    Math.max(pad, Math.min(VIEW_W - pad, v.x)),
    Math.max(pad, Math.min(VIEW_H - pad, v.y)),
  );
}

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

function update(refs: Refs, state: Record<VertexId, Vec2>) {
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

function getRefs(svg: SVGSVGElement): Refs | null {
  const vertices: Partial<Record<VertexId, SVGCircleElement>> = {};
  const labels: Partial<Record<VertexId, SVGTextElement>> = {};
  for (const id of VERTEX_IDS) {
    const v = svg.querySelector<SVGCircleElement>(`[data-vertex="${id}"]`);
    const l = svg.querySelector<SVGTextElement>(`[data-vertex-label="${id}"]`);
    if (!v || !l) return null;
    vertices[id] = v;
    labels[id] = l;
  }

  const sideKeys = ['ab', 'bc', 'ca', 'apbp', 'bpcp', 'cpap'] as const;
  type SideKey = (typeof sideKeys)[number];
  const sides: Partial<Record<SideKey, SVGLineElement>> = {};
  const ticks: Partial<Record<SideKey, SVGGElement>> = {};
  const readouts: Partial<Record<SideKey, HTMLElement>> = {};
  for (const key of sideKeys) {
    const s = svg.querySelector<SVGLineElement>(`[data-side="${key}"]`);
    const t = svg.querySelector<SVGGElement>(`[data-ticks="${key}"]`);
    const r = document.querySelector<HTMLElement>(`[data-readout-side="${key}"]`);
    if (!s || !t || !r) return null;
    sides[key] = s;
    ticks[key] = t;
    readouts[key] = r;
  }

  const badge = document.querySelector<HTMLElement>('[data-badge="congruent"]');
  if (!badge) return null;

  return {
    svg,
    vertices: vertices as Record<VertexId, SVGCircleElement>,
    labels: labels as Record<VertexId, SVGTextElement>,
    sides: sides as Record<SideKey, SVGLineElement>,
    ticks: ticks as Record<SideKey, SVGGElement>,
    readouts: readouts as Record<SideKey, HTMLElement>,
    badge,
  };
}

export function setupCongruenceSSS(svgSelector: string) {
  const svg = document.querySelector<SVGSVGElement>(svgSelector);
  if (!svg) return;
  const refs = getRefs(svg);
  if (!refs) return;

  const state: Record<VertexId, Vec2> = { ...INITIAL };
  update(refs, state);

  let active: { id: number; vertex: VertexId } | null = null;
  const ctrl = new AbortController();
  const opts = { signal: ctrl.signal } as AddEventListenerOptions;

  for (const id of VERTEX_IDS) {
    const el = refs.vertices[id];
    el.addEventListener(
      'pointerdown',
      (e: PointerEvent) => {
        active = { id: e.pointerId, vertex: id };
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
      },
      opts,
    );
    el.addEventListener(
      'pointermove',
      (e: PointerEvent) => {
        if (!active || active.id !== e.pointerId) return;
        const raw = clientToSvg(svg, e.clientX, e.clientY);
        state[active.vertex] = clamp(raw);
        update(refs, state);
      },
      opts,
    );
    const release = (e: PointerEvent) => {
      if (!active || active.id !== e.pointerId) return;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      active = null;
    };
    el.addEventListener('pointerup', release, opts);
    el.addEventListener('pointercancel', release, opts);
  }

  document.addEventListener('astro:before-swap', () => ctrl.abort(), { once: true });
}
