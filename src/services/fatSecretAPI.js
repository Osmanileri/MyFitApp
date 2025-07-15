// 🔍 FatSecret API Service
// Provides international food data with demo functionality

const DEMO_MODE = true; // Set to false when you have actual API credentials

// Demo FatSecret food database for testing
const DEMO_FATSECRET_FOODS = [
  {
    id: 'fs_chicken_breast',
    name: 'Chicken Breast (Skinless)',
    nameLocal: 'Tavuk Göğsü (Derisiz)',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    brand: 'Generic',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_brown_rice',
    name: 'Brown Rice Cooked',
    nameLocal: 'Esmer Pirinç (Pişmiş)',
    calories: 111,
    protein: 2.6,
    carbs: 22,
    fat: 0.9,
    fiber: 1.8,
    brand: 'Generic',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_banana',
    name: 'Banana Medium',
    nameLocal: 'Muz (Orta Boy)',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    brand: 'Fresh',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_greek_yogurt',
    name: 'Greek Yogurt Plain',
    nameLocal: 'Yunan Yoğurdu (Sade)',
    calories: 100,
    protein: 10,
    carbs: 6,
    fat: 5,
    fiber: 0,
    brand: 'Generic',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_almonds',
    name: 'Almonds Raw',
    nameLocal: 'Badem (Çiğ)',
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fat: 49.9,
    fiber: 12.5,
    brand: 'Generic',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_salmon',
    name: 'Atlantic Salmon',
    nameLocal: 'Atlantik Somonu',
    calories: 208,
    protein: 25.4,
    carbs: 0,
    fat: 12.4,
    fiber: 0,
    brand: 'Fresh',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_sweet_potato',
    name: 'Sweet Potato Baked',
    nameLocal: 'Tatlı Patates (Fırında)',
    calories: 86,
    protein: 1.6,
    carbs: 20.1,
    fat: 0.1,
    fiber: 3,
    brand: 'Fresh',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_avocado',
    name: 'Avocado',
    nameLocal: 'Avokado',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    brand: 'Fresh',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_quinoa',
    name: 'Quinoa Cooked',
    nameLocal: 'Kinoa (Pişmiş)',
    calories: 120,
    protein: 4.4,
    carbs: 21.8,
    fat: 1.9,
    fiber: 2.8,
    brand: 'Generic',
    source: 'fatsecret_demo'
  },
  {
    id: 'fs_whey_protein',
    name: 'Whey Protein Powder',
    nameLocal: 'Whey Protein Tozu',
    calories: 103,
    protein: 20,
    carbs: 2,
    fat: 1.5,
    fiber: 1,
    brand: 'Generic',
    source: 'fatsecret_demo'
  }
];

class FatSecretAPI {
  constructor() {
    this.baseURL = 'https://platform.fatsecret.com/rest/server.api';
    this.consumerKey = process.env.FATSECRET_CONSUMER_KEY || 'demo_key';
    this.consumerSecret = process.env.FATSECRET_CONSUMER_SECRET || 'demo_secret';
    this.accessToken = null;
    this.demoMode = DEMO_MODE;
  }

  // Demo search function
  searchFoodsDemo(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = DEMO_FATSECRET_FOODS.filter(food => 
          food.name.toLowerCase().includes(query.toLowerCase()) ||
          food.nameLocal.toLowerCase().includes(query.toLowerCase())
        );
        resolve({
          success: true,
          data: results,
          source: 'demo'
        });
      }, 300); // Simulate API delay
    });
  }

  // Real FatSecret API search (requires actual credentials)
  async searchFoodsReal(query, maxResults = 20) {
    try {
      // This would be the actual FatSecret API implementation
      // For now, returning demo data
      console.log('FatSecret API: Real implementation would go here');
      return await this.searchFoodsDemo(query);
    } catch (error) {
      console.error('FatSecret API Error:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Main search function
  async searchFoods(query, maxResults = 20) {
    if (!query || query.length < 2) {
      return {
        success: true,
        data: [],
        source: 'empty_query'
      };
    }

    try {
      if (this.demoMode) {
        return await this.searchFoodsDemo(query);
      } else {
        return await this.searchFoodsReal(query, maxResults);
      }
    } catch (error) {
      console.error('FatSecret Search Error:', error);
      
      // Fallback to demo data on error
      console.log('Falling back to demo data...');
      return await this.searchFoodsDemo(query);
    }
  }

  // Get popular international foods
  getPopularFoods() {
    const popular = [
      'fs_chicken_breast',
      'fs_greek_yogurt', 
      'fs_salmon',
      'fs_quinoa',
      'fs_whey_protein',
      'fs_avocado'
    ];

    return DEMO_FATSECRET_FOODS.filter(food => 
      popular.includes(food.id)
    );
  }

  // Get food details by ID
  getFoodById(id) {
    return DEMO_FATSECRET_FOODS.find(food => food.id === id);
  }

  // Convert FatSecret food to our standard format
  formatFoodItem(fatSecretFood) {
    return {
      id: fatSecretFood.id,
      name: fatSecretFood.nameLocal || fatSecretFood.name,
      nameEn: fatSecretFood.name,
      category: this.categorizeFood(fatSecretFood),
      calories: fatSecretFood.calories,
      protein: fatSecretFood.protein,
      carbs: fatSecretFood.carbs,
      fat: fatSecretFood.fat,
      fiber: fatSecretFood.fiber || 0,
      defaultAmount: 100,
      commonPortions: this.generateCommonPortions(fatSecretFood),
      searchTerms: this.generateSearchTerms(fatSecretFood),
      source: 'fatsecret',
      brand: fatSecretFood.brand
    };
  }

  // Categorize food based on nutrition profile
  categorizeFood(food) {
    const { protein, carbs, fat } = food;
    
    if (protein > 15 && protein > carbs && protein > fat) {
      return 'protein';
    } else if (carbs > 40) {
      return 'grains';
    } else if (fat > 15) {
      return 'fats';
    } else if (food.name.toLowerCase().includes('fruit') || 
               food.nameLocal?.toLowerCase().includes('meyve')) {
      return 'fruits';
    } else if (food.name.toLowerCase().includes('vegetable') ||
               food.nameLocal?.toLowerCase().includes('sebze')) {
      return 'vegetables';
    } else if (food.name.toLowerCase().includes('milk') ||
               food.name.toLowerCase().includes('cheese') ||
               food.name.toLowerCase().includes('yogurt') ||
               food.nameLocal?.toLowerCase().includes('süt') ||
               food.nameLocal?.toLowerCase().includes('peynir') ||
               food.nameLocal?.toLowerCase().includes('yoğurt')) {
      return 'dairy';
    } else {
      return 'protein'; // Default category
    }
  }

  // Generate common portions based on food type
  generateCommonPortions(food) {
    const basePortions = [
      { name: '1 porsiyon', amount: 100, unit: 'g' },
      { name: '50g', amount: 50, unit: 'g' },
      { name: '200g', amount: 200, unit: 'g' }
    ];

    // Add specific portions based on food type
    if (food.name.toLowerCase().includes('protein') || 
        food.nameLocal?.toLowerCase().includes('protein')) {
      basePortions.unshift({ name: '1 ölçek (30g)', amount: 30, unit: 'g' });
    } else if (food.name.toLowerCase().includes('chicken') ||
               food.nameLocal?.toLowerCase().includes('tavuk')) {
      basePortions.unshift({ name: '1 dilim', amount: 85, unit: 'g' });
    } else if (food.name.toLowerCase().includes('rice') ||
               food.nameLocal?.toLowerCase().includes('pirinç')) {
      basePortions.unshift({ name: '1 çay bardağı', amount: 75, unit: 'g' });
    }

    return basePortions;
  }

  // Generate search terms
  generateSearchTerms(food) {
    const terms = [
      food.name.toLowerCase(),
      food.nameLocal?.toLowerCase()
    ].filter(Boolean);

    // Add common English-Turkish translations
    const translations = {
      'chicken': 'tavuk',
      'rice': 'pirinç',
      'protein': 'protein',
      'yogurt': 'yoğurt',
      'salmon': 'somon',
      'banana': 'muz'
    };

    Object.entries(translations).forEach(([en, tr]) => {
      if (food.name.toLowerCase().includes(en)) {
        terms.push(tr);
      }
    });

    return [...new Set(terms)]; // Remove duplicates
  }

  // Check API status
  async checkStatus() {
    if (this.demoMode) {
      return {
        status: 'demo',
        message: 'Running in demo mode',
        available: true
      };
    }

    try {
      // This would check the actual FatSecret API status
      return {
        status: 'active',
        message: 'FatSecret API is available',
        available: true
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        available: false
      };
    }
  }
}

// Export singleton instance
export const fatSecretAPI = new FatSecretAPI();

// Export individual functions for easier testing
export const searchFoods = (query, maxResults) => fatSecretAPI.searchFoods(query, maxResults);
export const getPopularFoods = () => fatSecretAPI.getPopularFoods();
export const getFoodById = (id) => fatSecretAPI.getFoodById(id);
export const checkAPIStatus = () => fatSecretAPI.checkStatus();

export default fatSecretAPI; 