import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";
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
    <AppView>
      {items.map((item) => {
        const width =
          item.count === 0
            ? 0
            : Math.max(
                3,
                (item.count / maxCount) * 100,
              );

        return (
          <AppView
            key={item.range}
            style={styles.row}
          >
            <AppView style={styles.labelContainer}>
              <AppText style={styles.label}>
                {item.range}
              </AppText>

              <AppView style={styles.statsContainer}>
                <AppText style={styles.percentage}>
                  {item.percentage.toFixed(1)}%
                </AppText>

                <AppText style={styles.count}>
                  {item.count}
                </AppText>
              </AppView>
            </AppView>

            <AppView style={styles.barTrack}>
              <AppView
                style={[
                  styles.bar,
                  { width: `${width}%` },
                ]}
              />
            </AppView>
          </AppView>
        );
      })}
    </AppView>
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