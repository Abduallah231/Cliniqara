import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useCallback, useEffect, useState, } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import SectionHeader from "@/components/common/SectionHeader";

import {
  getAllergyHistory,
  getDrugHistory,
} from "@/services/patientApi";

import {
  getPastHistory,
} from "@/services/visitApi";

import type { Patient } from "@/types/patient";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  patient: Patient;
};

type SnapshotState = {
  chronicDiseases: string[];
  medications: string[];
  allergies: string[];
};

function isRecord(
  value: unknown,
): value is Record<string, any> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getArray(
  value: unknown,
): any[] {
  return Array.isArray(value)
    ? value
    : [];
}

export default function ClinicalSnapshot({
  patient,
}: Props) {
  const [data, setData] =
    useState<SnapshotState>({
      chronicDiseases: [],
      medications: [],
      allergies: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadSnapshot =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          pastHistory,
          drugHistory,
          allergyHistory,
        ] = await Promise.all([
          getPastHistory(patient.id),
          getDrugHistory(patient.id),
          getAllergyHistory(patient.id),
        ]);

        const chronicDiseases =
          isRecord(pastHistory)
            ? getArray(
                pastHistory.chronicDiseases,
              )
            : [];

        const medications =
          isRecord(drugHistory)
            ? getArray(
                drugHistory.medications,
              )
            : [];

        const allergies =
          isRecord(allergyHistory)
            ? getArray(
                allergyHistory.allergies,
              )
            : [];

        setData({
          chronicDiseases:
            chronicDiseases
              .map((item) => {
                if (
                  typeof item ===
                  "string"
                ) {
                  return item;
                }

                return (
                  item?.diseaseName ??
                  ""
                );
              })
              .filter(Boolean),

          medications:
            medications
              .map((item) => {
                if (
                  typeof item ===
                  "string"
                ) {
                  return item;
                }

                return (
                  item?.medicationName ??
                  ""
                );
              })
              .filter(Boolean),

          allergies:
            allergies
              .map((item) => {
                if (
                  typeof item ===
                  "string"
                ) {
                  return item;
                }

                return (
                  item?.allergen ??
                  ""
                );
              })
              .filter(Boolean),
        });
      } catch (err) {
        console.error(
          "Failed to load clinical snapshot:",
          err,
        );

        setError(
          "Unable to load clinical history.",
        );
      } finally {
        setLoading(false);
      }
    }, [patient.id]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const renderItems = (
    items: string[],
    emptyLabel: string,
  ) => {
    if (items.length === 0) {
      return (
        <AppText style={styles.emptyText}>
          {emptyLabel}
        </AppText>
      );
    }

    return (
      <AppView style={styles.chips}>
        {items.map(
          (item, index) => (
            <AppChip
              key={`${item}-${index}`}
              label={item}
            />
          ),
        )}
      </AppView>
    );
  };

  return (
    <AppView style={styles.container}>
      <SectionHeader title="Clinical Snapshot" />

      <AppCard>
        {loading ? (
          <AppView style={styles.loadingContainer}>
            <AppText style={styles.loadingText}>
              Loading clinical history...
            </AppText>
          </AppView>
        ) : error ? (
          <AppView style={styles.errorContainer}>
            <AppText style={styles.errorText}>
              {error}
            </AppText>

            <AppPressable
              onPress={loadSnapshot}
              style={({ pressed }) => [
                styles.retryButton,
                pressed &&
                  styles.retryButtonPressed,
              ]}
            >
              <AppText style={styles.retryText}>
                Retry
              </AppText>
            </AppPressable>
          </AppView>
        ) : (
          <>
            <AppView style={styles.section}>
              <AppView style={styles.labelRow}>
                <AppText style={styles.label}>
                  Chronic Diseases
                </AppText>

                {data.chronicDiseases
                  .length > 0 && (
                  <AppText
                    style={
                      styles.count
                    }
                  >
                    {data.chronicDiseases.length}
                  </AppText>
                )}
              </AppView>

              {renderItems(
                data.chronicDiseases,
                "No chronic diseases recorded.",
              )}
            </AppView>

            <AppView style={styles.divider} />

            <AppView style={styles.section}>
              <AppView style={styles.labelRow}>
                <AppText style={styles.label}>
                  Current Medications
                </AppText>

                {data.medications
                  .length > 0 && (
                  <AppText
                    style={
                      styles.count
                    }
                  >
                    {data.medications.length}
                  </AppText>
                )}
              </AppView>

              {renderItems(
                data.medications,
                "No current medications recorded.",
              )}
            </AppView>

            <AppView style={styles.divider} />

            <AppView style={styles.section}>
              <AppView style={styles.labelRow}>
                <AppText style={styles.label}>
                  Allergies
                </AppText>

                {data.allergies
                  .length > 0 && (
                  <AppText
                    style={
                      styles.count
                    }
                  >
                    {data.allergies.length}
                  </AppText>
                )}
              </AppView>

              {renderItems(
                data.allergies,
                "No allergies recorded.",
              )}
            </AppView>
          </>
        )}

        <AppView style={styles.viewAllContainer}>
          <AppPressable
            onPress={() =>
              router.push({
                pathname:
                  "/clinical-history",
                params: {
                  patientId:
                    patient.id,
                },
              })
            }
            style={({ pressed }) => [
              styles.viewAllButton,
              pressed &&
                styles.viewAllPressed,
            ]}
          >
            <AppText
              style={styles.viewAllText}
            >
              View All
            </AppText>
          </AppPressable>
        </AppView>
      </AppCard>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  section: {
    gap: SPACING.sm,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: SPACING.sm,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.secondaryText,
  },

  count: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.primary,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  emptyText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  divider: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: SPACING.md,
  },

  loadingContainer: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },

  loadingText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  errorContainer: {
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },

  errorText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  retryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  retryButtonPressed: {
    opacity: 0.7,
  },

  retryText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.primary,
  },

  viewAllContainer: {
    marginTop: SPACING.lg,
    alignItems: "flex-end",
  },

  viewAllButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  viewAllPressed: {
    opacity: 0.65,
  },

  viewAllText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.primary,
  },
});