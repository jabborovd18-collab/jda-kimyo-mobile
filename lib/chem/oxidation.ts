// lib/chem/oxidation.ts
//
// Oksidlanish darajasini hisoblash.
//
// MUHIM CHEKLOV — buni yashirmaslik kerak: oksidlanish darajasi umumiy holatda
// formuladan hisoblanmaydi. Uni aniqlash uchun moddaning tuzilishini bilish
// kerak. Masalan Na₂S₂O₃ (tiosulfat) da ikki oltingugurtning darajasi turlicha
// (+6 va -2), formulaga qarab buni aytib bo'lmaydi — algoritm faqat o'rtachani
// beradi.
//
// Shuning uchun bu yerdagi hisob quyidagi shartda ishlaydi:
//   • birikmada faqat BITTA noma'lum element bo'lsa
//   • qolganlarining darajasi qat'iy qoidaga bo'ysunsa (ishqoriy metall +1,
//     kislorod -2 va h.k.)
//
// Natija butun son chiqmasa — bu o'rtacha daraja, foydalanuvchiga shunday
// aytiladi. Shart bajarilmasa hisob qilinmaydi va sababi yoziladi.

import { formulaniOqi, FormulaXatosi } from "./molar-mass";

/** Har doim -1 (ftordan boshqa hech narsa uni oksidlay olmaydi) */
const FTOR = ["F"];

/** Birikmalarda doim +1 */
const ISHQORIY = ["Li", "Na", "K", "Rb", "Cs", "Fr"];

/** Birikmalarda doim +2 */
const ISHQORIY_YER = ["Be", "Mg", "Ca", "Sr", "Ba", "Ra"];

/** Amalda o'zgarmas darajali metallar */
const QATIY = new Map<string, number>([
  ...FTOR.map((s) => [s, -1] as [string, number]),
  ...ISHQORIY.map((s) => [s, 1] as [string, number]),
  ...ISHQORIY_YER.map((s) => [s, 2] as [string, number]),
  ["Al", 3],
  ["Zn", 2],
  ["Ag", 1],
  ["Sc", 3],
  ["Y", 3],
]);

/** Metall gidridlari — bularda vodorod -1 */
const METALL_GIDRIDI = /^(Li|Na|K|Rb|Cs|Be|Mg|Ca|Sr|Ba|Al)H\d*$/;

/** Peroksidlar — bularda kislorod -1 (o'ta kam uchraydigan holatlar) */
const PEROKSIDLAR = new Set([
  "H2O2",
  "Na2O2",
  "K2O2",
  "Li2O2",
  "BaO2",
  "CaO2",
  "SrO2",
  "MgO2",
  "ZnO2",
]);

/** Superoksidlar — kislorod -1/2 */
const SUPEROKSIDLAR = new Set(["KO2", "RbO2", "CsO2", "NaO2"]);

export interface OksidlanishNatijasi {
  /** So'ralgan element */
  element: string;
  /** Oksidlanish darajasi. Kasr bo'lishi mumkin (Fe₃O₄ -> 8/3) */
  daraja: number;
  /** Ekranga chiqariladigan ko'rinish: "+3", "-2", "+8/3" */
  matn: string;
  /** Butun son chiqmagan bo'lsa — bu o'rtacha daraja */
  ortacha: boolean;
  /** Hisob qanday chiqqani: har bir elementning hissasi */
  izoh: string[];
}

export class OksidlanishXatosi extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OksidlanishXatosi";
  }
}

/** 2.6666 -> "+8/3" ko'rinishiga keltirish (maxrasi kichik bo'lsa) */
function kasrKorinishi(qiymat: number): string {
  const belgi = qiymat < 0 ? "-" : "+";
  const kattalik = Math.abs(qiymat);

  if (Number.isInteger(kattalik)) return `${belgi}${kattalik}`;

  for (let maxraj = 2; maxraj <= 8; maxraj++) {
    const surat = kattalik * maxraj;
    if (Math.abs(surat - Math.round(surat)) < 1e-9) {
      return `${belgi}${Math.round(surat)}/${maxraj}`;
    }
  }

  return `${belgi}${kattalik.toFixed(2)}`;
}

/**
 * Formuladagi bitta elementning oksidlanish darajasi.
 *
 * @param formula "H2SO4", "KMnO4", "Fe3O4"
 * @param element qaysi elementning darajasi kerak. Bo'sh qoldirilsa —
 *   qoidaga bo'ysunmaydigan yagona element o'zi topiladi.
 * @throws {OksidlanishXatosi} bir ma'noli hisoblab bo'lmasa
 */
export function oksidlanishDarajasi(
  formula: string,
  element?: string,
): OksidlanishNatijasi {
  let oqilgan;
  try {
    oqilgan = formulaniOqi(formula);
  } catch (xato) {
    if (xato instanceof FormulaXatosi)
      throw new OksidlanishXatosi(xato.message);
    throw xato;
  }

  const { atomlar, zaryad } = oqilgan;
  const belgilar = Object.keys(atomlar);
  const tozaFormula = formula.replace(/\s/g, "");

  // Sof modda: O₂, Fe, S₈ — darajasi 0
  if (belgilar.length === 1 && zaryad === 0) {
    const symbol = belgilar[0];
    return {
      element: symbol,
      daraja: 0,
      matn: "0",
      ortacha: false,
      izoh: ["Sof modda — oksidlanish darajasi har doim 0"],
    };
  }

  // Bir atomli ion: Na⁺, Cl⁻ — darajasi zaryadga teng
  if (belgilar.length === 1 && atomlar[belgilar[0]] === 1) {
    const symbol = belgilar[0];
    return {
      element: symbol,
      daraja: zaryad,
      matn: kasrKorinishi(zaryad),
      ortacha: false,
      izoh: ["Bir atomli ion — darajasi zaryadiga teng"],
    };
  }

  // ─── Ma'lum darajalarni belgilash ───
  const malum = new Map<string, number>();
  const izoh: string[] = [];

  for (const symbol of belgilar) {
    const qatiy = QATIY.get(symbol);
    if (qatiy !== undefined) {
      malum.set(symbol, qatiy);
      continue;
    }

    if (symbol === "H") {
      const gidridmi = METALL_GIDRIDI.test(tozaFormula);
      malum.set("H", gidridmi ? -1 : 1);
      if (gidridmi) izoh.push("Metall gidridi — vodorod -1");
      continue;
    }

    if (symbol === "O") {
      if (PEROKSIDLAR.has(tozaFormula)) {
        malum.set("O", -1);
        izoh.push("Peroksid — kislorod -1");
      } else if (SUPEROKSIDLAR.has(tozaFormula)) {
        malum.set("O", -0.5);
        izoh.push("Superoksid — kislorod -1/2");
      } else if (atomlar.F) {
        // OF₂ da kislorod musbat — ftor kuchliroq oksidlovchi
        throw new OksidlanishXatosi(
          "Tarkibida ham kislorod, ham ftor bor — bu holatda kislorodning " +
            "darajasi -2 emas. Qo'lda hisoblang.",
        );
      } else {
        malum.set("O", -2);
      }
      continue;
    }
  }

  // ─── Noma'lumlar ───
  const nomalum = belgilar.filter((s) => !malum.has(s));

  if (element && !belgilar.includes(element)) {
    throw new OksidlanishXatosi(`"${element}" bu formulada yo'q`);
  }

  /** Qoida bilan belgilangan elementni javob qilib qaytarish */
  const qoidadanJavob = (symbol: string): OksidlanishNatijasi => {
    const qiymat = malum.get(symbol)!;
    return {
      element: symbol,
      daraja: qiymat,
      matn: kasrKorinishi(qiymat),
      ortacha: false,
      izoh: [
        ...izoh,
        `${symbol} — qat'iy qoida bo'yicha ${kasrKorinishi(qiymat)}`,
      ],
    };
  };

  // So'ralgan element qoida bilan allaqachon belgilangan: H₂O₂ dagi kislorod
  if (element && malum.has(element)) return qoidadanJavob(element);

  if (nomalum.length === 0) {
    // Hamma element qoidaga bo'ysunadi (NaH, H₂O₂, NaF). Javob — oxirgi
    // element: formulada odatda oxirida qiziqarli qism turadi.
    return qoidadanJavob(belgilar[belgilar.length - 1]);
  }

  if (nomalum.length > 1) {
    throw new OksidlanishXatosi(
      `Formulada ${nomalum.length} ta noma'lum element bor (${nomalum.join(", ")}). ` +
        "Oksidlanish darajasi faqat bitta noma'lum bo'lganda bir ma'noli " +
        "aniqlanadi.",
    );
  }

  const nishon = nomalum[0];

  // ─── Yechish: Σ(daraja × son) = zaryad ───
  let malumYigindi = 0;
  for (const [symbol, daraja] of malum) {
    const soni = atomlar[symbol];
    malumYigindi += daraja * soni;
    izoh.push(
      `${symbol}: ${kasrKorinishi(daraja)} × ${soni} = ${daraja * soni}`,
    );
  }

  const soni = atomlar[nishon];
  const daraja = (zaryad - malumYigindi) / soni;

  izoh.push(
    `${nishon}: (${zaryad} − ${malumYigindi}) ÷ ${soni} = ${kasrKorinishi(daraja)}`,
  );

  const ortacha = !Number.isInteger(daraja);
  if (ortacha) {
    izoh.push(
      `Butun son chiqmadi — demak ${nishon} atomlari bir xil holatda emas. ` +
        "Bu o'rtacha daraja.",
    );
  } else if (soni > 1) {
    // NH₄NO₃ da ikkala azot ham "+1" bo'lib chiqadi, aslida -3 va +5.
    // Butun son chiqqani natija to'g'ri degani emas.
    izoh.push(
      `${soni} ta ${nishon} atomi bir xil holatda deb hisoblandi. Agar element ` +
        "birikmada ikki xil vazifada bo'lsa (NH₄NO₃, Na₂S₂O₃), bu o'rtacha qiymat.",
    );
  }

  return {
    element: nishon,
    daraja,
    matn: kasrKorinishi(daraja),
    ortacha,
    izoh,
  };
}
