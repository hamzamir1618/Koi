// The four panels of the horizontal "upstream" journey. Colours are token names from tokens.css.

export type Panel = {
  num: string; label: string; title: string; body: string; glyph: string;
  bg: string; fg: string; ac: string; disc: string;
};

export const PANELS: Panel[] = [
  {
    num: '一', label: '01 — Downstream', glyph: '逆',
    title: 'Every koi is born downstream.',
    body: 'KOI began in a Shanghai alley kitchen: one wok, one stool, and a grandmother who measured nothing and missed nothing. We still cook to her tolerances.',
    bg: 'jade', fg: 'paper', ac: 'gold', disc: 'jade-d',
  },
  {
    num: '二', label: '02 — Against the current', glyph: '力',
    title: 'The current is convenience. We swim the other way.',
    body: 'Stocks simmered for nineteen hours. Noodles pulled to order. Nothing arrives in a bag that we could make by hand.',
    bg: 'gold', fg: 'ink', ac: 'red', disc: 'paper',
  },
  {
    num: '三', label: '03 — Patience', glyph: '忍',
    title: 'Seventy-two hours for a short rib. Eight seconds in the wok.',
    body: 'Some dishes are about time, others about timing. The kitchen is built for both, and it has no wall, so you can watch.',
    bg: 'peony', fg: 'ink', ac: 'paper', disc: 'red',
  },
  {
    num: '四', label: '04 — The falls', glyph: '门',
    title: 'At the top of the falls stands the Dragon Gate.',
    body: 'The legend says a koi that leaps it becomes a dragon. Dinner here is our attempt at the jump.',
    bg: 'navy', fg: 'paper', ac: 'gold', disc: 'cobalt',
  },
];
