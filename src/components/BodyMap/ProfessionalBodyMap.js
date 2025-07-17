// 🏋️‍♂️ PROFESSIONAL MUSCLEWIKI CLONE
// Using your custom body assets with precise muscle mapping

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  Animated,
  Vibration,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// --- ASSET IMPORTS ---
const frontBodyAsset = require('../../../assets/front_body.png');
const backBodyAsset = require('../../../assets/back_body.png');

// Dinamik olarak asset'leri yüklemek için bir yardımcı yapı
const muscleAssets = {
  front: {
    abdominals: require('../../../assets/mark_abdominals.png'),
    biceps: require('../../../assets/mark_biceps.png'),
    calves: require('../../../assets/mark_calves.png'),
    chest: require('../../../assets/mark_chest.png'),
    forearms: require('../../../assets/mark_forearms.png'),
    hands: require('../../../assets/mark_hands.png'),
    oblique: require('../../../assets/mark_oblique.png'),
    quads: require('../../../assets/mark_quads.png'),
    shoulder: require('../../../assets/mark_shoulder.png'),
    traps: require('../../../assets/mark_traps.png'),
  },
  back: {
    calf: require('../../../assets/back_calf.png'),
    forearms: require('../../../assets/back_forearms.png'),
    glutes: require('../../../assets/back_glutes.png'),
    hamstring: require('../../../assets/back_hamstring.png'),
    hands: require('../../../assets/back_hands.png'),
    lats: require('../../../assets/back_lats.png'),
    lowerback: require('../../../assets/back_lowerback.png'),
    'rear-shoulder': require('../../../assets/back_rear-shoulder.png'),
    'traps-middle': require('../../../assets/back_traps-middle.png'),
    traps: require('../../../assets/back_traps.png'),
    triceps: require('../../../assets/back_triceps.png'),
  }
};
// --- END OF ASSET IMPORTS ---

const ProfessionalBodyMap = () => {
  const [currentView, setCurrentView] = useState('front');
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  // Kas grubu verileri (değişmedi)
  const muscleMapping = {
    front: {
      traps: {
        id: 'traps',
        asset: muscleAssets.front.traps,
      },
      shoulder: {
        id: 'shoulder',
        asset: muscleAssets.front.shoulder,
      },
      biceps: {
        id: 'biceps',
        asset: muscleAssets.front.biceps,
      },
      chest: {
        id: 'chest',
        asset: muscleAssets.front.chest,
      },
      oblique: {
        id: 'oblique',
        asset: muscleAssets.front.oblique,
      },
      abdominals: {
        id: 'abdominals',
        asset: muscleAssets.front.abdominals,
      },
      forearms: {
        id: 'forearms',
        asset: muscleAssets.front.forearms,
      },
      quads: {
        id: 'quads',
        asset: muscleAssets.front.quads,
      },
      hands: {
        id: 'hands',
        asset: muscleAssets.front.hands,
      },
      calves: {
        id: 'calves',
        asset: muscleAssets.front.calves,
      },
    },
    back: {
      calf: {
        id: 'calf',
        asset: muscleAssets.back.calf,
      },
      forearms: {
        id: 'forearms',
        asset: muscleAssets.back.forearms,
      },
      glutes: {
        id: 'glutes',
        asset: muscleAssets.back.glutes,
      },
      hamstring: {
        id: 'hamstring',
        asset: muscleAssets.back.hamstring,
      },
      hands: {
        id: 'hands',
        asset: muscleAssets.back.hands,
      },
      lats: {
        id: 'lats',
        asset: muscleAssets.back.lats,
      },
      lowerback: {
        id: 'lowerback',
        asset: muscleAssets.back.lowerback,
      },
      'rear-shoulder': {
        id: 'rear-shoulder',
        asset: muscleAssets.back['rear-shoulder'],
      },
      'traps-middle': {
        id: 'traps-middle',
        asset: muscleAssets.back['traps-middle'],
      },
      traps: {
        id: 'traps',
        asset: muscleAssets.back.traps,
      },
      triceps: {
        id: 'triceps',
        asset: muscleAssets.back.triceps,
      },
    }
  };

  const currentMuscles = muscleMapping[currentView];

  const handleMusclePress = (muscle) => {
    setSelectedMuscle(muscle.id);
    // Burada navigation veya başka bir yönlendirme fonksiyonu çağrılabilir
    Alert.alert('Kas Grubu', `${muscle.id} seçildi! (Burada hareketler sayfasına yönlendirme yapılacak)`);
  };

  const toggleView = () => {
    setCurrentView(prev => (prev === 'front' ? 'back' : 'front'));
    setSelectedMuscle(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentView === 'front' ? 'Ön Görünüm' : 'Arka Görünüm'}</Text>
        </View>
        <TouchableOpacity style={styles.rotateButton} onPress={toggleView}>
          <LinearGradient colors={['#FF6B35', '#4ECDC4']} style={styles.rotateGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.rotateText}>{currentView === 'front' ? 'Arka' : 'Ön'}</Text>
            <Text style={styles.rotateIcon}>🔄</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Body Map */}
      <View style={styles.bodyMapContainer}>
        <View
          style={styles.imageContainer}
          onStartShouldSetResponder={() => true}
          onResponderRelease={e => {
            const { locationX, locationY } = e.nativeEvent;
            console.log('Tıklanan nokta:', locationX, locationY);
          }}
        >
          {/* Alt katman: Skeleton */}
          <Image source={currentView === 'front' ? frontBodyAsset : backBodyAsset} style={styles.bodyImage} resizeMode="contain" />
          {/* Kas grubu görselleri sadece görsel olarak gösterilecek, tıklanabilir olmayacak */}
          {Object.values(currentMuscles).map((muscle) => (
            <View
              key={muscle.id}
              style={styles.muscleMaskContainer}
            >
              <Image
                source={muscle.asset}
                style={[
                  styles.muscleMask,
                  { tintColor: 'yellow', opacity: 0.7 }
                ]}
                resizeMode="contain"
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginRight: 8 },
  subtitle: { fontSize: 20 },
  rotateButton: { borderRadius: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  rotateGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25 },
  rotateText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, marginRight: 6 },
  rotateIcon: { fontSize: 16 },
  bodyMapContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
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
  bodyImage: { width: '100%', height: '100%' },
  muscleMask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  muscleMaskContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});

export default ProfessionalBodyMap;