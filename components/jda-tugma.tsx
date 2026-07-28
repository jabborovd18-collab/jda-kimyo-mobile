import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  View,
  type ViewStyle,
} from "react-native";

import { Text } from "@/components/matn";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useColors } from "@/hooks/use-colors";

/**
 * Brend tugmasi.
 *
 * Saytda asosiy amal tugmasi — sariq→to'q sariq gradient, ustida QORA qalin
 * matn (`from-yellow-500 to-orange-500 text-black font-bold rounded-xl`).
 * Ilovada esa hamma tugma tekis bir rangda edi: rang to'g'ri, lekin brendning
 * eng tanish belgisi yo'q edi.
 *
 * Yorug' rejimda sariq fonda qora matn kontrast bermaydi, shuning uchun u
 * yerda binafsha→fuksiya gradienti ishlatiladi (sayt palitrasining yorug'
 * varianti) va matn oq bo'ladi.
 */

export type TugmaKorinishi = "asosiy" | "ikkilamchi" | "xatar";

export interface JdaTugmaProps {
  /** Tugma matni */
  children: string;
  onPress?: () => void;
  korinish?: TugmaKorinishi;
  /** Yuklanmoqda — bosib bo'lmaydi, aylanma ko'rsatiladi */
  yuklanmoqda?: boolean;
  disabled?: boolean;
  /** Chapdagi belgi yoki emoji */
  belgi?: string;
  /** Kichikroq tugma — karta ichida */
  kichik?: boolean;
  className?: string;
  style?: ViewStyle;
}

/** To'q rejim: sariq→to'q sariq. Yorug' rejim: binafsha→fuksiya. */
export function gradientRanglari(qorongi: boolean): [string, string] {
  return qorongi ? ["#FACC15", "#F97316"] : ["#7E22CE", "#A21CAF"];
}

export function JdaTugma({
  children,
  onPress,
  korinish = "asosiy",
  yuklanmoqda = false,
  disabled = false,
  belgi,
  kichik = false,
  className,
  style,
}: JdaTugmaProps) {
  const colors = useColors();
  const qorongi = useColorScheme() === "dark";
  const ishlamaydi = disabled || yuklanmoqda;

  const balandlik = kichik ? "py-2.5 px-4" : "py-4 px-5";
  const matnOlchami = kichik ? "text-sm" : "text-base";

  const ichi = (matnRangi: string) => (
    <View className="flex-row items-center justify-center gap-2">
      {yuklanmoqda ? (
        <ActivityIndicator size="small" color={matnRangi} />
      ) : belgi ? (
        <Text className={matnOlchami} style={{ color: matnRangi }}>
          {belgi}
        </Text>
      ) : null}
      <Text
        className={`${matnOlchami} font-bold text-center`}
        style={{ color: matnRangi }}
      >
        {children}
      </Text>
    </View>
  );

  // ─── Ikkilamchi: sirt rangida, chegara bilan ───
  if (korinish === "ikkilamchi") {
    return (
      <Pressable
        onPress={ishlamaydi ? undefined : onPress}
        className={`bg-surface border border-border rounded-xl ${balandlik} active:opacity-70 ${
          ishlamaydi ? "opacity-50" : ""
        } ${className ?? ""}`}
        style={style}
      >
        {ichi(colors.foreground)}
      </Pressable>
    );
  }

  // ─── Xatar: o'chirish kabi amallar ───
  if (korinish === "xatar") {
    return (
      <Pressable
        onPress={ishlamaydi ? undefined : onPress}
        className={`bg-error/15 border border-error/50 rounded-xl ${balandlik} active:opacity-70 ${
          ishlamaydi ? "opacity-50" : ""
        } ${className ?? ""}`}
        style={style}
      >
        {ichi(colors.error)}
      </Pressable>
    );
  }

  // ─── Asosiy: brend gradienti ───
  const [boshi, oxiri] = gradientRanglari(qorongi);
  const matnRangi = qorongi ? "#1A1005" : "#FFFFFF";

  return (
    <Pressable
      onPress={ishlamaydi ? undefined : onPress}
      className={`rounded-xl overflow-hidden active:opacity-85 ${
        ishlamaydi ? "opacity-50" : ""
      } ${className ?? ""}`}
      style={[
        {
          // Saytdagi `shadow-2xl shadow-yellow-500/20` ning mobil muqobili
          shadowColor: boshi,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 6,
        },
        style,
      ]}
    >
      {/* LinearGradient — tashqi komponent, NativeWind uning className'ini
          o'qimaydi. Shuning uchun bu yerda uslub raqam bilan beriladi. */}
      <LinearGradient
        colors={[boshi, oxiri]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: kichik ? 10 : 16,
          paddingHorizontal: kichik ? 16 : 20,
        }}
      >
        {ichi(matnRangi)}
      </LinearGradient>
    </Pressable>
  );
}

export default JdaTugma;
