import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMemo, useState } from "react";

import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";
import type {
  StatisticsVisitsOverview as VisitsOverview,
} from "@/types/statistics";

interface Props {
  data: VisitsOverview;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function StatisticsVisitsOverview({
  data,
}: Props) {
  const years = data.yearly
    .map((item) => item.year)
    .sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] =
    useState<number | null>(
      years.length ? years[0] : null,
    );

  const currentYear =
    selectedYear ?? years[0] ?? null;

  const monthly = useMemo(() => {
    if (currentYear === null) {
      return [];
    }

    return data.monthly.filter(
      (item) => item.year === currentYear,
    );
  }, [data.monthly, currentYear]);

  const maxMonthlyVisits = Math.max(
    ...monthly.map((item) => item.count),
    1,
  );

  return (
    <View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>
          Total Clinic Visits
        </Text>

        <Text style={styles.totalValue}>
          {data.total}
        </Text>
      </View>

      {years.length > 0 ? (
        <>
          <Text style={styles.subTitle}>
            Visits by Year
          </Text>

          <View style={styles.yearList}>
            {years.map((year) => {
              const item = data.yearly.find(
                (entry) => entry.year === year,
              );

              const selected =
                year === currentYear;

              return (
                <Pressable
                  key={year}
                  onPress={() =>
                    setSelectedYear(year)
                  }
                  style={[
                    styles.yearChip,
                    selected &&
                      styles.yearChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.yearText,
                      selected &&
                        styles.yearTextSelected,
                    ]}
                  >
                    {year}
                  </Text>

                  <Text
                    style={[
                      styles.yearCount,
                      selected &&
                        styles.yearCountSelected,
                    ]}
                  >
                    {item?.count ?? 0}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      {currentYear !== null ? (
        <>
          <Text style={styles.subTitle}>
            Monthly Visits — {currentYear}
          </Text>

          {monthly.length ? (
            monthly.map((item) => {
              const width =
                item.count === 0
                  ? 0
                  : Math.max(
                      3,
                      (item.count /
                        maxMonthlyVisits) *
                        100,
                    );

              return (
                <View
                  key={`${item.year}-${item.month}`}
                  style={styles.monthRow}
                >
                  <View style={styles.monthLabel}>
                    <Text style={styles.monthName}>
                      {MONTHS[item.month - 1]}
                    </Text>

                    <Text style={styles.average}>
                      {item.averagePerDay.toFixed(1)}/day
                    </Text>
                  </View>

                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${width}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.monthCount}>
                    {item.count}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>
              No visits recorded for this year.
            </Text>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  totalContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  totalLabel: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  totalValue: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.primary,
  },

  subTitle: {
    marginBottom: 10,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.text,
  },

  yearList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  yearChip: {
    minWidth: 78,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: COLORS.card,
  },

  yearChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  yearText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.text,
  },

  yearTextSelected: {
    color: COLORS.white,
  },

  yearCount: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.secondaryText,
  },

  yearCountSelected: {
    color: COLORS.white,
  },

  monthRow: {
    marginBottom: 15,
    paddingRight: 30,
  },

  monthLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  monthName: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },

  average: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.secondaryText,
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

  monthCount: {
    position: "absolute",
    right: 0,
    bottom: 0,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: "600",
    color: COLORS.text,
  },

  emptyText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
});