import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton, HelperText } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const activityLevels = [
  { label: 'Hareketsiz', value: 'sedentary' },
  { label: 'Hafif Aktif', value: 'light' },
  { label: 'Orta Aktif', value: 'moderate' },
  { label: 'Çok Aktif', value: 'active' },
];
const goals = [
  { label: 'Kilo Verme', value: 'lose' },
  { label: 'Kas Kazanma', value: 'gain' },
  { label: 'Sağlıklı Yaşam', value: 'healthy' },
  { label: 'Formda Kalma', value: 'maintain' },
];

export default function ProfileSetupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('');
  const [goal, setGoal] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profilini Oluştur</Text>
      <TextInput
        label="Ad Soyad"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Yaş"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Cinsiyet</Text>
      <RadioButton.Group onValueChange={setGender} value={gender}>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Erkek" value="male" />
          <RadioButton.Item label="Kadın" value="female" />
          <RadioButton.Item label="Belirtmek İstemiyorum" value="other" />
        </View>
      </RadioButton.Group>
      <TextInput
        label="Boy (cm)"
        value={height}
        onChangeText={setHeight}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        label="Kilo (kg)"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Aktivite Seviyesi</Text>
      <RadioButton.Group onValueChange={setActivity} value={activity}>
        <View style={styles.radioRow}>
          {activityLevels.map(opt => (
            <RadioButton.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </View>
      </RadioButton.Group>
      <Text style={styles.label}>Hedef</Text>
      <RadioButton.Group onValueChange={setGoal} value={goal}>
        <View style={styles.radioRow}>
          {goals.map(opt => (
            <RadioButton.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </View>
      </RadioButton.Group>
      <Button mode="contained" style={styles.button} onPress={async () => {
        await AsyncStorage.setItem('profileComplete', 'true');
        navigation.replace('Main');
      }}>
        Kaydet
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f7f7f7',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
}); 