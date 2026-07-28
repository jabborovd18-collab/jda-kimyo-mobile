import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { JdaTugma } from "@/components/jda-tugma";
import { Text } from "@/components/matn";

import { ScreenContainer } from "@/components/screen-container";
import { useJdaAuth } from "@/lib/jda/auth";
import { JdaApiError } from "@/lib/jda/api";
import { useColors } from "@/hooks/use-colors";

/**
 * Login ekrani — JDA Kimyo saytining hisobi bilan kiriladi.
 * Saytdagi kabi username yoki email qabul qilinadi.
 */
export default function LoginScreen() {
  const colors = useColors();
  const { signIn } = useJdaAuth();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Ilgari tugma maydonlar to'lmaguncha o'chirilgan turardi: bosilsa hech
    // narsa bo'lmasdi va sababi ham aytilmasdi. Foydalanuvchi uchun bu
    // "ilova ishlamayapti" degani. Endi tugma har doim javob beradi.
    if (!login.trim() || !password) {
      setError(
        !login.trim() && !password
          ? "Username va parolni kiriting"
          : !login.trim()
            ? "Username yoki email kiriting"
            : "Parolni kiriting",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await signIn(login.trim(), password);
      // Muvaffaqiyatli bo'lsa _layout avtomatik tab'larga o'tkazadi
    } catch (err) {
      setError(
        err instanceof JdaApiError ? err.message : "Kirishda xatolik yuz berdi",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-6">
            {/* Sarlavha */}
            <View className="gap-2 items-center">
              <Text className="text-5xl">⚗️</Text>
              <Text sarlavha className="text-3xl font-bold text-foreground">
                JDA Kimyo
              </Text>
              <Text className="text-sm text-muted text-center">
                Sayt hisobingiz bilan kiring
              </Text>
            </View>

            {/* Xato xabari */}
            {error ? (
              <View className="bg-error/10 border border-error/40 rounded-2xl p-3">
                <Text className="text-sm text-error">{error}</Text>
              </View>
            ) : null}

            {/* Username yoki email */}
            <View className="gap-2">
              <Text className="text-sm text-muted">Username yoki email</Text>
              <TextInput
                value={login}
                onChangeText={setLogin}
                placeholder="diyorbek_j"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                textContentType="username"
                editable={!isSubmitting}
                className="bg-surface border border-border rounded-xl px-4 py-3"
                placeholderTextColor={colors.muted}
                // Matn rangi ataylab uslub orqali: Android'da className
                // bilan berilgan rang TextInput'ga har doim ham yetib
                // bormaydi va yozilgan matn ko'rinmay qoladi.
                style={{ color: colors.foreground, fontSize: 16 }}
              />
            </View>

            {/* Parol */}
            <View className="gap-2">
              <Text className="text-sm text-muted">Parol</Text>
              <View className="relative justify-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  editable={!isSubmitting}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="go"
                  className="bg-surface border border-border rounded-xl px-4 py-3 pr-12"
                  placeholderTextColor={colors.muted}
                  style={{ color: colors.foreground, fontSize: 16 }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((value) => !value)}
                  className="absolute right-3"
                  accessibilityLabel={
                    showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"
                  }
                >
                  <Text className="text-lg">{showPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Kirish tugmasi — ilovaning birinchi taassuroti, brend gradienti bilan */}
            <JdaTugma onPress={handleSubmit} yuklanmoqda={isSubmitting}>
              Kirish
            </JdaTugma>

            <Text className="text-xs text-muted text-center">
              Hisobingiz yo'qmi? jdakimyo.uz saytida ro'yxatdan o'ting
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
