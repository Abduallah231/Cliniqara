import { StyleSheet, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppSearchBar from "@/components/common/AppSearchBar";

import { SPACING } from "@/theme";

export type WaitingFilter =
  | "All"
  | "Waiting"
  | "With Doctor";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  selectedFilter: WaitingFilter;
  onFilterChange: (
    filter: WaitingFilter
  ) => void;
};

export default function WaitingFilters({
  search,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}: Props) {
  return (
    <View style={styles.container}>
      <AppSearchBar
        value={search}
        onChangeText={onSearchChange}
        placeholder="Search patient..."
      />

      <View style={styles.filters}>
        <AppChip
          label="All"
          selected={
            selectedFilter === "All"
          }
          onPress={() =>
            onFilterChange("All")
          }
        />

        <AppChip
          label="Waiting"
          selected={
            selectedFilter === "Waiting"
          }
          onPress={() =>
            onFilterChange("Waiting")
          }
        />

        <AppChip
          label="With Doctor"
          selected={
            selectedFilter ===
            "With Doctor"
          }
          onPress={() =>
            onFilterChange(
              "With Doctor"
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
});