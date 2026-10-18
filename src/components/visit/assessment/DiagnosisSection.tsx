import AppDropdown from "@/components/common/AppDropdown";
import AppChip from "@/components/common/AppChip";
import diagnoses from "@/data/diagnoses";
import { getTopDiagnosisNames } from "@/services/statisticsApi";
import { useClinicStore } from "@/store/clinicStore";
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
import { useEffect, useRef, useState } from "react";
import { getDiagnosis } from "@/services/visitApi";
import useDiagnosisAutoSave, {
  mapDiagnosisFromBackend,
} from "@/hooks/useDiagnosisAutoSave";

export default function DiagnosisSection() {
  const diagnosis = useVisitStore(
    (state) =>
      state.visit.assessment.diagnosis,
  );

  const updatePrimaryDiagnosis =
    useVisitStore(
      (state) =>
        state.updatePrimaryDiagnosis,
    );

  const addDifferentialDiagnosis =
    useVisitStore(
      (state) =>
        state.addDifferentialDiagnosis,
    );

  const setDiagnosis =
    useVisitStore(
      (state) =>
        state.setDiagnosis,
    );

  const removeDifferentialDiagnosis =
    useVisitStore(
      (state) =>
        state.removeDifferentialDiagnosis,
    );

  const visitId = useVisitStore(
    (state) => state.visit.metadata.id,
  );

  const [isHydrating, setIsHydrating] =
    useState(false);

  const clinicId = useClinicStore(
    (state) => state.currentClinicId,
  );
  const [quickDiagnosisNames, setQuickDiagnosisNames] =
    useState<string[]>([]);

  const loadedVisitId = useRef<string | null>(
    null,
  );

  useDiagnosisAutoSave({
    visitId,
    diagnosis,
    isHydrating,
  });

  useEffect(() => {
    let cancelled = false;
    async function loadQuickDiagnoses() {
      if (!clinicId) {
        setQuickDiagnosisNames([]);
        return;
      }
      try {
        const names = await getTopDiagnosisNames(clinicId);
        if (!cancelled) setQuickDiagnosisNames(names);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load quick diagnoses:", error);
        }
      }
    }
    void loadQuickDiagnoses();
    return () => {
      cancelled = true;
    };
  }, [clinicId]);

  useEffect(() => {
    if (
      !visitId ||
      loadedVisitId.current === visitId
    ) {
      return;
    }

    const loadDiagnosis = async () => {
      try {
        setIsHydrating(true);

        const data =
          await getDiagnosis(visitId);

        if (!data) {
          setDiagnosis({
            primaryDiagnosis: undefined,
            differentialDiagnoses: [],
          });

          loadedVisitId.current = visitId;
          return;
        }

        const mappedDiagnosis =
          mapDiagnosisFromBackend(data);

        setDiagnosis(mappedDiagnosis);

        loadedVisitId.current = visitId;
      } catch (error: any) {
        console.error(
          "Failed to load diagnosis:",
          error?.response?.data ?? error,
        );
      } finally {
        setIsHydrating(false);
      }
    };

    loadDiagnosis();
  }, [
    visitId,
    setDiagnosis,
  ]);

  /*
   * Important:
   *
   * diagnoses.ts may contain duplicate ICD codes
   * for different diagnosis names.
   *
   * Therefore the dropdown uses the diagnosis name
   * as its UI id, while the real ICD code is taken
   * from the original diagnoses array on selection.
   */
  const diagnosisOptions = diagnoses.map(
    (item) => ({
      id: item.name,
      label: item.name,
    }),
  );

  const primaryOptions =
    diagnosisOptions.filter(
      (item) =>
        item.label !==
        diagnosis.primaryDiagnosis
          ?.diagnosis,
    );

  const differentialOptions =
    diagnosisOptions.filter(
      (item) =>
        !diagnosis.differentialDiagnoses.some(
          (d) =>
            d.diagnosis === item.label,
        ),
    );

  const findDiagnosisByName = (
    name: string,
  ) => {
    return diagnoses.find(
      (item) => item.name === name,
    );
  };

  const selectPrimaryDiagnosis = (name: string) => {
    const selectedDiagnosis = findDiagnosisByName(name);
    if (!selectedDiagnosis) return;
    updatePrimaryDiagnosis({
      code: selectedDiagnosis.code,
      diagnosis: selectedDiagnosis.name,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Primary Diagnosis
      </Text>

      <Text style={styles.quickSelectionTitle}>
        Quick Selection
      </Text>
      <View style={styles.quickSelectionRow}>
        {quickDiagnosisNames.map((name) => (
          <AppChip
            key={name}
            label={name}
            selected={diagnosis.primaryDiagnosis?.diagnosis === name}
            onPress={() => selectPrimaryDiagnosis(name)}
          />
        ))}
      </View>

      <AppDropdown
        placeholder="Search diagnosis..."
        selected={
          diagnosis.primaryDiagnosis
            ? {
                id:
                  diagnosis.primaryDiagnosis
                    .diagnosis,
                label:
                  diagnosis.primaryDiagnosis
                    .diagnosis,
              }
            : undefined
        }
        options={primaryOptions}
        onChange={(item) => {
          selectPrimaryDiagnosis(item.id);
        }}
      />

      {diagnosis.primaryDiagnosis && (
        <DiagnosisCard
          title="Primary Diagnosis"
          diagnosis={
            diagnosis.primaryDiagnosis
              .diagnosis
          }
          icon="medical-outline"
          onRemove={() =>
            updatePrimaryDiagnosis(
              undefined,
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
        options={differentialOptions}
        onChange={(item) => {
          const selectedDiagnosis =
            findDiagnosisByName(item.id);

          if (!selectedDiagnosis) {
            return;
          }

          addDifferentialDiagnosis({
            code: selectedDiagnosis.code,
            diagnosis:
              selectedDiagnosis.name,
          });
        }}
      />

      {diagnosis.differentialDiagnoses.map(
        (item) => (
          <DiagnosisCard
            key={`${item.code}-${item.diagnosis}`}
            title="Differential Diagnosis"
            diagnosis={
              item.diagnosis
            }
            icon="git-compare-outline"
            onRemove={() =>
              removeDifferentialDiagnosis(
                item.diagnosis,
              )
            }
          />
        ),
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

  quickSelectionTitle: {
    marginTop: -SPACING.xs,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },

  quickSelectionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
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
