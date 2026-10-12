import { useEffect, useRef } from 'react';
import { gsap, RM, token } from '../lib/motion';
import { prettyDate, type Booking } from '../lib/booking';
import { Seal } from './Seal';

/** A paper table chit that fills in as the booking is made. Each new value is pressed in. */
export function Ticket({ booking: b, stamped = false }: { booking: Booking; stamped?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const seen = useRef<Record<string, string>>({});

  const rows: [string, string, string][] = [
    ['guests', 'Party', `${b.guests} ${b.guests === 1 ? 'guest' : 'guests'}`],
    ['date', 'Night', b.date ? prettyDate(b.date) : '—'],
    ['time', 'Time', b.time ?? '—'],
    ['menu', 'Menu', b.tasting ? 'The Dragon Gate' : 'À la carte'],
    ['name', 'Name', b.name.trim() || '—'],
    ['occ', 'Occasion', b.occasion ?? '—'],
  ];

  useEffect(() => {
    if (RM || !root.current) return;
    rows.forEach(([k, , v]) => {
      if (k !== 'name' && seen.current[k] !== undefined && seen.current[k] !== v && v !== '—') {
        gsap.fromTo(root.current!.querySelector(`[data-k="${k}"]`), { scale: 1.5, color: token('--red') }, { scale: 1, color: token('--ink'), duration: 0.45, ease: 'power4.in', clearProps: 'color' });
      }
      seen.current[k] = v;
    });
  });

  return (
    <div className={`ticket${stamped ? ' stamped' : ''}`} ref={root}>
      <div className="ticket-head"><b>KOI</b><span className="zh">锦鲤</span><span className="label">{b.ref ?? 'Table chit'}</span></div>
      <dl>
        {rows.map(([k, label, v]) => (
          <div key={k} className="ticket-row"><dt>{label}</dt><dd><span data-k={k}>{v}</span></dd></div>
        ))}
      </dl>
      <div className="ticket-foot">
        <span className="label">44 Silk Lane · London</span>
        <Seal className={`ticket-seal${stamped ? '' : ' pending'}`}>{stamped ? '成' : '订'}</Seal>
      </div>
    </div>
  );
}
