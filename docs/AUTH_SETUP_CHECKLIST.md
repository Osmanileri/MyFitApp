# 🔐 Authentication Setup Checklist - Uygulamayı Çalıştırma Rehberi

**Hedef:** Supabase Authentication'ı uygulamada çalışır hale getirmek  
**Tahmini Süre:** 15-20 dakika

---

## ✅ Checklist Overview

- [ ] **Adım 1:** Supabase Dashboard'da Email Auth'u aktifleştir
- [ ] **Adım 2:** Database'de `user_profiles` tablosu oluştur
- [ ] **Adım 3:** Row Level Security (RLS) policies ekle
- [ ] **Adım 4:** App.js'i auth state için güncelle
- [ ] **Adım 5:** İlk testi yap (Register + Login)
- [ ] **Adım 6:** Demo mode'u kapat/aç (isteğe bağlı)

---

## 📋 Adım 1: Supabase Dashboard - Email Authentication

### 1.1 Supabase Dashboard'a Git

```
https://supabase.com/dashboard/project/nqsvaqeiaovhnlolvixb
```

### 1.2 Authentication Ayarları

1. Sol menüden **Authentication** → **Providers** tıklayın
2. **Email** provider'ını bulun
3. **Enable Email provider**ToggleSwitch'ini **AÇIK** (enabled) yapın

### 1.3 Email Verification Ayarı (ÖNEMLİ!)

**Test için önerilen ayar:**

```
☑️ Enable Email provider
☐ Confirm email (KAPALI - test için hızlı)
```

**Neden kapalı?**

- Test ederken email doğrulamasını beklemek zorunda kalmazsınız
- Hemen register → login yapabilirsiniz
- Production'da açarsınız

**Ayarı yapmak için:**

1. **Authentication** → **Providers** → **Email**
2. **Confirm email** seçeneğini **KAPALI** yapın
3. **Save** butonuna tıklayın

### 1.4 Site URL Ayarı

1. **Authentication** → **URL Configuration** gidin
2. **Site URL:** `exp://localhost:19000` (Expo için)
3. **Redirect URLs:** Şimdilik boş bırakabilirsiniz
4. **Save** tıklayın

---

## 📋 Adım 2: Database - user_profiles Tablosu Oluştur

### 2.1 SQL Editor'e Git

1. Sol menüden **SQL Editor** tıklayın
2. **New query** butonuna tıklayın

### 2.2 Tabloyu Oluştur (SQL)

Aşağıdaki SQL kodunu yapıştırın ve **RUN** edin:

```sql
-- user_profiles tablosu oluştur
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  height_cm DECIMAL(5,2),
  current_weight_kg DECIMAL(5,2),
  goal_weight_kg DECIMAL(5,2),
  activity_level TEXT,
  health_goal TEXT,
  daily_calorie_goal INTEGER,
  protein_goal_g INTEGER,
  carbs_goal_g INTEGER,
  fat_goal_g INTEGER,
  fiber_goal_g INTEGER,
  water_goal_ml INTEGER DEFAULT 2000,
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
```

### 2.3 Başarı Kontrolü

✅ Query başarılıyla çalıştı mı?

- **Success** mesajı görmelisiniz
- Sol tarafta **Tables** altında `user_profiles` görünmelidir

---

## 📋 Adım 3: Row Level Security (RLS) Policies

### 3.1 RLS'i Aktifleştir

SQL Editor'de çalıştırın:

```sql
-- RLS'i aktifleştir
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### 3.2 Policies Ekle (4 Policy - ÖNEMLİ!)

Kullanıcılar sadece kendi verilerine erişebilsin:

**⚠️ NOT:** Aşağıdaki SQL'i **TEK SEFERDE** çalıştırın (4 policy birden):

```sql
-- 1️⃣ SELECT Policy: Kullanıcılar kendi profilini görebilir
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 2️⃣ INSERT Policy: Kullanıcılar kendi profilini oluşturabilir
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3️⃣ UPDATE Policy: Kullanıcılar kendi profilini güncelleyebilir
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4️⃣ DELETE Policy: Kullanıcılar kendi profilini silebilir (ÖNEMLİ!)
CREATE POLICY "Users can delete own profile"
ON user_profiles
FOR DELETE
USING (auth.uid() = user_id);
```

**✅ Başarı Kontrolü:**

- SQL çalıştıktan sonra "Success. 4 rows" gibi bir mesaj görmelisiniz
- Her policy için ayrı success mesajı gelecek

### 3.3 Policy Kontrolü

1. **Database** → **Tables** → **user_profiles** tıklayın
2. **Policies** tab'ına gidin
3. **Tam 4 policy** görmelisiniz:
   - ✅ Users can view own profile (SELECT)
   - ✅ Users can insert own profile (INSERT)
   - ✅ Users can update own profile (UPDATE)
   - ✅ **Users can delete own profile (DELETE)** ← Bu önemli!

**⚠️ Eğer 4'ten az policy görüyorsanız:**

- SQL Editor'e geri dönün
- Adım 3.2'deki SQL'i tekrar çalıştırın
- Hata mesajı "already exists" gelirse sorun yok, devam edin

---

## 📋 Adım 4: App.js - Auth State Management

### 4.1 App.js Dosyası ✅ GÜNCELLEME YAPILDI!

**✅ BU ADIM TAMAMLANDI!**

App.js dosyası Supabase authentication için otomatik olarak güncellendi.

**Yapılan değişiklikler:**

- ✅ `checkSession()` eklendi (session restore)
- ✅ `initializeAuth()` eklendi (auth state listener)
- ✅ Console logları eklendi (debug için)

**Kontrol etmek isterseniz:**
`App.js` dosyasını açın, satır 121-145 arası şu kodu görmelisiniz:

```javascript
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import useAuthStore from "./src/store/authStore";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MainTabs from "./src/navigation/MainTabs"; // Ana uygulama

const Stack = createStackNavigator();

export default function App() {
  const { isAuthenticated, initializeAuth, checkSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auth durumunu kontrol et
    const initAuth = async () => {
      await checkSession(); // Stored session'ı kontrol et
      initializeAuth(); // Auth state listener başlat
      setIsLoading(false);
    };

    initAuth();
  }, []);

  if (isLoading) {
    return null; // veya Loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Kullanıcı giriş yapmış
          <Stack.Screen name="MainApp" component={MainTabs} />
        ) : (
          // Kullanıcı giriş yapmamış
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 4.2 MainTabs.js Kontrol

Ana uygulama navigation'ınız (Bottom Tabs) hazır mı?

Yoksa basit bir örnek:

```javascript
// src/navigation/MainTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import DietScreen from "../screens/DietScreen";
import WorkoutScreen from "../screens/WorkoutScreen";
import ProgressScreen from "../screens/ProgressScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Diet") iconName = "nutrition";
          else if (route.name === "Workout") iconName = "barbell";
          else if (route.name === "Progress") iconName = "stats-chart";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Diet" component={DietScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

---

## 📋 Adım 5: İlk Test - Register & Login

### 5.1 Uygulamayı Başlat

```bash
npm start
```

veya

```bash
npx expo start
```

### 5.2 Register (Kayıt Ol) Testi

1. **Register** ekranına gidin
2. Test kullanıcısı oluşturun:

   ```
   Ad: Test
   Soyad: User
   Email: test@fitapp.com
   Şifre: TestPass123
   Şifre Tekrar: TestPass123
   ```

3. **Kayıt Ol** butonuna tıklayın

**Beklenen Sonuç:**

```
✅ "Hesabınız başarıyla oluşturuldu!" mesajı
✅ Login ekranına yönlendirilme
```

**Eğer hata alırsanız:**

- Console'u kontrol edin (Expo DevTools)
- Supabase Dashboard → **Authentication** → **Users** kontrol edin
- Kullanıcı oluştu mu?

### 5.3 Login (Giriş) Testi

1. Login ekranında aynı bilgilerle giriş yapın:

   ```
   Email: test@fitapp.com
   Şifre: TestPass123
   ```

2. **Giriş Yap** butonuna tıklayın

**Beklenen Sonuç:**

```
✅ Ana uygulamaya yönlendirilme (MainTabs)
✅ Console'da: "✅ Login successful with Supabase"
✅ Console'da: "✅ User authenticated and stores initialized"
```

### 5.4 Supabase Dashboard Kontrol

1. **Authentication** → **Users** gidin
2. Yeni kullanıcınızı görmelisiniz:

   - Email: test@fitapp.com
   - Status: Confirmed (email verification kapalıysa)
   - Created: Az önce

3. **Table Editor** → **user_profiles** gidin
4. Profil kaydı oluştu mu kontrol edin

**Eğer user_profiles'ta kayıt yoksa:**

- `supabaseAuthService.createUserProfile()` çalışmamış olabilir
- Console logları kontrol edin
- RLS policies doğru mu kontrol edin

---

## 📋 Adım 6: Demo Mode Kontrolü (Opsiyonel)

### 6.1 Demo Mode Nedir?

`src/store/authStore.js` dosyasında:

```javascript
const DEMO_MODE = false; // Supabase kullanır
// const DEMO_MODE = true; // Local demo kullanır
```

### 6.2 Demo Mode'u Test Etmek İsterseniz

1. `src/store/authStore.js` açın
2. `DEMO_MODE = true` yapın
3. Uygulamayı yeniden başlatın
4. Login ekranında **"Demo Hesabı ile Giriş"** butonuna tıklayın

**Demo Credentials:**

```
Email: demo@fitapp.com
Şifre: demo123
```

### 6.3 Production İçin

```javascript
const DEMO_MODE = false; // Daima false olmalı
```

---

## 🐛 Sorun Giderme

### Hata 1: "Invalid API key" / "Project not found"

**Çözüm:**

1. `src/config/supabase.js` kontrol edin
2. URL ve Key doğru mu?
   ```javascript
   const SUPABASE_URL = "https://nqsvaqeiaovhnlolvixb.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
   ```
3. Supabase Dashboard → **Settings** → **API** kontrol edin

### Hata 2: "Email not confirmed"

**Çözüm:**

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. **Confirm email** seçeneğini **KAPALI** yapın
3. Veya test kullanıcısını **Authentication** → **Users** → **...** → **Confirm email** ile manuel onayla

### Hata 3: "Row level security policy violation"

**Çözüm:**

1. RLS policies doğru kurulmuş mu kontrol edin
2. SQL Editor'de tekrar çalıştırın (Adım 3.2)
3. Veya geçici olarak RLS'i kapatın (TESTİNDEN SONRA AÇ!):
   ```sql
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ```

### Hata 4: "User profile not created"

**Çözüm:**

1. `supabaseAuthService.createUserProfile()` fonksiyonu çalışıyor mu?
2. Console logları kontrol edin
3. Manuel profil oluştur:
   ```sql
   INSERT INTO user_profiles (user_id, full_name)
   VALUES ('user-uuid-buraya', 'Test User');
   ```
   (user-uuid'yi Authentication → Users'tan alın)

### Hata 5: "Network request failed"

**Çözüm:**

1. İnternet bağlantınızı kontrol edin
2. Supabase URL'i doğru mu?
3. Firewall/antivirus Supabase'i engelliyor mu?
4. `npx expo start` yeniden başlatın

---

## ✅ Başarı Kontrolü

Tüm bunlar çalışıyorsa başarılı demektir:

- [x] Register ile yeni kullanıcı oluşturabiliyorum
- [x] Login ile giriş yapabiliyorum
- [x] Logout ile çıkış yapabiliyorum
- [x] Supabase Dashboard'da kullanıcıları görebiliyorum
- [x] user_profiles tablosunda kayıtlar oluşuyor
- [x] Ana uygulamaya yönlendiriliyor
- [x] Console'da auth logları görüyorum

---

## 📝 Test Senaryosu (Tamamı)

### Senaryo 1: Yeni Kullanıcı

```
1. Register ekranına git
2. Bilgileri gir (email, şifre, ad)
3. Kayıt ol
4. Login ekranına yönlendirildi mi? ✓
5. Aynı bilgilerle giriş yap
6. Ana uygulamaya yönlendirildi mi? ✓
7. Profile ekranına git
8. Kullanıcı bilgileri görünüyor mu? ✓
```

### Senaryo 2: Logout & Re-login

```
1. Ana uygulamada logout yap
2. Login ekranına döndü mü? ✓
3. Tekrar giriş yap
4. Ana uygulamaya döndü mü? ✓
5. Veriler korundu mu? ✓
```

### Senaryo 3: Şifre Sıfırlama

```
1. Login ekranında "Şifremi Unuttum" tıkla
2. Email gir
3. "Password reset email sent" mesajı ✓
4. Email'i kontrol et (gerçek email ise)
5. Linke tıkla, yeni şifre belirle
```

---

## 🚀 Sonraki Adımlar

Auth çalışıyor mu? ✅

**Artık yapabilirsiniz:**

1. ✅ Kullanıcı profil düzenleme
2. ✅ Diet tracking (offline/online)
3. ✅ Workout logging
4. ✅ Progress tracking
5. ✅ Data sync

**Week 3'e geçebilirsiniz!**

- Data Synchronization
- Offline/Online Sync
- SQLite ↔ Supabase

---

## 📞 Yardım

**Supabase Credentials:**

- Project URL: `https://nqsvaqeiaovhnlolvixb.supabase.co`
- Dashboard: `https://supabase.com/dashboard/project/nqsvaqeiaovhnlolvixb`

**Önemli Dosyalar:**

- Auth Config: `src/config/supabase.js`
- Auth Service: `src/services/supabaseAuthService.js`
- Auth Store: `src/store/authStore.js`
- Login Screen: `src/screens/LoginScreen.js`
- Register Screen: `src/screens/RegisterScreen.js`

**Console Logları:**

```bash
# Expo DevTools'da Console açık olsun
# Auth işlemlerinde loglar göreceksiniz:
✅ Registration successful with Supabase
✅ Login successful with Supabase
✅ User authenticated and stores initialized
✅ Logout successful
```

---

**Hazırlayan:** AI Assistant  
**Tarih:** Ocak 2025  
**Versiyon:** 1.0  
**Durum:** Hazır 🚀
