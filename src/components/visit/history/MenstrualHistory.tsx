import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useVisitStore } from "@/store/visitStore";
import { StyleSheet } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { useEffect, useRef, useState } from "react";
import {
  getMenstrualHistory,
} from "@/services/visitApi";
import useMenstrualHistoryAutoSave, {
  mapMenstrualHistoryFromBackend,
} from "@/hooks/useMenstrualHistoryAutoSave";

export default function MenstrualHistory() {
  const {
    visit,
    updateMenstrualField,
  } = useVisitStore();

  const fields =
    visit.history.menstrualHistory.fields;

  const visitId = visit.metadata.id;

  const [isHydrating, setIsHydrating] =
    useState(false);

  const loadedVisitId = useRef<string | null>(null);

  useMenstrualHistoryAutoSave({
    visitId,
    fields,
    isHydrating,
  });

  useEffect(() => {
    if (
      !visitId ||
      loadedVisitId.current === visitId
    ) {
      return;
    }

    const loadMenstrualHistory = async () => {
      try {
        setIsHydrating(true);

        const data =
          await getMenstrualHistory(visitId);

        if (!data) {
          loadedVisitId.current = visitId;
          return;
        }

        mapMenstrualHistoryFromBackend(data).forEach(
          (field) => {
            updateMenstrualField(
              field.fieldId,
              field.fieldLabel,
              field.value,
              field.unit,
            );
          },
        );

        loadedVisitId.current = visitId;
      } catch (error) {
        console.error(
          "Failed to load menstrual history:",
          error,
        );
      } finally {
        setIsHydrating(false);
      }
    };

    loadMenstrualHistory();
  }, [
    visitId,
    updateMenstrualField,
  ]);

  const getValue = (fieldId: string) =>
    fields.find(
      (field) => field.fieldId === fieldId
    )?.value ?? null;

  const updateField = (
    fieldId: string,
    fieldLabel: string,
    value: any
  ) => {
    updateMenstrualField(
      fieldId,
      fieldLabel,
      value
    );
  };

  const toggleMultiSelect = (
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    const current =
      (getValue(fieldId) as string[]) ?? [];

    if (current.includes(value)) {
      updateMenstrualField(
        fieldId,
        fieldLabel,
        current.filter(
          (x) => x !== value
        )
      );
    } else {
      updateMenstrualField(
        fieldId,
        fieldLabel,
        [...current, value]
      );
    }
  };

  const toggleMultiSelectWithNone = (
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    const current =
      (getValue(fieldId) as string[]) ?? [];

    if (value === "None") {
      updateMenstrualField(
        fieldId,
        fieldLabel,
        ["None"]
      );
      return;
    }

    let updated = current.filter(
      (item) => item !== "None"
    );

    if (updated.includes(value)) {
      updated = updated.filter(
        (item) => item !== value
      );
    } else {
      updated.push(value);
    }

    updateMenstrualField(
      fieldId,
      fieldLabel,
      updated
    );
  };

  return (
    <AppView style={styles.container}>
      {/* =========================
          Menarche
      ========================= */}
      <SectionHeader title="Menarche" />
      <AppTextField
            value={
              (getValue(
                "ageAtMenarche"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "ageAtMenarche",
                "Age At Menarche",
                v
              )
            }
            placeholder="Age at Menarche (Years)"
            keyboardType="numeric"
          />

          {/* =========================
              Menstrual Cycle
          ========================= */}

          <SectionHeader title="Menstrual Cycle" />

          <AppText style={styles.label}>
            Cycle Regularity
          </AppText>

          <AppView style={styles.row}>
            {[
              "Regular",
              "Irregular",
              "Unknown",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "cycleRegularity"
                  ) === item
                }
                onPress={() => {
                  updateField(
                    "cycleRegularity",
                    "Cycle Regularity",
                    item
                  );

                  if (item === "Unknown") {
                    updateField(
                      "cycleLength",
                      "Cycle Length",
                      ""
                    );
                  }
                }}
              />
            ))}
          </AppView>

          {(getValue(
            "cycleRegularity"
          ) === "Regular" ||
            getValue(
              "cycleRegularity"
            ) === "Irregular") && (
            <AppTextField
              value={
                (getValue(
                  "cycleLength"
                ) as string) ?? ""
              }
              onChangeText={(v) =>
                updateField(
                  "cycleLength",
                  "Cycle Length",
                  v
                )
              }
              placeholder="Cycle Length (Days)"
              keyboardType="numeric"
            />
          )}

          <Divider />

          {/* =========================
              Duration & Flow
          ========================= */}

          <SectionHeader title="Duration & Flow" />

          <AppText style={styles.label}>
            Duration of Bleeding
          </AppText>

          <AppView style={styles.row}>
            {[
              "<3 Days",
              "3-7 Days",
              ">7 Days",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "bleedingDuration"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "bleedingDuration",
                    "Bleeding Duration",
                    item
                  )
                }
              />
            ))}
          </AppView>

          <Divider />

          <AppText style={styles.label}>
            Menstrual Flow
          </AppText>

          <AppView style={styles.row}>
            {[
              "Scanty",
              "Normal",
              "Heavy",
              "Flooding",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "menstrualFlow"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "menstrualFlow",
                    "Menstrual Flow",
                    item
                  )
                }
              />
            ))}
          </AppView>

          <Divider />

          {/* =========================
              Dysmenorrhea
          ========================= */}

          <SectionHeader title="Dysmenorrhea" />

          <AppView style={styles.row}>
            {[
              "No",
              "Mild",
              "Moderate",
              "Severe",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "dysmenorrhea"
                  ) === item
                }
                onPress={() => {
                  updateField(
                    "dysmenorrhea",
                    "Dysmenorrhea",
                    item
                  );

                  if (item === "No") {
                    updateField(
                      "painStarts",
                      "Pain Starts",
                      ""
                    );

                    updateField(
                      "painRelievedBy",
                      "Pain Relieved By",
                      []
                    );
                  }
                }}
              />
            ))}
          </AppView>

          {getValue(
            "dysmenorrhea"
          ) !== "No" &&
            getValue(
              "dysmenorrhea"
            ) !== null &&
            getValue(
              "dysmenorrhea"
            ) !== "" && (
              <AppView style={styles.box}>
                <AppText style={styles.label}>
                  Pain Starts
                </AppText>

                <AppView style={styles.row}>
                  {[
                    "Before Menses",
                    "First Day",
                    "Throughout Menses",
                  ].map((item) => (
                    <AppChip
                      key={item}
                      label={item}
                      selected={
                        getValue(
                          "painStarts"
                        ) === item
                      }
                      onPress={() =>
                        updateField(
                          "painStarts",
                          "Pain Starts",
                          item
                        )
                      }
                    />
                  ))}
                </AppView>

                <Divider />

                <AppText style={styles.label}>
                  Pain Relieved By
                </AppText>

                <AppView style={styles.row}>
                  {[
                    "NSAIDs",
                    "Rest",
                    "Heat",
                    "Nothing",
                  ].map((item) => (
                    <AppChip
                      key={item}
                      label={item}
                      selected={
                        (
                          (getValue(
                            "painRelievedBy"
                          ) as string[]) ??
                          []
                        ).includes(item)
                      }
                      onPress={() =>
                        toggleMultiSelect(
                          "painRelievedBy",
                          "Pain Relieved By",
                          item
                        )
                      }
                    />
                  ))}
                </AppView>
              </AppView>
            )}

          <Divider />

{/* =========================
    Associated Symptoms
========================= */}

<SectionHeader title="Associated Symptoms" />

<AppView style={styles.row}>
  {[
    "Nausea",
    "Vomiting",
    "Headache",
    "Back Pain",
    "Fatigue",
    "None",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={(
        (getValue(
          "associatedSymptoms"
        ) as string[]) ?? []
      ).includes(item)}
      onPress={() =>
        toggleMultiSelectWithNone(
          "associatedSymptoms",
          "Associated Symptoms",
          item
        )
      }
    />
  ))}
</AppView>

<Divider />

{/* =========================
    Abnormal Bleeding
========================= */}

<SectionHeader title="Abnormal Bleeding" />

<AppText style={styles.label}>
  Intermenstrual Bleeding
</AppText>

<AppView style={styles.row}>
  {["No", "Yes"].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "intermenstrualBleeding"
        ) === item
      }
      onPress={() =>
        updateField(
          "intermenstrualBleeding",
          "Intermenstrual Bleeding",
          item
        )
      }
    />
  ))}
</AppView>

<Divider />

<AppText style={styles.label}>
  Postcoital Bleeding
</AppText>

<AppView style={styles.row}>
  {["No", "Yes"].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "postcoitalBleeding"
        ) === item
      }
      onPress={() =>
        updateField(
          "postcoitalBleeding",
          "Postcoital Bleeding",
          item
        )
      }
    />
  ))}
</AppView>

<Divider />

{/* =========================
    Premenstrual Symptoms
========================= */}

<SectionHeader title="Premenstrual Symptoms" />

<AppView style={styles.row}>
  {[
    "Breast Tenderness",
    "Mood Changes",
    "Irritability",
    "Anxiety",
    "Bloating",
    "Acne",
    "Headache",
    "None",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={(
        (getValue(
          "pmsSymptoms"
        ) as string[]) ?? []
      ).includes(item)}
      onPress={() =>
        toggleMultiSelectWithNone(
          "pmsSymptoms",
          "Premenstrual Symptoms",
          item
        )
      }
    />
  ))}
</AppView>

<Divider />

{/* =========================
    Last Menstrual Period
========================= */}

<SectionHeader title="Last Menstrual Period (LMP)" />

<AppTextField
  value={
    (getValue("lmp") as string) ??
    ""
  }
  onChangeText={(v) =>
    updateField(
      "lmp",
      "Last Menstrual Period",
      v
    )
  }
  placeholder="DD/MM/YYYY"
/>
</AppView>
);
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  box: {
    gap: SPACING.sm,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },
});
