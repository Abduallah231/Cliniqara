import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";

import ClinicInformationForm, {
  type ClinicInformation,
} from "@/components/clinic/ClinicInformationForm";

import ClinicWorkingDays, {
  DAYS,
  type WorkingDay,
} from "@/components/clinic/ClinicWorkingDays";

import {
  validateWorkingDays,
} from "@/components/clinic/ClinicWorkingDaysValidation";
import {
  getApiError,
} from "@/utils/apiError";
import {
  createClinic,
  loadClinics,
} from "@/services/clinicApi";

import {
  COLORS,
  SPACING,
} from "@/theme";

export default function CreateClinicScreen() {
  const [clinicInformation, setClinicInformation] =
    useState<ClinicInformation>({
      name: "",
      phone: "",
      email: "",
      address: "",
      country: "Egypt",
      city: "",
    });

  const [workingDays, setWorkingDays] =
    useState<WorkingDay[]>(
      DAYS.map((day) => ({
        day,
        isClosed: true,
        is24Hours: false,
        shifts: [],
      })),
    );

  const [loading, setLoading] =
    useState(false);

  const handleCreate = async () => {
    /*
     * =========================
     * Clinic Information
     * =========================
     */

    if (!clinicInformation.name.trim()) {
      Alert.alert(
        "Required",
        "Enter the clinic name.",
      );
      return;
    }

    if (!clinicInformation.phone.trim()) {
      Alert.alert(
        "Required",
        "Enter the clinic phone number.",
      );
      return;
    }

    if (!clinicInformation.city.trim()) {
      Alert.alert(
        "Required",
        "Select the governorate.",
      );
      return;
    }

    if (!clinicInformation.address.trim()) {
      Alert.alert(
        "Required",
        "Enter the clinic address.",
      );
      return;
    }

    /*
     * =========================
     * Working Days Validation
     * =========================
     */

    const workingDaysValidation =
      validateWorkingDays(
        workingDays,
      );

    if (!workingDaysValidation.valid) {
      switch (
        workingDaysValidation.type
      ) {
        case "EMPTY_SHIFTS":
          Alert.alert(
            "Required",
            `Add at least one shift for ${workingDaysValidation.day}.`,
          );
          return;

        case "EMPTY_TIME":
          Alert.alert(
            "Required",
            `Select opening and closing time for Shift ${
              (workingDaysValidation.shiftIndex ??
                0) + 1
            } on ${
              workingDaysValidation.day
            }.`,
          );
          return;

        case "INVALID_TIME":
          Alert.alert(
            "Invalid Time",
            `Invalid time for Shift ${
              (workingDaysValidation.shiftIndex ??
                0) + 1
            } on ${
              workingDaysValidation.day
            }.`,
          );
          return;

        case "OVERLAPPING_SHIFTS":
          if (
            workingDaysValidation.first &&
            workingDaysValidation.second
          ) {
            Alert.alert(
              "Overlapping Shifts",
              `Shifts cannot overlap. Please check ${
                workingDaysValidation.first.day
              } Shift ${
                workingDaysValidation.first
                  .shiftIndex + 1
              } and ${
                workingDaysValidation.second.day
              } Shift ${
                workingDaysValidation.second
                  .shiftIndex + 1
              }.`,
            );
          }

          return;
      }
    }

    /*
     * =========================
     * Create Clinic
     * =========================
     */

    try {
      setLoading(true);

      const clinicWorkingDays =
        workingDays.map((day) => ({
          day: day.day,
          isClosed: day.isClosed,
          is24Hours: day.is24Hours,
          shifts:
            day.isClosed ||
            day.is24Hours
              ? []
              : day.shifts,
        }));

      await createClinic({
        name:
          clinicInformation.name.trim(),

        phone:
          clinicInformation.phone.trim(),

        email:
          clinicInformation.email.trim() ||
          undefined,

        address:
          clinicInformation.address.trim(),

        country:
          clinicInformation.country,

        city:
          clinicInformation.city.trim(),

        workingDays:
          clinicWorkingDays,
      });

      await loadClinics();

      Alert.alert(
        "Clinic Created",
        "Your clinic has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.back(),
          },
        ],
      );
    } catch (error: any) {
      console.log(
        "CREATE CLINIC ERROR:",
        error?.response?.status,
        error?.response?.data,
      );

      const apiError = getApiError(
        error,
        {
          title: "Unable to Create Clinic",
          message:
            "We couldn't create the clinic. Please check the entered information and try again.",
        },
      );

      Alert.alert(
        apiError.title,
        apiError.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Create Clinic"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <SectionHeader
          title="Clinic Information"
        />

        <ClinicInformationForm
          value={clinicInformation}
          onChange={
            setClinicInformation
          }
        />

        <SectionHeader
          title="Working Days"
        />

        <ClinicWorkingDays
          value={workingDays}
          onChange={setWorkingDays}
        />

        <AppButton
          title="Create Clinic"
          loading={loading}
          onPress={handleCreate}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    content: {
      padding: SPACING.md,
      paddingBottom:
        SPACING.xxl,
      gap: SPACING.lg,
    },
  });