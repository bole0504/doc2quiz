import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchMe, logout, type PublicUser } from "@/lib/api";
import { useTheme, useThemeControls, PALETTE_IDS, type PaletteId } from "@/lib/theme";
import { getThemeTokens } from "@docx2quiz/tokens";

const PALETTE_LABELS: Record<PaletteId, string> = {
  indigo: "Indigo", violet: "Tím", blue: "Xanh dương", sky: "Trời xanh",
  cyan: "Cyan", teal: "Teal", emerald: "Ngọc lục", lime: "Xanh lá",
  amber: "Hổ phách", orange: "Cam", rose: "Hồng đỏ", pink: "Hồng", slate: "Xám",
};

export default function AccountScreen() {
  const theme = useTheme();
  const { palette, dark, setPalette, setDark } = useThemeControls();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchMe()
        .then((d) => setUser(d.user))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [])
  );

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  const displayName = user?.name || user?.phone || "Người dùng";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 }}
    >
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: theme.text }}>Tài khoản</Text>
      </View>

      {/* Profile card */}
      <View style={{ marginHorizontal: 20, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 16, backgroundColor: theme.inputBg, marginBottom: 20 }}>
        {loading ? (
          <ActivityIndicator color={theme.p} />
        ) : (
          <>
            <Text style={{ fontSize: 17, fontWeight: "700", color: theme.text }}>{displayName}</Text>
            <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
              {user?.phone ?? user?.email ?? ""}
            </Text>
            <View style={{ marginTop: 8, backgroundColor: theme.pSoft, borderRadius: 6, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11.5, fontWeight: "600", color: theme.pSoftText }}>
                {user?.role === "ADMIN" ? "Quản trị viên" : "Học viên"}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Dark mode */}
      <View style={{ marginHorizontal: 20, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 16, backgroundColor: theme.inputBg, marginBottom: 20 }}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text, marginBottom: 14 }}>Giao diện</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: theme.text }}>Chế độ tối</Text>
          <Switch
            value={dark}
            onValueChange={setDark}
            trackColor={{ false: theme.border, true: theme.p }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Palette picker */}
      <View style={{ marginHorizontal: 20, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 16, backgroundColor: theme.inputBg, marginBottom: 20 }}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text, marginBottom: 14 }}>Màu chủ đạo</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {PALETTE_IDS.map((pid) => {
            const color = getThemeTokens({ palette: pid }).p;
            const active = pid === palette;
            return (
              <Pressable
                key={pid}
                onPress={() => setPalette(pid)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: color,
                  borderWidth: active ? 3 : 0,
                  borderColor: "#fff",
                  shadowColor: active ? color : "transparent",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: active ? 0.6 : 0,
                  shadowRadius: 6,
                  elevation: active ? 4 : 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {active && <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
        <Text style={{ fontSize: 12, color: theme.textSubtle, marginTop: 10 }}>
          Đang dùng: {PALETTE_LABELS[palette]}
        </Text>
      </View>

      {/* Logout */}
      <View style={{ marginHorizontal: 20 }}>
        <Pressable
          onPress={onLogout}
          style={{
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.danger,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: theme.danger }}>Đăng xuất</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
