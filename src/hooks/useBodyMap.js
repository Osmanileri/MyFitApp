// 🏋️‍♂️ USE BODY MAP HOOK
// Custom hook for body map state management

import { useState, useCallback, useMemo } from 'react';
import { useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { Haptics } from 'expo-haptics';
import { MUSCLE_GROUPS, ANIMATION_CONFIG, getMuscleGroupsByView } from '../data/bodyMap/muscleGroups';

export const useBodyMap = (initialView = 'front') => {
  // State management
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [hoveredMuscleGroup, setHoveredMuscleGroup] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  
  // Animation values
  const rotateAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(1);
  
  // Görünüm değiştirme
  const toggleView = useCallback(() => {
    const newView = currentView === 'front' ? 'back' : 'front';
    
    // Haptic feedback
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // 3D flip animasyonu
    rotateAnimation.value = withSpring(
      rotateAnimation.value + 180,
      ANIMATION_CONFIG,
      () => {
        runOnJS(setCurrentView)(newView);
      }
    );
  }, [currentView, rotateAnimation]);
  
  // Kas grubu seçme
  const handleMuscleGroupPress = useCallback((muscleGroup) => {
    // Haptic feedback
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Scale animasyonu
    scaleAnimation.value = withSpring(0.95, { duration: 100 }, () => {
      scaleAnimation.value = withSpring(1, { duration: 150 });
    });
    
    setSelectedMuscleGroup(muscleGroup.id);
    setModalVisible(true);
  }, [scaleAnimation]);
  
  // Hover yönetimi
  const handleMuscleGroupHover = useCallback((muscleGroupId, isHovered) => {
    if (isHovered) {
      setHoveredMuscleGroup(muscleGroupId);
    } else {
      setHoveredMuscleGroup(null);
    }
  }, []);
  
  // Modal kapatma
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedMuscleGroup(null);
  }, []);
  
  // Seçimi sıfırlama
  const resetSelection = useCallback(() => {
    setSelectedMuscleGroup(null);
    setHoveredMuscleGroup(null);
    setModalVisible(false);
  }, []);
  
  // Görünüme göre kas gruplarını filtrele
  const visibleMuscleGroups = useMemo(() => {
    return getMuscleGroupsByView(currentView);
  }, [currentView]);
  
  // Seçili kas grubunu getir
  const selectedMuscleGroupData = useMemo(() => {
    if (!selectedMuscleGroup) return null;
    return MUSCLE_GROUPS.find(group => group.id === selectedMuscleGroup);
  }, [selectedMuscleGroup]);
  
  // Hover edilen kas grubunu getir
  const hoveredMuscleGroupData = useMemo(() => {
    if (!hoveredMuscleGroup) return null;
    return MUSCLE_GROUPS.find(group => group.id === hoveredMuscleGroup);
  }, [hoveredMuscleGroup]);
  
  return {
    // State
    currentView,
    setCurrentView,
    selectedMuscleGroup,
    hoveredMuscleGroup,
    isModalVisible,
    
    // Data
    visibleMuscleGroups,
    selectedMuscleGroupData,
    hoveredMuscleGroupData,
    
    // Actions
    toggleView,
    handleMuscleGroupPress,
    handleMuscleGroupHover,
    closeModal,
    resetSelection,
    
    // Animations
    rotateAnimation,
    scaleAnimation
  };
}; 