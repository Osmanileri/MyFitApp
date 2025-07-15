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
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import workoutStore from '../store/workoutStore';
import WorkoutTheme from '../theme/workoutTheme';

// FALLBACK THEME
const FALLBACK_THEME = {
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#FBC02D'
};

const { width: screenWidth } = Dimensions.get('window');

export default function WorkoutDashboardScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    workouts, 
    isWorkoutActive,
    currentWorkout,
    totalWorkouts,
    currentWeekWorkouts,
    weeklyGoal,
    averageWorkoutDuration,
    getRecentWorkouts
  } = workoutStore();

  // Use centralized theme
  const theme = WorkoutTheme || FALLBACK_THEME;

  const recentWorkouts = getRecentWorkouts(3);
  const weeklyProgress = Math.min((currentWeekWorkouts / weeklyGoal) * 100, 100);

  const quickCategories = [
    { 
      id: 'push', 
      name: 'Push', 
      icon: 'weight-lifter', 
      color: '#FF6B35',
      exercises: ['Bench Press', 'Shoulder Press', 'Tricep Dips'],
      backgroundColor: '#FF6B35'
    },
    { 
      id: 'pull', 
      name: 'Pull', 
      icon: 'arm-flex', 
      color: '#4CAF50',
      exercises: ['Pull-ups', 'Barbell Row', 'Bicep Curls'],
      backgroundColor: '#4CAF50'
    },
    { 
      id: 'legs', 
      name: 'Legs', 
      icon: 'run', 
      color: '#2196F3',
      exercises: ['Squats', 'Deadlifts', 'Lunges'],
      backgroundColor: '#2196F3'
    },
    { 
      id: 'cardio', 
      name: 'Cardio', 
      icon: 'heart-pulse', 
      color: '#E91E63',
      exercises: ['Treadmill', 'Cycling', 'HIIT'],
      backgroundColor: '#E91E63'
    }
  ];

  const quickActions = [
    {
      id: 'start_empty',
      title: 'Boş Antrenman',
      subtitle: 'Sıfırdan başla',
      icon: 'plus-circle',
      color: theme.primary,
      action: () => navigation.navigate('StartWorkout')
    },
    {
      id: 'from_template',
      title: 'Şablondan Seç',
      subtitle: 'Hazır programlar',
      icon: 'content-duplicate',
      color: theme.secondary,
      action: () => navigation.navigate('WorkoutEntry', { mode: 'template' })
    },
    {
      id: 'repeat_last',
      title: 'Son Antrenmanı Tekrarla',
      subtitle: recentWorkouts.length > 0 ? recentWorkouts[0]?.name || 'Antrenman' : 'Henüz yok',
      icon: 'replay',
      color: theme.accent,
      action: () => {
        if (recentWorkouts.length > 0) {
          navigation.navigate('WorkoutEntry', { mode: 'repeat', workout: recentWorkouts[0] });
        } else {
          Alert.alert('Bilgi', 'Henüz kaydedilmiş antrenman yok');
        }
      }
    }
  ];

  const handleCategoryPress = (category) => {
    navigation.navigate('StartWorkout', { 
      category: category.id,
      suggestedExercises: category.exercises 
    });
  };

  const handleActiveWorkoutPress = () => {
    if (currentWorkout) {
      navigation.navigate('WorkoutEntry', { mode: 'live' });
    }
  };

  const handleHistoryPress = () => {
    navigation.navigate('WorkoutHistory');
  };

  const handleExerciseLibraryPress = () => {
    navigation.navigate('ExerciseLibrary');
  };

  // Header istatistikleri
  const HeaderStats = () => (
    <View style={styles.headerStats}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{currentWeekWorkouts}</Text>
        <Text style={styles.statLabel}>Bu Hafta</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{totalWorkouts}</Text>
        <Text style={styles.statLabel}>Toplam</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{averageWorkoutDuration}dk</Text>
        <Text style={styles.statLabel}>Ortalama</Text>
      </View>
    </View>
  );

  // Aktif antrenman kartı
  const ActiveWorkoutCard = () => {
    if (!isWorkoutActive || !currentWorkout) return null;

    return (
      <TouchableOpacity 
        style={styles.activeWorkoutCard} 
        onPress={handleActiveWorkoutPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF6B35', '#FF8A50']}
          style={styles.activeWorkoutGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.activeWorkoutContent}>
            <View style={styles.activeWorkoutInfo}>
              <Text style={styles.activeWorkoutTitle}>Aktif Antrenman</Text>
              <Text style={styles.activeWorkoutName}>{currentWorkout.name}</Text>
            </View>
            <MaterialCommunityIcons name="play-circle" size={40} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Hızlı kategori kartları
  const CategoryCard = ({ category }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[category.backgroundColor, `${category.backgroundColor}CC`]}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons 
          name={category.icon} 
          size={32} 
          color="#FFFFFF" 
        />
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryExercises}>
          {category.exercises.length} egzersiz
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Hızlı aksiyonlar
  const QuickActionCard = ({ action }) => (
    <TouchableOpacity 
      style={styles.quickActionCard}
      onPress={action.action}
      activeOpacity={0.8}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
        <MaterialCommunityIcons 
          name={action.icon} 
          size={24} 
          color={action.color} 
        />
      </View>
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{action.title}</Text>
        <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
      </View>
      <MaterialCommunityIcons 
        name="chevron-right" 
        size={20} 
        color={theme.textSecondary} 
      />
    </TouchableOpacity>
  );

  // Son antrenmanlar
  const RecentWorkouts = () => {
    if (recentWorkouts.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Antrenmanlar</Text>
          <TouchableOpacity onPress={handleHistoryPress}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {recentWorkouts.slice(0, 3).map((workout, index) => (
          <TouchableOpacity 
            key={workout.id || index} 
            style={styles.recentWorkoutCard}
            onPress={() => navigation.navigate('WorkoutEntry', { mode: 'view', workout })}
          >
            <View style={styles.recentWorkoutInfo}>
              <Text style={styles.recentWorkoutName}>{workout.name}</Text>
              <Text style={styles.recentWorkoutDate}>
                {new Date(workout.date).toLocaleDateString('tr-TR')}
              </Text>
            </View>
            <View style={styles.recentWorkoutStats}>
              <Text style={styles.recentWorkoutDuration}>{workout.duration}dk</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme?.background || theme?.colors?.background || '#121212'} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Antrenman</Text>
          <Text style={styles.headerTitle}>Zamanı Geldi! 💪</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleExerciseLibraryPress}
        >
          <MaterialCommunityIcons name="dumbbell" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />
        }
      >
        {/* İstatistikler */}
        <HeaderStats />

        {/* Aktif Antrenman */}
        <ActiveWorkoutCard />

        {/* Hızlı Kategoriler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Başlat</Text>
          <View style={styles.categoriesGrid}>
            {quickCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
        </View>

        {/* Hızlı Aksiyonlar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Antrenman Seçenekleri</Text>
          {quickActions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </View>

        {/* Son Antrenmanlar */}
        <RecentWorkouts />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  welcomeText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
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
  headerStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  activeWorkoutCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activeWorkoutGradient: {
    padding: 20,
  },
  activeWorkoutContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeWorkoutInfo: {
    flex: 1,
  },
  activeWorkoutTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  activeWorkoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FFC107',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (screenWidth - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  categoryExercises: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  quickActionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  recentWorkoutCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentWorkoutInfo: {
    flex: 1,
  },
  recentWorkoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recentWorkoutDate: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  recentWorkoutStats: {
    alignItems: 'flex-end',
  },
  recentWorkoutDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC107',
  },
}); 