#!/usr/bin/env node
/**
 * Davriy jadval ma'lumotini PubChem bilan boyitadi.
 *
 * Nega kerak: lib/data/periodic-elements.json da 118 element bor edi, lekin
 * faqat nom, massa va qisqacha izoh — birorta fizik kattalik yo'q. Ya'ni
 * jadval bor-u, undan foydalanib bo'lmasdi.
 *
 * Manba: PubChem (AQSh Milliy salomatlik instituti) — ochiq ma'lumot,
 * yuklab olish erkin. ptable.com ning yig'ilgan bazasini ko'chirish o'rniga
 * shu tanlandi: manbasi ishonchli va huquqiy jihatdan toza.
 *
 *   https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/CSV
 *
 * O'zbekcha nom, izoh va qo'llanishi saqlanadi — ular qo'lda yozilgan va
 * PubChem'da yo'q. Ustiga faqat fizik kattaliklar qo'shiladi.
 *
 * Ishga tushirish:  node scripts/merge-pubchem.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ILDIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHIQISH = path.join(ILDIZ, "lib", "data", "periodic-elements.json");
const MANBA = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/CSV";

/** Qo'shtirnoq ichidagi vergulni hisobga oladigan CSV o'quvchi. */
function csvOqi(matn) {
  const qatorlar = [];
  let joriy = [];
  let katak = "";
  let qoshtirnoqda = false;

  for (let i = 0; i < matn.length; i++) {
    const c = matn[i];

    if (qoshtirnoqda) {
      if (c === '"') {
        if (matn[i + 1] === '"') { katak += '"'; i++; }
        else qoshtirnoqda = false;
      } else katak += c;
      continue;
    }

    if (c === '"') qoshtirnoqda = true;
    else if (c === ",") { joriy.push(katak); katak = ""; }
    else if (c === "\n") {
      joriy.push(katak);
      qatorlar.push(joriy);
      joriy = [];
      katak = "";
    } else if (c !== "\r") katak += c;
  }

  if (katak || joriy.length) { joriy.push(katak); qatorlar.push(joriy); }
  return qatorlar;
}

const son = (v) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

/** Kelvin → Selsiy. PubChem haroratlarni Kelvinda beradi. */
const selsiy = (k) => (k === null ? null : Math.round((k - 273.15) * 10) / 10);

/**
 * Blok (s/p/d/f) — jadvaldagi o'rni bo'yicha.
 *
 * Avval buni elektron konfiguratsiyaning oxirgi qismidan olgandim, lekin
 * lantanoidlarda konfiguratsiya "5d1" bilan tugaydi (masalan Ce: [Xe]6s2 4f1
 * 5d1) va ular d-blok bo'lib chiqib ketdi — f-blokda 30 o'rniga 18 ta
 * element sanaldi. O'rin bo'yicha aniqlash bir ma'noli.
 *
 * f-blok bu yerda La–Lu va Ac–Lr (15 tadan) — bosma davriy jadvallarda
 * pastda alohida ikki qator bo'lib chiziladigan guruh. Ekranda ham shunday
 * ko'rsatiladi.
 */
function blok(atomRaqami, guruh) {
  // Lantanoidlar (57–71) va aktinoidlar (89–103)
  if ((atomRaqami >= 57 && atomRaqami <= 71) || (atomRaqami >= 89 && atomRaqami <= 103)) {
    return "f";
  }
  if (atomRaqami === 2) return "s"; // Geliy 18-guruhda, lekin s-blok
  if (guruh <= 2) return "s";
  if (guruh >= 13) return "p";
  return "d";
}

const holatUz = { Solid: "Qattiq", Liquid: "Suyuq", Gas: "Gaz", Expected: "Noma'lum" };

/**
 * Kategoriya nomlari.
 *
 * Fayldagi o'zbekcha nomlarda xato bor edi: nometallar "Qo'zg'almas" deb
 * yozilgan (u "harakatsiz" degani, kimyoda bunday atama yo'q), "Alkaline
 * earth" umuman tarjima qilinmagan, "Transition metall" va "Post-transition
 * metall" esa yarim tarjima. Manba — PubChem'ning inglizcha nomi.
 */
const kategoriyaUz = {
  Nonmetal: "Nometall",
  "Noble gas": "Inert gaz",
  "Alkali metal": "Ishqoriy metall",
  "Alkaline earth metal": "Ishqoriy-yer metall",
  Metalloid: "Metalloid",
  Halogen: "Galogen",
  "Post-transition metal": "O'tishdan keyingi metall",
  "Transition metal": "O'tish metali",
  Lanthanide: "Lantanoid",
  Actinide: "Aktinoid",
};

console.log("PubChem'dan yuklanmoqda...");
const javob = await fetch(MANBA);
if (!javob.ok) throw new Error(`PubChem javob bermadi: ${javob.status}`);

const qatorlar = csvOqi(await javob.text());
const sarlavha = qatorlar[0];
const ustun = Object.fromEntries(sarlavha.map((n, i) => [n, i]));

const pubchem = new Map();
for (const q of qatorlar.slice(1)) {
  if (!q[ustun.AtomicNumber]) continue;
  pubchem.set(Number(q[ustun.AtomicNumber]), q);
}
console.log(`PubChem: ${pubchem.size} ta element`);

const mavjud = JSON.parse(fs.readFileSync(CHIQISH, "utf8"));
console.log(`Mavjud fayl: ${mavjud.length} ta element`);

let boyitilgan = 0;
const yangi = mavjud.map((e) => {
  const p = pubchem.get(e.number);
  if (!p) {
    console.warn(`  ! ${e.number} ${e.symbol} PubChem'da topilmadi`);
    return e;
  }

  boyitilgan++;
  const konfig = p[ustun.ElectronConfiguration] || e.electronConfig;

  const kategoriya = p[ustun.GroupBlock] || e.category;

  return {
    // O'zbekcha matnlar va mavjud maydonlar o'z holicha qoladi
    ...e,

    // Kategoriya nomlari tuzatiladi (yuqoridagi izohga qarang)
    category: kategoriya,
    categoryUz: kategoriyaUz[kategoriya] ?? e.categoryUz,

    // ─── PubChem'dan qo'shilgan fizik kattaliklar ───
    electronegativity: son(p[ustun.Electronegativity]),      // Pauling
    atomicRadius: son(p[ustun.AtomicRadius]),                // pm
    ionizationEnergy: son(p[ustun.IonizationEnergy]),        // eV
    electronAffinity: son(p[ustun.ElectronAffinity]),        // eV
    density: son(p[ustun.Density]),                          // g/cm³
    meltingPointC: selsiy(son(p[ustun.MeltingPoint])),       // °C
    boilingPointC: selsiy(son(p[ustun.BoilingPoint])),       // °C
    standardState: holatUz[p[ustun.StandardState]] ?? (p[ustun.StandardState] || null),
    yearDiscovered: p[ustun.YearDiscovered] || null,
    block: blok(e.number, e.group),
    cpkColor: p[ustun.CPKHexColor] ? `#${p[ustun.CPKHexColor]}` : null,
  };
});

fs.writeFileSync(CHIQISH, JSON.stringify(yangi, null, 2) + "\n");

const bor = (k) => yangi.filter((e) => e[k] !== null && e[k] !== undefined).length;
console.log(`\nYozildi: lib/data/periodic-elements.json (${boyitilgan} ta boyitildi)`);
console.log(`  elektromanfiylik    ${bor("electronegativity")}/118`);
console.log(`  atom radiusi        ${bor("atomicRadius")}/118`);
console.log(`  ionlanish energiyasi ${bor("ionizationEnergy")}/118`);
console.log(`  zichlik             ${bor("density")}/118`);
console.log(`  erish harorati      ${bor("meltingPointC")}/118`);
console.log(`  qaynash harorati    ${bor("boilingPointC")}/118`);
console.log(`  blok                ${bor("block")}/118`);
