import { useVisitStore } from "@/store/visitStore";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

const SYSTEM_ID = "ophthalmology";

export default function OphthalmologyExam() {
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
    normal = "Normal"
  ) => {
    const current =
      (getValue(
        fieldId
      ) as string[]) ??
      [normal];

    if (item === normal) {
      updateField(
        fieldId,
        fieldLabel,
        [normal]
      );
      return;
    }

    let updated =
      current.filter(
        (x) => x !== normal
      );

    if (
      updated.includes(item)
    ) {
      updated =
        updated.filter(
          (x) => x !== item
        );
    } else {
      updated.push(item);
    }

    if (!updated.length)
      updated = [normal];

    updateField(
      fieldId,
      fieldLabel,
      updated
    );
  };

  const ChipGroup = ({
    items,
    fieldId,
    fieldLabel,
    normal = "Normal",
  }: {
    items: string[];
    fieldId: string;
    fieldLabel: string;
    normal?: string;
  }) => (
    <View style={styles.row}>
      {items.map((item) => (
        <AppChip
          key={item}
          label={item}
          selected={(
            (getValue(
              fieldId
            ) as string[]) ??
            [normal]
          ).includes(item)}
          onPress={() =>
            toggleFinding(
              fieldId,
              fieldLabel,
              item,
              normal
            )
          }
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Visual Acuity
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Reduced",
          "Blindness",
        ]}
        fieldId="visualFindings"
        fieldLabel="Visual Findings"
      />

      {(
        (getValue(
          "visualFindings"
        ) as string[]) ?? []
      ).includes("Reduced") && (
        <>
          <AppTextField
            label="Visual Acuity"
            value={
              (getValue(
                "visualAcuity"
              ) as string) ?? ""
            }
            onChangeText={(text) =>
              updateField(
                "visualAcuity",
                "Visual Acuity",
                text
              )
            }
            placeholder="6/6"
          />

          <Text style={styles.label}>
            Side
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Both",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "visualSide"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "visualSide",
                    "Visual Side",
                    item
                  )
                }
              />
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>
        External Eye
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Ptosis",
          "Proptosis",
          "Swelling",
          "Redness",
        ]}
        fieldId="externalFindings"
        fieldLabel="External Findings"
      />

      <Text style={styles.sectionTitle}>
        Conjunctiva
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Pallor",
          "Injection",
          "Hemorrhage",
          "Discharge",
        ]}
        fieldId="conjunctivaFindings"
        fieldLabel="Conjunctiva Findings"
      />

            <Text style={styles.sectionTitle}>
        Cornea
      </Text>

      <ChipGroup
        items={[
          "Clear",
          "Opacity",
          "Ulcer",
          "Scar",
          "Foreign Body",
        ]}
        fieldId="corneaFindings"
        fieldLabel="Cornea Findings"
        normal="Clear"
      />

      <Text style={styles.sectionTitle}>
        Pupils
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Dilated",
          "Constricted",
          "RAPD",
          "Irregular",
        ]}
        fieldId="pupilFindings"
        fieldLabel="Pupil Findings"
      />

      {(
        (getValue(
          "pupilFindings"
        ) as string[]) ?? []
      ).some(
        (x) => x !== "Normal"
      ) && (
        <AppTextField
          label="Pupil Size (mm)"
          value={
            (getValue(
              "pupilSize"
            ) as string) ?? ""
          }
          onChangeText={(text) =>
            updateField(
              "pupilSize",
              "Pupil Size",
              text
            )
          }
          keyboardType="numeric"
          placeholder="e.g. 3"
        />
      )}

      <Text style={styles.sectionTitle}>
        Extraocular Movements
      </Text>

      <ChipGroup
        items={[
          "Full",
          "Restricted",
          "Painful",
          "Nystagmus",
        ]}
        fieldId="ocularMovementFindings"
        fieldLabel="Ocular Movement Findings"
        normal="Full"
      />

      <Text style={styles.sectionTitle}>
        Fundus
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Papilledema",
          "Optic Atrophy",
          "Diabetic Retinopathy",
          "Hypertensive Retinopathy",
          "Retinal Hemorrhage",
        ]}
        fieldId="fundusFindings"
        fieldLabel="Fundus Findings"
      />

      <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <ChipGroup
        items={[
          "None",
          "Sudden Vision Loss",
          "Acute Painful Red Eye",
          "Corneal Ulcer",
          "Retinal Detachment",
          "Chemical Injury",
        ]}
        fieldId="redFlags"
        fieldLabel="Red Flags"
        normal="None"
      />

            <AppTextField
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
        placeholder="Add other findings..."
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
});