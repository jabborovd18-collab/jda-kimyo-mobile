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
 * Calculators Screen - Kalkulatorlar
 * Ko'p kalkulatorlar va qidiruv
 */
export default function CalculatorsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCalc, setSelectedCalc] = useState<string | null>(null);

  // Mollik kalkulyatori
  const [molarity, setMolarity] = useState({
    molarMass: "",
    mass: "",
    volume: "",
  });

  // pH kalkulyatori
  const [pH, setPH] = useState({
    concentration: "",
  });

  const calculators = [
    {
      id: "molarity",
      name: "Mollik Kalkulyatori",
      description: "Mollik va konsentratsiyani hisoblash",
      icon: "🧪",
    },
    {
      id: "pH",
      name: "pH Kalkulyatori",
      description: "pH va pOH'ni hisoblash",
      icon: "🧬",
    },
    {
      id: "concentration",
      name: "Konsentratsiya Kalkulyatori",
      description: "Turli konsentratsiya birliklarini o'zgartirish",
      icon: "📊",
    },
    {
      id: "mass",
      name: "Massa Kalkulyatori",
      description: "Mollar sonidan massani hisoblash",
      icon: "⚖️",
    },
    {
      id: "percentage",
      name: "Foiz Tarkibi Kalkulyatori",
      description: "Elementlarning foiz tarkibini hisoblash",
      icon: "📈",
    },
    {
      id: "thermodynamics",
      name: "Termodinamika Kalkulyatori",
      description: "ΔG, ΔH, ΔS'ni hisoblash",
      icon: "🔥",
    },
  ];

  const filteredCalcs = calculators.filter((calc) =>
    calc.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const calculateMolarity = () => {
    const molarMassNum = parseFloat(molarity.molarMass);
    const massNum = parseFloat(molarity.mass);
    const volumeNum = parseFloat(molarity.volume);

    if (molarMassNum && massNum && volumeNum) {
      const moles = massNum / molarMassNum;
      const molarity_result = moles / volumeNum;
      const concentration = massNum / volumeNum;
      return {
        moles: moles.toFixed(3),
        molarity: molarity_result.toFixed(3),
        concentration: concentration.toFixed(2),
      };
    }
    return null;
  };

  const calculatePH = () => {
    const conc = parseFloat(pH.concentration);
    if (conc && conc > 0) {
      const pH_value = -Math.log10(conc);
      const pOH_value = 14 - pH_value;
      return {
        pH: pH_value.toFixed(2),
        pOH: pOH_value.toFixed(2),
      };
    }
    return null;
  };

  const molarityResult = calculateMolarity();
  const pHResult = calculatePH();

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              🧮 Kalkulatorlar
            </Text>
            <Text className="text-sm text-muted">
              Kimyoviy hisoblashlar uchun vositalar
            </Text>
          </View>

          {/* Search */}
          <View className="flex-row items-center gap-2 bg-surface rounded-lg border border-border px-3 py-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Kalkulyator qidiruv..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-foreground"
            />
          </View>

          {/* Calculators List */}
          {!selectedCalc ? (
            <View className="gap-2">
              {filteredCalcs.map((calc) => (
                <TouchableOpacity
                  key={calc.id}
                  onPress={() => setSelectedCalc(calc.id)}
                  className="bg-surface rounded-lg p-4 border border-border flex-row items-center gap-3 active:opacity-80"
                >
                  <Text className="text-3xl">{calc.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {calc.name}
                    </Text>
                    <Text className="text-xs text-muted">
                      {calc.description}
                    </Text>
                  </View>
                  <Text className="text-lg text-primary">→</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : selectedCalc === "molarity" ? (
            <View className="gap-4">
              <TouchableOpacity onPress={() => setSelectedCalc(null)}>
                <Text className="text-sm text-primary font-semibold">
                  ← Orqaga
                </Text>
              </TouchableOpacity>

              <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                <Text className="text-lg font-semibold text-foreground">
                  🧪 Mollik Kalkulyatori
                </Text>

                <View className="gap-2">
                  <Text className="text-xs text-muted">Molyar massa (g/mol)</Text>
                  <TextInput
                    placeholder="58.5"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={molarity.molarMass}
                    onChangeText={(text) =>
                      setMolarity({ ...molarity, molarMass: text })
                    }
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-xs text-muted">Massa (g)</Text>
                  <TextInput
                    placeholder="100"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={molarity.mass}
                    onChangeText={(text) =>
                      setMolarity({ ...molarity, mass: text })
                    }
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-xs text-muted">Hajm (L)</Text>
                  <TextInput
                    placeholder="2"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={molarity.volume}
                    onChangeText={(text) =>
                      setMolarity({ ...molarity, volume: text })
                    }
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  />
                </View>

                {molarityResult && (
                  <View className="bg-primary/10 rounded-lg p-3 gap-2 mt-2">
                    <Text className="text-sm font-semibold text-primary">
                      Natijalar:
                    </Text>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Mollar soni:</Text>
                      <Text className="text-xs font-bold text-primary">
                        {molarityResult.moles} mol
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Mollik:</Text>
                      <Text className="text-xs font-bold text-primary">
                        {molarityResult.molarity} M
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Konsentratsiya:</Text>
                      <Text className="text-xs font-bold text-primary">
                        {molarityResult.concentration} g/L
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ) : selectedCalc === "pH" ? (
            <View className="gap-4">
              <TouchableOpacity onPress={() => setSelectedCalc(null)}>
                <Text className="text-sm text-primary font-semibold">
                  ← Orqaga
                </Text>
              </TouchableOpacity>

              <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                <Text className="text-lg font-semibold text-foreground">
                  🧬 pH Kalkulyatori
                </Text>

                <View className="gap-2">
                  <Text className="text-xs text-muted">
                    [H⁺] konsentratsiya (M)
                  </Text>
                  <TextInput
                    placeholder="0.001"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={pH.concentration}
                    onChangeText={(text) =>
                      setPH({ ...pH, concentration: text })
                    }
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  />
                </View>

                {pHResult && (
                  <View className="bg-primary/10 rounded-lg p-3 gap-2 mt-2">
                    <Text className="text-sm font-semibold text-primary">
                      Natijalar:
                    </Text>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">pH:</Text>
                      <Text className="text-xs font-bold text-primary">
                        {pHResult.pH}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">pOH:</Text>
                      <Text className="text-xs font-bold text-primary">
                        {pHResult.pOH}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Turi:</Text>
                      <Text className="text-xs font-bold text-primary">
                        {parseFloat(pHResult.pH) < 7 ? "Acidic" : "Basic"}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View className="gap-4">
              <TouchableOpacity onPress={() => setSelectedCalc(null)}>
                <Text className="text-sm text-primary font-semibold">
                  ← Orqaga
                </Text>
              </TouchableOpacity>

              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-lg font-semibold text-foreground">
                  Kalkulyator
                </Text>
                <Text className="text-sm text-muted mt-2">
                  Bu kalkulyator hozir mavjud emas. Keyinroq qo'shiladi.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
