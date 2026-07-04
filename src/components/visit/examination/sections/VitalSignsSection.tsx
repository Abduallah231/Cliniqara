import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function VitalSignsSection() {
  const [pulseRhythm, setPulseRhythm] =
    useState("Regular");

  const [temperatureRoute, setTemperatureRoute] =
    useState("Oral");

  const [oxygenSource, setOxygenSource] =
    useState("Room Air");

  const [systolicBP, setSystolicBP] = useState("");
  const [diastolicBP, setDiastolicBP] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temperature, setTemperature] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  return (
    <View style={styles.container}>
      <CollapsibleSection
  title="Vital Signs"
  icon={
    <Ionicons
      name="pulse-outline"
      size={20}
      color={COLORS.primary}
    />
  }
  defaultExpanded
>
        <Text style={styles.sectionTitle}>
          Blood Pressure
        </Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <AppTextField
              
              value={systolicBP}
              onChangeText={setSystolicBP}
              keyboardType="numeric"
              placeholder="Systolic"
            />
          </View>

          <View style={styles.half}>
            <AppTextField
              
              value={diastolicBP}
              onChangeText={setDiastolicBP}
              keyboardType="numeric"
              placeholder="Diastolic"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <AppTextField
              label="Heart Rate"
              value={heartRate}
              onChangeText={setHeartRate}
              keyboardType="numeric"
              placeholder="bpm"
            />

            <View style={styles.chipRow}>
              <AppChip
                label="Regular"
                selected={
                  pulseRhythm ===
                  "Regular"
                }
                onPress={() =>
                  setPulseRhythm(
                    "Regular"
                  )
                }
              />

              <AppChip
                label="Irregular"
                selected={
                  pulseRhythm ===
                  "Irregular"
                }
                onPress={() =>
                  setPulseRhythm(
                    "Irregular"
                  )
                }
              />
            </View>
          </View>

          <View style={styles.half}>
            <AppTextField
              label="SpO₂"
              value={spo2}
              onChangeText={setSpo2}
              keyboardType="numeric"
              placeholder="%"
            />

            <View style={styles.chipRow}>
              <AppChip
                label="Room Air"
                selected={
                  oxygenSource ===
                  "Room Air"
                }
                onPress={() =>
                  setOxygenSource(
                    "Room Air"
                  )
                }
              />

              <AppChip
                label="Oxygen"
                selected={
                  oxygenSource ===
                  "Oxygen"
                }
                onPress={() =>
                  setOxygenSource(
                    "Oxygen"
                  )
                }
              />
            </View>
          </View>
        </View>
                <AppTextField
          label="Temperature"
          value={temperature}
          onChangeText={setTemperature}
          keyboardType="numeric"
          placeholder="°C"
        />

        <View style={styles.chipRow}>
          {[
            "Oral",
            "Axillary",
            "Tympanic",
            "Rectal",
          ].map((item) => (
            <AppChip
              key={item}
              label={item}
              selected={
                temperatureRoute === item
              }
              onPress={() =>
                setTemperatureRoute(item)
              }
            />
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <AppTextField
              label="Respiratory Rate"
              value={respiratoryRate}
              onChangeText={setRespiratoryRate      }
              keyboardType="numeric"
              placeholder="breaths/min"
            />
          </View>

          <View style={styles.half}>
            <AppTextField
              label="Blood Glucose"
              value={bloodGlucose}
              onChangeText={setBloodGlucose}
              keyboardType="numeric"
              placeholder="mg/dL"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <AppTextField
              label="Weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="kg"
            />
          </View>

          <View style={styles.half}>
            <AppTextField
              label="Height"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="cm"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          BMI
        </Text>

        <View style={styles.bmiBox}>
          <Text style={styles.bmiText}>
            BMI will be calculated
            automatically
          </Text>
        </View>
      </CollapsibleSection>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  row: {
    flexDirection: "row",
    gap: SPACING.md,
    alignItems: "flex-start",
  },

  half: {
    flex: 1,
    marginTop: SPACING.sm,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },

  bmiBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },

  bmiText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    textAlign: "center",
  },
});