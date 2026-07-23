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

const SYSTEM_ID = "musculoskeletal";

export default function MusculoskeletalExam() {
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
        General
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "Pain",
          "Swelling",
          "Deformity",
          "Stiffness",
          "Limited ROM",
        ]}
        fieldId="generalFindings"
        fieldLabel="General Findings"
      />

      {(
        (getValue(
          "generalFindings"
        ) as string[]) ?? []
      ).includes("Pain") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Pain Site
          </Text>

          <View style={styles.row}>
            {[
              "Neck",
              "Shoulder",
              "Elbow",
              "Wrist",
              "Hand",
              "Back",
              "Hip",
              "Knee",
              "Ankle",
              "Foot",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "painSites"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "painSites",
                    "Pain Sites",
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
                    "painSeverity"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "painSeverity",
                    "Pain Severity",
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
          "generalFindings"
        ) as string[]) ?? []
      ).includes(
        "Swelling"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Swelling Site
          </Text>

          <View style={styles.row}>
            {[
              "Shoulder",
              "Elbow",
              "Wrist",
              "Hand",
              "Hip",
              "Knee",
              "Ankle",
              "Foot",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "swellingSites"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "swellingSites",
                    "Swelling Sites",
                    item
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Swelling Type
          </Text>

          <View style={styles.row}>
            {[
              "Soft",
              "Firm",
              "Fluctuant",
              "Bony",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "swellingType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "swellingType",
                    "Swelling Type",
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
          "generalFindings"
        ) as string[]) ?? []
      ).includes(
        "Stiffness"
      ) && (
        <AppTextField
          label="Morning Stiffness"
          value={
            (getValue(
              "stiffnessDuration"
            ) as string) ?? ""
          }
          onChangeText={(text) =>
            updateField(
              "stiffnessDuration",
              "Morning Stiffness",
              text
            )
          }
          placeholder="Duration in minutes"
        />
      )}

      {(
        (getValue(
          "generalFindings"
        ) as string[]) ?? []
      ).includes(
        "Limited ROM"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Affected Joints
          </Text>

          <View style={styles.row}>
            {[
              "Shoulder",
              "Elbow",
              "Wrist",
              "Hip",
              "Knee",
              "Ankle",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "limitedRomJoints"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "limitedRomJoints",
                    "Limited ROM Joints",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Joint Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Tenderness",
          "Warmth",
          "Crepitus",
          "Instability",
          "Effusion",
        ]}
        fieldId="jointFindings"
        fieldLabel="Joint Findings"
        normal="Normal"
      />

      <Text style={styles.label}>
        Pattern
      </Text>

      <View style={styles.row}>
        {[
          "Monoarticular",
          "Oligoarticular",
          "Polyarticular",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "jointPattern"
              ) === item
            }
            onPress={() =>
              updateField(
                "jointPattern",
                "Joint Pattern",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Muscle Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Weakness",
          "Wasting",
          "Hypertrophy",
          "Tenderness",
        ]}
        fieldId="muscleFindings"
        fieldLabel="Muscle Findings"
        normal="Normal"
      />

      {(
        (getValue(
          "muscleFindings"
        ) as string[]) ?? []
      ).includes(
        "Weakness"
      ) && (
        <View style={styles.group}>
          <AppTextField
            label="Weakness Location"
            value={
              (getValue(
                "weaknessLocation"
              ) as string) ?? ""
            }
            onChangeText={(text) =>
              updateField(
                "weaknessLocation",
                "Weakness Location",
                text
              )
            }
            placeholder="Affected muscles"
          />

          <Text style={styles.label}>
            Power
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

            <Text style={styles.sectionTitle}>
        Gait
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Antalgic",
          "Trendelenburg",
          "Spastic",
          "Ataxic",
          "Unable To Walk",
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

      <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <ChipGroup
        items={[
          "None",
          "Hot Swollen Joint",
          "Open Fracture",
          "Compartment Syndrome",
          "Neurovascular Deficit",
          "Cauda Equina",
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