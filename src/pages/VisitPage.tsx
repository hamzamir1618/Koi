import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, slam } from '../lib/motion';
import { linkTo, useRouter } from '../lib/router';
import { VISIT } from '../data/pages';
import { PageHead } from '../components/PageHead';
import { Seal } from '../components/Seal';

const TODAY = new Date().toLocaleDateString('en-GB', { weekday: 'long' });

// A plain street plan, not a real map: straight streets drawn in on arrival, KOI's seal pressed onto Silk Lane.
const STREETS = [
  { d: 'M0 120 L600 150', name: 'Old Street', x: 40, y: 112 },
  { d: 'M330 0 L380 400', name: 'Great Eastern St', x: 388, y: 330, rot: 83 },
  { d: 'M90 400 L470 40', name: 'Shoreditch High St', x: 120, y: 330, rot: -43 },
  { d: 'M0 270 L600 250', name: 'Rivington St', x: 470, y: 242 },
  { d: 'M160 150 L210 400', name: '', x: 0, y: 0 },
  { d: 'M455 150 L520 400', name: '', x: 0, y: 0 },
];
const SILK_LANE = 'M220 205 L360 196';

export function VisitPage() {
  const root = useRef<HTMLDivElement>(null);
  const { go } = useRouter();

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const paths = q<SVGPathElement>('.map path');
    paths.forEach(p => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    gsap.set('.map-pin', { autoAlpha: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.map', start: 'top 80%' } })
      .to(paths, { strokeDashoffset: 0, duration: 0.8, stagger: 0.08, ease: 'power2.inOut' })
      .fromTo('.map text', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, '-=.3')
      .fromTo('.station', { scale: 0 }, { scale: 1, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(3)', stagger: 0.1 }, '-=.4');
    tl.add(() => { slam(q('.map-pin')[0], { from: 4, rot: -40, to: -8, shake: q('.map')[0] }); });

    gsap.fromTo('.hours li', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '.hours', start: 'top 85%' } });
    gsap.fromTo('.way', { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.ways', start: 'top 85%' } });
    gsap.set('.print-room .seal', { autoAlpha: 0 });
    ScrollTrigger.create({ trigger: '.print-room', start: 'top 75%', once: true, onEnter: () => slam(q('.print-room .seal')[0], { rot: 30, to: 6 }) });
  }, { scope: root });

  return (
    <div ref={root}>
      <PageHead glyph="访" eyebrow="Visit · Thursday to Sunday" title="Find us" tone="cobalt">
        <p>A former print works on a cobbled lane, two minutes from Old Street. Look for the red door.</p>
      </PageHead>

      <section className="visit">
        <div className="visit-info">
          <address>{VISIT.address.map(l => <span key={l}>{l}</span>)}</address>
          <p className="contact">
            <a href={`tel:${VISIT.phone.replace(/\s/g, '')}`}>{VISIT.phone}</a>
            <a href={`mailto:${VISIT.email}`}>{VISIT.email}</a>
          </p>
          <h2 className="mini">Hours</h2>
          <ul className="hours">
            {VISIT.hours.map(h => (
              <li key={h.day} className={`${h.day === TODAY ? 'today' : ''}${h.time === 'Closed' ? ' shut' : ''}`}>
                <span>{h.day}{h.day === TODAY && <em> · today</em>}</span><span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="map">
          <svg viewBox="0 0 600 400" role="img" aria-label="Street plan: KOI is on Silk Lane, between Old Street and Rivington Street, west of Great Eastern Street.">
            <rect width="600" height="400" className="map-ground" />
            {STREETS.map((s, i) => <path key={i} d={s.d} className="street" />)}
            <path d={SILK_LANE} className="street silk" />
            {STREETS.filter(s => s.name).map(s => (
              <text key={s.name} x={s.x} y={s.y} transform={s.rot ? `rotate(${s.rot} ${s.x} ${s.y})` : undefined}>{s.name}</text>
            ))}
            <text x="226" y="186" className="silk-label">Silk Lane</text>
            <g className="station" transform="translate(372 134)"><circle r="13" /><text y="5" textAnchor="middle">⊖</text></g>
            <text x="392" y="100" className="station-label">Old Street ⊖</text>
          </svg>
          <Seal className="map-pin" style={{ left: '48%', top: '50%' }} label="KOI">鲤</Seal>
          <figcaption>Not to scale. Old Street station is a six-minute walk.</figcaption>
        </figure>
      </section>

      <section className="ways">
        {VISIT.getting.map(w => (
          <div key={w.how} className="way"><span aria-hidden="true">{w.zh}</span><h3>{w.how}</h3><p>{w.detail}</p></div>
        ))}
        <div className="way"><span aria-hidden="true">便</span><h3>Access</h3><p>{VISIT.access}</p></div>
      </section>

      <section className="print-room">
        <Seal style={{ ['--s' as string]: 'clamp(90px,12vw,150px)', ['--sbg' as string]: 'var(--gold)', ['--sfg' as string]: 'var(--red-d)' }}>印</Seal>
        <div>
          <p className="label">Private dining</p>
          <h2>The Print Room</h2>
          <p>{VISIT.private}</p>
          <div className="pr-cta">
            <a className="btn btn-gold mag" href={`mailto:${VISIT.email}?subject=The%20Print%20Room`}><span className="zh" aria-hidden="true">信</span>{VISIT.email}</a>
            <a className="btn btn-line mag" {...linkTo(go, 'reserve')}><span className="zh" aria-hidden="true">订</span>Book a table</a>
          </div>
        </div>
      </section>
    </div>
  );
}
