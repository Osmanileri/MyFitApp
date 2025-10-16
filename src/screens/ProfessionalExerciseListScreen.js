// 🏆 PROFESSIONAL EXERCISE LIST SCREEN - App Store Quality
// Premium design with smooth animations and modern UX

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ProfessionalExerciseListScreen = ({ route, navigation }) => {
  const { muscleGroup, category, exercises, exerciseCount } = route.params;
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const listAnim = useRef(new Animated.Value(0)).current;
  
  // State
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(exercises);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Muscle group colors and icons
  const muscleGroupConfig = {
    'Göğüs': { 
      color: ['#FF6B6B', '#FF8E8E'], 
      icon: 'fitness-outline',
      emoji: '💪',
      bgColor: '#FF6B6B15'
    },
    'Sırt': { 
      color: ['#4ECDC4', '#45B7D1'], 
      icon: 'body-outline',
      emoji: '🔙',
      bgColor: '#4ECDC415'
    },
    'Omuz': { 
      color: ['#45B7D1', '#96CEB4'], 
      icon: 'accessibility-outline',
      emoji: '🤲',
      bgColor: '#45B7D115'
    },
    'Kol': { 
      color: ['#FFEAA7', '#FDCB6E'], 
      icon: 'barbell-outline',
      emoji: '💪',
      bgColor: '#FFEAA715'
    },
    'Bacak': { 
      color: ['#DDA0DD', '#BA68C8'], 
      icon: 'walk-outline',
      emoji: '🦵',
      bgColor: '#DDA0DD15'
    },
    'Karın': { 
      color: ['#96CEB4', '#81C784'], 
      icon: 'body-outline',
      emoji: '🏃',
      bgColor: '#96CEB415'
    }
  };

  const config = muscleGroupConfig[category] || muscleGroupConfig['Göğüs'];

  useEffect(() => {
    // Smooth entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter exercises based on search
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [searchQuery, exercises]);

  const handleExercisePress = (exercise) => {
    setSelectedExercise(exercise);
    // Navigate to professional exercise detail route
    navigation.navigate('ProExerciseDetail', { exercise });
  };

  const renderExerciseCard = ({ item, index }) => {
    const animatedStyle = {
      opacity: listAnim,
      transform: [
        {
          translateY: listAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View 
        style={[animatedStyle, { 
          marginBottom: 16,
          marginHorizontal: viewMode === 'grid' ? 8 : 16,
          flex: viewMode === 'grid' ? 0.5 : 1
        }]}
      >
        <Pressable
          onPress={() => handleExercisePress(item)}
          style={({ pressed }) => [
            styles.exerciseCard,
            {
              backgroundColor: config.bgColor,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.9 : 1,
            }
          ]}
        >
          {/* Exercise Image/Icon */}
          <View style={styles.exerciseImageContainer}>
            <LinearGradient
              colors={config.color}
              style={styles.exerciseImageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.exerciseEmoji}>{config.emoji}</Text>
              {/* WGER kaldırıldı */}
            </LinearGradient>
          </View>

          {/* Exercise Info */}
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.exerciseCategory}>
              {item.category}
            </Text>
            
            {/* Exercise Stats */}
            <View style={styles.exerciseStats}>
              <View style={styles.statItem}>
                <Ionicons name="barbell-outline" size={14} color="#666" />
                <Text style={styles.statText}>{item.equipment || 'Equipment'}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up-outline" size={14} color="#666" />
                <Text style={styles.statText}>{item.difficulty || 'Medium'}</Text>
              </View>
            </View>
          </View>

          {/* Arrow Icon */}
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.headerContainer,
        {
          transform: [{ translateY: headerAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <LinearGradient
        colors={config.color}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.headerContent}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{category} Egzersizleri</Text>
            <Text style={styles.headerSubtitle}>
              {exerciseCount} egzersiz • {muscleGroup}
            </Text>
          </View>

          {/* View Mode Toggle */}
          <TouchableOpacity 
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons 
              name={viewMode === 'grid' ? 'list' : 'grid'} 
              size={24} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );

  const renderSearchBar = () => (
    <Animated.View 
      style={[
        styles.searchContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <Text style={styles.searchPlaceholder}>
          {filteredExercises.length} egzersiz içinde ara...
        </Text>
      </View>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={styles.emptyTitle}>Egzersiz Bulunamadı</Text>
      <Text style={styles.emptySubtitle}>
        "{searchQuery}" için sonuç bulunamadı
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={config.color[0]} />
      <Text style={styles.loadingText}>Egzersizler yükleniyor...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={config.color[0]} />
      
      {/* Header */}
      {renderHeader()}

      {/* Content */}
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Search Bar */}
        {renderSearchBar()}

        {/* Loading State */}
        {loading ? renderLoadingState() : (
          <>
            {/* Exercise List */}
            {filteredExercises.length > 0 ? (
              <FlatList
                data={filteredExercises}
                renderItem={renderExerciseCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode} // Force re-render when view mode changes
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            ) : (
              renderEmptyState()
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 120 : 140,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 16,
    color: '#999',
  },
  listContainer: {
    paddingBottom: 100,
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  exerciseImageGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  exerciseEmoji: {
    fontSize: 24,
  },
  // WGER kaldırıldı - rozet stili kullanılmıyor
  exerciseInfo: {
    flex: 1,
    marginLeft: 15,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  exerciseStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#95A5A6',
    marginLeft: 4,
  },
  arrowContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 15,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});

export default ProfessionalExerciseListScreen;