import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Colors = {
  primary: '#6C5CE7',
  secondary: '#FD79A8',
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#E17055',
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#E9ECEF',
  },
  
  text: {
    primary: '#2D3436',
    secondary: '#636E72',
    tertiary: '#B2BEC3',
  },
  
  border: {
    primary: '#DDD6FE',
    secondary: '#E5E7EB',
  },
  
  gradients: {
    primary: ['#6C5CE7', '#A29BFE'],
    secondary: ['#FD79A8', '#FDCB6E'],
    success: ['#00B894', '#00CEC9'],
  },
};

export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
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
  const darkColors = [Colors.primary, Colors.error];
  return darkColors.includes(background) ? Colors.background.primary : Colors.text.primary;
};

export const getSpacing = (...values) => {
  return values.map(value => Spacing[value] || value).join(' ');
};

export const appTheme = {
  colors: Colors,
  fonts: Fonts,
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