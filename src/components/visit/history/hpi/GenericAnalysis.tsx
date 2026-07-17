import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  SPACING,
} from "@/theme";

export default function GenericAnalysis() {
  const [modeOfOnset, setModeOfOnset] =
    useState("");

  const [circumstance, setCircumstance] =
    useState("");

  const [trigger, setTrigger] =
    useState("");

  const [course, setCourse] =
    useState("");

  const [otherOnset, setOtherOnset] =
    useState("");

  const [otherCourse, setOtherCourse] =
    useState("");

  const [aggravating, setAggravating] =
    useState("");

  const [relieving, setRelieving] =
    useState("");

  const [treatmentEffect, setTreatmentEffect] =
    useState("");

  return (
    <View style={styles.container}>

      <SectionHeader title="Onset" />

      <Text style={styles.subTitle}>
        Mode of Onset
      </Text>

      <View style={styles.row}>
        {[
          "Sudden",
          "Insidious",
          "Acute",
          "Gradual",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={modeOfOnset === item}
            onPress={() =>
              setModeOfOnset(
                modeOfOnset === item
                  ? ""
                  : item
              )
            }
          />
        ))}
      </View>

      {modeOfOnset === "Other" && (
        <AppTextField
          placeholder="Specify onset..."
          value={otherOnset}
          onChangeText={setOtherOnset}
        />
      )}

      <Text style={styles.subTitle}>
        Circumstances at Onset
      </Text>

      <View style={styles.row}>
        {[
          "At Rest",
          "During Exertion",
          "After Meal",
          "After Trauma",
          "After Infection",
          "During Sleep",
          "On Waking",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={circumstance === item}
            onPress={() =>
              setCircumstance(
                circumstance === item
                  ? ""
                  : item
              )
            }
          />
        ))}
      </View>

      <Text style={styles.subTitle}>
        Trigger at Onset
      </Text>

      <View style={styles.row}>
        {[
          "Spontaneous",
          "Activity",
          "Posture",
          "Food",
          "Medication",
          "Stress",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={trigger === item}
            onPress={() =>
              setTrigger(
                trigger === item
                  ? ""
                  : item
              )
            }
          />
        ))}
      </View>

      <Divider />

      <SectionHeader title="Course" />

      <View style={styles.row}>
        {[
          "Progressive",
          "Static",
          "Intermittent",
          "Recurrent",
          "Continuous",
          "Improving",
          "Worsening",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={course === item}
            onPress={() =>
              setCourse(
                course === item
                  ? ""
                  : item
              )
            }
          />
        ))}
      </View>

      {course === "Other" && (
        <AppTextField
          placeholder="Describe course..."
          value={otherCourse}
          onChangeText={setOtherCourse}
        />
      )}

      <Divider />

      <SectionHeader title="Aggravating Factors" />

      <AppTextField
        multiline
        placeholder="Enter aggravating factors..."
        value={aggravating}
        onChangeText={setAggravating}
      />

      <Divider />

      <SectionHeader title="Relieving Factors" />

      <AppTextField
        multiline
        placeholder="Enter relieving factors..."
        value={relieving}
        onChangeText={setRelieving}
      />

      <Divider />

      <SectionHeader title="Effect of Treatment" />

      <AppTextField
        multiline
        placeholder="Describe the effect of treatment..."
        value={treatmentEffect}
        onChangeText={setTreatmentEffect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
});