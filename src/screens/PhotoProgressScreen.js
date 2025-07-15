import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import BackButton from '../components/BackButton';

const mockPhotos = [
  { uri: 'https://via.placeholder.com/120x160', date: '2024-06-01' },
  { uri: 'https://via.placeholder.com/120x160', date: '2024-06-10' },
  { uri: 'https://via.placeholder.com/120x160', date: '2024-06-20' },
];

export default function PhotoProgressScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>İlerleme Fotoğrafları</Text>
      <FlatList
        data={mockPhotos}
        keyExtractor={item => item.date}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.photoCard}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
            <Text style={styles.photoDate}>{item.date}</Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => Alert.alert('Sil', 'Bu özellik yakında eklenecek!')}>
              <Text style={styles.deleteBtnText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.photoList}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Fotoğraf Yükle', 'Bu özellik yakında eklenecek!')}>
        <Text style={styles.addBtnText}>+ Fotoğraf Yükle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  photoList: { alignItems: 'center' },
  photoCard: { backgroundColor: '#fff', borderRadius: 10, padding: 8, margin: 8, alignItems: 'center', elevation: 2 },
  photo: { width: 80, height: 100, borderRadius: 8, backgroundColor: '#eee' },
  photoDate: { fontSize: 12, color: '#666', marginTop: 4 },
  deleteBtn: { backgroundColor: '#e53935', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10, marginTop: 4 },
  deleteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  addBtn: { backgroundColor: '#2196f3', borderRadius: 20, paddingVertical: 12, marginTop: 16 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  backBtn: { backgroundColor: '#4caf50', borderRadius: 25, paddingVertical: 14, marginTop: 16 },
  backBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
}); 