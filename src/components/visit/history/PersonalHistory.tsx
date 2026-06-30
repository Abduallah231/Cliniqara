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

export default function PersonalHistory() {
  const [maritalStatus, setMaritalStatus] =
    useState("Single");

  const [informant, setInformant] =
    useState("Self");

  const [reliability, setReliability] =
    useState("Reliable");

  const [childrenCount, setChildrenCount] =
    useState("");

  const [smoking, setSmoking] =
    useState("Never");

  const [alcohol, setAlcohol] =
    useState("No");

  const [alcoholFrequency, setAlcoholFrequency] =
    useState("");

  const [exerciseFrequency, setExerciseFrequency] =
    useState("");

  const [habits, setHabits] = useState<string[]>([]);

  const toggleHabit = (habit: string) => {
    if (habits.includes(habit)) {
      setHabits(
        habits.filter((h) => h !== habit)
      );
    } else {
      setHabits([...habits, habit]);
    }
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Marital Status" />
      <View style={styles.row}>
        <AppChip
          label="Single"
          selected={maritalStatus === "Single"}
          onPress={() =>
            setMaritalStatus("Single")
          }
        />

        <AppChip
          label="Married"
          selected={maritalStatus === "Married"}
          onPress={() =>
            setMaritalStatus("Married")
          }
        />

        <AppChip
          label="Divorced"
          selected={
            maritalStatus === "Divorced"
          }
          onPress={() =>
            setMaritalStatus("Divorced")
          }
        />

        <AppChip
          label="Widowed"
          selected={
            maritalStatus === "Widowed"
          }
          onPress={() =>
            setMaritalStatus("Widowed")
          }
        />
      </View>

      {maritalStatus !== "Single" && (
        <AppTextField
        label="Number of Children"
          placeholder="Number of Children"
          value={childrenCount}
          onChangeText={setChildrenCount}
          keyboardType="numeric"
        />
      )}

      <Divider /><SectionHeader title="Informant" />
      <View style={styles.row}>
        <AppChip
          label="Self"
          selected={informant === "Self"}
          onPress={() => setInformant("Self")}
        />

        <AppChip
          label="Relative"
          selected={informant === "Relative"}
          onPress={() =>
            setInformant("Relative")
          }
        />

        <AppChip
          label="Caregiver"
          selected={
            informant === "Caregiver"
          }
          onPress={() =>
            setInformant("Caregiver")
          }
        />
      </View>

      <Divider /><SectionHeader title="Reliability" />
      <View style={styles.row}>
        <AppChip
          label="Reliable"
          selected={
            reliability === "Reliable"
          }
          onPress={() =>
            setReliability("Reliable")
          }
        />

        <AppChip
          label="Partial"
          selected={
            reliability === "Partial"
          }
          onPress={() =>
            setReliability("Partial")
          }
        />

        <AppChip
          label="Unreliable"
          selected={
            reliability === "Unreliable"
          }
          onPress={() =>
            setReliability("Unreliable")
          }
        />
      </View>
<Divider />
      <Text style={styles.sectionTitle}>
        Lifestyle & Habits
      </Text>

      <SectionHeader title="Smoking" />
      <View style={styles.row}>
        <AppChip
          label="Never"
          selected={smoking === "Never"}
          onPress={() => setSmoking("Never")}
        />

        <AppChip
          label="Current"
          selected={smoking === "Current"}
          onPress={() =>
            setSmoking("Current")
          }
        />

        <AppChip
          label="Former"
          selected={smoking === "Former"}
          onPress={() =>
            setSmoking("Former")
          }
        />
      </View>
            {smoking !== "Never" && (
        <View style={styles.box}>
          <AppTextField
        
            placeholder="Cigarettes Per Day"
            keyboardType="numeric"
          />

          <AppTextField
    
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

          {smoking === "Former" && (
            <AppTextField
          
              placeholder="Years Since Quitting"
              keyboardType="numeric"
            />
          )}
        </View>
      )}

      <Divider /><SectionHeader title="Alcohol" />
      <View style={styles.row}>
        <AppChip
          label="No"
          selected={alcohol === "No"}
          onPress={() => setAlcohol("No")}
        />

        <AppChip
          label="Current"
          selected={alcohol === "Current"}
          onPress={() =>
            setAlcohol("Current")
          }
        />

        <AppChip
          label="Former"
          selected={alcohol === "Former"}
          onPress={() =>
            setAlcohol("Former")
          }
        />
      </View>

      {alcohol !== "No" && (
        <View style={styles.box}>
          <text>How often</text>
          <View style={styles.row}>
            <AppChip
              label="Occasional"
              selected={
                alcoholFrequency ===
                "Occasional"
              }
              onPress={() =>
                setAlcoholFrequency(
                  "Occasional"
                )
              }
            />

            <AppChip
              label="Weekly"
              selected={
                alcoholFrequency ===
                "Weekly"
              }
              onPress={() =>
                setAlcoholFrequency(
                  "Weekly"
                )
              }
            />

            <AppChip
              label="Daily"
              selected={
                alcoholFrequency ===
                "Daily"
              }
              onPress={() =>
                setAlcoholFrequency("Daily")
              }
            />
          </View>

          {alcohol === "Former" && (
            <AppTextField
       
              placeholder="Years Since Stopping"
              keyboardType="numeric"
            />
          )}
        </View>
      )}

      <Divider /><SectionHeader title="Special Habits" />
      <View style={styles.row}>
        <AppChip
          label="Caffeine"
          selected={habits.includes("Caffeine")}
          onPress={() =>
            toggleHabit("Caffeine")
          }
        />

        <AppChip
          label="Drug Use"
          selected={habits.includes("Drug Use")}
          onPress={() =>
            toggleHabit("Drug Use")
          }
        />

        <AppChip
          label="Exercise"
          selected={habits.includes("Exercise")}
          onPress={() =>
            toggleHabit("Exercise")
          }
        />

        <AppChip
          label="Sleep Disturbance"
          selected={habits.includes(
            "Sleep Disturbance"
          )}
          onPress={() =>
            toggleHabit(
              "Sleep Disturbance"
            )
          }
        />

        <AppChip
          label="Other"
          selected={habits.includes("Other")}
          onPress={() =>
            toggleHabit("Other")
          }
        />
      </View>
            <View style={styles.box}>
        {habits.includes("Caffeine") && (
          <AppTextField
        
            placeholder="Cups Per Day"
          />
        )}

        {habits.includes("Drug Use") && (
          <AppTextField
      
            placeholder="Type of Drug"
          />
        )}

        {habits.includes("Exercise") && (
          <View style={styles.row}>
            <AppChip
              label="Rarely"
              selected={
                exerciseFrequency === "Rarely"
              }
              onPress={() =>
                setExerciseFrequency("Rarely")
              }
            />

            <AppChip
              label="Weekly"
              selected={
                exerciseFrequency === "Weekly"
              }
              onPress={() =>
                setExerciseFrequency("Weekly")
              }
            />

            <AppChip
              label="Regularly"
              selected={
                exerciseFrequency ===
                "Regularly"
              }
              onPress={() =>
                setExerciseFrequency(
                  "Regularly"
                )
              }
            />
          </View>
        )}

        {habits.includes(
          "Sleep Disturbance"
        ) && (
          <AppTextField
         
            placeholder="Sleep Notes"
          />
        )}

        {habits.includes("Other") && (
          <AppTextField
      
            placeholder="Other Habit Description"
          />
        )}
      </View>
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
    fontSize: TYPOGRAPHY.body,
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