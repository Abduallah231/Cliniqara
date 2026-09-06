import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";

interface Item {
  range: string;
  count: number;
  percentage: number;
}

interface Props {
  items: Item[];
}

export default function StatisticsAgeDistribution({
  items,
}: Props) {
  const maxCount = Math.max(
    ...items.map((item) => item.count),
    1,
  );

  return (
    <View>
      {items.map((item) => {
        const width =
          item.count === 0
            ? 0
            : Math.max(
                3,
                (item.count / maxCount) * 100,
              );

        return (
          <View
            key={item.range}
            style={styles.row}
          >
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {item.range}
              </Text>

              <View style={styles.statsContainer}>
                <Text style={styles.percentage}>
                  {item.percentage.toFixed(1)}%
                </Text>

                <Text style={styles.count}>
                  {item.count}
                </Text>
              </View>
            </View>

            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  { width: `${width}%` },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 13,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.text,
  },

  percentage: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.secondaryText,
  },

  count: {
    minWidth: 18,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: "700",
    color: COLORS.secondaryText,
    textAlign: "right",
  },

  barTrack: {
    height: 9,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 5,
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
});