import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { PERIODIC_TABLE, searchElements, PeriodicElement, ELEMENT_COLORS } from "@/lib/data/periodic-table";
import { useColors } from "@/hooks/use-colors";

/**
 * Periodic Table Screen - Davriy Jadval
 * 118 ta element, qidiruv, filtrash, batafsil ma'lumot
 */

export default function PeriodicScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const colors = useColors();

  const filteredElements = searchText
    ? searchElements(searchText)
    : filterCategory
      ? PERIODIC_TABLE.filter((el) => el.category === filterCategory)
      : PERIODIC_TABLE;

  const categories = ["Alkali metal", "Alkaline earth metal", "Transition metal", "Metal", "Metalloid", "Nonmetal", "Halogen", "Noble gas"];

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      "Alkali metal": "🔴",
      "Alkaline earth metal": "🟠",
      "Transition metal": "🟣",
      "Metal": "🟡",
      "Metalloid": "⬜",
      "Nonmetal": "🟢",
      "Halogen": "🟠",
      "Noble gas": "🔵",
    };
    return emojiMap[category] || "⚛️";
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "Alkali metal": "#FF6B6B",
      "Alkaline earth metal": "#FFA500",
      "Transition metal": "#9D84B7",
      "Metal": "#FFD700",
      "Metalloid": "#A9A9A9",
      "Nonmetal": "#90EE90",
      "Halogen": "#FFB6C1",
      "Noble gas": "#87CEEB",
    };
    return colorMap[category] || "#999";
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 pt-4 pb-4 gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-3xl">📊</Text>
              <View>
                <Text className="text-2xl font-bold text-foreground">Davriy Jadval</Text>
                <Text className="text-xs text-muted">118 ta element</Text>
              </View>
            </View>
          </View>

          {/* Search */}
          <View className="flex-row items-center gap-2 bg-surface rounded-lg border border-border px-3 py-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Element qidiruv (H, O, Fe...)"
              placeholderTextColor={colors.muted}
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-foreground text-sm"
              style={{ color: colors.foreground }}
            />
          </View>
        </View>

        <View className="px-4 py-4 gap-4">
          {/* Category Filters */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted uppercase">Kategoriya bo'yicha:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              <TouchableOpacity
                onPress={() => setFilterCategory(null)}
                className={`px-3 py-2 rounded-full ${
                  filterCategory === null ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    filterCategory === null ? "text-background" : "text-foreground"
                  }`}
                >
                  Barcha
                </Text>
              </TouchableOpacity>

              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setFilterCategory(category)}
                  className={`px-3 py-2 rounded-full ${
                    filterCategory === category ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      filterCategory === category ? "text-background" : "text-foreground"
                    }`}
                  >
                    {getCategoryEmoji(category)} {category.substring(0, 8)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Elements Grid */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              {filteredElements.length} ta element
            </Text>

            <FlatList
              data={filteredElements}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              numColumns={4}
              columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedElement(item)}
                  className="flex-1 rounded-lg border border-border p-2 active:opacity-70"
                  style={{
                    backgroundColor: getCategoryColor(item.category) + "20",
                    borderColor: getCategoryColor(item.category),
                  }}
                >
                  <View className="gap-1">
                    <Text className="text-xs text-muted text-center">{item.number}</Text>
                    <Text className="text-lg font-bold text-foreground text-center">{item.symbol}</Text>
                    <Text className="text-xs text-muted text-center leading-tight">{item.name.substring(0, 8)}</Text>
                    <Text className="text-xs text-primary text-center font-mono">{item.mass.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* Element Detail Modal */}
      <Modal visible={selectedElement !== null} animationType="slide" transparent>
        <View className="flex-1 bg-background/80">
          <ScreenContainer className="p-4 justify-between">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {selectedElement && (
                <View className="gap-4">
                  {/* Header with Element Card */}
                  <View
                    className="rounded-xl p-6 gap-3"
                    style={{ backgroundColor: getCategoryColor(selectedElement.category) + "30" }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-5xl font-bold text-foreground">{selectedElement.symbol}</Text>
                        <Text className="text-lg text-muted">{selectedElement.name}</Text>
                      </View>
                      <View className="items-end gap-1">
                        <Text className="text-2xl">{getCategoryEmoji(selectedElement.category)}</Text>
                        <Text className="text-xs text-muted">#{selectedElement.number}</Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2">
                      <View className="flex-1 bg-surface rounded-lg p-2">
                        <Text className="text-xs text-muted">Massa</Text>
                        <Text className="text-sm font-bold text-foreground">{selectedElement.mass.toFixed(3)}</Text>
                      </View>
                      <View className="flex-1 bg-surface rounded-lg p-2">
                        <Text className="text-xs text-muted">Davr</Text>
                        <Text className="text-sm font-bold text-foreground">{selectedElement.period}</Text>
                      </View>
                      <View className="flex-1 bg-surface rounded-lg p-2">
                        <Text className="text-xs text-muted">Guruh</Text>
                        <Text className="text-sm font-bold text-foreground">{selectedElement.group}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                    <Text className="text-sm font-semibold text-foreground">Tavsif</Text>
                    <Text className="text-sm text-muted leading-relaxed">{selectedElement.description}</Text>
                  </View>

                  {/* Physical Properties */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                    <Text className="text-sm font-semibold text-foreground">Fizik Xususiyatlari</Text>
                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Zichlik:</Text>
                        <Text className="text-sm font-mono text-foreground">{selectedElement.density} g/cm³</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Erivish nuqtasi:</Text>
                        <Text className="text-sm font-mono text-foreground">{selectedElement.meltingPoint}°C</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Qaynash nuqtasi:</Text>
                        <Text className="text-sm font-mono text-foreground">{selectedElement.boilingPoint}°C</Text>
                      </View>
                    </View>
                  </View>

                  {/* Atomic Properties */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                    <Text className="text-sm font-semibold text-foreground">Atom Xususiyatlari</Text>
                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Protonlar:</Text>
                        <Text className="text-sm font-mono text-foreground">{selectedElement.protons}</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Elektronlar:</Text>
                        <Text className="text-sm font-mono text-foreground">{selectedElement.electrons}</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Neytronlar:</Text>
                        <Text className="text-sm font-mono text-foreground">{selectedElement.neutrons}</Text>
                      </View>
                      <View className="gap-1 mt-2 pt-2 border-t border-border">
                        <Text className="text-xs text-muted">Elektron Konfiguratsiyasi:</Text>
                        <Text className="text-xs font-mono text-primary">{selectedElement.electronConfiguration}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Discovery Info */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                    <Text className="text-sm font-semibold text-foreground">Kashfiyot</Text>
                    <View className="gap-1">
                      <Text className="text-sm text-muted">
                        Yil: <Text className="text-foreground font-mono">{selectedElement.discovered}</Text>
                      </Text>
                      <Text className="text-sm text-muted">
                        Kashfiyotchi: <Text className="text-foreground">{selectedElement.discoverer}</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Category Badge */}
                  <View className="flex-row items-center gap-2 bg-primary/10 rounded-lg p-3 border border-primary">
                    <Text className="text-lg">{getCategoryEmoji(selectedElement.category)}</Text>
                    <Text className="text-sm font-semibold text-foreground">{selectedElement.category}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setSelectedElement(null)}
              className="bg-primary rounded-lg p-4 mt-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-background">Yopish</Text>
            </TouchableOpacity>
          </ScreenContainer>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
