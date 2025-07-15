import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import {
  Text,
  TextInput,
  Surface,
  Button,
  Divider,
  Card
} from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { TURKISH_FOOD_DATABASE, searchFoodsInDatabase } from '../data/turkishFoodDatabase';

const { width: screenWidth } = Dimensions.get('window');

// 🍩 ANIMATED DONUT CHART COMPONENT
const AnimatedDonutChart = ({ protein, carbs, fat, size = 120 }) => {
  const [animationProgress] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(animationProgress, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, []);

  const total = protein + carbs + fat;
  if (total === 0) return null;

  const proteinPercentage = (protein / total) * 100;
  const carbsPercentage = (carbs / total) * 100;
  const fatPercentage = (fat / total) * 100;

  const radius = (size - 20) / 2;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke dash arrays for each segment
  const proteinStroke = (proteinPercentage / 100) * circumference;
  const carbsStroke = (carbsPercentage / 100) * circumference;
  const fatStroke = (fatPercentage / 100) * circumference;
  
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{
        opacity: animationProgress,
        transform: [{
          scale: animationProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1]
          })
        }]
      }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Protein arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${proteinStroke} ${circumference}`}
            strokeLinecap="round"
            opacity={0.9}
          />
          
          {/* Carbs arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${carbsStroke} ${circumference}`}
            strokeDashoffset={-proteinStroke}
            strokeLinecap="round"
            opacity={0.9}
          />
          
          {/* Fat arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#6366f1"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${fatStroke} ${circumference}`}
            strokeDashoffset={-(proteinStroke + carbsStroke)}
            strokeLinecap="round"
            opacity={0.9}
          />
        </Svg>
      </Animated.View>
      
      {/* Center content */}
      <View style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text,
        }}>
          {Math.round(total)}g
        </Text>
        <Text style={{
          fontSize: 12,
          color: colors.textSecondary,
          fontWeight: '500',
        }}>
          toplam
        </Text>
      </View>
    </View>
  );
};

// 🎨 MODERN MINIMAL COLOR PALETTE
const colors = {
  background: '#fafafa',
  surface: '#ffffff',
  primary: '#6366f1',
  primaryLight: '#a5b4fc',
  secondary: '#10b981',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  accent: '#f59e0b',
  success: '#10b981',
  error: '#ef4444',
  border: '#e5e7eb',
  shadow: '#0000001a'
};

export default function FoodDetailScreen({ route, navigation }) {
  const { foodName, foodData, mealType, mealLabel } = route.params || {};
  
  const [portion, setPortion] = useState('1');
  const [servingSize, setServingSize] = useState('tane');
  const [quantity, setQuantity] = useState('1');
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // 🔍 Get real food data from database
  const getFoodData = () => {
    // First try to find exact match in database
    const dbFood = TURKISH_FOOD_DATABASE.find(food => 
      food.name.toLowerCase() === (foodName || '').toLowerCase()
    );
    
    if (dbFood) {
      return {
        name: dbFood.name,
        category: dbFood.category || 'Genel',
        baseNutrition: {
          calories: dbFood.calories,
          protein: dbFood.protein,
          carbs: dbFood.carbs,
          fat: dbFood.fat,
          fiber: dbFood.fiber || 0,
          saturatedFat: dbFood.saturatedFat || dbFood.fat * 0.3, // estimate
          unsaturatedFat: dbFood.fat * 0.7, // estimate
          sugar: dbFood.sugar || dbFood.carbs * 0.1, // estimate
          sodium: dbFood.sodium || 50, // estimate
          calcium: dbFood.calcium || 20, // estimate
          iron: dbFood.iron || 1 // estimate
        },
        servingSizes: [
          { name: 'gram', multiplier: 0.01 },
          { name: 'tane', multiplier: 1.0 },
          { name: 'porsiyon', multiplier: 1.5 }
        ]
      };
    }
    
    // Fallback to default data if not found
    return {
      name: foodName || 'Besin',
      category: 'Genel',
      baseNutrition: {
        calories: 100,
        protein: 5,
        carbs: 10,
        fat: 3,
        fiber: 1,
        saturatedFat: 1,
        unsaturatedFat: 2,
        sugar: 2,
        sodium: 50,
        calcium: 20,
        iron: 1
      },
      servingSizes: [
        { name: 'gram', multiplier: 0.01 },
        { name: 'tane', multiplier: 1.0 },
        { name: 'porsiyon', multiplier: 1.5 }
      ]
    };
  };

  const currentFoodData = getFoodData();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const calculateNutrition = () => {
    const portionMultiplier = parseFloat(portion) || 1;
    const sizeMultiplier = currentFoodData.servingSizes.find(s => s.name === servingSize)?.multiplier || 1;
    const totalMultiplier = portionMultiplier * sizeMultiplier;
    
    const calculated = {};
    Object.keys(currentFoodData.baseNutrition).forEach(key => {
      calculated[key] = (currentFoodData.baseNutrition[key] * totalMultiplier).toFixed(key === 'calories' ? 0 : 1);
    });
    
    return calculated;
  };

  const nutrition = calculateNutrition();

  const handleAddFood = async () => {
    try {
      if (Haptics?.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Prepare food data for storage
      const foodDataToSave = {
        name: currentFoodData.name,
        calories: parseFloat(nutrition.calories),
        protein: parseFloat(nutrition.protein),
        carbs: parseFloat(nutrition.carbs),
        fat: parseFloat(nutrition.fat),
        amount: `${portion} ${servingSize}`,
        timestamp: new Date().toISOString(),
        source: 'food_detail'
      };

      console.log('FoodDetailScreen - Adding food to meal:', mealType, foodDataToSave);
      console.log('Route params:', route.params);
      
      // Navigate back with the food data
      navigation.navigate('Main', {
        screen: 'Diet',
        params: {
          addFoodData: {
            mealType: mealType || 'breakfast',
            foodData: foodDataToSave
          }
        }
      });
      
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{currentFoodData.name}</Text>
        
        <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.7}>
          <Ionicons name="heart-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Food Name Header */}
          <View style={styles.foodNameContainer}>
            <Text style={styles.foodName}>{currentFoodData.name}</Text>
            <Text style={styles.categoryText}>{currentFoodData.category}</Text>
          </View>

          {/* Portion Input Section */}
          <Card style={styles.inputCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>YIYECEK GÜNLÜĞÜME EKLE</Text>
              
              {/* Quantity Input */}
              <View style={styles.quantitySection}>
                <View style={styles.quantityRow}>
                  <Text style={styles.quantityIcon}>+/-</Text>
                  <View style={styles.quantityInputContainer}>
                    <TouchableOpacity 
                      style={styles.quantityAdjustButton}
                      onPress={() => {
                        const newVal = Math.max(0.1, parseFloat(portion || 1) - 0.5).toString();
                        setPortion(newVal);
                        if (Haptics?.impactAsync) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="minus" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    
                    <TextInput
                      style={styles.quantityInputField}
                      value={portion}
                      onChangeText={setPortion}
                      keyboardType="numeric"
                      mode="outlined"
                      placeholder="1"
                      textAlign="center"
                    />
                    
                    <TouchableOpacity 
                      style={styles.quantityAdjustButton}
                      onPress={() => {
                        const newVal = (parseFloat(portion || 1) + 0.5).toString();
                        setPortion(newVal);
                        if (Haptics?.impactAsync) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="plus" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Unit Selection */}
              <View style={styles.unitSection}>
                <View style={styles.unitRow}>
                  <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.textSecondary} />
                  <View style={styles.unitButtonsContainer}>
                    {currentFoodData.servingSizes.map((size) => (
                      <TouchableOpacity
                        key={size.name}
                        style={[
                          styles.unitButton,
                          servingSize === size.name && styles.unitButtonActive
                        ]}
                        onPress={() => {
                          setServingSize(size.name);
                          if (Haptics?.impactAsync) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.unitButtonText,
                          servingSize === size.name && styles.unitButtonTextActive
                        ]}>
                          {size.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleAddFood}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>

              {/* Nutrition Summary Grid */}
              <View style={styles.nutritionSummaryGrid}>
                <View style={styles.nutritionSummaryItem}>
                  <Text style={styles.nutritionSummaryLabel}>Kalori</Text>
                  <Text style={styles.nutritionSummaryValue}>{nutrition.calories} (%{Math.round((nutrition.calories / 2000) * 100)})</Text>
                </View>
                <View style={styles.nutritionSummaryItem}>
                  <Text style={styles.nutritionSummaryLabel}>Yağ</Text>
                  <Text style={styles.nutritionSummaryValue}>{nutrition.fat}g</Text>
                </View>
                <View style={styles.nutritionSummaryItem}>
                  <Text style={styles.nutritionSummaryLabel}>Karb</Text>
                  <Text style={styles.nutritionSummaryValue}>{nutrition.carbs}g</Text>
                </View>
                <View style={styles.nutritionSummaryItem}>
                  <Text style={styles.nutritionSummaryLabel}>Protein</Text>
                  <Text style={styles.nutritionSummaryValue}>{nutrition.protein}g</Text>
                </View>
              </View>
            </Card.Content>
          </Card>



          {/* Detailed Nutrition */}
          <Card style={styles.detailCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Detaylı Beslenme</Text>
              
              <View style={styles.detailGrid}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Doymuş Yağ</Text>
                  <Text style={styles.detailValue}>{nutrition.saturatedFat}g</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Doymamış Yağ</Text>
                  <Text style={styles.detailValue}>{nutrition.unsaturatedFat}g</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sodyum</Text>
                  <Text style={styles.detailValue}>{nutrition.sodium}mg</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kalsiyum</Text>
                  <Text style={styles.detailValue}>{nutrition.calcium}mg</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Demir</Text>
                  <Text style={styles.detailValue}>{nutrition.iron}mg</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddFood}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
            <Text style={styles.addButtonText}>Günlüğe Ekle</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodNameContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  inputCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quantityIcon: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  quantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  quantityAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityInputField: {
    flex: 1,
    fontSize: 16,
    minWidth: 80,
  },
  unitSection: {
    marginBottom: 20,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unitButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  unitButtonTextActive: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: colors.success,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nutritionSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  nutritionSummaryItem: {
    flex: 1,
    minWidth: '49%',
    backgroundColor: colors.background,
    padding: 16,
    alignItems: 'center',
  },
  nutritionSummaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  nutritionSummaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  nutritionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  nutritionContent: {
    gap: 20,
  },
  chartAndLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 10,
  },
  chartSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendSection: {
    flex: 1,
    gap: 10,
  },
  calorieCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  calorieNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  calorieLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  legendValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  detailCard: {
    marginHorizontal: 20,
    marginBottom: 100,
    backgroundColor: colors.surface,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  detailGrid: {
    gap: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 