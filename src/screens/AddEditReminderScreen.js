import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const reminderTypes = ['Antrenman', 'Öğün', 'Su', 'Supplement', 'Diğer'];

export default function AddEditReminderScreen({ route, navigation }) {
  const { reminderId } = route.params || {};
  const [name, setName] = useState('');
  const [type, setType] = useState(reminderTypes[0]);
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState('Her Gün');
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{reminderId ? 'Hatırlatıcıyı Düzenle' : 'Yeni Hatırlatıcı'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Hatırlatıcı adı"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Hatırlatıcı türü"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Saat (HH:MM)"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Sıklık (Her Gün, Hafta İçi, vb.)"
        value={frequency}
        onChangeText={setFrequency}
      />
      <TextInput
        style={styles.input}
        placeholder="Hatırlatıcı mesajı (isteğe bağlı)"
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.saveBtnText}>Kaydet</Text>
      </TouchableOpacity>
      {reminderId && (
        <TouchableOpacity style={styles.deleteBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.deleteBtnText}>Hatırlatıcıyı Sil</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  saveBtn: { backgroundColor: '#4caf50', borderRadius: 25, paddingVertical: 14, marginTop: 8 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  deleteBtn: { backgroundColor: '#e53935', borderRadius: 25, paddingVertical: 14, marginTop: 16 },
  deleteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
}); 