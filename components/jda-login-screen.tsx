import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  const canSubmit = login.trim().length > 0 && password.length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

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
              <Text className="text-3xl font-bold text-foreground">JDA Kimyo</Text>
              <Text className="text-sm text-muted text-center">
                Sayt hisobingiz bilan kiring
              </Text>
            </View>

            {/* Xato xabari */}
            {error ? (
              <View className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                <Text className="text-sm text-red-400">{error}</Text>
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
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
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
                  className="bg-surface border border-border rounded-lg px-4 py-3 pr-12 text-foreground"
                  placeholderTextColor={colors.muted}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((value) => !value)}
                  className="absolute right-3"
                  accessibilityLabel={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  <Text className="text-lg">{showPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Kirish tugmasi */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit}
              className={`rounded-lg py-4 items-center ${canSubmit ? "bg-primary" : "bg-primary/40"}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-semibold text-white">Kirish</Text>
              )}
            </TouchableOpacity>

            <Text className="text-xs text-muted text-center">
              Hisobingiz yo'qmi? jdakimyo.uz saytida ro'yxatdan o'ting
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
