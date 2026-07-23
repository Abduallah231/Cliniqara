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

const SYSTEM_ID = "chest";

export default function ChestExam() {
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

  const Title = ({
    children,
  }: {
    children: string;
  }) => (
    <Text style={styles.sectionTitle}>
      {children}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Title>Neck</Title>

      <ChipGroup
        items={[
          "NAD",
          "Trachea Deviated",
          "Lymphadenopathy",
        ]}
        fieldId="neckFindings"
        fieldLabel="Neck Findings"
      />

      <Title>Inspection</Title>

      <ChipGroup
        items={[
          "NAD",
          "Barrel Chest",
          "Funnel Chest",
          "Pigeon Chest",
          "Chest Retraction",
          "Chest Bulge",
          "Scar",
          "Visible Pulsation",
          "Accessory Muscle Use",
        ]}
        fieldId="inspectionFindings"
        fieldLabel="Inspection Findings"
      />

      <Title>Palpation</Title>

      <ChipGroup
        items={[
          "NAD",
          "Reduced Expansion",
          "Tenderness",
          "Increased Fremitus",
          "Decreased Fremitus",
        ]}
        fieldId="palpationFindings"
        fieldLabel="Palpation Findings"
      />

      {(
        (getValue(
          "palpationFindings"
        ) as string[]) ?? []
      ).includes(
        "Reduced Expansion"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Expansion Side
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Bilateral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "expansionSide"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "expansionSide",
                    "Expansion Side",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Title>Percussion</Title>

      <ChipGroup
        items={[
          "NAD",
          "Dull",
          "Hyperresonant",
        ]}
        fieldId="percussionFindings"
        fieldLabel="Percussion Findings"
      />

            {(
        (getValue(
          "percussionFindings"
        ) as string[]) ?? []
      ).includes("Dull") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Dullness Location
          </Text>

          <View style={styles.row}>
            {[
              "Right Upper",
              "Right Middle",
              "Right Lower",
              "Left Upper",
              "Left Middle",
              "Left Lower",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "dullnessLocation"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "dullnessLocation",
                    "Dullness Location",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Title>Auscultation</Title>

      <ChipGroup
        items={[
          "NAD",
          "Reduced Air Entry",
          "Crackles",
          "Wheeze",
          "Pleural Rub",
          "Bronchial Breathing",
        ]}
        fieldId="auscultationFindings"
        fieldLabel="Auscultation Findings"
      />

      {(
        (getValue(
          "auscultationFindings"
        ) as string[]) ?? []
      ).includes(
        "Reduced Air Entry"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Side
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Bilateral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "reducedAirEntrySide"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "reducedAirEntrySide",
                    "Reduced Air Entry Side",
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
          "auscultationFindings"
        ) as string[]) ?? []
      ).includes(
        "Crackles"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Crackles Type
          </Text>

          <View style={styles.row}>
            {[
              "Fine",
              "Coarse",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "cracklesType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "cracklesType",
                    "Crackles Type",
                    item
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Location
          </Text>

          <View style={styles.row}>
            {[
              "Right Upper",
              "Right Middle",
              "Right Lower",
              "Left Upper",
              "Left Middle",
              "Left Lower",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "cracklesLocation"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "cracklesLocation",
                    "Crackles Location",
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
          "auscultationFindings"
        ) as string[]) ?? []
      ).includes("Wheeze") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Wheeze Type
          </Text>

          <View style={styles.row}>
            {[
              "Inspiratory",
              "Expiratory",
              "Biphasic",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "wheezeType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "wheezeType",
                    "Wheeze Type",
                    item
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Distribution
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Bilateral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "wheezeDistribution"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "wheezeDistribution",
                    "Wheeze Distribution",
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
          "auscultationFindings"
        ) as string[]) ?? []
      ).includes(
        "Bronchial Breathing"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Location
          </Text>

          <View style={styles.row}>
            {[
              "Right Upper",
              "Right Middle",
              "Right Lower",
              "Left Upper",
              "Left Middle",
              "Left Lower",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "bronchialLocation"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "bronchialLocation",
                    "Bronchial Location",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
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