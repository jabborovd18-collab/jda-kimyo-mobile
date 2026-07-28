import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/matn";

import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { fetchReaction, type ReactionDetail } from "@/lib/jda/api";

/** Sarlavhali bo'lim — ichida ma'lumot bo'lmasa umuman chizilmaydi */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
      <Text className="text-sm font-semibold text-foreground">
        {icon} {title}
      </Text>
      {children}
    </View>
  );
}

/** Nom — qiymat juftligi */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-3">
      <Text className="text-xs text-muted flex-1">{label}</Text>
      <Text className="text-xs text-foreground font-medium flex-[2] text-right">
        {value}
      </Text>
    </View>
  );
}

function hasItems(value: unknown[] | null | undefined) {
  return Array.isArray(value) && value.length > 0;
}

/** ISO sanadan "28.07.2026" ko'rinishi */
function sanaMatni(iso: string) {
  const sana = new Date(iso);
  if (Number.isNaN(sana.getTime())) return "";
  const ikki = (son: number) => String(son).padStart(2, "0");
  return `${ikki(sana.getDate())}.${ikki(sana.getMonth() + 1)}.${sana.getFullYear()}`;
}

export default function ReactionDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jda", "reaction", id],
    queryFn: () => fetchReaction(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-sm text-error text-center">
            {(error as Error)?.message || "Reaksiya topilmadi"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-surface border border-border rounded-xl px-5 py-3"
          >
            <Text className="text-sm text-foreground">Orqaga</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const r: ReactionDetail = data.reaction;

  const hasConditions =
    r.temperature || r.pressure || r.catalyst || r.environment;
  const hasSolvent = r.bestSolvent || r.solventEffect || hasItems(r.solvents);
  const hasMechanism = r.mechanism || hasItems(r.intermediates);
  const hasPractice =
    hasItems(r.techniques) ||
    hasItems(r.equipment) ||
    r.observations ||
    r.yieldInfo;

  // Boy ma'lumotning qanchasi to'ldirilgan
  const filledSections = [
    hasConditions,
    hasMechanism,
    hasSolvent,
    r.scale,
    hasItems(r.rateFactors),
    hasPractice,
  ].filter(Boolean).length;

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-8">
          {/* Orqaga */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="self-start p-1"
          >
            <Text className="text-2xl text-foreground">←</Text>
          </TouchableOpacity>

          {/* Tenglama */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
            <Text className="text-base font-semibold text-foreground leading-6">
              {r.equation}
            </Text>
            {r.name ? (
              <Text className="text-sm text-muted">{r.name}</Text>
            ) : null}
            <View className="flex-row flex-wrap gap-2 mt-1">
              <View className="bg-primary/15 rounded px-2 py-0.5">
                <Text className="text-[10px] text-primary">{r.category}</Text>
              </View>
              {r.reactionType ? (
                <View className="bg-surface border border-border rounded px-2 py-0.5">
                  <Text className="text-[10px] text-muted">
                    {r.reactionType}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Tasdiq holati — ikkalasi ham ochiq aytiladi */}
          {r.isVerified ? (
            <View className="bg-success/10 border border-success/40 rounded-2xl p-3">
              <Text className="text-xs text-success">
                ✓ Tasdiqlangan
                {r.verifiedByName ? ` — ${r.verifiedByName}` : ""}
                {r.verifiedAt ? `, ${sanaMatni(r.verifiedAt)}` : ""}
              </Text>
            </View>
          ) : (
            <View className="bg-warning/10 border border-warning/40 rounded-2xl p-3">
              <Text className="text-xs text-warning">
                ⚠️ Bu yozuv kimyogar tomonidan hali tasdiqlanmagan
              </Text>
            </View>
          )}

          {r.description ? (
            <Text className="text-sm text-foreground leading-5">
              {r.description}
            </Text>
          ) : null}

          {/* 1. SHAROIT */}
          {hasConditions ? (
            <Section title="Borish sharoiti" icon="🌡">
              {r.temperature ? (
                <Row label="Harorat" value={r.temperature} />
              ) : null}
              {r.pressure ? <Row label="Bosim" value={r.pressure} /> : null}
              {r.catalyst ? (
                <Row label="Katalizator" value={r.catalyst} />
              ) : null}
              {r.environment ? (
                <Row label="Muhit" value={r.environment} />
              ) : null}
            </Section>
          ) : null}

          {/* 2. MEXANIZM VA ORALIQ MODDALAR */}
          {hasMechanism ? (
            <Section title="Mexanizm va oraliq moddalar" icon="⚛️">
              {r.mechanism ? (
                <Text className="text-xs text-foreground leading-5">
                  {r.mechanism}
                </Text>
              ) : null}
              {hasItems(r.intermediates)
                ? r.intermediates!.map((item, index) => (
                    <View
                      key={index}
                      className="bg-primary/5 rounded p-2 border border-border"
                    >
                      <Text className="text-xs font-semibold text-foreground">
                        {item.formula || item.name}
                      </Text>
                      {item.note ? (
                        <Text className="text-[11px] text-muted mt-0.5">
                          {item.note}
                        </Text>
                      ) : null}
                    </View>
                  ))
                : null}
            </Section>
          ) : null}

          {/* 3. ERITUVCHI */}
          {hasSolvent ? (
            <Section title="Erituvchi ta'siri" icon="🧪">
              {r.bestSolvent ? (
                <Row label="Eng samarali" value={r.bestSolvent} />
              ) : null}
              {hasItems(r.solvents)
                ? r.solvents!.map((item, index) => (
                    <View
                      key={index}
                      className="flex-row justify-between gap-3"
                    >
                      <Text className="text-xs text-foreground flex-1">
                        {item.name}
                      </Text>
                      <Text className="text-xs text-primary">
                        {item.efficiency}
                      </Text>
                    </View>
                  ))
                : null}
              {r.solventEffect ? (
                <Text className="text-xs text-muted leading-5">
                  {r.solventEffect}
                </Text>
              ) : null}
            </Section>
          ) : null}

          {/* 4. QO'LLANILISH KO'LAMI */}
          {r.scale ? (
            <Section title="Qo'llanilishi" icon="🏭">
              <Row label="Ko'lam" value={r.scale} />
              {r.scaleNote ? (
                <Text className="text-xs text-muted leading-5">
                  {r.scaleNote}
                </Text>
              ) : null}
            </Section>
          ) : null}

          {/* 5. TEZLIKNI OSHIRISH OMILLARI */}
          {hasItems(r.rateFactors) ? (
            <Section title="Tezlikni oshirish omillari" icon="⚡">
              {r.rateFactors!.map((item, index) => (
                <View key={index} className="gap-0.5">
                  <Text className="text-xs font-semibold text-foreground">
                    {item.factor}
                  </Text>
                  {item.effect ? (
                    <Text className="text-[11px] text-muted">
                      {item.effect}
                    </Text>
                  ) : null}
                </View>
              ))}
            </Section>
          ) : null}

          {/* 6. AMALIY TOMONI */}
          {hasPractice ? (
            <Section title="Amalda bajarish" icon="🔬">
              {hasItems(r.techniques) ? (
                <View className="gap-1">
                  <Text className="text-xs text-muted">Texnikalar</Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {r.techniques!.map((item, index) => (
                      <View
                        key={index}
                        className="bg-surface border border-border rounded px-2 py-0.5"
                      >
                        <Text className="text-[10px] text-foreground">
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {hasItems(r.equipment) ? (
                <View className="gap-1">
                  <Text className="text-xs text-muted">Uskunalar</Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {r.equipment!.map((item, index) => (
                      <View
                        key={index}
                        className="bg-surface border border-border rounded px-2 py-0.5"
                      >
                        <Text className="text-[10px] text-foreground">
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {r.observations ? (
                <View className="gap-0.5">
                  <Text className="text-xs text-muted">
                    Kuzatiladigan belgilar
                  </Text>
                  <Text className="text-xs text-foreground leading-5">
                    {r.observations}
                  </Text>
                </View>
              ) : null}

              {r.yieldInfo ? <Row label="Unum" value={r.yieldInfo} /> : null}
            </Section>
          ) : null}

          {/* 7. XAVFSIZLIK */}
          {hasItems(r.hazards) ? (
            <View className="bg-error/10 border border-error/40 rounded-2xl p-4 gap-2">
              <Text className="text-sm font-semibold text-error">
                ⚠️ Xavfsizlik
              </Text>
              {r.hazards!.map((item, index) => (
                <Text key={index} className="text-xs text-error">
                  • {item}
                </Text>
              ))}
            </View>
          ) : null}

          {/* Ma'lumot to'liq emasligi haqida ochiq xabar */}
          {filledSections < 3 ? (
            <View className="bg-surface/50 border border-border border-dashed rounded-2xl p-4 gap-1">
              <Text className="text-xs font-semibold text-muted">
                📝 Ma&apos;lumot to&apos;ldirilmoqda
              </Text>
              <Text className="text-[11px] text-muted leading-5">
                Bu reaksiya uchun oraliq moddalar, erituvchi samaradorligi,
                tezlik omillari va mexanizm hali kiritilmagan.
              </Text>
            </View>
          ) : null}

          {/* Manba */}
          {r.source ? (
            <Text className="text-[10px] text-muted text-center">
              Manba: {r.source}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
