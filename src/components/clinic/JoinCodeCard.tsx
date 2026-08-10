import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import ClinicJoinQr from "./ClinicJoinQr";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  code: string;
  expiresAt: string;
};

export default function JoinCodeCard({
  code,
  expiresAt,
}: Props) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);

    Alert.alert(
      "Copied",
      "Clinic join code copied to clipboard.",
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Clinic Join Code
      </Text>

      <View style={styles.codeBox}>
        <Text style={styles.code}>
          {code}
        </Text>

        <Pressable
          style={styles.copyButton}
          onPress={handleCopy}
        >
          <Ionicons
            name="copy-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.copyText}>
            Copy
          </Text>
        </Pressable>
      </View>

      <Text style={styles.expires}>
        Expires:{" "}
        {new Date(expiresAt).toLocaleString()}
      </Text>

      <View style={styles.qrContainer}>
        <ClinicJoinQr code={code} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },

  title: {
    alignSelf: "flex-start",
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },

  codeBox: {
    width: "100%",
    minHeight: 58,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: SPACING.md,
    paddingRight: 8,
  },

  code: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },

  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#EEF6FF",
  },

  copyText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
  },

  expires: {
    alignSelf: "flex-start",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    marginTop: SPACING.sm,
  },

  qrContainer: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
});