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
import {
  type CatalogBank,
  fetchCatalog,
  logout,
  openVariant,
} from "@/lib/api";
import { useTheme } from "@/lib/theme";

type Row = {
  key: string;
  bankTitle: string;
  examName: string;
  variantId: string;
  variantIndex: number;
  status: string | null;
  inProgress: boolean;
};

function flattenCatalog(catalog: CatalogBank[]): Row[] {
  const rows: Row[] = [];
  for (const bank of catalog) {
    for (const exam of bank.exams) {
      for (const v of exam.variants) {
        rows.push({
          key: v.id,
          bankTitle: bank.title,
          examName: exam.name,
          variantId: v.id,
          variantIndex: v.index,
          status: v.status,
          inProgress: v.inProgress,
        });
      }
    }
  }
  return rows;
}

export default function ExamsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const catalog = await fetchCatalog();
    setRows(flattenCatalog(catalog));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load()
        .catch(() => setRows([]))
        .finally(() => setLoading(false));
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  async function startExam(variantId: string) {
    await openVariant(variantId);
    router.push(`/exam/${variantId}`);
  }

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600", color: theme.text }}>Bộ đề thi</Text>
        <Pressable onPress={onLogout}>
          <Text style={{ fontSize: 13, color: theme.p }}>Đăng xuất</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={theme.p} />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.p} />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: theme.textMuted, marginTop: 40 }}>
              Chưa có bộ đề. Nhờ admin tạo ngân hàng câu hỏi.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => startExam(item.variantId)}
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 14,
                padding: 16,
                marginBottom: 10,
                backgroundColor: theme.inputBg,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text }}>
                {item.examName} — Bộ {item.variantIndex}
              </Text>
              <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                {item.bankTitle}
              </Text>
              <Text style={{ fontSize: 12, color: theme.p, marginTop: 8 }}>
                {item.inProgress
                  ? "Đang thi"
                  : item.status === "PASSED"
                    ? "Đậu"
                    : item.status === "FAILED"
                      ? "Rớt"
                      : "Bắt đầu thi"}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
