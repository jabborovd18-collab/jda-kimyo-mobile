import { useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, Dimensions, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

/**
 * Ilovaga kirish animatsiyasi.
 *
 * Avval bu joyda 3 sekundlik BO'SH qora ekran turardi (app/_layout.tsx dagi
 * splash bloki ichi bo'sh edi) — foydalanuvchi shuncha vaqt hech narsaga
 * qarab turardi.
 *
 * Harakat tuzilishi foydalanuvchi bergan namunadan olingan: logo pastdan
 * kattalashib chiqadi, orqasida nafas oladigan yorug'lik, fonda sekin
 * suzuvchi ikkita dog' va pastdan ko'tariluvchi zarrachalar. Ranglar esa
 * namunadagi siyan/pushti emas — JDA ning o'z palitrasi (to'q binafsha
 * zamin, sariq-to'q sariq brend akssenti), aks holda ilovaning qolgan
 * qismiga begona bo'lib qolardi.
 *
 * expo-blur o'rnatilmagani uchun yorug'lik SVG radial gradientlar bilan
 * chiziladi — natija iOS va Android'da bir xil bo'ladi.
 */

const { width: EKRAN_W, height: EKRAN_H } = Dimensions.get("window");

// Brend ranglari (theme.config.js dagi qiymatlar bilan bir xil)
const ZAMIN = "#2A0A48";
const ZAMIN_TUB = "#160526";
const AMBER = "#FACC15";
const ORANGE = "#FB923C";
const VIOLET = "#A78BFA";
const PURPLE = "#7E22CE";

const ZARRACHA_SONI = 14;

type Props = {
  /** Animatsiya tugagach chaqiriladi. */
  onFinish?: () => void;
};

export default function JdaSplash({ onFinish }: Props) {
  // Tizimda "harakatni kamaytirish" yoqilgan bo'lsa animatsiya qilinmaydi
  const [kamHarakat, setKamHarakat] = useState(false);

  useEffect(() => {
    let bekor = false;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (!bekor) setKamHarakat(v);
    });
    return () => {
      bekor = true;
    };
  }, []);

  // ─── Logo kirishi: pastdan, kichikdan kattaga ───
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const logoY = useSharedValue(14);

  // ─── Yorug'lik nafasi ───
  const nur = useSharedValue(0);

  // ─── Fondagi dog'lar ───
  const dog1 = useSharedValue(0);
  const dog2 = useSharedValue(0);

  // ─── Matn ───
  const matnOpacity = useSharedValue(0);
  const matnY = useSharedValue(10);

  useEffect(() => {
    if (kamHarakat) {
      logoOpacity.value = 1;
      logoScale.value = 1;
      logoY.value = 0;
      matnOpacity.value = 1;
      matnY.value = 0;
      const t = setTimeout(() => onFinish?.(), 900);
      return () => clearTimeout(t);
    }

    // Namunadagi cubic-bezier(0.16, 1, 0.3, 1) — tez boshlanib yumshoq to'xtaydi
    const chiqish = Easing.bezier(0.16, 1, 0.3, 1);

    logoOpacity.value = withTiming(1, { duration: 700, easing: chiqish });
    logoScale.value = withTiming(1, { duration: 1200, easing: chiqish });
    logoY.value = withTiming(0, { duration: 1200, easing: chiqish });

    // Yorug'lik: 0 ↔ 1 orasida nafas oladi
    nur.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    // Dog'lar — har biri o'z tezligida, shuning uchun takrorlanish sezilmaydi
    dog1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    dog2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    matnOpacity.value = withDelay(500, withTiming(1, { duration: 700 }));
    matnY.value = withDelay(500, withTiming(0, { duration: 700, easing: chiqish }));

    const t = setTimeout(() => onFinish?.(), 2600);
    return () => clearTimeout(t);
  }, [kamHarakat, onFinish, logoOpacity, logoScale, logoY, nur, dog1, dog2, matnOpacity, matnY]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
  }));

  // glowBgPulse: 0.92 ↔ 1.06 o'lcham, 0.55 ↔ 1 shaffoflik
  const nurStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + nur.value * 0.45,
    transform: [{ scale: 0.92 + nur.value * 0.14 }],
  }));

  const dog1Style = useAnimatedStyle(() => ({
    opacity: 0.9 + nur.value * 0.1,
    transform: [
      { translateX: dog1.value * 18 },
      { translateY: dog1.value * 22 },
      { scale: 1 + dog1.value * 0.12 },
    ],
  }));

  const dog2Style = useAnimatedStyle(() => ({
    opacity: 0.85,
    transform: [
      { translateX: dog2.value * -20 },
      { translateY: dog2.value * -16 },
      { scale: 1 + dog2.value * 0.08 },
    ],
  }));

  const matnStyle = useAnimatedStyle(() => ({
    opacity: matnOpacity.value,
    transform: [{ translateY: matnY.value }],
  }));

  return (
    <View
      style={{ flex: 1, backgroundColor: ZAMIN, overflow: "hidden" }}
      accessibilityRole="progressbar"
      accessibilityLabel="JDA KIMYO ochilmoqda"
    >
      {/* Zamin: yuqoridan binafsha, pastga qorayadi */}
      <Svg width={EKRAN_W} height={EKRAN_H} style={{ position: "absolute" }}>
        <Defs>
          <RadialGradient id="tepa" cx="50%" cy="0%" r="85%">
            <Stop offset="0%" stopColor={PURPLE} stopOpacity="0.55" />
            <Stop offset="60%" stopColor={ZAMIN} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="past" cx="10%" cy="100%" r="70%">
            <Stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.9" />
            <Stop offset="100%" stopColor={ZAMIN_TUB} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={EKRAN_W} height={EKRAN_H} fill={ZAMIN} />
        <Rect x="0" y="0" width={EKRAN_W} height={EKRAN_H} fill="url(#past)" />
        <Rect x="0" y="0" width={EKRAN_W} height={EKRAN_H} fill="url(#tepa)" />
      </Svg>

      {/* Suzuvchi dog'lar */}
      <Animated.View
        style={[
          { position: "absolute", top: -EKRAN_H * 0.1, left: -EKRAN_W * 0.25 },
          dog1Style,
        ]}
        pointerEvents="none"
      >
        <Svg width={EKRAN_W * 1.1} height={EKRAN_W * 1.1}>
          <Defs>
            <RadialGradient id="dogA" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={VIOLET} stopOpacity="0.28" />
              <Stop offset="70%" stopColor={VIOLET} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx={EKRAN_W * 0.55} cy={EKRAN_W * 0.55} r={EKRAN_W * 0.55} fill="url(#dogA)" />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          { position: "absolute", bottom: -EKRAN_H * 0.12, right: -EKRAN_W * 0.3 },
          dog2Style,
        ]}
        pointerEvents="none"
      >
        <Svg width={EKRAN_W} height={EKRAN_W}>
          <Defs>
            <RadialGradient id="dogB" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={AMBER} stopOpacity="0.16" />
              <Stop offset="70%" stopColor={AMBER} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx={EKRAN_W * 0.5} cy={EKRAN_W * 0.5} r={EKRAN_W * 0.5} fill="url(#dogB)" />
        </Svg>
      </Animated.View>

      <Zarrachalar kam={kamHarakat} />

      {/* Markaz */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {/* Logo orqasidagi nafas oluvchi yorug'lik */}
          <Animated.View style={[{ position: "absolute" }, nurStyle]} pointerEvents="none">
            <Svg width={280} height={280}>
              <Defs>
                <RadialGradient id="nur" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={AMBER} stopOpacity="0.42" />
                  <Stop offset="45%" stopColor={ORANGE} stopOpacity="0.16" />
                  <Stop offset="75%" stopColor={PURPLE} stopOpacity="0.10" />
                  <Stop offset="100%" stopColor={PURPLE} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx={140} cy={140} r={140} fill="url(#nur)" />
            </Svg>
          </Animated.View>

          {/* Logo belgisi */}
          <Animated.View style={logoStyle}>
            <Svg width={132} height={132} viewBox="0 0 132 132">
              <Defs>
                <LinearGradient id="tanga" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={AMBER} />
                  <Stop offset="100%" stopColor={ORANGE} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="132" height="132" rx="34" fill="url(#tanga)" />
              {/* Benzol halqasi — kimyoning eng tanish belgisi */}
              <Path
                d="M66 30 L97 48 L97 84 L66 102 L35 84 L35 48 Z"
                fill="none"
                stroke={ZAMIN}
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <Circle cx="66" cy="66" r="12" fill={ZAMIN} />
            </Svg>
          </Animated.View>
        </View>

        <Animated.View style={[{ alignItems: "center", marginTop: 28 }, matnStyle]}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: "900",
              letterSpacing: 6,
            }}
          >
            JDA KIMYO
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginTop: 10,
            }}
          >
            Kompleks birikmalar kimyosi
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

/** Pastdan yuqoriga ko'tariluvchi zarrachalar (namunadagi floatUp). */
function Zarrachalar({ kam }: { kam: boolean }) {
  const zarralar = useMemo(
    () =>
      Array.from({ length: ZARRACHA_SONI }, (_, i) => ({
        kalit: i,
        x: Math.random() * EKRAN_W,
        olcham: 2 + Math.random() * 3,
        kechikish: Math.random() * 2600,
        davomiylik: 5200 + Math.random() * 3600,
        siljish: (Math.random() - 0.5) * 60,
      })),
    [],
  );

  if (kam) return null;

  return (
    <View style={{ position: "absolute", inset: 0 }} pointerEvents="none">
      {zarralar.map((z) => (
        <Zarracha key={z.kalit} {...z} />
      ))}
    </View>
  );
}

function Zarracha({
  x,
  olcham,
  kechikish,
  davomiylik,
  siljish,
}: {
  x: number;
  olcham: number;
  kechikish: number;
  davomiylik: number;
  siljish: number;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      kechikish,
      withRepeat(withTiming(1, { duration: davomiylik, easing: Easing.linear }), -1, false),
    );
  }, [t, kechikish, davomiylik]);

  const style = useAnimatedStyle(() => ({
    // Boshida va oxirida so'nadi — o'rtada ko'rinadi
    opacity: t.value < 0.1 ? t.value * 8 : t.value > 0.8 ? (1 - t.value) * 4 : 0.75,
    transform: [
      { translateY: -t.value * EKRAN_H * 1.15 },
      { translateX: t.value * siljish },
      { scale: 0.7 + t.value * 0.55 },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: x,
          width: olcham,
          height: olcham,
          borderRadius: olcham,
          backgroundColor: AMBER,
        },
        style,
      ]}
    />
  );
}
