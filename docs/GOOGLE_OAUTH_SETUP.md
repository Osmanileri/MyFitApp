# Google OAuth Setup Guide - Supabase

Bu dokuman, MyFitApp için Google OAuth entegrasyonunun nasıl yapılandırılacağını açıklar.

## Adım 1: Google Cloud Console'da Proje Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. Proje adı: `MyFitApp` (veya tercih ettiğiniz ad)

## Adım 2: OAuth Consent Screen Yapılandırma

1. Sol menüden **APIs & Services** > **OAuth consent screen** seçin
2. **User Type** olarak **External** seçin (test için)
3. **Create** butonuna tıklayın

### Consent Screen Bilgileri:

```
App name: MyFitApp
User support email: [Email adresiniz]
App logo: (opsiyonel)
Application home page: https://yourapp.com
Application privacy policy: https://yourapp.com/privacy
Application terms of service: https://yourapp.com/terms
Authorized domains: supabase.co
Developer contact: [Email adresiniz]
```

4. **Scopes** bölümünde şunları ekleyin:

   - `email`
   - `profile`
   - `openid`

5. **Test users** ekleyin (External seçtiyseniz):

   - Kendi email adresinizi ekleyin
   - Test etmek istediğiniz diğer kullanıcıları ekleyin

6. **Save and Continue** ile kaydedin

## Adım 3: OAuth 2.0 Client ID Oluşturma

1. Sol menüden **APIs & Services** > **Credentials** seçin
2. **+ CREATE CREDENTIALS** > **OAuth client ID** seçin

### Web Application İçin:

```
Application type: Web application
Name: MyFitApp Web Client

Authorized JavaScript origins:
  - https://nqsvaqeiaovhnlolvixb.supabase.co

Authorized redirect URIs:
  - https://nqsvaqeiaovhnlolvixb.supabase.co/auth/v1/callback
```

3. **CREATE** butonuna tıklayın
4. **Client ID** ve **Client Secret** bilgilerini kaydedin

### ⚠️ ÖNEMLİ NOT:

```
Client ID: [Bu bilgiyi kaydedin]
Client Secret: [Bu bilgiyi kaydedin]
```

## Adım 4: Supabase Dashboard Yapılandırma

1. [Supabase Dashboard](https://supabase.com/dashboard) adresine gidin
2. Projenizi seçin: `https://supabase.com/dashboard/project/nqsvaqeiaovhnlolvixb`
3. Sol menüden **Authentication** > **Providers** seçin
4. **Google** sağlayıcısını bulun ve **Enable** edin

### Supabase Google OAuth Ayarları:

```
Enabled: ✓ (Aktif)

Google Client ID: [Google Cloud Console'dan aldığınız Client ID]
Google Client Secret: [Google Cloud Console'dan aldığınız Client Secret]

Authorized Client IDs (iOS): (Şimdilik boş bırakın, ileride iOS için ekleyeceğiz)
```

5. **Save** butonuna tıklayın

## Adım 5: Supabase Callback URL'i Doğrulama

Supabase otomatik olarak callback URL oluşturur:

```
Callback URL: https://nqsvaqeiaovhnlolvixb.supabase.co/auth/v1/callback
```

Bu URL'in Google Cloud Console'da **Authorized redirect URIs** listesinde olduğundan emin olun.

## Adım 6: React Native Deep Linking (İleride)

Mobil uygulama için deep linking yapılandırması:

### iOS için (app.json):

```json
{
  "expo": {
    "scheme": "myfitapp",
    "ios": {
      "bundleIdentifier": "com.yourname.myfitapp",
      "associatedDomains": ["applinks:nqsvaqeiaovhnlolvixb.supabase.co"]
    }
  }
}
```

### Android için (app.json):

```json
{
  "expo": {
    "scheme": "myfitapp",
    "android": {
      "package": "com.yourname.myfitapp",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "nqsvaqeiaovhnlolvixb.supabase.co",
              "pathPrefix": "/auth/v1/callback"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## Adım 7: Test Etme

### Web/Expo Go ile Test:

1. Expo uygulamasını başlatın: `npm start`
2. Login ekranında "Google ile Giriş Yap" butonuna tıklayın
3. Google OAuth ekranı açılır
4. Test kullanıcınızla giriş yapın
5. İzinleri onaylayın
6. Uygulamaya yönlendirilirsiniz

### Beklenen Akış:

```
1. User tıklar: "Google ile Giriş Yap"
2. Supabase Google OAuth URL'i açılır
3. Kullanıcı Google hesabını seçer
4. İzinleri onaylar
5. Supabase callback URL'e yönlendirir
6. Supabase session oluşturur
7. authStore.initializeAuth() tetiklenir
8. Kullanıcı main app'e yönlendirilir
```

## Sorun Giderme

### "redirect_uri_mismatch" Hatası:

- Google Cloud Console'da redirect URI'nin doğru olduğundan emin olun
- Tam URL: `https://nqsvaqeiaovhnlolvixb.supabase.co/auth/v1/callback`

### "Access blocked: This app's request is invalid":

- OAuth consent screen'i tamamladığınızdan emin olun
- Test users listesine email adresinizi ekleyin
- Scopes'ların doğru olduğundan emin olun

### "popup_closed_by_user" Hatası:

- Normal bir durum, kullanıcı popup'ı kapattı
- Tekrar deneme önerilir

### Mobilde Çalışmıyor:

- Deep linking yapılandırmasını kontrol edin
- `expo-auth-session` kurulu olduğundan emin olun
- Redirect URI'leri kontrol edin

## Güvenlik Notları

⚠️ **ASLA GİT DEPOSUNA COMMITLEMEYIN:**

- Client Secret
- API keys
- Private keys

✅ **GÜVENLİK İPUÇLARI:**

- Production'da OAuth consent screen'i "Internal" veya "Published" yapın
- Authorized domains listesini minimize edin
- Düzenli olarak credentials rotation yapın
- Test users'ı production'da kaldırın

## Referanslar

- [Supabase Google OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Expo AuthSession](https://docs.expo.dev/guides/authentication/#google)

---

**Son Güncelleme:** Ocak 2025  
**Statü:** Yapılandırma Bekleniyor
