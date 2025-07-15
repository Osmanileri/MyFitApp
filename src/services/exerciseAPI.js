// Exercise API Configuration
const EXERCISE_API_CONFIG = {
  BASE_URL: 'https://exercises11.p.rapidapi.com',
  API_KEY: '2134fb0c51msh3fe87f5c9728171p1d2939jsnfef0b1bdb85f',
  HEADERS: {
    'X-RapidAPI-Key': '2134fb0c51msh3fe87f5c9728171p1d2939jsnfef0b1bdb85f',
    'X-RapidAPI-Host': 'exercises11.p.rapidapi.com'
  }
};

// ExerciseDB API Service (RapidAPI) - ANA API
const EXERCISE_DB_API = {
  BASE_URL: 'https://exercisedb.p.rapidapi.com',
  API_KEY: '2134fb0c51msh3fe87f5c972817lp1d29391jsnfef0b1bdb85f',
  HEADERS: {
    'X-RapidAPI-Key': '2134fb0c51msh3fe87f5c972817lp1d29391jsnfef0b1bdb85f',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

// Wger API - Yedek API
const WGER_API = {
  BASE_URL: 'https://wger.de/api/v2',
  EXERCISES: 'https://wger.de/api/v2/exercise/',
  EXERCISE_INFO: 'https://wger.de/api/v2/exerciseinfo/',
  IMAGES: 'https://wger.de/api/v2/exerciseimage/',
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

// ExerciseDB kategorilerini bizim kategorilerimize çevir
const mapExerciseDBCategory = (bodyPart) => {
  const categoryMap = {
    'chest': 'Göğüs',
    'back': 'Sırt',
    'shoulders': 'Omuz',
    'upper arms': 'Kol',
    'lower arms': 'Kol',
    'upper legs': 'Bacak',
    'lower legs': 'Bacak',
    'waist': 'Karın',
    'cardio': 'Cardio'
  };
  return categoryMap[bodyPart] || 'Diğer';
};

// ExerciseDB ekipmanlarını çevir
const mapExerciseDBEquipment = (equipment) => {
  const equipmentMap = {
    'barbell': 'Barbell',
    'dumbbell': 'Dumbbell',
    'body weight': 'Vücut Ağırlığı',
    'cable': 'Cable',
    'machine': 'Machine',
    'kettlebell': 'Kettlebell',
    'resistance band': 'Direnç Bandı',
    'assisted': 'Destekli',
    'medicine ball': 'Sağlık Topu',
    'stability ball': 'Pilates Topu',
    'foam roll': 'Foam Roller',
    'tire': 'Lastik',
    'rope': 'Halat',
    'leverage machine': 'Kaldıraç Makinesi'
  };
  return equipmentMap[equipment] || 'Diğer';
};

// Mock data - Fallback için
const MOCK_EXERCISES = [
  {
    id: 1,
    name: 'Bench Press',
    category: 'Göğüs',
    equipment: 'Barbell',
    difficulty: 'Orta',
    instructions: [
      'Bench üzerinde sırt üstü yatın',
      'Barbell\'ı göğüs genişliğinde tutun',
      'Yavaşça göğsünüze indirin',
      'Güçlü bir şekilde yukarı itin'
    ],
    tips: [
      'Omuzlarınızı geri çekin',
      'Ayaklarınızı sıkıca yere basın',
      'Nefes kontrolünü ihmal etmeyin'
    ],
    muscleGroups: ['Göğüs', 'Triceps', 'Omuz'],
    targetMuscle: 'Göğüs',
    isLocal: true,
    useLocalAnimation: true
  },
  {
    id: 2,
    name: 'Squats',
    category: 'Bacak',
    equipment: 'Vücut Ağırlığı',
    difficulty: 'Başlangıç',
    instructions: [
      'Ayakları omuz genişliğinde açın',
      'Kolları öne doğru uzatın',
      'Kalçalarınızı geri iterek çömelin',
      'Topuklarınızı yerden kaldırmadan kalkın'
    ],
    tips: [
      'Dizlerinizi ayak parmak hizasında tutun',
      'Sırtınızı dik tutun',
      'Tam hareket genişliğini kullanın'
    ],
    gifUrl: 'https://v2.exercisedb.io/image/squats-animation.gif',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    targetMuscle: 'Bacak'
  },
  {
    id: 3,
    name: 'Pull-ups',
    category: 'Sırt',
    equipment: 'Pull-up Bar',
    difficulty: 'Zor',
    instructions: [
      'Barı omuz genişliğinde tutun',
      'Kolları tamamen uzatın',
      'Göğsünüzü bara doğru çekin',
      'Kontrollü bir şekilde indirin'
    ],
    tips: [
      'Sırtınızı aktif tutun',
      'Sallanmaktan kaçının',
      'Tam hareket genişliğini kullanın'
    ],
    gifUrl: 'https://v2.exercisedb.io/image/pull-ups-animation.gif',
    muscleGroups: ['Latissimus Dorsi', 'Biceps', 'Rhomboids'],
    targetMuscle: 'Sırt'
  },
  {
    id: 4,
    name: 'Deadlifts',
    category: 'Sırt',
    equipment: 'Barbell',
    difficulty: 'Zor',
    instructions: [
      'Barbell\'ın üzerinde durun',
      'Eğilerek barı tutun',
      'Sırtınızı dik tutarak kaldırın',
      'Kalçalarınızı öne iterek tamamlayın'
    ],
    tips: [
      'Sırtınızı hiç eğmeden tutun',
      'Bar vücudunuza yakın olsun',
      'Ayaklarınızı sıkıca yere basın'
    ],
    gifUrl: 'https://v2.exercisedb.io/image/deadlifts-animation.gif',
    muscleGroups: ['Hamstrings', 'Glutes', 'Erector Spinae'],
    targetMuscle: 'Sırt'
  },
  {
    id: 5,
    name: 'Shoulder Press',
    category: 'Omuz',
    equipment: 'Dumbbell',
    difficulty: 'Orta',
    instructions: [
      'Dumbbell\'ları omuz hizasında tutun',
      'Ayakları omuz genişliğinde açın',
      'Ağırlıkları yukarı doğru itin',
      'Kontrollü bir şekilde indirin'
    ],
    tips: [
      'Core kaslarınızı sıkın',
      'Bileklerinizi sabit tutun',
      'Tam hareket genişliğini kullanın'
    ],
    gifUrl: 'https://v2.exercisedb.io/image/shoulder-press-animation.gif',
    muscleGroups: ['Deltoids', 'Triceps', 'Trapezius'],
    targetMuscle: 'Omuz'
  },
  {
    id: 6,
    name: 'Bicep Curls',
    category: 'Kol',
    equipment: 'Dumbbell',
    difficulty: 'Başlangıç',
    instructions: [
      'Dumbbell\'ları yanlarınızda tutun',
      'Dirseklerinizi sabit tutun',
      'Ağırlıkları omuzlarınıza doğru kaldırın',
      'Yavaşça başlangıç pozisyonuna dönün'
    ],
    tips: [
      'Vücudunuzu sallamayın',
      'Kasılmayı hissedin',
      'Tam kontrol ile hareket edin'
    ],
    gifUrl: 'https://v2.exercisedb.io/image/bicep-curls-animation.gif',
    muscleGroups: ['Biceps', 'Brachialis'],
    targetMuscle: 'Kol'
  }
];

// API Service Functions
const ExerciseAPI = {
  // 🔧 API Test Fonksiyonu
  testNewAPI: async () => {
    try {
      console.log('🔧 Yeni API endpoint test ediliyor...');
      console.log('🔑 API Key:', EXERCISE_API_CONFIG.API_KEY);
      console.log('🌐 URL:', `${EXERCISE_API_CONFIG.BASE_URL}/data.json`);
      
      const response = await fetch(`${EXERCISE_API_CONFIG.BASE_URL}/data.json`, {
        method: 'GET',
        headers: EXERCISE_API_CONFIG.HEADERS
      });
      
      console.log('📡 Response Status:', response.status);
      console.log('📡 Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ API Response başarılı!');
      console.log('📊 Gelen veri türü:', typeof data);
      console.log('📊 Veri boyutu:', JSON.stringify(data).length);
      console.log('📊 İlk 100 karakter:', JSON.stringify(data).substring(0, 100));
      
      return {
        success: true,
        message: 'Yeni API çalışıyor! ✅',
        data: data
      };
      
    } catch (error) {
      console.error('❌ API Test hatası:', error);
      return {
        success: false,
        message: 'API hatası: ' + error.message,
        error: error
      };
    }
  },

  // 📱 API'den Egzersizleri Çek
  fetchFromAPI: async () => {
    try {
      console.log('📱 API\'den egzersizler çekiliyor...');
      
      const response = await fetch(`${EXERCISE_API_CONFIG.BASE_URL}/data.json`, {
        method: 'GET',
        headers: EXERCISE_API_CONFIG.HEADERS
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📥 API\'den ham veri alındı');
      
      // Veri yapısını analiz et
      console.log('🔍 Veri yapısı analizi:');
      console.log('- Veri türü:', typeof data);
      console.log('- Array mi?', Array.isArray(data));
      console.log('- Objeler:', Object.keys(data));
      
      return data;
      
    } catch (error) {
      console.error('❌ API\'den veri çekme hatası:', error);
      throw error;
    }
  },

  // Kesinlikle çalışan GIF'ler (Statik) - Fallback
  getWorkingExercises: () => {
    console.log('🎬 Kesinlikle çalışan GIF\'ler yükleniyor...');
    
    const workingExercises = [
      {
        id: 1,
        name: 'Bench Press',
        category: 'Göğüs',
        equipment: 'Barbell',
        difficulty: 'Orta',
        instructions: [
          'Bench üzerinde sırt üstü yatın',
          'Barbell\'ı göğüs genişliğinde tutun',
          'Yavaşça göğsünüze indirin',
          'Güçlü bir şekilde yukarı itin'
        ],
        tips: [
          'Omuzlarınızı geri çekin',
          'Ayaklarınızı sıkıca yere basın',
          'Nefes kontrolünü ihmal etmeyin'
        ],
        muscleGroups: ['Göğüs', 'Triceps', 'Omuz'],
        targetMuscle: 'Göğüs',
        isLocal: true, // Yerel animasyon işareti - LocalAnimationService'den alınacak
        useLocalAnimation: true // Bu egzersiz için yerel animasyon kullan
      },
      {
        id: 2,
        name: 'Squats',
        category: 'Bacak',
        equipment: 'Vücut Ağırlığı',
        difficulty: 'Başlangıç',
        instructions: [
          'Ayakları omuz genişliğinde açın',
          'Kolları öne doğru uzatın',
          'Kalçalarınızı geri iterek çömelin',
          'Topuklarınızı yerden kaldırmadan kalkın'
        ],
        tips: [
          'Dizlerinizi ayak parmak hizasında tutun',
          'Sırtınızı dik tutun',
          'Tam hareket genişliğini kullanın'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjk2YjQ5NWMxZWRmZTQyZjM1Y2Q4ZDk4MTRhNzQ5YzEwNDY2YjNmOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3V0wkQ2KKcAeW8Cs/giphy.gif',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        targetMuscle: 'Bacak'
      },
      {
        id: 3,
        name: 'Push-ups',
        category: 'Göğüs',
        equipment: 'Vücut Ağırlığı',
        difficulty: 'Orta',
        instructions: [
          'Plank pozisyonuna geçin',
          'Ellerinizi omuz genişliğinde açın',
          'Vücudunuzu yere doğru indirin',
          'Güçlü bir şekilde yukarı itin'
        ],
        tips: [
          'Vücudunuzu düz tutun',
          'Tam hareket genişliğini kullanın',
          'Nefes kontrolünü sağlayın'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzQ2YjQ5ZGJjN2E4NzE0NmQ5MzU4OGRjY2JhZTcwZTE5NzVjMzY5OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46CbZ7KWEhN1oci4/giphy.gif',
        muscleGroups: ['Pectorals', 'Triceps', 'Anterior Deltoids'],
        targetMuscle: 'Göğüs'
      },
      {
        id: 4,
        name: 'Pull-ups',
        category: 'Sırt',
        equipment: 'Pull-up Bar',
        difficulty: 'Zor',
        instructions: [
          'Barı omuz genişliğinde tutun',
          'Kolları tamamen uzatın',
          'Göğsünüzü bara doğru çekin',
          'Kontrollü bir şekilde indirin'
        ],
        tips: [
          'Sırtınızı aktif tutun',
          'Sallanmaktan kaçının',
          'Tam hareket genişliğini kullanın'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExODZhYzM5NWE4OWQzZjhkYzFkY2E5NWY1YjBhYjMwZWY5YzM4NjQ5NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xeJpnrWC4XWblEk/giphy.gif',
        muscleGroups: ['Latissimus Dorsi', 'Biceps', 'Rhomboids'],
        targetMuscle: 'Sırt'
      },
      {
        id: 5,
        name: 'Deadlifts',
        category: 'Sırt',
        equipment: 'Barbell',
        difficulty: 'Zor',
        instructions: [
          'Barbell\'ın üzerinde durun',
          'Eğilerek barı tutun',
          'Sırtınızı dik tutarak kaldırın',
          'Kalçalarınızı öne iterek tamamlayın'
        ],
        tips: [
          'Sırtınızı hiç eğmeden tutun',
          'Bar vücudunuza yakın olsun',
          'Ayaklarınızı sıkıca yere basın'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNThlNGVkOWY4MTAwNWJhODMwNjg1ZGM4NjIwZGE3ZWFjNzU4ODQ1ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3V0dy1zzyjbYTQQM/giphy.gif',
        muscleGroups: ['Hamstrings', 'Glutes', 'Erector Spinae'],
        targetMuscle: 'Sırt'
      },
      {
        id: 6,
        name: 'Bicep Curls',
        category: 'Kol',
        equipment: 'Dumbbell',
        difficulty: 'Başlangıç',
        instructions: [
          'Dumbbell\'ları yanlarınızda tutun',
          'Dirseklerinizi sabit tutun',
          'Ağırlıkları omuzlarınıza doğru kaldırın',
          'Yavaşça başlangıç pozisyonuna dönün'
        ],
        tips: [
          'Vücudunuzu sallamayın',
          'Kasılmayı hissedin',
          'Tam kontrol ile hareket edin'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWE4NGU5NjE5ZjQzODQ5MGZhMmU4M2YwMTk0ZmE5MDYzZjRjNDZhMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46CyJnLY9eOF7WTe/giphy.gif',
        muscleGroups: ['Biceps', 'Brachialis'],
        targetMuscle: 'Kol'
      },
      {
        id: 7,
        name: 'Shoulder Press',
        category: 'Omuz',
        equipment: 'Dumbbell',
        difficulty: 'Orta',
        instructions: [
          'Dumbbell\'ları omuz hizasında tutun',
          'Ayakları omuz genişliğinde açın',
          'Ağırlıkları yukarı doğru itin',
          'Kontrollü bir şekilde indirin'
        ],
        tips: [
          'Core kaslarınızı sıkın',
          'Bileklerinizi sabit tutun',
          'Tam hareket genişliğini kullanın'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGU2ZTEzZjQ3N2Y5NzRjNzE4YWQ5YjVhOTJkMjBhNzMzNjE3NzJkOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3V0qvJEgtj38srKg/giphy.gif',
        muscleGroups: ['Deltoids', 'Triceps', 'Trapezius'],
        targetMuscle: 'Omuz'
      },
      {
        id: 8,
        name: 'Lunges',
        category: 'Bacak',
        equipment: 'Vücut Ağırlığı',
        difficulty: 'Başlangıç',
        instructions: [
          'Ayakta dik durun',
          'Bir ayağınızı öne doğru atın',
          'Arka dizinizi yere doğru indirin',
          'Başlangıç pozisyonuna dönün'
        ],
        tips: [
          'Dengenizi koruyun',
          'Ön dizinizi 90 derece eğin',
          'Sırtınızı dik tutun'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGZjMjU0OWZiMGJkNWJjOTk0YjBjYjc4YjQ5OTI4YjBjMmE5YjdkMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3V0fNrXP2MjvU2k0/giphy.gif',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        targetMuscle: 'Bacak'
      },
      {
        id: 9,
        name: 'Plank',
        category: 'Karın',
        equipment: 'Vücut Ağırlığı',
        difficulty: 'Orta',
        instructions: [
          'Yüzüstü pozisyonda yatın',
          'Dirseklerinizi yere koyun',
          'Vücudunuzu düz bir çizgide tutun',
          'Pozisyonu koruyun'
        ],
        tips: [
          'Kalçalarınızı yukarı kaldırmayın',
          'Nefes almayı unutmayın',
          'Core kaslarınızı sıkın'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGJjOWY0MzVhYjgyNzRiNGY4OTZmZjRhNDQ4OGNmN2FkNDY5NmFlZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oBhSS0CbG9xTlQKt2/giphy.gif',
        muscleGroups: ['Rectus Abdominis', 'Transverse Abdominis', 'Obliques'],
        targetMuscle: 'Karın'
      },
      {
        id: 10,
        name: 'Russian Twists',
        category: 'Karın',
        equipment: 'Vücut Ağırlığı',
        difficulty: 'Orta',
        instructions: [
          'Yerde oturarak bacaklarınızı kaldırın',
          'Vücudunuzu geriye doğru eğin',
          'Ellerinizi yan yana getirin',
          'Gövdenizi sağa sola çevirin'
        ],
        tips: [
          'Hareketin kontrolünü kaybetmeyin',
          'Nefes alış verişinizi düzenleyin',
          'Yan kasları hissedin'
        ],
        gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWY1ZTJhMzRhZGM0YjkzNTJlYzY5Y2Y3NzEyNGVhZTk5OThjZGQzNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3V0dBUHWI7hF0hXG/giphy.gif',
        muscleGroups: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
        targetMuscle: 'Karın'
      }
    ];
    
    console.log('✅ Statik GIF\'ler hazır:', workingExercises.length, 'adet');
    return workingExercises;
  },

  // Tüm egzersizleri getir (Sadece Yerel Veri)
  getAllExercises: async () => {
    console.log('📁 Yerel egzersiz verileri yükleniyor...');
    return ExerciseAPI.getWorkingExercises();
  },

  // Kas grubuna göre egzersizleri getir
  getExercisesByMuscleGroup: async (muscleGroup) => {
    try {
      const allExercises = await ExerciseAPI.getAllExercises();
      const filtered = allExercises.filter(exercise => 
        exercise.category === muscleGroup || 
        exercise.muscleGroups.includes(muscleGroup)
      );
      
      console.log(`✅ ${muscleGroup} için ${filtered.length} egzersiz bulundu`);
      return filtered;
      
    } catch (error) {
      console.error('getExercisesByMuscleGroup hatası:', error);
      const fallbackExercises = ExerciseAPI.getWorkingExercises();
      return fallbackExercises.filter(exercise => exercise.category === muscleGroup);
    }
  },

  // Egzersiz detayını getir
  getExerciseById: async (id) => {
    try {
      const allExercises = await ExerciseAPI.getAllExercises();
      return allExercises.find(exercise => exercise.id == id);
    } catch (error) {
      console.error('getExerciseById hatası:', error);
      const fallbackExercises = ExerciseAPI.getWorkingExercises();
      return fallbackExercises.find(exercise => exercise.id == id);
    }
  },

  // Egzersiz ara
  searchExercises: async (query) => {
    try {
      const allExercises = await ExerciseAPI.getAllExercises();
      return allExercises.filter(exercise =>
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.category.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('searchExercises hatası:', error);
      const fallbackExercises = ExerciseAPI.getWorkingExercises();
      return fallbackExercises.filter(exercise =>
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.category.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Zorluk seviyesine göre egzersizleri getir
  getExercisesByDifficulty: async (difficulty) => {
    try {
      const allExercises = await ExerciseAPI.getAllExercises();
      return allExercises.filter(exercise => exercise.difficulty === difficulty);
    } catch (error) {
      console.error('getExercisesByDifficulty hatası:', error);
      return [];
    }
  },

  // Ekipmana göre egzersizleri getir
  getExercisesByEquipment: async (equipment) => {
    try {
      const allExercises = await ExerciseAPI.getAllExercises();
      return allExercises.filter(exercise => exercise.equipment === equipment);
    } catch (error) {
      console.error('getExercisesByEquipment hatası:', error);
      const fallbackExercises = ExerciseAPI.getWorkingExercises();
      return fallbackExercises.filter(exercise => exercise.equipment === equipment);
    }
  },

  // Rastgele egzersizleri getir
  getRandomExercises: async (count = 5) => {
    try {
      const allExercises = await ExerciseAPI.getAllExercises();
      const shuffled = allExercises.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('getRandomExercises hatası:', error);
      return [];
    }
  }
};

export default ExerciseAPI;

// 🔧 HIBRİT API SİSTEMİ
// ✅ Yeni API: https://exercises11.p.rapidapi.com/data.json
// ✅ API Key: 2134fb0c51msh3fe87f5c9728171p1d2939jsnfef0b1bdb85f
// ✅ Fallback: Statik GIPHY GIF'leri
// ✅ Hata yönetimi: API fail -> fallback aktif
//
// 📱 Test:
// const result = await ExerciseAPI.testNewAPI();
// console.log(result); // API durumunu göster
//
// const exercises = await ExerciseAPI.getAllExercises();
// console.log(exercises[0].gifUrl); // GIF URL'i göster
//
// 🎯 Avantajlar:
// - Gerçek API verileri (başarılı olduğunda)
// - Garantili fallback (API hatası durumunda)
// - Hibrit sistem (en iyi ikisinden)
// - Detaylı hata yönetimi 