import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import ExcretaAnalysis from "./ExcretaAnalysis";
import PainAnalysis from "./PainAnalysis";

import type { SelectionOption } from "@/models/selection";

type Props = {
  chiefComplaint?: SelectionOption;
};

export default function AnalysisOfComplaint({
  chiefComplaint,
}: Props) {
  const [complaintType, setComplaintType] =
    useState("");

  const [symptomSearch, setSymptomSearch] =
    useState("");

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

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

  const commonSymptoms = [
    "Fever",
    "Cough",
    "Dyspnea",
    "Chest Pain",
    "Palpitations",
    "Headache",
    "Dizziness",
    "Fatigue",
    "Vomiting",
    "Diarrhea",
    "Weight Loss",
  ].filter(
    (item) =>
      item.toLowerCase() !==
      chiefComplaint?.label.toLowerCase()
  );

  const addSymptom = (
    symptom: string
  ) => {
    const value = symptom.trim();

    if (!value) return;

    if (
      selectedSymptoms.some(
        (s) =>
          s.toLowerCase() ===
          value.toLowerCase()
      )
    )
      return;

    setSelectedSymptoms([
      ...selectedSymptoms,
      value,
    ]);

    setSymptomSearch("");
  };

  const removeSymptom = (
    symptom: string
  ) => {
    setSelectedSymptoms(
      selectedSymptoms.filter(
        (item) => item !== symptom
      )
    );
  };

  return (
    <View style={styles.container}>
    <Divider />
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
      <SectionHeader title="Associated Symptoms" />

      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <AppTextField

            placeholder="Search symptom..."
            value={symptomSearch}
            onChangeText={setSymptomSearch}
          />
        </View>

        <AppButton
          title="Add"
          onPress={() =>
            addSymptom(symptomSearch)
          }
          style={{
            width: 90,
            alignSelf: "flex-end",
          }}
        />
      </View>

      <Text style={styles.subTitle}>
        Common Symptoms
      </Text>

      <View style={styles.row}>
        {commonSymptoms
          .filter(
            (symptom) =>
              !selectedSymptoms.includes(
                symptom
              )
          )
          .map((symptom) => (
            <AppChip
              key={symptom}
              label={symptom}
              selected={false}
              onPress={() =>
                addSymptom(symptom)
              }
            />
          ))}
      </View>

      {!!chiefComplaint && (
        <>
          <Text style={styles.subTitle}>
            Primary Complaint
          </Text>

          <View style={styles.row}>
            <AppChip
              label={chiefComplaint?.label ?? ""}
              selected
              onPress={() => {}}
            />
          </View>
        </>
      )}

      {selectedSymptoms.length > 0 && (
        <>
          <Text style={styles.subTitle}>
            Selected Symptoms
          </Text>

          <View style={styles.row}>
            {selectedSymptoms.map(
              (symptom) => (
                <AppChip
                  key={symptom}
                  label={symptom}
                  selected
                  onPress={() =>
                    removeSymptom(
                      symptom
                    )
                  }
                />
              )
            )}
          </View>
        </>
      )}
      <Divider />
      <SectionHeader title="Aggravating Factors" />

      <AppTextField
        placeholder="Enter aggravating factors"
        value={aggravating}
        onChangeText={setAggravating}
        multiline
      />


      <AppTextField
        label=""
        placeholder="Enter relieving factors"
        value={relieving}
        onChangeText={setRelieving}
        multiline
      />
      <Divider />
      <SectionHeader title="Effect of Treatment" />
      <AppTextField
        placeholder="Enter effect of treatment"
        value={treatmentEffect}
        onChangeText={
          setTreatmentEffect
        }
        multiline
      />
            <Divider />
      <SectionHeader title="Complaint Type" />

      <View style={styles.row}>
        <AppChip
          label="Pain"
          selected={complaintType === "Pain"}
          onPress={() =>
            setComplaintType(
              complaintType === "Pain"
                ? ""
                : "Pain"
            )
          }
        />

        <AppChip
          label="Excreta"
          selected={complaintType === "Excreta"}
          onPress={() =>
            setComplaintType(
              complaintType === "Excreta"
                ? ""
                : "Excreta"
            )
          }
        />
      </View>

      {complaintType === "Pain" && (
        <PainAnalysis />
      )}

      {complaintType === "Excreta" && (
        <ExcretaAnalysis />
      )}
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
    marginTop: SPACING.sm,
  },

  subTitle: {
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

  searchRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.sm,
  },
});