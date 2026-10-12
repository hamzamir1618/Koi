// All page copy lives in src/data. Prices, dishes and details are placeholders until the kitchen confirms them.

export const ADDRESS = '44 Silk Lane, London';
export const HOURS = 'Thu – Sun · 18:00 – 23:00';

export const SECTIONS = [
  { id: 'hero', rail: '一', name: 'Hero' },
  { id: 'tide', rail: '二', name: 'Tide' },
  { id: 'upstream', rail: '三', name: 'Story' },
  { id: 'gate', rail: '四', name: 'Dragon Gate' },
  { id: 'menu', rail: '五', name: 'Menu' },
  { id: 'evening', rail: '六', name: 'Evening' },
  { id: 'reserve', rail: '七', name: 'Reserve' },
] as const;

export const HERO = {
  eyebrow: 'Shanghai fire · London table · Est. 2025',
  tagline: 'Eight hundred years of ceremony, plated in one room on Silk Lane.',
  vertical: ['锦', '鲤', '·', '跃', '龙', '门'],
};

export const TIDE = {
  line: 'The tide does not ask permission.',
  noteLabel: '鲤鱼 · The koi',
  note: 'Every koi is born in moving water. The good ones learn to swim against it.',
};

export const GATE = {
  zh: ['鲤', '鱼', '跃', '龙', '门'],
  title: 'The koi that leaps the gate becomes the dragon.',
  sub: 'Six courses, one ascent. This is the menu.',
};

export const TAPE = ['锦鲤', 'KOI', '龍門', 'Dim sum at dusk', '火', 'Silk Lane', '茶', 'Thu – Sun', '福', 'Hand-pulled', '鱼', 'London'];

export const RESERVE = {
  title: ['Secure', 'your table.'],
  sub: "Dinner service Thursday to Sunday. Tasting menus for four or more, with a day's notice.",
  groups: 'Groups of 8+ by phone',
  stamps: ['订', '福', '来', '鲤'],
};
