import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import AppCard from "@/components/common/AppCard";

import { PrescriptionTemplate } from "@/models";

import {
    COLORS,
    SPACING,
    TYPOGRAPHY
} from "@/theme";

type Props = {
  template: PrescriptionTemplate;

  onPress: () => void;
};

export default function TemplateCard({
  template,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.title}>
              {template.title}
            </Text>
          </View>

        </View>

        <Text style={styles.count}>
          {template.medications.length} Medications
        </Text>

        <Text style={styles.updated}>
          Updated {template.updatedAt}
        </Text>

        <View style={styles.footer}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.secondaryText}
          />
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: SPACING.sm,
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  titleContainer: {
    flexDirection: "row",

    alignItems: "center",

    gap: SPACING.sm,

    flex: 1,
  },

  title: {
    flex: 1,

    color: COLORS.text,

    fontSize: TYPOGRAPHY.body,

    fontWeight: "700",
  },

  count: {
    color: COLORS.secondaryText,

    fontSize: TYPOGRAPHY.small,
  },

  updated: {
    color: COLORS.secondaryText,

    fontSize: TYPOGRAPHY.small,
  },

  footer: {
    alignItems: "flex-end",

    marginTop: SPACING.xs,
  },
});