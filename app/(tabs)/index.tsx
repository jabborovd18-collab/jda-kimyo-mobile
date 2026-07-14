import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - JDA Kimyo Mobile
 * Ilovaning bosh sahifasi. Asosiy bo'limlarga tez kirish.
 */
export default function HomeScreen() {
  const router = useRouter();

  const sections = [
    {
      id: "courses",
      title: "📚 O'quv Kurslari",
      description: "Noldan boshlab murakkab mavzulargacha",
      color: "bg-blue-100 dark:bg-blue-900",
      route: "/(tabs)/courses",
    },
    {
      id: "research",
      title: "🔬 Ilmiy Bo'lim",
      description: "Chuqurlashgan nazariyalar va tadqiqotlar",
      color: "bg-purple-100 dark:bg-purple-900",
      route: "/(tabs)/research",
    },
    {
      id: "compounds",
      title: "🧪 Birikmalar Bazasi",
      description: "120+ kompleks birikma va 3D modellar",
      color: "bg-green-100 dark:bg-green-900",
      route: "/(tabs)/compounds",
    },
    {
      id: "quiz",
      title: "🎯 Quiz va Testlar",
      description: "500+ savol bilan bilimni sinang",
      color: "bg-orange-100 dark:bg-orange-900",
      route: "/(tabs)/quiz",
    },
  ];

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2 mb-2">
            <Text className="text-3xl font-bold text-foreground">
              JDA Kimyo
            </Text>
            <Text className="text-sm text-muted">
              Kompleks birikmalar dunyosiga xush kelibsiz
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Darslar</Text>
              <Text className="text-2xl font-bold text-primary">50+</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Testlar</Text>
              <Text className="text-2xl font-bold text-primary">500+</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Birikmalar</Text>
              <Text className="text-2xl font-bold text-primary">120+</Text>
            </View>
          </View>

          {/* Main Sections */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Asosiy Bo'limlar
            </Text>
            {sections.map((section) => (
              <TouchableOpacity
                key={section.id}
                onPress={() => router.push(section.route as any)}
                className={`${section.color} rounded-xl p-4 border border-border active:opacity-80`}
              >
                <Text className="text-lg font-semibold text-foreground mb-1">
                  {section.title}
                </Text>
                <Text className="text-sm text-muted">
                  {section.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Section */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">
              💡 Maslahat
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              Har kuni 30-60 daqiqa o'rganish eng samarali. Darslarni yozing va
              testlarni o'tkazing.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
