import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppTextField from "@/components/common/AppTextField";
import investigationsData from "@/data/investigations";
import { useVisitStore } from "@/store/visitStore";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function InvestigationResultsScreen() {
  const investigationsState = useVisitStore(
    (state) =>
      state.visit.assessment.investigations
  );

  const updateInvestigationResult =
    useVisitStore(
      (state) =>
        state.updateInvestigationResult
    );

  const updateInvestigationStatus =
    useVisitStore(
      (state) =>
        state.updateInvestigationStatus
    );

  const [expandedItem, setExpandedItem] =
    useState<string | null>(null);

  const getResultValue = (
    investigationId: string,
    fieldId: string
  ) => {
    const result =
      investigationsState.results.find(
        (item) =>
          item.investigationId ===
          investigationId
      );

    return (
      result?.values.find(
        (field) =>
          field.fieldId === fieldId
      )?.value ?? ""
    );
  };

  const updateResult = (
    investigationId: string,
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    updateInvestigationResult(
      investigationId,
      fieldId,
      fieldLabel,
      value
    );

    updateInvestigationStatus(
      investigationId,
      "completed"
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.title}>
        Investigation Results
      </Text>

      {investigationsState.requestedInvestigations.map(
        (investigation) => {
          const expanded =
            expandedItem ===
            investigation.name;

          const investigationInfo =
            investigationsData.find(
              (item) =>
                item.name ===
                investigation.name
            );

          const type =
            investigationInfo?.type ??
            "single";

          return (
            <View
              key={investigation.name}
              style={styles.card}
            >
              <Pressable
                style={styles.header}
                onPress={() =>
                  setExpandedItem(
                    expanded
                      ? null
                      : investigation.name
                  )
                }
              >
                <View
                  style={
                    styles.headerLeft
                  }
                >
                  <Ionicons
                    name="flask-outline"
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.headerTitle
                    }
                  >
                    {investigation.name}
                  </Text>
                </View>

                <Ionicons
                  name={
                    expanded
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={20}
                  color={
                    COLORS.secondaryText
                  }
                />
              </Pressable>

              {expanded && (
                <View
                  style={
                    styles.content
                  }
                >
                  {type === "single" && (
                    <AppTextField
                      placeholder="Result"
                      value={String(
                        getResultValue(
                          investigation.name,
                          "result"
                        )
                      )}
                      onChangeText={(
                        text
                      ) =>
                        updateResult(
                          investigation.name,
                          "result",
                          "Result",
                          text
                        )
                      }
                    />
                  )}

                  {type === "multi" && (
                    <>
                      {investigationInfo?.fields?.map(
                        (
                          field: string
                        ) => (
                          <AppTextField
                            key={field}
                            placeholder={
                              field
                            }
                            value={String(
                              getResultValue(
                                investigation.name,
                                field
                              )
                            )}
                            onChangeText={(
                              text
                            ) =>
                              updateResult(
                                investigation.name,
                                field,
                                field,
                                text
                              )
                            }
                          />
                        )
                      )}
                    </>
                  )}

                  {type === "text" && (
                    <AppTextField
                      multiline
                      placeholder="Interpretation"
                      value={String(
                        getResultValue(
                          investigation.name,
                          "interpretation"
                        )
                      )}
                      onChangeText={(
                        text
                      ) =>
                        updateResult(
                          investigation.name,
                          "interpretation",
                          "Interpretation",
                          text
                        )
                      }
                    />
                  )}

                  {type === "report" && (
                    <>
                                        <AppTextField
                      placeholder="Body Part / Region"
                      value={String(
                        getResultValue(
                          investigation.name,
                          "region"
                        )
                      )}
                      onChangeText={(
                        text
                      ) =>
                        updateResult(
                          investigation.name,
                          "region",
                          "Body Part / Region",
                          text
                        )
                      }
                    />

                    <AppTextField
                      multiline
                      placeholder="Report"
                      value={String(
                        getResultValue(
                          investigation.name,
                          "report"
                        )
                      )}
                      onChangeText={(
                        text
                      ) =>
                        updateResult(
                          investigation.name,
                          "report",
                          "Report",
                          text
                        )
                      }
                    />
                  </>
                )}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOW,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },

  headerTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});