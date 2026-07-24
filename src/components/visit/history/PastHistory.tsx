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

    addHospitalization,
    updateHospitalization,
    removeHospitalization,

    addOperation,
    updateOperation,
    removeOperation,

    addBloodTransfusion,
    updateBloodTransfusion,
    removeBloodTransfusion,

    addMajorTrauma,
    updateMajorTrauma,
    removeMajorTrauma,

    addICUAdmission,
    updateICUAdmission,
    removeICUAdmission,
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
            selected={
              (
                (getValue(
                  "chronicDiseases"
                ) as string[]) ?? []
              ).includes(disease)
            }
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

      {/*  <SectionHeader
        title="Previous Similar Episode"
      />

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={
            getValu
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

      <Divider />     */}

      {/* =========================
          Hospitalizations
      ========================= */}

      <SectionHeader title="Hospitalizations" />

      {visit.history.pastHistory.hospitalizations.map(
        (item) => (
          <View key={item.id} style={styles.recordCard}>
            <AppTextField
              placeholder="Reason"
              value={item.reason}
              onChangeText={(v) =>
                updateHospitalization(item.id, {
                  reason: v,
                })
              }
            />

            <AppTextField
              placeholder="Date"
              value={item.date}
              onChangeText={(v) =>
                updateHospitalization(item.id, {
                  date: v,
                })
              }
            />

            <AppTextField
              placeholder="Duration"
              value={item.duration}
              onChangeText={(v) =>
                updateHospitalization(item.id, {
                  duration: v,
                })
              }
            />

            <AppChip
              label="Delete"
              onPress={() =>
                removeHospitalization(item.id)
              }
            />
          </View>
        )
      )}

      <AppChip
        label="+ Add Hospitalization"
        onPress={() =>
          addHospitalization({
            id: Date.now().toString(),
            reason: "",
            date: "",
            duration: "",
          })
        }
      />

      <Divider />

      {/* =========================
          Operations
      ========================= */}

      <SectionHeader title="Operations" />

      {visit.history.pastHistory.operations.map(
        (item) => (
          <View key={item.id} style={styles.recordCard}>
            <AppTextField
              placeholder="Operation"
              value={item.name}
              onChangeText={(v) =>
                updateOperation(item.id, {
                  name: v,
                })
              }
            />

            <AppTextField
              placeholder="Date"
              value={item.date}
              onChangeText={(v) =>
                updateOperation(item.id, {
                  date: v,
                })
              }
            />

            <AppTextField
              placeholder="Indication"
              value={item.indication}
              onChangeText={(v) =>
                updateOperation(item.id, {
                  indication: v,
                })
              }
            />

            <AppChip
              label="Delete"
              onPress={() =>
                removeOperation(item.id)
              }
            />
          </View>
        )
      )}

      <AppChip
        label="+ Add Operation"
        onPress={() =>
          addOperation({
            id: Date.now().toString(),
            name: "",
            date: "",
            indication: "",
          })
        }
      />

      <Divider />

      {/* =========================
          Blood Transfusions
      ========================= */}

      <SectionHeader title="Blood Transfusions" />

      {visit.history.pastHistory.bloodTransfusions.map(
        (item) => (
          <View key={item.id} style={styles.recordCard}>
            <AppTextField
              placeholder="Reason"
              value={item.reason}
              onChangeText={(v) =>
                updateBloodTransfusion(item.id, {
                  reason: v,
                })
              }
            />

            <AppTextField
              placeholder="Date"
              value={item.date}
              onChangeText={(v) =>
                updateBloodTransfusion(item.id, {
                  date: v,
                })
              }
            />

            <AppTextField
              placeholder="Reaction"
              value={item.reaction}
              onChangeText={(v) =>
                updateBloodTransfusion(item.id, {
                  reaction: v,
                })
              }
            />

            <AppChip
              label="Delete"
              onPress={() =>
                removeBloodTransfusion(item.id)
              }
            />
          </View>
        )
      )}

      <AppChip
        label="+ Add Blood Transfusion"
        onPress={() =>
          addBloodTransfusion({
            id: Date.now().toString(),
            reason: "",
            date: "",
            reaction: "",
          })
        }
      />

      <Divider />

      {/* =========================
    Major Trauma
========================= */}

<SectionHeader title="Major Trauma" />

{visit.history.pastHistory.majorTraumas.map(
  (item) => (
    <View key={item.id} style={styles.recordCard}>
      <AppTextField
        placeholder="Type"
        value={item.type}
        onChangeText={(v) =>
          updateMajorTrauma(item.id, {
            type: v,
          })
        }
      />

      <AppTextField
        placeholder="Date"
        value={item.date}
        onChangeText={(v) =>
          updateMajorTrauma(item.id, {
            date: v,
          })
        }
      />

      <AppTextField
        placeholder="Complications"
        value={item.complications}
        onChangeText={(v) =>
          updateMajorTrauma(item.id, {
            complications: v,
          })
        }
      />

      <AppChip
        label="Delete"
        onPress={() =>
          removeMajorTrauma(item.id)
        }
      />
    </View>
  )
)}

<AppChip
  label="+ Add Major Trauma"
  onPress={() =>
    addMajorTrauma({
      id: Date.now().toString(),
      type: "",
      date: "",
      complications: "",
    })
  }
/>

<Divider />

{/* =========================
    ICU Admission
========================= */}

<SectionHeader title="ICU Admission" />

{visit.history.pastHistory.icuAdmissions.map(
  (item) => (
    <View key={item.id} style={styles.recordCard}>
      <AppTextField
        placeholder="Reason"
        value={item.reason}
        onChangeText={(v) =>
          updateICUAdmission(item.id, {
            reason: v,
          })
        }
      />

      <AppTextField
        placeholder="Date"
        value={item.date}
        onChangeText={(v) =>
          updateICUAdmission(item.id, {
            date: v,
          })
        }
      />

      <AppTextField
        placeholder="Duration"
        value={item.duration}
        onChangeText={(v) =>
          updateICUAdmission(item.id, {
            duration: v,
          })
        }
      />

      <View style={styles.row}>
      <AppChip
        label="Yes"
        selected={item.ventilatorSupport}
        onPress={() =>
          updateICUAdmission(item.id, {
            ventilatorSupport: true,
          })
        }
      />

      <AppChip
        label="No"
        selected={!item.ventilatorSupport}
        onPress={() =>
          updateICUAdmission(item.id, {
            ventilatorSupport: false,
          })
        }
      />
    </View>

      <AppChip
        label="Delete"
        onPress={() =>
          removeICUAdmission(item.id)
        }
      />
    </View>
  )
)}

<AppChip
  label="+ Add ICU Admission"
  onPress={() =>
    addICUAdmission({
      id: Date.now().toString(),
      reason: "",
      date: "",
      duration: "",
      ventilatorSupport: false,
    })
  }
/>

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

  recordCard: {
    gap: SPACING.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
});