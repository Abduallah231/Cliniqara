import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function PastHistory() {
  const [selectedDiseases, setSelectedDiseases] =
    useState<string[]>([]);

  const [otherDisease, setOtherDisease] =
    useState("");

  const [similarEpisode, setSimilarEpisode] =
    useState("No");

  const [episodeFrequency, setEpisodeFrequency] =
    useState("");

  const [lastEpisode, setLastEpisode] =
    useState("");

  const [hospitalization, setHospitalization] =
    useState("No");

  const [hospitalReason, setHospitalReason] =
    useState("");

  const [hospitalDate, setHospitalDate] =
    useState("");

  const [hospitalStay, setHospitalStay] =
    useState("");

  const [operations, setOperations] =
    useState("");

  const [transfusion, setTransfusion] =
    useState("No");

  const [transfusionReason, setTransfusionReason] =
    useState("");

  const [transfusionDate, setTransfusionDate] =
    useState("");

  const [transfusionReaction, setTransfusionReaction] =
    useState("");

  const [trauma, setTrauma] =
    useState("No");

  const [traumaType, setTraumaType] =
    useState("");

  const [traumaDate, setTraumaDate] =
    useState("");

  const [traumaComplications, setTraumaComplications] =
    useState("");

  const [icu, setIcu] =
    useState("No");

  const [icuReason, setIcuReason] =
    useState("");

  const [icuDate, setIcuDate] =
    useState("");

  const [icuDuration, setIcuDuration] =
    useState("");

  const [ventilator, setVentilator] =
    useState("");

  const diseases = [
    "Diabetes",
    "Hypertension",
    "IHD",
    "Heart Failure",
    "Asthma",
    "COPD",
    "CKD",
    "CLD",
    "Thyroid Disease",
    "Epilepsy",
    "Stroke",
    "Cancer",
  ];

  const toggleDisease = (disease: string) => {
    if (selectedDiseases.includes(disease)) {
      setSelectedDiseases(
        selectedDiseases.filter(
          (d) => d !== disease
        )
      );
    } else {
      setSelectedDiseases([
        ...selectedDiseases,
        disease,
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Chronic Diseases
      </Text>

      <View style={styles.row}>
        {diseases.map((disease) => (
          <AppChip
            key={disease}
            label={disease}
            selected={selectedDiseases.includes(disease)}
            onPress={() =>
              toggleDisease(disease)
            }
          />
        ))}
      </View>

      <AppTextField
  
        placeholder="Other chronic disease..."
        value={otherDisease}
        onChangeText={setOtherDisease}
      />

      <Text style={styles.sectionTitle}>
        Previous Similar Episode
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={similarEpisode === "Yes"}
          onPress={() =>
            setSimilarEpisode("Yes")
          }
        />

        <AppChip
          label="No"
          selected={similarEpisode === "No"}
          onPress={() =>
            setSimilarEpisode("No")
          }
        />
      </View>

      {similarEpisode === "Yes" && (
        <View style={styles.box}>
          <AppTextField
    
            placeholder="Frequency"
            value={episodeFrequency}
            onChangeText={setEpisodeFrequency}
          />

          <AppTextField
     
            placeholder="Last Episode"
            value={lastEpisode}
            onChangeText={setLastEpisode}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Previous Hospitalization
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={hospitalization === "Yes"}
          onPress={() =>
            setHospitalization("Yes")
          }
        />

        <AppChip
          label="No"
          selected={hospitalization === "No"}
          onPress={() =>
            setHospitalization("No")
          }
        />
      </View>

      {hospitalization === "Yes" && (
        <View style={styles.box}>
          <AppTextField

            placeholder="Reason"
            value={hospitalReason}
            onChangeText={setHospitalReason}
          />

          <AppTextField

            placeholder="Date"
            value={hospitalDate}
            onChangeText={setHospitalDate}
          />

          <AppTextField

            placeholder="Duration of Stay"
            value={hospitalStay}
            onChangeText={setHospitalStay}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Previous Operations
      </Text>

      <AppTextField

        placeholder="List previous operations..."
        value={operations}
        onChangeText={setOperations}
        multiline
      />
            <Text style={styles.sectionTitle}>
        Blood Transfusion
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={transfusion === "Yes"}
          onPress={() =>
            setTransfusion("Yes")
          }
        />

        <AppChip
          label="No"
          selected={transfusion === "No"}
          onPress={() =>
            setTransfusion("No")
          }
        />
      </View>

      {transfusion === "Yes" && (
        <View style={styles.box}>
          <AppTextField

            placeholder="Reason"
            value={transfusionReason}
            onChangeText={setTransfusionReason}
          />

          <AppTextField

            placeholder="When"
            value={transfusionDate}
            onChangeText={setTransfusionDate}
          />

          <AppTextField

            placeholder="Any transfusion reaction?"
            value={transfusionReaction}
            onChangeText={setTransfusionReaction}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Major Trauma
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={trauma === "Yes"}
          onPress={() => setTrauma("Yes")}
        />

        <AppChip
          label="No"
          selected={trauma === "No"}
          onPress={() => setTrauma("No")}
        />
      </View>

      {trauma === "Yes" && (
        <View style={styles.box}>
          <AppTextField

            placeholder="Type of trauma"
            value={traumaType}
            onChangeText={setTraumaType}
          />

          <AppTextField

            placeholder="When"
            value={traumaDate}
            onChangeText={setTraumaDate}
          />

          <AppTextField

            placeholder="Residual disability / complications"
            value={traumaComplications}
            onChangeText={setTraumaComplications}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>
        ICU Admission
      </Text>

      <View style={styles.row}>
        <AppChip
          label="Yes"
          selected={icu === "Yes"}
          onPress={() => setIcu("Yes")}
        />

        <AppChip
          label="No"
          selected={icu === "No"}
          onPress={() => setIcu("No")}
        />
      </View>

      {icu === "Yes" && (
        <View style={styles.box}>
          <AppTextField

            placeholder="Reason"
            value={icuReason}
            onChangeText={setIcuReason}
          />

          <AppTextField

            placeholder="When"
            value={icuDate}
            onChangeText={setIcuDate}
          />

          <AppTextField

            placeholder="Duration"
            value={icuDuration}
            onChangeText={setIcuDuration}
          />

          <AppTextField

            placeholder="Ventilator support?"
            value={ventilator}
            onChangeText={setVentilator}
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

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  box: {
    gap: SPACING.sm,
  },
});