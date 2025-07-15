import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import workoutStore from '../store/workoutStore';
import WorkoutTheme from '../theme/workoutTheme';

// NUCLEAR FALLBACK THEME
const FALLBACK_THEME = {
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#FBC02D',
  surface: '#1E1E1E',
  colors: {
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    primary: '#FBC02D',
    surface: '#1E1E1E'
  }
};
import WorkoutButton from '../components/WorkoutButton';
import ExerciseAPI from '../services/exerciseAPI';
import LocalAnimationService from '../services/localAnimationService';

const { width: screenWidth } = Dimensions.get('window');

export default function ExerciseLibraryScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState('Tümü');
  const [filterEquipment, setFilterEquipment] = useState('Tümü');
  const [showGifModal, setShowGifModal] = useState(false);
  const [selectedExerciseForGif, setSelectedExerciseForGif] = useState(null);
  
  // Tenor GIF state'leri
  const [exerciseGifs, setExerciseGifs] = useState({});
  const [gifLoadingStates, setGifLoadingStates] = useState({});
  
  const { 
    exerciseDatabase, 
    searchExercises, 
    getExercisesByCategory,
    addExerciseToWorkout,
    currentWorkout,
    isWorkoutActive
  } = workoutStore();
  
  const { mode, selectedMuscleGroups, onExercisesSelected } = route.params || {};

  // ULTRA GÜVENLİ TEMA SİSTEMİ
  const theme = WorkoutTheme || FALLBACK_THEME;

  // Debug tema durumu
  React.useEffect(() => {
    console.log('🔥 AGRESIF TEMA DEBUG:', {
      WorkoutTheme: !!WorkoutTheme,
      WorkoutThemeType: typeof WorkoutTheme,
      theme: !!theme,
      themeType: typeof theme,
      themeBackground: theme?.background,
      themeColorsBackground: theme?.colors?.background,
      themeStructure: Object.keys(theme || {}),
      themeBackgroundDirect: theme.background,
      fullTheme: JSON.stringify(theme, null, 2).substring(0, 200)
    });
    
    // NUCLEAR TEST: Doğrudan erişim testi
    try {
      const testBg = theme.background;
      console.log('✅ theme.background ERİŞİM BAŞARILI:', testBg);
    } catch (error) {
      console.error('❌ theme.background ERİŞİM HATASI:', error.message);
      console.error('💀 ERROR STACK:', error.stack);
    }
  }, []);

  // Kategori filtreleri - her birinin kendine özel rengi
  const categories = [
    { 
      name: 'Tümü', 
      icon: 'dumbbell', 
      color: '#FFC107',
      backgroundColor: '#FFC107',
      muscleGroup: 'Tümü',
      exerciseCount: 0
    },
    { 
      name: 'Göğüs', 
      icon: 'weight-lifter', 
      color: '#FF6B35',
      backgroundColor: '#FF6B35',
      muscleGroup: 'Göğüs',
      exerciseCount: 0
    },
    { 
      name: 'Sırt', 
      icon: 'account-outline', 
      color: '#4CAF50',
      backgroundColor: '#4CAF50',
      muscleGroup: 'Sırt',
      exerciseCount: 0
    },
    { 
      name: 'Omuz', 
      icon: 'arm-flex-outline', 
      color: '#2196F3',
      backgroundColor: '#2196F3',
      muscleGroup: 'Omuz',
      exerciseCount: 0
    },
    { 
      name: 'Kol', 
      icon: 'arm-flex', 
      color: '#9C27B0',
      backgroundColor: '#9C27B0',
      muscleGroup: 'Kol',
      exerciseCount: 0
    },
    { 
      name: 'Bacak', 
      icon: 'run', 
      color: '#FF9800',
      backgroundColor: '#FF9800',
      muscleGroup: 'Bacak',
      exerciseCount: 0
    },
    { 
      name: 'Karın', 
      icon: 'human-male-height', 
      color: '#E91E63',
      backgroundColor: '#E91E63',
      muscleGroup: 'Karın',
      exerciseCount: 0
    }
  ];

  // Mock egzersiz datası
  const mockExercises = [
    {
      id: 1,
      name: 'Bench Press',
      category: 'Göğüs',
      muscleGroups: ['Göğüs', 'Kol'],
      equipment: 'Barbell',
      difficulty: 'Orta',
      instructions: 'Sırt üstü yatarak barbell ile göğüs çalışması',
      tips: 'Sıkıştırma hissini göğüste hissetmelisiniz'
    },
    {
      id: 2,
      name: 'Incline Press',
      category: 'Göğüs',
      muscleGroups: ['Göğüs', 'Omuz'],
      equipment: 'Barbell',
      difficulty: 'Orta',
      instructions: 'Eğimli bankta üst göğüs çalışması',
      tips: 'Üst göğüse odaklanın'
    },
    {
      id: 3,
      name: 'Push-up',
      category: 'Göğüs',
      muscleGroups: ['Göğüs', 'Kol'],
      equipment: 'Bodyweight',
      difficulty: 'Başlangıç',
      instructions: 'Kendi vücut ağırlığınızla şınav',
      tips: 'Vücut düz bir çizgi halinde olmalı'
    },
    {
      id: 4,
      name: 'Pull-ups',
      category: 'Sırt',
      muscleGroups: ['Sırt', 'Kol'],
      equipment: 'Bodyweight',
      difficulty: 'İleri',
      instructions: 'Bardan asılarak vücut çekme',
      tips: 'Sırt kaslarınızı sıkıştırın'
    },
    {
      id: 5,
      name: 'Lat Pulldown',
      category: 'Sırt',
      muscleGroups: ['Sırt', 'Kol'],
      equipment: 'Machine',
      difficulty: 'Orta',
      instructions: 'Lat makinesi ile sırt çalışması',
      tips: 'Omuzları geriye çekin'
    },
    {
      id: 6,
      name: 'Barbell Row',
      category: 'Sırt',
      muscleGroups: ['Sırt', 'Kol'],
      equipment: 'Barbell',
      difficulty: 'Orta',
      instructions: 'Eğilerek barbell çekme',
      tips: 'Sırt düz kalmalı'
    },
    {
      id: 7,
      name: 'Shoulder Press',
      category: 'Omuz',
      muscleGroups: ['Omuz', 'Kol'],
      equipment: 'Dumbbell',
      difficulty: 'Orta',
      instructions: 'Omuz üstü basma hareketi',
      tips: 'Kontrollü hareket yapın'
    },
    {
      id: 8,
      name: 'Lateral Raises',
      category: 'Omuz',
      muscleGroups: ['Omuz'],
      equipment: 'Dumbbell',
      difficulty: 'Başlangıç',
      instructions: 'Yana doğru kaldırma',
      tips: 'Yavaş ve kontrollü'
    },
    {
      id: 9,
      name: 'Bicep Curls',
      category: 'Kol',
      muscleGroups: ['Kol'],
      equipment: 'Dumbbell',
      difficulty: 'Başlangıç',
      instructions: 'Bicep kasını çalıştırma',
      tips: 'Dirsek sabit kalmalı'
    },
    {
      id: 10,
      name: 'Tricep Dips',
      category: 'Kol',
      muscleGroups: ['Kol'],
      equipment: 'Bodyweight',
      difficulty: 'Orta',
      instructions: 'Tricep kasını çalıştırma',
      tips: 'Dirsekler vücuda yakın'
    },
    {
      id: 11,
      name: 'Squats',
      category: 'Bacak',
      muscleGroups: ['Bacak'],
      equipment: 'Bodyweight',
      difficulty: 'Başlangıç',
      instructions: 'Temel çömelme hareketi',
      tips: 'Dizler ayak parmak hizasında'
    },
    {
      id: 12,
      name: 'Leg Press',
      category: 'Bacak',
      muscleGroups: ['Bacak'],
      equipment: 'Machine',
      difficulty: 'Orta',
      instructions: 'Makine ile bacak basma',
      tips: 'Tam hareket mesafesi'
    },
    {
      id: 13,
      name: 'Planks',
      category: 'Karın',
      muscleGroups: ['Karın'],
      equipment: 'Bodyweight',
      difficulty: 'Başlangıç',
      instructions: 'Karın kasını statik çalıştırma',
      tips: 'Vücut düz çizgi halinde'
    },
    {
      id: 14,
      name: 'Crunches',
      category: 'Karın',
      muscleGroups: ['Karın'],
      equipment: 'Bodyweight',
      difficulty: 'Başlangıç',
      instructions: 'Karın kası mekik hareketi',
      tips: 'Boyun gerginliğinden kaçının'
    }
  ];

  useEffect(() => {
    loadExercisesFromAPI();
  }, []);

  // Yerel animasyon yükle
  const loadExerciseAnimation = async (exerciseName) => {
    if (exerciseGifs[exerciseName] || gifLoadingStates[exerciseName]) {
      return; // Zaten yüklenmiş veya yükleniyor
    }
    
    try {
      setGifLoadingStates(prev => ({ ...prev, [exerciseName]: true }));
      
      const animation = await LocalAnimationService.getExerciseAnimation(exerciseName);
      
      if (animation) {
        setExerciseGifs(prev => ({ ...prev, [exerciseName]: animation }));
      }
    } catch (error) {
      console.error(`Error loading animation for ${exerciseName}:`, error);
    } finally {
      setGifLoadingStates(prev => ({ ...prev, [exerciseName]: false }));
    }
  };

  // API'den egzersizleri yükle
  const loadExercisesFromAPI = async () => {
    try {
      const apiExercises = await ExerciseAPI.getAllExercises();
      setExercises(apiExercises);
      setFilteredExercises(apiExercises);
      
      // Kategori sayılarını güncelle
      categories.forEach(category => {
        if (category.name === 'Tümü') {
          category.exerciseCount = apiExercises.length;
        } else {
          category.exerciseCount = apiExercises.filter(ex => ex.category === category.name).length;
        }
      });
    } catch (error) {
      console.error('Error loading exercises from API:', error);
      // Fallback olarak mock data kullan
      setExercises(mockExercises);
      setFilteredExercises(mockExercises);
      
      categories.forEach(category => {
        if (category.name === 'Tümü') {
          category.exerciseCount = mockExercises.length;
        } else {
          category.exerciseCount = mockExercises.filter(ex => ex.category === category.name).length;
        }
      });
    }
  };

  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedCategory, filterDifficulty, filterEquipment]);

  const filterExercises = () => {
    let filtered = [...exercises];
    
    // Kategori filtresi
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(exercise => 
        exercise.category === selectedCategory ||
        exercise.muscleGroups.includes(selectedCategory)
      );
    }
    
    // Arama filtresi
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Zorluk filtresi
    if (filterDifficulty !== 'Tümü') {
      filtered = filtered.filter(exercise => exercise.difficulty === filterDifficulty);
    }
    
    // Ekipman filtresi
    if (filterEquipment !== 'Tümü') {
      filtered = filtered.filter(exercise => exercise.equipment === filterEquipment);
    }
    
    setFilteredExercises(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
  };

  const handleExerciseSelect = (exercise) => {
    if (mode === 'select') {
      // Çoklu seçim modu
      setSelectedExercises(prev => {
        if (prev.includes(exercise.name)) {
          return prev.filter(name => name !== exercise.name);
        } else {
          return [...prev, exercise.name];
        }
      });
    } else if (mode === 'live') {
      // Canlı antrenman modu
      navigation.navigate('ExerciseDetail', { 
        exercise, 
        mode,
        onExerciseAdded: () => {
          navigation.navigate('WorkoutEntry', { mode });
        }
      });
    } else {
      // Detay göster
      setSelectedExerciseForGif(exercise);
      setShowGifModal(true);
    }
  };

  const handleGifPreview = (exercise) => {
    setSelectedExerciseForGif(exercise);
    setShowGifModal(true);
  };

  const handleDoneSelection = () => {
    if (selectedExercises.length === 0) {
      Alert.alert('Egzersiz Seçin', 'Lütfen en az bir egzersiz seçin.');
      return;
    }
    
    if (onExercisesSelected) {
      onExercisesSelected(selectedExercises);
    }
    navigation.goBack();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Başlangıç': return '#4CAF50';
      case 'Orta': return '#FF9800';
      case 'İleri': return '#F44336';
      default: return theme.textSecondary;
    }
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

  // Kategori kartı
  const CategoryCard = ({ category, isSelected }) => (
    <TouchableOpacity 
      style={[
        styles.categoryCard,
        isSelected && styles.categoryCardSelected
      ]}
      onPress={() => handleCategorySelect(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          isSelected 
            ? [category.backgroundColor, `${category.backgroundColor}CC`]
            : ['#1A1A1A', '#2A2A2A']
        }
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons 
          name={category.icon} 
          size={28} 
          color={isSelected ? '#FFFFFF' : category.color}
        />
        <Text style={[
          styles.categoryName,
          isSelected && styles.categoryNameSelected
        ]}>
          {category.name}
        </Text>
        <Text style={[
          styles.categoryCount,
          isSelected && styles.categoryCountSelected
        ]}>
          {category.exerciseCount} egzersiz
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Egzersiz kartı
  const ExerciseCard = ({ exercise }) => {
    const isSelected = selectedExercises.includes(exercise.name);
    const categoryColor = categories.find(cat => cat.name === exercise.category)?.color || theme.primary;
    const exerciseGif = exerciseGifs[exercise.name];
    const isGifLoading = gifLoadingStates[exercise.name];
    
    // GIF'i yükle (sadece ilk kez)
    React.useEffect(() => {
      if (!exerciseGif && !isGifLoading) {
        loadExerciseAnimation(exercise.name);
      }
    }, [exercise.name]);
    
    return (
      <TouchableOpacity 
        style={[
          styles.exerciseCard,
          isSelected && styles.exerciseCardSelected
        ]}
        onPress={() => handleExerciseSelect(exercise)}
        activeOpacity={0.8}
      >
        <View style={styles.exerciseCardContent}>
          {/* Sol taraf - GIF Önizleme */}
          <View style={styles.exerciseGifPreview}>
            {isGifLoading ? (
              <View style={styles.gifPreviewPlaceholder}>
                <MaterialCommunityIcons 
                  name="loading" 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </View>
            ) : exerciseGif ? (
              <TouchableOpacity 
                style={styles.gifPreviewContainer}
                onPress={() => handleGifPreview(exercise)}
              >
                <Image 
                  source={
                    exerciseGif.isLocal && exerciseGif.source 
                      ? exerciseGif.source  // Yerel GIF (require ile)
                      : { uri: exerciseGif.preview || exerciseGif.url }  // Remote GIF
                  }
                  style={styles.gifPreviewImage}
                  resizeMode="cover"
                />
                <View style={styles.gifPreviewOverlay}>
                  <MaterialCommunityIcons 
                    name="play-circle" 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={[styles.gifPreviewPlaceholder, { backgroundColor: categoryColor + '20' }]}>
                <MaterialCommunityIcons 
                  name="dumbbell" 
                  size={20} 
                  color={categoryColor} 
                />
              </View>
            )}
          </View>
          
          {/* Orta - Ana bilgiler */}
          <View style={styles.exerciseMainInfo}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseCategory} numberOfLines={1}>
              {exercise.muscleGroups.join(', ')}
            </Text>
          </View>
          
          {/* Orta - Etiketler */}
          <View style={styles.exerciseTags}>
            <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' }]}>
              <Text style={[styles.tagText, { color: getDifficultyColor(exercise.difficulty) }]}>
                {exercise.difficulty}
              </Text>
            </View>
            <View style={styles.equipmentTag}>
              <MaterialCommunityIcons 
                name={getEquipmentIcon(exercise.equipment)} 
                size={12} 
                color={theme.textSecondary} 
              />
              <Text style={styles.equipmentText}>{exercise.equipment}</Text>
            </View>
          </View>
          
          {/* Sağ taraf - Aksiyon */}
          <View style={styles.exerciseActions}>
            {mode === 'select' && (
              <View style={[
                styles.selectIndicator,
                isSelected && { backgroundColor: categoryColor }
              ]}>
                {isSelected && (
                  <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                )}
              </View>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: categoryColor + '20' }]}
              onPress={() => handleExerciseSelect(exercise)}
            >
              <MaterialCommunityIcons 
                name={mode === 'select' ? 'plus' : 'play-circle-outline'} 
                size={20} 
                color={categoryColor} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme?.background || theme?.colors?.background || FALLBACK_THEME.background} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Hareketler</Text>
          <Text style={styles.headerSubtitle}>
            {filteredExercises.length} egzersiz bulundu
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <MaterialCommunityIcons 
            name="tune" 
            size={24} 
            color={showFilters ? theme.primary : theme.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Arama */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Egzersiz ara..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtreler */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Zorluk:</Text>
              {['Tümü', 'Başlangıç', 'Orta', 'İleri'].map((level) => (
                <TouchableOpacity 
                  key={level}
                  style={[
                    styles.filterChip,
                    filterDifficulty === level && styles.filterChipActive
                  ]}
                  onPress={() => setFilterDifficulty(level)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterDifficulty === level && styles.filterChipTextActive
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Kategoriler */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesRow}>
            {categories.map((category) => (
              <CategoryCard 
                key={category.name} 
                category={category} 
                isSelected={selectedCategory === category.name}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Egzersiz Listesi */}
      <FlatList
        data={filteredExercises}
        renderItem={({ item }) => <ExerciseCard exercise={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={styles.exercisesList}
        contentContainerStyle={styles.exercisesListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="dumbbell" size={64} color={theme.textSecondary} />
            <Text style={styles.emptyStateText}>Egzersiz bulunamadı</Text>
            <Text style={styles.emptyStateSubtext}>Arama kriterlerinizi değiştirin</Text>
          </View>
        )}
      />

      {/* Alt Buton */}
      {mode === 'select' && selectedExercises.length > 0 && (
        <View style={styles.bottomButton}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDoneSelection}
          >
            <MaterialCommunityIcons name="check" size={24} color="#FFFFFF" />
            <Text style={styles.doneButtonText}>
              {selectedExercises.length} Egzersiz Seç
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* GIF Preview Modal */}
      <Modal
        visible={showGifModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGifModal(false)}
      >
        <View style={styles.gifModalOverlay}>
          <TouchableOpacity 
            style={styles.gifModalBackground}
            onPress={() => setShowGifModal(false)}
          />
          <View style={styles.gifModalContent}>
            <View style={styles.gifModalHeader}>
              <Text style={styles.gifModalTitle}>
                {selectedExerciseForGif?.name}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowGifModal(false)}
                style={styles.gifModalCloseButton}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={24} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Tenor GIF Display */}
            <View style={styles.gifContainer}>
              {selectedExerciseForGif && exerciseGifs[selectedExerciseForGif.name] ? (
                <Image
                  source={
                    exerciseGifs[selectedExerciseForGif.name].isLocal && exerciseGifs[selectedExerciseForGif.name].source
                      ? exerciseGifs[selectedExerciseForGif.name].source  // Yerel GIF (require ile)
                      : { uri: exerciseGifs[selectedExerciseForGif.name].url }  // Remote GIF
                  }
                  style={styles.modalGifImage}
                  resizeMode="contain"
                />
              ) : gifLoadingStates[selectedExerciseForGif?.name] ? (
                <View style={styles.gifLoadingContainer}>
                  <MaterialCommunityIcons 
                    name="loading" 
                    size={64} 
                    color={theme.primary} 
                  />
                  <Text style={styles.gifLoadingText}>GIF Yükleniyor...</Text>
                </View>
              ) : (
                <View style={styles.gifPlaceholderContainer}>
                  <MaterialCommunityIcons 
                    name="play-circle" 
                    size={64} 
                    color={theme.primary} 
                  />
                  <Text style={styles.gifPlaceholderText}>
                    {selectedExerciseForGif?.name}
                  </Text>
                  <Text style={styles.gifDescription}>
                    Hareket gösterimi için Tenor GIF'i yüklenemedi
                  </Text>
                </View>
              )}
            </View>
            
            {/* Exercise Details */}
            <View style={styles.exerciseModalDetails}>
              <View style={styles.exerciseModalDetailRow}>
                <MaterialCommunityIcons 
                  name="target" 
                  size={16} 
                  color={theme?.colors?.primary || theme?.primary || '#FBC02D'} 
                />
                <Text style={styles.exerciseModalDetailText}>
                  {selectedExerciseForGif?.muscleGroups?.join(', ')}
                </Text>
              </View>
              <View style={styles.exerciseModalDetailRow}>
                <MaterialCommunityIcons 
                  name="dumbbell" 
                  size={16} 
                  color={theme?.colors?.primary || theme?.primary || '#FBC02D'} 
                />
                <Text style={styles.exerciseModalDetailText}>
                  {selectedExerciseForGif?.equipment}
                </Text>
              </View>
              <View style={styles.exerciseModalDetailRow}>
                <MaterialCommunityIcons 
                  name="trending-up" 
                  size={16} 
                  color={theme?.colors?.primary || theme?.primary || '#FBC02D'} 
                />
                <Text style={styles.exerciseModalDetailText}>
                  {selectedExerciseForGif?.difficulty}
                </Text>
              </View>
            </View>

            {/* Add to Workout Button */}
            {(mode === 'live' || mode === 'manual') && (
              <WorkoutButton
                title="Antrenmana Ekle"
                icon="plus"
                onPress={() => {
                  setShowGifModal(false);
                  handleExerciseSelect(selectedExerciseForGif);
                }}
                style={styles.addToWorkoutButton}
              />
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginRight: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#FFC107',
  },
  filterChipText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  filterChipTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: 90,
    height: 90,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryCardSelected: {
    transform: [{ scale: 0.95 }],
  },
  categoryGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  categoryNameSelected: {
    color: '#FFFFFF',
  },
  categoryCount: {
    fontSize: 10,
    color: '#B0B0B0',
    marginTop: 2,
  },
  categoryCountSelected: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  exercisesList: {
    flex: 1,
  },
  exercisesListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  exerciseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  exerciseCardSelected: {
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  exerciseMainInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  exerciseTags: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  equipmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentText: {
    fontSize: 10,
    color: '#B0B0B0',
    marginLeft: 4,
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 4,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  gifModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gifModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    margin: 24,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  gifModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  gifModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  gifModalCloseButton: {
    padding: 4,
  },
  gifContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 200,
    justifyContent: 'center',
  },
  gifPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  gifDescription: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#B0B0B0',
    textAlign: 'center',
  },
  exerciseModalDetails: {
    marginBottom: 24,
  },
  exerciseModalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseModalDetailText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  addToWorkoutButton: {
    width: '100%',
  },
  
  // Tenor GIF Önizleme Stilleri
  exerciseGifPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  gifPreviewPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifPreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gifPreviewImage: {
    width: '100%',
    height: '100%',
  },
  gifPreviewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalGifImage: {
    width: 250,
    height: 200,
    borderRadius: 8,
  },
  gifLoadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gifLoadingText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 8,
  },
  gifPlaceholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 