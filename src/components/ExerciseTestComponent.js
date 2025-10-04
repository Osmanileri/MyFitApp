// 🧪 React Native Test Bileşeni - ExerciseAPI'yi test etmek için
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { testExerciseAPI, getMuscleGroupExercises, searchExercises } from '../services/testExerciseAPI';

const ExerciseTestComponent = () => {
  const [testResult, setTestResult] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sayfa yüklendiğinde API'yi test et
  useEffect(() => {
    handleTestAPI();
  }, []);

  // API test fonksiyonu
  const handleTestAPI = async () => {
    setLoading(true);
    try {
      console.log('🧪 API Test başlıyor...');
      const result = await testExerciseAPI();
      setTestResult(result);
      
      if (result.success) {
        Alert.alert('✅ Başarılı!', `${result.totalExercises} egzersiz yüklendi!`);
      } else {
        Alert.alert('❌ Hata!', result.error);
      }
    } catch (error) {
      console.error('Test hatası:', error);
      Alert.alert('❌ Test Hatası!', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Kas grubu egzersizlerini getir
  const handleGetMuscleGroupExercises = async (muscleGroup) => {
    setLoading(true);
    try {
      console.log(`💪 ${muscleGroup} egzersizleri alınıyor...`);
      const result = await getMuscleGroupExercises(muscleGroup);
      setExercises(result);
      
      Alert.alert('✅ Başarılı!', `${muscleGroup} için ${result.length} egzersiz bulundu!`);
    } catch (error) {
      console.error('Kas grubu hatası:', error);
      Alert.alert('❌ Hata!', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Egzersiz ara
  const handleSearchExercises = async (query) => {
    setLoading(true);
    try {
      console.log(`🔍 "${query}" araması yapılıyor...`);
      const result = await searchExercises(query);
      setExercises(result);
      
      Alert.alert('✅ Arama Tamamlandı!', `"${query}" için ${result.length} sonuç bulundu!`);
    } catch (error) {
      console.error('Arama hatası:', error);
      Alert.alert('❌ Arama Hatası!', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏋️‍♂️ Exercise API Test</Text>
      
      {/* Test Sonuçları */}
      {testResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>📊 Test Sonuçları:</Text>
          <Text style={styles.resultText}>
            ✅ Durum: {testResult.success ? 'Başarılı' : 'Başarısız'}
          </Text>
          {testResult.success && (
            <>
              <Text style={styles.resultText}>📈 Toplam Egzersiz: {testResult.totalExercises}</Text>
              <Text style={styles.resultText}>💪 Göğüs: {testResult.chestCount}</Text>
              <Text style={styles.resultText}>🦵 Bacak: {testResult.legCount}</Text>
              <Text style={styles.resultText}>🔙 Sırt: {testResult.backCount}</Text>
              <Text style={styles.resultText}>🌐 RapidAPI: {testResult.apiStatus?.rapidAPI?.status || 'Bilinmiyor'}</Text>
            </>
          )}
        </View>
      )}

      {/* Test Butonları */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleTestAPI}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Test Ediliyor...' : '🧪 API\'yi Test Et'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => handleGetMuscleGroupExercises('Göğüs')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>💪 Göğüs Egzersizleri</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => handleGetMuscleGroupExercises('Bacak')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🦵 Bacak Egzersizleri</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => handleGetMuscleGroupExercises('Sırt')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🔙 Sırt Egzersizleri</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.tertiaryButton]} 
          onPress={() => handleSearchExercises('press')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🔍 "Press" Ara</Text>
        </TouchableOpacity>
      </View>

      {/* Egzersiz Listesi */}
      {exercises.length > 0 && (
        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseTitle}>📋 Egzersizler ({exercises.length}):</Text>
          {exercises.slice(0, 10).map((exercise, index) => (
            <View key={exercise.id || index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseCategory}>Kategori: {exercise.category}</Text>
              <Text style={styles.exerciseEquipment}>Ekipman: {exercise.equipment}</Text>
              {/* WGER kaldırıldı */}
            </View>
          ))}
          {exercises.length > 10 && (
            <Text style={styles.moreText}>... ve {exercises.length - 10} tane daha</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  tertiaryButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  exerciseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  exerciseEquipment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  // WGER kaldırıldı - stil kullanılmıyor
  moreText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default ExerciseTestComponent;

// 🎯 KULLANIM:
// Bu bileşeni App.js'inize import edip kullanabilirsiniz:
//
// import ExerciseTestComponent from './src/components/ExerciseTestComponent';
//
// export default function App() {
//   return <ExerciseTestComponent />;
// }