import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, rand, ScrollTrigger, slam } from '../lib/motion';
import { ADDRESS, HOURS, RESERVE } from '../data/copy';
import { useBooking } from '../lib/booking';
import { useRouter } from '../lib/router';
import { Seal } from '../components/Seal';

type Stamp = { id: number; ch: string; x: number; y: number; rot: number };

/** A hanging scroll unrolls as you arrive; submitting presses a seal onto it. No booking backend yet. */
export function Reserve() {
  const root = useRef<HTMLElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [guests, setGuests] = useState('2');
  const { update } = useBooking();
  const { go } = useRouter();

  useGSAP(() => {
    gsap.timeline({ scrollTrigger: { trigger: '.scroll-wrap', start: 'top 78%', end: 'top 0%', scrub: 0.6, invalidateOnRefresh: true } })
      .fromTo(paper.current, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
      .fromTo('.rod.mv', { y: 0 }, { y: () => paper.current!.offsetHeight, ease: 'none' }, 0);
    gsap.set('.rsv-seal', { autoAlpha: 0 });
    ScrollTrigger.create({ trigger: paper.current, start: 'top 30%', once: true, onEnter: () => slam(root.current!.querySelector('.rsv-seal'), { rot: -30, to: -6 }) });
  }, { scope: root });

  // press the newest stamp; the earlier ones stay as faded impressions
  useEffect(() => {
    const last = stamps[stamps.length - 1];
    if (!last) return;
    slam(root.current!.querySelector('.stamp-zone .stamp:last-child'), { from: 4, rot: last.rot * 3, to: last.rot, shake: paper.current });
  }, [stamps]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const who = name.trim();
    if (!who) { setMsg('Add a name first, so the stamp knows whose table it is.'); return; }
    const k = paper.current!.getBoundingClientRect(), b = button.current!.getBoundingClientRect();
    setStamps(s => [...s, {
      id: s.length, ch: RESERVE.stamps[s.length % RESERVE.stamps.length],
      x: b.left - k.left + b.width / 2 + rand(-40, 40), y: b.top - k.top - 90 + rand(-20, 20), rot: rand(-12, 12),
    }]);
    const n = Math.min(12, Math.max(1, parseInt(guests, 10) || 2));
    update({ name: who, guests: n });
    setMsg(`Stamped for ${who}. Now pick a night.`);
    // let the seal land before the page changes
    const at = b;
    setTimeout(() => go('reserve', { clientX: at.left + at.width / 2, clientY: at.top + at.height / 2 }), 900);
  };

  return (
    <section id="reserve" ref={root}>
      <div className="scroll-wrap">
        <div className="rod top" aria-hidden="true" />
        <div className="paper" ref={paper}>
          <img className="paper-koi" src="/img/koi-red.webp" alt="" />
          <div className="rsv-grid">
            <Seal className="rsv-seal">来</Seal>
            <div><h2>{RESERVE.title[0]}<br /><em>{RESERVE.title[1]}</em></h2><p className="rsv-sub">{RESERVE.sub}</p></div>
          </div>
          <form className="rsv" noValidate onSubmit={submit}>
            <div className="fld"><label htmlFor="rName">Name</label><input id="rName" autoComplete="name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="fld"><label htmlFor="rGuests">Guests</label><input id="rGuests" inputMode="numeric" placeholder="2" value={guests} onChange={e => setGuests(e.target.value.replace(/\D/g, '').slice(0, 2))} /></div>
            <button ref={button} className="btn mag" type="submit"><span className="zh" aria-hidden="true">订</span>Find a table</button>
          </form>
          <p className="rsv-msg" role="status" aria-live="polite">{msg}</p>
          <div className="rsv-foot"><span>{HOURS}</span><span>{ADDRESS}</span><span>{RESERVE.groups}</span></div>
          <div className="stamp-zone" aria-hidden="true">
            {stamps.map((s, i) => (
              <Seal key={s.id} className={`stamp${i < stamps.length - 1 ? ' ghost' : ''}`} style={{ left: s.x, top: s.y }}>
                {s.ch}
              </Seal>
            ))}
          </div>
        </div>
        <div className="rod mv" aria-hidden="true" />
      </div>
    </section>
  );
}
