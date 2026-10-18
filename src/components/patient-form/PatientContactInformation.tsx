import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import SectionHeader from "@/components/common/SectionHeader";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  phone: string;
  onPhoneChange: (value: string) => void;
};

export default function PatientContactInformation({
  phone,
  onPhoneChange,
}: Props) {
  return (
    <>
      <AppView style={styles.sectionHeader}>
        <Ionicons
          name="call-outline"
          size={20}
          color={COLORS.primary}
        />

        <AppText style={styles.sectionTitle}>
          Contact Information
        </AppText>
      </AppView>

      <AppCard style={styles.card}>
        <SectionHeader title="Phone Number" />

        <AppTextField
          value={phone}
          onChangeText={onPhoneChange}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          maxLength={11}
        />
      </AppCard>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  sectionTitle: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    marginTop: SPACING.xs,
  },
});