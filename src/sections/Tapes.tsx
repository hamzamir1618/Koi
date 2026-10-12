import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion';
import { TapeRow } from '../components/Tape';

/** Two crossed tapes between the menu and the evening: they slide against each other as you pass. */
export function Tapes() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    root.current!.querySelectorAll<HTMLElement>('.tape').forEach((tape, i) => {
      gsap.fromTo(tape, { xPercent: i ? 14 : -14 }, { xPercent: i ? -14 : 14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }, { scope: root });

  return (
    <div className="tapes" ref={root} aria-hidden="true">
      <div className="tape t1"><TapeRow dir={1} /></div>
      <div className="tape t2"><TapeRow dir={-1} /></div>
    </div>
  );
}
