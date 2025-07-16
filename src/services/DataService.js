import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class DataService {
  constructor() {
    this.syncQueue = [];
    this.isSyncing = false;
    this.listeners = [];
    
    // Network durumunu dinle
    NetInfo.addEventListener(state => {
      if (state.isConnected && this.syncQueue.length > 0) {
        this.processSyncQueue();
      }
    });
  }

  // Offline/Online durumu kontrol et
  async isOnline() {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected;
  }

  // Günlük beslenme verisi kaydet
  async saveDailyNutrition(userId, date, nutritionData) {
    const dateStr = this.formatDate(date);
    const docId = `${userId}_${dateStr}`;
    
    const data = {
      userId,
      date: dateStr,
      timestamp: firestore.FieldValue.serverTimestamp(),
      meals: nutritionData.meals || {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      },
      totals: nutritionData.totals || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      },
      water: nutritionData.water || 0,
      targetCalories: nutritionData.targetCalories || 2000,
      notes: nutritionData.notes || ''
    };

    try {
      // Online ise Firebase'e kaydet
      if (await this.isOnline()) {
        await firestore().collection('daily_nutrition').doc(docId).set(data);
      } else {
        // Offline ise sync kuyruğuna ekle
        this.addToSyncQueue('daily_nutrition', docId, data);
      }
      
      // Her durumda local cache'e kaydet
      await AsyncStorage.setItem(`nutrition_${docId}`, JSON.stringify(data));
      
      return { success: true, data };
    } catch (error) {
      console.error('Beslenme kaydetme hatası:', error);
      throw error;
    }
  }

  // Öğün ekle/güncelle
  async saveMeal(userId, date, mealType, mealData) {
    const dateStr = this.formatDate(date);
    const nutritionDoc = await this.getDailyNutrition(userId, dateStr);
    
    if (!nutritionDoc) {
      // Yeni gün oluştur
      return this.saveDailyNutrition(userId, date, {
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snack: [],
          [mealType]: mealData
        },
        totals: this.calculateTotals({ [mealType]: mealData })
      });
    }

    // Mevcut güne öğün ekle
    const updatedMeals = {
      ...nutritionDoc.meals,
      [mealType]: mealData
    };

    const updatedTotals = this.calculateTotals(updatedMeals);

    return this.saveDailyNutrition(userId, date, {
      ...nutritionDoc,
      meals: updatedMeals,
      totals: updatedTotals
    });
  }

  // Besin ekle
  async addFoodToMeal(userId, date, mealType, food) {
    const dateStr = this.formatDate(date);
    const nutritionDoc = await this.getDailyNutrition(userId, dateStr);
    
    const currentMeal = nutritionDoc?.meals?.[mealType] || [];
    const updatedMeal = [...currentMeal, {
      ...food,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString()
    }];

    return this.saveMeal(userId, date, mealType, updatedMeal);
  }

  // Günlük beslenme verisi getir
  async getDailyNutrition(userId, dateStr) {
    const docId = `${userId}_${dateStr}`;
    
    try {
      // Önce local cache kontrol et
      const cached = await AsyncStorage.getItem(`nutrition_${docId}`);
      if (cached) {
        const data = JSON.parse(cached);
        
        // Online ise güncel veriyi kontrol et
        if (await this.isOnline()) {
          try {
            const docRef = firestore().collection('daily_nutrition').doc(docId);
            const docSnap = await docRef.get();
            
            if (docSnap.exists) {
              const serverData = docSnap.data();
              // Local'i güncelle
              await AsyncStorage.setItem(`nutrition_${docId}`, JSON.stringify(serverData));
              return serverData;
            }
          } catch (error) {
            console.warn('Server sync failed, using cached data:', error);
          }
        }
        
        return data;
      }

      // Cache'de yoksa ve online ise Firebase'den al
      if (await this.isOnline()) {
        const docRef = firestore().collection('daily_nutrition').doc(docId);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
          const data = docSnap.data();
          // Cache'e kaydet
          await AsyncStorage.setItem(`nutrition_${docId}`, JSON.stringify(data));
          return data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Beslenme verisi alma hatası:', error);
      return null;
    }
  }

  // Tarih aralığında veri getir
  async getNutritionRange(userId, startDate, endDate) {
    const startStr = this.formatDate(startDate);
    const endStr = this.formatDate(endDate);
    
    try {
      if (await this.isOnline()) {
        const querySnapshot = await firestore()
          .collection('daily_nutrition')
          .where('userId', '==', userId)
          .where('date', '>=', startStr)
          .where('date', '<=', endStr)
          .orderBy('date', 'desc')
          .get();
        
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        
        // Cache'e kaydet
        for (const item of data) {
          await AsyncStorage.setItem(
            `nutrition_${item.userId}_${item.date}`, 
            JSON.stringify(item)
          );
        }
        
        return data;
      } else {
        // Offline - local cache'den al
        const keys = await AsyncStorage.getAllKeys();
        const nutritionKeys = keys.filter(key => 
          key.startsWith(`nutrition_${userId}_`) &&
          key >= `nutrition_${userId}_${startStr}` &&
          key <= `nutrition_${userId}_${endStr}`
        );
        
        const data = await AsyncStorage.multiGet(nutritionKeys);
        return data.map(([_, value]) => JSON.parse(value));
      }
    } catch (error) {
      console.error('Tarih aralığı verisi alma hatası:', error);
      return [];
    }
  }

  // Antrenman verisi kaydet
  async saveWorkout(userId, workoutData) {
    const docId = `${userId}_${Date.now()}`;
    
    const data = {
      id: docId,
      userId,
      date: this.formatDate(new Date()),
      timestamp: firestore.FieldValue.serverTimestamp(),
      name: workoutData.name,
      duration: workoutData.duration,
      exercises: workoutData.exercises || [],
      caloriesBurned: workoutData.caloriesBurned || 0,
      notes: workoutData.notes || '',
      completed: workoutData.completed || false
    };

    try {
      if (await this.isOnline()) {
        await firestore().collection('workouts').doc(docId).set(data);
      } else {
        this.addToSyncQueue('workouts', docId, data);
      }
      
      await AsyncStorage.setItem(`workout_${docId}`, JSON.stringify(data));
      
      return { success: true, data };
    } catch (error) {
      console.error('Antrenman kaydetme hatası:', error);
      throw error;
    }
  }

  // Kullanıcı hedefleri
  async saveUserGoals(userId, goals) {
    const data = {
      userId,
      updatedAt: firestore.FieldValue.serverTimestamp(),
      weightGoal: goals.weightGoal,
      targetWeight: goals.targetWeight,
      targetDate: goals.targetDate,
      weeklyGoal: goals.weeklyGoal, // kg/hafta
      calorieGoal: goals.calorieGoal,
      proteinGoal: goals.proteinGoal,
      carbGoal: goals.carbGoal,
      fatGoal: goals.fatGoal,
      waterGoal: goals.waterGoal || 2500, // ml
      workoutGoal: goals.workoutGoal || 3 // haftalık
    };

    try {
      if (await this.isOnline()) {
        await firestore().collection('user_goals').doc(userId).set(data);
      } else {
        this.addToSyncQueue('user_goals', userId, data);
      }
      
      await AsyncStorage.setItem(`goals_${userId}`, JSON.stringify(data));
      
      return { success: true, data };
    } catch (error) {
      console.error('Hedef kaydetme hatası:', error);
      throw error;
    }
  }

  // İlerleme verisi (kilo, ölçümler)
  async saveProgress(userId, progressData) {
    const docId = `${userId}_${Date.now()}`;
    
    const data = {
      id: docId,
      userId,
      date: this.formatDate(new Date()),
      timestamp: firestore.FieldValue.serverTimestamp(),
      weight: progressData.weight,
      bodyFat: progressData.bodyFat,
      measurements: progressData.measurements || {
        chest: null,
        waist: null,
        hips: null,
        arms: null,
        thighs: null
      },
      photos: progressData.photos || [],
      notes: progressData.notes || ''
    };

    try {
      if (await this.isOnline()) {
        await firestore().collection('progress').doc(docId).set(data);
      } else {
        this.addToSyncQueue('progress', docId, data);
      }
      
      await AsyncStorage.setItem(`progress_${docId}`, JSON.stringify(data));
      
      return { success: true, data };
    } catch (error) {
      console.error('İlerleme kaydetme hatası:', error);
      throw error;
    }
  }

  // Sync kuyruğu yönetimi
  addToSyncQueue(collection, docId, data) {
    this.syncQueue.push({
      collection,
      docId,
      data,
      timestamp: Date.now()
    });
    
    // Queue'yu local'e kaydet
    AsyncStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
  }

  async processSyncQueue() {
    if (this.isSyncing || !(await this.isOnline())) return;
    
    this.isSyncing = true;
    
    try {
      const queue = [...this.syncQueue];
      
      for (const item of queue) {
        try {
          await firestore().collection(item.collection).doc(item.docId).set(item.data);
          
          // Başarılı - kuyruktan çıkar
          this.syncQueue = this.syncQueue.filter(q => q !== item);
        } catch (error) {
          console.error('Sync hatası:', error);
        }
      }
      
      // Güncel kuyruğu kaydet
      await AsyncStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    } finally {
      this.isSyncing = false;
    }
  }

  // Su tüketimi güncelle
  async updateWaterIntake(userId, date, waterAmount) {
    const dateStr = this.formatDate(date);
    const nutritionDoc = await this.getDailyNutrition(userId, dateStr);
    
    if (!nutritionDoc) {
      return this.saveDailyNutrition(userId, date, {
        water: waterAmount
      });
    }

    return this.saveDailyNutrition(userId, date, {
      ...nutritionDoc,
      water: waterAmount
    });
  }

  // Kullanıcı hedefleri getir
  async getUserGoals(userId) {
    try {
      // Önce local cache kontrol et
      const cached = await AsyncStorage.getItem(`goals_${userId}`);
      if (cached) {
        const data = JSON.parse(cached);
        
        // Online ise güncel veriyi kontrol et
        if (await this.isOnline()) {
          try {
            const docRef = firestore().collection('user_goals').doc(userId);
            const docSnap = await docRef.get();
            
            if (docSnap.exists) {
              const serverData = docSnap.data();
              await AsyncStorage.setItem(`goals_${userId}`, JSON.stringify(serverData));
              return serverData;
            }
          } catch (error) {
            console.warn('Goals sync failed, using cached data:', error);
          }
        }
        
        return data;
      }

      // Cache'de yoksa ve online ise Firebase'den al
      if (await this.isOnline()) {
        const docRef = firestore().collection('user_goals').doc(userId);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
          const data = docSnap.data();
          await AsyncStorage.setItem(`goals_${userId}`, JSON.stringify(data));
          return data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Hedef alma hatası:', error);
      return null;
    }
  }

  // Antrenman geçmişi getir
  async getWorkoutHistory(userId, limit = 20) {
    try {
      if (await this.isOnline()) {
        const querySnapshot = await firestore()
          .collection('workouts')
          .where('userId', '==', userId)
          .orderBy('timestamp', 'desc')
          .limit(limit)
          .get();
        
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        
        return data;
      } else {
        // Offline - local cache'den al
        const keys = await AsyncStorage.getAllKeys();
        const workoutKeys = keys.filter(key => key.startsWith(`workout_${userId}_`));
        
        const data = await AsyncStorage.multiGet(workoutKeys);
        return data.map(([_, value]) => JSON.parse(value))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limit);
      }
    } catch (error) {
      console.error('Antrenman geçmişi alma hatası:', error);
      return [];
    }
  }

  // Yardımcı fonksiyonlar
  formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  calculateTotals(meals) {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };

    Object.values(meals).forEach(meal => {
      if (Array.isArray(meal)) {
        meal.forEach(food => {
          const serving = food.serving || food;
          totals.calories += serving.calories || 0;
          totals.protein += serving.protein || 0;
          totals.carbs += serving.carbs || 0;
          totals.fat += serving.fat || 0;
          totals.fiber += serving.fiber || 0;
          totals.sugar += serving.sugar || 0;
          totals.sodium += serving.sodium || 0;
        });
      }
    });

    return totals;
  }

  // Cache temizleme (30 günden eski veriler)
  async cleanCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const cutoffDate = this.formatDate(thirtyDaysAgo);
      
      const keysToRemove = keys.filter(key => {
        const match = key.match(/nutrition_.*_(\d{4}-\d{2}-\d{2})/);
        return match && match[1] < cutoffDate;
      });
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
      console.error('Cache temizleme hatası:', error);
    }
  }

  // Sync durumu kontrol et
  getSyncStatus() {
    return {
      isOnline: this.isOnline(),
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length
    };
  }

  // Sync kuyruğunu temizle
  clearSyncQueue() {
    this.syncQueue = [];
    AsyncStorage.removeItem('sync_queue');
  }

  // Sync kuyruğunu yükle
  async loadSyncQueue() {
    try {
      const stored = await AsyncStorage.getItem('sync_queue');
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Sync queue yükleme hatası:', error);
    }
  }
}

export default new DataService(); 