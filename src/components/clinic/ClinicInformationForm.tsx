import {
  StyleSheet,
} from "react-native";

import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import {
  useEffect,
  useState,
} from "react";
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

  const [address, setAddress] = useState({
  governorate: value.governorate,
  city: value.city,
  district: value.district,
  street: value.streetAddress,
});

  useEffect(() => {
    setAddress({
      governorate: value.governorate,
      city: value.city,
      district: value.district,
      street: value.streetAddress,
    });
  }, [
    value.governorate,
    value.city,
    value.district,
    value.streetAddress,
  ]);

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
  governorate={address.governorate}
  city={address.city}
  district={address.district}
  street={address.street}
  onGovernorateChange={(governorate) => {
    const nextAddress = {
      ...address,
      governorate,
      city: "",
    };

    setAddress(nextAddress);

    onChange({
      ...value,
      governorate,
      city: "",
      district: nextAddress.district,
      streetAddress: nextAddress.street,
    });
  }}
  onCityChange={(city) => {
    const nextAddress = {
      ...address,
      city,
    };

    setAddress(nextAddress);

    onChange({
      ...value,
      governorate: nextAddress.governorate,
      city,
      district: nextAddress.district,
      streetAddress: nextAddress.street,
    });
  }}
  onDistrictChange={(district) => {
    const nextAddress = {
      ...address,
      district,
    };

    setAddress(nextAddress);

    onChange({
      ...value,
      governorate: nextAddress.governorate,
      city: nextAddress.city,
      district,
      streetAddress: nextAddress.street,
    });
  }}
  onStreetChange={(street) => {
    const nextAddress = {
      ...address,
      street,
    };

    setAddress(nextAddress);

    onChange({
      ...value,
      governorate: nextAddress.governorate,
      city: nextAddress.city,
      district: nextAddress.district,
      streetAddress: street,
    });
  }}
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