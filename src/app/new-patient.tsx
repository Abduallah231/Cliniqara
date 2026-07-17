import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppDropdown from "@/components/common/AppDropdown";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import AgeField from "@/components/patient-form/AgeField";
import PatientActions from "@/components/patient-form/PatientActions";
import governorates from "@/data/governorates";
import occupations from "@/data/occupations";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function NewPatientScreen() {
  const [patient, setPatient] = useState({
    identifierType: "National ID",
    identifierNumber: "",
    documentType: "",
    fullName: "",
    age: "",
    ageUnit: "Years",
    gender: "male",

    maritalStatus: "Single",
    childrenCount: "",

    phone: "",
    occupation: "",
    otherOccupation: "",
    governorate: "",
    city: "",
    district: "",
    street: "",
  });

  const updatePatient = <
    K extends keyof typeof patient
  >(
    key: K,
    value: (typeof patient)[K]
  ) => {
    setPatient((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar
        title="New Patient"
        onBack={() => router.back()}
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
              selected={patient.identifierType === "National ID"}
              onPress={() =>
                updatePatient("identifierType", "National ID")
              }
            />

            <AppChip
              label="Birth Certificate"
              selected={
                patient.identifierType === "Birth Certificate"
              }
              onPress={() =>
                updatePatient(
                  "identifierType",
                  "Birth Certificate"
                )
              }
            />

            <AppChip
              label="Passport"
              selected={patient.identifierType === "Passport"}
              onPress={() =>
                updatePatient("identifierType", "Passport")
              }
            />

            <AppChip
              label="Other"
              selected={patient.identifierType === "Other"}
              onPress={() =>
                updatePatient("identifierType", "Other")
              }
            />

            <AppChip
              label="Unknown"
              selected={patient.identifierType === "Unknown"}
              onPress={() =>
                updatePatient("identifierType", "Unknown")
              }
            />
          </View>

          {patient.identifierType === "Other" && (
            <AppTextField
              label="Document Type"
              placeholder="Enter document type"
              value={patient.documentType}
              onChangeText={(text) =>
                updatePatient("documentType", text)
              }
            />
          )}

          {patient.identifierType !== "Unknown" && (
          <AppTextField
            label="Identifier Number"
            placeholder={
              patient.identifierType === "National ID"
                ? "Enter 14-digit National ID"
                : patient.identifierType ===
                  "Birth Certificate"
                ? "Enter Birth Certificate Number"
                : patient.identifierType === "Passport"
                ? "Enter Passport Number"
                : "Enter Document Number"
            }
            value={patient.identifierNumber}
            onChangeText={(text) =>
              updatePatient("identifierNumber", text)
            }
            keyboardType={
              patient.identifierType === "National ID"
                ? "number-pad"
                : "default"
            }
          />
        )}

          <Divider /><SectionHeader title="Full Legal Name" />

          <AppTextField
            value={patient.fullName}
            onChangeText={(text) =>
              updatePatient("fullName", text)
            }
            placeholder="Enter patient's full name"
          />

          <Divider />

          <SectionHeader title="Age" />

          <AgeField
            age={patient.age}
            setAge={(value) =>
              updatePatient("age", value)
            }
            ageUnit={patient.ageUnit}
            setAgeUnit={(value) =>
              updatePatient(
                "ageUnit",
                value
              )
            }
          />

          <Divider />

          <SectionHeader title="Gender" />

          <View style={styles.genderContainer}>
            <AppChip
              label="Male"
              selected={
                patient.gender === "male"
              }
              style={styles.genderChip}
              onPress={() =>
                updatePatient(
                  "gender",
                  "male"
                )
              }
            />

            <AppChip
              label="Female"
              selected={
                patient.gender ===
                "female"
              }
              style={styles.genderChip}
              onPress={() =>
                updatePatient(
                  "gender",
                  "female"
                )
              }
            />
          </View>

          <Divider />

          <SectionHeader title="Marital Status" />

          <View style={styles.row}>
            <AppChip
              label="Single"
              selected={
                patient.maritalStatus ===
                "Single"
              }
              onPress={() =>
                updatePatient(
                  "maritalStatus",
                  "Single"
                )
              }
            />

            <AppChip
              label="Married"
              selected={
                patient.maritalStatus ===
                "Married"
              }
              onPress={() =>
                updatePatient(
                  "maritalStatus",
                  "Married"
                )
              }
            />

            <AppChip
              label="Divorced"
              selected={
                patient.maritalStatus ===
                "Divorced"
              }
              onPress={() =>
                updatePatient(
                  "maritalStatus",
                  "Divorced"
                )
              }
            />

            <AppChip
              label="Widowed"
              selected={
                patient.maritalStatus ===
                "Widowed"
              }
              onPress={() =>
                updatePatient(
                  "maritalStatus",
                  "Widowed"
                )
              }
            />
          </View>

          {patient.maritalStatus !==
            "Single" && (
            <AppTextField
              label="Number of Children"
              placeholder="Number of Children"
              value={
                patient.childrenCount
              }
              onChangeText={(text) =>
                updatePatient(
                  "childrenCount",
                  text
                )
              }
              keyboardType="numeric"
            />
          )}
                   
        </AppCard>

        <View style={styles.sectionHeader}>
          <Ionicons
            name="call-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.sectionTitle}>
            Contact Information
          </Text>
        </View>

        <AppCard style={styles.contactCard}>

          <SectionHeader title="Phone Number" />

          <AppTextField
            value={patient.phone}
            onChangeText={(text) =>
              updatePatient("phone", text)
            }
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            maxLength={11}
          />

          <Divider />

          <SectionHeader title="Occupation" />

          <AppDropdown
            label="Occupation"
            selected={occupations.find(
              (o) => o.label === patient.occupation
            )}
            options={occupations}
            onChange={(option) =>
              updatePatient("occupation", option.label)
            }
          />

          {patient.occupation === "Other" && (
            <AppTextField
              placeholder="Specify occupation"
              value={patient.otherOccupation ?? ""}
              onChangeText={(text) =>
                updatePatient("otherOccupation", text)
              }
            />
          )}

          <Divider />

          <SectionHeader title="Residential Address" />

          <View style={styles.addressContainer}>

            <View style={styles.addressRow}>

              <View style={styles.addressField}>
                <AppDropdown
                  label="Governorate"
                  selected={governorates.find(
                    (g) =>
                      g.label ===
                      patient.governorate
                  )}
                  options={governorates}
                  onChange={(option) =>
                    updatePatient(
                      "governorate",
                      option.label
                    )
                  }
                />
              </View>

              <View style={styles.addressField}>
                <Text style={styles.label}>
                  City / Markaz
                </Text>

                <AppTextField
                  value={patient.city}
                  onChangeText={(text) =>
                    updatePatient(
                      "city",
                      text
                    )
                  }
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
                  value={patient.district}
                  onChangeText={(text) =>
                    updatePatient(
                      "district",
                      text
                    )
                  }
                  placeholder="Enter district"
                />
              </View>

              <View style={styles.addressField}>
                <Text style={styles.label}>
                  Street / Building
                </Text>

                <AppTextField
                  value={patient.street}
                  onChangeText={(text) =>
                    updatePatient(
                      "street",
                      text
                    )
                  }
                  placeholder="Enter Street"
                />
              </View>

            </View>

          </View>

        </AppCard>

        <AppCard style={styles.actionsCard}>
          <PatientActions />
        </AppCard>

      </AppKeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

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

  genderContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  genderChip: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
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

  contactCard: {
    marginTop: SPACING.xs,
  },

  actionsCard: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },

  addressContainer: {
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 1,
    borderRadius: 20,
    backgroundColor: "#F8FBFF",
    borderColor: "#D8E8FF",
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
});