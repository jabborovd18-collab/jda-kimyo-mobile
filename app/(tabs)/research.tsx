import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Research Screen - Ilmiy Bo'lim
 * Tadqiqotchilar va magistrlar uchun chuqurlashgan materiallar
 */
export default function ResearchScreen() {
  const router = useRouter();

  const directions = [
    {
      id: "advanced",
      number: 1,
      title: "Chuqurlashgan Mavzular",
      description: "Kristall maydon nazariyasi, MO diagrammalari, termodinamika",
      icon: "🔬",
      topics: ["CFT", "MO", "Termodinamika"],
    },
    {
      id: "papers",
      number: 2,
      title: "Ilmiy Maqolalar",
      description: "Yangi chiqqan maqolalar va maqolalar bazasi",
      icon: "📝",
      topics: ["Peer-reviewed", "Open access", "DOI"],
    },
    {
      id: "compounds",
      number: 3,
      title: "Kompleks Birikmalar",
      description: "50+ kompleks birikma va barcha xossalari",
      icon: "🧪",
      topics: ["3D modellar", "Spektrlar", "Xossalari"],
    },
    {
      id: "methods",
      number: 4,
      title: "Tahlil Usullari",
      description: "IR spektroskopiya, UV-Vis, NMR, Rentgen difraksiyasi",
      icon: "📊",
      topics: ["IR", "NMR", "XRD"],
    },
  ];

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              🔬 Ilmiy Bo'lim
            </Text>
            <Text className="text-sm text-muted">
              Koordinatsion kimyo bo'yicha chuqur bilimlar va tadqiqotlar
            </Text>
          </View>

          {/* Overall Progress */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-semibold text-foreground">
                Umumiy progress
              </Text>
              <Text className="text-lg font-bold text-primary">0%</Text>
            </View>
            <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <View className="h-full w-0 bg-primary" />
            </View>
          </View>

          {/* Directions */}
          <View className="gap-3">
            {directions.map((direction) => (
              <TouchableOpacity
                key={direction.id}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/research-detail",
                    params: { directionId: direction.id },
                  } as any);
                }}
                className="bg-surface rounded-lg p-4 border border-border active:opacity-80"
              >
                <View className="flex-row items-start gap-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-2xl">{direction.icon}</Text>
                      <Text className="text-xs font-semibold text-muted">
                        Yo'nalish {direction.number}
                      </Text>
                    </View>
                    <Text className="text-lg font-semibold text-foreground mb-1">
                      {direction.title}
                    </Text>
                    <Text className="text-sm text-muted mb-2">
                      {direction.description}
                    </Text>
                    <View className="flex-row flex-wrap gap-1">
                      {direction.topics.map((topic, idx) => (
                        <View
                          key={idx}
                          className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded"
                        >
                          <Text className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                            {topic}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="items-end">
                    <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
                      <Text className="text-xs font-bold text-white">0%</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info */}
          <View className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <Text className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
              🎯 Tadqiqotchilar uchun
            </Text>
            <Text className="text-xs text-purple-800 dark:text-purple-200 leading-relaxed">
              Zamonaviy tahlil usullari, ilmiy maqolalar va chuqurlashgan
              nazariyalar bilan tanishin.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
