import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";

import ClinicInformationForm, {
  type ClinicInformation,
} from "@/components/clinic/ClinicInformationForm";

import ClinicWorkingDays, {
  DAYS,
} from "@/components/clinic/ClinicWorkingDays";

import type {
  CreateClinicDto,
  WorkingDay,
} from "@/types/clinic";

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

// ======================================================
// Screen
// ======================================================

export default function CreateClinicScreen() {
  // ====================================================
  // Clinic Information
  // ====================================================

  const [
    clinicInformation,
    setClinicInformation,
  ] = useState<ClinicInformation>({
    name: "",
    phone: "",
    email: "",
    governorate: "",
    city: "",
    district: "",
    streetAddress: "",
    otherGovernorate: "",
    otherCity: "",
  });

  // ====================================================
  // Working Days
  // ====================================================

  const [workingDays, setWorkingDays] =
    useState<WorkingDay[]>(
      DAYS.map((day) => ({
        day,
        isClosed: true,
        is24Hours: false,
        shifts: [],
      })),
    );

  // ====================================================
  // Loading
  // ====================================================

  const [loading, setLoading] =
    useState(false);

  // ====================================================
  // Create Clinic
  // ====================================================

  const handleCreate = async () => {
    // ==================================================
    // Clinic Information Validation
    // ==================================================

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

    if (
      !clinicInformation.governorate.trim()
    ) {
      Alert.alert(
        "Required",
        "Select the governorate.",
      );
      return;
    }

    if (!clinicInformation.city.trim()) {
      Alert.alert(
        "Required",
        "Enter the city.",
      );
      return;
    }

    if (
      !clinicInformation.district.trim()
    ) {
      Alert.alert(
        "Required",
        "Enter the district.",
      );
      return;
    }

    if (
      !clinicInformation.streetAddress.trim()
    ) {
      Alert.alert(
        "Required",
        "Enter the street address.",
      );
      return;
    }

    // ==================================================
    // Working Days Validation
    // ==================================================

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

    // ==================================================
    // Create Clinic
    // ==================================================

    try {
      setLoading(true);

      // ------------------------------------------------
      // Normalize Working Days
      // ------------------------------------------------

      const clinicWorkingDays: CreateClinicDto["workingDays"] =
        workingDays.map((day) => ({
          day: day.day,
          isClosed: day.isClosed,
          is24Hours: day.is24Hours,

          shifts:
            day.isClosed ||
            day.is24Hours
              ? []
              : day.shifts.map(
                  (shift) => ({
                    startTime:
                      shift.startTime,
                    endTime:
                      shift.endTime,
                  }),
                ),
        }));

      // ------------------------------------------------
      // Create Payload
      // ------------------------------------------------

      const payload: CreateClinicDto = {
        name:
          clinicInformation.name.trim(),

        phone:
          clinicInformation.phone.trim(),

        email:
          clinicInformation.email.trim() ||
          undefined,

        governorate:
          clinicInformation.governorate.trim(),

        city:
          clinicInformation.city.trim(),

        district:
          clinicInformation.district.trim(),

        streetAddress:
          clinicInformation.streetAddress.trim(),

        workingDays:
          clinicWorkingDays,
      };

      // ------------------------------------------------
      // API
      // ------------------------------------------------

      await createClinic(payload);

      // ------------------------------------------------
      // Refresh Clinics Store
      // ------------------------------------------------

      await loadClinics();

      // ------------------------------------------------
      // Success
      // ------------------------------------------------

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

      const apiError =
        getApiError(error, {
          title:
            "Unable to Create Clinic",

          message:
            "We couldn't create the clinic. Please check the entered information and try again.",
        });

      Alert.alert(
        apiError.title,
        apiError.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // Render
  // ====================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* ==============================================
          Top Bar
      ============================================== */}

      <AppTopBar
        title="Create Clinic"
        onBack={() =>
          router.back()
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ============================================
            Clinic Information
        ============================================ */}

        <SectionHeader
          title="Clinic Information"
        />

        <ClinicInformationForm
          value={clinicInformation}
          onChange={
            setClinicInformation
          }
        />

        {/* ============================================
            Working Days
        ============================================ */}

        <SectionHeader
          title="Working Days"
        />

        <ClinicWorkingDays
          value={workingDays}
          onChange={setWorkingDays}
        />

        {/* ============================================
            Create Button
        ============================================ */}

        <AppButton
          title="Create Clinic"
          loading={loading}
          onPress={handleCreate}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// Styles
// ======================================================

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