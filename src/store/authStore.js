import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const USER_TOKEN_KEY = 'user_token';
const USER_PROFILE_KEY = 'user_profile';
const USER_PREFERENCES_KEY = 'user_preferences';
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

// Mock user data for demo purposes
const DEMO_USERS = [
  {
    id: '1',
    email: 'demo@fitapp.com',
    password: 'demo123',
    name: 'Demo Kullanıcı',
    firstName: 'Demo',
    lastName: 'Kullanıcı',
    avatar: null,
    phone: '+90 555 123 4567',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'test@fitapp.com',
    password: 'test123',
    name: 'Test Kullanıcı',
    firstName: 'Test',
    lastName: 'Kullanıcı',
    avatar: null,
    phone: '+90 555 987 6543',
    dateOfBirth: '1985-06-15',
    gender: 'female',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Default user preferences
const DEFAULT_PREFERENCES = {
  theme: 'light',
  language: 'tr',
  notifications: {
    mealReminders: true,
    waterReminders: true,
    workoutReminders: true,
    progressUpdates: true,
    newsletter: false
  },
  units: {
    weight: 'kg',
    height: 'cm',
    temperature: 'celsius',
    distance: 'km'
  },
  privacy: {
    profileVisible: true,
    activityVisible: false,
    shareProgress: false
  }
};

// Default nutrition goals based on general recommendations
const DEFAULT_NUTRITION_GOALS = {
  calories: 2000,
  protein: 150, // grams
  carbs: 250,   // grams
  fat: 67,      // grams
  water: 2.5,   // liters
  fiber: 25,    // grams
  sugar: 50     // grams
};

// Activity levels for calorie calculation
const ACTIVITY_LEVELS = {
  sedentary: 1.2,      // Little or no exercise
  lightly_active: 1.375, // Light exercise 1-3 days/week
  moderately_active: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725,   // Hard exercise 6-7 days/week
  extremely_active: 1.9 // Very hard exercise, physical job
};

export const useAuthStore = create((set, get) => ({
  // Auth State
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  error: null,

  // Profile State
  profile: null,
  preferences: DEFAULT_PREFERENCES,
  nutritionGoals: DEFAULT_NUTRITION_GOALS,

  // Onboarding State
  isOnboardingCompleted: false,
  onboardingStep: 0,

  // Loading States
  isLoginLoading: false,
  isRegisterLoading: false,
  isProfileLoading: false,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Initialize app - check for existing session
  initializeApp: async () => {
    set({ isLoading: true });
    try {
      const [token, userProfile, preferences, onboardingCompleted] = await AsyncStorage.multiGet([
        USER_TOKEN_KEY,
        USER_PROFILE_KEY,
        USER_PREFERENCES_KEY,
        ONBOARDING_COMPLETED_KEY
      ]);

      const tokenValue = token[1];
      const profileValue = userProfile[1] ? JSON.parse(userProfile[1]) : null;
      const preferencesValue = preferences[1] ? JSON.parse(preferences[1]) : DEFAULT_PREFERENCES;
      const onboardingValue = onboardingCompleted[1] === 'true';

      if (tokenValue && profileValue) {
        // Validate token (in real app, verify with server)
        const isValidToken = await get().validateToken(tokenValue);
        
        if (isValidToken) {
          set({
            isAuthenticated: true,
            token: tokenValue,
            user: profileValue,
            profile: profileValue,
            preferences: preferencesValue,
            isOnboardingCompleted: onboardingValue,
            nutritionGoals: profileValue.nutritionGoals || DEFAULT_NUTRITION_GOALS
          });
        } else {
          await get().logout();
        }
      }
    } catch (error) {
      console.error('App initialization error:', error);
      set({ error: 'Uygulama başlatılırken hata oluştu' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Validate token (mock implementation)
  validateToken: async (token) => {
    try {
      // In real app, this would make an API call to validate the token
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return token && token.length > 0;
    } catch (error) {
      return false;
    }
  },

  // Login with email and password
  login: async (email, password) => {
    set({ isLoginLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in demo data
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      if (user.password !== password) {
        throw new Error('Şifre hatalı');
      }

      // Generate mock token
      const token = `token_${user.id}_${Date.now()}`;

      // Save to storage
      await AsyncStorage.multiSet([
        [USER_TOKEN_KEY, token],
        [USER_PROFILE_KEY, JSON.stringify(user)]
      ]);

      set({
        isAuthenticated: true,
        user,
        profile: user,
        token,
        isLoginLoading: false
      });

      return { success: true, user };

    } catch (error) {
      const errorMessage = error.message || 'Giriş yapılırken hata oluştu';
      set({ error: errorMessage, isLoginLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Register new user
  register: async (userData) => {
    set({ isRegisterLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Check if email already exists
      const existingUser = DEMO_USERS.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        throw new Error('Bu e-posta adresi zaten kayıtlı');
      }

      // Validate required fields
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('Lütfen tüm zorunlu alanları doldurun');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Geçerli bir e-posta adresi girin');
      }

      // Validate password strength
      if (userData.password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email: userData.email.toLowerCase(),
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: null,
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        createdAt: new Date().toISOString()
      };

      // Generate token
      const token = `token_${newUser.id}_${Date.now()}`;

      // Save to storage
      await AsyncStorage.multiSet([
        [USER_TOKEN_KEY, token],
        [USER_PROFILE_KEY, JSON.stringify(newUser)]
      ]);

      // Add to demo users for future logins
      DEMO_USERS.push(newUser);

      set({
        isAuthenticated: true,
        user: newUser,
        profile: newUser,
        token,
        isRegisterLoading: false
      });

      return { success: true, user: newUser };

    } catch (error) {
      const errorMessage = error.message || 'Kayıt olurken hata oluştu';
      set({ error: errorMessage, isRegisterLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Clear storage
      await AsyncStorage.multiRemove([
        USER_TOKEN_KEY,
        USER_PROFILE_KEY,
        USER_PREFERENCES_KEY
      ]);

      set({
        isAuthenticated: false,
        user: null,
        profile: null,
        token: null,
        error: null,
        preferences: DEFAULT_PREFERENCES,
        nutritionGoals: DEFAULT_NUTRITION_GOALS
      });

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Çıkış yapılırken hata oluştu' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    set({ isProfileLoading: true, error: null });
    
    try {
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedUser = {
        ...currentUser,
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      // Update storage
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        profile: updatedUser,
        isProfileLoading: false
      });

      return { success: true, user: updatedUser };

    } catch (error) {
      const errorMessage = error.message || 'Profil güncellenirken hata oluştu';
      set({ error: errorMessage, isProfileLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update user preferences
  updatePreferences: async (newPreferences) => {
    try {
      const updatedPreferences = {
        ...get().preferences,
        ...newPreferences
      };

      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updatedPreferences));
      set({ preferences: updatedPreferences });

      return { success: true };
    } catch (error) {
      console.error('Preferences update error:', error);
      return { success: false, error: 'Ayarlar güncellenirken hata oluştu' };
    }
  },

  // Update nutrition goals
  updateNutritionGoals: async (goals) => {
    try {
      const updatedGoals = {
        ...get().nutritionGoals,
        ...goals
      };

      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          nutritionGoals: updatedGoals
        };
        
        await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedUser));
        set({ 
          user: updatedUser,
          profile: updatedUser,
          nutritionGoals: updatedGoals 
        });
      } else {
        set({ nutritionGoals: updatedGoals });
      }

      return { success: true };
    } catch (error) {
      console.error('Nutrition goals update error:', error);
      return { success: false, error: 'Beslenme hedefleri güncellenirken hata oluştu' };
    }
  },

  // Calculate nutrition goals based on user profile
  calculateNutritionGoals: (profile) => {
    try {
      const { weight, height, age, gender, activityLevel, goal } = profile;
      
      if (!weight || !height || !age) {
        return DEFAULT_NUTRITION_GOALS;
      }

      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr;
      if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }

      // Apply activity level multiplier
      const activityMultiplier = ACTIVITY_LEVELS[activityLevel] || ACTIVITY_LEVELS.moderately_active;
      let tdee = bmr * activityMultiplier;

      // Adjust for goal
      switch (goal) {
        case 'lose_weight':
          tdee *= 0.85; // 15% deficit
          break;
        case 'gain_weight':
          tdee *= 1.15; // 15% surplus
          break;
        case 'maintain_weight':
        default:
          // Keep TDEE as is
          break;
      }

      // Calculate macros (protein: 25%, fat: 30%, carbs: 45%)
      const protein = Math.round((tdee * 0.25) / 4); // 4 cal per gram
      const fat = Math.round((tdee * 0.30) / 9);     // 9 cal per gram
      const carbs = Math.round((tdee * 0.45) / 4);   // 4 cal per gram

      // Calculate water needs (35ml per kg body weight)
      const water = Math.round((weight * 35) / 1000 * 10) / 10; // Round to 1 decimal

      return {
        calories: Math.round(tdee),
        protein,
        carbs,
        fat,
        water,
        fiber: 25,
        sugar: Math.round(tdee * 0.1 / 4) // 10% of calories from sugar
      };

    } catch (error) {
      console.error('Nutrition calculation error:', error);
      return DEFAULT_NUTRITION_GOALS;
    }
  },

  // Complete onboarding
  completeOnboarding: async (onboardingData) => {
    try {
      // Calculate nutrition goals based on profile data
      const calculatedGoals = get().calculateNutritionGoals(onboardingData);

      // Update user profile with onboarding data
      const currentUser = get().user;
      const updatedUser = {
        ...currentUser,
        ...onboardingData,
        nutritionGoals: calculatedGoals,
        onboardingCompletedAt: new Date().toISOString()
      };

      // Save to storage
      await AsyncStorage.multiSet([
        [USER_PROFILE_KEY, JSON.stringify(updatedUser)],
        [ONBOARDING_COMPLETED_KEY, 'true']
      ]);

      set({
        user: updatedUser,
        profile: updatedUser,
        nutritionGoals: calculatedGoals,
        isOnboardingCompleted: true,
        onboardingStep: 0
      });

      return { success: true };
    } catch (error) {
      console.error('Onboarding completion error:', error);
      return { success: false, error: 'Profil tamamlanırken hata oluştu' };
    }
  },

  // Reset onboarding
  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      set({ isOnboardingCompleted: false, onboardingStep: 0 });
      return { success: true };
    } catch (error) {
      console.error('Onboarding reset error:', error);
      return { success: false };
    }
  },

  // Update onboarding step
  setOnboardingStep: (step) => set({ onboardingStep: step }),

  // Password reset (mock implementation)
  resetPassword: async (email) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email exists
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('Bu e-posta adresi kayıtlı değil');
      }

      // In real app, this would send an email
      console.log(`Password reset email sent to: ${email}`);

      return { success: true, message: 'Şifre sıfırlama e-postası gönderildi' };
    } catch (error) {
      const errorMessage = error.message || 'Şifre sıfırlama e-postası gönderilemedi';
      return { success: false, error: errorMessage };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Verify current password (in demo, check against stored password)
      const storedUser = DEMO_USERS.find(u => u.id === currentUser.id);
      if (!storedUser || storedUser.password !== currentPassword) {
        throw new Error('Mevcut şifre hatalı');
      }

      if (newPassword.length < 6) {
        throw new Error('Yeni şifre en az 6 karakter olmalıdır');
      }

      // Update password
      storedUser.password = newPassword;
      const updatedUser = { ...currentUser, password: newPassword };

      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedUser));
      set({ user: updatedUser, profile: updatedUser });

      return { success: true, message: 'Şifre başarıyla değiştirildi' };
    } catch (error) {
      const errorMessage = error.message || 'Şifre değiştirilirken hata oluştu';
      return { success: false, error: errorMessage };
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify password
      const storedUser = DEMO_USERS.find(u => u.id === currentUser.id);
      if (!storedUser || storedUser.password !== password) {
        throw new Error('Şifre hatalı');
      }

      // Remove user from demo data
      const userIndex = DEMO_USERS.findIndex(u => u.id === currentUser.id);
      if (userIndex > -1) {
        DEMO_USERS.splice(userIndex, 1);
      }

      // Clear all local data
      await AsyncStorage.multiRemove([
        USER_TOKEN_KEY,
        USER_PROFILE_KEY,
        USER_PREFERENCES_KEY,
        ONBOARDING_COMPLETED_KEY
      ]);

      // Reset state
      set({
        isAuthenticated: false,
        user: null,
        profile: null,
        token: null,
        error: null,
        preferences: DEFAULT_PREFERENCES,
        nutritionGoals: DEFAULT_NUTRITION_GOALS,
        isOnboardingCompleted: false,
        onboardingStep: 0
      });

      return { success: true, message: 'Hesap başarıyla silindi' };
    } catch (error) {
      const errorMessage = error.message || 'Hesap silinirken hata oluştu';
      return { success: false, error: errorMessage };
    }
  }
})); 