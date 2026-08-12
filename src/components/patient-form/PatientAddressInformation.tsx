import {
  StyleSheet,
  View,
} from "react-native";

import AppCard from "@/components/common/AppCard";
import AppDropdown from "@/components/common/AppDropdown";
import AppTextField from "@/components/common/AppTextField";
import SectionHeader from "@/components/common/SectionHeader";

import governorates from "@/data/governorates";
import citiesByGovernorate from "@/data/cities";

import {
  SPACING,
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

  title?: string;
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
  title = "Residential Address",
}: Props) {
  /*
   * =========================
   * Selected Governorate
   * =========================
   */
  const selectedGovernorate =
    governorates.find(
      (item) =>
        item.label === governorate,
    );

  /*
   * =========================
   * Cities / Markaz
   * =========================
   *
   * Cities are determined only
   * by the selected governorate.
   */
  const cityOptions =
    selectedGovernorate
      ? citiesByGovernorate[
          selectedGovernorate.id
        ] ?? []
      : [];

  /*
   * =========================
   * Governorate Change
   * =========================
   *
   * IMPORTANT:
   *
   * We update ONLY the governorate
   * here.
   *
   * We intentionally DO NOT call
   * onCityChange("") here.
   *
   * Calling two parent callbacks
   * during the same selection can
   * cause a controlled parent form
   * such as ClinicInformationForm
   * to overwrite the newly selected
   * governorate with an older state.
   *
   * Once the governorate changes,
   * cityOptions automatically change.
   * The previous city will therefore
   * no longer be a valid selected
   * option.
   */
  const handleGovernorateChange =
    (option: {
      id: string;
      label: string;
    }) => {
      onGovernorateChange(
        option.label,
      );
    };

  /*
   * =========================
   * City Change
   * =========================
   */
  const handleCityChange =
    (option: {
      id: string;
      label: string;
    }) => {
      onCityChange(
        option.label,
      );
    };

  /*
   * =========================
   * Screen
   * =========================
   */
  return (
    <AppCard
      style={styles.card}
    >
      <SectionHeader
        title={title}
      />

      {/* =========================
          Governorate + City
          ========================= */}
      <View
        style={styles.addressRow}
      >
        <View
          style={styles.addressField}
        >
          <AppDropdown
            label="Governorate"
            selected={
              selectedGovernorate
            }
            options={
              governorates
            }
            onChange={
              handleGovernorateChange
            }
          />
        </View>

        <View
          style={styles.addressField}
        >
          <AppDropdown
            label="City / Markaz"
            selected={
              cityOptions.find(
                (item) =>
                  item.label === city,
              )
            }
            options={
              cityOptions
            }
            onChange={
              handleCityChange
            }
          />
        </View>
      </View>

      {/* =========================
          District + Street
          ========================= */}
      <View
        style={styles.addressRow}
      >
        <View
          style={styles.addressField}
        >
          <AppTextField
            label="District / Village"
            value={district}
            onChangeText={
              onDistrictChange
            }
            placeholder="Enter district"
          />
        </View>

        <View
          style={styles.addressField}
        >
          <AppTextField
            label="Street / Building"
            value={street}
            onChangeText={
              onStreetChange
            }
            placeholder="Enter street"
          />
        </View>
      </View>
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    card: {
      marginTop:
        SPACING.xs,
      marginBottom:
        SPACING.xs,
    },

    addressRow: {
      flexDirection:
        "row",
      gap: SPACING.md,
    },

    addressField: {
      flex: 1,
    },
  });