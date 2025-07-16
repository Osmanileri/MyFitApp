# Firebase Demo Hesap Kurulum Rehberi

## 📋 İçindekiler
1. [Gereksinimler](#gereksinimler)
2. [Firebase Kurulumu](#firebase-kurulumu)
3. [Demo Hesap Oluşturma](#demo-hesap-oluşturma)
4. [Test Senaryoları](#test-senaryoları)
5. [Sorun Giderme](#sorun-giderme)
6. [Güvenlik Kuralları](#güvenlik-kuralları)

## 🔧 Gereksinimler

### Sistem Gereksinimleri
- Node.js 14.0.0 veya üzeri
- npm 6.0.0 veya üzeri
- React Native CLI
- Firebase CLI
- Firebase Console erişimi

### Paket Kontrol Listesi
```bash
# Zaten yüklü paketler (package.json'dan)
✅ @react-native-firebase/app: ^22.4.0
✅ @react-native-firebase/auth: ^22.4.0
✅ @react-native-firebase/firestore: ^22.4.0
✅ @react-native-picker/picker: ^2.11.1
✅ @react-navigation/stack: ^7.4.2
✅ react-native-screens: ^4.11.1
✅ react-native-safe-area-context: 5.4.0
✅ react-native-gesture-handler: ~2.24.0
```

## 🚀 Firebase Kurulumu

### 1. Firebase Console Kurulumu

1. **Firebase Console'a gidin**: https://console.firebase.google.com/
2. **Yeni proje oluşturun** veya mevcut projeyi seçin
3. **Authentication'ı etkinleştirin**:
   - Authentication → Sign-in method
   - Email/Password provider'ı etkinleştirin

4. **Firestore'u etkinleştirin**:
   - Firestore Database → Create database
   - Test mode'da başlayın (güvenlik kurallarını sonra güncellersiniz)

### 2. Firebase Config Dosyalarını İndirin

#### iOS için:
```bash
# Firebase Console → Project Settings → iOS apps
# GoogleService-Info.plist dosyasını indirin
# ios/FitApp/ klasörüne kopyalayın
```

#### Android için:
```bash
# Firebase Console → Project Settings → Android apps
# google-services.json dosyasını indirin
# android/app/ klasörüne kopyalayın
```

### 3. Firebase Configuration Dosyasını Güncelleyin

```javascript
// src/config/firebase.js
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Firebase'i initialize etmek için gerekli değil (RN Firebase otomatik yapar)
// const app = initializeApp(firebaseConfig);

export { auth, firestore };
```

### 4. iOS Setup (Expo değil, bare React Native için)

```bash
# iOS klasörüne git
cd ios

# Pods yükle
pod install

# Xcode'da Info.plist'i aç ve GoogleService-Info.plist'i ekle
# (Xcode'da manuel olarak drag & drop yapın)
```

### 5. Android Setup

```bash
# android/build.gradle (project-level)
dependencies {
    classpath 'com.google.gms:google-services:4.3.13'
}

# android/app/build.gradle (app-level)
apply plugin: 'com.google.gms.google-services'
```

## 📝 Demo Hesap Oluşturma

### Manuel Oluşturma (Firebase Console)

1. **Authentication → Users → Add user**
2. **Kullanıcı bilgileri**:
   - Email: demo@fitapp.com
   - Password: demo123
   - Display Name: Demo User

3. **Firestore'da user profile oluştur**:
   ```javascript
   // Collection: users
   // Document ID: [Firebase Auth User UID]
   {
     uid: "demo-user-uid",
     email: "demo@fitapp.com",
     displayName: "Demo User",
     firstName: "Demo",
     lastName: "User",
     age: 25,
     gender: "male",
     height: 175,
     weight: 70,
     activityLevel: "moderate",
     goal: "maintain",
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString()
   }
   ```

### Otomatik Oluşturma (Firebase Admin SDK)

```bash
# Scripts klasörüne git
cd scripts

# Dependencies yükle
npm install

# Service account key dosyasını indirin
# Firebase Console → Project Settings → Service accounts
# Generate new private key → serviceAccountKey.json olarak kaydedin

# Demo hesap oluştur
npm run create-demo

# Birden fazla demo hesap oluştur
npm run create-multiple
```

### Script Komutları

```bash
# Demo hesap oluştur
node createDemoAccount.js

# Birden fazla demo hesap oluştur
node createDemoAccount.js --multiple

# Demo hesap sil
node deleteDemoAccount.js

# Birden fazla demo hesap sil
node deleteDemoAccount.js --multiple

# Orphaned data temizle
node deleteDemoAccount.js --cleanup

# Demo hesap doğrula
node verifyDemoAccount.js

# Tüm demo hesapları doğrula
node verifyDemoAccount.js --multiple

# Güvenlik kurallarını kontrol et
node verifyDemoAccount.js --security

# Sistem health raporu
node verifyDemoAccount.js --health

# Tüm kontrolleri yap
node verifyDemoAccount.js --all
```

## 🧪 Test Senaryoları

### 1. Authentication Test Checklist

#### Kayıt Testi
- [ ] **Başarılı kayıt**: Yeni kullanıcı email/password ile kayıt olabilir
- [ ] **Email validation**: Geçersiz email formatı reddedilir
- [ ] **Password validation**: Zayıf şifre reddedilir
- [ ] **Duplicate email**: Aynı email ile ikinci kayıt reddedilir
- [ ] **Firestore profile**: Kayıt sonrası user profile oluşturulur
- [ ] **Form validation**: Eksik alanlar için hata mesajı gösterilir

#### Giriş Testi
- [ ] **Başarılı giriş**: Doğru email/password ile giriş yapılabilir
- [ ] **Demo account giriş**: demo@fitapp.com / demo123 ile giriş yapılabilir
- [ ] **Hatalı credentials**: Yanlış email/password reddedilir
- [ ] **Firestore data**: Giriş sonrası user data çekilir
- [ ] **State management**: Auth state doğru güncellenir
- [ ] **Persistent session**: Uygulama yeniden başlatıldığında session korunur

#### Çıkış Testi
- [ ] **Başarılı çıkış**: Logout butonu çalışır
- [ ] **State cleanup**: Auth state temizlenir
- [ ] **Navigation**: Login ekranına yönlendirme yapılır
- [ ] **AsyncStorage**: Persistent data temizlenir

#### Şifre Sıfırlama Testi
- [ ] **Email gönderme**: Reset email başarıyla gönderilir
- [ ] **Email validation**: Geçersiz email reddedilir
- [ ] **Firebase email**: Firebase email template'i çalışır
- [ ] **Error handling**: Hataları doğru gösterilir

### 2. Firestore Data Test Checklist

#### User Profile
- [ ] **Profile creation**: Kayıt sonrası profile oluşturulur
- [ ] **Profile update**: Profil güncelleme çalışır
- [ ] **Data validation**: Geçersiz data reddedilir
- [ ] **Field completeness**: Tüm gerekli alanlar mevcut

#### Daily Data
- [ ] **Meal tracking**: Yemek ekleme/çıkarma çalışır
- [ ] **Calorie calculation**: Kalori hesaplama doğru
- [ ] **Macro tracking**: Protein/karbonhidrat/yağ tracking
- [ ] **Water intake**: Su tüketimi tracking

#### Workout Data
- [ ] **Exercise logging**: Egzersiz kayıt etme
- [ ] **Set tracking**: Set/rep/weight tracking
- [ ] **Duration tracking**: Egzersiz süresi tracking
- [ ] **Workout completion**: Antrenman tamamlama

#### Progress Data
- [ ] **Weight tracking**: Kilo takibi
- [ ] **Measurement tracking**: Vücut ölçüleri
- [ ] **Photo upload**: İlerleme fotoğrafları
- [ ] **Notes**: Notlar ekleme

### 3. Security Test Checklist

#### Authentication Security
- [ ] **Unauthorized access**: Giriş yapmadan data erişimi engellenir
- [ ] **Cross-user access**: Kullanıcı başka kullanıcının datasına erişemez
- [ ] **Token validation**: Geçersiz token reddedilir
- [ ] **Session expiry**: Session süresi dolduktan sonra yeniden giriş gerekir

#### Firestore Security
- [ ] **Read rules**: Sadece kendi datasını okuyabilir
- [ ] **Write rules**: Sadece kendi datasını yazabilir
- [ ] **Field validation**: Geçersiz field'lar reddedilir
- [ ] **Demo account**: Demo hesap özel iznleri çalışır

### 4. Performance Test Checklist

#### Loading Performance
- [ ] **Fast login**: Giriş 2 saniyeden az sürer
- [ ] **Data loading**: İlk data yükleme 3 saniyeden az sürer
- [ ] **Offline support**: Offline durumda cached data gösterilir
- [ ] **Sync performance**: Online döndükten sonra sync hızlı

#### Memory Performance
- [ ] **Memory leaks**: Bellek sızıntısı yok
- [ ] **State cleanup**: Component unmount'da cleanup yapılır
- [ ] **Cache management**: Gereksiz cache temizlenir

## 🔒 Güvenlik Kuralları

### Firestore Security Rules Deployment

```bash
# Firebase CLI yükle
npm install -g firebase-tools

# Firebase'e login
firebase login

# Projeyi initialize et
firebase init firestore

# Security rules dosyasını düzenle
# firestore.rules dosyasını kopyalayın

# Security rules deploy et
firebase deploy --only firestore:rules
```

### Güvenlik Kuralları Test Etme

```bash
# Firestore Emulator ile test
firebase emulators:start --only firestore

# Rules test et
firebase emulators:exec --only firestore "npm run test:security"
```

## 🔧 Sorun Giderme

### Yaygın Hatalar ve Çözümleri

#### 1. Firebase Not Initialized
```
Hata: Firebase not initialized
Çözüm: App.js'in en üstüne import './src/config/firebase'; ekleyin
```

#### 2. Picker Görünmüyor
```
Hata: Picker bileşeni görünmüyor
Çözüm: 
cd ios && pod install
npx react-native run-ios
```

#### 3. Navigation Hataları
```
Hata: Navigation stack hataları
Çözüm: 
npm install react-native-screens react-native-safe-area-context
cd ios && pod install
```

#### 4. Auth State Persistence
```
Hata: Uygulama açılışında auth state kaybolur
Çözüm: authStore.js'de persist middleware'i kontrol edin
```

#### 5. Firestore Permission Denied
```
Hata: Missing or insufficient permissions
Çözüm: Security rules'ı kontrol edin ve deploy edin
```

#### 6. Demo Account Not Found
```
Hata: Demo hesap bulunamıyor
Çözüm: 
cd scripts
npm run create-demo
```

### Debug Komutları

```bash
# Firebase debug
firebase debug

# React Native debug
npx react-native log-android
npx react-native log-ios

# Metro bundler debug
npx react-native start --reset-cache

# Build cache temizle
cd android && ./gradlew clean
cd ios && rm -rf build/ && pod install
```

### Log Analizi

```bash
# Firebase console'da logs
# https://console.firebase.google.com/project/your-project/logs

# React Native logs
adb logcat *:S ReactNative:V ReactNativeJS:V

# iOS logs
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "FitApp"'
```

## 📊 Monitoring ve Analytics

### Firebase Analytics Setup

```javascript
// src/utils/analytics.js
import analytics from '@react-native-firebase/analytics';

export const logEvent = async (eventName, parameters = {}) => {
  try {
    await analytics().logEvent(eventName, parameters);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Usage
logEvent('login', { method: 'email' });
logEvent('signup', { method: 'email' });
logEvent('workout_complete', { exercises: 5, duration: 30 });
```

### Performance Monitoring

```javascript
// src/utils/performance.js
import perf from '@react-native-firebase/perf';

export const startTrace = async (traceName) => {
  const trace = perf().newTrace(traceName);
  await trace.start();
  return trace;
};

export const stopTrace = async (trace) => {
  await trace.stop();
};

// Usage
const trace = await startTrace('login_process');
// ... login logic
await stopTrace(trace);
```

## 🚀 Production Deployment

### Production Checklist

#### Firebase Configuration
- [ ] **Production Firebase project** oluşturuldu
- [ ] **Production config files** (GoogleService-Info.plist, google-services.json) güncellendi
- [ ] **Security rules** production'a deploy edildi
- [ ] **Firestore indexes** oluşturuldu

#### Authentication
- [ ] **Email verification** etkinleştirildi
- [ ] **Password reset** email template'i özelleştirildi
- [ ] **OAuth providers** (Google, Facebook) eklendi
- [ ] **Rate limiting** etkinleştirildi

#### Security
- [ ] **Security rules** comprehensive testing yapıldı
- [ ] **API keys** güvenli şekilde saklandı
- [ ] **App Check** etkinleştirildi
- [ ] **Audit logs** etkinleştirildi

#### Performance
- [ ] **Firestore indexes** optimize edildi
- [ ] **Bundle size** minimize edildi
- [ ] **Caching strategy** implement edildi
- [ ] **Offline support** test edildi

#### Monitoring
- [ ] **Crashlytics** etkinleştirildi
- [ ] **Performance monitoring** etkinleştirildi
- [ ] **Analytics** kuruldu
- [ ] **Alert rules** oluşturuldu

## 📞 Destek ve Kaynaklar

### Dokümantasyon
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Topluluk
- [Firebase Discord](https://discord.gg/firebase)
- [React Native Firebase GitHub](https://github.com/invertase/react-native-firebase)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

### Hata Raporlama
Herhangi bir sorunla karşılaştığınızda:
1. Konsol loglarını kontrol edin
2. Firebase Console'da error logs'u inceleyin
3. GitHub Issues'da benzer problemleri arayın
4. Detaylı hata raporu ile issue açın

---

**🎉 Kurulum tamamlandı!** Firebase Auth sistemi artık tamamen çalışır durumda. Demo hesapları test ederek sisteminizi doğrulayabilirsiniz. 