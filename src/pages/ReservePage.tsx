import { useMemo, useRef, useState, type FormEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, RM } from '../lib/motion';
import { useRouter } from '../lib/router';
import { goTo } from '../lib/scroll';
import { useBooking, makeRef, OPEN_DAYS, SLOTS, slotFull, slotOpen, toISO, fromISO, prettyDate } from '../lib/booking';
import { PageHead } from '../components/PageHead';
import { Ticket } from '../components/Ticket';

const STEPS = [
  { zh: '一', name: 'Party' },
  { zh: '二', name: 'Night' },
  { zh: '三', name: 'Time' },
  { zh: '四', name: 'You' },
];
const OCCASIONS = ['Birthday', 'Anniversary', 'Business', 'Just because'];
const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WINDOW_DAYS = 60;

/** Press a tile like a seal: it drops from big and the row it sits in jolts. */
function press(el: Element | null) {
  if (!el || RM) return;
  gsap.fromTo(el, { scale: 1.35, rotation: gsap.utils.random(-8, 8) }, { scale: 1, rotation: 0, duration: 0.35, ease: 'power4.in' });
  gsap.fromTo(el.parentElement, { x: -5 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,.25)', delay: 0.3 });
}

function Calendar({ value, onPick }: { value: string | null; onPick: (iso: string, el: Element) => void }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const last = useMemo(() => new Date(today.getTime() + WINDOW_DAYS * 86400000), [today]);
  const [month, setMonth] = useState(() => value ? fromISO(value) : new Date(today));
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first grid
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const canPrev = first > today;
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= last;
  const shift = (n: number) => setMonth(m => new Date(m.getFullYear(), m.getMonth() + n, 1));

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">←</button>
        <b>{first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</b>
        <button type="button" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month">→</button>
      </div>
      <div className="cal-grid" role="grid">
        {WEEK.map(w => <span key={w} className="cal-dow" role="columnheader">{w}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={`x${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
          const iso = toISO(d);
          const open = OPEN_DAYS.includes(d.getDay()) && d >= today && d <= last;
          return (
            <button key={iso} type="button" role="gridcell" className={`cal-day${value === iso ? ' on' : ''}`} disabled={!open}
              aria-label={`${prettyDate(iso)}${open ? '' : ', closed'}`} aria-pressed={value === iso} onClick={e => onPick(iso, e.currentTarget)}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="fine">We open Thursday to Sunday and take bookings up to {WINDOW_DAYS} days ahead.</p>
    </div>
  );
}

export function ReservePage() {
  const root = useRef<HTMLDivElement>(null);
  const { go } = useRouter();
  const { booking: b, update } = useBooking();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const dir = useRef(1);

  // each step slides in like the next sheet of paper
  useGSAP(() => {
    // a shorter step can leave you looking at the footer: bring the steps back into view
    const top = root.current!.querySelector('.booking')!.getBoundingClientRect().top;
    if (step > 0 && top < 60) goTo('.booking', -110);
    if (RM) return;
    gsap.fromTo('.step-panel', { xPercent: 12 * dir.current, autoAlpha: 0, clipPath: dir.current > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
      { xPercent: 0, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.out' });
    gsap.fromTo('.step-panel .pick', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.02, ease: 'back.out(2)', delay: 0.15 });
  }, { scope: root, dependencies: [step] });

  const ready = [b.guests > 0, !!b.date, !!b.time, true];
  const goStep = (n: number) => { setError(''); dir.current = n > step ? 1 : -1; setStep(n); };
  const next = () => {
    if (!ready[step]) { setError(['', 'Pick a night first.', 'Pick a time first.', ''][step]); return; }
    goStep(step + 1);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!b.date || !b.time) { setError('Pick a night and a time first.'); return; }
    if (!b.name.trim()) { setError('We need a name for the table.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(b.email.trim())) { setError('That email address doesn\'t look right.'); return; }
    update({ ref: makeRef() });
    const r = (e.nativeEvent as SubmitEvent).submitter?.getBoundingClientRect();
    go('confirm', r ? { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 } : undefined);
  };

  const slots = b.date ? SLOTS.filter(s => slotOpen(b.date!, s)) : [];

  return (
    <div ref={root} className="reserve-page">
      <PageHead glyph="订" eyebrow="Reservations · up to 12 guests" title="Book a table" tone="red">
        <p>Four quick steps. For thirteen or more, or for the Print Room, write to us instead.</p>
      </PageHead>

      <div className="booking">
        <div className="booking-main">
          <ol className="steps" aria-label="Booking steps">
            {STEPS.map((s, i) => (
              <li key={s.zh} className={i === step ? 'on' : i < step ? 'done' : undefined}>
                <button type="button" onClick={() => i <= step || ready.slice(0, i).every(Boolean) ? goStep(i) : undefined} aria-current={i === step ? 'step' : undefined}>
                  <span className="zh" aria-hidden="true">{s.zh}</span>{s.name}
                </button>
              </li>
            ))}
          </ol>

          <form className="step-panel" key={step} onSubmit={submit} noValidate>
            {step === 0 && (
              <>
                <h2>How many of you?</h2>
                <div className="tiles">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                    <button key={n} type="button" className={`pick tile${b.guests === n ? ' on' : ''}`} aria-pressed={b.guests === n}
                      onClick={e => { press(e.currentTarget); update({ guests: n, tasting: n >= 4 ? b.tasting : false }); }}>{n}</button>
                  ))}
                </div>
                <label className={`pick toggle${b.tasting ? ' on' : ''}${b.guests < 4 ? ' off' : ''}`}>
                  <input type="checkbox" checked={b.tasting} disabled={b.guests < 4} onChange={e => update({ tasting: e.target.checked })} />
                  <span className="zh" aria-hidden="true">龍</span>
                  <span><b>The Dragon Gate tasting menu</b><em>{b.guests < 4 ? 'For tables of four or more.' : 'Six courses for the whole table, £95 each.'}</em></span>
                </label>
              </>
            )}

            {step === 1 && (
              <>
                <h2>Which night?</h2>
                <Calendar value={b.date} onPick={(iso, el) => { press(el); update({ date: iso, time: null }); }} />
              </>
            )}

            {step === 2 && (
              <>
                <h2>What time on {b.date ? prettyDate(b.date) : '…'}?</h2>
                <div className="tiles slots">
                  {slots.map(s => {
                    const full = slotFull(b.date!, s);
                    return (
                      <button key={s} type="button" className={`pick tile slot${b.time === s ? ' on' : ''}`} disabled={full} aria-pressed={b.time === s}
                        onClick={e => { press(e.currentTarget); update({ time: s }); }}>
                        {s}{full && <em>Full</em>}
                      </button>
                    );
                  })}
                </div>
                <p className="fine">Tables are held for two and a half hours. Availability shown here is illustrative until booking goes live.</p>
              </>
            )}

            {step === 3 && (
              <>
                <h2>Whose table is it?</h2>
                <div className="fields">
                  <div className="fld pick"><label htmlFor="bName">Name</label><input id="bName" autoComplete="name" value={b.name} onChange={e => update({ name: e.target.value })} required /></div>
                  <div className="fld pick"><label htmlFor="bEmail">Email</label><input id="bEmail" type="email" autoComplete="email" value={b.email} onChange={e => update({ email: e.target.value })} required /></div>
                  <div className="fld pick"><label htmlFor="bPhone">Phone <em>(optional)</em></label><input id="bPhone" type="tel" autoComplete="tel" value={b.phone} onChange={e => update({ phone: e.target.value })} /></div>
                </div>
                <p className="mini-label">Is it an occasion?</p>
                <div className="occasions">
                  {OCCASIONS.map(o => (
                    <button key={o} type="button" className={`pick occ${b.occasion === o ? ' on' : ''}`} aria-pressed={b.occasion === o}
                      onClick={e => { press(e.currentTarget); update({ occasion: b.occasion === o ? null : o }); }}>{o}</button>
                  ))}
                </div>
                <div className="fld pick wide"><label htmlFor="bNotes">Allergies, access, anything else</label><textarea id="bNotes" rows={3} value={b.notes} onChange={e => update({ notes: e.target.value })} /></div>
              </>
            )}

            {error && <p className="err" role="alert">{error}</p>}
            <div className="step-nav">
              {step > 0 && <button type="button" className="btn btn-line" onClick={() => goStep(step - 1)}>← Back</button>}
              {step < 3
                ? <button type="button" className="btn btn-gold mag" onClick={next}>Next: {STEPS[step + 1].name} →</button>
                : <button type="submit" className="btn btn-red mag"><span className="zh" aria-hidden="true">订</span>Stamp the booking</button>}
            </div>
          </form>
        </div>

        <aside className="booking-side" aria-label="Your booking so far"><Ticket booking={b} /></aside>
      </div>
    </div>
  );
}
