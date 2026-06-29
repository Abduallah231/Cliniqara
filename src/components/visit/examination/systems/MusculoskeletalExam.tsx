import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function MusculoskeletalExam() {
  const [generalFindings, setGeneralFindings] =
    useState<string[]>(["NAD"]);

  const [jointFindings, setJointFindings] =
    useState<string[]>(["Normal"]);

  const [muscleFindings, setMuscleFindings] =
    useState<string[]>(["Normal"]);

  const [gait, setGait] =
    useState("Normal");

  const [redFlags, setRedFlags] =
    useState<string[]>(["None"]);

  const [otherFindings, setOtherFindings] =
    useState("");

  const [painSites, setPainSites] =
    useState<string[]>([]);

  const [painSeverity, setPainSeverity] =
    useState("");

  const [swellingSites, setSwellingSites] =
    useState<string[]>([]);

  const [swellingType, setSwellingType] =
    useState("");

  const [stiffnessDuration, setStiffnessDuration] =
    useState("");

  const [limitedRomJoints, setLimitedRomJoints] =
    useState<string[]>([]);

  const [jointPattern, setJointPattern] =
    useState("");

  const [weaknessLocation, setWeaknessLocation] =
    useState("");

  const [powerGrade, setPowerGrade] =
    useState("");

  const toggleFinding = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<
      React.SetStateAction<string[]>
    >,
    normal = "NAD"
  ) => {
    if (item === normal) {
      setSelected([normal]);
      return;
    }

    let updated = selected.filter(
      (x) => x !== normal
    );

    if (updated.includes(item)) {
      updated = updated.filter(
        (x) => x !== item
      );
    } else {
      updated.push(item);
    }

    if (!updated.length)
      updated = [normal];

    setSelected(updated);
  };

  const toggleMulti = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => {
    if (selected.includes(item)) {
      setSelected(
        selected.filter(
          (x) => x !== item
        )
      );
    } else {
      setSelected([
        ...selected,
        item,
      ]);
    }
  };

  const ChipGroup = ({
    items,
    selected,
    setSelected,
    normal = "NAD",
  }: {
    items: string[];
    selected: string[];
    setSelected: React.Dispatch<
      React.SetStateAction<string[]>
    >;
    normal?: string;
  }) => (
    <View style={styles.row}>
      {items.map((item) => (
        <AppChip
          key={item}
          label={item}
          selected={selected.includes(item)}
          onPress={() =>
            toggleFinding(
              item,
              selected,
              setSelected,
              normal
            )
          }
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        General
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "Pain",
          "Swelling",
          "Deformity",
          "Stiffness",
          "Limited ROM",
        ]}
        selected={generalFindings}
        setSelected={setGeneralFindings}
      />

      {generalFindings.includes("Pain") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Pain Site
          </Text>

          <View style={styles.row}>
            {[
              "Neck",
              "Shoulder",
              "Elbow",
              "Wrist",
              "Hand",
              "Back",
              "Hip",
              "Knee",
              "Ankle",
              "Foot",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={painSites.includes(item)}
                onPress={() =>
                  toggleMulti(
                    item,
                    painSites,
                    setPainSites
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Severity
          </Text>

          <View style={styles.row}>
            {[
              "Mild",
              "Moderate",
              "Severe",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  painSeverity === item
                }
                onPress={() =>
                  setPainSeverity(item)
                }
              />
            ))}
          </View>
        </View>
      )}
            {generalFindings.includes(
        "Swelling"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Swelling Site
          </Text>

          <View style={styles.row}>
            {[
              "Shoulder",
              "Elbow",
              "Wrist",
              "Hand",
              "Hip",
              "Knee",
              "Ankle",
              "Foot",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={swellingSites.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    swellingSites,
                    setSwellingSites
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Swelling Type
          </Text>

          <View style={styles.row}>
            {[
              "Soft",
              "Firm",
              "Fluctuant",
              "Bony",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  swellingType === item
                }
                onPress={() =>
                  setSwellingType(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      {generalFindings.includes(
        "Stiffness"
      ) && (
        <AppTextField
          label="Morning Stiffness"
          value={stiffnessDuration}
          onChangeText={
            setStiffnessDuration
          }
          placeholder="Duration in minutes"
        />
      )}

      {generalFindings.includes(
        "Limited ROM"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Affected Joints
          </Text>

          <View style={styles.row}>
            {[
              "Shoulder",
              "Elbow",
              "Wrist",
              "Hip",
              "Knee",
              "Ankle",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={limitedRomJoints.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    limitedRomJoints,
                    setLimitedRomJoints
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Joint Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Tenderness",
          "Warmth",
          "Crepitus",
          "Instability",
          "Effusion",
        ]}
        selected={jointFindings}
        setSelected={setJointFindings}
        normal="Normal"
      />

      <Text style={styles.label}>
        Pattern
      </Text>

      <View style={styles.row}>
        {[
          "Monoarticular",
          "Oligoarticular",
          "Polyarticular",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              jointPattern === item
            }
            onPress={() =>
              setJointPattern(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Muscle Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Weakness",
          "Wasting",
          "Hypertrophy",
          "Tenderness",
        ]}
        selected={muscleFindings}
        setSelected={setMuscleFindings}
        normal="Normal"
      />

      {muscleFindings.includes(
        "Weakness"
      ) && (
        <View style={styles.group}>
          <AppTextField
            label="Weakness Location"
            value={weaknessLocation}
            onChangeText={
              setWeaknessLocation
            }
            placeholder="Affected muscles"
          />

          <Text style={styles.label}>
            Power
          </Text>

          <View style={styles.row}>
            {[
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  powerGrade === item
                }
                onPress={() =>
                  setPowerGrade(item)
                }
              />
            ))}
          </View>
        </View>
      )}
            <Text style={styles.sectionTitle}>
        Gait
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Antalgic",
          "Trendelenburg",
          "Spastic",
          "Ataxic",
          "Unable To Walk",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={gait === item}
            onPress={() =>
              setGait(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <ChipGroup
        items={[
          "None",
          "Hot Swollen Joint",
          "Open Fracture",
          "Compartment Syndrome",
          "Neurovascular Deficit",
          "Cauda Equina",
        ]}
        selected={redFlags}
        setSelected={setRedFlags}
        normal="None"
      />

      <AppTextField
        value={otherFindings}
        onChangeText={setOtherFindings}
        placeholder="Add other findings..."
        multiline
      />
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
  },

  label: {
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

  group: {
    gap: SPACING.sm,
  },
});