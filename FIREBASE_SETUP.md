# Firebase Kurulumu

## Hızlı Başlangıç

1. **Firebase Console'a gidin**: https://console.firebase.google.com
2. **Yeni proje oluşturun** veya mevcut projeyi seçin
3. **Web uygulaması ekleyin** (</> simgesi)
4. **Konfigürasyon değerlerini kopyalayın**

## Konfigürasyon Değiştirme

`src/config/firebase.js` dosyasını açın ve aşağıdaki değerleri Firebase Console'dan aldığınız değerlerle değiştirin:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

## Firebase Servisleri Aktifleştirme

### 1. Authentication
- Firebase Console > Authentication > Get Started
- Sign-in method > Email/Password > Enable

### 2. Firestore Database
- Firebase Console > Firestore Database > Create Database
- Test mode'da başlayın (güvenlik kuralları daha sonra eklenecek)

### 3. Güvenlik Kuralları
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /dailyData/{date} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Test Etme

1. Uygulamayı başlatın: `npx expo start`
2. Kayıt ol sayfasında yeni hesap oluşturun
3. Firestore Console'da kullanıcı verilerinin oluştuğunu kontrol edin

## Sorun Giderme

- **Bağlantı Hatası**: Internet bağlantınızı kontrol edin
- **Auth Hatası**: Email/Password authentication aktif mi?
- **Firestore Hatası**: Database oluşturuldu mu?
- **Güvenlik Hatası**: Güvenlik kuralları doğru mu?

## Demo Veriler

Uygulama şu anda demo konfigürasyonu kullanıyor. Gerçek Firebase projesi bağlamadan bazı özellikler çalışmayabilir. 