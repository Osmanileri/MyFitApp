// Comprehensive theme for the entire FitApp
export const appTheme = {
  colors: {
    // Primary Colors
    primary: '#6C5CE7',
    primaryDark: '#5A67D8',
    primaryLight: '#A29BFE',
    
    // Basic Colors
    background: '#F8FAFC',
    white: '#FFFFFF',
    black: '#000000',
    
    // Text Colors
    text: '#1E293B',
    textSecondary: '#64748B',
    
    // Border Colors
    border: '#E2E8F0',
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};

// Workout-specific theme for dark workout screens
export const workoutTheme = {
  background: '#0A0A0A',
  surface: '#1A1A1A',
  card: '#2A2A2A',
  cardBackground: '#2A2A2A',
  primary: '#4CAF50',
  secondary: '#2196F3',
  warning: '#FF9800',
  error: '#F44336',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  accent: '#FFD700',
  success: '#4CAF50',
  info: '#2196F3',
  
  // Nested structure for complex theme usage
  colors: {
    background: '#0A0A0A',
    backgroundSecondary: '#1A1A1A',
    surface: '#1A1A1A',
    card: '#2A2A2A',
    primary: '#4CAF50',
    secondary: '#2196F3',
    warning: '#FF9800',
    error: '#F44336',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    accent: '#FFD700',
    success: '#4CAF50',
    info: '#2196F3',
  },
  
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: 'bold' },
    h4: { fontSize: 18, fontWeight: 'bold' },
    body1: { fontSize: 16, fontWeight: 'normal' },
    body2: { fontSize: 14, fontWeight: 'normal' },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  // Diet specific colors
  diet: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    accent: '#FFD700',
  }
};

// Export both themes
export default appTheme;
export { workoutTheme as WorkoutTheme }; 