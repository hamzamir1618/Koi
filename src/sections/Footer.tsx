import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, rand } from '../lib/motion';
import { ADDRESS, HOURS } from '../data/copy';
import { TapeRow } from '../components/Tape';
import { linkTo, useRouter, type View } from '../lib/router';

const LINKS: [View, string, string][] = [['menu', '菜', 'Menu'], ['story', '道', 'Story'], ['visit', '访', 'Visit'], ['reserve', '订', 'Reserve']];

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const { go } = useRouter();

  useGSAP(() => {
    gsap.from('.foot-koi span', { yPercent: 100, rotation: () => rand(-25, 25), stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'bottom bottom', scrub: 1 } });
  }, { scope: root });

  return (
    <footer ref={root}>
      <div className="tape t2 foot-tape" aria-hidden="true"><TapeRow dir={1} /></div>
      <nav className="foot-links" aria-label="Footer">
        {LINKS.map(([v, zh, name]) => <a key={v} {...linkTo(go, v)}><span className="zh" aria-hidden="true">{zh}</span>{name}</a>)}
      </nav>
      <div className="foot-koi" aria-hidden="true"><span>K</span><span>O</span><span>I</span></div>
      <div className="foot-row"><span>KOI 锦鲤 · {ADDRESS}</span><span>{HOURS}</span><span>© 2026 KOI Restaurant</span></div>
    </footer>
  );
}
