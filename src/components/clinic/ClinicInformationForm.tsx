import {
  StyleSheet,
} from "react-native";

import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";

import PatientAddressInformation from "@/components/patient-form/PatientAddressInformation";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export type ClinicInformation = {
  name: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  district: string;
  streetAddress: string;
};

type Props = {
  value: ClinicInformation;
  onChange: (
    value: ClinicInformation,
  ) => void;
};

export default function ClinicInformationForm({
  value,
  onChange,
}: Props) {
  const updateField = (
    field: keyof ClinicInformation,
    fieldValue: string,
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <>
      <AppCard>
        <AppTextField
          label="Clinic Name"
          placeholder="Enter clinic name"
          value={value.name}
          onChangeText={(text) =>
            updateField(
              "name",
              text,
            )
          }
        />

        <Divider />

        <AppTextField
          label="Phone Number"
          placeholder="Enter clinic phone"
          keyboardType="phone-pad"
          value={value.phone}
          onChangeText={(text) =>
            updateField(
              "phone",
              text,
            )
          }
        />

        <Divider />

        <AppTextField
          label="Email"
          placeholder="Enter clinic email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={value.email}
          onChangeText={(text) =>
            updateField(
              "email",
              text,
            )
          }
        />
      </AppCard>

      <PatientAddressInformation
        title="Clinic Address"
        governorate={
          value.governorate
        }
        city={value.city}
        district={
          value.district
        }
        street={
          value.streetAddress
        }
        onGovernorateChange={(
          governorate,
        ) =>
          updateField(
            "governorate",
            governorate,
          )
        }
        onCityChange={(city) =>
          updateField(
            "city",
            city,
          )
        }
        onDistrictChange={(
          district,
        ) =>
          updateField(
            "district",
            district,
          )
        }
        onStreetChange={(
          streetAddress,
        ) =>
          updateField(
            "streetAddress",
            streetAddress,
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.secondaryText,
    marginBottom: SPACING.xs,
  },

  fixedValue: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
});