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

const SYSTEM_ID = "neurology";

export default function NeurologyExam() {
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

    if (!updated.length)
      updated = [normal];

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
    normal = "NAD",
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
        Mental Status
      </AppText>

      <AppView style={styles.row}>
        {[
          "Normal",
          "Confused",
          "Disoriented",
          "Memory Impairment",
          "Speech Difficulty",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "mentalStatus"
              ) === item
            }
            onPress={() =>
              updateField(
                "mentalStatus",
                "Mental Status",
                item
              )
            }
          />
        ))}
      </AppView>

      <AppText style={styles.sectionTitle}>
        Cranial Nerves
      </AppText>

      <ChipGroup
        items={[
          "NAD",
          "Visual Defect",
          "Diplopia",
          "Facial Weakness",
          "Hearing Loss",
          "Dysarthria",
          "Dysphagia",
        ]}
        fieldId="cranialFindings"
        fieldLabel="Cranial Findings"
      />

      <AppText style={styles.sectionTitle}>
        Motor Examination
      </AppText>

      <ChipGroup
        items={[
          "NAD",
          "Weakness",
          "Spasticity",
          "Rigidity",
          "Hypotonia",
          "Tremor",
          "Fasciculation",
        ]}
        fieldId="motorFindings"
        fieldLabel="Motor Findings"
      />

            {(
        (getValue(
          "motorFindings"
        ) as string[]) ?? []
      ).includes("Weakness") && (
        <AppView style={styles.group}>
          <AppText style={styles.label}>
            Weakness Location
          </AppText>

          <AppView style={styles.row}>
            {[
              "Right Upper Limb",
              "Left Upper Limb",
              "Right Lower Limb",
              "Left Lower Limb",
              "Hemiparesis",
              "Quadriparesis",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "weaknessLocations"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "weaknessLocations",
                    "Weakness Locations",
                    item
                  )
                }
              />
            ))}
          </AppView>

          <AppText style={styles.label}>
            Power Grade
          </AppText>

          <AppView style={styles.row}>
            {[
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "powerGrade"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "powerGrade",
                    "Power Grade",
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
          "motorFindings"
        ) as string[]) ?? []
      ).includes("Tremor") && (
        <AppView style={styles.group}>
          <AppText style={styles.label}>
            Tremor Type
          </AppText>

          <AppView style={styles.row}>
            {[
              "Resting",
              "Postural",
              "Intention",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "tremorType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "tremorType",
                    "Tremor Type",
                    item
                  )
                }
              />
            ))}
          </AppView>
        </AppView>
      )}

      <AppText style={styles.sectionTitle}>
        Sensory Examination
      </AppText>

      <ChipGroup
        items={[
          "NAD",
          "Pain Loss",
          "Temperature Loss",
          "Light Touch Loss",
          "Vibration Loss",
          "Joint Position Loss",
        ]}
        fieldId="sensoryFindings"
        fieldLabel="Sensory Findings"
      />

      {(
        ((getValue(
          "sensoryFindings"
        ) as string[]) ?? [])
          .length > 1 ||
        !(
          (getValue(
            "sensoryFindings"
          ) as string[]) ?? ["NAD"]
        ).includes("NAD")
      ) && (
        <AppView style={styles.group}>
          <AppText style={styles.label}>
            Distribution
          </AppText>

          <AppView style={styles.row}>
            {[
              "Dermatomal",
              "Peripheral Nerve",
              "Glove & Stocking",
              "Hemisensory",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "sensoryDistribution"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "sensoryDistribution",
                    "Sensory Distribution",
                    item
                  )
                }
              />
            ))}
          </AppView>
        </AppView>
      )}

      <AppText style={styles.sectionTitle}>
        Reflexes
      </AppText>

      <AppView style={styles.row}>
        {[
          "Normal",
          "Hyperreflexia",
          "Hyporeflexia",
          "Areflexia",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "reflexes"
              ) === item
            }
            onPress={() =>
              updateField(
                "reflexes",
                "Reflexes",
                item
              )
            }
          />
        ))}
      </AppView>

            <AppText style={styles.sectionTitle}>
        Coordination
      </AppText>

      <AppView style={styles.row}>
        {[
          "Normal",
          "Dysmetria",
          "Past Pointing",
          "Intention Tremor",
          "Dysdiadochokinesia",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "coordination"
              ) === item
            }
            onPress={() =>
              updateField(
                "coordination",
                "Coordination",
                item
              )
            }
          />
        ))}
      </AppView>

      <AppText style={styles.sectionTitle}>
        Gait
      </AppText>

      <AppView style={styles.row}>
        {[
          "Normal",
          "Hemiplegic",
          "Spastic",
          "Ataxic",
          "Parkinsonian",
          "High Stepping",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue("gait") === item
            }
            onPress={() =>
              updateField(
                "gait",
                "Gait",
                item
              )
            }
          />
        ))}
      </AppView>

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