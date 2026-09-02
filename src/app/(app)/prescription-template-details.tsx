import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView
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

        <View
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

          <Text
            style={
              styles.loadingText
            }
          >
            Loading template...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ======================================================
  // Error / Not Found
  // ======================================================

  if (error || !template) {
    return (
      <SafeAreaView
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

        <View
          style={styles.center}
        >
          <Text
            style={
              styles.errorTitle
            }
          >
            Template not found
          </Text>

          <AppButton
            title="Back"
            variant="secondary"
            onPress={() =>
              router.back()
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  // ======================================================
  // Render
  // ======================================================

  return (
    <SafeAreaView
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
              <Text
                style={
                  styles.medicationName
                }
              >
                {item.medication}
              </Text>

              {!!item.instructions && (
                <Text
                  style={
                    styles.secondary
                  }
                >
                  {item.instructions}
                </Text>
              )}

              {!!duration && (
                <Text
                  style={
                    styles.secondary
                  }
                >
                  Duration:{" "}
                  {duration}
                </Text>
              )}
            </AppCard>
          );
        }}
        ItemSeparatorComponent={() => (
          <View
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
                  <Text
                    style={
                      styles.primaryText
                    }
                  >
                    {
                      template.advice
                    }
                  </Text>
                </AppCard>
              </>
            )}

            {!!template.followUp && (
              <>
                <SectionHeader title="Follow-up" />

                <AppCard>
                  <Text
                    style={
                      styles.primaryText
                    }
                  >
                    {
                      template.followUp
                    }
                  </Text>
                </AppCard>
              </>
            )}

            {!!template.notes && (
              <>
                <SectionHeader title="Notes" />

                <AppCard>
                  <Text
                    style={
                      styles.secondary
                    }
                  >
                    {template.notes}
                  </Text>
                </AppCard>
              </>
            )}

            <View
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
            </View>
          </>
        }
      />
    </SafeAreaView>
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