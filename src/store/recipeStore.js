import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqliteService from '../services/SQLiteService';
import { useDataOperations } from '../services/NotificationService';

export const useRecipeStore = create(
  persist(
    (set, get) => ({
      recipes: [],
      favorites: [],
      isLoading: false,
      error: null,
      
      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Initialize store
      initializeStore: async () => {
        try {
          set({ isLoading: true });
          
          // Initialize SQLite database
          await sqliteService.initializeDatabase();
          
          // Load user's recipes
          await get().loadRecipes();
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Error initializing recipe store:', error);
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Add a new recipe
      addRecipe: async (recipe) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          set({ isLoading: true });
          
          const newRecipe = {
            recipeId: `recipe_${Date.now()}`,
            name: recipe.name,
            description: recipe.description || '',
            ingredients: recipe.ingredients || '',
            instructions: recipe.instructions || '',
            servings: recipe.servings || 1,
            cookingTime: recipe.cookingTime || 0,
            calories: recipe.calories || 0,
            protein: recipe.protein || 0,
            carbs: recipe.carbs || 0,
            fat: recipe.fat || 0,
            category: recipe.category || 'general',
            tags: recipe.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          await sqliteService.saveRecipe(user.uid, newRecipe);
          
          set(state => ({
            recipes: [...state.recipes, newRecipe],
            isLoading: false
          }));
          
          return { success: true };
        } catch (error) {
          console.error('Error adding recipe:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Update an existing recipe
      updateRecipe: async (recipeId, updatedRecipe) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          set({ isLoading: true });
          
          const recipeData = {
            ...updatedRecipe,
            updatedAt: new Date().toISOString(),
          };
          
          // For now, we'll delete and recreate since our SQLite service doesn't have update recipe
          await sqliteService.deleteRecipe(recipeId);
          await sqliteService.saveRecipe(user.uid, {
            ...recipeData,
            recipeId: recipeId
          });
          
          set(state => ({
            recipes: state.recipes.map(recipe => 
              recipe.recipeId === recipeId ? { ...recipe, ...recipeData } : recipe
            ),
            isLoading: false
          }));
          
          return { success: true };
        } catch (error) {
          console.error('Error updating recipe:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Delete a recipe
      deleteRecipe: async (recipeId) => {
        try {
          await sqliteService.deleteRecipe(recipeId);
          
          set(state => ({
            recipes: state.recipes.filter(recipe => recipe.recipeId !== recipeId),
            favorites: state.favorites.filter(id => id !== recipeId),
          }));
          
          return { success: true };
        } catch (error) {
          console.error('Error deleting recipe:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },
      
      // Load recipes from SQLite
      loadRecipes: async () => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          set({ isLoading: true });
          
          const recipes = await sqliteService.getRecipes(user.uid);
          
          set({
            recipes,
            isLoading: false
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error loading recipes:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Search recipes
      searchRecipes: (query) => {
        const { recipes } = get();
        return recipes.filter((recipe) =>
          recipe.name.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase()) ||
          recipe.ingredients.toLowerCase().includes(query.toLowerCase()) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      },

      // Get recipes by category
      getRecipesByCategory: (category) => {
        const { recipes } = get();
        return recipes.filter((recipe) => recipe.category === category);
      },

      // Get recipe by ID
      getRecipeById: (id) => {
        const { recipes } = get();
        return recipes.find((recipe) => recipe.recipeId === id);
      },

      // Favorite management
      toggleFavorite: (recipeId) => {
        set(state => {
          const favorites = state.favorites.includes(recipeId)
            ? state.favorites.filter(id => id !== recipeId)
            : [...state.favorites, recipeId];
          
          return { favorites };
        });
      },

      getFavoriteRecipes: () => {
        const { recipes, favorites } = get();
        return recipes.filter(recipe => favorites.includes(recipe.recipeId));
      },

      // Get recipe categories
      getCategories: () => {
        const { recipes } = get();
        const categories = [...new Set(recipes.map(recipe => recipe.category))];
        return categories.filter(category => category); // Remove empty categories
      },

      // Get all tags
      getAllTags: () => {
        const { recipes } = get();
        const allTags = recipes.flatMap(recipe => recipe.tags || []);
        return [...new Set(allTags)];
      },

      // Get recipes by tag
      getRecipesByTag: (tag) => {
        const { recipes } = get();
        return recipes.filter(recipe => recipe.tags && recipe.tags.includes(tag));
      },

      // Get recipe statistics
      getRecipeStats: () => {
        const { recipes, favorites } = get();
        
        return {
          total: recipes.length,
          favorites: favorites.length,
          categories: get().getCategories().length,
          tags: get().getAllTags().length,
          averageCalories: recipes.length > 0 ? 
            recipes.reduce((sum, recipe) => sum + (recipe.calories || 0), 0) / recipes.length : 0,
          averageCookingTime: recipes.length > 0 ? 
            recipes.reduce((sum, recipe) => sum + (recipe.cookingTime || 0), 0) / recipes.length : 0,
        };
      },

      // Clear all recipes
      clearAllRecipes: async () => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // Clear from SQLite
          await sqliteService.clearUserData(user.uid);
          
          // Clear local state
          set({
            recipes: [],
            favorites: []
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error clearing recipes:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Initialize with sample recipes
      initializeSampleRecipes: async () => {
        const sampleRecipes = [
          {
            name: 'Protein Smoothie',
            description: 'Besleyici protein smoothie',
            ingredients: '1 muz, 1 bardak süt, 1 ölçek whey protein, 1 yemek kaşığı fıstık ezmesi',
            instructions: 'Tüm malzemeleri blender\'da karıştırın',
            servings: 1,
            cookingTime: 5,
            calories: 350,
            protein: 30,
            carbs: 25,
            fat: 15,
            category: 'smoothie',
            tags: ['protein', 'kahvaltı', 'hızlı']
          },
          {
            name: 'Tavuklu Salata',
            description: 'Protein açısından zengin tavuklu salata',
            ingredients: '200g tavuk göğsü, karışık yeşillikler, domates, salatalık, zeytinyağı',
            instructions: 'Tavuğu pişirin, doğrayın ve salata ile karıştırın',
            servings: 1,
            cookingTime: 20,
            calories: 280,
            protein: 35,
            carbs: 10,
            fat: 12,
            category: 'salad',
            tags: ['protein', 'öğle yemeği', 'düşük karbonhidrat']
          },
          {
            name: 'Yulaf Lapası',
            description: 'Besleyici kahvaltı yulaf lapası',
            ingredients: '1/2 bardak yulaf, 1 bardak süt, 1 yemek kaşığı bal, meyveler',
            instructions: 'Yulafı süt ile pişirin, bal ve meyveler ekleyin',
            servings: 1,
            cookingTime: 10,
            calories: 320,
            protein: 12,
            carbs: 45,
            fat: 8,
            category: 'breakfast',
            tags: ['kahvaltı', 'yulaf', 'meyve']
          }
        ];

        try {
          const { recipes } = get();
          
          // Only add samples if no recipes exist
          if (recipes.length === 0) {
            for (const recipe of sampleRecipes) {
              await get().addRecipe(recipe);
            }
          }
          
          return { success: true };
        } catch (error) {
          console.error('Error initializing sample recipes:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'recipe-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        // Don't persist recipes, load from SQLite
      }),
    }
  )
);

// Create wrapper functions with notifications
export const useRecipeStoreWithNotifications = () => {
  const store = useRecipeStore();
  
  // Import the hook inside the component
  const { notifyCreate, notifyUpdate, notifyDelete } = useDataOperations();

  return {
    ...store,
    
    // Wrap recipe operations with notifications
    addRecipe: notifyCreate('recipe')(store.addRecipe),
    updateRecipe: notifyUpdate('recipe')(store.updateRecipe),
    deleteRecipe: notifyDelete('recipe')(store.deleteRecipe),
    
    // Wrap clear data with notifications
    clearAllRecipes: notifyDelete('recipe')(store.clearAllRecipes),
  };
};

export default useRecipeStore;
