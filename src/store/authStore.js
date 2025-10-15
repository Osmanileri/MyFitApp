import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../services/authService";
import sqliteService from "../services/SQLiteService";

// Demo users for local testing
const DEMO_USERS = {
  "demo@fitapp.com": {
    password: "demo123",
    user: {
      uid: "demo-user-id",
      email: "demo@fitapp.com",
      displayName: "Demo User",
      firstName: "Demo",
      lastName: "User",
      age: 25,
      gender: "male",
      height: 175,
      weight: 70,
      activityLevel: "moderate",
      goal: "maintain",
    },
  },
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
          console.log("Demo database initialized");
        } catch (error) {
          console.error("Error initializing demo database:", error);
        }
      },

      // Initialize all stores for demo user
      initializeAllStores: async () => {
        try {
          // Initialize SQLite database
          await sqliteService.initializeDatabase();

          // Initialize individual stores
          const { default: useDietStore } = await import("./dietStore");
          const { default: useWorkoutStore } = await import("./workoutStore");
          const { useProgressStore } = await import("./progressStore");
          const { useReminderStore } = await import("./reminderStore");
          const { default: useRecipeStore } = await import("./recipeStore");
          const { useSupplementStore } = await import("./supplementStore");

          // Initialize all stores
          await Promise.all([
            useDietStore.getState().initializeStore(),
            useWorkoutStore.getState().initializeStore(),
            useProgressStore.getState().initializeStore(),
            useReminderStore.getState().initializeStore(),
            useRecipeStore.getState().initializeStore(),
            useSupplementStore.getState().initializeStore(),
          ]);

          console.log("All stores initialized for demo user");
        } catch (error) {
          console.error("Error initializing stores:", error);
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
              isLoading: false,
            });

            // Initialize all stores for demo user
            await get().initializeAllStores();

            console.log("Demo user logged in and all stores initialized");
            return { success: true };
          }
          return { success: false, error: "Demo kullanıcı bulunamadı" };
        } catch (error) {
          console.error("Demo login error:", error);
          return { success: false, error: "Demo giriş hatası" };
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
              isLoading: false,
            });
            return demoUser;
          }
          return null;
        } catch (error) {
          console.error("Error loading demo user:", error);
          return null;
        }
      },

      // Register Function (uses local AuthService)
      register: async (email, password, userInfo) => {
        try {
          set({ isLoading: true, error: null });

          const name =
            userInfo?.displayName ||
            `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`.trim();
          const registerResult = await AuthService.register({
            name,
            email,
            password,
            confirmPassword: password,
          });

          if (!registerResult.success || !registerResult.user) {
            const errMsg = registerResult.error || "Kayıt başarısız";
            set({ error: errMsg, isLoading: false });
            return { success: false, error: errMsg };
          }

          // Persist additional profile fields
          if (userInfo && Object.keys(userInfo).length > 0) {
            const profileResult = await AuthService.updateProfile({
              displayName: userInfo.displayName || name,
              firstName: userInfo.firstName || "",
              lastName: userInfo.lastName || "",
              age: userInfo.age || null,
              gender: userInfo.gender || "",
              height: userInfo.height || null,
              weight: userInfo.weight || null,
              activityLevel: userInfo.activityLevel || "sedentary",
              goal: userInfo.goal || "maintain",
            });

            if (profileResult.success && profileResult.user) {
              set({
                user: profileResult.user,
                isAuthenticated: true,
                isLoading: false,
              });
              return { success: true };
            }
          }

          // Fallback: set user from register result
          set({
            user: registerResult.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          console.error("Registration error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Login Function (uses local AuthService)
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          // Önce demo kullanıcısı kontrol et
          const demoResult = await get().loginDemo(email, password);
          if (demoResult.success) {
            return demoResult;
          }

          const result = await AuthService.login({ email, password });
          if (!result.success || !result.user) {
            const errMsg = result.error || "Giriş yapılamadı";
            set({ error: errMsg, isLoading: false });
            return { success: false, error: errMsg };
          }

          set({ user: result.user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error("Login error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Logout Function (uses local AuthService)
      logout: async () => {
        try {
          set({ isLoading: true });

          // Demo kullanıcısı ise sadece local state'i temizle
          const currentUser = get().user;
          if (currentUser && currentUser.uid === "demo-user-id") {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return { success: true };
          }

          await AuthService.logout();
          set({ user: null, isAuthenticated: false, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error("Logout error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Reset Password Function (uses local AuthService)
      resetPassword: async (email) => {
        try {
          set({ isLoading: true, error: null });

          // Demo kullanıcısı için özel mesaj
          if (DEMO_USERS[email]) {
            set({ isLoading: false });
            return {
              success: true,
              message: "Demo kullanıcı şifresi: demo123",
            };
          }

          const result = await AuthService.resetPassword(email);
          set({ isLoading: false });
          return result;
        } catch (error) {
          console.error("Reset password error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Update Profile Function (uses local AuthService)
      updateProfile: async (userInfo) => {
        try {
          set({ isLoading: true, error: null });
          const currentUser = get().user;

          if (!currentUser) throw new Error("No user logged in");

          // Demo kullanıcısı için local update ve SQLite'a kaydet
          if (currentUser.uid === "demo-user-id") {
            const updatedUser = { ...currentUser, ...userInfo };
            await sqliteService.saveUser(updatedUser);

            set({ user: updatedUser, isLoading: false });
            return { success: true };
          }

          const result = await AuthService.updateProfile({ ...userInfo });
          if (result.success && result.user) {
            set({ user: result.user, isLoading: false });
            return { success: true };
          }

          // Fallback local update
          set({ user: { ...currentUser, ...userInfo }, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error("Update profile error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Initialize Auth State (uses local AuthService)
      initializeAuth: () => {
        try {
          (async () => {
            const currentUser = await AuthService.getCurrentUser();
            if (currentUser) {
              set({
                user: currentUser,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({ isLoading: false });
            }
          })();
          return () => {}; // no-op unsubscribe
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ isLoading: false });
          return () => {}; // Return empty unsubscribe function
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
