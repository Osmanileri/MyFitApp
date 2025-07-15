import AsyncStorage from '@react-native-async-storage/async-storage';
import { turkishFoodDatabase } from '../data/turkishFoodDatabase';

// FatSecret API configuration - Using environment variables for security
const FATSECRET_CLIENT_ID = process.env.FATSECRET_CLIENT_ID || 'your_client_id_here';
const FATSECRET_CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET || 'your_client_secret_here';
const FATSECRET_BASE_URL = process.env.FATSECRET_BASE_URL || 'https://platform.fatsecret.com/rest/server.api';
const FATSECRET_TOKEN_URL = process.env.FATSECRET_TOKEN_URL || 'https://oauth.fatsecret.com/connect/token';

// Cache keys
const CACHE_KEY_PREFIX = 'nutrition_cache_';
const TOKEN_CACHE_KEY = 'fatsecret_token';
const CACHE_EXPIRY_HOURS = 24;
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer

// Comprehensive Turkish food database with proper nutrition values
const TURKISH_FOODS_DB = {
  // Breakfast Foods
  'yumurta': {
    name: 'Yumurta',
    calories: 70,
    protein: 6.0,
    carbs: 0.6,
    fat: 5.0,
    fiber: 0,
    portion: '1 adet (50g)',
    category: 'protein',
    icon: 'egg'
  },
  'ekmek': {
    name: 'Ekmek',
    calories: 265,
    protein: 9.0,
    carbs: 49.0,
    fat: 3.2,
    fiber: 2.7,
    portion: '100g',
    category: 'grains',
    icon: 'food-variant'
  },
  'peynir': {
    name: 'Beyaz Peynir',
    calories: 264,
    protein: 18.0,
    carbs: 1.5,
    fat: 21.0,
    fiber: 0,
    portion: '100g',
    category: 'dairy',
    icon: 'cheese'
  },
  'tereyağı': {
    name: 'Tereyağı',
    calories: 717,
    protein: 0.9,
    carbs: 0.1,
    fat: 81.0,
    fiber: 0,
    portion: '100g',
    category: 'fats',
    icon: 'butter'
  },
  'bal': {
    name: 'Bal',
    calories: 304,
    protein: 0.3,
    carbs: 82.0,
    fat: 0,
    fiber: 0.2,
    portion: '100g',
    category: 'sweets',
    icon: 'bee'
  },
  'reçel': {
    name: 'Reçel',
    calories: 278,
    protein: 0.4,
    carbs: 69.0,
    fat: 0.1,
    fiber: 1.0,
    portion: '100g',
    category: 'sweets',
    icon: 'food-variant'
  },
  'zeytin': {
    name: 'Zeytin',
    calories: 115,
    protein: 0.8,
    carbs: 6.3,
    fat: 10.7,
    fiber: 3.2,
    portion: '100g',
    category: 'vegetables',
    icon: 'food-variant'
  },
  'domates': {
    name: 'Domates',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    portion: '100g',
    category: 'vegetables',
    icon: 'food-apple'
  },
  'salatalık': {
    name: 'Salatalık',
    calories: 16,
    protein: 0.7,
    carbs: 4.0,
    fat: 0.1,
    fiber: 0.5,
    portion: '100g',
    category: 'vegetables',
    icon: 'food-apple'
  },

  // Main Dishes
  'pilav': {
    name: 'Pirinç Pilavı',
    calories: 130,
    protein: 3.0,
    carbs: 28.0,
    fat: 0.3,
    fiber: 0.4,
    portion: '100g',
    category: 'grains',
    icon: 'rice'
  },
  'kebap': {
    name: 'Adana Kebap',
    calories: 250,
    protein: 25.0,
    carbs: 2.0,
    fat: 15.0,
    fiber: 0,
    portion: '100g',
    category: 'protein',
    icon: 'food-steak'
  },
  'köfte': {
    name: 'Köfte',
    calories: 280,
    protein: 18.0,
    carbs: 5.0,
    fat: 20.0,
    fiber: 0.5,
    portion: '100g',
    category: 'protein',
    icon: 'food-steak'
  },
  'tavuk': {
    name: 'Tavuk Göğsü',
    calories: 165,
    protein: 31.0,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    portion: '100g',
    category: 'protein',
    icon: 'food-drumstick'
  },
  'balık': {
    name: 'Levrek',
    calories: 124,
    protein: 24.0,
    carbs: 0,
    fat: 2.6,
    fiber: 0,
    portion: '100g',
    category: 'protein',
    icon: 'fish'
  },
  'makarna': {
    name: 'Makarna',
    calories: 131,
    protein: 5.0,
    carbs: 25.0,
    fat: 1.1,
    fiber: 1.8,
    portion: '100g',
    category: 'grains',
    icon: 'food-variant'
  },
  'bulgur': {
    name: 'Bulgur Pilavı',
    calories: 83,
    protein: 3.1,
    carbs: 18.6,
    fat: 0.2,
    fiber: 4.5,
    portion: '100g',
    category: 'grains',
    icon: 'barley'
  },

  // Soups
  'mercimek': {
    name: 'Mercimek Çorbası',
    calories: 60,
    protein: 3.0,
    carbs: 8.0,
    fat: 2.0,
    fiber: 1.5,
    portion: '1 kase (250ml)',
    category: 'soup',
    icon: 'bowl-mix'
  },
  'yayla': {
    name: 'Yayla Çorbası',
    calories: 45,
    protein: 2.5,
    carbs: 5.0,
    fat: 1.5,
    fiber: 0.5,
    portion: '1 kase (250ml)',
    category: 'soup',
    icon: 'bowl-mix'
  },
  'tarhana': {
    name: 'Tarhana Çorbası',
    calories: 50,
    protein: 2.0,
    carbs: 8.0,
    fat: 1.0,
    fiber: 1.0,
    portion: '1 kase (250ml)',
    category: 'soup',
    icon: 'bowl-mix'
  },

  // Turkish Specialties
  'lahmacun': {
    name: 'Lahmacun',
    calories: 200,
    protein: 8.0,
    carbs: 20.0,
    fat: 10.0,
    fiber: 1.5,
    portion: '1 adet',
    category: 'mixed',
    icon: 'pizza'
  },
  'börek': {
    name: 'Su Böreği',
    calories: 280,
    protein: 12.0,
    carbs: 22.0,
    fat: 18.0,
    fiber: 1.0,
    portion: '100g',
    category: 'mixed',
    icon: 'food-variant'
  },
  'döner': {
    name: 'Tavuk Döner',
    calories: 200,
    protein: 20.0,
    carbs: 15.0,
    fat: 8.0,
    fiber: 1.0,
    portion: '100g',
    category: 'protein',
    icon: 'food-drumstick'
  },
  'meze': {
    name: 'Meze (Karışık)',
    calories: 150,
    protein: 4.0,
    carbs: 10.0,
    fat: 12.0,
    fiber: 2.0,
    portion: '100g',
    category: 'mixed',
    icon: 'food-variant'
  },
  'menemen': {
    name: 'Menemen',
    calories: 150,
    protein: 8.0,
    carbs: 6.0,
    fat: 11.0,
    fiber: 2.0,
    portion: '1 porsiyon',
    category: 'mixed',
    icon: 'egg'
  },
  'sucuklu': {
    name: 'Sucuklu Yumurta',
    calories: 220,
    protein: 12.0,
    carbs: 2.0,
    fat: 18.0,
    fiber: 0,
    portion: '1 porsiyon',
    category: 'protein',
    icon: 'egg'
  },

  // Desserts
  'baklava': {
    name: 'Baklava',
    calories: 330,
    protein: 5.0,
    carbs: 40.0,
    fat: 18.0,
    fiber: 2.0,
    portion: '1 dilim',
    category: 'dessert',
    icon: 'food-variant'
  },
  'künefe': {
    name: 'Künefe',
    calories: 290,
    protein: 8.0,
    carbs: 35.0,
    fat: 14.0,
    fiber: 1.0,
    portion: '1 porsiyon',
    category: 'dessert',
    icon: 'food-variant'
  },
  'tulumba': {
    name: 'Tulumba Tatlısı',
    calories: 250,
    protein: 3.0,
    carbs: 42.0,
    fat: 8.0,
    fiber: 0.5,
    portion: '100g',
    category: 'dessert',
    icon: 'food-variant'
  },

  // Fruits
  'elma': {
    name: 'Elma',
    calories: 52,
    protein: 0.3,
    carbs: 14.0,
    fat: 0.2,
    fiber: 2.4,
    portion: '1 orta (180g)',
    category: 'fruit',
    icon: 'apple'
  },
  'muz': {
    name: 'Muz',
    calories: 89,
    protein: 1.1,
    carbs: 23.0,
    fat: 0.3,
    fiber: 2.6,
    portion: '1 orta (120g)',
    category: 'fruit',
    icon: 'food-apple'
  },
  'portakal': {
    name: 'Portakal',
    calories: 47,
    protein: 0.9,
    carbs: 12.0,
    fat: 0.1,
    fiber: 2.4,
    portion: '1 orta (150g)',
    category: 'fruit',
    icon: 'food-apple'
  },
  'üzüm': {
    name: 'Üzüm',
    calories: 69,
    protein: 0.7,
    carbs: 18.0,
    fat: 0.2,
    fiber: 0.9,
    portion: '100g',
    category: 'fruit',
    icon: 'food-apple'
  },

  // Beverages
  'çay': {
    name: 'Çay',
    calories: 2,
    protein: 0,
    carbs: 0.3,
    fat: 0,
    fiber: 0,
    portion: '1 bardak (200ml)',
    category: 'beverage',
    icon: 'cup'
  },
  'kahve': {
    name: 'Türk Kahvesi',
    calories: 5,
    protein: 0.3,
    carbs: 1.0,
    fat: 0,
    fiber: 0,
    portion: '1 fincan',
    category: 'beverage',
    icon: 'coffee'
  },
  'ayran': {
    name: 'Ayran',
    calories: 50,
    protein: 2.0,
    carbs: 3.5,
    fat: 3.0,
    fiber: 0,
    portion: '200ml',
    category: 'beverage',
    icon: 'cup'
  },
  'süt': {
    name: 'Süt',
    calories: 64,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.6,
    fiber: 0,
    portion: '200ml',
    category: 'dairy',
    icon: 'cup'
  },

  // Nuts and Seeds
  'ceviz': {
    name: 'Ceviz',
    calories: 654,
    protein: 15.2,
    carbs: 13.7,
    fat: 65.2,
    fiber: 6.7,
    portion: '100g',
    category: 'nuts',
    icon: 'food-variant'
  },
  'badem': {
    name: 'Badem',
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fat: 49.9,
    fiber: 12.5,
    portion: '100g',
    category: 'nuts',
    icon: 'food-variant'
  },
  'fındık': {
    name: 'Fındık',
    calories: 628,
    protein: 15.0,
    carbs: 16.7,
    fat: 60.8,
    fiber: 9.7,
    portion: '100g',
    category: 'nuts',
    icon: 'food-variant'
  },

  // Yogurt and Dairy
  'yoğurt': {
    name: 'Yoğurt',
    calories: 61,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    fiber: 0,
    portion: '100g',
    category: 'dairy',
    icon: 'food'
  },
  'labne': {
    name: 'Labne',
    calories: 112,
    protein: 6.0,
    carbs: 6.0,
    fat: 8.0,
    fiber: 0,
    portion: '100g',
    category: 'dairy',
    icon: 'food'
  }
};

// Popular Turkish foods for quick selection
const POPULAR_TURKISH_FOODS = [
  'yumurta', 'ekmek', 'peynir', 'domates', 'salatalık', 'pilav', 
  'tavuk', 'köfte', 'çay', 'kahve', 'yoğurt', 'muz', 'elma', 'zeytin'
];

class NutritionAPI {
  constructor() {
    this.isOnline = true;
    this.cacheEnabled = true;
    this.accessToken = null;
    this.tokenExpiryTime = null;
  }

  // Check if API credentials are configured
  isConfigured() {
    return FATSECRET_CLIENT_ID !== 'your_client_id_here' && 
           FATSECRET_CLIENT_SECRET !== 'your_client_secret_here';
  }

  // Get OAuth 2.0 access token for FatSecret API
  async getAccessToken() {
    try {
      // Check if we have a valid cached token
      if (this.accessToken && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime - TOKEN_EXPIRY_BUFFER) {
        return this.accessToken;
      }

      // Try to load token from storage
      const cachedToken = await AsyncStorage.getItem(TOKEN_CACHE_KEY);
      if (cachedToken) {
        const { token, expiryTime } = JSON.parse(cachedToken);
        if (Date.now() < expiryTime - TOKEN_EXPIRY_BUFFER) {
          this.accessToken = token;
          this.tokenExpiryTime = expiryTime;
          return token;
        }
      }

      // Request new token if configured
      if (!this.isConfigured()) {
        throw new Error('FatSecret API credentials not configured. Using local database only.');
      }

      const credentials = `${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`;
      const encodedCredentials = btoa(credentials);

      const response = await fetch(FATSECRET_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${encodedCredentials}`
        },
        body: 'grant_type=client_credentials&scope=basic'
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const tokenData = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiryTime = Date.now() + (tokenData.expires_in * 1000);

      // Cache the token
      await AsyncStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify({
        token: this.accessToken,
        expiryTime: this.tokenExpiryTime
      }));

      return this.accessToken;
    } catch (error) {
      console.warn('Token acquisition error:', error.message);
      // Continue with local database only
      return null;
    }
  }

  // Generate cache key
  getCacheKey(query) {
    return `${CACHE_KEY_PREFIX}${query.toLowerCase().replace(/\s+/g, '_')}`;
  }

  // Check if cached data is still valid
  async isCacheValid(cacheKey) {
    try {
      const cacheData = await AsyncStorage.getItem(cacheKey);
      if (!cacheData) return false;

      const { timestamp } = JSON.parse(cacheData);
      const expiryTime = timestamp + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
      return Date.now() < expiryTime;
    } catch (error) {
      return false;
    }
  }

  // Get data from cache
  async getFromCache(cacheKey) {
    try {
      const cacheData = await AsyncStorage.getItem(cacheKey);
      if (cacheData) {
        const { data } = JSON.parse(cacheData);
        return data;
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }

  // Save data to cache
  async saveToCache(cacheKey, data) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  // Search Turkish foods locally with fuzzy matching
  searchTurkishFoods(query) {
    const searchQuery = query.toLowerCase().trim();
    const results = [];

    // Exact matches first
    Object.entries(TURKISH_FOODS_DB).forEach(([key, food]) => {
      if (key === searchQuery || food.name.toLowerCase() === searchQuery) {
        results.push({
          ...food,
          id: key,
          source: 'local',
          relevance: 100
        });
      }
    });

    // Partial matches
    Object.entries(TURKISH_FOODS_DB).forEach(([key, food]) => {
      if (key.includes(searchQuery) || food.name.toLowerCase().includes(searchQuery)) {
        const alreadyAdded = results.some(item => item.id === key);
        if (!alreadyAdded) {
          results.push({
            ...food,
            id: key,
            source: 'local',
            relevance: 80
          });
        }
      }
    });

    // Sort by relevance and return top 20
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 20);
  }

  // Search food using FatSecret API
  async searchFoodAPI(query) {
    if (!this.isConfigured()) {
      throw new Error('FatSecret API credentials not configured');
    }

    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        throw new Error('Could not obtain access token');
      }
      
      const params = new URLSearchParams({
        method: 'foods.search',
        search_expression: query,
        format: 'json'
      });

      const response = await fetch(`${FATSECRET_BASE_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.foods || !data.foods.food) {
        return [];
      }

      // Normalize the response
      const foods = Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];
      
      return foods.map(food => ({
        id: food.food_id,
        name: food.food_name,
        calories: parseInt(food.food_description.match(/Calories: (\d+)/)?.[1] || '0'),
        protein: parseFloat(food.food_description.match(/Protein: ([\d.]+)g/)?.[1] || '0'),
        carbs: parseFloat(food.food_description.match(/Carbs: ([\d.]+)g/)?.[1] || '0'),
        fat: parseFloat(food.food_description.match(/Fat: ([\d.]+)g/)?.[1] || '0'),
        fiber: parseFloat(food.food_description.match(/Fiber: ([\d.]+)g/)?.[1] || '0'),
        portion: food.food_description.split(' - ')[0] || '100g',
        source: 'fatsecret',
        icon: 'food'
      }));

    } catch (error) {
      console.error('FatSecret API error:', error);
      throw error;
    }
  }

  // Main search function that combines local and API results
  async searchFood(query) {
    if (!query || query.length < 2) {
      return [];
    }

    const cacheKey = this.getCacheKey(query);
    
    // Check cache first
    if (this.cacheEnabled && await this.isCacheValid(cacheKey)) {
      const cachedResults = await this.getFromCache(cacheKey);
      if (cachedResults) {
        return cachedResults;
      }
    }

    try {
      // Always search local Turkish database first
      const localResults = this.searchTurkishFoods(query);
      
      let allResults = [...localResults];

      // Try to get API results if configured and online
      if (this.isOnline && this.isConfigured()) {
        try {
          const apiResults = await this.searchFoodAPI(query);
          allResults = [...allResults, ...apiResults];
        } catch (apiError) {
          console.warn('API search failed, using local results only:', apiError.message);
        }
      }

      // Remove duplicates and limit results
      const uniqueResults = this.removeDuplicates(allResults);
      const finalResults = uniqueResults.slice(0, 15);

      // Cache the results
      if (this.cacheEnabled) {
        await this.saveToCache(cacheKey, finalResults);
      }

      return finalResults;

    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search only
      return this.searchTurkishFoods(query);
    }
  }

  // Remove duplicate foods based on name similarity
  removeDuplicates(foods) {
    const seen = new Set();
    return foods.filter(food => {
      const normalizedName = food.name.toLowerCase().replace(/\s+/g, '');
      if (seen.has(normalizedName)) {
        return false;
      }
      seen.add(normalizedName);
      return true;
    });
  }

  // Get detailed food information
  async getFoodDetails(foodId, source = 'local') {
    if (source === 'local') {
      return TURKISH_FOODS_DB[foodId] || null;
    }

    if (source === 'fatsecret' && this.isConfigured()) {
      try {
        const accessToken = await this.getAccessToken();
        if (!accessToken) {
          throw new Error('Could not obtain access token');
        }

        const params = new URLSearchParams({
          method: 'food.get',
          food_id: foodId,
          format: 'json'
        });

        const response = await fetch(`${FATSECRET_BASE_URL}?${params}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.food && data.food.servings && data.food.servings.serving) {
          const serving = Array.isArray(data.food.servings.serving) 
            ? data.food.servings.serving[0] 
            : data.food.servings.serving;

          return {
            id: foodId,
            name: data.food.food_name,
            calories: parseInt(serving.calories || '0'),
            protein: parseFloat(serving.protein || '0'),
            carbs: parseFloat(serving.carbohydrate || '0'),
            fat: parseFloat(serving.fat || '0'),
            fiber: parseFloat(serving.fiber || '0'),
            portion: serving.serving_description || '100g',
            source: 'fatsecret'
          };
        }
      } catch (error) {
        console.error('Food details error:', error);
      }
    }

    return null;
  }

  // Get popular Turkish foods for quick access
  getPopularTurkishFoods(limit = 10) {
    return POPULAR_TURKISH_FOODS
      .slice(0, limit)
      .map(key => ({
        ...TURKISH_FOODS_DB[key],
        id: key,
        source: 'local'
      }))
      .filter(Boolean);
  }

  // Nutrition analysis helpers
  analyzeMacroBalance(foods) {
    const totals = foods.reduce((acc, food) => {
      acc.calories += food.calories || 0;
      acc.protein += food.protein || 0;
      acc.carbs += food.carbs || 0;
      acc.fat += food.fat || 0;
      acc.fiber += food.fiber || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const proteinCals = totals.protein * 4;
    const carbCals = totals.carbs * 4;
    const fatCals = totals.fat * 9;

    return {
      totals,
      percentages: {
        protein: totals.calories > 0 ? (proteinCals / totals.calories) * 100 : 0,
        carbs: totals.calories > 0 ? (carbCals / totals.calories) * 100 : 0,
        fat: totals.calories > 0 ? (fatCals / totals.calories) * 100 : 0
      }
    };
  }

  // Clear all cached data
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX) || key === TOKEN_CACHE_KEY);
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Network status management
  setOnlineStatus(isOnline) {
    this.isOnline = isOnline;
  }

  // Cache management
  setCacheEnabled(enabled) {
    this.cacheEnabled = enabled;
  }

  // Get food categories for filtering
  getFoodCategories() {
    return [
      { id: 'all', name: 'Tümü', icon: 'food', count: Object.keys(TURKISH_FOODS_DB).length },
      { id: 'protein', name: 'Protein', icon: 'food-steak', count: Object.values(TURKISH_FOODS_DB).filter(f => f.category === 'protein').length },
      { id: 'grains', name: 'Tahıllar', icon: 'barley', count: Object.values(TURKISH_FOODS_DB).filter(f => f.category === 'grains').length },
      { id: 'vegetables', name: 'Sebzeler', icon: 'carrot', count: Object.values(TURKISH_FOODS_DB).filter(f => f.category === 'vegetables').length },
      { id: 'fruit', name: 'Meyveler', icon: 'apple', count: Object.values(TURKISH_FOODS_DB).filter(f => f.category === 'fruit').length },
      { id: 'dairy', name: 'Süt Ürünleri', icon: 'cup', count: Object.values(TURKISH_FOODS_DB).filter(f => f.category === 'dairy').length },
      { id: 'nuts', name: 'Kuruyemiş', icon: 'food-variant', count: Object.values(TURKISH_FOODS_DB).filter(f => f.category === 'nuts').length },
      { id: 'dessert', name: 'Tatlılar', icon: 'cake', count: Object.values(TURKISH_FOODS_DB).filter(f => f.category === 'dessert').length }
    ];
  }
}

// Export singleton instance
const nutritionAPI = new NutritionAPI();
export default nutritionAPI;
