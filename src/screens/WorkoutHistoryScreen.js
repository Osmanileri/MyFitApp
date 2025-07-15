import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import workoutStore from '../store/workoutStore';
import WorkoutTheme from '../theme/workoutTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WorkoutHistoryScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Bu Ay');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const { workouts, totalWorkouts, totalWorkoutTime, averageWorkoutDuration } = workoutStore();

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
    'Karışık': '#FFD700',
    'Tüm Vücut': '#FF5722'
  };

  // Filtre seçenekleri
  const filters = ['Tümü', 'Bu Hafta', 'Bu Ay', 'Göğüs', 'Sırt', 'Omuz', 'Kol', 'Bacak', 'Karın'];
  const timeRanges = ['Bu Hafta', 'Bu Ay', '3 Ay', '6 Ay', 'Bu Yıl', 'Tümü'];

  // Filtrelenmiş antrenmanlar
  const getFilteredWorkouts = () => {
    let filtered = [...workouts];

    // Arama filtresi
    if (searchQuery.trim()) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.exercises.some(exercise => 
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Kategori filtresi
    if (selectedFilter !== 'Tümü') {
      if (['Bu Hafta', 'Bu Ay'].includes(selectedFilter)) {
        const now = new Date();
        const filterDate = new Date();
        
        if (selectedFilter === 'Bu Hafta') {
          filterDate.setDate(now.getDate() - 7);
        } else if (selectedFilter === 'Bu Ay') {
          filterDate.setMonth(now.getMonth() - 1);
        }
        
        filtered = filtered.filter(workout => 
          new Date(workout.date) >= filterDate
        );
      } else {
        // Kas grubu filtresi
        filtered = filtered.filter(workout =>
          workout.exercises.some(exercise => 
            exercise.muscleGroup?.name === selectedFilter
          )
        );
      }
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredWorkouts = getFilteredWorkouts();

  // İstatistikler
  const calculateStats = () => {
    const stats = {
      totalWorkouts: filteredWorkouts.length,
      totalTime: filteredWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      totalCalories: filteredWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0),
      averageDuration: 0,
      longestWorkout: 0,
      favoriteType: 'Göğüs',
      totalVolume: 0
    };

    if (stats.totalWorkouts > 0) {
      stats.averageDuration = Math.round(stats.totalTime / stats.totalWorkouts);
      stats.longestWorkout = Math.max(...filteredWorkouts.map(w => w.duration || 0));
      
      // Toplam hacim hesaplama
      stats.totalVolume = filteredWorkouts.reduce((sum, workout) => {
        const workoutVolume = workout.exercises.reduce((exerciseSum, exercise) => {
          return exerciseSum + exercise.sets.reduce((setSum, set) => {
            return setSum + ((set.weight || 0) * (set.reps || 0));
          }, 0);
        }, 0);
        return sum + workoutVolume;
      }, 0);
    }

    return stats;
  };

  const stats = calculateStats();

  // Grafik verisi
  const getChartData = () => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      
      const dayWorkouts = filteredWorkouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate.toDateString() === date.toDateString();
      });
      
      const dayDuration = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      last7Days.push(dayDuration);
    }
    
    return {
      labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      datasets: [{
        data: last7Days,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 3
      }]
    };
  };

  // Antrenman kartı
  const WorkoutCard = ({ workout, index }) => {
    const primaryMuscleGroup = workout.exercises.length > 0 ? 
      workout.exercises[0].muscleGroup?.name || 'Karışık' : 'Karışık';
    
    const cardColor = muscleGroupColors[primaryMuscleGroup] || '#4CAF50';
    
    const workoutVolume = workout.exercises.reduce((sum, exercise) => {
      return sum + exercise.sets.reduce((setSum, set) => {
        return setSum + ((set.weight || 0) * (set.reps || 0));
      }, 0);
    }, 0);

    return (
      <TouchableOpacity
        style={[styles.workoutCard, viewMode === 'list' && styles.listCard]}
        onPress={() => navigation.navigate('WorkoutCompletion', { completedWorkout: workout })}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[cardColor, cardColor + '80']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Kart Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDate}>
                {new Date(workout.date).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" />
            </View>
          </View>

          {/* Kart Stats */}
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="timer" size={16} color="#FFFFFF" />
              <Text style={styles.statValue}>{workout.duration}dk</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={16} color="#FFFFFF" />
              <Text style={styles.statValue}>{workout.calories}kcal</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="dumbbell" size={16} color="#FFFFFF" />
              <Text style={styles.statValue}>{workout.exercises.length}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="weight-lifter" size={16} color="#FFFFFF" />
              <Text style={styles.statValue}>{workoutVolume.toFixed(0)}kg</Text>
            </View>
          </View>

          {/* Muscle Groups */}
          <View style={styles.muscleGroups}>
            {workout.exercises.slice(0, 3).map((exercise, idx) => (
              <View key={idx} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>
                  {exercise.muscleGroup?.name || 'Genel'}
                </Text>
              </View>
            ))}
            {workout.exercises.length > 3 && (
              <View style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>+{workout.exercises.length - 3}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Header
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="chevron-left" size={28} color={theme.text} />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Antrenman Geçmişi</Text>
        <Text style={styles.headerSubtitle}>{filteredWorkouts.length} antrenman</Text>
      </View>
      
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => setShowFilters(true)}
      >
        <MaterialCommunityIcons name="filter-variant" size={24} color={theme.accent} />
      </TouchableOpacity>
    </View>
  );

  // Arama ve filtre bar
  const SearchAndFilters = () => (
    <View style={styles.searchSection}>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Antrenman ara..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // İstatistik kartları
  const StatsCards = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{stats.totalWorkouts}</Text>
          <Text style={styles.statCardLabel}>Antrenman</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{Math.round(stats.totalTime / 60)}h</Text>
          <Text style={styles.statCardLabel}>Toplam Süre</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{stats.totalCalories}</Text>
          <Text style={styles.statCardLabel}>Kalori</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{stats.averageDuration}dk</Text>
          <Text style={styles.statCardLabel}>Ortalama</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{stats.longestWorkout}dk</Text>
          <Text style={styles.statCardLabel}>En Uzun</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{Math.round(stats.totalVolume / 1000)}t</Text>
          <Text style={styles.statCardLabel}>Toplam Hacim</Text>
        </View>
      </View>
    </View>
  );

  // Haftalık grafik
  const WeeklyChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Son 7 Gün</Text>
        <TouchableOpacity
          style={styles.viewModeButton}
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          <MaterialCommunityIcons 
            name={viewMode === 'grid' ? 'view-list' : 'view-grid'} 
            size={20} 
            color={theme.accent} 
          />
        </TouchableOpacity>
      </View>
      
      <LineChart
        data={getChartData()}
        width={screenWidth - 40}
        height={180}
        yAxisSuffix="dk"
        chartConfig={{
          backgroundColor: theme?.surface || theme?.colors?.surface || '#1E1E1E',
          backgroundGradientFrom: theme?.surface || '#252525',
          backgroundGradientTo: theme?.card || '#1E1E1E',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#4CAF50"
          }
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );

  // Filtre modalı
  const FilterModal = () => (
    <Modal visible={showFilters} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtreler</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.filterSectionTitle}>Zaman Aralığı</Text>
          <View style={styles.filterOptions}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.filterOption,
                  selectedTimeRange === range && styles.filterOptionActive
                ]}
                onPress={() => setSelectedTimeRange(range)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedTimeRange === range && styles.filterOptionTextActive
                ]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={() => {
                setSelectedFilter('Tümü');
                setSelectedTimeRange('Bu Ay');
                setSearchQuery('');
              }}
            >
              <Text style={styles.clearButtonText}>Temizle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme?.background || theme?.colors?.background || '#121212'} barStyle="light-content" />
      
      <Header />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchAndFilters />
        <StatsCards />
        <WeeklyChart />
        
        {/* Antrenman Listesi */}
        <View style={styles.workoutsList}>
          <Text style={styles.sectionTitle}>
            Antrenmanlar ({filteredWorkouts.length})
          </Text>
          
          {filteredWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="dumbbell" size={48} color={theme.textSecondary} />
              <Text style={styles.emptyText}>Henüz antrenman yok</Text>
              <Text style={styles.emptySubtext}>İlk antrenmanını başlat!</Text>
            </View>
          ) : (
            <View style={[
              styles.workoutsGrid,
              viewMode === 'list' && styles.workoutsList
            ]}>
              {filteredWorkouts.map((workout, index) => (
                <WorkoutCard key={workout.id} workout={workout} index={index} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <FilterModal />
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
  backButton: {
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 2,
  },
  headerButton: {
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
  searchSection: {
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  filterBar: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statCardLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  workoutsList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  workoutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workoutCard: {
    width: (screenWidth - 52) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listCard: {
    width: screenWidth - 40,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cardHeaderRight: {
    marginLeft: 8,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  muscleTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  muscleTagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#333333',
  },
  filterOptionActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#333333',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 