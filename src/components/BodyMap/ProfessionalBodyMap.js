// 🏋️‍♂️ PROFESSIONAL MUSCLEWIKI CLONE - DÜZELTILMIŞ VERSİYON
// MuscleWiki.com'daki gibi tam profesyonel mask sistemi

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  Animated,
  Vibration
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Ana vücut görselleri
const frontBodyAsset = require('../../../assets/front_body.png');
const backBodyAsset = require('../../../assets/back_body.png');

// MuscleWiki tarzı mask dosyaları - TÜM DETAYLI PARÇALAR
const maskAssets = {
  // ÖN VÜCUT (FRONT) - TÜM MARK_ dosyaları
  front: {
    chest: require('../../../assets/mark_chest.png'),
    shoulders: require('../../../assets/mark_shoulder.png'),
    biceps: require('../../../assets/mark_biceps.png'),
    forearms: require('../../../assets/mark_forearms.png'),
    abdominals: require('../../../assets/mark_abdominals.png'),
    obliques: require('../../../assets/mark_oblique.png'),
    quads: require('../../../assets/mark_quads.png'),
    calves: require('../../../assets/mark_calves.png'),
    hands: require('../../../assets/mark_hands.png'),
    traps: require('../../../assets/mark_traps.png'),
  },

  // ARKA VÜCUT (BACK) - TÜM BACK_ dosyaları
  back: {
    shoulders: require('../../../assets/back_rear-shoulder.png'),
    triceps: require('../../../assets/back_triceps.png'),
    lats: require('../../../assets/back_lats.png'),
    traps_middle: require('../../../assets/back_traps-middle.png'),
    lowerback: require('../../../assets/back_lowerback.png'),
    traps: require('../../../assets/back_traps.png'),
    glutes: require('../../../assets/back_glutes.png'),
    hamstrings: require('../../../assets/back_hamstring.png'),
    forearms: require('../../../assets/back_forearms.png'),
    hands: require('../../../assets/back_hands.png'),
    calves: require('../../../assets/back_calf.png'),
  }
};


const BODY_WIDTH = screenWidth * 0.85;
const BODY_HEIGHT = screenHeight * 0.7;

// MuscleWiki tarzı kas grupları - GERÇEK KAS ŞEKİLLERİNE UYGUN BOUNDS
const muscleGroups = {
  front: {
    // GÖĞÜS - Daha küçük ve merkezi alan
    chest: {
      name: 'Göğüs',
      color: '#FF6B35',
      bounds: { left: 0.35, right: 0.65, top: 0.25, bottom: 0.40 },
      description: 'Göğüs kasları - itme hareketlerinin ana kaynağı',
      exercises: ['Bench Press', 'Push-up', 'Dumbbell Fly', 'Incline Press']
    },
    // OMUZLAR - Daha dar alan, sadece omuz başları
    shoulders: {
      name: 'Omuz',
      color: '#4ECDC4',
      bounds: { left: 0.15, right: 0.85, top: 0.15, bottom: 0.28 },
      description: 'Deltoid kasları - omuz hareketlerinin kontrolcüsü',
      exercises: ['Shoulder Press', 'Lateral Raise', 'Front Raise', 'Arnold Press']
    },
    // BICEPS - Sol ve sağ kol ayrı ayrı
    biceps: {
      name: 'Biceps',
      color: '#45B7D1',
      bounds: { left: 0.08, right: 0.92, top: 0.30, bottom: 0.45 },
      description: 'İki başlı pazı kası - kol bükme hareketleri',
      exercises: ['Bicep Curl', 'Hammer Curl', 'Chin-up', 'Preacher Curl']
    },
    // ÖNKOL - Daha dar ve uzun
    forearms: {
      name: 'Önkol',
      color: '#FECA57',
      bounds: { left: 0.05, right: 0.95, top: 0.45, bottom: 0.65 },
      description: 'Önkol kasları - kavrama gücü ve bilek kontrolü',
      exercises: ['Wrist Curl', 'Reverse Curl', 'Farmer Walk', 'Grip Squeeze']
    },
    // KARIN - Merkezi dar şerit
    abdominals: {
      name: 'Karın',
      color: '#FF6B35',
      bounds: { left: 0.40, right: 0.60, top: 0.40, bottom: 0.65 },
      description: 'Rectus abdominis - karın kaslarının ana bölümü',
      exercises: ['Crunch', 'Sit-up', 'Leg Raise', 'Plank']
    },
    // YAN KARINLAR - Karının yan tarafları
    obliques: {
      name: 'Yan Karınlar',
      color: '#FF8C42',
      bounds: { left: 0.28, right: 0.72, top: 0.42, bottom: 0.60 },
      description: 'Oblique kasları - yan karın ve rotasyon hareketleri',
      exercises: ['Side Plank', 'Russian Twist', 'Bicycle Crunch', 'Wood Chop']
    },
    // ÖN BACAK - Daha dar alan
    quads: {
      name: 'Ön Bacak',
      color: '#FD79A8',
      bounds: { left: 0.30, right: 0.70, top: 0.67, bottom: 0.88 },
      description: 'Quadriceps kasları - diz açma ve bacak güçlendirme',
      exercises: ['Squat', 'Lunge', 'Leg Press', 'Leg Extension']
    },
    // BALDIR - En alt kısım
    calves: {
      name: 'Baldır',
      color: '#E17055',
      bounds: { left: 0.35, right: 0.65, top: 0.85, bottom: 0.95 },
      description: 'Gastrocnemius ve soleus - ayak parmak ucu kalkma',
      exercises: ['Calf Raise', 'Jump Rope', 'Box Jump', 'Single Leg Raise']
    },
  },
  back: {
    // ARKA OMUZ
    shoulders: {
      name: 'Omuz (Arka)',
      color: '#4ECDC4',
      bounds: { left: 0.15, right: 0.85, top: 0.15, bottom: 0.28 },
      description: 'Arka deltoid - omuz stabilitesi ve duruş',
      exercises: ['Rear Delt Fly', 'Face Pull', 'Reverse Fly', 'Band Pull Apart']
    },
    // TRICEPS
    triceps: {
      name: 'Triceps',
      color: '#96CEB4',
      bounds: { left: 0.08, right: 0.92, top: 0.30, bottom: 0.45 },
      description: 'Üç başlı pazı kası - kol açma hareketleri',
      exercises: ['Tricep Dip', 'Overhead Extension', 'Diamond Push-up', 'Kickback']
    },
    // SIRT YANLARI (LATS)
    lats: {
      name: 'Sırt Yanları',
      color: '#6C5CE7',
      bounds: { left: 0.20, right: 0.80, top: 0.30, bottom: 0.55 },
      description: 'Latissimus dorsi - sırt yanları, çekme hareketleri',
      exercises: ['Pull-up', 'Lat Pulldown', 'Bent Over Row', 'T-Bar Row']
    },
    // TRAPEZ
    traps: {
      name: 'Trapez',
      color: '#FECA57',
      bounds: { left: 0.25, right: 0.75, top: 0.08, bottom: 0.25 },
      description: 'Trapez kasları - boyun ve omuz stabilitesi',
      exercises: ['Shrugs', 'Upright Row', 'Face Pull', 'Reverse Fly']
    },
    // ALT SIRT
    lowerback: {
      name: 'Alt Sırt',
      color: '#E74C3C',
      bounds: { left: 0.30, right: 0.70, top: 0.45, bottom: 0.62 },
      description: 'Erector spinae - alt sırt ve omurga desteği',
      exercises: ['Deadlift', 'Good Morning', 'Back Extension', 'Superman']
    },
    // KALÇA
    glutes: {
      name: 'Kalça',
      color: '#A29BFE',
      bounds: { left: 0.28, right: 0.72, top: 0.58, bottom: 0.72 },
      description: 'Gluteus maximus - güçlü hareket kaynağı',
      exercises: ['Hip Thrust', 'Glute Bridge', 'Bulgarian Split Squat', 'Clamshell']
    },
    // ARKA BACAK
    hamstrings: {
      name: 'Arka Bacak',
      color: '#FDCB6E',
      bounds: { left: 0.30, right: 0.70, top: 0.67, bottom: 0.88 },
      description: 'Hamstring kasları - diz bükme ve kalça ekstansiyonu',
      exercises: ['Leg Curl', 'Good Morning', 'Single Leg Deadlift', 'Nordic Curl']
    },
    // ARKA BALDIR
    calves: {
      name: 'Baldır (Arka)',
      color: '#E17055',
      bounds: { left: 0.35, right: 0.65, top: 0.85, bottom: 0.95 },
      description: 'Gastrocnemius ve soleus - güçlü propulsiyon',
      exercises: ['Calf Raise', 'Seated Calf Raise', 'Donkey Calf Raise', 'Wall Push']
    },
  }
};

const ProfessionalBodyMap = ({ onMuscleSelect, onExercisePress }) => {
  const [currentView, setCurrentView] = useState('front');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // MuscleWiki tarzı kas grubu dokunma kontrolü - İlk göğüs sistemindeki gibi
  const handleMuscleTouch = useCallback((muscleId) => {
    // Haptic feedback
    Vibration.vibrate(50);

    if (selectedMuscle === muscleId) {
      // İkinci tıklama: egzersizlere git
      const muscleData = muscleGroups[currentView][muscleId];
      if (onExercisePress && muscleData) {
        onExercisePress({
          id: muscleId,
          name: muscleData.name,
          color: muscleData.color,
          exercises: ['Egzersiz 1', 'Egzersiz 2', 'Egzersiz 3'], // Örnek egzersizler
        });
      }
    } else {
      // İlk tıklama: önceki seçimi temizle ve yeni kas grubunu seç
      fadeAnim.stopAnimation();
      fadeAnim.setValue(0);

      setSelectedMuscle(muscleId);

      // Pulse animasyonu başlat
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [selectedMuscle, onExercisePress, fadeAnim, currentView]);

  // View toggle with 3D flip animation
  const toggleView = useCallback(() => {
    const newView = currentView === 'front' ? 'back' : 'front';

    // Reset selections
    setSelectedMuscle(null);
    fadeAnim.stopAnimation();
    fadeAnim.setValue(0);

    // Haptic feedback
    Vibration.vibrate(100);

    setCurrentView(newView);
  }, [currentView, fadeAnim]);

  // Get current muscle data
  const selectedMuscleData = selectedMuscle ? muscleGroups[currentView][selectedMuscle] : null;

  return (
    <View style={styles.container}>
      {/* Header with title and rotate button */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {currentView === 'front' ? 'Ön Görünüm' : 'Arka Görünüm'}
          </Text>
          <Text style={styles.subtitle}>🏋️‍♂️</Text>
        </View>

        <TouchableOpacity style={styles.rotateButton} onPress={toggleView}>
          <LinearGradient
            colors={['#FF6B35', '#4ECDC4']}
            style={styles.rotateGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.rotateText}>
              {currentView === 'front' ? 'Arka' : 'Ön'}
            </Text>
            <Text style={styles.rotateIcon}>🔄</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Main body map container */}
      <View style={styles.bodyMapContainer}>
        <View style={styles.imageContainer}>
          {/* Ana vücut görseli */}
          <Image
            source={currentView === 'front' ? frontBodyAsset : backBodyAsset}
            style={styles.bodyImage}
            resizeMode="contain"
          />

          {/* MuscleWiki tarzı mask sistemi - DÜZELTILMIŞ */}
          {Object.entries(muscleGroups[currentView]).map(([muscleId, muscleData]) => {
            const maskAsset = maskAssets[currentView][muscleId];

            if (!maskAsset) return null;

            const isSelected = selectedMuscle === muscleId;

            return (
              <React.Fragment key={muscleId}>
                {/* Ana mask görüntüsü - MASK PNG'SI DİREKT KULLANILIYOR */}
                <TouchableOpacity
                  style={[styles.maskTouchable]}
                  onPress={() => handleMuscleTouch(muscleId)}
                  activeOpacity={1}
                >
                  <Image
                    source={maskAsset}
                    style={[
                      styles.bodyImage,
                      {
                        tintColor: isSelected ? muscleData.color : 'transparent',
                        opacity: isSelected ? 0.8 : 0,
                      }
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {/* Pulse efekti */}
                {isSelected && (
                  <Animated.View
                    style={[
                      styles.bodyImage,
                      {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: fadeAnim,
                        pointerEvents: 'none', // Tıklamaları engellemez
                      }
                    ]}
                  >
                    <Image
                      source={maskAsset}
                      style={[
                        styles.bodyImage,
                        {
                          tintColor: muscleData.color,
                          opacity: 0.6,
                        }
                      ]}
                      resizeMode="contain"
                    />
                  </Animated.View>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Bottom info panel */}
      <View style={styles.infoPanel}>
        {selectedMuscleData ? (
          <View style={styles.selectedMuscleInfo}>
            <Text style={[styles.muscleName, { color: selectedMuscleData.color }]}>
              {selectedMuscleData.name}
            </Text>
            <Text style={styles.muscleDescription}>
              {selectedMuscleData.description}
            </Text>
            <TouchableOpacity
              style={[styles.exerciseButton, { backgroundColor: selectedMuscleData.color }]}
              onPress={() => onExercisePress && onExercisePress(selectedMuscleData)}
            >
              <Text style={styles.exerciseButtonText}>
                Egzersizleri Gör ({selectedMuscleData.exercises.length})
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.instructionInfo}>
            <Text style={styles.instructionTitle}>Kas Grubu Seçin</Text>
            <Text style={styles.instructionText}>
              Vücut üzerindeki kas gruplarına dokunun ve egzersizleri keşfedin
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },

  subtitle: {
    fontSize: 20,
  },

  rotateButton: {
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  rotateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },

  rotateText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 6,
  },

  rotateIcon: {
    fontSize: 16,
  },

  bodyMapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  imageContainer: {
    position: 'relative',
    width: screenWidth * 0.85,
    height: screenHeight * 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  bodyImage: {
    width: '100%',
    height: '100%',
  },

  // Gereksiz stiller kaldırıldı - sadece mask sistemi kullanıyoruz

  infoPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },

  selectedMuscleInfo: {
    alignItems: 'center',
  },

  muscleName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },

  muscleDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },

  exerciseButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  exerciseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  // Hover stilleri artık kullanılmıyor

  instructionInfo: {
    alignItems: 'center',
  },

  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  instructionText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Gereksiz göğüs stilleri kaldırıldı - artık genel mask sistemi kullanıyoruz

  muscleTouchArea: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // YENİ: Mask'lar için özel touchable style
  maskTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default ProfessionalBodyMap; 