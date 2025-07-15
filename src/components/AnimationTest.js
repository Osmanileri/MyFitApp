import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import LocalAnimationService from '../services/localAnimationService';

export default function AnimationTest() {
  const [animation, setAnimation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAnimation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Animation test başlatılıyor...');
      
      // Mevcut animasyonları listele
      const availableAnimations = LocalAnimationService.listAllAnimations();
      console.log('📋 Mevcut animasyonlar:', availableAnimations);
      
      // Bench Press animasyonunu yükle
      const benchPressAnimation = await LocalAnimationService.getExerciseAnimation('Bench Press');
      
      if (benchPressAnimation) {
        setAnimation(benchPressAnimation);
        console.log('✅ Test başarılı! Animasyon yüklendi:', benchPressAnimation);
      } else {
        setError('Animasyon bulunamadı');
        console.log('❌ Test başarısız! Animasyon yüklenemedi');
      }
      
    } catch (err) {
      console.error('❌ Test hatası:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Animasyon Test</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={testAnimation}>
        <Text style={styles.buttonText}>
          {loading ? '⏳ Test Ediliyor...' : '🎬 Animasyon Test Et'}
        </Text>
      </TouchableOpacity>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Hata: {error}</Text>
        </View>
      )}
      
      {animation && (
        <View style={styles.animationContainer}>
          <Text style={styles.animationTitle}>
            ✅ {animation.title} ({animation.actualType})
          </Text>
          
          {animation.actualType === 'video' && animation.uri && (
            <Video
              source={{ uri: animation.uri }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
              isLooping={true}
              isMuted={true}
              onLoad={() => console.log('✅ Test video yüklendi')}
              onError={(error) => console.log('❌ Test video hatası:', error)}
            />
          )}
          
          <Text style={styles.animationInfo}>
            📱 URI: {animation.uri ? 'Mevcut' : 'Yok'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  animationContainer: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  animationTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  video: {
    width: 300,
    height: 200,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 10,
  },
  animationInfo: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
  },
}); 