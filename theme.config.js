/**
 * Ilovaning rang tizimi — yagona manba.
 *
 * Bu fayldan ham Tailwind ranglari (tailwind.config.js), ham runtime palitra
 * (lib/_core/theme.ts) quriladi. Ya'ni ilovaning ko'rinishi shu yerdan
 * boshqariladi.
 *
 * Avvalgi palitra shablondan qolgan edi: oq fon va ko'k #0a7ea4. Sayt esa
 * to'q binafsha zamin (purple-950) ustida sariq-to'q sariq brend akssenti
 * bilan ishlaydi — ikkisi bir-biriga umuman o'xshamasdi. Endi qiymatlar
 * saytdan olingan (Tailwind nomlari izohda).
 *
 * To'q rejim asosiy hisoblanadi: sayt butunlay to'q va brend shunga qurilgan.
 * Yorug' rejim ham bor, lekin u umumiy oq-ko'k emas — o'sha binafsha/amber
 * brendning yorug' varianti, shunda ilova ikkala holatda ham JDA bo'lib
 * qoladi.
 */

/** @type {const} */
const themeColors = {
  // Brend akssenti. Saytda asosiy tugmalar sariq→to'q sariq gradient,
  // shuning uchun to'q rejimda amber olinadi. Yorug' fonda sariq matn
  // kontrast bermaydi — u yerda binafsha ishlatiladi.
  primary: { light: '#7E22CE', dark: '#FACC15' }, // purple-700 / yellow-400

  // Zamin va sirt. To'q rejimda sirt zamindan OCHROQ: to'q interfeysda
  // balandlik shunday bildiriladi.
  background: { light: '#FAF7FF', dark: '#2A0A48' },
  surface: { light: '#FFFFFF', dark: '#3B0764' }, // dark = purple-950

  foreground: { light: '#1E1035', dark: '#FFFFFF' },
  muted: { light: '#6B5B8A', dark: '#C084FC' }, // dark = purple-400
  border: { light: '#E6DDF5', dark: '#6B21A8' }, // dark = purple-800

  // Holat ranglari — saytdagi qiymatlar bilan bir xil
  success: { light: '#16A34A', dark: '#34D399' }, // emerald-400
  warning: { light: '#D97706', dark: '#FBBF24' }, // amber-400
  error: { light: '#DC2626', dark: '#F87171' }, // red-400
};

module.exports = { themeColors };
