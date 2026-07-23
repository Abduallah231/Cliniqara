import { StyleSheet, View } from "react-native";
import { useVisitStore } from "@/store/visitStore";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import chronicDiseases from "@/data/chronicDiseases";

export default function PastHistory() {
  const {
    visit,
    updatePastHistoryField,
  } = useVisitStore();

  const getValue = (fieldId: string) =>
    visit.history.pastHistory.fields.find(
      (field) => field.fieldId === fieldId
    )?.value ?? null;

  const updateField = (
    fieldId: string,
    fieldLabel: string,
    value: any
  ) => {
    updatePastHistoryField(
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
      updatePastHistoryField(
        fieldId,
        fieldLabel,
        current.filter(
          (x) => x !== value
        )
      );
    } else {
      updatePastHistoryField(
        fieldId,
        fieldLabel,
        [...current, value]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* =========================
          Chronic Diseases
      ========================= */}

      <SectionHeader title="Chronic Diseases" />

      <View style={styles.row}>
        {chronicDiseases.map((disease) => (
          <AppChip
            key={disease}
            label={disease}
            selected={(
              (getValue(
                "chronicDiseases"
              ) as string[]) ?? []
            ).includes(disease)}
            onPress={() =>
              toggleMultiSelect(
                "chronicDiseases",
                "Chronic Diseases",
                disease
              )
            }
          />
        ))}
      </View>

      <AppTextField
        placeholder="Other chronic disease..."
        value={
          (getValue(
            "otherChronicDisease"
          ) as string) ?? ""
        }
        onChangeText={(v) =>
          updateField(
            "otherChronicDisease",
            "Other Chronic Disease",
            v
          )
        }
      />

      <Divider />

      {/* =========================
          Previous Similar Episode
      ========================= */}

      <SectionHeader title="Previous Similar Episode" />

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={
            getValue(
              "previousSimilarEpisode"
            ) === "Yes"
          }
          onPress={() =>
            updateField(
              "previousSimilarEpisode",
              "Previous Similar Episode",
              "Yes"
            )
          }
        />

        <AppChip
          label="No"
          selected={
            getValue(
              "previousSimilarEpisode"
            ) === "No"
          }
          onPress={() =>
            updateField(
              "previousSimilarEpisode",
              "Previous Similar Episode",
              "No"
            )
          }
        />
      </View>

      {getValue(
        "previousSimilarEpisode"
      ) === "Yes" && (
        <View style={styles.box}>
          <AppTextField

            placeholder="How many episodes?"
            value={
              (getValue(
                "episodeFrequency"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "episodeFrequency",
                "Episode Frequency",
                v
              )
            }
          />

          <AppTextField

            placeholder="Last Episode Date"
            value={
              (getValue(
                "lastEpisode"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "lastEpisode",
                "Last Episode",
                v
              )
            }
          />
        </View>
      )}

      <Divider />

      {/* =========================
    Previous Hospitalization
========================= */}

<SectionHeader title="Previous Hospitalization" />

<View style={styles.row}>
  <AppChip
    label="Yes"
    selected={
      getValue("previousHospitalization") ===
      "Yes"
    }
    onPress={() =>
      updateField(
        "previousHospitalization",
        "Previous Hospitalization",
        "Yes"
      )
    }
  />

  <AppChip
    label="No"
    selected={
      getValue("previousHospitalization") ===
      "No"
    }
    onPress={() =>
      updateField(
        "previousHospitalization",
        "Previous Hospitalization",
        "No"
      )
    }
  />
</View>

{getValue("previousHospitalization") ===
  "Yes" && (
  <View style={styles.box}>
    <AppTextField
      placeholder="Reason"
      value={
        (getValue(
          "hospitalizationReason"
        ) as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "hospitalizationReason",
          "Hospitalization Reason",
          v
        )
      }
    />

    <AppTextField
      placeholder="Date"
      value={
        (getValue(
          "hospitalizationDate"
        ) as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "hospitalizationDate",
          "Hospitalization Date",
          v
        )
      }
    />

    <AppTextField
      placeholder="Duration of Stay"
      value={
        (getValue(
          "hospitalizationDuration"
        ) as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "hospitalizationDuration",
          "Hospitalization Duration",
          v
        )
      }
    />
  </View>
)}

<Divider />

{/* =========================
    Previous Operations
========================= */}

<SectionHeader title="Previous Operations" />

<AppTextField
  placeholder="List previous operations..."
  multiline
  value={
    (getValue(
      "previousOperations"
    ) as string) ?? ""
  }
  onChangeText={(v) =>
    updateField(
      "previousOperations",
      "Previous Operations",
      v
    )
  }
/>

<Divider />

{/* =========================
    Blood Transfusion
========================= */}

<SectionHeader title="Blood Transfusion" />

<View style={styles.row}>
  <AppChip
    label="Yes"
    selected={
      getValue("bloodTransfusion") ===
      "Yes"
    }
    onPress={() =>
      updateField(
        "bloodTransfusion",
        "Blood Transfusion",
        "Yes"
      )
    }
  />

  <AppChip
    label="No"
    selected={
      getValue("bloodTransfusion") ===
      "No"
    }
    onPress={() =>
      updateField(
        "bloodTransfusion",
        "Blood Transfusion",
        "No"
      )
    }
  />
</View>

{getValue("bloodTransfusion") ===
  "Yes" && (
  <View style={styles.box}>
    <AppTextField
      placeholder="Reason"
      value={
        (getValue(
          "transfusionReason"
        ) as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "transfusionReason",
          "Transfusion Reason",
          v
        )
      }
    />

    <AppTextField
      placeholder="When"
      value={
        (getValue(
          "transfusionDate"
        ) as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "transfusionDate",
          "Transfusion Date",
          v
        )
      }
    />

    <AppTextField
      placeholder="Any transfusion reaction?"
      value={
        (getValue(
          "transfusionReaction"
        ) as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "transfusionReaction",
          "Transfusion Reaction",
          v
        )
      }
    />
  </View>
)}

<Divider />

{/* =========================
    Major Trauma
========================= */}

<SectionHeader title="Major Trauma" />

<View style={styles.row}>
  <AppChip
    label="Yes"
    selected={
      getValue("majorTrauma") === "Yes"
    }
    onPress={() =>
      updateField(
        "majorTrauma",
        "Major Trauma",
        "Yes"
      )
    }
  />

  <AppChip
    label="No"
    selected={
      getValue("majorTrauma") === "No"
    }
    onPress={() =>
      updateField(
        "majorTrauma",
        "Major Trauma",
        "No"
      )
    }
  />
</View>

{getValue("majorTrauma") === "Yes" && (
  <View style={styles.box}>
    <AppTextField
      placeholder="Type of trauma"
      value={
        (getValue("traumaType") as string) ??
        ""
      }
      onChangeText={(v) =>
        updateField(
          "traumaType",
          "Trauma Type",
          v
        )
      }
    />

    <AppTextField
      placeholder="When"
      value={
        (getValue("traumaDate") as string) ??
        ""
      }
      onChangeText={(v) =>
        updateField(
          "traumaDate",
          "Trauma Date",
          v
        )
      }
    />

    <AppTextField
      placeholder="Residual disability / complications"
      value={
        (getValue(
          "traumaComplications"
        ) as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "traumaComplications",
          "Trauma Complications",
          v
        )
      }
    />
  </View>
)}

<Divider />

{/* =========================
    ICU Admission
========================= */}

<SectionHeader title="ICU Admission" />

<View style={styles.row}>
  <AppChip
    label="Yes"
    selected={
      getValue("icuAdmission") === "Yes"
    }
    onPress={() =>
      updateField(
        "icuAdmission",
        "ICU Admission",
        "Yes"
      )
    }
  />

  <AppChip
    label="No"
    selected={
      getValue("icuAdmission") === "No"
    }
    onPress={() =>
      updateField(
        "icuAdmission",
        "ICU Admission",
        "No"
      )
    }
  />
</View>

{getValue("icuAdmission") === "Yes" && (
  <View style={styles.box}>
    <AppTextField
      placeholder="Reason"
      value={
        (getValue("icuReason") as string) ??
        ""
      }
      onChangeText={(v) =>
        updateField(
          "icuReason",
          "ICU Reason",
          v
        )
      }
    />

    <AppTextField
      placeholder="When"
      value={
        (getValue("icuDate") as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "icuDate",
          "ICU Date",
          v
        )
      }
    />

    <AppTextField
      placeholder="Duration"
      value={
        (getValue("icuDuration") as string) ??
        ""
      }
      onChangeText={(v) =>
        updateField(
          "icuDuration",
          "ICU Duration",
          v
        )
      }
    />

    <AppTextField
      placeholder="Ventilator support?"
      value={
        (getValue(
          "ventilatorSupport"
        ) as string) ?? ""
      }
      onChangeText={(v) =>
        updateField(
          "ventilatorSupport",
          "Ventilator Support",
          v
        )
      }
    />
  </View>
)}

</View>
);
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  box: {
    gap: SPACING.sm,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
});