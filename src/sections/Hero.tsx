import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { cover, FINE, gsap, rand, RM, slam } from '../lib/motion';
import { HERO } from '../data/copy';
import { linkTo, useRouter } from '../lib/router';
import { Petals } from '../components/Petals';
import { Seal } from '../components/Seal';

// Layers nest three wrappers so tweens never fight: .par (mouse depth) > scroll wrapper > intro target.
export function Hero() {
  const { go, revealed } = useRouter();
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);

    // entrance, built paused (its from-states hide everything) and played when the doors open
    if (!RM) {
      intro.current = gsap.timeline({ paused: true })
        .from('.sun', { scale: 0, duration: 1.5, ease: 'elastic.out(1,.6)' }, 0)
        .fromTo('.hero-dragon',
          { clipPath: 'polygon(0% 0%,0% 0%,-40% 100%,-40% 100%)', rotation: -12, scale: 0.9 },
          { clipPath: 'polygon(0% 0%,140% 0%,100% 100%,-40% 100%)', rotation: 0, scale: 1, duration: 1.6, ease: 'power3.inOut' }, 0.15)
        .from('.ch', { x: () => rand(-50, 50) + 'vw', y: () => rand(40, 90) + 'vh', rotation: () => rand(-140, 140), scale: 0.3, autoAlpha: 0, duration: 1.6, stagger: 0.12, ease: 'expo.out' }, 0.25)
        .from('.hero-blossom', { rotation: -38, y: -60, autoAlpha: 0, duration: 1.8, ease: 'elastic.out(1,.45)' }, 0.3)
        .from('.hero-eyebrow,.hero-tag,.hero-cta', { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0.8)
        .from('.vtext span', { y: -80, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: 'back.out(2.4)' }, 0.7)
        .add(slam(q('.hs')[0], { rot: 24, to: -8 }), 1.4);
    }

    // mouse depth
    if (FINE && !RM) {
      const layers = q<HTMLElement>('.par[data-d]').map(el => ({
        x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }), d: +el.dataset.d!,
      }));
      const move = (e: PointerEvent) => {
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        layers.forEach(l => { l.x(-nx * l.d * 2.2); l.y(-ny * l.d * 2.2); });
      };
      root.current!.addEventListener('pointermove', move);
    }

    // scroll: the letters scatter like a school of fish, the dragon flies, a cobalt moon eclipses the sun and floods the screen
    gsap.set('.moon', { x: () => innerWidth * 0.9 });
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=170%', pin: true, scrub: 1, invalidateOnRefresh: true } })
      .to('.lt', { x: () => rand(-45, 45) + 'vw', y: () => rand(-170, -110) + 'vh', rotation: () => rand(-150, 150), scale: () => rand(0.4, 0.9), duration: 0.42, ease: 'power2.in', stagger: 0.03 }, 0)
      .to('.lt', { autoAlpha: 0, duration: 0.1, stagger: 0.03 }, 0.34)
      .to('.hf', { y: -70, autoAlpha: 0, duration: 0.22, stagger: 0.04 }, 0)
      .to('.blossom-s', { x: '-30vw', y: '-50vh', rotation: -35, duration: 0.45, ease: 'power2.in' }, 0)
      .to('.hero-side', { x: '25vw', autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.04)
      .to('#petals', { autoAlpha: 0, duration: 0.3 }, 0.15)
      .to('.dragon-s', { y: '-120vh', rotation: -38, scale: 1.35, duration: 0.5, ease: 'power2.in' }, 0.1)
      .to('.moon', { x: 0, duration: 0.34, ease: 'power2.out' }, 0.2)
      .to('.sun-s', { scale: 1.09, duration: 0.12, ease: 'back.out(3)' }, 0.52)
      .to('.moon-s', { scale: () => cover(q<HTMLElement>('.moon-s')[0].offsetWidth), duration: 0.42, ease: 'power3.in' }, 0.62);
  }, { scope: root });

  useEffect(() => { if (revealed) intro.current?.play(); }, [revealed]);

  return (
    <section id="hero" ref={root}>
      <div className="par" data-d="14"><div className="disc-s sun-s"><div className="sun" /></div></div>
      <div className="par"><div className="disc-s moon-s"><div className="moon" /></div></div>
      <div className="par" data-d="26"><div className="disc-s dragon-s"><img className="hero-dragon" src="/img/dragon-ink.webp" alt="" /></div></div>
      <Petals />
      <div className="par" data-d="40"><div className="blossom-s"><img className="hero-blossom" src="/img/blossom.webp" alt="" /></div></div>

      <div className="hero-side">
        <div className="vtext" aria-label="Jin li — the koi leaps the dragon gate">
          {HERO.vertical.map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}
        </div>
        <Seal className="hs">福</Seal>
      </div>

      <div className="hero-copy">
        <div className="hf"><p className="label hero-eyebrow">{HERO.eyebrow}</p></div>
        <h1 className="hero-koi" aria-label="KOI">
          {['K', 'O', 'I'].map(c => <span key={c} className="lt" aria-hidden="true"><span className="ch">{c}</span></span>)}
        </h1>
        <div className="hf"><p className="hero-tag">{HERO.tagline}</p></div>
        <div className="hf">
          <div className="hero-cta">
            <a className="btn btn-gold mag" {...linkTo(go, 'reserve')}><span className="zh" aria-hidden="true">来</span>Reserve a table</a>
            <a className="btn btn-line mag" {...linkTo(go, 'menu')}><span className="zh" aria-hidden="true">菜</span>See the menu</a>
          </div>
        </div>
      </div>
    </section>
  );
}
