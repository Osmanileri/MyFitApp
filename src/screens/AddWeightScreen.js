import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import BackButton from '../components/BackButton';

export default function AddWeightScreen({ navigation }) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('2024-06-20'); // Mock tarih
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Kilo Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="Kilonuz (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Tarih (YYYY-AA-GG)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Not (isteğe bağlı)"
        value={note}
        onChangeText={setNote}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={() => { Alert.alert('Başarılı', 'Kilo eklendi!'); navigation.goBack(); }}>
        <Text style={styles.saveBtnText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  saveBtn: { backgroundColor: '#4caf50', borderRadius: 25, paddingVertical: 14, marginTop: 8 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
}); 