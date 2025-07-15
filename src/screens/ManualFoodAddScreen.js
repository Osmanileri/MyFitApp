import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';

export default function ManualFoodAddScreen({ navigation: propNavigation }) {
  const navigation = propNavigation || useNavigation();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carb, setCarb] = useState('');
  const [fat, setFat] = useState('');

  return (
    <LinearGradient colors={['#fffde7', '#fff']} style={styles.gradient}>
      <View style={{ flex: 1 }}>
        <BackButton />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Manuel Yiyecek Ekle</Text>
          <Surface style={styles.formBox} elevation={3}>
            <Avatar.Icon icon="plus" size={48} style={{ backgroundColor: '#fbc02d', alignSelf: 'center' }} />
            <TextInput
              label="Yiyecek Adı"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                label="Miktar"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 8 }]}
              />
              <TextInput
                label="Birim"
                value={unit}
                onChangeText={setUnit}
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            <TextInput
              label="Kalori (kcal)"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                label="Protein (g)"
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 8 }]}
              />
              <TextInput
                label="Karb. (g)"
                value={carb}
                onChangeText={setCarb}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 8 }]}
              />
              <TextInput
                label="Yağ (g)"
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            <Button mode="contained" style={styles.addButton} icon="plus" onPress={() => { Alert.alert('Başarılı', 'Yiyecek eklendi!'); navigation.goBack(); }}>
              Ekle
            </Button>
          </Surface>
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
    color: '#fbc02d',
    marginBottom: 16,
    textAlign: 'center',
  },
  formBox: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fffde7',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#fbc02d',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    elevation: 2,
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