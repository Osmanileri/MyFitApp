import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Share
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import workoutStore from '../store/workoutStore';
import WorkoutTheme from '../theme/workoutTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WorkoutCompletionScreen({ route, navigation }) {
  const { completedWorkout } = route.params || {};
  const [showDetails, setShowDetails] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  const { workouts, getPreviousWorkoutData } = workoutStore();

  // Use centralized theme
  const theme = WorkoutTheme;

  // Kas grubu renkleri
  const muscleGroupColors = {
    'Göğüs': '#FF6B35',
    'Sırt': '#4CAF50',
    'Omuz': '#2196F3',
    'Kol': '#9C27B0',
    'Bacak': '#FF9800',
    'Karın': '#E91E63',
    'Unknown': '#666666'
  };

  // Antrenman istatistikleri hesaplama
  const calculateWorkoutStats = () => {
    if (!completedWorkout || !completedWorkout.exercises) {
      return {
        totalSets: 0,
        totalReps: 0,
        totalVolume: 0,
        exerciseCount: 0,
        topWeight: 0,
        muscleGroups: [],
        avgRestTime: 0
      };
    }

    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;
    let topWeight = 0;
    const muscleGroups = new Set();

    completedWorkout.exercises.forEach(exercise => {
      if (exercise.muscleGroup) {
        muscleGroups.add(exercise.muscleGroup.name || exercise.muscleGroup);
      }
      
      exercise.sets.forEach(set => {
        if (set.completed) {
          totalSets++;
          totalReps += set.reps || 0;
          totalVolume += (set.weight || 0) * (set.reps || 0);
          topWeight = Math.max(topWeight, set.weight || 0);
        }
      });
    });

    return {
      totalSets,
      totalReps,
      totalVolume,
      exerciseCount: completedWorkout.exercises.length,
      topWeight,
      muscleGroups: Array.from(muscleGroups),
      avgRestTime: 90 // Ortalama dinlenme süresi (saniye)
    };
  };

  const stats = calculateWorkoutStats();

  // Önceki antrenmanlarla karşılaştırma
  const getImprovements = () => {
    const previousWorkouts = workouts.filter(w => w.id !== completedWorkout.id);
    if (previousWorkouts.length === 0) return {};

    const lastWorkout = previousWorkouts[0];
    const improvements = {};

    if (lastWorkout.duration) {
      improvements.duration = completedWorkout.duration - lastWorkout.duration;
    }
    if (lastWorkout.calories) {
      improvements.calories = completedWorkout.calories - lastWorkout.calories;
    }

    return improvements;
  };

  const improvements = getImprovements();

  // Motivasyonel mesajlar
  const getMotivationalMessage = () => {
    const messages = [
      "Harika bir antrenman tamamladın! 💪",
      "Hedeflerine bir adım daha yaklaştın! 🎯",
      "Bugün kendini geçtin! 🏆",
      "Mükemmel bir performans! 🔥",
      "Kararlılığın takdire şayan! ⭐",
      "Güçlü kalman ilham verici! 💎",
      "Başarı senin için kaçınılmaz! 🚀"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Başarı rozetleri
  const getAchievements = () => {
    const achievements = [];
    
    if (stats.totalSets >= 20) {
      achievements.push({ icon: 'trophy', title: 'Set Kralı', desc: '20+ set tamamladın!' });
    }
    if (stats.totalVolume >= 1000) {
      achievements.push({ icon: 'weight-lifter', title: 'Güç Canavarı', desc: '1000+ kg hacim!' });
    }
    if (completedWorkout.duration >= 60) {
      achievements.push({ icon: 'timer', title: 'Dayanıklı', desc: '60+ dakika antrenman!' });
    }
    if (stats.exerciseCount >= 8) {
      achievements.push({ icon: 'dumbbell', title: 'Çeşitlilik', desc: '8+ farklı egzersiz!' });
    }
    if (stats.muscleGroups.length >= 3) {
      achievements.push({ icon: 'human-handsup', title: 'Tam Vücut', desc: '3+ kas grubu!' });
    }

    return achievements;
  };

  const achievements = getAchievements();

  // Paylaş fonksiyonu
  const handleShare = async () => {
    setShareLoading(true);
    try {
      const shareText = `🏋️‍♂️ Antrenman Tamamlandı!\n\n` +
        `📊 ${stats.totalSets} Set | ${stats.totalReps} Tekrar\n` +
        `⚡ ${stats.totalVolume.toFixed(0)} kg Toplam Hacim\n` +
        `⏱️ ${completedWorkout.duration} Dakika\n` +
        `🔥 ${completedWorkout.calories} Kalori\n\n` +
        `💪 ${stats.muscleGroups.join(', ')} antrenmanı tamamladım!\n\n` +
        `#fitness #workout #antrenman`;

      await Share.share({
        message: shareText,
        title: 'Antrenman Özeti'
      });
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu');
    } finally {
      setShareLoading(false);
    }
  };

  // Zaman formatlama
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ana başlık
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('WorkoutDashboard')}
      >
        <MaterialCommunityIcons name="close" size={24} color={theme.text} />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Antrenman Tamamlandı!</Text>
        <Text style={styles.headerSubtitle}>{getMotivationalMessage()}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        disabled={shareLoading}
      >
        <MaterialCommunityIcons 
          name={shareLoading ? "loading" : "share-variant"} 
          size={24} 
          color={theme.accent} 
        />
      </TouchableOpacity>
    </View>
  );

  // Ana istatistikler
  const MainStats = () => (
    <View style={styles.mainStatsContainer}>
      <LinearGradient
        colors={['#4CAF50', '#45A049']}
        style={styles.mainStatsCard}
      >
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalSets}</Text>
            <Text style={styles.statLabel}>SET</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalReps}</Text>
            <Text style={styles.statLabel}>TEKRAR</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalVolume.toFixed(0)}</Text>
            <Text style={styles.statLabel}>KG HACİM</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedWorkout.duration}</Text>
            <Text style={styles.statLabel}>DAKİKA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedWorkout.calories}</Text>
            <Text style={styles.statLabel}>KALORİ</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.exerciseCount}</Text>
            <Text style={styles.statLabel}>EGZERSİZ</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  // Gelişim çemberi
  const ProgressCircle = () => (
    <View style={styles.progressSection}>
      <Text style={styles.sectionTitle}>Antrenman Tamamlama</Text>
      <View style={styles.progressCircleContainer}>
        <AnimatedCircularProgress
          size={120}
          width={8}
          fill={100}
          tintColor="#4CAF50"
          backgroundColor="#2A2A2A"
          rotation={0}
          duration={2000}
        >
          {() => (
            <View style={styles.progressCenter}>
              <MaterialCommunityIcons name="check" size={40} color="#4CAF50" />
              <Text style={styles.progressText}>100%</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
    </View>
  );

  // Başarı rozetleri
  const AchievementBadges = () => (
    <View style={styles.achievementsSection}>
      <Text style={styles.sectionTitle}>Kazanılan Başarılar</Text>
      <View style={styles.badgesContainer}>
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <View key={index} style={styles.badgeCard}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.badgeIcon}
              >
                <MaterialCommunityIcons 
                  name={achievement.icon} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
              <Text style={styles.badgeTitle}>{achievement.title}</Text>
              <Text style={styles.badgeDesc}>{achievement.desc}</Text>
            </View>
          ))
        ) : (
          <View style={styles.noBadgesCard}>
            <MaterialCommunityIcons name="medal" size={32} color={theme.textSecondary} />
            <Text style={styles.noBadgesText}>Daha fazla antrenman yaparak rozet kazan!</Text>
          </View>
        )}
      </View>
    </View>
  );

  // Kas grubu dağılımı
  const MuscleGroupBreakdown = () => (
    <View style={styles.muscleSection}>
      <Text style={styles.sectionTitle}>Çalışılan Kas Grupları</Text>
      <View style={styles.muscleGroupsContainer}>
        {stats.muscleGroups.map((muscle, index) => (
          <View key={index} style={styles.muscleGroupCard}>
            <LinearGradient
              colors={[muscleGroupColors[muscle] || '#666666', '#333333']}
              style={styles.muscleGroupGradient}
            >
              <Text style={styles.muscleGroupName}>{muscle}</Text>
            </LinearGradient>
          </View>
        ))}
      </View>
    </View>
  );

  // Egzersiz detayları
  const ExerciseDetails = () => (
    <View style={styles.exerciseDetailsSection}>
      <TouchableOpacity
        style={styles.detailsToggle}
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text style={styles.sectionTitle}>Egzersiz Detayları</Text>
        <MaterialCommunityIcons 
          name={showDetails ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={theme.accent} 
        />
      </TouchableOpacity>
      
      {showDetails && (
        <View style={styles.exerciseList}>
          {completedWorkout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <View style={[styles.exerciseHeader, { 
                backgroundColor: muscleGroupColors[exercise.muscleGroup?.name] || '#666666' 
              }]}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMuscle}>{exercise.muscleGroup?.name}</Text>
              </View>
              <View style={styles.exerciseStats}>
                <Text style={styles.exerciseStatText}>
                  {exercise.sets.filter(s => s.completed).length} set tamamlandı
                </Text>
                <Text style={styles.exerciseStatText}>
                  Toplam: {exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)} kg
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // Sonraki adımlar
  const NextSteps = () => (
    <View style={styles.nextStepsSection}>
      <Text style={styles.sectionTitle}>Sonraki Adımlar</Text>
      <View style={styles.stepsContainer}>
        <View style={styles.stepCard}>
          <MaterialCommunityIcons name="water" size={24} color="#2196F3" />
          <Text style={styles.stepText}>Bol su iç ve hidratasyonu sağla</Text>
        </View>
        <View style={styles.stepCard}>
          <MaterialCommunityIcons name="food-apple" size={24} color="#4CAF50" />
          <Text style={styles.stepText}>Protein açısından zengin beslenme</Text>
        </View>
        <View style={styles.stepCard}>
          <MaterialCommunityIcons name="sleep" size={24} color="#9C27B0" />
          <Text style={styles.stepText}>Kaliteli dinlenme ve uyku</Text>
        </View>
      </View>
    </View>
  );

  // Ana butonlar
  const ActionButtons = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => navigation.navigate('WorkoutHistory')}
      >
        <MaterialCommunityIcons name="history" size={20} color={theme.text} />
        <Text style={styles.actionButtonText}>Antrenman Geçmişi</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={() => navigation.navigate('WorkoutDashboard')}
      >
        <MaterialCommunityIcons name="home" size={20} color="#FFFFFF" />
        <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Ana Sayfa</Text>
      </TouchableOpacity>
    </View>
  );

  if (!completedWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={64} color={theme.error} />
          <Text style={styles.errorText}>Antrenman verisi bulunamadı</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.navigate('WorkoutDashboard')}
          >
            <Text style={styles.errorButtonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme?.background || theme?.colors?.background || '#121212'} barStyle="light-content" />
      
      <Header />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MainStats />
        <ProgressCircle />
        <AchievementBadges />
        <MuscleGroupBreakdown />
        <ExerciseDetails />
        <NextSteps />
        <ActionButtons />
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  mainStatsContainer: {
    marginVertical: 20,
  },
  mainStatsCard: {
    borderRadius: 16,
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  progressSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressCircleContainer: {
    alignItems: 'center',
  },
  progressCenter: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
  achievementsSection: {
    marginVertical: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  noBadgesCard: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  noBadgesText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 8,
  },
  muscleSection: {
    marginVertical: 20,
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleGroupCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  muscleGroupGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  muscleGroupName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseDetailsSection: {
    marginVertical: 20,
  },
  detailsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseList: {
    marginTop: 16,
  },
  exerciseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  exerciseHeader: {
    padding: 16,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseMuscle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  exerciseStats: {
    padding: 16,
    paddingTop: 0,
  },
  exerciseStatText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  nextStepsSection: {
    marginVertical: 20,
  },
  stepsContainer: {
    gap: 12,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 