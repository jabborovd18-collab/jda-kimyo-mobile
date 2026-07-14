import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Profile Screen - Shaxsiy Kabinet
 * Foydalanuvchi profilining boshqaruvi
 */
export default function ProfileScreen() {
  const router = useRouter();

  const stats = [
    { label: "O'rganilgan darslar", value: "12", icon: "📚" },
    { label: "O'tkazilgan testlar", value: "8", icon: "🎯" },
    { label: "O'rtacha natija", value: "78%", icon: "📊" },
    { label: "Eng yaxshi natija", value: "85%", icon: "🏆" },
  ];

  const menuItems = [
    { id: "settings", label: "⚙️ Sozlamalar", icon: "⚙️" },
    { id: "about", label: "ℹ️ Ilovani haqida", icon: "ℹ️" },
    { id: "feedback", label: "💬 Fikr va takliflar", icon: "💬" },
    { id: "logout", label: "🚪 Chiqish", icon: "🚪" },
  ];

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Profile Header */}
          <View className="items-center gap-3">
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
              <Text className="text-4xl">👤</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-foreground">
                Talaba
              </Text>
              <Text className="text-sm text-muted">
                JDA Kimyo ilovasi foydalanuvchisi
              </Text>
            </View>
          </View>

          {/* Statistics */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              Statistika
            </Text>
            <View className="gap-2">
              {stats.map((stat, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border"
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">{stat.icon}</Text>
                    <Text className="text-sm text-muted">{stat.label}</Text>
                  </View>
                  <Text className="text-lg font-bold text-primary">
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Progress Summary */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">
              O'rganish jarayoni
            </Text>
            <View className="gap-2">
              <View>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm text-muted">O'quv kurslari</Text>
                  <Text className="text-sm font-semibold text-primary">
                    40%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <View className="h-full w-2/5 bg-primary" />
                </View>
              </View>
              <View>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm text-muted">Ilmiy bo'lim</Text>
                  <Text className="text-sm font-semibold text-primary">
                    20%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <View className="h-full w-1/5 bg-primary" />
                </View>
              </View>
              <View>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm text-muted">Birikmalar</Text>
                  <Text className="text-sm font-semibold text-primary">
                    15%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <View className="h-full w-3/20 bg-primary" />
                </View>
              </View>
            </View>
          </View>

          {/* Menu */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              Boshqaruv
            </Text>
            <View className="gap-2">
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    if (item.id === "settings") {
                      router.push("/(tabs)/settings" as any);
                    } else if (item.id === "logout") {
                      // Handle logout
                      alert("Chiqish funksiyasi hozircha mavjud emas");
                    } else {
                      alert(`${item.label} funksiyasi hozircha mavjud emas`);
                    }
                  }}
                  className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border active:opacity-80"
                >
                  <Text className="text-base font-medium text-foreground">
                    {item.label}
                  </Text>
                  <Text className="text-lg">→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* App Info */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 items-center">
            <Text className="text-xs text-blue-800 dark:text-blue-200 mb-1">
              JDA Kimyo Mobile
            </Text>
            <Text className="text-xs text-blue-600 dark:text-blue-400">
              v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
