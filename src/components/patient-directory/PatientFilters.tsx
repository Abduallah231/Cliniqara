
import {
  StyleSheet,
  View,
} from "react-native";

import AppChip from "@/components/common/AppChip";

import {
  SPACING,
} from "@/theme";

type Props = {
  selected: string;

  onSelect: (value: string) => void;
};

const FILTERS = [
  "All",
  "Recent",
  "Waiting",
  "Favorites",
];

export default function PatientFilters({
  selected,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => (
        <AppChip
          key={filter}
          label={filter}
          selected={selected === filter}
          onPress={() => onSelect(filter)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: SPACING.sm,

    marginBottom: SPACING.lg,
  },
});