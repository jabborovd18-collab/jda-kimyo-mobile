import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Courses Screen - O'quv Kurslari
 * 6 ta bosqichli o'quv kursi
 */
export default function CoursesScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState({
    step1: 0,
    step2: 0,
    step3: 0,
    step4: 0,
    step5: 0,
    step6: 0,
  });

  const steps = [
    {
      id: "step1",
      number: 1,
      title: "Nomlanishi",
      description: "IUPAC qoidalari, formula yozish, ligandlar",
      icon: "📖",
      topics: ["IUPAC qoidalari", "Formula yozish", "Ligandlar"],
    },
    {
      id: "step2",
      number: 2,
      title: "Klassifikatsiyasi",
      description: "Sinf, ligand, zaryad bo'yicha tasniflash",
      icon: "📊",
      topics: ["Sinf", "Ligand", "Zaryad"],
    },
    {
      id: "step3",
      number: 3,
      title: "Fazoviy Tuzilishi",
      description: "Geometrik shakllar va 3D modellar",
      icon: "💎",
      topics: ["Oktaedr", "Tetraedr", "Kvadrat tekislik"],
    },
    {
      id: "step4",
      number: 4,
      title: "Izomeriyasi",
      description: "Tuzilish va stereoizomeriya turlari",
      icon: "🔄",
      topics: ["Tuzilish izomeriya", "Stereoizomeriya"],
    },
    {
      id: "step5",
      number: 5,
      title: "Kimyoviy Bog'lanish",
      description: "VB nazariyasi, kristall maydon, Yan-Teller",
      icon: "🔗",
      topics: ["VB nazariyasi", "Kristall maydon", "Yan-Teller"],
    },
    {
      id: "step6",
      number: 6,
      title: "Video Darsliklar",
      description: "Barcha mavzular bo'yicha videolar va testlar",
      icon: "🎬",
      topics: ["Video", "Testlar", "Takrorlash"],
    },
  ];

  const getProgressColor = (stepId: string) => {
    const progressValue = progress[stepId as keyof typeof progress] || 0;
    if (progressValue === 0) return "bg-gray-300";
    if (progressValue < 50) return "bg-yellow-400";
    if (progressValue < 100) return "bg-blue-400";
    return "bg-green-400";
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              📚 O'quv Kurslari
            </Text>
            <Text className="text-sm text-muted">
              Kompleks birikmalar asoslari — 6 ta bosqich
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

          {/* Steps */}
          <View className="gap-3">
            {steps.map((step) => (
              <TouchableOpacity
                key={step.id}
                onPress={() => {
                  // Navigate to lesson detail
                  router.push({
                    pathname: "/(tabs)/lesson",
                    params: { stepId: step.id, stepNumber: step.number },
                  } as any);
                }}
                className="bg-surface rounded-lg p-4 border border-border active:opacity-80"
              >
                <View className="flex-row items-start gap-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-2xl">{step.icon}</Text>
                      <Text className="text-xs font-semibold text-muted">
                        Bosqich {step.number}
                      </Text>
                    </View>
                    <Text className="text-lg font-semibold text-foreground mb-1">
                      {step.title}
                    </Text>
                    <Text className="text-sm text-muted mb-2">
                      {step.description}
                    </Text>
                    <View className="flex-row flex-wrap gap-1">
                      {step.topics.map((topic, idx) => (
                        <View
                          key={idx}
                          className="bg-primary/10 px-2 py-1 rounded"
                        >
                          <Text className="text-xs text-primary font-medium">
                            {topic}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="items-end">
                    <View
                      className={`w-12 h-12 rounded-full ${getProgressColor(step.id)} items-center justify-center`}
                    >
                      <Text className="text-xs font-bold text-white">
                        {progress[step.id as keyof typeof progress] || 0}%
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tips */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <Text className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🚀 Qanday boshlash kerak?
            </Text>
            <Text className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              1. Nomlanishi — kimyoning alifbosi{"\n"}
              2. Klassifikatsiyasi — tizimli tushunish{"\n"}
              3. Fazoviy tuzilishi — 3D tasavvur{"\n"}
              4. Har bir bo'limdan keyin testlarni yeching
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
