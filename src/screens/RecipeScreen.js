import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, Card, Surface, Button, Avatar, Divider, Modal, Portal, TextInput, Chip, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRecipeStore } from '../store/recipeStore';
import { useDietStore } from '../store/dietStore';

const DIFFICULTY_LEVELS = [
  { key: 'easy', label: 'Kolay', color: '#4caf50' },
  { key: 'medium', label: 'Orta', color: '#ff9800' },
  { key: 'hard', label: 'Zor', color: '#f44336' }
];

const RECIPE_CATEGORIES = [
  { key: 'breakfast', label: 'Kahvaltı', icon: 'food-croissant' },
  { key: 'lunch', label: 'Öğle', icon: 'food-variant' },
  { key: 'dinner', label: 'Akşam', icon: 'food-steak' },
  { key: 'snack', label: 'Ara Öğün', icon: 'food-apple' },
  { key: 'dessert', label: 'Tatlı', icon: 'cupcake' },
  { key: 'healthy', label: 'Sağlıklı', icon: 'heart' }
];

export default function RecipeScreen({ navigation }) {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, searchRecipes } = useRecipeStore();
  const { addMeal } = useDietStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recipeForm, setRecipeForm] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    servings: '1',
    cookingTime: '',
    difficulty: 'easy',
    category: 'lunch',
    calories: '',
    protein: '',
    carb: '',
    fat: '',
    tags: ''
  });

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setRecipeForm({
      name: '',
      description: '',
      ingredients: '',
      instructions: '',
      servings: '1',
      cookingTime: '',
      difficulty: 'easy',
      category: 'lunch',
      calories: '',
      protein: '',
      carb: '',
      fat: '',
      tags: ''
    });
  };

  const handleSaveRecipe = () => {
    if (!recipeForm.name.trim()) {
      Alert.alert('Hata', 'Tarif adı gereklidir');
      return;
    }

    const recipe = {
      ...recipeForm,
      servings: parseInt(recipeForm.servings) || 1,
      cookingTime: parseInt(recipeForm.cookingTime) || 0,
      calories: parseFloat(recipeForm.calories) || 0,
      protein: parseFloat(recipeForm.protein) || 0,
      carb: parseFloat(recipeForm.carb) || 0,
      fat: parseFloat(recipeForm.fat) || 0,
      tags: recipeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: editingRecipe ? editingRecipe.createdAt : new Date().toISOString()
    };

    if (editingRecipe) {
      updateRecipe(editingRecipe.id, recipe);
    } else {
      addRecipe(recipe);
    }

    setModalVisible(false);
    setEditingRecipe(null);
    resetForm();
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setRecipeForm({
      ...recipe,
      servings: recipe.servings.toString(),
      cookingTime: recipe.cookingTime.toString(),
      calories: recipe.calories.toString(),
      protein: recipe.protein.toString(),
      carb: recipe.carb.toString(),
      fat: recipe.fat.toString(),
      tags: recipe.tags.join(', ')
    });
    setModalVisible(true);
  };

  const handleDeleteRecipe = (recipe) => {
    Alert.alert(
      'Tarifi Sil',
      `"${recipe.name}" tarifini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => deleteRecipe(recipe.id) }
      ]
    );
  };

  const handleAddToMeal = (recipe) => {
    Alert.alert(
      'Öğüne Ekle',
      `"${recipe.name}" tarifini hangi öğüne eklemek istiyorsunuz?`,
      [
        { text: 'Kahvaltı', onPress: () => addRecipeToMeal(recipe, 'breakfast') },
        { text: 'Öğle', onPress: () => addRecipeToMeal(recipe, 'lunch') },
        { text: 'Akşam', onPress: () => addRecipeToMeal(recipe, 'dinner') },
        { text: 'Ara Öğün', onPress: () => addRecipeToMeal(recipe, 'snack') },
        { text: 'İptal', style: 'cancel' }
      ]
    );
  };

  const addRecipeToMeal = (recipe, mealType) => {
    const mealData = {
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carb: recipe.carb,
      fat: recipe.fat,
      amount: 1,
      unit: 'porsiyon',
      isRecipe: true,
      recipeId: recipe.id
    };
    
    addMeal(mealType, mealData);
    Alert.alert('Başarılı', `"${recipe.name}" ${mealType} öğününe eklendi`);
  };

  const renderRecipeCard = ({ item }) => (
    <Card style={styles.recipeCard}>
      <Card.Content>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <View style={styles.recipeActions}>
            <TouchableOpacity onPress={() => handleEditRecipe(item)}>
              <MaterialCommunityIcons name="pencil" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteRecipe(item)} style={{ marginLeft: 8 }}>
              <MaterialCommunityIcons name="delete" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.recipeDescription}>{item.description}</Text>
        
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock" size={16} color="#666" />
            <Text style={styles.metaText}>{item.cookingTime} dk</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="account-group" size={16} color="#666" />
            <Text style={styles.metaText}>{item.servings} kişi</Text>
          </View>
          <Chip 
            mode="outlined" 
            style={[styles.difficultyChip, { borderColor: DIFFICULTY_LEVELS.find(d => d.key === item.difficulty)?.color }]}
            textStyle={{ color: DIFFICULTY_LEVELS.find(d => d.key === item.difficulty)?.color }}
          >
            {DIFFICULTY_LEVELS.find(d => d.key === item.difficulty)?.label}
          </Chip>
        </View>

        <View style={styles.macroInfo}>
          <Text style={styles.macroText}>{item.calories} kcal</Text>
          <Text style={styles.macroText}>P: {item.protein}g</Text>
          <Text style={styles.macroText}>K: {item.carb}g</Text>
          <Text style={styles.macroText}>Y: {item.fat}g</Text>
        </View>

        <View style={styles.tagContainer}>
          {item.tags.map((tag, index) => (
            <Chip key={index} mode="outlined" style={styles.tagChip}>
              {tag}
            </Chip>
          ))}
        </View>
      </Card.Content>
      
      <Card.Actions>
        <Button mode="outlined" onPress={() => handleAddToMeal(item)}>
          Öğüne Ekle
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tariflerim</Text>
        <TextInput
          mode="outlined"
          placeholder="Tarif ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <TouchableOpacity
          style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.categoryText, selectedCategory === 'all' && styles.categoryTextActive]}>
            Tümü
          </Text>
        </TouchableOpacity>
        {RECIPE_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.key}
            style={[styles.categoryChip, selectedCategory === category.key && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <MaterialCommunityIcons 
              name={category.icon} 
              size={16} 
              color={selectedCategory === category.key ? '#fff' : '#666'} 
            />
            <Text style={[styles.categoryText, selectedCategory === category.key && styles.categoryTextActive]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item.id}
        renderItem={renderRecipeCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          setEditingRecipe(null);
          resetForm();
          setModalVisible(true);
        }}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>
              {editingRecipe ? 'Tarif Düzenle' : 'Yeni Tarif'}
            </Text>

            <TextInput
              mode="outlined"
              label="Tarif Adı *"
              value={recipeForm.name}
              onChangeText={(text) => setRecipeForm({ ...recipeForm, name: text })}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Açıklama"
              value={recipeForm.description}
              onChangeText={(text) => setRecipeForm({ ...recipeForm, description: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Malzemeler"
              value={recipeForm.ingredients}
              onChangeText={(text) => setRecipeForm({ ...recipeForm, ingredients: text })}
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Yapılış"
              value={recipeForm.instructions}
              onChangeText={(text) => setRecipeForm({ ...recipeForm, instructions: text })}
              multiline
              numberOfLines={5}
              style={styles.input}
            />

            <View style={styles.formRow}>
              <TextInput
                mode="outlined"
                label="Porsiyon"
                value={recipeForm.servings}
                onChangeText={(text) => setRecipeForm({ ...recipeForm, servings: text })}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 8 }]}
              />
              <TextInput
                mode="outlined"
                label="Süre (dk)"
                value={recipeForm.cookingTime}
                onChangeText={(text) => setRecipeForm({ ...recipeForm, cookingTime: text })}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginLeft: 8 }]}
              />
            </View>

            <View style={styles.formRow}>
              <TextInput
                mode="outlined"
                label="Kalori"
                value={recipeForm.calories}
                onChangeText={(text) => setRecipeForm({ ...recipeForm, calories: text })}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 4 }]}
              />
              <TextInput
                mode="outlined"
                label="Protein (g)"
                value={recipeForm.protein}
                onChangeText={(text) => setRecipeForm({ ...recipeForm, protein: text })}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginHorizontal: 4 }]}
              />
              <TextInput
                mode="outlined"
                label="Karb (g)"
                value={recipeForm.carb}
                onChangeText={(text) => setRecipeForm({ ...recipeForm, carb: text })}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginHorizontal: 4 }]}
              />
              <TextInput
                mode="outlined"
                label="Yağ (g)"
                value={recipeForm.fat}
                onChangeText={(text) => setRecipeForm({ ...recipeForm, fat: text })}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginLeft: 4 }]}
              />
            </View>

            <TextInput
              mode="outlined"
              label="Etiketler (virgülle ayırın)"
              value={recipeForm.tags}
              onChangeText={(text) => setRecipeForm({ ...recipeForm, tags: text })}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                İptal
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveRecipe}
                style={styles.saveButton}
              >
                {editingRecipe ? 'Güncelle' : 'Kaydet'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  searchInput: {
    marginBottom: 8,
  },
  categoryScroll: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryChipActive: {
    backgroundColor: '#388e3c',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  recipeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  recipeActions: {
    flexDirection: 'row',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  difficultyChip: {
    height: 28,
  },
  macroInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroText: {
    fontSize: 12,
    color: '#388e3c',
    fontWeight: '500',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagChip: {
    marginRight: 4,
    marginBottom: 4,
    height: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#388e3c',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});
