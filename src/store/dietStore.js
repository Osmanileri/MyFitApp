import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqliteService from '../services/SQLiteService';
import { useDataOperations } from '../services/NotificationService';

const useDietStore = create(
  persist(
    (set, get) => ({
      // State
      dailyData: {},
      selectedDate: new Date().toISOString().split('T')[0],
      nutritionGoals: {
        targetCalories: 2000,
        targetProtein: 150,
        targetCarbs: 250,
        targetFat: 65,
        targetFiber: 25,
        targetSugar: 50,
        targetSodium: 2300,
        targetWater: 2.5,
      },
      isLoading: false,
      isSyncing: false,
      error: null,
      
      // Computed values
      getTodayData: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().dailyData[today] || {
          meals: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
          },
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalFiber: 0,
          totalSugar: 0,
          totalSodium: 0,
          waterIntake: 0,
        };
      },

      getSelectedDateData: () => {
        const selectedDate = get().selectedDate;
        return get().dailyData[selectedDate] || {
          meals: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
          },
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalFiber: 0,
          totalSugar: 0,
          totalSodium: 0,
          waterIntake: 0,
        };
      },

      getDailyGoals: () => {
        return get().nutritionGoals;
      },

      // Actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSyncing: (syncing) => set({ isSyncing: syncing }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Initialize store
      initializeStore: async () => {
        try {
          set({ isLoading: true });
          
          // Initialize SQLite database
          await sqliteService.initializeDatabase();
          
          // Load current user's data
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (user) {
            await get().loadNutritionGoals(user.uid);
            await get().loadDailyData(get().selectedDate);
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Error initializing diet store:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Calculate totals from meals
      calculateTotals: (meals) => {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalSugar = 0;
        let totalSodium = 0;

        Object.values(meals).forEach(meal => {
          if (Array.isArray(meal)) {
            meal.forEach(food => {
              totalCalories += food.calories || 0;
              totalProtein += food.protein || 0;
              totalCarbs += food.carbs || 0;
              totalFat += food.fat || 0;
              totalFiber += food.fiber || 0;
              totalSugar += food.sugar || 0;
              totalSodium += food.sodium || 0;
            });
          }
        });

        return {
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          totalFiber,
          totalSugar,
          totalSodium,
        };
      },

      // Load daily data from SQLite
      loadDailyData: async (date) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return;

          set({ isLoading: true });

          const meals = await sqliteService.getDietData(user.uid, date);
          const waterIntake = await sqliteService.getWaterIntake(user.uid, date);
          const totals = get().calculateTotals(meals);

          const dailyData = {
            meals,
            waterIntake,
            ...totals,
            date
          };

          set(state => ({
            dailyData: {
              ...state.dailyData,
              [date]: dailyData
            },
            isLoading: false
          }));

          return dailyData;
        } catch (error) {
          console.error('Error loading daily data:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Save daily data to SQLite
      saveDailyData: async (date, data) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // Update local state
          set(state => ({
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...data,
                date
              }
            }
          }));

          return { success: true };
        } catch (error) {
          console.error('Error saving daily data:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Food Functions
      addFoodToMeal: async (date, mealType, foodData) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // Save to SQLite
          await sqliteService.saveDietData(user.uid, date, mealType, foodData);

          // Reload data to update state
          await get().loadDailyData(date);

          return { success: true };
        } catch (error) {
          console.error('Error adding food to meal:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      removeFoodFromMeal: async (date, mealType, foodIndex) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          const currentData = get().dailyData[date];
          if (!currentData || !currentData.meals[mealType]) {
            return { success: false, error: 'Meal not found' };
          }

          const foodToRemove = currentData.meals[mealType][foodIndex];
          if (!foodToRemove) {
            return { success: false, error: 'Food not found' };
          }

          // Remove from SQLite (we need to find the correct ID)
          const meals = await sqliteService.getDietData(user.uid, date);
          const meal = meals[mealType];
          
          if (meal && meal[foodIndex] && meal[foodIndex].id) {
            await sqliteService.deleteDietEntry(meal[foodIndex].id);
          }

          // Reload data to update state
          await get().loadDailyData(date);

          return { success: true };
        } catch (error) {
          console.error('Error removing food from meal:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      editFoodInMeal: async (date, mealType, foodIndex, updatedFoodData) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          const currentData = get().dailyData[date];
          if (!currentData || !currentData.meals[mealType]) {
            return { success: false, error: 'Meal not found' };
          }

          const foodToEdit = currentData.meals[mealType][foodIndex];
          if (!foodToEdit) {
            return { success: false, error: 'Food not found' };
          }

          // Update in SQLite
          const meals = await sqliteService.getDietData(user.uid, date);
          const meal = meals[mealType];
          
          if (meal && meal[foodIndex] && meal[foodIndex].id) {
            await sqliteService.updateDietEntry(meal[foodIndex].id, updatedFoodData);
          }

          // Reload data to update state
          await get().loadDailyData(date);

          return { success: true };
        } catch (error) {
          console.error('Error editing food in meal:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      updateFoodInMeal: async (date, mealType, foodIndex, updatedFoodData) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // First remove the old food
          await get().removeFoodFromMeal(date, mealType, foodIndex);
          
          // Then add the updated food
          await get().addFoodToMeal(date, mealType, updatedFoodData);

          return { success: true };
        } catch (error) {
          console.error('Error updating food in meal:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Water Functions
      updateWaterIntake: async (date, waterAmount) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // Save to SQLite
          await sqliteService.saveWaterIntake(user.uid, date, waterAmount);

          // Update local state
          set(state => ({
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...state.dailyData[date],
                waterIntake: waterAmount
              }
            }
          }));

          return { success: true };
        } catch (error) {
          console.error('Error updating water intake:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      addWater: async (date, amount = 250) => {
        const currentData = get().dailyData[date] || get().getTodayData();
        const newAmount = (currentData.waterIntake || 0) + amount;
        return await get().updateWaterIntake(date, newAmount);
      },

      removeWater: async (date, amount = 250) => {
        const currentData = get().dailyData[date] || get().getTodayData();
        const newAmount = Math.max(0, (currentData.waterIntake || 0) - amount);
        return await get().updateWaterIntake(date, newAmount);
      },

      // Nutrition Goals Functions
      loadNutritionGoals: async (userId) => {
        try {
          const goals = await sqliteService.getNutritionGoals(userId);
          
          if (goals) {
            set({ nutritionGoals: goals });
          }
          
          return goals;
        } catch (error) {
          console.error('Error loading nutrition goals:', error);
          set({ error: error.message });
        }
      },

      updateNutritionGoals: async (goalsData) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // Save to SQLite
          await sqliteService.saveNutritionGoals(user.uid, goalsData);

          // Update local state
          set({ nutritionGoals: goalsData });

          return { success: true };
        } catch (error) {
          console.error('Error updating nutrition goals:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      generateSmartGoals: (userProfile) => {
        const { weight, height, age, gender, activityLevel, goal } = userProfile;
        
        if (!weight || !height || !age) {
          return null;
        }

        // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Activity level multipliers
        const activityMultipliers = {
          sedentary: 1.2,
          lightly_active: 1.375,
          moderately_active: 1.55,
          very_active: 1.725,
          extremely_active: 1.9
        };

        const activityMultiplier = activityMultipliers[activityLevel] || 1.2;
        let tdee = bmr * activityMultiplier;

        // Adjust for goals
        if (goal === 'lose_weight') {
          tdee -= 500; // 500 calorie deficit
        } else if (goal === 'gain_weight') {
          tdee += 500; // 500 calorie surplus
        }

        // Macro distribution (40% carbs, 30% protein, 30% fat)
        const targetProtein = (tdee * 0.30) / 4; // 4 calories per gram
        const targetCarbs = (tdee * 0.40) / 4; // 4 calories per gram
        const targetFat = (tdee * 0.30) / 9; // 9 calories per gram

        return {
          targetCalories: Math.round(tdee),
          targetProtein: Math.round(targetProtein),
          targetCarbs: Math.round(targetCarbs),
          targetFat: Math.round(targetFat),
          targetFiber: 25,
          targetSugar: Math.round(tdee * 0.10 / 4), // 10% of calories
          targetSodium: 2300,
          targetWater: weight * 0.035 // 35ml per kg body weight
        };
      },

      // Sync functions (for future cloud sync if needed)
      syncDailyData: async (date) => {
        // Currently just loads from SQLite
        return await get().loadDailyData(date);
      },

      // Analytics and statistics
      getWeeklyStats: async () => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return null;

          const stats = {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            totalWater: 0,
            days: 0
          };

          // Get last 7 days
          for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const meals = await sqliteService.getDietData(user.uid, dateStr);
            const waterIntake = await sqliteService.getWaterIntake(user.uid, dateStr);
            const totals = get().calculateTotals(meals);
            
            if (totals.totalCalories > 0) {
              stats.totalCalories += totals.totalCalories;
              stats.totalProtein += totals.totalProtein;
              stats.totalCarbs += totals.totalCarbs;
              stats.totalFat += totals.totalFat;
              stats.totalWater += waterIntake;
              stats.days++;
            }
          }

          // Calculate averages
          if (stats.days > 0) {
            stats.avgCalories = stats.totalCalories / stats.days;
            stats.avgProtein = stats.totalProtein / stats.days;
            stats.avgCarbs = stats.totalCarbs / stats.days;
            stats.avgFat = stats.totalFat / stats.days;
            stats.avgWater = stats.totalWater / stats.days;
          }

          return stats;
        } catch (error) {
          console.error('Error getting weekly stats:', error);
          return null;
        }
      },

      // Clear all data
      clearAllData: async () => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          await sqliteService.clearUserData(user.uid);
          
          set({ 
            dailyData: {},
            nutritionGoals: {
              targetCalories: 2000,
              targetProtein: 150,
              targetCarbs: 250,
              targetFat: 65,
              targetFiber: 25,
              targetSugar: 50,
              targetSodium: 2300,
              targetWater: 2.5,
            }
          });

          return { success: true };
        } catch (error) {
          console.error('Error clearing all data:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'diet-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        nutritionGoals: state.nutritionGoals,
        dailyData: state.dailyData
      })
    }
  )
);

// Create wrapper functions with notifications
export const useDietStoreWithNotifications = () => {
  const store = useDietStore();
  
  // Import the hook inside the component
  const { notifyCreate, notifyUpdate, notifyDelete } = useDataOperations();

  return {
    ...store,
    
    // Wrap food operations with notifications
    addFoodToMeal: notifyCreate('diet')(store.addFoodToMeal),
    removeFoodFromMeal: notifyDelete('diet')(store.removeFoodFromMeal),
    editFoodInMeal: notifyUpdate('diet')(store.editFoodInMeal),
    updateFoodInMeal: notifyUpdate('diet')(store.updateFoodInMeal),
    
    // Wrap water operations with notifications
    updateWaterIntake: notifyUpdate('water')(store.updateWaterIntake),
    addWater: notifyCreate('water')(store.addWater),
    removeWater: notifyUpdate('water')(store.removeWater),
    
    // Wrap nutrition goals with notifications
    updateNutritionGoals: notifyUpdate('diet')(store.updateNutritionGoals),
    
    // Wrap clear data with notifications
    clearAllData: notifyDelete('diet')(store.clearAllData),
  };
};

export default useDietStore; 