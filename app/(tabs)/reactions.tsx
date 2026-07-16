import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { useState, useMemo } from "react";

import { ScreenContainer } from "@/components/screen-container";
import reactionsData from "@/lib/data/reactions.json";

interface Reaction {
  id: number;
  name: string;
  equation: string;
  category: string;
  conditions: string;
  catalyst: string;
  technique: string;
  products: string;
  intensity: string;
}

/**
 * Reactions Screen - Reaksiyalar
 * 100+ reaksiya, Qidiruv, Kategoriyalar, Batafsil ma'lumot
 */
export default function ReactionsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);

  const categories = [
    "all",
    "Sintez",
    "Oksidlanish",
    "Asid-baza",
    "Dehidratatsiya",
    "Dehidrogenatsiya",
    "Fermentatsiya",
  ];

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      Sintez: "#FF6B6B",
      Oksidlanish: "#4ECDC4",
      "Asid-baza": "#FFE66D",
      Dehidratatsiya: "#95E1D3",
      Dehidrogenatsiya: "#C7CEEA",
      Fermentatsiya: "#B19CD9",
    };
    return categoryColors[category] || "#999";
  };

  const filteredReactions = useMemo(() => {
    return (reactionsData as Reaction[]).filter((reaction) => {
      const matchesSearch =
        reaction.name.toLowerCase().includes(searchText.toLowerCase()) ||
        reaction.equation.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || reaction.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              ⚗️ Reaksiyalar
            </Text>
            <Text className="text-sm text-muted">
              {filteredReactions.length} ta reaksiya topildi
            </Text>
          </View>

          {/* Search */}
          <View className="flex-row items-center gap-2 bg-surface rounded-lg border border-border px-3 py-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Reaksiya qidiruv..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-foreground"
            />
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-2"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? "bg-primary"
                    : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedCategory === category
                      ? "text-background"
                      : "text-foreground"
                  }`}
                >
                  {category === "all" ? "Barcha" : category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Reactions List */}
          <View className="gap-3">
            {filteredReactions.length > 0 ? (
              filteredReactions.map((reaction) => (
                <Pressable
                  key={reaction.id}
                  onPress={() => setSelectedReaction(reaction)}
                  className="bg-surface rounded-lg p-4 border border-border active:opacity-80"
                >
                  {/* Name & Category */}
                  <View className="flex-row items-start justify-between mb-2 gap-2">
                    <Text className="flex-1 text-base font-bold text-foreground">
                      {reaction.name}
                    </Text>
                    <View
                      className="px-2 py-1 rounded"
                      style={{ backgroundColor: getCategoryColor(reaction.category) }}
                    >
                      <Text className="text-xs font-semibold text-white">
                        {reaction.category}
                      </Text>
                    </View>
                  </View>

                  {/* Equation */}
                  <Text className="text-sm font-mono text-primary mb-3">
                    {reaction.equation}
                  </Text>

                  {/* Details */}
                  <View className="gap-2 border-t border-border pt-3">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Sharoit:</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {reaction.conditions}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Katalizator:</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {reaction.catalyst}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Intensivlik:</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {reaction.intensity}
                      </Text>
                    </View>
                  </View>

                  {/* More Button */}
                  <Text className="text-sm text-primary font-semibold mt-3">
                    Batafsil ma'lumot →
                  </Text>
                </Pressable>
              ))
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-lg text-muted">Reaksiya topilmadi</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Reaction Details Modal */}
      <Modal visible={!!selectedReaction} animationType="slide" transparent>
        <View className="flex-1 bg-black/50">
          <View className="flex-1 bg-background rounded-t-3xl mt-auto">
            <ScrollView showsVerticalScrollIndicator={false} className="p-6">
              {selectedReaction && (
                <View className="gap-4">
                  {/* Close Button */}
                  <Pressable onPress={() => setSelectedReaction(null)} className="self-end">
                    <Text className="text-2xl text-foreground">✕</Text>
                  </Pressable>

                  {/* Title */}
                  <View className="gap-2">
                    <Text className="text-2xl font-bold text-foreground">
                      {selectedReaction.name}
                    </Text>
                    <View
                      className="px-3 py-1 rounded self-start"
                      style={{ backgroundColor: getCategoryColor(selectedReaction.category) }}
                    >
                      <Text className="text-xs font-semibold text-white">
                        {selectedReaction.category}
                      </Text>
                    </View>
                  </View>

                  {/* Equation */}
                  <View className="bg-surface border border-border rounded-lg p-4 gap-2">
                    <Text className="text-xs font-semibold text-muted">
                      REAKSIYA TENGLAMASI
                    </Text>
                    <Text className="text-lg font-mono text-foreground">
                      {selectedReaction.equation}
                    </Text>
                  </View>

                  {/* Details Grid */}
                  <View className="gap-3">
                    {[
                      {
                        label: "SHAROIT",
                        value: selectedReaction.conditions,
                        icon: "🌡️",
                      },
                      {
                        label: "KATALIZATOR",
                        value: selectedReaction.catalyst,
                        icon: "⚙️",
                      },
                      {
                        label: "TEKNIKA",
                        value: selectedReaction.technique,
                        icon: "🧪",
                      },
                      {
                        label: "O'RTA MAHSULOT",
                        value: selectedReaction.products,
                        icon: "🧬",
                      },
                      {
                        label: "INTENSIVLIGI",
                        value: selectedReaction.intensity,
                        icon: "💥",
                      },
                    ].map((item) => (
                      <View
                        key={item.label}
                        className="bg-surface border border-border rounded-lg p-4 gap-2"
                      >
                        <Text className="text-xs font-semibold text-muted">
                          {item.icon} {item.label}
                        </Text>
                        <Text className="text-base text-foreground">{item.value}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={() => setSelectedReaction(null)}
                    className="bg-primary rounded-lg py-3 mt-4"
                  >
                    <Text className="text-center font-semibold text-background">
                      Yopish
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
