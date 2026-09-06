import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";

interface Props {
  male: number;
  female: number;
  malePercentage: number;
  femalePercentage: number;
}

export default function StatisticsGenderDistribution({
  male,
  female,
  malePercentage,
  femalePercentage,
}: Props) {
  return (
    <View>
      <View style={styles.totalBar}>
        <View
          style={[
            styles.maleBar,
            {
              width: `${malePercentage}%`,
            },
          ]}
        />

        <View
          style={[
            styles.femaleBar,
            {
              width: `${femalePercentage}%`,
            },
          ]}
        />
      </View>

      <View style={styles.legend}>
        <Gender
          label="Male"
          count={male}
          percentage={malePercentage}
        />

        <Gender
          label="Female"
          count={female}
          percentage={femalePercentage}
        />
      </View>
    </View>
  );
}

function Gender({
  label,
  count,
  percentage,
}: {
  label: string;
  count: number;
  percentage: number;
}) {
  return (
    <View style={styles.gender}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>
        {percentage.toFixed(1)}%
      </Text>

      <Text style={styles.count}>
        {count} visits
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  totalBar: {
    height: 18,
    borderRadius: 9,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: COLORS.border,
  },

  maleBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },

  femaleBar: {
    height: "100%",
    backgroundColor: COLORS.warning,
  },

  legend: {
    flexDirection: "row",
    marginTop: 18,
    gap: 30,
  },

  gender: {
    flex: 1,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  value: {
    marginTop: 3,
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
  },

  count: {
    marginTop: 2,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.secondaryText,
  },
});