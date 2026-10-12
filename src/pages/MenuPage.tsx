import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, slam, vars } from '../lib/motion';
import { goTo } from '../lib/scroll';
import { linkTo, useRouter } from '../lib/router';
import { useBooking } from '../lib/booking';
import { CATEGORIES, DISHES, TASTING, TEAS, dishById, money, type Dish } from '../data/menu';
import { PageHead } from '../components/PageHead';
import { Seal } from '../components/Seal';

const t = (name: string) => `var(--${name})`;

export function Spice({ n }: { n?: number }) {
  if (!n) return null;
  return <span className="spice" aria-label={`Spice ${n} of 3`}>{Array.from({ length: 3 }, (_, i) => <i key={i} className={i < n ? 'on' : undefined} />)}</span>;
}

function Row({ d }: { d: Dish }) {
  const { go } = useRouter();
  return (
    <li className="row" data-dish={d.id}>
      <a className="row-link" {...linkTo(go, 'dish', d.id)}>
        <span className="row-fill" aria-hidden="true" />
        <span className="row-glyph zoom-src" aria-hidden="true">{d.glyph}</span>
        <span className="row-main">
          <span className="row-name">{d.name}{d.signature && <em className="row-sig">Signature</em>}</span>
          <span className="row-desc">{d.desc}</span>
        </span>
        <span className="row-marks">
          <Spice n={d.spice} />
          {d.plant && <span className="plant" title="Plant-based">素<span className="sr">Plant-based</span></span>}
        </span>
        <span className="row-price">{money(d.price)}</span>
      </a>
    </li>
  );
}

export function MenuPage() {
  const root = useRef<HTMLDivElement>(null);
  const { go } = useRouter();
  const { update } = useBooking();
  const [active, setActive] = useState(CATEGORIES[0].id);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    gsap.set('.tasting .seal', { autoAlpha: 0 });
    ScrollTrigger.create({ trigger: '.tasting', start: 'top 75%', once: true, onEnter: () => slam(q('.tasting .seal')[0], { rot: -30, to: -6, shake: q('.tasting')[0] }) });
    gsap.fromTo('.course', { y: 40, rotationX: -70, autoAlpha: 0 }, { y: 0, rotationX: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6, ease: 'back.out(1.6)', transformPerspective: 700, scrollTrigger: { trigger: '.courses', start: 'top 85%' } });

    q<HTMLElement>('.cat').forEach(cat => {
      const id = cat.dataset.cat!;
      gsap.fromTo(cat.querySelector('.cat-glyph'), { rotation: -40, scale: 0.6 }, { rotation: 12, scale: 1, ease: 'none', scrollTrigger: { trigger: cat, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(cat.querySelectorAll('.row'), { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: cat.querySelector('.rows'), start: 'top 85%' } });
      ScrollTrigger.create({ trigger: cat, start: 'top 45%', end: 'bottom 45%', onToggle: s => { if (s.isActive) setActive(id as typeof active); } });
    });
    gsap.fromTo('.tea', { scale: 0.6, rotation: () => gsap.utils.random(-12, 12), autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, stagger: 0.07, duration: 0.5, ease: 'back.out(2)', scrollTrigger: { trigger: '.teas', start: 'top 80%' } });
  }, { scope: root });

  return (
    <div ref={root}>
      <PageHead glyph="菜" eyebrow="The carte · Thursday to Sunday" title="The Menu">
        <p>Twenty-two dishes in six courses, from dumplings folded each afternoon to a short rib that takes three days. Order a few to share, or let the kitchen decide with the Dragon Gate.</p>
      </PageHead>

      <section className="tasting">
        <Seal className="tasting-seal" style={vars({ '--s': 'clamp(84px,11vw,140px)', '--sbg': 'var(--gold)', '--sfg': 'var(--red-d)' })}>{TASTING.zh}</Seal>
        <div className="tasting-copy">
          <p className="label">Tasting menu · {money(TASTING.price)} per guest · tea pairing +{money(TASTING.pairing)}</p>
          <h2>{TASTING.name}</h2>
          <p>{TASTING.line}</p>
          <ol className="courses">
            {TASTING.courses.map((id, i) => {
              const d = dishById(id)!;
              return (
                <li key={id} className="course" data-dish={id}>
                  <a {...linkTo(go, 'dish', id)}><span className="course-n" aria-hidden="true">{'一二三四五六'[i]}</span><span className="course-g zoom-src" aria-hidden="true">{d.glyph}</span><span>{d.name}</span></a>
                </li>
              );
            })}
          </ol>
          <a className="btn btn-gold mag" {...linkTo(go, 'reserve')} onClick={e => { e.preventDefault(); update({ tasting: true, guests: 4 }); go('reserve', e); }}>
            <span className="zh" aria-hidden="true">订</span>Book the Dragon Gate
          </a>
        </div>
      </section>

      <nav className="cat-tabs" aria-label="Courses">
        {CATEGORIES.map(c => (
          <button key={c.id} type="button" className={active === c.id ? 'on' : undefined} style={vars({ '--bg': t(c.bg), '--fg': t(c.fg) })}
            onClick={() => goTo(`#cat-${c.id}`, -140)}>
            <span className="zh" aria-hidden="true">{c.zh}</span><span className="nl">{c.name}</span>
          </button>
        ))}
      </nav>

      {CATEGORIES.map(c => (
        <section key={c.id} id={`cat-${c.id}`} className="cat" data-cat={c.id} style={vars({ '--bg': t(c.bg), '--fg': t(c.fg), '--ac': t(c.ac), '--disc': t(c.disc) })}>
          <header className="cat-head">
            <div className="cat-art" aria-hidden="true"><div className="cat-disc" /><div className="cat-glyph">{c.zh}</div></div>
            <div><h2>{c.name}</h2><p>{c.line}</p></div>
          </header>
          <ul className="rows">{DISHES.filter(d => d.category === c.id).map(d => <Row key={d.id} d={d} />)}</ul>
        </section>
      ))}

      <section className="teas-wrap">
        <h2>Tea, poured properly <span className="zh">茶</span></h2>
        <p className="teas-sub">Brewed at the table in a gaiwan, refilled until you stop us.</p>
        <ul className="teas">
          {TEAS.map(tea => (
            <li key={tea.id} className="tea"><span className="tea-zh" aria-hidden="true">{tea.zh}</span><b>{tea.name}</b><span>{tea.note}</span><em>{money(tea.price)}</em></li>
          ))}
        </ul>
        <p className="allergy-note">Allergies or dietary needs? Tell us when you book and the kitchen will plan around them. Spice: <Spice n={1} /> to <Spice n={3} />. <span className="plant">素</span> plant-based.</p>
      </section>
    </div>
  );
}
