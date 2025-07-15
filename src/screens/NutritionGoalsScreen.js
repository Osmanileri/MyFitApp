import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  TextInput, 
  Switch, 
  Divider,
  Avatar,
  Surface,
  Portal,
  Modal
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDietStore } from '../store/dietStore';
import { useUserStore } from '../store/userStore';
import BackButton from '../components/BackButton';

export default function NutritionGoalsScreen({ navigation }) {
  const {
    nutritionGoals,
    updateNutritionGoals,
    generateSmartGoals,
    loadNutritionGoals
  } = useDietStore();
  
  const { userProfile } = useUserStore();

  const [goals, setGoals] = useState(nutritionGoals);
  const [showSmartModal, setShowSmartModal] = useState(false);
  const [smartGoals, setSmartGoals] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadNutritionGoals();
  }, []);

  useEffect(() => {
    setGoals(nutritionGoals);
  }, [nutritionGoals]);

  const handleSaveGoals = async () => {
    try {
      await updateNutritionGoals(goals);
      setIsEditing(false);
      Alert.alert('Başarılı', 'Hedefleriniz güncellendi!');
    } catch (error) {
      Alert.alert('Hata', 'Hedefler güncellenirken bir hata oluştu.');
    }
  };

  const handleGenerateSmartGoals = () => {
    if (!userProfile.weight || !userProfile.height || !userProfile.age) {
      Alert.alert(
        'Eksik Bilgi',
        'Akıllı hedef oluşturmak için profil bilgilerinizi tamamlamalısınız.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Profile Git', onPress: () => navigation.navigate('Profile') }
        ]
      );
      return;
    }

    const generated = generateSmartGoals(userProfile);
    setSmartGoals(generated);
    setShowSmartModal(true);
  };

  const handleApplySmartGoals = async () => {
    if (smartGoals) {
      setGoals(smartGoals);
      await updateNutritionGoals(smartGoals);
      setShowSmartModal(false);
      Alert.alert('Başarılı', 'Akıllı hedefler uygulandı!');
    }
  };

  const updateGoal = (key, value) => {
    const numValue = parseFloat(value) || 0;
    setGoals(prev => ({ ...prev, [key]: numValue }));
  };

  const goalCards = [
    {
      key: 'calories',
      title: 'Günlük Kalori',
      unit: 'kcal',
      icon: 'fire',
      color: '#ff5722',
      description: 'Günlük kalori hedefiniz'
    },
    {
      key: 'protein',
      title: 'Protein',
      unit: 'g',
      icon: 'dumbbell',
      color: '#1976d2',
      description: 'Günlük protein hedefiniz'
    },
    {
      key: 'carbs',
      title: 'Karbonhidrat',
      unit: 'g',
      icon: 'grain',
      color: '#388e3c',
      description: 'Günlük karbonhidrat hedefiniz'
    },
    {
      key: 'fat',
      title: 'Yağ',
      unit: 'g',
      icon: 'water-outline',
      color: '#fbc02d',
      description: 'Günlük yağ hedefiniz'
    },
    {
      key: 'water',
      title: 'Su',
      unit: 'L',
      icon: 'cup-water',
      color: '#00bcd4',
      description: 'Günlük su hedefiniz'
    }
  ];

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Surface style={styles.header} elevation={2}>
          <Avatar.Icon 
            icon="target" 
            size={50} 
            style={{ backgroundColor: '#4caf50' }} 
          />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Beslenme Hedefleri</Text>
            <Text style={styles.headerSubtitle}>
              Günlük beslenme hedeflerinizi belirleyin
            </Text>
          </View>
        </Surface>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              icon="lightbulb-outline"
              onPress={handleGenerateSmartGoals}
              style={styles.actionButton}
            >
              Akıllı Hedef
            </Button>
            <Button
              mode={isEditing ? "contained" : "outlined"}
              icon={isEditing ? "check" : "pencil"}
              onPress={isEditing ? handleSaveGoals : () => setIsEditing(true)}
              style={styles.actionButton}
            >
              {isEditing ? 'Kaydet' : 'Düzenle'}
            </Button>
          </View>
        </Card>

        {/* Goals List */}
        {goalCards.map((goal) => (
          <Card key={goal.key} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalInfo}>
                <Avatar.Icon
                  icon={goal.icon}
                  size={40}
                  style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}
                  color={goal.color}
                />
                <View style={styles.goalDetails}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
              </View>
              <View style={styles.goalValueContainer}>
                {isEditing ? (
                  <TextInput
                    mode="outlined"
                    value={goals[goal.key]?.toString() || '0'}
                    onChangeText={(value) => updateGoal(goal.key, value)}
                    keyboardType="numeric"
                    style={styles.goalInput}
                    dense
                  />
                ) : (
                  <Text style={[styles.goalValue, { color: goal.color }]}>
                    {goals[goal.key] || 0}
                  </Text>
                )}
                <Text style={styles.goalUnit}>{goal.unit}</Text>
              </View>
            </View>
          </Card>
        ))}

        {/* Macro Distribution */}
        {!isEditing && (
          <Card style={styles.distributionCard}>
            <Text style={styles.distributionTitle}>Makro Dağılımı</Text>
            <View style={styles.distributionContainer}>
              {['protein', 'carbs', 'fat'].map((macro) => {
                const calories = macro === 'protein' ? goals[macro] * 4 : 
                               macro === 'carbs' ? goals[macro] * 4 : 
                               goals[macro] * 9;
                const percentage = ((calories / goals.calories) * 100).toFixed(1);
                const colors = {
                  protein: '#1976d2',
                  carbs: '#388e3c',
                  fat: '#fbc02d'
                };
                
                return (
                  <View key={macro} style={styles.macroItem}>
                    <View style={[styles.macroColor, { backgroundColor: colors[macro] }]} />
                    <Text style={styles.macroName}>
                      {macro === 'protein' ? 'Protein' : 
                       macro === 'carbs' ? 'Karbonhidrat' : 'Yağ'}
                    </Text>
                    <Text style={styles.macroPercentage}>{percentage}%</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Smart Goals Modal */}
      <Portal>
        <Modal
          visible={showSmartModal}
          onDismiss={() => setShowSmartModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Akıllı Hedef Önerisi</Text>
          <Text style={styles.modalSubtitle}>
            Profil bilgilerinize göre önerilen hedefler:
          </Text>
          
          {smartGoals && (
            <View style={styles.smartGoalsContainer}>
              {goalCards.map((goal) => (
                <View key={goal.key} style={styles.smartGoalItem}>
                  <MaterialCommunityIcons 
                    name={goal.icon} 
                    size={20} 
                    color={goal.color} 
                  />
                  <Text style={styles.smartGoalName}>{goal.title}</Text>
                  <Text style={styles.smartGoalValue}>
                    {smartGoals[goal.key]} {goal.unit}
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowSmartModal(false)}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleApplySmartGoals}
              style={styles.modalButton}
            >
              Uygula
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  goalCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    marginRight: 12,
  },
  goalDetails: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  goalDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  goalValueContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  goalInput: {
    width: 80,
    height: 40,
  },
  goalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 4,
  },
  goalUnit: {
    fontSize: 14,
    color: '#666',
  },
  distributionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  distributionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  distributionContainer: {
    gap: 8,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  macroColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  macroName: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  macroPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  smartGoalsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  smartGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  smartGoalName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#444',
  },
  smartGoalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
