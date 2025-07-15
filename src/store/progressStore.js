import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  
  // Weight management
  addWeight: async (weight, date = new Date()) => {
    try {
      set({ isLoading: true });
      const { weightHistory } = get();
      
      const newEntry = {
        id: Date.now().toString(),
        weight,
        date: date.toISOString(),
        timestamp: Date.now(),
      };
      
      const updatedHistory = [...weightHistory, newEntry].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      set({ 
        weightHistory: updatedHistory,
        currentWeight: weight,
        isLoading: false 
      });
      
      await AsyncStorage.setItem('weightHistory', JSON.stringify(updatedHistory));
      get().calculateProgress();
      
    } catch (error) {
      set({ error: 'Kilo eklenemedi', isLoading: false });
    }
  },
  
  // Measurements management
  addMeasurement: async (measurements, date = new Date()) => {
    try {
      set({ isLoading: true });
      const { measurements: measurementHistory } = get();
      
      const newEntry = {
        id: Date.now().toString(),
        measurements,
        date: date.toISOString(),
        timestamp: Date.now(),
      };
      
      const updatedHistory = [...measurementHistory, newEntry].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      set({ 
        measurements: updatedHistory,
        currentMeasurements: measurements,
        isLoading: false 
      });
      
      await AsyncStorage.setItem('measurements', JSON.stringify(updatedHistory));
      
    } catch (error) {
      set({ error: 'Ölçü eklenemedi', isLoading: false });
    }
  },
  
  // Photos management
  addPhoto: async (photoUri, type = 'progress') => {
    try {
      set({ isLoading: true });
      const { progressPhotos } = get();
      
      const newPhoto = {
        id: Date.now().toString(),
        uri: photoUri,
        type,
        date: new Date().toISOString(),
        timestamp: Date.now(),
      };
      
      const updatedPhotos = [...progressPhotos, newPhoto].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      set({ 
        progressPhotos: updatedPhotos,
        isLoading: false 
      });
      
      await AsyncStorage.setItem('progressPhotos', JSON.stringify(updatedPhotos));
      
    } catch (error) {
      set({ error: 'Fotoğraf eklenemedi', isLoading: false });
    }
  },
  
  // Progress calculations
  calculateProgress: () => {
    const { weightHistory, targetWeight } = get();
    
    if (weightHistory.length < 2) return;
    
    const currentWeight = weightHistory[0].weight;
    const previousWeight = weightHistory[1].weight;
    const weeklyProgress = currentWeight - previousWeight;
    
    let totalWeightLoss = 0;
    if (targetWeight) {
      totalWeightLoss = currentWeight - targetWeight;
    }
    
    set({
      weeklyProgress,
      totalWeightLoss,
    });
  },
  
  // Data loading
  loadProgressData: async () => {
    try {
      set({ isLoading: true });
      
      const [weightStr, measurementsStr, photosStr] = await AsyncStorage.multiGet([
        'weightHistory',
        'measurements',
        'progressPhotos'
      ]);
      
      const weightHistory = weightStr[1] ? JSON.parse(weightStr[1]) : [];
      const measurements = measurementsStr[1] ? JSON.parse(measurementsStr[1]) : [];
      const progressPhotos = photosStr[1] ? JSON.parse(photosStr[1]) : [];
      
      set({
        weightHistory,
        measurements,
        progressPhotos,
        currentWeight: weightHistory[0]?.weight || null,
        currentMeasurements: measurements[0]?.measurements || null,
        isLoading: false
      });
      
      get().calculateProgress();
      
    } catch (error) {
      set({ error: 'Veriler yüklenemedi', isLoading: false });
    }
  },
  
  // Set target weight
  setTargetWeight: async (weight) => {
    try {
      set({ targetWeight: weight });
      await AsyncStorage.setItem('targetWeight', weight.toString());
      get().calculateProgress();
    } catch (error) {
      set({ error: 'Hedef kilo ayarlanamadı' });
    }
  },
  
  // Delete entries
  deleteWeightEntry: async (id) => {
    try {
      const { weightHistory } = get();
      const updatedHistory = weightHistory.filter(entry => entry.id !== id);
      
      set({ 
        weightHistory: updatedHistory,
        currentWeight: updatedHistory[0]?.weight || null 
      });
      
      await AsyncStorage.setItem('weightHistory', JSON.stringify(updatedHistory));
      get().calculateProgress();
    } catch (error) {
      set({ error: 'Kilo verisi silinemedi' });
    }
  },
  
  deletePhoto: async (id) => {
    try {
      const { progressPhotos } = get();
      const updatedPhotos = progressPhotos.filter(photo => photo.id !== id);
      
      set({ progressPhotos: updatedPhotos });
      await AsyncStorage.setItem('progressPhotos', JSON.stringify(updatedPhotos));
    } catch (error) {
      set({ error: 'Fotoğraf silinemedi' });
    }
  },
  
  // Reset all data
  resetProgressData: async () => {
    try {
      set({
        weightHistory: [],
        currentWeight: null,
        targetWeight: null,
        measurements: [],
        currentMeasurements: null,
        progressPhotos: [],
        totalWeightLoss: 0,
        weeklyProgress: 0,
        monthlyProgress: 0,
      });
      
      await AsyncStorage.multiRemove([
        'weightHistory',
        'measurements', 
        'progressPhotos',
        'targetWeight'
      ]);
    } catch (error) {
      set({ error: 'Veriler sıfırlanamadı' });
    }
  }
})); 