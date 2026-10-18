import AppSafeAreaView from "@/components/common/AppSafeAreaView";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { router, useLocalSearchParams, } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";


import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";

import {
  getPrescriptionTemplate,
  type PrescriptionTemplate,
} from "@/services/prescriptionTemplateApi";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function PrescriptionTemplateDetails() {
  const params =
    useLocalSearchParams<{
      templateId?: string;
    }>();

  const templateId =
    Array.isArray(
      params.templateId,
    )
      ? params.templateId[0]
      : params.templateId;

  const [
    template,
    setTemplate,
  ] =
    useState<PrescriptionTemplate | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  // ======================================================
  // Load Template
  // ======================================================

  useEffect(() => {
    let cancelled = false;

    const loadTemplate = async () => {
      if (!templateId) {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const data =
          await getPrescriptionTemplate(
            templateId,
          );

        if (!cancelled) {
          setTemplate(data);
        }
      } catch (error) {
        console.error(
          "Failed to load prescription template:",
          error,
        );

        if (!cancelled) {
          setTemplate(null);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTemplate();

    return () => {
      cancelled = true;
    };
  }, [templateId]);

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <AppSafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <AppTopBar
          title="Template"
          onBack={() =>
            router.back()
          }
        />

        <AppView
          style={
            styles.center
          }
        >
          <ActivityIndicator
            size="large"
            color={
              COLORS.primary
            }
          />

          <AppText
            style={
              styles.loadingText
            }
          >
            Loading template...
          </AppText>
        </AppView>
      </AppSafeAreaView>
    );
  }

  // ======================================================
  // Error / Not Found
  // ======================================================

  if (error || !template) {
    return (
      <AppSafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <AppTopBar
          title="Template"
          onBack={() =>
            router.back()
          }
        />

        <AppView
          style={styles.center}
        >
          <AppText
            style={
              styles.errorTitle
            }
          >
            Template not found
          </AppText>

          <AppButton
            title="Back"
            variant="secondary"
            onPress={() =>
              router.back()
            }
          />
        </AppView>
      </AppSafeAreaView>
    );
  }

  // ======================================================
  // Render
  // ======================================================

  return (
    <AppSafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      <AppTopBar
        title={template.title}
        onBack={() =>
          router.back()
        }
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <FlatList
        data={template.medications}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        ListHeaderComponent={
          <SectionHeader title="Medications" />
        }
        renderItem={({ item }) => {
          const duration =
            item.durationValue !==
              null &&
            item.durationUnit
              ? `${item.durationValue} ${item.durationUnit.toLowerCase()}`
              : null;

          return (
            <AppCard
              style={
                styles.medicationCard
              }
            >
              <AppText
                style={
                  styles.medicationName
                }
              >
                {item.medication}
              </AppText>

              {!!item.instructions && (
                <AppText
                  style={
                    styles.secondary
                  }
                >
                  {item.instructions}
                </AppText>
              )}

              {!!duration && (
                <AppText
                  style={
                    styles.secondary
                  }
                >
                  Duration:{" "}
                  {duration}
                </AppText>
              )}
            </AppCard>
          );
        }}
        ItemSeparatorComponent={() => (
          <AppView
            style={{
              height:
                SPACING.md,
            }}
          />
        )}
        ListFooterComponent={
          <>
            {!!template.advice && (
              <>
                <SectionHeader title="Patient Advice" />

                <AppCard>
                  <AppText
                    style={
                      styles.primaryText
                    }
                  >
                    {
                      template.advice
                    }
                  </AppText>
                </AppCard>
              </>
            )}

            {!!template.followUp && (
              <>
                <SectionHeader title="Follow-up" />

                <AppCard>
                  <AppText
                    style={
                      styles.primaryText
                    }
                  >
                    {
                      template.followUp
                    }
                  </AppText>
                </AppCard>
              </>
            )}

            {!!template.notes && (
              <>
                <SectionHeader title="Notes" />

                <AppCard>
                  <AppText
                    style={
                      styles.secondary
                    }
                  >
                    {template.notes}
                  </AppText>
                </AppCard>
              </>
            )}

            <AppView
              style={styles.actions}
            >
              <AppButton
                title="Edit"
                variant="secondary"
                style={styles.button}
                onPress={() =>
                  router.push({
                    pathname:
                      "/new-template",
                    params: {
                      scope:
                        template.scope,
                      templateId:
                        template.id,
                    },
                  })
                }
              />
            </AppView>
          </>
        }
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: 40,
    gap: SPACING.md,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent:
      "center",
    padding: SPACING.lg,
    gap: SPACING.md,
  },

  loadingText: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
  },

  errorTitle: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
  },

  medicationCard: {
    gap: SPACING.xs,
  },

  medicationName: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
  },

  primaryText: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
  },

  secondary: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop:
      SPACING.lg,
  },

  button: {
    flex: 1,
  },
});