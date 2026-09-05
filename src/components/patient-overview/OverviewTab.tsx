import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import AppCard from "@/components/common/AppCard";

import ClinicalSnapshot from "./ClinicalSnapshot";
import LatestVisitCard from "./LatestVisitCard";

import type { Patient } from "@/types/patient";
import { useState } from "react";

import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  patient: Patient;
};

type InfoItemProps = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  width: number;
};

function formatDate(
  date: string | null | undefined,
) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString(
    "en-GB",
  );
}

function formatGender(
  gender: Patient["gender"],
) {
  return gender === "MALE"
    ? "Male"
    : "Female";
}

function formatMaritalStatus(
  status: Patient["maritalStatus"],
) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function formatAge(patient: Patient) {
  if (patient.dateOfBirth) {
    const birthDate = new Date(patient.dateOfBirth);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime())) {
      return "Not available";
    }

    let years =
      today.getFullYear() -
      birthDate.getFullYear();

    let months =
      today.getMonth() -
      birthDate.getMonth();

    let days =
      today.getDate() -
      birthDate.getDate();

    if (days < 0) {
      months--;

      const daysInPreviousMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
        ).getDate();

      days += daysInPreviousMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} Years, ${months} Months, ${days} Days`;
  }

  if (
    patient.estimatedAgeValue != null &&
    patient.estimatedAgeUnit
  ) {
    const units: Record<
      Patient["estimatedAgeUnit"] & string,
      string
    > = {
      YEARS: "Years",
      MONTHS: "Months",
      DAYS: "Days",
    };

    return `${patient.estimatedAgeValue} ${
      units[patient.estimatedAgeUnit] ??
      patient.estimatedAgeUnit
    }`;
  }

  return "Not available";
}

function formatAddress(
  patient: Patient,
) {
  return [
    patient.streetAddress,
    patient.district,
    patient.city,
    patient.governorate,
  ]
    .filter(Boolean)
    .join(", ") || "Not available";
}

function InfoItem({
  label,
  value,
  icon,
  width,
}: InfoItemProps) {
  return (
    <View
      style={[
        styles.infoItem,
        { width },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text
          style={styles.value}
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function OverviewTab({
  patient,
}: Props) {
  const [showAllPatientInfo, setShowAllPatientInfo] =
    useState(false);

  const { width: screenWidth } =
    useWindowDimensions();

  const horizontalPadding =
    SPACING.md * 2;

  const availableWidth =
    screenWidth - horizontalPadding;

  /*
   * Minimum width that keeps the
   * information cards comfortable.
   *
   * Tablet:
   * 3–4 cards per row depending
   * on available width.
   *
   * Phone:
   * 1–2 cards per row.
   */
  const minItemWidth = 150;

  const columns = Math.max(
    1,
    Math.floor(
      availableWidth /
        (minItemWidth + SPACING.sm),
    ),
  );

  const gap =
    SPACING.sm * (columns - 1);

  const itemWidth =
    (availableWidth - gap) /
    columns;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={false}
    >
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Patient Information
            </Text>

            <Text style={styles.subtitle}>
              Basic patient details
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="person-outline"
              size={22}
              color={COLORS.primary}
            />
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.grid}>
          <InfoItem
            label="Age"
            value={formatAge(patient)}
            icon="hourglass-outline"
            width={itemWidth}
          />

          <InfoItem
            label="Gender"
            value={formatGender(patient.gender)}
            icon="male-female-outline"
            width={itemWidth}
          />

          <InfoItem
            label="Phone"
            value={patient.phone ?? "Not available"}
            icon="call-outline"
            width={itemWidth}
          />
        </View>

        {/* View All */}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() =>
            setShowAllPatientInfo(
              (previous) => !previous,
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>
            {showAllPatientInfo
              ? "View Less"
              : "View All"}
          </Text>

          <Ionicons
            name={
              showAllPatientInfo
                ? "chevron-up"
                : "chevron-down"
            }
            size={18}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {/* Additional Information */}
        {showAllPatientInfo && (
          <View style={styles.additionalInfo}>
            <View style={styles.grid}>
              <InfoItem
                label="Patient Code"
                value={patient.patientCode}
                icon="card-outline"
                width={itemWidth}
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(patient.dateOfBirth)}
                icon="calendar-outline"
                width={itemWidth}
              />

              <InfoItem
                label="Marital Status"
                value={formatMaritalStatus(
                  patient.maritalStatus,
                )}
                icon="heart-outline"
                width={itemWidth}
              />

              <InfoItem
                label="Occupation"
                value={
                  patient.occupation ??
                  "Not available"
                }
                icon="briefcase-outline"
                width={itemWidth}
              />

              <InfoItem
                label="Address"
                value={formatAddress(patient)}
                icon="location-outline"
                width={itemWidth}
              />
            </View>
          </View>
        )}
      </AppCard>

      <ClinicalSnapshot
        patient={patient}
      />

      <LatestVisitCard
        patientId={patient.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: 120,
    gap: SPACING.md,
  },

  card: {
    ...SHADOW,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },

  title: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 3,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  infoItem: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    marginRight: SPACING.sm,
  },

  infoContent: {
    flex: 1,
    minWidth: 0,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondaryText,
    marginBottom: 4,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  viewAllButton: {
    marginTop: SPACING.md,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  viewAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  additionalInfo: {
    marginTop: SPACING.md,
  },
});