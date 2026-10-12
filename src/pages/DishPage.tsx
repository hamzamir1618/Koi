import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, rand, RM, slam, vars } from '../lib/motion';
import { linkTo, useRouter } from '../lib/router';
import { useBooking } from '../lib/booking';
import { DISHES, TASTING, categoryOf, dishById, money, teaById } from '../data/menu';
import { Chars } from '../components/PageHead';
import { Seal } from '../components/Seal';
import { Spice } from './MenuPage';

const t = (name: string) => `var(--${name})`;

export function DishPage() {
  const { route, go, revealed } = useRouter();
  const { update } = useBooking();
  const root = useRef<HTMLDivElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const d = dishById(route.param);

  useGSAP(() => {
    if (!d || RM) return;
    const q = gsap.utils.selector(root);
    // arriving by zoom, the flying character lands on .zoom-dest and reveals it
    const zooming = !!document.querySelector('.zoom-flyer');
    if (zooming) gsap.set('.zoom-dest', { autoAlpha: 0 });
    gsap.set(q('.dish-price'), { autoAlpha: 0 });
    intro.current = gsap.timeline({ paused: true, delay: zooming ? 0.4 : 0.1 })
      .fromTo('.dish-disc', { scale: 0 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1,.6)' }, 0)
      .fromTo('.dish-eyebrow', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.1)
      .fromTo('.dish-name .ch', { y: -110, rotation: () => rand(-35, 35), autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, duration: 0.6, stagger: 0.03, ease: 'back.out(2)' }, 0.15)
      .fromTo('.dish-desc,.dish-long', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 0.5)
      .add(() => { slam(q('.dish-price')[0], { rot: -24, to: -6, shake: q('.dish-copy')[0] }); }, 0.7)
      .fromTo('.chip', { scale: 2.4, rotation: () => rand(-40, 40), autoAlpha: 0 }, { scale: 1, rotation: () => rand(-4, 4), autoAlpha: 1, duration: 0.3, stagger: 0.07, ease: 'power4.in' }, 0.9)
      .fromTo('.pairing,.dish-cta>*', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, 1.2);
    if (!zooming) intro.current.fromTo('.zoom-dest', { scale: 2.4, rotation: -50, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.45, ease: 'power4.in' }, 0.1);
    gsap.fromTo('.more-card', { y: 60, rotation: () => rand(-6, 6), autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, stagger: 0.1, duration: 0.7, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.more', start: 'top 85%' } });
  }, { scope: root, dependencies: [route.param] });

  useEffect(() => { if (revealed) intro.current?.play(); }, [revealed]);

  if (!d) {
    return (
      <div className="notfound">
        <p className="label">Not on the menu</p>
        <h1>That dish isn't on the carte.</h1>
        <p>It may have come off the menu with the season.</p>
        <a className="btn btn-gold" {...linkTo(go, 'menu')}><span className="zh" aria-hidden="true">菜</span>See the menu</a>
      </div>
    );
  }

  const c = categoryOf(d);
  const tea = teaById(d.pairing);
  const inTasting = TASTING.courses.includes(d.id);
  const more = DISHES.filter(x => x.category === d.category && x.id !== d.id).slice(0, 3);

  return (
    <div ref={root} className="dish-page" style={vars({ '--bg': t(c.bg), '--fg': t(c.fg), '--ac': t(c.ac), '--disc': t(c.disc) })}>
      <div className="dish-top">
        <a className="backlink" {...linkTo(go, 'menu')}>← The carte</a>
      </div>
      <section className="dish">
        <div className="dish-art" aria-hidden="true"><div className="dish-disc" /><div className="dish-glyph zoom-dest">{d.glyph}</div></div>
        <div className="dish-copy">
          <p className="label dish-eyebrow">{c.zh} · {c.name}{d.note ? ` · ${d.note}` : ''}</p>
          <h1 className="dish-name" aria-label={d.name}><Chars text={d.name} /></h1>
          <p className="dish-zh" lang="zh">{d.zh}</p>
          <p className="dish-desc">{d.desc}</p>
          <p className="dish-long">{d.long}</p>
          <div className="dish-meta">
            <Seal className="dish-price" label={`Price ${money(d.price)}`} style={vars({ '--s': '96px', '--sbg': 'var(--ac)', '--sfg': 'var(--bg)' })}>{money(d.price)}</Seal>
            <Spice n={d.spice} />
            {d.plant && <span className="plant">素 Plant-based</span>}
            {d.signature && <span className="tag">Signature</span>}
          </div>
          <h2 className="mini">What's in it</h2>
          <ul className="chips">{d.ingredients.map(i => <li key={i} className="chip">{i}</li>)}</ul>
          <h2 className="mini">Contains</h2>
          <ul className="chips allergens">{d.allergens.map(a => <li key={a} className="chip">{a}</li>)}</ul>
          <p className="fine">Allergen details are to be confirmed by the kitchen. Tell us about allergies when you book.</p>
          <div className="pairing">
            <span className="pairing-zh" aria-hidden="true">{tea.zh}</span>
            <div><p className="label">Pour with it</p><b>{tea.name}</b><span>{tea.note}</span></div>
            <em>{money(tea.price)}</em>
          </div>
          <div className="dish-cta">
            <a className="btn btn-ink mag" {...linkTo(go, 'reserve')}><span className="zh" aria-hidden="true">订</span>Book a table</a>
            {inTasting && (
              <a className="btn btn-line mag" {...linkTo(go, 'reserve')} onClick={e => { e.preventDefault(); update({ tasting: true, guests: 4 }); go('reserve', e); }}>
                <span className="zh" aria-hidden="true">龍</span>Part of the Dragon Gate
              </a>
            )}
          </div>
        </div>
      </section>
      {more.length > 0 && (
        <section className="more">
          <h2>Also {c.name.toLowerCase().startsWith('from') ? c.name.toLowerCase() : `in ${c.name.toLowerCase()}`}</h2>
          <div className="more-grid">
            {more.map(m => (
              <a key={m.id} className="more-card" data-dish={m.id} style={vars({ '--bg': t(c.bg) })} {...linkTo(go, 'dish', m.id)}>
                <span className="more-glyph zoom-src" aria-hidden="true">{m.glyph}</span>
                <b>{m.name}</b><span>{m.desc}</span><em>{money(m.price)}</em>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
