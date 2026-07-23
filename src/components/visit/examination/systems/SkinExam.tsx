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

const SYSTEM_ID = "skin";

export default function SkinExam() {
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
        : [...current, item];

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
        Skin Lesions
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Macule",
          "Papule",
          "Plaque",
          "Vesicle",
          "Bulla",
          "Pustule",
          "Nodule",
          "Ulcer",
        ]}
        fieldId="lesionFindings"
        fieldLabel="Skin Lesions"
      />

      {!(
        (getValue(
          "lesionFindings"
        ) as string[]) ?? ["Normal"]
      ).includes("Normal") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Site
          </Text>

          <View style={styles.row}>
            {[
              "Face",
              "Scalp",
              "Neck",
              "Chest",
              "Back",
              "Upper Limb",
              "Lower Limb",
              "Palm",
              "Sole",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "lesionSites"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "lesionSites",
                    "Lesion Sites",
                    item
                  )
                }
              />
            ))}
          </View>

          <AppTextField
            label="Number"
            value={
              (getValue(
                "lesionNumber"
              ) as string) ?? ""
            }
            onChangeText={(text) =>
              updateField(
                "lesionNumber",
                "Lesion Number",
                text
              )
            }
            placeholder="Single / Multiple"
          />

          <AppTextField
            label="Size"
            value={
              (getValue(
                "lesionSize"
              ) as string) ?? ""
            }
            onChangeText={(text) =>
              updateField(
                "lesionSize",
                "Lesion Size",
                text
              )
            }
            placeholder="cm"
          />

          <AppTextField
            label="Shape"
            value={
              (getValue(
                "lesionShape"
              ) as string) ?? ""
            }
            onChangeText={(text) =>
              updateField(
                "lesionShape",
                "Lesion Shape",
                text
              )
            }
          />

                    <AppTextField
            label="Border"
            value={
              (getValue(
                "lesionBorder"
              ) as string) ?? ""
            }
            onChangeText={(text) =>
              updateField(
                "lesionBorder",
                "Lesion Border",
                text
              )
            }
          />

          <AppTextField
            label="Color"
            value={
              (getValue(
                "lesionColor"
              ) as string) ?? ""
            }
            onChangeText={(text) =>
              updateField(
                "lesionColor",
                "Lesion Color",
                text
              )
            }
          />

          <AppTextField
            label="Surface"
            value={
              (getValue(
                "lesionSurface"
              ) as string) ?? ""
            }
            onChangeText={(text) =>
              updateField(
                "lesionSurface",
                "Lesion Surface",
                text
              )
            }
          />

          <Text style={styles.label}>
            Symptoms
          </Text>

          <View style={styles.row}>
            {[
              "Itching",
              "Pain",
              "Burning",
              "Bleeding",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "lesionSymptoms"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "lesionSymptoms",
                    "Lesion Symptoms",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Distribution
      </Text>

      <ChipGroup
        items={[
          "Localized",
          "Generalized",
          "Dermatomal",
          "Flexural",
          "Extensor",
          "Sun Exposed",
        ]}
        fieldId="distributionFindings"
        fieldLabel="Distribution"
        normal="Localized"
      />

      <Text style={styles.sectionTitle}>
        Secondary Changes
      </Text>

      <View style={styles.row}>
        {[
          "Scale",
          "Crust",
          "Excoriation",
          "Lichenification",
          "Scar",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={(
              (getValue(
                "secondaryChanges"
              ) as string[]) ?? []
            ).includes(item)}
            onPress={() =>
              toggleMulti(
                "secondaryChanges",
                "Secondary Changes",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Color Changes
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Hypopigmentation",
          "Hyperpigmentation",
          "Erythema",
          "Cyanosis",
          "Jaundice",
        ]}
        fieldId="colorChanges"
        fieldLabel="Color Changes"
      />

      <Text style={styles.sectionTitle}>
        Nails
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Clubbing",
          "Koilonychia",
          "Pitting",
          "Onychomycosis",
        ]}
        fieldId="nailFindings"
        fieldLabel="Nail Findings"
      />

      <Text style={styles.sectionTitle}>
        Hair
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Alopecia",
          "Hirsutism",
          "Brittle Hair",
        ]}
        fieldId="hairFindings"
        fieldLabel="Hair Findings"
      />

            <Text style={styles.sectionTitle}>
        Blanching
      </Text>

      <View style={styles.row}>
        {["Yes", "No"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue("blanching") === item
            }
            onPress={() =>
              updateField(
                "blanching",
                "Blanching",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Tenderness
      </Text>

      <View style={styles.row}>
        {["Present", "Absent"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue("tenderness") === item
            }
            onPress={() =>
              updateField(
                "tenderness",
                "Tenderness",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Mucosal Involvement
      </Text>

      <View style={styles.row}>
        {["Yes", "No"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "mucosalInvolvement"
              ) === item
            }
            onPress={() =>
              updateField(
                "mucosalInvolvement",
                "Mucosal Involvement",
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
          "Necrotic Lesion",
          "Rapidly Spreading Rash",
          "Petechiae/Purpura",
          "Skin Sloughing",
          "Suspected Melanoma",
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