import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { CSSProperties } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger };

export const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const FINE = window.matchMedia('(pointer: fine)').matches;

export const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Scale at which a circle of diameter `d` covers the viewport, wherever its centre sits on screen. */
export const cover = (d: number) => (2 * Math.hypot(innerWidth, innerHeight) / d) * 1.04;

/** Read a colour token from tokens.css so canvas and shader code share the CSS palette. */
export const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Inline style that sets CSS custom properties (React's types reject `--x` keys). */
export const vars = (v: Record<string, string | number>) => v as CSSProperties;

let velocity = 0;
/** Latest scroll velocity in px/s (signed). */
export const vel = () => velocity;
export function trackVelocity() {
  ScrollTrigger.create({ onUpdate: s => { velocity = s.getVelocity(); } });
}

type SlamOpts = { from?: number; rot?: number; to?: number; shake?: Element | null; ring?: boolean };

/** A seal chop pressed onto the page: drops from big to small, a ring spreads, what it lands on shakes. */
export function slam(el: Element | null | undefined, { from = 3.2, rot = -20, to = -5, shake = null, ring = true }: SlamOpts = {}) {
  const tl = gsap.timeline();
  if (!el) return tl;
  tl.fromTo(el, { scale: from, autoAlpha: 0, rotation: rot }, { scale: 1, autoAlpha: 1, rotation: to, duration: 0.36, ease: 'power4.in' });
  if (ring) {
    const r = document.createElement('i');
    r.className = 'slam-ring';
    el.appendChild(r);
    tl.fromTo(r, { scale: 0.85, opacity: 1 }, { scale: 1.9, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => r.remove() }, '>-.02');
  }
  if (shake) tl.fromTo(shake, { x: -10, y: 4 }, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,.28)' }, ring ? '<' : '>');
  return tl;
}

/** Runs `onChange(true/false)` as the element enters/leaves the viewport. Pinned (fixed) sections count as visible. */
export function whileVisible(el: Element, onChange: (visible: boolean) => void) {
  const io = new IntersectionObserver(([e]) => onChange(e.isIntersecting), { rootMargin: '10% 0px' });
  io.observe(el);
  return () => io.disconnect();
}
