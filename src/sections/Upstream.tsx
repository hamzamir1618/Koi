import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, vars } from '../lib/motion';
import { PANELS } from '../data/story';

const t = (name: string) => `var(--${name})`;

/** The story, told sideways: a pinned horizontal track of four flat-colour panels, a koi rolling along the river below. */
export function Upstream() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const track = q<HTMLElement>('.up-track')[0];
    const dist = () => track.scrollWidth - innerWidth;
    const move = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
    });
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true } })
      .fromTo('.up-fill', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
      .fromTo('.up-koi-s', { x: 0 }, { x: () => q<HTMLElement>('.up-river')[0].offsetWidth, ease: 'none' }, 0)
      .fromTo('.up-koi', { rotation: 0 }, { rotation: 1080, ease: 'none' }, 0);

    q<HTMLElement>('.up-panel').forEach((p, i) => {
      const glyph = p.querySelector('.up-glyph'), disc = p.querySelector('.up-disc'), copy = p.querySelector('.up-copy');
      const enter = { trigger: p, containerAnimation: move, start: 'left right', end: 'center center', scrub: true };
      if (i === 0) {
        gsap.fromTo(glyph, { scale: 0.4, rotation: -30 }, { scale: 1, rotation: 0, ease: 'power2.out', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true } });
      } else {
        gsap.fromTo(glyph, { scale: 0.3, rotation: -40, xPercent: 40 }, { scale: 1, rotation: 0, xPercent: 0, ease: 'power2.out', scrollTrigger: enter });
        gsap.fromTo(disc, { scale: 0.2 }, { scale: 1, ease: 'back.out(1.4)', scrollTrigger: enter });
        gsap.fromTo(copy, { xPercent: 60, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, ease: 'power2.out', scrollTrigger: { ...enter, end: 'left 30%' } });
      }
      gsap.to(glyph, { rotation: 18, yPercent: -8, ease: 'none', immediateRender: false, scrollTrigger: { trigger: p, containerAnimation: move, start: 'center center', end: 'right left', scrub: true } });
    });
  }, { scope: root });

  return (
    <section id="upstream" ref={root}>
      <div className="up-track">
        {PANELS.map((p, i) => (
          <article key={p.num} className="up-panel" style={vars({ '--bg': t(p.bg), '--fg': t(p.fg), '--ac': t(p.ac), '--disc': t(p.disc) })}>
            <div className="up-art" aria-hidden="true"><div className="up-disc" /><div className="up-glyph">{p.glyph}</div></div>
            <div className="up-copy">
              <div className="up-num" aria-hidden="true">{p.num}</div>
              <p className="label">{p.label}</p>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              {i === 0 && <span className="cue">Keep scrolling <span aria-hidden="true">→</span></span>}
            </div>
          </article>
        ))}
      </div>
      <div className="up-river" aria-hidden="true">
        <div className="up-fill" />
        <div className="up-stops">{PANELS.map((p, i) => <span key={p.num} style={{ left: `${(i / (PANELS.length - 1)) * 100}%` }}>{p.num}</span>)}</div>
        <div className="up-koi-s"><img className="up-koi" src="/img/koi-gate.webp" alt="" /></div>
      </div>
    </section>
  );
}
