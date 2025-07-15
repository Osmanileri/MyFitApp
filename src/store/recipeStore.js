import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useRecipeStore = create(
  persist(
    (set, get) => ({
      recipes: [],
      favorites: [],
      
      // Add a new recipe
      addRecipe: (recipe) => {
        const newRecipe = {
          id: Date.now().toString(),
          ...recipe,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          recipes: [...state.recipes, newRecipe],
        }));
      },

      // Update an existing recipe
      updateRecipe: (recipeId, updatedRecipe) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, ...updatedRecipe, updatedAt: new Date().toISOString() }
              : recipe
          ),
        }));
      },

      // Delete a recipe
      deleteRecipe: (recipeId) => {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== recipeId),
          favorites: state.favorites.filter((id) => id !== recipeId),
        }));
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
      getRecipeById: (recipeId) => {
        const { recipes } = get();
        return recipes.find((recipe) => recipe.id === recipeId);
      },

      // Toggle favorite recipe
      toggleFavorite: (recipeId) => {
        set((state) => ({
          favorites: state.favorites.includes(recipeId)
            ? state.favorites.filter((id) => id !== recipeId)
            : [...state.favorites, recipeId],
        }));
      },

      // Get favorite recipes
      getFavoriteRecipes: () => {
        const { recipes, favorites } = get();
        return recipes.filter((recipe) => favorites.includes(recipe.id));
      },

      // Get recently added recipes
      getRecentRecipes: (limit = 5) => {
        const { recipes } = get();
        return recipes
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit);
      },

      // Get recipes by difficulty
      getRecipesByDifficulty: (difficulty) => {
        const { recipes } = get();
        return recipes.filter((recipe) => recipe.difficulty === difficulty);
      },

      // Get recipes by cooking time range
      getRecipesByTime: (minTime, maxTime) => {
        const { recipes } = get();
        return recipes.filter((recipe) => 
          recipe.cookingTime >= minTime && recipe.cookingTime <= maxTime
        );
      },

      // Get recipes by calorie range
      getRecipesByCalories: (minCalories, maxCalories) => {
        const { recipes } = get();
        return recipes.filter((recipe) => 
          recipe.calories >= minCalories && recipe.calories <= maxCalories
        );
      },

      // Get recipe statistics
      getRecipeStats: () => {
        const { recipes } = get();
        const totalRecipes = recipes.length;
        const avgCalories = recipes.reduce((sum, recipe) => sum + recipe.calories, 0) / totalRecipes || 0;
        const avgCookingTime = recipes.reduce((sum, recipe) => sum + recipe.cookingTime, 0) / totalRecipes || 0;
        
        const categoryStats = recipes.reduce((acc, recipe) => {
          acc[recipe.category] = (acc[recipe.category] || 0) + 1;
          return acc;
        }, {});

        const difficultyStats = recipes.reduce((acc, recipe) => {
          acc[recipe.difficulty] = (acc[recipe.difficulty] || 0) + 1;
          return acc;
        }, {});

        return {
          totalRecipes,
          avgCalories: Math.round(avgCalories),
          avgCookingTime: Math.round(avgCookingTime),
          categoryStats,
          difficultyStats,
        };
      },

      // Duplicate a recipe
      duplicateRecipe: (recipeId) => {
        const { recipes } = get();
        const recipe = recipes.find((r) => r.id === recipeId);
        if (recipe) {
          const duplicatedRecipe = {
            ...recipe,
            id: Date.now().toString(),
            name: `${recipe.name} (Kopya)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            recipes: [...state.recipes, duplicatedRecipe],
          }));
          return duplicatedRecipe;
        }
        return null;
      },

      // Import recipes from array
      importRecipes: (recipesArray) => {
        const processedRecipes = recipesArray.map((recipe) => ({
          ...recipe,
          id: recipe.id || Date.now().toString() + Math.random(),
          createdAt: recipe.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        
        set((state) => ({
          recipes: [...state.recipes, ...processedRecipes],
        }));
      },

      // Export recipes
      exportRecipes: () => {
        const { recipes } = get();
        return recipes;
      },

      // Clear all recipes
      clearRecipes: () => {
        set(() => ({
          recipes: [],
          favorites: [],
        }));
      },

      // Get popular tags
      getPopularTags: (limit = 10) => {
        const { recipes } = get();
        const tagCount = recipes.reduce((acc, recipe) => {
          recipe.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
          return acc;
        }, {});

        return Object.entries(tagCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([tag, count]) => ({ tag, count }));
      },

      // Get recipes by tag
      getRecipesByTag: (tag) => {
        const { recipes } = get();
        return recipes.filter((recipe) => 
          recipe.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
      },

      // Get meal-specific recipes
      getMealRecipes: (mealType) => {
        const { recipes } = get();
        return recipes.filter((recipe) => recipe.category === mealType);
      },

      // Calculate recipe macros for specific serving size
      calculateRecipeMacros: (recipeId, servingSize) => {
        const { recipes } = get();
        const recipe = recipes.find((r) => r.id === recipeId);
        if (!recipe) return null;

        const multiplier = servingSize / recipe.servings;
        return {
          calories: Math.round(recipe.calories * multiplier),
          protein: Math.round(recipe.protein * multiplier * 10) / 10,
          carb: Math.round(recipe.carb * multiplier * 10) / 10,
          fat: Math.round(recipe.fat * multiplier * 10) / 10,
        };
      },
    }),
    {
      name: 'recipe-store',
      storage: {
        getItem: async (name) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Error loading recipe store:', error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Error saving recipe store:', error);
          }
        },
        removeItem: async (name) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error('Error removing recipe store:', error);
          }
        },
      },
    }
  )
);
