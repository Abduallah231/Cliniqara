import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY, } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

type Props = {
  title: string;
  diagnosis: string;
  icon: keyof typeof Ionicons.glyphMap;
  onRemove: () => void;
};

export default function DiagnosisCard({
  title,
  diagnosis,
  icon,
  onRemove,
}: Props) {
  return (
    <AppView style={styles.card}>
      <AppView style={styles.cardHeader}>
        

        <AppView style={styles.content}>
          <AppText style={styles.cardTitle}>
            {title}
          </AppText>

          <AppText style={styles.cardText}>
            {diagnosis}
          </AppText>
        </AppView>

        <AppPressable onPress={onRemove}>
          <Ionicons
            name="close-circle"
            size={22}
            color={COLORS.danger}
          />
        </AppPressable>
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  content: {
    flex: 1,
  },

  cardTitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },

  cardText: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "700",
  },
});