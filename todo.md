# JDA Kimyo Mobile — TODO List

## Asosiy Xususiyatlar

### Navigatsiya va Tuzilish
- [x] Tab bar navigatsiyasini sozlash (Home, Courses, Research, Compounds, Quiz, Profile)
- [x] Har bir tab uchun asosiy ekranlarni yaratish
- [x] Ekranlar orasida navigatsiyani sozlash

### 1. Bosh Sahifa (Home Screen)
- [x] Xush kelibsiz xabari va foydalanuvchi nomi ko'rsatish
- [x] 4 ta asosiy bo'lim kartasi yaratish (O'quv, Ilmiy, Birikmalar, Quiz)
- [x] Oxirgi o'rganilgan mavzuni ko'rsatish
- [x] Profil ikonasiga bosish orqali profilga o'tish

### 2. O'quv Kurslari (Courses Section)
- [x] 6 ta bosqichni ro'yxatini yaratish
- [x] Har bir bosqichning progress bar'ini ko'rsatish
- [ ] Bosqichga bosish → Dars mazmuni
- [ ] Dars mazmunini ko'rsatish (matn, formulalar, misollar)
- [ ] 3D modellarni ko'rsatish (agar mavjud bo'lsa)
- [ ] Keyingi/Oldingi darsga o'tish tugmalari
- [ ] Progress saqlash (AsyncStorage)

### 3. Ilmiy Bo'lim (Research Section)
- [x] 4 ta yo'nalishni ro'yxatini yaratish
- [ ] Har bir yo'nalishning batafsil mazmunini yaratish
- [ ] Chuqurlashgan mavzular (CFT, MO, Termodinamika)
- [ ] Ilmiy maqolalar ro'yxati
- [ ] Maqolalarga havola qo'shish

### 4. Birikmalar Bazasi (Compounds Database)
- [ ] Birikmalar ma'lumotlari bazasini yaratish (120+ birikma)
- [x] Qidiruv funksiyasini amalga oshirish (formula, nom, markaziy atom)
- [x] Filtrlar: tur (Kation, Anion, Neytral), geometriya
- [x] Birikmalar kartalarini ko'rsatish
- [ ] Birikma kartasiga bosish → Batafsil ma'lumot
- [ ] 3D modellarni ko'rsatish (web-view orqali)

### 5. Quiz va Testlar (Quiz Section)
- [ ] Quiz ma'lumotlari bazasini yaratish (500+ savol)
- [x] Mavzular bo'yicha test ro'yxati
- [ ] Test o'tish interfeysi
- [ ] Savolga javob berish (multiple choice)
- [ ] Test natijalarini ko'rsatish
- [ ] Natijalarni saqlash (AsyncStorage)
- [ ] Natijalarni PDF shaklida yuklab olish (opsional)

### 6. Shaxsiy Kabinet (Profile Screen)
- [x] Foydalanuvchi profilini ko'rsatish
- [x] Umumiy statistika (o'rganilgan darslar, o'tkazilgan testlar, oʻrtacha natija)
- [ ] Profilni tahrirlash funksiyasi
- [x] Chiqish tugmasi

### 7. Sozlamalar (Settings Screen)
- [x] Qora/Oq rejim almashuvi
- [x] Til tanlash (Oʻzbek, Ingliz)
- [x] Bildirishnomalar sozlamalari
- [x] Maʼlumotlarni tozalash
- [x] Ilovaning versiyasini ko'rsatish

## Dizayn va UI
- [ ] Branding (logo, ranglar, shriftlar) qo'shish
- [ ] iOS HIG muvofiqlik tekshirish
- [ ] Qora/Oq rejimda barcha ekranlarni tekshirish
- [ ] Responsive dizayn tekshirish (turli ekran o'lchamlari)
- [ ] Animatsiyalar va o'tishlar (opsional)

## Texnik Vazifalar
- [ ] AsyncStorage orqali ma'lumotlarni saqlash va o'qish
- [ ] 3D modellari ko'rsatish uchun web-view integratsiyasi
- [ ] Qidiruv va filtrlash algoritmini optimallash
- [ ] Ilovaning performance'ini tekshirish
- [ ] Xatolarni boshqarish va user feedback

## Sinov va Debugging
- [ ] Barcha ekranlarda navigatsiyani tekshirish
- [ ] Barcha tugmalar va interaktiv elementlarni tekshirish
- [ ] iOS va Android'da test qilish
- [ ] Xatolarni va edge case'larni tekshirish
- [ ] Performance va yuklash vaqtini tekshirish

## Deployment
- [ ] Ilovani Google Play Store'ga yuklash (Android)
- [ ] Ilovani Apple App Store'ga yuklash (iOS)
- [ ] Ilovaning versiyasini yangilash

---

## Tugallangan Vazifalar
(Bu bo'lim tugallangan vazifalarni ko'rsatadi)
