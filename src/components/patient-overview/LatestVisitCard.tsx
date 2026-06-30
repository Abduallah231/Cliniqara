import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import SectionHeader from "@/components/common/SectionHeader";

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

export default function LatestVisitCard() {
  return (
    <View style={styles.container}>
      <SectionHeader title="Latest Visit" />

      <AppCard>
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>
              Today • 29 Jun 2026
            </Text>

            <Text style={styles.complaint}>
              Chest Pain
            </Text>
          </View>

          <AppChip
            label="Completed"
            selected
          />
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Ionicons
              name="pulse-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.label}>
              Diagnosis
            </Text>
          </View>

          <Text style={styles.value}>
            NSTEMI
          </Text>
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Ionicons
              name="medical-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.label}>
              Treatment
            </Text>
          </View>

          <Text style={styles.value}>
            Aspirin + Clopidogrel +
            Atorvastatin
          </Text>
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.label}>
              Follow-up
            </Text>
          </View>

          <Text style={styles.value}>
            After 7 days
          </Text>
        </View>

        <AppButton
          title="Open Visit"
          icon="open-outline"
          onPress={() => {}}
        />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },

  date: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  complaint: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },

  info: {
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.secondaryText,
  },

  value: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    marginLeft: 26,
  },
});