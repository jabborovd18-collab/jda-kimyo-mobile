import {
  Text as ReactNativeText,
  type TextProps,
  type TextStyle,
} from "react-native";

import { SHRIFT, sarlavhaOraligi } from "@/lib/jda/shrift";

/**
 * Ilovaning matn komponenti.
 *
 * Nega react-native'ning Text'i to'g'ridan-to'g'ri ishlatilmaydi: React
 * Native shriftning qalin variantini o'zi tanlay olmaydi. "font-bold" yozsak
 * tizim mavjud shriftni sun'iy yo'g'onlashtiradi va harflar buziladi.
 * Haqiqiy qalin shrift boshqa fayl va boshqa nom bilan keladi.
 *
 * Shu sababli bu komponent className'ni o'qib, mos shrift nomini o'zi
 * qo'yadi. Ekranlarda hech narsa o'zgarmaydi — faqat import manzili:
 *
 *   import { Text } from "@/components/matn";
 *
 * Sarlavhalar uchun `sarlavha` xossasi Syne shriftini yoqadi (saytdagi h1—h6
 * kabi), qolgan hamma joyda DM Sans ishlaydi.
 */
export interface MatnProps extends TextProps {
  className?: string;
  /** Syne shrifti — ekran va bo'lim sarlavhalari uchun */
  sarlavha?: boolean;
}

/** className ichida shu belgi bormi (so'z chegarasi bilan) */
function bor(className: string | undefined, belgi: string) {
  if (!className) return false;
  return new RegExp(`(^|\\s)${belgi}(\\s|$)`).test(className);
}

/** Uslub obyektidan (massiv ham bo'lishi mumkin) fontWeight ni oladi */
function ogirlikniOl(
  style: TextProps["style"],
): TextStyle["fontWeight"] | undefined {
  if (!style) return undefined;
  if (Array.isArray(style)) {
    for (let i = style.length - 1; i >= 0; i--) {
      const topildi = ogirlikniOl(style[i] as TextProps["style"]);
      if (topildi) return topildi;
    }
    return undefined;
  }
  return (style as TextStyle).fontWeight;
}

/** className va uslubga qarab shrift nomini tanlaydi */
function shriftniTanla(
  className: string | undefined,
  style: TextProps["style"],
  sarlavha: boolean,
) {
  const ogirlik = ogirlikniOl(style);

  const qalinmi =
    bor(className, "font-bold") ||
    bor(className, "font-extrabold") ||
    bor(className, "font-black") ||
    ogirlik === "bold" ||
    ogirlik === "700" ||
    ogirlik === "800" ||
    ogirlik === "900";

  const ortami =
    bor(className, "font-semibold") ||
    bor(className, "font-medium") ||
    ogirlik === "500" ||
    ogirlik === "600";

  if (sarlavha) return qalinmi ? SHRIFT.sarlavhaQalin : SHRIFT.sarlavha;
  if (qalinmi) return SHRIFT.qalin;
  if (ortami) return SHRIFT.orta;
  return SHRIFT.oddiy;
}

/** className'dan shrift o'lchamini taxminlaydi — harflar oralig'i uchun kerak */
function olchamniTaxminla(
  className: string | undefined,
  style: TextProps["style"],
) {
  const OLCHAMLAR: Record<string, number> = {
    "text-xs": 12,
    "text-sm": 14,
    "text-base": 16,
    "text-lg": 18,
    "text-xl": 20,
    "text-2xl": 24,
    "text-3xl": 30,
    "text-4xl": 36,
    "text-5xl": 48,
  };

  for (const [belgi, olcham] of Object.entries(OLCHAMLAR)) {
    if (bor(className, belgi)) return olcham;
  }

  if (
    !Array.isArray(style) &&
    style &&
    typeof (style as TextStyle).fontSize === "number"
  ) {
    return (style as TextStyle).fontSize as number;
  }

  return 16;
}

export function Text({
  className,
  style,
  sarlavha = false,
  ...props
}: MatnProps) {
  const fontFamily = shriftniTanla(className, style, sarlavha);

  // Shrift nomining o'zi og'irlikni bildiradi. fontWeight qoldirilsa tizim
  // ustiga yana sun'iy qalinlik qo'shadi va harflar qalinlashib ketadi.
  const asos: TextStyle = { fontFamily, fontWeight: "normal" };

  if (sarlavha) {
    asos.letterSpacing = sarlavhaOraligi(olchamniTaxminla(className, style));
  }

  return (
    <ReactNativeText {...props} className={className} style={[asos, style]} />
  );
}

export default Text;
