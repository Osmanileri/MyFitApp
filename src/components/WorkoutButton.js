import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WorkoutTheme from '../theme/workoutTheme';

const WorkoutButton = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'normal', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props 
}) => {
  // Use centralized theme
  const theme = WorkoutTheme;
  
  const getButtonStyle = () => {
    let baseStyle = {
      paddingVertical: size === 'small' ? 8 : 12,
      paddingHorizontal: size === 'small' ? 16 : 24,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (type === 'primary') {
      baseStyle.backgroundColor = disabled ? (theme?.surface || '#1E1E1E') : (theme?.primary || '#FBC02D');
    } else if (type === 'secondary') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = disabled ? theme.textSecondary : theme.primary;
    }

    return [baseStyle, style];
  };
  
  const getTextStyle = () => {
    let baseStyle = {
      fontSize: size === 'small' ? 14 : 16,
      fontWeight: '600',
    };

    if (type === 'primary') {
      baseStyle.color = disabled ? theme.textSecondary : theme.text;
    } else {
      baseStyle.color = disabled ? theme.textSecondary : theme.primary;
    }

    return [baseStyle, textStyle];
  };

  const renderIcon = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={theme.text} style={{ marginRight: 8 }} />;
    }
    
    if (icon) {
      return (
        <MaterialCommunityIcons 
          name={icon} 
          size={size === 'small' ? 16 : 20} 
          color={type === 'primary' ? theme.text : theme.primary}
          style={{ marginRight: 8 }}
        />
      );
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      <Text style={getTextStyle()}>{title}</Text>
      {iconPosition === 'right' && renderIcon()}
    </TouchableOpacity>
  );
};

export default WorkoutButton; 