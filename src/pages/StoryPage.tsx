import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, rand, ScrollTrigger, slam, vars } from '../lib/motion';
import { linkTo, useRouter } from '../lib/router';
import { STORY } from '../data/pages';
import { PageHead } from '../components/PageHead';
import { Seal } from '../components/Seal';

/** The kitchen's history as a river: a brush line draws itself down the page, linking four chapters. */
export function StoryPage() {
  const root = useRef<HTMLDivElement>(null);
  const { go } = useRouter();

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const path = q<SVGPathElement>('.river path')[0];
    const L = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.chapters', start: 'top 70%', end: 'bottom 70%', scrub: 0.6 } });

    q<HTMLElement>('.chapter').forEach((ch, i) => {
      const panel = ch.querySelector('.ch-panel'), year = ch.querySelector('.ch-year'), glyph = ch.querySelector('.ch-glyph');
      const st = { trigger: ch, start: 'top 85%', end: 'top 30%', scrub: 0.6 };
      gsap.fromTo(panel, { clipPath: i % 2 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out', scrollTrigger: st });
      gsap.fromTo(glyph, { scale: 0.3, rotation: i % 2 ? 50 : -50 }, { scale: 1, rotation: 0, ease: 'back.out(1.4)', scrollTrigger: st });
      gsap.fromTo(year, { yPercent: 60, rotationX: -90, autoAlpha: 0 }, { yPercent: 0, rotationX: 0, autoAlpha: 1, transformPerspective: 800, ease: 'power3.out', scrollTrigger: st });
      gsap.fromTo(ch.querySelectorAll('.ch-copy > *'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ch, start: 'top 65%' } });
      gsap.set(ch.querySelector('.ch-node'), { scale: 0 });
      ScrollTrigger.create({ trigger: ch, start: 'top 70%', once: true, onEnter: () => slam(ch.querySelector('.ch-node'), { from: 3, rot: rand(-30, 30), to: 0 }) });
    });

    gsap.set('.principle .seal', { autoAlpha: 0 });
    ScrollTrigger.create({ trigger: '.principles', start: 'top 70%', once: true, onEnter: () => q('.principle .seal').forEach((s, i) => gsap.delayedCall(i * 0.2, () => slam(s, { rot: rand(-30, 30), to: rand(-8, 8) }))) });
    gsap.fromTo('.principle p,.principle h3', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.principles', start: 'top 65%' } });
    gsap.fromTo('.producer', { y: 60, rotation: () => rand(-5, 5), autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, stagger: 0.1, duration: 0.7, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.producers', start: 'top 80%' } });
  }, { scope: root });

  return (
    <div ref={root}>
      <PageHead glyph="道" eyebrow="Our story · 我们的路" title="Upstream" tone="jade">
        <p>{STORY.intro}</p>
      </PageHead>

      <section className="chapters">
        <svg className="river" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M20 0 C 36 90, 4 170, 20 250 S 36 410, 20 500 S 4 660, 20 750 S 36 910, 20 1000" vectorEffect="non-scaling-stroke" />
        </svg>
        {STORY.chapters.map((c, i) => (
          <article key={c.year} className={`chapter${i % 2 ? ' alt' : ''}`} style={vars({ '--tone': `var(--${c.colour})`, '--tone-fg': c.colour === 'gold' ? 'var(--ink)' : 'var(--paper)' })}>
            <span className="ch-node seal" aria-hidden="true">{c.num}</span>
            <div className="ch-panel" aria-hidden="true"><span className="ch-glyph">{c.glyph}</span></div>
            <div className="ch-copy">
              <p className="ch-year">{c.year}</p>
              <h2>{c.title}</h2>
              <p>{c.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="principles">
        <h2>Three rules in the kitchen</h2>
        <div className="principle-grid">
          {STORY.principles.map(p => (
            <div key={p.zh} className="principle">
              <Seal style={vars({ '--s': 'clamp(84px,9vw,120px)' })}>{p.zh}</Seal>
              <h3>{p.name}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="producers">
        <h2>Who we buy from</h2>
        <ul className="producer-grid">
          {STORY.producers.map(p => (
            <li key={p.name} className="producer"><span aria-hidden="true">{p.zh}</span><b>{p.name}</b><em>{p.what}</em></li>
          ))}
        </ul>
        <a className="btn btn-gold mag" {...linkTo(go, 'menu')}><span className="zh" aria-hidden="true">菜</span>Taste where it led</a>
      </section>
    </div>
  );
}
