import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import AgeField from "@/components/patient-form/AgeField";
import PatientActions from "@/components/patient-form/PatientActions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDropdown from "@/components/common/AppDropdown";
import governorates from "@/data/governorates";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function NewPatientScreen() {
  const [patient, setPatient] = useState({
    fullName: "",

    age: "",
    ageUnit: "Years",

    gender: "male",

    phone: "",

    occupation: "",

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
        onRightPress={() => router.push("/settings")}
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
          <Text style={styles.label}>
            Full Legal Name
          </Text>

        <AppTextField
          value={patient.fullName}
          onChangeText={(text) =>
            updatePatient("fullName", text)
          }
          placeholder="Enter patient's full name"
        />
          <Text style={styles.label}>
            Age
          </Text>

          <AgeField
            age={patient.age}
            setAge={(value) =>
              updatePatient("age", value)
            }
            ageUnit={patient.ageUnit}
            setAgeUnit={(value) =>
              updatePatient("ageUnit", value)
            }
          />

          <Text style={styles.label}>
            Gender
          </Text>

          <View style={styles.genderContainer}>
          <AppChip
            label="Male"
            selected={patient.gender === "male"}
            style={styles.genderChip}
            onPress={() =>
              updatePatient("gender", "male")
            }
          />

          <AppChip
            label="Female"
            selected={patient.gender === "female"}
            style={styles.genderChip}
            onPress={() =>
              updatePatient("gender", "female")
            }
          />
        </View> 
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
          <Text style={styles.label}>
            Phone Number
          </Text>

          <AppTextField
            value={patient.phone}
            onChangeText={(text) =>
              updatePatient("phone", text)
            }
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
            

          <Text style={styles.label}>
            Occupation
          </Text>

          <AppTextField
            value={patient.occupation}
            onChangeText={(text) =>
              updatePatient("occupation", text)
            }
            placeholder="Enter occupation"
          />

          <Text style={styles.label}>
            Residential Address
          </Text>
          <View style={styles.addressContainer}>
          <View style={styles.addressRow}>
          <View style={styles.addressField}>
            <AppDropdown
              label="Governorate"
              selected={
                governorates.find(
                  (g) => g.label === patient.governorate
                )
              }
              options={governorates}
              onChange={(option) =>
                updatePatient("governorate", option.label)
              }
            />
          </View>

          <View style={styles.addressField}>
            <Text style={styles.label}>City / Markaz</Text>
            <AppTextField
              value={patient.city}
              onChangeText={(text) =>
                updatePatient("city", text)
              }
              placeholder="Enter city"
            />
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={styles.addressField}>
            <Text style={styles.label}>District / Village</Text>
            <AppTextField
              value={patient.district}
              onChangeText={(text) =>
                updatePatient("district", text)
              }
              placeholder="Enter district"
            />
          </View>

          <View style={styles.addressField}>
            <Text style={styles.label}>Street / Building</Text>
            <AppTextField
              value={patient.street}
              onChangeText={(text) =>
                updatePatient("street", text)
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
addressRow: {
  flexDirection: "row",
  gap: SPACING.md,
},

addressField: {
  flex: 1,
},
  scroll: {
    flex: 1,
  },

  genderContainer: {
  flexDirection: "row",
  gap: SPACING.sm,
},

genderChip: {
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