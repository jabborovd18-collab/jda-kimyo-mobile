// lib/chem/molar-mass.ts
//
// Kimyoviy formuladan molyar massani hisoblash.
//
// Bu kalkulyator emas, kichik parser. "H2SO4" ni ko'rib 98.08 deb aytish uchun
// formulani belgima-belgi o'qish, qavslarni ochish va gidrat suvini alohida
// hisoblash kerak. Shuning uchun alohida faylda.
//
// Atom massalari lib/data/periodic-elements.json dan olinadi — u PubChem
// bilan boyitilgan, ya'ni massalar bitta joyda turadi va ikki xil bo'lib
// qolmaydi.
//
// Qo'llab-quvvatlanadi:
//   H2O          oddiy
//   H₂SO₄        pastki indeks (klaviaturada yo'q, lekin nusxalansa keladi)
//   Ca(OH)2      qavs
//   K3[Fe(CN)6]  ichma-ich qavs
//   CuSO4·5H2O   gidrat (nuqta, · yoki *)
//   SO4^2-       zaryad — massaga ta'sir qilmaydi, lekin o'qiladi
//   2H2O         oldidagi koeffitsient

import elementlar from "@/lib/data/periodic-elements.json";

interface ElementYozuvi {
  symbol: string;
  name: string;
  mass: number;
}

/** Belgi -> atom massasi. Bir marta quriladi. */
const MASSALAR: Record<string, number> = {};
/** Belgi -> o'zbekcha nom. Xato xabarida va tarkib ro'yxatida ishlatiladi. */
const NOMLAR: Record<string, string> = {};

for (const element of elementlar as ElementYozuvi[]) {
  MASSALAR[element.symbol] = element.mass;
  NOMLAR[element.symbol] = element.name;
}

/** Formulani o'qib bo'lmaganda tashlanadi. Xabar foydalanuvchiga ko'rsatiladi. */
export class FormulaXatosi extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormulaXatosi";
  }
}

export interface TarkibQismi {
  symbol: string;
  nom: string;
  soni: number;
  /** Shu elementning formuladagi umumiy massasi, g/mol */
  massa: number;
  /** Molyar massaning necha foizi */
  foiz: number;
}

export interface Formula {
  /** Kiritilgan matn (tozalangan) */
  kiritilgan: string;
  /** Element -> atomlar soni */
  atomlar: Record<string, number>;
  molyarMassa: number;
  /** Massa foizi bo'yicha kamayish tartibida */
  tarkib: TarkibQismi[];
  /** Ion zaryadi: SO4^2- uchun -2. Neytral moddada 0. */
  zaryad: number;
}

const PASTKI_INDEKS = "₀₁₂₃₄₅₆₇₈₉";
const YUQORI_INDEKS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/**
 * Formulani parser tushunadigan ko'rinishga keltiradi.
 *
 * Yuqori indeks zaryadni bildiradi, pastki indeks atomlar sonini — ikkalasini
 * ham oddiy raqamga aylantirsak, "SO₄²⁻" va "SO42-" farqlanmay qoladi.
 * Shuning uchun zaryad avval "^2-" ko'rinishiga o'tkaziladi.
 */
function tayyorla(kirish: string): string {
  let natija = "";
  // Ketma-ket kelgan yuqori indekslar bitta zaryad: "²⁻" -> "^2-", "^" bir marta
  let yuqoridamiz = false;

  for (const belgi of kirish) {
    const yuqoriRaqam = YUQORI_INDEKS.indexOf(belgi);
    const yuqoriBelgi = belgi === "⁺" ? "+" : belgi === "⁻" ? "-" : null;

    if (yuqoriRaqam >= 0 || yuqoriBelgi) {
      if (!yuqoridamiz) {
        natija += "^";
        yuqoridamiz = true;
      }
      natija += yuqoriBelgi ?? String(yuqoriRaqam);
      continue;
    }

    yuqoridamiz = false;

    const pastki = PASTKI_INDEKS.indexOf(belgi);
    if (pastki >= 0) natija += String(pastki);
    else if ("·•⋅∙*".includes(belgi)) natija += ".";
    else if (belgi === " " || belgi === "\t")
      continue; // bo'sh joy tashlanadi
    else natija += belgi;
  }

  return natija;
}

/** Matnning i-o'rnidan boshlab raqam o'qiydi. Raqam bo'lmasa 1 qaytadi. */
function sonniOqi(matn: string, i: number): [son: number, keyingi: number] {
  let raqamlar = "";
  while (i < matn.length && matn[i] >= "0" && matn[i] <= "9") {
    raqamlar += matn[i];
    i++;
  }
  if (!raqamlar) return [1, i];

  const son = Number(raqamlar);
  if (son === 0) throw new FormulaXatosi("Indeks 0 bo'lishi mumkin emas");
  return [son, i];
}

/** b dagi atomlarni k marta olib a ga qo'shadi */
function qoshish(
  a: Record<string, number>,
  b: Record<string, number>,
  k: number,
) {
  for (const [symbol, soni] of Object.entries(b)) {
    a[symbol] = (a[symbol] ?? 0) + soni * k;
  }
}

const OCHUVCHI = "([{";
const YOPUVCHI = ")]}";

/**
 * Formulaning bir bo'lagini o'qiydi. Qavs ichiga kirganda o'zini qayta
 * chaqiradi — shuning uchun K3[Fe(CN)6] kabi ichma-ich qavslar ishlaydi.
 */
function guruhniOqi(
  matn: string,
  boshlanish: number,
  qavsIchida: boolean,
): [atomlar: Record<string, number>, keyingi: number] {
  const atomlar: Record<string, number> = {};
  let i = boshlanish;

  while (i < matn.length) {
    const belgi = matn[i];

    if (OCHUVCHI.includes(belgi)) {
      const [ich, yopilgandanKeyin] = guruhniOqi(matn, i + 1, true);
      const [koeffitsient, keyingi] = sonniOqi(matn, yopilgandanKeyin);
      qoshish(atomlar, ich, koeffitsient);
      i = keyingi;
      continue;
    }

    if (YOPUVCHI.includes(belgi)) {
      if (!qavsIchida) {
        throw new FormulaXatosi(`Ortiqcha yopuvchi qavs: "${belgi}"`);
      }
      return [atomlar, i + 1];
    }

    if (belgi >= "A" && belgi <= "Z") {
      // Ikki harfli belgi bormi? "Co" — kobalt, "CO" — uglerod + kislorod.
      const keyingiBelgi = matn[i + 1];
      const ikkiHarfli =
        keyingiBelgi >= "a" && keyingiBelgi <= "z"
          ? belgi + keyingiBelgi
          : null;

      let symbol: string;
      if (ikkiHarfli && MASSALAR[ikkiHarfli] !== undefined) {
        symbol = ikkiHarfli;
        i += 2;
      } else if (ikkiHarfli) {
        throw new FormulaXatosi(`"${ikkiHarfli}" degan element yo'q`);
      } else if (MASSALAR[belgi] !== undefined) {
        symbol = belgi;
        i += 1;
      } else {
        throw new FormulaXatosi(`"${belgi}" degan element yo'q`);
      }

      const [soni, keyingi] = sonniOqi(matn, i);
      atomlar[symbol] = (atomlar[symbol] ?? 0) + soni;
      i = keyingi;
      continue;
    }

    if (belgi >= "a" && belgi <= "z") {
      throw new FormulaXatosi(
        `Element belgisi katta harfdan boshlanadi — "${belgi}" emas, "${belgi.toUpperCase()}"`,
      );
    }

    throw new FormulaXatosi(`Tushunarsiz belgi: "${belgi}"`);
  }

  if (qavsIchida) throw new FormulaXatosi("Qavs yopilmagan");
  return [atomlar, i];
}

/** "Fe", "Cl" kabi yakka element belgisi */
const YAKKA_ELEMENT = /^[A-Z][a-z]?$/;

/**
 * Formulaning oxiridagi zaryadni ajratib oladi.
 *
 * Bu yerda haqiqiy ikki ma'nolilik bor va uni tan olish kerak. Belgidan
 * oldingi raqam ba'zan zaryad, ba'zan indeks:
 *
 *   Fe3+   -> Fe³⁺   (uch atomli temir emas)
 *   NO3-   -> NO₃⁻   (zaryadi 3 emas, 1)
 *   SO42-  -> SO₄²⁻  (4 — indeks, 2 — zaryad)
 *
 * Qoidalar:
 *   • "^" bo'lsa — undan keyingisi zaryad, boshqa savol yo'q (eng ishonchli yo'l)
 *   • tana yakka element yoki qavs bilan tugasa — raqam zaryad
 *   • ikki va undan ko'p raqam bo'lsa — oxirgisi zaryad, qolgani indeks
 *   • bitta raqam va murakkab tana bo'lsa — raqam indeks, zaryad 1
 */
function zaryadniAjrat(bolak: string): [tana: string, zaryad: number] {
  const moslik = bolak.match(/(\^?)(\d*)([+-])$/);
  if (!moslik) return [bolak, 0];

  const [, karet, raqamlar, belgi] = moslik;
  const oldi = bolak.slice(0, moslik.index);
  if (!oldi)
    throw new FormulaXatosi(`Zaryaddan oldin formula yo'q: "${bolak}"`);

  const ishora = belgi === "+" ? 1 : -1;

  if (karet) return [oldi, ishora * (raqamlar ? Number(raqamlar) : 1)];
  if (!raqamlar) return [oldi, ishora];

  if (/[)\]}]$/.test(oldi) || YAKKA_ELEMENT.test(oldi)) {
    return [oldi, ishora * Number(raqamlar)];
  }

  if (raqamlar.length >= 2) {
    return [oldi + raqamlar.slice(0, -1), ishora * Number(raqamlar.slice(-1))];
  }

  return [oldi + raqamlar, ishora];
}

/**
 * Kimyoviy formulani tahlil qiladi.
 *
 * @throws {FormulaXatosi} formula noto'g'ri bo'lsa — xabari foydalanuvchiga
 *   ko'rsatishga tayyor
 */
export function formulaniOqi(kirish: string): Formula {
  const tozalangan = String(kirish ?? "").trim();
  if (!tozalangan) throw new FormulaXatosi("Formula kiritilmagan");

  const matn = tayyorla(tozalangan);

  // Gidrat: CuSO4·5H2O — har bo'lak alohida o'qiladi
  const bolaklar = matn.split(".").filter((b) => b.length > 0);
  if (bolaklar.length === 0) throw new FormulaXatosi("Formula kiritilmagan");

  const atomlar: Record<string, number> = {};
  let zaryad = 0;

  for (const bolak of bolaklar) {
    const [tana, bolakZaryadi] = zaryadniAjrat(bolak);

    // Oldidagi koeffitsient: "5H2O"
    const [koeffitsient, boshlanish] = sonniOqi(tana, 0);

    const [qismAtomlari] = guruhniOqi(tana, boshlanish, false);
    if (Object.keys(qismAtomlari).length === 0) {
      throw new FormulaXatosi("Formula bo'sh");
    }

    qoshish(atomlar, qismAtomlari, koeffitsient);
    zaryad += bolakZaryadi * koeffitsient;
  }

  let molyarMassa = 0;
  for (const [symbol, soni] of Object.entries(atomlar)) {
    molyarMassa += MASSALAR[symbol] * soni;
  }

  const tarkib: TarkibQismi[] = Object.entries(atomlar)
    .map(([symbol, soni]) => {
      const massa = MASSALAR[symbol] * soni;
      return {
        symbol,
        nom: NOMLAR[symbol],
        soni,
        massa,
        foiz: (massa / molyarMassa) * 100,
      };
    })
    .sort((a, b) => b.foiz - a.foiz);

  return { kiritilgan: tozalangan, atomlar, molyarMassa, tarkib, zaryad };
}

/**
 * Faqat molyar massa kerak bo'lganda. Formula noto'g'ri bo'lsa xato tashlaydi.
 */
export function molyarMassa(formula: string): number {
  return formulaniOqi(formula).molyarMassa;
}

/** Element davriy jadvalda bormi */
export function elementBormi(symbol: string): boolean {
  return MASSALAR[symbol] !== undefined;
}
