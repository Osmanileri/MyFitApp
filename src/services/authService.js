import AsyncStorage from '@react-native-async-storage/async-storage';
// import CryptoJS from 'crypto-js'; // Geçici olarak devre dışı

const STORAGE_KEYS = {
  USER: '@diet_app_user',
  TOKEN: '@diet_app_token',
  USERS_DB: '@diet_app_users_db',
};

const SECRET_KEY = 'fitapp_secret_key_2024_secure'; // In production, use environment variable

class AuthService {
  // Encrypt sensitive data (simplified for demo)
  encrypt(data) {
    return btoa(data + SECRET_KEY); // Base64 encoding for demo
  }

  // Decrypt sensitive data (simplified for demo)
  decrypt(encryptedData) {
    try {
      const decoded = atob(encryptedData);
      return decoded.replace(SECRET_KEY, '');
    } catch (error) {
      console.error('Decrypt error:', error);
      return '';
    }
  }

  // Generate simple JWT-like token
  generateToken(userId) {
    const payload = {
      userId,
      timestamp: Date.now(),
      expiresIn: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };
    return this.encrypt(JSON.stringify(payload));
  }

  // Validate token
  validateToken(token) {
    try {
      const decrypted = this.decrypt(token);
      const payload = JSON.parse(decrypted);
      return payload.expiresIn > Date.now();
    } catch {
      return false;
    }
  }

  // Get user ID from token
  getUserIdFromToken(token) {
    try {
      const decrypted = this.decrypt(token);
      const payload = JSON.parse(decrypted);
      return payload.userId;
    } catch {
      return null;
    }
  }

  // Hash password (simplified for demo)
  hashPassword(password) {
    // Basit hash fonksiyonu - sadece demo için
    let hash = 0;
    const str = password + SECRET_KEY;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32-bit integer'a çevir
    }
    return hash.toString();
  }

  // Get users database
  async getUsersDB() {
    try {
      const usersDB = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      return usersDB ? JSON.parse(usersDB) : {};
    } catch {
      return {};
    }
  }

  // Save users database
  async saveUsersDB(usersDB) {
    await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDB));
  }

  // Clear users database (for development)
  async clearUsersDB() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USERS_DB);
      console.log('Users database cleared');
    } catch (error) {
      console.error('Error clearing users DB:', error);
    }
  }

  // Initialize demo users if database is empty
  async initializeDemoUsers() {
    try {
      console.log('Initializing demo users...');
      
      // Geliştirme aşamasında eski verileri temizle
      await this.clearUsersDB();
      
      const usersDB = await this.getUsersDB();
      console.log('Current users DB:', Object.keys(usersDB));
      
      // Check if demo user already exists
      if (!usersDB['demo@fitapp.com']) {
        console.log('Creating demo user...');
        const demoUser = {
          id: 'demo_user_1',
          name: 'Demo Kullanıcı',
          email: 'demo@fitapp.com',
          age: 30,
          weight: 70,
          height: 175,
          gender: 'male',
          activityLevel: 'moderate',
          goal: 'maintain',
          dailyCalorieGoal: 2200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Demo için basit şifre kullanıyoruz
        console.log('Creating demo user with simple password');

        usersDB['demo@fitapp.com'] = {
          ...demoUser,
          password: 'demo123', // Geliştirme aşaması için plain text
        };

        await this.saveUsersDB(usersDB);
        console.log('Demo user initialized successfully');
      } else {
        console.log('Demo user already exists');
      }
      
      // Also add test user
      if (!usersDB['test@fitapp.com']) {
        console.log('Creating test user...');
        const testUser = {
          id: 'test_user_1',
          name: 'Test Kullanıcı',
          email: 'test@fitapp.com',
          age: 25,
          weight: 65,
          height: 170,
          gender: 'female',
          activityLevel: 'active',
          goal: 'lose',
          dailyCalorieGoal: 1800,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        usersDB['test@fitapp.com'] = {
          ...testUser,
          password: 'test123', // Geliştirme aşaması için plain text
        };

        await this.saveUsersDB(usersDB);
        console.log('Test user initialized successfully');
      } else {
        console.log('Test user already exists');
      }
    } catch (error) {
      console.error('Error initializing demo users:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData) {
    try {
      await this.initializeDemoUsers();
      
      const { name, email, password, confirmPassword } = userData;

      // Validation
      if (!name || !email || !password) {
        return { success: false, error: 'Tüm alanları doldurun' };
      }

      if (password !== confirmPassword) {
        return { success: false, error: 'Şifreler eşleşmiyor' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Şifre en az 6 karakter olmalı' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Geçerli bir email adresi girin' };
      }

      const usersDB = await this.getUsersDB();

      // Check if user already exists
      if (usersDB[email.toLowerCase()]) {
        return { success: false, error: 'Bu email adresi zaten kayıtlı' };
      }

      // Create new user
      const userId = Date.now().toString();
      const hashedPassword = this.hashPassword(password);
      
      const newUser = {
        id: userId,
        name,
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save user to database
      usersDB[email.toLowerCase()] = {
        ...newUser,
        password: hashedPassword,
      };

      await this.saveUsersDB(usersDB);

      // Generate token and save user session
      const token = this.generateToken(userId);
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Kayıt sırasında bir hata oluştu' };
    }
  }

  // Login user
  async login(credentials) {
    try {
      console.log('Login attempt with:', credentials.email);
      await this.initializeDemoUsers();
      
      const { email, password } = credentials;

      if (!email || !password) {
        console.log('Missing email or password');
        return { success: false, error: 'Email ve şifre gerekli' };
      }

      const usersDB = await this.getUsersDB();
      console.log('Available users:', Object.keys(usersDB));
      
      const userData = usersDB[email.toLowerCase()];
      console.log('Found user data:', userData ? 'Yes' : 'No');

      if (!userData) {
        console.log('User not found for email:', email.toLowerCase());
        return { success: false, error: 'Kullanıcı bulunamadı' };
      }

      // Geliştirme aşaması için basitleştirilmiş şifre kontrolü
      let passwordMatch = false;
      
      if (email.toLowerCase() === 'demo@fitapp.com' || email.toLowerCase() === 'test@fitapp.com') {
        // Demo hesaplar için direkt şifre kontrolü
        passwordMatch = userData.password === password;
        console.log('Demo account password check:', passwordMatch);
      } else {
        // Normal hesaplar için hash kontrolü
        const hashedPassword = this.hashPassword(password);
        passwordMatch = userData.password === hashedPassword;
        console.log('Normal account password check:', passwordMatch);
      }
      
      if (!passwordMatch) {
        console.log('Password mismatch');
        return { success: false, error: 'Yanlış şifre' };
      }

      // Remove password from user object
      const { password: _, ...user } = userData;

      // Generate token and save user session
      const token = this.generateToken(user.id);
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      console.log('Login successful for:', user.name);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Giriş sırasında bir hata oluştu: ' + error.message };
    }
  }

  // Logout user
  async logout() {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
  }

  // Get current user
  async getCurrentUser() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token || !this.validateToken(token)) {
        await this.logout();
        return null;
      }

      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
      }

      const usersDB = await this.getUsersDB();
      const userData = usersDB[currentUser.email];

      if (!userData) {
        return { success: false, error: 'Kullanıcı bulunamadı' };
      }

      // Update user data
      const updatedUser = {
        ...userData,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Remove password from response
      const { password, ...userResponse } = updatedUser;

      // Save to database
      usersDB[currentUser.email] = updatedUser;
      await this.saveUsersDB(usersDB);

      // Update stored user
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userResponse));

      return { success: true, user: userResponse };
    } catch (error) {
      return { success: false, error: 'Profil güncellenirken hata oluştu' };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
      }

      const usersDB = await this.getUsersDB();
      const userData = usersDB[currentUser.email];

      if (!userData) {
        return { success: false, error: 'Kullanıcı bulunamadı' };
      }

      // Verify current password
      const hashedCurrentPassword = this.hashPassword(currentPassword);
      if (userData.password !== hashedCurrentPassword) {
        return { success: false, error: 'Mevcut şifre yanlış' };
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'Yeni şifre en az 6 karakter olmalı' };
      }

      // Update password
      userData.password = this.hashPassword(newPassword);
      userData.updatedAt = new Date().toISOString();

      await this.saveUsersDB(usersDB);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Şifre değiştirilirken hata oluştu' };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Reset password (mock implementation)
  async resetPassword(email) {
    try {
      await this.initializeDemoUsers();
      
      const usersDB = await this.getUsersDB();
      const userData = usersDB[email.toLowerCase()];

      if (!userData) {
        return { success: false, error: 'Bu email adresi kayıtlı değil' };
      }

      // In a real app, this would send an email
      // For demo purposes, we'll just return success
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Şifre sıfırlama e-postası gönderilemedi' };
    }
  }
}

export default new AuthService(); 