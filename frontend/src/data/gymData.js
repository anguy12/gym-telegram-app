// src/data/gymData.js

// --- 1. ДАНІ ПРО ТРЕНУВАННЯ ---
export const upcomingWorkouts = [
  { id: 1, title: 'Функціональний тренінг', time: 'Сьогодні, 18:00', trainer: 'Іван П.', type: 'strength' },
  { id: 2, title: 'Йога (Розтяжка)', time: 'Завтра, 09:30', trainer: 'Олена М.', type: 'yoga' },
];

// --- 2. ДАНІ ПРО ЗАЛИ ТА ЦІНИ ---
export const GYM_DATA = {
  polubotka: {
    id: 'polubotka',
    name: 'KOLIZEY I',
    address: 'вул. П.Полуботка, 31',
    phone: '097 131 00 39',
    prices: [
      { title: 'Ранковий', desc: '12 тренувань/міс, вхід до 13:00', local: 950, network: 1300 },
      { title: '12 Тренувань', desc: 'Без обмежень в часі дня', local: 1150, network: 1650 },
      { title: 'Безлім', desc: 'Місячний абонемент', local: 1300, network: 1800 },
      { title: 'Вихідний', desc: 'Абонемент вихідного дня', local: 800, network: 1150 },
      { title: '3 Місяці', desc: 'Квартальний безліміт', local: 3450, network: 4850 },
      { title: 'Піврічний', desc: 'Безліміт на 6 місяців', local: 6250, network: 8550 },
      { title: 'Річний', desc: 'Безліміт на 12 місяців', local: 9500, network: 13400 },
      { title: 'Разове', desc: 'Одне тренування', local: 300, network: null },
      { title: 'Тренерський', desc: 'Для співпраці з тренерами', local: 3500, network: 9000 },
    ]
  },
  myrnoho: {
    id: 'myrnoho',
    name: 'KOLIZEY II',
    address: 'вул. П.Мирного, 24Г',
    phone: '098 661 77 15',
    prices: [
      { title: 'Ранковий', desc: '12 тренувань/міс, вхід до 13:00', local: 1150, network: 1300 },
      { title: '12 Тренувань', desc: 'Без обмежень в часі дня', local: 1450, network: 1650 },
      { title: 'Безлім', desc: 'Місячний абонемент', local: 1600, network: 1800 },
      { title: 'Вихідний', desc: 'Абонемент вихідного дня', local: 1000, network: 1150 },
      { title: '3 Місяці', desc: 'Квартальний безліміт', local: 4300, network: 4850 },
      { title: 'Піврічний', desc: 'Безліміт на 6 місяців', local: 7800, network: 8550 },
      { title: 'Річний', desc: 'Безліміт на 12 місяців', local: 11800, network: 13400 },
      { title: 'Разове', desc: 'Одне тренування', local: 300, network: null },
      { title: 'Тренерський', desc: 'Для співпраці з тренерами', local: 6000, network: 9000 },
    ]
  }
};

// --- 3. ДАНІ ПРО ТРЕНЕРІВ (РЕАЛЬНІ ДАНІ) ---
export const TRAINERS_DATA = [
  // --- TEAM ПОЛУБОТКА ---
  {
    id: 1,
    name: 'Роман',
    role: 'Bodybuilding',
    gym: 'polubotka',
    // Шлях починається з / бо фото лежать у папці public
    img: '/trainers/roman.jpg', 
    instagram: 'roman_kishchukk',
    phone: null // Телефону не було на фото, тому null
  },
  {
    id: 2,
    name: 'Даша',
    role: 'Fitness / Stretching',
    gym: 'polubotka',
    img: '/trainers/dasha.jpg', 
    instagram: 'shabanitsa.fit',
    phone: null
  },
  {
    id: 3,
    name: 'Назар',
    role: 'Powerlifting / Bodybuilding',
    gym: 'polubotka',
    img: '/trainers/nazar.jpg',
    instagram: 'nazarich.',
    phone: null
  },
  {
    id: 4,
    name: 'Христина',
    role: 'Fitness / Rehabilitation',
    gym: 'polubotka',
    img: '/trainers/khrystyna.jpg',
    instagram: 'kristinkakachmar',
    phone: null
  },
  {
    id: 5,
    name: 'Стас',
    role: 'Senior Coach',
    gym: 'polubotka',
    img: '/trainers/stas.jpg',
    instagram: 's.korchynskyi',
    phone: null
  },
  
  // --- TEAM МИРНОГО (Заглушки) ---
  {
    id: 101,
    name: 'Тренер Мирного 1',
    role: 'Gym Instructor',
    gym: 'myrnoho',
    img: 'https://i.pravatar.cc/300?img=12', // Тимчасове фото з інтернету
    instagram: 'kolizey.lviv',
    phone: '098 000 00 00'
  },
  {
    id: 102,
    name: 'Тренер Мирного 2',
    role: 'Crossfit',
    gym: 'myrnoho',
    img: 'https://i.pravatar.cc/300?img=33',
    instagram: 'kolizey.lviv',
    phone: '098 000 00 00'
  },
];