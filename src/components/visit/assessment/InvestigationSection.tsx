import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Pressable,
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
  onOpenResults: () => void;
  selectedInvestigations: any[];
  setSelectedInvestigations: React.Dispatch<
    React.SetStateAction<any[]>
  >;
};

export default function InvestigationSection({
  onOpenResults,
  selectedInvestigations,
  setSelectedInvestigations,
}: Props) {
  const [searchText, setSearchText] =
    useState("");

  const investigationDatabase = [
    "CBC",
    "ESR",
    "CRP",
    "Procalcitonin",
    "Ferritin",
    "Iron Profile",
    "FBS",
    "RBS",
    "HbA1c",
    "Urea",
    "Creatinine",
    "Na",
    "K",
    "ALT",
    "AST",
    "ALP",
    "Albumin",
    "TSH",
    "FT4",
    "Urinalysis",
    "Urine Culture",
    "Blood Culture",
    "ECG",
    "Echo",
    "Troponin",
    "Chest X-Ray",
    "Abdominal Ultrasound",
    "CT Brain",
    "CT Chest",
    "MRI Brain",
  ];

  const filteredInvestigations =
    investigationDatabase.filter(
      (item) =>
        item
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          )
    );

  const addInvestigation = (
    investigation: string
  ) => {
    if (
      selectedInvestigations.some(
        (x) =>
          x.name === investigation
      )
    )
      return;

    setSelectedInvestigations([
      ...selectedInvestigations,
      {
        name: investigation,
        status: "Requested",
      },
    ]);

    setSearchText("");
  };

  const removeInvestigation = (
    investigation: string
  ) => {
    setSelectedInvestigations(
      selectedInvestigations.filter(
        (x) =>
          x.name !== investigation
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        AI Suggested Investigations
      </Text>

      <View style={styles.aiCard}>
        <Ionicons
          name="sparkles-outline"
          size={22}
          color={COLORS.primary}
        />

        <Text style={styles.emptyText}>
          No AI suggestions yet
        </Text>
      </View>

      <Text style={styles.title}>
        Search Investigation
      </Text>

      <AppTextField
        icon="search-outline"
        placeholder="Search investigation..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {searchText.length > 0 && (
        <View style={styles.results}>
          {filteredInvestigations
            .slice(0, 10)
            .map((item) => (
              <Pressable
                key={item}
                style={styles.resultItem}
                onPress={() =>
                  addInvestigation(
                    item
                  )
                }
              >
                <Text>{item}</Text>
              </Pressable>
            ))}
        </View>
      )}

      <Text style={styles.title}>
        Requested Investigations
      </Text>
            {selectedInvestigations.map(
        (item) => (
          <Pressable
            key={item.name}
            style={styles.card}
            onPress={() =>
              removeInvestigation(
                item.name
              )
            }
          >
            <View
              style={styles.cardHeader}
            >
              <Ionicons
                name="flask-outline"
                size={20}
                color={COLORS.primary}
              />

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={
                    styles.cardTitle
                  }
                >
                  {item.name}
                </Text>

                <Text
                  style={
                    styles.cardSubtitle
                  }
                >
                  {item.status}
                </Text>
              </View>

              <Ionicons
                name="close-circle"
                size={22}
                color="#ef4444"
              />
            </View>
          </Pressable>
        )
      )}

      {selectedInvestigations.length >
        0 && (
        <Pressable
          style={styles.openButton}
          onPress={onOpenResults}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={COLORS.white}
          />

          <Text
            style={styles.openButtonText}
          >
            Enter Results
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  aiCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  emptyText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    textAlign: "center",
  },

  results: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOW,
  },

  resultItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOW,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  cardTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  openButton: {
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.sm,
    ...SHADOW,
  },

  openButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
});