import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Colors = {
  // Primary Purple Gradient Theme
  primary: '#6C5CE7',
  primaryDark: '#5A67D8',
  primaryLight: '#A29BFE',
  
  // Secondary Colors
  secondary: '#FD79A8',
  secondaryDark: '#E84393',
  secondaryLight: '#FDCB6E',
  
  // Gradient Colors
  gradients: {
    primary: ['#6C5CE7', '#A29BFE'],
    secondary: ['#FD79A8', '#FDCB6E'],
    purple: ['#667eea', '#764ba2'],
    pink: ['#f093fb', '#f5576c'],
    blue: ['#4facfe', '#00f2fe'],
    green: ['#43e97b', '#38f9d7'],
    orange: ['#fa709a', '#fee140'],
    sunset: ['#ff9a9e', '#fecfef', '#fecfef'],
    ocean: ['#2E3192', '#1BFFFF'],
    forest: ['#0BA360', '#3CBA92'],
  },
  
  // Status Colors
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF5630',
  info: '#0065FF',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background Colors
  background: '#F8FAFC', // Main background color
  backgroundSecondary: '#FFFFFF', // Secondary background
  backgroundTertiary: '#F1F5F9', // Tertiary background
  backgroundDark: '#0F172A',
  backgroundCard: '#FFFFFF',
  backgroundModal: 'rgba(0,0,0,0.5)',
  
  // Text Colors
  text: '#1E293B', // Primary text color
  textSecondary: '#64748B', // Secondary text color
  textTertiary: '#94A3B8', // Tertiary text color
  textInverse: '#FFFFFF', // Inverse text color
  textDisabled: '#CBD5E1',
  textLink: '#6C5CE7',
  textSuccess: '#059669',
  textWarning: '#D97706',
  textError: '#DC2626',
  
  // Border Colors
  border: '#E2E8F0', // Primary border color
  borderMedium: '#CBD5E1',
  borderDark: '#64748B',
  borderFocus: '#6C5CE7',
  borderError: '#EF4444',
  borderSuccess: '#10B981',
  
  // Component Specific Colors
  tab: {
    active: '#6C5CE7',
    inactive: '#94A3B8',
    background: '#FFFFFF',
  },
  
  nutrition: {
    calories: '#FF6B6B',
    protein: '#4ECDC4',
    carbs: '#45B7D1',
    fat: '#FFA726',
    fiber: '#66BB6A',
    sugar: '#AB47BC',
  },
  
  meal: {
    breakfast: '#FFB74D',
    lunch: '#4FC3F7',
    dinner: '#9575CD',
    snacks: '#81C784',
  },
};

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 48,
  },
  
  // Line Heights
  lineHeight: {
    xs: 14,
    sm: 16,
    base: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 48,
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const Layout = {
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  container: {
    maxWidth: 400,
    padding: Spacing.base,
  },
  header: {
    height: 60,
    paddingHorizontal: Spacing.base,
  },
  tabBar: {
    height: 80,
    paddingBottom: 8,
  },
  card: {
    padding: Spacing.base,
    margin: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
};

export const Animation = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Component Specific Themes
export const ComponentThemes = {
  button: {
    primary: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
      color: Colors.white,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: Colors.primary,
      color: Colors.primary,
    },
    success: {
      backgroundColor: Colors.success,
      borderColor: Colors.success,
      color: Colors.white,
    },
    warning: {
      backgroundColor: Colors.warning,
      borderColor: Colors.warning,
      color: Colors.white,
    },
    error: {
      backgroundColor: Colors.error,
      borderColor: Colors.error,
      color: Colors.white,
    },
  },
  
  card: {
    default: {
      backgroundColor: Colors.background.card,
      borderColor: Colors.border.light,
      ...Shadows.base,
    },
    elevated: {
      backgroundColor: Colors.background.card,
      borderColor: 'transparent',
      ...Shadows.lg,
    },
  },
  
  input: {
    default: {
      backgroundColor: Colors.backgroundSecondary,
      borderColor: Colors.border,
      color: Colors.text,
      placeholderColor: Colors.textSecondary,
    },
    focused: {
      borderColor: Colors.borderFocus,
    },
    error: {
      borderColor: Colors.borderError,
    },
  },
};

// Helper Functions
export const getGradient = (type = 'primary') => {
  return Colors.gradients[type] || Colors.gradients.primary;
};

export const getTextColor = (background) => {
  // Simple contrast function - in real app you might want more sophisticated color contrast calculation
  const darkColors = [Colors.primary, Colors.primaryDark, Colors.black, Colors.gray[700], Colors.gray[800], Colors.gray[900]];
  return darkColors.includes(background) ? Colors.textInverse : Colors.text;
};

export const getSpacing = (...values) => {
  return values.map(value => Spacing[value] || value).join(' ');
};

export const appTheme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  animation: Animation,
  componentThemes: ComponentThemes,
  getGradient,
  getTextColor,
  getSpacing,
};

export default appTheme; 