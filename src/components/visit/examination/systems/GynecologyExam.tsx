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

const SYSTEM_ID = "gynecology";

export default function GynecologyExam() {
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
        External Genitalia
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Discharge",
          "Ulcer",
          "Mass",
          "Warts",
          "Tenderness",
          "Bartholin Cyst",
          "Bartholin Abscess",
          "Pigmented Lesion",
        ]}
        fieldId="externalFindings"
        fieldLabel="External Findings"
      />

      {(
        (getValue(
          "externalFindings"
        ) as string[]) ?? []
      ).includes(
        "Discharge"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Discharge Type
          </Text>

          <View style={styles.row}>
            {[
              "White",
              "Yellow",
              "Green",
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
        Vaginal Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Atrophy",
          "Tenderness",
          "Mass",
        ]}
        fieldId="vaginalFindings"
        fieldLabel="Vaginal Findings"
      />

      <Text style={styles.sectionTitle}>
        Cervix
      </Text>

      <ChipGroup
        items={[
          "Healthy",
          "Erosion",
          "Polyp",
          "Cervicitis",
          "Discharge",
          "Bleeding",
          "Growth",
        ]}
        fieldId="cervixFindings"
        fieldLabel="Cervix Findings"
        normal="Healthy"
      />

            {(
        (getValue(
          "cervixFindings"
        ) as string[]) ?? []
      ).includes(
        "Discharge"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Cervical Discharge
          </Text>

          <View style={styles.row}>
            {[
              "Mucoid",
              "Purulent",
              "Bloody",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "cervicalDischargeType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "cervicalDischargeType",
                    "Cervical Discharge Type",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Uterus
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Bulky",
          "Tender",
          "Retroverted",
          "Restricted Mobility",
        ]}
        fieldId="uterusFindings"
        fieldLabel="Uterus Findings"
      />

      <AppTextField
        label="Uterus Size"
        value={
          (getValue(
            "uterusSize"
          ) as string) ?? ""
        }
        onChangeText={(text) =>
          updateField(
            "uterusSize",
            "Uterus Size",
            text
          )
        }
        placeholder="e.g. 8 weeks"
      />

      <Text style={styles.label}>
        Mobility
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Restricted",
          "Fixed",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "uterusMobility"
              ) === item
            }
            onPress={() =>
              updateField(
                "uterusMobility",
                "Uterus Mobility",
                item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Adnexa
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Tenderness",
          "Mass",
        ]}
        fieldId="adnexalFindings"
        fieldLabel="Adnexal Findings"
      />

      {(
        (getValue(
          "adnexalFindings"
        ) as string[]) ?? []
      ).includes(
        "Mass"
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
                    "adnexalMassSide"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "adnexalMassSide",
                    "Adnexal Mass Side",
                    item
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Consistency
          </Text>

          <View style={styles.row}>
            {[
              "Cystic",
              "Solid",
              "Mixed",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "adnexalMassType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "adnexalMassType",
                    "Adnexal Mass Type",
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Fornices
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Tender",
          "Fullness",
          "Mass",
        ]}
        fieldId="fornixFindings"
        fieldLabel="Fornix Findings"
      />

            <Text style={styles.sectionTitle}>
        Pelvic Organ Prolapse
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Cystocele",
          "Rectocele",
          "Uterine Prolapse",
          "Vault Prolapse",
        ]}
        fieldId="prolapseFindings"
        fieldLabel="Prolapse Findings"
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        PID Signs
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Cervical Motion Tenderness",
          "Adnexal Tenderness",
          "Uterine Tenderness",
        ]}
        fieldId="pidFindings"
        fieldLabel="PID Findings"
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <ChipGroup
        items={[
          "None",
          "Active Heavy Bleeding",
          "Large Pelvic Mass",
          "Severe Pelvic Tenderness",
          "Suspicious Cervical Growth",
          "Foul Discharge",
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