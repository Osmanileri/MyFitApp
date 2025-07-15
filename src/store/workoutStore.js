import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      
      // Exercise database (common exercises)
      exerciseDatabase: [
        // Chest Exercises
        { 
          id: 'bench-press', 
          name: 'Bench Press', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Omuz', 'Triceps'],
          equipment: 'Barbell',
          difficulty: 'Orta'
        },
        { 
          id: 'chest-press-machine', 
          name: 'Chest Press Machine', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Omuz', 'Triceps'],
          equipment: 'Machine',
          difficulty: 'Başlangıç'
        },
        { 
          id: 'push-up', 
          name: 'Push-up', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Omuz', 'Triceps'],
          equipment: 'Bodyweight',
          difficulty: 'Başlangıç'
        },
        { 
          id: 'close-grip-pushup', 
          name: 'Close-Grip Pushup', 
          category: 'Kol', 
          muscleGroups: ['Triceps', 'Göğüs'],
          equipment: 'Bodyweight',
          difficulty: 'Orta'
        },

        // Back Exercises
        { 
          id: 'barbell-pullover', 
          name: 'Barbell Pullover', 
          category: 'Sırt', 
          muscleGroups: ['Sırt', 'Göğüs', 'Core'],
          equipment: 'Barbell',
          difficulty: 'İleri'
        },
        { 
          id: 'pull-up', 
          name: 'Pull-up', 
          category: 'Sırt', 
          muscleGroups: ['Sırt', 'Biceps'],
          equipment: 'Pull-up Bar',
          difficulty: 'Orta'
        },
        { 
          id: 'deadlift', 
          name: 'Deadlift', 
          category: 'Sırt', 
          muscleGroups: ['Sırt', 'Glutes', 'Hamstring'],
          equipment: 'Barbell',
          difficulty: 'İleri'
        },

        // Shoulder Exercises
        { 
          id: 'shoulder-press', 
          name: 'Shoulder Press', 
          category: 'Omuz', 
          muscleGroups: ['Omuz', 'Triceps'],
          equipment: 'Dumbbell',
          difficulty: 'Orta'
        },

        // Leg Exercises
        { 
          id: 'squat', 
          name: 'Squat', 
          category: 'Bacak', 
          muscleGroups: ['Quadriceps', 'Glutes', 'Hamstring'],
          equipment: 'Barbell',
          difficulty: 'Orta'
        },
        { 
          id: 'lunge', 
          name: 'Lunge', 
          category: 'Bacak', 
          muscleGroups: ['Quadriceps', 'Glutes', 'Hamstring'],
          equipment: 'Bodyweight',
          difficulty: 'Başlangıç'
        },

        // Arm Exercises
        { 
          id: 'bicep-curl', 
          name: 'Bicep Curl', 
          category: 'Kol', 
          muscleGroups: ['Biceps'],
          equipment: 'Dumbbell',
          difficulty: 'Başlangıç'
        },
        { 
          id: 'tricep-dip', 
          name: 'Tricep Dip', 
          category: 'Kol', 
          muscleGroups: ['Triceps'],
          equipment: 'Bodyweight',
          difficulty: 'Orta'
        },

        // Cable Exercises
        { 
          id: 'cable-crossover', 
          name: 'Cable Crossover', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Omuz'],
          equipment: 'Cable Machine',
          difficulty: 'Orta'
        },
        { 
          id: 'cable-fly', 
          name: 'Cable Fly', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Omuz'],
          equipment: 'Cable Machine',
          difficulty: 'Orta'
        },

        // Decline Exercises
        { 
          id: 'decline-bench-press', 
          name: 'Decline Bench Press', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Triceps'],
          equipment: 'Barbell',
          difficulty: 'Orta'
        },
        { 
          id: 'decline-cable-fly', 
          name: 'Decline Cable Fly', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs'],
          equipment: 'Cable Machine',
          difficulty: 'Orta'
        },
        { 
          id: 'decline-pushup', 
          name: 'Decline Pushup', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Omuz', 'Triceps'],
          equipment: 'Bodyweight',
          difficulty: 'Orta'
        },

        // Core Exercises
        { 
          id: 'plank', 
          name: 'Plank', 
          category: 'Core', 
          muscleGroups: ['Core'],
          equipment: 'Bodyweight',
          difficulty: 'Başlangıç'
        },

        // Additional Exercises from KASHUB
        { 
          id: 'dicline-bench-press', 
          name: 'Dicline Bench Press', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Triceps'],
          equipment: 'Barbell',
          difficulty: 'Orta'
        },
        { 
          id: 'dicline-chest-press-machine', 
          name: 'Dicline Chest Press Machine', 
          category: 'Göğüs', 
          muscleGroups: ['Göğüs', 'Triceps'],
          equipment: 'Machine',
          difficulty: 'Başlangıç'
        },
      ],
      
      // Workout actions
      startWorkout: (mode = 'live') => {
        const workoutId = Date.now().toString();
        const newWorkout = {
          id: workoutId,
          name: `Workout ${new Date().toLocaleDateString()}`,
          date: new Date().toISOString(),
          startTime: new Date().toISOString(),
          endTime: null,
          duration: 0,
          calories: 0,
          exercises: [],
          mode,
          isCompleted: false,
        };
        
        set({
          currentWorkout: newWorkout,
          isWorkoutActive: true,
          workoutStartTime: new Date().toISOString(),
          workoutMode: mode,
        });
        
        return workoutId;
      },
      
      endWorkout: () => {
        const state = get();
        if (!state.currentWorkout) return;
        
        const endTime = new Date().toISOString();
        const duration = Math.round((new Date(endTime) - new Date(state.workoutStartTime)) / 60000); // minutes
        const calories = Math.round(duration * 8); // Simple calculation: ~8 calories per minute
        
        const completedWorkout = {
          ...state.currentWorkout,
          endTime,
          duration,
          calories,
          isCompleted: true,
        };
        
        const updatedWorkouts = [...state.workouts, completedWorkout];
        const newStats = state.calculateStats(updatedWorkouts);
        
        set({
          workouts: updatedWorkouts,
          currentWorkout: null,
          isWorkoutActive: false,
          workoutStartTime: null,
          workoutMode: null,
          currentWeekWorkouts: state.getCurrentWeekWorkouts(updatedWorkouts),
          ...newStats,
        });
        
        return completedWorkout;
      },
      
      cancelWorkout: () => {
        set({
          currentWorkout: null,
          isWorkoutActive: false,
          workoutStartTime: null,
          workoutMode: null,
        });
      },
      
      // Exercise management
      addExerciseToWorkout: (exercise) => {
        const state = get();
        if (!state.currentWorkout) return;
        
        const exerciseEntry = {
          id: Date.now().toString(),
          exerciseId: exercise.id,
          name: exercise.name,
          category: exercise.category,
          sets: [],
          notes: '',
        };
        
        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: [...state.currentWorkout.exercises, exerciseEntry],
        };
        
        set({ currentWorkout: updatedWorkout });
        return exerciseEntry;
      },
      
      removeExerciseFromWorkout: (exerciseEntryId) => {
        const state = get();
        if (!state.currentWorkout) return;
        
        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.filter(ex => ex.id !== exerciseEntryId),
        };
        
        set({ currentWorkout: updatedWorkout });
      },
      
      // Set management with RIR support
      addSetToExercise: (exerciseEntryId, setData) => {
        const state = get();
        if (!state.currentWorkout) return;
        
        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(ex => 
            ex.id === exerciseEntryId 
              ? { 
                  ...ex, 
                  sets: [...ex.sets, { 
                    ...setData, 
                    id: Date.now().toString(),
                    rir: setData.rir || null,
                    completed: setData.completed || false
                  }] 
                }
              : ex
          ),
        };
        
        set({ currentWorkout: updatedWorkout });
      },
      
      updateSet: (exerciseEntryId, setId, setData) => {
        const state = get();
        if (!state.currentWorkout) return;
        
        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(ex => 
            ex.id === exerciseEntryId 
              ? { 
                  ...ex, 
                  sets: ex.sets.map(set => 
                    set.id === setId ? { ...set, ...setData } : set
                  )
                }
              : ex
          ),
        };
        
        set({ currentWorkout: updatedWorkout });
      },
      
      removeSet: (exerciseEntryId, setId) => {
        const state = get();
        if (!state.currentWorkout) return;
        
        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(ex => 
            ex.id === exerciseEntryId 
              ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
              : ex
          ),
        };
        
        set({ currentWorkout: updatedWorkout });
      },
      
      // Template management
      saveWorkoutAsTemplate: (workoutId, templateName) => {
        const state = get();
        const workout = state.workouts.find(w => w.id === workoutId);
        if (!workout) return;
        
        const template = {
          id: Date.now().toString(),
          name: templateName,
          exercises: workout.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            name: ex.name,
            category: ex.category,
            targetSets: ex.sets.length,
            targetReps: ex.sets.length > 0 ? ex.sets[0].reps : 0,
            targetWeight: ex.sets.length > 0 ? ex.sets[0].weight : 0,
          })),
          createdAt: new Date().toISOString(),
        };
        
        set({ workoutTemplates: [...state.workoutTemplates, template] });
        return template;
      },
      
      loadWorkoutTemplate: (templateId) => {
        const state = get();
        const template = state.workoutTemplates.find(t => t.id === templateId);
        if (!template || !state.currentWorkout) return;
        
        const exerciseEntries = template.exercises.map(ex => ({
          id: Date.now().toString() + Math.random(),
          exerciseId: ex.exerciseId,
          name: ex.name,
          category: ex.category,
          sets: [],
          notes: '',
        }));
        
        const updatedWorkout = {
          ...state.currentWorkout,
          name: template.name,
          exercises: exerciseEntries,
        };
        
        set({ currentWorkout: updatedWorkout });
      },
      
      // Goals and preferences
      setWeeklyGoal: (goal) => {
        set({ weeklyGoal: goal });
      },
      
      updateWorkoutName: (name) => {
        const state = get();
        if (!state.currentWorkout) return;
        
        set({ 
          currentWorkout: { 
            ...state.currentWorkout, 
            name 
          } 
        });
      },
      
      // Statistics and calculations
      calculateStats: (workouts) => {
        const totalWorkouts = workouts.length;
        const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const averageWorkoutDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
        
        return {
          totalWorkouts,
          totalCalories,
          totalDuration,
          averageWorkoutDuration,
        };
      },
      
      getCurrentWeekWorkouts: (workouts) => {
        const now = new Date();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        
        return workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= weekStart;
        }).length;
      },
      
      getRecentWorkouts: (limit = 5) => {
        const state = get();
        return state.workouts
          .filter(w => w.isCompleted)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit);
      },
      
      getWorkoutById: (workoutId) => {
        const state = get();
        return state.workouts.find(w => w.id === workoutId);
      },
      
      getWorkoutsByDateRange: (startDate, endDate) => {
        const state = get();
        return state.workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= startDate && workoutDate <= endDate;
        });
      },
      
      // Exercise database actions
      searchExercises: (query) => {
        const state = get();
        if (!query.trim()) return state.exerciseDatabase;
        
        return state.exerciseDatabase.filter(exercise =>
          exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          exercise.category.toLowerCase().includes(query.toLowerCase()) ||
          exercise.muscleGroups.some(mg => mg.toLowerCase().includes(query.toLowerCase()))
        );
      },
      
      getExercisesByCategory: (category) => {
        const state = get();
        if (category === 'Tümü') {
          return state.exerciseDatabase;
        }
        return state.exerciseDatabase.filter(exercise => exercise.category === category);
      },
      
      // Data management
      clearAllData: () => {
        set({
          workouts: [],
          workoutTemplates: [],
          exercises: [],
          currentWorkout: null,
          isWorkoutActive: false,
          workoutStartTime: null,
          workoutMode: null,
          currentWeekWorkouts: 0,
          totalWorkouts: 0,
          totalCalories: 0,
          totalDuration: 0,
          averageWorkoutDuration: 0,
        });
      },
      
      // Initialize with mock data for development
      initializeMockData: () => {
        const mockWorkouts = [
          {
            id: '1',
            name: 'Push Day',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            duration: 60,
            calories: 400,
            exercises: [
              {
                id: 'ex1',
                exerciseId: 'bench-press',
                name: 'Bench Press',
                category: 'Göğüs',
                sets: [
                  { id: 'set1', reps: 10, weight: 80, rir: 3, completed: true },
                  { id: 'set2', reps: 8, weight: 85, rir: 2, completed: true },
                  { id: 'set3', reps: 6, weight: 90, rir: 1, completed: true },
                ],
                notes: '',
              },
              {
                id: 'ex2',
                exerciseId: 'push-up',
                name: 'Push-up',
                category: 'Göğüs',
                sets: [
                  { id: 'set4', reps: 15, weight: 0, rir: 2, completed: true },
                  { id: 'set5', reps: 12, weight: 0, rir: 1, completed: true },
                ],
                notes: '',
              },
              {
                id: 'ex3',
                exerciseId: 'shoulder-press',
                name: 'Shoulder Press',
                category: 'Omuz',
                sets: [
                  { id: 'set6', reps: 10, weight: 25, rir: 2, completed: true },
                  { id: 'set7', reps: 8, weight: 30, rir: 1, completed: true },
                ],
                notes: '',
              },
            ],
            mode: 'live',
            isCompleted: true,
          },
          {
            id: '2',
            name: 'Pull Day - Barbell Pullover Focus',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
            startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 55 * 60 * 1000).toISOString(),
            duration: 55,
            calories: 370,
            exercises: [
              {
                id: 'ex4',
                exerciseId: 'barbell-pullover',
                name: 'Barbell Pullover',
                category: 'Sırt',
                sets: [
                  { id: 'set8', reps: 10, weight: 40, rir: 3, completed: true },
                  { id: 'set9', reps: 8, weight: 45, rir: 2, completed: true },
                  { id: 'set10', reps: 6, weight: 50, rir: 1, completed: true },
                ],
                notes: 'Great form today',
              },
              {
                id: 'ex5',
                exerciseId: 'pull-up',
                name: 'Pull-up',
                category: 'Sırt',
                sets: [
                  { id: 'set11', reps: 8, weight: 0, rir: 2, completed: true },
                  { id: 'set12', reps: 6, weight: 0, rir: 1, completed: true },
                  { id: 'set13', reps: 5, weight: 0, rir: 0, completed: true },
                ],
                notes: '',
              },
            ],
            mode: 'live',
            isCompleted: true,
          },
          {
            id: '3',
            name: 'Leg Day',
            date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
            startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(),
            duration: 50,
            calories: 350,
            exercises: [
              {
                id: 'ex6',
                exerciseId: 'squat',
                name: 'Squat',
                category: 'Bacak',
                sets: [
                  { id: 'set14', reps: 12, weight: 100, rir: 3, completed: true },
                  { id: 'set15', reps: 10, weight: 110, rir: 2, completed: true },
                  { id: 'set16', reps: 8, weight: 120, rir: 1, completed: true },
                ],
                notes: '',
              },
              {
                id: 'ex7',
                exerciseId: 'lunge',
                name: 'Lunge',
                category: 'Bacak',
                sets: [
                  { id: 'set17', reps: 15, weight: 0, rir: 2, completed: true },
                  { id: 'set18', reps: 12, weight: 0, rir: 1, completed: true },
                ],
                notes: '',
              },
            ],
            mode: 'live',
            isCompleted: true,
          },
        ];
        
        const state = get();
        const stats = state.calculateStats(mockWorkouts);
        
        set({
          workouts: mockWorkouts,
          currentWeekWorkouts: state.getCurrentWeekWorkouts(mockWorkouts),
          ...stats,
        });
      },
      
      // Get exercise categories for navigation
      getExerciseCategories: () => {
        const state = get();
        const categories = [...new Set(state.exerciseDatabase.map(ex => ex.category))];
        return categories.map(category => ({
          name: category,
          count: state.exerciseDatabase.filter(ex => ex.category === category).length,
          icon: state.getCategoryIcon(category)
        }));
      },
      
      getCategoryIcon: (category) => {
        const iconMap = {
          'Göğüs': 'weight-lifter',
          'Sırt': 'human-handsup',
          'Omuz': 'arm-flex',
          'Bacak': 'run',
          'Kol': 'arm-flex-outline',
          'Core': 'human-male-height'
        };
        return iconMap[category] || 'dumbbell';
      },
      
      // Get previous workout data for progressive overload
      getPreviousWorkoutData: (exerciseId) => {
        const state = get();
        const workouts = state.workouts.filter(w => w.isCompleted);
        
        for (let i = workouts.length - 1; i >= 0; i--) {
          const workout = workouts[i];
          const exercise = workout.exercises.find(ex => ex.exerciseId === exerciseId);
          if (exercise && exercise.sets.length > 0) {
            return {
              date: workout.date,
              sets: exercise.sets,
              bestSet: exercise.sets.reduce((best, current) => {
                const currentVolume = current.weight * current.reps;
                const bestVolume = best.weight * best.reps;
                return currentVolume > bestVolume ? current : best;
              })
            };
          }
        }
        return null;
      },

      // Create new workout
      createWorkout: (workoutData) => {
        const workoutId = `workout_${Date.now()}`;
        
        // Convert selected exercises to workout format
        const workoutExercises = workoutData.exercises ? workoutData.exercises.map(exercise => ({
          id: `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          exerciseId: exercise.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
          name: exercise.name,
          category: exercise.muscleGroup?.name || 'Unknown',
          muscleGroup: exercise.muscleGroup,
          equipment: exercise.equipment,
          difficulty: exercise.difficulty,
          sets: exercise.sets || [],
          notes: ''
        })) : [];
        
        const newWorkout = {
          id: workoutId,
          name: workoutData.template?.name || `${workoutData.day} Antrenmanı`,
          date: new Date().toISOString(),
          startTime: new Date().toISOString(),
          mode: workoutData.mode || 'live',
          day: workoutData.day,
          template: workoutData.template,
          exercises: workoutExercises,
          isCompleted: false,
          duration: 0,
          calories: 0
        };
        
        set({ 
          currentWorkout: newWorkout,
          isWorkoutActive: true,
          workoutStartTime: new Date(),
          workoutMode: workoutData.mode || 'live'
        });
        
        return workoutId;
      },

      // Add exercise to current workout
      addExerciseToWorkout: (exercise) => {
        const state = get();
        if (!state.currentWorkout) return null;

        const exerciseEntry = {
          id: `exercise_${Date.now()}`,
          exerciseId: exercise.id,
          name: exercise.name,
          category: exercise.category,
          sets: [],
          notes: ''
        };

        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: [...state.currentWorkout.exercises, exerciseEntry]
        };

        set({ currentWorkout: updatedWorkout });
        return exerciseEntry;
      },

      // Add set to exercise
      addSetToExercise: (exerciseEntryId, setData) => {
        const state = get();
        if (!state.currentWorkout) return;

        const updatedExercises = state.currentWorkout.exercises.map(exercise => {
          if (exercise.id === exerciseEntryId) {
            const newSet = {
              id: `set_${Date.now()}`,
              weight: setData.weight,
              reps: setData.reps,
              rir: setData.rir,
              completed: setData.completed || false
            };
            return {
              ...exercise,
              sets: [...exercise.sets, newSet]
            };
          }
          return exercise;
        });

        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: updatedExercises
        };

        set({ currentWorkout: updatedWorkout });
      },

      // Update set data
      updateSet: (exerciseEntryId, setIndex, setData) => {
        const state = get();
        if (!state.currentWorkout) return;

        const updatedExercises = state.currentWorkout.exercises.map(exercise => {
          if (exercise.id === exerciseEntryId) {
            const updatedSets = [...exercise.sets];
            updatedSets[setIndex] = { ...updatedSets[setIndex], ...setData };
            return { ...exercise, sets: updatedSets };
          }
          return exercise;
        });

        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: updatedExercises
        };

        set({ currentWorkout: updatedWorkout });
      },

      // Complete a set
      completeSet: (exerciseEntryId, setIndex) => {
        const state = get();
        state.updateSet(exerciseEntryId, setIndex, { completed: true });
      },

      // Remove exercise from workout
      removeExercise: (exerciseEntryId) => {
        const state = get();
        if (!state.currentWorkout) return;

        const updatedExercises = state.currentWorkout.exercises.filter(
          exercise => exercise.id !== exerciseEntryId
        );

        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: updatedExercises
        };

        set({ currentWorkout: updatedWorkout });
      },

      // Finish current workout
      finishWorkout: () => {
        const state = get();
        if (!state.currentWorkout) return null;

        const endTime = new Date();
        const duration = Math.round((endTime - new Date(state.currentWorkout.startTime)) / 60000); // minutes
        
        // Calculate calories (rough estimate: 5 calories per minute)
        const calories = Math.round(duration * 5);

        const completedWorkout = {
          ...state.currentWorkout,
          endTime: endTime.toISOString(),
          duration,
          calories,
          isCompleted: true
        };

        // Add to workouts list and update stats
        const updatedWorkouts = [completedWorkout, ...state.workouts];
        const stats = state.calculateStats(updatedWorkouts);

        set({
          workouts: updatedWorkouts,
          currentWorkout: null,
          isWorkoutActive: false,
          workoutStartTime: null,
          workoutMode: null,
          currentWeekWorkouts: state.getCurrentWeekWorkouts(updatedWorkouts),
          ...stats
        });

        return completedWorkout;
      },

      // Search exercises
      searchExercises: (query) => {
        const state = get();
        if (!query.trim()) return state.exerciseDatabase;
        
        return state.exerciseDatabase.filter(exercise => 
          exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          exercise.category.toLowerCase().includes(query.toLowerCase()) ||
          exercise.muscleGroups.some(muscle => 
            muscle.toLowerCase().includes(query.toLowerCase())
          )
        );
      },

      // Get exercises by category
      getExercisesByCategory: (category) => {
        const state = get();
        if (category === 'Tümü') return state.exerciseDatabase;
        return state.exerciseDatabase.filter(exercise => exercise.category === category);
      },
    }),
    {
      name: 'workout-store',
      storage: {
        getItem: (name) => AsyncStorage.getItem(name),
        setItem: (name, value) => AsyncStorage.setItem(name, value),
        removeItem: (name) => AsyncStorage.removeItem(name),
      },
    }
  )
);

export const useWorkoutStore = workoutStore;
export default workoutStore;
