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

export default function AddressInformation({
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
   * The available cities depend
   * entirely on the selected
   * governorate.
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
   * Changing governorate makes
   * the previously selected city
   * invalid.
   */
  const handleGovernorateChange =
    (option: {
      id: string;
      label: string;
    }) => {
      onGovernorateChange(
        option.label,
      );
      
      /*
       * Reset City / Markaz
       */
      onCityChange("");
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
            selected={cityOptions.find(
              (item) =>
                item.label === city,
            )}
            options={cityOptions}
            onChange={(option) =>
              onCityChange(
                option.label,
              )
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