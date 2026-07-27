import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { fetchQuizCategories } from "@/lib/jda/api";
import { useColors } from "@/hooks/use-colors";

/**
 * Quiz kategoriyalari — ilovaning asosiy maqsadi:
 * kompyuter yo'q vaqtda ham test yechib takrorlab turish.
 */
export default function QuizCategoriesScreen() {
  const colors = useColors();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["jda", "quiz", "categories"],
    queryFn: fetchQuizCategories,
  });

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-5">
          {/* Sarlavha */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-2xl text-foreground">←</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-foreground">Quiz</Text>
              <Text className="text-sm text-muted">
                Mavzuni tanlang va bilimingizni sinang
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View className="py-16 items-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : isError || !data ? (
            <View className="bg-error/10 border border-error/40 rounded-lg p-4 gap-3">
              <Text className="text-sm text-error">
                {(error as Error)?.message || "Kategoriyalarni yuklab bo'lmadi"}
              </Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="bg-primary rounded-lg py-2 items-center"
              >
                <Text className="text-sm font-semibold text-background">Qayta urinish</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-3">
              {data.categories.map((category) => (
                <TouchableOpacity
                  key={category.slug}
                  onPress={() => router.push(`/quiz/${category.slug}` as any)}
                  className="bg-surface rounded-lg p-4 border border-border active:opacity-80"
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-3xl">{category.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {category.name}
                      </Text>
                      <Text className="text-xs text-muted" numberOfLines={2}>
                        {category.description}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-sm font-bold text-primary">
                        {category.questionCount}
                      </Text>
                      <Text className="text-[10px] text-muted">savol</Text>
                    </View>
                  </View>

                  {category.bestPercentage !== null ? (
                    <View className="mt-3 pt-3 border-t border-border flex-row items-center justify-between">
                      <Text className="text-xs text-muted">Eng yaxshi natijangiz</Text>
                      <Text className="text-xs font-semibold text-primary">
                        {Math.round(category.bestPercentage)}%
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="h-4" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
