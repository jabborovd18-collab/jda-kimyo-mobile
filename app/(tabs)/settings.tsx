import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Settings Screen - Sozlamalar
 * Ilovaning sozlamalari
 */
export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("uz");

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-foreground">
              ⚙️ Sozlamalar
            </Text>
          </View>

          {/* Display Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Ekran
            </Text>

            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🌙</Text>
                <View>
                  <Text className="text-base font-medium text-foreground">
                    Qora rejim
                  </Text>
                  <Text className="text-xs text-muted">
                    Tun rejimida foydalanish
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#E5E7EB", true: "#0a7ea4" }}
                thumbColor={darkMode ? "#ffffff" : "#f5f5f5"}
              />
            </View>
          </View>

          {/* Language Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Til
            </Text>

            <View className="gap-2">
              {[
                { id: "uz", label: "🇺🇿 O'zbek" },
                { id: "en", label: "🇬🇧 English" },
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.id}
                  onPress={() => setLanguage(lang.id)}
                  className={`rounded-lg p-4 border ${
                    language === lang.id
                      ? "bg-primary/10 border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-medium text-foreground">
                      {lang.label}
                    </Text>
                    {language === lang.id && (
                      <Text className="text-lg">✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notification Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Bildirishnomalar
            </Text>

            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🔔</Text>
                <View>
                  <Text className="text-base font-medium text-foreground">
                    Bildirishnomalarni yoqish
                  </Text>
                  <Text className="text-xs text-muted">
                    Yangi darslar va testlar haqida xabar olish
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#E5E7EB", true: "#0a7ea4" }}
                thumbColor={notifications ? "#ffffff" : "#f5f5f5"}
              />
            </View>
          </View>

          {/* Data Management */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Ma'lumotlar
            </Text>

            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border active:opacity-80">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">💾</Text>
                  <View>
                    <Text className="text-base font-medium text-foreground">
                      Maʼlumotlarni tozalash
                    </Text>
                    <Text className="text-xs text-muted">
                      Progress va kesh fayllarini o'chirish
                    </Text>
                  </View>
                </View>
                <Text className="text-lg">→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border active:opacity-80">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">📤</Text>
                  <View>
                    <Text className="text-base font-medium text-foreground">
                      Natijalarni eksport qilish
                    </Text>
                    <Text className="text-xs text-muted">
                      Test natijalarini PDF shaklida yuklab olish
                    </Text>
                  </View>
                </View>
                <Text className="text-lg">→</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* About */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Ilovani haqida
            </Text>

            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Versiya</Text>
                <Text className="text-sm font-semibold text-foreground">
                  v1.0.0
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Muallif</Text>
                <Text className="text-sm font-semibold text-foreground">
                  JDA KIMYO
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Veb-sayt</Text>
                <Text className="text-sm font-semibold text-primary">
                  jdakimyo.uz
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center py-4">
            <Text className="text-xs text-muted">
              © 2026 JDA KIMYO — Kompleks birikmalar platformasi
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
