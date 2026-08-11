import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import AgeField from "@/components/patient-form/AgeField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  identifierType: string;
  documentType: string;
  identifierNumber: string;

  fullName: string;

  age: string;
  ageUnit: "Days" | "Months" | "Years";

  gender: "male" | "female";

  maritalStatus:
    | "Single"
    | "Married"
    | "Divorced"
    | "Widowed";

  childrenCount: string;

  onIdentifierTypeChange: (
    value: string,
  ) => void;

  onDocumentTypeChange: (
    value: string,
  ) => void;

  onIdentifierNumberChange: (
    value: string,
  ) => void;

  onFullNameChange: (
    value: string,
  ) => void;

  onAgeChange: (
    value: string,
  ) => void;

  onAgeUnitChange: (
    value: "Days" | "Months" | "Years",
  ) => void;

  onGenderChange: (
    value: "male" | "female",
  ) => void;

  onMaritalStatusChange: (
    value:
      | "Single"
      | "Married"
      | "Divorced"
      | "Widowed",
  ) => void;

  onChildrenCountChange: (
    value: string,
  ) => void;
};

export default function PatientBasicInformation({
  identifierType,
  documentType,
  identifierNumber,
  fullName,
  age,
  ageUnit,
  gender,
  maritalStatus,
  childrenCount,
  onIdentifierTypeChange,
  onDocumentTypeChange,
  onIdentifierNumberChange,
  onFullNameChange,
  onAgeChange,
  onAgeUnitChange,
  onGenderChange,
  onMaritalStatusChange,
  onChildrenCountChange,
}: Props) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Ionicons
          name="person-circle-outline"
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.sectionTitle}>
          Basic Information
        </Text>
      </View>

      <AppCard>
        <SectionHeader title="Identifier Type" />

        <View style={styles.row}>
          <AppChip
            label="National ID"
            selected={
              identifierType ===
              "National ID"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "National ID",
              )
            }
          />

          <AppChip
            label="Birth Certificate"
            selected={
              identifierType ===
              "Birth Certificate"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "Birth Certificate",
              )
            }
          />

          <AppChip
            label="Passport"
            selected={
              identifierType ===
              "Passport"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "Passport",
              )
            }
          />

          <AppChip
            label="Other"
            selected={
              identifierType === "Other"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "Other",
              )
            }
          />

          <AppChip
            label="Unknown"
            selected={
              identifierType ===
              "Unknown"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "Unknown",
              )
            }
          />
        </View>

        {identifierType === "Other" && (
          <AppTextField
            label="Document Type"
            placeholder="Enter document type"
            value={documentType}
            onChangeText={
              onDocumentTypeChange
            }
          />
        )}

        {identifierType !== "Unknown" && (
          <AppTextField
            label="Identifier Number"
            placeholder={
              identifierType ===
              "National ID"
                ? "Enter 14-digit National ID"
                : identifierType ===
                    "Birth Certificate"
                  ? "Enter Birth Certificate Number"
                  : identifierType ===
                      "Passport"
                    ? "Enter Passport Number"
                    : "Enter Document Number"
            }
            value={identifierNumber}
            onChangeText={
              onIdentifierNumberChange
            }
            keyboardType={
              identifierType ===
              "National ID"
                ? "number-pad"
                : "default"
            }
          />
        )}

        <Divider />

        <SectionHeader title="Full Legal Name" />

        <AppTextField
          value={fullName}
          onChangeText={onFullNameChange}
          placeholder="Enter patient's full name"
        />

        <Divider />

        <SectionHeader title="Age" />

        <AgeField
          age={age}
          setAge={onAgeChange}
          ageUnit={ageUnit}
          setAgeUnit={onAgeUnitChange}
        />

        <Divider />

        <SectionHeader title="Gender" />

        <View style={styles.genderContainer}>
          <AppChip
            label="Male"
            selected={gender === "male"}
            style={styles.genderChip}
            onPress={() =>
              onGenderChange("male")
            }
          />

          <AppChip
            label="Female"
            selected={
              gender === "female"
            }
            style={styles.genderChip}
            onPress={() =>
              onGenderChange("female")
            }
          />
        </View>

        <Divider />

        <SectionHeader title="Marital Status" />

        <View style={styles.row}>
          <AppChip
            label="Single"
            selected={
              maritalStatus === "Single"
            }
            onPress={() =>
              onMaritalStatusChange(
                "Single",
              )
            }
          />

          <AppChip
            label="Married"
            selected={
              maritalStatus ===
              "Married"
            }
            onPress={() =>
              onMaritalStatusChange(
                "Married",
              )
            }
          />

          <AppChip
            label="Divorced"
            selected={
              maritalStatus ===
              "Divorced"
            }
            onPress={() =>
              onMaritalStatusChange(
                "Divorced",
              )
            }
          />

          <AppChip
            label="Widowed"
            selected={
              maritalStatus ===
              "Widowed"
            }
            onPress={() =>
              onMaritalStatusChange(
                "Widowed",
              )
            }
          />
        </View>

        {maritalStatus !== "Single" && (
          <AppTextField
            label="Number of Children"
            placeholder="Number of Children"
            value={childrenCount}
            onChangeText={
              onChildrenCountChange
            }
            keyboardType="numeric"
          />
        )}
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

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  genderContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  genderChip: {
    flex: 1,
  },
});