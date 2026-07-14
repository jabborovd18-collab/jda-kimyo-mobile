import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - Bosh Sahifa
 * Quiz natijalar, Reytinglar, Adabiyotlar, Kurslar, Chat
 */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Salom, Talaba! 👋
            </Text>
            <Text className="text-sm text-muted">
              Oliy Kimyoni o'rganishga xush kelibsiz
            </Text>
          </View>

          {/* 1. QUIZ VA NATIJALAR */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">
              📊 Quiz Statistika
            </Text>
            <View className="flex-row gap-2">
              <View className="flex-1 bg-primary/10 rounded-lg p-3">
                <Text className="text-xs text-muted mb-1">O'tkazilgan</Text>
                <Text className="text-2xl font-bold text-primary">8</Text>
              </View>
              <View className="flex-1 bg-primary/10 rounded-lg p-3">
                <Text className="text-xs text-muted mb-1">O'rtacha</Text>
                <Text className="text-2xl font-bold text-primary">78%</Text>
              </View>
              <View className="flex-1 bg-primary/10 rounded-lg p-3">
                <Text className="text-xs text-muted mb-1">Eng yaxshi</Text>
                <Text className="text-2xl font-bold text-primary">85%</Text>
              </View>
            </View>
          </View>

          {/* 2. REYTINGLAR */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">
                🏆 Top Reytinglar
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-primary">Barcha →</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border gap-2">
              {[
                { rank: 1, name: "Alisher", score: "95%" },
                { rank: 2, name: "Dilnoza", score: "92%" },
                { rank: 3, name: "Siz", score: "85%" },
              ].map((item) => (
                <View
                  key={item.rank}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-bold text-primary">
                      {item.rank}
                    </Text>
                    <Text className="text-sm text-foreground">{item.name}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-primary">
                    {item.score}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 3. 3D MOLEKULALAR */}
          <TouchableOpacity className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 active:opacity-80">
            <Text className="text-lg font-semibold text-white mb-1">
              🧬 3D Molekulalar
            </Text>
            <Text className="text-sm text-white/80 mb-3">
              H₂O, CO₂, NH₃, CH₄ va boshqalar
            </Text>
            <Text className="text-sm font-semibold text-white">
              3D Laboratoriyaga o'tish →
            </Text>
          </TouchableOpacity>

          {/* 4. ILMIY ADABIYOTLAR */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">
                📚 Ilmiy Adabiyotlar
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-primary">Barcha →</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              {[
                {
                  title: "Kompleks birikmalar...",
                  author: "Smith, J.",
                  year: "2026",
                },
                {
                  title: "Koordinatsion kimyo...",
                  author: "Johnson, M.",
                  year: "2025",
                },
                {
                  title: "Kristall maydon...",
                  author: "Brown, A.",
                  year: "2024",
                },
              ].map((article, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="border-b border-border pb-3 active:opacity-70"
                >
                  <Text className="text-sm font-semibold text-foreground mb-1">
                    {article.title}
                  </Text>
                  <Text className="text-xs text-muted">
                    {article.author} • {article.year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 5. OLIY KIMYONING FANLARI */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">
                🔬 Kurslar
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-primary">Barcha →</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              {[
                { name: "Kompleks birikmalar", progress: 40 },
                { name: "Kristall maydon", progress: 20 },
                { name: "Spektroskopiya", progress: 0 },
              ].map((course, idx) => (
                <View key={idx}>
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm text-foreground">
                      {course.name}
                    </Text>
                    <Text className="text-xs text-muted">{course.progress}%</Text>
                  </View>
                  <View className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary"
                      style={{ width: `${course.progress}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 6. OMMAVIY CHAT */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/chat" as any)}
            className="bg-surface rounded-lg p-4 border border-border active:opacity-80"
          >
            <Text className="text-lg font-semibold text-foreground mb-2">
              💬 Ommaviy Chat
            </Text>
            <View className="gap-2">
              {[
                {
                  user: "O'qituvchi Alisher",
                  message: "Bugun kompleks birikmalar haqida...",
                },
                {
                  user: "Talaba Dilnoza",
                  message: "Qanday teng koeffitsientlarni topish?",
                },
                {
                  user: "O'qituvchi Alisher",
                  message: "Redoks usulini ishlatish kerak...",
                },
              ].map((chat, idx) => (
                <View key={idx} className="border-b border-border pb-2">
                  <Text className="text-xs font-semibold text-primary mb-1">
                    {chat.user}
                  </Text>
                  <Text className="text-sm text-foreground line-clamp-1">
                    {chat.message}
                  </Text>
                </View>
              ))}
            </View>
            <Text className="text-sm text-primary font-semibold mt-2">
              Chat'ga o'tish →
            </Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View className="h-4" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
