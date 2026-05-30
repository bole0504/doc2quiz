import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchHistory, type HistoryItem } from "@/lib/api";
import { useTheme } from "@/lib/theme";

function StatusBadge({ status }: { status: string }) {
  const theme = useTheme();
  const config =
    status === "PASSED"
      ? { label: "Đậu ✓", bg: theme.successSoft, color: theme.success }
      : status === "FAILED"
        ? { label: "Rớt ✗", bg: theme.dangerSoft, color: theme.danger }
        : { label: "Đang thi", bg: theme.warningSoft, color: theme.warning };

  return (
    <View style={{ backgroundColor: config.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ fontSize: 11.5, fontWeight: "600", color: config.color }}>{config.label}</Text>
    </View>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function HistoryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchHistory();
    setItems(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().catch(() => setItems([])).finally(() => setLoading(false));
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load().catch(() => {});
    setRefreshing(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: theme.text }}>Lịch sử thi</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={theme.p} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.p} />}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <Text style={{ fontSize: 32, marginBottom: 12 }}>📋</Text>
              <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text }}>Chưa có lần thi nào</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>
                Vào tab Bộ đề để bắt đầu ôn thi
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 14,
                padding: 16,
                marginBottom: 10,
                backgroundColor: theme.inputBg,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text, flex: 1, marginRight: 8 }}>
                  {item.examName}
                </Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>
                Bộ {item.variantIndex}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 13, color: theme.textSubtle }}>
                  {item.score != null ? `${item.score}/${item.total} câu đúng` : "Chưa hoàn thành"}
                </Text>
                <Text style={{ fontSize: 12, color: theme.textSubtle }}>{formatDate(item.startedAt)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
