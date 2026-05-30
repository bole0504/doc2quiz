import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchCatalog, fetchMe, type CatalogBank, type PublicUser } from "@/lib/api";
import { useTheme } from "@/lib/theme";

function avatarColor(name: string) {
  const colors = ["#5B5BD6", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6", "#06B6D4"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const bg = avatarColor(name);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff", fontSize: size * 0.38, fontWeight: "700" }}>{initials || "?"}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [catalog, setCatalog] = useState<CatalogBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [me, cat] = await Promise.all([fetchMe(), fetchCatalog()]);
    setUser(me.user);
    setCatalog(cat);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().catch(() => {}).finally(() => setLoading(false));
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load().catch(() => {});
    setRefreshing(false);
  }

  const inProgressVariant = catalog
    .flatMap((b) => b.exams.flatMap((e) => e.variants))
    .find((v) => v.inProgress);

  const displayName = user?.name || user?.phone || "Bạn";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}>
      <FlatList
        data={catalog}
        keyExtractor={(b) => b.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.p} />}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <View>
                <Text style={{ fontSize: 13, color: theme.textMuted }}>{greeting},</Text>
                <Text style={{ fontSize: 20, fontWeight: "700", color: theme.text, letterSpacing: -0.4 }}>
                  {displayName} 👋
                </Text>
              </View>
              {user && <Avatar name={displayName} size={40} />}
            </View>

            {/* CTA card */}
            {loading ? (
              <ActivityIndicator color={theme.p} style={{ marginVertical: 20 }} />
            ) : inProgressVariant ? (
              <Pressable
                onPress={() => router.push(`/exam/${inProgressVariant.id}`)}
                style={{
                  backgroundColor: theme.p,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Đang dở dang</Text>
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>Tiếp tục học →</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.push("/(tabs)/exams")}
                style={{
                  backgroundColor: theme.p,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Sẵn sàng chưa?</Text>
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>Bắt đầu ôn thi →</Text>
              </Pressable>
            )}

            <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text, marginBottom: 12 }}>
              Ngân hàng câu hỏi
            </Text>
          </View>
        }
        renderItem={({ item: bank }) => (
          <View style={{ marginHorizontal: 20, marginBottom: 12, borderWidth: 1, borderColor: theme.border, borderRadius: 14, backgroundColor: theme.inputBg, padding: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text, marginBottom: 4 }}>{bank.title}</Text>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12 }}>
              {bank.questionCount} câu hỏi · {bank.exams.length} bộ đề
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {bank.exams.map((exam) => (
                <Pressable
                  key={exam.id}
                  onPress={() => router.push("/(tabs)/exams")}
                  style={{ backgroundColor: theme.pSoft, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}
                >
                  <Text style={{ fontSize: 12, color: theme.pSoftText, fontWeight: "500" }}>{exam.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: "center", color: theme.textMuted, marginTop: 40, paddingHorizontal: 20 }}>
              Chưa có ngân hàng câu hỏi nào.{"\n"}Nhờ admin tạo nội dung.
            </Text>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      />
    </View>
  );
}
