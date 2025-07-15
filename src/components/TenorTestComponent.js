import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import LocalAnimationService from '../services/localAnimationService';

export default function TenorTestComponent() {
  const [animations, setAnimations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Test yerel animasyon sistemi
  const testLocalAnimationSystem = () => {
    Alert.alert(
      'Yerel Animasyon Sistemi Bilgisi',
      `🎬 Profesyonel Animasyon Sistemi Aktif!\n\n✅ Bench Press: bench-press.mp4\n📂 Konum: assets/ klasörü\n🔧 Tip: Video/Lottie/GIF Hybrid\n\n💡 Desteklenen Formatlar:\n🎥 Video (MP4) - Ana format\n🎨 Lottie - Vektör animasyonlar\n🖼️ GIF - Fallback\n\n🎯 API Key gerektirmiyor!`,
      [
        { text: 'Anladım' },
        { text: 'Animasyon Listesini Gör', onPress: () => {
          // Mevcut animasyonları listele
          LocalAnimationService.listAllAnimations();
          Alert.alert('Animasyon Listesi', 'Konsol\'da listeyi kontrol edin! 📋');
        }}
      ]
    );
  };

  const testLocalAnimationAPI = async () => {
    try {
      setLoading(true);
      
      console.log('🧪 Starting Local Animation Test (Profesyonel Sistem)...');
      
      // Bench Press animasyonunu test et
      const benchPressAnimation = await LocalAnimationService.getExerciseAnimation('Bench Press');
      
      if (!benchPressAnimation) {
        Alert.alert(
          'Test Başarısız ❌', 
          'Bench Press animasyonu bulunamadı.\n\nAssets klasöründe bench-press.mp4 dosyası olduğundan emin olun.'
        );
        return;
      }
      
      // Test için animasyon array'ına dönüştür
      setAnimations([benchPressAnimation]);
      
      Alert.alert(
        'Yerel Animasyon Test Başarılı! 🎉',
        `✅ Animasyon başarıyla yüklendi!\n\n📁 Dosya: bench-press.mp4\n🔧 Tip: ${benchPressAnimation.actualType || benchPressAnimation.type}\n📋 Başlık: "${benchPressAnimation.title}"\n🆔 ID: ${benchPressAnimation.id}\n📱 URI: ${benchPressAnimation.uri ? 'Hazır' : 'Yükleniyor'}\n\n💡 100% Yerel Sistem!`,
        [{ text: 'Animasyonu Gör', onPress: () => setShowModal(true) }]
      );
      
      setShowModal(true);
      
    } catch (error) {
      console.error('❌ Test error:', error);
      Alert.alert('Hata', `Test hatası: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderAnimation = ({ item }) => {
    const isVideo = item.actualType === 'video' || item.type === 'video';
    const isLottie = item.actualType === 'lottie' || item.type === 'lottie';
    const isGif = item.actualType === 'gif' || item.type === 'gif';
    
    return (
      <View style={[styles.animationCard, styles.localAnimationCard]}>
        <View style={styles.animationContainer}>
          {isVideo && item.uri ? (
            <Video
              source={{ uri: item.uri }}
              style={styles.animationVideo}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
              isLooping={true}
              isMuted={true}
            />
          ) : isGif ? (
            <Image
              source={item.source}
              style={styles.animationImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.animationPlaceholder}>
              <MaterialCommunityIcons 
                name={isLottie ? 'play-circle' : 'play'} 
                size={48} 
                color="#666" 
              />
            </View>
          )}
        </View>
        <View style={styles.animationInfo}>
          <View style={[styles.typeBadge, 
            isVideo ? styles.videoBadge : 
            isLottie ? styles.lottieBadge : styles.gifBadge
          ]}>
            <Text style={styles.typeBadgeText}>
              {isVideo ? '🎥 VIDEO' : isLottie ? '🎨 LOTTIE' : '🖼️ GIF'}
            </Text>
          </View>
          <Text style={styles.animationTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.animationDetails}>
            ID: {item.id} • {item.width}×{item.height} • YEREL
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.testButton, loading && styles.testButtonDisabled]}
        onPress={testLocalAnimationAPI}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <MaterialCommunityIcons name="play-circle" size={20} color="#FFFFFF" />
        )}
        <Text style={styles.testButtonText}>
          {loading ? 'Test Ediliyor...' : 'Yerel Animasyon Test Et'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.testButton, styles.systemTestButton]}
        onPress={testLocalAnimationSystem}
      >
        <MaterialCommunityIcons name="information" size={20} color="#000000" />
        <Text style={[styles.testButtonText, styles.systemTestButtonText]}>
          Animasyon Sistemi Bilgisi
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yerel Animasyon Test Sonuçları</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.resultText}>
            ✅ {animations.length} animasyon yerel olarak yüklendi (Profesyonel Sistem!)
          </Text>
          
          <FlatList
            data={animations}
            renderItem={renderAnimation}
            keyExtractor={(item) => item.id}
            numColumns={1}
            contentContainerStyle={styles.animationsList}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    gap: 8,
  },
  testButton: {
    backgroundColor: '#FFC107',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  urlTestButton: {
    backgroundColor: '#E0E0E0',
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 8,
  },
  urlTestButtonText: {
    color: '#000000',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    margin: 20,
    fontWeight: '600',
  },
  gifsList: {
    padding: 10,
  },
  gifCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gifImage: {
    width: '100%',
    height: 120,
  },
  gifInfo: {
    padding: 8,
  },
  gifTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  gifSize: {
    fontSize: 10,
    color: '#B0B0B0',
  },
  manualGifCard: {
    borderWidth: 2,
    borderColor: '#FFC107',
    backgroundColor: '#2A2A2A',
  },
  manualBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFC107',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  manualBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  localGifCard: {
    borderWidth: 3,
    borderColor: '#4CAF50',
    backgroundColor: '#1B5E20',
  },
  localBadge: {
    backgroundColor: '#4CAF50',
  },
  animationCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    overflow: 'hidden',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationVideo: {
    width: '100%',
    height: '100%',
  },
  animationImage: {
    width: '100%',
    height: '100%',
  },
  animationPlaceholder: {
    width: 96,
    height: 96,
    backgroundColor: '#333',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationInfo: {
    padding: 8,
  },
  typeBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFC107',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  typeBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  videoBadge: {
    backgroundColor: '#FFC107',
  },
  lottieBadge: {
    backgroundColor: '#FFC107',
  },
  gifBadge: {
    backgroundColor: '#FFC107',
  },
  animationsList: {
    padding: 10,
  },
  animationTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  animationDetails: {
    fontSize: 10,
    color: '#B0B0B0',
  },
  systemTestButton: {
    backgroundColor: '#E0E0E0',
  },
  systemTestButtonText: {
    color: '#000000',
  },
}); 