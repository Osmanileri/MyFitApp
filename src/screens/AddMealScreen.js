import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  Alert, 
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  Pressable,
  TouchableOpacity 
} from 'react-native';
import { 
  Text, 
  Button, 
  Chip, 
  Card, 
  TextInput, 
  Surface, 
  Avatar, 
  ActivityIndicator,
  Searchbar 
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-svg-circular-progress';
import { useDietStore } from '../store/dietStore';
import { useDebounce } from '../hooks/useDebounce';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const mealTypes = [
  { 
    label: 'Kahvaltı', 
    value: 'breakfast', 
    icon: 'white-balance-sunny',
    gradient: ['#FF6B6B', '#FF8E53'],
    time: '07:00-10:00',
    emoji: '🌅'
  },
  { 
    label: 'Öğle', 
    value: 'lunch', 
    icon: 'weather-sunny',
    gradient: ['#4ECDC4', '#44A08D'],
    time: '12:00-14:00',
    emoji: '☀️'
  },
  { 
    label: 'Akşam', 
    value: 'dinner', 
    icon: 'weather-night',
    gradient: ['#A8E6CF', '#88D8A3'],
    time: '18:00-21:00',
    emoji: '🌙'
  },
  { 
    label: 'Ara Öğün', 
    value: 'snacks', 
    icon: 'food-apple',
    gradient: ['#FFD93D', '#6BCF7F'],
    time: 'İstediğin zaman',
    emoji: '🍎'
  },
];

export default function AddMealScreen({ navigation: propNavigation }) {
  const navigation = propNavigation || useNavigation();
  const [mealType, setMealType] = useState('breakfast');
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);

  // Diet store integration
  const {
    searchResults,
    popularFoods,
    dailyMeals,
    nutritionGoals,
    searchFoods,
    addFood,
    getDailyProgress,
    isSearching,
    searchError
  } = useDietStore();

  // Debounced search
  const debouncedSearch = useDebounce(search, 300);

  // Get daily progress for calorie display
  const dailyProgress = getDailyProgress();
  const remainingCalories = nutritionGoals.calories - dailyProgress.calories;

  useEffect(() => {
    if (debouncedSearch.length > 2) {
      searchFoods(debouncedSearch);
    }
  }, [debouncedSearch, searchFoods]);

  const handleAddFood = async () => {
    if (!selectedFood || !amount) {
      Alert.alert('Hata', 'Lütfen bir yiyecek seçin ve miktar girin.');
      return;
    }

    setIsLoading(true);
    try {
      await addFood(selectedFood, parseFloat(amount) || 100, mealType);
      Alert.alert('Başarılı', 'Yiyecek öğüne eklendi!');
      setSelectedFood(null);
      setAmount('100');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Yiyecek eklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayFoods = search.length > 0 ? searchResults : popularFoods;

  return (
    <LinearGradient colors={['#fffde7', '#fff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Öğün Ekle</Text>
        {/* Kalan Kalori Progress ve Özet */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <AnimatedCircularProgress
            size={120}
            width={14}
            fill={Math.min((dailyProgress.calories / nutritionGoals.calories) * 100, 100)}
            tintColor="#fbc02d"
            backgroundColor="#ffe082"
            rotation={0}
            lineCap="round"
          >
            {fill => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fbc02d' }}>{Math.max(0, remainingCalories)} kcal</Text>
                <Text style={{ fontSize: 13, color: '#888' }}>Kalan</Text>
              </View>
            )}
          </AnimatedCircularProgress>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Text style={{ color: '#888', marginRight: 12 }}>Alınan: <Text style={{ color: '#222', fontWeight: 'bold' }}>{Math.round(dailyProgress.calories)} kcal</Text></Text>
            <Text style={{ color: '#888' }}>Hedef: <Text style={{ color: '#222', fontWeight: 'bold' }}>{nutritionGoals.calories} kcal</Text></Text>
          </View>
        </View>
        {/* Öğün Tipi Seçimi */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealTypeRow}>
          {mealTypes.map(mt => (
            <Chip
              key={mt.value}
              icon={mt.icon}
              selected={mealType === mt.value}
              style={[styles.mealTypeChip, mealType === mt.value && styles.mealTypeChipActive]}
              textStyle={{ fontWeight: 'bold', color: mealType === mt.value ? '#fff' : '#fbc02d' }}
              onPress={() => setMealType(mt.value)}
            >
              {mt.label}
            </Chip>
          ))}
        </ScrollView>
        {/* Yiyecek Arama Alanı */}
        <TextInput
          label="Yiyecek ara..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          left={<TextInput.Icon icon="magnify" />}
        />
        {/* Arama Sonuçları */}
        {searchResults.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Arama Sonuçları</Text>
            <FlatList
              data={searchResults}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.name}
              renderItem={({ item }) => (
                <Card
                  style={[styles.foodCard, selectedFood?.name === item.name && styles.foodCardActive]}
                  onPress={() => setSelectedFood(item)}
                >
                  <Card.Content style={{ alignItems: 'center' }}>
                    <Avatar.Icon icon={item.icon} size={40} style={{ backgroundColor: '#fffde7' }} color="#fbc02d" />
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodMacro}>{item.calories} kcal</Text>
                  </Card.Content>
                </Card>
              )}
              style={{ marginBottom: 12 }}
            />
          </View>
        )}
        {/* Popüler/Son Yiyecekler */}
        {searchResults.length === 0 && (
          <>
            <Text style={styles.sectionTitle}>Popüler Yiyecekler</Text>
            <FlatList
              data={popularFoods}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.name}
              renderItem={({ item }) => (
                <Card
                  style={[styles.foodCard, selectedFood?.name === item.name && styles.foodCardActive]}
                  onPress={() => setSelectedFood(item)}
                >
                  <Card.Content style={{ alignItems: 'center' }}>
                    <Avatar.Icon icon={item.icon} size={40} style={{ backgroundColor: '#fffde7' }} color="#fbc02d" />
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodMacro}>{item.calories} kcal</Text>
                  </Card.Content>
                </Card>
              )}
              style={{ marginBottom: 12 }}
            />
          </>
        )}
        {/* Seçilen Yiyecek Özeti */}
        {selectedFood && (
          <Surface style={styles.summaryBox} elevation={3}>
            <Text style={styles.summaryLabel}>{selectedFood.name}</Text>
            <View style={styles.macroRow}>
              <Chip icon="fire" style={[styles.chip, { backgroundColor: '#ffe082' }]} textStyle={{ color: '#fbc02d', fontWeight: 'bold' }}>{selectedFood.calories} kcal</Chip>
              <Chip icon="food-variant" style={[styles.chip, { backgroundColor: '#bbdefb' }]} textStyle={{ color: '#42a5f5', fontWeight: 'bold' }}>{selectedFood.protein}g P</Chip>
              <Chip icon="grain" style={[styles.chip, { backgroundColor: '#c8e6c9' }]} textStyle={{ color: '#66bb6a', fontWeight: 'bold' }}>{selectedFood.carb}g K</Chip>
              <Chip icon="oil" style={[styles.chip, { backgroundColor: '#ffe0b2' }]} textStyle={{ color: '#ffa726', fontWeight: 'bold' }}>{selectedFood.fat}g Y</Chip>
            </View>
            <Button mode="contained" style={styles.addButton} icon="plus" onPress={() => { Alert.alert('Başarılı', 'Yiyecek öğüne eklendi!'); navigation.goBack(); }}>
              Öğüne Ekle
            </Button>
          </Surface>
        )}
        {/* Manuel Ekleme ve Önceki Öğün */}
        <View style={styles.row}>
          <Button mode="outlined" style={styles.outlinedBtn} icon="pencil" onPress={() => navigation.navigate('ManualFoodAdd')}>
            Manuel Ekle
          </Button>
          <Button mode="outlined" style={styles.outlinedBtn} icon="history" onPress={() => Alert.alert('Tekrarla', 'Bu özellik yakında eklenecek!')}>
            Önceki Öğünümü Tekrarla
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fbc02d',
    marginBottom: 16,
    textAlign: 'center',
  },
  mealTypeRow: {
    marginBottom: 12,
  },
  mealTypeChip: {
    marginRight: 8,
    backgroundColor: '#fffde7',
    borderColor: '#fbc02d',
    borderWidth: 1,
    height: 36,
  },
  mealTypeChipActive: {
    backgroundColor: '#fbc02d',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fffde7',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    marginTop: 8,
  },
  foodCard: {
    width: 120,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fbc02d22',
  },
  foodCardActive: {
    borderColor: '#fbc02d',
    borderWidth: 2,
    backgroundColor: '#fffde7',
  },
  foodName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
  },
  foodMacro: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  summaryBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbc02d',
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 32,
  },
  addButton: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#fbc02d',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  outlinedBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    borderColor: '#fbc02d',
  },
}); 