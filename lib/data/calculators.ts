// lib/data/calculators.ts
//
// Kalkulyatorlar bazasi.
//
// Qoida bitta: ro'yxatda turgan har bir kalkulyator ishlashi shart. Ilgari
// 51 tadan 20 tasi bosilganda "Bu kalkulyator hozir mavjud emas" derdi —
// ya'ni ro'yxat uzun ko'rinardi, lekin yarmi bo'sh edi. Endi har biriga
// hisob funksiyasi bor va tests/calculators.test.ts da darslikdan olingan
// misol bilan tekshiriladi.
//
// Uch tur bor:
//   raqamli   — oddiy kalkulyator, sonlar kiritiladi
//   formula   — kimyoviy formula yoziladi (H₂SO₄), matn qaytadi
//   konvertor — birliklar konvertori ekranini ochadi

import { formulaniOqi, FormulaXatosi } from "@/lib/chem/molar-mass";
import { oksidlanishDarajasi, OksidlanishXatosi } from "@/lib/chem/oxidation";
import { AVOGADRO, sonniYoz } from "@/lib/chem/units";

// ─────────────────────────────────────────────────────────────
// Fizik konstantalar (CODATA 2018 — 2019-yildan beri aniq qiymatlar)
// ─────────────────────────────────────────────────────────────
export const KONSTANTA = {
  /** Avogadro soni, 1/mol */
  NA: AVOGADRO,
  /** Universal gaz konstantasi, J/(mol·K) */
  R: 8.314462618,
  /** Gaz konstantasi, L·atm/(mol·K) — gaz qonunlarida shu qulay */
  R_atm: 0.08205736608,
  /** Faradey soni, C/mol */
  F: 96485.33212,
  /** Plank konstantasi, J·s */
  h: 6.62607015e-34,
  /** Yorug'lik tezligi, m/s */
  c: 299792458,
  /** Boltsman konstantasi, J/K */
  k: 1.380649e-23,
  /** Elektron massasi, kg */
  me: 9.1093837015e-31,
  /** Normal sharoitdagi molyar hajm, L/mol (0 °C, 1 atm) */
  Vm: 22.414,
} as const;

export type KalkulyatorTuri = "raqamli" | "formula" | "konvertor";

export interface CalculatorInput {
  name: string;
  unit: string;
  placeholder: string;
  /** Qiymat 0 dan katta bo'lishi shart — massa, hajm, konsentratsiya */
  positive?: boolean;
  /** Bo'sh qoldirilishi mumkin (ideal gaz qonunida noma'lum kattalik) */
  optional?: boolean;
  /** Matn kiritiladi, raqam emas — kimyoviy formula uchun */
  text?: boolean;
  /** Kiritish oldidan o'qiladigan eslatma */
  note?: string;
}

export interface CalculatorResult {
  /** Asosiy natija — ekranda katta harfda */
  value: string;
  unit: string;
  /** Hisob qanday chiqqani yoki qo'shimcha izoh */
  steps?: string[];
}

export interface Calculator {
  id: string;
  name: string;
  category: string;
  description: string;
  formula: string;
  emoji: string;
  kind?: KalkulyatorTuri;
  /** kind === "konvertor" bo'lganda qaysi guruh ochilsin */
  converterGroup?: string;
  inputs: CalculatorInput[];
  output: string;
  unit: string;
  /** Kalkulyatorning cheklovi yoki ishlatish sharti */
  note?: string;
  /** Raqamli kalkulyator uchun */
  calculate?: (inputs: Record<string, number>) => CalculatorResult;
  /** Matnli (formula) kalkulyator uchun */
  calculateText?: (inputs: Record<string, string>) => CalculatorResult;
}

/** Hisob qilib bo'lmaganda — xabari to'g'ridan-to'g'ri ekranga chiqadi */
export class KalkulyatorXatosi extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KalkulyatorXatosi";
  }
}

/** Natija obyektini yasash — har safar qo'lda yozmaslik uchun */
function natija(
  qiymat: number,
  birlik: string,
  qadamlar?: string[],
): CalculatorResult {
  if (!Number.isFinite(qiymat)) {
    throw new KalkulyatorXatosi(
      "Natija son chiqmadi — kiritilgan qiymatlarni tekshiring",
    );
  }
  return { value: sonniYoz(qiymat), unit: birlik, steps: qadamlar };
}

/** Nolga bo'linishning oldini oladi */
function bolish(surat: number, maxraj: number, nima: string): number {
  if (maxraj === 0) {
    throw new KalkulyatorXatosi(
      `${nima} 0 bo'lishi mumkin emas — nolga bo'lib bo'lmaydi`,
    );
  }
  return surat / maxraj;
}

/** Formula xatosini kalkulyator xatosiga aylantirish */
function formulaOqi(matn: string) {
  try {
    return formulaniOqi(matn);
  } catch (xato) {
    if (xato instanceof FormulaXatosi)
      throw new KalkulyatorXatosi(xato.message);
    throw xato;
  }
}

export const calculators: Calculator[] = [
  // ═══════════════════════════════════════════════════════════
  // 1. UMUMIY KIMYO
  // ═══════════════════════════════════════════════════════════
  {
    id: "mol-calc",
    name: "Mol kalkulyatori",
    category: "Umumiy kimyo",
    description: "Massadan mol miqdorini hisoblash",
    formula: "n = m / M",
    emoji: "⚛️",
    inputs: [
      {
        name: "Massa (m)",
        unit: "g",
        placeholder: "Masalan: 49",
        positive: true,
      },
      {
        name: "Molyar massa (M)",
        unit: "g/mol",
        placeholder: "Masalan: 98.08",
        positive: true,
      },
    ],
    output: "Mol miqdori",
    unit: "mol",
    calculate: (k) =>
      natija(
        bolish(k["Massa (m)"], k["Molyar massa (M)"], "Molyar massa"),
        "mol",
      ),
  },
  {
    id: "mass-calc",
    name: "Massa kalkulyatori",
    category: "Umumiy kimyo",
    description: "Mol miqdoridan massani hisoblash",
    formula: "m = n × M",
    emoji: "⚖️",
    inputs: [
      {
        name: "Mol miqdori (n)",
        unit: "mol",
        placeholder: "Masalan: 0.5",
        positive: true,
      },
      {
        name: "Molyar massa (M)",
        unit: "g/mol",
        placeholder: "Masalan: 98.08",
        positive: true,
      },
    ],
    output: "Massa",
    unit: "g",
    calculate: (k) => natija(k["Mol miqdori (n)"] * k["Molyar massa (M)"], "g"),
  },
  {
    id: "molar-mass-calc",
    name: "Molyar massa kalkulyatori",
    category: "Umumiy kimyo",
    description: "Kimyoviy formuladan molyar massani hisoblash",
    formula: "M = Σ(atom massalari)",
    emoji: "🧮",
    kind: "formula",
    note: "Qavs, gidrat va zaryad tushuniladi: Ca(OH)₂, CuSO₄·5H₂O, SO₄²⁻",
    inputs: [
      {
        name: "Kimyoviy formula",
        unit: "",
        placeholder: "H2SO4, Ca(OH)2, CuSO4*5H2O",
        text: true,
      },
    ],
    output: "Molyar massa",
    unit: "g/mol",
    calculateText: (k) => {
      const f = formulaOqi(k["Kimyoviy formula"]);
      const qadamlar = f.tarkib.map(
        (q) =>
          `${q.nom} (${q.symbol}): ${q.soni} × ${sonniYoz(q.massa / q.soni)} = ${sonniYoz(q.massa)} g/mol`,
      );
      const atomlar = Object.values(f.atomlar).reduce((a, b) => a + b, 0);
      qadamlar.push(`Jami ${atomlar} ta atom`);
      if (f.zaryad !== 0)
        qadamlar.push(`Zaryad: ${f.zaryad > 0 ? "+" : ""}${f.zaryad}`);
      return { value: sonniYoz(f.molyarMassa), unit: "g/mol", steps: qadamlar };
    },
  },
  {
    id: "percent-composition-calc",
    name: "Formuladagi massa ulushlari",
    category: "Umumiy kimyo",
    description: "Har bir elementning massa foizini formuladan hisoblash",
    formula: "ω(E) = (n(E) × A(E)) / M × 100%",
    emoji: "📊",
    kind: "formula",
    inputs: [
      { name: "Kimyoviy formula", unit: "", placeholder: "H2SO4", text: true },
    ],
    output: "Massa ulushlari",
    unit: "",
    calculateText: (k) => {
      const f = formulaOqi(k["Kimyoviy formula"]);
      const eng = f.tarkib[0];
      return {
        value: `${eng.symbol} — ${eng.foiz.toFixed(2)}%`,
        unit: "",
        steps: [
          `M = ${sonniYoz(f.molyarMassa)} g/mol`,
          ...f.tarkib.map(
            (q) =>
              `${q.nom} (${q.symbol}): ${q.foiz.toFixed(2)}%  —  ${sonniYoz(q.massa)} g/mol`,
          ),
        ],
      };
    },
  },
  {
    id: "particles-calc",
    name: "Zarrachalar soni",
    category: "Umumiy kimyo",
    description: "Mol miqdoridan atom/molekulalar sonini hisoblash",
    formula: "N = n × Nₐ",
    emoji: "🔬",
    inputs: [
      {
        name: "Mol miqdori (n)",
        unit: "mol",
        placeholder: "Masalan: 2",
        positive: true,
      },
    ],
    output: "Zarrachalar soni",
    unit: "ta",
    calculate: (k) =>
      natija(k["Mol miqdori (n)"] * KONSTANTA.NA, "ta", [
        `Nₐ = ${sonniYoz(KONSTANTA.NA)} 1/mol`,
      ]),
  },
  {
    id: "particles-to-mol-calc",
    name: "Zarrachalar sonidan mol",
    category: "Umumiy kimyo",
    description: "Berilgan zarrachalar soniga mos mol miqdori",
    formula: "n = N / Nₐ",
    emoji: "🔢",
    inputs: [
      {
        name: "Zarrachalar soni (N)",
        unit: "ta",
        placeholder: "Masalan: 3.011e23",
        positive: true,
        note: "Katta sonni 3.011e23 ko'rinishida yozish mumkin",
      },
    ],
    output: "Mol miqdori",
    unit: "mol",
    calculate: (k) => natija(k["Zarrachalar soni (N)"] / KONSTANTA.NA, "mol"),
  },
  {
    id: "mass-percent-calc",
    name: "Elementning massa foizi",
    category: "Umumiy kimyo",
    description: "Element massasining formula massasiga nisbati",
    formula: "ω = (m(element) / M) × 100%",
    emoji: "📈",
    inputs: [
      {
        name: "Element massa",
        unit: "g/mol",
        placeholder: "Masalan: 32.06",
        positive: true,
      },
      {
        name: "Formula massa",
        unit: "g/mol",
        placeholder: "Masalan: 98.08",
        positive: true,
      },
    ],
    output: "Massa foizi",
    unit: "%",
    calculate: (k) =>
      natija(
        bolish(k["Element massa"], k["Formula massa"], "Formula massa") * 100,
        "%",
      ),
  },
  {
    id: "density-calc",
    name: "Zichlik",
    category: "Umumiy kimyo",
    description: "Massa va hajmdan zichlikni hisoblash",
    formula: "ρ = m / V",
    emoji: "🪨",
    inputs: [
      {
        name: "Massa (m)",
        unit: "g",
        placeholder: "Masalan: 27",
        positive: true,
      },
      {
        name: "Hajm (V)",
        unit: "sm³",
        placeholder: "Masalan: 10",
        positive: true,
      },
    ],
    output: "Zichlik",
    unit: "g/sm³",
    calculate: (k) =>
      natija(bolish(k["Massa (m)"], k["Hajm (V)"], "Hajm"), "g/sm³"),
  },

  // ═══════════════════════════════════════════════════════════
  // 2. ERITMALAR KIMYOSI
  // ═══════════════════════════════════════════════════════════
  {
    id: "molarity-calc",
    name: "Molyarlik (M)",
    category: "Eritmalar kimyosi",
    description: "Eritmaning molyar konsentratsiyasi",
    formula: "C = n / V",
    emoji: "🧪",
    inputs: [
      {
        name: "Mol miqdori (n)",
        unit: "mol",
        placeholder: "Masalan: 0.5",
        positive: true,
      },
      {
        name: "Eritma hajmi (V)",
        unit: "L",
        placeholder: "Masalan: 2",
        positive: true,
      },
    ],
    output: "Molyarlik",
    unit: "mol/L",
    calculate: (k) =>
      natija(
        bolish(k["Mol miqdori (n)"], k["Eritma hajmi (V)"], "Hajm"),
        "mol/L",
      ),
  },
  {
    id: "solution-prep-calc",
    name: "Eritma tayyorlash",
    category: "Eritmalar kimyosi",
    description:
      "Kerakli konsentratsiyadagi eritma uchun necha gramm modda kerak",
    formula: "m = C × V × M",
    emoji: "⚗️",
    inputs: [
      {
        name: "Konsentratsiya (C)",
        unit: "mol/L",
        placeholder: "Masalan: 0.1",
        positive: true,
      },
      {
        name: "Eritma hajmi (V)",
        unit: "L",
        placeholder: "Masalan: 0.5",
        positive: true,
      },
      {
        name: "Molyar massa (M)",
        unit: "g/mol",
        placeholder: "Masalan: 58.44",
        positive: true,
      },
    ],
    output: "Kerakli massa",
    unit: "g",
    calculate: (k) =>
      natija(
        k["Konsentratsiya (C)"] * k["Eritma hajmi (V)"] * k["Molyar massa (M)"],
        "g",
        ["Modda o'lchab olinadi va hajm belgisigacha erituvchi qo'shiladi"],
      ),
  },
  {
    id: "molality-calc",
    name: "Molyallik (m)",
    category: "Eritmalar kimyosi",
    description: "1 kg erituvchiga to'g'ri keladigan mol miqdori",
    formula: "b = n / m(erituvchi)",
    emoji: "💧",
    inputs: [
      {
        name: "Mol miqdori (n)",
        unit: "mol",
        placeholder: "Masalan: 0.25",
        positive: true,
      },
      {
        name: "Erituvchi massasi",
        unit: "kg",
        placeholder: "Masalan: 0.5",
        positive: true,
      },
    ],
    output: "Molyallik",
    unit: "mol/kg",
    calculate: (k) =>
      natija(
        bolish(
          k["Mol miqdori (n)"],
          k["Erituvchi massasi"],
          "Erituvchi massasi",
        ),
        "mol/kg",
      ),
  },
  {
    id: "normality-calc",
    name: "Normallik (N)",
    category: "Eritmalar kimyosi",
    description: "Ekvivalent konsentratsiya",
    formula: "N = (n × z) / V",
    emoji: "⚡",
    note: "z — ekvivalentlik soni: H₂SO₄ uchun 2, HCl uchun 1",
    inputs: [
      {
        name: "Mol miqdori (n)",
        unit: "mol",
        placeholder: "Masalan: 0.5",
        positive: true,
      },
      {
        name: "Ekvivalentlik soni (z)",
        unit: "",
        placeholder: "Masalan: 2",
        positive: true,
      },
      {
        name: "Eritma hajmi (V)",
        unit: "L",
        placeholder: "Masalan: 1",
        positive: true,
      },
    ],
    output: "Normallik",
    unit: "N",
    calculate: (k) =>
      natija(
        bolish(
          k["Mol miqdori (n)"] * k["Ekvivalentlik soni (z)"],
          k["Eritma hajmi (V)"],
          "Hajm",
        ),
        "N",
      ),
  },
  {
    id: "mass-percent-sol-calc",
    name: "Eritmadagi massa ulushi",
    category: "Eritmalar kimyosi",
    description: "Erigan moddaning eritmadagi foizi",
    formula: "ω = (m(modda) / m(eritma)) × 100%",
    emoji: "📊",
    inputs: [
      {
        name: "Modda massasi",
        unit: "g",
        placeholder: "Masalan: 20",
        positive: true,
      },
      {
        name: "Eritma massasi",
        unit: "g",
        placeholder: "Masalan: 200",
        positive: true,
      },
    ],
    output: "Massa ulushi",
    unit: "%",
    calculate: (k) => {
      if (k["Modda massasi"] > k["Eritma massasi"]) {
        throw new KalkulyatorXatosi(
          "Modda massasi eritma massasidan katta bo'lishi mumkin emas",
        );
      }
      return natija(
        bolish(k["Modda massasi"], k["Eritma massasi"], "Eritma massasi") * 100,
        "%",
      );
    },
  },
  {
    id: "percent-to-molarity-calc",
    name: "Massa ulushidan molyarlikka",
    category: "Eritmalar kimyosi",
    description: "Foizli eritmani molyar konsentratsiyaga o'tkazish",
    formula: "C = (10 × ω × ρ) / M",
    emoji: "🔄",
    note: "Konsentrlangan kislotalar shishasida foiz va zichlik yozilgan bo'ladi",
    inputs: [
      {
        name: "Massa ulushi (ω)",
        unit: "%",
        placeholder: "Masalan: 96",
        positive: true,
      },
      {
        name: "Zichlik (ρ)",
        unit: "g/mL",
        placeholder: "Masalan: 1.84",
        positive: true,
      },
      {
        name: "Molyar massa (M)",
        unit: "g/mol",
        placeholder: "Masalan: 98.08",
        positive: true,
      },
    ],
    output: "Konsentratsiya",
    unit: "mol/L",
    calculate: (k) => {
      if (k["Massa ulushi (ω)"] > 100) {
        throw new KalkulyatorXatosi(
          "Massa ulushi 100% dan katta bo'lishi mumkin emas",
        );
      }
      return natija(
        bolish(
          10 * k["Massa ulushi (ω)"] * k["Zichlik (ρ)"],
          k["Molyar massa (M)"],
          "Molyar massa",
        ),
        "mol/L",
      );
    },
  },
  {
    id: "dilution-calc",
    name: "Suyultirish (C₁V₁ = C₂V₂)",
    category: "Eritmalar kimyosi",
    description: "Suyultirilgandan keyingi hajmni topish",
    formula: "V₂ = (C₁ × V₁) / C₂",
    emoji: "🌊",
    inputs: [
      {
        name: "Boshlang'ich konsentratsiya (C₁)",
        unit: "mol/L",
        placeholder: "Masalan: 2",
        positive: true,
      },
      {
        name: "Boshlang'ich hajm (V₁)",
        unit: "mL",
        placeholder: "Masalan: 50",
        positive: true,
      },
      {
        name: "Yakuniy konsentratsiya (C₂)",
        unit: "mol/L",
        placeholder: "Masalan: 0.5",
        positive: true,
      },
    ],
    output: "Yakuniy hajm (V₂)",
    unit: "mL",
    calculate: (k) => {
      const V2 = bolish(
        k["Boshlang'ich konsentratsiya (C₁)"] * k["Boshlang'ich hajm (V₁)"],
        k["Yakuniy konsentratsiya (C₂)"],
        "Yakuniy konsentratsiya",
      );
      const qoshimcha = V2 - k["Boshlang'ich hajm (V₁)"];
      return natija(V2, "mL", [
        qoshimcha >= 0
          ? `Ustiga ${sonniYoz(qoshimcha)} mL erituvchi qo'shiladi`
          : "Yakuniy konsentratsiya boshlang'ichdan katta — bu suyultirish emas, quyultirish",
      ]);
    },
  },
  {
    id: "titration-calc",
    name: "Titrlash: noma'lum konsentratsiya",
    category: "Eritmalar kimyosi",
    description:
      "Titrlash natijasidan noma'lum eritma konsentratsiyasini topish",
    formula: "C₁ = (C₂ × V₂ × z₂) / (V₁ × z₁)",
    emoji: "💉",
    note: "z — ekvivalentlik soni. HCl + NaOH uchun ikkalasi ham 1",
    inputs: [
      {
        name: "Noma'lum eritma hajmi (V₁)",
        unit: "mL",
        placeholder: "Masalan: 25",
        positive: true,
      },
      {
        name: "Noma'lum ekvivalentligi (z₁)",
        unit: "",
        placeholder: "Masalan: 1",
        positive: true,
      },
      {
        name: "Titrant konsentratsiyasi (C₂)",
        unit: "mol/L",
        placeholder: "Masalan: 0.1",
        positive: true,
      },
      {
        name: "Titrant hajmi (V₂)",
        unit: "mL",
        placeholder: "Masalan: 20",
        positive: true,
      },
      {
        name: "Titrant ekvivalentligi (z₂)",
        unit: "",
        placeholder: "Masalan: 1",
        positive: true,
      },
    ],
    output: "Noma'lum konsentratsiya",
    unit: "mol/L",
    calculate: (k) =>
      natija(
        bolish(
          k["Titrant konsentratsiyasi (C₂)"] *
            k["Titrant hajmi (V₂)"] *
            k["Titrant ekvivalentligi (z₂)"],
          k["Noma'lum eritma hajmi (V₁)"] * k["Noma'lum ekvivalentligi (z₁)"],
          "Hajm yoki ekvivalentlik",
        ),
        "mol/L",
      ),
  },
  {
    id: "ppm-calc",
    name: "PPM kalkulyatori",
    category: "Eritmalar kimyosi",
    description: "Juda kichik konsentratsiyani million ulushida ifodalash",
    formula: "ppm = (m(modda) / m(eritma)) × 10⁶",
    emoji: "🔍",
    inputs: [
      {
        name: "Modda massasi",
        unit: "mg",
        placeholder: "Masalan: 5",
        positive: true,
      },
      {
        name: "Eritma massasi",
        unit: "kg",
        placeholder: "Masalan: 1",
        positive: true,
      },
    ],
    output: "Konsentratsiya",
    unit: "ppm",
    calculate: (k) =>
      // mg / kg = ppm (1 kg = 10⁶ mg)
      natija(
        bolish(k["Modda massasi"], k["Eritma massasi"], "Eritma massasi"),
        "ppm",
      ),
  },

  // ═══════════════════════════════════════════════════════════
  // 3. STEXIOMETRIYA
  // ═══════════════════════════════════════════════════════════
  {
    id: "limiting-reagent-calc",
    name: "Limitlovchi reagent",
    category: "Stexiometriya",
    description: "Qaysi reagent birinchi tugashini aniqlash",
    formula: "n / koeffitsient — kichigi limitlovchi",
    emoji: "⚗️",
    inputs: [
      {
        name: "1-reagent mol",
        unit: "mol",
        placeholder: "Masalan: 3",
        positive: true,
      },
      {
        name: "1-reagent koeffitsienti",
        unit: "",
        placeholder: "Masalan: 1",
        positive: true,
      },
      {
        name: "2-reagent mol",
        unit: "mol",
        placeholder: "Masalan: 4",
        positive: true,
      },
      {
        name: "2-reagent koeffitsienti",
        unit: "",
        placeholder: "Masalan: 3",
        positive: true,
      },
    ],
    output: "Limitlovchi reagent",
    unit: "",
    calculate: (k) => {
      const birinchi = bolish(
        k["1-reagent mol"],
        k["1-reagent koeffitsienti"],
        "Koeffitsient",
      );
      const ikkinchi = bolish(
        k["2-reagent mol"],
        k["2-reagent koeffitsienti"],
        "Koeffitsient",
      );
      const teng = Math.abs(birinchi - ikkinchi) < 1e-9;

      return {
        value: teng
          ? "Ikkalasi barobar tugaydi"
          : birinchi < ikkinchi
            ? "1-reagent"
            : "2-reagent",
        unit: "",
        steps: [
          `1-reagent: ${sonniYoz(k["1-reagent mol"])} ÷ ${k["1-reagent koeffitsienti"]} = ${sonniYoz(birinchi)}`,
          `2-reagent: ${sonniYoz(k["2-reagent mol"])} ÷ ${k["2-reagent koeffitsienti"]} = ${sonniYoz(ikkinchi)}`,
          teng
            ? "Nisbatlar teng — ikkalasi ham to'liq sarflanadi"
            : `Kichik nisbat limitlaydi, ortiqchasi reaksiyaga kirmay qoladi`,
        ],
      };
    },
  },
  {
    id: "theoretical-yield-calc",
    name: "Nazariy unum",
    category: "Stexiometriya",
    description: "Limitlovchi reagentdan maksimal necha gramm mahsulot chiqadi",
    formula: "m = (n(lim) / a) × b × M(mahsulot)",
    emoji: "📦",
    note: "a — limitlovchi reagent koeffitsienti, b — mahsulot koeffitsienti",
    inputs: [
      {
        name: "Limitlovchi reagent mol",
        unit: "mol",
        placeholder: "Masalan: 2",
        positive: true,
      },
      {
        name: "Limitlovchi koeffitsienti (a)",
        unit: "",
        placeholder: "Masalan: 2",
        positive: true,
      },
      {
        name: "Mahsulot koeffitsienti (b)",
        unit: "",
        placeholder: "Masalan: 1",
        positive: true,
      },
      {
        name: "Mahsulot molyar massasi",
        unit: "g/mol",
        placeholder: "Masalan: 80.06",
        positive: true,
      },
    ],
    output: "Nazariy unum",
    unit: "g",
    calculate: (k) => {
      const mol = bolish(
        k["Limitlovchi reagent mol"] * k["Mahsulot koeffitsienti (b)"],
        k["Limitlovchi koeffitsienti (a)"],
        "Limitlovchi koeffitsienti",
      );
      return natija(mol * k["Mahsulot molyar massasi"], "g", [
        `Mahsulot mol miqdori: ${sonniYoz(mol)} mol`,
      ]);
    },
  },
  {
    id: "percent-yield-calc",
    name: "Amaliy unum foizi",
    category: "Stexiometriya",
    description: "Amalda olingan mahsulot nazariydan necha foiz",
    formula: "η = (m(amaliy) / m(nazariy)) × 100%",
    emoji: "✅",
    inputs: [
      {
        name: "Amaliy unum",
        unit: "g",
        placeholder: "Masalan: 68",
        positive: true,
      },
      {
        name: "Nazariy unum",
        unit: "g",
        placeholder: "Masalan: 80",
        positive: true,
      },
    ],
    output: "Unum",
    unit: "%",
    calculate: (k) => {
      const foiz =
        bolish(k["Amaliy unum"], k["Nazariy unum"], "Nazariy unum") * 100;
      return natija(foiz, "%", [
        foiz > 100
          ? "100% dan katta — mahsulot quritilmagan yoki o'lchovda xato bor"
          : `Yo'qotish: ${sonniYoz(100 - foiz)}%`,
      ]);
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 4. GAZ QONUNLARI
  // ═══════════════════════════════════════════════════════════
  {
    id: "ideal-gas-calc",
    name: "Ideal gaz qonuni",
    category: "Gaz qonunlari",
    description: "PV = nRT — noma'lum kattalikni topish",
    formula: "PV = nRT",
    emoji: "💨",
    note: "Qaysi kattalik kerak bo'lsa, o'sha katakni BO'SH qoldiring",
    inputs: [
      {
        name: "Bosim (P)",
        unit: "atm",
        placeholder: "Masalan: 1",
        optional: true,
      },
      {
        name: "Hajm (V)",
        unit: "L",
        placeholder: "Masalan: 22.4",
        optional: true,
      },
      {
        name: "Mol miqdori (n)",
        unit: "mol",
        placeholder: "Masalan: 1",
        optional: true,
      },
      {
        name: "Temperatura (T)",
        unit: "K",
        placeholder: "Masalan: 273.15",
        optional: true,
      },
    ],
    output: "Noma'lum kattalik",
    unit: "",
    calculate: (k) => {
      const P = k["Bosim (P)"];
      const V = k["Hajm (V)"];
      const n = k["Mol miqdori (n)"];
      const T = k["Temperatura (T)"];
      const R = KONSTANTA.R_atm;

      const bosh = [
        ["Bosim (P)", P],
        ["Hajm (V)", V],
        ["Mol miqdori (n)", n],
        ["Temperatura (T)", T],
      ].filter(([, qiymat]) => !Number.isFinite(qiymat as number));

      if (bosh.length !== 1) {
        throw new KalkulyatorXatosi(
          `Aynan bitta katak bo'sh qolishi kerak — hozir ${bosh.length} ta bo'sh`,
        );
      }

      const izoh = [`R = ${R.toFixed(5)} L·atm/(mol·K)`];
      switch (bosh[0][0]) {
        case "Bosim (P)":
          return natija(bolish(n * R * T, V, "Hajm"), "atm", izoh);
        case "Hajm (V)":
          return natija(bolish(n * R * T, P, "Bosim"), "L", izoh);
        case "Mol miqdori (n)":
          return natija(bolish(P * V, R * T, "Temperatura"), "mol", izoh);
        default:
          return natija(bolish(P * V, n * R, "Mol miqdori"), "K", izoh);
      }
    },
  },
  {
    id: "molar-volume-calc",
    name: "Gaz hajmi (normal sharoit)",
    category: "Gaz qonunlari",
    description: "Normal sharoitda (0 °C, 1 atm) gaz hajmi",
    formula: "V = n × 22.4",
    emoji: "🎈",
    inputs: [
      {
        name: "Mol miqdori (n)",
        unit: "mol",
        placeholder: "Masalan: 0.5",
        positive: true,
      },
    ],
    output: "Hajm",
    unit: "L",
    calculate: (k) =>
      natija(k["Mol miqdori (n)"] * KONSTANTA.Vm, "L", [
        "Normal sharoit: 0 °C va 1 atm. Xona haroratida (25 °C) molyar hajm 24.5 L/mol",
      ]),
  },
  {
    id: "boyle-law-calc",
    name: "Boyl-Mariott qonuni",
    category: "Gaz qonunlari",
    description: "O'zgarmas haroratda P₁V₁ = P₂V₂",
    formula: "V₂ = (P₁ × V₁) / P₂",
    emoji: "🫧",
    inputs: [
      {
        name: "Boshlang'ich bosim (P₁)",
        unit: "atm",
        placeholder: "Masalan: 1",
        positive: true,
      },
      {
        name: "Boshlang'ich hajm (V₁)",
        unit: "L",
        placeholder: "Masalan: 5",
        positive: true,
      },
      {
        name: "Yakuniy bosim (P₂)",
        unit: "atm",
        placeholder: "Masalan: 2.5",
        positive: true,
      },
    ],
    output: "Yakuniy hajm (V₂)",
    unit: "L",
    calculate: (k) =>
      natija(
        bolish(
          k["Boshlang'ich bosim (P₁)"] * k["Boshlang'ich hajm (V₁)"],
          k["Yakuniy bosim (P₂)"],
          "Yakuniy bosim",
        ),
        "L",
      ),
  },
  {
    id: "charles-law-calc",
    name: "Gey-Lyussak (Sharl) qonuni",
    category: "Gaz qonunlari",
    description: "O'zgarmas bosimda V₁/T₁ = V₂/T₂",
    formula: "V₂ = V₁ × T₂ / T₁",
    emoji: "🌡️",
    note: "Harorat KELVINDA bo'lishi shart: K = °C + 273.15",
    inputs: [
      {
        name: "Boshlang'ich hajm (V₁)",
        unit: "L",
        placeholder: "Masalan: 2",
        positive: true,
      },
      {
        name: "Boshlang'ich temperatura (T₁)",
        unit: "K",
        placeholder: "Masalan: 273",
        positive: true,
      },
      {
        name: "Yakuniy temperatura (T₂)",
        unit: "K",
        placeholder: "Masalan: 546",
        positive: true,
      },
    ],
    output: "Yakuniy hajm (V₂)",
    unit: "L",
    calculate: (k) =>
      natija(
        bolish(
          k["Boshlang'ich hajm (V₁)"] * k["Yakuniy temperatura (T₂)"],
          k["Boshlang'ich temperatura (T₁)"],
          "Boshlang'ich temperatura",
        ),
        "L",
      ),
  },
  {
    id: "relative-density-calc",
    name: "Gazning nisbiy zichligi",
    category: "Gaz qonunlari",
    description: "Bir gazning boshqasiga nisbatan zichligi",
    formula: "D = M₁ / M₂",
    emoji: "⚖️",
    note: "Havo bo'yicha: M₂ = 29 g/mol, vodorod bo'yicha: M₂ = 2.016 g/mol",
    inputs: [
      {
        name: "Gaz molyar massasi (M₁)",
        unit: "g/mol",
        placeholder: "Masalan: 44",
        positive: true,
      },
      {
        name: "Solishtirilayotgan gaz (M₂)",
        unit: "g/mol",
        placeholder: "Havo: 29",
        positive: true,
      },
    ],
    output: "Nisbiy zichlik",
    unit: "",
    calculate: (k) => {
      const D = bolish(
        k["Gaz molyar massasi (M₁)"],
        k["Solishtirilayotgan gaz (M₂)"],
        "Solishtirilayotgan gaz massasi",
      );
      return natija(D, "", [
        D > 1
          ? "Gaz solishtirilganidan og'ir — pastga cho'kadi"
          : "Gaz yengil — yuqoriga ko'tariladi",
      ]);
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 5. KISLOTA VA ASOSLAR
  // ═══════════════════════════════════════════════════════════
  {
    id: "ph-calc",
    name: "pH kalkulyatori",
    category: "Kislota va asoslar",
    description: "Vodorod ionlari konsentratsiyasidan pH",
    formula: "pH = −log[H⁺]",
    emoji: "🧫",
    inputs: [
      {
        name: "[H⁺] konsentratsiya",
        unit: "mol/L",
        placeholder: "Masalan: 0.001",
        positive: true,
      },
    ],
    output: "pH",
    unit: "",
    calculate: (k) => {
      const pH = -Math.log10(k["[H⁺] konsentratsiya"]);
      return natija(pH, "", [
        `pOH = ${sonniYoz(14 - pH)}`,
        pH < 7
          ? "Kislotali muhit"
          : pH > 7
            ? "Ishqoriy muhit"
            : "Neytral muhit",
      ]);
    },
  },
  {
    id: "poh-calc",
    name: "pOH kalkulyatori",
    category: "Kislota va asoslar",
    description: "Gidroksid ionlari konsentratsiyasidan pOH",
    formula: "pOH = −log[OH⁻]",
    emoji: "🧬",
    inputs: [
      {
        name: "[OH⁻] konsentratsiya",
        unit: "mol/L",
        placeholder: "Masalan: 0.01",
        positive: true,
      },
    ],
    output: "pOH",
    unit: "",
    calculate: (k) => {
      const pOH = -Math.log10(k["[OH⁻] konsentratsiya"]);
      return natija(pOH, "", [
        `pH = ${sonniYoz(14 - pOH)}`,
        "25 °C uchun: pH + pOH = 14",
      ]);
    },
  },
  {
    id: "h-concentration-calc",
    name: "[H⁺] hisoblash",
    category: "Kislota va asoslar",
    description: "pH dan vodorod ionlari konsentratsiyasi",
    formula: "[H⁺] = 10⁻ᵖᴴ",
    emoji: "⚛️",
    inputs: [{ name: "pH", unit: "", placeholder: "Masalan: 3" }],
    output: "[H⁺]",
    unit: "mol/L",
    calculate: (k) =>
      natija(Math.pow(10, -k["pH"]), "mol/L", [
        `[OH⁻] = ${sonniYoz(Math.pow(10, -(14 - k["pH"])))} mol/L`,
      ]),
  },
  {
    id: "oh-concentration-calc",
    name: "[OH⁻] hisoblash",
    category: "Kislota va asoslar",
    description: "pOH dan gidroksid ionlari konsentratsiyasi",
    formula: "[OH⁻] = 10⁻ᵖᴼᴴ",
    emoji: "🔋",
    inputs: [{ name: "pOH", unit: "", placeholder: "Masalan: 4" }],
    output: "[OH⁻]",
    unit: "mol/L",
    calculate: (k) => natija(Math.pow(10, -k["pOH"]), "mol/L"),
  },
  {
    id: "weak-acid-ph-calc",
    name: "Kuchsiz kislota pH",
    category: "Kislota va asoslar",
    description: "Dissotsilanish konstantasidan kuchsiz kislota pH i",
    formula: "pH = ½(pKa − log C)",
    emoji: "🍋",
    note: "Taqribiy formula: dissotsilanish darajasi 5% dan kichik bo'lganda to'g'ri ishlaydi",
    inputs: [
      { name: "pKa", unit: "", placeholder: "Sirka kislota: 4.76" },
      {
        name: "Konsentratsiya (C)",
        unit: "mol/L",
        placeholder: "Masalan: 0.1",
        positive: true,
      },
    ],
    output: "pH",
    unit: "",
    calculate: (k) => {
      const pH = 0.5 * (k["pKa"] - Math.log10(k["Konsentratsiya (C)"]));
      const Ka = Math.pow(10, -k["pKa"]);
      const daraja = Math.sqrt(Ka / k["Konsentratsiya (C)"]) * 100;
      return natija(pH, "", [
        `Dissotsilanish darajasi ≈ ${sonniYoz(daraja)}%`,
        daraja > 5
          ? "5% dan katta — taqribiy formula xato beradi, kvadrat tenglama yechish kerak"
          : "Taqribiy formula ishonchli",
      ]);
    },
  },
  {
    id: "henderson-hasselbalch-calc",
    name: "Henderson-Hasselbalx (bufer)",
    category: "Kislota va asoslar",
    description: "Bufer eritmaning pH ini hisoblash",
    formula: "pH = pKa + log([A⁻]/[HA])",
    emoji: "🧪",
    inputs: [
      { name: "pKa", unit: "", placeholder: "Masalan: 4.76" },
      {
        name: "[A⁻] (tuz)",
        unit: "mol/L",
        placeholder: "Masalan: 0.1",
        positive: true,
      },
      {
        name: "[HA] (kislota)",
        unit: "mol/L",
        placeholder: "Masalan: 0.1",
        positive: true,
      },
    ],
    output: "pH",
    unit: "",
    calculate: (k) => {
      const nisbat = bolish(
        k["[A⁻] (tuz)"],
        k["[HA] (kislota)"],
        "Kislota konsentratsiyasi",
      );
      const pH = k["pKa"] + Math.log10(nisbat);
      return natija(pH, "", [
        `[A⁻]/[HA] = ${sonniYoz(nisbat)}`,
        Math.abs(pH - k["pKa"]) <= 1
          ? "pKa ± 1 oralig'ida — bufer yaxshi ishlaydi"
          : "pKa dan uzoq — bufer sig'imi kichik",
      ]);
    },
  },
  {
    id: "ka-pka-calc",
    name: "Ka ↔ pKa",
    category: "Kislota va asoslar",
    description: "Dissotsilanish konstantasidan pKa",
    formula: "pKa = −log Ka",
    emoji: "🔢",
    inputs: [
      { name: "Ka", unit: "", placeholder: "Masalan: 1.8e-5", positive: true },
    ],
    output: "pKa",
    unit: "",
    calculate: (k) => {
      const pKa = -Math.log10(k["Ka"]);
      return natija(pKa, "", [
        pKa < 0
          ? "Kuchli kislota"
          : pKa < 5
            ? "O'rtacha kuchli"
            : "Kuchsiz kislota",
      ]);
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 6. TERMODINAMIKA
  // ═══════════════════════════════════════════════════════════
  {
    id: "enthalpy-calc",
    name: "Reaksiya entalpiyasi (ΔH)",
    category: "Termodinamika",
    description: "Gess qonuni bo'yicha issiqlik effekti",
    formula: "ΔH = ΣΔHf(mahsulot) − ΣΔHf(reagent)",
    emoji: "🔥",
    inputs: [
      {
        name: "Mahsulotlar ΣΔHf",
        unit: "kJ/mol",
        placeholder: "Masalan: -393.5",
      },
      { name: "Reagentlar ΣΔHf", unit: "kJ/mol", placeholder: "Masalan: 0" },
    ],
    output: "ΔH",
    unit: "kJ/mol",
    calculate: (k) => {
      const dH = k["Mahsulotlar ΣΔHf"] - k["Reagentlar ΣΔHf"];
      return natija(dH, "kJ/mol", [
        dH < 0
          ? "Ekzotermik — issiqlik ajraladi"
          : "Endotermik — issiqlik yutiladi",
      ]);
    },
  },
  {
    id: "entropy-calc",
    name: "Reaksiya entropiyasi (ΔS)",
    category: "Termodinamika",
    description: "Tartibsizlik o'zgarishi",
    formula: "ΔS = ΣS°(mahsulot) − ΣS°(reagent)",
    emoji: "🌀",
    inputs: [
      {
        name: "Mahsulotlar ΣS°",
        unit: "J/(mol·K)",
        placeholder: "Masalan: 213.7",
      },
      {
        name: "Reagentlar ΣS°",
        unit: "J/(mol·K)",
        placeholder: "Masalan: 205.2",
      },
    ],
    output: "ΔS",
    unit: "J/(mol·K)",
    calculate: (k) => {
      const dS = k["Mahsulotlar ΣS°"] - k["Reagentlar ΣS°"];
      return natija(dS, "J/(mol·K)", [
        dS > 0
          ? "Tartibsizlik ortadi (odatda gaz ajraladi)"
          : "Tartibsizlik kamayadi",
      ]);
    },
  },
  {
    id: "gibbs-energy-calc",
    name: "Gibbs energiyasi (ΔG)",
    category: "Termodinamika",
    description: "Reaksiya o'z-o'zidan boradimi yoki yo'q",
    formula: "ΔG = ΔH − TΔS",
    emoji: "⚡",
    note: "ΔS J/(mol·K) da kiritiladi — formulada 1000 ga bo'linadi",
    inputs: [
      { name: "ΔH", unit: "kJ/mol", placeholder: "Masalan: -92.2" },
      {
        name: "Temperatura (T)",
        unit: "K",
        placeholder: "Masalan: 298",
        positive: true,
      },
      { name: "ΔS", unit: "J/(mol·K)", placeholder: "Masalan: -198.7" },
    ],
    output: "ΔG",
    unit: "kJ/mol",
    calculate: (k) => {
      const dG = k["ΔH"] - (k["Temperatura (T)"] * k["ΔS"]) / 1000;
      return natija(dG, "kJ/mol", [
        dG < 0
          ? "ΔG < 0 — reaksiya shu haroratda o'z-o'zidan boradi"
          : dG > 0
            ? "ΔG > 0 — o'z-o'zidan bormaydi, teskarisi boradi"
            : "ΔG = 0 — muvozanat holati",
      ]);
    },
  },
  {
    id: "heat-capacity-calc",
    name: "Isitish issiqligi",
    category: "Termodinamika",
    description: "Moddani isitish uchun kerak bo'lgan issiqlik",
    formula: "Q = m × c × ΔT",
    emoji: "🌡️",
    inputs: [
      {
        name: "Massa (m)",
        unit: "g",
        placeholder: "Masalan: 100",
        positive: true,
      },
      {
        name: "Solishtirma issiqlik (c)",
        unit: "J/(g·°C)",
        placeholder: "Suv: 4.18",
        positive: true,
      },
      {
        name: "Temperatura o'zgarishi (ΔT)",
        unit: "°C",
        placeholder: "Masalan: 50",
      },
    ],
    output: "Issiqlik (Q)",
    unit: "J",
    calculate: (k) => {
      const Q =
        k["Massa (m)"] *
        k["Solishtirma issiqlik (c)"] *
        k["Temperatura o'zgarishi (ΔT)"];
      return natija(Q, "J", [`${sonniYoz(Q / 1000)} kJ`]);
    },
  },
  {
    id: "equilibrium-constant-calc",
    name: "Muvozanat konstantasi (ΔG° dan)",
    category: "Termodinamika",
    description: "Standart Gibbs energiyasidan K ni topish",
    formula: "K = e^(−ΔG° / RT)",
    emoji: "⚖️",
    inputs: [
      { name: "ΔG°", unit: "kJ/mol", placeholder: "Masalan: -33" },
      {
        name: "Temperatura (T)",
        unit: "K",
        placeholder: "Masalan: 298",
        positive: true,
      },
    ],
    output: "Muvozanat konstantasi (K)",
    unit: "",
    calculate: (k) => {
      const K = Math.exp(
        (-k["ΔG°"] * 1000) / (KONSTANTA.R * k["Temperatura (T)"]),
      );
      return natija(K, "", [
        K > 1
          ? "K > 1 — muvozanat mahsulot tomonga siljigan"
          : "K < 1 — reagentlar tomonga siljigan",
      ]);
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 7. ELEKTROKIMYO
  // ═══════════════════════════════════════════════════════════
  {
    id: "nernst-calc",
    name: "Nernst tenglamasi",
    category: "Elektrokimyo",
    description: "Nostandart sharoitdagi elektrod potensiali",
    formula: "E = E° − (0.0592/n) × log Q",
    emoji: "🔌",
    note: "0.0592 koeffitsienti 25 °C uchun",
    inputs: [
      {
        name: "Standart potensial (E°)",
        unit: "V",
        placeholder: "Masalan: 1.1",
      },
      {
        name: "Elektronlar soni (n)",
        unit: "",
        placeholder: "Masalan: 2",
        positive: true,
      },
      {
        name: "Reaksiya kvotienti (Q)",
        unit: "",
        placeholder: "Masalan: 0.1",
        positive: true,
      },
    ],
    output: "Potensial (E)",
    unit: "V",
    calculate: (k) =>
      natija(
        k["Standart potensial (E°)"] -
          (0.0592 / k["Elektronlar soni (n)"]) *
            Math.log10(k["Reaksiya kvotienti (Q)"]),
        "V",
      ),
  },
  {
    id: "faraday-law-calc",
    name: "Faradey qonuni",
    category: "Elektrokimyo",
    description: "Elektrolizda ajralgan modda massasi",
    formula: "m = (M × I × t) / (n × F)",
    emoji: "🔋",
    inputs: [
      {
        name: "Molyar massa (M)",
        unit: "g/mol",
        placeholder: "Masalan: 63.55",
        positive: true,
      },
      {
        name: "Tok kuchi (I)",
        unit: "A",
        placeholder: "Masalan: 2",
        positive: true,
      },
      {
        name: "Vaqt (t)",
        unit: "s",
        placeholder: "Masalan: 3600",
        positive: true,
      },
      {
        name: "Elektronlar soni (n)",
        unit: "",
        placeholder: "Masalan: 2",
        positive: true,
      },
    ],
    output: "Ajralgan massa",
    unit: "g",
    calculate: (k) => {
      const zaryad = k["Tok kuchi (I)"] * k["Vaqt (t)"];
      return natija(
        bolish(
          k["Molyar massa (M)"] * zaryad,
          k["Elektronlar soni (n)"] * KONSTANTA.F,
          "Elektronlar soni",
        ),
        "g",
        [
          `O'tgan zaryad: ${sonniYoz(zaryad)} C`,
          `F = ${KONSTANTA.F.toFixed(0)} C/mol`,
        ],
      );
    },
  },
  {
    id: "cell-potential-calc",
    name: "Galvanik element EYK si",
    category: "Elektrokimyo",
    description: "Standart elektrod potensiallaridan element kuchlanishi",
    formula: "E°(element) = E°(katod) − E°(anod)",
    emoji: "🔌",
    inputs: [
      {
        name: "Katod potensiali (E°)",
        unit: "V",
        placeholder: "Cu²⁺/Cu: 0.34",
      },
      {
        name: "Anod potensiali (E°)",
        unit: "V",
        placeholder: "Zn²⁺/Zn: -0.76",
      },
    ],
    output: "EYK",
    unit: "V",
    calculate: (k) => {
      const E = k["Katod potensiali (E°)"] - k["Anod potensiali (E°)"];
      return natija(E, "V", [
        E > 0
          ? "Musbat — reaksiya o'z-o'zidan boradi (galvanik element)"
          : "Manfiy — tashqi tok kerak (elektroliz)",
      ]);
    },
  },
  {
    id: "gibbs-from-emf-calc",
    name: "EYK dan ΔG",
    category: "Elektrokimyo",
    description: "Element kuchlanishidan Gibbs energiyasi",
    formula: "ΔG = −n × F × E",
    emoji: "⚡",
    inputs: [
      {
        name: "Elektronlar soni (n)",
        unit: "",
        placeholder: "Masalan: 2",
        positive: true,
      },
      { name: "EYK (E)", unit: "V", placeholder: "Masalan: 1.1" },
    ],
    output: "ΔG",
    unit: "kJ/mol",
    calculate: (k) =>
      natija(
        (-k["Elektronlar soni (n)"] * KONSTANTA.F * k["EYK (E)"]) / 1000,
        "kJ/mol",
      ),
  },

  // ═══════════════════════════════════════════════════════════
  // 8. ANALITIK KIMYO
  // ═══════════════════════════════════════════════════════════
  {
    id: "beer-lambert-calc",
    name: "Buger-Lambert-Ber qonuni",
    category: "Analitik kimyo",
    description: "Yutilish (absorbans) hisoblash",
    formula: "A = ε × l × C",
    emoji: "🔬",
    inputs: [
      {
        name: "Molyar yutilish (ε)",
        unit: "L/(mol·sm)",
        placeholder: "Masalan: 15000",
        positive: true,
      },
      {
        name: "Kyuveta uzunligi (l)",
        unit: "sm",
        placeholder: "Masalan: 1",
        positive: true,
      },
      {
        name: "Konsentratsiya (C)",
        unit: "mol/L",
        placeholder: "Masalan: 0.00005",
        positive: true,
      },
    ],
    output: "Absorbans (A)",
    unit: "",
    calculate: (k) => {
      const A =
        k["Molyar yutilish (ε)"] *
        k["Kyuveta uzunligi (l)"] *
        k["Konsentratsiya (C)"];
      return natija(A, "", [
        `O'tkazuvchanlik T = ${sonniYoz(Math.pow(10, -A) * 100)}%`,
        A > 2
          ? "A > 2 — eritma juda quyuq, suyultirish kerak"
          : "O'lchov ishonchli oraliqda",
      ]);
    },
  },
  {
    id: "concentration-from-absorbance-calc",
    name: "Absorbansdan konsentratsiya",
    category: "Analitik kimyo",
    description: "O'lchangan yutilishdan konsentratsiyani topish",
    formula: "C = A / (ε × l)",
    emoji: "📉",
    inputs: [
      {
        name: "Absorbans (A)",
        unit: "",
        placeholder: "Masalan: 0.75",
        positive: true,
      },
      {
        name: "Molyar yutilish (ε)",
        unit: "L/(mol·sm)",
        placeholder: "Masalan: 15000",
        positive: true,
      },
      {
        name: "Kyuveta uzunligi (l)",
        unit: "sm",
        placeholder: "Masalan: 1",
        positive: true,
      },
    ],
    output: "Konsentratsiya",
    unit: "mol/L",
    calculate: (k) =>
      natija(
        bolish(
          k["Absorbans (A)"],
          k["Molyar yutilish (ε)"] * k["Kyuveta uzunligi (l)"],
          "ε × l",
        ),
        "mol/L",
      ),
  },
  {
    id: "percent-error-calc",
    name: "Nisbiy xatolik",
    category: "Analitik kimyo",
    description: "Tajriba natijasining nazariydan chetlanishi",
    formula: "δ = |x(tajriba) − x(nazariy)| / x(nazariy) × 100%",
    emoji: "📊",
    inputs: [
      { name: "Tajriba qiymati", unit: "", placeholder: "Masalan: 98.5" },
      { name: "Nazariy qiymat", unit: "", placeholder: "Masalan: 100" },
    ],
    output: "Nisbiy xatolik",
    unit: "%",
    calculate: (k) => {
      const xato =
        (Math.abs(k["Tajriba qiymati"] - k["Nazariy qiymat"]) /
          Math.abs(k["Nazariy qiymat"] || NaN)) *
        100;
      if (!Number.isFinite(xato)) {
        throw new KalkulyatorXatosi(
          "Nazariy qiymat 0 bo'lsa nisbiy xatolik hisoblanmaydi",
        );
      }
      return natija(xato, "%", [
        xato < 1
          ? "Juda yaxshi natija"
          : xato < 5
            ? "Qoniqarli"
            : "Xatolik katta — tajribani takrorlang",
      ]);
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 9. ATOM VA KVANT KIMYOSI
  // ═══════════════════════════════════════════════════════════
  {
    id: "de-broglie-calc",
    name: "de Broyl to'lqin uzunligi",
    category: "Atom va kvant kimyosi",
    description: "Harakatlanayotgan zarrachaning to'lqin uzunligi",
    formula: "λ = h / (m × v)",
    emoji: "〰️",
    note: "Elektron massasi: 9.109e-31 kg",
    inputs: [
      {
        name: "Massa (m)",
        unit: "kg",
        placeholder: "Elektron: 9.109e-31",
        positive: true,
      },
      {
        name: "Tezlik (v)",
        unit: "m/s",
        placeholder: "Masalan: 1e6",
        positive: true,
      },
    ],
    output: "To'lqin uzunligi",
    unit: "m",
    calculate: (k) => {
      const lambda = bolish(
        KONSTANTA.h,
        k["Massa (m)"] * k["Tezlik (v)"],
        "Massa × tezlik",
      );
      return natija(lambda, "m", [
        `${sonniYoz(lambda * 1e9)} nm`,
        `${sonniYoz(lambda * 1e10)} Å`,
      ]);
    },
  },
  {
    id: "photon-energy-calc",
    name: "Foton energiyasi",
    category: "Atom va kvant kimyosi",
    description: "To'lqin uzunligidan foton energiyasi",
    formula: "E = hc / λ",
    emoji: "💡",
    inputs: [
      {
        name: "To'lqin uzunligi (λ)",
        unit: "nm",
        placeholder: "Ko'k yorug'lik: 450",
        positive: true,
      },
    ],
    output: "Energiya",
    unit: "J",
    calculate: (k) => {
      const lambdaM = k["To'lqin uzunligi (λ)"] * 1e-9;
      const E = (KONSTANTA.h * KONSTANTA.c) / lambdaM;
      return natija(E, "J", [
        `${sonniYoz(E / 1.602176634e-19)} eV`,
        `1 mol foton uchun: ${sonniYoz((E * KONSTANTA.NA) / 1000)} kJ/mol`,
      ]);
    },
  },
  {
    id: "frequency-energy-calc",
    name: "Chastotadan energiya",
    category: "Atom va kvant kimyosi",
    description: "Plank tenglamasi",
    formula: "E = h × ν",
    emoji: "📻",
    inputs: [
      {
        name: "Chastota (ν)",
        unit: "Hz",
        placeholder: "Masalan: 6e14",
        positive: true,
      },
    ],
    output: "Energiya",
    unit: "J",
    calculate: (k) => {
      const E = KONSTANTA.h * k["Chastota (ν)"];
      return natija(E, "J", [
        `To'lqin uzunligi: ${sonniYoz((KONSTANTA.c / k["Chastota (ν)"]) * 1e9)} nm`,
      ]);
    },
  },
  {
    id: "rydberg-calc",
    name: "Vodorod spektri (Ridberg)",
    category: "Atom va kvant kimyosi",
    description: "Vodorod atomi nurlanishining to'lqin uzunligi",
    formula: "1/λ = R(1/n₁² − 1/n₂²)",
    emoji: "🌈",
    note: "Balmer seriyasi (ko'rinuvchi yorug'lik): n₁ = 2",
    inputs: [
      {
        name: "Quyi sath (n₁)",
        unit: "",
        placeholder: "Masalan: 2",
        positive: true,
      },
      {
        name: "Yuqori sath (n₂)",
        unit: "",
        placeholder: "Masalan: 3",
        positive: true,
      },
    ],
    output: "To'lqin uzunligi",
    unit: "nm",
    calculate: (k) => {
      const n1 = k["Quyi sath (n₁)"];
      const n2 = k["Yuqori sath (n₂)"];
      if (n2 <= n1) {
        throw new KalkulyatorXatosi(
          "Yuqori sath (n₂) quyi sathdan (n₁) katta bo'lishi kerak",
        );
      }
      const R = 1.0973731568e7; // 1/m
      const lambda = 1 / (R * (1 / (n1 * n1) - 1 / (n2 * n2)));
      return natija(lambda * 1e9, "nm", [
        n1 === 1
          ? "Layman seriyasi — ultrabinafsha"
          : n1 === 2
            ? "Balmer seriyasi — ko'rinuvchi"
            : "Pashen va undan yuqori — infraqizil",
      ]);
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 10. NOORGANIK KIMYO
  // ═══════════════════════════════════════════════════════════
  {
    id: "oxidation-state-calc",
    name: "Oksidlanish darajasi",
    category: "Noorganik kimyo",
    description: "Formuladagi elementning oksidlanish darajasi",
    formula: "Σ(daraja × atomlar soni) = zaryad",
    emoji: "⚛️",
    kind: "formula",
    note:
      "Faqat bitta noma'lum element bo'lganda ishlaydi. Bir element birikmada " +
      "ikki xil holatda bo'lsa (NH₄NO₃, Na₂S₂O₃) natija o'rtacha bo'ladi.",
    inputs: [
      {
        name: "Formula",
        unit: "",
        placeholder: "KMnO4, H2SO4, Cr2O7^2-",
        text: true,
      },
      {
        name: "Element (ixtiyoriy)",
        unit: "",
        placeholder: "Mn",
        text: true,
        optional: true,
        note: "Bo'sh qoldirilsa noma'lum element o'zi topiladi",
      },
    ],
    output: "Oksidlanish darajasi",
    unit: "",
    calculateText: (k) => {
      const element = (k["Element (ixtiyoriy)"] || "").trim();
      try {
        const javob = oksidlanishDarajasi(k["Formula"], element || undefined);
        return {
          value: `${javob.element}: ${javob.matn}`,
          unit: "",
          steps: javob.izoh,
        };
      } catch (xato) {
        if (
          xato instanceof OksidlanishXatosi ||
          xato instanceof FormulaXatosi
        ) {
          throw new KalkulyatorXatosi(xato.message);
        }
        throw xato;
      }
    },
  },
  {
    id: "coordination-number-calc",
    name: "Koordinatsion son",
    category: "Noorganik kimyo",
    description: "Kompleks birikmadagi ligandlar sonini formuladan aniqlash",
    formula: "KS = ichki sferadagi ligandlar soni",
    emoji: "🔗",
    kind: "formula",
    note:
      "Ichki sfera kvadrat qavsda yozilgan bo'lishi kerak. Ko'p tishli ligandlar " +
      "(en, EDTA) qisqartma bilan yozilgani uchun sanalmaydi.",
    inputs: [
      {
        name: "Kompleks formulasi",
        unit: "",
        placeholder: "K3[Fe(CN)6], [Cu(NH3)4]SO4",
        text: true,
      },
    ],
    output: "Koordinatsion son",
    unit: "",
    calculateText: (k) => {
      const matn = (k["Kompleks formulasi"] || "").replace(/\s/g, "");
      const ochilish = matn.indexOf("[");
      const yopilish = matn.lastIndexOf("]");

      if (ochilish < 0 || yopilish < ochilish) {
        throw new KalkulyatorXatosi(
          "Ichki sfera topilmadi. Kompleksni kvadrat qavsda yozing: K3[Fe(CN)6]",
        );
      }

      const ichki = matn.slice(ochilish + 1, yopilish);
      const ligandlar: { nom: string; soni: number }[] = [];
      let markaz = "";
      let i = 0;

      while (i < ichki.length) {
        const belgi = ichki[i];

        if (belgi === "(") {
          // Qavsli ligand: (NH3)6 yoki (CN)6
          let chuqurlik = 1;
          let j = i + 1;
          while (j < ichki.length && chuqurlik > 0) {
            if (ichki[j] === "(") chuqurlik++;
            if (ichki[j] === ")") chuqurlik--;
            j++;
          }
          const ichi = ichki.slice(i + 1, j - 1);
          let raqam = "";
          while (j < ichki.length && ichki[j] >= "0" && ichki[j] <= "9") {
            raqam += ichki[j];
            j++;
          }
          ligandlar.push({ nom: ichi, soni: raqam ? Number(raqam) : 1 });
          i = j;
          continue;
        }

        if (belgi >= "A" && belgi <= "Z") {
          let belgiMatn = belgi;
          let j = i + 1;
          while (j < ichki.length && ichki[j] >= "a" && ichki[j] <= "z") {
            belgiMatn += ichki[j];
            j++;
          }
          let raqam = "";
          while (j < ichki.length && ichki[j] >= "0" && ichki[j] <= "9") {
            raqam += ichki[j];
            j++;
          }

          // Birinchi element — markaziy atom
          if (!markaz) markaz = belgiMatn;
          else
            ligandlar.push({ nom: belgiMatn, soni: raqam ? Number(raqam) : 1 });

          i = j;
          continue;
        }

        i++;
      }

      if (!markaz) throw new KalkulyatorXatosi("Markaziy atom topilmadi");
      if (ligandlar.length === 0) {
        throw new KalkulyatorXatosi("Ichki sferada ligand topilmadi");
      }

      const jami = ligandlar.reduce((yigindi, l) => yigindi + l.soni, 0);

      return {
        value: String(jami),
        unit: "",
        steps: [
          `Markaziy atom: ${markaz}`,
          ...ligandlar.map((l) => `Ligand ${l.nom} — ${l.soni} ta`),
          jami === 6
            ? "Oktaedrik tuzilish (eng ko'p uchraydi)"
            : jami === 4
              ? "Tetraedrik yoki kvadrat-tekis tuzilish"
              : jami === 2
                ? "Chiziqli tuzilish"
                : "",
        ].filter(Boolean),
      };
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 11. ORGANIK KIMYO
  // ═══════════════════════════════════════════════════════════
  {
    id: "dbe-calc",
    name: "To'yinmaganlik darajasi (DBE)",
    category: "Organik kimyo",
    description: "Molekuladagi halqa va qo'shbog'lar yig'indisi",
    formula: "DBE = (2C + 2 + N − H − X) / 2",
    emoji: "🔗",
    inputs: [
      {
        name: "Uglerod (C)",
        unit: "ta",
        placeholder: "Masalan: 6",
        positive: true,
      },
      { name: "Vodorod (H)", unit: "ta", placeholder: "Masalan: 6" },
      { name: "Azot (N)", unit: "ta", placeholder: "Yo'q bo'lsa: 0" },
      { name: "Galogen (X)", unit: "ta", placeholder: "Yo'q bo'lsa: 0" },
    ],
    output: "DBE",
    unit: "",
    calculate: (k) => {
      const dbe =
        (2 * k["Uglerod (C)"] +
          2 +
          k["Azot (N)"] -
          k["Vodorod (H)"] -
          k["Galogen (X)"]) /
        2;
      if (dbe < 0) {
        throw new KalkulyatorXatosi(
          "Manfiy chiqdi — bunday molekula bo'lmaydi, atomlar sonini tekshiring",
        );
      }
      return natija(
        dbe,
        "",
        [
          dbe === 0
            ? "To'yingan, halqasiz (masalan alkan)"
            : `${dbe} ta qo'shbog' yoki halqa`,
          dbe >= 4 ? "4 va undan katta — benzol halqasi bo'lishi mumkin" : "",
        ].filter(Boolean),
      );
    },
  },
  {
    id: "dbe-from-formula-calc",
    name: "DBE (formuladan)",
    category: "Organik kimyo",
    description: "To'yinmaganlik darajasini formuladan avtomatik hisoblash",
    formula: "DBE = (2C + 2 + N − H − X) / 2",
    emoji: "🧬",
    kind: "formula",
    inputs: [
      {
        name: "Organik formula",
        unit: "",
        placeholder: "C6H6, C2H5OH, C6H5Cl",
        text: true,
      },
    ],
    output: "DBE",
    unit: "",
    calculateText: (k) => {
      const f = formulaOqi(k["Organik formula"]);
      const C = f.atomlar.C ?? 0;
      const H = f.atomlar.H ?? 0;
      const N = f.atomlar.N ?? 0;
      const X =
        (f.atomlar.F ?? 0) +
        (f.atomlar.Cl ?? 0) +
        (f.atomlar.Br ?? 0) +
        (f.atomlar.I ?? 0);

      if (C === 0)
        throw new KalkulyatorXatosi(
          "Formulada uglerod yo'q — bu organik modda emas",
        );

      const dbe = (2 * C + 2 + N - H - X) / 2;
      return {
        value: sonniYoz(dbe),
        unit: "",
        steps: [
          `C = ${C}, H = ${H}, N = ${N}, galogen = ${X}`,
          "Kislorod DBE ga ta'sir qilmaydi",
          dbe === 0
            ? "To'yingan, halqasiz"
            : `${sonniYoz(dbe)} ta qo'shbog' yoki halqa`,
        ],
      };
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 12. KRISTALLOKIMYO
  // ═══════════════════════════════════════════════════════════
  {
    id: "crystal-density-calc",
    name: "Kristall zichligi",
    category: "Kristallokimyo",
    description: "Elementar yacheyka o'lchamidan zichlik",
    formula: "ρ = (Z × M) / (a³ × Nₐ)",
    emoji: "💎",
    note: "Z — yacheykadagi formula birliklari soni: YMK uchun 4, HMK uchun 2",
    inputs: [
      {
        name: "Formula birliklari (Z)",
        unit: "ta",
        placeholder: "Masalan: 4",
        positive: true,
      },
      {
        name: "Molyar massa (M)",
        unit: "g/mol",
        placeholder: "Masalan: 58.44",
        positive: true,
      },
      {
        name: "Yacheyka qirrasi (a)",
        unit: "Å",
        placeholder: "Masalan: 5.64",
        positive: true,
      },
    ],
    output: "Zichlik",
    unit: "g/sm³",
    calculate: (k) => {
      const aSm = k["Yacheyka qirrasi (a)"] * 1e-8; // Å -> sm
      const hajm = Math.pow(aSm, 3);
      return natija(
        bolish(
          k["Formula birliklari (Z)"] * k["Molyar massa (M)"],
          hajm * KONSTANTA.NA,
          "Hajm",
        ),
        "g/sm³",
        [`Yacheyka hajmi: ${sonniYoz(hajm)} sm³`],
      );
    },
  },
  {
    id: "bragg-law-calc",
    name: "Bregg qonuni",
    category: "Kristallokimyo",
    description: "Rentgen difraksiyasi burchagini topish",
    formula: "nλ = 2d·sinθ",
    emoji: "📡",
    inputs: [
      {
        name: "Tartib (n)",
        unit: "",
        placeholder: "Masalan: 1",
        positive: true,
      },
      {
        name: "To'lqin uzunligi (λ)",
        unit: "Å",
        placeholder: "Cu Kα: 1.5418",
        positive: true,
      },
      {
        name: "Tekisliklar orasi (d)",
        unit: "Å",
        placeholder: "Masalan: 3.14",
        positive: true,
      },
    ],
    output: "Difraksiya burchagi (θ)",
    unit: "°",
    calculate: (k) => {
      const sinTeta = bolish(
        k["Tartib (n)"] * k["To'lqin uzunligi (λ)"],
        2 * k["Tekisliklar orasi (d)"],
        "Tekisliklar orasidagi masofa",
      );
      if (sinTeta > 1) {
        throw new KalkulyatorXatosi(
          `sin θ = ${sonniYoz(sinTeta)} > 1 — bu tartibda difraksiya kuzatilmaydi`,
        );
      }
      const teta = (Math.asin(sinTeta) * 180) / Math.PI;
      return natija(teta, "°", [
        `2θ = ${sonniYoz(2 * teta)}° (difraktogrammada shu o'qiladi)`,
      ]);
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 13. YADRO KIMYOSI
  // ═══════════════════════════════════════════════════════════
  {
    id: "radioactive-decay-calc",
    name: "Radioaktiv yemirilish",
    category: "Yadro kimyosi",
    description: "Ma'lum vaqtdan keyin qolgan modda miqdori",
    formula: "N = N₀ × (1/2)^(t / t½)",
    emoji: "☢️",
    note: "Vaqt va yarim yemirilish davri bir xil birlikda bo'lsin",
    inputs: [
      {
        name: "Boshlang'ich miqdor (N₀)",
        unit: "",
        placeholder: "Masalan: 100",
        positive: true,
      },
      {
        name: "Yarim yemirilish davri (t½)",
        unit: "",
        placeholder: "Masalan: 5730",
        positive: true,
      },
      {
        name: "O'tgan vaqt (t)",
        unit: "",
        placeholder: "Masalan: 11460",
        positive: true,
      },
    ],
    output: "Qolgan miqdor",
    unit: "",
    calculate: (k) => {
      const nisbat = k["O'tgan vaqt (t)"] / k["Yarim yemirilish davri (t½)"];
      const qolgan = k["Boshlang'ich miqdor (N₀)"] * Math.pow(0.5, nisbat);
      return natija(qolgan, "", [
        `${sonniYoz(nisbat)} ta yarim yemirilish davri o'tdi`,
        `Boshlang'ichning ${sonniYoz((qolgan / k["Boshlang'ich miqdor (N₀)"]) * 100)}% i qoldi`,
      ]);
    },
  },
  {
    id: "half-life-calc",
    name: "Yarim yemirilish davri",
    category: "Yadro kimyosi",
    description: "Yemirilish konstantasidan yarim yemirilish davri",
    formula: "t½ = ln2 / λ",
    emoji: "⏱️",
    inputs: [
      {
        name: "Yemirilish konstantasi (λ)",
        unit: "1/s",
        placeholder: "Masalan: 0.0001",
        positive: true,
      },
    ],
    output: "Yarim yemirilish davri",
    unit: "s",
    calculate: (k) => {
      const t = Math.LN2 / k["Yemirilish konstantasi (λ)"];
      return natija(t, "s", [
        `${sonniYoz(t / 3600)} soat`,
        `${sonniYoz(t / 31536000)} yil`,
      ]);
    },
  },
  {
    id: "radiocarbon-age-calc",
    name: "Radiouglerod yoshi",
    category: "Yadro kimyosi",
    description: "¹⁴C qoldig'i bo'yicha namuna yoshini aniqlash",
    formula: "t = t½ × log₀.₅(N / N₀)",
    emoji: "🦴",
    note: "¹⁴C ning yarim yemirilish davri — 5730 yil",
    inputs: [
      {
        name: "Qolgan ¹⁴C ulushi",
        unit: "%",
        placeholder: "Masalan: 25",
        positive: true,
        note: "Tirik organizmga nisbatan foizda",
      },
    ],
    output: "Yosh",
    unit: "yil",
    calculate: (k) => {
      const ulush = k["Qolgan ¹⁴C ulushi"] / 100;
      if (ulush > 1)
        throw new KalkulyatorXatosi(
          "Ulush 100% dan katta bo'lishi mumkin emas",
        );
      const yosh = 5730 * (Math.log(ulush) / Math.log(0.5));
      return natija(
        yosh,
        "yil",
        [
          yosh > 50000
            ? "50 000 yildan katta — radiouglerod usuli bu yerda ishonchli emas"
            : "",
        ].filter(Boolean),
      );
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 14. BIOKIMYO
  // ═══════════════════════════════════════════════════════════
  {
    id: "isoelectric-point-calc",
    name: "Izoelektrik nuqta (pI)",
    category: "Biokimyo",
    description: "Aminokislotaning umumiy zaryadi nolga teng bo'lgan pH",
    formula: "pI = (pKa₁ + pKa₂) / 2",
    emoji: "🧬",
    note: "Yon zanjiri ionlanadigan aminokislotalarda (Lys, Glu) uchinchi pKa hisobga olinadi",
    inputs: [
      { name: "pKa₁ (−COOH)", unit: "", placeholder: "Glitsin: 2.34" },
      { name: "pKa₂ (−NH₃⁺)", unit: "", placeholder: "Glitsin: 9.60" },
    ],
    output: "pI",
    unit: "",
    calculate: (k) => natija((k["pKa₁ (−COOH)"] + k["pKa₂ (−NH₃⁺)"]) / 2, ""),
  },
  {
    id: "gc-content-calc",
    name: "DNK GC tarkibi",
    category: "Biokimyo",
    description: "Guanin va sitozin ulushi",
    formula: "GC% = (G + C) / (A + T + G + C) × 100",
    emoji: "🧫",
    inputs: [
      { name: "G (guanin)", unit: "ta", placeholder: "Masalan: 30" },
      { name: "C (sitozin)", unit: "ta", placeholder: "Masalan: 30" },
      { name: "A (adenin)", unit: "ta", placeholder: "Masalan: 20" },
      { name: "T (timin)", unit: "ta", placeholder: "Masalan: 20" },
    ],
    output: "GC tarkibi",
    unit: "%",
    calculate: (k) => {
      const jami =
        k["G (guanin)"] + k["C (sitozin)"] + k["A (adenin)"] + k["T (timin)"];
      const gc = bolish(
        (k["G (guanin)"] + k["C (sitozin)"]) * 100,
        jami,
        "Nukleotidlar soni",
      );
      return natija(
        gc,
        "%",
        [
          `Jami ${jami} ta nukleotid`,
          gc > 60
            ? "GC yuqori — DNK issiqqa chidamli"
            : gc < 40
              ? "GC past — oson ajraladi"
              : "",
        ].filter(Boolean),
      );
    },
  },
  {
    id: "michaelis-menten-calc",
    name: "Mixaelis-Menten tezligi",
    category: "Biokimyo",
    description: "Ferment reaksiyasining tezligi",
    formula: "v = (Vmax × [S]) / (Km + [S])",
    emoji: "🦠",
    inputs: [
      {
        name: "Vmax",
        unit: "mkmol/min",
        placeholder: "Masalan: 100",
        positive: true,
      },
      {
        name: "Substrat [S]",
        unit: "mM",
        placeholder: "Masalan: 5",
        positive: true,
      },
      { name: "Km", unit: "mM", placeholder: "Masalan: 2", positive: true },
    ],
    output: "Tezlik (v)",
    unit: "mkmol/min",
    calculate: (k) => {
      const v = bolish(
        k["Vmax"] * k["Substrat [S]"],
        k["Km"] + k["Substrat [S]"],
        "Km + [S]",
      );
      return natija(
        v,
        "mkmol/min",
        [
          `Vmax ning ${sonniYoz((v / k["Vmax"]) * 100)}% i`,
          k["Substrat [S]"] > 10 * k["Km"]
            ? "Ferment to'yingan — tezlik Vmax ga yaqin"
            : "",
        ].filter(Boolean),
      );
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 15. KIMYOVIY KINETIKA
  // ═══════════════════════════════════════════════════════════
  {
    id: "reaction-rate-calc",
    name: "Reaksiya tezligi",
    category: "Kimyoviy kinetika",
    description: "Konsentratsiya o'zgarishining tezligi",
    formula: "v = Δ[A] / Δt",
    emoji: "⚡",
    inputs: [
      {
        name: "Konsentratsiya o'zgarishi (Δ[A])",
        unit: "mol/L",
        placeholder: "Masalan: 0.05",
      },
      {
        name: "Vaqt o'zgarishi (Δt)",
        unit: "s",
        placeholder: "Masalan: 10",
        positive: true,
      },
    ],
    output: "Tezlik",
    unit: "mol/(L·s)",
    calculate: (k) =>
      natija(
        Math.abs(
          bolish(
            k["Konsentratsiya o'zgarishi (Δ[A])"],
            k["Vaqt o'zgarishi (Δt)"],
            "Vaqt o'zgarishi",
          ),
        ),
        "mol/(L·s)",
      ),
  },
  {
    id: "arrhenius-calc",
    name: "Arrenius tenglamasi",
    category: "Kimyoviy kinetika",
    description: "Haroratning tezlik konstantasiga ta'siri",
    formula: "k = A × e^(−Ea/RT)",
    emoji: "📈",
    inputs: [
      {
        name: "Pred-eksponensial (A)",
        unit: "",
        placeholder: "Masalan: 1e13",
        positive: true,
      },
      {
        name: "Aktivlanish energiyasi (Ea)",
        unit: "kJ/mol",
        placeholder: "Masalan: 50",
        positive: true,
      },
      {
        name: "Temperatura (T)",
        unit: "K",
        placeholder: "Masalan: 298",
        positive: true,
      },
    ],
    output: "Tezlik konstantasi",
    unit: "",
    calculate: (k) => {
      const daraja =
        (-k["Aktivlanish energiyasi (Ea)"] * 1000) /
        (KONSTANTA.R * k["Temperatura (T)"]);
      return natija(k["Pred-eksponensial (A)"] * Math.exp(daraja), "", [
        `Eksponent: e^${sonniYoz(daraja)}`,
      ]);
    },
  },
  {
    id: "activation-energy-calc",
    name: "Aktivlanish energiyasi",
    category: "Kimyoviy kinetika",
    description: "Ikki haroratdagi tezlik konstantasidan Ea",
    formula: "Ea = R·ln(k₂/k₁) / (1/T₁ − 1/T₂)",
    emoji: "🔥",
    inputs: [
      { name: "k₁", unit: "", placeholder: "Masalan: 0.001", positive: true },
      { name: "T₁", unit: "K", placeholder: "Masalan: 298", positive: true },
      { name: "k₂", unit: "", placeholder: "Masalan: 0.01", positive: true },
      { name: "T₂", unit: "K", placeholder: "Masalan: 320", positive: true },
    ],
    output: "Aktivlanish energiyasi",
    unit: "kJ/mol",
    calculate: (k) => {
      if (k["T₁"] === k["T₂"]) {
        throw new KalkulyatorXatosi(
          "Ikki harorat bir xil — Ea ni hisoblab bo'lmaydi",
        );
      }
      const Ea =
        (KONSTANTA.R * Math.log(k["k₂"] / k["k₁"])) /
        (1 / k["T₁"] - 1 / k["T₂"]);
      return natija(Ea / 1000, "kJ/mol");
    },
  },
  {
    id: "half-life-first-order-calc",
    name: "Yarim yemirilish (1-tartib)",
    category: "Kimyoviy kinetika",
    description: "Birinchi tartibli reaksiyaning yarim o'tish vaqti",
    formula: "t½ = ln2 / k",
    emoji: "⏰",
    note: "Birinchi tartibda t½ boshlang'ich konsentratsiyaga bog'liq emas",
    inputs: [
      {
        name: "Tezlik konstantasi (k)",
        unit: "1/s",
        placeholder: "Masalan: 0.005",
        positive: true,
      },
    ],
    output: "Yarim o'tish vaqti",
    unit: "s",
    calculate: (k) => {
      const t = Math.LN2 / k["Tezlik konstantasi (k)"];
      return natija(t, "s", [`${sonniYoz(t / 60)} daqiqa`]);
    },
  },
  {
    id: "first-order-concentration-calc",
    name: "1-tartibli reaksiya konsentratsiyasi",
    category: "Kimyoviy kinetika",
    description: "Vaqt o'tgach qolgan konsentratsiya",
    formula: "[A] = [A]₀ × e^(−kt)",
    emoji: "📉",
    inputs: [
      {
        name: "Boshlang'ich [A]₀",
        unit: "mol/L",
        placeholder: "Masalan: 0.5",
        positive: true,
      },
      {
        name: "Tezlik konstantasi (k)",
        unit: "1/s",
        placeholder: "Masalan: 0.01",
        positive: true,
      },
      {
        name: "Vaqt (t)",
        unit: "s",
        placeholder: "Masalan: 60",
        positive: true,
      },
    ],
    output: "Qolgan konsentratsiya",
    unit: "mol/L",
    calculate: (k) => {
      const qolgan =
        k["Boshlang'ich [A]₀"] *
        Math.exp(-k["Tezlik konstantasi (k)"] * k["Vaqt (t)"]);
      return natija(qolgan, "mol/L", [
        `Sarflandi: ${sonniYoz(k["Boshlang'ich [A]₀"] - qolgan)} mol/L`,
      ]);
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 16. KONVERTORLAR
  // ═══════════════════════════════════════════════════════════
  {
    id: "unit-converter",
    name: "Birliklar konvertori",
    category: "Konvertorlar",
    description: "Massa, hajm, bosim, harorat, energiya va boshqalar",
    formula: "Istalgan birlikdan istalganiga",
    emoji: "🔄",
    kind: "konvertor",
    inputs: [],
    output: "Natija",
    unit: "",
  },
  {
    id: "temperature-converter",
    name: "Harorat konvertori",
    category: "Konvertorlar",
    description: "Selsiy ↔ Kelvin ↔ Farengeyt",
    formula: "K = °C + 273.15",
    emoji: "🌡️",
    kind: "konvertor",
    converterGroup: "harorat",
    inputs: [],
    output: "Harorat",
    unit: "",
  },
  {
    id: "pressure-converter",
    name: "Bosim konvertori",
    category: "Konvertorlar",
    description: "atm ↔ Pa ↔ mmHg ↔ bar ↔ psi",
    formula: "1 atm = 101325 Pa = 760 mmHg",
    emoji: "🔽",
    kind: "konvertor",
    converterGroup: "bosim",
    inputs: [],
    output: "Bosim",
    unit: "",
  },
  {
    id: "mass-converter",
    name: "Massa konvertori",
    category: "Konvertorlar",
    description: "t ↔ kg ↔ g ↔ mg ↔ µg",
    formula: "1 kg = 1000 g",
    emoji: "⚖️",
    kind: "konvertor",
    converterGroup: "massa",
    inputs: [],
    output: "Massa",
    unit: "",
  },
  {
    id: "volume-converter",
    name: "Hajm konvertori",
    category: "Konvertorlar",
    description: "m³ ↔ L ↔ mL ↔ sm³",
    formula: "1 L = 1000 mL = 1 dm³",
    emoji: "🧊",
    kind: "konvertor",
    converterGroup: "hajm",
    inputs: [],
    output: "Hajm",
    unit: "",
  },
  {
    id: "energy-converter",
    name: "Energiya konvertori",
    category: "Konvertorlar",
    description: "J ↔ kJ ↔ kaloriya ↔ eV",
    formula: "1 kal = 4.184 J",
    emoji: "⚡",
    kind: "konvertor",
    converterGroup: "energiya",
    inputs: [],
    output: "Energiya",
    unit: "",
  },
  {
    id: "amount-converter",
    name: "Mol ↔ zarrachalar",
    category: "Konvertorlar",
    description: "mol ↔ mmol ↔ zarrachalar soni",
    formula: "1 mol = 6.022 × 10²³ ta",
    emoji: "⚛️",
    kind: "konvertor",
    converterGroup: "miqdor",
    inputs: [],
    output: "Miqdor",
    unit: "",
  },
];

/** Kategoriyalar — ro'yxatdagi tartibda, takrorlanmasdan */
export const categories = Array.from(
  new Set(calculators.map((c) => c.category)),
);

/** Ro'yxatdagi kalkulyatorlar soni — ekranda shu ko'rsatiladi */
export const calculatorCount = calculators.length;

/** Nomi, tavsifi, formulasi va kategoriyasi bo'yicha qidiradi */
export function searchCalculators(query: string): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return calculators;

  return calculators.filter((calc) =>
    [calc.name, calc.description, calc.category, calc.formula]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return calculators.filter((calc) => calc.category === category);
}

export function getCalculatorById(id: string): Calculator | undefined {
  return calculators.find((calc) => calc.id === id);
}
