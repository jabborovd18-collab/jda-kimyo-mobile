import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { JdaTugma } from "@/components/jda-tugma";
import { Text } from "@/components/matn";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { fetchHome } from "@/lib/jda/api";
import { useJdaAuth } from "@/lib/jda/auth";

/**
 * Profil ekrani.
 *
 * Ilovada profil umuman yo'q edi. Ma'lumot saytning /api/mobile/home
 * endpointidan olinadi — ya'ni saytdagi profil bilan bir xil manba:
 * daraja, tajriba, seriya, quiz statistikasi va haftalik reyting.
 *
 * Tab emas, alohida ekran: tab paneli aynan beshta uchun qurilgan
 * (components/custom-tab-bar.tsx da markaz indeksi qattiq yozilgan), oltinchi
 * qo'shilsa markaz noto'g'ri joyga tushadi. Bosh sahifadagi avatardan ochiladi.
 *
 * Ustoz va admin panellari ataylab yo'q — ular saytda boshqariladi.
 */

/** Saytdagi bilan bir xil qoida: keyingi daraja uchun daraja × 500 XP. */
const keyingiDarajaXP = (daraja: number) => Math.max(1, daraja) * 500;

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, signOut } = useJdaAuth();

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["jda", "home"],
    queryFn: fetchHome,
  });

  const u = data?.user ?? user;
  const ism = u?.fullName || u?.username || "Talaba";
  const daraja = u?.level_points ?? 1;
  const tajriba = u?.experience ?? 0;
  const kerak = keyingiDarajaXP(daraja);
  const foiz = Math.min(100, Math.round((tajriba / kerak) * 100));

  return (
    <ScreenContainer className="p-4">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
          />
        }
      >
        <View className="gap-5">
          {/* Sarlavha qatori */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityLabel="Orqaga"
              className="px-3 py-2 rounded-xl bg-surface border border-border"
            >
              <Text className="text-base text-muted">←</Text>
            </TouchableOpacity>
            <Text
              sarlavha
              className="text-2xl font-bold text-foreground flex-1"
            >
              Profil
            </Text>
          </View>

          {/* Shaxs kartasi */}
          <View className="bg-surface border border-border rounded-2xl p-5 items-center gap-3">
            <View className="w-24 h-24 rounded-full overflow-hidden bg-primary items-center justify-center">
              {u?.avatar ? (
                <Image source={{ uri: u.avatar }} className="w-full h-full" />
              ) : (
                <Text sarlavha className="text-4xl font-bold text-background">
                  {ism.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>

            <View className="items-center gap-1">
              <Text sarlavha className="text-xl font-bold text-foreground">
                {ism}
              </Text>
              {u?.username ? (
                <Text className="text-sm text-muted">@{u.username}</Text>
              ) : null}
              {u?.university ? (
                <Text className="text-xs text-muted mt-1">
                  🏛️ {u.university}
                </Text>
              ) : null}
            </View>

            {u?.role ? (
              <View className="px-3 py-1 rounded-full bg-primary/15 border border-primary/40">
                <Text className="text-xs font-semibold text-primary">
                  {u.role}
                </Text>
              </View>
            ) : null}
          </View>

          {isLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : isError ? (
            <View className="bg-error/10 border border-error/40 rounded-2xl p-4 gap-3">
              <Text className="text-sm text-error">
                {error instanceof Error ? error.message : "Ma'lumot yuklanmadi"}
              </Text>
              <JdaTugma onPress={() => refetch()} kichik>
                Qayta urinish
              </JdaTugma>
            </View>
          ) : (
            <>
              {/* Daraja va tajriba */}
              <View className="bg-surface border border-border rounded-2xl p-5 gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-bold text-foreground">
                    ⭐ Daraja {daraja}
                  </Text>
                  <Text className="text-sm text-muted">
                    {tajriba} / {kerak} XP
                  </Text>
                </View>

                <View className="h-3 rounded-full bg-background overflow-hidden">
                  <View
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${foiz}%` }}
                  />
                </View>

                <Text className="text-xs text-muted">
                  Keyingi darajagacha {Math.max(0, kerak - tajriba)} XP qoldi
                </Text>
              </View>

              {/* Seriya */}
              <View className="flex-row gap-3">
                <Katak
                  belgi="🔥"
                  qiymat={u?.currentStreak ?? 0}
                  nom="Hozirgi seriya"
                  birlik="kun"
                />
                <Katak
                  belgi="🏆"
                  qiymat={u?.longestStreak ?? 0}
                  nom="Eng uzun"
                  birlik="kun"
                />
              </View>

              {/* Quiz statistikasi */}
              <View className="bg-surface border border-border rounded-2xl p-5 gap-4">
                <Text className="text-base font-bold text-foreground">
                  📝 Quiz natijalari
                </Text>

                <View className="flex-row justify-between">
                  <Raqam qiymat={data?.quizStats.total ?? 0} nom="Yechilgan" />
                  <Raqam
                    qiymat={`${data?.quizStats.average ?? 0}%`}
                    nom="O'rtacha"
                  />
                  <Raqam
                    qiymat={`${data?.quizStats.best ?? 0}%`}
                    nom="Eng yaxshi"
                  />
                </View>

                {data?.quizStats.bestQuizName ? (
                  <Text className="text-xs text-muted">
                    Eng yaxshi natija: {data.quizStats.bestQuizName}
                  </Text>
                ) : null}
              </View>

              {/* Haftalik reyting */}
              <View className="bg-surface border border-border rounded-2xl p-5 gap-2">
                <Text className="text-base font-bold text-foreground">
                  🥇 Haftalik reyting
                </Text>
                <View className="flex-row items-baseline gap-2">
                  <Text sarlavha className="text-3xl font-bold text-primary">
                    {data?.leaderboard.myRank
                      ? `#${data.leaderboard.myRank}`
                      : "—"}
                  </Text>
                  <Text className="text-sm text-muted">
                    {data?.leaderboard.myWeeklyStars ?? 0} yulduz
                  </Text>
                </View>
                {!data?.leaderboard.myRank ? (
                  <Text className="text-xs text-muted">
                    Bu hafta hali natija yo&apos;q — quiz yechsangiz reytingga
                    tushasiz
                  </Text>
                ) : null}
              </View>

              {/* So&apos;nggi natijalar */}
              {data?.recentQuizzes?.length ? (
                <View className="bg-surface border border-border rounded-2xl p-5 gap-3">
                  <Text className="text-base font-bold text-foreground">
                    🕐 So&apos;nggi natijalar
                  </Text>
                  {data.recentQuizzes.slice(0, 5).map((q) => (
                    <View
                      key={q.id}
                      className="flex-row items-center justify-between gap-3"
                    >
                      <Text
                        className="text-sm text-foreground flex-1"
                        numberOfLines={1}
                      >
                        {q.quizName}
                      </Text>
                      <Text
                        className={`text-sm font-bold ${
                          q.percentage >= 80
                            ? "text-success"
                            : q.percentage >= 50
                              ? "text-warning"
                              : "text-error"
                        }`}
                      >
                        {q.percentage}%
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          )}

          {/* Ustoz va admin panellari ilovada yo'q — saytda boshqariladi */}
          <View className="bg-surface border border-border rounded-2xl p-4">
            <Text className="text-xs text-muted leading-relaxed">
              Ustoz va admin sozlamalari jdakimyo.uz saytida boshqariladi.
            </Text>
          </View>

          <TouchableOpacity
            onPress={signOut}
            className="border border-error/50 rounded-2xl py-3.5 items-center"
            accessibilityLabel="Hisobdan chiqish"
          >
            <Text className="text-sm font-semibold text-error">🚪 Chiqish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Katak({
  belgi,
  qiymat,
  nom,
  birlik,
}: {
  belgi: string;
  qiymat: number;
  nom: string;
  birlik?: string;
}) {
  return (
    <View className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center gap-1">
      <Text className="text-2xl">{belgi}</Text>
      <View className="flex-row items-baseline gap-1">
        <Text sarlavha className="text-2xl font-bold text-foreground">
          {qiymat}
        </Text>
        {birlik ? <Text className="text-xs text-muted">{birlik}</Text> : null}
      </View>
      <Text className="text-xs text-muted text-center">{nom}</Text>
    </View>
  );
}

function Raqam({ qiymat, nom }: { qiymat: number | string; nom: string }) {
  return (
    <View className="items-center gap-1">
      <Text sarlavha className="text-2xl font-bold text-foreground">
        {qiymat}
      </Text>
      <Text className="text-xs text-muted">{nom}</Text>
    </View>
  );
}
