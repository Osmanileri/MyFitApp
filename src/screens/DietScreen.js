import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  Text as RNText,
  FlatList,
  Platform,
  Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  Text, 
  Card, 
  Modal, 
  Portal, 
  TextInput, 
  Button,
  ActivityIndicator,
  Surface,
  FAB
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDietStore } from '../store/dietStore';
import * as Haptics from 'expo-haptics';
import EditFoodModal from '../components/EditFoodModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 🎨 MODERN COLOR PALETTE
const colors = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  secondary: '#f093fb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  calories: '#ef4444',
  protein: '#8b5cf6',
  carbs: '#06b6d4',
  fat: '#f59e0b',
  water: '#0ea5e9'
};

// 🍽️ MEAL TYPES WITH ENHANCED DATA
const MEAL_TYPES = [
  {
    key: 'breakfast',
    label: 'Kahvaltı',
    emoji: '🌅',
    time: '07:00 - 10:00',
    targetCalories: 400,
    color: '#f59e0b',
    lightColor: '#fef3c7'
  },
  {
    key: 'lunch', 
    label: 'Öğle Yemeği',
    emoji: '☀️',
    time: '12:00 - 15:00',
    targetCalories: 500,
    color: '#10b981',
    lightColor: '#d1fae5'
  },
  {
    key: 'dinner',
    label: 'Akşam Yemeği', 
    emoji: '🌙',
    time: '18:00 - 21:00',
    targetCalories: 450,
    color: '#8b5cf6',
    lightColor: '#ede9fe'
  },
  {
    key: 'snacks',
    label: 'Atıştırmalık',
    emoji: '🍎',
    time: 'Gün boyu',
    targetCalories: 200,
    color: '#ef4444',
    lightColor: '#fee2e2'
  }
];

// 🚀 QUICK FOODS WITH VISUAL IMPROVEMENTS
const QUICK_FOODS = [
  { 
    name: 'Su', 
    calories: 0, 
    icon: 'cup-water', 
    color: colors.water,
    amount: '1 bardak',
    macros: { protein: 0, carbs: 0, fat: 0 }
  },
  { 
    name: 'Kahve', 
    calories: 5, 
    icon: 'coffee', 
    color: '#8b4513',
    amount: '1 fincan',
    macros: { protein: 0.3, carbs: 1, fat: 0 }
  },
  { 
    name: 'Muz', 
    calories: 105, 
    icon: 'food-variant', 
    color: '#fbbf24',
    amount: '1 orta',
    macros: { protein: 1.3, carbs: 27, fat: 0.4 }
  },
  { 
    name: 'Elma', 
    calories: 80, 
    icon: 'apple', 
    color: '#ef4444',
    amount: '1 orta',
    macros: { protein: 0.4, carbs: 21, fat: 0.3 }
  },
  { 
    name: 'Yumurta', 
    calories: 70, 
    icon: 'egg', 
    color: '#f59e0b',
    amount: '1 adet',
    macros: { protein: 6, carbs: 0.6, fat: 5 }
  },
  { 
    name: 'Fındık', 
    calories: 185, 
    icon: 'food-variant', 
    color: '#8b4513',
    amount: '1 avuç',
    macros: { protein: 4.3, carbs: 3.9, fat: 18.5 }
  }
];

// 🎯 CIRCULAR PROGRESS COMPONENT
const CircularProgress = ({ size = 120, strokeWidth = 8, progress, color, children }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[styles.progressBackground, { width: size, height: size, borderRadius: size/2 }]}>
        <Animated.View
          style={[
            styles.progressForeground,
            {
              width: size,
              height: size,
              borderRadius: size/2,
              borderWidth: strokeWidth,
              borderColor: color,
              transform: [{
                rotate: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', `${progress * 360}deg`]
                })
              }]
            }
          ]}
        />
        <View style={styles.progressContent}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default function DietScreen({ navigation, route }) {
  const { addFood, getTotalCalories, getTotalMacros, getWaterIntake, addWater, dailyMeals, loadDailyData, selectedDate } = useDietStore();
  const meals = dailyMeals; // Use state directly for real-time updates
  const [editFoodModalVisible, setEditFoodModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [editingMealType, setEditingMealType] = useState(null);
  const [editingFoodIndex, setEditingFoodIndex] = useState(null);
  const [waterCount, setWaterCount] = useState(4);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      try {
        await loadDailyData(selectedDate);
        if (isMounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to load daily data:', error);
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };
    
    initializeData();
    
    return () => {
      isMounted = false;
    };
  }, [selectedDate, loadDailyData]);

  // Listen for food data from FoodDetailScreen
  useFocusEffect(
    React.useCallback(() => {
      console.log('DietScreen focused, route.params:', route.params);
      const addFoodData = route.params?.addFoodData;
      console.log('AddFoodData:', addFoodData, 'isInitialized:', isInitialized);
      
      if (addFoodData && isInitialized) {
        const { mealType, foodData } = addFoodData;
        console.log('DietScreen received food data:', mealType, foodData);
        
        // Use setTimeout to avoid setState during render
        setTimeout(async () => {
          try {
            await addFood(mealType, foodData);
            console.log('Food added successfully');
            
            // Show success message
            Alert.alert(
              '✅ Başarılı!',
              `${foodData.name} ${mealType} öğününe eklendi.`,
              [{ text: 'Tamam' }]
            );
          } catch (error) {
            console.error('Failed to add food:', error);
            Alert.alert('❌ Hata', 'Besin eklenirken bir sorun oluştu.');
          }
        }, 0);
        
        // Clear the parameters to prevent duplicate additions
        navigation.setParams({ addFoodData: null });
      }
    }, [route.params?.addFoodData, addFood, navigation, isInitialized])
  );
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Only run animations after data is initialized
    if (isInitialized) {
      // Animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isInitialized]); // Run after initialization

  // Calculate daily stats (memoized to prevent unnecessary re-renders)
  const totalCalories = React.useMemo(() => {
    if (!isInitialized) return 0;
    return getTotalCalories();
  }, [isInitialized, meals, getTotalCalories]);
  
  const dailyGoal = 2000;
  
  const macros = React.useMemo(() => {
    if (!isInitialized) return { protein: 0, carbs: 0, fat: 0 };
    return getTotalMacros();
  }, [isInitialized, meals, getTotalMacros]);
  
  const calorieProgress = Math.min(totalCalories / dailyGoal, 1);

  const openAddFoodModal = (mealType) => {
    // Navigate to full screen FoodSearchScreen instead of modal
    navigation.navigate('FoodSearch', { 
      mealType: mealType
    });
    
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // 🎯 ENHANCED QUICK ADD HANDLER
  const handleQuickAdd = async (food, mealKey) => {
    try {
      const enhancedFood = {
        name: food.name,
        calories: food.calories,
        protein: food.macros.protein,
        carbs: food.macros.carbs,
        fat: food.macros.fat,
        amount: food.amount,
        timestamp: new Date().toISOString(),
        source: 'quick_add'
      };

      await addFood(mealKey, enhancedFood);
      
      Alert.alert(
        '✅ Başarılı!', 
        `${food.name} (${food.calories} kcal) ${MEAL_TYPES.find(m => m.key === mealKey)?.label || 'öğününe'} eklendi.`,
        [{ text: 'Tamam', style: 'default' }]
      );

      if (Haptics?.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

    } catch (error) {
      console.error('Quick add error:', error);
      Alert.alert('❌ Hata', 'Besin eklenirken bir sorun oluştu.');
    }
  };

  // 🎯 PROFESSIONAL CALORIE TRACKING HEADER
  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            {/* Top Row */}
            <View style={styles.headerTopRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>Merhaba! 👋</Text>
                <Text style={styles.headerDate}>
                  {new Date().toLocaleDateString('tr-TR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </Text>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <MaterialCommunityIcons name="account-circle-outline" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Calorie Tracking Section */}
            <View style={styles.calorieTrackingSection}>
              <View style={styles.calorieStatsWithChart}>
                {/* Mini Circular Chart */}
                <View style={styles.miniChartContainer}>
                  <CircularProgress
                    size={80}
                    strokeWidth={6}
                    progress={calorieProgress}
                    color="#ffffff"
                    backgroundColor="rgba(255,255,255,0.3)"
                  >
                    <View style={styles.miniChartCenter}>
                      <Text style={styles.miniChartText}>{Math.round(calorieProgress * 100)}%</Text>
                    </View>
                  </CircularProgress>
                </View>
                
                {/* Calorie Info */}
                <View style={styles.calorieStats}>
                  <View style={styles.calorieMainInfo}>
                    <Text style={styles.calorieConsumed}>{totalCalories}</Text>
                    <Text style={styles.calorieUnit}>kalori tüketildi</Text>
                  </View>
                  <View style={styles.calorieTargetInfo}>
                    <Text style={styles.calorieTarget}>/ {dailyGoal}</Text>
                    <Text style={styles.calorieTargetLabel}>hedef</Text>
                  </View>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <Animated.View 
                    style={[
                      styles.progressBarFill,
                      { 
                        width: `${Math.min(calorieProgress * 100, 100)}%`,
                        backgroundColor: calorieProgress > 1 ? '#ef4444' : '#10b981'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {Math.round(calorieProgress * 100)}%
                </Text>
              </View>

              {/* Quick Stats Row */}
              <View style={styles.quickStatsRow}>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatValue}>{macros.protein.toFixed(0)}g</Text>
                  <Text style={styles.quickStatLabel}>Protein</Text>
                </View>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatValue}>{macros.carbs.toFixed(0)}g</Text>
                  <Text style={styles.quickStatLabel}>Karb</Text>
                </View>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatValue}>{macros.fat.toFixed(0)}g</Text>
                  <Text style={styles.quickStatLabel}>Yağ</Text>
                </View>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatValue}>{Math.max(0, dailyGoal - totalCalories)}</Text>
                  <Text style={styles.quickStatLabel}>Kalan</Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );

  // 📊 ULTRA MODERN STATS DASHBOARD
  const renderStatsCard = () => (
    <Animated.View style={[styles.statsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.statsCardGradient}
      >
        <View style={styles.statsContent}>
          
          {/* Enhanced Calorie Circle with Gradient */}
          <View style={styles.calorieSection}>
            <View style={styles.calorieCircleContainer}>
              <LinearGradient
                colors={calorieProgress > 0.8 ? ['#ef4444', '#dc2626'] : ['#3b82f6', '#1d4ed8']}
                style={styles.calorieCircleBackground}
              >
                <CircularProgress
                  size={160}
                  strokeWidth={12}
                  progress={calorieProgress}
                  color="#ffffff"
                  backgroundColor="rgba(255,255,255,0.3)"
                >
                  <View style={styles.calorieCenter}>
                    <Text style={styles.calorieNumber}>{totalCalories}</Text>
                    <Text style={styles.calorieUnit}>kcal</Text>
                    <Text style={styles.calorieRemaining}>
                      {Math.max(0, dailyGoal - totalCalories)} kalan
                    </Text>
                  </View>
                </CircularProgress>
              </LinearGradient>
            </View>
          </View>

          {/* Professional Macro Cards */}
          <View style={styles.macroCardsContainer}>
            {[
              { 
                label: 'Protein', 
                value: `${macros.protein.toFixed(1)}`, 
                unit: 'g', 
                gradientColors: ['#10b981', '#059669'],
                icon: 'dumbbell',
                percentage: Math.min((macros.protein / 150) * 100, 100)
              },
              { 
                label: 'Karbonhidrat', 
                value: `${macros.carbs.toFixed(1)}`, 
                unit: 'g', 
                gradientColors: ['#f59e0b', '#d97706'],
                icon: 'grain',
                percentage: Math.min((macros.carbs / 250) * 100, 100)
              },
              { 
                label: 'Yağ', 
                value: `${macros.fat.toFixed(1)}`, 
                unit: 'g', 
                gradientColors: ['#8b5cf6', '#7c3aed'],
                icon: 'water-outline',
                percentage: Math.min((macros.fat / 70) * 100, 100)
              }
            ].map((macro, index) => (
              <TouchableOpacity 
                key={macro.label} 
                style={styles.macroCard}
                activeOpacity={0.8}
                onPress={() => Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <LinearGradient
                  colors={macro.gradientColors}
                  style={styles.macroCardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Icon Container */}
                  <View style={styles.macroIconContainer}>
                    <View style={styles.macroIconBackground}>
                      <MaterialCommunityIcons 
                        name={macro.icon} 
                        size={24} 
                        color="#ffffff" 
                      />
                    </View>
                  </View>
                  
                  {/* Content */}
                  <View style={styles.macroCardContent}>
                    <Text style={styles.macroCardLabel}>{macro.label}</Text>
                    <View style={styles.macroValueContainer}>
                      <Text style={styles.macroCardValue}>
                        {macro.value}
                      </Text>
                      <Text style={styles.macroCardUnit}>{macro.unit}</Text>
                    </View>
                    
                    {/* Mini Progress Bar */}
                    <View style={styles.macroProgressContainer}>
                      <View style={styles.macroProgressBackground}>
                        <View 
                          style={[
                            styles.macroProgressFill, 
                            { width: `${macro.percentage}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Enhanced Daily Insight */}
          <View style={styles.insightContainer}>
            <LinearGradient
              colors={['#fef3c7', '#fbbf24']}
              style={styles.insightGradient}
            >
              <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#d97706" />
              <Text style={styles.insightText}>
                {calorieProgress < 0.5 
                  ? "Daha fazla beslenmeye odaklan! 💪" 
                  : calorieProgress > 1.2 
                  ? "Bugün hedefini aştın! 🎉"
                  : "Harika gidiyorsun! Böyle devam 🚀"
              }
              </Text>
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // 🍽️ MODERN MEAL CARDS
  const renderMealCard = (meal, index) => {
    const mealData = meals[meal.key] || [];
    const mealCalories = mealData.reduce((sum, food) => sum + food.calories, 0);
    const progress = Math.min(mealCalories / meal.targetCalories, 1);

    return (
      <Animated.View 
        key={meal.key}
        style={[
          styles.mealCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.add(slideAnim, new Animated.Value(index * 10)) }]
          }
        ]}
      >
        <Surface style={styles.mealCardSurface} elevation={3}>
          <View style={styles.mealCardContent}>
            
            {/* Meal Header */}
            <View style={styles.mealHeader}>
              <View style={styles.mealInfo}>
                <View style={[styles.mealEmojiContainer, { backgroundColor: meal.lightColor }]}>
                  <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                </View>
                <View style={styles.mealDetails}>
                  <Text style={styles.mealName}>{meal.label}</Text>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: meal.color }]}
                onPress={() => openAddFoodModal(meal.key)}
              >
                <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Progress Section */}
            <View style={styles.mealProgress}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  {mealCalories} / {meal.targetCalories} kcal
                </Text>
                <Text style={styles.progressPercent}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarTrack}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      { 
                        width: `${progress * 100}%`,
                        backgroundColor: meal.color
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>

            {/* Foods List or Empty State */}
            {mealData.length > 0 ? (
              <View style={styles.foodsList}>
                {mealData.slice(0, 3).map((food, foodIndex) => (
                  <TouchableOpacity 
                    key={foodIndex} 
                    style={styles.foodItem}
                    onPress={() => handleFoodItemPress(food, meal.key, foodIndex)}
                  >
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodAmount}>{food.amount || '100g'}</Text>
                    </View>
                    <Text style={styles.foodCalories}>{food.calories} kcal</Text>
                  </TouchableOpacity>
                ))}
                
                {mealData.length > 3 && (
                  <Text style={styles.moreItems}>
                    +{mealData.length - 3} daha fazla
                  </Text>
                )}
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.emptyMealState}
                onPress={() => openAddFoodModal(meal.key)}
              >
                <MaterialCommunityIcons 
                  name="silverware-fork-knife" 
                  size={24} 
                  color={colors.textLight} 
                />
                <Text style={styles.emptyMealText}>İlk besinin için dokunun</Text>
              </TouchableOpacity>
            )}
          </View>
        </Surface>
      </Animated.View>
    );
  };

  // 🚀 MODERN QUICK ADD
  const renderQuickAdd = () => (
    <Animated.View style={[styles.quickAddContainer, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hızlı Ekle</Text>
        <Text style={styles.sectionSubtitle}>Popüler besinlerin</Text>
      </View>
      
      <FlatList
        data={QUICK_FOODS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickFoodsList}
        keyExtractor={(item, index) => `quick-${index}`}
        renderItem={({ item, index }) => (
          <Animated.View 
            style={[
              styles.quickFoodItem,
              {
                opacity: fadeAnim,
                transform: [{ translateY: Animated.add(slideAnim, new Animated.Value(index * 5)) }]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.quickFoodButton}
              onPress={() => {
                Alert.alert(
                  `${item.name} Ekle 🍽️`,
                  `${item.name} (${item.calories} kcal) hangi öğününe eklensin?`,
                  MEAL_TYPES.map(meal => ({
                    text: `${meal.emoji} ${meal.label}`,
                    onPress: () => handleQuickAdd(item, meal.key)
                  })).concat([{ text: '❌ İptal', style: 'cancel' }])
                );
              }}
            >
              <Surface style={styles.quickFoodSurface} elevation={2}>
                <View style={[styles.quickFoodIcon, { backgroundColor: item.color + '20' }]}>
                  <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.quickFoodName}>{item.name}</Text>
                <Text style={styles.quickFoodCalories}>{item.calories} kcal</Text>
                <Text style={styles.quickFoodAmount}>{item.amount}</Text>
              </Surface>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </Animated.View>
  );

  // 💧 WATER TRACKER
  const renderWaterTracker = () => (
    <Animated.View style={[styles.waterTrackerContainer, { opacity: fadeAnim }]}>
      <Surface style={styles.waterTrackerSurface} elevation={3}>
        <View style={styles.waterTrackerContent}>
          <View style={styles.waterHeader}>
            <View style={styles.waterInfo}>
              <Text style={styles.waterTitle}>💧 Su Takibi</Text>
              <Text style={styles.waterSubtitle}>Günlük hidrasyon hedefin</Text>
            </View>
            <View style={styles.waterStats}>
              <Text style={styles.waterCount}>{waterCount}</Text>
              <Text style={styles.waterTarget}>/8 bardak</Text>
            </View>
          </View>

          <View style={styles.waterGlasses}>
            {[...Array(8)].map((_, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.waterGlass,
                  index < waterCount && styles.waterGlassActive
                ]}
                onPress={() => setWaterCount(index < waterCount ? index : index + 1)}
              >
                <MaterialCommunityIcons 
                  name={index < waterCount ? "cup-water" : "cup-outline"} 
                  size={20} 
                  color={index < waterCount ? colors.water : colors.textLight} 
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.waterProgressBar}>
            <View style={styles.waterProgressTrack}>
              <Animated.View 
                style={[
                  styles.waterProgressFill,
                  { width: `${(waterCount / 8) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.waterProgressText}>
              {Math.round((waterCount / 8) * 100)}% tamamlandı
            </Text>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );

  // Food item actions
  const handleFoodItemPress = (food, mealType, foodIndex) => {
    Alert.alert(
      food.name,
      `${food.amount || '100g'} - ${food.calories} kcal`,
      [
        {
          text: 'Düzenle',
          onPress: () => editFoodItem(food, mealType, foodIndex)
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteFoodItem(mealType, foodIndex)
        },
        {
          text: 'İptal',
          style: 'cancel'
        }
      ]
    );
  };

  const editFoodItem = (food, mealType, foodIndex) => {
    setEditingFood(food);
    setEditingMealType(mealType);
    setEditingFoodIndex(foodIndex);
    setEditFoodModalVisible(true);
  };

  const deleteFoodItem = async (mealType, foodIndex) => {
    try {
      const { removeMeal } = useDietStore.getState();
      await removeMeal(mealType, foodIndex);
      
      if (Haptics?.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Delete food error:', error);
      Alert.alert('Hata', 'Besin silinirken bir sorun oluştu.');
    }
  };

  const handleFoodSelect = async (foodData, mealType) => {
    try {
      await addFood(mealType, foodData);
      
      Alert.alert(
        '✅ Başarılı!', 
        `${foodData.name} (${foodData.calories} kcal) ${MEAL_TYPES.find(m => m.key === mealType)?.label || 'öğününe'} eklendi.`,
        [{ text: 'Tamam', style: 'default' }]
      );

      if (Haptics?.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

    } catch (error) {
      console.error('Add food error:', error);
      Alert.alert('❌ Hata', 'Besin eklenirken bir sorun oluştu.');
    }
  };

  const handleEditFoodSave = async (updatedFood, mealType) => {
    try {
      const { dailyMeals } = useDietStore.getState();
      const updatedMeals = {
        ...dailyMeals,
        [mealType]: dailyMeals[mealType].map((food, index) => 
          index === editingFoodIndex ? updatedFood : food
        )
      };
      
      const { saveDailyMeals, updateDailyProgress } = useDietStore.getState();
      useDietStore.setState({ dailyMeals: updatedMeals });
      await saveDailyMeals(updatedMeals);
      updateDailyProgress();
      
      if (Haptics?.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      Alert.alert('✅ Güncellendi!', 'Besin miktarı başarıyla güncellendi.');
    } catch (error) {
      console.error('Edit food save error:', error);
      Alert.alert('Hata', 'Besin güncellenirken bir sorun oluştu.');
    }
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      {renderHeader()}
      
      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Add */}
        {renderQuickAdd()}

        {/* Meals Section */}
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Günlük Öğünlerin</Text>
            <Text style={styles.sectionSubtitle}>Beslenme planın</Text>
          </View>
          {MEAL_TYPES.map((meal, index) => renderMealCard(meal, index))}
        </View>

        {/* Water Tracker */}
        {renderWaterTracker()}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
        
      </ScrollView>

      {/* Enhanced Food Search Modal - REMOVED */}
      {/* We now navigate to FoodSearchScreen instead */}

      {/* Edit Food Modal */}
      <EditFoodModal
        visible={editFoodModalVisible}
        onDismiss={() => {
          setEditFoodModalVisible(false);
          setEditingFood(null);
          setEditingMealType(null);
          setEditingFoodIndex(null);
        }}
        onSave={handleEditFoodSave}
        foodItem={editingFood}
        mealType={editingMealType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  
  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
  },
  headerGradient: {
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calorieTrackingSection: {
    gap: 16,
  },
  calorieStatsWithChart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  miniChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniChartCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniChartText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  calorieStats: {
    flex: 1,
    gap: 4,
  },
  calorieMainInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  calorieConsumed: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  calorieUnit: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  calorieTargetInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  calorieTarget: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  calorieTargetLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  progressPercentage: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Scroll Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },

  // Stats Card Styles
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statsCardGradient: {
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  statsContent: {
    padding: 24,
  },
  calorieSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  calorieCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieCircleBackground: {
    borderRadius: 80,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  calorieCenter: {
    alignItems: 'center',
  },
  calorieNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  calorieUnit: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: -4,
    fontWeight: '500',
  },
  calorieRemaining: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    fontWeight: '500',
  },
  macroCardsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  macroCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  macroCardGradient: {
    padding: 16,
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIconContainer: {
    marginRight: 16,
  },
  macroIconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroCardContent: {
    flex: 1,
  },
  macroCardLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 4,
  },
  macroValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  macroCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  macroCardUnit: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 2,
  },
  macroProgressContainer: {
    marginTop: 4,
  },
  macroProgressBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroProgressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  insightContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  insightGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#d97706',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Progress Styles
  progressBackground: {
    backgroundColor: colors.background,
    position: 'relative',
  },
  progressForeground: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Styles
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Quick Add Styles
  quickAddContainer: {
    marginBottom: 32,
  },
  quickFoodsList: {
    paddingHorizontal: 20,
  },
  quickFoodItem: {
    marginRight: 12,
  },
  quickFoodButton: {
    alignItems: 'center',
  },
  quickFoodSurface: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  quickFoodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickFoodName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickFoodCalories: {
    fontSize: 12,
    color: colors.calories,
    fontWeight: '500',
  },
  quickFoodAmount: {
    fontSize: 11,
    color: colors.textLight,
  },

  // Meal Card Styles
  mealsSection: {
    marginBottom: 32,
  },
  mealCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  mealCardSurface: {
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  mealCardContent: {
    padding: 20,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealEmoji: {
    fontSize: 20,
  },
  mealDetails: {
    flex: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  mealTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealProgress: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarTrack: {
    flex: 1,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  foodsList: {
    gap: 8,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  foodAmount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  foodCalories: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.calories,
  },
  moreItems: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyMealState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.textLight + '30',
    borderStyle: 'dashed',
  },
  emptyMealText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },

  // Water Tracker Styles
  waterTrackerContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  waterTrackerSurface: {
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  waterTrackerContent: {
    padding: 20,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterInfo: {
    flex: 1,
  },
  waterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  waterSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  waterStats: {
    alignItems: 'flex-end',
  },
  waterCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.water,
  },
  waterTarget: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -4,
  },
  waterGlasses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  waterGlass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  waterGlassActive: {
    backgroundColor: colors.water + '20',
  },
  waterProgressBar: {
    alignItems: 'center',
  },
  waterProgressTrack: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 8,
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: colors.water,
    borderRadius: 4,
  },
  waterProgressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  bottomSpacing: {
    height: 100,
  },
});