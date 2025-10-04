// 🧪 React Native için ExerciseAPI Test Dosyası
// Bu dosyayı React Native uygulamanızda import ederek test edebilirsiniz

import ExerciseAPI from './exerciseAPI';

// Test fonksiyonu - React Native bileşeninizde çağırabilirsiniz
export const testExerciseAPI = async () => {
  try {
    console.log('🧪 ExerciseAPI Test Başlıyor...');

    // 1. Tüm egzersizleri getir
    console.log('1️⃣ Tüm egzersizleri getirme testi...');
    const allExercises = await ExerciseAPI.getAllExercises();
    console.log(`✅ ${allExercises.length} egzersiz alındı`);

    // 2. Kas grubuna göre egzersizleri getir
    console.log('2️⃣ Göğüs egzersizleri testi...');
    const chestExercises = await ExerciseAPI.getExercisesByMuscleGroup('Göğüs');
    console.log(`✅ Göğüs için ${chestExercises.length} egzersiz bulundu`);

    // 3. Bacak egzersizleri
    console.log('3️⃣ Bacak egzersizleri testi...');
    const legExercises = await ExerciseAPI.getExercisesByMuscleGroup('Bacak');
    console.log(`✅ Bacak için ${legExercises.length} egzersiz bulundu`);

    // 4. Sırt egzersizleri
    console.log('4️⃣ Sırt egzersizleri testi...');
    const backExercises = await ExerciseAPI.getExercisesByMuscleGroup('Sırt');
    console.log(`✅ Sırt için ${backExercises.length} egzersiz bulundu`);

    // 5. API durumu kontrolü (WGER kaldırıldı)
    console.log('5️⃣ API durum kontrolü...');
    const apiStatus = await ExerciseAPI.checkAllAPIsStatus();
    console.log('📊 API Durumları:', {
      rapidAPI: apiStatus.rapidAPI.status,
      fallback: apiStatus.fallback.status
    });

    return {
      success: true,
      totalExercises: allExercises.length,
      chestCount: chestExercises.length,
      legCount: legExercises.length,
      backCount: backExercises.length,
      apiStatus: apiStatus
    };

  } catch (error) {
    console.error('❌ Test hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Kas grubu egzersizlerini getiren yardımcı fonksiyon
export const getMuscleGroupExercises = async (muscleGroup) => {
  try {
    console.log(`💪 ${muscleGroup} egzersizleri alınıyor...`);
    const exercises = await ExerciseAPI.getExercisesByMuscleGroup(muscleGroup);
    console.log(`✅ ${muscleGroup} için ${exercises.length} egzersiz bulundu`);
    return exercises;
  } catch (error) {
    console.error(`❌ ${muscleGroup} egzersizleri alınamadı:`, error);
    return [];
  }
};

// Egzersiz arama fonksiyonu
export const searchExercises = async (query) => {
  try {
    console.log(`🔍 "${query}" araması yapılıyor...`);
    const results = await ExerciseAPI.searchExercises(query);
    console.log(`✅ "${query}" için ${results.length} sonuç bulundu`);
    return results;
  } catch (error) {
    console.error(`❌ "${query}" araması başarısız:`, error);
    return [];
  }
};

// Set kaydetme fonksiyonu
export const logWorkoutSet = async (exerciseId, reps, weight, comment = '') => {
  try {
    console.log(`💾 Set kaydediliyor: ${exerciseId}, ${reps} tekrar, ${weight}kg`);
    const result = await ExerciseAPI.logWorkoutSet({
      exerciseId,
      reps,
      weight,
      comment
    });
    console.log('✅ Set kaydedildi:', result);
    return result;
  } catch (error) {
    console.error('❌ Set kaydedilemedi:', error);
    return { success: false, error: error.message };
  }
};

// React Native bileşeninizde kullanım örneği:
/*
import { testExerciseAPI, getMuscleGroupExercises } from './src/services/testExerciseAPI';

// Bileşeninizde:
const handleTestAPI = async () => {
  const result = await testExerciseAPI();
  console.log('Test sonucu:', result);
};

const handleGetChestExercises = async () => {
  const exercises = await getMuscleGroupExercises('Göğüs');
  setExercises(exercises); // State'e kaydet
};
*/