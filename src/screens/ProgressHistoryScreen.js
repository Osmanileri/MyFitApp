import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const mockWeightHistory = [
  { date: '2024-06-01', weight: 80 },
  { date: '2024-06-10', weight: 78.5 },
  { date: '2024-06-20', weight: 77.8 },
];

const mockMeasurementHistory = [
  { type: 'Bel', value: 85, date: '2024-06-01' },
  { type: 'Kol', value: 34, date: '2024-06-01' },
  { type: 'Bel', value: 83, date: '2024-06-20' },
];

export default function ProgressHistoryScreen({ navigation }) {
  const [tab, setTab] = useState('Kilo');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detaylı İlerleme</Text>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'Kilo' && styles.activeTab]} onPress={() => setTab('Kilo')}>
          <Text style={styles.tabText}>Kilo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'Ölçü' && styles.activeTab]} onPress={() => setTab('Ölçü')}>
          <Text style={styles.tabText}>Ölçüler</Text>
        </TouchableOpacity>
      </View>
      {tab === 'Kilo' ? (
        <FlatList
          data={mockWeightHistory}
          keyExtractor={item => item.date}
          renderItem={({ item, index }) => (
            <View style={styles.itemCard}>
              <Text style={styles.itemMain}>{item.weight} kg</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
              {index > 0 && (
                <Text style={styles.itemChange}>
                  {item.weight - mockWeightHistory[index - 1].weight > 0 ? '+' : ''}
                  {(item.weight - mockWeightHistory[index - 1].weight).toFixed(1)} kg
                </Text>
              )}
            </View>
          )}
        />
      ) : (
        <FlatList
          data={mockMeasurementHistory}
          keyExtractor={item => item.type + item.date}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Text style={styles.itemMain}>{item.type}: {item.value} cm</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  tabRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 24, backgroundColor: '#e0e0e0', borderRadius: 20, marginHorizontal: 8 },
  activeTab: { backgroundColor: '#4caf50' },
  tabText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  itemCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2, alignItems: 'center' },
  itemMain: { fontSize: 18, fontWeight: 'bold' },
  itemDate: { fontSize: 14, color: '#666', marginTop: 4 },
  itemChange: { fontSize: 14, color: '#2196f3', marginTop: 4 },
  backBtn: { backgroundColor: '#2196f3', borderRadius: 25, paddingVertical: 14, marginTop: 16 },
  backBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
}); 