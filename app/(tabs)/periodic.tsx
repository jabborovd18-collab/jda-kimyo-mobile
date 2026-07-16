import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Periodic Table Screen - Davriy Jadval
 * To'liq interaktiv davriy jadval
 */

// Davriy jadvalning to'liq ma'lumotlari
const PERIODIC_TABLE_DATA = [
  // 1-davr
  { id: "H", name: "Vodorod", number: 1, mass: 1.008, group: 1, period: 1, color: "bg-yellow-200" },
  { id: "He", name: "Geliy", number: 2, mass: 4.003, group: 18, period: 1, color: "bg-blue-200" },

  // 2-davr
  { id: "Li", name: "Litiy", number: 3, mass: 6.941, group: 1, period: 2, color: "bg-red-200" },
  { id: "Be", name: "Berilliy", number: 4, mass: 9.012, group: 2, period: 2, color: "bg-green-200" },
  { id: "B", name: "Bor", number: 5, mass: 10.81, group: 13, period: 2, color: "bg-orange-200" },
  { id: "C", name: "Uglerod", number: 6, mass: 12.01, group: 14, period: 2, color: "bg-gray-400" },
  { id: "N", name: "Azot", number: 7, mass: 14.01, group: 15, period: 2, color: "bg-blue-300" },
  { id: "O", name: "Kislorod", number: 8, mass: 15.999, group: 16, period: 2, color: "bg-red-300" },
  { id: "F", name: "Ftor", number: 9, mass: 18.998, group: 17, period: 2, color: "bg-yellow-300" },
  { id: "Ne", name: "Neon", number: 10, mass: 20.18, group: 18, period: 2, color: "bg-blue-200" },

  // 3-davr
  { id: "Na", name: "Natriy", number: 11, mass: 22.99, group: 1, period: 3, color: "bg-red-200" },
  { id: "Mg", name: "Magniy", number: 12, mass: 24.305, group: 2, period: 3, color: "bg-green-200" },
  { id: "Al", name: "Alyuminiy", number: 13, mass: 26.98, group: 13, period: 3, color: "bg-orange-200" },
  { id: "Si", name: "Kremniy", number: 14, mass: 28.09, group: 14, period: 3, color: "bg-gray-400" },
  { id: "P", name: "Fosfor", number: 15, mass: 30.97, group: 15, period: 3, color: "bg-orange-300" },
  { id: "S", name: "Oltingugurt", number: 16, mass: 32.06, group: 16, period: 3, color: "bg-yellow-300" },
  { id: "Cl", name: "Xlor", number: 17, mass: 35.45, group: 17, period: 3, color: "bg-yellow-300" },
  { id: "Ar", name: "Argon", number: 18, mass: 39.95, group: 18, period: 3, color: "bg-blue-200" },

  // 4-davr (tanlanganlar)
  { id: "K", name: "Kaliy", number: 19, mass: 39.10, group: 1, period: 4, color: "bg-red-200" },
  { id: "Ca", name: "Kalsiy", number: 20, mass: 40.08, group: 2, period: 4, color: "bg-green-200" },
  { id: "Fe", name: "Temir", number: 26, mass: 55.845, group: 8, period: 4, color: "bg-purple-300" },
  { id: "Cu", name: "Mis", number: 29, mass: 63.546, group: 11, period: 4, color: "bg-purple-300" },
  { id: "Zn", name: "Rux", number: 30, mass: 65.38, group: 12, period: 4, color: "bg-purple-300" },
  { id: "Br", name: "Brom", number: 35, mass: 79.904, group: 17, period: 4, color: "bg-red-400" },

  // 5-davr (tanlanganlar)
  { id: "Ag", name: "Kumush", number: 47, mass: 107.87, group: 11, period: 5, color: "bg-purple-300" },
  { id: "I", name: "Yod", number: 53, mass: 126.90, group: 17, period: 5, color: "bg-purple-400" },

  // 6-davr
  { id: "Au", name: "Oltin", number: 79, mass: 196.97, group: 11, period: 6, color: "bg-yellow-400" },
];

export default function PeriodicScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedElement, setSelectedElement] = useState<typeof PERIODIC_TABLE_DATA[0] | null>(null);
  const [filterGroup, setFilterGroup] = useState<number | null>(null);

  const filteredElements = PERIODIC_TABLE_DATA.filter((el) => {
    const matchesSearch =
      el.name.toLowerCase().includes(searchText.toLowerCase()) ||
      el.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesGroup = filterGroup === null || el.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const groups = [
    { id: 1, name: "Щелочные металлы" },
    { id: 2, name: "Щелочноземельные" },
    { id: 13, name: "Бор-углерод" },
    { id: 14, name: "Углерод" },
    { id: 15, name: "Азот" },
    { id: 16, name: "Кислород" },
    { id: 17, name: "Галогены" },
    { id: 18, name: "Благородные газы" },
  ];

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
              Kimyoviy elementlarni qidiruv va o'rganish
            </Text>
          </View>

          {/* Search */}
          <View className="flex-row items-center gap-2 bg-surface rounded-lg border border-border px-3 py-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Element qidiruv (nomi yoki raqami)..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-foreground"
            />
          </View>

          {/* Group Filters */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Guruhlar bo'yicha filtrlar:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-2"
            >
              <TouchableOpacity
                onPress={() => setFilterGroup(null)}
                className={`px-3 py-1 rounded-full ${
                  filterGroup === null
                    ? "bg-primary"
                    : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    filterGroup === null ? "text-background" : "text-foreground"
                  }`}
                >
                  Barcha
                </Text>
              </TouchableOpacity>

              {groups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => setFilterGroup(group.id)}
                  className={`px-3 py-1 rounded-full ${
                    filterGroup === group.id
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      filterGroup === group.id
                        ? "text-background"
                        : "text-foreground"
                    }`}
                  >
                    {group.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Elements Grid */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Topilgan elementlar: {filteredElements.length}
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {filteredElements.map((element) => (
                <TouchableOpacity
                  key={element.id}
                  onPress={() => setSelectedElement(element)}
                  className={`w-[30%] rounded-lg p-2 items-center justify-center ${
                    selectedElement?.id === element.id
                      ? "bg-primary border-2 border-primary"
                      : element.color + " border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      selectedElement?.id === element.id
                        ? "text-background"
                        : "text-foreground"
                    }`}
                  >
                    {element.id}
                  </Text>
                  <Text
                    className={`text-xs ${
                      selectedElement?.id === element.id
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
          {selectedElement && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              {/* Header */}
              <View className="items-center gap-2 pb-3 border-b border-border">
                <View
                  className={`w-16 h-16 rounded-full ${selectedElement.color} items-center justify-center border-2 border-primary`}
                >
                  <Text className="text-3xl font-bold text-foreground">
                    {selectedElement.id}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-foreground">
                  {selectedElement.name}
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
                    {selectedElement.number}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Atom massasi:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedElement.mass} u
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Davr:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedElement.period}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Guruhi:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedElement.group}
                  </Text>
                </View>
              </View>

              {/* Additional Info */}
              <View className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <Text className="text-xs text-primary font-semibold mb-2">
                  💡 Qo'shimcha Ma'lumot
                </Text>
                <Text className="text-xs text-primary/80">
                  {selectedElement.name} haqida batafsil ma'lumot keyinroq
                  qo'shiladi. Elektronlar tuzilishi, valentlik, kimyoviy
                  xususiyatlari va boshqalar.
                </Text>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setSelectedElement(null)}
                className="bg-muted/20 rounded-lg p-2"
              >
                <Text className="text-xs text-muted text-center font-semibold">
                  Yopish
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Info */}
          {!selectedElement && (
            <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <Text className="text-sm text-blue-800 dark:text-blue-200">
                Element tanlang va batafsil ma'lumotni ko'ring
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
