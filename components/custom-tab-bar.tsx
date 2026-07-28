import { LinearGradient } from "expo-linear-gradient";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/matn";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { gradientRanglari } from "@/components/jda-tugma";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useColors } from "@/hooks/use-colors";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const qorongi = useColorScheme() === "dark";
  const bottomPadding = Math.max(insets.bottom, 8);

  // Center index (Bosh sahifa)
  const centerIndex = 2;

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.background,
        borderTopColor: colors.border,
        borderTopWidth: 0.5,
        paddingBottom: bottomPadding,
        paddingTop: 8,
        height: 80 + bottomPadding,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        // CENTER - Katta aylana
        if (index === centerIndex) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -30,
              }}
            >
              {/* Saytdagi asosiy tugma gradientli — markaziy tugma ham shunday */}
              <LinearGradient
                colors={gradientRanglari(qorongi)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: gradientRanglari(qorongi)[0],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.45,
                  shadowRadius: 12,
                  elevation: 10,
                }}
              >
                {options.tabBarIcon ? (
                  options.tabBarIcon({
                    focused: isFocused,
                    color: colors.background,
                    size: 32,
                  })
                ) : (
                  <Text style={{ fontSize: 32 }}>🏠</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        }

        // CHAP VA O'NG TOMONLAR
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <View style={{ alignItems: "center" }}>
              {options.tabBarIcon ? (
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? colors.primary : colors.muted,
                  size: 24,
                })
              ) : (
                <Text style={{ fontSize: 24 }}>📱</Text>
              )}
            </View>
            {typeof label === "string" && (
              <Text
                style={{
                  fontSize: 10,
                  color: isFocused ? colors.primary : colors.muted,
                  textAlign: "center",
                  maxWidth: 50,
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
