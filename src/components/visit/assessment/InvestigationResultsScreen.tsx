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
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  investigations: any[];
};

export default function InvestigationResultsScreen({
  investigations,
}: Props) {
  const [expandedItem, setExpandedItem] =
    useState<string | null>(null);

  const [results, setResults] = useState<
    Record<string, string>
  >({});

  const updateResult = (
    key: string,
    value: string
  ) => {
    setResults((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Investigation Results
      </Text>

      {investigations.map((investigation) => {
        const expanded =
          expandedItem === investigation.name;

        const investigationInfo =
          investigationsData.find(
            (item) =>
              item.name === investigation.name
          );

        const type =
          investigationInfo?.type ?? "single";

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
              <View style={styles.headerLeft}>
                <Ionicons
                  name="flask-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <Text
                  style={styles.headerTitle}
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
              <View style={styles.content}>
                {type === "single" && (
                  <AppTextField
                    placeholder="Result"
                    value={
                      results[
                        investigation.name
                      ] ?? ""
                    }
                    onChangeText={(text) =>
                      updateResult(
                        investigation.name,
                        text
                      )
                    }
                  />
                )}

                {type === "multi" && (
                  <>
                    {investigationInfo?.fields?.map(
                      (field: string) => (
                        <AppTextField
                          key={field}
                          placeholder={field}
                          value={
                            results[
                              `${investigation.name}-${field}`
                            ] ?? ""
                          }
                          onChangeText={(
                            text
                          ) =>
                            updateResult(
                              `${investigation.name}-${field}`,
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
                    value={
                      results[
                        `${investigation.name}-interpretation`
                      ] ?? ""
                    }
                    onChangeText={(text) =>
                      updateResult(
                        `${investigation.name}-interpretation`,
                        text
                      )
                    }
                  />
                )}

                {type === "report" && (
                  <>
                    <AppTextField
                      placeholder="Body Part / Region"
                      value={
                        results[
                          `${investigation.name}-region`
                        ] ?? ""
                      }
                      onChangeText={(text) =>
                        updateResult(
                          `${investigation.name}-region`,
                          text
                        )
                      }
                    />

                    <AppTextField
                      multiline
                      placeholder="Report"
                      value={
                        results[
                          `${investigation.name}-report`
                        ] ?? ""
                      }
                      onChangeText={(text) =>
                        updateResult(
                          `${investigation.name}-report`,
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