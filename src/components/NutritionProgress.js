import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../theme/appTheme';

export default function NutritionProgress({ current, goals }) {
  const getProgressPercentage = (current, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const nutrients = [
    {
      key: 'protein',
      name: 'Protein',
      current: current.protein || 0,
      target: goals.protein || 0,
      unit: 'g',
      color: Colors.primary,
    },
    {
      key: 'carbs',
      name: 'Karbonhidrat',
      current: current.carbs || 0,
      target: goals.carbs || 0,
      unit: 'g',
      color: Colors.warning,
    },
    {
      key: 'fat',
      name: 'Yağ',
      current: current.fat || 0,
      target: goals.fat || 0,
      unit: 'g',
      color: Colors.error,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.macroContainer}>
        {nutrients.map((nutrient) => {
          const percentage = getProgressPercentage(nutrient.current, nutrient.target);
          
          return (
            <View key={nutrient.key} style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>{nutrient.name}</Text>
                <Text style={styles.macroPercentage}>{Math.round(percentage)}%</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: nutrient.color,
                      },
                    ]}
                  />
                </View>
              </View>
              
              <View style={styles.macroValues}>
                <Text style={[styles.macroValue, { color: nutrient.color }]}>
                  {Math.round(nutrient.current)}{nutrient.unit}
                </Text>
                <Text style={styles.macroTarget}>
                  / {Math.round(nutrient.target)}{nutrient.unit}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  macroItem: {
    flex: 1,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  macroPercentage: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  macroTarget: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
});
