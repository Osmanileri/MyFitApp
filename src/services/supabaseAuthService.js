// Supabase Authentication Service
import { supabase } from "../config/supabase";
import * as SecureStore from "expo-secure-store";

/**
 * Supabase Authentication Service
 * Handles all authentication-related operations
 */
class SupabaseAuthService {
  // ============================================
  // SIGN UP (Email/Password Registration)
  // ============================================

  async signUp(email, password, fullName) {
    try {
      // Validate inputs
      if (!email || !password) {
        return {
          success: false,
          error: "Email and password are required",
        };
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: true,
          requiresEmailVerification: true,
          user: data.user,
          message: "Please check your email to verify your account",
        };
      }

      // If session exists, create user profile
      if (data.session) {
        await this.createUserProfile(data.user.id, fullName, email);

        // Store session securely
        await this.storeSession(data.session);

        return {
          success: true,
          user: data.user,
          session: data.session,
          message: "Registration successful",
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("SignUp error:", error);
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  }

  // ============================================
  // SIGN IN (Email/Password Login)
  // ============================================

  async signIn(email, password) {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: "Email and password are required",
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Store session securely
      if (data.session) {
        await this.storeSession(data.session);
      }

      // Get user profile
      const profile = await this.getUserProfile(data.user.id);

      return {
        success: true,
        user: data.user,
        profile,
        session: data.session,
        message: "Login successful",
      };
    } catch (error) {
      console.error("SignIn error:", error);
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  }

  // ============================================
  // SIGN OUT (Logout)
  // ============================================

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Clear stored session
      await this.clearSession();

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("SignOut error:", error);
      return {
        success: false,
        error: error.message || "Logout failed",
      };
    }
  }

  // ============================================
  // PASSWORD RESET
  // ============================================

  async sendPasswordResetEmail(email) {
    try {
      if (!email) {
        return {
          success: false,
          error: "Email is required",
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "myfitapp://auth/reset-password",
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Password reset email sent. Please check your inbox.",
      };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        error: error.message || "Failed to send reset email",
      };
    }
  }

  async updatePassword(newPassword) {
    try {
      if (!newPassword) {
        return {
          success: false,
          error: "New password is required",
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Password updated successfully",
      };
    } catch (error) {
      console.error("Update password error:", error);
      return {
        success: false,
        error: error.message || "Failed to update password",
      };
    }
  }

  // ============================================
  // GOOGLE OAUTH (Sign in with Google)
  // ============================================

  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "myfitapp://auth/callback",
          skipBrowserRedirect: false,
          queryParams: {
            // Request standard scopes
            scope: "openid email profile",
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
        message: "Google sign-in initiated",
      };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return {
        success: false,
        error: error.message || "Google sign-in failed",
      };
    }
  }

  // Handle OAuth redirect URL and finalize session (mobile deep link)
  async handleOpenURL(url) {
    try {
      // Supabase JS v2 handles session automatically when app is resumed
      // We still fetch current session to update our state if needed
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!session) {
        return {
          success: false,
          error: "No active session after OAuth redirect",
        };
      }

      // Persist session securely
      await this.storeSession(session);

      return { success: true, session };
    } catch (error) {
      console.error("HandleOpenURL error:", error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        session,
      };
    } catch (error) {
      console.error("Get session error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ============================================
  // USER PROFILE MANAGEMENT
  // ============================================

  async createUserProfile(userId, fullName, email) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert([
          {
            user_id: userId,
            full_name: fullName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Create profile error:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        profile: data,
      };
    } catch (error) {
      console.error("Create user profile error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        // If profile doesn't exist, return null (not an error)
        if (error.code === "PGRST116") {
          return {
            success: true,
            profile: null,
          };
        }

        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        profile: data,
      };
    } catch (error) {
      console.error("Get user profile error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        profile: data,
      };
    } catch (error) {
      console.error("Update user profile error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ============================================
  // SECURE TOKEN STORAGE (Expo SecureStore)
  // ============================================

  async storeSession(session) {
    try {
      await SecureStore.setItemAsync(
        "supabase_session",
        JSON.stringify(session)
      );
      await SecureStore.setItemAsync(
        "supabase_access_token",
        session.access_token
      );
      await SecureStore.setItemAsync(
        "supabase_refresh_token",
        session.refresh_token
      );

      return { success: true };
    } catch (error) {
      console.error("Store session error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getStoredSession() {
    try {
      const sessionString = await SecureStore.getItemAsync("supabase_session");

      if (!sessionString) {
        return { success: true, session: null };
      }

      const session = JSON.parse(sessionString);
      return { success: true, session };
    } catch (error) {
      console.error("Get stored session error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async clearSession() {
    try {
      await SecureStore.deleteItemAsync("supabase_session");
      await SecureStore.deleteItemAsync("supabase_access_token");
      await SecureStore.deleteItemAsync("supabase_refresh_token");

      return { success: true };
    } catch (error) {
      console.error("Clear session error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ============================================
  // AUTH STATE LISTENER
  // ============================================

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  // ============================================
  // VALIDATION HELPERS
  // ============================================

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
    if (password.length < 8) {
      return { valid: false, error: "Password must be at least 8 characters" };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        error: "Password must contain at least 1 uppercase letter",
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        error: "Password must contain at least 1 lowercase letter",
      };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, error: "Password must contain at least 1 number" };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const supabaseAuthService = new SupabaseAuthService();

// Export individual methods for easier importing
export const {
  signUp,
  signIn,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  signInWithGoogle,
  getSession,
  getCurrentUser,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  onAuthStateChange,
  validateEmail,
  validatePassword,
} = supabaseAuthService;

export default supabaseAuthService;
