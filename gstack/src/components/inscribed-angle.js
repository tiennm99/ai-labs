import { angleAtVertex, circle, pointOnCircle, projectToCircle } from '~/geom-engine/circle';
import { vec } from '~/geom-engine/vec';

/** @typedef {import('~/geom-engine/vec').Vec2} Vec2 */

const VIEW_SIZE = 400;
const C = circle(VIEW_SIZE / 2, VIEW_SIZE / 2, 150);

// A and B are fixed; M is draggable on the circle.
/** @type {Vec2} */
const A = pointOnCircle(C, 150);
/** @type {Vec2} */
const B = pointOnCircle(C, 30);
/** @type {Vec2} */
const M_INITIAL = pointOnCircle(C, 270);

/**
 * @typedef {object} Refs
 * @property {SVGSVGElement} svg
 * @property {SVGCircleElement} m
 * @property {SVGLineElement} segAM
 * @property {SVGLineElement} segBM
 * @property {HTMLElement} inscribedReadout
 * @property {HTMLElement} centralReadout
 */

/**
 * Convert a clientX/clientY coordinate to the SVG's viewBox space.
 * @param {SVGSVGElement} svg
 * @param {number} clientX
 * @param {number} clientY
 * @returns {Vec2}
 */
function clientToSvg(svg, clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * VIEW_SIZE;
  const y = ((clientY - rect.top) / rect.height) * VIEW_SIZE;
  return vec(x, y);
}

/**
 * @param {Refs} refs
 * @param {Vec2} m
 */
function update(refs, m) {
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

/** @param {string} svgSelector */
export function setupInscribedAngle(svgSelector) {
  const svg = /** @type {SVGSVGElement | null} */ (document.querySelector(svgSelector));
  if (!svg) return;
  const m = /** @type {SVGCircleElement | null} */ (svg.querySelector('[data-vertex="M"]'));
  const segAM = /** @type {SVGLineElement | null} */ (svg.querySelector('[data-segment="AM"]'));
  const segBM = /** @type {SVGLineElement | null} */ (svg.querySelector('[data-segment="BM"]'));
  const inscribedReadout = /** @type {HTMLElement | null} */ (
    document.querySelector('[data-readout="inscribed"]')
  );
  const centralReadout = /** @type {HTMLElement | null} */ (
    document.querySelector('[data-readout="central"]')
  );
  if (!m || !segAM || !segBM || !inscribedReadout || !centralReadout) return;

  /** @type {Refs} */
  const refs = { svg, m, segAM, segBM, inscribedReadout, centralReadout };
  let active = false;

  // Render initial state once.
  update(refs, M_INITIAL);

  /** @param {PointerEvent} e */
  const onPointerDown = (e) => {
    active = true;
    m.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  /** @param {PointerEvent} e */
  const onPointerMove = (e) => {
    if (!active) return;
    const raw = clientToSvg(svg, e.clientX, e.clientY);
    const projected = projectToCircle(raw, C);
    update(refs, projected);
  };

  /** @param {PointerEvent} e */
  const onPointerUp = (e) => {
    if (!active) return;
    active = false;
    if (m.hasPointerCapture(e.pointerId)) m.releasePointerCapture(e.pointerId);
  };

  const ctrl = new AbortController();
  const opts = /** @type {AddEventListenerOptions} */ ({ signal: ctrl.signal });

  m.addEventListener('pointerdown', onPointerDown, opts);
  m.addEventListener('pointermove', onPointerMove, opts);
  m.addEventListener('pointerup', onPointerUp, opts);
  m.addEventListener('pointercancel', onPointerUp, opts);

  // Astro fires astro:before-swap on view-transitions; tear down listeners then
  // so we don't leak on multi-page navigation.
  document.addEventListener('astro:before-swap', () => ctrl.abort(), { once: true });
}
