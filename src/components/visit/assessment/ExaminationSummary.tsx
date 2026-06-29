import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type SummaryCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  findings: string[];
};

function SummaryCard({
  title,
  icon,
  findings,
}: SummaryCardProps) {
  if (!findings.length) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name={icon}
          size={18}
          color={COLORS.primary}
        />

        <Text style={styles.title}>
          {title}
        </Text>
      </View>

      <View style={styles.tags}>
        {findings.map((item) => (
          <View
            key={item}
            style={styles.tag}
          >
            <Text style={styles.tagText}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ExaminationSummary() {
  const vitalSigns = [
    "BP 170/100",
    "Pulse 120",
  ];

  const generalInspection = [
    "Pallor",
    "Ill Looking",
  ];

  const cvs = [
    "Tachycardia",
    "S4 Gallop",
  ];

  const abdomen = [
    "RUQ Tenderness",
  ];

  const ophthalmology = [
    "Papilledema",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.half}>
          <SummaryCard
            title="Vital Signs"
            icon="pulse-outline"
            findings={vitalSigns}
          />
        </View>

        <View style={styles.half}>
          <SummaryCard
            title="General Inspection"
            icon="eye-outline"
            findings={
              generalInspection
            }
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <SummaryCard
            title="CVS"
            icon="heart-outline"
            findings={cvs}
          />
        </View>

        <View style={styles.half}>
          <SummaryCard
            title="Abdomen"
            icon="body-outline"
            findings={abdomen}
          />
        </View>
      </View>

      <SummaryCard
        title="Ophthalmology"
        icon="medical-outline"
        findings={ophthalmology}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  row: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  half: {
    flex: 1,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOW,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.primary + "12",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },

  tagText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.primary,
  },
});