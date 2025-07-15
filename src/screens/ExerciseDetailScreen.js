import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  Image,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import workoutStore from '../store/workoutStore';
import WorkoutTheme from '../theme/workoutTheme';
import ExerciseAPI from '../services/exerciseAPI';
import LocalAnimationService from '../services/localAnimationService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise, mode, onExerciseAdded } = route.params;
  
  const [sets, setSets] = useState([]);
  const [newSet, setNewSet] = useState({
    weight: '',
    reps: '',
    completed: false
  });
  const [showGif, setShowGif] = useState(true); // Default true yapıyoruz
  const [previousBest, setPreviousBest] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const [isLoadingGif, setIsLoadingGif] = useState(false);
  
  // Yerel GIF state'leri
  const [localGif, setLocalGif] = useState(null);
  const [hasLocalGif, setHasLocalGif] = useState(false);
  
  const { 
    addExerciseToWorkout, 
    addSetToExercise, 
    getPreviousWorkoutData,
    currentWorkout 
  } = workoutStore();

  // Use centralized theme
  const theme = WorkoutTheme;

  // Kas gruplarının renkleri
  const muscleColors = {
    'Göğüs': '#FF6B35',
    'Sırt': '#4CAF50',
    'Omuz': '#2196F3',
    'Kol': '#9C27B0',
    'Bacak': '#FF9800',
    'Karın': '#E91E63'
  };

  const exerciseColor = muscleColors[exercise.category] || theme.primary;

  // Yerel animasyon yükle
  const loadLocalAnimation = async () => {
    console.log('🔥 loadLocalAnimation fonksiyonu çağrıldı!');
    console.log('🔥 Exercise name:', exercise.name);
    console.log('🔥 Exercise object:', exercise);
    
    try {
      console.log(`📁 Loading local animation for: "${exercise.name}"`);
      
      const animation = await LocalAnimationService.getExerciseAnimation(exercise.name);
      console.log('🔥 LocalAnimationService response:', animation);
      
      if (animation) {
        setLocalGif(animation);
        setHasLocalGif(true);
        console.log(`✅ Loaded local animation: ${animation.title}`);
      } else {
        console.log(`⚠️ No local animation found for "${exercise.name}"`);
        setHasLocalGif(false);
      }
    } catch (error) {
      console.error('❌ Error loading local animation:', error);
      setHasLocalGif(false);
    }
  };

  // Egzersiz verilerini API'den al
  const loadExerciseData = async () => {
    console.log('🚀 loadExerciseData fonksiyonu başlatıldı!');
    try {
      setIsLoadingGif(true);
      
      // Yerel animasyon yükle
      console.log('🎯 Yerel animasyon yükleme başlatılıyor...');
      await loadLocalAnimation();
      
      // Normal egzersiz verilerini yükle
      const exercises = await ExerciseAPI.getAllExercises();
      console.log('All exercises:', exercises.length);
      console.log('Looking for exercise:', exercise.name);
      
      const foundExercise = exercises.find(ex => 
        ex.name.toLowerCase() === exercise.name.toLowerCase() ||
        ex.id === exercise.id
      );
      
      console.log('Found exercise:', foundExercise);
      
      if (foundExercise) {
        setExerciseData(foundExercise);
        console.log('Exercise data set:', foundExercise.gifUrl);
      } else {
        console.log('Exercise not found, using fallback');
        const fallbackData = {
          ...exercise,
          instructions: exercise.instructions || [
            'Bench üzerinde sırt üstü yatın',
            'Barbell\'ı göğüs genişliğinde tutun',
            'Yavaşça göğsünüze indirin',
            'Güçlü bir şekilde yukarı itin'
          ],
          tips: exercise.tips || [
            'Omuzlarınızı geri çekin',
            'Ayaklarınızı sıkıca yere basın',
            'Nefes kontrolünü ihmal etmeyin'
          ]
        };
        setExerciseData(fallbackData);
      }
    } catch (error) {
      console.error('Error loading exercise data:', error);
      // Error durumunda fallback
      setExerciseData({
        ...exercise
      });
    } finally {
      setIsLoadingGif(false);
    }
  };

  useEffect(() => {
    console.log('⚡ useEffect çalıştı! Exercise ID:', exercise.id);
    console.log('⚡ Exercise name in useEffect:', exercise.name);
    
    // Önceki performansı yükle
    const prevData = getPreviousWorkoutData(exercise.id);
    if (prevData) {
      setPreviousBest(prevData);
      // Varsayılan ağırlığı önceki antrenmantan al
      setNewSet(prev => ({
        ...prev,
        weight: String(prevData.weight || ''),
        reps: String(prevData.reps || '')
      }));
    }
    
    // Egzersiz verilerini yükle
    console.log('⚡ loadExerciseData çağrılıyor...');
    loadExerciseData();
  }, [exercise.id]);

  const handleAddSet = () => {
    if (!newSet.weight || !newSet.reps) {
      Alert.alert('Eksik Bilgi', 'Lütfen ağırlık ve tekrar sayısını girin.');
      return;
    }

    const setData = {
      weight: parseFloat(newSet.weight),
      reps: parseInt(newSet.reps),
      completed: true,
      setNumber: sets.length + 1,
      timestamp: new Date()
    };

    setSets(prev => [...prev, setData]);
    
    // Ağırlığı koru, tekrarı temizle
    setNewSet(prev => ({
      ...prev,
      reps: ''
    }));
  };

  const handleRemoveSet = (index) => {
    setSets(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinishExercise = () => {
    if (sets.length === 0) {
      Alert.alert('Set Ekleyin', 'Lütfen en az bir set ekleyin.');
      return;
    }

    // Egzersizi antrenman programına ekle
    if (currentWorkout) {
      let exerciseEntry = currentWorkout.exercises?.find(ex => ex.exerciseId === exercise.id);
      
      if (!exerciseEntry) {
        exerciseEntry = addExerciseToWorkout(exercise);
      }

      // Setleri ekle
      sets.forEach(set => {
        addSetToExercise(exerciseEntry.id, set);
      });
    }

    // Callback çağır
    if (onExerciseAdded) {
      onExerciseAdded();
    }

    // Geri git
    navigation.goBack();
  };

  const getEquipmentIcon = (equipment) => {
    switch (equipment) {
      case 'Barbell': return 'weight-lifter';
      case 'Dumbbell': return 'dumbbell';
      case 'Machine': return 'cog';
      case 'Bodyweight': return 'account-outline';
      default: return 'help-circle';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Başlangıç': return '#4CAF50';
      case 'Orta': return '#FF9800';
      case 'İleri': return '#F44336';
      default: return theme.textSecondary;
    }
  };

  // Set girişi
  const SetInputRow = () => (
    <View style={styles.setInputContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>KG</Text>
        <TextInput
          style={[styles.input, { borderColor: exerciseColor + '40' }]}
          value={newSet.weight}
          onChangeText={(value) => setNewSet(prev => ({ ...prev, weight: value }))}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
        />
      </View>
      
      <MaterialCommunityIcons name="close" size={16} color={theme.textSecondary} />
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>REP</Text>
        <TextInput
          style={[styles.input, { borderColor: exerciseColor + '40' }]}
          value={newSet.reps}
          onChangeText={(value) => setNewSet(prev => ({ ...prev, reps: value }))}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.addSetButton, { backgroundColor: exerciseColor }]}
        onPress={handleAddSet}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  // Set listesi
  const SetList = () => (
    <View style={styles.setsContainer}>
      <Text style={styles.setsTitle}>Yapılan Setler ({sets.length})</Text>
      {sets.map((set, index) => (
        <View key={index} style={styles.setItem}>
          <View style={styles.setInfo}>
            <View style={[styles.setNumber, { backgroundColor: exerciseColor }]}>
              <Text style={styles.setNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.setDetails}>
              {set.weight} kg × {set.reps} rep
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.removeSetButton}
            onPress={() => handleRemoveSet(index)}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={16} color={theme.error} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  // Önceki performans
  const PreviousPerformance = () => {
    if (!previousBest) return null;
    
    return (
      <View style={styles.previousContainer}>
        <Text style={styles.previousTitle}>Önceki En İyi</Text>
        <View style={styles.previousStats}>
          <View style={styles.previousStat}>
            <MaterialCommunityIcons name="weight" size={16} color={exerciseColor} />
            <Text style={styles.previousStatText}>{previousBest.weight} kg</Text>
          </View>
          <View style={styles.previousStat}>
            <MaterialCommunityIcons name="repeat" size={16} color={exerciseColor} />
            <Text style={styles.previousStatText}>{previousBest.reps} rep</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme?.background || theme?.colors?.background || '#121212'} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{exercise.name}</Text>
          <Text style={styles.headerSubtitle}>{exercise.muscleGroups.join(', ')}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.gifButton}
          onPress={() => {
            console.log('GIF button pressed, current showGif:', showGif);
            setShowGif(!showGif);
          }}
        >
          <MaterialCommunityIcons 
            name={showGif ? "eye-off" : "play-circle-outline"} 
            size={24} 
            color={exerciseColor} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* GIF Container */}
        {showGif && (
          <View style={styles.gifContainer}>
            {/* GIF Control Header */}
            <View style={styles.gifControlHeader}>
              <Text style={styles.gifTitle}>Hareket Gösterimi</Text>
            </View>

            <View style={styles.gifPlaceholder}>
              {isLoadingGif ? (
                <View style={styles.gifLoadingContainer}>
                  <ActivityIndicator size="large" color={exerciseColor} />
                  <Text style={styles.gifLoadingText}>Yükleniyor...</Text>
                </View>
              ) : (
                <Image 
                  source={
                    hasLocalGif && localGif 
                      ? localGif.source  // LocalAnimationService'den gelen yerel animasyon (require ile)
                      : require('../../assets/icon.png') // Fallback için app ikonu
                  }
                  style={styles.exerciseGif}
                  resizeMode="contain"
                  fadeDuration={0}
                  onError={(error) => {
                    console.log('GIF Load Error:', error.nativeEvent.error);
                  }}
                  onLoad={() => {
                    console.log('GIF loaded successfully');
                  }}
                  onLoadStart={() => {
                    console.log('GIF loading started');
                  }}
                />
              )}
            </View>
          </View>
        )}

        {/* Egzersiz Bilgileri */}
        <View style={styles.exerciseInfo}>
          <View style={styles.exerciseTags}>
            <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' }]}>
              <Text style={[styles.tagText, { color: getDifficultyColor(exercise.difficulty) }]}>
                {exercise.difficulty}
              </Text>
            </View>
            <View style={styles.equipmentTag}>
              <MaterialCommunityIcons 
                name={getEquipmentIcon(exercise.equipment)} 
                size={16} 
                color={theme.textSecondary} 
              />
              <Text style={styles.equipmentText}>{exercise.equipment}</Text>
            </View>
          </View>
          
          {(exerciseData?.instructions || exercise.instructions) && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Nasıl Yapılır</Text>
              {exerciseData?.instructions ? (
                exerciseData.instructions.map((instruction, index) => (
                  <Text key={index} style={styles.instructionStep}>
                    {index + 1}. {instruction}
                  </Text>
                ))
              ) : (
                <Text style={styles.instructionsText}>{exercise.instructions}</Text>
              )}
            </View>
          )}
          
          {(exerciseData?.tips || exercise.tips) && (
            <View style={styles.tipsContainer}>
              <MaterialCommunityIcons name="lightbulb-outline" size={16} color={exerciseColor} />
              <View style={styles.tipsContent}>
                <Text style={styles.tipsTitle}>İpuçları</Text>
                {exerciseData?.tips ? (
                  exerciseData.tips.map((tip, index) => (
                    <Text key={index} style={styles.tipItem}>• {tip}</Text>
                  ))
                ) : (
                  <Text style={styles.tipsText}>{exercise.tips}</Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Önceki Performans */}
        <PreviousPerformance />

        {/* Set Girişi */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Yeni Set Ekle</Text>
          <SetInputRow />
        </View>

        {/* Set Listesi */}
        <SetList />

        <View style={styles.spacer} />
      </ScrollView>

      {/* Alt Buton */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.finishButton,
            { backgroundColor: sets.length > 0 ? exerciseColor : (theme?.surface || theme?.colors?.surface || '#1E1E1E') },
            sets.length === 0 && styles.finishButtonDisabled
          ]}
          onPress={handleFinishExercise}
          disabled={sets.length === 0}
        >
          <MaterialCommunityIcons 
            name="check" 
            size={24} 
            color={sets.length > 0 ? "#FFFFFF" : theme.textSecondary} 
          />
          <Text style={[
            styles.finishButtonText,
            { color: sets.length > 0 ? "#FFFFFF" : theme.textSecondary }
          ]}>
            Egzersizi Tamamla ({sets.length} set)
          </Text>
        </TouchableOpacity>
      </View>


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
  closeButton: {
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
    paddingHorizontal: 16,
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
  gifButton: {
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
  gifContainer: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gifPlaceholder: {
    height: 200,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseGif: {
    width: '100%',
    height: '100%',
  },
  gifPlaceholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifPlaceholderText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 8,
  },
  exerciseInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  exerciseTags: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  equipmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
  },
  equipmentText: {
    fontSize: 12,
    color: '#B0B0B0',
    marginLeft: 4,
  },
  instructionsContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  instructionStep: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 22,
    marginBottom: 6,
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  tipsContent: {
    flex: 1,
    marginLeft: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  previousContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  previousTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  previousStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previousStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previousStatText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  setInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    minWidth: 60,
    borderWidth: 1,
  },
  addSetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  setsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  setInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  setNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  setNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  setDetails: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  removeSetButton: {
    padding: 8,
  },
  spacer: {
    height: 100,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#0A0A0A',
  },
  finishButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButtonDisabled: {
    opacity: 0.5,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Tenor GIF Kontrolleri
  gifControlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  gifTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  localGifBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  localGifText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  gifControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gifSourceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    marginLeft: 8,
  },
  gifSourceButtonActive: {
    backgroundColor: '#FFC107',
  },
  gifSourceText: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
  },
  gifSourceTextActive: {
    color: '#000000',
  },
  gifSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 8,
  },
  gifSelectorText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  gifLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifLoadingText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 12,
  },
  
  // GIF Seçici Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gifGrid: {
    padding: 20,
  },
  gifSelectorItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  gifSelectorImage: {
    width: '100%',
    height: '100%',
  },
  gifSelectorOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  gifSelectorTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 