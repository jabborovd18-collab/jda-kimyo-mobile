import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Compounds Screen - Birikmalar Bazasi
 * 120+ kompleks birikma haqida ma'lumotlar
 */
export default function CompoundsScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGeometry, setSelectedGeometry] = useState("all");

  // Sample compounds data
  const compounds = [
    {
      id: 1,
      formula: "[Cu(NH₃)₄]SO₄",
      name: "Tetraammin kuprum(II) sulfat",
      type: "cation",
      geometry: "square-planar",
      coordination: 4,
    },
    {
      id: 2,
      formula: "[Fe(CN)₆]⁴⁻",
      name: "Geksasiano ferrat(II)",
      type: "anion",
      geometry: "octahedral",
      coordination: 6,
    },
    {
      id: 3,
      formula: "[Zn(NH₃)₄]²⁺",
      name: "Tetraammin sink(II)",
      type: "cation",
      geometry: "tetrahedral",
      coordination: 4,
    },
    {
      id: 4,
      formula: "[Ni(H₂O)₆]²⁺",
      name: "Heksaaqua nikel(II)",
      type: "cation",
      geometry: "octahedral",
      coordination: 6,
    },
  ];

  const types = [
    { id: "all", label: "Barcha turlari" },
    { id: "cation", label: "🔵 Kation" },
    { id: "anion", label: "🔴 Anion" },
    { id: "neutral", label: "🟢 Neytral" },
  ];

  const geometries = [
    { id: "all", label: "Barcha geometriyalar" },
    { id: "octahedral", label: "🔷 Oktaedr (K.S = 6)" },
    { id: "tetrahedral", label: "🔺 Tetraedr (K.S = 4)" },
    { id: "square-planar", label: "⬜ Kvadrat tekislik (K.S = 4)" },
    { id: "linear", label: "➖ Chiziqli (K.S = 2)" },
  ];

  const filteredCompounds = compounds.filter((compound) => {
    const matchesSearch =
      compound.formula.toLowerCase().includes(searchText.toLowerCase()) ||
      compound.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectedType === "all" || compound.type === selectedType;
    const matchesGeometry =
      selectedGeometry === "all" || compound.geometry === selectedGeometry;
    return matchesSearch && matchesType && matchesGeometry;
  });

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2 mb-2">
            <Text className="text-3xl font-bold text-foreground">
              🧪 Birikmalar
            </Text>
            <Text className="text-sm text-muted">
              Koordinatsion kimyo asoslari
            </Text>
          </View>

          {/* Search */}
          <View className="bg-surface rounded-lg border border-border px-4 py-2 flex-row items-center gap-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Formula, nomi yoki atom bo'yicha qidirish..."
              placeholderTextColor="#687076"
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-foreground"
            />
          </View>

          {/* Type Filter */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted">Tur</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-2"
              contentContainerStyle={{ gap: 8 }}
            >
              {types.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  className={`px-3 py-2 rounded-full ${
                    selectedType === type.id
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedType === type.id
                        ? "text-white"
                        : "text-foreground"
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Geometry Filter */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted">Geometriya</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-2"
              contentContainerStyle={{ gap: 8 }}
            >
              {geometries.map((geom) => (
                <TouchableOpacity
                  key={geom.id}
                  onPress={() => setSelectedGeometry(geom.id)}
                  className={`px-3 py-2 rounded-full ${
                    selectedGeometry === geom.id
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedGeometry === geom.id
                        ? "text-white"
                        : "text-foreground"
                    }`}
                  >
                    {geom.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Results */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-muted">
              {filteredCompounds.length} ta birikma topildi
            </Text>
            {filteredCompounds.length > 0 ? (
              <View className="gap-2">
                {filteredCompounds.map((compound) => (
                  <TouchableOpacity
                    key={compound.id}
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/compound-detail",
                        params: { compoundId: compound.id },
                      } as any);
                    }}
                    className="bg-surface rounded-lg p-3 border border-border active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-foreground mb-1">
                      {compound.formula}
                    </Text>
                    <Text className="text-sm text-muted mb-2">
                      {compound.name}
                    </Text>
                    <View className="flex-row gap-2">
                      <View className="bg-primary/10 px-2 py-1 rounded">
                        <Text className="text-xs text-primary font-medium">
                          K.S = {compound.coordination}
                        </Text>
                      </View>
                      <View className="bg-primary/10 px-2 py-1 rounded">
                        <Text className="text-xs text-primary font-medium">
                          {compound.geometry}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-2xl mb-2">🔍</Text>
                <Text className="text-sm text-muted text-center">
                  Birikmalar topilmadi. Qidiruv yoki filtrlarni o'zgartirib
                  ko'ring.
                </Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <Text className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
              📖 Qanday o'qish kerak?
            </Text>
            <Text className="text-xs text-green-800 dark:text-green-200 leading-relaxed">
              Formula: [Cu(NH₃)₄]SO₄ — Kvadrat qavs ichida ichki sfera,
              tashqarisida tashqi sfera.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
