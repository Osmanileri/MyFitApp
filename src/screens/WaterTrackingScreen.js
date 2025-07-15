import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Surface, TextInput, ProgressBar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function WaterTrackingScreen() {
  const navigation = useNavigation();
  const [waterGoal, setWaterGoal] = useState(2500); // ml
  const [waterDrank, setWaterDrank] = useState(1700); // ml
  const [manual, setManual] = useState('');
  const [history, setHistory] = useState([
    { date: '02.07.2025', amount: 1700 },
    { date: '01.07.2025', amount: 2200 },
    { date: '30.06.2025', amount: 2000 },
  ]);

  const addWater = (amount) => {
    setWaterDrank(prev => prev + amount);
  };
  const addManual = () => {
    const val = parseInt(manual);
    if (!isNaN(val) && val > 0) {
      addWater(val);
      setManual('');
    }
  };

  return (
    <LinearGradient colors={['#e3f2fd', '#fff']} style={styles.gradient}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backBtnCircle}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#222" />
          </View>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Su Takibi</Text>
          <Surface style={styles.summaryBox} elevation={4}>
            <MaterialCommunityIcons name="cup-water" size={48} color="#2196f3" style={{ alignSelf: 'center' }} />
            <Text style={styles.waterText}>{(waterDrank / 1000).toFixed(2)} / {(waterGoal / 1000).toFixed(2)} L</Text>
            <ProgressBar progress={waterDrank / waterGoal} color="#2196f3" style={styles.progressBar} />
            <View style={styles.quickRow}>
              <Button mode="outlined" style={styles.quickBtn} onPress={() => addWater(250)}>+250 ml</Button>
              <Button mode="outlined" style={styles.quickBtn} onPress={() => addWater(500)}>+500 ml</Button>
              <Button mode="outlined" style={styles.quickBtn} onPress={() => addWater(1000)}>+1 L</Button>
            </View>
            <View style={styles.manualRow}>
              <TextInput
                label="Manuel ekle (ml)"
                value={manual}
                onChangeText={setManual}
                keyboardType="numeric"
                style={styles.manualInput}
              />
              <Button mode="contained" style={styles.manualBtn} onPress={addManual}>Ekle</Button>
            </View>
          </Surface>
          <Text style={styles.sectionTitle}>Geçmiş</Text>
          {history.map(h => (
            <Surface key={h.date} style={styles.historyBox} elevation={2}>
              <Text style={styles.historyDate}>{h.date}</Text>
              <Chip icon="cup-water" style={styles.historyChip}>{(h.amount / 1000).toFixed(2)} L</Chip>
            </Surface>
          ))}
        </ScrollView>
      </View>
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
    color: '#2196f3',
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
  waterText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  quickBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    borderColor: '#2196f3',
  },
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  manualInput: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#e3f2fd',
  },
  manualBtn: {
    borderRadius: 8,
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    marginTop: 8,
  },
  historyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    padding: 12,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 15,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  historyChip: {
    backgroundColor: '#fff',
    color: '#2196f3',
    fontWeight: 'bold',
    height: 32,
  },
  backBtn: {
    position: 'absolute',
    top: 28,
    left: 16,
    zIndex: 10,
    elevation: 10,
  },
  backBtnCircle: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
}); 