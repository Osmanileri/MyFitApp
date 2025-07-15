import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import LocalAnimationService from '../services/localAnimationService';

export default function LottieTest() {
  const [animations, setAnimations] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnimationStats();
  }, []);

  const loadAnimationStats = () => {
    const readyAnimations = LocalAnimationService.getReadyAnimations();
    setAnimations(readyAnimations);
    
    // Toplam boyut hesapla
    const estimated = readyAnimations.reduce((total, anim) => {
      const size = parseInt(anim.fileSize.replace('KB', '')) || 15;
      return total + size;
    }, 0);
    setTotalSize(estimated);
  };

  const testLottieSystem = async () => {
    setLoading(true);
    try {
      console.log('🎨 Lottie sistem test başlatıldı...');
      
      LocalAnimationService.listAllAnimations();
      const sizeInfo = LocalAnimationService.getTotalSize();
      
      Alert.alert(
        '🎨 Lottie Sistem Raporu',
        `📊 Hazır Animasyonlar: ${animations.length}/5
💾 Toplam Boyut: ${totalSize}KB (~${Math.round(totalSize/1024)}MB)
🚀 Video Karşılaştırması: ${Math.round((98 * animations.length) / totalSize)}x daha küçük!

🎯 Lottie Avantajları:
✅ Vektör kalitesi (sonsuz zoom)
✅ Ultra küçük dosya boyutu
✅ Profesyonel After Effects kalitesi
✅ Her ekran boyutunda crisp
✅ Renk/tema özelleştirmesi`,
        [
          { text: 'Anladım' },
          { text: 'Lottie Kaynakları', onPress: showLottieSources }
        ]
      );
      
    } catch (error) {
      console.error('Test hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const showLottieSources = () => {
    Alert.alert(
      '🎨 Ücretsiz Lottie Kaynakları',
      `1️⃣ LottieFiles.com
   • 100,000+ ücretsiz animasyon
   • Fitness/Egzersiz kategorisi
   • JSON formatında indirme

2️⃣ IconScout Lottie
   • Fitness animasyonları
   • Yüksek kalite

3️⃣ Figma Community
   • Ücretsiz Lottie paketleri
   • Egzersiz animasyonları

4️⃣ After Effects
   • Özel animasyon yapımı
   • Bodymovin plugin ile export`,
      [
        { text: 'Tamam' },
        { text: 'LottieFiles Aç', onPress: () => console.log('LottieFiles.com/featured/free adresini ziyaret edin') }
      ]
    );
  };

  const addSampleLottie = () => {
    Alert.alert(
      '🎨 Lottie Dosyası Ekleme',
             `Adımlar:
1️⃣ LottieFiles.com'dan JSON indirin
2️⃣ assets/lottie/ klasörüne koyun
3️⃣ LocalAnimationService'e ekleyin:

// Önce require() ile import edin:
const benchPressLottie = require('../../assets/lottie/bench-press.json');

// Sonra service'e ekleyin:
LocalAnimationService.addLottieAnimation(
  'Bench Press', 
  benchPressLottie,
  { fileSize: '15KB' }
);

🎯 Örnek dosya: bench-press.json (15KB)
📁 Konum: assets/lottie/bench-press.json

⚠️ Not: require() statik path gerektirir!`,
      [{ text: 'Anladım' }]
    );
  };

  const AnimationCard = ({ animation }) => (
    <View style={[styles.card, animation.isReady ? styles.readyCard : styles.comingSoonCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{animation.name}</Text>
        <View style={[styles.typeBadge, 
          animation.type === 'lottie' ? styles.lottieBadge : styles.videoBadge
        ]}>
          <Text style={styles.badgeText}>
            {animation.type === 'lottie' ? '🎨 LOTTIE' : '📹 VIDEO'}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.sizeText}>Boyut: {animation.fileSize}</Text>
        <Text style={styles.priorityText}>Öncelik: {animation.priority}</Text>
        <Text style={[styles.statusText, 
          animation.isReady ? styles.readyText : styles.comingSoonText
        ]}>
          {animation.isReady ? '✅ Hazır' : '⏳ Yakında'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Lottie Animation System</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{animations.length}/5</Text>
          <Text style={styles.statLabel}>Animasyonlar</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalSize}KB</Text>
          <Text style={styles.statLabel}>Toplam Boyut</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.round((98 * 5) / (totalSize || 1))}x</Text>
          <Text style={styles.statLabel}>Daha Küçük</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={testLottieSystem}
          disabled={loading}
        >
          <MaterialCommunityIcons name="play-circle" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>
            {loading ? 'Test Ediliyor...' : 'Lottie Sistem Test'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={addSampleLottie}>
          <MaterialCommunityIcons name="plus-circle" size={20} color="#000000" />
          <Text style={styles.addButtonText}>Lottie Ekleme Rehberi</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.animationsList}>
        <Text style={styles.listTitle}>📋 Animasyon Durumu</Text>
        {animations.map((animation, index) => (
          <AnimationCard key={index} animation={animation} />
        ))}
        
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>📊 Video vs Lottie Karşılaştırması</Text>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonItem}>📹 5 Video: ~490KB</Text>
            <Text style={styles.comparisonItem}>🎨 5 Lottie: ~{totalSize}KB</Text>
          </View>
          <Text style={styles.comparisonResult}>
            🚀 Tasarruf: {Math.round(((490 - totalSize) / 490) * 100)}%
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  animationsList: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  readyCard: {
    borderColor: '#4CAF50',
  },
  comingSoonCard: {
    borderColor: '#FF9800',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lottieBadge: {
    backgroundColor: '#FF6B35',
  },
  videoBadge: {
    backgroundColor: '#E91E63',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardContent: {
    gap: 4,
  },
  sizeText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  priorityText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  readyText: {
    color: '#4CAF50',
  },
  comingSoonText: {
    color: '#FF9800',
  },
  comparisonCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  comparisonItem: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  comparisonResult: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
}); 