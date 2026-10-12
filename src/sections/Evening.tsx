import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, token, vars, vel } from '../lib/motion';
import { LANTERNS } from '../data/evening';

/** Pinned: three lanterns light one by one as you scroll, each bringing its own line. They swing with scroll speed. */
export function Evening() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const lit = token('--red'), litText = token('--gold');
    const copies = q('.ec');
    gsap.set(copies, { autoAlpha: 0, yPercent: 40 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=220%', pin: true, scrub: 1 } })
      .fromTo('.lw', { y: '-60vh' }, { y: 0, duration: 0.15, stagger: 0.04, ease: 'back.out(1.2)' }, 0)
      .fromTo('.eve-title>*', { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.1, stagger: 0.04 }, 0.05);
    q<HTMLElement>('.lantern').forEach((lantern, i) => {
      const at = 0.22 + i * 0.24;
      tl.to(lantern, { '--lan': lit, '--lc': litText, duration: 0.04 }, at)
        .to(lantern.querySelectorAll('.halo'), { scale: 1, duration: 0.1, stagger: 0.02, ease: 'back.out(2)' }, at)
        .to(copies[i], { autoAlpha: 1, yPercent: 0, duration: 0.07, ease: 'power2.out' }, at + 0.02);
      if (i === 0) tl.to('.eve-title', { autoAlpha: 0, y: -30, duration: 0.06 }, at);
      if (copies[i - 1]) tl.to(copies[i - 1], { autoAlpha: 0, yPercent: -40, duration: 0.06, ease: 'power2.in' }, at - 0.02);
    });
    tl.to({}, { duration: 0.08 });

    const swing = q('.lantern').map(l => gsap.quickTo(l, 'rotation', { duration: 1.4, ease: 'elastic.out(1,.3)' }));
    const tick = () => { const r = gsap.utils.clamp(-16, 16, vel() / 140); swing.forEach((s, i) => s(r * (1 + i * 0.15))); };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, { scope: root });

  return (
    <section id="evening" ref={root}>
      <div className="lanterns" aria-hidden="true">
        {LANTERNS.map(l => (
          <div key={l.ch} className="lw" style={vars({ '--len': l.len, '--sw': l.sway, animationDelay: l.delay })}>
            <div className="str" />
            <div className="lantern">
              <div className="halo" /><div className="halo h2" />
              <div className="cap" /><div className="lbody"><span>{l.ch}</span></div><div className="cap" />
              <div className="tassel" />
            </div>
          </div>
        ))}
      </div>
      <div className="eve-title"><p className="label">06 — The evening</p><h2>Dinner begins <br />before you sit <em>夜</em></h2></div>
      <div className="eve-copy">
        {LANTERNS.map(l => (
          <div key={l.ch} className="ec"><p className="label">{l.label}</p><h3>{l.title}</h3><p>{l.body}</p></div>
        ))}
      </div>
    </section>
  );
}
