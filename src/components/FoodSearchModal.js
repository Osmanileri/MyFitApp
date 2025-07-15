// 🔍 Enhanced Food Search Modal Component
// Matches the design from the screenshots with Turkish UI

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Alert,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import {
  Text,
  TextInput,
  Surface,
  Portal,
  Modal,
  Chip,
  ActivityIndicator,
  Divider,
  Card
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDebounce } from '../hooks/useDebounce';
import { 
  TURKISH_FOOD_DATABASE, 
  FOOD_CATEGORIES, 
  searchFoodsInDatabase, 
  calculateNutrition,
  POPULAR_FOODS 
} from '../data/turkishFoodDatabase';
import * as Haptics from 'expo-haptics';

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

// 🍎 ENHANCED FOOD CATEGORIES
const ENHANCED_FOOD_CATEGORIES = [
  { 
    id: 'all', 
    name: 'Tümü', 
    icon: 'food', 
    color: colors.primary,
    gradient: ['#667eea', '#764ba2']
  },
  { 
    id: 'popular', 
    name: 'Popüler', 
    icon: 'fire', 
    color: '#ef4444',
    gradient: ['#ef4444', '#dc2626']
  },
  { 
    id: 'fruits', 
    name: 'Meyveler', 
    icon: 'food-apple', 
    color: '#10b981',
    gradient: ['#10b981', '#059669']
  },
  { 
    id: 'vegetables', 
    name: 'Sebzeler', 
    icon: 'carrot', 
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2']
  },
  { 
    id: 'proteins', 
    name: 'Protein', 
    icon: 'food-steak', 
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#7c3aed']
  },
  { 
    id: 'grains', 
    name: 'Tahıllar', 
    icon: 'barley', 
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706']
  },
  { 
    id: 'dairy', 
    name: 'Süt Ürünleri', 
    icon: 'cup', 
    color: '#ec4899',
    gradient: ['#ec4899', '#db2777']
  },
];

const FoodSearchModal = ({ 
  visible, 
  onDismiss, 
  onFoodSelect, 
  mealType = 'breakfast',
  initialCategory = 'all' 
}) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedPortion, setSelectedPortion] = useState(null);
  const [customAmount, setCustomAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  // Debounced search for better performance
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Memoized food results for performance
  const searchResults = useMemo(() => {
    if (debouncedSearch.trim() === '' && selectedCategory === 'all') {
      return POPULAR_FOODS.map(id => 
        TURKISH_FOOD_DATABASE.find(food => food.id === id)
      ).filter(Boolean).slice(0, 20);
    }
    return searchFoodsInDatabase(debouncedSearch, selectedCategory);
  }, [debouncedSearch, selectedCategory]);

  // Animation effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
    }
  }, [visible]);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSelectedFood(null);
      setSelectedPortion(null);
      setCustomAmount('100');
      setSelectedCategory('all');
    }
  }, [visible]);

  // Handle food selection
  const handleFoodPress = (food) => {
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedFood(food);
    setSelectedPortion(food.commonPortions?.[0]); // Select first portion by default
  };

  // Handle portion selection
  const handlePortionSelect = (portion) => {
    setSelectedPortion(portion);
    setCustomAmount(portion.amount.toString());
  };

  // Calculate nutrition for selected amount
  const getCalculatedNutrition = () => {
    if (!selectedFood) return null;
    const amount = parseFloat(customAmount) || 100;
    return calculateNutrition(selectedFood, amount);
  };

  // Add food to meal
  const handleAddFood = async () => {
    if (!selectedFood || !customAmount) {
      Alert.alert('Hata', 'Lütfen bir besin seçin ve miktar belirtin.');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseFloat(customAmount);
      const nutrition = calculateNutrition(selectedFood, amount);
      
      const foodToAdd = {
        id: selectedFood.id,
        name: selectedFood.name,
        amount: amount,
        unit: selectedPortion?.unit || 'g',
        portionName: selectedPortion?.name || `${amount}g`,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        fiber: nutrition.fiber,
        timestamp: new Date().toISOString()
      };

      await onFoodSelect(foodToAdd, mealType);
      
      // Show success feedback
      if (Haptics?.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      onDismiss();
    } catch (error) {
      console.error('Add food error:', error);
      Alert.alert('Hata', 'Besin eklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get meal type display info
  const getMealTypeInfo = () => {
    const mealTypes = {
      breakfast: { emoji: '🌅', label: 'Kahvaltı', color: '#f59e0b' },
      lunch: { emoji: '☀️', label: 'Öğle Yemeği', color: '#10b981' },
      dinner: { emoji: '🌙', label: 'Akşam Yemeği', color: '#8b5cf6' },
      snacks: { emoji: '🍎', label: 'Atıştırmalık', color: '#ef4444' }
    };
    return mealTypes[mealType] || mealTypes.breakfast;
  };

  // Render modern header
  const renderHeader = () => {
    const mealInfo = getMealTypeInfo();
    
    return (
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <SafeAreaView>
          <Animated.View 
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header Top Row */}
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onDismiss}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.headerTitleSection}>
                <Text style={styles.headerTitle}>
                  {selectedFood ? selectedFood.name : 'Besin Ara'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {mealInfo.emoji} {mealInfo.label} için
                </Text>
              </View>
              
              <View style={styles.headerRight} />
            </View>

            {/* Search Bar */}
            {!selectedFood && (
              <Animated.View 
                style={[
                  styles.searchContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: Animated.add(slideAnim, new Animated.Value(10)) }]
                  }
                ]}
              >
                <View style={styles.searchInputContainer}>
                  <MaterialCommunityIcons name="magnify" size={20} color={colors.textLight} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Besin ara..."
                    placeholderTextColor={colors.textLight}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity 
                      style={styles.clearButton}
                      onPress={() => setSearchQuery('')}
                    >
                      <MaterialCommunityIcons name="close-circle" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  };

  // Render category chips
  const renderCategoryChips = () => (
    <Animated.View 
      style={[
        styles.categoryContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={ENHANCED_FOOD_CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ 
                translateY: Animated.add(slideAnim, new Animated.Value(index * 2))
              }]
            }}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item.id && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(item.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedCategory === item.id ? item.gradient : ['transparent', 'transparent']}
                style={styles.categoryChipGradient}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={18}
                  color={selectedCategory === item.id ? '#FFFFFF' : item.color}
                  style={styles.categoryIcon}
                />
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === item.id ? '#FFFFFF' : colors.text }
                ]}>
                  {item.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </Animated.View>
  );

  // Render food item with modern design
  const renderFoodItem = ({ item: food, index }) => (
    <Animated.View
      style={[
        styles.foodItemContainer,
        {
          opacity: fadeAnim,
          transform: [{ 
            translateY: Animated.add(slideAnim, new Animated.Value(index * 3))
          }]
        }
      ]}
    >
      <TouchableOpacity
        style={styles.foodItem}
        onPress={() => handleFoodPress(food)}
        activeOpacity={0.8}
      >
        <Surface style={styles.foodItemSurface} elevation={2}>
          <View style={styles.foodItemContent}>
            {/* Food Info */}
            <View style={styles.foodMainInfo}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodCalories}>
                {food.calories} kcal / {food.defaultAmount}g
              </Text>
              <View style={styles.macroInfo}>
                <View style={styles.macroChip}>
                  <Text style={[styles.macroText, { color: colors.protein }]}>P: {food.protein}g</Text>
                </View>
                <View style={styles.macroChip}>
                  <Text style={[styles.macroText, { color: colors.carbs }]}>K: {food.carbs}g</Text>
                </View>
                <View style={styles.macroChip}>
                  <Text style={[styles.macroText, { color: colors.fat }]}>Y: {food.fat}g</Text>
                </View>
              </View>
            </View>
            
            {/* Action Button */}
            <View style={styles.foodActions}>
              <View style={styles.addIcon}>
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={32}
                  color={colors.primary}
                />
              </View>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render portion selector with modern design
  const renderPortionSelector = () => {
    if (!selectedFood) return null;

    const calculatedNutrition = getCalculatedNutrition();

    return (
      <Animated.View 
        style={[
          styles.portionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Surface style={styles.portionSurface} elevation={4}>
          <View style={styles.portionContent}>
            
            {/* Food Header */}
            <View style={styles.selectedFoodHeader}>
              <View style={styles.selectedFoodInfo}>
                <Text style={styles.selectedFoodName}>{selectedFood.name}</Text>
                <Text style={styles.selectedFoodBase}>
                  {selectedFood.calories} kcal / {selectedFood.defaultAmount}g
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Portion Selection */}
            <View style={styles.portionSelectionSection}>
              <Text style={styles.sectionTitle}>Porsiyon Seçin</Text>
              
              <View style={styles.portionChips}>
                {selectedFood.commonPortions?.map((portion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.portionChip,
                      selectedPortion?.name === portion.name && styles.portionChipActive
                    ]}
                    onPress={() => handlePortionSelect(portion)}
                  >
                    <Text style={[
                      styles.portionChipText,
                      selectedPortion?.name === portion.name && styles.portionChipTextActive
                    ]}>
                      {portion.name}
                    </Text>
                  </TouchableOpacity>
                )) || []}
              </View>

              {/* Custom Amount */}
              <View style={styles.customAmountSection}>
                <Text style={styles.customAmountLabel}>Özel miktar:</Text>
                <View style={styles.customAmountInput}>
                  <TextInput
                    style={styles.amountInput}
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    placeholder="100"
                    keyboardType="numeric"
                    mode="outlined"
                    dense
                    outlineColor={colors.textLight + '40'}
                    activeOutlineColor={colors.primary}
                  />
                  <Text style={styles.amountUnit}>gram</Text>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Calculated Nutrition */}
            {calculatedNutrition && (
              <View style={styles.nutritionSection}>
                <Text style={styles.sectionTitle}>Beslenme Değerleri</Text>
                
                <View style={styles.nutritionCards}>
                  <View style={[styles.nutritionCard, { borderColor: colors.calories }]}>
                    <Text style={[styles.nutritionValue, { color: colors.calories }]}>
                      {calculatedNutrition.calories}
                    </Text>
                    <Text style={styles.nutritionLabel}>kcal</Text>
                  </View>
                  
                  <View style={[styles.nutritionCard, { borderColor: colors.protein }]}>
                    <Text style={[styles.nutritionValue, { color: colors.protein }]}>
                      {calculatedNutrition.protein}g
                    </Text>
                    <Text style={styles.nutritionLabel}>protein</Text>
                  </View>
                  
                  <View style={[styles.nutritionCard, { borderColor: colors.carbs }]}>
                    <Text style={[styles.nutritionValue, { color: colors.carbs }]}>
                      {calculatedNutrition.carbs}g
                    </Text>
                    <Text style={styles.nutritionLabel}>karbonhidrat</Text>
                  </View>
                  
                  <View style={[styles.nutritionCard, { borderColor: colors.fat }]}>
                    <Text style={[styles.nutritionValue, { color: colors.fat }]}>
                      {calculatedNutrition.fat}g
                    </Text>
                    <Text style={styles.nutritionLabel}>yağ</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addFoodButton}
              onPress={handleAddFood}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.addButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Öğüne Ekle</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Surface>
      </Animated.View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <MaterialCommunityIcons
        name="food-off"
        size={64}
        color={colors.textLight}
      />
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'Besin bulunamadı' : 'Popüler besinleri keşfedin'}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery ? 'Farklı anahtar kelimeler deneyin' : 'Kategori seçin veya arama yapın'}
      </Text>
    </Animated.View>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
          
          {/* Header */}
          {renderHeader()}

          {/* Content */}
          <View style={styles.content}>
            {selectedFood ? (
              // Portion selection view
              renderPortionSelector()
            ) : (
              // Food search view
              <>
                {renderCategoryChips()}
                
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderFoodItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.foodList}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  ListEmptyComponent={renderEmptyState}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleSection: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  clearButton: {
    padding: 4,
  },

  // Category Styles
  categoryContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.textLight + '30',
  },
  categoryChipActive: {
    borderColor: 'transparent',
  },
  categoryChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Content Styles
  content: {
    flex: 1,
  },
  
  // Food List Styles
  foodList: {
    padding: 20,
  },
  foodItemContainer: {
    marginBottom: 12,
  },
  foodItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  foodItemSurface: {
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  foodItemContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  foodMainInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  foodCalories: {
    fontSize: 14,
    color: colors.calories,
    fontWeight: '600',
    marginBottom: 8,
  },
  macroInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  macroChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '600',
  },
  foodActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Portion Selector Styles
  portionContainer: {
    flex: 1,
    padding: 20,
  },
  portionSurface: {
    borderRadius: 24,
    backgroundColor: colors.surface,
    flex: 1,
  },
  portionContent: {
    padding: 24,
  },
  selectedFoodHeader: {
    marginBottom: 16,
  },
  selectedFoodInfo: {
    alignItems: 'center',
  },
  selectedFoodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedFoodBase: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 20,
    backgroundColor: colors.background,
    height: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  portionSelectionSection: {
    marginBottom: 20,
  },
  portionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  portionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.background,
  },
  portionChipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  portionChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  portionChipTextActive: {
    color: colors.primary,
  },
  customAmountSection: {
    marginBottom: 16,
  },
  customAmountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountInput: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  amountUnit: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Nutrition Styles
  nutritionSection: {
    marginBottom: 24,
  },
  nutritionCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Add Button Styles
  addFoodButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Empty State Styles
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  separator: {
    height: 8,
  },
});

export default FoodSearchModal;
