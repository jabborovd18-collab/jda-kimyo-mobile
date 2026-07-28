import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { JdaTugma } from "@/components/jda-tugma";
import { Text } from "@/components/matn";

import { ScreenContainer } from "@/components/screen-container";
import { fetchReactions, type ReactionListItem } from "@/lib/jda/api";
import { useColors } from "@/hooks/use-colors";

const PAGE_SIZE = 30;

/**
 * Reaksiyalar ekrani.
 *
 * Ma'lumot saytning bazasidan olinadi. Qidiruv formula yozilishiga bog'liq
 * emas: "H2SO4" deb yozilsa ham "H₂SO₄" topiladi — pastki indeks belgisi
 * ko'p klaviaturada yo'q.
 */
export default function ReactionsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  // Har harfda so'rov yubormaslik uchun kechiktirish
  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["jda", "reactions", query, category],
    queryFn: () => fetchReactions({ q: query, category, limit: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const renderItem = ({ item }: { item: ReactionListItem }) => (
    <TouchableOpacity
      onPress={() => router.push(`/reactions/${item.id}` as any)}
      className="bg-surface rounded-2xl p-4 border border-border mb-2 active:opacity-80"
    >
      <Text className="text-sm font-semibold text-foreground leading-5">
        {item.equation}
      </Text>

      {item.name ? (
        <Text className="text-xs text-muted mt-1">{item.name}</Text>
      ) : null}

      <View className="flex-row flex-wrap gap-2 mt-3">
        <View className="bg-primary/15 rounded px-2 py-0.5">
          <Text className="text-[10px] text-primary">{item.category}</Text>
        </View>
        {item.temperature ? (
          <View className="bg-surface border border-border rounded px-2 py-0.5">
            <Text className="text-[10px] text-muted">
              🌡 {item.temperature}
            </Text>
          </View>
        ) : null}
        {item.catalyst ? (
          <View className="bg-surface border border-border rounded px-2 py-0.5">
            <Text className="text-[10px] text-muted">⚡ {item.catalyst}</Text>
          </View>
        ) : null}
        {item.scale ? (
          <View className="bg-surface border border-border rounded px-2 py-0.5">
            <Text className="text-[10px] text-muted">{item.scale}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <View className="flex-1 gap-3">
        {/* Sarlavha */}
        <View>
          <Text sarlavha className="text-3xl font-bold text-foreground">
            Reaksiyalar
          </Text>
          <Text className="text-sm text-muted">
            {isLoading
              ? "Yuklanmoqda..."
              : `${data?.total ?? 0} ta reaksiya topildi`}
          </Text>
        </View>

        {/* Qidiruv */}
        <View>
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Masalan: H2SO4, NaOH, Cu"
            autoCapitalize="none"
            autoCorrect={false}
            className="bg-surface border border-border rounded-xl px-4 py-3"
            placeholderTextColor={colors.muted}
            // Matn rangi uslub orqali — Android'da className bilan berilgani
            // TextInput'ga yetib bormasligi va yozuv ko'rinmay qolishi mumkin
            style={{ color: colors.foreground, fontSize: 16 }}
          />
          <Text className="text-[11px] text-muted mt-1">
            Pastki indeks shart emas — &quot;H2O&quot; deb yozsangiz ham
            &quot;H₂O&quot; topiladi
          </Text>
        </View>

        {/* Kategoriya filtri */}
        {data?.categories?.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
          >
            <TouchableOpacity
              onPress={() => setCategory("all")}
              className={`rounded-full px-3 py-1.5 border ${
                category === "all"
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  category === "all" ? "text-background" : "text-foreground"
                }`}
              >
                Barchasi
              </Text>
            </TouchableOpacity>

            {data.categories.map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => setCategory(item.name)}
                className={`rounded-full px-3 py-1.5 border ${
                  category === item.name
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    category === item.name
                      ? "text-background"
                      : "text-foreground"
                  }`}
                >
                  {item.name} ({item.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}

        {/* Ro'yxat */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : isError ? (
          <View className="bg-error/10 border border-error/40 rounded-2xl p-4 gap-3">
            <Text className="text-sm text-error">
              {(error as Error)?.message || "Reaksiyalarni yuklab bo'lmadi"}
            </Text>
            <JdaTugma onPress={() => refetch()} kichik>
              Qayta urinish
            </JdaTugma>
          </View>
        ) : !data || data.reactions.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-2 py-12">
            <Text className="text-4xl">🔍</Text>
            <Text className="text-sm text-muted text-center">
              {query
                ? `"${query}" bo'yicha hech narsa topilmadi`
                : "Reaksiya yo'q"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={data.reactions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListFooterComponent={
              data.hasMore ? (
                <Text className="text-xs text-muted text-center py-3">
                  {data.reactions.length} / {data.total} ko&apos;rsatilmoqda —
                  qidiruvni aniqlashtiring
                </Text>
              ) : null
            }
          />
        )}

        {isFetching && !isLoading ? (
          <View className="absolute top-2 right-2">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
