// tests/chem.test.ts
//
// Formula parseri, birliklar konvertori va oksidlanish darajasi uchun testlar.
// Kutilayotgan qiymatlar darslik va ma'lumotnomalardan olingan — hisob
// natijasidan ko'chirilmagan, aks holda test xatoni ham "to'g'ri" deb tasdiqlaydi.

import { describe, expect, it } from "vitest";

import {
  formulaniOqi,
  FormulaXatosi,
  molyarMassa,
} from "../lib/chem/molar-mass";
import { konvert, sonniYoz, AVOGADRO } from "../lib/chem/units";
import { oksidlanishDarajasi, OksidlanishXatosi } from "../lib/chem/oxidation";

describe("molyar massa", () => {
  it("oddiy formulalarni o'qiydi", () => {
    expect(molyarMassa("H2O")).toBeCloseTo(18.02, 1);
    expect(molyarMassa("NaCl")).toBeCloseTo(58.44, 1);
    expect(molyarMassa("H2SO4")).toBeCloseTo(98.08, 1);
    expect(molyarMassa("C6H12O6")).toBeCloseTo(180.16, 1);
    expect(molyarMassa("KMnO4")).toBeCloseTo(158.03, 1);
  });

  it("pastki indeksli yozuvni ham o'qiydi", () => {
    expect(molyarMassa("H₂SO₄")).toBeCloseTo(molyarMassa("H2SO4"), 5);
    expect(molyarMassa("C₆H₁₂O₆")).toBeCloseTo(180.16, 1);
  });

  it("qavslarni ochadi", () => {
    expect(molyarMassa("Ca(OH)2")).toBeCloseTo(74.09, 1);
    expect(molyarMassa("Al2(SO4)3")).toBeCloseTo(342.15, 1);
    expect(molyarMassa("(NH4)2SO4")).toBeCloseTo(132.14, 1);
  });

  it("ichma-ich qavsni ochadi", () => {
    expect(molyarMassa("K3[Fe(CN)6]")).toBeCloseTo(329.25, 1);
  });

  it("gidrat suvini qo'shadi", () => {
    expect(molyarMassa("CuSO4·5H2O")).toBeCloseTo(249.68, 1);
    expect(molyarMassa("CuSO4*5H2O")).toBeCloseTo(249.68, 1);
    // Suvsiz tuz — farqi aynan 5 ta suv
    expect(molyarMassa("CuSO4·5H2O") - molyarMassa("CuSO4")).toBeCloseTo(
      5 * 18.015,
      2,
    );
  });

  it("oldidagi koeffitsientni hisobga oladi", () => {
    expect(molyarMassa("2H2O")).toBeCloseTo(2 * 18.015, 3);
  });

  it("Co (kobalt) va CO (uglerod oksidi) ni farqlaydi", () => {
    expect(formulaniOqi("Co").atomlar).toEqual({ Co: 1 });
    expect(formulaniOqi("CO").atomlar).toEqual({ C: 1, O: 1 });
  });

  it("zaryadni o'qiydi", () => {
    expect(formulaniOqi("SO4^2-").zaryad).toBe(-2);
    expect(formulaniOqi("SO₄²⁻").zaryad).toBe(-2);
    expect(formulaniOqi("Na+").zaryad).toBe(1);
    expect(formulaniOqi("[Co(NH3)6]3+").zaryad).toBe(3);
    expect(formulaniOqi("H2O").zaryad).toBe(0);
  });

  it("zaryad va indeks chalkashmaydi", () => {
    // Belgidan oldingi raqam ba'zan zaryad, ba'zan indeks
    const temir = formulaniOqi("Fe3+");
    expect(temir.atomlar).toEqual({ Fe: 1 }); // Fe³⁺, uch atomli temir emas
    expect(temir.zaryad).toBe(3);

    const nitrat = formulaniOqi("NO3-");
    expect(nitrat.atomlar).toEqual({ N: 1, O: 3 }); // NO₃⁻
    expect(nitrat.zaryad).toBe(-1);

    const sulfat = formulaniOqi("SO42-");
    expect(sulfat.atomlar).toEqual({ S: 1, O: 4 }); // SO₄²⁻
    expect(sulfat.zaryad).toBe(-2);

    const dixromat = formulaniOqi("Cr2O72-");
    expect(dixromat.atomlar).toEqual({ Cr: 2, O: 7 }); // Cr₂O₇²⁻
    expect(dixromat.zaryad).toBe(-2);

    const ammoniy = formulaniOqi("NH4+");
    expect(ammoniy.atomlar).toEqual({ N: 1, H: 4 }); // NH₄⁺
    expect(ammoniy.zaryad).toBe(1);

    const sulfid = formulaniOqi("S2-");
    expect(sulfid.atomlar).toEqual({ S: 1 }); // S²⁻
    expect(sulfid.zaryad).toBe(-2);
  });

  it("tarkibni massa foizi bo'yicha beradi", () => {
    const suv = formulaniOqi("H2O");
    // Suvda kislorod 88.8%, vodorod 11.2% — darslikdagi qiymat
    const kislorod = suv.tarkib.find((q) => q.symbol === "O");
    const vodorod = suv.tarkib.find((q) => q.symbol === "H");
    expect(kislorod?.foiz).toBeCloseTo(88.8, 0);
    expect(vodorod?.foiz).toBeCloseTo(11.2, 0);
    // Eng og'iri birinchi turadi
    expect(suv.tarkib[0].symbol).toBe("O");
  });

  it("noto'g'ri formulani aniq xato bilan rad etadi", () => {
    expect(() => molyarMassa("")).toThrow(FormulaXatosi);
    expect(() => molyarMassa("Xy2")).toThrow(/element yo'q/);
    expect(() => molyarMassa("h2o")).toThrow(/katta harfdan/);
    expect(() => molyarMassa("Ca(OH2")).toThrow(/Qavs yopilmagan/);
    expect(() => molyarMassa("Ca OH)2")).toThrow(/Ortiqcha yopuvchi qavs/);
    expect(() => molyarMassa("H2O!")).toThrow(/Tushunarsiz belgi/);
  });
});

describe("birliklar konvertori", () => {
  it("bosimni o'tkazadi", () => {
    expect(konvert(1, "atm", "Pa", "bosim")).toBeCloseTo(101325, 0);
    expect(konvert(1, "atm", "mmHg", "bosim")).toBeCloseTo(760, 3);
    expect(konvert(1, "bar", "kPa", "bosim")).toBeCloseTo(100, 6);
  });

  it("haroratni o'tkazadi (nochiziqli)", () => {
    expect(konvert(25, "°C", "K", "harorat")).toBeCloseTo(298.15, 6);
    expect(konvert(298.15, "K", "°C", "harorat")).toBeCloseTo(25, 6);
    expect(konvert(32, "°F", "°C", "harorat")).toBeCloseTo(0, 6);
    expect(konvert(212, "°F", "°C", "harorat")).toBeCloseTo(100, 6);
    expect(konvert(-40, "°C", "°F", "harorat")).toBeCloseTo(-40, 6);
  });

  it("energiyani o'tkazadi", () => {
    expect(konvert(1, "kcal", "J", "energiya")).toBeCloseTo(4184, 6);
    expect(konvert(1, "eV", "J", "energiya")).toBeCloseTo(1.602176634e-19, 25);
  });

  it("modda miqdorini zarrachalar soniga o'tkazadi", () => {
    expect(konvert(1, "mol", "ta", "miqdor")).toBeCloseTo(AVOGADRO, -18);
    expect(konvert(AVOGADRO, "ta", "mol", "miqdor")).toBeCloseTo(1, 6);
  });

  it("uzunlikni o'tkazadi", () => {
    expect(konvert(1, "Å", "pm", "uzunlik")).toBeCloseTo(100, 6);
    expect(konvert(1, "nm", "Å", "uzunlik")).toBeCloseTo(10, 6);
  });

  it("orqaga o'tkazganda boshlang'ich qiymat qaytadi", () => {
    for (const [qiymat, dan, ga, guruh] of [
      [5.5, "kg", "mg", "massa"],
      [250, "mL", "L", "hajm"],
      [37, "°C", "°F", "harorat"],
      [12, "kJ", "cal", "energiya"],
    ] as const) {
      const oldinga = konvert(qiymat, dan, ga, guruh);
      expect(konvert(oldinga, ga, dan, guruh)).toBeCloseTo(qiymat, 6);
    }
  });

  it("noma'lum birlikni rad etadi", () => {
    expect(() => konvert(1, "chelak", "L", "hajm")).toThrow(/birligi yo'q/);
    expect(() => konvert(1, "L", "mL", "yorug'lik")).toThrow(/guruhi yo'q/);
  });

  it("juda katta va juda kichik sonni o'qiladigan qilib yozadi", () => {
    expect(sonniYoz(0.5)).toBe("0.5");
    expect(sonniYoz(2.5000001)).toBe("2.5");
    expect(sonniYoz(6.022e23)).toContain("× 10^23");
    expect(sonniYoz(0.0000001)).toContain("× 10^-7");
  });
});

describe("oksidlanish darajasi", () => {
  it("sof moddada 0", () => {
    expect(oksidlanishDarajasi("O2").daraja).toBe(0);
    expect(oksidlanishDarajasi("Fe").daraja).toBe(0);
    expect(oksidlanishDarajasi("S8").daraja).toBe(0);
  });

  it("bir atomli ionda zaryadga teng", () => {
    expect(oksidlanishDarajasi("Na+").daraja).toBe(1);
    expect(oksidlanishDarajasi("Cl-").daraja).toBe(-1);
  });

  it("darslik misollarini to'g'ri yechadi", () => {
    expect(oksidlanishDarajasi("H2SO4").element).toBe("S");
    expect(oksidlanishDarajasi("H2SO4").daraja).toBe(6);
    expect(oksidlanishDarajasi("KMnO4").daraja).toBe(7);
    expect(oksidlanishDarajasi("K2Cr2O7").daraja).toBe(6);
    expect(oksidlanishDarajasi("HNO3").daraja).toBe(5);
    expect(oksidlanishDarajasi("NaCl").daraja).toBe(-1);
    expect(oksidlanishDarajasi("CaCO3").daraja).toBe(4);
  });

  it("ionlarda zaryadni hisobga oladi", () => {
    expect(oksidlanishDarajasi("SO4^2-").daraja).toBe(6);
    expect(oksidlanishDarajasi("NO3-").daraja).toBe(5);
    expect(oksidlanishDarajasi("MnO4-").daraja).toBe(7);
  });

  it("istisnolarni biladi", () => {
    expect(oksidlanishDarajasi("H2O2", "O").daraja).toBe(-1);
    expect(oksidlanishDarajasi("NaH").daraja).toBe(-1);
  });

  it("Fe3O4 uchun o'rtacha daraja berib, buni ochiq aytadi", () => {
    const natija = oksidlanishDarajasi("Fe3O4");
    expect(natija.daraja).toBeCloseTo(8 / 3, 6);
    expect(natija.matn).toBe("+8/3");
    expect(natija.ortacha).toBe(true);
  });

  it("butun son chiqqanda ham o'rtacha bo'lishi mumkinligini eslatadi", () => {
    // NH₄NO₃ da azot -3 va +5, o'rtachasi +1. Algoritm +1 beradi —
    // foydalanuvchi buni bilishi kerak.
    const natija = oksidlanishDarajasi("NH4NO3");
    expect(natija.daraja).toBe(1);
    expect(natija.izoh.join(" ")).toMatch(/o'rtacha/);
  });

  it("ikkita noma'lum bo'lsa hisoblamaydi", () => {
    expect(() => oksidlanishDarajasi("CuSO4")).toThrow(OksidlanishXatosi);
    expect(() => oksidlanishDarajasi("CuSO4")).toThrow(/noma'lum element/);
  });

  it("kislorod va ftor birga bo'lsa hisoblamaydi", () => {
    expect(() => oksidlanishDarajasi("OF2")).toThrow(/ftor/);
  });
});
