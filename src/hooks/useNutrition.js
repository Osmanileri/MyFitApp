import { useState, useEffect, useCallback } from 'react';
import DataService from '../services/DataService';
import useAuthStore from '../store/authStore';

export const useNutrition = (date = new Date()) => {
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const loadNutritionData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const dateStr = DataService.formatDate(date);
      const data = await DataService.getDailyNutrition(user.uid, dateStr);
      
      if (!data) {
        // Yeni gün için boş veri oluştur
        const emptyData = {
          userId: user.uid,
          date: dateStr,
          meals: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
          },
          totals: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0
          },
          water: 0,
          targetCalories: 2000,
          notes: ''
        };
        setNutritionData(emptyData);
      } else {
        setNutritionData(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => {
    loadNutritionData();
  }, [loadNutritionData]);

  const addFood = async (mealType, food) => {
    if (!user) return;

    try {
      setError(null);
      
      // Formatlanmış food objesi
      const formattedFood = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: food.name,
        brand: food.brand || '',
        serving: {
          description: food.serving?.description || `${food.amount || 100}g`,
          calories: food.serving?.calories || food.calories || 0,
          protein: food.serving?.protein || food.protein || 0,
          carbs: food.serving?.carbs || food.carbs || 0,
          fat: food.serving?.fat || food.fat || 0,
          fiber: food.serving?.fiber || food.fiber || 0,
          sugar: food.serving?.sugar || food.sugar || 0,
          sodium: food.serving?.sodium || food.sodium || 0,
        },
        addedAt: new Date().toISOString(),
        barcode: food.barcode || null,
        source: food.source || 'manual'
      };

      await DataService.addFoodToMeal(user.uid, date, mealType, formattedFood);
      await loadNutritionData();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const removeFood = async (mealType, foodId) => {
    if (!user || !nutritionData) return;

    try {
      setError(null);
      
      const updatedMeal = nutritionData.meals[mealType].filter(f => f.id !== foodId);
      await DataService.saveMeal(user.uid, date, mealType, updatedMeal);
      await loadNutritionData();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateFood = async (mealType, foodId, updatedFood) => {
    if (!user || !nutritionData) return;

    try {
      setError(null);
      
      const updatedMeal = nutritionData.meals[mealType].map(f => 
        f.id === foodId ? { ...f, ...updatedFood, updatedAt: new Date().toISOString() } : f
      );
      
      await DataService.saveMeal(user.uid, date, mealType, updatedMeal);
      await loadNutritionData();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateWater = async (amount) => {
    if (!user || !nutritionData) return;

    try {
      setError(null);
      
      await DataService.updateWaterIntake(user.uid, date, amount);
      await loadNutritionData();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const addWater = async (amount = 250) => {
    if (!user || !nutritionData) return;

    const newAmount = nutritionData.water + amount;
    return await updateWater(newAmount);
  };

  const removeWater = async (amount = 250) => {
    if (!user || !nutritionData) return;

    const newAmount = Math.max(0, nutritionData.water - amount);
    return await updateWater(newAmount);
  };

  const updateNotes = async (notes) => {
    if (!user || !nutritionData) return;

    try {
      setError(null);
      
      await DataService.saveDailyNutrition(user.uid, date, {
        ...nutritionData,
        notes
      });
      await loadNutritionData();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateTargetCalories = async (targetCalories) => {
    if (!user || !nutritionData) return;

    try {
      setError(null);
      
      await DataService.saveDailyNutrition(user.uid, date, {
        ...nutritionData,
        targetCalories
      });
      await loadNutritionData();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Meal'deki tüm besinleri temizle
  const clearMeal = async (mealType) => {
    if (!user || !nutritionData) return;

    try {
      setError(null);
      
      await DataService.saveMeal(user.uid, date, mealType, []);
      await loadNutritionData();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Meal'i kopyala (başka güne)
  const copyMeal = async (mealType, targetDate) => {
    if (!user || !nutritionData) return;

    try {
      setError(null);
      
      const mealData = nutritionData.meals[mealType];
      if (!mealData || mealData.length === 0) {
        throw new Error('Kopyalanacak öğün boş');
      }

      await DataService.saveMeal(user.uid, targetDate, mealType, mealData);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Günün tamamını kopyala
  const copyDay = async (targetDate) => {
    if (!user || !nutritionData) return;

    try {
      setError(null);
      
      const targetDateStr = DataService.formatDate(targetDate);
      
      await DataService.saveDailyNutrition(user.uid, targetDate, {
        ...nutritionData,
        date: targetDateStr,
        timestamp: new Date().toISOString()
      });
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Hızlı istatistikler
  const getQuickStats = () => {
    if (!nutritionData) return null;

    const { totals, targetCalories, water } = nutritionData;
    
    return {
      calories: {
        consumed: totals.calories,
        target: targetCalories,
        remaining: targetCalories - totals.calories,
        percentage: Math.min((totals.calories / targetCalories) * 100, 100)
      },
      macros: {
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        fiber: totals.fiber
      },
      water: {
        consumed: water,
        target: 2500, // ml
        percentage: Math.min((water / 2500) * 100, 100)
      },
      micronutrients: {
        sugar: totals.sugar,
        sodium: totals.sodium
      }
    };
  };

  // Meal istatistikleri
  const getMealStats = (mealType) => {
    if (!nutritionData || !nutritionData.meals[mealType]) return null;

    const meal = nutritionData.meals[mealType];
    const stats = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      count: meal.length
    };

    meal.forEach(food => {
      const serving = food.serving || food;
      stats.calories += serving.calories || 0;
      stats.protein += serving.protein || 0;
      stats.carbs += serving.carbs || 0;
      stats.fat += serving.fat || 0;
      stats.fiber += serving.fiber || 0;
    });

    return stats;
  };

  return {
    loading,
    error,
    nutritionData,
    
    // Actions
    addFood,
    removeFood,
    updateFood,
    updateWater,
    addWater,
    removeWater,
    updateNotes,
    updateTargetCalories,
    clearMeal,
    copyMeal,
    copyDay,
    
    // Utilities
    refresh: loadNutritionData,
    clearError: () => setError(null),
    getQuickStats,
    getMealStats,
    
    // Sync status
    syncStatus: DataService.getSyncStatus()
  };
};

export default useNutrition; 