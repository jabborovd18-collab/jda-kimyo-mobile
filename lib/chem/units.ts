// lib/chem/units.ts
//
// Kimyoviy birliklar konvertori.
//
// Ilgari alohida "harorat konvertori", "bosim konvertori" degan kalkulyatorlar
// bor edi, lekin har biri faqat bitta yo'nalishga ishlardi: Celsius -> Kelvin,
// orqaga esa yo'q. Bu yerda har bir guruh ichida istalgan birlikdan istalganiga
// o'tkaziladi.
//
// Har guruhning bitta "asosiy" birligi bor. Konversiya ikki qadamda:
// kiritilgan birlik -> asosiy -> kerakli birlik. Shu sababli n ta birlik uchun
// n² ta koeffitsient emas, n ta koeffitsient yetadi.

export interface Birlik {
  /** Ekranda ko'rinadigan qisqa belgi: "kJ" */
  kod: string;
  /** To'liq nom: "kilojoul" */
  nom: string;
  /** Asosiy birlikka ko'paytiruvchi. Harorat uchun ishlatilmaydi. */
  koeffitsient?: number;
  /** Nochiziqli birliklar uchun (harorat) */
  asosiyga?: (qiymat: number) => number;
  asosiydan?: (qiymat: number) => number;
}

export interface BirlikGuruhi {
  id: string;
  nom: string;
  emoji: string;
  /** Guruhning asosiy birligi kodi */
  asosiy: string;
  birliklar: Birlik[];
}

/** Avogadro soni — 2019-yildan beri aniq belgilangan qiymat */
export const AVOGADRO = 6.02214076e23;

export const birlikGuruhlari: BirlikGuruhi[] = [
  {
    id: "massa",
    nom: "Massa",
    emoji: "⚖️",
    asosiy: "g",
    birliklar: [
      { kod: "t", nom: "tonna", koeffitsient: 1e6 },
      { kod: "kg", nom: "kilogramm", koeffitsient: 1000 },
      { kod: "g", nom: "gramm", koeffitsient: 1 },
      { kod: "mg", nom: "milligramm", koeffitsient: 1e-3 },
      { kod: "µg", nom: "mikrogramm", koeffitsient: 1e-6 },
      { kod: "ng", nom: "nanogramm", koeffitsient: 1e-9 },
      // 1 u = 1 g/mol ga teng emas, lekin massa sifatida: 1/Nₐ gramm
      { kod: "u", nom: "atom massa birligi (Da)", koeffitsient: 1 / AVOGADRO },
    ],
  },
  {
    id: "hajm",
    nom: "Hajm",
    emoji: "🧪",
    asosiy: "L",
    birliklar: [
      { kod: "m³", nom: "kub metr", koeffitsient: 1000 },
      { kod: "L", nom: "litr", koeffitsient: 1 },
      { kod: "dm³", nom: "kub detsimetr", koeffitsient: 1 },
      { kod: "mL", nom: "millilitr", koeffitsient: 1e-3 },
      { kod: "sm³", nom: "kub santimetr", koeffitsient: 1e-3 },
      { kod: "µL", nom: "mikrolitr", koeffitsient: 1e-6 },
    ],
  },
  {
    id: "bosim",
    nom: "Bosim",
    emoji: "🔽",
    asosiy: "Pa",
    birliklar: [
      { kod: "Pa", nom: "paskal", koeffitsient: 1 },
      { kod: "kPa", nom: "kilopaskal", koeffitsient: 1000 },
      { kod: "MPa", nom: "megapaskal", koeffitsient: 1e6 },
      { kod: "bar", nom: "bar", koeffitsient: 1e5 },
      { kod: "atm", nom: "atmosfera", koeffitsient: 101325 },
      {
        kod: "mmHg",
        nom: "simob ustuni mm (torr)",
        koeffitsient: 101325 / 760,
      },
      { kod: "psi", nom: "funt/kv.dyuym", koeffitsient: 6894.757293168 },
    ],
  },
  {
    id: "harorat",
    nom: "Harorat",
    emoji: "🌡️",
    asosiy: "K",
    birliklar: [
      { kod: "K", nom: "kelvin", asosiyga: (v) => v, asosiydan: (v) => v },
      {
        kod: "°C",
        nom: "Selsiy",
        asosiyga: (v) => v + 273.15,
        asosiydan: (v) => v - 273.15,
      },
      {
        kod: "°F",
        nom: "Farengeyt",
        asosiyga: (v) => ((v - 32) * 5) / 9 + 273.15,
        asosiydan: (v) => ((v - 273.15) * 9) / 5 + 32,
      },
    ],
  },
  {
    id: "energiya",
    nom: "Energiya",
    emoji: "⚡",
    asosiy: "J",
    birliklar: [
      { kod: "J", nom: "joul", koeffitsient: 1 },
      { kod: "kJ", nom: "kilojoul", koeffitsient: 1000 },
      // Termokimyoviy kaloriya — kimyoda shu ishlatiladi
      { kod: "cal", nom: "kaloriya", koeffitsient: 4.184 },
      { kod: "kcal", nom: "kilokaloriya", koeffitsient: 4184 },
      { kod: "eV", nom: "elektronvolt", koeffitsient: 1.602176634e-19 },
      { kod: "kWh", nom: "kilovatt-soat", koeffitsient: 3.6e6 },
    ],
  },
  {
    id: "miqdor",
    nom: "Modda miqdori",
    emoji: "⚛️",
    asosiy: "mol",
    birliklar: [
      { kod: "mol", nom: "mol", koeffitsient: 1 },
      { kod: "mmol", nom: "millimol", koeffitsient: 1e-3 },
      { kod: "µmol", nom: "mikromol", koeffitsient: 1e-6 },
      { kod: "ta", nom: "zarracha soni", koeffitsient: 1 / AVOGADRO },
    ],
  },
  {
    id: "konsentratsiya",
    nom: "Konsentratsiya",
    emoji: "💧",
    asosiy: "M",
    birliklar: [
      { kod: "M", nom: "molyar (mol/L)", koeffitsient: 1 },
      { kod: "mM", nom: "millimolyar", koeffitsient: 1e-3 },
      { kod: "µM", nom: "mikromolyar", koeffitsient: 1e-6 },
      { kod: "nM", nom: "nanomolyar", koeffitsient: 1e-9 },
      { kod: "mol/m³", nom: "mol/kub metr", koeffitsient: 1e-3 },
    ],
  },
  {
    id: "uzunlik",
    nom: "Uzunlik",
    emoji: "📏",
    asosiy: "m",
    birliklar: [
      { kod: "m", nom: "metr", koeffitsient: 1 },
      { kod: "sm", nom: "santimetr", koeffitsient: 1e-2 },
      { kod: "mm", nom: "millimetr", koeffitsient: 1e-3 },
      { kod: "µm", nom: "mikrometr", koeffitsient: 1e-6 },
      { kod: "nm", nom: "nanometr", koeffitsient: 1e-9 },
      { kod: "Å", nom: "angstrem", koeffitsient: 1e-10 },
      { kod: "pm", nom: "pikometr", koeffitsient: 1e-12 },
    ],
  },
  {
    id: "vaqt",
    nom: "Vaqt",
    emoji: "⏱️",
    asosiy: "s",
    birliklar: [
      { kod: "s", nom: "sekund", koeffitsient: 1 },
      { kod: "min", nom: "daqiqa", koeffitsient: 60 },
      { kod: "soat", nom: "soat", koeffitsient: 3600 },
      { kod: "kun", nom: "kun", koeffitsient: 86400 },
      { kod: "yil", nom: "yil (365 kun)", koeffitsient: 31536000 },
    ],
  },
];

export class BirlikXatosi extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BirlikXatosi";
  }
}

export function guruhniTop(guruhId: string): BirlikGuruhi {
  const guruh = birlikGuruhlari.find((g) => g.id === guruhId);
  if (!guruh) throw new BirlikXatosi(`"${guruhId}" degan birlik guruhi yo'q`);
  return guruh;
}

function birlikniTop(guruh: BirlikGuruhi, kod: string): Birlik {
  const birlik = guruh.birliklar.find((b) => b.kod === kod);
  if (!birlik) {
    throw new BirlikXatosi(`"${guruh.nom}" guruhida "${kod}" birligi yo'q`);
  }
  return birlik;
}

/**
 * Bir birlikdan ikkinchisiga o'tkazadi.
 *
 *   konvert(1, "atm", "Pa", "bosim")     -> 101325
 *   konvert(25, "°C", "K", "harorat")    -> 298.15
 */
export function konvert(
  qiymat: number,
  dan: string,
  ga: string,
  guruhId: string,
): number {
  if (!Number.isFinite(qiymat))
    throw new BirlikXatosi("Qiymat son bo'lishi kerak");

  const guruh = guruhniTop(guruhId);
  const danBirlik = birlikniTop(guruh, dan);
  const gaBirlik = birlikniTop(guruh, ga);

  const asosiyda = danBirlik.asosiyga
    ? danBirlik.asosiyga(qiymat)
    : qiymat * (danBirlik.koeffitsient ?? 1);

  return gaBirlik.asosiydan
    ? gaBirlik.asosiydan(asosiyda)
    : asosiyda / (gaBirlik.koeffitsient ?? 1);
}

/**
 * Natijani o'qishga qulay ko'rinishda yozadi.
 *
 * 0.000001 yoki 12000000 kabi sonlar oddiy yozilsa o'qib bo'lmaydi —
 * ular eksponensial ko'rinishga o'tadi.
 */
export function sonniYoz(qiymat: number, belgilar = 6): string {
  if (!Number.isFinite(qiymat)) return "—";
  if (qiymat === 0) return "0";

  const kattalik = Math.abs(qiymat);
  if (kattalik < 1e-4 || kattalik >= 1e7) {
    return qiymat.toExponential(4).replace("e", " × 10^").replace("+", "");
  }

  // Ortiqcha nollarni olib tashlash: 2.500000 -> 2.5
  return Number(qiymat.toPrecision(belgilar)).toString();
}
