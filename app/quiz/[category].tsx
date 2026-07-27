import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  fetchQuizQuestions,
  submitQuiz,
  type QuizSubmitResult,
} from "@/lib/jda/api";

const QUESTIONS_PER_ROUND = 20;

/**
 * Quiz yechish ekrani.
 *
 * Natija ilovada hisoblanadi (javoblar savol bilan birga keladi), shuning
 * uchun har bir savoldan keyin darhol izoh ko'rsatiladi. Yakunda natija
 * serverga yuboriladi va saytdagi statistika/reyting bilan birlashadi.
 */
export default function QuizRunnerScreen() {
  const colors = useColors();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { category } = useLocalSearchParams<{ category: string }>();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["jda", "quiz", "questions", category],
    queryFn: () => fetchQuizQuestions(category!, QUESTIONS_PER_ROUND),
    enabled: Boolean(category),
    // Har kirishda yangi savollar kelishi uchun keshlamaymiz
    gcTime: 0,
    staleTime: 0,
  });

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitState, setSubmitState] = useState<
    { status: "idle" | "sending" } | { status: "done"; result: QuizSubmitResult } | { status: "error"; message: string }
  >({ status: "idle" });

  const startedAt = useRef(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
  }, [data]);

  const questions = data?.questions ?? [];
  const current = questions[index];
  const isLast = index === questions.length - 1;

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null) return; // bir savolga bir marta
    setSelected(optionIndex);
    if (optionIndex === current.correct) {
      setScore((value) => value + 1);
    }
  };

  const finish = useCallback(
    async (finalScore: number) => {
      setFinished(true);
      setSubmitState({ status: "sending" });

      try {
        const result = await submitQuiz({
          category: category!,
          score: finalScore,
          totalQuestions: questions.length,
          timeSpent: Math.round((Date.now() - startedAt.current) / 1000),
        });
        setSubmitState({ status: "done", result });

        // Bosh sahifa va kategoriyalar statistikasi yangilansin
        queryClient.invalidateQueries({ queryKey: ["jda", "home"] });
        queryClient.invalidateQueries({ queryKey: ["jda", "quiz", "categories"] });
      } catch (err) {
        setSubmitState({
          status: "error",
          message: (err as Error).message || "Natijani saqlab bo'lmadi",
        });
      }
    },
    [category, questions.length, queryClient],
  );

  const handleNext = () => {
    if (isLast) {
      finish(score);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setSubmitState({ status: "idle" });
    refetch();
  };

  // ─── Yuklanmoqda / xato ───
  if (isLoading) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !data || questions.length === 0) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-sm text-error text-center">
            {(error as Error)?.message || "Savollarni yuklab bo'lmadi"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-surface border border-border rounded-lg px-5 py-3"
          >
            <Text className="text-sm text-foreground">Orqaga</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // ─── Natija ───
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const verdict =
      percentage >= 80 ? "Ajoyib! 🎉" : percentage >= 60 ? "Yaxshi 👍" : "Takrorlash kerak 📚";

    return (
      <ScreenContainer className="p-4">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View className="gap-6">
            <View className="items-center gap-2">
              <Text className="text-6xl">{percentage >= 60 ? "🏆" : "📚"}</Text>
              <Text className="text-2xl font-bold text-foreground">{verdict}</Text>
              <Text className="text-sm text-muted">{data.category.name}</Text>
            </View>

            <View className="bg-surface rounded-lg p-6 border border-border items-center gap-2">
              <Text className="text-5xl font-bold text-primary">{percentage}%</Text>
              <Text className="text-sm text-muted">
                {questions.length} savoldan {score} ta to&apos;g&apos;ri
              </Text>
            </View>

            {/* Serverga saqlash holati */}
            {submitState.status === "sending" ? (
              <View className="flex-row items-center justify-center gap-2">
                <ActivityIndicator color={colors.primary} />
                <Text className="text-sm text-muted">Natija saqlanmoqda...</Text>
              </View>
            ) : submitState.status === "done" ? (
              <View className="bg-primary/10 rounded-lg p-4 gap-1 items-center">
                <Text className="text-sm font-semibold text-primary">
                  +{submitState.result.xpGained} XP
                </Text>
                {submitState.result.missionCompleted ? (
                  <Text className="text-xs text-muted">
                    🎯 Kunlik missiya bajarildi
                  </Text>
                ) : null}
                <Text className="text-xs text-muted">
                  Natija saytdagi profilingizga qo&apos;shildi
                </Text>
              </View>
            ) : submitState.status === "error" ? (
              <View className="bg-error/10 border border-error/40 rounded-lg p-4">
                <Text className="text-xs text-error">{submitState.message}</Text>
              </View>
            ) : null}

            <View className="gap-3">
              <TouchableOpacity
                onPress={restart}
                className="bg-primary rounded-lg py-4 items-center"
              >
                <Text className="text-base font-semibold text-background">
                  Yana yechish
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-surface border border-border rounded-lg py-4 items-center"
              >
                <Text className="text-base text-foreground">Kategoriyalarga</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ─── Savol ───
  const answered = selected !== null;

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-5">
          {/* Progress */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-2xl text-foreground">←</Text>
              </TouchableOpacity>
              <Text className="text-sm text-muted">
                {index + 1} / {questions.length}
              </Text>
              <Text className="text-sm font-semibold text-primary">
                {score} ✓
              </Text>
            </View>
            <View className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </View>
          </View>

          {/* Savol */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-[11px] text-muted mb-2 uppercase">
              {current.difficulty}
            </Text>
            <Text className="text-base font-semibold text-foreground leading-6">
              {current.question}
            </Text>
          </View>

          {/* Variantlar */}
          <View className="gap-2">
            {current.options.map((option, optionIndex) => {
              const isCorrect = optionIndex === current.correct;
              const isPicked = optionIndex === selected;

              let style = "bg-surface border-border";
              if (answered && isCorrect) style = "bg-success/15 border-success";
              else if (answered && isPicked) style = "bg-error/15 border-error";

              return (
                <TouchableOpacity
                  key={optionIndex}
                  onPress={() => handleAnswer(optionIndex)}
                  disabled={answered}
                  className={`rounded-lg p-4 border ${style} active:opacity-80`}
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-sm font-bold text-muted w-5">
                      {String.fromCharCode(65 + optionIndex)}
                    </Text>
                    <Text className="text-sm text-foreground flex-1">{option}</Text>
                    {answered && isCorrect ? <Text>✓</Text> : null}
                    {answered && isPicked && !isCorrect ? <Text>✕</Text> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Izoh */}
          {answered && current.explanation ? (
            <View className="bg-primary/10 rounded-lg p-4">
              <Text className="text-xs font-semibold text-primary mb-1">Izoh</Text>
              <Text className="text-sm text-foreground leading-5">
                {current.explanation}
              </Text>
            </View>
          ) : null}

          {/* Keyingi */}
          {answered ? (
            <TouchableOpacity
              onPress={handleNext}
              className="bg-primary rounded-lg py-4 items-center"
            >
              <Text className="text-base font-semibold text-background">
                {isLast ? "Yakunlash" : "Keyingi savol →"}
              </Text>
            </TouchableOpacity>
          ) : null}

          <View className="h-4" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
