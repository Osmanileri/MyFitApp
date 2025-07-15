import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Avatar, Surface, ProgressBar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function WorkoutScreen() {
  const navigation = useNavigation();
  // Örnek veriler
  const weeklyWorkouts = 4;
  const goalWorkouts = 5;
  const lastWorkouts = [
    { name: 'Push Day', date: '02.07.2025', duration: 60, calories: 400, icon: 'arm-flex' },
    { name: 'Leg Day', date: '30.06.2025', duration: 50, calories: 350, icon: 'run' },
    { name: 'Cardio', date: '28.06.2025', duration: 40, calories: 300, icon: 'heart-pulse' },
  ];

  return (
    <LinearGradient colors={['#fceabb', '#fff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Antrenman Takibi</Text>
        <Surface style={styles.summaryBox} elevation={4}>
          <Text style={styles.summaryLabel}>Haftalık Antrenman</Text>
          <Text style={styles.summaryValue}>{weeklyWorkouts}/{goalWorkouts}</Text>
          <ProgressBar progress={weeklyWorkouts / goalWorkouts} color="#ff9800" style={styles.progressBar} />
        </Surface>
        <Text style={styles.sectionTitle}>Son Antrenmanlar</Text>
        {lastWorkouts.map(w => (
          <Card key={w.name + w.date} style={styles.workoutCard} elevation={3}>
            <Card.Title
              title={w.name}
              subtitle={w.date + ' | ' + w.duration + ' dk'}
              left={props => <Avatar.Icon {...props} icon={w.icon} style={{ backgroundColor: '#ffe0b2' }} />}
            />
            <Card.Content>
              <View style={styles.infoRow}>
                <Chip icon="fire" style={styles.chip} textStyle={{ color: '#ff9800', fontWeight: 'bold' }}>{w.calories} kcal</Chip>
                <Chip icon="timer" style={styles.chip} textStyle={{ color: '#42a5f5', fontWeight: 'bold' }}>{w.duration} dk</Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
        <Button mode="contained" style={styles.addButton} icon="plus" onPress={() => navigation.navigate('StartWorkout')}>
          Antrenman Ekle
        </Button>
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
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryBox: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    marginTop: 8,
  },
  workoutCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fafafa',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  chip: {
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#fff3e0',
    height: 32,
    alignItems: 'center',
  },
  addButton: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#ff9800',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    elevation: 2,
  },
}); 