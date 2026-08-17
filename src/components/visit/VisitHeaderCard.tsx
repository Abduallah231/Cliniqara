import AppCard from "@/components/common/AppCard";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import { usePatientStore } from "@/store/patientStore";

type Props = {
  sectionTitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function VisitHeaderCard({
  sectionTitle,
  icon,
}: Props) {
  const patient = usePatientStore(
    (state) => state.currentPatient
  );

  const genderLabel =
    patient?.gender === "MALE"
      ? "Male"
      : patient?.gender === "FEMALE"
        ? "Female"
        : null;

  const ageLabel = (() => {
    // Use explicitly stored estimated age first
    if (
      patient?.estimatedAgeValue != null &&
      patient?.estimatedAgeUnit
    ) {
      const value = patient.estimatedAgeValue;

      const unit =
        patient.estimatedAgeUnit === "YEARS"
          ? value === 1
            ? "Year"
            : "Years"
          : patient.estimatedAgeUnit === "MONTHS"
            ? value === 1
              ? "Month"
              : "Months"
            : value === 1
              ? "Day"
              : "Days";

      return `${value} ${unit}`;
    }

    // Fallback: calculate age from date of birth
    if (patient?.dateOfBirth) {
      const birthDate = new Date(
        patient.dateOfBirth
      );

      const today = new Date();

      const differenceInMs =
        today.getTime() - birthDate.getTime();

      const days = Math.floor(
        differenceInMs /
          (1000 * 60 * 60 * 24)
      );

      if (days < 30) {
        return `${days} ${
          days === 1 ? "Day" : "Days"
        }`;
      }

      const months = Math.floor(
        days / 30.4375
      );

      if (months < 12) {
        return `${months} ${
          months === 1 ? "Month" : "Months"
        }`;
      }

      const years = Math.floor(
        months / 12
      );

      return `${years} ${
        years === 1 ? "Year" : "Years"
      }`;
    }

    return null;
  })();

  return (
    <>
      {/* Patient Information */}
      <AppCard style={styles.patientCard}>
        <View style={styles.patientHeader}>
          <View style={styles.patientIconContainer}>
            <Ionicons
              name="person-outline"
              size={22}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.patientMainInfo}>
            <Text
              style={styles.patientName}
              numberOfLines={1}
            >
              {patient?.fullName || "Patient"}
            </Text>

            {patient?.patientCode ? (
              <Text style={styles.patientCode}>
                Patient ID: {patient.patientCode}
              </Text>
            ) : null}
          </View>
        </View>

        {(genderLabel || ageLabel) && (
          <View style={styles.infoRow}>
            {genderLabel && (
              <View style={styles.infoChip}>
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={COLORS.primary}
                />

                <Text style={styles.infoChipText}>
                  {genderLabel}
                </Text>
              </View>
            )}

            {ageLabel && (
              <View style={styles.infoChip}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={COLORS.primary}
                />

                <Text style={styles.infoChipText}>
                  {ageLabel}
                </Text>
              </View>
            )}
          </View>
        )}
      </AppCard>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Ionicons
            name={icon}
            size={19}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.sectionTitle}>
          {sectionTitle}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  patientCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
  },

  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  patientIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary + "12",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },

  patientMainInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientCode: {
    marginTop: 3,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },

  infoChipText: {
    marginLeft: 5,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: 2,
  },

  sectionIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.primary + "12",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },
});