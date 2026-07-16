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
 * Namunaga mos ravishda yaratilgan
 */

export default function PeriodicScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<number | null>(null);
  const colors = useColors();

  const filteredElements = searchText
    ? searchElements(searchText)
    : filterPeriod
      ? PERIODIC_TABLE.filter((el) => el.period === filterPeriod)
      : PERIODIC_TABLE;

  const periods = [1, 2, 3, 4, 5, 6, 7];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-primary/10 px-4 pt-4 pb-2 gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">📊</Text>
              <Text className="text-2xl font-bold text-foreground">Davriy Jadval</Text>
            </View>
            <TouchableOpacity className="w-8 h-8 rounded-lg bg-surface border border-border items-center justify-center">
              <Text className="text-lg">⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 py-4 gap-4">
          {/* Search */}
          <View className="flex-row items-center gap-2 bg-surface rounded-lg border border-border px-3 py-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Element qidiruv..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-foreground text-sm"
            />
          </View>

          {/* Period Filters */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted uppercase">Davr bo'yicha filtrlar:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              <TouchableOpacity
                onPress={() => setFilterPeriod(null)}
                className={`px-3 py-1.5 rounded-full ${
                  filterPeriod === null ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    filterPeriod === null ? "text-background" : "text-foreground"
                  }`}
                >
                  Barcha
                </Text>
              </TouchableOpacity>

              {periods.map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setFilterPeriod(period)}
                  className={`px-3 py-1.5 rounded-full ${
                    filterPeriod === period ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      filterPeriod === period ? "text-background" : "text-foreground"
                    }`}
                  >
                    {period}-davr
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Elements Grid */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted">
              Topilgan: {filteredElements.length} ta element
            </Text>

            <View className="flex-row flex-wrap gap-1.5">
              {filteredElements.map((element) => (
                <TouchableOpacity
                  key={element.id}
                  onPress={() => setSelectedElement(element)}
                  className={`flex-1 min-w-[30%] rounded-lg p-2 items-center justify-center border-2 ${
                    selectedElement?.id === element.id
                      ? "bg-primary border-primary"
                      : ELEMENT_COLORS[element.category] + " border-border"
                  }`}
                  style={{ minHeight: 70 }}
                >
                  <Text
                    className={`text-lg font-bold ${
                      selectedElement?.id === element.id ? "text-background" : "text-foreground"
                    }`}
                  >
                    {element.symbol}
                  </Text>
                  <Text
                    className={`text-xs ${
                      selectedElement?.id === element.id ? "text-background/80" : "text-muted"
                    }`}
                  >
                    {element.name}
                  </Text>
                  <Text
                    className={`text-xs font-semibold ${
                      selectedElement?.id === element.id ? "text-background" : "text-foreground"
                    }`}
                  >
                    {element.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Element Details Modal */}
      <Modal visible={!!selectedElement} transparent animationType="slide">
        {selectedElement && (
          <View className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {/* Header */}
              <View className="bg-primary/10 px-4 pt-4 pb-4 gap-3 border-b border-border">
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity onPress={() => setSelectedElement(null)}>
                    <Text className="text-2xl">←</Text>
                  </TouchableOpacity>
                  <View className="items-center gap-2">
                    <View className="w-16 h-16 rounded-full bg-primary items-center justify-center border-2 border-primary">
                      <Text className="text-4xl font-bold text-background">{selectedElement.symbol}</Text>
                    </View>
                    <Text className="text-lg font-bold text-foreground">{selectedElement.name}</Text>
                    <Text className="text-xs text-muted">{selectedElement.mass.toFixed(3)} (g/mol)</Text>
                  </View>
                  <View className="w-8" />
                </View>

                {/* Category Badge */}
                <View className="items-center">
                  <View className="bg-primary px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-background uppercase">
                      {selectedElement.category}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="px-4 py-4 gap-4">
                {/* Description */}
                <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-lg">📝</Text>
                    <Text className="text-xs font-semibold text-blue-900 dark:text-blue-200">Eslatma</Text>
                  </View>
                  <Text className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    {selectedElement.description}
                  </Text>
                </View>

                {/* Basic Info */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">📋 Asosiy Ma'lumotlar</Text>
                  <View className="bg-surface rounded-lg p-3 border border-border gap-2">
                    <InfoRow label="Atom raqami:" value={selectedElement.number.toString()} />
                    <InfoRow label="Atom og'irligi:" value={selectedElement.mass.toFixed(3)} />
                    <InfoRow label="Davr:" value={selectedElement.period.toString()} />
                    <InfoRow label="Guruhi:" value={selectedElement.group.toString()} />
                    <InfoRow label="Kashf etilgan yili:" value={selectedElement.discovered.toString()} />
                    <InfoRow label="Kashf etgan shaxs:" value={selectedElement.discoverer} />
                  </View>
                </View>

                {/* Physical Properties */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">🌡️ Fizik Xususiyatlar</Text>
                  <View className="bg-surface rounded-lg p-3 border border-border gap-2">
                    <InfoRow label="Zichligi:" value={selectedElement.density.toFixed(2) + " g/cm³"} />
                    <InfoRow label="Erish nuqtasi:" value={selectedElement.meltingPoint.toFixed(1) + "°C"} />
                    <InfoRow label="Quynash nuqtasi:" value={selectedElement.boilingPoint.toFixed(1) + "°C"} />
                  </View>
                </View>

                {/* Electron Configuration */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">⚛️ Elektron Qobig'i</Text>
                  <View className="bg-surface rounded-lg p-3 border border-border gap-2">
                    <Text className="text-xs text-muted">Konfiguratsiya:</Text>
                    <Text className="text-xs font-mono text-foreground">{selectedElement.electronConfiguration}</Text>
                  </View>
                </View>

                {/* Particle Count */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">🔬 Zarrachalar</Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1 bg-red-100 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 items-center">
                      <Text className="text-xs font-bold text-red-900 dark:text-red-200 uppercase mb-1">Elektronlar</Text>
                      <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {selectedElement.electrons}
                      </Text>
                    </View>
                    <View className="flex-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800 items-center">
                      <Text className="text-xs font-bold text-yellow-900 dark:text-yellow-200 uppercase mb-1">Protonlar</Text>
                      <Text className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {selectedElement.protons}
                      </Text>
                    </View>
                    <View className="flex-1 bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 items-center">
                      <Text className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase mb-1">Neytronlar</Text>
                      <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedElement.neutrons}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setSelectedElement(null)}
                  className="bg-primary rounded-lg py-3 items-center"
                >
                  <Text className="text-sm font-bold text-background">Yopish</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </ScreenContainer>
  );
}

/**
 * Info Row Component
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-xs text-muted">{label}</Text>
      <Text className="text-xs font-semibold text-foreground">{value}</Text>
    </View>
  );
}
