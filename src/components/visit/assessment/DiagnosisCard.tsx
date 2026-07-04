import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        

        <View style={styles.content}>
          <Text style={styles.cardTitle}>
            {title}
          </Text>

          <Text style={styles.cardText}>
            {diagnosis}
          </Text>
        </View>

        <Pressable onPress={onRemove}>
          <Ionicons
            name="close-circle"
            size={22}
            color={COLORS.danger}
          />
        </Pressable>
      </View>
    </View>
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