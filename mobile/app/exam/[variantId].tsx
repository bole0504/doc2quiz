import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  type ExamPayload,
  answerQuestion,
  fetchVariant,
  submitAttempt,
} from "@/lib/api";
import { useTheme } from "@/lib/theme";

function formatMs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export default function ExamScreen() {
  const { variantId } = useLocalSearchParams<{ variantId: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [data, setData] = useState<ExamPayload | null>(null);
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    if (!variantId) return;
    const json = await fetchVariant(variantId);
    if (json.attempt.finished || !json.question) {
      router.replace("/(tabs)/exams");
      return;
    }
    setData(json);
    setSelected((json.question.selected as "A" | "B" | "C" | "D") ?? null);
  }, [variantId, router]);

  useEffect(() => {
    load().catch(() => router.replace("/exams"));
  }, [load, router]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remainingMs = useMemo(() => {
    if (!data?.variant.deadlineMs) return null;
    return Math.max(0, data.variant.deadlineMs - now);
  }, [data, now]);

  const timerColor = useMemo(() => {
    if (remainingMs == null) return theme.text;
    if (remainingMs <= 60_000) return theme.danger;
    if (remainingMs <= 5 * 60_000) return theme.warning;
    return theme.text;
  }, [remainingMs, theme]);

  useEffect(() => {
    if (remainingMs === 0 && data) {
      doSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs === 0]);

  async function goNext() {
    if (!data?.question || !selected || !variantId) return;
    setBusy(true);
    try {
      const json = await answerQuestion({
        attemptId: data.attempt.id,
        variantId,
        questionId: data.question.id,
        selected,
      });
      if (json.finished) {
        router.replace({
          pathname: "/result",
          params: {
            attemptId: data.attempt.id,
            variantId,
            status: json.status ?? "FAILED",
            score: String(json.score ?? 0),
            total: String(json.total ?? 0),
            examName: data.variant.examName,
          },
        });
        return;
      }
      if (json.question) {
        setData(json as ExamPayload);
        setSelected((json.question.selected as "A" | "B" | "C" | "D") ?? null);
      } else {
        await load();
        setSelected(null);
      }
    } finally {
      setBusy(false);
    }
  }

  async function doSubmit() {
    if (!data || !variantId) return;
    const answered = data.attempt.currentIndex;
    const total = data.variant.totalQuestions;
    const unanswered = total - answered;
    const msg =
      unanswered > 0
        ? `Bạn đã trả lời ${answered}/${total} câu.\n⚠️ Còn ${unanswered} câu chưa làm — sau khi nộp không thể sửa.`
        : `Bạn đã hoàn thành tất cả ${total} câu. Xác nhận nộp bài?`;

    Alert.alert("Xác nhận nộp bài", msg, [
      { text: "Làm tiếp", style: "cancel" },
      {
        text: "Nộp bài",
        style: "destructive",
        onPress: async () => {
          setBusy(true);
          try {
            const result = await submitAttempt(data.attempt.id, variantId);
            router.replace({
              pathname: "/result",
              params: {
                attemptId: data.attempt.id,
                variantId,
                status: result.status,
                score: String(result.score),
                total: String(result.total),
                examName: data.variant.examName,
              },
            });
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  }

  if (!data?.question) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.bg }}>
        <ActivityIndicator color={theme.p} />
      </View>
    );
  }

  const { question, variant } = data;
  const isLast = question.index + 1 >= variant.totalQuestions;
  const letters = ["A", "B", "C", "D"] as const;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text }} numberOfLines={1}>
            {variant.examName}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>
            Câu {question.index + 1}/{variant.totalQuestions}
          </Text>
        </View>
        {remainingMs != null ? (
          <Text style={{ fontSize: 14, fontWeight: "600", color: timerColor }}>
            {formatMs(remainingMs)}
          </Text>
        ) : null}
        <Pressable onPress={() => router.back()} style={{ marginLeft: 12, padding: 8 }}>
          <Text style={{ fontSize: 18, color: theme.textMuted }}>×</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, lineHeight: 26 }}>
          {question.text}
        </Text>
        <View style={{ marginTop: 20, gap: 10 }}>
          {letters.map((letter) => (
            <Pressable
              key={letter}
              onPress={() => setSelected(letter)}
              style={{
                minHeight: 64,
                borderRadius: 14,
                borderWidth: selected === letter ? 2 : 1,
                borderColor: selected === letter ? theme.p : theme.border,
                backgroundColor: selected === letter ? theme.pSoft : theme.inputBg,
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "600", color: theme.textMuted, marginRight: 10 }}>
                {letter}
              </Text>
              <Text style={{ flex: 1, fontSize: 15, color: theme.text }}>{question.options[letter]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        {question.index > 0 && (
          <Pressable
            onPress={() => router.back()}
            style={{
              height: 52,
              paddingHorizontal: 16,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: theme.textMuted, fontWeight: "500" }}>← Trước</Text>
          </Pressable>
        )}
        <Pressable
          onPress={isLast ? doSubmit : goNext}
          disabled={!selected || busy}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 14,
            backgroundColor: isLast ? theme.danger : theme.p,
            alignItems: "center",
            justifyContent: "center",
            opacity: !selected || busy ? 0.5 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
            {busy ? "..." : isLast ? "Nộp bài" : "Tiếp theo →"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
