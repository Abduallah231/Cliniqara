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
        Mental Status
      </Text>

      <View style={styles.row}>
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
      </View>

      <Text style={styles.sectionTitle}>
        Cranial Nerves
      </Text>

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

      <Text style={styles.sectionTitle}>
        Motor Examination
      </Text>

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
        <View style={styles.group}>
          <Text style={styles.label}>
            Weakness Location
          </Text>

          <View style={styles.row}>
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
          </View>

          <Text style={styles.label}>
            Power Grade
          </Text>

          <View style={styles.row}>
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
          </View>
        </View>
      )}

      {(
        (getValue(
          "motorFindings"
        ) as string[]) ?? []
      ).includes("Tremor") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Tremor Type
          </Text>

          <View style={styles.row}>
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
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Sensory Examination
      </Text>

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
        <View style={styles.group}>
          <Text style={styles.label}>
            Distribution
          </Text>

          <View style={styles.row}>
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
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Reflexes
      </Text>

      <View style={styles.row}>
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
      </View>

            <Text style={styles.sectionTitle}>
        Coordination
      </Text>

      <View style={styles.row}>
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
      </View>

      <Text style={styles.sectionTitle}>
        Gait
      </Text>

      <View style={styles.row}>
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
      </View>

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