// The carte. Dishes, prices, ingredients and allergens are placeholders from the brand concept:
// confirm every one with the kitchen before launch (allergens especially).

export type CategoryId = 'dimsum' | 'fire' | 'water' | 'hands' | 'garden' | 'sweet';

export type Category = {
  id: CategoryId; zh: string; name: string; line: string;
  bg: string; fg: string; ac: string; disc: string;
};

export type Dish = {
  id: string; category: CategoryId; glyph: string; zh: string; name: string;
  desc: string; long: string; price: number;
  ingredients: string[]; allergens: string[]; pairing: TeaId;
  spice?: 0 | 1 | 2 | 3; plant?: boolean; signature?: boolean; note?: string;
};

export type TeaId = 'longjing' | 'puerh' | 'tieguanyin' | 'silverneedle' | 'dahongpao' | 'osmanthus';
export type Tea = { id: TeaId; zh: string; name: string; note: string; price: number };

export const CATEGORIES: Category[] = [
  { id: 'dimsum', zh: '点心', name: 'Dim sum', line: 'Folded by hand each afternoon.', bg: 'peony', fg: 'ink', ac: 'paper', disc: 'red' },
  { id: 'fire', zh: '火', name: 'From the fire', line: 'Wok, charcoal and patience.', bg: 'red', fg: 'paper', ac: 'gold', disc: 'red-d' },
  { id: 'water', zh: '水', name: 'From the water', line: 'Steamed, smoked, barely touched.', bg: 'cobalt', fg: 'paper', ac: 'peony', disc: 'navy' },
  { id: 'hands', zh: '面', name: 'From the hands', line: 'Noodles pulled the moment you order.', bg: 'jade', fg: 'paper', ac: 'gold', disc: 'jade-d' },
  { id: 'garden', zh: '园', name: 'From the garden', line: 'Plant-based, and not as an afterthought.', bg: 'paper', fg: 'ink', ac: 'jade', disc: 'gold' },
  { id: 'sweet', zh: '甜', name: 'Sweet', line: 'Small, cold, or both.', bg: 'gold', fg: 'ink', ac: 'red', disc: 'paper' },
];

export const TEAS: Tea[] = [
  { id: 'longjing', zh: '龙井', name: 'Longjing (Dragon Well)', note: 'Green, toasted chestnut, a little sweet.', price: 9 },
  { id: 'puerh', zh: '普洱', name: 'Aged Pu-erh', note: 'Dark, earthy, cuts through fat.', price: 12 },
  { id: 'tieguanyin', zh: '铁观音', name: 'Tieguanyin', note: 'Floral oolong with a long finish.', price: 10 },
  { id: 'silverneedle', zh: '银针', name: 'Jasmine Silver Needle', note: 'Pale and fragrant; made for fish.', price: 11 },
  { id: 'dahongpao', zh: '大红袍', name: 'Da Hong Pao', note: 'Roasted rock oolong, smoke and stone fruit.', price: 13 },
  { id: 'osmanthus', zh: '桂花', name: 'Osmanthus Oolong', note: 'Apricot and honey. Good with dessert.', price: 9 },
];

export const DISHES: Dish[] = [
  // 点心
  { id: 'har-gow', category: 'dimsum', glyph: '虾', zh: '虾饺', name: 'Har Gow with Yuzu', price: 14,
    desc: 'Prawn dumplings in a translucent wheat-starch skin, yuzu kosho.', long: 'Twelve pleats each, folded by two people every afternoon. The yuzu is ours, not the canon.',
    ingredients: ['Tiger prawn', 'Bamboo shoot', 'Wheat starch', 'Yuzu kosho'], allergens: ['Crustaceans', 'Gluten', 'Sesame'], pairing: 'silverneedle' },
  { id: 'xiao-long-bao', category: 'dimsum', glyph: '包', zh: '小笼包', name: 'Xiao Long Bao', price: 16,
    desc: 'Soup dumplings with pork and aged Shaoxing, black vinegar, ginger threads.', long: 'Eighteen folds, a spoonful of aspic that melts into broth. Bite the corner, drink, then eat.',
    ingredients: ['Pork shoulder', 'Pork aspic', 'Shaoxing wine', 'Black vinegar'], allergens: ['Gluten', 'Soya', 'Sulphites'], pairing: 'puerh', spice: 0 },
  { id: 'char-siu-bao', category: 'dimsum', glyph: '叉', zh: '叉烧包', name: 'Char Siu Bao', price: 12,
    desc: 'Steamed buns split open around honey-roast pork.', long: 'The dough rests overnight so the tops crack open in the steamer, the way they should.',
    ingredients: ['Pork collar', 'Honey', 'Hoisin', 'Wheat flour'], allergens: ['Gluten', 'Soya', 'Sesame'], pairing: 'tieguanyin' },
  { id: 'crystal-mushroom', category: 'dimsum', glyph: '菇', zh: '素饺', name: 'Crystal Mushroom Dumplings', price: 12, plant: true,
    desc: 'Shiitake, wood ear and water chestnut in a clear skin.', long: 'Built for crunch: water chestnut, wood ear, and shiitake braised in its own soaking liquid.',
    ingredients: ['Shiitake', 'Wood ear', 'Water chestnut', 'Chive'], allergens: ['Gluten', 'Soya'], pairing: 'longjing' },

  // 火
  { id: 'pepper-duck', category: 'fire', glyph: '鸭', zh: '椒麻鸭', name: 'Sichuan Pepper Duck', price: 42, signature: true, spice: 2, note: 'Serves two',
    desc: 'Mandarin reduction, fermented black bean, lotus root fried until it shatters.', long: 'Dry-aged for nine days, lacquered, then roasted over lychee wood. The peppercorns numb; the mandarin brings you back.',
    ingredients: ['Gressingham duck', 'Sichuan peppercorn', 'Mandarin', 'Fermented black bean', 'Lotus root'], allergens: ['Soya', 'Gluten', 'Sulphites'], pairing: 'dahongpao' },
  { id: 'short-rib', category: 'fire', glyph: '骨', zh: '五香牛肋', name: 'Five Spice Short Rib', price: 54, signature: true, note: '72 hours',
    desc: 'A seventy-two-hour braise, osmanthus glaze, compressed daikon, shiso.', long: 'Three days in master stock, glazed to order. The daikon is pressed in the stock so it tastes of the rib.',
    ingredients: ['Beef short rib', 'Five spice', 'Osmanthus', 'Daikon', 'Shiso'], allergens: ['Soya', 'Gluten', 'Celery'], pairing: 'puerh' },
  { id: 'mapo-wagyu', category: 'fire', glyph: '麻', zh: '麻婆豆腐', name: 'Mapo Tofu with Wagyu', price: 26, spice: 3,
    desc: 'Silken tofu, wagyu mince, doubanjiang, a lot of chilli oil.', long: 'Pixian bean paste fried until it goes deep red, then the tofu goes in barely set.',
    ingredients: ['Silken tofu', 'Wagyu', 'Doubanjiang', 'Chilli oil', 'Sichuan peppercorn'], allergens: ['Soya', 'Gluten'], pairing: 'puerh' },
  { id: 'charcoal-char-siu', category: 'fire', glyph: '烧', zh: '炭烧叉烧', name: 'Charcoal Char Siu', price: 32,
    desc: 'Iberico presa roasted over binchotan, maltose glaze.', long: 'Iberico presa takes the glaze better than belly; the binchotan gives it the edge.',
    ingredients: ['Iberico presa', 'Maltose', 'Red fermented tofu', 'Rose wine'], allergens: ['Soya', 'Sulphites'], pairing: 'dahongpao' },

  // 水
  { id: 'sea-bass', category: 'water', glyph: '鱼', zh: '茉莉鲈鱼', name: 'Jasmine Sea Bass', price: 48, signature: true, note: 'Whole fish',
    desc: 'Steamed whole, lotus blossom broth, chrysanthemum oil poured at the table.', long: 'Steamed eight minutes over jasmine tea. The oil is heated with chrysanthemum and poured on in front of you.',
    ingredients: ['Wild sea bass', 'Jasmine tea', 'Lotus', 'Chrysanthemum', 'Spring onion'], allergens: ['Fish', 'Soya'], pairing: 'silverneedle' },
  { id: 'dragon-well-salmon', category: 'water', glyph: '茶', zh: '龙井三文鱼', name: 'Dragon Well Salmon', price: 36, signature: true,
    desc: 'Cold-smoked over Longjing tea leaves, pickled cucumber, cold-pressed sesame.', long: 'Cured overnight, smoked cold over the same tea we pour, sliced thick.',
    ingredients: ['Scottish salmon', 'Longjing tea', 'Cucumber', 'Sesame oil'], allergens: ['Fish', 'Sesame', 'Sulphites'], pairing: 'longjing' },
  { id: 'lobster', category: 'water', glyph: '龙', zh: '姜葱龙虾', name: 'Ginger & Scallion Lobster', price: 68, note: 'Market price',
    desc: 'Native lobster wok-tossed with ginger, scallion and Shaoxing.', long: 'Cut live, flash-fried, then thrown back into the wok with a fistful of ginger. Comes with noodles for the sauce.',
    ingredients: ['Native lobster', 'Ginger', 'Scallion', 'Shaoxing wine', 'Egg noodle'], allergens: ['Crustaceans', 'Gluten', 'Eggs', 'Sulphites'], pairing: 'tieguanyin' },
  { id: 'squid', category: 'water', glyph: '鱿', zh: '椒盐鱿鱼', name: 'Salt & Pepper Squid', price: 18, spice: 1,
    desc: 'Cornish squid, five-pepper salt, fried garlic and green chilli.', long: 'Light batter, very hot oil, out in ninety seconds.',
    ingredients: ['Cornish squid', 'Potato starch', 'Garlic', 'Green chilli'], allergens: ['Molluscs'], pairing: 'longjing' },

  // 面
  { id: 'dan-dan', category: 'hands', glyph: '面', zh: '黑芝麻担担面', name: 'Black Sesame Dan Dan', price: 28, signature: true, spice: 2, note: 'Hand-pulled',
    desc: 'Slow-braised pork, Sichuan numbing oil, noodles pulled the moment you order.', long: 'Black sesame paste instead of peanut, so it is darker and deeper. Mix it all the way down.',
    ingredients: ['Wheat noodle', 'Pork', 'Black sesame', 'Sichuan peppercorn', 'Ya cai'], allergens: ['Gluten', 'Sesame', 'Soya'], pairing: 'tieguanyin' },
  { id: 'biang-biang', category: 'hands', glyph: '拉', zh: '油泼面', name: 'Hand-slapped Biang Biang', price: 24, spice: 2, plant: true,
    desc: 'Belt-wide noodles, smashed garlic, chilli flakes, sizzling oil.', long: 'Slapped against the counter until they are as wide as a belt; you will hear it from your table.',
    ingredients: ['Wheat noodle', 'Garlic', 'Chilli flakes', 'Black vinegar', 'Bok choy'], allergens: ['Gluten', 'Soya'], pairing: 'longjing' },
  { id: 'claypot-rice', category: 'hands', glyph: '饭', zh: '煲仔饭', name: 'Claypot Rice', price: 26, note: 'Twenty minutes',
    desc: 'Lap cheong, cured duck and a crust worth waiting for.', long: 'Cooked to order in the pot it arrives in. Scrape the bottom: that crust is the point.',
    ingredients: ['Jasmine rice', 'Lap cheong', 'Cured duck', 'Sweet soy'], allergens: ['Soya', 'Sulphites'], pairing: 'dahongpao' },
  { id: 'xo-rice', category: 'hands', glyph: '蛋', zh: 'XO炒饭', name: 'Egg Fried Rice with XO', price: 14,
    desc: 'Day-old rice, our own XO sauce, spring onion.', long: 'Our XO uses dried scallop and Jinhua ham, made in a batch every Monday.',
    ingredients: ['Jasmine rice', 'Egg', 'Dried scallop', 'Jinhua ham'], allergens: ['Eggs', 'Molluscs', 'Crustaceans', 'Soya'], pairing: 'tieguanyin' },

  // 园
  { id: 'osmanthus-tofu', category: 'garden', glyph: '豆', zh: '桂花豆腐', name: 'Osmanthus Tofu', price: 22, signature: true, plant: true, note: 'Made daily',
    desc: 'Silken tofu made each morning, honeyed osmanthus, winter melon consommé.', long: 'Soy milk pressed at seven, set by eleven. The consommé is clarified winter melon and kombu.',
    ingredients: ['Soy milk', 'Osmanthus', 'Winter melon', 'Kombu'], allergens: ['Soya'], pairing: 'osmanthus' },
  { id: 'green-beans', category: 'garden', glyph: '菜', zh: '干煸四季豆', name: 'Dry-fried Green Beans', price: 12, plant: true, spice: 1,
    desc: 'Blistered beans, preserved mustard greens, chilli.', long: 'Fried until the skins wrinkle, then tossed with ya cai and dried chilli.',
    ingredients: ['Green beans', 'Ya cai', 'Dried chilli', 'Garlic'], allergens: ['Soya', 'Mustard'], pairing: 'longjing' },
  { id: 'cucumber', category: 'garden', glyph: '瓜', zh: '拍黄瓜', name: 'Smacked Cucumber', price: 9, plant: true,
    desc: 'Cracked cucumber, black vinegar, garlic, chilli oil.', long: 'Smacked so the dressing gets in. Cold, sharp, gone in a minute.',
    ingredients: ['Cucumber', 'Black vinegar', 'Garlic', 'Chilli oil'], allergens: ['Gluten', 'Sesame'], pairing: 'longjing' },

  // 甜
  { id: 'tangyuan', category: 'sweet', glyph: '圆', zh: '黑芝麻汤圆', name: 'Black Sesame Tangyuan', price: 11, plant: true,
    desc: 'Glutinous rice balls, molten sesame, ginger syrup.', long: 'Served in warm ginger syrup; the centres run when you bite.',
    ingredients: ['Glutinous rice', 'Black sesame', 'Ginger', 'Rock sugar'], allergens: ['Sesame'], pairing: 'osmanthus' },
  { id: 'mango-sago', category: 'sweet', glyph: '芒', zh: '杨枝甘露', name: 'Mango Pomelo Sago', price: 10,
    desc: 'Chilled mango cream, pomelo, sago pearls.', long: 'A Hong Kong classic, made sharper with more pomelo than usual.',
    ingredients: ['Alphonso mango', 'Pomelo', 'Sago', 'Coconut milk', 'Milk'], allergens: ['Milk'], pairing: 'silverneedle' },
  { id: 'egg-tart', category: 'sweet', glyph: '挞', zh: '蛋挞', name: 'Egg Tart', price: 8,
    desc: 'Flaky lard pastry, barely-set custard, served warm.', long: 'Pastry laminated with lard, custard pulled from the oven while it still wobbles.',
    ingredients: ['Egg', 'Milk', 'Lard pastry', 'Sugar'], allergens: ['Eggs', 'Milk', 'Gluten'], pairing: 'tieguanyin' },
];

export const TASTING = {
  zh: '龍門', name: 'The Dragon Gate', price: 95, pairing: 35,
  line: 'Six courses, one ascent. For the whole table, served Thursday to Sunday.',
  courses: ['har-gow', 'dragon-well-salmon', 'sea-bass', 'pepper-duck', 'short-rib', 'tangyuan'],
};

export const dishById = (id?: string) => DISHES.find(d => d.id === id);
export const categoryOf = (d: Dish) => CATEGORIES.find(c => c.id === d.category)!;
export const teaById = (id: TeaId) => TEAS.find(t => t.id === id)!;
export const money = (n: number) => `£${n}`;

/** The six signature dishes shown as stacking cards on the landing page, in course order. */
export const SIGNATURES = ['pepper-duck', 'dragon-well-salmon', 'sea-bass', 'dan-dan', 'short-rib', 'osmanthus-tofu']
  .map(id => dishById(id)!);
