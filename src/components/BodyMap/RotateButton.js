// 🏋️‍♂️ ROTATE BUTTON COMPONENT
// Button for switching between front and back view

import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';
import { BODY_MAP_COLORS, ANIMATION_CONFIG } from '../../data/bodyMap/muscleGroups';

const { width: screenWidth } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const RotateButton = memo(({ 
  currentView, 
  onRotate, 
  style,
  size = 56,
  disabled = false
}) => {
  const rotationValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  
  // Animasyon stilleri
  const animatedButtonStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      rotationValue.value,
      [0, 1],
      [0, 360]
    );
    
    return {
      transform: [
        { rotate: `${rotation}deg` },
        { scale: scaleValue.value }
      ]
    };
  });
  
  const animatedIconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      rotationValue.value,
      [0, 1],
      [0, 180]
    );
    
    return {
      transform: [{ rotate: `${rotation}deg` }]
    };
  });
  
  // Buton basma işlemi
  const handlePress = () => {
    if (disabled) return;
    
    // Buton animasyonu
    scaleValue.value = withTiming(0.95, { duration: 100 }, (finished) => {
      if (finished) {
        scaleValue.value = withSpring(1, {
          damping: ANIMATION_CONFIG.damping,
          stiffness: ANIMATION_CONFIG.stiffness
        });
      }
    });
    
    // Döndürme animasyonu
    rotationValue.value = withSpring(
      rotationValue.value + 1,
      {
        damping: ANIMATION_CONFIG.damping,
        stiffness: ANIMATION_CONFIG.stiffness,
        mass: ANIMATION_CONFIG.mass
      }
    );
    
    // Yeni görünümü belirle
    const newView = currentView === 'front' ? 'back' : 'front';
    onRotate(newView);
  };
  
  // Buton başlığı
  const getButtonTitle = () => {
    return currentView === 'front' ? 'Arka' : 'Ön';
  };
  
  // İkon adı
  const getIconName = () => {
    return currentView === 'front' ? 'rotate-3d-variant' : 'rotate-3d';
  };
  
  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        animatedButtonStyle,
        { width: size, height: size },
        disabled && styles.disabled,
        style
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[
          BODY_MAP_COLORS.selected,
          BODY_MAP_COLORS.hover
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <MaterialCommunityIcons
            name={getIconName()}
            size={size * 0.4}
            color={BODY_MAP_COLORS.text}
          />
        </Animated.View>
        
        <Text style={styles.buttonText}>
          {getButtonTitle()}
        </Text>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    marginBottom: 2,
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: BODY_MAP_COLORS.text,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default RotateButton; 