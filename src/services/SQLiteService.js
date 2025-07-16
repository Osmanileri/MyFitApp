import AsyncStorage from '@react-native-async-storage/async-storage';

// Try to import SQLite, but fallback gracefully if not available
let SQLite;
try {
  SQLite = require('expo-sqlite');
} catch (error) {
  console.warn('SQLite module not found, will use AsyncStorage fallback:', error);
  SQLite = null;
}

class SQLiteService {
  constructor() {
    this.isNativeAvailable = this.checkNativeSupport();
    this.db = null;
    this.initialized = false;
    
    // Only try to open database if native SQLite is available
    if (this.isNativeAvailable) {
      try {
        this.db = SQLite.openDatabase('fitapp.db');
      } catch (error) {
        console.warn('Failed to open SQLite database, falling back to AsyncStorage:', error);
        this.isNativeAvailable = false;
        this.db = null;
      }
    }
  }

  // Check if native SQLite is available (not in Expo Go)
  checkNativeSupport() {
    try {
      // Check if SQLite module is available and has required methods
      if (typeof SQLite === 'undefined' || !SQLite) {
        return false;
      }
      
      if (typeof SQLite.openDatabase !== 'function') {
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn('SQLite native module not available, falling back to AsyncStorage:', error);
      return false;
    }
  }

  // Create demo data for fallback mode
  async createDemoData(userId) {
    if (!this.isNativeAvailable) {
      console.log('Creating demo data for fallback mode...');
      
      // Create demo supplements
      const demoSupplements = [
        {
          userId,
          supplementId: 'supplement_demo_1',
          name: 'Vitamin D3',
          dose: '2000 IU',
          time: '08:00',
          taken: false,
          color: '#ff9800',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          userId,
          supplementId: 'supplement_demo_2',
          name: 'Omega-3',
          dose: '1000mg',
          time: '12:00',
          taken: false,
          color: '#4caf50',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          userId,
          supplementId: 'supplement_demo_3',
          name: 'Protein',
          dose: '30g',
          time: '20:00',
          taken: false,
          color: '#9c27b0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Save demo supplements
      for (const supplement of demoSupplements) {
        await this.saveSupplement(userId, supplement);
      }
      
      console.log('Demo data created successfully');
    }
  }

  // Initialize database with all tables
  async initializeDatabase() {
    if (this.initialized) return;

    if (!this.isNativeAvailable) {
      console.warn('Using AsyncStorage fallback for data persistence');
      this.initialized = true;
      
      // Create demo data for demo user
      try {
        await this.createDemoData('demo-user-id');
      } catch (error) {
        console.error('Error creating demo data:', error);
      }
      
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.db.transaction(
        tx => {
          // Users table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              uid TEXT UNIQUE NOT NULL,
              email TEXT UNIQUE NOT NULL,
              displayName TEXT,
              firstName TEXT,
              lastName TEXT,
              age INTEGER,
              gender TEXT,
              height INTEGER,
              weight INTEGER,
              activityLevel TEXT,
              goal TEXT,
              targetWeight INTEGER,
              dailyCalorieGoal INTEGER,
              dailyWaterGoal REAL DEFAULT 2.5,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
          `);

          // Diet data table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS diet_data (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              date TEXT NOT NULL,
              mealType TEXT NOT NULL,
              foodId TEXT,
              foodName TEXT NOT NULL,
              amount REAL NOT NULL,
              unit TEXT DEFAULT 'g',
              calories REAL DEFAULT 0,
              protein REAL DEFAULT 0,
              carbs REAL DEFAULT 0,
              fat REAL DEFAULT 0,
              fiber REAL DEFAULT 0,
              sugar REAL DEFAULT 0,
              sodium REAL DEFAULT 0,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // Water intake table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS water_intake (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              date TEXT NOT NULL,
              amount REAL NOT NULL,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // Workouts table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS workouts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              workoutId TEXT UNIQUE NOT NULL,
              name TEXT NOT NULL,
              date TEXT NOT NULL,
              duration INTEGER DEFAULT 0,
              caloriesBurned REAL DEFAULT 0,
              completed BOOLEAN DEFAULT 0,
              notes TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // Workout exercises table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS workout_exercises (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              workoutId TEXT NOT NULL,
              exerciseId TEXT NOT NULL,
              exerciseName TEXT NOT NULL,
              sets INTEGER DEFAULT 1,
              reps INTEGER DEFAULT 0,
              weight REAL DEFAULT 0,
              duration INTEGER DEFAULT 0,
              restTime INTEGER DEFAULT 0,
              notes TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(workoutId) REFERENCES workouts(workoutId)
            );
          `);

          // Progress table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS progress (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              date TEXT NOT NULL,
              weight REAL,
              bodyFat REAL,
              measurements TEXT,
              photos TEXT,
              notes TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // Recipes table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS recipes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              recipeId TEXT UNIQUE NOT NULL,
              name TEXT NOT NULL,
              description TEXT,
              ingredients TEXT,
              instructions TEXT,
              servings INTEGER DEFAULT 1,
              cookingTime INTEGER DEFAULT 0,
              calories REAL DEFAULT 0,
              protein REAL DEFAULT 0,
              carbs REAL DEFAULT 0,
              fat REAL DEFAULT 0,
              category TEXT,
              tags TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // Reminders table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS reminders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              reminderId TEXT UNIQUE NOT NULL,
              title TEXT NOT NULL,
              description TEXT,
              type TEXT,
              frequency TEXT,
              time TEXT,
              isActive BOOLEAN DEFAULT 1,
              color TEXT,
              icon TEXT,
              completedDates TEXT,
              lastCompleted TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // Supplements table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS supplements (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              supplementId TEXT UNIQUE NOT NULL,
              name TEXT NOT NULL,
              dose TEXT,
              time TEXT,
              taken BOOLEAN DEFAULT 0,
              color TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // Nutrition goals table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS nutrition_goals (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              targetCalories REAL DEFAULT 2000,
              targetProtein REAL DEFAULT 150,
              targetCarbs REAL DEFAULT 250,
              targetFat REAL DEFAULT 65,
              targetFiber REAL DEFAULT 25,
              targetSugar REAL DEFAULT 50,
              targetSodium REAL DEFAULT 2300,
              targetWater REAL DEFAULT 2.5,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // User settings table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS user_settings (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              notifications BOOLEAN DEFAULT 1,
              darkMode BOOLEAN DEFAULT 0,
              language TEXT DEFAULT 'tr',
              units TEXT DEFAULT 'metric',
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(userId) REFERENCES users(uid)
            );
          `);

          // Create indexes for better performance
          tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_diet_user_date ON diet_data(userId, date);`);
          tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_water_user_date ON water_intake(userId, date);`);
          tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_workout_user_date ON workouts(userId, date);`);
          tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_progress_user_date ON progress(userId, date);`);
          tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(userId);`);
          tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_supplements_user ON supplements(userId);`);
        },
        error => {
          console.error('Database initialization error:', error);
          reject(error);
        },
        () => {
          console.log('Database initialized successfully');
          this.initialized = true;
          resolve();
        }
      );
    });
  }

  // Generic database operation methods
  async executeQuery(query, params = []) {
    if (!this.isNativeAvailable) {
      // AsyncStorage fallback - this should not be called directly in fallback mode
      console.warn('executeQuery called in fallback mode, this may not work correctly');
      return Promise.resolve({ rows: { length: 0 } });
    }

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          params,
          (tx, result) => resolve(result),
          (tx, error) => reject(error)
        );
      });
    });
  }

  async insertData(table, data) {
    if (!this.isNativeAvailable) {
      // AsyncStorage fallback
      try {
        const key = `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const dataWithId = { ...data, id: key };
        await AsyncStorage.setItem(key, JSON.stringify(dataWithId));
        return { insertId: key };
      } catch (error) {
        throw error;
      }
    }

    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map(col => data[col]);

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    return this.executeQuery(query, values);
  }

  async updateData(table, data, condition, conditionValues = []) {
    if (!this.isNativeAvailable) {
      // AsyncStorage fallback
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const tableKeys = allKeys.filter(key => key.startsWith(`${table}_`));
        
        for (const key of tableKeys) {
          const itemData = await AsyncStorage.getItem(key);
          if (itemData) {
            const parsedData = JSON.parse(itemData);
            // Simple condition matching (this is a simplified implementation)
            if (condition.includes('=') && conditionValues.length > 0) {
              const [conditionKey] = condition.split('=').map(s => s.trim());
              if (parsedData[conditionKey] === conditionValues[0]) {
                const updatedData = { ...parsedData, ...data };
                await AsyncStorage.setItem(key, JSON.stringify(updatedData));
              }
            }
          }
        }
        return { rowsAffected: 1 };
      } catch (error) {
        throw error;
      }
    }

    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(data), ...(conditionValues || [])];

    const query = `UPDATE ${table} SET ${setClause} WHERE ${condition}`;
    return this.executeQuery(query, values);
  }

  async deleteData(table, condition, params = []) {
    if (!this.isNativeAvailable) {
      // AsyncStorage fallback
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const tableKeys = allKeys.filter(key => key.startsWith(`${table}_`));
        let deletedCount = 0;
        
        for (const key of tableKeys) {
          const itemData = await AsyncStorage.getItem(key);
          if (itemData) {
            const parsedData = JSON.parse(itemData);
            
            // Simple condition matching (this is a simplified implementation)
            if (condition.includes('=') && params.length > 0) {
              const [conditionKey] = condition.split('=').map(s => s.trim());
              if (parsedData[conditionKey] === params[0]) {
                await AsyncStorage.removeItem(key);
                deletedCount++;
              }
            } else if (condition === '1=1') {
              // Delete all items in table
              await AsyncStorage.removeItem(key);
              deletedCount++;
            }
          }
        }
        
        return { rowsAffected: deletedCount };
      } catch (error) {
        throw error;
      }
    }

    const query = `DELETE FROM ${table} WHERE ${condition}`;
    return this.executeQuery(query, params);
  }

  async selectData(table, condition = '', params = []) {
    if (!this.isNativeAvailable) {
      // AsyncStorage fallback
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const tableKeys = allKeys.filter(key => key.startsWith(`${table}_`));
        const items = [];
        
        for (const key of tableKeys) {
          const itemData = await AsyncStorage.getItem(key);
          if (itemData) {
            const parsedData = JSON.parse(itemData);
            
            // Simple condition matching (this is a simplified implementation)
            if (!condition || condition === '') {
              items.push(parsedData);
            } else if (condition.includes('=') && params.length > 0) {
              const [conditionKey] = condition.split('=').map(s => s.trim());
              if (parsedData[conditionKey] === params[0]) {
                items.push(parsedData);
              }
            } else if (condition.includes('userId = ?') && params.length > 0) {
              if (parsedData.userId === params[0]) {
                items.push(parsedData);
              }
            }
          }
        }
        
        return { rows: { length: items.length, item: (i) => items[i] } };
      } catch (error) {
        throw error;
      }
    }

    const query = `SELECT * FROM ${table} ${condition ? 'WHERE ' + condition : ''}`;
    return this.executeQuery(query, params);
  }

  // User operations
  async saveUser(userData) {
    const userToSave = {
      ...userData,
      updatedAt: new Date().toISOString()
    };

    try {
      await this.insertData('users', userToSave);
      return { success: true };
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        // Update existing user
        const { uid, ...updateData } = userToSave;
        await this.updateData('users', updateData, 'uid = ?', [uid]);
        return { success: true };
      }
      throw error;
    }
  }

  async getUser(uid) {
    const result = await this.selectData('users', 'uid = ?', [uid]);
    return result.rows.length > 0 ? result.rows.item(0) : null;
  }

  async updateUser(uid, userData) {
    const updateData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };
    await this.updateData('users', updateData, 'uid = ?', [uid]);
    return { success: true };
  }

  // Diet operations
  async saveDietData(userId, date, mealType, foodData) {
    const dietEntry = {
      userId,
      date,
      mealType,
      foodId: foodData.id || null,
      foodName: foodData.name,
      amount: foodData.amount,
      unit: foodData.unit || 'g',
      calories: foodData.calories || 0,
      protein: foodData.protein || 0,
      carbs: foodData.carbs || 0,
      fat: foodData.fat || 0,
      fiber: foodData.fiber || 0,
      sugar: foodData.sugar || 0,
      sodium: foodData.sodium || 0,
      updatedAt: new Date().toISOString()
    };

    await this.insertData('diet_data', dietEntry);
    return { success: true };
  }

  async getDietData(userId, date) {
    const result = await this.selectData('diet_data', 'userId = ? AND date = ?', [userId, date]);
    const meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };

    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      if (!meals[row.mealType]) meals[row.mealType] = [];
      meals[row.mealType].push(row);
    }

    return meals;
  }

  async deleteDietEntry(id) {
    await this.deleteData('diet_data', 'id = ?', [id]);
    return { success: true };
  }

  async updateDietEntry(id, foodData) {
    const updateData = {
      foodName: foodData.name,
      amount: foodData.amount,
      unit: foodData.unit || 'g',
      calories: foodData.calories || 0,
      protein: foodData.protein || 0,
      carbs: foodData.carbs || 0,
      fat: foodData.fat || 0,
      fiber: foodData.fiber || 0,
      sugar: foodData.sugar || 0,
      sodium: foodData.sodium || 0,
      portion: foodData.portion || 1,
      servingSize: foodData.servingSize || 100,
      updatedAt: new Date().toISOString()
    };

    await this.updateData('diet_data', updateData, 'id = ?', [id]);
    return { success: true };
  }

  // Water intake operations
  async saveWaterIntake(userId, date, amount) {
    const waterEntry = {
      userId,
      date,
      amount,
      updatedAt: new Date().toISOString()
    };

    // Check if entry exists for today
    const existing = await this.selectData('water_intake', 'userId = ? AND date = ?', [userId, date]);
    
    if (existing.rows.length > 0) {
      await this.updateData('water_intake', { amount, updatedAt: new Date().toISOString() }, 'userId = ? AND date = ?', [userId, date]);
    } else {
      await this.insertData('water_intake', waterEntry);
    }

    return { success: true };
  }

  async getWaterIntake(userId, date) {
    const result = await this.selectData('water_intake', 'userId = ? AND date = ?', [userId, date]);
    return result.rows.length > 0 ? result.rows.item(0).amount : 0;
  }

  // Workout operations
  async saveWorkout(userId, workoutData) {
    const workout = {
      userId,
      workoutId: workoutData.workoutId || `workout_${Date.now()}`,
      name: workoutData.name,
      date: workoutData.date,
      duration: workoutData.duration || 0,
      caloriesBurned: workoutData.caloriesBurned || 0,
      completed: workoutData.completed ? 1 : 0,
      notes: workoutData.notes || '',
      updatedAt: new Date().toISOString()
    };

    await this.insertData('workouts', workout);

    // Save exercises if provided
    if (workoutData.exercises && workoutData.exercises.length > 0) {
      for (const exercise of workoutData.exercises) {
        await this.saveWorkoutExercise(workout.workoutId, exercise);
      }
    }

    return { success: true };
  }

  async saveWorkoutExercise(workoutId, exerciseData) {
    const exercise = {
      workoutId,
      exerciseId: exerciseData.exerciseId || `exercise_${Date.now()}`,
      exerciseName: exerciseData.name,
      sets: exerciseData.sets || 1,
      reps: exerciseData.reps || 0,
      weight: exerciseData.weight || 0,
      duration: exerciseData.duration || 0,
      restTime: exerciseData.restTime || 0,
      notes: exerciseData.notes || ''
    };

    await this.insertData('workout_exercises', exercise);
    return { success: true };
  }

  async getWorkouts(userId, limit = 10) {
    const result = await this.selectData('workouts', 'userId = ? ORDER BY date DESC LIMIT ?', [userId, limit]);
    const workouts = [];

    for (let i = 0; i < result.rows.length; i++) {
      const workout = result.rows.item(i);
      
      // Get exercises for this workout
      const exerciseResult = await this.selectData('workout_exercises', 'workoutId = ?', [workout.workoutId]);
      const exercises = [];
      
      for (let j = 0; j < exerciseResult.rows.length; j++) {
        exercises.push(exerciseResult.rows.item(j));
      }
      
      workouts.push({ ...workout, exercises });
    }

    return workouts;
  }

  async deleteWorkout(workoutId) {
    await this.deleteData('workout_exercises', 'workoutId = ?', [workoutId]);
    await this.deleteData('workouts', 'workoutId = ?', [workoutId]);
    return { success: true };
  }

  // Progress operations
  async saveProgress(userId, progressData) {
    const progress = {
      userId,
      date: progressData.date,
      weight: progressData.weight || null,
      bodyFat: progressData.bodyFat || null,
      measurements: progressData.measurements ? JSON.stringify(progressData.measurements) : null,
      photos: progressData.photos ? JSON.stringify(progressData.photos) : null,
      notes: progressData.notes || '',
      updatedAt: new Date().toISOString()
    };

    await this.insertData('progress', progress);
    return { success: true };
  }

  async getProgress(userId, limit = 10) {
    const result = await this.selectData('progress', 'userId = ? ORDER BY date DESC LIMIT ?', [userId, limit]);
    const progressData = [];

    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      progressData.push({
        ...row,
        measurements: row.measurements ? JSON.parse(row.measurements) : null,
        photos: row.photos ? JSON.parse(row.photos) : null
      });
    }

    return progressData;
  }

  // Recipe operations
  async saveRecipe(userId, recipeData) {
    const recipe = {
      userId,
      recipeId: recipeData.recipeId || `recipe_${Date.now()}`,
      name: recipeData.name,
      description: recipeData.description || '',
      ingredients: recipeData.ingredients || '',
      instructions: recipeData.instructions || '',
      servings: recipeData.servings || 1,
      cookingTime: recipeData.cookingTime || 0,
      calories: recipeData.calories || 0,
      protein: recipeData.protein || 0,
      carbs: recipeData.carbs || 0,
      fat: recipeData.fat || 0,
      category: recipeData.category || '',
      tags: recipeData.tags ? JSON.stringify(recipeData.tags) : null,
      updatedAt: new Date().toISOString()
    };

    await this.insertData('recipes', recipe);
    return { success: true };
  }

  async getRecipes(userId) {
    const result = await this.selectData('recipes', 'userId = ? ORDER BY name', [userId]);
    const recipes = [];

    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      recipes.push({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      });
    }

    return recipes;
  }

  async deleteRecipe(recipeId) {
    await this.deleteData('recipes', 'recipeId = ?', [recipeId]);
    return { success: true };
  }

  // Reminder operations
  async saveReminder(userId, reminderData) {
    const reminder = {
      userId,
      reminderId: reminderData.reminderId || `reminder_${Date.now()}`,
      title: reminderData.title,
      description: reminderData.description || '',
      type: reminderData.type || 'general',
      frequency: reminderData.frequency || 'daily',
      time: reminderData.time || '09:00',
      isActive: reminderData.isActive ? 1 : 0,
      color: reminderData.color || '#2196F3',
      icon: reminderData.icon || 'bell',
      completedDates: reminderData.completedDates ? JSON.stringify(reminderData.completedDates) : null,
      lastCompleted: reminderData.lastCompleted || null,
      updatedAt: new Date().toISOString()
    };

    await this.insertData('reminders', reminder);
    return { success: true };
  }

  async getReminders(userId) {
    const result = await this.selectData('reminders', 'userId = ? ORDER BY time', [userId]);
    const reminders = [];

    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      reminders.push({
        ...row,
        isActive: row.isActive === 1,
        completedDates: row.completedDates ? JSON.parse(row.completedDates) : []
      });
    }

    return reminders;
  }

  async updateReminder(reminderId, updateData) {
    const data = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    if (data.completedDates) {
      data.completedDates = JSON.stringify(data.completedDates);
    }
    
    if (data.isActive !== undefined) {
      data.isActive = data.isActive ? 1 : 0;
    }

    await this.updateData('reminders', data, 'reminderId = ?', [reminderId]);
    return { success: true };
  }

  async deleteReminder(reminderId) {
    await this.deleteData('reminders', 'reminderId = ?', [reminderId]);
    return { success: true };
  }

  // Supplement operations
  async saveSupplement(userId, supplementData) {
    const supplement = {
      userId,
      supplementId: supplementData.supplementId || `supplement_${Date.now()}`,
      name: supplementData.name,
      dose: supplementData.dose || '',
      time: supplementData.time || '09:00',
      taken: supplementData.taken ? 1 : 0,
      color: supplementData.color || '#4CAF50',
      updatedAt: new Date().toISOString()
    };

    await this.insertData('supplements', supplement);
    return { success: true };
  }

  async getSupplements(userId) {
    const result = await this.selectData('supplements', 'userId = ? ORDER BY time', [userId]);
    const supplements = [];

    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      supplements.push({
        ...row,
        taken: row.taken === 1
      });
    }

    return supplements;
  }

  async updateSupplement(supplementId, updateData) {
    const data = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    if (data.taken !== undefined) {
      data.taken = data.taken ? 1 : 0;
    }

    await this.updateData('supplements', data, 'supplementId = ?', [supplementId]);
    return { success: true };
  }

  async deleteSupplement(supplementId) {
    await this.deleteData('supplements', 'supplementId = ?', [supplementId]);
    return { success: true };
  }

  // Nutrition goals operations
  async saveNutritionGoals(userId, goalsData) {
    const goals = {
      userId,
      targetCalories: goalsData.targetCalories || 2000,
      targetProtein: goalsData.targetProtein || 150,
      targetCarbs: goalsData.targetCarbs || 250,
      targetFat: goalsData.targetFat || 65,
      targetFiber: goalsData.targetFiber || 25,
      targetSugar: goalsData.targetSugar || 50,
      targetSodium: goalsData.targetSodium || 2300,
      targetWater: goalsData.targetWater || 2.5,
      updatedAt: new Date().toISOString()
    };

    // Check if goals exist
    const existing = await this.selectData('nutrition_goals', 'userId = ?', [userId]);
    
    if (existing.rows.length > 0) {
      await this.updateData('nutrition_goals', goals, 'userId = ?', [userId]);
    } else {
      await this.insertData('nutrition_goals', goals);
    }

    return { success: true };
  }

  async getNutritionGoals(userId) {
    const result = await this.selectData('nutrition_goals', 'userId = ?', [userId]);
    return result.rows.length > 0 ? result.rows.item(0) : null;
  }

  // User settings operations
  async saveUserSettings(userId, settingsData) {
    const settings = {
      userId,
      notifications: settingsData.notifications ? 1 : 0,
      darkMode: settingsData.darkMode ? 1 : 0,
      language: settingsData.language || 'tr',
      units: settingsData.units || 'metric',
      updatedAt: new Date().toISOString()
    };

    // Check if settings exist
    const existing = await this.selectData('user_settings', 'userId = ?', [userId]);
    
    if (existing.rows.length > 0) {
      await this.updateData('user_settings', settings, 'userId = ?', [userId]);
    } else {
      await this.insertData('user_settings', settings);
    }

    return { success: true };
  }

  async getUserSettings(userId) {
    const result = await this.selectData('user_settings', 'userId = ?', [userId]);
    if (result.rows.length > 0) {
      const row = result.rows.item(0);
      return {
        ...row,
        notifications: row.notifications === 1,
        darkMode: row.darkMode === 1
      };
    }
    return null;
  }

  // Utility methods
  async clearAllData() {
    const tables = [
      'diet_data', 'water_intake', 'workouts', 'workout_exercises', 
      'progress', 'recipes', 'reminders', 'supplements', 
      'nutrition_goals', 'user_settings'
    ];

    for (const table of tables) {
      await this.deleteData(table, '1=1');
    }

    return { success: true };
  }

  async clearUserData(userId) {
    const tables = [
      'diet_data', 'water_intake', 'workouts', 'progress', 
      'recipes', 'reminders', 'supplements', 'nutrition_goals', 
      'user_settings'
    ];

    for (const table of tables) {
      await this.deleteData(table, 'userId = ?', [userId]);
    }

    // Clear workout exercises
    await this.executeQuery(`
      DELETE FROM workout_exercises 
      WHERE workoutId IN (
        SELECT workoutId FROM workouts WHERE userId = ?
      )
    `, [userId]);

    return { success: true };
  }
}

// Create singleton instance
const sqliteService = new SQLiteService();
export default sqliteService; 