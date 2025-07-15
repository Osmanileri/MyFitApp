import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const mockReminders = [
  { id: '1', name: 'Antrenman', time: '08:00', frequency: 'Her Gün', active: true },
  { id: '2', name: 'Su İç', time: '10:00', frequency: 'Her Gün', active: true },
  { id: '3', name: 'Kahvaltı', time: '07:30', frequency: 'Hafta İçi', active: false },
];

export default function RemindersListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hatırlatıcılar</Text>
      <FlatList
        data={mockReminders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderCard}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderName}>{item.name}</Text>
              <Text style={styles.reminderTime}>{item.time}</Text>
              <Text style={styles.reminderFrequency}>{item.frequency}</Text>
            </View>
            <View style={styles.reminderActions}>
              <TouchableOpacity style={styles.toggleBtn} onPress={() => Alert.alert('Hatırlatıcı', 'Bu özellik yakında eklenecek!')}>
                <Text style={styles.toggleText}>{item.active ? 'Aktif' : 'Pasif'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('AddEditReminder', { reminderId: item.id })}>
                <Text style={styles.editBtnText}>Düzenle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ marginVertical: 16 }}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddEditReminder')}>
        <Text style={styles.addBtnText}>+ Yeni Hatırlatıcı Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  reminderCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', justifyContent: 'space-between' },
  reminderInfo: { flex: 1 },
  reminderName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  reminderTime: { fontSize: 16, color: '#666', marginBottom: 2 },
  reminderFrequency: { fontSize: 14, color: '#888' },
  reminderActions: { alignItems: 'flex-end' },
  toggleBtn: { backgroundColor: '#4caf50', borderRadius: 15, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 8 },
  toggleText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  editBtn: { backgroundColor: '#2196f3', borderRadius: 15, paddingVertical: 6, paddingHorizontal: 12 },
  editBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  addBtn: { backgroundColor: '#4caf50', borderRadius: 25, paddingVertical: 14, marginTop: 16 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
}); 