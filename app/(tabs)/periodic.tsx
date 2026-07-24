import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  FlatList,
  Image,
  ScrollViewComponent,
} from "react-native";
import { useState, useMemo } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import periodicElements from "@/lib/data/periodic-elements.json";

/**
 * Enhanced Periodic Table Screen - Davriy Jadval (ptable.com uslubida)
 * Fixed layout with horizontal scroll, H va He batafsil ma'lumot
 */

export default function PeriodicScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const cardSize = 45; // Fixed card size

  // Qidiruv
  const filteredElements = useMemo(() => {
    if (!searchText) return periodicElements;
    const query = searchText.toLowerCase();
    return periodicElements.filter(
      (el) =>
        el.name.toLowerCase().includes(query) ||
        el.nameEn.toLowerCase().includes(query) ||
        el.symbol.toLowerCase().includes(query) ||
        el.number.toString().includes(query)
    );
  }, [searchText]);

  // Davriy jadvalga joylashtirish
  const renderPeriodicTable = () => {
    const grid: any[] = [];
    const maxPeriod = 7;
    const maxGroup = 18;

    // Group raqamlari (yuqori)
    const groupHeader = (
      <View key="group-header" className="flex-row gap-0.5 mb-1">
        <View style={{ width: 35 }} />
        {Array.from({ length: maxGroup }).map((_, i) => (
          <View
            key={`group-${i + 1}`}
            style={{ width: cardSize, height: 24 }}
            className="items-center justify-center"
          >
            <Text className="text-xs font-bold text-muted">{i + 1}</Text>
          </View>
        ))}
      </View>
    );
    grid.push(groupHeader);

    // Har bir davr uchun qator yaratish
    for (let period = 1; period <= maxPeriod; period++) {
      const row: any[] = [];

      // Period raqami (chap)
      row.push(
        <View
          key={`period-${period}`}
          style={{ width: 35, height: cardSize }}
          className="items-center justify-center"
        >
          <Text className="text-xs font-bold text-muted">{period}</Text>
        </View>
      );

      for (let group = 1; group <= maxGroup; group++) {
        const element = periodicElements.find(
          (el) => el.period === period && el.group === group
        );

        if (element) {
          row.push(
            <TouchableOpacity
              key={`${period}-${group}`}
              onPress={() => setSelectedElement(element)}
              className="rounded border active:opacity-70"
              style={{
                width: cardSize,
                height: cardSize,
                backgroundColor: element.color + "40",
                borderColor: element.color,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 2,
                marginBottom: 2,
              }}
            >
              <Text className="text-xs text-muted text-center leading-none">
                {element.number}
              </Text>
              <Text className="text-xs font-bold text-foreground text-center leading-none">
                {element.symbol}
              </Text>
            </TouchableOpacity>
          );
        } else {
          row.push(
            <View
              key={`${period}-${group}-empty`}
              style={{
                width: cardSize,
                height: cardSize,
                marginRight: 2,
                marginBottom: 2,
              }}
            />
          );
        }
      }

      grid.push(
        <View key={`row-${period}`} className="flex-row">
          {row}
        </View>
      );
    }

    // Lanthanidlar qatori (6-davr)
    const lanthanideRow = (
      <View key="lanthanide-row" className="mt-3 gap-1">
        <Text className="text-xs font-semibold text-muted">
          Lantanidlar (6-davr)
        </Text>
        <View className="flex-row gap-0.5 flex-wrap">
          {periodicElements
            .filter((el) => el.period === 6 && el.category === "Lanthanoid")
            .sort((a, b) => a.number - b.number)
            .map((element) => (
              <TouchableOpacity
                key={`lanthanide-${element.number}`}
                onPress={() => setSelectedElement(element)}
                className="rounded border active:opacity-70"
                style={{
                  width: cardSize,
                  height: cardSize,
                  backgroundColor: element.color + "40",
                  borderColor: element.color,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 2,
                  marginBottom: 2,
                }}
              >
                <Text className="text-xs text-muted text-center leading-none">
                  {element.number}
                </Text>
                <Text className="text-xs font-bold text-foreground text-center leading-none">
                  {element.symbol}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );
    grid.push(lanthanideRow);

    // Aktinidlar qatori (7-davr)
    const actinideRow = (
      <View key="actinide-row" className="mt-2 gap-1">
        <Text className="text-xs font-semibold text-muted">
          Aktinidlar (7-davr)
        </Text>
        <View className="flex-row gap-0.5 flex-wrap">
          {periodicElements
            .filter((el) => el.period === 7 && el.category === "Actinoid")
            .sort((a, b) => a.number - b.number)
            .map((element) => (
              <TouchableOpacity
                key={`actinide-${element.number}`}
                onPress={() => setSelectedElement(element)}
                className="rounded border active:opacity-70"
                style={{
                  width: cardSize,
                  height: cardSize,
                  backgroundColor: element.color + "40",
                  borderColor: element.color,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 2,
                  marginBottom: 2,
                }}
              >
                <Text className="text-xs text-muted text-center leading-none">
                  {element.number}
                </Text>
                <Text className="text-xs font-bold text-foreground text-center leading-none">
                  {element.symbol}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );
    grid.push(actinideRow);

    return grid;
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-primary/10 px-4 pt-4 pb-3 gap-2">
          <Text className="text-2xl font-bold text-foreground">
            📊 Davriy Jadval
          </Text>

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
            <Text className="text-xs font-semibold text-muted uppercase">
              Qidiruv Natijalari ({filteredElements.length})
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={filteredElements}
              keyExtractor={(item) => item.number.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedElement(item);
                    setSearchText("");
                  }}
                  className="px-3 py-2 rounded-lg border mr-2 active:opacity-70"
                  style={{
                    backgroundColor: item.color + "30",
                    borderColor: item.color,
                  }}
                >
                  <Text className="text-sm font-bold text-foreground">
                    {item.symbol}
                  </Text>
                  <Text className="text-xs text-muted">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Periodic Table Grid - Horizontal Scroll */}
        {!searchText && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            className="px-2 py-4"
          >
            <View className="gap-0.5">
              {renderPeriodicTable()}
            </View>
          </ScrollView>
        )}

        {/* No Results */}
        {searchText && filteredElements.length === 0 && (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-lg text-muted">Natija topilmadi</Text>
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
                    style={{ backgroundColor: selectedElement.color + "30" }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-6xl font-bold text-foreground">
                          {selectedElement.symbol}
                        </Text>
                        <Text className="text-xl text-muted mt-1">
                          {selectedElement.name}
                        </Text>
                        <Text className="text-sm text-muted">
                          {selectedElement.nameEn}
                        </Text>
                      </View>
                      <View className="items-end gap-1">
                        <Text className="text-3xl font-bold text-primary">
                          #{selectedElement.number}
                        </Text>
                        <View
                          className="px-3 py-1 rounded-full"
                          style={{ backgroundColor: selectedElement.color + "60" }}
                        >
                          <Text className="text-xs font-semibold text-foreground">
                            {selectedElement.categoryUz}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Quick Stats */}
                    <View className="flex-row gap-2 mt-2">
                      <View className="flex-1 bg-surface rounded-lg p-3">
                        <Text className="text-xs text-muted">Massa</Text>
                        <Text className="text-base font-bold text-foreground">
                          {selectedElement.mass.toFixed(3)}
                        </Text>
                      </View>
                      <View className="flex-1 bg-surface rounded-lg p-3">
                        <Text className="text-xs text-muted">Davr</Text>
                        <Text className="text-base font-bold text-foreground">
                          {selectedElement.period}
                        </Text>
                      </View>
                      <View className="flex-1 bg-surface rounded-lg p-3">
                        <Text className="text-xs text-muted">Guruh</Text>
                        <Text className="text-base font-bold text-foreground">
                          {selectedElement.group}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Element Image */}
                  {selectedElement.image && (
                    <View className="bg-surface rounded-lg p-4 border border-border">
                      <Image
                        source={{ uri: selectedElement.image }}
                        style={{ width: "100%", height: 200, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    </View>
                  )}

                  {/* Description */}
                  {selectedElement.description && (
                    <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                      <Text className="text-sm font-semibold text-foreground">
                        Tavsif
                      </Text>
                      <Text className="text-sm text-muted leading-relaxed">
                        {selectedElement.description}
                      </Text>
                    </View>
                  )}

                  {/* Electron Configuration */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                    <Text className="text-sm font-semibold text-foreground">
                      Elektron Konfiguratsiyasi
                    </Text>
                    <Text className="text-sm font-mono text-primary">
                      {selectedElement.electronConfig}
                    </Text>
                  </View>

                  {/* Oxidation States */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                    <Text className="text-sm font-semibold text-foreground">
                      Oksidatsiya Darajalari
                    </Text>
                    <View className="flex-row gap-2 flex-wrap">
                      {selectedElement.oxidationStates.map((state: string, idx: number) => (
                        <View
                          key={idx}
                          className="px-3 py-1 rounded-full bg-primary/20"
                        >
                          <Text className="text-sm font-mono text-primary">
                            {state}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Uses */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                    <Text className="text-sm font-semibold text-foreground">
                      Qo'llanilishi
                    </Text>
                    <Text className="text-sm text-muted leading-relaxed">
                      {selectedElement.uses}
                    </Text>
                  </View>

                  {/* Properties */}
                  {selectedElement.properties && (
                    <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                      <Text className="text-sm font-semibold text-foreground">
                        Xususiyatlari
                      </Text>
                      <Text className="text-sm text-muted leading-relaxed">
                        {selectedElement.properties}
                      </Text>
                    </View>
                  )}

                  {/* Discovery */}
                  {selectedElement.discovery && (
                    <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                      <Text className="text-sm font-semibold text-foreground">
                        Kashfiyot
                      </Text>
                      <Text className="text-sm text-muted leading-relaxed">
                        {selectedElement.discovery}
                      </Text>
                    </View>
                  )}

                  {/* Category Info */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                    <Text className="text-sm font-semibold text-foreground">
                      Kategoriya
                    </Text>
                    <View className="flex-row gap-2 flex-wrap">
                      <View
                        className="px-3 py-2 rounded-lg"
                        style={{ backgroundColor: selectedElement.color + "40" }}
                      >
                        <Text className="text-sm font-semibold text-foreground">
                          {selectedElement.categoryUz}
                        </Text>
                      </View>
                      <View className="px-3 py-2 rounded-lg bg-primary/10">
                        <Text className="text-sm text-primary">
                          {selectedElement.category}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Additional Info */}
                  <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                    <Text className="text-sm font-semibold text-foreground">
                      Ma'lumotlar
                    </Text>
                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Atom raqami:</Text>
                        <Text className="text-sm font-mono text-foreground">
                          {selectedElement.number}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Simvoli:</Text>
                        <Text className="text-sm font-mono text-foreground">
                          {selectedElement.symbol}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Atom massasi:</Text>
                        <Text className="text-sm font-mono text-foreground">
                          {selectedElement.mass.toFixed(3)} u
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Davr:</Text>
                        <Text className="text-sm font-mono text-foreground">
                          {selectedElement.period}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Guruh:</Text>
                        <Text className="text-sm font-mono text-foreground">
                          {selectedElement.group}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setSelectedElement(null)}
              className="bg-primary rounded-lg p-4 mt-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-background">
                Yopish
              </Text>
            </TouchableOpacity>
          </ScreenContainer>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
