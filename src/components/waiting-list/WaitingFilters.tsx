import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppSearchBar from "@/components/common/AppSearchBar";
import { SPACING } from "@/theme";

export type WaitingFilter =
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
    <AppView style={styles.container}>
      <AppSearchBar
        value={search}
        onChangeText={onSearchChange}
        placeholder="Search patient..."
      />

      <AppView style={styles.filters}>
        <AppChip
          label="Waiting"
          style={styles.filterChip}
          selected={
            selectedFilter === "Waiting"
          }
          onPress={() =>
            onFilterChange("Waiting")
          }
        />

        <AppChip
          label="With Doctor"
          style={styles.filterChip}
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
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  filters: {
    flexDirection: "row",
    width: "100%",
    gap: SPACING.sm,
  },
  filterChip: {
    flex: 1,
  },
});
