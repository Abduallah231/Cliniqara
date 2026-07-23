import { useVisitStore } from "@/store/visitStore";
import { StyleSheet, Text, View } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function SocialHistory() {
  const {
    visit,
    updateSocialField,
  } = useVisitStore();

  const getValue = (fieldId: string) =>
    visit.history.socialHistory.fields.find(
      (field) => field.fieldId === fieldId
    )?.value ?? null;

  const updateField = (
    fieldId: string,
    fieldLabel: string,
    value: any
  ) => {
    updateSocialField(
      fieldId,
      fieldLabel,
      value
    );
  };

  const toggleMultiSelect = (
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    const current =
      (getValue(fieldId) as string[]) ?? [];

    if (current.includes(value)) {
      updateSocialField(
        fieldId,
        fieldLabel,
        current.filter(
          (x) => x !== value
        )
      );
    } else {
      updateSocialField(
        fieldId,
        fieldLabel,
        [...current, value]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* =========================
          Smoking
      ========================= */}

      <SectionHeader title="Smoking" />

      <View style={styles.row}>
        {[
          "Never",
          "Current",
          "Former",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue("smoking") === item
            }
            onPress={() =>
              updateField(
                "smoking",
                "Smoking",
                item
              )
            }
          />
        ))}
      </View>

      {getValue("smoking") !==
        "Never" && (
        <View style={styles.box}>
          <AppTextField
            value={
              (getValue(
                "cigarettesPerDay"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "cigarettesPerDay",
                "Cigarettes Per Day",
                v
              )
            }
            placeholder="Cigarettes Per Day"
            keyboardType="numeric"
          />

          <AppTextField
            value={
              (getValue(
                "yearsSmoking"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "yearsSmoking",
                "Years Smoking",
                v
              )
            }
            placeholder="Years Smoking"
            keyboardType="numeric"
          />

          <View
            style={
              styles.readOnlySection
            }>
            <Text style={styles.label}>
              Smoking Index
            </Text>

            <View
              style={styles.readOnlyBox}>
              <Text
                style={
                  styles.readOnlyText
                }>
                Auto Calculated
              </Text>
            </View>
          </View>

          {getValue("smoking") ===
            "Former" && (
            <AppTextField
              value={
                (getValue(
                  "yearsSinceQuitting"
                ) as string) ?? ""
              }
              onChangeText={(v) =>
                updateField(
                  "yearsSinceQuitting",
                  "Years Since Quitting",
                  v
                )
              }
              placeholder="Years Since Quitting"
              keyboardType="numeric"
            />
          )}
        </View>
      )}

      <Divider />

      {/* =========================
    Alcohol
========================= */}

<SectionHeader title="Alcohol" />

<View style={styles.row}>
  {[
    "No",
    "Current",
    "Former",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue("alcohol") === item
      }
      onPress={() =>
        updateField(
          "alcohol",
          "Alcohol",
          item
        )
      }
    />
  ))}
</View>

{getValue("alcohol") !== "No" && (
  <View style={styles.box}>
    <Text style={styles.label}>
      How often
    </Text>

    <View style={styles.row}>
      {[
        "Occasional",
        "Weekly",
        "Daily",
      ].map((item) => (
        <AppChip
          key={item}
          label={item}
          selected={
            getValue(
              "alcoholFrequency"
            ) === item
          }
          onPress={() =>
            updateField(
              "alcoholFrequency",
              "Alcohol Frequency",
              item
            )
          }
        />
      ))}
    </View>

    {getValue("alcohol") ===
      "Former" && (
      <AppTextField
        value={
          (getValue(
            "yearsSinceStopping"
          ) as string) ?? ""
        }
        onChangeText={(v) =>
          updateField(
            "yearsSinceStopping",
            "Years Since Stopping",
            v
          )
        }
        placeholder="Years Since Stopping"
        keyboardType="numeric"
      />
    )}
  </View>
)}

<Divider />

{/* =========================
    Living Conditions
========================= */}

<SectionHeader title="Living Conditions" />

<View style={styles.row}>
  {[
    "Lives Alone",
    "With Family",
    "Nursing Home",
    "Homeless",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "livingCondition"
        ) === item
      }
      onPress={() =>
        updateField(
          "livingCondition",
          "Living Condition",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue(
      "livingConditionNotes"
    ) as string) ?? ""
  }
  onChangeText={(v) =>
    updateField(
      "livingConditionNotes",
      "Living Condition Notes",
      v
    )
  }
  placeholder="Additional notes..."
/>

<Divider />

{/* =========================
    Substance Use
========================= */}

<SectionHeader title="Substance Use" />

<View style={styles.row}>
  {[
    "None",
    "Cannabis",
    "Opioids",
    "Cocaine",
    "Amphetamines",
    "Other",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={(
        (getValue(
          "substanceUse"
        ) as string[]) ?? []
      ).includes(item)}
      onPress={() =>
        toggleMultiSelect(
          "substanceUse",
          "Substance Use",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue(
      "substanceNotes"
    ) as string) ?? ""
  }
  onChangeText={(v) =>
    updateField(
      "substanceNotes",
      "Substance Notes",
      v
    )
  }
  placeholder="Specify if needed..."
/>

<Divider />

{/* =========================
    Diet & Nutrition
========================= */}

<SectionHeader title="Diet & Nutrition" />

<View style={styles.row}>
  {[
    "Balanced",
    "High Fat",
    "High Sugar",
    "Vegetarian",
    "Vegan",
    "Special Diet",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue("dietType") === item
      }
      onPress={() =>
        updateField(
          "dietType",
          "Diet Type",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue("dietNotes") as string) ??
    ""
  }
  onChangeText={(v) =>
    updateField(
      "dietNotes",
      "Diet Notes",
      v
    )
  }
  placeholder="Diet notes..."
/>

<Divider />

{/* =========================
    Physical Activity
========================= */}

<SectionHeader title="Physical Activity" />

<View style={styles.row}>
  {[
    "Sedentary",
    "Light",
    "Moderate",
    "Heavy",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "physicalActivity"
        ) === item
      }
      onPress={() =>
        updateField(
          "physicalActivity",
          "Physical Activity",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue(
      "physicalActivityNotes"
    ) as string) ?? ""
  }
  onChangeText={(v) =>
    updateField(
      "physicalActivityNotes",
      "Physical Activity Notes",
      v
    )
  }
  placeholder="Exercise details..."
/>

<Divider />

{/* =========================
    Sleep
========================= */}

<SectionHeader title="Sleep" />

<View style={styles.row}>
  {[
    "<5 h",
    "5-7 h",
    "7-9 h",
    ">9 h",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "sleepDuration"
        ) === item
      }
      onPress={() =>
        updateField(
          "sleepDuration",
          "Sleep Duration",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue("sleepNotes") as string) ??
    ""
  }
  onChangeText={(v) =>
    updateField(
      "sleepNotes",
      "Sleep Notes",
      v
    )
  }
  placeholder="Sleep quality..."
/>

<Divider />

{/* =========================
    Sexual History
========================= */}

<SectionHeader title="Sexual History (Optional)" />

<View style={styles.row}>
  {[
    "Not Discussed",
    "Sexually Active",
    "Not Active",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "sexualHistory"
        ) === item
      }
      onPress={() =>
        updateField(
          "sexualHistory",
          "Sexual History",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue(
      "sexualHistoryNotes"
    ) as string) ?? ""
  }
  onChangeText={(v) =>
    updateField(
      "sexualHistoryNotes",
      "Sexual History Notes",
      v
    )
  }
  placeholder="Optional notes..."
/>

<Divider />

{/* =========================
    Travel & Environmental Exposure
========================= */}

<SectionHeader title="Travel & Environmental Exposure" />

<View style={styles.row}>
  {[
    "Recent Travel",
    "Animals",
    "Dust",
    "Chemicals",
    "None",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={(
        (getValue(
          "travelExposure"
        ) as string[]) ?? []
      ).includes(item)}
      onPress={() =>
        toggleMultiSelect(
          "travelExposure",
          "Travel Exposure",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue(
      "travelNotes"
    ) as string) ?? ""
  }
  onChangeText={(v) =>
    updateField(
      "travelNotes",
      "Travel Notes",
      v
    )
  }
  placeholder="Exposure details..."
/>

<Divider />

{/* =========================
    Social Support
========================= */}

<SectionHeader title="Social Support" />

<View style={styles.row}>
  {[
    "Good",
    "Limited",
    "Lives Alone",
    "Caregiver",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "socialSupport"
        ) === item
      }
      onPress={() =>
        updateField(
          "socialSupport",
          "Social Support",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue(
      "socialSupportNotes"
    ) as string) ?? ""
  }
  onChangeText={(v) =>
    updateField(
      "socialSupportNotes",
      "Social Support Notes",
      v
    )
  }
  placeholder="Support notes..."
/>

<Divider />

{/* =========================
    Functional & Financial Status
========================= */}

<SectionHeader title="Functional & Financial Status" />

<View style={styles.row}>
  {[
    "Independent",
    "Needs Assistance",
    "Dependent",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "functionalStatus"
        ) === item
      }
      onPress={() =>
        updateField(
          "functionalStatus",
          "Functional Status",
          item
        )
      }
    />
  ))}
</View>

<View style={styles.row}>
  {[
    "Financially Stable",
    "Financial Difficulty",
  ].map((item) => (
    <AppChip
      key={item}
      label={item}
      selected={
        getValue(
          "financialStatus"
        ) === item
      }
      onPress={() =>
        updateField(
          "financialStatus",
          "Financial Status",
          item
        )
      }
    />
  ))}
</View>

<AppTextField
  value={
    (getValue(
      "functionalNotes"
    ) as string) ?? ""
  }
  onChangeText={(v) =>
    updateField(
      "functionalNotes",
      "Functional Notes",
      v
    )
  }
  placeholder="Additional notes..."
/>

</View>
);
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  box: {
    gap: SPACING.sm,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },

  sectionTitle: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },

  readOnlySection: {
    gap: SPACING.xs,
  },

  readOnlyBox: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },

  readOnlyText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "500",
  },
});