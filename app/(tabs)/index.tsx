import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { fetchHome } from "@/lib/jda/api";
import { useJdaAuth } from "@/lib/jda/auth";
import { useColors } from "@/hooks/use-colors";

/**
 * Home Screen — Bosh Sahifa
 *
 * Ma'lumot JDA Kimyo saytining API'sidan olinadi (/api/mobile/home):
 * quiz statistikasi, global reyting va so'nggi natijalar — hammasi real.
 */
export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user } = useJdaAuth();

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["jda", "home"],
    queryFn: fetchHome,
  });

  const displayName = data?.user.fullName || user?.fullName || user?.username || "Talaba";

  return (
    <ScreenContainer className="p-4">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
      >
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-start justify-between gap-3">
            <View className="gap-1 flex-1">
              <Text className="text-3xl font-bold text-foreground">
                Salom, {displayName}! 👋
              </Text>
              <Text className="text-sm text-muted">
                Oliy Kimyoni o'rganishga xush kelibsiz
              </Text>
            </View>
            {/* Avatar profilga olib boradi. Avval bu yerda chiqish tugmasi
                turardi — u endi profil ekranining ichida, o'z o'rnida. */}
            <TouchableOpacity
              onPress={() => router.push("/profile" as any)}
              className="w-12 h-12 rounded-full bg-primary items-center justify-center overflow-hidden border border-border"
              accessibilityLabel="Profil"
            >
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} className="w-full h-full" />
              ) : (
                <Text className="text-lg font-bold text-background">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Yuklanmoqda / xato */}
          {isLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : isError || !data ? (
            <View className="bg-error/10 border border-error/40 rounded-lg p-4 gap-3">
              <Text className="text-sm text-error">
                {(error as Error)?.message || "Ma'lumotlarni yuklab bo'lmadi"}
              </Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="bg-primary rounded-lg py-2 items-center"
              >
                <Text className="text-sm font-semibold text-background">Qayta urinish</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Daraja, seriya, ball */}
              <View className="flex-row gap-2">
                <View className="flex-1 bg-surface rounded-lg p-3 border border-border">
                  <Text className="text-xs text-muted mb-1">Daraja</Text>
                  <Text className="text-2xl font-bold text-primary">
                    {data.user.level_points}
                  </Text>
                </View>
                <View className="flex-1 bg-surface rounded-lg p-3 border border-border">
                  <Text className="text-xs text-muted mb-1">Seriya</Text>
                  <Text className="text-2xl font-bold text-primary">
                    {data.user.currentStreak} 🔥
                  </Text>
                </View>
                <View className="flex-1 bg-surface rounded-lg p-3 border border-border">
                  <Text className="text-xs text-muted mb-1">Ball</Text>
                  <Text className="text-2xl font-bold text-primary">
                    {data.user.totalPoints}
                  </Text>
                </View>
              </View>

              {/* ASOSIY HARAKAT — ilovaning bosh maqsadi */}
              <TouchableOpacity
                onPress={() => router.push("/quiz" as any)}
                className="bg-primary rounded-lg p-5 active:opacity-90"
              >
                <Text className="text-3xl mb-2">📝</Text>
                <Text className="text-xl font-bold text-background mb-1">
                  Quiz yechish
                </Text>
                <Text className="text-sm text-background/80">
                  445 ta savol — istalgan joyda takrorlang
                </Text>
              </TouchableOpacity>

              {/* 1. QUIZ STATISTIKA */}
              <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                <Text className="text-lg font-semibold text-foreground">
                  📊 Quiz Statistika
                </Text>
                <View className="flex-row gap-2">
                  <View className="flex-1 bg-primary/10 rounded-lg p-3">
                    <Text className="text-xs text-muted mb-1">O'tkazilgan</Text>
                    <Text className="text-2xl font-bold text-primary">
                      {data.quizStats.total}
                    </Text>
                  </View>
                  <View className="flex-1 bg-primary/10 rounded-lg p-3">
                    <Text className="text-xs text-muted mb-1">O'rtacha</Text>
                    <Text className="text-2xl font-bold text-primary">
                      {data.quizStats.average}%
                    </Text>
                  </View>
                  <View className="flex-1 bg-primary/10 rounded-lg p-3">
                    <Text className="text-xs text-muted mb-1">Eng yaxshi</Text>
                    <Text className="text-2xl font-bold text-primary">
                      {data.quizStats.best}%
                    </Text>
                  </View>
                </View>
                {data.quizStats.total === 0 ? (
                  <Text className="text-xs text-muted">
                    Hali quiz yechmagansiz — saytda birinchi testni topshiring
                  </Text>
                ) : null}
              </View>

              {/* 2. REYTING */}
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-foreground">
                    🏆 Haftalik reyting
                  </Text>
                  {data.leaderboard.myRank ? (
                    <Text className="text-sm text-primary">
                      Sizning o'rningiz: {data.leaderboard.myRank}
                    </Text>
                  ) : null}
                </View>

                <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                  {data.leaderboard.top.length === 0 ? (
                    <Text className="text-sm text-muted">
                      Bu hafta hali hech kim yulduz to'plamagan
                    </Text>
                  ) : (
                    data.leaderboard.top.slice(0, 5).map((item) => (
                      <View
                        key={item.userId}
                        className="flex-row items-center justify-between"
                      >
                        <View className="flex-row items-center gap-2 flex-1">
                          <Text className="text-lg font-bold text-primary w-6">
                            {item.rank}
                          </Text>
                          <Text
                            className={`text-sm flex-1 ${item.isMe ? "text-primary font-semibold" : "text-foreground"}`}
                            numberOfLines={1}
                          >
                            {item.isMe ? "Siz" : item.fullName || item.username}
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-primary">
                          ⭐ {item.weeklyStars}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>

              {/* 3. SO'NGGI NATIJALAR */}
              {data.recentQuizzes.length > 0 ? (
                <View className="gap-3">
                  <Text className="text-lg font-semibold text-foreground">
                    ⚡ So'nggi natijalar
                  </Text>
                  <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                    {data.recentQuizzes.map((quiz) => (
                      <View
                        key={quiz.id}
                        className="flex-row items-center justify-between"
                      >
                        <View className="flex-1">
                          <Text className="text-sm text-foreground" numberOfLines={1}>
                            {quiz.quizName}
                          </Text>
                          <Text className="text-xs text-muted">
                            {new Date(quiz.completedAt).toLocaleDateString("uz-UZ")}
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-primary">
                          {Math.round(quiz.percentage)}%
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          )}

          {/* 4. ILOVA ICHIDAGI BO'LIMLAR (internetsiz ham ishlaydi) */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              📖 Ilova bo'limlari
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/periodic" as any)}
                className="flex-1 bg-surface rounded-lg p-4 border border-border active:opacity-80"
              >
                <Text className="text-2xl mb-1">📊</Text>
                <Text className="text-sm font-semibold text-foreground">
                  Davriy jadval
                </Text>
                <Text className="text-xs text-muted">118 element</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/reactions" as any)}
                className="flex-1 bg-surface rounded-lg p-4 border border-border active:opacity-80"
              >
                <Text className="text-2xl mb-1">⚗️</Text>
                <Text className="text-sm font-semibold text-foreground">
                  Reaksiyalar
                </Text>
                <Text className="text-xs text-muted">Baza va qidiruv</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/calculators" as any)}
              className="bg-surface rounded-lg p-4 border border-border active:opacity-80"
            >
              <Text className="text-2xl mb-1">🧮</Text>
              <Text className="text-sm font-semibold text-foreground">
                Kalkulyatorlar
              </Text>
              <Text className="text-xs text-muted">Kimyoviy hisob-kitoblar</Text>
            </TouchableOpacity>
          </View>

          {/* 5. HALI TAYYOR EMAS — avval bu yerda o'ylab topilgan
              maqolalar va chat xabarlari real kabi ko'rsatilardi */}
          <View className="bg-surface/50 rounded-lg p-4 border border-border border-dashed gap-2">
            <Text className="text-sm font-semibold text-muted">🚧 Tez kunda</Text>
            <Text className="text-xs text-muted">
              3D molekulalar laboratoriyasi, ilmiy adabiyotlar va ommaviy chat
              hozircha faqat saytda mavjud — ilovaga keyingi bosqichda qo'shiladi.
            </Text>
          </View>

          {/* Spacer */}
          <View className="h-4" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
