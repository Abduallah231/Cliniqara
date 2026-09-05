import Ionicons from "@expo/vector-icons/Ionicons";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppEmptyState from "@/components/common/AppEmptyState";
import SectionHeader from "@/components/common/SectionHeader";

import {
  getPatientVisits,
} from "@/services/visitApi";

import type {
  PatientVisitSummary,
} from "@/types/visit";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

// ======================================================
// Props
// ======================================================

type Props = {
  patientId: string;
};

// ======================================================
// Helpers
// ======================================================

function formatVisitDate(
  value?: string | null,
): string {
  if (!value) {
    return "Date not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

// ======================================================
// Component
// ======================================================

export default function LatestVisitCard({
  patientId,
}: Props) {
  const [
    latestVisit,
    setLatestVisit,
  ] =
    useState<PatientVisitSummary | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState(false);

  // ======================================================
  // Load Latest Completed Visit
  // ======================================================

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadLatestVisit =
        async () => {
          if (!patientId) {
            if (mounted) {
              setLatestVisit(null);
              setLoading(false);
            }

            return;
          }

          try {
            setLoading(true);
            setError(false);

            const visits =
              await getPatientVisits(
                patientId,
              );

            if (!mounted) {
              return;
            }

            /*
             * The backend already returns visits
             * ordered by createdAt DESC.
             *
             * We intentionally select the latest
             * COMPLETED visit because active visits
             * are handled separately by the Overview
             * navigation button.
             */
            const completedVisit =
              visits.find(
                (visit) =>
                  visit.visitStatus ===
                  "COMPLETED",
              ) ?? null;

            setLatestVisit(
              completedVisit,
            );
          } catch (err) {
            console.error(
              "Failed to load latest visit:",
              err,
            );

            if (mounted) {
              setLatestVisit(null);
              setError(true);
            }
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        };

      void loadLatestVisit();

      return () => {
        mounted = false;
      };
    }, [patientId]),
  );

  // ======================================================
  // Render
  // ======================================================

  return (
    <View style={styles.container}>
      <SectionHeader title="Latest Visit" />

      {loading ? (
        <AppCard>
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="small"
              color={
                COLORS.primary
              }
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading latest visit...
            </Text>
          </View>
        </AppCard>
      ) : error ? (
        <AppCard>
          <AppEmptyState
            title="Unable to Load Latest Visit"
            subtitle="Visit information could not be loaded."
            icon="alert-circle-outline"
          />
        </AppCard>
      ) : !latestVisit ? (
        <AppCard>
          <View
            style={
              styles.emptyContainer
            }
          >
            <View
              style={
                styles.emptyIcon
              }
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={
                  COLORS.primary
                }
              />
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No Completed Visits
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              This patient does not have a
              completed visit yet.
            </Text>
          </View>
        </AppCard>
      ) : (
        <AppCard>
          {/* ============================================
              Header
          ============================================ */}

          <View
            style={
              styles.header
            }
          >
            <View
              style={
                styles.headerContent
              }
            >
              <View
                style={
                  styles.dateRow
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={
                    COLORS.secondaryText
                  }
                />

                <Text
                  style={
                    styles.date
                  }
                >
                  {formatVisitDate(
                    latestVisit.createdAt,
                  )}
                </Text>
              </View>

              <Text
                style={
                  styles.complaint
                }
                numberOfLines={2}
              >
                {latestVisit
                  .chiefComplaint
                  ?.chiefComplaint
                  ?.name ??
                  "No chief complaint"}
              </Text>
            </View>

            <AppChip
              label="Completed"
              selected
            />
          </View>

          {/* ============================================
              Diagnosis
          ============================================ */}

          <View
            style={
              styles.info
            }
          >
            <View
              style={
                styles.row
              }
            >
              <View
                style={
                  styles.infoIcon
                }
              >
                <Ionicons
                  name="pulse-outline"
                  size={16}
                  color={
                    COLORS.primary
                  }
                />
              </View>

              <Text
                style={
                  styles.label
                }
              >
                Diagnosis
              </Text>
            </View>

            <Text
              style={
                styles.value
              }
              numberOfLines={2}
            >
              {latestVisit
                .diagnosis
                ?.primaryDiagnosisName ??
                "No primary diagnosis"}
            </Text>
          </View>

          {/* ============================================
              Doctor
          ============================================ */}

          <View
            style={
              styles.info
            }
          >
            <View
              style={
                styles.row
              }
            >
              <View
                style={
                  styles.infoIcon
                }
              >
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={
                    COLORS.primary
                  }
                />
              </View>

              <Text
                style={
                  styles.label
                }
              >
                Doctor
              </Text>
            </View>

            <Text
              style={
                styles.value
              }
              numberOfLines={2}
            >
              {latestVisit
                .doctor
                ?.fullName ??
                "Unknown doctor"}
            </Text>
          </View>

          {/* ============================================
              Open Visit
          ============================================ */}

          <AppButton
            title="Open Visit"
            icon="open-outline"
            onPress={() => {
              router.push({
                pathname:
                  "/visit-details",
                params: {
                  visitId:
                    latestVisit.id,
                  patientId,
                },
              });
            }}
          />
        </AppCard>
      )}
    </View>
  );
}

// ======================================================
// Styles
// ======================================================

const styles =
  StyleSheet.create({
    container: {
      gap: SPACING.sm,
    },

    // ====================================================
    // Loading
    // ====================================================

    loadingContainer: {
      minHeight: 110,
      alignItems: "center",
      justifyContent:
        "center",
      gap: SPACING.sm,
    },

    loadingText: {
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
      fontWeight: "500",
    },

    // ====================================================
    // Header
    // ====================================================

    header: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "flex-start",
      gap: SPACING.md,
      marginBottom:
        SPACING.md,
    },

    headerContent: {
      flex: 1,
      minWidth: 0,
    },

    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    date: {
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
      fontWeight: "500",
    },

    complaint: {
      marginTop: 5,
      fontSize:
        TYPOGRAPHY.title,
      lineHeight: 24,
      fontWeight: "700",
      color:
        COLORS.text,
    },

    // ====================================================
    // Info
    // ====================================================

    info: {
      marginBottom:
        SPACING.md,
      gap: 5,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    infoIcon: {
      width: 28,
      height: 28,
      borderRadius: 9,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        COLORS.background,
    },

    label: {
      fontSize:
        TYPOGRAPHY.small,
      fontWeight: "700",
      color:
        COLORS.secondaryText,
    },

    value: {
      fontSize:
        TYPOGRAPHY.body,
      lineHeight: 20,
      color:
        COLORS.text,
      fontWeight: "600",
      marginLeft: 36,
    },

    // ====================================================
    // Empty
    // ====================================================

    emptyContainer: {
      minHeight: 130,
      alignItems: "center",
      justifyContent:
        "center",
      paddingVertical:
        SPACING.md,
    },

    emptyIcon: {
      width: 44,
      height: 44,
      borderRadius: 13,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        COLORS.background,
      marginBottom:
        SPACING.sm,
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight: "700",
      color:
        COLORS.text,
    },

    emptyText: {
      marginTop: 4,
      fontSize:
        TYPOGRAPHY.small,
      lineHeight: 17,
      color:
        COLORS.secondaryText,
      textAlign: "center",
    },
  });