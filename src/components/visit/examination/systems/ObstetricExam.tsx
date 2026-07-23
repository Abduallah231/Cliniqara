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

const SYSTEM_ID = "obstetric";

export default function ObstetricExam() {
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
        General
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Pallor",
          "Edema",
          "Jaundice",
        ]}
        fieldId="generalFindings"
        fieldLabel="General Findings"
      />

      <Text style={styles.sectionTitle}>
        Hypertensive Signs
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Pedal Edema",
          "Hyperreflexia",
          "Clonus",
        ]}
        fieldId="htnFindings"
        fieldLabel="Hypertensive Signs"
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        Abdominal Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Scar",
          "Tenderness",
          "Contractions",
        ]}
        fieldId="abdominalFindings"
        fieldLabel="Abdominal Findings"
      />

      <AppTextField
        label="Fundal Height"
        value={
          (getValue(
            "fundalHeight"
          ) as string) ?? ""
        }
        onChangeText={(text) =>
          updateField(
            "fundalHeight",
            "Fundal Height",
            text
          )
        }
        placeholder="cm"
      />

      <AppTextField
        label="Fundal Assessment"
        value={
          (getValue(
            "fundalAssessment"
          ) as string) ?? ""
        }
        onChangeText={(text) =>
          updateField(
            "fundalAssessment",
            "Fundal Assessment",
            text
          )
        }
        placeholder="Corresponds to GA..."
      />

      <Text style={styles.sectionTitle}>
        Liquor
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Polyhydramnios",
          "Oligohydramnios",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "liquorAssessment"
              ) === item
            }
            onPress={() =>
              updateField(
                "liquorAssessment",
                "Liquor Assessment",
                item
              )
            }
          />
        ))}
      </View>

            <Text style={styles.sectionTitle}>
        Fetal Lie
      </Text>

      <View style={styles.row}>
        {[
          "Longitudinal",
          "Transverse",
          "Oblique",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue("fetalLie") === item
            }
            onPress={() =>
              updateField(
                "fetalLie",
                "Fetal Lie",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Presentation
      </Text>

      <View style={styles.row}>
        {[
          "Cephalic",
          "Breech",
          "Shoulder",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "fetalPresentation"
              ) === item
            }
            onPress={() =>
              updateField(
                "fetalPresentation",
                "Fetal Presentation",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        label="Position"
        value={
          (getValue(
            "presentationPosition"
          ) as string) ?? ""
        }
        onChangeText={(text) =>
          updateField(
            "presentationPosition",
            "Presentation Position",
            text
          )
        }
        placeholder="LOA, ROA..."
      />

      <Text style={styles.sectionTitle}>
        Engagement
      </Text>

      <View style={styles.row}>
        {[
          "Free",
          "5/5",
          "4/5",
          "3/5",
          "2/5",
          "1/5",
          "0/5",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "engagement"
              ) === item
            }
            onPress={() =>
              updateField(
                "engagement",
                "Engagement",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        label="Fetal Heart Rate"
        value={
          (getValue("fhr") as string) ??
          ""
        }
        onChangeText={(text) =>
          updateField(
            "fhr",
            "Fetal Heart Rate",
            text
          )
        }
        keyboardType="numeric"
        placeholder="bpm"
      />

      <Text style={styles.sectionTitle}>
        Fetal Movements
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Reduced",
          "Absent",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "fetalMovements"
              ) === item
            }
            onPress={() =>
              updateField(
                "fetalMovements",
                "Fetal Movements",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Multiple Pregnancy
      </Text>

      <View style={styles.row}>
        {[
          "Singleton",
          "Twin",
          "Triplet",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "multiplePregnancy"
              ) === item
            }
            onPress={() =>
              updateField(
                "multiplePregnancy",
                "Multiple Pregnancy",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Uterine Activity
      </Text>

      <View style={styles.row}>
        {[
          "None",
          "Irregular",
          "Regular",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "uterineActivity"
              ) === item
            }
            onPress={() =>
              updateField(
                "uterineActivity",
                "Uterine Activity",
                item
              )
            }
          />
        ))}
      </View>

            <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <ChipGroup
        items={[
          "None",
          "Antepartum Hemorrhage",
          "Absent Fetal Heart",
          "Severe Abdominal Pain",
          "Cord Prolapse",
          "Severe Hypertension",
          "Eclampsia",
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