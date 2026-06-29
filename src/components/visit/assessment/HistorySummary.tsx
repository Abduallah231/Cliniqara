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
  items: string[];
};

function SummaryCard({
  title,
  icon,
  items,
}: SummaryCardProps) {
  if (!items.length) return null;

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
        {items.map((item) => (
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

export default function HistorySummary() {
  const complaint = [
    "Chest Pain",
    "3 Days",
    "Dyspnea",
    "Sweating",
    "Syncope",
    
  ];

  const redFlags = [
    "Hypotension",
    "Syncope",
  ];

  const pastHistory = [
    "Diabetes",
    "Hypertension",
  ];

  const drugHistory = [
    "Metformin",
    "Aspirin",
  ];

  const allergyHistory = [
    "Penicillin",
  ];

  const familyHistory = [
    "IHD",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.half}>
          <SummaryCard
            title="Complaint"
            icon="chatbubble-outline"
            items={complaint}
          />
        </View>

        <View style={styles.half}>
          <SummaryCard
            title="Red Flags"
            icon="warning-outline"
            items={redFlags}
          />
        </View>
      </View>

      <View style={styles.row}>
  <View style={styles.half}>
    <SummaryCard
      title="Past History"
      icon="time-outline"
      items={pastHistory}
    />
  </View>

  <View style={styles.half}>
    <SummaryCard
      title="Drug History"
      icon="medical-outline"
      items={drugHistory}
    />
  </View>
</View>

<View style={styles.row}>
  <View style={styles.half}>
    <SummaryCard
      title="Allergy"
      icon="alert-circle-outline"
      items={allergyHistory}
    />
  </View>

  <View style={styles.half}>
    <SummaryCard
      title="Family History"
      icon="people-outline"
      items={familyHistory}
    />
  </View>
</View>
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
    backgroundColor: COLORS.primary + "12",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  tagText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: TYPOGRAPHY.small,
  },
});