import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, slam } from '../lib/motion';
import { lockScroll } from '../lib/scroll';
import { Seal } from './Seal';

type Props = { onReveal: () => void; onDone: () => void };

const STUDS = Array.from({ length: 35 }, (_, i) => <i key={i} />);

/** Intro: lacquered temple doors. A seal is pressed across the seam, the knockers rattle, the doors swing in. */
export function Doors({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP((_, contextSafe) => {
    lockScroll(true);
    gsap.set('.door-seal', { autoAlpha: 0 });
    const play = contextSafe!(() => {
      tl.current = gsap.timeline({ onComplete: () => { lockScroll(false); onDone(); ScrollTrigger.refresh(); } })
        .add(slam(root.current!.querySelector('.door-l .door-seal'), { from: 3.4, rot: -16, to: 0, ring: false }), 0.45)
        .add(slam(root.current!.querySelector('.door-r .door-seal'), { from: 3.4, rot: -16, to: 0, ring: false }), 0.45)
        .fromTo('.door-fx', { scale: 0.9, opacity: 1 }, { scale: 2.3, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.81)
        .fromTo('.doors-in', { x: -12, y: 5 }, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.25)' }, 0.81)
        .to('.knocker', { rotation: 26, duration: 0.16, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1.3)
        .to('.door-l', { rotationY: 100, duration: 1.6, ease: 'power3.inOut' }, 1.75)
        .to('.door-r', { rotationY: -100, duration: 1.6, ease: 'power3.inOut' }, 1.75)
        .to('.door-skip', { autoAlpha: 0, duration: 0.3 }, 1.75)
        .call(onReveal, [], 2.05)
        .to(root.current, { autoAlpha: 0, duration: 0.35 }, 2.9);
    });
    document.fonts.ready.then(play);
  }, { scope: root });

  const door = (side: 'l' | 'r') => (
    <div className={`door door-${side}`}>
      <div className="studs">{STUDS}</div>
      <div className="knocker" />
      <Seal className="door-seal">鲤</Seal>
    </div>
  );

  return (
    <div id="doors" ref={root} aria-hidden="true">
      <div className="doors-in">{door('l')}{door('r')}</div>
      <div className="door-fx" />
      <button className="door-skip" type="button" onClick={() => tl.current?.progress(1)}>Enter · 入</button>
    </div>
  );
}
