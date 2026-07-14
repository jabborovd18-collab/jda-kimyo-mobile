import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Quiz Screen - Quiz va Testlar
 * Bilimni sinash uchun interaktiv testlar
 */
export default function QuizScreen() {
  const router = useRouter();

  const quizzes = [
    {
      id: 1,
      title: "Nomlanishi",
      description: "IUPAC qoidalari va formula yozish",
      questions: 15,
      difficulty: "Oson",
      icon: "📖",
      bestScore: null,
    },
    {
      id: 2,
      title: "Klassifikatsiyasi",
      description: "Sinf, ligand va zaryad bo'yicha tasniflash",
      questions: 20,
      difficulty: "O'rta",
      icon: "📊",
      bestScore: 85,
    },
    {
      id: 3,
      title: "Fazoviy Tuzilishi",
      description: "Geometrik shakllar va 3D modellar",
      questions: 18,
      difficulty: "O'rta",
      icon: "💎",
      bestScore: null,
    },
    {
      id: 4,
      title: "Izomeriyasi",
      description: "Tuzilish va stereoizomeriya turlari",
      questions: 22,
      difficulty: "Qiyin",
      icon: "🔄",
      bestScore: 72,
    },
    {
      id: 5,
      title: "Kimyoviy Bog'lanish",
      description: "VB nazariyasi va kristall maydon",
      questions: 25,
      difficulty: "Qiyin",
      icon: "🔗",
      bestScore: null,
    },
    {
      id: 6,
      title: "Umumiy Test",
      description: "Barcha mavzular bo'yicha katta test",
      questions: 50,
      difficulty: "Qiyin",
      icon: "🎯",
      bestScore: 78,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Oson":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      case "O'rta":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300";
      case "Qiyin":
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              🎯 Quiz va Testlar
            </Text>
            <Text className="text-sm text-muted">
              Bilimingizni sinang va natijalarni ko'rish
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-1">O'tkazilgan</Text>
              <Text className="text-2xl font-bold text-primary">3</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-1">O'rtacha</Text>
              <Text className="text-2xl font-bold text-primary">78%</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Eng yaxshi</Text>
              <Text className="text-2xl font-bold text-primary">85%</Text>
            </View>
          </View>

          {/* Quizzes */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Mavzular bo'yicha testlar
            </Text>
            {quizzes.map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/quiz-attempt",
                    params: { quizId: quiz.id },
                  } as any);
                }}
                className="bg-surface rounded-lg p-4 border border-border active:opacity-80"
              >
                <View className="flex-row items-start gap-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-2xl">{quiz.icon}</Text>
                      <Text className="text-lg font-semibold text-foreground">
                        {quiz.title}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted mb-2">
                      {quiz.description}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <View className="bg-primary/10 px-2 py-1 rounded">
                        <Text className="text-xs text-primary font-medium">
                          {quiz.questions} savol
                        </Text>
                      </View>
                      <View
                        className={`px-2 py-1 rounded ${getDifficultyColor(quiz.difficulty)}`}
                      >
                        <Text className="text-xs font-medium">
                          {quiz.difficulty}
                        </Text>
                      </View>
                      {quiz.bestScore !== null && (
                        <View className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                          <Text className="text-xs text-green-700 dark:text-green-300 font-medium">
                            ✓ {quiz.bestScore}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl">→</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tips */}
          <View className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <Text className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-2">
              💡 Maslahat
            </Text>
            <Text className="text-xs text-orange-800 dark:text-orange-200 leading-relaxed">
              Testlarni muntazam o'tkazing va natijalarni kuzating. 70% dan
              yuqori natija — yaxshi o'rganish belgisi!
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
