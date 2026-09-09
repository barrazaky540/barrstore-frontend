// ============================================================
// DATA GAME
// ============================================================

export const GAMES = [
  {
    id: "ml",
    name: "Mobile Legends",
    shortName: "MLBB",
    icon: "⚔️",
    image: "/images/games/ml.jpeg",
    fields: [
      {
        key: "userId",
        label: "User ID",
        type: "text",
        placeholder: "Contoh: 123456789"
      },
      {
        key: "serverId",
        label: "Zone ID",
        type: "text",
        placeholder: "Contoh: 1234"
      }
    ]
  },

  {
    id: "ff",
    name: "Free Fire",
    shortName: "FF",
    icon: "🔥",
    image: "/images/games/ff.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      }
    ]
  },

  {
    id: "pubg",
    name: "PUBG Mobile",
    shortName: "PUBGM",
    icon: "🔫",
    image: "/images/games/pubg.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      }
    ]
  },

  {
    id: "valo",
    name: "Valorant",
    shortName: "VALO",
    icon: "🎯",
    image: "/images/games/valo.jpeg",
    fields: [
      {
        key: "userId",
        label: "Riot ID",
        type: "text",
        placeholder: "Contoh: BarraZaky#1234"
      }
    ]
  },

  {
    id: "genshin",
    name: "Genshin Impact",
    shortName: "GI",
    icon: "🌌",
    image: "/images/games/genshin.jpeg",
    fields: [
      {
        key: "userId",
        label: "UID",
        type: "text",
        placeholder: "Masukkan UID Genshin"
      },
      {
        key: "serverId",
        label: "Server",
        type: "select",
        options: [
          { value: "asia", label: "Asia" },
          { value: "america", label: "America" },
          { value: "europe", label: "Europe" },
          { value: "tw_hk_mo", label: "TW, HK, MO" }
        ]
      }
    ]
  },

  {
    id: "codm",
    name: "Call of Duty Mobile",
    shortName: "CODM",
    icon: "💥",
    image: "/images/games/codm.jpeg",
    fields: [
      {
        key: "userId",
        label: "UID",
        type: "text",
        placeholder: "Masukkan UID CODM"
      }
    ]
  },

  {
    id: "hok",
    name: "Honor of Kings",
    shortName: "HOK",
    icon: "👑",
    image: "/images/games/hok.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      }
    ]
  },

  {
    id: "aov",
    name: "Arena of Valor",
    shortName: "AOV",
    icon: "🏹",
    image: "/images/games/aov.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      }
    ]
  },

  {
    id: "roblox",
    name: "Roblox",
    shortName: "ROBLOX",
    icon: "🧱",
    image: "/images/games/roblox.jpeg",
    fields: [
      {
        key: "userId",
        label: "Username Roblox",
        type: "text",
        placeholder: "Masukkan username Roblox"
      }
    ]
  },

  {
    id: "fcmobile",
    name: "FC Mobile",
    shortName: "FCM",
    icon: "⚽",
    image: "/images/games/fcmobile.jpeg",
    fields: [
      {
        key: "userId",
        label: "UID",
        type: "text",
        placeholder: "Masukkan UID FC Mobile"
      }
    ]
  },

  {
    id: "efootball",
    name: "eFootball",
    shortName: "EFOOTBALL",
    icon: "⚽",
    image: "/images/games/efootball.jpeg",
    fields: [
      {
        key: "userId",
        label: "User ID",
        type: "text",
        placeholder: "Masukkan User ID eFootball"
      }
    ]
  },

  {
    id: "dragonraja",
    name: "Dragon Raja",
    shortName: "DR",
    icon: "🐉",
    image: "/images/games/dragonraja.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      },
      {
        key: "serverId",
        label: "Server ID",
        type: "text",
        placeholder: "Masukkan Server ID"
      }
    ]
  },

  {
    id: "magicchess",
    name: "Magic Chess: Go Go",
    shortName: "MCGG",
    icon: "♟️",
    image: "/images/games/magicchess.jpeg",
    fields: [
      {
        key: "userId",
        label: "User ID",
        type: "text",
        placeholder: "Masukkan User ID"
      },
      {
        key: "serverId",
        label: "Zone ID",
        type: "text",
        placeholder: "Masukkan Zone ID"
      }
    ]
  },

  {
    id: "wildrift",
    name: "League of Legends: Wild Rift",
    shortName: "WILD RIFT",
    icon: "⚔️",
    image: "/images/games/wildrift.jpeg",
    fields: [
      {
        key: "userId",
        label: "Riot ID",
        type: "text",
        placeholder: "Contoh: BarraZaky#1234"
      }
    ]
  },

  {
    id: "8ballpool",
    name: "8 Ball Pool",
    shortName: "8 BALL",
    icon: "🎱",
    image: "/images/games/8ballpool.jpeg",
    fields: [
      {
        key: "userId",
        label: "Unique ID",
        type: "text",
        placeholder: "Masukkan Unique ID"
      }
    ]
  },

  {
    id: "asphalt9",
    name: "Asphalt 9",
    shortName: "ASPHALT",
    icon: "🏎️",
    image: "/images/games/asphalt9.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      }
    ]
  },

  {
    id: "coc",
    name: "Clash of Clans",
    shortName: "COC",
    icon: "🛡️",
    image: "/images/games/coc.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player Tag",
        type: "text",
        placeholder: "Contoh: #ABC123XYZ"
      }
    ]
  },

  {
    id: "clashroyale",
    name: "Clash Royale",
    shortName: "CR",
    icon: "👑",
    image: "/images/games/clashroyale.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player Tag",
        type: "text",
        placeholder: "Contoh: #ABC123XYZ"
      }
    ]
  },

  {
    id: "pubgnewstate",
    name: "PUBG New State",
    shortName: "NEW STATE",
    icon: "🎖️",
    image: "/images/games/pubgnewstate.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      }
    ]
  },

  {
    id: "undawn",
    name: "Undawn",
    shortName: "UNDAWN",
    icon: "🧟",
    image: "/images/games/undawn.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      },
      {
        key: "serverId",
        label: "Server",
        type: "text",
        placeholder: "Masukkan Server"
      }
    ]
  },

  {
    id: "sausageman",
    name: "Sausage Man",
    shortName: "SAUSAGE",
    icon: "🌭",
    image: "/images/games/sausageman.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      }
    ]
  },

  {
    id: "bloodstrike",
    name: "Blood Strike",
    shortName: "BLOOD STRIKE",
    icon: "🔴",
    image: "/images/games/bloodstrike.jpeg",
    fields: [
      {
        key: "userId",
        label: "Player ID",
        type: "text",
        placeholder: "Masukkan Player ID"
      }
    ]
  },

  {
    id: "pointblank",
    name: "Point Blank",
    shortName: "PB",
    icon: "🔫",
    image: "/images/games/pointblank.jpeg",
    fields: [
      {
        key: "userId",
        label: "Game ID",
        type: "text",
        placeholder: "Masukkan Game ID"
      }
    ]
  }
];

// ============================================================
// NOMINAL TOP UP
// ============================================================

export const NOMINALS = {
  ml: [
    { id: "ml-5", label: "5 Diamonds", amount: 5, price: 1000 },
    { id: "ml-12", label: "12 Diamonds", amount: 12, price: 2500 },
    { id: "ml-19", label: "19 Diamonds", amount: 19, price: 4000 },
    { id: "ml-28", label: "28 Diamonds", amount: 28, price: 6000 },
    { id: "ml-36", label: "36 Diamonds", amount: 36, price: 8000 },
    { id: "ml-56", label: "56 Diamonds", amount: 56, price: 12000 },
    { id: "ml-70", label: "70 Diamonds", amount: 70, price: 15000 },
    { id: "ml-86", label: "86 Diamonds", amount: 86, price: 18000 },
    { id: "ml-100", label: "100 Diamonds", amount: 100, price: 22000 },
    { id: "ml-172", label: "172 Diamonds", amount: 172, price: 35000 },
    { id: "ml-257", label: "257 Diamonds", amount: 257, price: 52000 },
    { id: "ml-344", label: "344 Diamonds", amount: 344, price: 69000 },
    { id: "ml-429", label: "429 Diamonds", amount: 429, price: 85000 },
    { id: "ml-514", label: "514 Diamonds", amount: 514, price: 99000 },
    { id: "ml-706", label: "706 Diamonds", amount: 706, price: 135000 }
  ],

  ff: [
    { id: "ff-5", label: "5 Diamonds", amount: 5, price: 1000 },
    { id: "ff-12", label: "12 Diamonds", amount: 12, price: 2000 },
    { id: "ff-50", label: "50 Diamonds", amount: 50, price: 7000 },
    { id: "ff-70", label: "70 Diamonds", amount: 70, price: 9500 },
    { id: "ff-100", label: "100 Diamonds", amount: 100, price: 13000 },
    { id: "ff-140", label: "140 Diamonds", amount: 140, price: 18000 },
    { id: "ff-210", label: "210 Diamonds", amount: 210, price: 27000 },
    { id: "ff-355", label: "355 Diamonds", amount: 355, price: 44000 },
    { id: "ff-720", label: "720 Diamonds", amount: 720, price: 85000 },
    { id: "ff-1450", label: "1450 Diamonds", amount: 1450, price: 169000 }
  ],

  pubg: [
    { id: "pubg-60", label: "60 UC", amount: 60, price: 16000 },
    { id: "pubg-325", label: "325 UC", amount: 325, price: 78000 },
    { id: "pubg-660", label: "660 UC", amount: 660, price: 149000 },
    { id: "pubg-1800", label: "1800 UC", amount: 1800, price: 379000 },
    { id: "pubg-3850", label: "3850 UC", amount: 3850, price: 759000 }
  ],

  valo: [
    { id: "valo-125", label: "125 VP", amount: 125, price: 17000 },
    { id: "valo-420", label: "420 VP", amount: 420, price: 50000 },
    { id: "valo-700", label: "700 VP", amount: 700, price: 80000 },
    { id: "valo-1375", label: "1375 VP", amount: 1375, price: 150000 },
    { id: "valo-2400", label: "2400 VP", amount: 2400, price: 250000 },
    { id: "valo-4000", label: "4000 VP", amount: 4000, price: 400000 }
  ],

  genshin: [
    { id: "gi-60", label: "60 Genesis Crystals", amount: 60, price: 16000 },
    { id: "gi-300", label: "300 Genesis Crystals", amount: 300, price: 75000 },
    { id: "gi-980", label: "980 Genesis Crystals", amount: 980, price: 230000 },
    { id: "gi-1980", label: "1980 Genesis Crystals", amount: 1980, price: 450000 },
    { id: "gi-3280", label: "3280 Genesis Crystals", amount: 3280, price: 720000 },
    { id: "gi-6480", label: "6480 Genesis Crystals", amount: 6480, price: 1400000 }
  ],

  codm: [
    { id: "codm-31", label: "31 CP", amount: 31, price: 7000 },
    { id: "codm-62", label: "62 CP", amount: 62, price: 13000 },
    { id: "codm-127", label: "127 CP", amount: 127, price: 25000 },
    { id: "codm-264", label: "264 CP", amount: 264, price: 50000 },
    { id: "codm-528", label: "528 CP", amount: 528, price: 95000 },
    { id: "codm-1056", label: "1056 CP", amount: 1056, price: 185000 }
  ],

  hok: [
    { id: "hok-80", label: "80 Tokens", amount: 80, price: 15000 },
    { id: "hok-240", label: "240 Tokens", amount: 240, price: 42000 },
    { id: "hok-400", label: "400 Tokens", amount: 400, price: 68000 },
    { id: "hok-800", label: "800 Tokens", amount: 800, price: 135000 },
    { id: "hok-1200", label: "1200 Tokens", amount: 1200, price: 195000 }
  ],

  aov: [
    { id: "aov-40", label: "40 Vouchers", amount: 40, price: 10000 },
    { id: "aov-90", label: "90 Vouchers", amount: 90, price: 20000 },
    { id: "aov-230", label: "230 Vouchers", amount: 230, price: 50000 },
    { id: "aov-470", label: "470 Vouchers", amount: 470, price: 99000 },
    { id: "aov-950", label: "950 Vouchers", amount: 950, price: 195000 }
  ],

  roblox: [
    { id: "roblox-80", label: "80 Robux", amount: 80, price: 18000 },
    { id: "roblox-160", label: "160 Robux", amount: 160, price: 35000 },
    { id: "roblox-400", label: "400 Robux", amount: 400, price: 82000 },
    { id: "roblox-800", label: "800 Robux", amount: 800, price: 159000 },
    { id: "roblox-1700", label: "1700 Robux", amount: 1700, price: 329000 }
  ],

  fcmobile: [
    { id: "fc-40", label: "40 FC Points", amount: 40, price: 12000 },
    { id: "fc-100", label: "100 FC Points", amount: 100, price: 29000 },
    { id: "fc-520", label: "520 FC Points", amount: 520, price: 139000 },
    { id: "fc-1050", label: "1050 FC Points", amount: 1050, price: 269000 },
    { id: "fc-2200", label: "2200 FC Points", amount: 2200, price: 549000 }
  ],

  efootball: [
    { id: "ef-130", label: "130 Coins", amount: 130, price: 23000 },
    { id: "ef-550", label: "550 Coins", amount: 550, price: 89000 },
    { id: "ef-1040", label: "1040 Coins", amount: 1040, price: 169000 },
    { id: "ef-2130", label: "2130 Coins", amount: 2130, price: 329000 },
    { id: "ef-3250", label: "3250 Coins", amount: 3250, price: 499000 }
  ],

  dragonraja: [
    { id: "dr-60", label: "60 Diamonds", amount: 60, price: 15000 },
    { id: "dr-300", label: "300 Diamonds", amount: 300, price: 69000 },
    { id: "dr-680", label: "680 Diamonds", amount: 680, price: 149000 },
    { id: "dr-1280", label: "1280 Diamonds", amount: 1280, price: 279000 },
    { id: "dr-3280", label: "3280 Diamonds", amount: 3280, price: 699000 }
  ],

  magicchess: [
    { id: "mc-55", label: "55 Diamonds", amount: 55, price: 15000 },
    { id: "mc-110", label: "110 Diamonds", amount: 110, price: 29000 },
    { id: "mc-275", label: "275 Diamonds", amount: 275, price: 69000 },
    { id: "mc-565", label: "565 Diamonds", amount: 565, price: 139000 },
    { id: "mc-1150", label: "1150 Diamonds", amount: 1150, price: 269000 }
  ],

  wildrift: [
    { id: "wr-425", label: "425 Wild Cores", amount: 425, price: 55000 },
    { id: "wr-1000", label: "1000 Wild Cores", amount: 1000, price: 119000 },
    { id: "wr-1850", label: "1850 Wild Cores", amount: 1850, price: 209000 },
    { id: "wr-3275", label: "3275 Wild Cores", amount: 3275, price: 359000 }
  ],

  "8ballpool": [
    { id: "8ball-20", label: "20 Cash", amount: 20, price: 10000 },
    { id: "8ball-50", label: "50 Cash", amount: 50, price: 20000 },
    { id: "8ball-120", label: "120 Cash", amount: 120, price: 45000 },
    { id: "8ball-250", label: "250 Cash", amount: 250, price: 85000 },
    { id: "8ball-500", label: "500 Cash", amount: 500, price: 159000 }
  ],

  asphalt9: [
    { id: "asphalt-50", label: "50 Tokens", amount: 50, price: 15000 },
    { id: "asphalt-130", label: "130 Tokens", amount: 130, price: 35000 },
    { id: "asphalt-300", label: "300 Tokens", amount: 300, price: 75000 },
    { id: "asphalt-650", label: "650 Tokens", amount: 650, price: 149000 }
  ],

  coc: [
    { id: "coc-80", label: "80 Gems", amount: 80, price: 17000 },
    { id: "coc-500", label: "500 Gems", amount: 500, price: 79000 },
    { id: "coc-1200", label: "1200 Gems", amount: 1200, price: 159000 },
    { id: "coc-2500", label: "2500 Gems", amount: 2500, price: 319000 },
    { id: "coc-6500", label: "6500 Gems", amount: 6500, price: 749000 }
  ],

  clashroyale: [
    { id: "cr-80", label: "80 Gems", amount: 80, price: 17000 },
    { id: "cr-500", label: "500 Gems", amount: 500, price: 79000 },
    { id: "cr-1200", label: "1200 Gems", amount: 1200, price: 159000 },
    { id: "cr-2500", label: "2500 Gems", amount: 2500, price: 319000 }
  ],

  pubgnewstate: [
    { id: "newstate-60", label: "60 NC", amount: 60, price: 16000 },
    { id: "newstate-330", label: "330 NC", amount: 330, price: 79000 },
    { id: "newstate-690", label: "690 NC", amount: 690, price: 159000 },
    { id: "newstate-1500", label: "1500 NC", amount: 1500, price: 329000 }
  ],

  undawn: [
    { id: "undawn-60", label: "60 RC", amount: 60, price: 15000 },
    { id: "undawn-300", label: "300 RC", amount: 300, price: 69000 },
    { id: "undawn-680", label: "680 RC", amount: 680, price: 149000 },
    { id: "undawn-1380", label: "1380 RC", amount: 1380, price: 289000 }
  ],

  sausageman: [
    { id: "sausage-60", label: "60 Candy", amount: 60, price: 15000 },
    { id: "sausage-300", label: "300 Candy", amount: 300, price: 69000 },
    { id: "sausage-680", label: "680 Candy", amount: 680, price: 149000 },
    { id: "sausage-1380", label: "1380 Candy", amount: 1380, price: 289000 }
  ],

  bloodstrike: [
    { id: "blood-60", label: "60 Gold", amount: 60, price: 15000 },
    { id: "blood-300", label: "300 Gold", amount: 300, price: 69000 },
    { id: "blood-680", label: "680 Gold", amount: 680, price: 149000 },
    { id: "blood-1380", label: "1380 Gold", amount: 1380, price: 289000 }
  ],

  pointblank: [
    { id: "pb-1200", label: "1.200 Cash", amount: 1200, price: 15000 },
    { id: "pb-3000", label: "3.000 Cash", amount: 3000, price: 35000 },
    { id: "pb-6000", label: "6.000 Cash", amount: 6000, price: 69000 },
    { id: "pb-12000", label: "12.000 Cash", amount: 12000, price: 135000 }
  ]
};

// ============================================================
// JOKI GAMES
// ============================================================

export const JOKI_GAMES = [
  {
    id: "ml",
    name: "Mobile Legends",
    icon: "⚔️",
    image: "/images/games/ml.jpeg",
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
      "Mythical Immortal"
    ]
  },

  {
    id: "ff",
    name: "Free Fire",
    icon: "🔥",
    image: "/images/games/ff.jpeg",
    ranks: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Heroic",
      "Master"
    ]
  },

  {
    id: "pubg",
    name: "PUBG Mobile",
    icon: "🔫",
    image: "/images/games/pubg.jpeg",
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
      "Conqueror"
    ]
  },

  {
    id: "valo",
    name: "Valorant",
    icon: "🎯",
    image: "/images/games/valo.jpeg",
    ranks: [
      "Iron",
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Ascendant",
      "Immortal",
      "Radiant"
    ]
  },

  {
    id: "genshin",
    name: "Genshin Impact",
    icon: "🌌",
    image: "/images/games/genshin.jpeg",
    ranks: [
      "Adventure Rank 10",
      "Adventure Rank 20",
      "Adventure Rank 30",
      "Adventure Rank 40",
      "Adventure Rank 50",
      "Adventure Rank 60"
    ]
  },

  {
    id: "codm",
    name: "Call of Duty Mobile",
    icon: "💥",
    image: "/images/games/codm.jpeg",
    ranks: [
      "Rookie",
      "Veteran",
      "Elite",
      "Pro",
      "Master",
      "Grandmaster",
      "Legendary"
    ]
  },

  {
    id: "hok",
    name: "Honor of Kings",
    icon: "👑",
    image: "/images/games/hok.jpeg",
    ranks: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Master",
      "Grandmaster",
      "Mythic"
    ]
  },

  {
    id: "aov",
    name: "Arena of Valor",
    icon: "🏹",
    image: "/images/games/aov.jpeg",
    ranks: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Veteran",
      "Master",
      "Conqueror"
    ]
  }
];

// ============================================================
// HARGA JOKI PER TIER
// ============================================================

export const JOKI_PRICE_PER_TIER = {
  ml: 10000,
  ff: 10000,
  pubg: 12000,
  valo: 15000,
  genshin: 10000,
  codm: 10000,
  hok: 10000,
  aov: 10000
};

// ============================================================
// AKUN GAME
// ============================================================

export const AKUN_LIST = [
  {
    id: "akun-ml-001",
    game: "Mobile Legends",
    gameId: "ml",
    title: "ML Account Epic",
    description: "Akun Mobile Legends rank Epic.",
    rank: "Epic",
    level: 30,
    price: 50000,
    icon: "⚔️",
    image: "/images/games/ml.jpeg"
  },

  {
    id: "akun-ml-002",
    game: "Mobile Legends",
    gameId: "ml",
    title: "ML Account Legend",
    description: "Akun Mobile Legends rank Legend.",
    rank: "Legend",
    level: 50,
    price: 125000,
    icon: "⚔️",
    image: "/images/games/ml.jpeg"
  },

  {
    id: "akun-ml-003",
    game: "Mobile Legends",
    gameId: "ml",
    title: "ML Account Mythic",
    description: "Akun Mobile Legends rank Mythic.",
    rank: "Mythic",
    level: 70,
    price: 250000,
    icon: "⚔️",
    image: "/images/games/ml.jpeg"
  },

  {
    id: "akun-ff-001",
    game: "Free Fire",
    gameId: "ff",
    title: "FF Account Diamond",
    description: "Akun Free Fire rank Diamond.",
    rank: "Diamond",
    level: 50,
    price: 75000,
    icon: "🔥",
    image: "/images/games/ff.jpeg"
  },

  {
    id: "akun-ff-002",
    game: "Free Fire",
    gameId: "ff",
    title: "FF Account Heroic",
    description: "Akun Free Fire rank Heroic.",
    rank: "Heroic",
    level: 60,
    price: 150000,
    icon: "🔥",
    image: "/images/games/ff.jpeg"
  },

  {
    id: "akun-pubg-001",
    game: "PUBG Mobile",
    gameId: "pubg",
    title: "PUBG Account Crown",
    description: "Akun PUBG Mobile rank Crown.",
    rank: "Crown",
    level: 45,
    price: 100000,
    icon: "🔫",
    image: "/images/games/pubg.jpeg"
  },

  {
    id: "akun-pubg-002",
    game: "PUBG Mobile",
    gameId: "pubg",
    title: "PUBG Account Ace",
    description: "Akun PUBG Mobile rank Ace.",
    rank: "Ace",
    level: 55,
    price: 200000,
    icon: "🔫",
    image: "/images/games/pubg.jpeg"
  },

  {
    id: "akun-valo-001",
    game: "Valorant",
    gameId: "valo",
    title: "Valorant Account Platinum",
    description: "Akun Valorant rank Platinum.",
    rank: "Platinum",
    level: 80,
    price: 150000,
    icon: "🎯",
    image: "/images/games/valo.jpeg"
  },

  {
    id: "akun-valo-002",
    game: "Valorant",
    gameId: "valo",
    title: "Valorant Account Diamond",
    description: "Akun Valorant rank Diamond.",
    rank: "Diamond",
    level: 100,
    price: 300000,
    icon: "🎯",
    image: "/images/games/valo.jpeg"
  },

  {
    id: "akun-hok-001",
    game: "Honor of Kings",
    gameId: "hok",
    title: "HOK Account Diamond",
    description: "Akun Honor of Kings rank Diamond.",
    rank: "Diamond",
    level: 40,
    price: 100000,
    icon: "👑",
    image: "/images/games/hok.jpeg"
  },

  {
    id: "akun-hok-002",
    game: "Honor of Kings",
    gameId: "hok",
    title: "HOK Account Master",
    description: "Akun Honor of Kings rank Master.",
    rank: "Master",
    level: 60,
    price: 200000,
    icon: "👑",
    image: "/images/games/hok.jpeg"
  },

  {
    id: "akun-genshin-001",
    game: "Genshin Impact",
    gameId: "genshin",
    title: "Genshin Account AR 45",
    description: "Akun Genshin Impact Adventure Rank 45.",
    rank: "AR 45",
    level: 45,
    price: 175000,
    icon: "🌌",
    image: "/images/games/genshin.jpeg"
  },

  {
    id: "akun-genshin-002",
    game: "Genshin Impact",
    gameId: "genshin",
    title: "Genshin Account AR 55",
    description: "Akun Genshin Impact Adventure Rank 55.",
    rank: "AR 55",
    level: 55,
    price: 350000,
    icon: "🌌",
    image: "/images/games/genshin.jpeg"
  },

  {
    id: "akun-codm-001",
    game: "Call of Duty Mobile",
    gameId: "codm",
    title: "CODM Account Master",
    description: "Akun Call of Duty Mobile rank Master.",
    rank: "Master",
    level: 60,
    price: 125000,
    icon: "💥",
    image: "/images/games/codm.jpeg"
  },

  {
    id: "akun-wildrift-001",
    game: "Wild Rift",
    gameId: "wildrift",
    title: "Wild Rift Account Emerald",
    description: "Akun Wild Rift rank Emerald.",
    rank: "Emerald",
    level: 40,
    price: 150000,
    icon: "⚔️",
    image: "/images/games/wildrift.jpeg"
  }
];

// ============================================================
// FORMAT RUPIAH
// ============================================================

export function formatRp(value) {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
}