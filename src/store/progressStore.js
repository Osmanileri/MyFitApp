import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqliteService from '../services/SQLiteService';
import { useDataOperations } from '../services/NotificationService';

export const useProgressStore = create((set, get) => ({
  // Weight tracking
  weightHistory: [],
  currentWeight: null,
  targetWeight: null,
  
  // Measurements
  measurements: [],
  currentMeasurements: null,
  
  // Photos
  progressPhotos: [],
  
  // Statistics
  totalWeightLoss: 0,
  weeklyProgress: 0,
  monthlyProgress: 0,
  
  // Loading states
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
      
      // Load user's progress data
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (user) {
        await get().loadProgressData();
        await get().calculateStatistics();
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error initializing progress store:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Load all progress data
  loadProgressData: async () => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return { success: false, error: 'No user found' };

      set({ isLoading: true });

      const progressData = await sqliteService.getProgress(user.uid, 50);
      
      // Separate weight and measurements
      const weightHistory = progressData
        .filter(p => p.weight !== null)
        .map(p => ({
          id: p.id,
          weight: p.weight,
          date: p.date,
          timestamp: new Date(p.date).getTime()
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      const measurements = progressData
        .filter(p => p.measurements)
        .map(p => ({
          id: p.id,
          measurements: p.measurements,
          date: p.date,
          timestamp: new Date(p.date).getTime()
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      const progressPhotos = progressData
        .filter(p => p.photos)
        .map(p => ({
          id: p.id,
          photos: p.photos,
          date: p.date,
          timestamp: new Date(p.date).getTime()
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      set({
        weightHistory,
        measurements,
        progressPhotos,
        currentWeight: weightHistory.length > 0 ? weightHistory[0].weight : null,
        currentMeasurements: measurements.length > 0 ? measurements[0].measurements : null,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      console.error('Error loading progress data:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Weight management
  addWeight: async (weight, date = new Date()) => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return { success: false, error: 'No user found' };

      set({ isLoading: true });

      const dateStr = date.toISOString().split('T')[0];
      
      const progressData = {
        date: dateStr,
        weight: weight,
        notes: `Weight: ${weight}kg`
      };

      await sqliteService.saveProgress(user.uid, progressData);

      // Update local state
      const newEntry = {
        id: Date.now().toString(),
        weight,
        date: dateStr,
        timestamp: date.getTime(),
      };

      set(state => {
        const updatedHistory = [newEntry, ...state.weightHistory]
          .sort((a, b) => b.timestamp - a.timestamp);
        
        return {
          weightHistory: updatedHistory,
          currentWeight: weight,
          isLoading: false
        };
      });

      await get().calculateStatistics();
      
      return { success: true };
    } catch (error) {
      console.error('Error adding weight:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteWeight: async (id) => {
    try {
      // For now, we'll just remove from local state
      // In a full implementation, we'd need to track individual entries
      set(state => {
        const updatedHistory = state.weightHistory.filter(entry => entry.id !== id);
        return {
          weightHistory: updatedHistory,
          currentWeight: updatedHistory.length > 0 ? updatedHistory[0].weight : null
        };
      });

      await get().calculateStatistics();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting weight:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Measurements management
  addMeasurement: async (measurementData, date = new Date()) => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return { success: false, error: 'No user found' };

      set({ isLoading: true });

      const dateStr = date.toISOString().split('T')[0];
      
      const progressData = {
        date: dateStr,
        measurements: measurementData,
        notes: 'Body measurements taken'
      };

      await sqliteService.saveProgress(user.uid, progressData);

      // Update local state
      const newEntry = {
        id: Date.now().toString(),
        measurements: measurementData,
        date: dateStr,
        timestamp: date.getTime(),
      };

      set(state => {
        const updatedMeasurements = [newEntry, ...state.measurements]
          .sort((a, b) => b.timestamp - a.timestamp);
        
        return {
          measurements: updatedMeasurements,
          currentMeasurements: measurementData,
          isLoading: false
        };
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding measurement:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteMeasurement: async (id) => {
    try {
      set(state => {
        const updatedMeasurements = state.measurements.filter(entry => entry.id !== id);
        return {
          measurements: updatedMeasurements,
          currentMeasurements: updatedMeasurements.length > 0 ? updatedMeasurements[0].measurements : null
        };
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting measurement:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Photo management
  addProgressPhoto: async (photoData, date = new Date()) => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return { success: false, error: 'No user found' };

      set({ isLoading: true });

      const dateStr = date.toISOString().split('T')[0];
      
      const progressData = {
        date: dateStr,
        photos: photoData,
        notes: 'Progress photos taken'
      };

      await sqliteService.saveProgress(user.uid, progressData);

      // Update local state
      const newEntry = {
        id: Date.now().toString(),
        photos: photoData,
        date: dateStr,
        timestamp: date.getTime(),
      };

      set(state => {
        const updatedPhotos = [newEntry, ...state.progressPhotos]
          .sort((a, b) => b.timestamp - a.timestamp);
        
        return {
          progressPhotos: updatedPhotos,
          isLoading: false
        };
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding progress photo:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteProgressPhoto: async (id) => {
    try {
      set(state => ({
        progressPhotos: state.progressPhotos.filter(entry => entry.id !== id)
      }));

      return { success: true };
    } catch (error) {
      console.error('Error deleting progress photo:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Statistics calculation
  calculateStatistics: async () => {
    try {
      const { weightHistory } = get();
      
      if (weightHistory.length === 0) {
        set({
          totalWeightLoss: 0,
          weeklyProgress: 0,
          monthlyProgress: 0
        });
        return;
      }

      // Sort by date ascending for calculations
      const sortedHistory = [...weightHistory].sort((a, b) => a.timestamp - b.timestamp);
      
      // Calculate total weight loss/gain
      const firstWeight = sortedHistory[0].weight;
      const lastWeight = sortedHistory[sortedHistory.length - 1].weight;
      const totalWeightLoss = firstWeight - lastWeight;

      // Calculate weekly progress
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weeklyEntries = sortedHistory.filter(entry => 
        new Date(entry.date) >= oneWeekAgo
      );
      
      let weeklyProgress = 0;
      if (weeklyEntries.length >= 2) {
        const weekStart = weeklyEntries[0].weight;
        const weekEnd = weeklyEntries[weeklyEntries.length - 1].weight;
        weeklyProgress = weekStart - weekEnd;
      }

      // Calculate monthly progress
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const monthlyEntries = sortedHistory.filter(entry => 
        new Date(entry.date) >= oneMonthAgo
      );
      
      let monthlyProgress = 0;
      if (monthlyEntries.length >= 2) {
        const monthStart = monthlyEntries[0].weight;
        const monthEnd = monthlyEntries[monthlyEntries.length - 1].weight;
        monthlyProgress = monthStart - monthEnd;
      }

      set({
        totalWeightLoss,
        weeklyProgress,
        monthlyProgress
      });

      return {
        totalWeightLoss,
        weeklyProgress,
        monthlyProgress
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      set({ error: error.message });
      return null;
    }
  },

  // Get progress data for specific date range
  getProgressForDateRange: (startDate, endDate) => {
    const { weightHistory, measurements, progressPhotos } = get();
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return {
      weights: weightHistory.filter(entry => 
        entry.timestamp >= start && entry.timestamp <= end
      ),
      measurements: measurements.filter(entry => 
        entry.timestamp >= start && entry.timestamp <= end
      ),
      photos: progressPhotos.filter(entry => 
        entry.timestamp >= start && entry.timestamp <= end
      )
    };
  },

  // Get weight trend
  getWeightTrend: (days = 30) => {
    const { weightHistory } = get();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentWeights = weightHistory
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (recentWeights.length < 2) return 'stable';

    const firstWeight = recentWeights[0].weight;
    const lastWeight = recentWeights[recentWeights.length - 1].weight;
    const change = lastWeight - firstWeight;

    if (change > 0.5) return 'increasing';
    if (change < -0.5) return 'decreasing';
    return 'stable';
  },

  // Get BMI calculation
  getBMI: () => {
    const { currentWeight } = get();
    
    // Get user height from auth store
    const getUserHeight = async () => {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      return user?.height;
    };

    getUserHeight().then(height => {
      if (currentWeight && height) {
        const heightInMeters = height / 100;
        const bmi = currentWeight / (heightInMeters * heightInMeters);
        
        let category = 'normal';
        if (bmi < 18.5) category = 'underweight';
        else if (bmi >= 25 && bmi < 30) category = 'overweight';
        else if (bmi >= 30) category = 'obese';

        return {
          value: Math.round(bmi * 10) / 10,
          category
        };
      }
    });

    return null;
  },

  // Set target weight
  setTargetWeight: async (weight) => {
    try {
      set({ targetWeight: weight });
      
      // Save to user profile
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (user) {
        await sqliteService.updateUser(user.uid, { targetWeight: weight });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error setting target weight:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Get progress summary
  getProgressSummary: () => {
    const { 
      weightHistory, 
      measurements, 
      progressPhotos, 
      totalWeightLoss, 
      weeklyProgress, 
      monthlyProgress 
    } = get();

    return {
      totalEntries: weightHistory.length + measurements.length + progressPhotos.length,
      weightEntries: weightHistory.length,
      measurementEntries: measurements.length,
      photoEntries: progressPhotos.length,
      totalWeightLoss,
      weeklyProgress,
      monthlyProgress,
      trend: get().getWeightTrend(),
      bmi: get().getBMI()
    };
  },

  // Clear all data
  clearAllData: async () => {
    try {
      const userStore = await import('./authStore');
      const user = userStore.default.getState().user;
      
      if (!user) return { success: false, error: 'No user found' };

      // Clear from SQLite
      await sqliteService.clearUserData(user.uid);

      // Clear local state
      set({
        weightHistory: [],
        currentWeight: null,
        targetWeight: null,
        measurements: [],
        currentMeasurements: null,
        progressPhotos: [],
        totalWeightLoss: 0,
        weeklyProgress: 0,
        monthlyProgress: 0
      });

      return { success: true };
    } catch (error) {
      console.error('Error clearing all data:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Initialize with mock data for demo
  initializeMockData: () => {
    const mockWeightHistory = [
      {
        id: '1',
        weight: 75.5,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      },
      {
        id: '2',
        weight: 76.0,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000
      },
      {
        id: '3',
        weight: 76.8,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000
      }
    ];

    const mockMeasurements = [
      {
        id: '1',
        measurements: {
          chest: 100,
          waist: 85,
          hips: 95,
          arms: 35,
          thighs: 60
        },
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      }
    ];

    set({
      weightHistory: mockWeightHistory,
      measurements: mockMeasurements,
      currentWeight: 75.5,
      currentMeasurements: mockMeasurements[0].measurements,
      targetWeight: 70
    });

    get().calculateStatistics();
  }
}));

// Create wrapper functions with notifications
export const useProgressStoreWithNotifications = () => {
  const store = useProgressStore();
  
  // Import the hook inside the component
  const { notifyCreate, notifyUpdate, notifyDelete } = useDataOperations();

  return {
    ...store,
    
    // Wrap weight operations with notifications
    addWeight: notifyCreate('weight')(store.addWeight),
    deleteWeight: notifyDelete('weight')(store.deleteWeight),
    
    // Wrap measurement operations with notifications
    addMeasurement: notifyCreate('measurement')(store.addMeasurement),
    deleteMeasurement: notifyDelete('measurement')(store.deleteMeasurement),
    
    // Wrap photo operations with notifications
    addProgressPhoto: notifyCreate('progress')(store.addProgressPhoto),
    deleteProgressPhoto: notifyDelete('progress')(store.deleteProgressPhoto),
    
    // Wrap clear data with notifications
    clearAllData: notifyDelete('progress')(store.clearAllData),
  };
};

export default useProgressStore; 