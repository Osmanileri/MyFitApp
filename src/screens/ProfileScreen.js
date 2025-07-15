import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Avatar, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import TenorTestComponent from '../components/TenorTestComponent';

export default function ProfileScreen() {
  const navigation = useNavigation();
  // Örnek veriler
  const user = {
    name: 'Osman İleri',
    age: 25,
    gender: 'Erkek',
    height: 180,
    weight: 78,
    activity: 'Orta Aktif',
    goal: 'Kas Kazanma',
  };

  return (
    <LinearGradient colors={['#b2dfdb', '#fff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.profileBox} elevation={4}>
          <Avatar.Icon icon="account" size={64} style={{ backgroundColor: '#4CAF50', alignSelf: 'center' }} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.info}>{user.age} yaş • {user.gender}</Text>
        </Surface>
        <Card style={styles.infoCard} elevation={2}>
          <Card.Title title="Profil Bilgileri" left={props => <Avatar.Icon {...props} icon="information" style={{ backgroundColor: '#b2dfdb' }} />} />
          <Card.Content>
            <Text style={styles.detail}>Boy: <Text style={styles.bold}>{user.height} cm</Text></Text>
            <Text style={styles.detail}>Kilo: <Text style={styles.bold}>{user.weight} kg</Text></Text>
            <Text style={styles.detail}>Aktivite: <Text style={styles.bold}>{user.activity}</Text></Text>
            <Text style={styles.detail}>Hedef: <Text style={styles.bold}>{user.goal}</Text></Text>
          </Card.Content>
        </Card>
        
        {/* Development - Tenor API Test */}
        <Card style={styles.testCard} elevation={2}>
          <Card.Title 
            title="Geliştirici Araçları" 
            subtitle="Tenor API Test"
            left={props => <Avatar.Icon {...props} icon="api" style={{ backgroundColor: '#FFC107' }} />} 
          />
          <Card.Content>
            <Text style={styles.testDescription}>
              Egzersiz GIF'lerinin doğru çalışıp çalışmadığını test edin.
            </Text>
            <TenorTestComponent />
          </Card.Content>
        </Card>
        
        <Button mode="contained" style={styles.editButton} icon="pencil" onPress={() => navigation.navigate('ProfileSetup')}>
          Profili Düzenle
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
  profileBox: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  infoCard: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  editButton: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    elevation: 2,
  },
  testCard: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff9e6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  testDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
}); 