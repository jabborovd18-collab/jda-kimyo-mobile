import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 80 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      {/* CHAP TOMONDA 2 TA */}
      <Tabs.Screen
        name="reactions"
        options={{
          title: "Reaksiyalar",
          tabBarIcon: ({ color }) => (
            <View className="items-center gap-1">
              <Text className="text-2xl">⚗️</Text>
              <Text className="text-xs text-muted">Reaksiyalar</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="periodic"
        options={{
          title: "Davriy",
          tabBarIcon: ({ color }) => (
            <View className="items-center gap-1">
              <Text className="text-2xl">📊</Text>
              <Text className="text-xs text-muted">Davriy</Text>
            </View>
          ),
        }}
      />

      {/* CENTER - KATTA AYLANA */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Bosh",
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center -mt-6">
              <View className="w-20 h-20 rounded-full bg-primary items-center justify-center shadow-lg">
                <Text className="text-4xl">🏠</Text>
              </View>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      {/* O'NG TOMONDA 2 TA */}
      <Tabs.Screen
        name="calculators"
        options={{
          title: "Kalkulatorlar",
          tabBarIcon: ({ color }) => (
            <View className="items-center gap-1">
              <Text className="text-2xl">🧮</Text>
              <Text className="text-xs text-muted">Kalkulatorlar</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <View className="items-center gap-1">
              <Text className="text-2xl">💬</Text>
              <Text className="text-xs text-muted">Chat</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
