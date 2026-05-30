import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { getToken } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export default function Index() {
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    getToken().then((t) => {
      setHasToken(!!t);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.bg }}>
        <ActivityIndicator color={theme.p} />
      </View>
    );
  }

  // Redirect to tabs home or login
  return <Redirect href={hasToken ? "/(tabs)" : "/login"} />;
}
