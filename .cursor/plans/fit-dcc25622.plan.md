<!-- dcc25622-cdb1-4d88-8871-c4b52b054e88 071a516e-87e7-4b48-b284-80e30bc5e403 -->
# FitApp 4 Ana Sayfa – Kısa UI/UX Brifi

## Genel Tasarım İlkeleri

- **Stil**: Modern, sade, okunaklı; 8pt grid, net hiyerarşi, boşluk kullanımı.
- **Navigasyon**: Alt sekme çubuğu (Antrenman, Beslenme, İlerleme, Profil). Eylem odaklı sayfalarda sağ altta birincil FAB.
- **Durumlar**: Yükleniyor (skeleton), boş durum metin+görsel, hata toast.
- **Mikro etkileşim**: Lottie tabanlı başarı/boş durum animasyonları [[memory:2499438]].
- **Erişilebilirlik**: Yeterli kontrast, dinamik font, touch target ≥ 44dp.
- **Temalar**: Açık/Koyu; sistem temasını izleme.

## 1) Antrenman (Workout Dashboard)

- **Amaç**: Kullanıcının bugünkü planını görmesi ve tek dokunuşla başlatması.
- **Bileşenler**: Hero (bugünkü hedef), ilerleme halkası, “Son antrenmanlar” listesi, program kartı.
- **Eylemler**: “Antrenmana Başla” (primary), “Programı Düzenle”, “Egzersiz Kütüphanesi”.
- **Katmanlar**: Üst hero, orta KPI/ilerleme, alt liste. Mini timer/sayaç sheet.

## 2) Beslenme (Diet/Nutrition)

- **Amaç**: Günlük kalori/makro takibi ve hızlı öğün ekleme.
- **Bileşenler**: Günlük özet kartı (kalori barı, makro çubukları), öğün bölümleri (Kahvaltı/Öğle/Akşam/Atıştırmalık), su sayacı.
- **Eylemler**: “Öğün Ekle” (primary FAB), “Barkod Tara”, “Tarif Ekle”, arama.
- **Katmanlar**: Üst özet, orta öğün listeleri, alt hızlı ekleme kısayolları.

## 3) İlerleme (Progress/Analytics)

- **Amaç**: Ağırlık/ölçü trendleri ve fotoğraf ilerlemesini izleme.
- **Bileşenler**: Tarih filtresi (hafta/ay/3ay), çizgi/sütun grafik kartları, fotoğraf karşılaştırma galerisi.
- **Eylemler**: “Ağırlık Ekle”, “Ölçü Ekle”, “Fotoğraf Yükle”. Paylaş/ dışa aktar.
- **Katmanlar**: Üst filtre, orta metrik kartları, alt medya/özet.

## 4) Profil

- **Amaç**: Kişisel bilgiler, hedefler ve uygulama ayarları.
- **Bileşenler**: Kullanıcı kartı, hedefler (kalori, makro, haftalık hedef), ayarlar listesi (bildirimler, tema, entegrasyonlar), destek.
- **Eylemler**: “Profili Düzenle”, “Hedefleri Ayarla”, “Çıkış”.
- **Katmanlar**: Üst profil özeti, orta yönetim listeleri, alt hukuki bağlantılar.

## Görsel Dille İlgili Notlar

- **Kart tasarımı**: Hafif gölge/ayırıcı, yuvarlatılmış köşe; durum rozetleri.
- **Renk**: Birincil vurgu rengiyle aksiyonların tutarlılığı; başarı/uyarı/ hata renkleri.
- **İkonografi**: Tutarlı set; sekmelerde etiket+ikon.

## Boş/Yükleme/Hata Kurguları

- **Boş**: Kısa yönlendirici metin + Lottie görseli [[memory:2499438]] + birincil CTA.
- **Yükleme**: Skeleton; kritik alanlarda shimmer.
- **Hata**: Açıklayıcı metin + “Tekrar Dene” CTA; ağ kesintisi banner’ı.

## Handoff Beklentileri

- Figma: Bileşen kütüphanesi (Kart, ListItem, Progress, FAB, Sheet), grid/spacer tokenları, light/dark stiller.
- Assetler: Lottie JSON’lar (≤20KB), ikonlar (SVG), ilüstrasyonlar.
- Davranışlar: Etkileşim akışları, durum varyantları ve boş durum metinleri.