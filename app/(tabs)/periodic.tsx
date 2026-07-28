import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/matn";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import elementlar from "@/lib/data/periodic-elements.json";

/**
 * Davriy jadval.
 *
 * Ma'lumot PubChem'dan boyitilgan (scripts/merge-pubchem.mjs): erish va
 * qaynash harorati, zichlik, elektromanfiylik, atom radiusi, ionlanish
 * energiyasi, holat, blok. Avval faqat nom va massa bor edi — ya'ni jadval
 * bor-u, undan foydalanib bo'lmasdi.
 *
 * Jadval haqiqiy ko'rinishda: 18 guruh × 7 davr, lantanoid va aktinoidlar
 * pastda alohida ikki qatorda (bosma jadvallardagidek). Telefon ekraniga
 * sig'magani uchun yon tomonga suriladi.
 *
 * Ranglash uch xil: kategoriya, blok yoki fizik kattalik bo'yicha. Oxirgisi
 * eng foydalisi — elektromanfiylikni tanlasangiz, uning jadval bo'ylab
 * qanday o'zgarishi darhol ko'rinadi.
 */

type Element = (typeof elementlar)[number];

const KATAK = 46;
const ORALIQ = 3;
const QADAM = KATAK + ORALIQ;

// ─── Ranglash rejimlari ──────────────────────────────────────────

type Rejim = "kategoriya" | "blok" | "xossa";
type Xossa = "electronegativity" | "density" | "meltingPointC" | "atomicRadius";

const XOSSALAR: { kalit: Xossa; nom: string; birlik: string; log?: boolean }[] =
  [
    { kalit: "electronegativity", nom: "Elektromanfiylik", birlik: "" },
    { kalit: "atomicRadius", nom: "Atom radiusi", birlik: " pm" },
    // Zichlik 0.00009 (vodorod) dan 22.57 (osmiy) gacha — 250 000 barobar farq.
    // Chiziqli shkalada barcha gazlar bitta rangga tushib, jadval ma'nosini
    // yo'qotardi, shuning uchun logarifmik.
    { kalit: "density", nom: "Zichlik", birlik: " g/sm³", log: true },
    { kalit: "meltingPointC", nom: "Erish harorati", birlik: " °C" },
  ];

const BLOK_RANGI: Record<string, string> = {
  s: "#F87171",
  p: "#34D399",
  d: "#60A5FA",
  f: "#C084FC",
};

/** Kategoriya rangi — fayldagi `color` maydonidan. */
function kategoriyaRangi(e: Element) {
  return (e as any).color || "#8B5CF6";
}

/**
 * Xossa qiymatini rangga aylantiradi: kichikdan (binafsha) kattaga (sariq).
 * Qiymati yo'q element rangsiz qoladi — bu ham ma'lumot: sun'iy og'ir
 * elementlarda o'lchangan qiymat yo'q.
 */
function xossaRangi(
  qiymat: number | null,
  min: number,
  max: number,
  log = false,
) {
  if (qiymat === null || max === min) return null;

  // Logarifmik shkalada nol va manfiy qiymat bo'lmaydi
  const o = log
    ? (v: number) => Math.log10(Math.max(v, 1e-6))
    : (v: number) => v;

  const past = o(min);
  const yuqori = o(max);
  if (yuqori === past) return null;

  const t = Math.max(0, Math.min(1, (o(qiymat) - past) / (yuqori - past)));
  // #7E22CE (binafsha) → #FACC15 (sariq)
  const r = Math.round(0x7e + (0xfa - 0x7e) * t);
  const g = Math.round(0x22 + (0xcc - 0x22) * t);
  const b = Math.round(0xce + (0x15 - 0xce) * t);
  return `rgb(${r},${g},${b})`;
}

/** Uzun o'nlik sonlarni qisqartirish (masalan 1537.9). */
const qisqa = (v: number) =>
  Number.isInteger(v) ? v : Math.round(v * 100) / 100;

// ─── Ekran ───────────────────────────────────────────────────────

export default function PeriodicScreen() {
  const colors = useColors();
  const [qidiruv, setQidiruv] = useState("");
  const [rejim, setRejim] = useState<Rejim>("kategoriya");
  const [xossa, setXossa] = useState<Xossa>("electronegativity");
  const [tanlangan, setTanlangan] = useState<Element | null>(null);

  const chegara = useMemo(() => {
    const q = elementlar
      .map((e) => (e as any)[xossa] as number | null)
      .filter((v): v is number => typeof v === "number");
    return { min: Math.min(...q), max: Math.max(...q) };
  }, [xossa]);

  const topilgan = useMemo(() => {
    const s = qidiruv.trim().toLowerCase();
    if (!s) return null;
    return new Set(
      elementlar
        .filter(
          (e) =>
            e.symbol.toLowerCase().startsWith(s) ||
            e.name.toLowerCase().includes(s) ||
            e.nameEn.toLowerCase().includes(s) ||
            String(e.number) === s,
        )
        .map((e) => e.number),
    );
  }, [qidiruv]);

  const rangOl = (e: Element): string | null => {
    if (rejim === "blok") return BLOK_RANGI[(e as any).block] ?? null;
    if (rejim === "xossa") {
      const x = XOSSALAR.find((v) => v.kalit === xossa);
      return xossaRangi(
        (e as any)[xossa] ?? null,
        chegara.min,
        chegara.max,
        x?.log,
      );
    }
    return kategoriyaRangi(e);
  };

  const fBlokda = (n: number) => (n >= 57 && n <= 71) || (n >= 89 && n <= 103);
  const asosiy = elementlar.filter((e) => !fBlokda(e.number));
  const lantanoidlar = elementlar.filter(
    (e) => e.number >= 57 && e.number <= 71,
  );
  const aktinoidlar = elementlar.filter(
    (e) => e.number >= 89 && e.number <= 103,
  );

  return (
    <ScreenContainer className="p-4">
      <View className="flex-1 gap-3">
        <View className="gap-1">
          <Text sarlavha className="text-3xl font-bold text-foreground">
            Davriy jadval
          </Text>
          <Text className="text-sm text-muted">
            118 element · PubChem ma&apos;lumoti
          </Text>
        </View>

        <TextInput
          value={qidiruv}
          onChangeText={setQidiruv}
          placeholder="Belgi, nom yoki raqam — Fe, temir, 26"
          placeholderTextColor={colors.muted}
          className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
        />

        {/* Ranglash rejimi */}
        <View className="flex-row gap-2">
          {(
            [
              ["kategoriya", "Kategoriya"],
              ["blok", "Blok"],
              ["xossa", "Xossa"],
            ] as [Rejim, string][]
          ).map(([k, nom]) => (
            <TouchableOpacity
              key={k}
              onPress={() => setRejim(k)}
              accessibilityState={{ selected: rejim === k }}
              className={`flex-1 py-2 rounded-xl border items-center ${
                rejim === k
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  rejim === k ? "text-background" : "text-muted"
                }`}
              >
                {nom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {rejim === "xossa" ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {XOSSALAR.map((x) => (
                <TouchableOpacity
                  key={x.kalit}
                  onPress={() => setXossa(x.kalit)}
                  className={`px-3 py-1.5 rounded-full border ${
                    xossa === x.kalit
                      ? "bg-primary/20 border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      xossa === x.kalit
                        ? "text-primary font-semibold"
                        : "text-muted"
                    }`}
                  >
                    {x.nom}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : null}

        {/* Jadval */}
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ width: 18 * QADAM, paddingBottom: 8 }}>
              <View style={{ height: 7 * QADAM }}>
                {asosiy.map((e) => (
                  <Katak
                    key={e.number}
                    element={e}
                    rang={rangOl(e)}
                    xira={topilgan ? !topilgan.has(e.number) : false}
                    chap={(e.group - 1) * QADAM}
                    tep={(e.period - 1) * QADAM}
                    onPress={() => setTanlangan(e)}
                  />
                ))}

                <OrinBelgisi chap={2 * QADAM} tep={5 * QADAM} matn="57–71" />
                <OrinBelgisi chap={2 * QADAM} tep={6 * QADAM} matn="89–103" />
              </View>

              {/* Lantanoid va aktinoidlar — bosma jadvallardagidek pastda */}
              <View style={{ height: 2 * QADAM, marginTop: 10 }}>
                {lantanoidlar.map((e, i) => (
                  <Katak
                    key={e.number}
                    element={e}
                    rang={rangOl(e)}
                    xira={topilgan ? !topilgan.has(e.number) : false}
                    chap={(i + 2) * QADAM}
                    tep={0}
                    onPress={() => setTanlangan(e)}
                  />
                ))}
                {aktinoidlar.map((e, i) => (
                  <Katak
                    key={e.number}
                    element={e}
                    rang={rangOl(e)}
                    xira={topilgan ? !topilgan.has(e.number) : false}
                    chap={(i + 2) * QADAM}
                    tep={QADAM}
                    onPress={() => setTanlangan(e)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </ScrollView>

        <Izoh rejim={rejim} xossa={xossa} chegara={chegara} />
      </View>

      <ElementOynasi element={tanlangan} onClose={() => setTanlangan(null)} />
    </ScreenContainer>
  );
}

// ─── Katak ───────────────────────────────────────────────────────

function Katak({
  element,
  rang,
  xira,
  chap,
  tep,
  onPress,
}: {
  element: Element;
  rang: string | null;
  xira: boolean;
  chap: number;
  tep: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={`${element.number} ${element.name}`}
      style={{
        position: "absolute",
        left: chap,
        top: tep,
        width: KATAK,
        height: KATAK,
        backgroundColor: rang ?? "transparent",
        opacity: xira ? 0.18 : 1,
        borderRadius: 7,
        borderWidth: rang ? 0 : 1,
        borderColor: "rgba(255,255,255,0.28)",
        borderStyle: rang ? "solid" : "dashed",
        padding: 3,
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          fontSize: 8,
          color: rang ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.5)",
        }}
      >
        {element.number}
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "800",
          color: rang ? "#12061F" : "rgba(255,255,255,0.8)",
        }}
      >
        {element.symbol}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontSize: 6.5,
          color: rang ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.45)",
        }}
      >
        {element.name}
      </Text>
    </TouchableOpacity>
  );
}

function OrinBelgisi({
  chap,
  tep,
  matn,
}: {
  chap: number;
  tep: number;
  matn: string;
}) {
  return (
    <View
      style={{
        position: "absolute",
        left: chap,
        top: tep,
        width: KATAK,
        height: KATAK,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>
        {matn}
      </Text>
    </View>
  );
}

// ─── Izoh ────────────────────────────────────────────────────────

function Izoh({
  rejim,
  xossa,
  chegara,
}: {
  rejim: Rejim;
  xossa: Xossa;
  chegara: { min: number; max: number };
}) {
  if (rejim === "xossa") {
    const x = XOSSALAR.find((v) => v.kalit === xossa)!;
    return (
      <View className="gap-1.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-[11px] text-muted">
            {qisqa(chegara.min)}
            {x.birlik}
          </Text>
          <View className="flex-1 flex-row h-2 rounded-full overflow-hidden">
            {Array.from({ length: 24 }, (_, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: xossaRangi(i, 0, 23) ?? "transparent",
                }}
              />
            ))}
          </View>
          <Text className="text-[11px] text-muted">
            {qisqa(chegara.max)}
            {x.birlik}
          </Text>
        </View>
        <Text className="text-[10px] text-muted">
          Punktir chegara — bu element uchun o&apos;lchangan qiymat yo&apos;q
        </Text>
      </View>
    );
  }

  if (rejim === "blok") {
    return (
      <View className="flex-row gap-3 flex-wrap">
        {Object.entries(BLOK_RANGI).map(([b, rang]) => (
          <View key={b} className="flex-row items-center gap-1.5">
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                backgroundColor: rang,
              }}
            />
            <Text className="text-[11px] text-muted">{b}-blok</Text>
          </View>
        ))}
      </View>
    );
  }

  const kategoriyalar = [...new Set(elementlar.map((e) => e.categoryUz))];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-3">
        {kategoriyalar.map((k) => {
          const namuna = elementlar.find((e) => e.categoryUz === k)!;
          return (
            <View key={k} className="flex-row items-center gap-1.5">
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  backgroundColor: kategoriyaRangi(namuna),
                }}
              />
              <Text className="text-[11px] text-muted">{k}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ─── Element oynasi ──────────────────────────────────────────────

function ElementOynasi({
  element,
  onClose,
}: {
  element: Element | null;
  onClose: () => void;
}) {
  if (!element) return null;
  const e = element as any;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/60" onPress={onClose} />

      <View className="bg-background border-t border-border rounded-t-3xl max-h-[82%]">
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <View className="flex-row items-center gap-4 mb-5">
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                backgroundColor: kategoriyaRangi(element),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 26, fontWeight: "800", color: "#12061F" }}
              >
                {element.symbol}
              </Text>
              <Text style={{ fontSize: 9, color: "rgba(0,0,0,0.6)" }}>
                {element.number}
              </Text>
            </View>

            <View className="flex-1">
              <Text sarlavha className="text-2xl font-bold text-foreground">
                {element.name}
              </Text>
              <Text className="text-sm text-muted">{element.nameEn}</Text>
              <Text className="text-xs text-primary mt-1">
                {element.categoryUz}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} accessibilityLabel="Yopish">
              <Text className="text-2xl text-muted">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-5">
            <Qiymat nom="Atom massasi" qiymat={element.mass} birlik="u" />
            <Qiymat nom="Davr" qiymat={element.period} />
            <Qiymat nom="Guruh" qiymat={element.group} />
            <Qiymat nom="Blok" qiymat={e.block} />
            <Qiymat nom="Holat" qiymat={e.standardState} />
            <Qiymat nom="Zichlik" qiymat={e.density} birlik="g/sm³" />
            <Qiymat nom="Erish" qiymat={e.meltingPointC} birlik="°C" />
            <Qiymat nom="Qaynash" qiymat={e.boilingPointC} birlik="°C" />
            <Qiymat nom="Elektromanfiylik" qiymat={e.electronegativity} />
            <Qiymat nom="Atom radiusi" qiymat={e.atomicRadius} birlik="pm" />
            <Qiymat
              nom="Ionlanish en."
              qiymat={e.ionizationEnergy}
              birlik="eV"
            />
            <Qiymat
              nom="Elektronga moyillik"
              qiymat={e.electronAffinity}
              birlik="eV"
            />
          </View>

          <Bolim
            nom="Elektron konfiguratsiya"
            matn={element.electronConfig}
            mono
          />

          {Array.isArray(element.oxidationStates) &&
          element.oxidationStates.length ? (
            <View className="mb-4">
              <Text className="text-xs text-muted mb-1.5">
                Oksidlanish darajalari
              </Text>
              <View className="flex-row flex-wrap gap-1.5">
                {element.oxidationStates.map((o: string) => (
                  <View
                    key={o}
                    className="px-2.5 py-1 rounded-md bg-surface border border-border"
                  >
                    <Text className="text-xs text-foreground">{o}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <Bolim nom="Tavsifi" matn={element.description} />
          <Bolim nom="Xossalari" matn={element.properties} />
          <Bolim nom="Qo'llanishi" matn={element.uses} />
          <Bolim
            nom="Kashf etilishi"
            matn={
              e.yearDiscovered && e.yearDiscovered !== "Ancient"
                ? `${e.yearDiscovered}-yil · ${element.discovery}`
                : element.discovery
            }
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

function Qiymat({
  nom,
  qiymat,
  birlik,
}: {
  nom: string;
  qiymat: string | number | null | undefined;
  birlik?: string;
}) {
  const bor = qiymat !== null && qiymat !== undefined && qiymat !== "";
  const korinish = typeof qiymat === "number" ? qisqa(qiymat) : qiymat;

  return (
    <View className="bg-surface border border-border rounded-xl px-3 py-2.5 min-w-[30%] flex-1">
      <Text className="text-[10px] text-muted" numberOfLines={1}>
        {nom}
      </Text>
      <Text
        className={`text-sm font-bold ${bor ? "text-foreground" : "text-muted"}`}
      >
        {bor ? `${korinish}${birlik ? ` ${birlik}` : ""}` : "—"}
      </Text>
    </View>
  );
}

function Bolim({
  nom,
  matn,
  mono,
}: {
  nom: string;
  matn?: string;
  mono?: boolean;
}) {
  if (!matn) return null;
  return (
    <View className="mb-4">
      <Text className="text-xs text-muted mb-1">{nom}</Text>
      <Text
        className="text-sm text-foreground leading-relaxed"
        style={mono ? { fontFamily: "monospace" } : undefined}
      >
        {matn}
      </Text>
    </View>
  );
}
