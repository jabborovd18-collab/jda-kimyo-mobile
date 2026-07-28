#!/usr/bin/env node
/**
 * Bitta manba logotipdan ilovaning barcha ikonkalarini yasaydi.
 *
 * Nega skript: ikonka to'rt xil joyda, to'rt xil talab bilan ishlatiladi.
 * Ularni qo'lda tayyorlash — har safar logo o'zgarganda takrorlanadigan va
 * xato qilinadigan ish. Bu yerda bir buyruq bilan hammasi qayta yasaladi.
 *
 *   node scripts/ikonkalarni-yasa.mjs
 *   node scripts/ikonkalarni-yasa.mjs boshqa-logo.png
 *
 * Talablar har xilligi:
 *
 *   iOS       shaffoflikni qabul qilmaydi va burchakni O'ZI yumaloqlaydi.
 *             Shuning uchun to'la kvadrat, shaffofsiz rasm beriladi —
 *             aks holda burchaklar qora bo'lib qoladi.
 *
 *   Android   ikonkani doira yoki kvadratchaga qirqadi va chetki ~33% ni
 *             kesib tashlaydi. Shuning uchun logo o'rtadagi xavfsiz
 *             maydonga kichraytirib joylanadi.
 *
 *   Splash    fon rangi ustida chiziladi, shaffoflik saqlanadi.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ILDIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const RASMLAR = path.join(ILDIZ, "assets", "images");
const MANBA = process.argv[2] || path.join(ILDIZ, "assets", "brand", "jda-logo.png");

/**
 * Plitkaning o'z rangi. Logotip shu rangdagi yumaloq burchakli kvadrat
 * ustida chizilgan; iOS uchun burchaklarni shu rang bilan to'ldiramiz,
 * shunda qo'shimcha chegara ko'rinmaydi.
 */
const PLITKA_RANGI = { r: 11, g: 14, b: 18, alpha: 1 };

/** Android ikonkani qirqadi — logo shu ulushdan oshmasligi kerak */
const XAVFSIZ_ULUSH = 0.66;

const OLCHAM = 1024;

async function main() {
  if (!existsSync(MANBA)) {
    console.error(`Manba fayl topilmadi: ${MANBA}`);
    console.error("Foydalanish: node scripts/ikonkalarni-yasa.mjs [logo.png]");
    process.exitCode = 1;
    return;
  }

  console.log(`Manba: ${path.relative(ILDIZ, MANBA)}`);

  // 1. Chetdagi bo'sh joyni kesib tashlaymiz va kvadratga keltiramiz.
  //    Manba rasmda logo atrofida ko'p shaffof joy bo'lishi mumkin — u
  //    ikonkani kichraytirib yuboradi.
  const kesilgan = await sharp(MANBA).trim().png().toBuffer();
  const { width, height } = await sharp(kesilgan).metadata();
  const tomon = Math.max(width, height);
  console.log(`  kesilgandan keyin: ${width}×${height} → kvadrat ${tomon}×${tomon}`);

  const kvadrat = await sharp({
    create: {
      width: tomon,
      height: tomon,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: kesilgan, gravity: "center" }])
    .png()
    .toBuffer();

  // 2. iOS va umumiy ikonka — shaffofliksiz to'la kvadrat
  await sharp(kvadrat)
    .resize(OLCHAM, OLCHAM)
    .flatten({ background: PLITKA_RANGI })
    .png()
    .toFile(path.join(RASMLAR, "icon.png"));
  console.log("  ✓ icon.png                    1024×1024, shaffofsiz");

  // 3. Android adaptiv ikonkasining old qatlami — xavfsiz maydon ichida
  const ichkiOlcham = Math.round(OLCHAM * XAVFSIZ_ULUSH);
  const ichki = await sharp(kvadrat).resize(ichkiOlcham, ichkiOlcham).png().toBuffer();

  await sharp({
    create: {
      width: OLCHAM,
      height: OLCHAM,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: ichki, gravity: "center" }])
    .png()
    .toFile(path.join(RASMLAR, "android-icon-foreground.png"));
  console.log(
    `  ✓ android-icon-foreground.png 1024×1024, logo ${Math.round(XAVFSIZ_ULUSH * 100)}% maydonda`,
  );

  // 4. Splash — shaffoflik saqlanadi, fon rangini app.config.ts belgilaydi
  await sharp(kvadrat)
    .resize(OLCHAM, OLCHAM)
    .png()
    .toFile(path.join(RASMLAR, "splash-icon.png"));
  console.log("  ✓ splash-icon.png             1024×1024, shaffof");

  // 5. Veb uchun favicon
  await sharp(kvadrat)
    .resize(64, 64)
    .flatten({ background: PLITKA_RANGI })
    .png()
    .toFile(path.join(RASMLAR, "favicon.png"));
  console.log("  ✓ favicon.png                 64×64");

  console.log("\nTayyor. APK yig'ilganda yangi ikonka ishlatiladi.");
}

main().catch((xato) => {
  console.error("XATO:", xato.message);
  process.exitCode = 1;
});
