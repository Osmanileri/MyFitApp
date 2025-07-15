// ✏️ Edit Food Modal Component
// Allows editing quantity and portion of existing food items

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import {
  Text,
  TextInput,
  Surface,
  Portal,
  Modal,
  Button,
  ActivityIndicator
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { calculateNutrition, getFoodById } from '../data/turkishFoodDatabase';

const EditFoodModal = ({ 
  visible, 
  onDismiss, 
  onSave,
  foodItem,
  mealType
}) => {
  const [amount, setAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize amount when modal opens
  useEffect(() => {
    if (visible && foodItem) {
      setAmount(foodItem.amount?.toString() || '100');
    }
  }, [visible, foodItem]);

  // Calculate updated nutrition
  const getUpdatedNutrition = () => {
    if (!foodItem) return null;
    
    // Try to get original food data for recalculation
    const originalFood = getFoodById(foodItem.id);
    if (originalFood) {
      return calculateNutrition(originalFood, parseFloat(amount) || 100);
    }
    
    // Fallback: scale existing nutrition data
    const currentAmount = foodItem.amount || 100;
    const factor = (parseFloat(amount) || 100) / currentAmount;
    
    return {
      calories: Math.round(foodItem.calories * factor),
      protein: Math.round(foodItem.protein * factor * 10) / 10,
      carbs: Math.round(foodItem.carbs * factor * 10) / 10,
      fat: Math.round(foodItem.fat * factor * 10) / 10,
      fiber: Math.round((foodItem.fiber || 0) * factor * 10) / 10
    };
  };

  const handleSave = async () => {
    if (!foodItem || !amount) {
      Alert.alert('Hata', 'Lütfen geçerli bir miktar girin.');
      return;
    }

    const newAmount = parseFloat(amount);
    if (isNaN(newAmount) || newAmount <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir miktar girin.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedNutrition = getUpdatedNutrition();
      
      const updatedFood = {
        ...foodItem,
        amount: newAmount,
        portionName: `${newAmount}g`,
        calories: updatedNutrition.calories,
        protein: updatedNutrition.protein,
        carbs: updatedNutrition.carbs,
        fat: updatedNutrition.fat,
        fiber: updatedNutrition.fiber,
        timestamp: new Date().toISOString()
      };

      await onSave(updatedFood, mealType);
      onDismiss();
    } catch (error) {
      console.error('Edit food error:', error);
      Alert.alert('Hata', 'Besin güncellenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const updatedNutrition = getUpdatedNutrition();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={styles.modal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
          
          {/* Header */}
          <LinearGradient
            colors={['#1F2937', '#374151']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onDismiss}
              >
                <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <Text style={styles.headerTitle}>Besini Düzenle</Text>
              
              <View style={styles.headerRight} />
            </View>
          </LinearGradient>

          {/* Content */}
          <View style={styles.content}>
            {foodItem && (
              <>
                {/* Food Info */}
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{foodItem.name}</Text>
                  <Text style={styles.currentPortion}>
                    Mevcut: {foodItem.portionName || `${foodItem.amount}g`}
                  </Text>
                </View>

                {/* Amount Input */}
                <View style={styles.amountSection}>
                  <Text style={styles.sectionTitle}>Yeni Miktar</Text>
                  <View style={styles.amountInputContainer}>
                    <TextInput
                      style={styles.amountInput}
                      value={amount}
                      onChangeText={setAmount}
                      placeholder="100"
                      keyboardType="numeric"
                      mode="outlined"
                      label="Miktar (gram)"
                      dense={false}
                    />
                  </View>
                </View>

                {/* Updated Nutrition */}
                {updatedNutrition && (
                  <View style={styles.nutritionSection}>
                    <Text style={styles.sectionTitle}>Güncellenmiş Besin Değerleri</Text>
                    <Surface style={styles.nutritionCard} elevation={2}>
                      <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionValue}>{updatedNutrition.calories}</Text>
                          <Text style={styles.nutritionLabel}>kcal</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionValue}>{updatedNutrition.protein}</Text>
                          <Text style={styles.nutritionLabel}>g protein</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionValue}>{updatedNutrition.carbs}</Text>
                          <Text style={styles.nutritionLabel}>g karb</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionValue}>{updatedNutrition.fat}</Text>
                          <Text style={styles.nutritionLabel}>g yağ</Text>
                        </View>
                      </View>
                    </Surface>
                  </View>
                )}

                {/* Save Button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.saveButtonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>Kaydet</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </SafeAreaView>
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
    backgroundColor: '#F9FAFB',
  },
  
  // Header Styles
  header: {
    paddingTop: StatusBar.currentHeight || 0,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },

  // Content Styles
  content: {
    flex: 1,
    padding: 20,
  },
  
  // Food Info
  foodInfo: {
    marginBottom: 24,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  currentPortion: {
    fontSize: 16,
    color: '#6B7280',
  },

  // Amount Section
  amountSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  amountInputContainer: {
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#FFFFFF',
  },

  // Nutrition Section
  nutritionSection: {
    marginBottom: 32,
  },
  nutritionCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },

  // Save Button
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 'auto',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EditFoodModal; 