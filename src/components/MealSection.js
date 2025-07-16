import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MealSection = ({ title, icon, foods, onAddFood, onRemoveFood, onEditFood, showIcon = false, totalCalories }) => {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPortion, setNewPortion] = useState('');
  
  const getIconColor = () => {
    switch (title) {
      case 'Kahvaltı': return '#fbbf24';
      case 'Öğle Yemeği': return '#38bdf8';
      case 'Akşam Yemeği': return '#fb923c';
      case 'Atıştırmalık': return '#a855f7';
      default: return '#fbbf24';
    }
  };

  const calculateMealTotals = () => {
    return foods.reduce((totals, food) => {
      const portion = food.portion || 1;
      const servingSize = food.servingSize || 100;
      const multiplier = (portion * servingSize) / 100;

      return {
        calories: totals.calories + (food.calories || 0) * multiplier,
        protein: totals.protein + (food.protein || 0) * multiplier,
        carbs: totals.carbs + (food.carbs || 0) * multiplier,
        fat: totals.fat + (food.fat || 0) * multiplier,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const mealTotals = calculateMealTotals();

  const handleEditFood = (food, index) => {
    setEditingFood(food);
    setEditingIndex(index);
    setNewPortion(food.portion?.toString() || '1');
    setEditModalVisible(true);
  };

  const handleUpdatePortion = () => {
    if (editingFood && editingIndex !== null && newPortion) {
      const updatedFood = {
        ...editingFood,
        portion: parseFloat(newPortion) || 1
      };
      
      if (onEditFood) {
        onEditFood(editingIndex, updatedFood);
      }
      
      setEditModalVisible(false);
      setEditingFood(null);
      setEditingIndex(null);
      setNewPortion('');
    }
  };

  const handleNavigateToFoodDetail = (food) => {
    // Navigate to food detail screen or show food image
    try {
      navigation.navigate('FoodDetail', { 
        food: food,
        showImage: true 
      });
    } catch (error) {
      // If navigation fails, show an alert with food info
      Alert.alert(
        food.name || food.foodName || 'Besin Detayı',
        `Kalori: ${food.calories || 0}\nProtein: ${food.protein || 0}g\nKarbonhidrat: ${food.carbs || 0}g\nYağ: ${food.fat || 0}g`,
        [{ text: 'Tamam' }]
      );
    }
  };



  const handleLongPressDelete = (index) => {
    Alert.alert(
      'Besini Sil',
      `"${foods[index]?.name || foods[index]?.foodName || 'Bu besin'}" silinsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => onRemoveFood(index)
        }
      ]
    );
  };

  const renderFoodItem = ({ item, index }) => {
    const portion = item.portion || 1;
    const servingSize = item.servingSize || 100;
    const multiplier = (portion * servingSize) / 100;
    
    const foodCalories = (item.calories || 0) * multiplier;
    const foodProtein = (item.protein || 0) * multiplier;
    const foodCarbs = (item.carbs || 0) * multiplier;
    const foodFat = (item.fat || 0) * multiplier;

    // Fix food name display - get the actual food name
    const foodName = item.name || item.foodName || item.title || 'İsimsiz Besin';

    // Porsiyon açıklaması
    const portionText = portion === 1 ? 
      `${servingSize}g` : 
      `${portion} porsiyon (${servingSize}g)`;

    return (
      <TouchableOpacity 
        style={styles.foodItem}
        onLongPress={() => handleLongPressDelete(index)}
      >
        <View style={styles.foodContent}>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.foodPortion}>{portionText}</Text>
          
          <View style={styles.foodMacros}>
            <Text style={styles.foodMacroValue}>{Math.round(foodFat * 100) / 100}</Text>
            <Text style={styles.foodMacroValue}>{Math.round(foodCarbs * 100) / 100}</Text>
            <Text style={styles.foodMacroValue}>{Math.round(foodProtein * 100) / 100}</Text>
            <Text style={styles.foodMacroValue}>%{Math.round((foodCalories / 2000) * 100) || 0}</Text>
          </View>
        </View>
        
        <View style={styles.foodActions}>
          <Text style={styles.foodCalories}>{Math.round(foodCalories)}</Text>
          <View style={styles.foodActionButtons}>
            <TouchableOpacity 
              onPress={() => handleLongPressDelete(index)} 
              style={styles.foodDeleteButton}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleNavigateToFoodDetail(item)} 
              style={styles.foodExpandButton}
            >
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Meal Header */}
      <View style={styles.mealHeader}>
        <TouchableOpacity 
          style={styles.mealHeaderLeft}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {showIcon && (
            <View style={[styles.mealIcon, { backgroundColor: `${getIconColor()}20` }]}>
              <Ionicons name={icon} size={18} color={getIconColor()} />
            </View>
          )}
          <Text style={styles.mealTitle}>{title}</Text>
        </TouchableOpacity>
        
        <View style={styles.mealHeaderRight}>
          <Text style={styles.mealCalories}>
            {Math.round(mealTotals.calories)}
          </Text>
          <Text style={styles.mealCaloriesUnit}>Kalori</Text>
          
          <TouchableOpacity onPress={onAddFood} style={styles.addButton}>
            <Ionicons name="add" size={32} color="#22c55e" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Meal Totals - Her zaman gösterilen */}
      {foods.length > 0 && (
        <View style={styles.mealTotalsRow}>
          <Text style={styles.mealTotalValue}>{Math.round(mealTotals.fat * 100) / 100}</Text>
          <Text style={styles.mealTotalValue}>{Math.round(mealTotals.carbs * 100) / 100}</Text>
          <Text style={styles.mealTotalValue}>{Math.round(mealTotals.protein * 100) / 100}</Text>
          <Text style={styles.mealTotalValue}>%{Math.round((mealTotals.calories / 2000) * 100) || 0}</Text>
          <TouchableOpacity 
            onPress={() => setIsExpanded(!isExpanded)} 
            style={styles.totalsExpandButton}
          >
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={14} 
              color="#9ca3af" 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Food List */}
      {isExpanded && foods.length > 0 && (
        <View style={styles.foodList}>
          <FlatList
            data={foods}
            keyExtractor={(item, index) => `${item.name || item.id || index}-${index}`}
            renderItem={renderFoodItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Porsiyon Düzenle</Text>
            <Text style={styles.modalSubtitle}>
              {editingFood?.name || editingFood?.foodName || 'Besin'}
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Porsiyon miktarı:</Text>
              <TextInput
                style={styles.textInput}
                value={newPortion}
                onChangeText={setNewPortion}
                keyboardType="numeric"
                placeholder="1"
                autoFocus={true}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.updateButton]} 
                onPress={handleUpdatePortion}
              >
                <Text style={styles.updateButtonText}>Güncelle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4a5568',
    marginBottom: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#4a5568',
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  mealHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealCalories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  mealCaloriesUnit: {
    fontSize: 13,
    color: '#cbd5e0',
    marginRight: 8,
  },
  addButton: {
    padding: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 10,
  },
  totalsExpandButton: {
    padding: 6,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 8,
    marginLeft: 8,
  },
  mealTotalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#6b7280',
  },
  mealTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  foodList: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5568',
    backgroundColor: '#6b7280',
  },
  foodContent: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  foodPortion: {
    fontSize: 12,
    color: '#22c55e',
    marginBottom: 8,
  },
  foodMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 60,
  },
  foodMacroValue: {
    fontSize: 12,
    color: '#d1d5db',
    flex: 1,
    textAlign: 'center',
  },
  foodActions: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  foodActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foodDeleteButton: {
    padding: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 6,
  },
  foodExpandButton: {
    padding: 6,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 350,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2d3748',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  updateButton: {
    backgroundColor: '#22c55e',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MealSection; 