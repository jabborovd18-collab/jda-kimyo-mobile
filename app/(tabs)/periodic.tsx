import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { useState, useMemo } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { PERIODIC_TABLE, searchElements } from "@/lib/data/periodic-table";
import { useColors } from "@/hooks/use-colors";

/**
 * Periodic Table Screen - Davriy Jadval
 * To'g'ri struktura: 7 davr, 18 guruh
 */

const PERIODS = 7;
const GROUPS = 18;

// Element kategoriyasi bo'yicha ranglar
const getCategoryColor = (number: number): string => {
  // Alkali metallar (1-davr, 1-guruh)
  if (number === 3 || number === 11 || number === 19 || number === 37 || number === 55 || number === 87) return "#FF6B6B";
  // Alkaline earth metallar (2-guruh)
  if (number === 4 || number === 12 || number === 20 || number === 38 || number === 56 || number === 88) return "#FFA500";
  // Transition metallar (3-12 guruh)
  if ((number >= 21 && number <= 30) || (number >= 39 && number <= 48) || (number >= 72 && number <= 80) || (number >= 104 && number <= 112)) return "#9D84B7";
  // Lantanidlar
  if (number >= 58 && number <= 71) return "#B19CD9";
  // Aktinidlar
  if (number >= 90 && number <= 103) return "#D4A5D4";
  // Metallar (13-guruh)
  if (number === 13 || number === 31 || number === 49 || number === 81 || number === 113) return "#FFD700";
  // Metalloidlar
  if (number === 5 || number === 14 || number === 32 || number === 33 || number === 51 || number === 52 || number === 84 || number === 85) return "#A9A9A9";
  // Nonmetallar
  if (number === 1 || number === 6 || number === 7 || number === 8 || number === 15 || number === 16 || number === 34) return "#90EE90";
  // Halogenlar (17-guruh)
  if (number === 9 || number === 17 || number === 35 || number === 53 || number === 85 || number === 117) return "#FFB6C1";
  // Noble gaslar (18-guruh)
  if (number === 2 || number === 10 || number === 18 || number === 36 || number === 54 || number === 86 || number === 118) return "#87CEEB";
  
  return "#999";
};

export default function PeriodicScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const colors = useColors();

  // Davriy jadvalning to'g'ri strukturasi
  const periodicGrid: (any | null)[][] = Array(PERIODS).fill(null).map(() => Array(GROUPS).fill(null));

  // Elementlarni to'g'ri joyga qo'yish
  PERIODIC_TABLE.forEach((el) => {
    if (el.period >= 1 && el.period <= PERIODS && el.group >= 1 && el.group <= GROUPS) {
      periodicGrid[el.period - 1][el.group - 1] = el;
    }
  });

  // Qidiruv
  const filteredElements = useMemo(() => {
    if (!searchText) return [];
    return searchElements(searchText);
  }, [searchText]);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-primary/10 px-4 pt-4 pb-3 gap-2">
          <Text className="text-2xl font-bold text-foreground">📊 Davriy Jadval</Text>
          
          {/* Search */}
          <View className="flex-row items-center gap-2 bg-surface rounded-lg border border-border px-3 py-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Element qidiruv..."
              placeholderTextColor={colors.muted}
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-foreground text-sm"
              style={{ color: colors.foreground }}
            />
          </View>
        </View>

        {/* Search Results */}
        {searchText && filteredElements.length > 0 && (
          <View className="px-4 py-3 bg-surface/50 border-b border-border gap-2">
            <Text className="text-xs font-semibold text-muted uppercase">Qidiruv Natijalari ({filteredElements.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {filteredElements.map((el) => (
                <TouchableOpacity
                  key={el.id}
                  onPress={() => setSelectedElement(el)}
                  className="px-3 py-2 rounded-lg border border-border active:opacity-70"
                  style={{ backgroundColor: getCategoryColor(el.number) + "30", borderColor: getCategoryColor(el.number) }}
                >
                  <Text className="text-sm font-bold text-foreground">{el.symbol}</Text>
                  <Text className="text-xs text-muted">{el.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Periodic Table Grid */}
        {!searchText && (
          <View className="px-2 py-4 gap-1">
            {periodicGrid.map((row, periodIndex) => (
              <View key={periodIndex} className="flex-row gap-1 justify-start">
                {row.map((element, groupIndex) => (
                  <View key={`${periodIndex}-${groupIndex}`} className="flex-1">
                    {element ? (
                      <TouchableOpacity
                        onPress={() => setSelectedElement(element)}
                        className="rounded-md p-1 border border-border active:opacity-70"
                        style={{
                          backgroundColor: getCategoryColor(element.number) + "40",
                          borderColor: getCategoryColor(element.number),
                          minHeight: 50,
                        }}
                      >
                        <Text className="text-xs text-muted text-center">{element.number}</Text>
                        <Text className="text-sm font-bold text-foreground text-center">{element.symbol}</Text>
                        <Text className="text-xs text-muted text-center leading-tight">{element.mass.toFixed(2)}</Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="flex-1" />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Element Detail Modal */}
      <Modal visible={selectedElement !== null} animationType="slide" transparent>
        <View className="flex-1 bg-background/80">
          <ScreenContainer className="p-4 justify-between">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {selectedElement && (
                <View className="gap-4">
                  {/* Header */}
                  <View
                    className="rounded-xl p-6 gap-3"
                    style={{ backgroundColor: getCategoryColor(selectedElement.number) + "30" }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-5xl font-bold text-foreground">{selectedElement.symbol}</Text>
                        <Text className="text-lg text-muted">{selectedElement.name}</Text>
                      </View>
                      <View className="items-end gap-1">
                        <Text className="text-2xl font-bold text-primary">#{selectedElement.number}</Text>
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
                    <Text className="text-lg font-bold text-foreground">{selectedElement.category}</Text>
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
