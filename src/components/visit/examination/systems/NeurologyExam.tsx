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

export default function NeurologyExam() {
  const [mentalStatus, setMentalStatus] =
    useState("Normal");

  const [cranialFindings, setCranialFindings] =
    useState<string[]>(["NAD"]);

  const [motorFindings, setMotorFindings] =
    useState<string[]>(["NAD"]);

  const [sensoryFindings, setSensoryFindings] =
    useState<string[]>(["NAD"]);

  const [reflexes, setReflexes] =
    useState("Normal");

  const [coordination, setCoordination] =
    useState("Normal");

  const [gait, setGait] =
    useState("Normal");

  const [weaknessLocations, setWeaknessLocations] =
    useState<string[]>([]);

  const [powerGrade, setPowerGrade] =
    useState("");

  const [tremorType, setTremorType] =
    useState("");

  const [sensoryDistribution, setSensoryDistribution] =
    useState<string[]>([]);

  const [otherFindings, setOtherFindings] =
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
        Mental Status
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Confused",
          "Disoriented",
          "Memory Impairment",
          "Speech Difficulty",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={mentalStatus === item}
            onPress={() =>
              setMentalStatus(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Cranial Nerves
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "Visual Defect",
          "Diplopia",
          "Facial Weakness",
          "Hearing Loss",
          "Dysarthria",
          "Dysphagia",
        ]}
        selected={cranialFindings}
        setSelected={setCranialFindings}
      />
            <Text style={styles.sectionTitle}>
        Motor Examination
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "Weakness",
          "Spasticity",
          "Rigidity",
          "Hypotonia",
          "Tremor",
          "Fasciculation",
        ]}
        selected={motorFindings}
        setSelected={setMotorFindings}
      />

      {motorFindings.includes("Weakness") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Weakness Location
          </Text>

          <View style={styles.row}>
            {[
              "Right Upper Limb",
              "Left Upper Limb",
              "Right Lower Limb",
              "Left Lower Limb",
              "Hemiparesis",
              "Quadriparesis",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={weaknessLocations.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    weaknessLocations,
                    setWeaknessLocations
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Power Grade
          </Text>

          <View style={styles.row}>
            {["0", "1", "2", "3", "4", "5"].map(
              (item) => (
                <AppChip
                  key={item}
                  label={item}
                  selected={powerGrade === item}
                  onPress={() =>
                    setPowerGrade(item)
                  }
                />
              )
            )}
          </View>
        </View>
      )}

      {motorFindings.includes("Tremor") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Tremor Type
          </Text>

          <View style={styles.row}>
            {[
              "Resting",
              "Postural",
              "Intention",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  tremorType === item
                }
                onPress={() =>
                  setTremorType(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Sensory Examination
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "Pain Loss",
          "Temperature Loss",
          "Light Touch Loss",
          "Vibration Loss",
          "Joint Position Loss",
        ]}
        selected={sensoryFindings}
        setSelected={setSensoryFindings}
      />

      {(sensoryFindings.length > 1 ||
        !sensoryFindings.includes(
          "NAD"
        )) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Distribution
          </Text>

          <View style={styles.row}>
            {[
              "Dermatomal",
              "Peripheral Nerve",
              "Glove & Stocking",
              "Hemisensory",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={sensoryDistribution.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    sensoryDistribution,
                    setSensoryDistribution
                  )
                }
              />
            ))}
          </View>
        </View>
      )}
            <Text style={styles.sectionTitle}>
        Reflexes
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Hyperreflexia",
          "Hyporeflexia",
          "Areflexia",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={reflexes === item}
            onPress={() =>
              setReflexes(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Coordination
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Dysmetria",
          "Past Pointing",
          "Intention Tremor",
          "Dysdiadochokinesia",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={coordination === item}
            onPress={() =>
              setCoordination(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Gait
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Hemiplegic",
          "Spastic",
          "Ataxic",
          "Parkinsonian",
          "High Stepping",
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