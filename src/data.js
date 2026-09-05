export const GAMES = [
  { id: "ml", name: "Mobile Legends", icon: "⚔️" },
  { id: "ff", name: "Free Fire", icon: "🔥" },
  { id: "pubg", name: "PUBG Mobile", icon: "🎯" },
  { id: "valo", name: "Valorant", icon: "🎮" },
  { id: "genshin", name: "Genshin Impact", icon: "✨" },
  { id: "codm", name: "Call of Duty Mobile", icon: "🪖" },
  { id: "hok", name: "Honor of Kings", icon: "👑" },
  { id: "aov", name: "Arena of Valor", icon: "🏹" },
];

export const NOMINALS = {
  ml: [
    { label: "34 Diamond", price: 9000 },
    { label: "86 Diamond", price: 22000 },
    { label: "172 Diamond", price: 43000 },
    { label: "257 Diamond", price: 64000 },
    { label: "343 Diamond", price: 85000 },
    { label: "514 Diamond", price: 127000 },
    { label: "706 Diamond", price: 172000 },
    { label: "1412 Diamond", price: 339000 },
  ],

  ff: [
    { label: "5 Diamond", price: 1000 },
    { label: "12 Diamond", price: 2000 },
    { label: "70 Diamond", price: 11000 },
    { label: "140 Diamond", price: 21000 },
    { label: "355 Diamond", price: 52000 },
    { label: "720 Diamond", price: 102000 },
    { label: "1450 Diamond", price: 199000 },
  ],

  pubg: [
    { label: "60 UC", price: 15000 },
    { label: "325 UC", price: 75000 },
    { label: "660 UC", price: 149000 },
    { label: "1800 UC", price: 379000 },
    { label: "3850 UC", price: 749000 },
  ],

  valo: [
    { label: "125 Points", price: 18000 },
    { label: "420 Points", price: 55000 },
    { label: "700 Points", price: 89000 },
    { label: "1750 Points", price: 215000 },
  ],

  genshin: [
    { label: "60 Genesis Crystal", price: 16000 },
    { label: "300 Genesis Crystal", price: 76000 },
    { label: "980 Genesis Crystal", price: 239000 },
    { label: "1980 Genesis Crystal", price: 469000 },
  ],

  codm: [
    { label: "80 CP", price: 15000 },
    { label: "400 CP", price: 73000 },
    { label: "800 CP", price: 143000 },
    { label: "2000 CP", price: 349000 },
  ],

  hok: [
    { label: "50 Token", price: 12000 },
    { label: "250 Token", price: 55000 },
    { label: "500 Token", price: 105000 },
  ],

  aov: [
    { label: "50 Voucher", price: 11000 },
    { label: "150 Voucher", price: 32000 },
    { label: "300 Voucher", price: 62000 },
  ],
};

export const JOKI_GAMES = [
  {
    id: "ml",
    name: "Mobile Legends",
    ranks: [
      "Warrior",
      "Elite",
      "Master",
      "Grandmaster",
      "Epic",
      "Legend",
      "Mythic",
      "Mythical Honor",
      "Mythical Glory",
    ],
  },

  {
    id: "ff",
    name: "Free Fire",
    ranks: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Heroic",
      "Elite Heroic",
      "Master",
      "Grandmaster",
    ],
  },

  {
    id: "pubg",
    name: "PUBG Mobile",
    ranks: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Crown",
      "Ace",
      "Ace Master",
      "Ace Dominator",
    ],
  },

  {
    id: "valo",
    name: "Valorant",
    ranks: [
      "Iron",
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Ascendant",
      "Immortal",
      "Radiant",
    ],
  },

  {
    id: "genshin",
    name: "Genshin Impact",
    ranks: [
      "AR 1-10",
      "AR 11-20",
      "AR 21-30",
      "AR 31-40",
      "AR 41-50",
      "AR 51-55",
      "AR 56-60",
    ],
  },

  {
    id: "codm",
    name: "Call of Duty Mobile",
    ranks: [
      "Rookie",
      "Veteran",
      "Elite",
      "Pro",
      "Master",
      "Grandmaster",
      "Legendary",
    ],
  },

  {
    id: "hok",
    name: "Honor of Kings",
    ranks: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Master",
      "Grandmaster",
      "King",
    ],
  },

  {
    id: "aov",
    name: "Arena of Valor",
    ranks: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Veteran",
      "Master",
      "Conqueror",
    ],
  },
];

export const JOKI_PRICE_PER_TIER = {
  ml: 10000,
  ff: 10000,
  pubg: 12000,
  valo: 15000,
  genshin: 10000,
  codm: 10000,
  hok: 10000,
  aov: 10000,
};

export const AKUN_LIST = [
  {
    id: 1,
    game: "Mobile Legends",
    rank: "Mythic 3",
    level: 62,
    price: 349000,
    note: "40+ skin, 12 hero epic.",
  },
  {
    id: 2,
    game: "Free Fire",
    rank: "Heroic",
    level: 71,
    price: 299000,
    note: "Bundle langka, 8 karakter max level.",
  },
  {
    id: 3,
    game: "Mobile Legends",
    rank: "Legend",
    level: 44,
    price: 189000,
    note: "Cocok pemula, semua hero terbuka.",
  },
  {
    id: 4,
    game: "PUBG Mobile",
    rank: "Ace",
    level: 55,
    price: 459000,
    note: "Outfit season 1, RP tier 90+.",
  },
  {
    id: 5,
    game: "PUBG Mobile",
    rank: "Crown",
    level: 38,
    price: 259000,
    note: "Cocok naik rank cepat, skin senjata lengkap.",
  },
  {
    id: 6,
    game: "Free Fire",
    rank: "Grandmaster",
    level: 65,
    price: 379000,
    note: "Bundle eksklusif, karakter max evolusi.",
  },
  {
    id: 7,
    game: "Mobile Legends",
    rank: "Epic",
    level: 35,
    price: 149000,
    note: "Winrate tinggi, akun jarang dipakai.",
  },
  {
    id: 8,
    game: "Free Fire",
    rank: "Platinum",
    level: 40,
    price: 179000,
    note: "Skin gun langka, elite pass lengkap.",
  },
  {
    id: 9,
    game: "Valorant",
    rank: "Immortal 1",
    level: 140,
    price: 899000,
    note: "15 skin senjata premium, semua agent terbuka.",
  },
  {
    id: 10,
    game: "Valorant",
    rank: "Diamond 2",
    level: 78,
    price: 449000,
    note: "Battle pass lengkap, skin Vandal langka.",
  },
  {
    id: 11,
    game: "Genshin Impact",
    rank: "AR 58",
    level: 58,
    price: 649000,
    note: "5 karakter 5★ + weapon signature.",
  },
  {
    id: 12,
    game: "Genshin Impact",
    rank: "AR 45",
    level: 45,
    price: 349000,
    note: "3 karakter 5★, cocok lanjut progress.",
  },
  {
    id: 13,
    game: "Call of Duty Mobile",
    rank: "Legendary",
    level: 90,
    price: 399000,
    note: "Skin senjata mistic lengkap.",
  },
  {
    id: 14,
    game: "Honor of Kings",
    rank: "King",
    level: 60,
    price: 379000,
    note: "Hero pool lengkap, skin epic banyak.",
  },
  {
    id: 15,
    game: "Arena of Valor",
    rank: "Legend",
    level: 55,
    price: 229000,
    note: "Skin langka, hero pool lengkap.",
  },
];

export const formatRp = (n) =>
  "Rp " + Number(n || 0).toLocaleString("id-ID");