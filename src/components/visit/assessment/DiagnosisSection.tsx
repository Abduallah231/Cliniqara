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

export default function DiagnosisSection() {
  const [primaryDiagnosis, setPrimaryDiagnosis] =
    useState<string[]>([]);

  const [
    differentialDiagnoses,
    setDifferentialDiagnoses,
  ] = useState<string[]>([]);

  const [searchPrimary, setSearchPrimary] =
    useState("");

  const [
    searchDifferential,
    setSearchDifferential,
  ] = useState("");

  const diagnosisDatabase = [
    "Diabetes Mellitus",
    "Hypertension",
    "Heart Failure",
    "Acute Coronary Syndrome",
    "Community Acquired Pneumonia",
    "Asthma",
    "COPD",
    "GERD",
    "Costochondritis",
    "Panic Disorder",
    "Migraine",
    "Iron Deficiency Anemia",
    "Chronic Kidney Disease",
  ];

  const filteredPrimary =
    diagnosisDatabase.filter((item) =>
      item
        .toLowerCase()
        .includes(searchPrimary.toLowerCase())
    );

  const filteredDifferential =
    diagnosisDatabase.filter((item) =>
      item
        .toLowerCase()
        .includes(
          searchDifferential.toLowerCase()
        )
    );

  const DiagnosisCard = ({
    title,
    diagnosis,
    icon,
    onRemove,
  }: {
    title: string;
    diagnosis: string;
    icon: keyof typeof Ionicons.glyphMap;
    onRemove: () => void;
  }) => (
    <Pressable
      style={styles.card}
      onPress={onRemove}
    >
      <View style={styles.cardHeader}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {title}
          </Text>

          <Text style={styles.cardText}>
            {diagnosis}
          </Text>
        </View>

        <Ionicons
          name="close-circle"
          size={22}
          color="#ef4444"
        />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        AI Suggested Diagnoses
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
        Primary Diagnosis
      </Text>

      <AppTextField
        icon="search-outline"
        placeholder="Search diagnosis..."
        value={searchPrimary}
        onChangeText={setSearchPrimary}
      />

      {searchPrimary.length > 0 && (
        <View style={styles.results}>
          {filteredPrimary
            .slice(0, 8)
            .map((item) => (
              <Pressable
                key={item}
                style={styles.resultItem}
                onPress={() => {
                  setPrimaryDiagnosis([item]);
                  setSearchPrimary("");
                }}
              >
                <Text>{item}</Text>
              </Pressable>
            ))}
        </View>
      )}

      {primaryDiagnosis.map((item) => (
        <DiagnosisCard
          key={item}
          title="Primary Diagnosis"
          diagnosis={item}
          icon="medical-outline"
          onRemove={() =>
            setPrimaryDiagnosis([])
          }
        />
      ))}

      <Text style={styles.title}>
        Differential Diagnoses
      </Text>

      <AppTextField
        icon="search-outline"
        placeholder="Search differential..."
        value={searchDifferential}
        onChangeText={
          setSearchDifferential
        }
      />
            {searchDifferential.length > 0 && (
        <View style={styles.results}>
          {filteredDifferential
            .slice(0, 8)
            .map((item) => (
              <Pressable
                key={item}
                style={styles.resultItem}
                onPress={() => {
                  if (
                    !differentialDiagnoses.includes(
                      item
                    )
                  ) {
                    setDifferentialDiagnoses([
                      ...differentialDiagnoses,
                      item,
                    ]);
                  }

                  setSearchDifferential("");
                }}
              >
                <Text>{item}</Text>
              </Pressable>
            ))}
        </View>
      )}

      {differentialDiagnoses.map((item) => (
        <DiagnosisCard
          key={item}
          title="Differential Diagnosis"
          diagnosis={item}
          icon="git-compare-outline"
          onRemove={() =>
            setDifferentialDiagnoses(
              differentialDiagnoses.filter(
                (x) => x !== item
              )
            )
          }
        />
      ))}
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
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  emptyText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
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
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  cardTitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },

  cardText: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "700",
  },
});