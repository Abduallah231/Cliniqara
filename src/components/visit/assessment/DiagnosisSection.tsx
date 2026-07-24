import AppDropdown from "@/components/common/AppDropdown";
import diagnoses from "@/data/diagnoses";
import { useVisitStore } from "@/store/visitStore";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import DiagnosisCard from "./DiagnosisCard";

export default function DiagnosisSection() {
  const diagnosis = useVisitStore(
    (state) =>
      state.visit.assessment.diagnosis
  );

  const updatePrimaryDiagnosis =
    useVisitStore(
      (state) =>
        state.updatePrimaryDiagnosis
    );

  const addDifferentialDiagnosis =
    useVisitStore(
      (state) =>
        state.addDifferentialDiagnosis
    );

  const removeDifferentialDiagnosis =
    useVisitStore(
      (state) =>
        state.removeDifferentialDiagnosis
    );

  const diagnosisOptions = diagnoses.map((item) => ({
    id: item.name,
    label: item.name,
  }));

  const primaryOptions = diagnosisOptions.filter(
    (item) =>
      item.label !== diagnosis.primaryDiagnosis?.diagnosis
  );

  const differentialOptions =
    diagnosisOptions.filter(
      (item) =>
        !diagnosis.differentialDiagnoses.some(
          (d) =>
            d.diagnosis === item.label
        )
    );

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Primary Diagnosis
      </Text>

      <AppDropdown
        placeholder="Search diagnosis..."
        selected={
          diagnosis.primaryDiagnosis
            ? {
                id: diagnosis.primaryDiagnosis.diagnosis,
                label: diagnosis.primaryDiagnosis.diagnosis,
              }
            : undefined
        }
        options={primaryOptions}
        onChange={(item) =>
          updatePrimaryDiagnosis({
            code: item.id,
            diagnosis: item.label,
          })
        }
      />

      {diagnosis.primaryDiagnosis && (
        <DiagnosisCard
          title="Primary Diagnosis"
          diagnosis={
            diagnosis
              .primaryDiagnosis
              .diagnosis
          }
          icon="medical-outline"
          onRemove={() =>
            updatePrimaryDiagnosis(
              undefined
            )
          }
        />
      )}

      <Text style={styles.title}>
        Differential Diagnoses
      </Text>

      <AppDropdown
        placeholder="Search differential diagnosis..."
        selected={undefined}
        options={
          differentialOptions
        }
        onChange={(item) =>
          addDifferentialDiagnosis({
            code: item.id,
            diagnosis: item.label,
          })
        }
      />
            {diagnosis.differentialDiagnoses.map(
        (item) => (
          <DiagnosisCard
            key={item.diagnosis}
            title="Differential Diagnosis"
            diagnosis={
              item.diagnosis
            }
            icon="git-compare-outline"
            onRemove={() =>
              removeDifferentialDiagnosis(
                item.diagnosis
              )
            }
          />
        )
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
});