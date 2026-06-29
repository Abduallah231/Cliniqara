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

  const getInvestigationType = (
    name: string
  ) => {
    if (name === "CBC") return "multi";

    if (
      name === "CRP" ||
      name === "ESR"
    )
      return "single";

    if (name === "ECG")
      return "text";

    if (name === "CT Scan")
      return "report";

    return "single";
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Investigation Results
      </Text>

      {investigations.map(
        (investigation) => {
          const expanded =
            expandedItem ===
            investigation.name;

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
                  style={styles.headerLeft}
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
                  style={styles.content}
                >
                  {getInvestigationType(
                    investigation.name
                  ) ===
                    "single" && (
                    <AppTextField
                      placeholder="Result"
                    />
                  )}

                  {getInvestigationType(
                    investigation.name
                  ) ===
                    "multi" && (
                    <>
                      {investigation.fields?.map(
                        (
                          field: string
                        ) => (
                          <AppTextField
                            key={field}
                            placeholder={
                              field
                            }
                          />
                        )
                      )}
                    </>
                  )}

                  {getInvestigationType(
                    investigation.name
                  ) ===
                    "text" && (
                    <AppTextField
                      multiline
                      placeholder="Interpretation"
                    />
                  )}

                  {getInvestigationType(
                    investigation.name
                  ) ===
                    "report" && (
                    <>
                      <AppTextField
                        placeholder="Body Part / Region"
                      />

                      <AppTextField
                        multiline
                        placeholder="Report"
                      />
                    </>
                  )}
                                  </View>
              )}
            </View>
          );
        }
      )}
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
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});