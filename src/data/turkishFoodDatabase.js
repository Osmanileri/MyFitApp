// 🇹🇷 Comprehensive Turkish Food Database
// Based on Turkish Nutrition Database and FatSecret data

export const TURKISH_FOOD_DATABASE = [
  // EGGS & BREAKFAST
  {
    id: 'egg_scrambled',
    name: 'Çırpılmış Yumurta',
    nameEn: 'Scrambled Eggs',
    category: 'protein',
    calories: 155,
    protein: 11,
    carbs: 1.6,
    fat: 11.5,
    fiber: 0,
    defaultAmount: 100, // per 100g
    commonPortions: [
      { name: '1 porsiyon', amount: 80, unit: 'g' },
      { name: '2 yumurta', amount: 100, unit: 'g' },
      { name: '3 yumurta', amount: 150, unit: 'g' }
    ],
    searchTerms: ['yumurta', 'scrambled', 'çırpılmış', 'omlet']
  },
  {
    id: 'egg_3_pieces',
    name: '3 Yumurta',
    nameEn: '3 Eggs',
    category: 'protein',
    calories: 210,
    protein: 18,
    carbs: 1.8,
    fat: 15,
    fiber: 0,
    defaultAmount: 150, // 3 eggs ~150g
    commonPortions: [
      { name: '1 yumurta', amount: 50, unit: 'g' },
      { name: '2 yumurta', amount: 100, unit: 'g' },
      { name: '3 yumurta', amount: 150, unit: 'g' },
      { name: '4 yumurta', amount: 200, unit: 'g' }
    ],
    searchTerms: ['yumurta', 'egg', '3 yumurta']
  },
  {
    id: 'egg_boiled',
    name: 'Haşlanmış Yumurta',
    nameEn: 'Boiled Egg',
    category: 'protein',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 adet', amount: 50, unit: 'g' },
      { name: '2 adet', amount: 100, unit: 'g' }
    ],
    searchTerms: ['yumurta', 'haşlanmış', 'boiled', 'rafadan']
  },

  // RICE & GRAINS
  {
    id: 'rice_pilaf',
    name: 'Pirinç Pilavı',
    nameEn: 'Rice Pilaf',
    category: 'grains',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 çay bardağı', amount: 75, unit: 'g' },
      { name: '1 yemek kaşığı', amount: 15, unit: 'g' },
      { name: '1 porsiyon', amount: 150, unit: 'g' },
      { name: '1 tabak', amount: 200, unit: 'g' }
    ],
    searchTerms: ['pirinç', 'pilav', 'rice', 'sade pilav']
  },
  {
    id: 'rice_cooked',
    name: 'Pirinç Pişmemiş',
    nameEn: 'Uncooked Rice',
    category: 'grains',
    calories: 380,
    protein: 7,
    carbs: 77,
    fat: 0.7,
    fiber: 1.3,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 çay bardağı', amount: 185, unit: 'g' },
      { name: '1 yemek kaşığı', amount: 12, unit: 'g' }
    ],
    searchTerms: ['pirinç', 'rice', 'çiğ pirinç', 'pişmemiş']
  },

  // CHICKEN & MEAT
  {
    id: 'chicken_breast_boiled',
    name: 'Haşlanmış Tavuk Göğsü',
    nameEn: 'Boiled Chicken Breast',
    category: 'protein',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 dilim', amount: 85, unit: 'g' },
      { name: '1 porsiyon', amount: 150, unit: 'g' },
      { name: '100g', amount: 100, unit: 'g' },
      { name: '200g', amount: 200, unit: 'g' },
      { name: '250g', amount: 250, unit: 'g' }
    ],
    searchTerms: ['tavuk', 'göğüs', 'chicken', 'haşlanmış', 'breast']
  },
  {
    id: 'chicken_thigh_meat',
    name: 'Tavuk Göğüs Eti',
    nameEn: 'Chicken Thigh Meat',
    category: 'protein',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 dilim', amount: 85, unit: 'g' },
      { name: '1 porsiyon', amount: 150, unit: 'g' },
      { name: '250g', amount: 250, unit: 'g' }
    ],
    searchTerms: ['tavuk', 'göğüs', 'eti', 'chicken', 'but']
  },

  // BREAD & BAKERY
  {
    id: 'bread_kepekli',
    name: 'Kepekli Ekmek',
    nameEn: 'Whole Wheat Bread',
    category: 'grains',
    calories: 247,
    protein: 8.5,
    carbs: 41,
    fat: 4.2,
    fiber: 7.4,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 ince dilim', amount: 25, unit: 'g' },
      { name: '1 kalın dilim', amount: 40, unit: 'g' },
      { name: '2 normal dilim', amount: 60, unit: 'g' },
      { name: '1 tam', amount: 500, unit: 'g' }
    ],
    searchTerms: ['ekmek', 'kepekli', 'bread', 'wheat', 'tam buğday']
  },
  {
    id: 'white_rice_cooked',
    name: 'Beyaz Pirinç (Uzun-Öğütülmüş)',
    nameEn: 'White Rice (Long-Grain, Cooked)',
    category: 'grains',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 çay bardağı', amount: 75, unit: 'g' },
      { name: '1 porsiyon', amount: 150, unit: 'g' }
    ],
    searchTerms: ['beyaz pirinç', 'uzun öğütülmüş', 'white rice', 'pirinç']
  },

  // DAIRY & PROTEIN PRODUCTS
  {
    id: 'proteinocean_protein_powder',
    name: 'Proteinocean Protein Tozu',
    nameEn: 'Proteinocean Protein Powder',
    category: 'protein',
    calories: 380,
    protein: 75,
    carbs: 8,
    fat: 5,
    fiber: 2,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 ölçek (30g)', amount: 30, unit: 'g' },
      { name: '1.5 ölçek', amount: 45, unit: 'g' },
      { name: '2 ölçek', amount: 60, unit: 'g' }
    ],
    searchTerms: ['protein', 'tozu', 'proteinocean', 'powder', 'whey']
  },
  {
    id: 'proteinocean_protein',
    name: 'Proteinocean Protein',
    nameEn: 'Proteinocean Protein',
    category: 'protein',
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1.5,
    fiber: 1,
    defaultAmount: 30, // 1 scoop
    commonPortions: [
      { name: '1 ölçek', amount: 30, unit: 'g' },
      { name: '1.5 ölçek', amount: 45, unit: 'g' },
      { name: '2 ölçek', amount: 60, unit: 'g' }
    ],
    searchTerms: ['protein', 'proteinocean', 'whey', 'isolate']
  },
  {
    id: 'plain_protein',
    name: 'Protein',
    nameEn: 'Protein',
    category: 'protein',
    calories: 400,
    protein: 80,
    carbs: 10,
    fat: 5,
    fiber: 0,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 ölçek (25g)', amount: 25, unit: 'g' },
      { name: '1 ölçek (30g)', amount: 30, unit: 'g' }
    ],
    searchTerms: ['protein', 'whey', 'isolate', 'powder']
  },

  // VEGETABLES
  {
    id: 'oats',
    name: 'Yulaf',
    nameEn: 'Oats',
    category: 'grains',
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 çay bardağı', amount: 40, unit: 'g' },
      { name: '1 yemek kaşığı', amount: 10, unit: 'g' },
      { name: '1 porsiyon', amount: 50, unit: 'g' }
    ],
    searchTerms: ['yulaf', 'oats', 'oatmeal', 'gevrek']
  },

  // ADDITIONAL TURKISH FOODS FROM SCREENSHOTS
  {
    id: 'almonds',
    name: 'Badem',
    nameEn: 'Almonds',
    category: 'nuts',
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fat: 49.9,
    fiber: 12.5,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 avuç (28g)', amount: 28, unit: 'g' },
      { name: '10 adet', amount: 14, unit: 'g' },
      { name: '20 adet', amount: 28, unit: 'g' }
    ],
    searchTerms: ['badem', 'almond', 'nuts', 'fındık']
  },
  {
    id: 'walnuts',
    name: 'Ceviz',
    nameEn: 'Walnuts',
    category: 'nuts',
    calories: 654,
    protein: 15.2,
    carbs: 13.7,
    fat: 65.2,
    fiber: 6.7,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 avuç', amount: 30, unit: 'g' },
      { name: '5 yarım', amount: 15, unit: 'g' },
      { name: '10 yarım', amount: 30, unit: 'g' }
    ],
    searchTerms: ['ceviz', 'walnut', 'nuts']
  },
  {
    id: 'banana',
    name: 'Muz',
    nameEn: 'Banana',
    category: 'fruits',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 küçük', amount: 80, unit: 'g' },
      { name: '1 orta', amount: 120, unit: 'g' },
      { name: '1 büyük', amount: 150, unit: 'g' }
    ],
    searchTerms: ['muz', 'banana']
  },
  {
    id: 'apple',
    name: 'Elma',
    nameEn: 'Apple',
    category: 'fruits',
    calories: 52,
    protein: 0.3,
    carbs: 13.8,
    fat: 0.2,
    fiber: 2.4,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 küçük', amount: 150, unit: 'g' },
      { name: '1 orta', amount: 180, unit: 'g' },
      { name: '1 büyük', amount: 220, unit: 'g' }
    ],
    searchTerms: ['elma', 'apple']
  },
  
  // COMMON TURKISH BREAKFAST ITEMS
  {
    id: 'white_cheese',
    name: 'Beyaz Peynir',
    nameEn: 'White Cheese',
    category: 'dairy',
    calories: 264,
    protein: 17.6,
    carbs: 1.5,
    fat: 21,
    fiber: 0,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 küp', amount: 15, unit: 'g' },
      { name: '1 dilim', amount: 25, unit: 'g' },
      { name: '2 dilim', amount: 50, unit: 'g' }
    ],
    searchTerms: ['peynir', 'beyaz', 'cheese', 'white']
  },
  {
    id: 'turkish_tea',
    name: 'Çay',
    nameEn: 'Turkish Tea',
    category: 'beverages',
    calories: 2,
    protein: 0,
    carbs: 0.7,
    fat: 0,
    fiber: 0,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 bardak', amount: 200, unit: 'ml' },
      { name: '1 çay bardağı', amount: 100, unit: 'ml' }
    ],
    searchTerms: ['çay', 'tea', 'türk çayı']
  },
  {
    id: 'turkish_coffee',
    name: 'Türk Kahvesi',
    nameEn: 'Turkish Coffee',
    category: 'beverages',
    calories: 7,
    protein: 0.1,
    carbs: 1.6,
    fat: 0,
    fiber: 0,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 fincan', amount: 60, unit: 'ml' }
    ],
    searchTerms: ['kahve', 'türk kahvesi', 'coffee']
  },
  {
    id: 'olive_oil',
    name: 'Zeytinyağı',
    nameEn: 'Olive Oil',
    category: 'fats',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    fiber: 0,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 çay kaşığı', amount: 5, unit: 'ml' },
      { name: '1 yemek kaşığı', amount: 15, unit: 'ml' },
      { name: '1 çorba kaşığı', amount: 20, unit: 'ml' }
    ],
    searchTerms: ['zeytinyağı', 'olive oil', 'yağ']
  },
  {
    id: 'tomato',
    name: 'Domates',
    nameEn: 'Tomato',
    category: 'vegetables',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 küçük', amount: 90, unit: 'g' },
      { name: '1 orta', amount: 120, unit: 'g' },
      { name: '1 büyük', amount: 180, unit: 'g' }
    ],
    searchTerms: ['domates', 'tomato']
  },
  {
    id: 'cucumber',
    name: 'Salatalık',
    nameEn: 'Cucumber',
    category: 'vegetables',
    calories: 16,
    protein: 0.7,
    carbs: 3.6,
    fat: 0.1,
    fiber: 0.5,
    defaultAmount: 100,
    commonPortions: [
      { name: '1 orta', amount: 200, unit: 'g' },
      { name: '1 dilim', amount: 15, unit: 'g' },
      { name: '10 dilim', amount: 150, unit: 'g' }
    ],
    searchTerms: ['salatalık', 'cucumber', 'hıyar']
  }
];

// FOOD CATEGORIES FOR FILTERING
export const FOOD_CATEGORIES = [
  {
    id: 'all',
    name: 'Tümü',
    nameEn: 'All',
    icon: 'food-variant',
    color: '#6B7280'
  },
  {
    id: 'protein',
    name: 'Protein',
    nameEn: 'Protein',
    icon: 'food-steak',
    color: '#EF4444'
  },
  {
    id: 'grains',
    name: 'Tahıllar',
    nameEn: 'Grains',
    icon: 'barley',
    color: '#F59E0B'
  },
  {
    id: 'dairy',
    name: 'Süt Ürünleri',
    nameEn: 'Dairy',
    icon: 'cup',
    color: '#3B82F6'
  },
  {
    id: 'fruits',
    name: 'Meyveler',
    nameEn: 'Fruits',
    icon: 'food-apple',
    color: '#10B981'
  },
  {
    id: 'vegetables',
    name: 'Sebzeler',
    nameEn: 'Vegetables',
    icon: 'carrot',
    color: '#8B5CF6'
  },
  {
    id: 'nuts',
    name: 'Kuruyemiş',
    nameEn: 'Nuts',
    icon: 'peanut',
    color: '#D97706'
  },
  {
    id: 'fats',
    name: 'Yağlar',
    nameEn: 'Fats',
    icon: 'water-outline',
    color: '#F59E0B'
  },
  {
    id: 'beverages',
    name: 'İçecekler',
    nameEn: 'Beverages',
    icon: 'cup-water',
    color: '#06B6D4'
  }
];

// POPULAR FOODS FOR QUICK ACCESS
export const POPULAR_FOODS = [
  'egg_scrambled',
  'chicken_breast_boiled',
  'rice_pilaf',
  'bread_kepekli',
  'banana',
  'apple',
  'oats',
  'white_cheese',
  'proteinocean_protein'
];

// SEARCH FUNCTION
export const searchFoodsInDatabase = (query, category = 'all') => {
  if (!query || query.length < 2) {
    return category === 'all' 
      ? POPULAR_FOODS.map(id => TURKISH_FOOD_DATABASE.find(food => food.id === id)).filter(Boolean)
      : TURKISH_FOOD_DATABASE.filter(food => food.category === category).slice(0, 10);
  }

  const searchTerms = query.toLowerCase().trim().split(' ');
  
  return TURKISH_FOOD_DATABASE.filter(food => {
    if (category !== 'all' && food.category !== category) {
      return false;
    }
    
    return searchTerms.every(term => 
      food.name.toLowerCase().includes(term) ||
      food.nameEn.toLowerCase().includes(term) ||
      food.searchTerms.some(searchTerm => searchTerm.toLowerCase().includes(term))
    );
  }).sort((a, b) => {
    // Prioritize exact matches
    const aExact = a.name.toLowerCase().includes(query.toLowerCase());
    const bExact = b.name.toLowerCase().includes(query.toLowerCase());
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return 0;
  });
};

// GET FOOD BY ID
export const getFoodById = (id) => {
  return TURKISH_FOOD_DATABASE.find(food => food.id === id);
};

// CALCULATE NUTRITION FOR AMOUNT
export const calculateNutrition = (food, amount) => {
  const factor = amount / food.defaultAmount;
  return {
    calories: Math.round(food.calories * factor),
    protein: Math.round(food.protein * factor * 10) / 10,
    carbs: Math.round(food.carbs * factor * 10) / 10,
    fat: Math.round(food.fat * factor * 10) / 10,
    fiber: Math.round(food.fiber * factor * 10) / 10
  };
}; 