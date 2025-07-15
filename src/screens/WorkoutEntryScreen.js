import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import workoutStore from '../store/workoutStore';
import WorkoutTheme from '../theme/workoutTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WorkoutEntryScreen({ route, navigation }) {
  const { mode, workoutId, workoutData } = route.params || {};
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showRestModal, setShowRestModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [newWeight, setNewWeight] = useState('');
  const [newReps, setNewReps] = useState('');
  const [editingSet, setEditingSet] = useState(null);
  
  const { 
    currentWorkout, 
    addExerciseToWorkout, 
    addSetToExercise, 
    updateSet,
    removeExercise,
    finishWorkout,
    getPreviousWorkoutData
  } = workoutStore();

  // Use centralized theme
  const theme = WorkoutTheme;

  const muscleGroupColors = {
    'Göğüs': '#FF6B35',
    'Sırt': '#4CAF50',
    'Omuz': '#2196F3',
    'Kol': '#9C27B0',
    'Bacak': '#FF9800',
    'Karın': '#E91E63',
    'Unknown': '#666666'
  };

  // Workout timer
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest timer - counts UP from 0
  useEffect(() => {
    let interval;
    if (isResting) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          const newTime = prev + 1;
          
          // Show notifications at specific intervals
          if (newTime === 60) { // 1 minute
            Alert.alert('1 Dakika Geçti', 'Hazırsan bir sonraki sete başlayabilirsin!', [
              { text: 'Devam Et', style: 'cancel' },
              { text: 'Başla', onPress: () => {
                setIsResting(false);
                setShowRestModal(false);
                setRestTimer(0);
              }}
            ]);
          } else if (newTime === 120) { // 2 minutes
            Alert.alert('2 Dakika Geçti', 'Biraz daha dinlenebilirsin ama hazırsan başlayabilirsin.', [
              { text: 'Devam Et', style: 'cancel' },
              { text: 'Başla', onPress: () => {
                setIsResting(false);
                setShowRestModal(false);
                setRestTimer(0);
              }}
            ]);
          } else if (newTime === 180) { // 3 minutes
            Alert.alert('3 Dakika Geçti', 'Spora dönmelisin! Dinlenmiş olman gerekir.', [
              { text: 'Tamam', onPress: () => {
                setIsResting(false);
                setShowRestModal(false);
                setRestTimer(0);
              }}
            ]);
          }
          
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting]);

  // Kas grupları ve egzersizleri
  const muscleGroups = [
    { 
      id: 'chest', 
      name: 'Göğüs', 
      color: '#FF6B35',
      exercises: [
        { name: 'Bench Press', difficulty: 'Orta', equipment: 'Barbell' },
        { name: 'Incline Press', difficulty: 'Orta', equipment: 'Barbell' },
        { name: 'Dips', difficulty: 'Zor', equipment: 'Bodyweight' },
        { name: 'Chest Fly', difficulty: 'Kolay', equipment: 'Dumbbell' }
      ]
    },
    { 
      id: 'back', 
      name: 'Sırt', 
      color: '#4CAF50',
      exercises: [
        { name: 'Pull-ups', difficulty: 'Zor', equipment: 'Bodyweight' },
        { name: 'Lat Pulldown', difficulty: 'Orta', equipment: 'Cable' },
        { name: 'Barbell Row', difficulty: 'Orta', equipment: 'Barbell' },
        { name: 'T-Bar Row', difficulty: 'Orta', equipment: 'T-Bar' }
      ]
    },
    { 
      id: 'shoulders', 
      name: 'Omuz', 
      color: '#2196F3',
      exercises: [
        { name: 'Shoulder Press', difficulty: 'Orta', equipment: 'Barbell' },
        { name: 'Lateral Raises', difficulty: 'Kolay', equipment: 'Dumbbell' },
        { name: 'Rear Delt Fly', difficulty: 'Orta', equipment: 'Dumbbell' },
        { name: 'Shrugs', difficulty: 'Kolay', equipment: 'Dumbbell' }
      ]
    },
    { 
      id: 'arms', 
      name: 'Kol', 
      color: '#9C27B0',
      exercises: [
        { name: 'Bicep Curls', difficulty: 'Kolay', equipment: 'Dumbbell' },
        { name: 'Tricep Dips', difficulty: 'Orta', equipment: 'Bodyweight' },
        { name: 'Hammer Curls', difficulty: 'Kolay', equipment: 'Dumbbell' },
        { name: 'Close-Grip Press', difficulty: 'Orta', equipment: 'Barbell' }
      ]
    },
    { 
      id: 'legs', 
      name: 'Bacak', 
      color: '#FF9800',
      exercises: [
        { name: 'Squats', difficulty: 'Orta', equipment: 'Barbell' },
        { name: 'Deadlifts', difficulty: 'Zor', equipment: 'Barbell' },
        { name: 'Lunges', difficulty: 'Kolay', equipment: 'Bodyweight' },
        { name: 'Leg Press', difficulty: 'Orta', equipment: 'Machine' }
      ]
    },
    { 
      id: 'core', 
      name: 'Karın', 
      color: '#E91E63',
      exercises: [
        { name: 'Planks', difficulty: 'Orta', equipment: 'Bodyweight' },
        { name: 'Crunches', difficulty: 'Kolay', equipment: 'Bodyweight' },
        { name: 'Russian Twists', difficulty: 'Orta', equipment: 'Bodyweight' },
        { name: 'Mountain Climbers', difficulty: 'Orta', equipment: 'Bodyweight' }
      ]
    }
  ];

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAddSet = (exerciseId) => {
    const exercise = currentWorkout.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 8,
      completed: false
    };

    addSetToExercise(exerciseId, newSet);
  };

  const handleCompleteSet = (exerciseId, setIndex) => {
    const exercise = currentWorkout.exercises.find(ex => ex.id === exerciseId);
    if (!exercise || !exercise.sets[setIndex]) return;

    updateSet(exerciseId, setIndex, { completed: true });
    
    // Rest timer başlat - 0'dan başlayıp yukarı say
    setRestTimer(0);
    setIsResting(true);
    setShowRestModal(true);
  };

  const handleSetUpdate = (exerciseId, setIndex, field, value) => {
    updateSet(exerciseId, setIndex, { [field]: parseFloat(value) || 0 });
  };

  const handleAddExercise = (exercise) => {
    const exerciseData = {
      name: exercise.name,
      muscleGroup: selectedMuscleGroup,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      sets: []
    };

    addExerciseToWorkout(exerciseData);
    setShowAddExerciseModal(false);
    setSelectedMuscleGroup(null);
  };

  const handleFinishWorkout = () => {
    Alert.alert(
      'Antrenmanı Bitir',
      'Antrenmanınızı tamamlamak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Bitir', 
          style: 'destructive',
          onPress: () => {
            const completedWorkout = finishWorkout();
            if (completedWorkout) {
              navigation.navigate('WorkoutCompletion', { completedWorkout });
            } else {
              navigation.navigate('WorkoutDashboard');
            }
          }
        }
      ]
    );
  };

  const calculateStats = () => {
    if (!currentWorkout) return { totalSets: 0, totalVolume: 0, calories: 0 };
    
    let totalSets = 0;
    let totalVolume = 0;
    
    currentWorkout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed) {
          totalSets++;
          totalVolume += (set.weight * set.reps);
        }
      });
    });
    
    const calories = Math.round(workoutTimer * 0.12); // Rough estimate
    
    return { totalSets, totalVolume, calories };
  };

  const stats = calculateStats();

  if (!currentWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noWorkoutContainer}>
          <MaterialCommunityIcons name="dumbbell" size={64} color={theme.textSecondary} />
          <Text style={styles.noWorkoutText}>Aktif antrenman bulunamadı</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme?.background || theme?.colors?.background || '#121212'} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{currentWorkout.name}</Text>
          <Text style={styles.headerSubtitle}>Canlı Antrenman</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.headerButton, isResting && styles.headerButtonActive]}
          onPress={() => setShowRestModal(true)}
        >
          <MaterialCommunityIcons 
            name={isResting ? "timer-sand" : "timer"} 
            size={28} 
            color={isResting ? "#4CAF50" : theme.accent} 
          />
          {isResting && (
            <View style={styles.restIndicator}>
              <Text style={styles.restIndicatorText}>{formatTime(restTimer)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Workout Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock" size={20} color={theme.accent} />
          <Text style={styles.statValue}>{formatTime(workoutTimer)}</Text>
          <Text style={styles.statLabel}>Süre</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="weight-lifter" size={20} color={theme.primary} />
          <Text style={styles.statValue}>{stats.totalSets}</Text>
          <Text style={styles.statLabel}>Set</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="chart-line" size={20} color={theme.secondary} />
          <Text style={styles.statValue}>{stats.totalVolume}kg</Text>
          <Text style={styles.statLabel}>Hacim</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="fire" size={20} color={theme.warning} />
          <Text style={styles.statValue}>{stats.calories}</Text>
          <Text style={styles.statLabel}>Kalori</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exercises */}
        {currentWorkout.exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={[styles.exerciseHeader, { 
              backgroundColor: muscleGroupColors[exercise.muscleGroup?.name] || muscleGroupColors['Unknown'] 
            }]}>
              <View style={styles.exerciseHeaderLeft}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMuscle}>{exercise.muscleGroup?.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeExerciseButton}
                onPress={() => removeExercise(exercise.id)}
              >
                <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.exerciseBody}>
              {/* Previous workout info */}
              <View style={styles.previousWorkoutInfo}>
                <MaterialCommunityIcons name="history" size={16} color={theme.textSecondary} />
                <Text style={styles.previousWorkoutText}>
                  Son antrenman: 80kg × 10 tekrar
                </Text>
              </View>

              {/* Sets */}
              <View style={styles.setsContainer}>
                {exercise.sets.map((set, setIndex) => (
                  <View key={setIndex} style={styles.setRow}>
                    <View style={styles.setNumber}>
                      <Text style={styles.setNumberText}>{setIndex + 1}</Text>
                    </View>
                    
                    <View style={styles.setInputs}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>KG</Text>
                        <TextInput
                          style={[styles.setInput, set.completed && styles.setInputCompleted]}
                          value={set.weight.toString()}
                          onChangeText={(value) => handleSetUpdate(exercise.id, setIndex, 'weight', value)}
                          keyboardType="numeric"
                          editable={!set.completed}
                        />
                      </View>
                      
                      <Text style={styles.inputSeparator}>×</Text>
                      
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>REP</Text>
                        <TextInput
                          style={[styles.setInput, set.completed && styles.setInputCompleted]}
                          value={set.reps.toString()}
                          onChangeText={(value) => handleSetUpdate(exercise.id, setIndex, 'reps', value)}
                          keyboardType="numeric"
                          editable={!set.completed}
                        />
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={[styles.completeSetButton, set.completed && styles.completeSetButtonCompleted]}
                      onPress={() => handleCompleteSet(exercise.id, setIndex)}
                      disabled={set.completed}
                    >
                      <MaterialCommunityIcons 
                        name={set.completed ? "check-circle" : "check"} 
                        size={24} 
                        color={set.completed ? theme.primary : theme.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Add Set Button */}
              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => handleAddSet(exercise.id)}
              >
                <MaterialCommunityIcons name="plus" size={20} color={theme.accent} />
                <Text style={styles.addSetButtonText}>Set Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add Exercise Button */}
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => setShowAddExerciseModal(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color={theme.accent} />
          <Text style={styles.addExerciseButtonText}>Egzersiz Ekle</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.finishButton]}
          onPress={handleFinishWorkout}
        >
          <MaterialCommunityIcons name="stop" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Antrenmanı Bitir</Text>
        </TouchableOpacity>
      </View>

      {/* Rest Timer Modal */}
      <Modal visible={showRestModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.restModal}>
            {/* Header */}
            <View style={styles.restModalHeader}>
              <View style={styles.restHeaderLeft}>
                <MaterialCommunityIcons name="timer-sand" size={24} color={theme.accent} />
                <Text style={styles.restModalTitle}>Dinlenme Zamanı</Text>
              </View>
              <TouchableOpacity 
                style={styles.restCloseButton}
                onPress={() => setShowRestModal(false)}
              >
                <MaterialCommunityIcons name="window-minimize" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* Timer Display */}
            <View style={styles.restTimerContainer}>
              <View style={styles.timerCircle}>
                <Text style={styles.restTimerText}>{formatTime(restTimer)}</Text>
                <Text style={styles.restTimerLabel}>Geçen Süre</Text>
              </View>
            </View>

            {/* Progress Indicators */}
            <View style={styles.progressIndicators}>
              <View style={styles.progressRow}>
                <View style={[styles.progressDot, restTimer >= 60 && styles.progressDotActive]}>
                  <Text style={styles.progressDotText}>1</Text>
                </View>
                <View style={styles.progressLine} />
                <View style={[styles.progressDot, restTimer >= 120 && styles.progressDotActive]}>
                  <Text style={styles.progressDotText}>2</Text>
                </View>
                <View style={styles.progressLine} />
                <View style={[styles.progressDot, restTimer >= 180 && styles.progressDotActive]}>
                  <Text style={styles.progressDotText}>3</Text>
                </View>
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>İyi</Text>
                <Text style={styles.progressLabel}>Yeterli</Text>
                <Text style={styles.progressLabel}>Mükemmel</Text>
              </View>
            </View>

            {/* Rest Status */}
            <View style={styles.restStatus}>
              {restTimer < 60 && (
                <View style={[styles.statusCard, { backgroundColor: '#FF9800' }]}>
                  <MaterialCommunityIcons name="clock-fast" size={20} color="#FFFFFF" />
                  <Text style={styles.statusText}>Henüz erken ama hazırsan başlayabilirsin</Text>
                </View>
              )}
              {restTimer >= 60 && restTimer < 120 && (
                <View style={[styles.statusCard, { backgroundColor: '#4CAF50' }]}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.statusText}>İyi dinlendin! Başlamaya hazırsın</Text>
                </View>
              )}
              {restTimer >= 120 && restTimer < 180 && (
                <View style={[styles.statusCard, { backgroundColor: '#2196F3' }]}>
                  <MaterialCommunityIcons name="thumb-up" size={20} color="#FFFFFF" />
                  <Text style={styles.statusText}>Harika dinlenme! Güçlü bir set için hazırsın</Text>
                </View>
              )}
              {restTimer >= 180 && (
                <View style={[styles.statusCard, { backgroundColor: '#9C27B0' }]}>
                  <MaterialCommunityIcons name="star" size={20} color="#FFFFFF" />
                  <Text style={styles.statusText}>Mükemmel dinlenme! Artık spora dönme zamanı</Text>
                </View>
              )}
            </View>
            
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.quickActionButton, styles.quickAction30s]}
                onPress={() => {
                  setRestTimer(30);
                }}
              >
                <MaterialCommunityIcons name="fast-forward-30" size={20} color="#FFFFFF" />
                <Text style={styles.quickActionText}>30s</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickActionButton, styles.quickAction1min]}
                onPress={() => {
                  setRestTimer(60);
                }}
              >
                <MaterialCommunityIcons name="numeric-1-circle" size={20} color="#FFFFFF" />
                <Text style={styles.quickActionText}>1dk</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickActionButton, styles.quickAction2min]}
                onPress={() => {
                  setRestTimer(120);
                }}
              >
                <MaterialCommunityIcons name="numeric-2-circle" size={20} color="#FFFFFF" />
                <Text style={styles.quickActionText}>2dk</Text>
              </TouchableOpacity>
            </View>
            
            {/* Main Actions */}
            <View style={styles.restMainActions}>
              <TouchableOpacity
                style={[styles.restActionButton, styles.continueRestButton]}
                onPress={() => setShowRestModal(false)}
              >
                <MaterialCommunityIcons name="pause" size={20} color="#FFFFFF" />
                <Text style={styles.restActionText}>Arka Planda Devam Et</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.restActionButton, styles.finishRestButton]}
                onPress={() => {
                  setIsResting(false);
                  setRestTimer(0);
                  setShowRestModal(false);
                }}
              >
                <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
                <Text style={styles.restActionText}>Seti Başlat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal visible={showAddExerciseModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.addExerciseModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Egzersiz Ekle</Text>
              <TouchableOpacity onPress={() => setShowAddExerciseModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            {!selectedMuscleGroup ? (
              <ScrollView style={styles.muscleGroupsList}>
                {muscleGroups.map(group => (
                  <TouchableOpacity
                    key={group.id}
                    style={[styles.muscleGroupItem, { borderLeftColor: group.color }]}
                    onPress={() => setSelectedMuscleGroup(group)}
                  >
                    <Text style={styles.muscleGroupName}>{group.name}</Text>
                    <Text style={styles.muscleGroupCount}>{group.exercises.length} egzersiz</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView style={styles.exercisesList}>
                {selectedMuscleGroup.exercises.map((exercise, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.exerciseItem}
                    onPress={() => handleAddExercise(exercise)}
                  >
                    <View style={styles.exerciseItemInfo}>
                      <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                      <View style={styles.exerciseItemDetails}>
                        <View style={[styles.difficultyBadge, { backgroundColor: 
                          exercise.difficulty === 'Kolay' ? '#4CAF50' : 
                          exercise.difficulty === 'Orta' ? '#FF9800' : '#F44336' 
                        }]}>
                          <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
                        </View>
                        <Text style={styles.equipmentText}>{exercise.equipment}</Text>
                      </View>
                    </View>
                    <MaterialCommunityIcons name="plus" size={24} color={selectedMuscleGroup.color} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerButtonActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  restIndicator: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 36,
  },
  restIndicatorText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  exerciseHeaderLeft: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseMuscle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  removeExerciseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseBody: {
    padding: 16,
  },
  previousWorkoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  previousWorkoutText: {
    fontSize: 12,
    color: '#B0B0B0',
    marginLeft: 8,
  },
  setsContainer: {
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  setNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  setInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    paddingVertical: 8,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  setInputCompleted: {
    backgroundColor: '#4CAF50',
    opacity: 0.7,
  },
  inputSeparator: {
    fontSize: 20,
    color: '#B0B0B0',
    marginTop: 16,
  },
  completeSetButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeSetButtonCompleted: {
    backgroundColor: '#4CAF50',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    gap: 8,
  },
  addSetButtonText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    gap: 8,
  },
  addExerciseButtonText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restModal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    width: screenWidth * 0.92,
    maxHeight: screenHeight * 0.85,
  },
  restModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  restHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  restModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  restCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restTimerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  restTimerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  restTimerLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
  },
  progressIndicators: {
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333',
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  progressDotText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#333333',
    marginHorizontal: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  progressLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  restStatus: {
    marginBottom: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  quickAction30s: {
    backgroundColor: '#FF9800',
  },
  quickAction1min: {
    backgroundColor: '#4CAF50',
  },
  quickAction2min: {
    backgroundColor: '#2196F3',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  restMainActions: {
    gap: 12,
  },
  restActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueRestButton: {
    backgroundColor: '#666666',
  },
  finishRestButton: {
    backgroundColor: '#4CAF50',
  },
  restActionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addExerciseModal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.7,
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
  muscleGroupsList: {
    maxHeight: 400,
  },
  muscleGroupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  muscleGroupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  muscleGroupCount: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  exercisesList: {
    maxHeight: 400,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginBottom: 8,
  },
  exerciseItemInfo: {
    flex: 1,
  },
  exerciseItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exerciseItemDetails: {
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
  equipmentText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  
  // No Workout State
  noWorkoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noWorkoutText: {
    fontSize: 18,
    color: '#B0B0B0',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 