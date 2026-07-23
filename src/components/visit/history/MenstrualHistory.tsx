import { useVisitStore } from "@/store/visitStore";
import { StyleSheet, Text, View } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function MenstrualHistory() {
  const {
    visit,
    updateMenstrualField,
  } = useVisitStore();

  const getValue = (fieldId: string) =>
    visit.history.menstrualHistory.fields.find(
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
    <View style={styles.container}>
      {/* =========================
          Primary Amenorrhea
      ========================= */}

      <SectionHeader title="Primary Amenorrhea" />

      <View style={styles.row}>
        {["No", "Yes"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "primaryAmenorrhea"
              ) === item
            }
            onPress={() => {
              updateField(
                "primaryAmenorrhea",
                "Primary Amenorrhea",
                item
              );

              if (item === "Yes") {
                [
                  "ageAtMenarche",
                  "cycleRegularity",
                  "cycleLength",
                  "bleedingDuration",
                  "menstrualFlow",
                  "dysmenorrhea",
                  "painStarts",
                  "painRelievedBy",
                  "associatedSymptoms",
                  "intermenstrualBleeding",
                  "postcoitalBleeding",
                  "pmsSymptoms",
                  "lmp",
                  "secondarySexualCharacteristics",
                  "cyclicPelvicPain",
                ].forEach((field) =>
                  updateField(
                    field,
                    field,
                    field.includes("Symptoms") ||
                      field ===
                        "painRelievedBy" ||
                      field ===
                        "associatedSymptoms"
                      ? []
                      : ""
                  )
                );
              }

              if (item === "No") {
                updateField(
                  "secondarySexualCharacteristics",
                  "Secondary Sexual Characteristics",
                  ""
                );

                updateField(
                  "cyclicPelvicPain",
                  "Cyclic Pelvic Pain",
                  ""
                );
              }
            }}
          />
        ))}
      </View>

      {getValue(
        "primaryAmenorrhea"
      ) !== null && <Divider />}

      {getValue(
        "primaryAmenorrhea"
      ) === "Yes" && (
        <>
          <SectionHeader title="Primary Amenorrhea Assessment" />

          <Text style={styles.label}>
            Secondary Sexual Characteristics
          </Text>

          <View style={styles.row}>
            {[
              "Present",
              "Absent",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "secondarySexualCharacteristics"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "secondarySexualCharacteristics",
                    "Secondary Sexual Characteristics",
                    item
                  )
                }
              />
            ))}
          </View>

          <Divider />

          <Text style={styles.label}>
            Cyclic Pelvic Pain
          </Text>

          <View style={styles.row}>
            {["No", "Yes"].map(
              (item) => (
                <AppChip
                  key={item}
                  label={item}
                  selected={
                    getValue(
                      "cyclicPelvicPain"
                    ) === item
                  }
                  onPress={() =>
                    updateField(
                      "cyclicPelvicPain",
                      "Cyclic Pelvic Pain",
                      item
                    )
                  }
                />
              )
            )}
          </View>

          <Divider />
        </>
      )}

      {getValue(
        "primaryAmenorrhea"
      ) === "No" && (
        <>
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

          <Text style={styles.label}>
            Cycle Regularity
          </Text>

          <View style={styles.row}>
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
          </View>

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

          <Text style={styles.label}>
            Duration of Bleeding
          </Text>

          <View style={styles.row}>
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
          </View>

          <Divider />

          <Text style={styles.label}>
            Menstrual Flow
          </Text>

          <View style={styles.row}>
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
          </View>

          <Divider />

          {/* =========================
              Dysmenorrhea
          ========================= */}

          <SectionHeader title="Dysmenorrhea" />

          <View style={styles.row}>
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
          </View>

          {getValue(
            "dysmenorrhea"
          ) !== "No" &&
            getValue(
              "dysmenorrhea"
            ) !== null &&
            getValue(
              "dysmenorrhea"
            ) !== "" && (
              <View style={styles.box}>
                <Text style={styles.label}>
                  Pain Starts
                </Text>

                <View style={styles.row}>
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
                </View>

                <Divider />

                <Text style={styles.label}>
                  Pain Relieved By
                </Text>

                <View style={styles.row}>
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
                </View>
              </View>
            )}

          <Divider />

          {/* =========================
    Associated Symptoms
========================= */}

<SectionHeader title="Associated Symptoms" />

<View style={styles.row}>
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
</View>

<Divider />

{/* =========================
    Abnormal Bleeding
========================= */}

<SectionHeader title="Abnormal Bleeding" />

<Text style={styles.label}>
  Intermenstrual Bleeding
</Text>

<View style={styles.row}>
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
</View>

<Divider />

<Text style={styles.label}>
  Postcoital Bleeding
</Text>

<View style={styles.row}>
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
</View>

<Divider />

{/* =========================
    Premenstrual Symptoms
========================= */}

<SectionHeader title="Premenstrual Symptoms" />

<View style={styles.row}>
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
</View>

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

</>
)}

</View>
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