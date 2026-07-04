import AppChip from "@/components/common/AppChip";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function GeneralInspectionSection() {
  const [consciousness, setConsciousness] =
    useState("Conscious");

  const [appearance, setAppearance] =
    useState("Normal");

  const [hydration, setHydration] =
    useState("Normal");

  const [bodyBuild, setBodyBuild] =
    useState("Average");

  const [nourishment, setNourishment] =
    useState("Well Nourished");

  const [findings, setFindings] =
    useState<string[]>([]);

  const [edemaLocations, setEdemaLocations] =
    useState<string[]>([]);

  const toggleFinding = (
    item: string
  ) => {
    setFindings((prev) =>
      prev.includes(item)
        ? prev.filter((x) => x !== item)
        : [...prev, item]
    );
  };

  const toggleEdemaLocation = (
    item: string
  ) => {
    setEdemaLocations((prev) =>
      prev.includes(item)
        ? prev.filter((x) => x !== item)
        : [...prev, item]
    );
  };

  return (
    <View style={styles.container}>
      <CollapsibleSection
  title="General Inspection"
  icon={
    <Ionicons
      name="eye-outline"
      size={20}
      color={COLORS.primary}
    />
  }
  defaultExpanded={false}
>
        <SectionHeader title="Consciousness" />
        <View style={styles.row}>
          <AppChip
            label="Conscious"
            selected={
              consciousness ===
              "Conscious"
            }
            onPress={() =>
              setConsciousness(
                "Conscious"
              )
            }
          />

          <AppChip
            label="Drowsy"
            selected={
              consciousness ===
              "Drowsy"
            }
            onPress={() =>
              setConsciousness(
                "Drowsy"
              )
            }
          />

          <AppChip
            label="Confused"
            selected={
              consciousness ===
              "Confused"
            }
            onPress={() =>
              setConsciousness(
                "Confused"
              )
            }
          />

          <AppChip
            label="Comatose"
            selected={
              consciousness ===
              "Comatose"
            }
            onPress={() =>
              setConsciousness(
                "Comatose"
              )
            }
          />
        </View>
<Divider />
        <SectionHeader title="Appearance" />
        <View style={styles.row}>
          <AppChip
            label="Normal"
            selected={
              appearance ===
              "Normal"
            }
            onPress={() =>
              setAppearance(
                "Normal"
              )
            }
          />

          <AppChip
            label="Ill"
            selected={
              appearance === "Ill"
            }
            onPress={() =>
              setAppearance("Ill")
            }
          />

          <AppChip
            label="Toxic"
            selected={
              appearance ===
              "Toxic"
            }
            onPress={() =>
              setAppearance(
                "Toxic"
              )
            }
          />

          <AppChip
            label="Distressed"
            selected={
              appearance ===
              "Distressed"
            }
            onPress={() =>
              setAppearance(
                "Distressed"
              )
            }
          />
        </View>

        <Divider /><SectionHeader title="Hydration" />
        <View style={styles.row}>
          <AppChip
            label="Normal"
            selected={
              hydration ===
              "Normal"
            }
            onPress={() =>
              setHydration(
                "Normal"
              )
            }
          />

          <AppChip
            label="Mild"
            selected={
              hydration ===
              "Mild"
            }
            onPress={() =>
              setHydration(
                "Mild"
              )
            }
          />

          <AppChip
            label="Moderate"
            selected={
              hydration ===
              "Moderate"
            }
            onPress={() =>
              setHydration(
                "Moderate"
              )
            }
          />

          <AppChip
            label="Severe"
            selected={
              hydration ===
              "Severe"
            }
            onPress={() =>
              setHydration(
                "Severe"
              )
            }
          />
        </View>
    <Divider /><SectionHeader title="Body Build" />
        <View style={styles.row}>
          <AppChip
            label="Average"
            selected={
              bodyBuild ===
              "Average"
            }
            onPress={() =>
              setBodyBuild(
                "Average"
              )
            }
          />

          <AppChip
            label="Thin"
            selected={
              bodyBuild ===
              "Thin"
            }
            onPress={() =>
              setBodyBuild(
                "Thin"
              )
            }
          />

          <AppChip
            label="Obese"
            selected={
              bodyBuild ===
              "Obese"
            }
            onPress={() =>
              setBodyBuild(
                "Obese"
              )
            }
          />

          <AppChip
            label="Athletic"
            selected={
              bodyBuild ===
              "Athletic"
            }
            onPress={() =>
              setBodyBuild(
                "Athletic"
              )
            }
          />
        </View>

        <Divider /><SectionHeader title="Nourishment" />
        <View style={styles.row}>
          <AppChip
            label="Well Nourished"
            selected={
              nourishment ===
              "Well Nourished"
            }
            onPress={() =>
              setNourishment(
                "Well Nourished"
              )
            }
          />

          <AppChip
            label="Malnourished"
            selected={
              nourishment ===
              "Malnourished"
            }
            onPress={() =>
              setNourishment(
                "Malnourished"
              )
            }
          />
        </View>

        <Divider /><SectionHeader title="Findings" />
        <View style={styles.row}>
          {[
            "Pallor",
            "Jaundice",
            "Cyanosis",
            "Edema",
            "Clubbing",
            "Lymphadenopathy",
          ].map((item) => (
            <AppChip
              key={item}
              label={item}
              selected={findings.includes(
                item
              )}
              onPress={() =>
                toggleFinding(item)
              }
            />
          ))}
        </View>

        {findings.includes("Edema") && (
          <View style={styles.box}>
            <Text
              style={styles.sectionTitle}
            >
              Edema Location
            </Text>

            <View style={styles.row}>
              {[
                "Periorbital",
                "Upper Limb",
                "Lower Limb",
                "Sacral",
                "Generalized",
              ].map((item) => (
                <AppChip
                  key={item}
                  label={item}
                  selected={edemaLocations.includes(
                    item
                  )}
                  onPress={() =>
                    toggleEdemaLocation(
                      item
                    )
                  }
                />
              ))}
            </View>
          </View>
        )}
      </CollapsibleSection>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    
  },

  label: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  sectionTitle: {
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

  box: {
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },
});
