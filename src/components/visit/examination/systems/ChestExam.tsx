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

export default function ChestExam() {
  const [neckFindings, setNeckFindings] =
    useState<string[]>(["NAD"]);

  const [
    inspectionFindings,
    setInspectionFindings,
  ] = useState<string[]>(["NAD"]);

  const [
    palpationFindings,
    setPalpationFindings,
  ] = useState<string[]>(["NAD"]);

  const [
    percussionFindings,
    setPercussionFindings,
  ] = useState<string[]>(["NAD"]);

  const [
    auscultationFindings,
    setAuscultationFindings,
  ] = useState<string[]>(["NAD"]);

  const [dullnessLocation, setDullnessLocation] =
    useState<string[]>([]);

  const [expansionSide, setExpansionSide] =
    useState("");

  const [
    reducedAirEntrySide,
    setReducedAirEntrySide,
  ] = useState("");

  const [cracklesType, setCracklesType] =
    useState("");

  const [
    cracklesLocation,
    setCracklesLocation,
  ] = useState<string[]>([]);

  const [wheezeType, setWheezeType] =
    useState("");

  const [
    wheezeDistribution,
    setWheezeDistribution,
  ] = useState("");

  const [
    bronchialLocation,
    setBronchialLocation,
  ] = useState<string[]>([]);

  const [otherFindings, setOtherFindings] =
    useState("");

  const toggleFinding = (
    item: string,
    selected: string[],
    setSelected: (
      value: string[]
    ) => void,
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

    if (!updated.length) {
      updated = [normal];
    }

    setSelected(updated);
  };

  const toggleMulti = (
    item: string,
    selected: string[],
    setSelected: (
      value: string[]
    ) => void
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
    setSelected: (
      value: string[]
    ) => void;
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

  const Title = ({
    children,
  }: {
    children: string;
  }) => (
    <Text style={styles.sectionTitle}>
      {children}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Title>Neck</Title>

      <ChipGroup
        items={[
          "NAD",
          "Trachea Deviated",
          "Lymphadenopathy",
        ]}
        selected={neckFindings}
        setSelected={setNeckFindings}
      />

      <Title>Inspection</Title>

      <ChipGroup
        items={[
          "NAD",
          "Barrel Chest",
          "Funnel Chest",
          "Pigeon Chest",
          "Chest Retraction",
          "Chest Bulge",
          "Scar",
          "Visible Pulsation",
          "Accessory Muscle Use",
        ]}
        selected={inspectionFindings}
        setSelected={setInspectionFindings}
      />
            <Title>Palpation</Title>

      <ChipGroup
        items={[
          "NAD",
          "Reduced Expansion",
          "Tenderness",
          "Increased Fremitus",
          "Decreased Fremitus",
        ]}
        selected={palpationFindings}
        setSelected={setPalpationFindings}
      />

      {palpationFindings.includes(
        "Reduced Expansion"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Expansion Side
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Bilateral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  expansionSide === item
                }
                onPress={() =>
                  setExpansionSide(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      <Title>Percussion</Title>

      <ChipGroup
        items={[
          "NAD",
          "Dull",
          "Hyperresonant",
        ]}
        selected={percussionFindings}
        setSelected={setPercussionFindings}
      />

      {percussionFindings.includes(
        "Dull"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Dullness Location
          </Text>

          <View style={styles.row}>
            {[
              "Right Upper",
              "Right Middle",
              "Right Lower",
              "Left Upper",
              "Left Middle",
              "Left Lower",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={dullnessLocation.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    dullnessLocation,
                    setDullnessLocation
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Title>Auscultation</Title>

      <ChipGroup
        items={[
          "NAD",
          "Reduced Air Entry",
          "Crackles",
          "Wheeze",
          "Pleural Rub",
          "Bronchial Breathing",
        ]}
        selected={auscultationFindings}
        setSelected={setAuscultationFindings}
      />

      {auscultationFindings.includes(
        "Reduced Air Entry"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Side
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Bilateral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  reducedAirEntrySide ===
                  item
                }
                onPress={() =>
                  setReducedAirEntrySide(
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      {auscultationFindings.includes(
        "Crackles"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Crackles Type
          </Text>

          <View style={styles.row}>
            {["Fine", "Coarse"].map(
              (item) => (
                <AppChip
                  key={item}
                  label={item}
                  selected={
                    cracklesType === item
                  }
                  onPress={() =>
                    setCracklesType(item)
                  }
                />
              )
            )}
          </View>

          <Text style={styles.label}>
            Location
          </Text>

          <View style={styles.row}>
            {[
              "Right Upper",
              "Right Middle",
              "Right Lower",
              "Left Upper",
              "Left Middle",
              "Left Lower",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={cracklesLocation.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    cracklesLocation,
                    setCracklesLocation
                  )
                }
              />
            ))}
          </View>
        </View>
            )}
            {auscultationFindings.includes("Wheeze") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Wheeze Type
          </Text>

          <View style={styles.row}>
            {[
              "Inspiratory",
              "Expiratory",
              "Biphasic",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  wheezeType === item
                }
                onPress={() =>
                  setWheezeType(item)
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Distribution
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Bilateral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  wheezeDistribution ===
                  item
                }
                onPress={() =>
                  setWheezeDistribution(
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      {auscultationFindings.includes(
        "Bronchial Breathing"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Location
          </Text>

          <View style={styles.row}>
            {[
              "Right Upper",
              "Right Middle",
              "Right Lower",
              "Left Upper",
              "Left Middle",
              "Left Lower",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={bronchialLocation.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    bronchialLocation,
                    setBronchialLocation
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      

      <AppTextField
        placeholder="Add other findings..."
        value={otherFindings}
        onChangeText={
          setOtherFindings
        }
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