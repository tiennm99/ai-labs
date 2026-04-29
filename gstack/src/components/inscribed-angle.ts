import { angleAtVertex, circle, pointOnCircle, projectToCircle } from '~/geom-engine/circle';
import type { Vec2 } from '~/geom-engine/vec';
import { vec } from '~/geom-engine/vec';

const VIEW_SIZE = 400;
const C = circle(VIEW_SIZE / 2, VIEW_SIZE / 2, 150);

// A and B are fixed; M is draggable on the circle.
const A: Vec2 = pointOnCircle(C, 150);
const B: Vec2 = pointOnCircle(C, 30);
const M_INITIAL: Vec2 = pointOnCircle(C, 270);

interface Refs {
  svg: SVGSVGElement;
  m: SVGCircleElement;
  segAM: SVGLineElement;
  segBM: SVGLineElement;
  inscribedReadout: HTMLElement;
  centralReadout: HTMLElement;
}

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number): Vec2 {
  // Convert a clientX/clientY coordinate to the SVG's viewBox space.
  const rect = svg.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * VIEW_SIZE;
  const y = ((clientY - rect.top) / rect.height) * VIEW_SIZE;
  return vec(x, y);
}

function update(refs: Refs, m: Vec2) {
  refs.m.setAttribute('cx', m.x.toFixed(2));
  refs.m.setAttribute('cy', m.y.toFixed(2));
  refs.segAM.setAttribute('x2', m.x.toFixed(2));
  refs.segAM.setAttribute('y2', m.y.toFixed(2));
  refs.segBM.setAttribute('x2', m.x.toFixed(2));
  refs.segBM.setAttribute('y2', m.y.toFixed(2));

  const inscribed = angleAtVertex(A, m, B);
  // Central angle subtended by AB at the center O (constant — does not depend on M).
  const central = angleAtVertex(A, C.center, B);
  refs.inscribedReadout.textContent = `${inscribed.toFixed(1)}°`;
  refs.centralReadout.textContent = `${central.toFixed(1)}°`;
}

export function setupInscribedAngle(svgSelector: string) {
  const svg = document.querySelector<SVGSVGElement>(svgSelector);
  if (!svg) return;
  const m = svg.querySelector<SVGCircleElement>('[data-vertex="M"]');
  const segAM = svg.querySelector<SVGLineElement>('[data-segment="AM"]');
  const segBM = svg.querySelector<SVGLineElement>('[data-segment="BM"]');
  const inscribedReadout = document.querySelector<HTMLElement>('[data-readout="inscribed"]');
  const centralReadout = document.querySelector<HTMLElement>('[data-readout="central"]');
  if (!m || !segAM || !segBM || !inscribedReadout || !centralReadout) return;

  const refs: Refs = { svg, m, segAM, segBM, inscribedReadout, centralReadout };
  let active = false;

  // Render initial state once.
  update(refs, M_INITIAL);

  const onPointerDown = (e: PointerEvent) => {
    active = true;
    m.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!active) return;
    const raw = clientToSvg(svg, e.clientX, e.clientY);
    const projected = projectToCircle(raw, C);
    update(refs, projected);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!active) return;
    active = false;
    if (m.hasPointerCapture(e.pointerId)) m.releasePointerCapture(e.pointerId);
  };

  const ctrl = new AbortController();
  const opts = { signal: ctrl.signal } as AddEventListenerOptions;

  m.addEventListener('pointerdown', onPointerDown, opts);
  m.addEventListener('pointermove', onPointerMove, opts);
  m.addEventListener('pointerup', onPointerUp, opts);
  m.addEventListener('pointercancel', onPointerUp, opts);

  // Astro fires astro:before-swap on view-transitions; tear down listeners then
  // so we don't leak on multi-page navigation.
  document.addEventListener('astro:before-swap', () => ctrl.abort(), { once: true });
}
