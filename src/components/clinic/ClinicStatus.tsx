import { StyleSheet, Text, View } from "react-native";

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
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isActive
                ? "#22C55E"
                : COLORS.danger,
            },
          ]}
        />

        <Text style={styles.statusText}>
          {isActive
            ? "Clinic is Active"
            : "Clinic is Inactive"}
        </Text>
      </View>

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