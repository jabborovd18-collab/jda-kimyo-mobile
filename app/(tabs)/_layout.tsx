import { Tabs } from "expo-router";
import { Text } from "react-native";

import { CustomTabBar } from "@/components/custom-tab-bar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* CHAP TOMONDA 1 */}
      <Tabs.Screen
        name="reactions"
        options={{
          title: "Reaksiyalar",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚗️</Text>,
        }}
      />

      {/* CHAP TOMONDA 2 */}
      <Tabs.Screen
        name="periodic"
        options={{
          title: "Davriy",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📊</Text>,
        }}
      />

      {/* CENTER - KATTA AYLANA */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Bosh",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 32 }}>🏠</Text>,
        }}
      />

      {/* O'NG TOMONDA 1 */}
      <Tabs.Screen
        name="calculators"
        options={{
          title: "Kalkulatorlar",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🧮</Text>,
        }}
      />

      {/* O'NG TOMONDA 2 */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💬</Text>,
        }}
      />
    </Tabs>
  );
}
