import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { cover, gsap, rand, vars } from '../lib/motion';
import { GATE } from '../data/copy';
import { Waves } from '../components/Waves';

/** The climax: a paifang builds itself, the koi leaps through, the plaque flashes, gold floods, the dragon appears. */
export function Gate() {
  const root = useRef<HTMLElement>(null);

  const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => {
    const z = rand(1.5, 3.6);
    return <i key={i} style={{ left: `${rand(0, 100)}%`, top: `${rand(0, 62)}%`, width: z, height: z, animationDelay: `${rand(-3, 0)}s`, animationDuration: `${rand(1.6, 4)}s` }} />;
  }), []);
  const falls = useMemo(() => Array.from({ length: 14 }, (_, i) => (
    <i key={i} style={vars({ left: `${rand(2, 97)}%`, '--d': `${rand(0.7, 1.5)}s`, '--dl': `${rand(-1.5, 0)}s` })} />
  )), []);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    gsap.set('.gate-reveal>*', { autoAlpha: 0 });
    gsap.set('.gate-koi-s', { x: () => -innerWidth * 0.42, y: () => innerHeight * 0.62, scale: 0.55 });
    // every tween is fromTo: invalidateOnRefresh would lock a .from() into its hidden state
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=300%', pin: true, scrub: 1, invalidateOnRefresh: true } })
      .fromTo('.pf-pillar', { yPercent: 100 }, { yPercent: 0, duration: 0.12, stagger: 0.03, ease: 'power3.out' }, 0)
      .fromTo('.pf-beam2,.pf-beam', { y: () => -innerHeight * 0.6 }, { y: 0, duration: 0.12, stagger: 0.03, ease: 'bounce.out' }, 0.06)
      .fromTo('.pf-roof,.pf-eave,.pf-ridge', { y: () => -innerHeight * 0.7 }, { y: 0, duration: 0.14, ease: 'bounce.out' }, 0.1)
      .fromTo('.pf-plaque', { scale: 3, autoAlpha: 0, rotation: -14 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.08, ease: 'power4.in' }, 0.2)
      .fromTo('.pf-falls', { scaleY: 0, transformOrigin: '50% 0' }, { scaleY: 1, duration: 0.1 }, 0.18)
      .fromTo('.crescent', { y: () => -innerHeight * 0.4 }, { y: 0, duration: 0.2, ease: 'power2.out' }, 0)
      .to('.gate-koi-s', { x: 0, duration: 0.3, ease: 'power1.out' }, 0.26)
      .to('.gate-koi-s', { y: () => -innerHeight * 0.06, duration: 0.3, ease: 'power3.out' }, 0.26)
      .to('.gate-koi', { rotation: 720, duration: 0.42, ease: 'none' }, 0.26)
      .to('.gate-koi-s', { scale: 1, duration: 0.3 }, 0.26)
      .to('.gate-koi-s', { y: () => -innerHeight * 0.75, scale: 0.4, duration: 0.16, ease: 'power2.in' }, 0.56)
      .to('.pf-plaque', { scale: 1.18, duration: 0.04, yoyo: true, repeat: 1 }, 0.56)
      .to('.gate-flood', { scale: () => cover(q<HTMLElement>('.gate-flood')[0].offsetWidth), duration: 0.18, ease: 'power3.in' }, 0.6)
      .to('.gate-dragon', { autoAlpha: 1, duration: 0.01 }, 0.74)
      .fromTo('.gate-dragon', { scale: 0.25, rotation: 60 }, { scale: 1, rotation: 0, duration: 0.18, ease: 'back.out(1.4)' }, 0.74)
      .to('.gate-zh', { autoAlpha: 1, duration: 0.01 }, 0.8)
      .fromTo('.gate-zh span', { y: -120, scale: 2.4, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.1, stagger: 0.025, ease: 'power4.in' }, 0.8)
      .to('.gate-en', { autoAlpha: 1, duration: 0.01 }, 0.86)
      .fromTo('.gate-en>*', { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.08, stagger: 0.03 }, 0.86)
      .to({}, { duration: 0.06 });
  }, { scope: root });

  return (
    <section id="gate" ref={root}>
      <div className="stars" aria-hidden="true">{stars}</div>
      <div className="crescent" aria-hidden="true" />
      <div className="pf" aria-hidden="true">
        <div className="pf-falls">{falls}</div>
        <div className="pf-pillar l" /><div className="pf-pillar r" />
        <div className="pf-beam2" />
        <div className="pf-beam" />
        <div className="pf-roof" />
        <div className="pf-eave" />
        <div className="pf-ridge" />
        <div className="pf-plaque">龍門</div>
        <div className="gate-flood" />
      </div>
      <div className="gate-water"><Waves className="wl-front" src="/img/wave-front.webp" dur={24} /></div>
      <div className="gate-koi-s" aria-hidden="true"><img className="gate-koi" src="/img/koi-gate.webp" alt="" /></div>
      <div className="gate-reveal">
        <div className="gate-dragon" aria-hidden="true"><img src="/img/dragon-ink.webp" alt="" /></div>
        <div className="gate-zh" aria-label="Li yu yue long men">{GATE.zh.map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</div>
        <div className="gate-en"><h2>{GATE.title}</h2><p>{GATE.sub}</p></div>
      </div>
    </section>
  );
}
