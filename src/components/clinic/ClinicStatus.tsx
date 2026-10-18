import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  isActive: boolean;
  isOwner: boolean;
  onDeactivate: () => void;
  onReactivate: () => void;
};

export default function ClinicStatus({
  isActive,
  isOwner,
  onDeactivate,
  onReactivate,
}: Props) {
  return (
    <AppCard>
      <AppView style={styles.statusRow}>
        <AppView
          style={[
            styles.statusDot,
            {
              backgroundColor: isActive
                ? "#22C55E"
                : COLORS.danger,
            },
          ]}
        />

        <AppText style={styles.statusText}>
          {isActive
            ? "Clinic is Active"
            : "Clinic is Inactive"}
        </AppText>
      </AppView>

      {isOwner && (
        <AppButton
          title={
            isActive
              ? "Deactivate Clinic"
              : "Reactivate Clinic"
          }
          onPress={
            isActive
              ? onDeactivate
              : onReactivate
          }
        />
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },

  statusText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
});