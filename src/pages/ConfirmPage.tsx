import { useEffect, useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, RM, slam } from '../lib/motion';
import { linkTo, useRouter } from '../lib/router';
import { icsFor, prettyDate, useBooking } from '../lib/booking';
import { Ticket } from '../components/Ticket';
import { Petals } from '../components/Petals';

export function ConfirmPage() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { go, revealed } = useRouter();
  const { booking: b, reset } = useBooking();
  const ics = useMemo(() => (b.ref ? URL.createObjectURL(new Blob([icsFor(b)], { type: 'text/calendar' })) : null), [b]);
  useEffect(() => () => { if (ics) URL.revokeObjectURL(ics); }, [ics]);

  useGSAP(() => {
    if (!b.ref || RM) return;
    const q = gsap.utils.selector(root);
    gsap.set('.ticket-seal', { autoAlpha: 0 });
    tl.current = gsap.timeline({ paused: true, delay: 0.35 })
      .fromTo('.ticket', { y: 120, rotation: -8, autoAlpha: 0 }, { y: 0, rotation: -2, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.4)' })
      .add(() => { slam(q('.ticket-seal')[0], { from: 4, rot: -40, to: -10, shake: q('.ticket')[0] }); }, '-=.1')
      .fromTo('.confirm-copy > *', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }, '-=.2');
  }, { scope: root });

  useEffect(() => { if (revealed) tl.current?.play(); }, [revealed]);

  if (!b.ref || !b.date || !b.time) {
    return (
      <div className="notfound">
        <p className="label">Nothing stamped yet</p>
        <h1>There's no booking to show.</h1>
        <p>Bookings live in this browser tab only, so a refresh clears them.</p>
        <a className="btn btn-gold" {...linkTo(go, 'reserve')}><span className="zh" aria-hidden="true">订</span>Book a table</a>
      </div>
    );
  }

  return (
    <div ref={root} className="confirm-page">
      <Petals count={40} />
      <div className="confirm">
        <Ticket booking={b} stamped />
        <div className="confirm-copy">
          <p className="label">Stamped · {b.ref}</p>
          <h1>See you on {prettyDate(b.date)}.</h1>
          <p>A table for {b.guests} at {b.time}{b.tasting ? ', with the Dragon Gate tasting menu' : ''}, under {b.name.trim()}.</p>
          <p className="proto">This is a prototype. No reservation system is connected yet, so the table isn't actually held and no email has been sent to {b.email.trim()}.</p>
          <div className="confirm-cta">
            {ics && <a className="btn btn-gold mag" href={ics} download={`koi-${b.ref}.ics`}><span className="zh" aria-hidden="true">历</span>Add to calendar</a>}
            <a className="btn btn-line mag" {...linkTo(go, 'menu')}><span className="zh" aria-hidden="true">菜</span>Read the menu</a>
            <button type="button" className="btn btn-line" onClick={e => { reset(); go('reserve', e); }}>Book another</button>
          </div>
        </div>
      </div>
    </div>
  );
}
