// 🎨 PROFESYONEL LOTTİE ANİMASYON SERVİSİ
// Ultra Hafif + Yüksek Kalite Sistemi

import { Asset } from 'expo-asset';

// YEREL ANİMASYONLAR (Lottie Öncelikli)
const LOCAL_ANIMATIONS = {
  'Bench Press': {
    id: 'bench_press',
    title: 'Bench Press Hareketi',
    type: 'video', // Geçici - Lottie'ye geçince 'lottie' olacak
    source: require('../../assets/bench-press.mp4'),
    lottieSource: null, // Lottie dosyası eklenince: require('../../assets/lottie/bench-press.json')
    videoSource: require('../../assets/bench-press.mp4'), // Fallback
    description: 'Göğüs kasları için temel hareket',
    isLocal: true,
    animated: true,
    width: 300,
    height: 200,
    hasLottie: false, // Lottie dosyası eklenince true yapılacak
    hasVideo: true,
    fileSize: '15KB', // Lottie versiyonu için tahmini
    priority: 'high' // Popüler egzersiz
  },
  'Squats': {
    id: 'squats',
    title: 'Squat Hareketi',
    type: 'lottie', // Lottie priorite
    source: null, // Lottie dosyası eklenince: require('../../assets/lottie/squats.json')
    lottieSource: null,
    description: 'Bacak kasları için temel hareket',
    isLocal: true,
    animated: true,
    width: 300,
    height: 200,
    hasLottie: false, // Lottie dosyası eklenince true
    hasVideo: false,
    fileSize: '12KB',
    priority: 'high'
  },
  'Push Ups': {
    id: 'push_ups',
    title: 'Şınav Hareketi',
    type: 'lottie',
    source: null, // Lottie dosyası eklenince: require('../../assets/lottie/push-ups.json')
    lottieSource: null,
    description: 'Göğüs ve kol kasları',
    isLocal: true,
    animated: true,
    width: 300,
    height: 200,
    hasLottie: false,
    hasVideo: false,
    fileSize: '10KB',
    priority: 'high'
  },
  'Pull Ups': {
    id: 'pull_ups',
    title: 'Barfiks Hareketi',
    type: 'lottie',
    source: null,
    lottieSource: null,
    description: 'Sırt kasları için güçlü hareket',
    isLocal: true,
    animated: true,
    width: 300,
    height: 200,
    hasLottie: false,
    hasVideo: false,
    fileSize: '18KB',
    priority: 'high'
  },
  'Deadlifts': {
    id: 'deadlifts',
    title: 'Deadlift Hareketi',
    type: 'lottie',
    source: null,
    lottieSource: null,
    description: 'Tüm vücut güçlendirme',
    isLocal: true,
    animated: true,
    width: 300,
    height: 200,
    hasLottie: false,
    hasVideo: false,
    fileSize: '20KB',
    priority: 'high'
  }
};

// 🎨 PROFESYONELİZE LOTTİE ANİMASYON SERVİSİ
const LocalAnimationService = {
  // Egzersiz için animasyon al (Lottie Öncelikli)
  getExerciseAnimation: async (exerciseName) => {
    console.log(`🎨 Lottie animasyon aranan: "${exerciseName}"`);
    console.log(`📋 Mevcut animasyonlar:`, Object.keys(LOCAL_ANIMATIONS));
    
    const animation = LOCAL_ANIMATIONS[exerciseName];
    
    if (!animation) {
      console.log(`⚠️ "${exerciseName}" için animasyon bulunamadı`);
      
      // Büyük/küçük harf duyarsız arama
      const animationKey = Object.keys(LOCAL_ANIMATIONS).find(key => 
        key.toLowerCase() === exerciseName.toLowerCase()
      );
      
      if (animationKey) {
        console.log(`✅ Büyük/küçük harf eşleşmesi: "${animationKey}"`);
        return await LocalAnimationService.getExerciseAnimation(animationKey);
      }
      
      return null;
    }
    
    try {
      console.log(`🔄 "${exerciseName}" animasyonu yükleniyor... Tip: ${animation.type}`);
      
      // 🎨 LOTTİE ÖNCELİKLİ SİSTEM
      if (animation.type === 'lottie' && animation.hasLottie && animation.lottieSource) {
        console.log(`🎨 Lottie animasyon yükleniyor... (${animation.fileSize})`);
        
        const lottieAnimation = {
          ...animation,
          actualType: 'lottie',
          source: animation.lottieSource
        };
        
        console.log(`✅ Lottie animasyon hazır: ${animation.title} (${animation.fileSize})`);
        return lottieAnimation;
        
      } else if (animation.type === 'video' && animation.hasVideo) {
        // Video Fallback (mevcut sistem)
        console.log(`📹 Video fallback yükleniyor...`);
        const videoAsset = Asset.fromModule(animation.videoSource);
        await videoAsset.downloadAsync();
        
        const videoWithUri = {
          ...animation,
          uri: videoAsset.localUri || videoAsset.uri,
          actualType: 'video'
        };
        
        console.log(`✅ Video animasyon hazır: ${animation.title}`);
        console.log(`📱 Video URI: ${videoWithUri.uri}`);
        return videoWithUri;
        
      } else {
        // Henüz hazır değil
        console.log(`⏳ "${exerciseName}" animasyonu henüz hazır değil (${animation.type})`);
        return {
          ...animation,
          actualType: 'placeholder',
          isReady: false
        };
      }
      
    } catch (error) {
      console.error(`❌ Animasyon yükleme hatası:`, error);
      return null;
    }
  },

  // Lottie animasyon ekle (Manuel - require() statik olmalı)
  addLottieAnimation: (exerciseName, lottieSource, options = {}) => {
    if (LOCAL_ANIMATIONS[exerciseName]) {
      LOCAL_ANIMATIONS[exerciseName] = {
        ...LOCAL_ANIMATIONS[exerciseName],
        type: 'lottie',
        lottieSource: lottieSource, // Direkt require() objesi geçilmeli
        hasLottie: true,
        fileSize: options.fileSize || 'Unknown',
        ...options
      };
      console.log(`🎨 ${exerciseName} için Lottie animasyon eklendi`);
    }
  },

  // Animasyon var mı kontrol et
  hasAnimationForExercise: (exerciseName) => {
    return !!LOCAL_ANIMATIONS[exerciseName];
  },

  // Lottie hazır olanları listele
  getReadyAnimations: () => {
    return Object.entries(LOCAL_ANIMATIONS)
      .filter(([name, anim]) => anim.hasLottie || anim.hasVideo)
      .map(([name, anim]) => ({
        name,
        type: anim.type,
        fileSize: anim.fileSize,
        priority: anim.priority,
        isReady: anim.hasLottie || anim.hasVideo
      }));
  },

  // Tüm animasyonları listele
  listAllAnimations: () => {
    console.log('🎨 Mevcut animasyon sistemi:');
    Object.keys(LOCAL_ANIMATIONS).forEach(exercise => {
      const anim = LOCAL_ANIMATIONS[exercise];
      const status = anim.hasLottie ? '🎨 Lottie Ready' : 
                    anim.hasVideo ? '📹 Video Ready' : '⏳ Coming Soon';
      console.log(`  - ${exercise}: ${anim.title} (${anim.type}) ${status} - ${anim.fileSize}`);
    });
    return Object.keys(LOCAL_ANIMATIONS);
  },

  // Toplam boyut hesapla
  getTotalSize: () => {
    const readyAnimations = LocalAnimationService.getReadyAnimations();
    console.log(`📊 Toplam ${readyAnimations.length} animasyon hazır`);
    console.log(`💾 Tahmini toplam boyut: ${readyAnimations.length * 15}KB (~${Math.round(readyAnimations.length * 15 / 1024)}MB)`);
    return readyAnimations;
  },

  // Animasyon türü kontrolü
  getAnimationType: (exerciseName) => {
    const animation = LOCAL_ANIMATIONS[exerciseName];
    return animation ? animation.type : null;
  }
};

export default LocalAnimationService; 