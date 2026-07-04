import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import diagnoses from "@/data/diagnoses";
import AppTextField from "@/components/common/AppTextField";
import DiagnosisCard from "./DiagnosisCard";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
type SearchResultsProps = {
  items: string[];
  onSelect: (item: string) => void;
};

function SearchResults({
  items,
  onSelect,
}: SearchResultsProps) {
  if (!items.length) return null;

  return (
    <View style={styles.results}>
      {items.slice(0, 8).map((item) => (
        <Pressable
          key={item}
          style={styles.resultItem}
          onPress={() => onSelect(item)}
        >
          <Text>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

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

  const filterDiagnoses = (search: string) =>
  diagnoses.filter((item) =>
    item
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const diagnosisDatabase = diagnoses;

  const filteredPrimary =
    filterDiagnoses(searchPrimary).filter(
      (item) => !primaryDiagnosis.includes(item)
    );

  const filteredDifferential =
    filterDiagnoses(searchDifferential).filter(
      (item) =>
        !differentialDiagnoses.includes(item)
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
        <SearchResults
          items={filteredPrimary}
          onSelect={(item) => {
            setPrimaryDiagnosis([item]);
            setSearchPrimary("");
          }}
        />
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
        <SearchResults
          items={filteredDifferential}
          onSelect={(item) => {
            if (!differentialDiagnoses.includes(item)) {
              setDifferentialDiagnoses([
                ...differentialDiagnoses,
                item,
              ]);
            }
            setSearchDifferential("");
          }}
        />
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