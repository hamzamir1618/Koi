import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, RM, vel } from '../lib/motion';
import { TAPE } from '../data/copy';

const isZh = (t: string) => /[一-鿿]/.test(t);

/** Endless marquee row that speeds up with scroll velocity and reverses when you scroll back up. */
export function TapeRow({ dir }: { dir: 1 | -1 }) {
  const row = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tw = dir > 0
      ? gsap.fromTo(row.current, { xPercent: 0 }, { xPercent: -50, repeat: -1, duration: 26, ease: 'none' })
      : gsap.fromTo(row.current, { xPercent: -50 }, { xPercent: 0, repeat: -1, duration: 26, ease: 'none' });
    if (RM) { tw.pause(); return; }
    let cur = 1;
    const tick = () => {
      const v = vel();
      const target = (1 + Math.min(Math.abs(v) / 220, 9)) * (v < 0 ? -1 : 1);
      cur += (target - cur) * 0.08;
      tw.timeScale(cur);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  const items = [...TAPE, ...TAPE];
  return (
    <div className="tape-row" ref={row}>
      {items.map((t, i) => <span key={i} className={isZh(t) ? 'zh' : undefined}>{t} ·</span>)}
    </div>
  );
}
