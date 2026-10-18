import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useVisitStore } from "@/store/visitStore";
import { StyleSheet } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

const SYSTEM_ID = "endocrine";

export default function EndocrineExam() {
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

    if (!updated.length) {
      updated = [normal];
    }

    updateField(
      fieldId,
      fieldLabel,
      updated
    );
  };

  const toggleMulti = (
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
            (x) => x !== item
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
    <AppView style={styles.row}>
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
    </AppView>
  );

  return (
    <AppView style={styles.container}>
      <AppText style={styles.sectionTitle}>
        General Appearance
      </AppText>

      <ChipGroup
        items={[
          "Normal",
          "Obese",
          "Underweight",
          "Hyperpigmentation",
          "Vitiligo",
        ]}
        fieldId="generalFindings"
        fieldLabel="General Findings"
      />

      <AppText style={styles.sectionTitle}>
        Thyroid Examination
      </AppText>

      <ChipGroup
        items={[
          "Normal",
          "Diffuse Goiter",
          "Nodular Goiter",
          "Thyroid Tenderness",
          "Thyroid Bruit",
        ]}
        fieldId="thyroidFindings"
        fieldLabel="Thyroid Findings"
      />

      <AppText style={styles.label}>
        Thyroid Eye Signs
      </AppText>

      <AppView style={styles.row}>
        {[
          "Lid Retraction",
          "Exophthalmos",
          "Lid Lag",
          "Ophthalmoplegia",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={(
              (getValue(
                "thyroidEyeSigns"
              ) as string[]) ?? []
            ).includes(item)}
            onPress={() =>
              toggleMulti(
                "thyroidEyeSigns",
                "Thyroid Eye Signs",
                item
              )
            }
          />
        ))}
      </AppView>

      <AppText style={styles.sectionTitle}>
        Diabetes
      </AppText>

      <AppView style={styles.row}>
        {[
          "None",
          "Peripheral Neuropathy",
          "Diabetic Foot",
          "Retinopathy",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={(
              (getValue(
                "diabeticFindings"
              ) as string[]) ??
              ["None"]
            ).includes(item)}
            onPress={() =>
              toggleFinding(
                "diabeticFindings",
                "Diabetic Findings",
                item,
                "None"
              )
            }
          />
        ))}
      </AppView>

            {(
        (getValue(
          "diabeticFindings"
        ) as string[]) ?? []
      ).includes(
        "Diabetic Foot"
      ) && (
        <AppView style={styles.group}>
          <AppText style={styles.label}>
            Diabetic Foot
          </AppText>

          <AppView style={styles.row}>
            {[
              "Ulcer",
              "Callus",
              "Gangrene",
              "Infection",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "diabeticFootFindings"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "diabeticFootFindings",
                    "Diabetic Foot Findings",
                    item
                  )
                }
              />
            ))}
          </AppView>
        </AppView>
      )}

      {(
        (getValue(
          "diabeticFindings"
        ) as string[]) ?? []
      ).includes(
        "Peripheral Neuropathy"
      ) && (
        <AppView style={styles.group}>
          <AppText style={styles.label}>
            Neuropathy Type
          </AppText>

          <AppView style={styles.row}>
            {[
              "Sensory",
              "Motor",
              "Mixed",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "neuropathyType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "neuropathyType",
                    "Neuropathy Type",
                    item
                  )
                }
              />
            ))}
          </AppView>
        </AppView>
      )}

      <AppText style={styles.sectionTitle}>
        Hypothyroidism
      </AppText>

      <ChipGroup
        items={[
          "Absent",
          "Dry Skin",
          "Coarse Hair",
          "Delayed Reflexes",
          "Bradycardia",
        ]}
        fieldId="hypothyroidFindings"
        fieldLabel="Hypothyroid Findings"
        normal="Absent"
      />

      <AppText style={styles.sectionTitle}>
        Hyperthyroidism
      </AppText>

      <ChipGroup
        items={[
          "Absent",
          "Fine Tremor",
          "Warm Hands",
          "Tachycardia",
          "Hyperreflexia",
        ]}
        fieldId="hyperthyroidFindings"
        fieldLabel="Hyperthyroid Findings"
        normal="Absent"
      />

      <AppText style={styles.sectionTitle}>
        Cushing Syndrome
      </AppText>

      <ChipGroup
        items={[
          "Absent",
          "Moon Face",
          "Buffalo Hump",
          "Purple Striae",
          "Proximal Weakness",
        ]}
        fieldId="cushingFindings"
        fieldLabel="Cushing Findings"
        normal="Absent"
      />

      <AppText style={styles.sectionTitle}>
        Acromegaly
      </AppText>

      <ChipGroup
        items={[
          "Absent",
          "Large Hands",
          "Large Feet",
          "Coarse Facial Features",
          "Macroglossia",
        ]}
        fieldId="acromegalyFindings"
        fieldLabel="Acromegaly Findings"
        normal="Absent"
      />

      <AppText style={styles.sectionTitle}>
        Addison Disease
      </AppText>

      <ChipGroup
        items={[
          "Absent",
          "Hyperpigmentation",
          "Weight Loss",
          "Hypotension",
          "Vitiligo",
        ]}
        fieldId="addisonFindings"
        fieldLabel="Addison Findings"
        normal="Absent"
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
    </AppView>
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