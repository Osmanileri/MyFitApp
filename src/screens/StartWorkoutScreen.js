import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  Modal,
  Image,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native';
import LocalAnimationService from '../services/localAnimationService';
import workoutStore from '../store/workoutStore';
import WorkoutTheme from '../theme/workoutTheme';

// FALLBACK THEME
const FALLBACK_THEME = {
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#FBC02D'
};
import ExerciseAPI from '../services/exerciseAPI';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function StartWorkoutScreen({ navigation }) {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentSets, setCurrentSets] = useState([]);

  
  // TextInput ref'leri - hiç state update yapma
  const weightInputRef = useRef(null);
  const repsInputRef = useRef(null);
  const [showGif, setShowGif] = useState(true); // Default true
  const [exercisesByMuscleGroup, setExercisesByMuscleGroup] = useState({});
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  
  // Yerel GIF state'leri
  const [localGif, setLocalGif] = useState(null);
  const [hasLocalGif, setHasLocalGif] = useState(false);
  const [gifKey, setGifKey] = useState(Date.now());

  const { createWorkout, startWorkout } = workoutStore();

  // Use centralized theme
  const theme = WorkoutTheme || FALLBACK_THEME;

  // API'den egzersizleri yükle
  const loadExercises = async () => {
    try {
      setIsLoadingExercises(true);
      const allExercises = await ExerciseAPI.getAllExercises();
      
      // Kas gruplarına göre gruplama
      const groupedExercises = {};
      const muscleGroupMapping = {
        'Göğüs': 'chest',
        'Sırt': 'back', 
        'Omuz': 'shoulders',
        'Kol': 'arms',
        'Bacak': 'legs',
        'Karın': 'core'
      };

      allExercises.forEach(exercise => {
        const groupId = muscleGroupMapping[exercise.category];
        if (groupId) {
          if (!groupedExercises[groupId]) {
            groupedExercises[groupId] = [];
          }
          groupedExercises[groupId].push(exercise);
        }
      });

      setExercisesByMuscleGroup(groupedExercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setIsLoadingExercises(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  // Egzersiz değiştiğinde yerel animasyon yükle
  useEffect(() => {
    const loadAnimation = async () => {
      if (currentExercise?.name) {
        console.log('🔥 Current exercise changed:', currentExercise.name);
        
        const animation = await LocalAnimationService.getExerciseAnimation(currentExercise.name);
        
        if (animation) {
          setLocalGif(animation);
          setHasLocalGif(true);
          console.log(`✅ Loaded ${animation.type} animation for ${currentExercise.name}: ${animation.title}`);
        } else {
          setLocalGif(null);
          setHasLocalGif(false);
          console.log(`⚠️ No animation found for "${currentExercise.name}"`);
        }
      } else {
        setLocalGif(null);
        setHasLocalGif(false);
      }
    };
    
    loadAnimation();
  }, [currentExercise?.name]); // Sadece egzersiz adı değiştiğinde tetikle

  // Kas grupları ve egzersizleri
  const muscleGroups = [
    { 
      id: 'chest', 
      name: 'Göğüs', 
      icon: 'dumbbell',
      color: '#FF6B35',
      exercises: [
        { name: 'Bench Press', difficulty: 'Orta', equipment: 'Barbell', hasLocalAnimation: true },
        { name: 'Incline Press', difficulty: 'Orta', equipment: 'Barbell', hasLocalAnimation: false },
        { name: 'Dips', difficulty: 'Zor', equipment: 'Bodyweight', hasLocalAnimation: false },
        { name: 'Chest Fly', difficulty: 'Kolay', equipment: 'Dumbbell', hasLocalAnimation: false }
      ]
    },
    { 
      id: 'back', 
      name: 'Sırt', 
      icon: 'account-outline',
      color: '#4CAF50',
      exercises: [
        { name: 'Pull-ups', difficulty: 'Zor', equipment: 'Bodyweight', hasLocalAnimation: false },
        { name: 'Lat Pulldown', difficulty: 'Orta', equipment: 'Cable', hasLocalAnimation: false },
        { name: 'Barbell Row', difficulty: 'Orta', equipment: 'Barbell', hasLocalAnimation: false },
        { name: 'T-Bar Row', difficulty: 'Orta', equipment: 'T-Bar', hasLocalAnimation: false }
      ]
    },
    { 
      id: 'shoulders', 
      name: 'Omuz', 
      icon: 'weight-lifter',
      color: '#2196F3',
      exercises: [
        { name: 'Shoulder Press', difficulty: 'Orta', equipment: 'Barbell', hasLocalAnimation: false },
        { name: 'Lateral Raises', difficulty: 'Kolay', equipment: 'Dumbbell', hasLocalAnimation: false },
        { name: 'Rear Delt Fly', difficulty: 'Orta', equipment: 'Dumbbell', hasLocalAnimation: false },
        { name: 'Shrugs', difficulty: 'Kolay', equipment: 'Dumbbell', hasLocalAnimation: false }
      ]
    },
    { 
      id: 'arms', 
      name: 'Kol', 
      icon: 'arm-flex',
      color: '#9C27B0',
      exercises: [
        { name: 'Bicep Curls', difficulty: 'Kolay', equipment: 'Dumbbell', hasLocalAnimation: false },
        { name: 'Tricep Dips', difficulty: 'Orta', equipment: 'Bodyweight', hasLocalAnimation: false },
        { name: 'Hammer Curls', difficulty: 'Kolay', equipment: 'Dumbbell', hasLocalAnimation: false },
        { name: 'Close-Grip Press', difficulty: 'Orta', equipment: 'Barbell', hasLocalAnimation: false }
      ]
    },
    { 
      id: 'legs', 
      name: 'Bacak', 
      icon: 'run',
      color: '#FF9800',
      exercises: [
        { name: 'Squats', difficulty: 'Orta', equipment: 'Barbell', hasLocalAnimation: false },
        { name: 'Deadlifts', difficulty: 'Zor', equipment: 'Barbell', hasLocalAnimation: false },
        { name: 'Lunges', difficulty: 'Kolay', equipment: 'Bodyweight', hasLocalAnimation: false },
        { name: 'Leg Press', difficulty: 'Orta', equipment: 'Machine', hasLocalAnimation: false }
      ]
    },
    { 
      id: 'core', 
      name: 'Karın', 
      icon: 'human-male-height',
      color: '#E91E63',
      exercises: [
        { name: 'Planks', difficulty: 'Orta', equipment: 'Bodyweight', hasLocalAnimation: false },
        { name: 'Crunches', difficulty: 'Kolay', equipment: 'Bodyweight', hasLocalAnimation: false },
        { name: 'Russian Twists', difficulty: 'Orta', equipment: 'Bodyweight', hasLocalAnimation: false },
        { name: 'Mountain Climbers', difficulty: 'Orta', equipment: 'Bodyweight', hasLocalAnimation: false }
      ]
    }
  ];

  const handleMuscleGroupSelect = useCallback((group) => {
    setSelectedMuscleGroup(group);
    setShowExerciseModal(true);
  }, []);

  const handleExerciseSelect = useCallback((exercise) => {
    setCurrentExercise({ ...exercise, muscleGroup: selectedMuscleGroup });
    setCurrentSets([]);
    
    // Input'ları temizle - DOM manipulation
    if (weightInputRef.current) {
      weightInputRef.current.clear();
    }
    if (repsInputRef.current) {
      repsInputRef.current.clear();
    }
    
    setShowGif(false);
    setShowExerciseModal(false);
    setShowSetModal(true);
  }, [selectedMuscleGroup]);

  // Hiç handler yok - tamamen uncontrolled

  const handleAddSet = useCallback(() => {
    // Input'lardan değerleri al - DOM query
    const weightValue = weightInputRef.current?._lastNativeText || '';
    const repsValue = repsInputRef.current?._lastNativeText || '';
    
    if (!weightValue.trim() || !repsValue.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen ağırlık ve tekrar sayısını girin.');
      return;
    }
    
    const weight = parseFloat(weightValue);
    const reps = parseInt(repsValue);
    
    if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
      Alert.alert('Geçersiz Değer', 'Lütfen geçerli sayılar girin.');
      return;
    }
    
    const newSet = { reps, weight };
    
    setCurrentSets(prevSets => [...prevSets, newSet]);
    
    // Sadece reps'i sıfırla - DOM manipulation
    if (repsInputRef.current) {
      repsInputRef.current.clear();
    }
  }, []);

  const handleRemoveSet = (index) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const handleCompleteExercise = () => {
    if (currentSets.length === 0) {
      Alert.alert('Set Ekle', 'En az 1 set eklemelisiniz.');
      return;
    }

    const exerciseData = {
      ...currentExercise,
      sets: currentSets,
      totalSets: currentSets.length,
      id: Date.now() // Unique ID
    };

    setSelectedExercises([...selectedExercises, exerciseData]);
    setShowSetModal(false);
    setCurrentExercise(null);
    setCurrentSets([]);
  };

  const handleStartWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert('Antrenman Adı', 'Lütfen antrenman için bir isim girin.');
      return;
    }
    
    if (selectedExercises.length < 2) {
      Alert.alert('Egzersiz Seçin', 'En az 2 egzersiz seçmelisiniz.');
      return;
    }

    const workoutData = {
      template: { name: workoutName },
      day: workoutName,
      mode: 'live',
      exercises: selectedExercises
    };
    
    const workoutId = createWorkout(workoutData);
    navigation.navigate('WorkoutEntry', { 
      mode: 'live', 
      workoutId: workoutId,
      workoutData: workoutData 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateChange = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    Alert.alert(
      'Tarih Seçin',
      'Antrenman tarihinizi seçin',
      [
        { text: 'Dün', onPress: () => setSelectedDate(yesterday) },
        { text: 'Bugün', onPress: () => setSelectedDate(today) },
        { text: 'Yarın', onPress: () => setSelectedDate(tomorrow) },
        { text: 'İptal', style: 'cancel' }
      ]
    );
  };

  const removeExercise = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
  };

  // Kas grubu kartı
  const MuscleGroupCard = ({ group }) => {
    const exerciseCount = exercisesByMuscleGroup[group.id]?.length || 0;
    return (
      <TouchableOpacity 
        style={styles.muscleGroupCard}
        onPress={() => handleMuscleGroupSelect(group)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[group.color, group.color + '90']}
          style={styles.muscleGroupGradient}
        >
          <MaterialCommunityIcons name={group.icon} size={32} color="#FFFFFF" />
          <Text style={styles.muscleGroupName}>{group.name}</Text>
          <Text style={styles.muscleGroupCount}>{exerciseCount} egzersiz</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Egzersiz listesi modal
  const ExerciseModal = () => (
    <Modal
      visible={showExerciseModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowExerciseModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.exerciseModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedMuscleGroup?.name} Egzersizleri</Text>
            <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={exercisesByMuscleGroup[selectedMuscleGroup?.id] || []}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.exerciseItem, { borderLeftColor: selectedMuscleGroup?.color }]}
                onPress={() => handleExerciseSelect(item)}
              >
                <View style={styles.exerciseInfo}>
                  <View style={styles.exerciseNameRow}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    {LocalAnimationService.hasAnimationForExercise(item.name) && (
                      <View style={styles.animationIndicator}>
                        {LocalAnimationService.getAnimationType(item.name) === 'lottie' ? (
                          <MaterialCommunityIcons name="play-circle" size={16} color="#FF6B35" />
                        ) : LocalAnimationService.getAnimationType(item.name) === 'video' ? (
                          <MaterialCommunityIcons name="play-box" size={16} color="#E91E63" />
                        ) : (
                          <MaterialCommunityIcons name="play" size={16} color="#4CAF50" />
                        )}
                        <Text style={styles.animationText}>
                          {LocalAnimationService.getAnimationType(item.name) === 'lottie' ? 'LOTTIE' : 
                           LocalAnimationService.getAnimationType(item.name) === 'video' ? 'VIDEO' : 'GIF'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.exerciseDetails}>
                    <View style={[styles.difficultyBadge, { backgroundColor: 
                      item.difficulty === 'Başlangıç' ? '#4CAF50' : 
                      item.difficulty === 'Orta' ? '#FF9800' : '#F44336' 
                    }]}>
                      <Text style={styles.difficultyText}>{item.difficulty}</Text>
                    </View>
                    <View style={styles.equipmentBadge}>
                      <MaterialCommunityIcons name="dumbbell" size={14} color={theme.textSecondary} />
                      <Text style={styles.equipmentText}>{item.equipment}</Text>
                    </View>
                  </View>
                </View>
                <MaterialCommunityIcons name="plus" size={24} color={selectedMuscleGroup?.color} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyExercises}>
                <MaterialCommunityIcons name="dumbbell" size={48} color={theme.textSecondary} />
                <Text style={styles.emptyExercisesText}>
                  {isLoadingExercises ? 'Egzersizler yükleniyor...' : 'Bu kas grubu için egzersiz bulunamadı'}
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );

  // Set girişi modal - memo ile optimize edilmiş
  const SetModal = memo(() => (
    <Modal
      visible={showSetModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSetModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.setModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{currentExercise?.name}</Text>
            <TouchableOpacity onPress={() => setShowSetModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Teknik Rehber Toggle */}
          <View style={styles.gifSection}>
            <TouchableOpacity
              style={styles.gifToggle}
              onPress={() => {
                console.log('StartWorkout animation toggle pressed, current showGif:', showGif);
                setShowGif(!showGif);
              }}
            >
              <MaterialCommunityIcons name="video-outline" size={20} color={currentExercise?.muscleGroup?.color} />
              <Text style={styles.gifToggleText}>
                {showGif ? 'Hareket Gizle' : 'Hareket Göster'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Teknik Rehber Görüntüsü */}
          {showGif && (
            <View style={styles.gifContainer}>
              {hasLocalGif ? (
                <View style={styles.gifWrapper}>
                  <Text style={styles.gifTitle}>
                    ✨ {localGif.title}
                  </Text>
                  <View style={styles.videoContainer}>
                    {localGif.actualType === 'lottie' ? (
                      <LottieView
                        key={`lottie-${gifKey}`}
                        source={localGif.source}
                        style={styles.exerciseVideo}
                        autoPlay={true}
                        loop={true}
                        resizeMode="contain"
                        onAnimationFinish={() => {
                          console.log('✅ Lottie animation finished');
                        }}
                      />
                    ) : localGif.actualType === 'video' ? (
                      <Video
                        key={`video-${gifKey}`}
                        source={{ uri: localGif.uri }}
                        style={styles.exerciseVideo}
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={true}
                        isLooping={true}
                        isMuted={true}
                        onLoad={() => {
                          console.log('✅ Video animation loaded');
                        }}
                        onError={(error) => {
                          console.log('❌ Video error:', error);
                        }}
                      />
                    ) : (
                      <Image
                        key={`gif-${gifKey}`}
                        source={localGif.source}
                        style={styles.exerciseVideo}
                        resizeMode="contain"
                        fadeDuration={0}
                        progressiveRenderingEnabled={true}
                        cache="reload"
                        onLoad={() => {
                          console.log('✅ Animation loaded');
                        }}
                        onError={(error) => {
                          console.log('❌ Animation error:', error);
                        }}
                      />
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.refreshButton}
                    onPress={() => {
                      console.log(`🔄 ${localGif.actualType || localGif.type} refresh pressed`);
                      setGifKey(Date.now()); // Force re-render with new key
                    }}
                  >
                    <MaterialCommunityIcons name="refresh" size={16} color="#FF6B35" />
                    <Text style={styles.refreshText}>Yenile</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.fallbackGifContainer}>
                  <MaterialCommunityIcons name="video-outline" size={64} color="#666" />
                  <Text style={styles.fallbackGifText}>
                    {currentExercise?.name} için teknik rehber henüz hazır değil
                  </Text>
                  <Text style={styles.fallbackGifSubtext}>
                    Yakında eklenecek
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Egzersiz Bilgileri */}
          <View style={styles.exerciseInfoSection}>
            <View style={styles.exerciseDetailRow}>
              <View style={[styles.difficultyBadge, { backgroundColor: 
                currentExercise?.difficulty === 'Başlangıç' ? '#4CAF50' : 
                currentExercise?.difficulty === 'Orta' ? '#FF9800' : '#F44336' 
              }]}>
                <Text style={styles.difficultyText}>{currentExercise?.difficulty}</Text>
              </View>
              <View style={styles.equipmentBadge}>
                <MaterialCommunityIcons name="dumbbell" size={14} color={theme.textSecondary} />
                <Text style={styles.equipmentText}>{currentExercise?.equipment}</Text>
              </View>
            </View>
          </View>

          {/* Set Girişi */}
          <View style={styles.setInputSection}>
            <Text style={styles.setInputTitle}>Set Ekle</Text>
            <View style={styles.setInputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>KG</Text>
                <TextInput
                  ref={weightInputRef}
                  style={styles.setInput}
                  placeholder="80"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  maxLength={5}
                />
              </View>
              <Text style={styles.inputSeparator}>×</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>REP</Text>
                <TextInput
                  ref={repsInputRef}
                  style={styles.setInput}
                  placeholder="12"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={3}
                />
              </View>
              <TouchableOpacity style={styles.addSetButton} onPress={handleAddSet}>
                <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Eklenen Setler */}
          {currentSets.length > 0 && (
            <View style={styles.addedSetsSection}>
              <Text style={styles.addedSetsTitle}>Eklenen Setler ({currentSets.length})</Text>
              <ScrollView style={styles.addedSetsList}>
                {currentSets.map((set, index) => (
                  <View key={index} style={styles.addedSetItem}>
                    <Text style={styles.addedSetText}>
                      {index + 1}. Set: {set.weight} kg × {set.reps} tekrar
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveSet(index)}>
                      <MaterialCommunityIcons name="delete" size={20} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Tamamla Butonu */}
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: currentExercise?.muscleGroup?.color }]}
            onPress={handleCompleteExercise}
          >
            <Text style={styles.completeButtonText}>
              Egzersizi Tamamla ({currentSets.length} Set)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ));

  // Seçilen egzersizler
  const SelectedExercises = () => {
    if (selectedExercises.length === 0) return null;

    return (
      <View style={styles.selectedExercisesContainer}>
        <Text style={styles.selectedExercisesTitle}>Seçilen Egzersizler ({selectedExercises.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedExercisesList}>
          {selectedExercises.map((exercise) => (
            <View key={exercise.id} style={[styles.selectedExerciseCard, { borderTopColor: exercise.muscleGroup.color }]}>
              <TouchableOpacity
                style={styles.removeExerciseButton}
                onPress={() => removeExercise(exercise.id)}
              >
                <MaterialCommunityIcons name="close" size={16} color="#F44336" />
              </TouchableOpacity>
              
              <Text style={styles.selectedExerciseName}>{exercise.name}</Text>
              <Text style={styles.selectedExerciseMuscle}>{exercise.muscleGroup.name}</Text>
              
              <View style={styles.selectedExerciseDetails}>
                <View style={styles.selectedExerciseDetailItem}>
                  <MaterialCommunityIcons name="dumbbell" size={14} color={theme.textSecondary} />
                  <Text style={styles.selectedExerciseDetailText}>{exercise.equipment}</Text>
                </View>
                <Text style={styles.selectedExerciseDetailText}>{exercise.totalSets} Set</Text>
              </View>
              
              <View style={styles.selectedExerciseSets}>
                {exercise.sets.map((set, index) => (
                  <Text key={index} style={styles.selectedExerciseSetText}>
                    {set.weight}kg × {set.reps}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme?.background || theme?.colors?.background || '#121212'} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Yeni Antrenman</Text>
          <Text style={styles.headerSubtitle}>Kas gruplarını seçin</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={handleDateChange}
        >
          <MaterialCommunityIcons name="calendar" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Antrenman İsmi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Antrenman İsmi</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.workoutNameInput}
              placeholder="Örn: Göğüs & Kol, Bacak Günü..."
              placeholderTextColor={theme.textSecondary}
              value={workoutName}
              onChangeText={setWorkoutName}
            />
          </View>
        </View>

        {/* Tarih */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarih</Text>
          <TouchableOpacity style={styles.dateContainer} onPress={handleDateChange}>
            <MaterialCommunityIcons name="calendar" size={20} color={theme.textSecondary} />
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Kas Grupları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kas Grupları</Text>
          <View style={styles.muscleGroupsGrid}>
            {muscleGroups.map((group) => (
              <MuscleGroupCard key={group.id} group={group} />
            ))}
          </View>
        </View>

        {/* Seçilen Egzersizler */}
        <SelectedExercises />

        {/* Boşluk */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Alt Butonlar */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[
            styles.startButton,
            (!workoutName.trim() || selectedExercises.length < 2) && styles.startButtonDisabled
          ]}
          onPress={handleStartWorkout}
          disabled={!workoutName.trim() || selectedExercises.length < 2}
        >
          <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Antrenmanı Başlat</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <ExerciseModal />
      <SetModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  dateButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  workoutNameInput: {
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  dateContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  muscleGroupsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  muscleGroupCard: {
    width: (screenWidth - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  muscleGroupGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  muscleGroupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  muscleGroupCount: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  exerciseModalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: screenHeight * 0.7,
  },
  setModalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: screenHeight * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  animationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  animationText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  equipmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  equipmentText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  
  // Set Modal Styles
  gifSection: {
    marginBottom: 16,
  },
  gifToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  gifToggleText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  gifContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseGif: {
    width: 260,
    height: 160,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  exerciseGifWebView: {
    width: 280,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
  },
  exerciseInfoSection: {
    marginBottom: 16,
  },
  exerciseDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setInputSection: {
    marginBottom: 16,
  },
  setInputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  setInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  setInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  inputSeparator: {
    fontSize: 20,
    color: '#B0B0B0',
    marginTop: 16,
  },
  addSetButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  addedSetsSection: {
    marginBottom: 16,
  },
  addedSetsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  addedSetsList: {
    maxHeight: 120,
  },
  addedSetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginBottom: 4,
  },
  addedSetText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  completeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Seçilen Egzersizler
  selectedExercisesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  selectedExercisesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  selectedExercisesList: {
    paddingVertical: 4,
  },
  selectedExerciseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    borderTopWidth: 3,
    position: 'relative',
  },
  removeExerciseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedExerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  selectedExerciseMuscle: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  selectedExerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedExerciseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedExerciseDetailText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  selectedExerciseSets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  selectedExerciseSetText: {
    fontSize: 10,
    color: '#B0B0B0',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  spacer: {
    height: 80,
  },
  bottomButtons: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#2A2A2A',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyExercises: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyExercisesText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 8,
    textAlign: 'center',
  },
  gifPlaceholder: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifPlaceholderText: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Yerel GIF stilleri
  gifWrapper: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gifTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  exerciseVideo: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 4,
  },
  playIcon: {
    opacity: 0.8,
  },
  animatedLabel: {
    color: '#4CAF50',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    gap: 4,
  },
  refreshText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: 'bold',
  },
  localGifWrapper: {
    position: 'relative',
  },
  localGifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  localGifText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  fallbackGifContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
  },
  fallbackGifText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 8,
  },
  fallbackGifSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
}); 