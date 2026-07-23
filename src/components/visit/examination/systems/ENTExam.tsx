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

const SYSTEM_ID = "ent";

export default function ENTExam() {
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
        Ear
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Impacted Wax",
          "Otorrhea",
          "Otitis Externa",
          "Otitis Media",
          "Perforated TM",
          "Hearing Loss",
          "Tinnitus",
          "Vertigo",
        ]}
        fieldId="earFindings"
        fieldLabel="Ear Findings"
      />

      {(
        (getValue(
          "earFindings"
        ) as string[]) ?? []
      ).includes(
        "Hearing Loss"
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
                    "hearingSide"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "hearingSide",
                    "Hearing Side",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Nose
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Nasal Congestion",
          "Nasal Discharge",
          "Septal Deviation",
          "Nasal Polyp",
          "Epistaxis",
          "Post Nasal Drip",
        ]}
        fieldId="noseFindings"
        fieldLabel="Nose Findings"
      />

      {(
        (getValue(
          "noseFindings"
        ) as string[]) ?? []
      ).includes(
        "Nasal Discharge"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Discharge Type
          </Text>

          <View style={styles.row}>
            {[
              "Clear",
              "Purulent",
              "Bloody",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "dischargeType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "dischargeType",
                    "Discharge Type",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

            <Text style={styles.sectionTitle}>
        Throat
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Pharyngitis",
          "Tonsillitis",
          "Tonsillar Enlargement",
          "Peritonsillar Abscess",
          "Uvula Deviation",
          "Oral Thrush",
          "Hoarseness",
        ]}
        fieldId="throatFindings"
        fieldLabel="Throat Findings"
      />

      {(
        (getValue(
          "throatFindings"
        ) as string[]) ?? []
      ).includes(
        "Tonsillar Enlargement"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Tonsil Grade
          </Text>

          <View style={styles.row}>
            {[
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
                    "tonsilGrade"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "tonsilGrade",
                    "Tonsil Grade",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Neck
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Lymphadenopathy",
          "Thyroid Enlargement",
          "Neck Mass",
          "Tenderness",
        ]}
        fieldId="neckFindings"
        fieldLabel="Neck Findings"
      />

      {(
        (getValue(
          "neckFindings"
        ) as string[]) ?? []
      ).includes(
        "Lymphadenopathy"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Lymph Nodes
          </Text>

          <View style={styles.row}>
            {[
              "Anterior Cervical",
              "Posterior Cervical",
              "Submandibular",
              "Submental",
              "Supraclavicular",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "lymphNodes"
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMulti(
                    "lymphNodes",
                    "Lymph Nodes",
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
          "neckFindings"
        ) as string[]) ?? []
      ).includes(
        "Thyroid Enlargement"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Thyroid
          </Text>

          <View style={styles.row}>
            {[
              "Diffuse",
              "Nodular",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "thyroidType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "thyroidType",
                    "Thyroid Type",
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
          "neckFindings"
        ) as string[]) ?? []
      ).includes(
        "Neck Mass"
      ) && (
        <AppTextField
          label="Mass Location"
          value={
            (getValue(
              "neckMassLocation"
            ) as string) ?? ""
          }
          onChangeText={(text) =>
            updateField(
              "neckMassLocation",
              "Neck Mass Location",
              text
            )
          }
          placeholder="Describe location..."
        />
      )}

            <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <ChipGroup
        items={[
          "None",
          "Airway Compromise",
          "Stridor",
          "Facial Swelling",
          "Rapidly Enlarging Neck Mass",
          "Profuse Epistaxis",
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