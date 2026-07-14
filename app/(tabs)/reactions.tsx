import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Reactions Screen - Reaksiyalar
 * Qidiruv, Kategoriyalar, Batafsil ma'lumot
 */
export default function ReactionsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const reactions = [
    {
      id: 1,
      equation: "2H₂ + O₂ → 2H₂O",
      type: "Sintez",
      temperature: "300-400°C",
      catalyst: "Pt, Ni, Fe",
      intensity: "0.5 mol/L",
      intermediate: "H₂O₂",
    },
    {
      id: 2,
      equation: "2Na + Cl₂ → 2NaCl",
      type: "Sintez",
      temperature: "25°C",
      catalyst: "Yo'q",
      intensity: "1.0 mol/L",
      intermediate: "Yo'q",
    },
    {
      id: 3,
      equation: "CaCO₃ → CaO + CO₂",
      type: "Parchalanish",
      temperature: "825°C",
      catalyst: "Yo'q",
      intensity: "Qattiq",
      intermediate: "Yo'q",
    },
    {
      id: 4,
      equation: "2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂ + 8H₂O",
      type: "Redoks",
      temperature: "25°C",
      catalyst: "Yo'q",
      intensity: "0.1 mol/L",
      intermediate: "Cl₂",
    },
    {
      id: 5,
      equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      type: "Yonish",
      temperature: "300-400°C",
      catalyst: "Yo'q",
      intensity: "1.0 mol/L",
      intermediate: "CO",
    },
  ];

  const categories = ["all", "Sintez", "Parchalanish", "Redoks", "Yonish"];

  const filteredReactions = reactions.filter((reaction) => {
    const matchesSearch =
      reaction.equation.toLowerCase().includes(searchText.toLowerCase()) ||
      reaction.type.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || reaction.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              Kimyoviy reaksiyalarni qidiruv va o'rganish
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
                <TouchableOpacity
                  key={reaction.id}
                  className="bg-surface rounded-lg p-4 border border-border active:opacity-80"
                >
                  {/* Equation */}
                  <Text className="text-base font-bold text-primary mb-2">
                    {reaction.equation}
                  </Text>

                  {/* Type */}
                  <View className="flex-row items-center gap-2 mb-3">
                    <View className="bg-primary/10 px-2 py-1 rounded">
                      <Text className="text-xs text-primary font-semibold">
                        {reaction.type}
                      </Text>
                    </View>
                  </View>

                  {/* Details */}
                  <View className="gap-2 border-t border-border pt-3">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Temperatura:</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {reaction.temperature}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Katalizator:</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {reaction.catalyst}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">
                        Eritmaning intensivligi:
                      </Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {reaction.intensity}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">
                        O'rtaliq hosil bo'ladigan:
                      </Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {reaction.intermediate}
                      </Text>
                    </View>
                  </View>

                  {/* More Button */}
                  <Text className="text-sm text-primary font-semibold mt-3">
                    Batafsil ma'lumot →
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-lg text-muted">
                  Reaksiya topilmadi
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
