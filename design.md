# JDA Kimyo Mobile App — Dizayn va Tuzilish

## 📱 Umumiy Tavsif
JDA Kimyo Mobile — oliy kimyo va kompleks birikmalar bo'yicha o'quv ilovasining mobil versiyasi. Ilova talabalar va o'qituvchilar uchun mo'ljallangan bo'lib, interaktiv darslar, quiz testlar va birikmalar bazasini taqdim etadi.

---

## 🎨 Branding va Ranglar
- **Asosiy rang (Primary):** #0a7ea4 (Koʻk — kimyoviy tahlil va ilmiy mavzuning ramzi)
- **Fon (Background):** #ffffff (Oq) / #151718 (Qora rejimda)
- **Matn (Foreground):** #11181C (Qora) / #ECEDEE (Oq rejimda)
- **Ikkinchi rang (Muted):** #687076 (Oq) / #9BA1A6 (Qora rejimda)
- **Yuqori sath (Surface):** #f5f5f5 (Oq) / #1e2022 (Qora rejimda)
- **Chiziq (Border):** #E5E7EB (Oq) / #334155 (Qora rejimda)

---

## 📱 Ekranlar Ro'yxati

### 1. **Home Screen (Bosh Sahifa)**
Ilovaning kirish nuqtasi. Foydalanuvchiga asosiy bo'limlarga tez kirish imkoniyatini beradi.

**Mazmun:**
- Xush kelibsiz xabari va foydalanuvchi nomi (agar kirgan bo'lsa)
- 4 ta asosiy bo'lim kartasi:
  - 📚 O'quv Kurslari
  - 🔬 Ilmiy Bo'lim
  - 🧪 Birikmalar Bazasi
  - 🎯 Quiz va Testlar
- Oxirgi o'rganilgan mavzu (resume)

**Funksiyalari:**
- Har bir kartaga bosish orqali mos bo'limga o'tish
- Foydalanuvchi profiliga tez kirish (yuqori o'ng burchakda)

---

### 2. **O'quv Kurslari (Courses Screen)**
Talabalar uchun noldan boshlab o'rganish kursi.

**Mazmun:**
- 6 ta bosqich (Bosqich 1-6):
  1. Nomlanishi (IUPAC qoidalari)
  2. Klassifikatsiyasi
  3. Fazoviy tuzilishi
  4. Izomeriyasi
  5. Kimyoviy bog'lanish
  6. Video darsliklar
- Har bir bosqichning progress bar
- Umumiy progress ko'rsatgichi

**Funksiyalari:**
- Bosqichga bosish → Dars mazmuni
- Progress saqlash va kuzatish
- Darsni qayta o'rganish imkoniyati

---

### 3. **Dars Mazmuni (Lesson Content Screen)**
Alohida dars va mavzular.

**Mazmun:**
- Dars sarlavhasi va raqami
- Matn kontenti (nazariya)
- 3D modellari (agar mavjud bo'lsa)
- Formulalar va misollar
- Keyingi/Oldingi darsga o'tish tugmalari

**Funksiyalari:**
- Matn o'qish va skroll qilish
- 3D modelni aylantirib ko'rish (agar mavjud bo'lsa)
- Darsni yakunlash va progress yangilash

---

### 4. **Ilmiy Bo'lim (Research Section)**
Tadqiqotchilar va magistrlar uchun chuqurlashgan materiallar.

**Mazmun:**
- 4 ta yo'nalish:
  1. Chuqurlashgan mavzular (CFT, MO, Termodinamika)
  2. Ilmiy maqolalar
  3. Kompleks birikmalar
  4. Tahlil usullari
- Har bir yo'nalishning progress ko'rsatgichi

**Funksiyalari:**
- Yo'nalishga bosish → Batafsil mazmun
- Maqolalar va manbalarga havola

---

### 5. **Birikmalar Bazasi (Compounds Database)**
120+ kompleks birikma haqida ma'lumotlar.

**Mazmun:**
- Qidiruv paneli (formula, nom, markaziy atom bo'yicha)
- Filtrlar:
  - Tur (Kation, Anion, Neytral)
  - Geometriya (Oktaedr, Tetraedr, Kvadrat tekislik, Chiziqli)
- Birikmalar ro'yxati (kartalar shaklida)
- Har bir kartada: formula, nomi, geometriyasi, koordinatsion soni

**Funksiyalari:**
- Qidiruv va filtrlash
- Birikma kartasiga bosish → Batafsil ma'lumot
- 3D model ko'rish

---

### 6. **Birikma Batafsillari (Compound Details)**
Alohida kompleks birikma haqida to'liq ma'lumot.

**Mazmun:**
- Birikma formulasi va IUPAC nomi
- Markaziy atom va ligandlar
- Koordinatsion son
- Geometriya
- 3D model (interaktiv)
- Spektroskopik ma'lumotlar (agar mavjud bo'lsa)
- Xossalari

**Funksiyalari:**
- 3D modelni aylantirib ko'rish
- Spektrlarni ko'rish
- Ortga qaytish

---

### 7. **Quiz va Testlar (Quiz Screen)**
Bilimni sinash uchun interaktiv testlar.

**Mazmun:**
- Mavzular bo'yicha test ro'yxati
- Har bir testning savollari soni va qiyinligi
- Foydalanuvchining oldingi natijasi (agar mavjud bo'lsa)

**Funksiyalari:**
- Testni boshlash
- Savolga javob berish
- Natijani ko'rish va tahlil qilish

---

### 8. **Test O'tish (Quiz Attempt)**
Testni o'tish jarayoni.

**Mazmun:**
- Savolning mazmuni
- Javob variantlari (multiple choice)
- Progress bar (nechta savol o'tkazildi)
- Tugma: Keyingi savol / Yakunlash

**Funksiyalari:**
- Javob tanlash
- Keyingi savolga o'tish
- Testni yakunlash

---

### 9. **Test Natijasi (Quiz Results)**
Test o'tgandan keyin natijalar.

**Mazmun:**
- Foiz (%)
- To'g'ri javoblar soni / Jami savollari
- Har bir savolning to'g'ri javobini ko'rish
- Tahlil va maslahatlar

**Funksiyalari:**
- Testni qayta o'tish
- Bosh sahifaga qaytish
- Natijani PDF shaklida yuklab olish (opsional)

---

### 10. **Shaxsiy Kabinet (Profile Screen)**
Foydalanuvchi profilining boshqaruvi.

**Mazmun:**
- Foydalanuvchi nomi va rasm
- Umumiy statistika:
  - O'rganilgan darslar soni
  - O'tkazilgan testlar soni
  - O'rtacha test natijasi
- Sozlamalar tugmasi
- Chiqish tugmasi

**Funksiyalari:**
- Profilni tahrirlash
- Sozlamalarni o'zgartirish
- Ilovadan chiqish

---

### 11. **Sozlamalar (Settings Screen)**
Ilovaning sozlamalari.

**Mazmun:**
- Qora/Oq rejim
- Til tanlash (Oʻzbek, Ingliz)
- Bildirishnomalar
- Maʼlumotlarni tozalash
- Ilovaning versiyasi

**Funksiyalari:**
- Sozlamalarni o'zgartirish va saqlash

---

## 🔄 Asosiy Foydalanuvchi Oqimlari

### 1. **O'rganish Oqimi**
```
Bosh sahifa → O'quv kurslari → Bosqich tanlash → Dars mazmuni → 
Darsni o'qish → Keyingi darsga o'tish → Progress saqlash
```

### 2. **Quiz O'tish Oqimi**
```
Bosh sahifa → Quiz va Testlar → Mavzu tanlash → Testni boshlash → 
Savolga javob berish → Natijani ko'rish
```

### 3. **Birikmalarni Qidiruv Oqimi**
```
Bosh sahifa → Birikmalar bazasi → Qidiruv/Filtrlash → 
Birikma kartasini tanlash → Batafsil ma'lumot → 3D model ko'rish
```

### 4. **Profil Boshqaruvi Oqimi**
```
Bosh sahifa → Profil → Statistika ko'rish → Sozlamalar → 
Sozlamalarni o'zgartirish → Saqlash
```

---

## 🎯 Dizayn Tamoyillari

1. **Mobil-birinchi yondashuv:** Barcha ekranlar 9:16 (portrait) orientatsiyada optimallashtirilgan.
2. **Bir qo'lda foydalanish:** Tugmalar va interaktiv elementlar qulay joyda joylashtirilgan.
3. **iOS HIG muvofiqlik:** Ilovaning dizayni iOS standartlariga mos.
4. **Oq/Qora rejim:** Barcha ekranlar ikkala rejimda yaxshi ko'rinadi.
5. **Tezlik va samaradorlik:** Minimal animatsiyalar, tez yuklash.
6. **Aniqlik:** Matn o'qilishi va formulalar juda aniq ko'rinadi.

---

## 📊 Teknis Tafsilotlar

- **Framework:** React Native (Expo)
- **Styling:** NativeWind (Tailwind CSS)
- **State Management:** React Context + AsyncStorage
- **Navigatsiya:** Expo Router (Tab-based)
- **Maʼlumotlar:** Lokal AsyncStorage (server-ga bog'lanish opsional)
- **3D Modellar:** Web-view orqali (Three.js yoki similar)

---

## 🎨 Ikonografiya

- 📚 O'quv
- 🔬 Ilmiy
- 🧪 Birikmalar
- 🎯 Quiz
- 👤 Profil
- ⚙️ Sozlamalar
- 🔍 Qidiruv
- ✅ Yakunlash
- ← Ortga qaytish
