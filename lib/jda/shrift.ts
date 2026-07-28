// lib/jda/shrift.ts
//
// Ilovaning shrift tizimi — saytdan olingan.
//
// jdakimyo.uz da sarlavhalar Syne bilan, matn DM Sans bilan yoziladi
// (app/layout.js dagi --font-syne va --font-dm-sans). Ilovada esa hech
// qanday shrift yuklanmasdi: Android'da Roboto, iOS'da SF chiqardi. Rang
// bir xil bo'lsa ham, ilova boshqa mahsulotdek ko'rinardi — chunki brendni
// birinchi navbatda shrift tanitadi.
//
// React Native shriftning og'irligini o'zi tanlay olmaydi: har bir og'irlik
// alohida fayl va alohida nom bilan yuklanadi. Shuning uchun "font-bold"
// yozish yetarli emas — components/matn.tsx nomni ham almashtiradi.

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { Syne_700Bold, Syne_800ExtraBold } from "@expo-google-fonts/syne";

/** useFonts ga beriladigan ro'yxat */
export const SHRIFT_FAYLLARI = {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  Syne_700Bold,
  Syne_800ExtraBold,
};

/** Kod ichida ishlatiladigan nomlar */
export const SHRIFT = {
  /** Ekran sarlavhalari — saytdagi h1..h6 kabi */
  sarlavha: "Syne_700Bold",
  /** Eng katta sarlavhalar */
  sarlavhaQalin: "Syne_800ExtraBold",

  /** Asosiy matn */
  oddiy: "DMSans_400Regular",
  /** Yarim qalin — tugma va bo'lim nomlari */
  orta: "DMSans_500Medium",
  /** Qalin — raqamlar va urg'u */
  qalin: "DMSans_700Bold",
} as const;

/**
 * Sayt sarlavhalarida `letter-spacing: -0.02em` bor. Piksel hisobida bu
 * shrift o'lchamiga bog'liq, shuning uchun funksiya.
 */
export function sarlavhaOraligi(olcham: number) {
  return Math.round(olcham * -0.02 * 100) / 100;
}
