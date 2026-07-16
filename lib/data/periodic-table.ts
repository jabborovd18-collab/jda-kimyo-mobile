/**
 * Davriy Jadval - Barcha 118 Element
 * Ma'lumotlar bazasi
 */

export interface PeriodicElement {
  id: string;
  symbol: string;
  name: string;
  number: number;
  mass: number;
  group: number;
  period: number;
  category: string;
  color: string;
  discovered: number;
  discoverer: string;
  density: number;
  meltingPoint: number;
  boilingPoint: number;
  electrons: number;
  protons: number;
  neutrons: number;
  electronConfiguration: string;
  description: string;
}

export const PERIODIC_TABLE: PeriodicElement[] = [
  // 1-davr
  { id: "H", symbol: "H", name: "Vodorod", number: 1, mass: 1.008, group: 1, period: 1, category: "Nonmetal", color: "bg-yellow-100", discovered: 1766, discoverer: "Henry Cavendish", density: 0.0899, meltingPoint: -259.14, boilingPoint: -252.87, electrons: 1, protons: 1, neutrons: 0, electronConfiguration: "1s¹", description: "Vodorod - eng yengil element. Koinotda eng ko'p uchraydigan element. Suv va barcha organik moddalarning tarkibiga kiradi." },
  { id: "He", symbol: "He", name: "Geliy", number: 2, mass: 4.003, group: 18, period: 1, category: "Noble gas", color: "bg-blue-100", discovered: 1868, discoverer: "Pierre Janssen", density: 0.1785, meltingPoint: -272.2, boilingPoint: -268.93, electrons: 2, protons: 2, neutrons: 2, electronConfiguration: "1s²", description: "Geliy - ikkinchi yengil element. Inert gaz. Ballon va dirижabllarni to'ldirish uchun ishlatiladi." },

  // 2-davr
  { id: "Li", symbol: "Li", name: "Litiy", number: 3, mass: 6.941, group: 1, period: 2, category: "Alkali metal", color: "bg-red-100", discovered: 1817, discoverer: "Johan August Arfwedson", density: 0.534, meltingPoint: 180.5, boilingPoint: 1342, electrons: 3, protons: 3, neutrons: 4, electronConfiguration: "[He] 2s¹", description: "Litiy - eng yengil metal. Batareyalar va psixotrop dorilar ishlab chiqarishda ishlatiladi." },
  { id: "Be", symbol: "Be", name: "Berilliy", number: 4, mass: 9.012, group: 2, period: 2, category: "Alkaline earth metal", color: "bg-green-100", discovered: 1798, discoverer: "Louis-Nicolas Vauquelin", density: 1.85, meltingPoint: 1287, boilingPoint: 2471, electrons: 4, protons: 4, neutrons: 5, electronConfiguration: "[He] 2s²", description: "Berilliy - yuqori kuchli va yengil metal. Kosmik texnologiyada ishlatiladi." },
  { id: "B", symbol: "B", name: "Bor", number: 5, mass: 10.81, group: 13, period: 2, category: "Metalloid", color: "bg-orange-100", discovered: 1808, discoverer: "Joseph Louis Gay-Lussac", density: 2.34, meltingPoint: 2075, boilingPoint: 4000, electrons: 5, protons: 5, neutrons: 6, electronConfiguration: "[He] 2s² 2p¹", description: "Bor - qattiq element. Shisha va keramika ishlab chiqarishda ishlatiladi." },
  { id: "C", symbol: "C", name: "Uglerod", number: 6, mass: 12.01, group: 14, period: 2, category: "Nonmetal", color: "bg-gray-400", discovered: 1000, discoverer: "Ancient", density: 2.26, meltingPoint: 3823, boilingPoint: 4827, electrons: 6, protons: 6, neutrons: 6, electronConfiguration: "[He] 2s² 2p²", description: "Uglerod - hayot asosi. Barcha organik moddalarning tarkibiga kiradi. Almaz va grafit uning allotrop shakllaridir." },
  { id: "N", symbol: "N", name: "Azot", number: 7, mass: 14.01, group: 15, period: 2, category: "Nonmetal", color: "bg-blue-200", discovered: 1772, discoverer: "Daniel Rutherford", density: 1.251, meltingPoint: -210.0, boilingPoint: -195.79, electrons: 7, protons: 7, neutrons: 7, electronConfiguration: "[He] 2s² 2p³", description: "Azot - atmosferani tashkil etuvchi gaz. Barcha organik moddalarning tarkibiga kiradi." },
  { id: "O", symbol: "O", name: "Kislorod", number: 8, mass: 15.999, group: 16, period: 2, category: "Nonmetal", color: "bg-red-200", discovered: 1774, discoverer: "Carl Wilhelm Scheele", density: 1.429, meltingPoint: -218.79, boilingPoint: -182.95, electrons: 8, protons: 8, neutrons: 8, electronConfiguration: "[He] 2s² 2p⁴", description: "Kislorod - hayot uchun zarur. Atmosferani tashkil etadi. Suv va ko'plab boshqa moddalarning tarkibiga kiradi." },
  { id: "F", symbol: "F", name: "Ftor", number: 9, mass: 18.998, group: 17, period: 2, category: "Halogen", color: "bg-yellow-200", discovered: 1670, discoverer: "Humphry Davy", density: 1.696, meltingPoint: -219.62, boilingPoint: -188.12, electrons: 9, protons: 9, neutrons: 10, electronConfiguration: "[He] 2s² 2p⁵", description: "Ftor - eng reaktiv element. Fluor hammasida ishlatiladi. Juda xavfli gaz." },
  { id: "Ne", symbol: "Ne", name: "Neon", number: 10, mass: 20.18, group: 18, period: 2, category: "Noble gas", color: "bg-blue-100", discovered: 1898, discoverer: "William Ramsay", density: 0.9002, meltingPoint: -248.59, boilingPoint: -246.05, electrons: 10, protons: 10, neutrons: 10, electronConfiguration: "[He] 2s² 2p⁶", description: "Neon - inert gaz. Neon lampalarida ishlatiladi. Raqamli ko'rsatgichlarda ishlatiladi." },

  // 3-davr
  { id: "Na", symbol: "Na", name: "Natriy", number: 11, mass: 22.99, group: 1, period: 3, category: "Alkali metal", color: "bg-red-100", discovered: 1807, discoverer: "Humphry Davy", density: 0.971, meltingPoint: 97.72, boilingPoint: 883, electrons: 11, protons: 11, neutrons: 12, electronConfiguration: "[Ne] 3s¹", description: "Natriy - yuqori reaktiv metal. Tuz (NaCl) tarkibiga kiradi. Organizmlarda muhim rol o'ynaydi." },
  { id: "Mg", symbol: "Mg", name: "Magniy", number: 12, mass: 24.305, group: 2, period: 3, category: "Alkaline earth metal", color: "bg-green-100", discovered: 1808, discoverer: "Humphry Davy", density: 1.738, meltingPoint: 650, boilingPoint: 1091, electrons: 12, protons: 12, neutrons: 12, electronConfiguration: "[Ne] 3s²", description: "Magniy - yengil metal. Qo'llash uchun zarur. Xlorofillning tarkibiga kiradi." },
  { id: "Al", symbol: "Al", name: "Alyuminiy", number: 13, mass: 26.98, group: 13, period: 3, category: "Metal", color: "bg-orange-100", discovered: 1825, discoverer: "Hans Christian Ørsted", density: 2.7, meltingPoint: 660.32, boilingPoint: 2519, electrons: 13, protons: 13, neutrons: 14, electronConfiguration: "[Ne] 3s² 3p¹", description: "Alyuminiy - eng ko'p uchraydigan metal. Yengil va kuchli. Aviatsiya va qurilishda ishlatiladi." },
  { id: "Si", symbol: "Si", name: "Kremniy", number: 14, mass: 28.09, group: 14, period: 3, category: "Metalloid", color: "bg-gray-400", discovered: 1824, discoverer: "Jöns Jacob Berzelius", density: 2.33, meltingPoint: 1414, boilingPoint: 3265, electrons: 14, protons: 14, neutrons: 14, electronConfiguration: "[Ne] 3s² 3p²", description: "Kremniy - ikkinchi eng ko'p uchraydigan element. Qum va shisho tarkibiga kiradi. Elektronika asosi." },
  { id: "P", symbol: "P", name: "Fosfor", number: 15, mass: 30.97, group: 15, period: 3, category: "Nonmetal", color: "bg-orange-200", discovered: 1669, discoverer: "Hennig Brand", density: 1.82, meltingPoint: 44.15, boilingPoint: 280.5, electrons: 15, protons: 15, neutrons: 16, electronConfiguration: "[Ne] 3s² 3p³", description: "Fosfor - hayot uchun zarur element. Suyaklar va tishlar tarkibiga kiradi. Guano va fosfat tutunlarda ishlatiladi." },
  { id: "S", symbol: "S", name: "Oltingugurt", number: 16, mass: 32.06, group: 16, period: 3, category: "Nonmetal", color: "bg-yellow-300", discovered: 1000, discoverer: "Ancient", density: 2.07, meltingPoint: 115.21, boilingPoint: 444.72, electrons: 16, protons: 16, neutrons: 16, electronConfiguration: "[Ne] 3s² 3p⁴", description: "Oltingugurt - sariq element. Vulkanlarda topiladi. Kimyoviy industriyada ishlatiladi." },
  { id: "Cl", symbol: "Cl", name: "Xlor", number: 17, mass: 35.45, group: 17, period: 3, category: "Halogen", color: "bg-yellow-200", discovered: 1774, discoverer: "Carl Wilhelm Scheele", density: 3.214, meltingPoint: -101.5, boilingPoint: -34.04, electrons: 17, protons: 17, neutrons: 18, electronConfiguration: "[Ne] 3s² 3p⁵", description: "Xlor - sariq-yashil gaz. Tuz tarkibiga kiradi. Suv tozalashda ishlatiladi." },
  { id: "Ar", symbol: "Ar", name: "Argon", number: 18, mass: 39.95, group: 18, period: 3, category: "Noble gas", color: "bg-blue-100", discovered: 1894, discoverer: "William Ramsay", density: 1.784, meltingPoint: -189.34, boilingPoint: -185.85, electrons: 18, protons: 18, neutrons: 22, electronConfiguration: "[Ne] 3s² 3p⁶", description: "Argon - inert gaz. Atmosferani tashkil etadi. Lampalar va lazer ishlab chiqarishda ishlatiladi." },

  // 4-davr (Tanlanganlar)
  { id: "K", symbol: "K", name: "Kaliy", number: 19, mass: 39.10, group: 1, period: 4, category: "Alkali metal", color: "bg-red-100", discovered: 1807, discoverer: "Humphry Davy", density: 0.862, meltingPoint: 63.38, boilingPoint: 759, electrons: 19, protons: 19, neutrons: 20, electronConfiguration: "[Ar] 4s¹", description: "Kaliy - yuqori reaktiv metal. Organizmlarda muhim rol o'ynaydi. Urug'larning tarkibiga kiradi." },
  { id: "Ca", symbol: "Ca", name: "Kalsiy", number: 20, mass: 40.08, group: 2, period: 4, category: "Alkaline earth metal", color: "bg-green-100", discovered: 1808, discoverer: "Humphry Davy", density: 1.55, meltingPoint: 842, boilingPoint: 1484, electrons: 20, protons: 20, neutrons: 20, electronConfiguration: "[Ar] 4s²", description: "Kalsiy - suyaklar va tishlar tarkibiga kiradi. Sut mahsulotlarida ko'p. Organizm uchun zarur." },
  { id: "Fe", symbol: "Fe", name: "Temir", number: 26, mass: 55.845, group: 8, period: 4, category: "Transition metal", color: "bg-purple-300", discovered: 1000, discoverer: "Ancient", density: 7.874, meltingPoint: 1538, boilingPoint: 2862, electrons: 26, protons: 26, neutrons: 30, electronConfiguration: "[Ar] 3d⁶ 4s²", description: "Temir - eng muhim metal. Qo'llash uchun zarur. Qon tarkibiga kiradi. Konstruksiyalarda ishlatiladi." },
  { id: "Cu", symbol: "Cu", name: "Mis", number: 29, mass: 63.546, group: 11, period: 4, category: "Transition metal", color: "bg-purple-300", discovered: 1000, discoverer: "Ancient", density: 8.96, meltingPoint: 1084.62, boilingPoint: 2562, electrons: 29, protons: 29, neutrons: 34, electronConfiguration: "[Ar] 3d¹⁰ 4s¹", description: "Mis - yaxshi elektr o'tkazgich. Qo'llash uchun zarur. Elektr simlarida ishlatiladi." },
  { id: "Zn", symbol: "Zn", name: "Rux", number: 30, mass: 65.38, group: 12, period: 4, category: "Transition metal", color: "bg-purple-300", discovered: 1000, discoverer: "Ancient", density: 7.134, meltingPoint: 419.53, boilingPoint: 907, electrons: 30, protons: 30, neutrons: 35, electronConfiguration: "[Ar] 3d¹⁰ 4s²", description: "Rux - yaxshi o'tkazgich. Immunitetni kuchaytiradi. Galvanizatsiyada ishlatiladi." },
  { id: "Br", symbol: "Br", name: "Brom", number: 35, mass: 79.904, group: 17, period: 4, category: "Halogen", color: "bg-red-300", discovered: 1826, discoverer: "Antoine Jérôme Balard", density: 3.1028, meltingPoint: -7.2, boilingPoint: 58.8, electrons: 35, protons: 35, neutrons: 44, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁵", description: "Brom - qizil-jigarrang suyuqlik. Juda reaktiv. Dori ishlab chiqarishda ishlatiladi." },

  // 5-davr (Tanlanganlar)
  { id: "Ag", symbol: "Ag", name: "Kumush", number: 47, mass: 107.87, group: 11, period: 5, category: "Transition metal", color: "bg-purple-300", discovered: 1000, discoverer: "Ancient", density: 10.49, meltingPoint: 961.78, boilingPoint: 2162, electrons: 47, protons: 47, neutrons: 60, electronConfiguration: "[Kr] 4d¹⁰ 5s¹", description: "Kumush - qimmatbaho metal. Yaxshi o'tkazgich. Zargarlik va fotografiyada ishlatiladi." },
  { id: "I", symbol: "I", name: "Yod", number: 53, mass: 126.90, group: 17, period: 5, category: "Halogen", color: "bg-purple-400", discovered: 1811, discoverer: "Bernard Courtois", density: 4.933, meltingPoint: 113.7, boilingPoint: 184.3, electrons: 53, protons: 53, neutrons: 74, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁵", description: "Yod - qora kristallar. Tirozan uchun zarur. Dorilar ishlab chiqarishda ishlatiladi." },

  // 6-davr
  { id: "Au", symbol: "Au", name: "Oltin", number: 79, mass: 196.97, group: 11, period: 6, category: "Transition metal", color: "bg-yellow-400", discovered: 1000, discoverer: "Ancient", density: 19.3, meltingPoint: 1064.18, boilingPoint: 2856, electrons: 79, protons: 79, neutrons: 118, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", description: "Oltin - eng qimmatbaho metal. Zargarlik va elektronikada ishlatiladi. Koinotda eng ko'p uchraydigan qimmatbaho metallardan biri." },

  // Lantanidlar (57-71)
  { id: "La", symbol: "La", name: "Lantani", number: 57, mass: 138.91, group: 3, period: 6, category: "Lanthanide", color: "bg-pink-200", discovered: 1839, discoverer: "Carl Gustaf Mosander", density: 6.145, meltingPoint: 920, boilingPoint: 3464, electrons: 57, protons: 57, neutrons: 82, electronConfiguration: "[Xe] 5d¹ 6s²", description: "Lantani - lantanidlar seriyasining birinchisi. Magnit materiallarda ishlatiladi." },

  // Aktinidlar (89-103)
  { id: "U", symbol: "U", name: "Uran", number: 92, mass: 238.03, group: 3, period: 7, category: "Actinide", color: "bg-green-300", discovered: 1789, discoverer: "Martin Heinrich Klaproth", density: 19.1, meltingPoint: 1135, boilingPoint: 4131, electrons: 92, protons: 92, neutrons: 146, electronConfiguration: "[Rn] 5f³ 6d¹ 7s²", description: "Uran - radioaktiv element. Atom energiyasida ishlatiladi. Juda xavfli." },

  // Sintetik elementlar
  { id: "Pu", symbol: "Pu", name: "Plutoniy", number: 94, mass: 244, group: 3, period: 7, category: "Actinide", color: "bg-green-300", discovered: 1940, discoverer: "Glenn T. Seaborg", density: 19.816, meltingPoint: 640, boilingPoint: 3228, electrons: 94, protons: 94, neutrons: 150, electronConfiguration: "[Rn] 5f⁶ 7s²", description: "Plutoniy - sintetik radioaktiv element. Atom bombalarida ishlatiladi. Juda xavfli." },
];

// Guruhlari bo'yicha kategoriyalar
export const ELEMENT_CATEGORIES = {
  "Alkali metal": "Щелочные металлы",
  "Alkaline earth metal": "Щелочноземельные металлы",
  "Transition metal": "O'tish metallari",
  "Metal": "Metallar",
  "Metalloid": "Metalloidlar",
  "Nonmetal": "Nometallar",
  "Halogen": "Galogenlar",
  "Noble gas": "Inert gazlar",
  "Lanthanide": "Lantanidlar",
  "Actinide": "Aktinidlar",
};

// Rangli sxema
export const ELEMENT_COLORS: Record<string, string> = {
  "Alkali metal": "bg-red-100",
  "Alkaline earth metal": "bg-green-100",
  "Transition metal": "bg-purple-300",
  "Metal": "bg-orange-100",
  "Metalloid": "bg-gray-400",
  "Nonmetal": "bg-yellow-100",
  "Halogen": "bg-yellow-200",
  "Noble gas": "bg-blue-100",
  "Lanthanide": "bg-pink-200",
  "Actinide": "bg-green-300",
};

// Elementni raqam bo'yicha topish
export function getElementByNumber(number: number): PeriodicElement | undefined {
  return PERIODIC_TABLE.find((el) => el.number === number);
}

// Elementni belgisi bo'yicha topish
export function getElementBySymbol(symbol: string): PeriodicElement | undefined {
  return PERIODIC_TABLE.find((el) => el.symbol === symbol);
}

// Elementni nomi bo'yicha topish
export function getElementByName(name: string): PeriodicElement | undefined {
  return PERIODIC_TABLE.find((el) => el.name.toLowerCase() === name.toLowerCase());
}

// Guruhi bo'yicha elementlarni topish
export function getElementsByGroup(group: number): PeriodicElement[] {
  return PERIODIC_TABLE.filter((el) => el.group === group);
}

// Davri bo'yicha elementlarni topish
export function getElementsByPeriod(period: number): PeriodicElement[] {
  return PERIODIC_TABLE.filter((el) => el.period === period);
}

// Qidiruv funksiyasi
export function searchElements(query: string): PeriodicElement[] {
  const lowerQuery = query.toLowerCase();
  return PERIODIC_TABLE.filter(
    (el) =>
      el.name.toLowerCase().includes(lowerQuery) ||
      el.symbol.toLowerCase().includes(lowerQuery) ||
      el.number.toString().includes(lowerQuery)
  );
}
