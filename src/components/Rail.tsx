import { useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from '../lib/motion';
import { goTo } from '../lib/scroll';
import { SECTIONS } from '../data/copy';

/** Section index on the right edge. Render it after <main> so its triggers are measured after every pin exists. */
export function Rail() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useGSAP(() => {
    SECTIONS.forEach(s => ScrollTrigger.create({
      trigger: `#${s.id}`, start: 'top center', end: 'bottom center',
      onToggle: t => { if (t.isActive) setActive(s.id); },
    }));
  });

  return (
    <nav className="rail" aria-label="Sections">
      {SECTIONS.map(s => (
        <button key={s.id} type="button" className={active === s.id ? 'on' : undefined} aria-label={s.name}
          aria-current={active === s.id ? 'true' : undefined} onClick={() => goTo(`#${s.id}`)}>
          {s.rail}
        </button>
      ))}
    </nav>
  );
}
