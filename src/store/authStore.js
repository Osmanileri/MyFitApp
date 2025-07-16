import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  collection 
} from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';
import sqliteService from '../services/SQLiteService';

// Demo users for local testing
const DEMO_USERS = {
  'demo@fitapp.com': {
    password: 'demo123',
    user: {
      uid: 'demo-user-id',
      email: 'demo@fitapp.com',
      displayName: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      age: 25,
      gender: 'male',
      height: 175,
      weight: 70,
      activityLevel: 'moderate',
      goal: 'maintain'
    }
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Initialize demo database
      initializeDemoDb: async () => {
        try {
          await sqliteService.initializeDatabase();
          console.log('Demo database initialized');
        } catch (error) {
          console.error('Error initializing demo database:', error);
        }
      },
      
      // Initialize all stores for demo user
      initializeAllStores: async () => {
        try {
          // Initialize SQLite database
          await sqliteService.initializeDatabase();
          
          // Initialize individual stores
          const { default: useDietStore } = await import('./dietStore');
          const { default: useWorkoutStore } = await import('./workoutStore');
          const { useProgressStore } = await import('./progressStore');
          const { useReminderStore } = await import('./reminderStore');
          const { default: useRecipeStore } = await import('./recipeStore');
          const { useSupplementStore } = await import('./supplementStore');
          
          // Initialize all stores
          await Promise.all([
            useDietStore.getState().initializeStore(),
            useWorkoutStore.getState().initializeStore(),
            useProgressStore.getState().initializeStore(),
            useReminderStore.getState().initializeStore(),
            useRecipeStore.getState().initializeStore(),
            useSupplementStore.getState().initializeStore()
          ]);
          
          console.log('All stores initialized for demo user');
        } catch (error) {
          console.error('Error initializing stores:', error);
        }
      },

      // Demo login fallback
      loginDemo: async (email, password) => {
        try {
          const demoUser = DEMO_USERS[email];
          if (demoUser && demoUser.password === password) {
            // Demo kullanıcıyı SQLite'a kaydet
            await sqliteService.saveUser(demoUser.user);
            
            set({ 
              user: demoUser.user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            // Initialize all stores for demo user
            await get().initializeAllStores();
            
            console.log('Demo user logged in and all stores initialized');
            return { success: true };
          }
          return { success: false, error: 'Demo kullanıcı bulunamadı' };
        } catch (error) {
          console.error('Demo login error:', error);
          return { success: false, error: 'Demo giriş hatası' };
        }
      },

      // Load demo user from database
      loadDemoUser: async (uid) => {
        try {
          const demoUser = await sqliteService.getUser(uid);
          if (demoUser) {
            set({ 
              user: demoUser, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return demoUser;
          }
          return null;
        } catch (error) {
          console.error('Error loading demo user:', error);
          return null;
        }
      },

      // Register Function
      register: async (email, password, userInfo) => {
        try {
          set({ isLoading: true, error: null });
          
          // Firebase Auth ile kullanıcı oluştur
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Firestore'da user profile oluştur
          const userDocRef = doc(firestore, 'users', user.uid);
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: userInfo.displayName || '',
            firstName: userInfo.firstName || '',
            lastName: userInfo.lastName || '',
            age: userInfo.age || null,
            gender: userInfo.gender || '',
            height: userInfo.height || null,
            weight: userInfo.weight || null,
            activityLevel: userInfo.activityLevel || 'sedentary',
            goal: userInfo.goal || 'maintain',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          // User profile'ı güncelle
          await updateProfile(user, {
            displayName: userInfo.displayName || `${userInfo.firstName} ${userInfo.lastName}`,
          });

          set({ 
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              ...userInfo
            }, 
            isAuthenticated: true, 
            isLoading: false 
          });

          return { success: true };
        } catch (error) {
          console.error('Registration error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Login Function
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          // Önce demo kullanıcısı kontrol et
          const demoResult = await get().loginDemo(email, password);
          if (demoResult.success) {
            return demoResult;
          }
          
          // Firebase auth ile giriş yap
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Firestore'dan user profile'ı al
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();

          set({ 
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              ...userData
            }, 
            isAuthenticated: true, 
            isLoading: false 
          });

          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Logout Function
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Demo kullanıcısı ise sadece local state'i temizle
          const currentUser = get().user;
          if (currentUser && currentUser.uid === 'demo-user-id') {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return { success: true };
          }
          
          // Firebase auth'dan çıkış yap
          await signOut(auth);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Logout error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Reset Password Function
      resetPassword: async (email) => {
        try {
          set({ isLoading: true, error: null });
          
          // Demo kullanıcısı için özel mesaj
          if (DEMO_USERS[email]) {
            set({ isLoading: false });
            return { success: true, message: 'Demo kullanıcı şifresi: demo123' };
          }
          
          await sendPasswordResetEmail(auth, email);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Reset password error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Update Profile Function
      updateProfile: async (userInfo) => {
        try {
          set({ isLoading: true, error: null });
          const currentUser = get().user;
          
          if (!currentUser) throw new Error('No user logged in');

          // Demo kullanıcısı için local update ve SQLite'a kaydet
          if (currentUser.uid === 'demo-user-id') {
            const updatedUser = { ...currentUser, ...userInfo };
            await sqliteService.saveUser(updatedUser);
            
            set({ 
              user: updatedUser, 
              isLoading: false 
            });
            return { success: true };
          }

          // Firestore'da profile güncelle
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          await updateDoc(userDocRef, {
            ...userInfo,
            updatedAt: serverTimestamp(),
          });

          // Local state'i güncelle
          set({ 
            user: { ...currentUser, ...userInfo }, 
            isLoading: false 
          });

          return { success: true };
        } catch (error) {
          console.error('Update profile error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Initialize Auth State
      initializeAuth: () => {
        try {
          return onAuthStateChanged(auth, async (user) => {
            // Demo kullanıcı giriş yapmışsa Firebase Auth state'ini ignore et
            const currentUser = get().user;
            if (currentUser && currentUser.uid === 'demo-user-id') {
              return; // Demo kullanıcı için Firebase Auth state'ini ignore et
            }
            
            if (user) {
              try {
                // Firestore'dan user data al
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();
                
                set({ 
                  user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    ...userData
                  }, 
                  isAuthenticated: true, 
                  isLoading: false 
                });
              } catch (error) {
                console.error('Error fetching user data:', error);
                set({ error: error.message, isLoading: false });
              }
            } else {
              // Sadece demo kullanıcı giriş yapmamışsa logout yap
              const currentUser = get().user;
              if (!currentUser || currentUser.uid !== 'demo-user-id') {
                set({ user: null, isAuthenticated: false, isLoading: false });
              }
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
          return () => {}; // Return empty unsubscribe function
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore; 