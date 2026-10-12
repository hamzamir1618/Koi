import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// The table being booked. There is no reservation backend yet: this lives in memory only.

export type Booking = {
  guests: number;
  date: string | null;   // ISO yyyy-mm-dd
  time: string | null;   // HH:MM
  name: string; email: string; phone: string; notes: string;
  occasion: string | null;
  tasting: boolean;
  ref: string | null;    // set when "stamped"
};

export const EMPTY: Booking = { guests: 2, date: null, time: null, name: '', email: '', phone: '', notes: '', occasion: null, tasting: false, ref: null };

type Ctx = { booking: Booking; update: (p: Partial<Booking>) => void; reset: () => void };
const BookingContext = createContext<Ctx>({ booking: EMPTY, update: () => {}, reset: () => {} });
export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(EMPTY);
  const value = useMemo<Ctx>(() => ({
    booking,
    update: p => setBooking(b => ({ ...b, ...p })),
    reset: () => setBooking(EMPTY),
  }), [booking]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

/** Service runs Thursday to Sunday. */
export const OPEN_DAYS = [4, 5, 6, 0];
export const SLOTS = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const toISO = iso;
export const fromISO = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

export function slotOpen(date: string, time: string) {
  const d = fromISO(date).getDay();
  if (time === '17:30' && (d === 4 || d === 5)) return false; // Thu/Fri open at 18:00
  if (time === '21:30' && d === 0) return false;                // Sunday closes earlier
  return true;
}

/** Deterministic pretend availability so the same slot always looks the same. Replace with the real system. */
export function slotFull(date: string, time: string) {
  let h = 0;
  for (const c of date + time) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 5 === 0;
}

export const prettyDate = (s: string) => fromISO(s).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export function makeRef() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'KOI-' + Array.from({ length: 5 }, () => a[(Math.random() * a.length) | 0]).join('');
}

/** A calendar file for the booking: a plain text download, built in the browser. */
export function icsFor(b: Booking) {
  if (!b.date || !b.time) return '';
  const [h, m] = b.time.split(':').map(Number);
  const start = fromISO(b.date); start.setHours(h, m);
  const end = new Date(start.getTime() + 2.5 * 3600 * 1000);
  const f = (d: Date) => `${iso(d).replace(/-/g, '')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KOI//Reservation//EN', 'BEGIN:VEVENT',
    `UID:${b.ref}@koi`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
    `SUMMARY:Dinner at KOI (${b.guests} ${b.guests === 1 ? 'guest' : 'guests'})`,
    'LOCATION:44 Silk Lane\\, London', 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
