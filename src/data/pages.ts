// Copy for the Story and Visit pages. Years, names, transport and contact details are placeholders.

export const STORY = {
  intro: 'A koi is not born a dragon. It swims against the current for years, and only some of them make the jump. This is how our kitchen got here.',
  chapters: [
    { num: '一', year: '1986', glyph: '巷', title: 'An alley in Jing\'an', colour: 'red',
      body: 'Our founder\'s grandmother sold wontons from a hatch in a Shanghai alley. One wok, one stool, no menu. You ate what she had made that morning, and you came back the next day.' },
    { num: '二', year: '2009', glyph: '火', title: 'The fire moves west', colour: 'gold',
      body: 'Her grandson cooked in Chengdu, Hong Kong and London kitchens for fifteen years, learning the rules properly before deciding which ones to break.' },
    { num: '三', year: '2023', glyph: '刀', title: 'A kitchen with no wall', colour: 'jade',
      body: 'We found a former print works on Silk Lane and took the wall out. The kitchen is in the room with you: you can see the wok smoke and the knife go still.' },
    { num: '四', year: '2025', glyph: '门', title: 'The Dragon Gate', colour: 'cobalt',
      body: 'KOI opened with six dishes and a tasting menu named after the legend. The idea has not changed: cook slowly where it matters, quickly where it counts.' },
  ],
  principles: [
    { zh: '慢', name: 'Slow where it matters', body: 'Stocks for nineteen hours, short rib for seventy-two, tofu pressed every morning.' },
    { zh: '快', name: 'Fast where it counts', body: 'Eight seconds in the wok. Noodles pulled to order. Nothing waits under a lamp.' },
    { zh: '真', name: 'Nothing from a bag', body: 'If it can be made by hand in our kitchen, it is: sauces, dumpling skins, XO, chilli oil.' },
  ],
  producers: [
    { zh: '鸭', name: 'Gressingham, Suffolk', what: 'Duck, dry-aged nine days in-house' },
    { zh: '鱼', name: 'Day boats, Cornwall', what: 'Sea bass and squid, landed that morning' },
    { zh: '茶', name: 'A family estate, Hangzhou', what: 'Longjing, bought direct each spring' },
    { zh: '豆', name: 'Organic soy, Somerset', what: 'Pressed into tofu by us at 7am' },
  ],
};

export const VISIT = {
  address: ['KOI', '44 Silk Lane', 'London EC2A 4XX'],
  phone: '020 7946 0958',
  email: 'tables@koi.example',
  hours: [
    { day: 'Monday', time: 'Closed' },
    { day: 'Tuesday', time: 'Closed' },
    { day: 'Wednesday', time: 'Closed' },
    { day: 'Thursday', time: '18:00 – 23:00' },
    { day: 'Friday', time: '18:00 – 23:30' },
    { day: 'Saturday', time: '17:30 – 23:30' },
    { day: 'Sunday', time: '17:30 – 22:00' },
  ],
  getting: [
    { zh: '铁', how: 'Underground', detail: 'Old Street (Northern line), 6 minutes on foot. Liverpool Street, 12 minutes.' },
    { zh: '车', how: 'Bus', detail: 'Routes 55, 243 and 205 stop on Great Eastern Street.' },
    { zh: '轮', how: 'Bicycle', detail: 'Stands outside on Silk Lane; Santander docks on Rivington Street.' },
  ],
  access: 'Step-free entrance and an accessible toilet on the ground floor. Tell us about any needs when you book and we will set the table accordingly.',
  private: 'The Print Room seats up to 18 for the tasting menu, Thursday to Sunday. Write to us for dates.',
};
