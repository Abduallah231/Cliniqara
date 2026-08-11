import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppCard from "@/components/common/AppCard";
import AppDropdown from "@/components/common/AppDropdown";
import AppTextField from "@/components/common/AppTextField";
import SectionHeader from "@/components/common/SectionHeader";

import governorates from "@/data/governorates";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  governorate: string;
  city: string;
  district: string;
  street: string;

  onGovernorateChange: (
    value: string,
  ) => void;

  onCityChange: (
    value: string,
  ) => void;

  onDistrictChange: (
    value: string,
  ) => void;

  onStreetChange: (
    value: string,
  ) => void;
};

export default function PatientAddressInformation({
  governorate,
  city,
  district,
  street,
  onGovernorateChange,
  onCityChange,
  onDistrictChange,
  onStreetChange,
}: Props) {
  return (
    <AppCard style={styles.card}>
      <SectionHeader title="Residential Address" />

      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <View style={styles.addressField}>
            <AppDropdown
              label="Governorate"
              selected={governorates.find(
                (item) =>
                  item.label ===
                  governorate,
              )}
              options={governorates}
              onChange={(option) =>
                onGovernorateChange(
                  option.label,
                )
              }
            />
          </View>

          <View style={styles.addressField}>
            <Text style={styles.label}>
              City / Markaz
            </Text>

            <AppTextField
              value={city}
              onChangeText={onCityChange}
              placeholder="Enter city"
            />
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={styles.addressField}>
            <Text style={styles.label}>
              District / Village
            </Text>

            <AppTextField
              value={district}
              onChangeText={
                onDistrictChange
              }
              placeholder="Enter district"
            />
          </View>

          <View style={styles.addressField}>
            <Text style={styles.label}>
              Street / Building
            </Text>

            <AppTextField
              value={street}
              onChangeText={onStreetChange}
              placeholder="Enter Street"
            />
          </View>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: SPACING.xs,
  },

  addressContainer: {
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 1,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginTop: SPACING.xs,
  },

  addressRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  addressField: {
    flex: 1,
  },

  label: {
    marginTop: SPACING.sm,
    marginBottom: 1,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },
});