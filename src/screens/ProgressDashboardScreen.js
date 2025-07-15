import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const mockWeightData = [
  { date: '2024-06-01', weight: 80 },
  { date: '2024-06-10', weight: 78.5 },
  { date: '2024-06-20', weight: 77.8 },
];

const mockMeasurements = [
  { type: 'Bel', value: 85, date: '2024-06-01' },
  { type: 'Kol', value: 34, date: '2024-06-01' },
  { type: 'Bel', value: 83, date: '2024-06-20' },
];

const mockPhotos = [
  { uri: 'https://via.placeholder.com/80x100', date: '2024-06-01' },
  { uri: 'https://via.placeholder.com/80x100', date: '2024-06-20' },
];

export default function ProgressDashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>İlerleme</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kilo Değişimi</Text>
        <FlatList
          data={mockWeightData}
          keyExtractor={item => item.date}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.weightCard}>
              <Text style={styles.weightValue}>{item.weight} kg</Text>
              <Text style={styles.weightDate}>{item.date}</Text>
            </View>
          )}
          style={{ marginVertical: 8 }}
        />
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddWeight')}>
          <Text style={styles.addBtnText}>+ Kilo Ekle</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vücut Ölçüleri</Text>
        <FlatList
          data={mockMeasurements}
          keyExtractor={item => item.type + item.date}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.measureCard}>
              <Text style={styles.measureType}>{item.type}</Text>
              <Text style={styles.measureValue}>{item.value} cm</Text>
              <Text style={styles.measureDate}>{item.date}</Text>
            </View>
          )}
          style={{ marginVertical: 8 }}
        />
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddMeasurement')}>
          <Text style={styles.addBtnText}>+ Ölçü Ekle</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fotoğraarla İlerleme</Text>
        <FlatList
          data={mockPhotos}
          keyExtractor={item => item.date}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.photoCard}>
              <Image source={{ uri: item.uri }} style={styles.photo} />
              <Text style={styles.photoDate}>{item.date}</Text>
            </View>
          )}
          style={{ marginVertical: 8 }}
        />
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('PhotoProgress')}>
          <Text style={styles.addBtnText}>+ Fotoğraf Ekle</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('ProgressHistory')}>
        <Text style={styles.historyBtnText}>Detaylı Geçmiş</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 18, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  weightCard: { backgroundColor: '#e3f2fd', borderRadius: 8, padding: 12, marginRight: 10, alignItems: 'center' },
  weightValue: { fontSize: 20, fontWeight: 'bold' },
  weightDate: { fontSize: 12, color: '#666' },
  measureCard: { backgroundColor: '#e8f5e9', borderRadius: 8, padding: 12, marginRight: 10, alignItems: 'center' },
  measureType: { fontSize: 16, fontWeight: 'bold' },
  measureValue: { fontSize: 18, color: '#388e3c' },
  measureDate: { fontSize: 12, color: '#666' },
  photoCard: { alignItems: 'center', marginRight: 10 },
  photo: { width: 80, height: 100, borderRadius: 8, backgroundColor: '#eee' },
  photoDate: { fontSize: 12, color: '#666', marginTop: 4 },
  addBtn: { backgroundColor: '#2196f3', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start', marginTop: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  historyBtn: { backgroundColor: '#4caf50', borderRadius: 25, paddingVertical: 14, marginTop: 10 },
  historyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
}); 