import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "@/components/common/AppCard";
import SectionHeader from "@/components/common/SectionHeader";

import {
    COLORS,
    RADIUS,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

export default function ClinicalAlerts() {
  const alerts = [
    "Penicillin Allergy",
    "CKD Stage 3",
    "On Warfarin",
  ];

  if (!alerts.length) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="Clinical Alerts" />

      <AppCard>
        <View style={styles.list}>
          {alerts.map((alert) => (
            <View
              key={alert}
              style={styles.alert}
            >
              <Ionicons
                name="warning"
                size={18}
                color={COLORS.warning}
              />

              <Text style={styles.text}>
                {alert}
              </Text>
            </View>
          ))}
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  list: {
    gap: SPACING.sm,
  },

  alert: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,

    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,

    borderRadius: RADIUS.lg,

    backgroundColor:
      COLORS.warning + "10",
  },

  text: {
    flex: 1,

    color: COLORS.text,

    fontSize: TYPOGRAPHY.body,

    fontWeight: "600",
  },
});