import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create((set, get) => ({
  // State
  profile: {
    name: '',
    age: null,
    gender: '',
    height: null,
    weight: null,
    activityLevel: '',
    fitnessGoal: '',
    targetWeight: null,
    dailyCalorieGoal: null,
    dailyWaterGoal: 2.5, // litre
  },
  settings: {
    notifications: true,
    darkMode: false,
    language: 'tr',
    units: 'metric', // metric veya imperial
  },
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  // Profil güncelleme
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = { ...get().profile, ...profileData };
      set({ profile: updatedProfile });
      
      // AsyncStorage'a kaydet
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: 'Profil güncelleme hatası: ' + error.message, 
        isLoading: false 
      });
      return false;
    }
  },

  // Ayarlar güncelleme
  updateSettings: async (settingsData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSettings = { ...get().settings, ...settingsData };
      set({ settings: updatedSettings });
      
      // AsyncStorage'a kaydet
      await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: 'Ayar güncelleme hatası: ' + error.message, 
        isLoading: false 
      });
      return false;
    }
  },

  // Profil yükleme
  loadProfile: async () => {
    try {
      const profileStr = await AsyncStorage.getItem('userProfile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        set({ profile });
      }
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
    }
  },

  // Ayarlar yükleme
  loadSettings: async () => {
    try {
      const settingsStr = await AsyncStorage.getItem('userSettings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        set({ settings });
      }
    } catch (error) {
      console.error('Ayar yükleme hatası:', error);
    }
  },

  // Günlük kalori hedefini hesapla
  calculateDailyCalorieGoal: () => {
    const { profile } = get();
    if (!profile.weight || !profile.height || !profile.age || !profile.gender || !profile.activityLevel) {
      return null;
    }

    // Basit BMR hesaplama (Harris-Benedict formülü)
    let bmr;
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    // Aktivite seviyesine göre çarpan
    const activityMultipliers = {
      sedentary: 1.2,      // Hareketsiz
      lightly: 1.375,      // Hafif aktif
      moderately: 1.55,    // Orta aktif
      very: 1.725,         // Çok aktif
      extra: 1.9           // Ekstra aktif
    };

    const tdee = bmr * activityMultipliers[profile.activityLevel] || 1.2;

    // Hedef türüne göre kalori ayarlama
    let targetCalories = tdee;
    if (profile.fitnessGoal === 'weight_loss') {
      targetCalories = tdee - 500; // Günlük 500 kalori açık
    } else if (profile.fitnessGoal === 'muscle_gain') {
      targetCalories = tdee + 300; // Günlük 300 kalori fazla
    }

    return Math.round(targetCalories);
  },

  // Profil tamamlama kontrolü
  isProfileComplete: () => {
    const { profile } = get();
    return !!(profile.name && profile.age && profile.gender && profile.height && 
              profile.weight && profile.activityLevel && profile.fitnessGoal);
  },

  // Tüm kullanıcı verilerini yükle
  initializeUser: async () => {
    await Promise.all([
      get().loadProfile(),
      get().loadSettings()
    ]);
  }
})); 