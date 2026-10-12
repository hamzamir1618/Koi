import { useEffect, useRef } from 'react';
import { RM, rand, token, vel, whileVisible } from '../lib/motion';

type Petal = { x: number; y: number; vx: number; vy: number; a: number; va: number; r: number; c: string; s: number; ss: number; flower: boolean };

/** Falling blossom on a canvas, flat fills only. Falls faster while the page is scrolled hard. */
export function Petals({ count = 46 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || RM) return;
    const ctx = cv.getContext('2d')!;
    const colours = [1, 2, 3, 4, 5].map(i => token(`--petal-${i}`));
    let W = 0, H = 0, live = false, raf = 0;
    const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
    size();
    addEventListener('resize', size);
    const make = (anywhere: boolean): Petal => ({
      x: Math.random() * W, y: anywhere ? Math.random() * H : -20, vx: rand(-0.6, 0.6), vy: rand(0.6, 1.7),
      a: rand(0, 6.3), va: rand(-0.05, 0.05), r: rand(5, 12), c: colours[(Math.random() * colours.length) | 0],
      s: rand(0, 6.3), ss: rand(0.012, 0.03), flower: Math.random() > 0.45,
    });
    const ps = Array.from({ length: count }, () => make(true));
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!live) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.s += p.ss; p.x += p.vx + Math.sin(p.s) * 0.7; p.y += p.vy + Math.abs(vel()) / 900; p.a += p.va;
        if (p.y > H + 20) Object.assign(p, make(false));
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        if (p.flower) {
          for (let i = 0; i < 5; i++) { ctx.rotate(1.2566); ctx.beginPath(); ctx.ellipse(0, -p.r * 0.55, p.r * 0.33, p.r * 0.6, 0, 0, 6.283); ctx.fill(); }
        } else { ctx.beginPath(); ctx.ellipse(0, 0, p.r * 0.45, p.r, 0, 0, 6.283); ctx.fill(); }
        ctx.restore();
      }
    };
    loop();
    const unwatch = whileVisible(cv, v => { live = v; });
    return () => { cancelAnimationFrame(raf); unwatch(); removeEventListener('resize', size); };
  }, [count]);

  return <canvas ref={ref} id="petals" aria-hidden="true" />;
}
