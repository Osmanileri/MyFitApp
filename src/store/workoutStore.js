import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqliteService from '../services/SQLiteService';
import { useDataOperations } from '../services/NotificationService';

const workoutStore = create(
  persist(
    (set, get) => ({
      // Current workout session state
      currentWorkout: null,
      isWorkoutActive: false,
      workoutStartTime: null,
      workoutMode: null, // 'live' or 'manual'
      
      // Workout history and data
      workouts: [],
      workoutTemplates: [],
      exercises: [],
      
      // User goals and preferences
      weeklyGoal: 4,
      currentWeekWorkouts: 0,
      
      // Statistics
      totalWorkouts: 0,
      totalCalories: 0,
      totalDuration: 0,
      averageWorkoutDuration: 0,
      
      // Loading states
      isLoading: false,
      error: null,
      
      // Exercise database (common exercises)
      exerciseDatabase: [
        {
          id: 'bench-press',
          name: 'Bench Press',
          category: 'chest',
          muscleGroups: ['chest', 'shoulders', 'triceps'],
          equipment: 'barbell',
          difficulty: 'intermediate',
          instructions: 'Lie on bench, grip barbell, lower to chest, press up',
          defaultSets: 3,
          defaultReps: 10,
          defaultWeight: 60,
          caloriesPerMinute: 8
        },
        {
          id: 'squat',
          name: 'Squat',
          category: 'legs',
          muscleGroups: ['quadriceps', 'hamstrings', 'glutes'],
          equipment: 'barbell',
          difficulty: 'intermediate',
          instructions: 'Stand with feet shoulder-width apart, lower body, stand up',
          defaultSets: 3,
          defaultReps: 12,
          defaultWeight: 80,
          caloriesPerMinute: 10
        },
        {
          id: 'deadlift',
          name: 'Deadlift',
          category: 'back',
          muscleGroups: ['back', 'hamstrings', 'glutes'],
          equipment: 'barbell',
          difficulty: 'advanced',
          instructions: 'Stand over barbell, grip, lift keeping back straight',
          defaultSets: 3,
          defaultReps: 8,
          defaultWeight: 100,
          caloriesPerMinute: 12
        },
        {
          id: 'pull-up',
          name: 'Pull-up',
          category: 'back',
          muscleGroups: ['back', 'biceps'],
          equipment: 'pull-up bar',
          difficulty: 'advanced',
          instructions: 'Hang from bar, pull body up until chin over bar',
          defaultSets: 3,
          defaultReps: 8,
          defaultWeight: 0,
          caloriesPerMinute: 9
        },
        {
          id: 'push-up',
          name: 'Push-up',
          category: 'chest',
          muscleGroups: ['chest', 'shoulders', 'triceps'],
          equipment: 'bodyweight',
          difficulty: 'beginner',
          instructions: 'Start in plank position, lower body, push up',
          defaultSets: 3,
          defaultReps: 15,
          defaultWeight: 0,
          caloriesPerMinute: 7
        },
        {
          id: 'shoulder-press',
          name: 'Shoulder Press',
          category: 'shoulders',
          muscleGroups: ['shoulders', 'triceps'],
          equipment: 'dumbbell',
          difficulty: 'beginner',
          instructions: 'Hold dumbbells at shoulder height, press overhead',
          defaultSets: 3,
          defaultReps: 12,
          defaultWeight: 20,
          caloriesPerMinute: 6
        },
        {
          id: 'bicep-curl',
          name: 'Bicep Curl',
          category: 'arms',
          muscleGroups: ['biceps'],
          equipment: 'dumbbell',
          difficulty: 'beginner',
          instructions: 'Hold dumbbells, curl up towards shoulders',
          defaultSets: 3,
          defaultReps: 12,
          defaultWeight: 15,
          caloriesPerMinute: 4
        },
        {
          id: 'tricep-dip',
          name: 'Tricep Dip',
          category: 'arms',
          muscleGroups: ['triceps'],
          equipment: 'bodyweight',
          difficulty: 'intermediate',
          instructions: 'Support body on parallel bars, lower and raise',
          defaultSets: 3,
          defaultReps: 10,
          defaultWeight: 0,
          caloriesPerMinute: 6
        },
        {
          id: 'plank',
          name: 'Plank',
          category: 'core',
          muscleGroups: ['core'],
          equipment: 'bodyweight',
          difficulty: 'beginner',
          instructions: 'Hold body in straight line from head to heels',
          defaultSets: 3,
          defaultReps: 1,
          defaultWeight: 0,
          caloriesPerMinute: 5,
          isTimeBased: true,
          defaultDuration: 30
        },
        {
          id: 'mountain-climber',
          name: 'Mountain Climber',
          category: 'cardio',
          muscleGroups: ['core', 'legs'],
          equipment: 'bodyweight',
          difficulty: 'intermediate',
          instructions: 'Start in plank, alternate bringing knees to chest',
          defaultSets: 3,
          defaultReps: 20,
          defaultWeight: 0,
          caloriesPerMinute: 8
        }
      ],

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
          
          // Load user's workout data
          await get().loadWorkouts();
          await get().loadWorkoutTemplates();
          await get().updateStatistics();
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Error initializing workout store:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Workout session management
      startWorkout: (workoutData = null, mode = 'live') => {
        const workout = workoutData || {
          id: `workout_${Date.now()}`,
          name: 'New Workout',
          exercises: [],
          startTime: new Date().toISOString(),
          duration: 0,
          completed: false
        };

        set({
          currentWorkout: workout,
          isWorkoutActive: true,
          workoutStartTime: new Date().toISOString(),
          workoutMode: mode
        });

        return workout;
      },

      pauseWorkout: () => {
        const { currentWorkout } = get();
        if (currentWorkout) {
          set({
            currentWorkout: {
              ...currentWorkout,
              pausedAt: new Date().toISOString()
            }
          });
        }
      },

      resumeWorkout: () => {
        const { currentWorkout } = get();
        if (currentWorkout) {
          set({
            currentWorkout: {
              ...currentWorkout,
              pausedAt: null
            }
          });
        }
      },

      endWorkout: async () => {
        const { currentWorkout, workoutStartTime } = get();
        
        if (!currentWorkout) return { success: false, error: 'No active workout' };

        try {
          const endTime = new Date().toISOString();
          const duration = workoutStartTime ? 
            Math.floor((new Date(endTime) - new Date(workoutStartTime)) / 1000 / 60) : 0;

          const completedWorkout = {
            ...currentWorkout,
            endTime,
            duration,
            completed: true,
            date: new Date().toISOString().split('T')[0]
          };

          // Save to SQLite
          await get().saveWorkout(completedWorkout);

          // Clear current workout
          set({
            currentWorkout: null,
            isWorkoutActive: false,
            workoutStartTime: null,
            workoutMode: null
          });

          // Update statistics
          await get().updateStatistics();

          return { success: true, workout: completedWorkout };
        } catch (error) {
          console.error('Error ending workout:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Exercise management within workout
      addExerciseToWorkout: (exercise) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const newExercise = {
          id: `exercise_${Date.now()}`,
          ...exercise,
          sets: exercise.sets || [],
          addedAt: new Date().toISOString()
        };

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: [...currentWorkout.exercises, newExercise]
          }
        });
      },

      removeExerciseFromWorkout: (exerciseId) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.filter(ex => ex.id !== exerciseId)
          }
        });
      },

      updateExerciseInWorkout: (exerciseId, updates) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map(ex => 
              ex.id === exerciseId ? { ...ex, ...updates } : ex
            )
          }
        });
      },

      // Set management
      addSetToExercise: (exerciseId, setData) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const newSet = {
          id: `set_${Date.now()}`,
          reps: setData.reps || 0,
          weight: setData.weight || 0,
          duration: setData.duration || 0,
          restTime: setData.restTime || 0,
          completed: false,
          completedAt: null,
          ...setData
        };

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map(ex => 
              ex.id === exerciseId ? {
                ...ex,
                sets: [...(ex.sets || []), newSet]
              } : ex
            )
          }
        });
      },

      updateSet: (exerciseId, setId, updates) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map(ex => 
              ex.id === exerciseId ? {
                ...ex,
                sets: ex.sets.map(set => 
                  set.id === setId ? { ...set, ...updates } : set
                )
              } : ex
            )
          }
        });
      },

      completeSet: (exerciseId, setId) => {
        get().updateSet(exerciseId, setId, {
          completed: true,
          completedAt: new Date().toISOString()
        });
      },

      deleteSet: (exerciseId, setId) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map(ex => 
              ex.id === exerciseId ? {
                ...ex,
                sets: ex.sets.filter(set => set.id !== setId)
              } : ex
            )
          }
        });
      },

      // Workout CRUD operations
      saveWorkout: async (workoutData) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // Calculate calories burned
          const caloriesBurned = get().calculateCaloriesBurned(workoutData);

          const workoutToSave = {
            ...workoutData,
            userId: user.uid,
            workoutId: workoutData.id || workoutData.workoutId,
            caloriesBurned,
            date: workoutData.date || new Date().toISOString().split('T')[0]
          };

          await sqliteService.saveWorkout(user.uid, workoutToSave);

          // Update local state
          set(state => ({
            workouts: [workoutToSave, ...state.workouts]
          }));

          return { success: true };
        } catch (error) {
          console.error('Error saving workout:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      loadWorkouts: async (limit = 20) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          set({ isLoading: true });

          const workouts = await sqliteService.getWorkouts(user.uid, limit);

          set({
            workouts,
            isLoading: false
          });

          return { success: true, workouts };
        } catch (error) {
          console.error('Error loading workouts:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      deleteWorkout: async (workoutId) => {
        try {
          await sqliteService.deleteWorkout(workoutId);

          // Update local state
          set(state => ({
            workouts: state.workouts.filter(w => w.workoutId !== workoutId)
          }));

          return { success: true };
        } catch (error) {
          console.error('Error deleting workout:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Workout templates
      saveWorkoutTemplate: async (templateData) => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          const template = {
            id: `template_${Date.now()}`,
            ...templateData,
            userId: user.uid,
            createdAt: new Date().toISOString()
          };

          // Save to SQLite (we could add a templates table, but for now use recipes table)
          await sqliteService.saveRecipe(user.uid, {
            ...template,
            recipeId: template.id,
            category: 'workout_template'
          });

          // Update local state
          set(state => ({
            workoutTemplates: [...state.workoutTemplates, template]
          }));

          return { success: true };
        } catch (error) {
          console.error('Error saving workout template:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      loadWorkoutTemplates: async () => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // For now, we'll use a simple template system
          const defaultTemplates = [
            {
              id: 'push-day',
              name: 'Push Day',
              description: 'Chest, shoulders, triceps',
              exercises: [
                { id: 'bench-press', name: 'Bench Press', sets: 3, reps: 10, weight: 60 },
                { id: 'shoulder-press', name: 'Shoulder Press', sets: 3, reps: 12, weight: 20 },
                { id: 'push-up', name: 'Push-ups', sets: 3, reps: 15, weight: 0 },
                { id: 'tricep-dip', name: 'Tricep Dips', sets: 3, reps: 10, weight: 0 }
              ]
            },
            {
              id: 'pull-day',
              name: 'Pull Day',
              description: 'Back, biceps',
              exercises: [
                { id: 'deadlift', name: 'Deadlift', sets: 3, reps: 8, weight: 100 },
                { id: 'pull-up', name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
                { id: 'bicep-curl', name: 'Bicep Curls', sets: 3, reps: 12, weight: 15 }
              ]
            },
            {
              id: 'leg-day',
              name: 'Leg Day',
              description: 'Legs, glutes',
              exercises: [
                { id: 'squat', name: 'Squats', sets: 3, reps: 12, weight: 80 },
                { id: 'deadlift', name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 80 }
              ]
            },
            {
              id: 'cardio-hiit',
              name: 'HIIT Cardio',
              description: 'High intensity interval training',
              exercises: [
                { id: 'mountain-climber', name: 'Mountain Climbers', sets: 3, reps: 20, weight: 0 },
                { id: 'plank', name: 'Plank', sets: 3, duration: 30, weight: 0 }
              ]
            }
          ];

          set({ workoutTemplates: defaultTemplates });

          return { success: true, templates: defaultTemplates };
        } catch (error) {
          console.error('Error loading workout templates:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Statistics and analytics
      updateStatistics: async () => {
        try {
          const { workouts } = get();
          
          const totalWorkouts = workouts.length;
          const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
          const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
          const averageWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

          // Calculate current week workouts
          const currentWeekStart = new Date();
          currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
          const currentWeekWorkouts = workouts.filter(w => {
            const workoutDate = new Date(w.date || w.createdAt);
            return workoutDate >= currentWeekStart;
          }).length;

          set({
            totalWorkouts,
            totalDuration,
            totalCalories,
            averageWorkoutDuration,
            currentWeekWorkouts
          });

          return {
            totalWorkouts,
            totalDuration,
            totalCalories,
            averageWorkoutDuration,
            currentWeekWorkouts
          };
        } catch (error) {
          console.error('Error updating statistics:', error);
          set({ error: error.message });
          return null;
        }
      },

      // Utility functions
      calculateCaloriesBurned: (workout) => {
        if (!workout.exercises || workout.exercises.length === 0) return 0;

        let totalCalories = 0;

        workout.exercises.forEach(exercise => {
          const exerciseData = get().exerciseDatabase.find(e => e.id === exercise.id);
          if (exerciseData) {
            const duration = exercise.duration || 
              (exercise.sets ? exercise.sets.length * 2 : 5); // Estimate 2 minutes per set
            totalCalories += exerciseData.caloriesPerMinute * duration;
          }
        });

        return Math.round(totalCalories);
      },

      getExerciseById: (id) => {
        return get().exerciseDatabase.find(ex => ex.id === id);
      },

      getExercisesByCategory: (category) => {
        return get().exerciseDatabase.filter(ex => ex.category === category);
      },

      getExercisesByMuscleGroup: (muscleGroup) => {
        return get().exerciseDatabase.filter(ex => 
          ex.muscleGroups.includes(muscleGroup)
        );
      },

      // Weekly statistics
      getWeeklyStats: () => {
        const { workouts } = get();
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        
        const weekWorkouts = workouts.filter(w => {
          const workoutDate = new Date(w.date || w.createdAt);
          return workoutDate >= weekStart;
        });

        const weeklyStats = {
          workoutsCompleted: weekWorkouts.length,
          totalDuration: weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
          totalCalories: weekWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
          averageDuration: weekWorkouts.length > 0 ? 
            weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / weekWorkouts.length : 0,
          progressToGoal: get().weeklyGoal > 0 ? 
            (weekWorkouts.length / get().weeklyGoal) * 100 : 0
        };

        return weeklyStats;
      },

      // Get recent workouts
      getRecentWorkouts: (limit = 5) => {
        const { workouts } = get();
        return workouts
          .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
          .slice(0, limit);
      },

      // Clear all data
      clearAllData: async () => {
        try {
          const userStore = await import('./authStore');
          const user = userStore.default.getState().user;
          
          if (!user) return { success: false, error: 'No user found' };

          // Clear workouts from SQLite
          await sqliteService.clearUserData(user.uid);

          // Clear local state
          set({
            workouts: [],
            workoutTemplates: [],
            currentWorkout: null,
            isWorkoutActive: false,
            workoutStartTime: null,
            workoutMode: null,
            currentWeekWorkouts: 0,
            totalWorkouts: 0,
            totalCalories: 0,
            totalDuration: 0,
            averageWorkoutDuration: 0
          });

          return { success: true };
        } catch (error) {
          console.error('Error clearing all data:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Initialize mock data for demo
      initializeMockData: () => {
        const mockWorkouts = [
          {
            id: 'workout_1',
            workoutId: 'workout_1',
            name: 'Push Day',
            date: new Date().toISOString().split('T')[0],
            duration: 45,
            caloriesBurned: 320,
            completed: true,
            exercises: [
              {
                id: 'bench-press',
                name: 'Bench Press',
                sets: [
                  { id: 'set_1', reps: 10, weight: 60, completed: true },
                  { id: 'set_2', reps: 10, weight: 60, completed: true },
                  { id: 'set_3', reps: 8, weight: 65, completed: true }
                ]
              }
            ]
          },
          {
            id: 'workout_2',
            workoutId: 'workout_2',
            name: 'Pull Day',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            duration: 40,
            caloriesBurned: 280,
            completed: true,
            exercises: [
              {
                id: 'pull-up',
                name: 'Pull-ups',
                sets: [
                  { id: 'set_1', reps: 8, weight: 0, completed: true },
                  { id: 'set_2', reps: 7, weight: 0, completed: true },
                  { id: 'set_3', reps: 6, weight: 0, completed: true }
                ]
              }
            ]
          }
        ];

        set({ workouts: mockWorkouts });
        get().updateStatistics();
      }
    }),
    {
      name: 'workout-storage',
      partialize: (state) => ({
        workouts: state.workouts,
        workoutTemplates: state.workoutTemplates,
        weeklyGoal: state.weeklyGoal,
        exercises: state.exercises
      })
    }
  )
);

// Create wrapper functions with notifications
export const useWorkoutStoreWithNotifications = () => {
  const store = workoutStore();
  
  // Import the hook inside the component
  const { notifyCreate, notifyUpdate, notifyDelete } = useDataOperations();

  return {
    ...store,
    
    // Wrap workout operations with notifications
    saveWorkout: notifyCreate('workout')(store.saveWorkout),
    deleteWorkout: notifyDelete('workout')(store.deleteWorkout),
    endWorkout: notifyUpdate('workout')(store.endWorkout),
    
    // Wrap template operations with notifications
    saveWorkoutTemplate: notifyCreate('workout')(store.saveWorkoutTemplate),
    
    // Wrap clear data with notifications
    clearAllData: notifyDelete('workout')(store.clearAllData),
  };
};

export default workoutStore;
