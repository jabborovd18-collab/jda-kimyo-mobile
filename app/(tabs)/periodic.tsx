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
 * Periodic Table Screen - Davriy Jadval
 * Interaktiv jadval va elementlar ma'lumoti
 */
export default function PeriodicScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const elements = [
    {
      id: "H",
      name: "Vodorod",
      number: 1,
      mass: 1.008,
      electrons: "1s¹",
      valence: 1,
      electroneg: 2.1,
    },
    {
      id: "He",
      name: "Geliy",
      number: 2,
      mass: 4.003,
      electrons: "1s²",
      valence: 0,
      electroneg: 0,
    },
    {
      id: "C",
      name: "Uglerod",
      number: 6,
      mass: 12.01,
      electrons: "[He] 2s² 2p²",
      valence: 4,
      electroneg: 2.55,
    },
    {
      id: "N",
      name: "Azot",
      number: 7,
      mass: 14.01,
      electrons: "[He] 2s² 2p³",
      valence: 3,
      electroneg: 3.04,
    },
    {
      id: "O",
      name: "Kislorod",
      number: 8,
      mass: 15.999,
      electrons: "[He] 2s² 2p⁴",
      valence: 2,
      electroneg: 3.44,
    },
    {
      id: "Na",
      name: "Natriy",
      number: 11,
      mass: 22.99,
      electrons: "[Ne] 3s¹",
      valence: 1,
      electroneg: 0.93,
    },
    {
      id: "Cl",
      name: "Xlor",
      number: 17,
      mass: 35.45,
      electrons: "[Ne] 3s² 3p⁵",
      valence: 1,
      electroneg: 3.16,
    },
    {
      id: "Fe",
      name: "Temir",
      number: 26,
      mass: 55.845,
      electrons: "[Ar] 3d⁶ 4s²",
      valence: 2,
      electroneg: 1.83,
    },
  ];

  const filteredElements = elements.filter(
    (el) =>
      el.name.toLowerCase().includes(searchText.toLowerCase()) ||
      el.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedElementData = selectedElement
    ? elements.find((el) => el.id === selectedElement)
    : null;

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              📊 Davriy Jadval
            </Text>
            <Text className="text-sm text-muted">
              Elementlarni qidiruv va o'rganish
            </Text>
          </View>

          {/* Search */}
          <View className="flex-row items-center gap-2 bg-surface rounded-lg border border-border px-3 py-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Element qidiruv..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-foreground"
            />
          </View>

          {/* Elements Grid */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Elementlar
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {filteredElements.map((element) => (
                <TouchableOpacity
                  key={element.id}
                  onPress={() => setSelectedElement(element.id)}
                  className={`flex-1 min-w-[30%] rounded-lg p-3 items-center justify-center ${
                    selectedElement === element.id
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      selectedElement === element.id
                        ? "text-background"
                        : "text-primary"
                    }`}
                  >
                    {element.id}
                  </Text>
                  <Text
                    className={`text-xs ${
                      selectedElement === element.id
                        ? "text-background"
                        : "text-muted"
                    }`}
                  >
                    {element.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Element Details */}
          {selectedElementData && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="items-center gap-2 pb-3 border-b border-border">
                <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
                  <Text className="text-3xl font-bold text-background">
                    {selectedElementData.id}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-foreground">
                  {selectedElementData.name}
                </Text>
              </View>

              {/* Basic Info */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  📋 Asosiy Ma'lumotlar
                </Text>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Atom raqami:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedElementData.number}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Atom massasi:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedElementData.mass} u
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Valentlik:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedElementData.valence}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Elektronegativlik:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedElementData.electroneg}
                  </Text>
                </View>
              </View>

              {/* Electron Configuration */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  ⚛️ Elektronlar Tuzilishi
                </Text>
                <View className="bg-primary/10 rounded-lg p-2">
                  <Text className="text-xs text-primary font-mono">
                    {selectedElementData.electrons}
                  </Text>
                </View>
              </View>

              {/* Interesting Facts */}
              <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <Text className="text-xs text-blue-800 dark:text-blue-200">
                  💡 Elementning qiziqarli xususiyatlari haqida ma'lumot keyinroq
                  qo'shiladi.
                </Text>
              </View>
            </View>
          )}

          {/* Info */}
          {!selectedElementData && (
            <View className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <Text className="text-sm text-yellow-800 dark:text-yellow-200">
                Element tanlang va batafsil ma'lumotni ko'ring
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
