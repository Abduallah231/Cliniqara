import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import AppDropdown from "@/components/common/AppDropdown";
import Divider from "@/components/common/Divider";

import governorates from "@/data/governorates";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export type ClinicInformation = {
  name: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  city: string;
};

type Props = {
  value: ClinicInformation;
  onChange: (value: ClinicInformation) => void;
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
    <AppCard>
      <AppTextField
        label="Clinic Name"
        placeholder="Enter clinic name"
        value={value.name}
        onChangeText={(text) =>
          updateField("name", text)
        }
      />

      <Divider />

      <AppTextField
        label="Phone Number"
        placeholder="Enter clinic phone"
        keyboardType="phone-pad"
        value={value.phone}
        onChangeText={(text) =>
          updateField("phone", text)
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
          updateField("email", text)
        }
      />

      <Divider />

      <View>
        <Text style={styles.label}>
          Country
        </Text>

        <Text style={styles.fixedValue}>
          {value.country}
        </Text>
      </View>

      <Divider />

      <AppDropdown
        label="Governorate"
        selected={governorates.find(
          (item) =>
            item.label === value.city,
        )}
        options={governorates}
        onChange={(option) =>
          updateField(
            "city",
            option.label,
          )
        }
      />

      <Divider />

      <AppTextField
        label="Address"
        placeholder="Enter clinic address"
        multiline
        value={value.address}
        onChangeText={(text) =>
          updateField("address", text)
        }
      />
    </AppCard>
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