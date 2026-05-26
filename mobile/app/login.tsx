import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { login } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export default function LoginScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    setError(null);
    try {
      await login(phone.trim(), password);
      router.replace("/exams");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đăng nhập thất bại");
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = {
    height: 52,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: theme.inputBg,
    color: theme.text,
    marginBottom: 16,
  } as const;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top + 24 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        {/* Logo */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              backgroundColor: theme.pSoft,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            {/* Document + check icon (simplified for RN) */}
            <Text style={{ fontSize: 26, color: theme.p }}>📋</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: "600", color: theme.text, letterSpacing: -0.4 }}>
            Chào mừng trở lại
          </Text>
          <Text style={{ fontSize: 14, color: theme.textMuted, marginTop: 6 }}>
            Đăng nhập để tiếp tục học
          </Text>
        </View>

        {error ? (
          <View
            style={{
              backgroundColor: theme.dangerSoft,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: theme.danger, fontSize: 13 }}>{error}</Text>
          </View>
        ) : null}

        <Text style={{ fontSize: 13, fontWeight: "500", color: theme.text, marginBottom: 6 }}>
          Số điện thoại
        </Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="0912 345 678"
          placeholderTextColor={theme.textSubtle}
          style={inputStyle}
        />

        <Text style={{ fontSize: 13, fontWeight: "500", color: theme.text, marginBottom: 6 }}>
          Mật khẩu
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={theme.textSubtle}
          style={inputStyle}
        />

        <Pressable
          onPress={onSubmit}
          disabled={busy}
          style={{
            height: 52,
            borderRadius: 14,
            backgroundColor: theme.p,
            alignItems: "center",
            justifyContent: "center",
            opacity: busy ? 0.7 : 1,
            marginTop: 4,
          }}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>Đăng nhập</Text>
          )}
        </Pressable>

        {/* Register link */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, gap: 4 }}>
          <Text style={{ fontSize: 13, color: theme.textMuted }}>Chưa có tài khoản?</Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={{ fontSize: 13, color: theme.p, fontWeight: "600" }}>Đăng ký ngay</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
