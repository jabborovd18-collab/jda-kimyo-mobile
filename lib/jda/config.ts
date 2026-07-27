/**
 * JDA Kimyo sayt API'siga ulanish sozlamalari.
 *
 * Mobil ilova o'z backend'iga ega emas — u to'g'ridan-to'g'ri saytning
 * (Next.js + Prisma + PostgreSQL) API'sidan foydalanadi. Shu sababli
 * foydalanuvchi bitta hisob bilan ham saytga, ham ilovaga kiradi.
 */

const DEFAULT_API_URL = "https://jdakimyo.vercel.app";

/**
 * API manzili. Lokal ishlab chiqishda .env faylida quyidagini yozing:
 *   EXPO_PUBLIC_JDA_API_URL=http://192.168.X.X:3000
 * (telefon "localhost" ni ko'rmaydi — kompyuterning tarmoqdagi IP'si kerak)
 */
export const JDA_API_URL = (
  process.env.EXPO_PUBLIC_JDA_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");

/** expo-secure-store kalitlari (Manus shablonining kalitlaridan alohida) */
export const JDA_TOKEN_KEY = "jda_auth_token";
export const JDA_USER_KEY = "jda_auth_user";
