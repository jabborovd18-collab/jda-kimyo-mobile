import { ScrollView, Text, View, TextInput, TouchableOpacity, FlatList, Modal } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { calculators, categories, searchCalculators, getCalculatorsByCategory, type Calculator } from "@/lib/data/calculators";
import { useColors } from "@/hooks/use-colors";

export default function CalculatorsScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCalculator, setSelectedCalculator] = useState<Calculator | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [calculationResult, setCalculationResult] = useState<string | null>(null);

  // Qidiruv va filtrash
  const displayedCalculators =
    searchQuery.length > 0
      ? searchCalculators(searchQuery)
      : selectedCategory
        ? getCalculatorsByCategory(selectedCategory)
        : calculators;

  const handleCalculatorPress = (calc: Calculator) => {
    setSelectedCalculator(calc);
    setInputValues({});
    setCalculationResult(null);
    setModalVisible(true);
  };

  const handleCalculate = () => {
    if (!selectedCalculator) return;

    // Agar kalkulyatorning hisoblash funksiyasi bo'lsa, uni chaqir
    if (selectedCalculator.calculate) {
      try {
        // Kirishlari raqamlarga o'tkazish
        const numericInputs: Record<string, number> = {};
        selectedCalculator.inputs.forEach((input) => {
          const value = parseFloat(inputValues[input.name] || "0");
          numericInputs[input.name] = value;
        });

        const result = selectedCalculator.calculate(numericInputs);
        setCalculationResult(String(result));
      } catch (error) {
        setCalculationResult("Xato: Hisoblash muvaffaqiyatsiz");
      }
    } else {
      setCalculationResult("Bu kalkulyator hozir mavjud emas");
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">🧮 Kalkulyatorlar</Text>
            <Text className="text-sm text-muted">200+ kimyoviy kalkulyator</Text>
          </View>

          {/* Qidiruv */}
          <View className="bg-surface rounded-lg p-3 border border-border">
            <TextInput
              placeholder="Kalkulyator qidiring..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="text-foreground"
              style={{ color: colors.foreground }}
            />
          </View>

          {/* Kategoriyalar */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Kategoriyalar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === null ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedCategory === null ? "text-background" : "text-foreground"
                  }`}
                >
                  Hammasi
                </Text>
              </TouchableOpacity>

              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => {
                    setSelectedCategory(category);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedCategory === category ? "text-background" : "text-foreground"
                    }`}
                  >
                    {category.substring(0, 12)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Kalkulyatorlar ro'yxati */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              {displayedCalculators.length} ta kalkulyator
            </Text>

            <FlatList
              data={displayedCalculators}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCalculatorPress(item)}
                  className="bg-surface rounded-lg p-4 mb-3 border border-border active:opacity-70"
                >
                  <View className="gap-2">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-3xl">{item.emoji}</Text>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">{item.name}</Text>
                        <Text className="text-xs text-muted">{item.category}</Text>
                      </View>
                    </View>
                    <Text className="text-sm text-muted">{item.description}</Text>
                    <Text className="text-xs text-primary font-mono">{item.formula}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* Kalkulyator Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-background/80">
          <ScreenContainer className="p-4 justify-between">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {selectedCalculator && (
                <View className="gap-4">
                  {/* Header with emoji */}
                  <View className="gap-2">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-5xl">{selectedCalculator.emoji}</Text>
                      <View className="flex-1">
                        <Text className="text-2xl font-bold text-foreground">
                          {selectedCalculator.name}
                        </Text>
                        <Text className="text-xs text-muted">{selectedCalculator.category}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Tavsif */}
                  <View className="bg-surface rounded-lg p-4 border border-border">
                    <Text className="text-sm text-muted mb-2">Tavsif:</Text>
                    <Text className="text-base text-foreground">{selectedCalculator.description}</Text>
                  </View>

                  {/* Formula */}
                  <View className="bg-surface rounded-lg p-4 border border-border">
                    <Text className="text-sm text-muted mb-2">Formula:</Text>
                    <Text className="text-base font-mono text-primary">{selectedCalculator.formula}</Text>
                  </View>

                  {/* Kirishlar */}
                  {selectedCalculator.inputs.length > 0 && (
                    <View className="gap-2">
                      <Text className="text-sm font-semibold text-foreground">Kirishlar:</Text>
                      {selectedCalculator.inputs.map((input, idx) => (
                        <View key={idx} className="bg-surface rounded-lg p-3 border border-border">
                          <Text className="text-xs text-muted mb-1">
                            {input.name} ({input.unit})
                          </Text>
                          <TextInput
                            placeholder={input.placeholder}
                            placeholderTextColor={colors.muted}
                            className="text-foreground"
                            style={{ color: colors.foreground }}
                            keyboardType="decimal-pad"
                            value={inputValues[input.name] || ""}
                            onChangeText={(text) => {
                              setInputValues({
                                ...inputValues,
                                [input.name]: text,
                              });
                            }}
                          />
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Chiqish */}
                  {calculationResult && (
                    <View className="bg-primary/10 rounded-lg p-4 border border-primary">
                      <Text className="text-sm text-muted mb-2">Natija:</Text>
                      <Text className="text-2xl font-bold text-primary">
                        {calculationResult} {selectedCalculator.unit}
                      </Text>
                    </View>
                  )}

                  {/* Hisoblash tugmasi */}
                  <TouchableOpacity
                    onPress={handleCalculate}
                    className="bg-primary rounded-lg p-4 active:opacity-80"
                  >
                    <Text className="text-center text-base font-semibold text-background">
                      Hisoblash
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            {/* Yopish tugmasi */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-surface rounded-lg p-4 border border-border mt-4 active:opacity-70"
            >
              <Text className="text-center text-base font-semibold text-foreground">Yopish</Text>
            </TouchableOpacity>
          </ScreenContainer>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
