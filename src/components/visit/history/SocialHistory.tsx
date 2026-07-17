import { useState } from "react";
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
  const [form, setForm] = useState({
    smoking: "Never",
    cigarettesPerDay: "",
    yearsSmoking: "",
    yearsSinceQuitting: "",

    alcohol: "No",
    alcoholFrequency: "",
    yearsSinceStopping: "",

    livingCondition: "",
    livingConditionNotes: "",

    substanceUse: [] as string[],
    substanceNotes: "",

    dietType: "",
    dietNotes: "",

    physicalActivity: "",
    physicalActivityNotes: "",

    sleepDuration: "",
    sleepNotes: "",

    sexualHistory: "",
    sexualHistoryNotes: "",

    travelExposure: [] as string[],
    travelNotes: "",

    socialSupport: "",
    socialSupportNotes: "",

    functionalStatus: "",
    financialStatus: "",
    functionalNotes: "",
  });

  const updateField = (
    field: keyof typeof form,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMultiSelect = (
    field: keyof typeof form,
    value: string
  ) => {
    const current = form[field] as string[];

    if (current.includes(value)) {
      updateField(
        field,
        current.filter((x) => x !== value)
      );
    } else {
      updateField(field, [...current, value]);
    }
  };

  return (
    <View style={styles.container}>

      <SectionHeader title="Smoking" />

      <View style={styles.row}>
        <AppChip
          label="Never"
          selected={form.smoking === "Never"}
          onPress={() =>
            updateField("smoking", "Never")
          }
        />

        <AppChip
          label="Current"
          selected={form.smoking === "Current"}
          onPress={() =>
            updateField("smoking", "Current")
          }
        />

        <AppChip
          label="Former"
          selected={form.smoking === "Former"}
          onPress={() =>
            updateField("smoking", "Former")
          }
        />
      </View>

      {form.smoking !== "Never" && (
        <View style={styles.box}>
          <AppTextField
            value={form.cigarettesPerDay}
            onChangeText={(v) =>
              updateField(
                "cigarettesPerDay",
                v
              )
            }
            placeholder="Cigarettes Per Day"
            keyboardType="numeric"
          />

          <AppTextField
            value={form.yearsSmoking}
            onChangeText={(v) =>
              updateField("yearsSmoking", v)
            }
            placeholder="Years Smoking"
            keyboardType="numeric"
          />

          <View style={styles.readOnlySection}>
            <Text style={styles.label}>
              Smoking Index
            </Text>

            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText}>
                Auto Calculated
              </Text>
            </View>
          </View>

          {form.smoking === "Former" && (
            <AppTextField
              value={form.yearsSinceQuitting}
              onChangeText={(v) =>
                updateField(
                  "yearsSinceQuitting",
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

      <SectionHeader title="Alcohol" />

      <View style={styles.row}>
        <AppChip
          label="No"
          selected={form.alcohol === "No"}
          onPress={() =>
            updateField("alcohol", "No")
          }
        />

        <AppChip
          label="Current"
          selected={form.alcohol === "Current"}
          onPress={() =>
            updateField("alcohol", "Current")
          }
        />

        <AppChip
          label="Former"
          selected={form.alcohol === "Former"}
          onPress={() =>
            updateField("alcohol", "Former")
          }
        />
      </View>

      {form.alcohol !== "No" && (
        <View style={styles.box}>
          <Text>How often</Text>

          <View style={styles.row}>
            <AppChip
              label="Occasional"
              selected={
                form.alcoholFrequency ===
                "Occasional"
              }
              onPress={() =>
                updateField(
                  "alcoholFrequency",
                  "Occasional"
                )
              }
            />

            <AppChip
              label="Weekly"
              selected={
                form.alcoholFrequency ===
                "Weekly"
              }
              onPress={() =>
                updateField(
                  "alcoholFrequency",
                  "Weekly"
                )
              }
            />

            <AppChip
              label="Daily"
              selected={
                form.alcoholFrequency ===
                "Daily"
              }
              onPress={() =>
                updateField(
                  "alcoholFrequency",
                  "Daily"
                )
              }
            />
          </View>

          {form.alcohol === "Former" && (
            <AppTextField
              value={form.yearsSinceStopping}
              onChangeText={(v) =>
                updateField(
                  "yearsSinceStopping",
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
              form.livingCondition === item
            }
            onPress={() =>
              updateField(
                "livingCondition",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.livingConditionNotes}
        onChangeText={(v) =>
          updateField(
            "livingConditionNotes",
            v
          )
        }
        placeholder="Additional notes..."
      />

      <Divider />

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
            selected={form.substanceUse.includes(item)}
            onPress={() =>
              toggleMultiSelect(
                "substanceUse",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.substanceNotes}
        onChangeText={(v) =>
          updateField("substanceNotes", v)
        }
        placeholder="Specify if needed..."
      />

      <Divider />

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
            selected={form.dietType === item}
            onPress={() =>
              updateField("dietType", item)
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.dietNotes}
        onChangeText={(v) =>
          updateField("dietNotes", v)
        }
        placeholder="Diet notes..."
      />

      <Divider />

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
              form.physicalActivity === item
            }
            onPress={() =>
              updateField(
                "physicalActivity",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.physicalActivityNotes}
        onChangeText={(v) =>
          updateField(
            "physicalActivityNotes",
            v
          )
        }
        placeholder="Exercise details..."
      />

      <Divider />

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
              form.sleepDuration === item
            }
            onPress={() =>
              updateField(
                "sleepDuration",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.sleepNotes}
        onChangeText={(v) =>
          updateField("sleepNotes", v)
        }
        placeholder="Sleep quality..."
      />

      <Divider />

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
              form.sexualHistory === item
            }
            onPress={() =>
              updateField(
                "sexualHistory",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.sexualHistoryNotes}
        onChangeText={(v) =>
          updateField(
            "sexualHistoryNotes",
            v
          )
        }
        placeholder="Optional notes..."
      />
      <Divider />

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
            selected={form.travelExposure.includes(item)}
            onPress={() =>
              toggleMultiSelect(
                "travelExposure",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.travelNotes}
        onChangeText={(v) =>
          updateField("travelNotes", v)
        }
        placeholder="Exposure details..."
      />

      <Divider />

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
            selected={form.socialSupport === item}
            onPress={() =>
              updateField(
                "socialSupport",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.socialSupportNotes}
        onChangeText={(v) =>
          updateField(
            "socialSupportNotes",
            v
          )
        }
        placeholder="Support notes..."
      />

      <Divider />

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
              form.functionalStatus === item
            }
            onPress={() =>
              updateField(
                "functionalStatus",
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
              form.financialStatus === item
            }
            onPress={() =>
              updateField(
                "financialStatus",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        value={form.functionalNotes}
        onChangeText={(v) =>
          updateField(
            "functionalNotes",
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