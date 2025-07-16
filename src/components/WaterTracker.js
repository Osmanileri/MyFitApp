import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/appTheme';

const WaterTracker = ({ current, goal, onAdd, onRemove }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const glassCount = Math.floor(current / 250); // 250ml per glass
  const remainingML = goal - current;

  const getWaterStatus = () => {
    if (percentage < 50) return { color: Colors.error, text: 'Az' };
    if (percentage < 80) return { color: Colors.warning, text: 'Orta' };
    if (percentage >= 100) return { color: Colors.success, text: 'Hedef!' };
    return { color: Colors.primary, text: 'İyi' };
  };

  const status = getWaterStatus();

  const renderWaterGlasses = () => {
    const glasses = [];
    const totalGlasses = Math.ceil(goal / 250);
    
    for (let i = 0; i < totalGlasses; i++) {
      const isFilled = i < glassCount;
      glasses.push(
        <View
          key={i}
          style={[
            styles.waterGlass,
            { backgroundColor: isFilled ? Colors.primary : Colors.background.tertiary }
          ]}
        >
          <Ionicons
            name="water"
            size={16}
            color={isFilled ? Colors.background.primary : Colors.text.secondary}
          />
        </View>
      );
    }
    
    return glasses;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="water" size={24} color={Colors.primary} />
          <Text style={styles.title}>Su Takibi</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.text}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.currentAmount}>
              {current.toLocaleString()} ml
            </Text>
            <Text style={styles.goalAmount}>
              / {goal.toLocaleString()} ml
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${percentage}%`,
                  backgroundColor: status.color 
                }
              ]} 
            />
          </View>
          
          <Text style={styles.percentageText}>
            {Math.round(percentage)}% tamamlandı
          </Text>
        </View>

        <View style={styles.glassesContainer}>
          <Text style={styles.glassesTitle}>Bardaklar ({glassCount}/{Math.ceil(goal / 250)})</Text>
          <View style={styles.glassesGrid}>
            {renderWaterGlasses()}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={onRemove}
            disabled={current <= 0}
          >
            <Ionicons 
              name="remove" 
              size={24} 
              color={current <= 0 ? Colors.text.secondary : Colors.error} 
            />
          </TouchableOpacity>

          <View style={styles.actionInfo}>
            <Text style={styles.actionText}>250ml</Text>
            <Text style={styles.actionSubtext}>
              {remainingML > 0 
                ? `${remainingML}ml kaldı` 
                : 'Hedef tamamlandı!'
              }
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={onAdd}
          >
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {percentage >= 100 && (
          <View style={styles.congratulations}>
            <Ionicons name="trophy" size={24} color={Colors.success} />
            <Text style={styles.congratulationsText}>
              Tebrikler! Günlük su hedefinizi tamamladınız! 🎉
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    margin: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.primary,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 12,
  },
  currentAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  goalAmount: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  glassesContainer: {
    marginBottom: 20,
  },
  glassesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  glassesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  waterGlass: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  addButton: {
    backgroundColor: Colors.background.primary,
    borderColor: Colors.primary,
  },
  removeButton: {
    backgroundColor: Colors.background.primary,
    borderColor: Colors.error,
  },
  actionInfo: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  actionSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  congratulations: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  congratulationsText: {
    fontSize: 14,
    color: Colors.success,
    marginLeft: 8,
    flex: 1,
  },
});

export default WaterTracker; 