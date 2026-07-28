// tests/calculators.test.ts
//
// Har bir kalkulyator uchun darslikdan olingan sinov misoli.
//
// Nega shunday: kalkulyatorning ishlashi emas, TO'G'RI ishlashi muhim.
// Formulani noto'g'ri yozib qo'yish oson va ilova hech qanday xato
// ko'rsatmaydi — shunchaki noto'g'ri javob beradi. Shuning uchun har bir
// hisob uchun javobi oldindan ma'lum misol bor.

import { describe, expect, it } from "vitest";

import {
  calculators,
  getCalculatorById,
  KalkulyatorXatosi,
  searchCalculators,
  type Calculator,
} from "../lib/data/calculators";

/** "1.2044 × 10^24" ko'rinishidagi natijani songa aylantiradi */
function son(matn: string): number {
  const tozalangan = matn.replace(/\s/g, "").replace("×10^", "e");
  return Number(tozalangan);
}

/** Raqamli kalkulyatorni ishga tushirib natija sonini qaytaradi */
function hisobla(id: string, kirishlar: Record<string, number>): number {
  const calc = getCalculatorById(id);
  if (!calc?.calculate) throw new Error(`${id}: raqamli kalkulyator emas`);
  return son(calc.calculate(kirishlar).value);
}

/** Matnli kalkulyatorni ishga tushiradi */
function matnHisobla(id: string, kirishlar: Record<string, string>) {
  const calc = getCalculatorById(id);
  if (!calc?.calculateText) throw new Error(`${id}: matnli kalkulyator emas`);
  return calc.calculateText(kirishlar);
}

describe("kalkulyator ro'yxati", () => {
  it("har bir kalkulyator ishlaydi — bo'sh yozuv yo'q", () => {
    const ishlamaydigan = calculators.filter(
      (c) => !c.calculate && !c.calculateText && c.kind !== "konvertor",
    );
    expect(ishlamaydigan.map((c) => c.id)).toEqual([]);
  });

  it("id lar takrorlanmaydi", () => {
    const idlar = calculators.map((c) => c.id);
    expect(new Set(idlar).size).toBe(idlar.length);
  });

  it("bir kalkulyator ichida kirish nomlari takrorlanmaydi", () => {
    // Kirishlar nomi bo'yicha kalitlanadi — takrorlansa qiymat yo'qoladi
    for (const calc of calculators) {
      const nomlar = calc.inputs.map((i) => i.name);
      expect(new Set(nomlar).size, `${calc.id} da bir xil nomli kirish bor`).toBe(
        nomlar.length,
      );
    }
  });

  it("raqamli kalkulyatorlarning kirishlari bo'sh emas", () => {
    const bosh = calculators.filter(
      (c: Calculator) => c.calculate && c.inputs.length === 0,
    );
    expect(bosh.map((c) => c.id)).toEqual([]);
  });

  it("qidiruv formula bo'yicha ham topadi", () => {
    expect(searchCalculators("PV = nRT").map((c) => c.id)).toContain("ideal-gas-calc");
    expect(searchCalculators("pH").length).toBeGreaterThan(0);
    expect(searchCalculators("").length).toBe(calculators.length);
  });
});

describe("umumiy kimyo", () => {
  it("mol: 49 g H₂SO₄ — 0.5 mol", () => {
    expect(hisobla("mol-calc", { "Massa (m)": 49, "Molyar massa (M)": 98.08 })).toBeCloseTo(0.5, 2);
  });

  it("massa: 0.5 mol H₂SO₄ — 49 g", () => {
    expect(hisobla("mass-calc", { "Mol miqdori (n)": 0.5, "Molyar massa (M)": 98.08 })).toBeCloseTo(49.04, 2);
  });

  it("molyar massa: H₂SO₄ — 98.08 g/mol", () => {
    const javob = matnHisobla("molar-mass-calc", { "Kimyoviy formula": "H2SO4" });
    expect(son(javob.value)).toBeCloseTo(98.08, 1);
    expect(javob.steps?.join(" ")).toContain("Oltingugurt");
  });

  it("massa ulushlari: H₂SO₄ da kislorod 65.25%", () => {
    const javob = matnHisobla("percent-composition-calc", { "Kimyoviy formula": "H2SO4" });
    expect(javob.value).toContain("O");
    expect(javob.steps?.join(" ")).toContain("65.2");
  });

  it("zarrachalar: 2 mol — 1.2 × 10²⁴ ta", () => {
    expect(hisobla("particles-calc", { "Mol miqdori (n)": 2 })).toBeCloseTo(1.2044e24, -20);
  });

  it("zarrachadan mol: 3.011 × 10²³ — 0.5 mol", () => {
    expect(hisobla("particles-to-mol-calc", { "Zarrachalar soni (N)": 3.011e23 })).toBeCloseTo(0.5, 3);
  });

  it("zichlik: 27 g / 10 sm³ — 2.7 g/sm³", () => {
    expect(hisobla("density-calc", { "Massa (m)": 27, "Hajm (V)": 10 })).toBeCloseTo(2.7, 6);
  });
});

describe("eritmalar", () => {
  it("molyarlik: 0.5 mol / 2 L — 0.25 mol/L", () => {
    expect(hisobla("molarity-calc", { "Mol miqdori (n)": 0.5, "Eritma hajmi (V)": 2 })).toBeCloseTo(0.25, 6);
  });

  it("eritma tayyorlash: 0.1 M, 0.5 L NaCl — 2.922 g", () => {
    expect(
      hisobla("solution-prep-calc", {
        "Konsentratsiya (C)": 0.1,
        "Eritma hajmi (V)": 0.5,
        "Molyar massa (M)": 58.44,
      }),
    ).toBeCloseTo(2.922, 3);
  });

  it("molyallik: 0.25 mol / 0.5 kg — 0.5 mol/kg", () => {
    expect(hisobla("molality-calc", { "Mol miqdori (n)": 0.25, "Erituvchi massasi": 0.5 })).toBeCloseTo(0.5, 6);
  });

  it("normallik: 0.5 mol H₂SO₄ (z=2) / 1 L — 1 N", () => {
    expect(
      hisobla("normality-calc", {
        "Mol miqdori (n)": 0.5,
        "Ekvivalentlik soni (z)": 2,
        "Eritma hajmi (V)": 1,
      }),
    ).toBeCloseTo(1, 6);
  });

  it("massa ulushi: 20 g / 200 g — 10%", () => {
    expect(hisobla("mass-percent-sol-calc", { "Modda massasi": 20, "Eritma massasi": 200 })).toBeCloseTo(10, 6);
  });

  it("96% H₂SO₄ (ρ=1.84) — 18 mol/L", () => {
    expect(
      hisobla("percent-to-molarity-calc", {
        "Massa ulushi (ω)": 96,
        "Zichlik (ρ)": 1.84,
        "Molyar massa (M)": 98.08,
      }),
    ).toBeCloseTo(18.0, 1);
  });

  it("suyultirish: 2 M dan 50 mL ni 0.5 M ga — 200 mL", () => {
    expect(
      hisobla("dilution-calc", {
        "Boshlang'ich konsentratsiya (C₁)": 2,
        "Boshlang'ich hajm (V₁)": 50,
        "Yakuniy konsentratsiya (C₂)": 0.5,
      }),
    ).toBeCloseTo(200, 6);
  });

  it("titrlash: 25 mL ga 20 mL 0.1 M NaOH — 0.08 mol/L", () => {
    expect(
      hisobla("titration-calc", {
        "Noma'lum eritma hajmi (V₁)": 25,
        "Noma'lum ekvivalentligi (z₁)": 1,
        "Titrant konsentratsiyasi (C₂)": 0.1,
        "Titrant hajmi (V₂)": 20,
        "Titrant ekvivalentligi (z₂)": 1,
      }),
    ).toBeCloseTo(0.08, 6);
  });

  it("ppm: 5 mg / 1 kg — 5 ppm", () => {
    expect(hisobla("ppm-calc", { "Modda massasi": 5, "Eritma massasi": 1 })).toBeCloseTo(5, 6);
  });

  it("modda massasi eritmadan katta bo'lsa xato beradi", () => {
    expect(() =>
      hisobla("mass-percent-sol-calc", { "Modda massasi": 300, "Eritma massasi": 200 }),
    ).toThrow(KalkulyatorXatosi);
  });
});

describe("stexiometriya", () => {
  it("limitlovchi reagent: N₂ + 3H₂ da 3 mol N₂ va 4 mol H₂ — vodorod limitlaydi", () => {
    const calc = getCalculatorById("limiting-reagent-calc")!;
    const javob = calc.calculate!({
      "1-reagent mol": 3,
      "1-reagent koeffitsienti": 1,
      "2-reagent mol": 4,
      "2-reagent koeffitsienti": 3,
    });
    expect(javob.value).toBe("2-reagent");
  });

  it("nazariy unum: 2 mol SO₃ dan H₂SO₄", () => {
    expect(
      hisobla("theoretical-yield-calc", {
        "Limitlovchi reagent mol": 2,
        "Limitlovchi koeffitsienti (a)": 2,
        "Mahsulot koeffitsienti (b)": 1,
        "Mahsulot molyar massasi": 80.06,
      }),
    ).toBeCloseTo(80.06, 2);
  });

  it("amaliy unum: 68 g / 80 g — 85%", () => {
    expect(hisobla("percent-yield-calc", { "Amaliy unum": 68, "Nazariy unum": 80 })).toBeCloseTo(85, 6);
  });
});

describe("gaz qonunlari", () => {
  it("ideal gaz: 1 mol, 1 atm, 273.15 K — 22.41 L", () => {
    expect(
      hisobla("ideal-gas-calc", {
        "Bosim (P)": 1,
        "Hajm (V)": NaN,
        "Mol miqdori (n)": 1,
        "Temperatura (T)": 273.15,
      }),
    ).toBeCloseTo(22.41, 1);
  });

  it("ideal gaz: bosimni topadi", () => {
    expect(
      hisobla("ideal-gas-calc", {
        "Bosim (P)": NaN,
        "Hajm (V)": 22.414,
        "Mol miqdori (n)": 1,
        "Temperatura (T)": 273.15,
      }),
    ).toBeCloseTo(1, 2);
  });

  it("ideal gaz: bo'sh katak bitta bo'lmasa xato beradi", () => {
    expect(() =>
      hisobla("ideal-gas-calc", {
        "Bosim (P)": NaN,
        "Hajm (V)": NaN,
        "Mol miqdori (n)": 1,
        "Temperatura (T)": 273.15,
      }),
    ).toThrow(/bitta katak/);
  });

  it("normal sharoitda 0.5 mol gaz — 11.2 L", () => {
    expect(hisobla("molar-volume-calc", { "Mol miqdori (n)": 0.5 })).toBeCloseTo(11.2, 1);
  });

  it("Boyl: 1 atm × 5 L, 2.5 atm — 2 L", () => {
    expect(
      hisobla("boyle-law-calc", {
        "Boshlang'ich bosim (P₁)": 1,
        "Boshlang'ich hajm (V₁)": 5,
        "Yakuniy bosim (P₂)": 2.5,
      }),
    ).toBeCloseTo(2, 6);
  });

  it("Sharl: 2 L, 273 K dan 546 K — 4 L", () => {
    expect(
      hisobla("charles-law-calc", {
        "Boshlang'ich hajm (V₁)": 2,
        "Boshlang'ich temperatura (T₁)": 273,
        "Yakuniy temperatura (T₂)": 546,
      }),
    ).toBeCloseTo(4, 6);
  });

  it("CO₂ ning havoga nisbatan zichligi — 1.52", () => {
    expect(
      hisobla("relative-density-calc", {
        "Gaz molyar massasi (M₁)": 44,
        "Solishtirilayotgan gaz (M₂)": 29,
      }),
    ).toBeCloseTo(1.52, 2);
  });
});

describe("kislota va asoslar", () => {
  it("pH: [H⁺] = 10⁻³ — pH 3", () => {
    expect(hisobla("ph-calc", { "[H⁺] konsentratsiya": 0.001 })).toBeCloseTo(3, 6);
  });

  it("pOH: [OH⁻] = 10⁻² — pOH 2", () => {
    expect(hisobla("poh-calc", { "[OH⁻] konsentratsiya": 0.01 })).toBeCloseTo(2, 6);
  });

  it("[H⁺]: pH 3 — 10⁻³ mol/L", () => {
    expect(hisobla("h-concentration-calc", { pH: 3 })).toBeCloseTo(1e-3, 6);
  });

  it("[OH⁻]: pOH 4 — 10⁻⁴ mol/L", () => {
    expect(hisobla("oh-concentration-calc", { pOH: 4 })).toBeCloseTo(1e-4, 6);
  });

  it("kuchsiz kislota: 0.1 M sirka kislota — pH 2.88", () => {
    expect(hisobla("weak-acid-ph-calc", { pKa: 4.76, "Konsentratsiya (C)": 0.1 })).toBeCloseTo(2.88, 2);
  });

  it("bufer: teng miqdorda tuz va kislota — pH = pKa", () => {
    expect(
      hisobla("henderson-hasselbalch-calc", {
        pKa: 4.76,
        "[A⁻] (tuz)": 0.1,
        "[HA] (kislota)": 0.1,
      }),
    ).toBeCloseTo(4.76, 6);
  });

  it("pKa: Ka = 1.8 × 10⁻⁵ — pKa 4.74", () => {
    expect(hisobla("ka-pka-calc", { Ka: 1.8e-5 })).toBeCloseTo(4.74, 2);
  });
});

describe("termodinamika", () => {
  it("entalpiya: C + O₂ → CO₂, ΔH = −393.5 kJ/mol", () => {
    expect(
      hisobla("enthalpy-calc", { "Mahsulotlar ΣΔHf": -393.5, "Reagentlar ΣΔHf": 0 }),
    ).toBeCloseTo(-393.5, 2);
  });

  it("entropiya farqi", () => {
    expect(
      hisobla("entropy-calc", { "Mahsulotlar ΣS°": 213.7, "Reagentlar ΣS°": 205.2 }),
    ).toBeCloseTo(8.5, 2);
  });

  it("Gibbs: ammiak sintezi 298 K da −33 kJ/mol", () => {
    expect(
      hisobla("gibbs-energy-calc", { "ΔH": -92.2, "Temperatura (T)": 298, "ΔS": -198.7 }),
    ).toBeCloseTo(-32.99, 1);
  });

  it("issiqlik: 100 g suvni 50 °C isitish — 20900 J", () => {
    expect(
      hisobla("heat-capacity-calc", {
        "Massa (m)": 100,
        "Solishtirma issiqlik (c)": 4.18,
        "Temperatura o'zgarishi (ΔT)": 50,
      }),
    ).toBeCloseTo(20900, 0);
  });

  it("muvozanat konstantasi: ΔG° = −33 kJ/mol, 298 K", () => {
    const K = hisobla("equilibrium-constant-calc", { "ΔG°": -33, "Temperatura (T)": 298 });
    expect(Math.log(K)).toBeCloseTo(13.32, 1);
  });
});

describe("elektrokimyo", () => {
  it("Nernst: E° = 1.1 V, n = 2, Q = 0.1", () => {
    expect(
      hisobla("nernst-calc", {
        "Standart potensial (E°)": 1.1,
        "Elektronlar soni (n)": 2,
        "Reaksiya kvotienti (Q)": 0.1,
      }),
    ).toBeCloseTo(1.1296, 3);
  });

  it("Faradey: 2 A, 1 soat, Cu²⁺ — 2.37 g mis", () => {
    expect(
      hisobla("faraday-law-calc", {
        "Molyar massa (M)": 63.55,
        "Tok kuchi (I)": 2,
        "Vaqt (t)": 3600,
        "Elektronlar soni (n)": 2,
      }),
    ).toBeCloseTo(2.371, 2);
  });

  it("Daniel elementi: 0.34 − (−0.76) = 1.10 V", () => {
    expect(
      hisobla("cell-potential-calc", {
        "Katod potensiali (E°)": 0.34,
        "Anod potensiali (E°)": -0.76,
      }),
    ).toBeCloseTo(1.1, 6);
  });

  it("EYK dan ΔG: n = 2, E = 1.1 V — −212 kJ/mol", () => {
    expect(
      hisobla("gibbs-from-emf-calc", { "Elektronlar soni (n)": 2, "EYK (E)": 1.1 }),
    ).toBeCloseTo(-212.3, 0);
  });
});

describe("analitik kimyo", () => {
  it("Ber qonuni: ε = 15000, l = 1, C = 5 × 10⁻⁵ — A = 0.75", () => {
    expect(
      hisobla("beer-lambert-calc", {
        "Molyar yutilish (ε)": 15000,
        "Kyuveta uzunligi (l)": 1,
        "Konsentratsiya (C)": 5e-5,
      }),
    ).toBeCloseTo(0.75, 6);
  });

  it("absorbansdan konsentratsiya — teskari amal", () => {
    expect(
      hisobla("concentration-from-absorbance-calc", {
        "Absorbans (A)": 0.75,
        "Molyar yutilish (ε)": 15000,
        "Kyuveta uzunligi (l)": 1,
      }),
    ).toBeCloseTo(5e-5, 8);
  });

  it("nisbiy xatolik: 98.5 va 100 — 1.5%", () => {
    expect(
      hisobla("percent-error-calc", { "Tajriba qiymati": 98.5, "Nazariy qiymat": 100 }),
    ).toBeCloseTo(1.5, 6);
  });
});

describe("atom va kvant kimyosi", () => {
  it("de Broyl: elektron 10⁶ m/s — 0.73 nm", () => {
    expect(
      hisobla("de-broglie-calc", { "Massa (m)": 9.109e-31, "Tezlik (v)": 1e6 }),
    ).toBeCloseTo(7.27e-10, 12);
  });

  it("foton: 450 nm ko'k yorug'lik — 4.41 × 10⁻¹⁹ J", () => {
    expect(hisobla("photon-energy-calc", { "To'lqin uzunligi (λ)": 450 })).toBeCloseTo(4.414e-19, 22);
  });

  it("chastota: 6 × 10¹⁴ Hz", () => {
    expect(hisobla("frequency-energy-calc", { "Chastota (ν)": 6e14 })).toBeCloseTo(3.976e-19, 22);
  });

  it("Ridberg: Hα chizig'i (n 3→2) — 656 nm", () => {
    expect(hisobla("rydberg-calc", { "Quyi sath (n₁)": 2, "Yuqori sath (n₂)": 3 })).toBeCloseTo(656.1, 0);
  });

  it("yuqori sath quyidan kichik bo'lsa xato beradi", () => {
    expect(() => hisobla("rydberg-calc", { "Quyi sath (n₁)": 3, "Yuqori sath (n₂)": 2 })).toThrow(
      KalkulyatorXatosi,
    );
  });
});

describe("noorganik kimyo", () => {
  it("oksidlanish darajasi: KMnO₄ da marganes +7", () => {
    const javob = matnHisobla("oxidation-state-calc", { Formula: "KMnO4", "Element (ixtiyoriy)": "" });
    expect(javob.value).toBe("Mn: +7");
  });

  it("oksidlanish darajasi: so'ralgan elementni beradi", () => {
    const javob = matnHisobla("oxidation-state-calc", { Formula: "H2SO4", "Element (ixtiyoriy)": "O" });
    expect(javob.value).toBe("O: -2");
  });

  it("koordinatsion son: K₃[Fe(CN)₆] — 6", () => {
    expect(matnHisobla("coordination-number-calc", { "Kompleks formulasi": "K3[Fe(CN)6]" }).value).toBe("6");
  });

  it("koordinatsion son: [Cu(NH₃)₄]SO₄ — 4", () => {
    expect(matnHisobla("coordination-number-calc", { "Kompleks formulasi": "[Cu(NH3)4]SO4" }).value).toBe("4");
  });

  it("koordinatsion son: aralash ligandli [Co(NH₃)₅Cl]²⁺ — 6", () => {
    expect(matnHisobla("coordination-number-calc", { "Kompleks formulasi": "[Co(NH3)5Cl]2+" }).value).toBe("6");
  });

  it("kvadrat qavs bo'lmasa aniq xato beradi", () => {
    expect(() => matnHisobla("coordination-number-calc", { "Kompleks formulasi": "CuSO4" })).toThrow(
      /kvadrat qavsda/,
    );
  });
});

describe("organik kimyo", () => {
  it("DBE: benzol C₆H₆ — 4", () => {
    expect(
      hisobla("dbe-calc", {
        "Uglerod (C)": 6,
        "Vodorod (H)": 6,
        "Azot (N)": 0,
        "Galogen (X)": 0,
      }),
    ).toBe(4);
  });

  it("DBE formuladan: benzol — 4, etanol — 0", () => {
    expect(son(matnHisobla("dbe-from-formula-calc", { "Organik formula": "C6H6" }).value)).toBe(4);
    expect(son(matnHisobla("dbe-from-formula-calc", { "Organik formula": "C2H5OH" }).value)).toBe(0);
  });

  it("DBE: xlorbenzol C₆H₅Cl — 4", () => {
    expect(son(matnHisobla("dbe-from-formula-calc", { "Organik formula": "C6H5Cl" }).value)).toBe(4);
  });

  it("bo'lmaydigan molekulani rad etadi", () => {
    expect(() =>
      hisobla("dbe-calc", {
        "Uglerod (C)": 1,
        "Vodorod (H)": 10,
        "Azot (N)": 0,
        "Galogen (X)": 0,
      }),
    ).toThrow(/Manfiy/);
  });
});

describe("kristallokimyo", () => {
  it("NaCl zichligi: Z=4, a=5.64 Å — 2.16 g/sm³", () => {
    expect(
      hisobla("crystal-density-calc", {
        "Formula birliklari (Z)": 4,
        "Molyar massa (M)": 58.44,
        "Yacheyka qirrasi (a)": 5.64,
      }),
    ).toBeCloseTo(2.16, 1);
  });

  it("Bregg: Cu Kα, d = 3.14 Å — θ ≈ 14.2°", () => {
    expect(
      hisobla("bragg-law-calc", {
        "Tartib (n)": 1,
        "To'lqin uzunligi (λ)": 1.5418,
        "Tekisliklar orasi (d)": 3.14,
      }),
    ).toBeCloseTo(14.2, 1);
  });

  it("sin θ > 1 bo'lsa tushuntirib xato beradi", () => {
    expect(() =>
      hisobla("bragg-law-calc", {
        "Tartib (n)": 3,
        "To'lqin uzunligi (λ)": 1.5418,
        "Tekisliklar orasi (d)": 1,
      }),
    ).toThrow(/difraksiya kuzatilmaydi/);
  });
});

describe("yadro kimyosi", () => {
  it("ikki yarim yemirilishdan keyin 100 dan 25 qoladi", () => {
    expect(
      hisobla("radioactive-decay-calc", {
        "Boshlang'ich miqdor (N₀)": 100,
        "Yarim yemirilish davri (t½)": 5730,
        "O'tgan vaqt (t)": 11460,
      }),
    ).toBeCloseTo(25, 6);
  });

  it("yarim yemirilish davri: λ = 10⁻⁴ — 6931 s", () => {
    expect(hisobla("half-life-calc", { "Yemirilish konstantasi (λ)": 0.0001 })).toBeCloseTo(6931.5, 0);
  });

  it("radiouglerod: 25% ¹⁴C — 11460 yil", () => {
    expect(hisobla("radiocarbon-age-calc", { "Qolgan ¹⁴C ulushi": 25 })).toBeCloseTo(11460, 0);
  });
});

describe("biokimyo", () => {
  it("glitsin pI — 5.97", () => {
    expect(
      hisobla("isoelectric-point-calc", { "pKa₁ (−COOH)": 2.34, "pKa₂ (−NH₃⁺)": 9.6 }),
    ).toBeCloseTo(5.97, 2);
  });

  it("GC tarkibi: 30+30 / 100 — 60%", () => {
    expect(
      hisobla("gc-content-calc", {
        "G (guanin)": 30,
        "C (sitozin)": 30,
        "A (adenin)": 20,
        "T (timin)": 20,
      }),
    ).toBeCloseTo(60, 6);
  });

  it("Mixaelis-Menten: [S] = 5, Km = 2 — Vmax ning 71% i", () => {
    expect(
      hisobla("michaelis-menten-calc", { Vmax: 100, "Substrat [S]": 5, Km: 2 }),
    ).toBeCloseTo(71.43, 2);
  });
});

describe("kinetika", () => {
  it("tezlik: 0.05 mol/L / 10 s", () => {
    expect(
      hisobla("reaction-rate-calc", {
        "Konsentratsiya o'zgarishi (Δ[A])": 0.05,
        "Vaqt o'zgarishi (Δt)": 10,
      }),
    ).toBeCloseTo(0.005, 6);
  });

  it("Arrenius: Ea = 50 kJ/mol, 298 K", () => {
    const k = hisobla("arrhenius-calc", {
      "Pred-eksponensial (A)": 1e13,
      "Aktivlanish energiyasi (Ea)": 50,
      "Temperatura (T)": 298,
    });
    expect(Math.log10(k)).toBeCloseTo(4.24, 1);
  });

  it("aktivlanish energiyasi: k 10 marta ortsa (298→320 K) — 83 kJ/mol", () => {
    expect(
      hisobla("activation-energy-calc", { "k₁": 0.001, "T₁": 298, "k₂": 0.01, "T₂": 320 }),
    ).toBeCloseTo(82.97, 1);
  });

  it("yarim o'tish vaqti: k = 0.005 — 138.6 s", () => {
    expect(hisobla("half-life-first-order-calc", { "Tezlik konstantasi (k)": 0.005 })).toBeCloseTo(138.6, 1);
  });

  it("1-tartibli reaksiya: 0.5 M, k = 0.01, 60 s — 0.274 M", () => {
    expect(
      hisobla("first-order-concentration-calc", {
        "Boshlang'ich [A]₀": 0.5,
        "Tezlik konstantasi (k)": 0.01,
        "Vaqt (t)": 60,
      }),
    ).toBeCloseTo(0.2744, 4);
  });

  it("bir xil haroratda Ea hisoblanmaydi", () => {
    expect(() =>
      hisobla("activation-energy-calc", { "k₁": 0.001, "T₁": 298, "k₂": 0.01, "T₂": 298 }),
    ).toThrow(KalkulyatorXatosi);
  });
});

describe("nolga bo'lish", () => {
  it("molyar massa 0 bo'lsa aniq xabar chiqadi", () => {
    expect(() => hisobla("mol-calc", { "Massa (m)": 10, "Molyar massa (M)": 0 })).toThrow(
      /nolga bo'lib bo'lmaydi/,
    );
  });

  it("hajm 0 bo'lsa zichlik hisoblanmaydi", () => {
    expect(() => hisobla("density-calc", { "Massa (m)": 10, "Hajm (V)": 0 })).toThrow(
      KalkulyatorXatosi,
    );
  });
});
