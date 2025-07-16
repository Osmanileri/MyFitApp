import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/appTheme';

const FoodSearch = ({ onFoodSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState('100');

  // Örnek besin veritabanı
  const mockFoodDatabase = [
    {
      id: 1,
      name: 'Tavuk Göğsü',
      brand: 'Genel',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      per100g: true
    },
    {
      id: 2,
      name: 'Pirinç Pilavı',
      brand: 'Genel',
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      fiber: 0.4,
      sugar: 0,
      sodium: 5,
      per100g: true
    },
    {
      id: 3,
      name: 'Elma',
      brand: 'Genel',
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10,
      sodium: 1,
      per100g: true
    },
    {
      id: 4,
      name: 'Yoğurt',
      brand: 'Genel',
      calories: 61,
      protein: 3.5,
      carbs: 4.7,
      fat: 3.3,
      fiber: 0,
      sugar: 4.7,
      sodium: 46,
      per100g: true
    },
    {
      id: 5,
      name: 'Yumurta',
      brand: 'Genel',
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      fiber: 0,
      sugar: 1.1,
      sodium: 124,
      per100g: false,
      serving: '1 adet (50g)'
    },
    {
      id: 6,
      name: 'Ekmek',
      brand: 'Tam Buğday',
      calories: 247,
      protein: 13,
      carbs: 41,
      fat: 4.2,
      fiber: 7,
      sugar: 6,
      sodium: 400,
      per100g: true
    },
    {
      id: 7,
      name: 'Muz',
      brand: 'Genel',
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1,
      per100g: true
    },
    {
      id: 8,
      name: 'Somon',
      brand: 'Genel',
      calories: 208,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      per100g: true
    },
    {
      id: 9,
      name: 'Avokado',
      brand: 'Genel',
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
      sugar: 0.7,
      sodium: 7,
      per100g: true
    },
    {
      id: 10,
      name: 'Badem',
      brand: 'Genel',
      calories: 579,
      protein: 21,
      carbs: 22,
      fat: 50,
      fiber: 12,
      sugar: 4.4,
      sodium: 1,
      per100g: true
    }
  ];

  const searchFoods = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = mockFoodDatabase.filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.brand.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    searchFoods(searchQuery);
  }, [searchQuery]);

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
  };

  const confirmSelection = () => {
    if (!selectedFood) return;

    const portionAmount = parseFloat(portion);
    if (isNaN(portionAmount) || portionAmount <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir miktar girin');
      return;
    }

    const multiplier = selectedFood.per100g ? portionAmount / 100 : portionAmount;
    
    const selectedFoodData = {
      id: selectedFood.id,
      name: selectedFood.name,
      brand: selectedFood.brand,
      amount: portionAmount,
      serving: {
        description: selectedFood.per100g ? `${portionAmount}g` : `${portionAmount} ${selectedFood.serving || 'adet'}`,
        calories: Math.round(selectedFood.calories * multiplier),
        protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
        carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
        fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
        fiber: Math.round(selectedFood.fiber * multiplier * 10) / 10,
        sugar: Math.round(selectedFood.sugar * multiplier * 10) / 10,
        sodium: Math.round(selectedFood.sodium * multiplier * 10) / 10,
      },
      source: 'database'
    };

    onFoodSelect(selectedFoodData);
    onClose();
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.foodItem,
        selectedFood?.id === item.id && styles.selectedFoodItem
      ]}
      onPress={() => handleFoodSelect(item)}
    >
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodBrand}>{item.brand}</Text>
        <Text style={styles.foodNutrition}>
          {item.calories} kcal • P: {item.protein}g • K: {item.carbs}g • Y: {item.fat}g
        </Text>
      </View>
      <View style={styles.foodCalories}>
        <Text style={styles.calorieText}>{item.calories}</Text>
        <Text style={styles.calorieLabel}>kcal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Besin Ara</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Besin adı ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Aranıyor...</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={48} color="#ccc" />
                <Text style={styles.emptyText}>
                  {searchQuery ? 'Sonuç bulunamadı' : 'Aramaya başlayın'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Selection Panel */}
      {selectedFood && (
        <View style={styles.selectionPanel}>
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionTitle}>{selectedFood.name}</Text>
            <Text style={styles.selectionBrand}>{selectedFood.brand}</Text>
          </View>

          <View style={styles.portionContainer}>
            <Text style={styles.portionLabel}>Miktar:</Text>
            <View style={styles.portionInput}>
              <TextInput
                style={styles.portionTextInput}
                value={portion}
                onChangeText={setPortion}
                keyboardType="numeric"
                selectTextOnFocus
              />
              <Text style={styles.portionUnit}>
                {selectedFood.per100g ? 'g' : selectedFood.serving || 'adet'}
              </Text>
            </View>
          </View>

          <View style={styles.nutritionPreview}>
            <Text style={styles.previewTitle}>Beslenme Bilgileri:</Text>
            <View style={styles.macroRow}>
              <Text style={styles.macroText}>
                Kalori: {Math.round(selectedFood.calories * (selectedFood.per100g ? parseFloat(portion) / 100 : parseFloat(portion) || 1))}
              </Text>
              <Text style={styles.macroText}>
                Protein: {Math.round(selectedFood.protein * (selectedFood.per100g ? parseFloat(portion) / 100 : parseFloat(portion) || 1) * 10) / 10}g
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmSelection}
            disabled={!portion || parseFloat(portion) <= 0}
          >
            <Text style={styles.confirmButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedFoodItem: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f8ff',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  foodBrand: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  foodNutrition: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  foodCalories: {
    alignItems: 'center',
    marginLeft: 16,
  },
  calorieText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  calorieLabel: {
    fontSize: 12,
    color: '#666',
  },
  selectionPanel: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectionHeader: {
    marginBottom: 16,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectionBrand: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  portionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  portionLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 12,
  },
  portionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  portionTextInput: {
    fontSize: 16,
    color: '#333',
    minWidth: 60,
    textAlign: 'center',
  },
  portionUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  nutritionPreview: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroText: {
    fontSize: 13,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodSearch; 