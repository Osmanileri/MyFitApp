# 🚀 Authentication Quick Start

**Son Güncelleme:** Az önce ✅  
**Durum:** App.js otomatik güncellendi, sadece Supabase ayarları gerekli!

---

## ✅ Yapılan Güncellemeler

### 1. App.js - Supabase Auth ✅

**TAMAMLANDI!** App.js otomatik olarak güncellendi:

- ✅ `checkSession()` - Session restore
- ✅ `initializeAuth()` - Auth state listener
- ✅ Console logları - Debug

**Hiçbir şey yapmanıza gerek yok!**

---

## 📋 Yapmanız Gerekenler (Sadece 3 Adım!)

### Adım 1: Supabase Email Auth (2 dakika)

```
https://supabase.com/dashboard/project/nqsvaqeiaovhnlolvixb
```

1. **Authentication** → **Providers** → **Email**
2. **Enable Email provider** → AÇIK ✅
3. **Confirm email** → KAPALI (test için)
4. **Save**

---

### Adım 2: Database Setup (3 dakika)

**SQL Editor**'e gidin ve bu kodu çalıştırın:

```sql
-- 1. Tablo oluştur
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

-- 2. Index ekle
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- 3. RLS aktif
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Policies (4 tane - HEPSİ!)
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON user_profiles FOR DELETE USING (auth.uid() = user_id);
```

**✅ Kontrol:**

- **Database** → **Tables** → `user_profiles` var mı?
- **Policies** tab'ında **4 policy** var mı?

---

### Adım 3: Test Et! (2 dakika)

```bash
npm start
```

**Register Test:**

1. Register ekranı
2. Bilgileri gir:
   - Email: test@fitapp.com
   - Şifre: TestPass123
3. Kayıt ol → ✅ Başarılı!

**Login Test:**

1. Login ekranı
2. Aynı bilgilerle giriş
3. Ana uygulamaya yönlendirildi mi? ✅

**Supabase Kontrol:**

- **Authentication** → **Users** → Yeni kullanıcı var mı?
- **Table Editor** → **user_profiles** → Profil var mı?

---

## ✅ Başarı Kriterleri

Tümü çalışıyorsa BAŞARILI:

- [x] Register yapabiliyorum
- [x] Login yapabiliyorum
- [x] Supabase'de kullanıcı görüyorum
- [x] user_profiles'ta profil var
- [x] Console'da auth logları görüyorum

---

## 🐛 Sorun mu var?

### "Policy violation" hatası?

→ 4 policy'nin hepsini çalıştırdınız mı?
→ RLS aktif mi?

### "Email not confirmed"?

→ **Confirm email** KAPALI mı?

### Kullanıcı oluştu ama profil yok?

→ Console loglarına bakın
→ RLS policies kontrol edin

---

## 📚 Detaylı Döküman

Daha fazla detay için:
👉 `docs/AUTH_SETUP_CHECKLIST.md`

---

**Hazır mısınız? Başlayın! 🚀**
