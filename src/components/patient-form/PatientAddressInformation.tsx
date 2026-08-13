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

  otherGovernorate?: string;
  otherCity?: string;

  onGovernorateChange: (
    value: string,
  ) => void;

  onCityChange: (
    value: string,
  ) => void;

  onOtherGovernorateChange?: (
    value: string,
  ) => void;

  onOtherCityChange?: (
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

  otherGovernorate,
  otherCity,

  onGovernorateChange,
  onCityChange,

  onOtherGovernorateChange,
  onOtherCityChange,

  onDistrictChange,
  onStreetChange,

  title = "Residential Address",
}: Props) {
  /*
   * =========================
   * Governorate Options
   * =========================
   */

  const governorateOptions = [
    ...governorates,
    {
      id: "other",
      label: "Other",
    },
  ];

  /*
   * =========================
   * Selected Governorate
   * =========================
   */

  const selectedGovernorate =
    governorateOptions.find(
      (item) =>
        item.label === governorate,
    );

  /*
   * =========================
   * City / Markaz Options
   * =========================
   */

  const normalCityOptions =
    selectedGovernorate &&
    selectedGovernorate.id !== "other"
      ? citiesByGovernorate[
          selectedGovernorate.id
        ] ?? []
      : [];

  const cityOptions = [
    ...normalCityOptions,
    {
      id: "other",
      label: "Other",
    },
  ];

  /*
   * =========================
   * Governorate Change
   * =========================
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
              governorateOptions
            }
            onChange={
              handleGovernorateChange
            }
          />

          {governorate === "Other" &&
            onOtherGovernorateChange && (
              <AppTextField
                placeholder="Specify governorate"
                value={
                  otherGovernorate ?? ""
                }
                onChangeText={
                  onOtherGovernorateChange
                }
              />
            )}
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

          {city === "Other" &&
            onOtherCityChange && (
              <AppTextField
                placeholder="Specify city / Markaz"
                value={
                  otherCity ?? ""
                }
                onChangeText={
                  onOtherCityChange
                }
              />
            )}
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