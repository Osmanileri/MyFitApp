import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useDietStore } from '../store/dietStore';

export default function NutritionProgress({ navigation }) {
  const {
    nutritionGoals,
    dailyProgress,
    updateDailyProgress,
    getProgressPercentage,
    getRemainingNutrients,
    loadNutritionGoals
  } = useDietStore();

  useEffect(() => {
    loadNutritionGoals();
    updateDailyProgress();
  }, []);

  const remaining = getRemainingNutrients();

  const nutrients = [
    {
      key: 'calories',
      name: 'Kalori',
      current: dailyProgress.calories,
      target: nutritionGoals.calories,
      unit: 'kcal',
      color: '#ff5722',
      icon: 'fire'
    },
    {
      key: 'protein',
      name: 'Protein',
      current: dailyProgress.protein,
      target: nutritionGoals.protein,
      unit: 'g',
      color: '#1976d2',
      icon: 'dumbbell'
    },
    {
      key: 'carbs',
      name: 'Karbonhidrat',
      current: dailyProgress.carbs,
      target: nutritionGoals.carbs,
      unit: 'g',
      color: '#388e3c',
      icon: 'grain'
    },
    {
      key: 'fat',
      name: 'Yağ',
      current: dailyProgress.fat,
      target: nutritionGoals.fat,
      unit: 'g',
      color: '#fbc02d',
      icon: 'water-outline'
    }
  ];

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="target" size={24} color="#4caf50" />
          <Text style={styles.headerTitle}>Günlük Hedefler</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('NutritionGoals')}
        >
          <MaterialCommunityIcons name="cog" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Main Calories Circle */}
      <View style={styles.mainCircleContainer}>
        <AnimatedCircularProgress
          size={120}
          width={8}
          fill={getProgressPercentage('calories')}
          tintColor="#ff5722"
          backgroundColor="#e0e0e0"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.circleContent}>
              <Text style={styles.circleMainText}>
                {dailyProgress.calories}
              </Text>
              <Text style={styles.circleSubText}>/ {nutritionGoals.calories}</Text>
              <Text style={styles.circleUnit}>kcal</Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <Text style={styles.remainingText}>
          {remaining.calories > 0 ? `${remaining.calories} kcal kaldı` : 'Hedef aşıldı!'}
        </Text>
      </View>

      {/* Macros Progress Bars */}
      <View style={styles.macrosContainer}>
        {nutrients.slice(1).map((nutrient) => {
          const percentage = getProgressPercentage(nutrient.key) / 100;
          return (
            <View key={nutrient.key} style={styles.macroRow}>
              <View style={styles.macroInfo}>
                <MaterialCommunityIcons 
                  name={nutrient.icon} 
                  size={20} 
                  color={nutrient.color} 
                />
                <Text style={styles.macroName}>{nutrient.name}</Text>
              </View>
              <View style={styles.macroProgress}>
                <ProgressBar 
                  progress={percentage}
                  color={nutrient.color}
                  style={styles.progressBar}
                />
                <Text style={styles.macroValues}>
                  {nutrient.current} / {nutrient.target} {nutrient.unit}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Water Progress */}
      <View style={styles.waterContainer}>
        <View style={styles.waterHeader}>
          <MaterialCommunityIcons name="cup-water" size={20} color="#00bcd4" />
          <Text style={styles.waterTitle}>Su Tüketimi</Text>
        </View>
        <View style={styles.waterProgress}>
          <ProgressBar 
            progress={getProgressPercentage('water') / 100}
            color="#00bcd4"
            style={styles.progressBar}
          />
          <Text style={styles.waterValues}>
            {dailyProgress.water} / {nutritionGoals.water} L
          </Text>
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('WaterTracking')}
        >
          <MaterialCommunityIcons name="cup-water" size={18} color="#00bcd4" />
          <Text style={styles.actionButtonText}>Su Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddMeal')}
        >
          <MaterialCommunityIcons name="food-apple" size={18} color="#4caf50" />
          <Text style={styles.actionButtonText}>Öğün Ekle</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 8,
  },
  settingsButton: {
    padding: 4,
  },
  mainCircleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleMainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  circleSubText: {
    fontSize: 12,
    color: '#666',
  },
  circleUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  remainingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  macrosContainer: {
    marginBottom: 16,
  },
  macroRow: {
    marginBottom: 12,
  },
  macroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  macroName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  macroProgress: {
    marginLeft: 28,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
  },
  macroValues: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  waterContainer: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  waterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  waterProgress: {
    marginLeft: 28,
  },
  waterValues: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
});
