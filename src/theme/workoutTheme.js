export const WorkoutTheme = {
  // Backward compatibility - direct access to colors
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#FBC02D',
  secondary: '#03DAC6',
  accent: '#BB86FC',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  
  // Additional properties for compatibility
  cardBackground: '#1E1E1E',
  surface: '#252525',
  card: '#1E1E1E',
  
  colors: {
    // Primary Colors (KASHUB-inspired)
    primary: '#FBC02D', // Yellow/Gold
    primaryDark: '#F57F17',
    primaryLight: '#FFF9C4',
    
    // Background Colors
    background: '#121212', // Deep black
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2D2D2D',
    surface: '#252525',
    surfaceVariant: '#353535',
    
    // Text Colors
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    textOnPrimary: '#000000',
    
    // Accent Colors
    accent: '#BB86FC', // Purple
    accentSecondary: '#03DAC6', // Blue-green
    secondary: '#03DAC6', // Alias for compatibility
    
    // Status Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Border Colors
    border: '#404040',
    borderLight: '#555555',
    
    // Overlay Colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // RIR Colors
    rir: {
      0: '#F44336', // Red - Failure
      1: '#FF9800', // Orange - Very hard
      2: '#FFC107', // Yellow - Hard
      3: '#4CAF50', // Green - Moderate
      4: '#2196F3', // Blue - Easy
    }
  },
  
  typography: {
    // Headings
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      lineHeight: 38,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF',
      lineHeight: 26,
    },
    h4: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      lineHeight: 22,
    },
    
    // Body Text
    body1: {
      fontSize: 16,
      fontWeight: '400',
      color: '#FFFFFF',
      lineHeight: 22,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      color: '#B0B0B0',
      lineHeight: 20,
    },
    body3: {
      fontSize: 12,
      fontWeight: '400',
      color: '#808080',
      lineHeight: 18,
    },
    
    // Special
    caption: {
      fontSize: 12,
      fontWeight: '400',
      color: '#808080',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
      lineHeight: 22,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000000',
      lineHeight: 20,
    },
    
    // Workout specific
    exerciseName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FBC02D',
      lineHeight: 24,
    },
    setInfo: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      lineHeight: 20,
    },
    metric: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FBC02D',
      lineHeight: 30,
    },
    metricLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: '#B0B0B0',
      lineHeight: 16,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 50,
  },
  
  shadows: {
    sm: {
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
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  components: {
    // Buttons
    button: {
      primary: {
        backgroundColor: '#FBC02D',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      secondary: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#FBC02D',
      },
      fab: {
        backgroundColor: '#FBC02D',
        borderRadius: 28,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 24,
        right: 24,
      },
      fabLarge: {
        backgroundColor: '#FBC02D',
        borderRadius: 32,
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 24,
        right: 24,
      },
    },
    
    // Cards
    card: {
      backgroundColor: '#1E1E1E',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardElevated: {
      backgroundColor: '#1E1E1E',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    
    // Workout specific cards
    exerciseCard: {
      backgroundColor: '#1E1E1E',
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      borderLeftWidth: 4,
      borderLeftColor: '#FBC02D',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    workoutCard: {
      backgroundColor: '#1E1E1E',
      borderRadius: 16,
      padding: 20,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    
    // Inputs
    input: {
      backgroundColor: '#2D2D2D',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#404040',
    },
    inputFocused: {
      borderColor: '#FBC02D',
      borderWidth: 2,
    },
    
    // Tabs
    tab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#404040',
    },
    tabActive: {
      backgroundColor: '#FBC02D',
      borderColor: '#FBC02D',
    },
    
    // Modal
    modal: {
      backgroundColor: '#1E1E1E',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      flex: 1,
      justifyContent: 'flex-end',
    },
  },
  
  // Animation durations
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Layout
  layout: {
    header: {
      height: 60,
      paddingHorizontal: 16,
      backgroundColor: '#121212',
      borderBottomWidth: 1,
      borderBottomColor: '#404040',
    },
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    section: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
  },
};

// Helper functions
export const getThemeColor = (colorPath) => {
  const paths = colorPath.split('.');
  let color = WorkoutTheme.colors;
  
  for (const path of paths) {
    color = color[path];
    if (!color) return '#FFFFFF';
  }
  
  return color;
};

export const getRIRColor = (rirValue) => {
  return WorkoutTheme.colors.rir[rirValue] || WorkoutTheme.colors.rir[2];
};

export const createButtonStyle = (type = 'primary', size = 'normal') => {
  const baseStyle = WorkoutTheme.components.button[type];
  
  if (size === 'small') {
    return {
      ...baseStyle,
      paddingHorizontal: 16,
      paddingVertical: 8,
      minHeight: 40,
    };
  }
  
  if (size === 'large') {
    return {
      ...baseStyle,
      paddingHorizontal: 32,
      paddingVertical: 16,
      minHeight: 56,
    };
  }
  
  return baseStyle;
};

export default WorkoutTheme; 