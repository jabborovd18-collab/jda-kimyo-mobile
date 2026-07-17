// Kalkulyatorlar ma'lumotlar bazasi - 17 ta kategoriya, 200+ kalkulyator

export interface Calculator {
  id: string;
  name: string;
  category: string;
  description: string;
  formula: string;
  inputs: CalculatorInput[];
  output: string;
  unit: string;
  emoji: string;
  calculate?: (inputs: Record<string, number>) => number | string;
}

export interface CalculatorInput {
  name: string;
  unit: string;
  placeholder: string;
}

// Hisoblash funksiyalari
const calculateFunctions = {
  // Umumiy kimyo
  molCalc: (inputs: Record<string, number>) => {
    const mass = inputs["Massa (m)"] || 0;
    const molarMass = inputs["Molyar massa (M)"] || 1;
    return (mass / molarMass).toFixed(3);
  },
  massCalc: (inputs: Record<string, number>) => {
    const mol = inputs["Mol miqdori (n)"] || 0;
    const molarMass = inputs["Molyar massa (M)"] || 1;
    return (mol * molarMass).toFixed(2);
  },
  particlesCalc: (inputs: Record<string, number>) => {
    const mol = inputs["Mol miqdori (n)"] || 0;
    const NA = 6.022e23;
    return (mol * NA).toExponential(3);
  },
  massPercentCalc: (inputs: Record<string, number>) => {
    const elementMass = inputs["Element massa"] || 0;
    const formulaMass = inputs["Formula massa"] || 1;
    return ((elementMass / formulaMass) * 100).toFixed(2);
  },

  // Eritmalar kimyosi
  molarityCalc: (inputs: Record<string, number>) => {
    const mol = inputs["Mol miqdori (n)"] || 0;
    const volume = inputs["Hajm (V)"] || 1;
    return (mol / volume).toFixed(3);
  },
  molalityCalc: (inputs: Record<string, number>) => {
    const mol = inputs["Mol miqdori (n)"] || 0;
    const solventMass = inputs["Erituvchi massa"] || 1;
    return (mol / solventMass).toFixed(3);
  },
  normalityCalc: (inputs: Record<string, number>) => {
    const mol = inputs["Mol miqdori (n)"] || 0;
    const z = inputs["Zaryadlar soni (z)"] || 1;
    const volume = inputs["Hajm (V)"] || 1;
    return ((mol * z) / volume).toFixed(3);
  },
  massPercentSolCalc: (inputs: Record<string, number>) => {
    const substanceMass = inputs["Modda massa"] || 0;
    const solutionMass = inputs["Eritma massa"] || 1;
    return ((substanceMass / solutionMass) * 100).toFixed(2);
  },
  dilutionCalc: (inputs: Record<string, number>) => {
    const C1 = inputs["Boshlang'ich konsentratsiya (C₁)"] || 0;
    const V1 = inputs["Boshlang'ich hajm (V₁)"] || 0;
    const C2 = inputs["Yakuniy konsentratsiya (C₂)"] || 1;
    return ((C1 * V1) / C2).toFixed(2);
  },
  ppmCalc: (inputs: Record<string, number>) => {
    const substanceMass = inputs["Modda massa"] || 0;
    const solutionMass = inputs["Eritma massa"] || 1;
    return ((substanceMass / solutionMass) * 1e6).toFixed(2);
  },

  // Gaz qonunlari
  boyleCalc: (inputs: Record<string, number>) => {
    const P1 = inputs["Boshlang'ich bosim (P₁)"] || 0;
    const V1 = inputs["Boshlang'ich hajm (V₁)"] || 0;
    const P2 = inputs["Yakuniy bosim (P₂)"] || 1;
    return ((P1 * V1) / P2).toFixed(3);
  },
  charlesCalc: (inputs: Record<string, number>) => {
    const V1 = inputs["Boshlang'ich hajm (V₁)"] || 0;
    const T1 = inputs["Boshlang'ich temperatura (T₁)"] || 1;
    const T2 = inputs["Yakuniy temperatura (T₂)"] || 1;
    return ((V1 * T2) / T1).toFixed(3);
  },

  // Kislota va asoslar
  phCalc: (inputs: Record<string, number>) => {
    const concentration = inputs["[H⁺] konsentratsiya"] || 1e-7;
    if (concentration <= 0) return "Xato: Konsentratsiya > 0 bo'lishi kerak";
    return (-Math.log10(concentration)).toFixed(2);
  },
  pohCalc: (inputs: Record<string, number>) => {
    const concentration = inputs["[OH⁻] konsentratsiya"] || 1e-7;
    if (concentration <= 0) return "Xato: Konsentratsiya > 0 bo'lishi kerak";
    return (-Math.log10(concentration)).toFixed(2);
  },
  hConcentrationCalc: (inputs: Record<string, number>) => {
    const pH = inputs["pH"] || 7;
    return (Math.pow(10, -pH)).toExponential(3);
  },
  ohConcentrationCalc: (inputs: Record<string, number>) => {
    const pOH = inputs["pOH"] || 7;
    return (Math.pow(10, -pOH)).toExponential(3);
  },
  hendersonCalc: (inputs: Record<string, number>) => {
    const pKa = inputs["pKa"] || 0;
    const aConc = inputs["[A⁻] konsentratsiya"] || 1;
    const haConc = inputs["[HA] konsentratsiya"] || 1;
    return (pKa + Math.log10(aConc / haConc)).toFixed(2);
  },

  // Termodinamika
  enthalpyCalc: (inputs: Record<string, number>) => {
    const productDH = inputs["Mahsulotlar ΔHf"] || 0;
    const reactantDH = inputs["Reagentlar ΔHf"] || 0;
    return (productDH - reactantDH).toFixed(2);
  },
  gibbsCalc: (inputs: Record<string, number>) => {
    const DH = inputs["ΔH"] || 0;
    const T = inputs["Temperatura (T)"] || 1;
    const DS = inputs["ΔS"] || 0;
    return (DH - (T * DS) / 1000).toFixed(2);
  },
  heatCapacityCalc: (inputs: Record<string, number>) => {
    const mass = inputs["Massa (m)"] || 0;
    const c = inputs["Issiqlik sig'imi (c)"] || 1;
    const dT = inputs["Temperatura o'zgarishi (ΔT)"] || 0;
    return (mass * c * dT).toFixed(2);
  },

  // Elektrokimyo
  nernstCalc: (inputs: Record<string, number>) => {
    const E0 = inputs["E° (standart potensial)"] || 0;
    const n = inputs["n (elektronlar soni)"] || 1;
    const Q = inputs["Q (reaktsiya kvotienti)"] || 1;
    return (E0 - (0.0592 / n) * Math.log10(Q)).toFixed(4);
  },
  faradayCalc: (inputs: Record<string, number>) => {
    const M = inputs["Molyar massa (M)"] || 1;
    const I = inputs["Tok (I)"] || 0;
    const t = inputs["Vaqt (t)"] || 0;
    const n = inputs["Elektronlar soni (n)"] || 1;
    const F = 96485;
    return ((M * I * t) / (n * F)).toFixed(4);
  },

  // Analitik kimyo
  beerLambertCalc: (inputs: Record<string, number>) => {
    const epsilon = inputs["Moliy absorbans koeffitsienti (ε)"] || 1;
    const b = inputs["Kuveta uzunligi (b)"] || 1;
    const c = inputs["Konsentratsiya (c)"] || 0;
    return (epsilon * b * c).toFixed(4);
  },
  percentErrorCalc: (inputs: Record<string, number>) => {
    const experimental = inputs["Eksperimental qiymat"] || 0;
    const theoretical = inputs["Nazariy qiymat"] || 1;
    return (Math.abs(experimental - theoretical) / theoretical * 100).toFixed(2);
  },

  // Konvertorlar
  temperatureConverterCalc: (inputs: Record<string, number>) => {
    const celsius = inputs["Celsius"] || 0;
    return (celsius + 273.15).toFixed(2);
  },
  pressureConverterCalc: (inputs: Record<string, number>) => {
    const atm = inputs["Bosim (atm)"] || 0;
    return (atm * 101325).toFixed(2);
  },
  massConverterCalc: (inputs: Record<string, number>) => {
    const grams = inputs["Massa (g)"] || 0;
    return (grams / 1000).toFixed(4);
  },
  volumeConverterCalc: (inputs: Record<string, number>) => {
    const liters = inputs["Hajm (L)"] || 0;
    return (liters * 1000).toFixed(2);
  },
  energyConverterCalc: (inputs: Record<string, number>) => {
    const joules = inputs["Energiya (J)"] || 0;
    return (joules / 1000).toFixed(4);
  },

  // Kinetika
  reactionRateCalc: (inputs: Record<string, number>) => {
    const deltaC = inputs["Konsentratsiya o'zgarishi (Δ[A])"] || 0;
    const deltaT = inputs["Vaqt o'zgarishi (Δt)"] || 1;
    return (deltaC / deltaT).toFixed(6);
  },
  arrheniusCalc: (inputs: Record<string, number>) => {
    const A = inputs["Pre-eksponensial faktor (A)"] || 1;
    const Ea = inputs["Aktivlanish energiyasi (Ea)"] || 0;
    const T = inputs["Temperatura (T)"] || 1;
    const R = 8.314;
    return (A * Math.exp(-Ea / (R * T))).toExponential(3);
  },
  halfLifeFirstOrderCalc: (inputs: Record<string, number>) => {
    const k = inputs["Tezlik konstanti (k)"] || 1;
    return (Math.log(2) / k).toFixed(4);
  },
};

export const calculators: Calculator[] = [
  // 1. Umumiy kimyo
  {
    id: "mol-calc",
    name: "Mol kalkulyatori",
    category: "Umumiy kimyo",
    description: "Massadan mol miqdorini hisoblash",
    formula: "n = m / M",
    emoji: "⚛️",
    inputs: [
      { name: "Massa (m)", unit: "g", placeholder: "Massani kiriting" },
      { name: "Molyar massa (M)", unit: "g/mol", placeholder: "Molyar massani kiriting" },
    ],
    output: "Mol miqdori",
    unit: "mol",
    calculate: calculateFunctions.molCalc,
  },
  {
    id: "mass-calc",
    name: "Massa kalkulyatori",
    category: "Umumiy kimyo",
    description: "Mol miqdoridan massani hisoblash",
    formula: "m = n × M",
    emoji: "⚖️",
    inputs: [
      { name: "Mol miqdori (n)", unit: "mol", placeholder: "Mol miqdorini kiriting" },
      { name: "Molyar massa (M)", unit: "g/mol", placeholder: "Molyar massani kiriting" },
    ],
    output: "Massa",
    unit: "g",
    calculate: calculateFunctions.massCalc,
  },
  {
    id: "molar-mass-calc",
    name: "Molyar massa kalkulyatori",
    category: "Umumiy kimyo",
    description: "Kimyoviy formuladan molyar massani hisoblash",
    formula: "M = Σ(Atom massalari)",
    emoji: "🧮",
    inputs: [
      { name: "Kimyoviy formula", unit: "", placeholder: "Masalan: H2O, NaCl" },
    ],
    output: "Molyar massa",
    unit: "g/mol",
  },
  {
    id: "particles-calc",
    name: "Zarrachalar soni kalkulyatori",
    category: "Umumiy kimyo",
    description: "Mol miqdoridan zarrachalar sonini hisoblash",
    formula: "N = n × Nₐ",
    emoji: "🔬",
    inputs: [
      { name: "Mol miqdori (n)", unit: "mol", placeholder: "Mol miqdorini kiriting" },
    ],
    output: "Zarrachalar soni",
    unit: "ta",
    calculate: calculateFunctions.particlesCalc,
  },
  {
    id: "avogadro-calc",
    name: "Avogadro soni kalkulyatori",
    category: "Umumiy kimyo",
    description: "Avogadro soni = 6.022 × 10²³",
    formula: "Nₐ = 6.022 × 10²³",
    emoji: "🔢",
    inputs: [],
    output: "Avogadro soni",
    unit: "1/mol",
  },
  {
    id: "mass-percent-calc",
    name: "Elementlarning massa foizi",
    category: "Umumiy kimyo",
    description: "Kimyoviy formulada elementning massa foizini hisoblash",
    formula: "% = (Element massa / Formula massa) × 100",
    emoji: "📊",
    inputs: [
      { name: "Element massa", unit: "g/mol", placeholder: "Element massasini kiriting" },
      { name: "Formula massa", unit: "g/mol", placeholder: "Formula massasini kiriting" },
    ],
    output: "Massa foizi",
    unit: "%",
    calculate: calculateFunctions.massPercentCalc,
  },

  // 2. Eritmalar kimyosi
  {
    id: "molarity-calc",
    name: "Molyarlik (M) kalkulyatori",
    category: "Eritmalar kimyosi",
    description: "Eritmaning molyarligini hisoblash",
    formula: "M = n / V",
    emoji: "🧪",
    inputs: [
      { name: "Mol miqdori (n)", unit: "mol", placeholder: "Mol miqdorini kiriting" },
      { name: "Hajm (V)", unit: "L", placeholder: "Hajmni kiriting" },
    ],
    output: "Molyarlik",
    unit: "M",
    calculate: calculateFunctions.molarityCalc,
  },
  {
    id: "molality-calc",
    name: "Molyal (m) kalkulyatori",
    category: "Eritmalar kimyosi",
    description: "Eritmaning molyalligini hisoblash",
    formula: "m = n / kg erituvchi",
    emoji: "💧",
    inputs: [
      { name: "Mol miqdori (n)", unit: "mol", placeholder: "Mol miqdorini kiriting" },
      { name: "Erituvchi massa", unit: "kg", placeholder: "Erituvchi massasini kiriting" },
    ],
    output: "Molyal",
    unit: "m",
    calculate: calculateFunctions.molalityCalc,
  },
  {
    id: "normality-calc",
    name: "Normalitet (N) kalkulyatori",
    category: "Eritmalar kimyosi",
    description: "Eritmaning normalitetini hisoblash",
    formula: "N = (n × z) / V",
    emoji: "⚡",
    inputs: [
      { name: "Mol miqdori (n)", unit: "mol", placeholder: "Mol miqdorini kiriting" },
      { name: "Zaryadlar soni (z)", unit: "", placeholder: "Zaryadlar sonini kiriting" },
      { name: "Hajm (V)", unit: "L", placeholder: "Hajmni kiriting" },
    ],
    output: "Normalitet",
    unit: "N",
    calculate: calculateFunctions.normalityCalc,
  },
  {
    id: "mass-percent-sol-calc",
    name: "Massa foizi (eritma)",
    category: "Eritmalar kimyosi",
    description: "Eritmadagi modda massasining foizini hisoblash",
    formula: "% = (Modda massa / Eritma massa) × 100",
    emoji: "📈",
    inputs: [
      { name: "Modda massa", unit: "g", placeholder: "Modda massasini kiriting" },
      { name: "Eritma massa", unit: "g", placeholder: "Eritma massasini kiriting" },
    ],
    output: "Massa foizi",
    unit: "%",
    calculate: calculateFunctions.massPercentSolCalc,
  },
  {
    id: "dilution-calc",
    name: "Dilution (C₁V₁=C₂V₂)",
    category: "Eritmalar kimyosi",
    description: "Eritmani suyultirish hisoblari",
    formula: "C₁V₁ = C₂V₂",
    emoji: "🌊",
    inputs: [
      { name: "Boshlang'ich konsentratsiya (C₁)", unit: "M", placeholder: "C₁ ni kiriting" },
      { name: "Boshlang'ich hajm (V₁)", unit: "mL", placeholder: "V₁ ni kiriting" },
      { name: "Yakuniy konsentratsiya (C₂)", unit: "M", placeholder: "C₂ ni kiriting" },
    ],
    output: "Yakuniy hajm (V₂)",
    unit: "mL",
    calculate: calculateFunctions.dilutionCalc,
  },
  {
    id: "ppm-calc",
    name: "PPM kalkulyatori",
    category: "Eritmalar kimyosi",
    description: "Konsentratsiyani PPM'ga o'tkazish",
    formula: "PPM = (Modda massa / Eritma massa) × 10⁶",
    emoji: "🔍",
    inputs: [
      { name: "Modda massa", unit: "mg", placeholder: "Modda massasini kiriting" },
      { name: "Eritma massa", unit: "kg", placeholder: "Eritma massasini kiriting" },
    ],
    output: "PPM",
    unit: "ppm",
    calculate: calculateFunctions.ppmCalc,
  },

  // 3. Stexiometriya
  {
    id: "limiting-reagent-calc",
    name: "Limiting Reagent",
    category: "Stexiometriya",
    description: "Reaksiyada limitlovchi reagentni aniqlash",
    formula: "n / koeffitsient",
    emoji: "⚗️",
    inputs: [
      { name: "Reagent 1 mol", unit: "mol", placeholder: "Reagent 1 mol miqdori" },
      { name: "Reagent 1 koeffitsient", unit: "", placeholder: "Stexiometrik koeffitsient" },
      { name: "Reagent 2 mol", unit: "mol", placeholder: "Reagent 2 mol miqdori" },
      { name: "Reagent 2 koeffitsient", unit: "", placeholder: "Stexiometrik koeffitsient" },
    ],
    output: "Limitlovchi reagent",
    unit: "",
  },
  {
    id: "theoretical-yield-calc",
    name: "Nazariy unum",
    category: "Stexiometriya",
    description: "Reaksiyaning nazariy unumini hisoblash",
    formula: "Nazariy unum = (n × M × koeff) / 100",
    emoji: "📦",
    inputs: [
      { name: "Limitlovchi reagent mol", unit: "mol", placeholder: "Mol miqdorini kiriting" },
      { name: "Mahsulot molyar massa", unit: "g/mol", placeholder: "Molyar massani kiriting" },
      { name: "Stexiometrik koeffitsient", unit: "", placeholder: "Koeffitsientni kiriting" },
    ],
    output: "Nazariy unum",
    unit: "g",
  },
  {
    id: "percent-yield-calc",
    name: "Foiz unum",
    category: "Stexiometriya",
    description: "Reaksiyaning foiz unumini hisoblash",
    formula: "% unum = (Amaliy unum / Nazariy unum) × 100",
    emoji: "✅",
    inputs: [
      { name: "Amaliy unum", unit: "g", placeholder: "Amaliy unumni kiriting" },
      { name: "Nazariy unum", unit: "g", placeholder: "Nazariy unumni kiriting" },
    ],
    output: "Foiz unum",
    unit: "%",
  },

  // 4. Gaz qonunlari
  {
    id: "ideal-gas-calc",
    name: "Ideal gaz qonuni",
    category: "Gaz qonunlari",
    description: "PV = nRT tenglamasidan birinchisini topish",
    formula: "PV = nRT",
    emoji: "💨",
    inputs: [
      { name: "Bosim (P)", unit: "atm", placeholder: "Bosimni kiriting" },
      { name: "Hajm (V)", unit: "L", placeholder: "Hajmni kiriting" },
      { name: "Mol miqdori (n)", unit: "mol", placeholder: "Mol miqdorini kiriting" },
      { name: "Temperatura (T)", unit: "K", placeholder: "Temperaturani kiriting" },
    ],
    output: "Gaz konstanti (R)",
    unit: "L·atm/(mol·K)",
  },
  {
    id: "boyle-law-calc",
    name: "Boyle qonuni",
    category: "Gaz qonunlari",
    description: "P₁V₁ = P₂V₂",
    formula: "P₁V₁ = P₂V₂",
    emoji: "🎈",
    inputs: [
      { name: "Boshlang'ich bosim (P₁)", unit: "atm", placeholder: "P₁ ni kiriting" },
      { name: "Boshlang'ich hajm (V₁)", unit: "L", placeholder: "V₁ ni kiriting" },
      { name: "Yakuniy bosim (P₂)", unit: "atm", placeholder: "P₂ ni kiriting" },
    ],
    output: "Yakuniy hajm (V₂)",
    unit: "L",
    calculate: calculateFunctions.boyleCalc,
  },
  {
    id: "charles-law-calc",
    name: "Charles qonuni",
    category: "Gaz qonunlari",
    description: "V₁/T₁ = V₂/T₂",
    formula: "V₁/T₁ = V₂/T₂",
    emoji: "🌡️",
    inputs: [
      { name: "Boshlang'ich hajm (V₁)", unit: "L", placeholder: "V₁ ni kiriting" },
      { name: "Boshlang'ich temperatura (T₁)", unit: "K", placeholder: "T₁ ni kiriting" },
      { name: "Yakuniy temperatura (T₂)", unit: "K", placeholder: "T₂ ni kiriting" },
    ],
    output: "Yakuniy hajm (V₂)",
    unit: "L",
    calculate: calculateFunctions.charlesCalc,
  },

  // 5. Kislota va asoslar
  {
    id: "ph-calc",
    name: "pH kalkulyatori",
    category: "Kislota va asoslar",
    description: "pH = -log[H⁺]",
    formula: "pH = -log[H⁺]",
    emoji: "🧫",
    inputs: [
      { name: "[H⁺] konsentratsiya", unit: "M", placeholder: "[H⁺] ni kiriting" },
    ],
    output: "pH",
    unit: "",
    calculate: calculateFunctions.phCalc,
  },
  {
    id: "poh-calc",
    name: "pOH kalkulyatori",
    category: "Kislota va asoslar",
    description: "pOH = -log[OH⁻]",
    formula: "pOH = -log[OH⁻]",
    emoji: "🧬",
    inputs: [
      { name: "[OH⁻] konsentratsiya", unit: "M", placeholder: "[OH⁻] ni kiriting" },
    ],
    output: "pOH",
    unit: "",
    calculate: calculateFunctions.pohCalc,
  },
  {
    id: "h-concentration-calc",
    name: "[H⁺] hisoblash",
    category: "Kislota va asoslar",
    description: "[H⁺] = 10^(-pH)",
    formula: "[H⁺] = 10^(-pH)",
    emoji: "⚛️",
    inputs: [
      { name: "pH", unit: "", placeholder: "pH ni kiriting" },
    ],
    output: "[H⁺] konsentratsiya",
    unit: "M",
    calculate: calculateFunctions.hConcentrationCalc,
  },
  {
    id: "oh-concentration-calc",
    name: "[OH⁻] hisoblash",
    category: "Kislota va asoslar",
    description: "[OH⁻] = 10^(-pOH)",
    formula: "[OH⁻] = 10^(-pOH)",
    emoji: "🔋",
    inputs: [
      { name: "pOH", unit: "", placeholder: "pOH ni kiriting" },
    ],
    output: "[OH⁻] konsentratsiya",
    unit: "M",
    calculate: calculateFunctions.ohConcentrationCalc,
  },
  {
    id: "henderson-hasselbalch-calc",
    name: "Henderson-Hasselbalch",
    category: "Kislota va asoslar",
    description: "pH = pKa + log([A⁻]/[HA])",
    formula: "pH = pKa + log([A⁻]/[HA])",
    emoji: "🧪",
    inputs: [
      { name: "pKa", unit: "", placeholder: "pKa ni kiriting" },
      { name: "[A⁻] konsentratsiya", unit: "M", placeholder: "[A⁻] ni kiriting" },
      { name: "[HA] konsentratsiya", unit: "M", placeholder: "[HA] ni kiriting" },
    ],
    output: "pH",
    unit: "",
    calculate: calculateFunctions.hendersonCalc,
  },

  // 6. Termodinamika
  {
    id: "enthalpy-calc",
    name: "ΔH hisoblash",
    category: "Termodinamika",
    description: "Entalpiya o'zgarishini hisoblash",
    formula: "ΔH = Σ ΔHf(mahsulotlar) - Σ ΔHf(reagentlar)",
    emoji: "🔥",
    inputs: [
      { name: "Mahsulotlar ΔHf", unit: "kJ/mol", placeholder: "Mahsulotlar ΔHf" },
      { name: "Reagentlar ΔHf", unit: "kJ/mol", placeholder: "Reagentlar ΔHf" },
    ],
    output: "ΔH",
    unit: "kJ/mol",
    calculate: calculateFunctions.enthalpyCalc,
  },
  {
    id: "gibbs-energy-calc",
    name: "ΔG hisoblash",
    category: "Termodinamika",
    description: "Gibbs erkin energiyasini hisoblash",
    formula: "ΔG = ΔH - TΔS",
    emoji: "⚡",
    inputs: [
      { name: "ΔH", unit: "kJ/mol", placeholder: "ΔH ni kiriting" },
      { name: "Temperatura (T)", unit: "K", placeholder: "Temperaturani kiriting" },
      { name: "ΔS", unit: "J/(mol·K)", placeholder: "ΔS ni kiriting" },
    ],
    output: "ΔG",
    unit: "kJ/mol",
    calculate: calculateFunctions.gibbsCalc,
  },
  {
    id: "entropy-calc",
    name: "ΔS hisoblash",
    category: "Termodinamika",
    description: "Entropiya o'zgarishini hisoblash",
    formula: "ΔS = Σ S°(mahsulotlar) - Σ S°(reagentlar)",
    emoji: "🌀",
    inputs: [
      { name: "Mahsulotlar S°", unit: "J/(mol·K)", placeholder: "Mahsulotlar S°" },
      { name: "Reagentlar S°", unit: "J/(mol·K)", placeholder: "Reagentlar S°" },
    ],
    output: "ΔS",
    unit: "J/(mol·K)",
  },
  {
    id: "heat-capacity-calc",
    name: "Issiqlik sig'imi",
    category: "Termodinamika",
    description: "Q = m × c × ΔT",
    formula: "Q = m × c × ΔT",
    emoji: "🌡️",
    inputs: [
      { name: "Massa (m)", unit: "g", placeholder: "Massani kiriting" },
      { name: "Issiqlik sig'imi (c)", unit: "J/(g·°C)", placeholder: "Issiqlik sig'imini kiriting" },
      { name: "Temperatura o'zgarishi (ΔT)", unit: "°C", placeholder: "ΔT ni kiriting" },
    ],
    output: "Issiqlik (Q)",
    unit: "J",
    calculate: calculateFunctions.heatCapacityCalc,
  },

  // 7. Elektrokimyo
  {
    id: "nernst-calc",
    name: "Nernst tenglamasi",
    category: "Elektrokimyo",
    description: "E = E° - (0.0592/n) × log(Q)",
    formula: "E = E° - (0.0592/n) × log(Q)",
    emoji: "🔌",
    inputs: [
      { name: "E° (standart potensial)", unit: "V", placeholder: "E° ni kiriting" },
      { name: "n (elektronlar soni)", unit: "", placeholder: "n ni kiriting" },
      { name: "Q (reaktsiya kvotienti)", unit: "", placeholder: "Q ni kiriting" },
    ],
    output: "E (haqiqiy potensial)",
    unit: "V",
    calculate: calculateFunctions.nernstCalc,
  },
  {
    id: "faraday-law-calc",
    name: "Faradey qonunlari",
    category: "Elektrokimyo",
    description: "m = (M × I × t) / (n × F)",
    formula: "m = (M × I × t) / (n × F)",
    emoji: "🔋",
    inputs: [
      { name: "Molyar massa (M)", unit: "g/mol", placeholder: "Molyar massani kiriting" },
      { name: "Tok (I)", unit: "A", placeholder: "Tokni kiriting" },
      { name: "Vaqt (t)", unit: "s", placeholder: "Vaqtni kiriting" },
      { name: "Elektronlar soni (n)", unit: "", placeholder: "Elektronlar sonini kiriting" },
    ],
    output: "Ajralgan modda massasi",
    unit: "g",
    calculate: calculateFunctions.faradayCalc,
  },

  // 8. Analitik kimyo
  {
    id: "beer-lambert-calc",
    name: "Beer-Lambert qonuni",
    category: "Analitik kimyo",
    description: "A = ε × b × c",
    formula: "A = ε × b × c",
    emoji: "🔬",
    inputs: [
      { name: "Moliy absorbans koeffitsienti (ε)", unit: "L/(mol·cm)", placeholder: "ε ni kiriting" },
      { name: "Kuveta uzunligi (b)", unit: "cm", placeholder: "b ni kiriting" },
      { name: "Konsentratsiya (c)", unit: "M", placeholder: "c ni kiriting" },
    ],
    output: "Absorbans (A)",
    unit: "",
    calculate: calculateFunctions.beerLambertCalc,
  },
  {
    id: "percent-error-calc",
    name: "Xatolik (%)",
    category: "Analitik kimyo",
    description: "% xatolik = |Eksperimental - Nazariy| / Nazariy × 100",
    formula: "% xatolik = |Eksperimental - Nazariy| / Nazariy × 100",
    emoji: "📊",
    inputs: [
      { name: "Eksperimental qiymat", unit: "", placeholder: "Eksperimental qiymatni kiriting" },
      { name: "Nazariy qiymat", unit: "", placeholder: "Nazariy qiymatni kiriting" },
    ],
    output: "Xatolik (%)",
    unit: "%",
    calculate: calculateFunctions.percentErrorCalc,
  },

  // 9. Atom va kvant kimyosi
  {
    id: "wavelength-calc",
    name: "To'lqin uzunligi",
    category: "Atom va kvant kimyosi",
    description: "λ = h / p",
    formula: "λ = h / p",
    emoji: "〰️",
    inputs: [
      { name: "Plank konstanti (h)", unit: "J·s", placeholder: "h ni kiriting" },
      { name: "Impuls (p)", unit: "kg·m/s", placeholder: "p ni kiriting" },
    ],
    output: "To'lqin uzunligi",
    unit: "m",
  },
  {
    id: "energy-photon-calc",
    name: "Foton energiyasi",
    category: "Atom va kvant kimyosi",
    description: "E = hν",
    formula: "E = hν",
    emoji: "💡",
    inputs: [
      { name: "Plank konstanti (h)", unit: "J·s", placeholder: "6.626e-34" },
      { name: "Chastota (ν)", unit: "Hz", placeholder: "Chastotani kiriting" },
    ],
    output: "Energiya",
    unit: "J",
  },

  // 10. Noorganik kimyo
  {
    id: "oxidation-state-calc",
    name: "Oksidlanish darajasi",
    category: "Noorganik kimyo",
    description: "Elementning oksidlanish darajasini aniqlash",
    formula: "Oksidlanish darajasi",
    emoji: "⚛️",
    inputs: [
      { name: "Jami zarya", unit: "", placeholder: "Jami zaryani kiriting" },
      { name: "Atomlar soni", unit: "", placeholder: "Atomlar sonini kiriting" },
    ],
    output: "Oksidlanish darajasi",
    unit: "",
  },
  {
    id: "coordination-number-calc",
    name: "Koordinatsion son",
    category: "Noorganik kimyo",
    description: "Markaziy atom atrofidagi ligandlar soni",
    formula: "Koordinatsion son = Ligandlar soni",
    emoji: "🔗",
    inputs: [
      { name: "Ligandlar soni", unit: "", placeholder: "Ligandlar sonini kiriting" },
    ],
    output: "Koordinatsion son",
    unit: "",
  },

  // 11. Organik kimyo
  {
    id: "dbe-calc",
    name: "DBE (Unsaturation)",
    category: "Organik kimyo",
    description: "Darajasi bo'lmagan bog'lanish = (2C + 2 + N - H - X) / 2",
    formula: "DBE = (2C + 2 + N - H - X) / 2",
    emoji: "🔗",
    inputs: [
      { name: "Uglerod (C)", unit: "", placeholder: "C sonini kiriting" },
      { name: "Vodorod (H)", unit: "", placeholder: "H sonini kiriting" },
      { name: "Azot (N)", unit: "", placeholder: "N sonini kiriting (0 bo'lsa)" },
      { name: "Galogen (X)", unit: "", placeholder: "X sonini kiriting (0 bo'lsa)" },
    ],
    output: "DBE",
    unit: "",
  },

  // 12. Kristallokimyo
  {
    id: "crystal-density-calc",
    name: "Kristall zichligi",
    category: "Kristallokimyo",
    description: "ρ = (Z × M) / (a³ × Nₐ)",
    formula: "ρ = (Z × M) / (a³ × Nₐ)",
    emoji: "💎",
    inputs: [
      { name: "Z (unit cell'dagi formulalar soni)", unit: "", placeholder: "Z ni kiriting" },
      { name: "M (molyar massa)", unit: "g/mol", placeholder: "M ni kiriting" },
      { name: "a (katta o'qlari)", unit: "Å", placeholder: "a ni kiriting" },
    ],
    output: "Kristall zichligi",
    unit: "g/cm³",
  },
  {
    id: "bragg-law-calc",
    name: "Bragg qonuni",
    category: "Kristallokimyo",
    description: "nλ = 2d sin(θ)",
    formula: "nλ = 2d sin(θ)",
    emoji: "📡",
    inputs: [
      { name: "n (tartibi)", unit: "", placeholder: "n ni kiriting" },
      { name: "λ (to'lqin uzunligi)", unit: "Å", placeholder: "λ ni kiriting" },
      { name: "d (tekislik masofasi)", unit: "Å", placeholder: "d ni kiriting" },
    ],
    output: "Bragg burchagi (θ)",
    unit: "°",
  },

  // 13. Yadro kimyosi
  {
    id: "radioactive-decay-calc",
    name: "Radioaktiv yemirilish",
    category: "Yadro kimyosi",
    description: "N(t) = N₀ × (1/2)^(t/t₁/₂)",
    formula: "N(t) = N₀ × (1/2)^(t/t₁/₂)",
    emoji: "☢️",
    inputs: [
      { name: "Boshlang'ich miqdor (N₀)", unit: "", placeholder: "N₀ ni kiriting" },
      { name: "Yarim yemirilish vaqti (t₁/₂)", unit: "yil", placeholder: "t₁/₂ ni kiriting" },
      { name: "Vaqt (t)", unit: "yil", placeholder: "t ni kiriting" },
    ],
    output: "Qolgan miqdor (N)",
    unit: "",
  },
  {
    id: "half-life-calc",
    name: "Yarim yemirilish vaqti",
    category: "Yadro kimyosi",
    description: "t₁/₂ = ln(2) / λ",
    formula: "t₁/₂ = ln(2) / λ",
    emoji: "⏱️",
    inputs: [
      { name: "Yemirilish konstanti (λ)", unit: "1/s", placeholder: "λ ni kiriting" },
    ],
    output: "Yarim yemirilish vaqti",
    unit: "s",
  },

  // 14. Biokimyo
  {
    id: "isoelectric-point-calc",
    name: "Aminokislota pI",
    category: "Biokimyo",
    description: "Aminokislotaning izoelektrik nuqtasini hisoblash",
    formula: "pI = (pKa1 + pKa2) / 2",
    emoji: "🧬",
    inputs: [
      { name: "pKa1", unit: "", placeholder: "pKa1 ni kiriting" },
      { name: "pKa2", unit: "", placeholder: "pKa2 ni kiriting" },
    ],
    output: "pI",
    unit: "",
  },
  {
    id: "gc-content-calc",
    name: "DNK/RNK GC foizi",
    category: "Biokimyo",
    description: "GC foizi = (G + C) / (A + T + G + C) × 100",
    formula: "GC% = (G + C) / Jami × 100",
    emoji: "🧪",
    inputs: [
      { name: "G (Guanin)", unit: "", placeholder: "G sonini kiriting" },
      { name: "C (Sitozin)", unit: "", placeholder: "C sonini kiriting" },
      { name: "A (Adenin)", unit: "", placeholder: "A sonini kiriting" },
      { name: "T (Timin)", unit: "", placeholder: "T sonini kiriting" },
    ],
    output: "GC foizi",
    unit: "%",
  },

  // 15. Konvertorlar
  {
    id: "temperature-converter",
    name: "Harorat konvertori",
    category: "Konvertorlar",
    description: "Celsius ↔ Fahrenheit ↔ Kelvin",
    formula: "K = °C + 273.15",
    emoji: "🌡️",
    inputs: [
      { name: "Celsius", unit: "°C", placeholder: "°C ni kiriting" },
    ],
    output: "Kelvin",
    unit: "K",
    calculate: calculateFunctions.temperatureConverterCalc,
  },
  {
    id: "pressure-converter",
    name: "Bosim konvertori",
    category: "Konvertorlar",
    description: "atm ↔ Pa ↔ mmHg ↔ bar",
    formula: "1 atm = 101325 Pa",
    emoji: "🔽",
    inputs: [
      { name: "Bosim (atm)", unit: "atm", placeholder: "atm ni kiriting" },
    ],
    output: "Bosim (Pa)",
    unit: "Pa",
    calculate: calculateFunctions.pressureConverterCalc,
  },
  {
    id: "mass-converter",
    name: "Massa konvertori",
    category: "Konvertorlar",
    description: "g ↔ kg ↔ mg ↔ μg",
    formula: "1 kg = 1000 g",
    emoji: "⚖️",
    inputs: [
      { name: "Massa (g)", unit: "g", placeholder: "g ni kiriting" },
    ],
    output: "Massa (kg)",
    unit: "kg",
    calculate: calculateFunctions.massConverterCalc,
  },
  {
    id: "volume-converter",
    name: "Hajm konvertori",
    category: "Konvertorlar",
    description: "L ↔ mL ↔ cm³ ↔ m³",
    formula: "1 L = 1000 mL",
    emoji: "📏",
    inputs: [
      { name: "Hajm (L)", unit: "L", placeholder: "L ni kiriting" },
    ],
    output: "Hajm (mL)",
    unit: "mL",
    calculate: calculateFunctions.volumeConverterCalc,
  },
  {
    id: "energy-converter",
    name: "Energiya konvertori",
    category: "Konvertorlar",
    description: "J ↔ kJ ↔ cal ↔ kcal",
    formula: "1 kJ = 1000 J",
    emoji: "⚡",
    inputs: [
      { name: "Energiya (J)", unit: "J", placeholder: "J ni kiriting" },
    ],
    output: "Energiya (kJ)",
    unit: "kJ",
    calculate: calculateFunctions.energyConverterCalc,
  },

  // 16. Kinetika
  {
    id: "reaction-rate-calc",
    name: "Reaksiya tezligi",
    category: "Kimyoviy kinetika",
    description: "v = Δ[A] / Δt",
    formula: "v = Δ[A] / Δt",
    emoji: "⚡",
    inputs: [
      { name: "Konsentratsiya o'zgarishi (Δ[A])", unit: "M", placeholder: "Δ[A] ni kiriting" },
      { name: "Vaqt o'zgarishi (Δt)", unit: "s", placeholder: "Δt ni kiriting" },
    ],
    output: "Reaksiya tezligi",
    unit: "M/s",
    calculate: calculateFunctions.reactionRateCalc,
  },
  {
    id: "arrhenius-calc",
    name: "Arrhenius tenglamasi",
    category: "Kimyoviy kinetika",
    description: "k = A × e^(-Ea/RT)",
    formula: "k = A × e^(-Ea/RT)",
    emoji: "📈",
    inputs: [
      { name: "Pre-eksponensial faktor (A)", unit: "", placeholder: "A ni kiriting" },
      { name: "Aktivlanish energiyasi (Ea)", unit: "J/mol", placeholder: "Ea ni kiriting" },
      { name: "Temperatura (T)", unit: "K", placeholder: "T ni kiriting" },
    ],
    output: "Tezlik konstanti (k)",
    unit: "",
    calculate: calculateFunctions.arrheniusCalc,
  },
  {
    id: "half-life-first-order-calc",
    name: "Yarim yemirilish vaqti (1-tartibli)",
    category: "Kimyoviy kinetika",
    description: "t₁/₂ = ln(2) / k",
    formula: "t₁/₂ = ln(2) / k",
    emoji: "⏰",
    inputs: [
      { name: "Tezlik konstanti (k)", unit: "1/s", placeholder: "k ni kiriting" },
    ],
    output: "Yarim yemirilish vaqti",
    unit: "s",
    calculate: calculateFunctions.halfLifeFirstOrderCalc,
  },

  // 17. AI funksiyalar (Hozircha oddiy kalkulyatorlar)
  {
    id: "formula-parser-calc",
    name: "Kimyoviy formula parseri",
    category: "AI funksiyalar",
    description: "Kimyoviy formulani tahlil qilish va molyar massasini hisoblash",
    formula: "M = Σ(Atom massalari)",
    emoji: "🤖",
    inputs: [
      { name: "Kimyoviy formula", unit: "", placeholder: "H2O, NaCl, Ca(OH)2" },
    ],
    output: "Molyar massa",
    unit: "g/mol",
  },
  {
    id: "unit-converter-calc",
    name: "Kimyoviy birliklar konvertori",
    category: "AI funksiyalar",
    description: "Turli kimyoviy birliklarni o'tkazish",
    formula: "Konversiya faktori",
    emoji: "🔄",
    inputs: [
      { name: "Qiymat", unit: "", placeholder: "Qiymatni kiriting" },
      { name: "Boshlang'ich birlik", unit: "", placeholder: "Boshlang'ich birlik" },
      { name: "Yakuniy birlik", unit: "", placeholder: "Yakuniy birlik" },
    ],
    output: "Konvertatsiya qilingan qiymat",
    unit: "",
  },
];

// Kategoriyalar ro'yxati
export const categories = [
  "Umumiy kimyo",
  "Eritmalar kimyosi",
  "Stexiometriya",
  "Gaz qonunlari",
  "Kislota va asoslar",
  "Termodinamika",
  "Elektrokimyo",
  "Analitik kimyo",
  "Atom va kvant kimyosi",
  "Noorganik kimyo",
  "Organik kimyo",
  "Kristallokimyo",
  "Yadro kimyosi",
  "Biokimyo",
  "Konvertorlar",
  "Kimyoviy kinetika",
  "AI funksiyalar",
];

// Qidiruv funksiyasi
export function searchCalculators(query: string): Calculator[] {
  const lowerQuery = query.toLowerCase();
  return calculators.filter(
    (calc) =>
      calc.name.toLowerCase().includes(lowerQuery) ||
      calc.description.toLowerCase().includes(lowerQuery) ||
      calc.category.toLowerCase().includes(lowerQuery),
  );
}

// Kategoriya bo'yicha filtrash
export function getCalculatorsByCategory(category: string): Calculator[] {
  return calculators.filter((calc) => calc.category === category);
}
