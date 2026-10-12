import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, rand, ScrollTrigger, slam, vars } from '../lib/motion';
import type { Water } from '../gl/water';
import { TIDE } from '../data/copy';
import { Seal } from '../components/Seal';
import { Waves } from '../components/Waves';

const SCALLOPS = Array.from({ length: 14 }, (_, i) => <i key={i} />);

export function Tide() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', pin: true, scrub: 1 } });
    gsap.set('.curtain', { yPercent: 112 });
    gsap.set('.tide-stamps .seal', { autoAlpha: 0 });
    tl.fromTo('.wl-back', { yPercent: 70 }, { yPercent: 0, duration: 0.24, ease: 'power2.out' }, 0)
      .fromTo('.wl-mid', { yPercent: 80 }, { yPercent: 0, duration: 0.24, ease: 'power2.out' }, 0.04)
      .fromTo('.wl-front', { yPercent: 90 }, { yPercent: 0, duration: 0.24, ease: 'power2.out' }, 0.08)
      .fromTo('.tide-glyph', { scale: 0.35, rotation: -25, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.3, ease: 'back.out(1.6)' }, 0.02)
      .fromTo('.koi-s', { y: '55vh', scale: 0.5 }, { y: '-4vh', scale: 1, duration: 0.36, ease: 'power2.out' }, 0.16)
      .fromTo('.tide-koi', { rotation: -60 }, { rotation: 420, duration: 1, ease: 'none' }, 0.16)
      .to('.tide-line .w', { opacity: 1, duration: 0.06, stagger: 0.035, ease: 'none' }, 0.28)
      .fromTo('.tide-note', { x: 80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.14 }, 0.4)
      .to('.curtain', { yPercent: 0, duration: 0.3, ease: 'power2.inOut' }, 0.7)
      .to('.koi-s', { y: '-70vh', scale: 0.6, duration: 0.3, ease: 'power2.in', immediateRender: false }, 0.7)
      .to('.scal', { autoAlpha: 0, duration: 0.04 }, 0.97);

    ScrollTrigger.create({
      trigger: root.current, start: 'top 60%', once: true,
      onEnter: () => q('.tide-stamps .seal').forEach((s, i) => gsap.delayedCall(i * 0.22, () => slam(s, { rot: rand(-30, 30), to: rand(-8, 8) }))),
    });

    // live water + flat ring ripples under the cursor; three.js loads on demand so it stays out of the first bundle
    let water: Water | null = null, gone = false;
    import('../gl/water').then(m => { if (!gone) water = m.createWater(q<HTMLCanvasElement>('.water')[0], () => tl.progress()); });
    const ripples = q('.ripples')[0];
    const ripple = (x: number, y: number, big = false) => {
      water?.drop(x, y, big);
      const r = document.createElement('i');
      r.className = 'ripple'; r.style.left = `${x}px`; r.style.top = `${y}px`;
      ripples.appendChild(r);
      gsap.fromTo(r, { scale: 0.4, opacity: 1 }, { scale: big ? 11 : 5.5, opacity: 0, duration: big ? 1.6 : 1.2, ease: 'power2.out', onComplete: () => r.remove() });
    };
    let last = 0;
    const local = (e: PointerEvent) => { const k = root.current!.getBoundingClientRect(); return [e.clientX - k.left, e.clientY - k.top] as const; };
    const move = (e: PointerEvent) => { const t = performance.now(); if (t - last < 90) return; last = t; ripple(...local(e)); };
    const click = (e: PointerEvent) => { const [x, y] = local(e); [0, 0.15, 0.3].forEach(d => gsap.delayedCall(d, () => ripple(x, y, true))); };
    root.current!.addEventListener('pointermove', move);
    root.current!.addEventListener('pointerdown', click);
    return () => { gone = true; water?.dispose(); };
  }, { scope: root });

  return (
    <section id="tide" ref={root}>
      <canvas className="water" aria-hidden="true" />
      <div className="center"><div className="tide-glyph" aria-hidden="true">潮</div></div>
      <h2 className="tide-line" aria-label={TIDE.line}>
        {TIDE.line.split(' ').map((w, i) => <span key={i}><span className="w" aria-hidden="true">{w}</span> </span>)}
      </h2>
      <div className="tide-stamps" aria-hidden="true">
        <Seal>水</Seal>
        <Seal style={vars({ '--sbg': 'var(--gold)', '--sfg': 'var(--ink)' })}>墨</Seal>
        <Seal style={vars({ '--sbg': 'var(--paper)', '--sfg': 'var(--cobalt)' })}>境</Seal>
      </div>
      <div className="tide-note"><span className="label">{TIDE.noteLabel}</span><p>{TIDE.note}</p></div>
      <Waves className="wl-back" src="/img/wave-back.webp" dur={70} />
      <Waves className="wl-mid" src="/img/wave-mid.webp" dur={46} />
      <div className="center"><div className="koi-s"><img className="tide-koi" src="/img/koi-tide.webp" alt="" /></div></div>
      <Waves className="wl-front" src="/img/wave-front.webp" dur={28} />
      <div className="ripples" />
      <div className="curtain"><div className="scal b">{SCALLOPS}</div><div className="scal f">{SCALLOPS}</div></div>
    </section>
  );
}
