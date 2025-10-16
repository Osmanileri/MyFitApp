import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sqliteService from "../services/SQLiteService";
import supabaseAuthService from "../services/supabaseAuthService";

// Demo mode flag - set to false to use Supabase
const DEMO_MODE = false;

// Demo users for local testing (only when DEMO_MODE = true)
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

      // Register Function - Supabase Integration
      register: async (email, password, userInfo) => {
        try {
          set({ isLoading: true, error: null });

          // Validate password strength
          const passwordValidation =
            supabaseAuthService.validatePassword(password);
          if (!passwordValidation.valid) {
            set({ error: passwordValidation.error, isLoading: false });
            return { success: false, error: passwordValidation.error };
          }

          // Validate email
          if (!supabaseAuthService.validateEmail(email)) {
            set({ error: "Invalid email format", isLoading: false });
            return { success: false, error: "Invalid email format" };
          }

          // Supabase Auth Sign Up
          const fullName =
            userInfo.displayName ||
            `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim();
          const result = await supabaseAuthService.signUp(
            email,
            password,
            fullName
          );

          if (!result.success) {
            set({
              error: result.error,
              isLoading: false,
            });
            return {
              success: false,
              error: result.error,
            };
          }

          // If email verification is required
          if (result.requiresEmailVerification) {
            set({ isLoading: false });
            return {
              success: true,
              requiresEmailVerification: true,
              message: result.message,
            };
          }

          // Set user state with Supabase user data
          const userData = {
            uid: result.user.id,
            email: result.user.email,
            displayName: fullName,
            ...userInfo,
          };

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          // Initialize all stores for the new user
          await get().initializeAllStores();

          console.log("✅ Registration successful with Supabase");
          return { success: true, user: userData };
        } catch (error) {
          console.error("Registration error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Login Function - Supabase Integration
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          // Demo mode fallback
          if (DEMO_MODE) {
            const demoResult = await get().loginDemo(email, password);
            if (demoResult.success) {
              return demoResult;
            }
          }

          // Supabase Auth Sign In
          const result = await supabaseAuthService.signIn(email, password);

          if (!result.success) {
            set({
              error: result.error,
              isLoading: false,
            });
            return {
              success: false,
              error: result.error,
            };
          }

          // Set user state with Supabase user data
          const userData = {
            uid: result.user.id,
            email: result.user.email,
            displayName:
              result.profile?.full_name ||
              result.user.user_metadata?.full_name ||
              "",
            ...result.profile,
          };

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          // Initialize all stores for the user
          await get().initializeAllStores();

          console.log("✅ Login successful with Supabase");
          return { success: true, user: userData };
        } catch (error) {
          console.error("Login error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Logout Function - Supabase Integration
      logout: async () => {
        try {
          set({ isLoading: true });

          // Supabase Sign Out
          if (!DEMO_MODE) {
            const result = await supabaseAuthService.signOut();
            if (!result.success) {
              console.error("Logout error:", result.error);
            }
          }

          // Clear local state
          set({ user: null, isAuthenticated: false, isLoading: false });

          console.log("✅ Logout successful");
          return { success: true };
        } catch (error) {
          console.error("Logout error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Reset Password Function - Supabase Integration
      resetPassword: async (email) => {
        try {
          set({ isLoading: true, error: null });

          // Demo mode fallback
          if (DEMO_MODE && DEMO_USERS[email]) {
            set({ isLoading: false });
            return {
              success: true,
              message: "Demo kullanıcı şifresi: demo123",
            };
          }

          // Validate email
          if (!supabaseAuthService.validateEmail(email)) {
            set({ error: "Invalid email format", isLoading: false });
            return { success: false, error: "Invalid email format" };
          }

          // Supabase Send Password Reset Email
          const result = await supabaseAuthService.sendPasswordResetEmail(
            email
          );

          set({ isLoading: false });

          if (!result.success) {
            set({ error: result.error });
            return { success: false, error: result.error };
          }

          console.log("✅ Password reset email sent");
          return { success: true, message: result.message };
        } catch (error) {
          console.error("Reset password error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Update Profile Function - Supabase Integration
      updateProfile: async (userInfo) => {
        try {
          set({ isLoading: true, error: null });
          const currentUser = get().user;

          if (!currentUser) throw new Error("No user logged in");

          // Demo mode fallback
          if (DEMO_MODE && currentUser.uid === "demo-user-id") {
            const updatedUser = { ...currentUser, ...userInfo };
            await sqliteService.saveUser(updatedUser);

            set({
              user: updatedUser,
              isLoading: false,
            });
            console.log("✅ Demo profile updated");
            return { success: true };
          }

          // Supabase Update User Profile
          const result = await supabaseAuthService.updateUserProfile(
            currentUser.uid,
            userInfo
          );

          if (!result.success) {
            set({ error: result.error, isLoading: false });
            return { success: false, error: result.error };
          }

          // Update local state
          const updatedUser = { ...currentUser, ...userInfo };
          set({
            user: updatedUser,
            isLoading: false,
          });

          console.log("✅ Profile updated with Supabase");
          return { success: true, profile: result.profile };
        } catch (error) {
          console.error("Update profile error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Initialize Auth State - Supabase Integration
      initializeAuth: () => {
        try {
          // Supabase Auth State Listener
          const { data: authListener } = supabaseAuthService.onAuthStateChange(
            async (event, session) => {
              console.log("🔐 Auth state changed:", event);

              // Demo mode - ignore Supabase auth state
              const currentUser = get().user;
              if (
                DEMO_MODE &&
                currentUser &&
                currentUser.uid === "demo-user-id"
              ) {
                return;
              }

              if (event === "SIGNED_IN" && session) {
                try {
                  // Get user profile from Supabase
                  const profileResult =
                    await supabaseAuthService.getUserProfile(session.user.id);

                  const userData = {
                    uid: session.user.id,
                    email: session.user.email,
                    displayName:
                      profileResult.profile?.full_name ||
                      session.user.user_metadata?.full_name ||
                      "",
                    ...profileResult.profile,
                  };

                  set({
                    user: userData,
                    isAuthenticated: true,
                    isLoading: false,
                  });

                  // Initialize all stores
                  await get().initializeAllStores();

                  console.log("✅ User authenticated and stores initialized");
                } catch (error) {
                  console.error("Error fetching user data:", error);
                  set({ error: error.message, isLoading: false });
                }
              } else if (event === "SIGNED_OUT") {
                // Only logout if not demo user
                const currentUser = get().user;
                if (
                  !DEMO_MODE ||
                  !currentUser ||
                  currentUser.uid !== "demo-user-id"
                ) {
                  set({ user: null, isAuthenticated: false, isLoading: false });
                  console.log("✅ User signed out");
                }
              } else if (event === "TOKEN_REFRESHED") {
                console.log("🔄 Session token refreshed");
              }
            }
          );

          // Return unsubscribe function
          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ isLoading: false });
          return () => {}; // Return empty unsubscribe function
        }
      },

      // Google Sign In - Supabase Integration
      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });

          const result = await supabaseAuthService.signInWithGoogle();

          if (!result.success) {
            set({ error: result.error, isLoading: false });
            return { success: false, error: result.error };
          }

          // OAuth flow will handle the redirect and auth state change
          set({ isLoading: false });
          console.log("✅ Google sign-in initiated");
          return { success: true, message: result.message };
        } catch (error) {
          console.error("Google sign-in error:", error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Check Session on App Start
      checkSession: async () => {
        try {
          set({ isLoading: true });

          const result = await supabaseAuthService.getSession();

          if (result.success && result.session) {
            // Get user profile
            const profileResult = await supabaseAuthService.getUserProfile(
              result.session.user.id
            );

            const userData = {
              uid: result.session.user.id,
              email: result.session.user.email,
              displayName: profileResult.profile?.full_name || "",
              ...profileResult.profile,
            };

            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });

            console.log("✅ Session restored");
            return { success: true, user: userData };
          }

          set({ isLoading: false });
          return { success: false };
        } catch (error) {
          console.error("Check session error:", error);
          set({ isLoading: false });
          return { success: false, error: error.message };
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
