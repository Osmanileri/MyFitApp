import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import useDietStore from '../store/dietStore';
import useAuthStore from '../store/authStore';
import MealSection from '../components/MealSection';
import { Colors } from '../theme/appTheme';

const { width } = Dimensions.get('window');

// Modern Gradient Renkler
const gradients = {
  primary: ['#667eea', '#764ba2'],
  success: ['#4ade80', '#22c55e'],
  warning: ['#fbbf24', '#f59e0b'],
  info: ['#38bdf8', '#0ea5e9'],
  purple: ['#c084fc', '#a855f7'],
  orange: ['#fb923c', '#f97316'],
  pink: ['#f472b6', '#ec4899'],
  blue: ['#60a5fa', '#3b82f6'],
  soft: ['#e0e7ff', '#c7d2fe'],
  softGreen: ['#dcfce7', '#bbf7d0'],
  softOrange: ['#fed7aa', '#fdba74'],
  softPink: ['#fce7f3', '#f9a8d4'],
};

// Modern Pulse Animation Component
const PulseView = ({ children, style }) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale: pulseAnim }] }]}>
      {children}
    </Animated.View>
  );
};

// Modern Dairesel Progress Component
const ModernCircularProgress = ({ percentage, size = 140, strokeWidth = 12 }) => {
  const actualPercentage = Math.min(Math.max(percentage || 0, 0), 100);
  
  const getProgressColor = () => {
    if (actualPercentage === 0) return '#e2e8f0';
    if (actualPercentage >= 100) return '#fbbf24';  // Altın sarısı (tam dolu)
    if (actualPercentage > 80) return '#f59e0b';    // Turuncu (yüksek)
    if (actualPercentage < 50) return '#fb923c';    // Kırmızı (düşük)
    return '#4ade80';  // Yeşil (normal)
  };
  
  const progressColor = getProgressColor();
  const trackColor = '#e2e8f0';
  const innerSize = size - strokeWidth * 3.5; // Make inner circle smaller
  
  // Calculate progress circle size based on percentage
  const minProgressSize = innerSize * 1; // Minimum progress size (starts smaller)
  const maxProgressSize = size; // Maximum progress size
  const progressSize = minProgressSize + ((maxProgressSize - minProgressSize) * (actualPercentage / 100));
  
  return (
    <View style={[styles.modernCircularContainer, { width: size, height: size }]}>
      {/* Background Circle (Track) */}
      <View style={[styles.circleTrack, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: trackColor,
      }]} />
      
      {/* Progress Circle - grows outward based on percentage */}
      {actualPercentage > 0 && (
        <View style={[styles.progressCircle, { 
          width: progressSize, 
          height: progressSize, 
          borderRadius: progressSize / 2,
          backgroundColor: progressColor,
        }]} />
      )}
      
      {/* Inner white circle (fixed size) */}
      <View style={[styles.progressInner, {
        width: innerSize,
        height: innerSize,
        borderRadius: innerSize / 2,
        backgroundColor: '#ffffff',
      }]} />
    </View>
  );
};

// Modern Status Badge
const ModernStatusBadge = ({ status, percentage }) => {
  const getStatusConfig = () => {
    if (percentage < 70) return { 
      colors: gradients.warning, 
      icon: 'trending-down', 
      text: 'Düşük',
      bgColor: '#fff3e0'
    };
    if (percentage > 120) return { 
      colors: gradients.warning, 
      icon: 'trending-up', 
      text: 'Yüksek',
      bgColor: '#ffebee'
    };
    return { 
      colors: gradients.success, 
      icon: 'checkmark-circle', 
      text: 'Mükemmel',
      bgColor: '#e8f5e8'
    };
  };

  const config = getStatusConfig();
  
  return (
    <View style={[styles.modernBadge, { backgroundColor: config.bgColor }]}>
      <LinearGradient
        colors={config.colors}
        style={styles.badgeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Ionicons name={config.icon} size={14} color="white" />
        <Text style={styles.badgeText}>{config.text}</Text>
      </LinearGradient>
    </View>
  );
};

// Modern Stat Card
const ModernStatCard = ({ title, value, unit, icon, colors, percentage }) => {
  return (
    <View style={styles.modernStatCard}>
      <LinearGradient
        colors={colors}
        style={styles.statCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statCardIcon}>
          <Ionicons name={icon} size={20} color="white" />
        </View>
        <View style={styles.statCardContent}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardValue}>{value}</Text>
          <Text style={styles.statCardUnit}>{unit}</Text>
        </View>
        <View style={styles.statCardProgress}>
          <View style={styles.statProgressBar}>
            <View style={[styles.statProgressFill, { width: `${percentage}%` }]} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// Modern Water Tracker
const ModernWaterTracker = ({ current, goal, onAdd, onRemove }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const glassCount = Math.floor(current / 250);
  
  return (
    <View style={styles.modernWaterCard}>
      <LinearGradient
        colors={gradients.info}
        style={styles.waterCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.waterHeader}>
          <View style={styles.waterIconContainer}>
            <Ionicons name="water" size={20} color="white" />
          </View>
          <Text style={styles.waterTitle}>Günlük Su</Text>
        </View>
        
        <View style={styles.waterAmount}>
          <Text style={styles.waterValue}>{current}ml</Text>
          <Text style={styles.waterGoal}>/ {goal}ml</Text>
        </View>
        
        <View style={styles.waterProgressContainer}>
          <View style={styles.waterProgressBar}>
            <View style={[styles.waterProgressFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.waterPercentage}>{Math.round(percentage)}%</Text>
        </View>
        
        <View style={styles.waterActions}>
          <TouchableOpacity onPress={onRemove} style={styles.waterActionButton}>
            <Ionicons name="remove" size={18} color="white" />
          </TouchableOpacity>
          <Text style={styles.waterGlasses}>{glassCount} 🥤</Text>
          <TouchableOpacity onPress={onAdd} style={styles.waterActionButton}>
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const DietScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { user } = useAuthStore();
  const {
    getTodayData,
    getSelectedDateData,
    getDailyGoals,
    syncDailyData,
    addFoodToMeal,
    removeFoodFromMeal,
    editFoodInMeal,
    addWater,
    removeWater,
    isLoading,
    isSyncing,
    error,
    clearError,
    initializeStore,
  } = useDietStore();

  const dailyData = selectedDate === new Date().toISOString().split('T')[0] 
    ? getTodayData() 
    : getSelectedDateData();
  const goals = getDailyGoals();

  useEffect(() => {
    initializeStore();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      syncDailyData(selectedDate);
    }
  }, [selectedDate]);

  // Handle navigation parameters for adding food
  useFocusEffect(
    useCallback(() => {
      const handleAddFoodData = async () => {
        if (route.params?.addFoodData) {
          const { mealType, foodData } = route.params.addFoodData;
          
          try {
            await addFoodToMeal(selectedDate, mealType, foodData);
            Alert.alert('Başarılı', 'Besin öğünüze eklendi!');
          } catch (error) {
            Alert.alert('Hata', 'Besin eklenirken bir hata oluştu.');
            console.error('Error adding food from navigation:', error);
          }
          
          // Clear the params to prevent re-adding
          navigation.setParams({ addFoodData: null });
        }
      };

      handleAddFoodData();
    }, [route.params?.addFoodData, selectedDate, addFoodToMeal, navigation])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncDailyData(selectedDate);
    setRefreshing(false);
  };

  const handleDateChange = (direction) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
  };

  const handleAddFood = (mealType) => {
    navigation.navigate('FoodSearch', { 
      mealType, 
      date: selectedDate,
      onFoodSelected: (food) => {
        addFoodToMeal(selectedDate, mealType, food);
      }
    });
  };

  const handleRemoveFood = (mealType, foodIndex) => {
    Alert.alert(
      'Besini Kaldır',
      'Bu besini öğünden kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => removeFoodFromMeal(selectedDate, mealType, foodIndex)
        }
      ]
    );
  };

  const handleEditFood = async (mealType, foodIndex, updatedFood) => {
    try {
      await editFoodInMeal(selectedDate, mealType, foodIndex, updatedFood);
      // Başarılı güncelleme mesajı gösterebilirsiniz
    } catch (error) {
      Alert.alert('Hata', 'Besin güncellenirken bir hata oluştu.');
      console.error('Error updating food:', error);
    }
  };

  const handleWaterAdd = () => {
    addWater(selectedDate, 250);
  };

  const handleWaterRemove = () => {
    removeWater(selectedDate, 250);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Bugün';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Dün';
    } else {
      return date.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const caloriePercentage = Math.min((dailyData.totalCalories / goals.targetCalories) * 100, 100);
  const proteinPercentage = Math.min((dailyData.totalProtein / goals.targetProtein) * 100, 100);
  const carbsPercentage = Math.min((dailyData.totalCarbs / goals.targetCarbs) * 100, 100);
  const fatPercentage = Math.min((dailyData.totalFat / goals.targetFat) * 100, 100);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={gradients.primary}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Harika deneyiminiz hazırlanıyor...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header */}
      <LinearGradient
        colors={gradients.primary}
        style={styles.modernHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => handleDateChange(-1)} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerDate}>{formatDate(selectedDate)}</Text>
            <Text style={styles.headerSubtitle}>🎯 Hedefine odaklan</Text>
          </View>
          
          <TouchableOpacity onPress={() => handleDateChange(1)} style={styles.headerButton}>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={gradients.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Hero Kalori Kartı */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#ffffff', '#f8f9ff']}
              style={styles.heroCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroHeader}>
                <View>
                  <Text style={styles.heroTitle}>Günlük Kalori</Text>
                  <Text style={styles.heroSubtitle}>Enerjin nasıl? ⚡</Text>
                </View>
                <ModernStatusBadge percentage={caloriePercentage} />
              </View>
              
              <View style={styles.heroContent}>
                <View style={styles.heroCircle}>
                  <ModernCircularProgress
                    percentage={caloriePercentage}
                    size={130}
                    strokeWidth={8}
                  />
                  <View style={styles.heroCircleCenter}>
                    <Text style={styles.heroCalorieValue}>{Math.round(dailyData.totalCalories)}</Text>
                    <Text style={styles.heroCalorieUnit}>kcal</Text>
                  </View>
                </View>
                
                <View style={styles.heroStats}>
                  <View style={styles.heroStatItem}>
                    <View style={styles.heroStatIcon}>
                      <Ionicons name="flag" size={16} color={gradients.primary[0]} />
                    </View>
                    <View>
                      <Text style={styles.heroStatLabel}>Hedef</Text>
                      <Text style={styles.heroStatValue}>{Math.round(goals.targetCalories)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.heroStatItem}>
                    <View style={styles.heroStatIcon}>
                      <Ionicons name="gift" size={16} color={gradients.success[0]} />
                    </View>
                    <View>
                      <Text style={styles.heroStatLabel}>Kalan</Text>
                      <Text style={styles.heroStatValue}>
                        {Math.max(0, Math.round(goals.targetCalories - dailyData.totalCalories))}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.heroStatItem}>
                    <View style={styles.heroStatIcon}>
                      <Ionicons name="trophy" size={16} color={gradients.warning[0]} />
                    </View>
                    <View>
                      <Text style={styles.heroStatLabel}>İlerleme</Text>
                      <Text style={styles.heroStatValue}>{Math.round(caloriePercentage)}%</Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Günlük Makro Özeti */}
          <View style={styles.dailyMacroSection}>
            <View style={styles.dailyMacroHeader}>
              <Text style={styles.dailyMacroHeaderText}>Yağ</Text>
              <Text style={styles.dailyMacroHeaderText}>Karb</Text>
              <Text style={styles.dailyMacroHeaderText}>Prot</Text>
              <Text style={styles.dailyMacroHeaderText}>TGD</Text>
              <Text style={styles.dailyMacroHeaderText}>Kalori</Text>
            </View>
                         <View style={styles.dailyMacroValues}>
               <Text style={styles.dailyMacroValue}>{Math.round(dailyData.totalFat * 100) / 100}</Text>
               <Text style={styles.dailyMacroValue}>{Math.round(dailyData.totalCarbs * 100) / 100}</Text>
               <Text style={styles.dailyMacroValue}>{Math.round(dailyData.totalProtein * 100) / 100}</Text>
               <Text style={styles.dailyMacroValue}>%{Math.round((dailyData.totalCalories / 2000) * 100) || 0}</Text>
               <Text style={styles.dailyMacroValue}>{Math.round(dailyData.totalCalories)}</Text>
             </View>
          </View>

          {/* Meals Section */}
          <View style={styles.mealsSection}>
            <MealSection
              title="Kahvaltı"
              icon="sunny"
              foods={dailyData.meals.breakfast}
              onAddFood={() => handleAddFood('breakfast')}
              onRemoveFood={(index) => handleRemoveFood('breakfast', index)}
              onEditFood={(index, updatedFood) => handleEditFood('breakfast', index, updatedFood)}
              showIcon={true}
              totalCalories={dailyData.meals.breakfast.reduce((total, food) => {
                const portion = food.portion || 1;
                const servingSize = food.servingSize || 100;
                const multiplier = (portion * servingSize) / 100;
                return total + (food.calories || 0) * multiplier;
              }, 0)}
            />

            <MealSection
              title="Öğle Yemeği"
              icon="partly-sunny"
              foods={dailyData.meals.lunch}
              onAddFood={() => handleAddFood('lunch')}
              onRemoveFood={(index) => handleRemoveFood('lunch', index)}
              onEditFood={(index, updatedFood) => handleEditFood('lunch', index, updatedFood)}
              showIcon={false}
              totalCalories={dailyData.meals.lunch.reduce((total, food) => {
                const portion = food.portion || 1;
                const servingSize = food.servingSize || 100;
                const multiplier = (portion * servingSize) / 100;
                return total + (food.calories || 0) * multiplier;
              }, 0)}
            />

            <MealSection
              title="Akşam Yemeği"
              icon="moon"
              foods={dailyData.meals.dinner}
              onAddFood={() => handleAddFood('dinner')}
              onRemoveFood={(index) => handleRemoveFood('dinner', index)}
              onEditFood={(index, updatedFood) => handleEditFood('dinner', index, updatedFood)}
              showIcon={false}
              totalCalories={dailyData.meals.dinner.reduce((total, food) => {
                const portion = food.portion || 1;
                const servingSize = food.servingSize || 100;
                const multiplier = (portion * servingSize) / 100;
                return total + (food.calories || 0) * multiplier;
              }, 0)}
            />

            <MealSection
              title="Atıştırmalık"
              icon="nutrition"
              foods={dailyData.meals.snacks}
              onAddFood={() => handleAddFood('snacks')}
              onRemoveFood={(index) => handleRemoveFood('snacks', index)}
              onEditFood={(index, updatedFood) => handleEditFood('snacks', index, updatedFood)}
              showIcon={false}
              totalCalories={dailyData.meals.snacks.reduce((total, food) => {
                const portion = food.portion || 1;
                const servingSize = food.servingSize || 100;
                const multiplier = (portion * servingSize) / 100;
                return total + (food.calories || 0) * multiplier;
              }, 0)}
            />
          </View>

          {/* Modern Water Tracker - En altta */}
          <View style={styles.compactWaterCard}>
            <LinearGradient
              colors={gradients.info}
              style={styles.compactWaterGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.compactWaterContent}>
                <View style={styles.compactWaterIcon}>
                  <Ionicons name="water" size={18} color="white" />
                </View>
                <Text style={styles.compactWaterTitle}>Su: {dailyData.waterIntake || 0}ml / 2500ml</Text>
                <Text style={styles.compactWaterPercent}>
                  {Math.round(Math.min(((dailyData.waterIntake || 0) / 2500) * 100, 100))}%
                </Text>
              </View>
              <View style={styles.compactWaterActions}>
                <TouchableOpacity onPress={handleWaterRemove} style={styles.compactWaterButton}>
                  <Ionicons name="remove" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleWaterAdd} style={styles.compactWaterButton}>
                  <Ionicons name="add" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Modern Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('NutritionGoals')}
            >
              <LinearGradient
                colors={gradients.primary}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionButtonIcon}>
                  <Ionicons name="settings" size={24} color="white" />
                </View>
                <View style={styles.actionButtonContent}>
                  <Text style={styles.actionButtonTitle}>Hedefleri Ayarla</Text>
                  <Text style={styles.actionButtonSubtitle}>Kişisel hedefleriniz</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Progress')}
            >
              <LinearGradient
                colors={gradients.success}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionButtonIcon}>
                  <Ionicons name="trending-up" size={24} color="white" />
                </View>
                <View style={styles.actionButtonContent}>
                  <Text style={styles.actionButtonTitle}>İlerleme</Text>
                  <Text style={styles.actionButtonSubtitle}>Başarı hikayeniz</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  modernHeader: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerDate: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  heroCard: {
    marginBottom: 25,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  heroCardGradient: {
    padding: 25,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCircle: {
    position: 'relative',
    marginRight: 30,
  },
  modernCircularContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleTrack: {
    position: 'absolute',
  },
  progressCircle: {
    position: 'absolute',
  },
  progressInner: {
    position: 'absolute',
  },
  progressOverlay: {
    position: 'absolute',
  },
  heroCircleCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCalorieValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
  },
  heroCalorieUnit: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  heroStats: {
    flex: 1,
  },
  heroStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  heroStatIcon: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroStatLabel: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '500',
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  modernBadge: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  modernStatCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statCardGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statCardContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statCardTitle: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    opacity: 0.9,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statCardUnit: {
    fontSize: 10,
    color: 'white',
    opacity: 0.8,
  },
  statCardProgress: {
    width: '100%',
  },
  statProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  statProgressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  // Compact Water Tracker Styles
  compactWaterCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  compactWaterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  compactWaterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactWaterIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  compactWaterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  compactWaterPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    opacity: 0.85,
    marginRight: 12,
  },
  compactWaterActions: {
    flexDirection: 'row',
    gap: 10,
  },
  compactWaterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Daily Macro Section Styles
  dailyMacroSection: {
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  dailyMacroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dailyMacroHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#718096',
    flex: 1,
    textAlign: 'center',
  },
  dailyMacroValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dailyMacroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
    textAlign: 'center',
  },
  mealsSection: {
    marginBottom: 10,
  },
  actionButtons: {
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginTop: 2,
  },
});

export default DietScreen;