import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, rand, ScrollTrigger, slam, vars } from '../lib/motion';
import { categoryOf, money, SIGNATURES } from '../data/menu';
import { linkTo, useRouter } from '../lib/router';
import { Seal } from '../components/Seal';

const t = (name: string) => `var(--${name})`;

// card tones, in order, so neighbouring cards never share a colour
const TONES = [
  { bg: 'red', fg: 'paper', ac: 'gold', disc: 'red-d' },
  { bg: 'jade', fg: 'paper', ac: 'gold', disc: 'jade-d' },
  { bg: 'cobalt', fg: 'paper', ac: 'peony', disc: 'navy' },
  { bg: 'peony', fg: 'ink', ac: 'ink', disc: 'paper' },
  { bg: 'ink', fg: 'paper', ac: 'red', disc: 'navy' },
  { bg: 'paper', fg: 'ink', ac: 'red', disc: 'gold' },
];

/** Each dish is a full-screen card; the next slides over and the last one shrinks back into the stack. */
export function Menu() {
  const root = useRef<HTMLElement>(null);
  const { go } = useRouter();

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    gsap.timeline({ scrollTrigger: { trigger: '.menu-head', start: 'top bottom', end: 'bottom top', scrub: true } })
      .fromTo('.menu-big', { scale: 0.4, rotation: -35, autoAlpha: 1 }, { scale: 1, rotation: 0, ease: 'power2.out', duration: 1 })
      .to('.menu-big', { scale: 1.7, rotation: 20, autoAlpha: 0, ease: 'power1.in', duration: 1 });
    gsap.from('.menu-title h2', { yPercent: 60, rotationX: -80, transformPerspective: 900, transformOrigin: '50% 100%', autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.menu-head', start: 'top 55%' } });

    const cards = q<HTMLElement>('.card');
    cards.forEach((c, i) => {
      const inner = c.querySelector('.card-in'), seal = c.querySelector('.price');
      gsap.fromTo(inner, { rotation: i % 2 ? 3 : -3, yPercent: 6 }, { rotation: 0, yPercent: 0, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'top top', scrub: true } });
      gsap.fromTo(c.querySelector('.card-glyph'), { scale: 0.3, rotation: i % 2 ? 50 : -50 }, { scale: 1, rotation: 0, ease: 'power2.out', scrollTrigger: { trigger: c, start: 'top 85%', end: 'top 5%', scrub: true } });
      gsap.fromTo(c.querySelector('.card-disc'), { scale: 0 }, { scale: 1, ease: 'back.out(1.5)', scrollTrigger: { trigger: c, start: 'top 75%', end: 'top 10%', scrub: true } });
      gsap.set(seal, { autoAlpha: 0 });
      ScrollTrigger.create({ trigger: c, start: 'top 30%', once: true, onEnter: () => slam(seal, { rot: rand(-30, 30), to: rand(-9, 9), shake: c.querySelector('.card-body') }) });
      const next = cards[i + 1];
      if (next) {
        const st = { trigger: next, start: 'top bottom', end: 'top top', scrub: true };
        gsap.to(inner, { scale: 0.86, rotation: i % 2 ? -4 : 4, ease: 'none', immediateRender: false, scrollTrigger: st });
        gsap.to(c.querySelector('.card-shade'), { opacity: 0.55, ease: 'none', scrollTrigger: st });
      }
    });
  }, { scope: root });

  return (
    <section id="menu" ref={root}>
      <div className="menu-head">
        <div className="menu-big" aria-hidden="true">菜</div>
        <div className="menu-title"><h2>The Menu</h2><p>Six signatures · one kitchen · no shortcuts</p><a className="btn btn-ink mag" {...linkTo(go, 'menu')}><span className="zh" aria-hidden="true">菜</span>The full carte</a></div>
      </div>
      <div className="cards">
        {SIGNATURES.map((d, i) => (
          <article key={d.id} className="card">
            <div className="card-in" data-dish={d.id} style={vars({ '--bg': t(TONES[i].bg), '--fg': t(TONES[i].fg), '--ac': t(TONES[i].ac), '--disc': t(TONES[i].disc) })}>
              <div className="card-art" aria-hidden="true"><div className="card-disc" /><div className="card-glyph zoom-src">{d.glyph}</div></div>
              <div className="card-body">
                <span className="card-n">{String(i + 1).padStart(2, '0')} / {String(SIGNATURES.length).padStart(2, '0')} · {categoryOf(d).name}</span>
                <h3><a className="card-link" {...linkTo(go, 'dish', d.id)}>{d.name}</a></h3>
                <p>{d.desc}</p>
                <div className="card-meta"><Seal className="price" label={`Price ${money(d.price)}`}>{money(d.price)}</Seal><span>{d.note ?? categoryOf(d).line}</span></div>
              </div>
              {i < SIGNATURES.length - 1 && <div className="card-shade" />}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
