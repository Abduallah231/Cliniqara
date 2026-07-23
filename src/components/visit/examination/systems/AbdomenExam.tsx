import { useVisitStore } from "@/store/visitStore";
import { StyleSheet, Text, View } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

const SYSTEM_ID = "abdomen";

export default function AbdomenExam() {
  const {
    visit,
    updateSystemExaminationField,
  } = useVisitStore();

  const getValue = (
    fieldId: string
  ) => {
    const system =
      visit.examination.systemExamination.systems.find(
        (s) =>
          s.systemId === SYSTEM_ID
      );

    return (
      system?.fields.find(
        (f) =>
          f.fieldId === fieldId
      )?.value ?? null
    );
  };

  const updateField = (
    fieldId: string,
    fieldLabel: string,
    value: any,
    unit?: string
  ) =>
    updateSystemExaminationField(
      SYSTEM_ID,
      fieldId,
      fieldLabel,
      value,
      unit
    );

  const toggleFinding = (
    fieldId: string,
    fieldLabel: string,
    item: string,
    normalValue = "NAD"
  ) => {
    const current =
      (getValue(
        fieldId
      ) as string[]) ??
      [normalValue];

    if (item === normalValue) {
      updateField(
        fieldId,
        fieldLabel,
        [normalValue]
      );
      return;
    }

    let updated =
      current.filter(
        (x) =>
          x !== normalValue
      );

    if (
      updated.includes(item)
    ) {
      updated =
        updated.filter(
          (x) =>
            x !== item
        );
    } else {
      updated.push(item);
    }

    if (
      updated.length === 0
    ) {
      updated = [normalValue];
    }

    updateField(
      fieldId,
      fieldLabel,
      updated
    );
  };

  const toggleMultiSelect = (
    fieldId: string,
    fieldLabel: string,
    item: string
  ) => {
    const current =
      (getValue(
        fieldId
      ) as string[]) ?? [];

    const updated =
      current.includes(item)
        ? current.filter(
            (x) =>
              x !== item
          )
        : [
            ...current,
            item,
          ];

    updateField(
      fieldId,
      fieldLabel,
      updated
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={
          styles.sectionTitle
        }
      >
        Inspection
      </Text>

      <View style={styles.row}>
        {[
          "NAD",
          "Distension",
          "Scar",
          "Visible Mass",
          "Dilated Veins",
          "Hernia",
          "Stoma",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={(
              (getValue(
                "inspectionFindings"
              ) as string[]) ??
              ["NAD"]
            ).includes(item)}
            onPress={() =>
              toggleFinding(
                "inspectionFindings",
                "Inspection Findings",
                item
              )
            }
          />
        ))}
      </View>

      {(
        (getValue(
          "inspectionFindings"
        ) as string[]) ??
        []
      ).includes(
        "Distension"
      ) && (
        <View
          style={styles.group}
        >
          <Text
            style={
              styles.label
            }
          >
            Distension
            Severity
          </Text>

          <View
            style={styles.row}
          >
            {[
              "Mild",
              "Moderate",
              "Severe",
            ].map(
              (item) => (
                <AppChip
                  key={
                    item
                  }
                  label={
                    item
                  }
                  selected={
                    getValue(
                      "distensionSeverity"
                    ) ===
                    item
                  }
                  onPress={() =>
                    updateField(
                      "distensionSeverity",
                      "Distension Severity",
                      item
                    )
                  }
                />
              )
            )}
          </View>
        </View>
      )}

      {(
        (getValue(
          "inspectionFindings"
        ) as string[]) ??
        []
      ).includes(
        "Hernia"
      ) && (
        <View
          style={styles.group}
        >
          <Text
            style={
              styles.label
            }
          >
            Hernia Type
          </Text>

          <View
            style={styles.row}
          >
            {[
              "Inguinal",
              "Femoral",
              "Umbilical",
              "Incisional",
              "Epigastric",
            ].map(
              (item) => (
                <AppChip
                  key={
                    item
                  }
                  label={
                    item
                  }
                  selected={(
                    (getValue(
                      "herniaType"
                    ) as string[]) ??
                    []
                  ).includes(
                    item
                  )}
                  onPress={() =>
                    toggleMultiSelect(
                      "herniaType",
                      "Hernia Type",
                      item
                    )
                  }
                />
              )
            )}
          </View>
        </View>
      )}

      <Text
        style={
          styles.sectionTitle
        }
      >
        Palpation
      </Text>

      <View style={styles.row}>
        {[
          "Soft and Lax",
          "Tenderness",
          "Guarding",
          "Rigidity",
          "Mass",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={(
              (getValue(
                "palpationFindings"
              ) as string[]) ??
              [
                "Soft and Lax",
              ]
            ).includes(item)}
            onPress={() =>
              toggleFinding(
                "palpationFindings",
                "Palpation Findings",
                item,
                "Soft and Lax"
              )
            }
          />
        ))}
      </View>

            {((
        getValue("palpationFindings")
      ) as string[])?.includes(
        "Tenderness"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Site
          </Text>

          <View style={styles.row}>
            {[
              "RUQ",
              "LUQ",
              "RLQ",
              "LLQ",
              "Epigastric",
              "Umbilical",
              "Suprapubic",
              "Generalized",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "tendernessSite"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMultiSelect(
                    "tendernessSite",
                    "Tenderness Site",
                    item
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Severity
          </Text>

          <View style={styles.row}>
            {[
              "Mild",
              "Moderate",
              "Severe",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "tendernessSeverity"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "tendernessSeverity",
                    "Tenderness Severity",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      {((
        getValue("palpationFindings")
      ) as string[])?.includes(
        "Mass"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Mass Site
          </Text>

          <View style={styles.row}>
            {[
              "RUQ",
              "LUQ",
              "RLQ",
              "LLQ",
              "Epigastric",
              "Umbilical",
              "Suprapubic",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "massSite"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMultiSelect(
                    "massSite",
                    "Mass Site",
                    item
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Mobility
          </Text>

          <View style={styles.row}>
            {[
              "Mobile",
              "Fixed",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "massMobility"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "massMobility",
                    "Mass Mobility",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.label}>
        Liver Span
      </Text>

      <AppTextField
        value={
          (getValue(
            "liverSpan"
          ) as string) ?? ""
        }
        onChangeText={(v) =>
          updateField(
            "liverSpan",
            "Liver Span",
            v,
            "cm"
          )
        }
        placeholder="cm"
      />

      <Text style={styles.label}>
        Spleen
      </Text>

      <View style={styles.row}>
        {[
          "Not Palpable",
          "Grade I",
          "Grade II",
          "Grade III",
          "Grade IV",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "spleenGrade"
              ) === item
            }
            onPress={() =>
              updateField(
                "spleenGrade",
                "Spleen Grade",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Percussion
      </Text>

      <View style={styles.row}>
        {[
          "NAD",
          "Tympanic",
          "Dullness",
          "Shifting Dullness",
          "Fluid Thrill",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={(
              (getValue(
                "percussionFindings"
              ) as string[]) ??
              ["NAD"]
            ).includes(item)}
            onPress={() =>
              toggleFinding(
                "percussionFindings",
                "Percussion Findings",
                item
              )
            }
          />
        ))}
      </View>

            <Text style={styles.sectionTitle}>
        Auscultation
      </Text>

      <View style={styles.row}>
        {[
          "NAD",
          "Normal Bowel Sounds",
          "Absent",
          "Hyperactive",
          "Bruit",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={(
              (getValue(
                "auscultationFindings"
              ) as string[]) ??
              ["NAD"]
            ).includes(item)}
            onPress={() =>
              toggleFinding(
                "auscultationFindings",
                "Auscultation Findings",
                item
              )
            }
          />
        ))}
      </View>

      {((
        getValue(
          "auscultationFindings"
        )
      ) as string[])?.includes(
        "Bruit"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Bruit Site
          </Text>

          <View style={styles.row}>
            {[
              "Aorta",
              "Renal",
              "Iliac",
              "Femoral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "bruitSites"
                  ) as string[]) ??
                  []
                ).includes(item)}
                onPress={() =>
                  toggleMultiSelect(
                    "bruitSites",
                    "Bruit Sites",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Special Signs
      </Text>

      <View style={styles.row}>
        {[
          "No Special Signs",
          "Murphy's Sign",
          "McBurney's Point",
          "Rovsing's Sign",
          "Psoas Sign",
          "Obturator Sign",
          "Rebound Tenderness",
          "Succussion Splash",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={(
              (getValue(
                "specialSigns"
              ) as string[]) ??
              ["No Special Signs"]
            ).includes(item)}
            onPress={() =>
              toggleFinding(
                "specialSigns",
                "Special Signs",
                item,
                "No Special Signs"
              )
            }
          />
        ))}
      </View>

      <AppTextField
        placeholder="Add other findings..."
        value={
          (getValue(
            "otherFindings"
          ) as string) ?? ""
        }
        onChangeText={(text) =>
          updateField(
            "otherFindings",
            "Other Findings",
            text
          )
        }
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  group: {
    gap: SPACING.sm,
  },
  inputRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  half: {
    flex: 1,
  },
});