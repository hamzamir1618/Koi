import Lenis from 'lenis';
import { gsap, ScrollTrigger, RM } from './motion';

let lenis: Lenis | null = null;

/** Smooth scroll, driven by the GSAP ticker so ScrollTrigger scrubs stay in step. Call once before render. */
export function startSmoothScroll() {
  if (RM || lenis) return;
  lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function goTo(selector: string, offset = 0) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, offset });
  else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
}

/** Jump (or glide, when `smooth`) back to the top of the page. */
export function scrollTop(smooth = false) {
  if (lenis) lenis.scrollTo(0, smooth && !RM ? { duration: 1.2 } : { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: smooth && !RM ? 'smooth' : 'auto' });
}

export function lockScroll(on: boolean) {
  document.documentElement.classList.toggle('locked', on);
  if (lenis) (on ? lenis.stop() : lenis.start());
}

/** Dev-only handles for the puppeteer checks. */
export function exposeForTesting() {
  if (!import.meta.env.DEV) return;
  Object.assign(window, { lenis, ScrollTrigger, gsap });
}
