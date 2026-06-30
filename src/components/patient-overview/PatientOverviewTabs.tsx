import { StyleSheet, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import { SPACING } from "@/theme";

export type PatientOverviewTab =
  | "overview"
  | "visits";

type Props = {
  activeTab: PatientOverviewTab;
  onChange: (
    tab: PatientOverviewTab
  ) => void;
};

export default function PatientOverviewTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <AppChip
        label="Overview"
        selected={
          activeTab === "overview"
        }
        style={styles.tab}
        onPress={() =>
          onChange("overview")
        }
      />

      <AppChip
        label="Visits"
        selected={
          activeTab === "visits"
        }
        style={styles.tab}
        onPress={() =>
          onChange("visits")
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  tab: {
    flex: 1,
  },
});