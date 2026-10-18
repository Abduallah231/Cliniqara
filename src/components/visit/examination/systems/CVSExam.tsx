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

const SYSTEM_ID = "cvs";

export default function CVSExam() {
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
    normal = "NAD"
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
  }: {
    items: string[];
    fieldId: string;
    fieldLabel: string;
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
            ["NAD"]
          ).includes(item)}
          onPress={() =>
            toggleFinding(
              fieldId,
              fieldLabel,
              item
            )
          }
        />
      ))}
    </AppView>
  );

  return (
    <AppView style={styles.container}>
      <AppText style={styles.sectionTitle}>
        Neck
      </AppText>

      <ChipGroup
        items={[
          "NAD",
          "Raised JVP",
          "Positive HJR",
          "Abnormal Carotid Pulsation",
          "Carotid Bruit",
        ]}
        fieldId="neckFindings"
        fieldLabel="Neck Findings"
      />

      {(
        (getValue(
          "neckFindings"
        ) as string[]) ?? []
      ).includes(
        "Raised JVP"
      ) && (
        <AppTextField
          label="JVP Height (cm)"
          value={
            (getValue(
              "jvpHeight"
            ) as string) ?? ""
          }
          onChangeText={(text) =>
            updateField(
              "jvpHeight",
              "JVP Height",
              text,
              "cm"
            )
          }
          keyboardType="numeric"
          placeholder="Enter JVP height"
        />
      )}

      <AppText style={styles.sectionTitle}>
        Inspection
      </AppText>

      <ChipGroup
        items={[
          "NAD",
          "CABG Scar",
          "Pacemaker",
          "Visible Pulsation",
          "Chest Deformity",
          "Precordial Bulge",
        ]}
        fieldId="inspectionFindings"
        fieldLabel="Inspection Findings"
      />

      <AppText style={styles.sectionTitle}>
        Palpation
      </AppText>

      <ChipGroup
        items={[
          "NAD",
          "Displaced Apex",
          "Heave",
          "Thrill",
        ]}
        fieldId="palpationFindings"
        fieldLabel="Palpation Findings"
      />

      <AppText style={styles.sectionTitle}>
        Auscultation
      </AppText>

      <ChipGroup
        items={[
          "NAD",
          "Murmur",
          "S3",
          "S4",
          "Pericardial Rub",
        ]}
        fieldId="auscultationFindings"
        fieldLabel="Auscultation Findings"
      />

            {(
        (getValue(
          "auscultationFindings"
        ) as string[]) ?? []
      ).includes(
        "Murmur"
      ) && (
        <AppView style={styles.group}>
          <AppText style={styles.label}>
            Timing
          </AppText>

          <AppView style={styles.row}>
            {[
              "Systolic",
              "Diastolic",
              "Continuous",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "murmurTiming"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "murmurTiming",
                    "Murmur Timing",
                    item
                  )
                }
              />
            ))}
          </AppView>

          <AppText style={styles.label}>
            Grade
          </AppText>

          <AppView style={styles.row}>
            {[
              "I",
              "II",
              "III",
              "IV",
              "V",
              "VI",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "murmurGrade"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "murmurGrade",
                    "Murmur Grade",
                    item
                  )
                }
              />
            ))}
          </AppView>

          <AppText style={styles.label}>
            Best Heard At
          </AppText>

          <AppView style={styles.row}>
            {[
              "Aortic",
              "Pulmonary",
              "Tricuspid",
              "Mitral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "murmurSites"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "murmurSites",
                    "Murmur Sites",
                    item
                  )
                }
              />
            ))}
          </AppView>

          <AppText style={styles.label}>
            Radiation
          </AppText>

          <AppView style={styles.row}>
            {[
              "Neck",
              "Axilla",
              "Back",
              "None",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "murmurRadiation"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "murmurRadiation",
                    "Murmur Radiation",
                    item
                  )
                }
              />
            ))}
          </AppView>
        </AppView>
      )}

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