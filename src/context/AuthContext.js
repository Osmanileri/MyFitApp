import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/authService';

const AuthContext = createContext(undefined);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // useEffect with isMounted pattern for better lifecycle management
  useEffect(() => {
    let isMounted = true;
    
    const checkAuthStatus = async () => {
      try {
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: true });
        }
        
        const user = await AuthService.getCurrentUser();
        
        if (isMounted) {
          if (user) {
            dispatch({ type: 'SET_USER', payload: user });
          } else {
            // Otomatik demo girişi kontrolü
            const autoLoginDisabled = await AsyncStorage.getItem('autoLoginDisabled');
            
            if (!autoLoginDisabled) {
              // Otomatik demo girişi - geliştirme aşaması için
              console.log('Kullanıcı bulunamadı, otomatik demo girişi yapılıyor...');
              const demoResult = await AuthService.login({ 
                email: 'demo@fitapp.com', 
                password: 'demo123' 
              });
              
              if (isMounted && demoResult.success && demoResult.user) {
                dispatch({ type: 'SET_USER', payload: demoResult.user });
                console.log('Demo girişi başarılı:', demoResult.user.name);
              } else if (isMounted) {
                console.error('Demo giriş hatası:', demoResult.error);
                dispatch({ type: 'SET_USER', payload: null });
              }
            } else if (isMounted) {
              dispatch({ type: 'SET_USER', payload: null });
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          console.log('Auth error:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Kimlik doğrulama hatası' });
        }
      }
    };

    // Use setTimeout to ensure this runs after the current render cycle
    const timeoutId = setTimeout(() => {
      checkAuthStatus();
    }, 0);

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await AuthService.login(credentials);
      
      if (result.success && result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Giriş başarısız' });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Giriş sırasında hata oluştu';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await AuthService.register(userData);
      
      if (result.success && result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Kayıt başarısız' });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Kayıt sırasında hata oluştu';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      // Otomatik demo girişini devre dışı bırak
      await AsyncStorage.setItem('autoLoginDisabled', 'true');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Çıkış sırasında hata oluştu' });
    }
  };

  const updateProfile = async (updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await AuthService.updateProfile(updates);
      
      if (result.success && result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Profil güncellenemedi' });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Profil güncellenirken hata oluştu';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await AuthService.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Şifre değiştirilemedi' });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Şifre değiştirilirken hata oluştu';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const toggleAutoLogin = async (enabled) => {
    try {
      if (enabled) {
        await AsyncStorage.removeItem('autoLoginDisabled');
      } else {
        await AsyncStorage.setItem('autoLoginDisabled', 'true');
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ayar değiştirilirken hata oluştu' };
    }
  };

  const getAutoLoginStatus = async () => {
    try {
      const disabled = await AsyncStorage.getItem('autoLoginDisabled');
      return !disabled; // disabled yoksa true, varsa false
    } catch (error) {
      return true; // Hata durumunda varsayılan olarak açık
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        clearError,
        toggleAutoLogin,
        getAutoLoginStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 