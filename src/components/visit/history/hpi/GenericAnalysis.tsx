import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import { SPACING } from "@/theme";
import { useVisitStore } from "@/store/visitStore";

export default function GenericAnalysis() {
  const {
    visit,
    updateAnalysisField,
  } = useVisitStore();

  const getValue = (fieldId: string) => {
    return (
      visit.history.hpi.analysis.fields.find(
        (f) => f.fieldId === fieldId
      )?.value ?? ""
    );
  };

  const modeOfOnset = getValue("modeOfOnset") as string;
  const circumstance = getValue("circumstance") as string;
  const trigger = getValue("trigger") as string;
  const course = getValue("course") as string;
  const otherOnset = getValue("otherOnset") as string;
  const otherCourse = getValue("otherCourse") as string;
  const aggravating = getValue("aggravating") as string;
  const relieving = getValue("relieving") as string;
  const treatmentEffect =
    getValue("treatmentEffect") as string;

  return (
    <AppView style={styles.container}>
      <SectionHeader title="Onset" />

      <AppText style={styles.subTitle}>
        Mode of Onset
      </AppText>

      <AppView style={styles.row}>
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
              updateAnalysisField(
                "modeOfOnset",
                "Mode of Onset",
                modeOfOnset === item ? "" : item
              )
            }
          />
        ))}
      </AppView>

      {modeOfOnset === "Other" && (
        <AppTextField
          placeholder="Specify onset..."
          value={otherOnset}
          onChangeText={(text) =>
            updateAnalysisField(
              "otherOnset",
              "Other Onset",
              text
            )
          }
        />
      )}

      <AppText style={styles.subTitle}>
        Circumstances at Onset
      </AppText>

      <AppView style={styles.row}>
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
              updateAnalysisField(
                "circumstance",
                "Circumstance",
                circumstance === item ? "" : item
              )
            }
          />
        ))}
      </AppView>

      <AppText style={styles.subTitle}>
        Trigger at Onset
      </AppText>

      <AppView style={styles.row}>
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
              updateAnalysisField(
                "trigger",
                "Trigger",
                trigger === item ? "" : item
              )
            }
          />
        ))}
      </AppView>

      <Divider />

      <SectionHeader title="Course" />

            <AppView style={styles.row}>
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
              updateAnalysisField(
                "course",
                "Course",
                course === item ? "" : item
              )
            }
          />
        ))}
      </AppView>

      {course === "Other" && (
        <AppTextField
          placeholder="Describe course..."
          value={otherCourse}
          onChangeText={(text) =>
            updateAnalysisField(
              "otherCourse",
              "Other Course",
              text
            )
          }
        />
      )}

      <Divider />

      <SectionHeader title="Aggravating Factors" />

      <AppTextField
        multiline
        placeholder="Enter aggravating factors..."
        value={aggravating}
        onChangeText={(text) =>
          updateAnalysisField(
            "aggravating",
            "Aggravating Factors",
            text
          )
        }
      />

      <Divider />

      <SectionHeader title="Relieving Factors" />

      <AppTextField
        multiline
        placeholder="Enter relieving factors..."
        value={relieving}
        onChangeText={(text) =>
          updateAnalysisField(
            "relieving",
            "Relieving Factors",
            text
          )
        }
      />

      <Divider />

      <SectionHeader title="Effect of Treatment" />

      <AppTextField
        multiline
        placeholder="Describe the effect of treatment..."
        value={treatmentEffect}
        onChangeText={(text) =>
          updateAnalysisField(
            "treatmentEffect",
            "Effect of Treatment",
            text
          )
        }
      />
    </AppView>
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