// 🏋️‍♂️ HOVER OVERLAY COMPONENT
// Overlay for displaying muscle group information on hover

import React, { memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';
import { BODY_MAP_COLORS, ANIMATION_CONFIG } from '../../data/bodyMap/muscleGroups';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HoverOverlay = memo(({ 
  hoveredMuscleGroup, 
  x = 0, 
  y = 0, 
  visible = false,
  style 
}) => {
  const opacityValue = useSharedValue(0);
  const scaleValue = useSharedValue(0.8);
  const translateYValue = useSharedValue(10);
  
  // Animasyon stilleri
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityValue.value,
      transform: [
        { scale: scaleValue.value },
        { translateY: translateYValue.value }
      ]
    };
  });
  
  // Görünürlük değiştiğinde animasyon
  React.useEffect(() => {
    if (visible && hoveredMuscleGroup) {
      opacityValue.value = withTiming(1, { duration: 200 });
      scaleValue.value = withSpring(1, {
        damping: ANIMATION_CONFIG.damping,
        stiffness: ANIMATION_CONFIG.stiffness
      });
      translateYValue.value = withSpring(0, {
        damping: ANIMATION_CONFIG.damping,
        stiffness: ANIMATION_CONFIG.stiffness
      });
    } else {
      opacityValue.value = withTiming(0, { duration: 150 });
      scaleValue.value = withSpring(0.8, {
        damping: ANIMATION_CONFIG.damping,
        stiffness: ANIMATION_CONFIG.stiffness
      });
      translateYValue.value = withSpring(10, {
        damping: ANIMATION_CONFIG.damping,
        stiffness: ANIMATION_CONFIG.stiffness
      });
    }
  }, [visible, hoveredMuscleGroup]);
  
  // Overlay pozisyonu hesaplama
  const getOverlayPosition = () => {
    const overlayWidth = 200;
    const overlayHeight = 100;
    const padding = 20;
    
    let posX = x - overlayWidth / 2;
    let posY = y - overlayHeight - padding;
    
    // Ekran sınırlarını kontrol et
    if (posX < padding) {
      posX = padding;
    } else if (posX + overlayWidth > screenWidth - padding) {
      posX = screenWidth - overlayWidth - padding;
    }
    
    if (posY < padding) {
      posY = y + padding;
    }
    
    return { posX, posY };
  };
  
  const { posX, posY } = getOverlayPosition();
  
  // Kas grubu için ikon seçimi
  const getMuscleGroupIcon = (muscleGroup) => {
    const iconMap = {
      chest: 'weight-lifter',
      shoulders: 'arm-flex-outline',
      biceps: 'arm-flex',
      triceps: 'arm-flex',
      forearms: 'hand-saw',
      abs: 'human-male-height',
      back: 'account-outline',
      glutes: 'seat-outline',
      quads: 'run',
      hamstrings: 'run',
      calves: 'foot-print'
    };
    
    return iconMap[muscleGroup?.id] || 'dumbbell';
  };
  
  // Egzersiz sayısı formatlama
  const formatExerciseCount = (count) => {
    return `${count} egzersiz`;
  };
  
  if (!visible || !hoveredMuscleGroup) {
    return null;
  }
  
  return (
    <Animated.View
      style={[
        styles.overlay,
        animatedStyle,
        {
          left: posX,
          top: posY,
        },
        style
      ]}
      pointerEvents="none"
    >
      <Surface style={styles.surface} elevation={8}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: hoveredMuscleGroup.hoverColor }]}>
            <MaterialCommunityIcons
              name={getMuscleGroupIcon(hoveredMuscleGroup)}
              size={20}
              color={BODY_MAP_COLORS.text}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.muscleName}>{hoveredMuscleGroup.name}</Text>
            <Text style={styles.muscleNameEn}>{hoveredMuscleGroup.nameEn}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={14}
                color={BODY_MAP_COLORS.textSecondary}
              />
              <Text style={styles.statText}>
                {formatExerciseCount(hoveredMuscleGroup.exercises?.length || 0)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="information-outline"
                size={14}
                color={BODY_MAP_COLORS.textSecondary}
              />
              <Text style={styles.statText}>Detaylar</Text>
            </View>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {hoveredMuscleGroup.description}
          </Text>
        </View>
        
        {/* Pointer arrow */}
        <View style={[styles.arrow, { borderTopColor: BODY_MAP_COLORS.surface }]} />
      </Surface>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 1000,
    width: 200,
  },
  surface: {
    backgroundColor: BODY_MAP_COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BODY_MAP_COLORS.bodyOutline,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  muscleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BODY_MAP_COLORS.text,
  },
  muscleNameEn: {
    fontSize: 11,
    color: BODY_MAP_COLORS.textSecondary,
    fontStyle: 'italic',
  },
  content: {
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 11,
    color: BODY_MAP_COLORS.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 11,
    color: BODY_MAP_COLORS.textSecondary,
    lineHeight: 14,
  },
  arrow: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BODY_MAP_COLORS.surface,
  },
});

export default HoverOverlay; 