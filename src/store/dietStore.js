import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import nutritionAPI from '../services/nutritionAPI';
import { 
  TURKISH_FOOD_DATABASE, 
  searchFoodsInDatabase, 
  calculateNutrition,
  POPULAR_FOODS 
} from '../data/turkishFoodDatabase';
import { fatSecretAPI } from '../services/fatSecretAPI';

const popularFoods = [
  { name: 'Yulaf Ezmesi', calories: 120, protein: 4, carb: 20, fat: 2, icon: 'grain' },
  { name: 'Haşlanmış Yumurta', calories: 70, protein: 6, carb: 1, fat: 5, icon: 'egg' },
  { name: 'Tavuk Göğsü', calories: 110, protein: 23, carb: 0, fat: 1, icon: 'food-drumstick' },
  { name: 'Pirinç Pilavı', calories: 180, protein: 3, carb: 38, fat: 1, icon: 'rice' },
];

const mockFoodsDatabase = [
  { name: 'Elma', calories: 52, protein: 0.3, carb: 14, fat: 0.2, icon: 'food-apple' },
  { name: 'Muz', calories: 89, protein: 1.1, carb: 23, fat: 0.3, icon: 'food-apple' },
  { name: 'Yoğurt', calories: 61, protein: 3.5, carb: 4.7, fat: 3.3, icon: 'food' },
  { name: 'Ekmek', calories: 265, protein: 9, carb: 49, fat: 3.2, icon: 'food-variant' },
  { name: 'Peynir', calories: 113, protein: 7, carb: 1, fat: 9, icon: 'cheese' },
  { name: 'Domates', calories: 18, protein: 0.9, carb: 3.9, fat: 0.2, icon: 'food-apple' },
  { name: 'Salatalık', calories: 16, protein: 0.7, carb: 4, fat: 0.1, icon: 'food-apple' },
  ...popularFoods
];

export const useDietStore = create((set, get) => ({
  // State
  dailyMeals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  },
  waterIntake: 0, // litre
  supplements: [],
  selectedDate: new Date().toISOString().split('T')[0],
  isLoading: false,
  error: null,

  // Nutrition Goals
  nutritionGoals: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    water: 2.5 // litre
  },
  dailyProgress: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  },

  // Food search state
  searchResults: [],
  searchQuery: '',
  isSearching: false,
  searchError: null,
  popularFoods: popularFoods,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Tarih değiştirme
  setSelectedDate: (date) => set({ selectedDate: date }),

  // Öğün ekleme
  addMeal: async (mealType, foodItem) => {
    try {
      console.log('addMeal called with:', mealType, foodItem);
      const { dailyMeals } = get();
      const updatedMeals = {
        ...dailyMeals,
        [mealType]: [...dailyMeals[mealType], foodItem]
      };
      
      console.log('Updated meals:', updatedMeals);
      set({ dailyMeals: updatedMeals });
      await get().saveDailyMeals(updatedMeals);
      get().updateDailyProgress(); // Auto-calculate progress
      console.log('Food added successfully to store');
    } catch (error) {
      console.error('addMeal error:', error);
      set({ error: 'Öğün ekleme hatası: ' + error.message });
    }
  },

  // Öğün silme
  removeMeal: async (mealType, foodIndex) => {
    try {
      const { dailyMeals } = get();
      const updatedMeals = {
        ...dailyMeals,
        [mealType]: dailyMeals[mealType].filter((_, index) => index !== foodIndex)
      };
      
      set({ dailyMeals: updatedMeals });
      await get().saveDailyMeals(updatedMeals);
      get().updateDailyProgress(); // Auto-calculate progress
    } catch (error) {
      set({ error: 'Öğün silme hatası: ' + error.message });
    }
  },
  
  // Alias for DietScreen compatibility
  deleteMeal: async (mealType, foodIndex) => {
    await get().removeMeal(mealType, foodIndex);
  },

  // Su ekleme
  addWater: async (amount) => {
    try {
      const { waterIntake } = get();
      const newAmount = waterIntake + amount;
      set({ waterIntake: newAmount });
      await get().saveWaterIntake(newAmount);
    } catch (error) {
      set({ error: 'Su ekleme hatası: ' + error.message });
    }
  },

  // Supplement ekleme
  addSupplement: async (supplement) => {
    try {
      const { supplements } = get();
      const updatedSupplements = [...supplements, supplement];
      set({ supplements: updatedSupplements });
      await get().saveSupplements(updatedSupplements);
    } catch (error) {
      set({ error: 'Supplement ekleme hatası: ' + error.message });
    }
  },

  // Günlük kalori hesaplama
  getDailyCalories: () => {
    const { dailyMeals } = get();
    let totalCalories = 0;
    
    Object.values(dailyMeals).forEach(meal => {
      meal.forEach(food => {
        totalCalories += food.calories || 0;
      });
    });
    
    return totalCalories;
  },

  // Günlük makro hesaplama
  getDailyMacros: () => {
    const { dailyMeals } = get();
    let protein = 0, carbs = 0, fat = 0;
    
    Object.values(dailyMeals).forEach(meal => {
      meal.forEach(food => {
        protein += food.protein || 0;
        carbs += food.carbs || 0;
        fat += food.fat || 0;
      });
    });
    
    return { protein, carbs, fat };
  },

  // AsyncStorage işlemleri
  saveDailyMeals: async (meals) => {
    try {
      const key = `meals_${get().selectedDate}`;
      await AsyncStorage.setItem(key, JSON.stringify(meals));
    } catch (error) {
      console.error('Öğün kaydetme hatası:', error);
    }
  },

  saveWaterIntake: async (amount) => {
    try {
      const key = `water_${get().selectedDate}`;
      await AsyncStorage.setItem(key, amount.toString());
    } catch (error) {
      console.error('Su kaydetme hatası:', error);
    }
  },

  saveSupplements: async (supplements) => {
    try {
      const key = `supplements_${get().selectedDate}`;
      await AsyncStorage.setItem(key, JSON.stringify(supplements));
    } catch (error) {
      console.error('Supplement kaydetme hatası:', error);
    }
  },

  loadDailyData: async (date) => {
    try {
      const [mealsStr, waterStr, supplementsStr] = await AsyncStorage.multiGet([
        `meals_${date}`,
        `water_${date}`,
        `supplements_${date}`
      ]);

      const meals = mealsStr[1] ? JSON.parse(mealsStr[1]) : get().dailyMeals;
      const water = waterStr[1] ? parseFloat(waterStr[1]) : 0;
      const supplements = supplementsStr[1] ? JSON.parse(supplementsStr[1]) : [];

      set({ dailyMeals: meals, waterIntake: water, supplements });
    } catch (error) {
      console.error('Günlük veri yükleme hatası:', error);
    }
  },

  // Günlük verileri sıfırlama
  resetDailyData: () => {
    set({
      dailyMeals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      waterIntake: 0,
      supplements: []
    });
  },

  // Enhanced food search with Turkish database + FatSecret API
  searchFoods: async (query, category = 'all') => {
    set({ isSearching: true, searchError: null });
    
    try {
      let results = [];
      
      // Search Turkish food database first
      const turkishResults = searchFoodsInDatabase(query, category);
      results = [...turkishResults];
      
      // If we have fewer than 10 results, search FatSecret API for additional foods
      if (results.length < 10 && query.length > 2) {
        try {
          const fatSecretResponse = await fatSecretAPI.searchFoods(query);
          if (fatSecretResponse.success && fatSecretResponse.data.length > 0) {
            const formattedFatSecretFoods = fatSecretResponse.data.map(food => 
              fatSecretAPI.formatFoodItem(food)
            );
            
            // Add FatSecret results, avoiding duplicates
            const existingNames = results.map(r => r.name.toLowerCase());
            const newFoods = formattedFatSecretFoods.filter(food => 
              !existingNames.includes(food.name.toLowerCase())
            );
            
            results = [...results, ...newFoods];
          }
        } catch (fatSecretError) {
          console.warn('FatSecret search failed:', fatSecretError);
          // Continue with Turkish results only
        }
      }
      
      set({ 
        searchResults: results.slice(0, 20), // Limit to 20 results
        isSearching: false 
      });
    } catch (error) {
      console.error('Search error:', error);
      set({ searchError: error.message, isSearching: false });
    }
  },

  clearSearchResults: () => {
    set({ 
      searchResults: [], 
      searchQuery: '', 
      searchError: null 
    });
  },

  loadPopularFoods: async () => {
    try {
      // Get popular foods from Turkish database
      const popularFoodItems = POPULAR_FOODS.map(id => 
        TURKISH_FOOD_DATABASE.find(food => food.id === id)
      ).filter(Boolean);
      
      // Also get some popular international foods from FatSecret
      const internationalFoods = fatSecretAPI.getPopularFoods();
      
      const allPopularFoods = [
        ...popularFoodItems,
        ...internationalFoods.map(food => fatSecretAPI.formatFoodItem(food))
      ];
      
      set({ popularFoods: allPopularFoods });
    } catch (error) {
      console.error('Popular foods loading error:', error);
      // Fallback to Turkish foods only
      const popularFoodItems = POPULAR_FOODS.map(id => 
        TURKISH_FOOD_DATABASE.find(food => food.id === id)
      ).filter(Boolean);
      set({ popularFoods: popularFoodItems });
    }
  },

  addSearchedFoodToMeal: async (mealType, searchedFood, quantity = 100) => {
    try {
      // Convert API food format to our internal format
      const foodItem = {
        id: Date.now().toString(),
        name: searchedFood.name,
        quantity: quantity,
        unit: 'g',
        calories: Math.round((searchedFood.nutrition.calories * quantity) / 100),
        protein: Math.round((searchedFood.nutrition.protein * quantity) / 100),
        carbs: Math.round((searchedFood.nutrition.carbs * quantity) / 100),
        fat: Math.round((searchedFood.nutrition.fat * quantity) / 100),
        source: searchedFood.source || 'api'
      };

      await get().addMeal(mealType, foodItem);
    } catch (error) {
      set({ error: 'Besin ekleme hatası: ' + error.message });
    }
  },

  // Nutrition Goals Actions
  updateNutritionGoals: async (newGoals) => {
    try {
      const updatedGoals = { ...get().nutritionGoals, ...newGoals };
      set({ nutritionGoals: updatedGoals });
      await AsyncStorage.setItem('nutritionGoals', JSON.stringify(updatedGoals));
    } catch (error) {
      set({ error: 'Hedef güncelleme hatası: ' + error.message });
    }
  },

  loadNutritionGoals: async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('nutritionGoals');
      if (storedGoals) {
        set({ nutritionGoals: JSON.parse(storedGoals) });
      }
    } catch (error) {
      console.error('Hedef yükleme hatası:', error);
    }
  },

  calculateDailyProgress: () => {
    const { dailyMeals, waterIntake } = get();
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    
    Object.values(dailyMeals).forEach(meal => {
      meal.forEach(food => {
        calories += food.calories || 0;
        protein += food.protein || 0;
        carbs += food.carbs || 0;
        fat += food.fat || 0;
      });
    });
    
    const progress = {
      calories,
      protein,
      carbs,
      fat,
      water: waterIntake
    };
    
    // Only update state when explicitly called, not during render
    return progress;
  },

  // Separate function to update daily progress state
  updateDailyProgress: () => {
    const progress = get().calculateDailyProgress();
    set({ dailyProgress: progress });
    return progress;
  },

  // Additional getter functions for DietScreen compatibility
  getMeals: () => {
    return get().dailyMeals;
  },

  getTotalCalories: () => {
    return get().getDailyCalories();
  },

  getTotalMacros: () => {
    return get().getDailyMacros();
  },

  getWaterIntake: () => {
    return get().waterIntake;
  },

  getProgressPercentage: (nutrient) => {
    const { nutritionGoals, dailyProgress } = get();
    if (!nutritionGoals[nutrient] || nutritionGoals[nutrient] === 0) return 0;
    return Math.min((dailyProgress[nutrient] / nutritionGoals[nutrient]) * 100, 100);
  },

  getRemainingNutrients: () => {
    const { nutritionGoals, dailyProgress } = get();
    return {
      calories: Math.max(0, nutritionGoals.calories - dailyProgress.calories),
      protein: Math.max(0, nutritionGoals.protein - dailyProgress.protein),
      carbs: Math.max(0, nutritionGoals.carbs - dailyProgress.carbs),
      fat: Math.max(0, nutritionGoals.fat - dailyProgress.fat),
      water: Math.max(0, nutritionGoals.water - dailyProgress.water)
    };
  },

  // Generate smart nutrition goals based on user profile
  generateSmartGoals: (userProfile) => {
    const { age, gender, weight, height, activityLevel, goal } = userProfile;
    
    // BMR calculation (Mifflin-St Jeor Equation)
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };
    
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
    
    // Goal adjustment
    let targetCalories;
    if (goal === 'lose_weight') {
      targetCalories = tdee - 500; // 500 calorie deficit
    } else if (goal === 'gain_weight') {
      targetCalories = tdee + 500; // 500 calorie surplus
    } else {
      targetCalories = tdee; // maintenance
    }
    
    // Macro distribution (moderate approach)
    const protein = Math.round(weight * 2.2); // 2.2g per kg
    const fat = Math.round(targetCalories * 0.25 / 9); // 25% of calories from fat
    const carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);
    
    return {
      calories: Math.round(targetCalories),
      protein,
      carbs,
      fat,
      water: Math.round(weight * 0.033) // 33ml per kg
    };
  },

  addFood: async (food, amount, mealType) => {
    const currentMeals = get().dailyMeals;
    const scaleFactor = amount / 100; // Amount is in grams, nutrition is per 100g
    
    const scaledFood = {
      ...food,
      calories: Math.round(food.calories * scaleFactor),
      protein: Math.round(food.protein * scaleFactor * 10) / 10,
      carb: Math.round(food.carb * scaleFactor * 10) / 10,
      fat: Math.round(food.fat * scaleFactor * 10) / 10,
      amount: amount,
      id: Date.now().toString()
    };

    set({
      dailyMeals: {
        ...currentMeals,
        [mealType]: [...currentMeals[mealType], scaledFood]
      }
    });
  },

  getDailyProgress: () => {
    const meals = get().dailyMeals;
    const allFoods = [
      ...meals.breakfast,
      ...meals.lunch,
      ...meals.dinner,
      ...meals.snacks
    ];

    return allFoods.reduce((total, food) => ({
      calories: total.calories + food.calories,
      protein: total.protein + food.protein,
      carb: total.carb + food.carb,
      fat: total.fat + food.fat
    }), { calories: 0, protein: 0, carb: 0, fat: 0 });
  },

  clearSearch: () => {
    set({ searchResults: [], searchError: null });
  },

  // Additional functions for DietScreen compatibility (removed duplicates)
  // getTotalCalories and getTotalMacros are already defined above

  // Simplified addFood for DietScreen
  addFood: async (mealType, foodData) => {
    try {
      console.log('Store addFood called:', mealType, foodData);
      
      // Convert foodData to the expected format
      const formattedFood = {
        name: foodData.name,
        calories: foodData.calories || 0,
        protein: foodData.protein || 0,
        carbs: foodData.carbs || 0, // Note: store uses 'carb' but data has 'carbs'
        carb: foodData.carbs || 0,
        fat: foodData.fat || 0,
        amount: foodData.amount || '1 tane',
        timestamp: foodData.timestamp || new Date().toISOString(),
        id: Date.now().toString()
      };
      
      console.log('Formatted food:', formattedFood);
      await get().addMeal(mealType, formattedFood);
      
      // Force re-calculation of totals
      get().updateDailyProgress();
      
    } catch (error) {
      console.error('addFood error:', error);
      set({ error: 'Besin ekleme hatası: ' + error.message });
    }
  },

  // Add meals property for compatibility  
  getMeals: () => {
    return get().dailyMeals;
  },

  // Load daily meals - wrapper for loadDailyData
  loadDailyMeals: async () => {
    const currentDate = get().selectedDate;
    await get().loadDailyData(currentDate);
  }
})); 