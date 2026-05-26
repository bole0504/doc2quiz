import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiFetch, setToken } from "@/lib/api";
import { useTheme } from "@/lib/theme";

type RegisterResponse = {
  token: string;
  user: { id: string; name: string; phone: string | null; role: string };
};

export default function RegisterScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setError(null);

    // Basic client-side validation
    if (!name.trim()) return setError("Vui lòng nhập họ và tên");
    if (!/^0\d{9}$/.test(phone.trim())) return setError("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)");
    if (password.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự");

    setBusy(true);
    try {
      const res = await apiFetch<RegisterResponse>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ phone: phone.trim(), name: name.trim(), password }),
        auth: false,
      });
      await setToken(res.token);
      router.replace("/exams");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đăng ký thất bại, vui lòng thử lại");
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
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
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
            <Text style={{ fontSize: 26, color: theme.p }}>📋</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: "600", color: theme.text, letterSpacing: -0.4 }}>
            Tạo tài khoản
          </Text>
          <Text style={{ fontSize: 14, color: theme.textMuted, marginTop: 6 }}>
            Đăng ký miễn phí, bắt đầu học ngay
          </Text>
        </View>

        {error ? (
          <View
            style={{
              backgroundColor: theme.dangerSoft,
              padding: 12,
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: theme.danger, fontSize: 13 }}>{error}</Text>
          </View>
        ) : null}

        {/* Name */}
        <Text style={{ fontSize: 13, fontWeight: "500", color: theme.text, marginBottom: 6 }}>
          Họ và tên
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nguyễn Văn A"
          placeholderTextColor={theme.textSubtle}
          autoComplete="name"
          style={inputStyle}
        />

        {/* Phone */}
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
        <Text style={{ fontSize: 12, color: theme.textSubtle, marginTop: -12, marginBottom: 16 }}>
          10 số, bắt đầu bằng 0 — dùng để đăng nhập
        </Text>

        {/* Password */}
        <Text style={{ fontSize: 13, fontWeight: "500", color: theme.text, marginBottom: 6 }}>
          Mật khẩu
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Tối thiểu 6 ký tự"
          placeholderTextColor={theme.textSubtle}
          autoComplete="new-password"
          style={inputStyle}
        />

        {/* Submit */}
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
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>Đăng ký</Text>
          )}
        </Pressable>

        {/* Login link */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, gap: 4 }}>
          <Text style={{ fontSize: 13, color: theme.textMuted }}>Đã có tài khoản?</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ fontSize: 13, color: theme.p, fontWeight: "600" }}>Đăng nhập</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
