import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { openVariant } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    attemptId: string;
    variantId: string;
    status: string;
    score: string;
    total: string;
    examName: string;
  }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const passed = params.status === "PASSED";

  async function retry() {
    if (!params.variantId) return;
    await openVariant(params.variantId);
    router.replace(`/exam/${params.variantId}`);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: passed ? theme.successSoft : theme.dangerSoft,
        paddingTop: insets.top + 40,
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ fontSize: 48, textAlign: "center" }}>{passed ? "✓" : "✗"}</Text>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          textAlign: "center",
          color: passed ? theme.success : theme.danger,
          marginTop: 16,
        }}
      >
        {passed ? "Đậu" : "Chưa đạt"}
      </Text>
      <Text style={{ fontSize: 16, textAlign: "center", color: theme.textMuted, marginTop: 8 }}>
        {params.score}/{params.total} câu đúng
      </Text>
      <Text style={{ fontSize: 14, textAlign: "center", color: theme.textSubtle, marginTop: 4 }}>
        {params.examName}
      </Text>

      <View style={{ marginTop: 40, gap: 10 }}>
        <Pressable
          onPress={() => router.replace("/exams")}
          style={{
            height: 52,
            borderRadius: 14,
            backgroundColor: theme.p,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>Quay về</Text>
        </Pressable>
        {!passed ? (
          <Pressable
            onPress={retry}
            style={{
              height: 52,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>Thi lại</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
