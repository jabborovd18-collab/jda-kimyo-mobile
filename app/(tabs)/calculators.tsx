import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { JdaTugma } from "@/components/jda-tugma";
import { Text } from "@/components/matn";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  birlikGuruhlari,
  konvert,
  sonniYoz,
  BirlikXatosi,
} from "@/lib/chem/units";
import {
  calculators,
  calculatorCount,
  categories,
  getCalculatorById,
  getCalculatorsByCategory,
  searchCalculators,
  type Calculator,
  type CalculatorResult,
} from "@/lib/data/calculators";

/**
 * Kalkulyatorlar ekrani.
 *
 * Ro'yxatdagi har bir kalkulyator ishlaydi — bu tekshirilgan
 * (tests/calculators.test.ts). Ilgari sarlavhada "200+ kalkulyator" yozilgan,
 * aslida 51 ta bo'lgan va ularning 20 tasi bosilganda "hozir mavjud emas"
 * degan. Endi sarlavhadagi son ro'yxatdan avtomatik olinadi.
 */

const OXIRGILAR_KALITI = "jda.kalkulyator.oxirgilar";
const OXIRGILAR_SONI = 6;

// ─────────────────────────────────────────────────────────────
// Kiritilgan qiymatlarni tekshirish
// ─────────────────────────────────────────────────────────────

interface TekshiruvNatijasi {
  xato?: string;
  raqamlar: Record<string, number>;
}

/**
 * Kiritilgan matnlarni songa aylantiradi va kalkulyator talabiga mos
 * kelishini tekshiradi. Xato bo'lsa hisob boshlanmaydi — "NaN" yoki
 * "Infinity" chiqib qolmasin.
 */
function kirishlarniTekshir(
  calc: Calculator,
  qiymatlar: Record<string, string>,
): TekshiruvNatijasi {
  const raqamlar: Record<string, number> = {};

  for (const kirish of calc.inputs) {
    const xom = (qiymatlar[kirish.name] ?? "").trim();

    if (!xom) {
      if (kirish.optional) {
        raqamlar[kirish.name] = NaN; // bo'sh qolgani hisobga aytiladi
        continue;
      }
      return { xato: `«${kirish.name}» to'ldirilmagan`, raqamlar };
    }

    // Telefon klaviaturasida vergul chiqishi mumkin
    const son = Number(xom.replace(",", "."));

    if (!Number.isFinite(son)) {
      return { xato: `«${kirish.name}» ga son kiriting`, raqamlar };
    }
    if (kirish.positive && son <= 0) {
      return {
        xato: `«${kirish.name}» 0 dan katta bo'lishi kerak`,
        raqamlar,
      };
    }

    raqamlar[kirish.name] = son;
  }

  return { raqamlar };
}

// ─────────────────────────────────────────────────────────────
// Birliklar konvertori — alohida ko'rinish
// ─────────────────────────────────────────────────────────────

function Konvertor({ boshlangichGuruh }: { boshlangichGuruh?: string }) {
  const colors = useColors();
  const [guruhId, setGuruhId] = useState(
    boshlangichGuruh ?? birlikGuruhlari[0].id,
  );
  const [qiymat, setQiymat] = useState("1");

  const guruh =
    birlikGuruhlari.find((g) => g.id === guruhId) ?? birlikGuruhlari[0];
  const [dan, setDan] = useState(guruh.birliklar[0].kod);
  const [ga, setGa] = useState(
    guruh.birliklar[1]?.kod ?? guruh.birliklar[0].kod,
  );

  // Guruh almashsa eski birliklar yaroqsiz bo'lib qoladi
  const guruhniAlmashtir = (yangiId: string) => {
    const yangi = birlikGuruhlari.find((g) => g.id === yangiId)!;
    setGuruhId(yangiId);
    setDan(yangi.birliklar[0].kod);
    setGa(yangi.birliklar[1]?.kod ?? yangi.birliklar[0].kod);
  };

  let natija = "—";
  let xato = "";
  const son = Number(qiymat.replace(",", "."));

  if (qiymat.trim() && Number.isFinite(son)) {
    try {
      natija = sonniYoz(konvert(son, dan, ga, guruhId));
    } catch (e) {
      xato =
        e instanceof BirlikXatosi ? e.message : "Konvertatsiya bajarilmadi";
    }
  } else if (qiymat.trim()) {
    xato = "Son kiriting";
  }

  const BirlikTugmasi = ({
    kod,
    tanlangan,
    bosilganda,
  }: {
    kod: string;
    tanlangan: boolean;
    bosilganda: () => void;
  }) => (
    <TouchableOpacity
      onPress={bosilganda}
      className={`px-3 py-2 rounded-xl border ${
        tanlangan ? "bg-primary border-primary" : "bg-surface border-border"
      }`}
    >
      <Text
        className={`text-xs font-semibold ${
          tanlangan ? "text-background" : "text-foreground"
        }`}
      >
        {kod}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="gap-4">
      {/* Guruh tanlash */}
      <View className="gap-2">
        <Text className="text-sm font-semibold text-foreground">
          Nimani o&apos;tkazamiz?
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {birlikGuruhlari.map((g) => (
            <TouchableOpacity
              key={g.id}
              onPress={() => guruhniAlmashtir(g.id)}
              className={`px-3 py-2 rounded-full border ${
                g.id === guruhId
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  g.id === guruhId ? "text-background" : "text-foreground"
                }`}
              >
                {g.emoji} {g.nom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Qiymat */}
      <View className="bg-surface rounded-2xl p-3 border border-border">
        <Text className="text-xs text-muted mb-1">Qiymat</Text>
        <TextInput
          value={qiymat}
          onChangeText={setQiymat}
          keyboardType="decimal-pad"
          placeholder="Masalan: 25"
          placeholderTextColor={colors.muted}
          style={{ color: colors.foreground, fontSize: 18 }}
        />
      </View>

      {/* Qaysi birlikdan */}
      <View className="gap-2">
        <Text className="text-xs text-muted">Qaysi birlikdan</Text>
        <View className="flex-row flex-wrap gap-2">
          {guruh.birliklar.map((b) => (
            <BirlikTugmasi
              key={b.kod}
              kod={b.kod}
              tanlangan={b.kod === dan}
              bosilganda={() => setDan(b.kod)}
            />
          ))}
        </View>
      </View>

      {/* Qaysi birlikka */}
      <View className="gap-2">
        <Text className="text-xs text-muted">Qaysi birlikka</Text>
        <View className="flex-row flex-wrap gap-2">
          {guruh.birliklar.map((b) => (
            <BirlikTugmasi
              key={b.kod}
              kod={b.kod}
              tanlangan={b.kod === ga}
              bosilganda={() => setGa(b.kod)}
            />
          ))}
        </View>
      </View>

      {/* Natija */}
      {xato ? (
        <View className="bg-error/10 border border-error/40 rounded-2xl p-3">
          <Text className="text-sm text-error">{xato}</Text>
        </View>
      ) : (
        <View className="bg-primary/10 rounded-2xl p-4 border border-primary gap-1">
          <Text className="text-xs text-muted">
            {qiymat || 0} {dan} =
          </Text>
          <Text sarlavha className="text-2xl font-bold text-primary">
            {natija} {ga}
          </Text>
          <Text className="text-[11px] text-muted mt-1">
            {guruh.birliklar.find((b) => b.kod === ga)?.nom}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Asosiy ekran
// ─────────────────────────────────────────────────────────────

export default function CalculatorsScreen() {
  const colors = useColors();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Calculator | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [natija, setNatija] = useState<CalculatorResult | null>(null);
  const [xato, setXato] = useState<string | null>(null);
  const [nusxalandi, setNusxalandi] = useState(false);

  const [oxirgilar, setOxirgilar] = useState<string[]>([]);

  // Oxirgi ishlatilganlar telefon xotirasida saqlanadi
  useEffect(() => {
    AsyncStorage.getItem(OXIRGILAR_KALITI)
      .then((xom) => {
        if (!xom) return;
        const oqilgan = JSON.parse(xom);
        if (Array.isArray(oqilgan))
          setOxirgilar(oqilgan.filter((id) => getCalculatorById(id)));
      })
      .catch(() => {
        // Xotira o'qilmasa ham ekran ishlashi kerak — oxirgilar shunchaki bo'sh qoladi
      });
  }, []);

  const oxirgigaQosh = useCallback((id: string) => {
    setOxirgilar((eski) => {
      const yangi = [id, ...eski.filter((x) => x !== id)].slice(
        0,
        OXIRGILAR_SONI,
      );
      AsyncStorage.setItem(OXIRGILAR_KALITI, JSON.stringify(yangi)).catch(
        () => {},
      );
      return yangi;
    });
  }, []);

  const korinadigan = useMemo(() => {
    if (searchQuery.trim()) return searchCalculators(searchQuery);
    if (selectedCategory) return getCalculatorsByCategory(selectedCategory);
    return calculators;
  }, [searchQuery, selectedCategory]);

  const ochish = (calc: Calculator) => {
    setSelected(calc);
    setInputValues({});
    setNatija(null);
    setXato(null);
    setNusxalandi(false);
    setModalVisible(true);
    oxirgigaQosh(calc.id);
  };

  const hisobla = () => {
    if (!selected) return;
    setNusxalandi(false);

    try {
      if (selected.calculateText) {
        // Matnli kalkulyator: majburiy kataklar bo'shligini o'zi tekshiradi
        const bosh = selected.inputs.find(
          (k) => !k.optional && !(inputValues[k.name] ?? "").trim(),
        );
        if (bosh) {
          setXato(`«${bosh.name}» to'ldirilmagan`);
          setNatija(null);
          return;
        }
        setNatija(selected.calculateText(inputValues));
        setXato(null);
        return;
      }

      if (!selected.calculate) return;

      const { xato: tekshiruvXatosi, raqamlar } = kirishlarniTekshir(
        selected,
        inputValues,
      );
      if (tekshiruvXatosi) {
        setXato(tekshiruvXatosi);
        setNatija(null);
        return;
      }

      setNatija(selected.calculate(raqamlar));
      setXato(null);
    } catch (e) {
      setNatija(null);
      setXato(e instanceof Error ? e.message : "Hisoblab bo'lmadi");
    }
  };

  const nusxala = async () => {
    if (!natija) return;
    const matn = [
      `${selected?.name}`,
      `${selected?.formula}`,
      `${natija.value} ${natija.unit}`.trim(),
      ...(natija.steps ?? []),
    ].join("\n");

    await Clipboard.setStringAsync(matn);
    setNusxalandi(true);
    setTimeout(() => setNusxalandi(false), 2000);
  };

  // ─── Ro'yxat elementi ───
  const KartaChizish = ({ item }: { item: Calculator }) => (
    <TouchableOpacity
      onPress={() => ochish(item)}
      className="bg-surface rounded-2xl p-4 mb-3 border border-border active:opacity-70"
    >
      <View className="gap-2">
        <View className="flex-row items-center gap-3">
          <Text className="text-3xl">{item.emoji}</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {item.name}
            </Text>
            <Text className="text-xs text-muted">{item.category}</Text>
          </View>
        </View>
        <Text className="text-sm text-muted">{item.description}</Text>
        <Text className="text-xs text-primary font-mono">{item.formula}</Text>
      </View>
    </TouchableOpacity>
  );

  const Sarlavha = (
    <View className="gap-4 pb-2">
      <View className="gap-1">
        <Text sarlavha className="text-3xl font-bold text-foreground">
          🧮 Kalkulyatorlar
        </Text>
        <Text className="text-sm text-muted">
          {calculatorCount} ta kalkulyator — har biri ishlaydi
        </Text>
      </View>

      {/* Qidiruv */}
      <View className="bg-surface rounded-2xl p-3 border border-border">
        <TextInput
          placeholder="Kalkulyator yoki formula qidiring..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          style={{ color: colors.foreground }}
        />
      </View>

      {/* Oxirgi ishlatilganlar */}
      {oxirgilar.length > 0 && !searchQuery.trim() ? (
        <View className="gap-2">
          <Text className="text-sm font-semibold text-foreground">
            Oxirgi ishlatilganlar
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {oxirgilar.map((id) => {
                const calc = getCalculatorById(id);
                if (!calc) return null;
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => ochish(calc)}
                    className="bg-surface border border-border rounded-xl px-3 py-2 flex-row items-center gap-2 active:opacity-70"
                  >
                    <Text className="text-base">{calc.emoji}</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      {calc.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      ) : null}

      {/* Kategoriyalar */}
      <View className="gap-2">
        <Text className="text-sm font-semibold text-foreground">
          Kategoriyalar
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === null
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedCategory === null
                    ? "text-background"
                    : "text-foreground"
                }`}
              >
                Hammasi
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  setSelectedCategory(
                    category === selectedCategory ? null : category,
                  );
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedCategory === category
                      ? "text-background"
                      : "text-foreground"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <Text className="text-sm font-semibold text-foreground">
        {korinadigan.length} ta topildi
      </Text>
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <FlatList
        data={korinadigan}
        keyExtractor={(item) => item.id}
        renderItem={KartaChizish}
        ListHeaderComponent={Sarlavha}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View className="items-center gap-2 py-12">
            <Text className="text-4xl">🔍</Text>
            <Text className="text-sm text-muted text-center">
              «{searchQuery}» bo&apos;yicha kalkulyator topilmadi
            </Text>
          </View>
        }
      />

      {/* ─── Kalkulyator oynasi ─── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-background/90">
          <ScreenContainer className="p-4 justify-between">
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {selected && (
                <View className="gap-4">
                  {/* Sarlavha */}
                  <View className="flex-row items-center gap-3">
                    <Text className="text-5xl">{selected.emoji}</Text>
                    <View className="flex-1">
                      <Text
                        sarlavha
                        className="text-2xl font-bold text-foreground"
                      >
                        {selected.name}
                      </Text>
                      <Text className="text-xs text-muted">
                        {selected.category}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-sm text-foreground">
                    {selected.description}
                  </Text>

                  {/* Formula */}
                  <View className="bg-surface rounded-2xl p-4 border border-border">
                    <Text className="text-xs text-muted mb-1">Formula</Text>
                    <Text className="text-base font-mono text-primary">
                      {selected.formula}
                    </Text>
                  </View>

                  {/* Cheklov yoki eslatma */}
                  {selected.note ? (
                    <View className="bg-warning/10 border border-warning/40 rounded-2xl p-3">
                      <Text className="text-xs text-warning leading-5">
                        ℹ️ {selected.note}
                      </Text>
                    </View>
                  ) : null}

                  {/* Konvertor alohida ko'rinishda */}
                  {selected.kind === "konvertor" ? (
                    <Konvertor boshlangichGuruh={selected.converterGroup} />
                  ) : (
                    <>
                      {/* Kirishlar */}
                      <View className="gap-2">
                        {selected.inputs.map((input) => (
                          <View
                            key={input.name}
                            className="bg-surface rounded-2xl p-3 border border-border"
                          >
                            <Text className="text-xs text-muted mb-1">
                              {input.name}
                              {input.unit ? `, ${input.unit}` : ""}
                              {input.optional ? " (ixtiyoriy)" : ""}
                            </Text>
                            <TextInput
                              placeholder={input.placeholder}
                              placeholderTextColor={colors.muted}
                              keyboardType={
                                input.text ? "default" : "decimal-pad"
                              }
                              autoCapitalize={input.text ? "none" : "sentences"}
                              autoCorrect={false}
                              style={{ color: colors.foreground, fontSize: 16 }}
                              value={inputValues[input.name] ?? ""}
                              onChangeText={(matn) =>
                                setInputValues((eski) => ({
                                  ...eski,
                                  [input.name]: matn,
                                }))
                              }
                            />
                            {input.note ? (
                              <Text className="text-[11px] text-muted mt-1">
                                {input.note}
                              </Text>
                            ) : null}
                          </View>
                        ))}
                      </View>

                      {/* Xato */}
                      {xato ? (
                        <View className="bg-error/10 border border-error/40 rounded-2xl p-3">
                          <Text className="text-sm text-error leading-5">
                            {xato}
                          </Text>
                        </View>
                      ) : null}

                      {/* Natija */}
                      {natija ? (
                        <View className="bg-primary/10 rounded-2xl p-4 border border-primary gap-2">
                          <View className="flex-row items-start justify-between gap-3">
                            <View className="flex-1">
                              <Text className="text-xs text-muted">
                                {selected.output}
                              </Text>
                              <Text
                                sarlavha
                                className="text-2xl font-bold text-primary"
                              >
                                {natija.value} {natija.unit}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={nusxala}
                              className="bg-surface border border-border rounded-xl px-3 py-2 active:opacity-70"
                            >
                              <Text className="text-xs font-semibold text-foreground">
                                {nusxalandi ? "✓ Nusxalandi" : "Nusxalash"}
                              </Text>
                            </TouchableOpacity>
                          </View>

                          {natija.steps?.length ? (
                            <View className="gap-1 pt-2 border-t border-border">
                              {natija.steps.map((qadam, i) => (
                                <Text
                                  key={i}
                                  className="text-[11px] text-muted leading-5"
                                >
                                  • {qadam}
                                </Text>
                              ))}
                            </View>
                          ) : null}
                        </View>
                      ) : null}

                      {/* Hisoblash */}
                      <JdaTugma onPress={hisobla} belgi="=">
                        Hisoblash
                      </JdaTugma>
                    </>
                  )}
                </View>
              )}
            </ScrollView>

            <JdaTugma
              korinish="ikkilamchi"
              onPress={() => setModalVisible(false)}
              className="mt-3"
            >
              Yopish
            </JdaTugma>
          </ScreenContainer>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
