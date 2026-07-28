import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { JdaTugma } from "@/components/jda-tugma";
import { Text } from "@/components/matn";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { fetchForum, type ForumPost } from "@/lib/jda/api";

/**
 * Chat — uch bo'lim.
 *
 * Avval bu ekranda beshta qo'lda yozilgan xabar turardi va u hech qayerga
 * ulanmagandi: yozilgan xabar faqat xotirada qolib, ilova yopilishi bilan
 * yo'qolardi.
 *
 * Endi "Dolzarb mavzular" saytdagi haqiqiy forumga ulangan
 * (/api/mobile/forum). Tartib va sahifalash server tomonda, veb bilan
 * bir xil mantiq — vaqt bilan susayadigan dolzarblik bali.
 *
 * Shaxsiy va ommaviy chat hali yo'q. Ularni ishlayotgandek ko'rsatish
 * o'rniga holati ochiq yozilgan — odam nimani kutayotganini bilsin.
 */

type Bolim = "dolzarb" | "shaxsiy" | "ommaviy";

const BOLIMLAR: {
  kalit: Bolim;
  nom: string;
  belgi: string;
  tayyor: boolean;
}[] = [
  { kalit: "dolzarb", nom: "Dolzarb mavzular", belgi: "🔥", tayyor: true },
  { kalit: "shaxsiy", nom: "Shaxsiy", belgi: "✉️", tayyor: false },
  { kalit: "ommaviy", nom: "Ommaviy", belgi: "🌐", tayyor: false },
];

export default function ChatScreen() {
  const colors = useColors();
  const [bolim, setBolim] = useState<Bolim>("dolzarb");

  return (
    <ScreenContainer className="p-4">
      <View className="flex-1 gap-4">
        <View className="gap-1">
          <Text sarlavha className="text-3xl font-bold text-foreground">
            💬 Muhokama
          </Text>
          <Text className="text-sm text-muted">
            Savol bering, tajriba ulashing
          </Text>
        </View>

        {/* Bo'lim tanlash */}
        <View className="flex-row gap-2">
          {BOLIMLAR.map((b) => {
            const faol = bolim === b.kalit;
            return (
              <TouchableOpacity
                key={b.kalit}
                onPress={() => setBolim(b.kalit)}
                accessibilityRole="tab"
                accessibilityState={{ selected: faol }}
                className={`flex-1 px-2 py-2.5 rounded-xl border items-center ${
                  faol
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text className="text-base">{b.belgi}</Text>
                <Text
                  numberOfLines={1}
                  className={`text-[11px] font-semibold mt-0.5 ${
                    faol ? "text-background" : "text-muted"
                  }`}
                >
                  {b.nom}
                </Text>
                {!b.tayyor ? (
                  <Text
                    className={`text-[9px] mt-0.5 ${
                      faol ? "text-background/70" : "text-warning"
                    }`}
                  >
                    tez kunda
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {bolim === "dolzarb" ? (
          <DolzarbLenta rangPrimary={colors.primary} />
        ) : (
          <TezKunda bolim={bolim} />
        )}
      </View>
    </ScreenContainer>
  );
}

/** Saytdagi forum lentasi. */
function DolzarbLenta({ rangPrimary }: { rangPrimary: string }) {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["jda", "forum", "dolzarb"],
    queryFn: () => fetchForum({ sort: "dolzarb", limit: 20 }),
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={rangPrimary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="bg-error/10 border border-error/40 rounded-2xl p-4 gap-3">
        <Text className="text-sm text-error">
          {error instanceof Error
            ? error.message
            : "Mavzularni yuklab bo'lmadi"}
        </Text>
        <JdaTugma onPress={() => refetch()} kichik>
          Qayta urinish
        </JdaTugma>
      </View>
    );
  }

  const mavzular = data?.posts ?? [];

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
    >
      {mavzular.length === 0 ? (
        <View className="bg-surface border border-border rounded-2xl p-8 items-center gap-2">
          <Text className="text-4xl">💭</Text>
          <Text className="text-sm text-muted text-center">
            Hali mavzu ochilmagan
          </Text>
          <Text className="text-xs text-muted text-center">
            Birinchi mavzuni jdakimyo.uz saytida boshlashingiz mumkin
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {mavzular.map((m) => (
            <MavzuKartasi key={m.id} mavzu={m} />
          ))}

          {data?.hasMore ? (
            <Text className="text-xs text-muted text-center py-2">
              Yana {data.total - mavzular.length} ta mavzu — saytda ko&apos;ring
            </Text>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

function MavzuKartasi({ mavzu }: { mavzu: ForumPost }) {
  const muallif = mavzu.author.fullName || mavzu.author.username;
  const kutmoqda = mavzu.status === "pending";

  return (
    <View
      className={`bg-surface rounded-2xl p-4 border ${
        kutmoqda ? "border-warning/50" : "border-border"
      }`}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
          <Text className="text-xs font-bold text-background">
            {muallif.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <Text
            className="text-sm font-semibold text-foreground"
            numberOfLines={1}
          >
            {muallif}
          </Text>
          <Text className="text-[11px] text-muted">
            {qachon(mavzu.createdAt)}
          </Text>
        </View>
        {mavzu.isPinned ? <Text className="text-xs">📌</Text> : null}
        {kutmoqda ? (
          <Text className="text-[10px] text-warning">tekshiruvda</Text>
        ) : null}
      </View>

      {mavzu.title ? (
        <Text className="text-base font-bold text-foreground mb-1">
          {mavzu.title}
        </Text>
      ) : null}

      <Text
        className="text-sm text-foreground leading-relaxed"
        numberOfLines={4}
      >
        {mavzu.content}
      </Text>

      <View className="flex-row items-center gap-4 mt-3 pt-3 border-t border-border">
        <Text className="text-xs text-muted">
          {mavzu.likedByMe ? "❤️" : "🤍"} {mavzu.likes}
        </Text>
        <Text className="text-xs text-muted">💬 {mavzu.replyCount} javob</Text>
      </View>
    </View>
  );
}

/** Hali tayyor bo'lmagan bo'limlar. */
function TezKunda({ bolim }: { bolim: Bolim }) {
  const matn =
    bolim === "shaxsiy"
      ? {
          belgi: "✉️",
          sarlavha: "Shaxsiy yozishmalar",
          izoh: "Ustoz va do'stlaringiz bilan yakkama-yakka yozishish. Hozircha tayyor emas.",
        }
      : {
          belgi: "🌐",
          sarlavha: "Ommaviy chat",
          izoh: "Barcha foydalanuvchilar uchun umumiy jonli suhbat. Hozircha tayyor emas.",
        };

  return (
    <View className="flex-1 items-center justify-center gap-3 px-6">
      <Text className="text-6xl">{matn.belgi}</Text>
      <Text sarlavha className="text-xl font-bold text-foreground">
        {matn.sarlavha}
      </Text>
      <Text className="text-sm text-muted text-center leading-relaxed">
        {matn.izoh}
      </Text>

      <View className="px-4 py-1.5 rounded-full bg-warning/15 border border-warning/40 mt-1">
        <Text className="text-xs font-semibold text-warning">Tez kunda</Text>
      </View>

      <Text className="text-xs text-muted text-center mt-2">
        Shu paytgacha «Dolzarb mavzular» bo&apos;limida savol berishingiz mumkin
      </Text>
    </View>
  );
}

/** "3 soat oldin" ko'rinishida — saytdagi lib/sana.js qachon() bilan bir xil. */
function qachon(sana: string): string {
  const farq = Math.floor((Date.now() - new Date(sana).getTime()) / 1000);
  if (farq < 60) return "hozirgina";
  if (farq < 3600) return `${Math.floor(farq / 60)} daqiqa oldin`;
  if (farq < 86400) return `${Math.floor(farq / 3600)} soat oldin`;
  if (farq < 604800) return `${Math.floor(farq / 86400)} kun oldin`;

  const d = new Date(sana);
  const oylar = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
  ];
  return `${d.getDate()} ${oylar[d.getMonth()]} ${d.getFullYear()}`;
}
