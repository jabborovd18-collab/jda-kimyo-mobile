import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { useState, useMemo, useEffect } from "react";

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

const ITEMS_PER_PAGE = 50;

/**
 * Reactions Screen - Reaksiyalar
 * 1000+ reaksiya, Pagination, Lazy Loading
 */
export default function ReactionsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Indeksni oddiy raqamga o'tkazish funksiyasi
  const normalizeFormula = (text: string): string => {
    // H2 → H₂, O2 → O₂, va boshqalar
    return text.replace(/(\D)(\d+)/g, (match, letter, number) => {
      const subscripts: Record<string, string> = {
        "0": "₀",
        "1": "₁",
        "2": "₂",
        "3": "₃",
        "4": "₄",
        "5": "₅",
        "6": "₆",
        "7": "₇",
        "8": "₈",
        "9": "₉",
      };
      return (
        letter + number.split("").map((d: string) => subscripts[d] || d).join("")
      );
    });
  };

  // Indeksni oddiy raqamga o'tkazish (H₂ → H2)
  const removeSubscripts = (text: string): string => {
    const subscriptMap: Record<string, string> = {
      "₀": "0",
      "₁": "1",
      "₂": "2",
      "₃": "3",
      "₄": "4",
      "₅": "5",
      "₆": "6",
      "₇": "7",
      "₈": "8",
      "₉": "9",
    };
    return text.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subscriptMap[match] || match);
  };

  const filteredReactions = useMemo(() => {
    const normalizedSearch = normalizeFormula(searchText.toLowerCase());
    const searchLower = searchText.toLowerCase();
    const searchWithoutSubscripts = removeSubscripts(searchLower);

    return (reactionsData as Reaction[]).filter((reaction) => {
      // Nomi bo'yicha qidiruv
      const matchesName = reaction.name.toLowerCase().includes(searchLower);

      // Tenglamada qidiruv (indeks bilan va indekssiz)
      const equationLower = reaction.equation.toLowerCase();
      const equationWithoutSubscripts = removeSubscripts(equationLower);
      const normalizedEquation = normalizeFormula(equationLower);
      
      const matchesEquation =
        equationLower.includes(searchLower) || // Exact match
        normalizedEquation.includes(normalizedSearch) || // Normalized match
        equationLower.includes(normalizeFormula(searchLower)) || // Formula with subscripts
        equationWithoutSubscripts.includes(searchWithoutSubscripts) || // Formula without subscripts (H3PO4 → h3po4)
        equationLower.includes(searchWithoutSubscripts); // Search without subscripts in equation

      // Kategoriya bo'yicha filtr
      const matchesCategory =
        selectedCategory === "all" || reaction.category === selectedCategory;

      return (matchesName || matchesEquation) && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredReactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReactions = filteredReactions.slice(startIndex, endIndex);

  // Qidiruv yoki kategoriya o'zgarsa, birinchi sahifaga qaytarish
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory]);

  // Sahifa sonini 10 tagacha cheklash
  const visiblePages = useMemo(() => {
    const maxVisible = 10;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(1, currentPage - 4);
    const end = Math.min(totalPages, start + maxVisible - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

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
              placeholder="Reaksiya qidiruv (H2, O2, Suv, ...)"
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
            {paginatedReactions.length > 0 ? (
              <FlatList
                data={paginatedReactions}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item: reaction }) => (
                  <Pressable
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
                        style={{
                          backgroundColor: getCategoryColor(reaction.category),
                        }}
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
                )}
              />
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-lg text-muted">Reaksiya topilmadi</Text>
              </View>
            )}
          </View>

          {/* Pagination */}
          {filteredReactions.length > ITEMS_PER_PAGE && (
            <View className="gap-3 mt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">
                  {startIndex + 1}-{Math.min(endIndex, filteredReactions.length)}{" "}
                  / {filteredReactions.length}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1 ? "bg-border opacity-50" : "bg-primary"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        currentPage === 1 ? "text-muted" : "text-background"
                      }`}
                    >
                      ← Oldingi
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? "bg-border opacity-50"
                        : "bg-primary"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        currentPage === totalPages
                          ? "text-muted"
                          : "text-background"
                      }`}
                    >
                      Keyingi →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row items-center justify-center gap-1">
                {visiblePages.map((page) => (
                  <TouchableOpacity
                    key={page}
                    onPress={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg items-center justify-center ${
                      currentPage === page
                        ? "bg-primary"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        currentPage === page
                          ? "text-background"
                          : "text-foreground"
                      }`}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
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
                  <Pressable
                    onPress={() => setSelectedReaction(null)}
                    className="self-end"
                  >
                    <Text className="text-2xl text-foreground">✕</Text>
                  </Pressable>

                  {/* Title */}
                  <View className="gap-2">
                    <Text className="text-2xl font-bold text-foreground">
                      {selectedReaction.name}
                    </Text>
                    <View
                      className="px-3 py-1 rounded self-start"
                      style={{
                        backgroundColor: getCategoryColor(
                          selectedReaction.category
                        ),
                      }}
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
                        <Text className="text-base text-foreground">
                          {item.value}
                        </Text>
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
