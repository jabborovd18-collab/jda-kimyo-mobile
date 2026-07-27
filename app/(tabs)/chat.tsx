import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";

import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

/**
 * Chat Screen - Ommaviy Chat
 * Twitter-ga o'xshash chat interfeysi
 */
export default function ChatScreen() {
  const colors = useColors();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "O'qituvchi Alisher",
      avatar: "👨‍🏫",
      message: "Bugun kompleks birikmalar haqida o'rganamiz. Savollar bor?",
      time: "10:30 AM",
      likes: 12,
      liked: false,
    },
    {
      id: 2,
      user: "Talaba Dilnoza",
      avatar: "👩‍🎓",
      message:
        "Qanday teng koeffitsientlarni topish kerak? Redoks reaksiyalarda?",
      time: "10:45 AM",
      likes: 5,
      liked: false,
    },
    {
      id: 3,
      user: "O'qituvchi Alisher",
      avatar: "👨‍🏫",
      message:
        "Redoks usulini ishlatish kerak. Elektronlarni o'tkazish va qabul qilishni hisoblang.",
      time: "10:50 AM",
      likes: 18,
      liked: false,
    },
    {
      id: 4,
      user: "Talaba Siz",
      avatar: "👤",
      message: "Rahmat, tushundim! Juda foydali bo'ldi.",
      time: "11:00 AM",
      likes: 3,
      liked: false,
    },
    {
      id: 5,
      user: "Talaba Miroj",
      avatar: "👨‍🎓",
      message: "3D modellarni ko'rish uchun qayerga o'tish kerak?",
      time: "11:15 AM",
      likes: 2,
      liked: false,
    },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        user: "Talaba Siz",
        avatar: "👤",
        message: newMessage,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        likes: 0,
        liked: false,
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const toggleLike = (id: number) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              liked: !msg.liked,
              likes: msg.liked ? msg.likes - 1 : msg.likes + 1,
            }
          : msg
      )
    );
  };

  return (
    <ScreenContainer className="p-4">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">
            💬 Ommaviy Chat
          </Text>
          <Text className="text-sm text-muted">
            Barcha foydalanuvchilar bilan suhbat
          </Text>
        </View>

        {/* Messages */}
        <ScrollView className="flex-1">
          <View className="gap-3">
            {messages.map((msg) => (
              <View
                key={msg.id}
                className="bg-surface rounded-lg p-3 border border-border"
              >
                {/* Header */}
                <View className="flex-row items-center gap-2 mb-2">
                  <Text className="text-2xl">{msg.avatar}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {msg.user}
                    </Text>
                    <Text className="text-xs text-muted">{msg.time}</Text>
                  </View>
                </View>

                {/* Message */}
                <Text className="text-sm text-foreground mb-3 leading-relaxed">
                  {msg.message}
                </Text>

                {/* Actions */}
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    onPress={() => toggleLike(msg.id)}
                    className="flex-row items-center gap-1"
                  >
                    <Text className="text-lg">
                      {msg.liked ? "❤️" : "🤍"}
                    </Text>
                    <Text
                      className={`text-xs ${
                        msg.liked ? "text-error" : "text-muted"
                      }`}
                    >
                      {msg.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Text className="text-lg">💬</Text>
                    <Text className="text-xs text-muted">Javob</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Text className="text-lg">↗️</Text>
                    <Text className="text-xs text-muted">Ulashish</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Input */}
        <View className="gap-2 border-t border-border pt-3">
          <View className="flex-row items-end gap-2">
            <TextInput
              placeholder="Xabar yozing..."
              placeholderTextColor={colors.muted}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={280}
              className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`px-4 py-2 rounded-lg ${
                newMessage.trim() ? "bg-primary" : "bg-muted"
              }`}
            >
              <Text className="text-background font-semibold">📤</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-muted text-right">
            {newMessage.length}/280
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
