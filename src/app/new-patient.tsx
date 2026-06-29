import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTopBar from "@/components/common/AppTopBar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppTextField from "@/components/common/AppTextField";
import AgeField from "@/components/patient-form/AgeField";
import PatientActions from "@/components/patient-form/PatientActions";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function NewPatientScreen() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState("Years");

  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar
        title="New Patient"
        onBack={() => router.back()}
        onRightPress={() => router.push("/settings")}
      />

      <ScrollView
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
                placeholder="Enter patient's full name"
              />

          <Text style={styles.label}>
            Age
          </Text>

          <AgeField
            age={age}
            setAge={setAge}
            ageUnit={ageUnit}
            setAgeUnit={setAgeUnit}
          />

          <Text style={styles.label}>
            Gender
          </Text>

          <View style={styles.Gencontainer}>
  <AppChip
    label="Male"
    selected={gender === "male"}
    style={styles.genderChip}
    onPress={() => setGender("male")}
  />

  <AppChip
    label="Female"
    selected={gender === "female"}
    style={styles.genderChip}
    onPress={() => setGender("female")}
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
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            

          <Text style={styles.label}>
            Occupation
          </Text>

          <AppTextField
                placeholder="Enter occupation"
              />

          <Text style={styles.label}>
            Residential Address
          </Text>

          <AppTextField
                placeholder="Street address, City, State..."
                multiline
                style={styles.input}
              />
        </AppCard>

        

        <AppCard style={styles.actionsCard}>
          <PatientActions />
        </AppCard>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
input: {
    minHeight: 100,
  },
  scroll: {
    flex: 1,
  },

  Gencontainer: {
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
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,

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
});