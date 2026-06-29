import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function PainAnalysis() {
  const [location, setLocation] =
    useState("");

  const [radiation, setRadiation] =
    useState("");

  const [otherCharacter, setOtherCharacter] =
    useState("");

  const [otherTiming, setOtherTiming] =
    useState("");

  const [severity, setSeverity] =
    useState<number | null>(null);

  const [character, setCharacter] =
    useState<string[]>([]);

  const [timing, setTiming] =
    useState<string[]>([]);

  const [postural, setPostural] =
    useState<string[]>([]);

  const [diurnal, setDiurnal] =
    useState<string[]>([]);

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    if (list.includes(value)) {
      setList(
        list.filter((x) => x !== value)
      );
    } else {
      setList([...list, value]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pain Analysis
      </Text>

      <AppTextField
        label="Location"
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <AppTextField
        label="Radiation"
        placeholder="Radiation"
        value={radiation}
        onChangeText={setRadiation}
      />

      <Text style={styles.sectionTitle}>
        Character
      </Text>

      <View style={styles.row}>
        {[
          "Sharp",
          "Dull",
          "Burning",
          "Colicky",
          "Throbbing",
          "Stabbing",
          "Cramping",
          "Aching",
          "Pressure",
          "Heavy",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={character.includes(item)}
            onPress={() =>
              toggle(
                item,
                character,
                setCharacter
              )
            }
          />
        ))}
      </View>

      {character.includes("Other") && (
        <AppTextField

          placeholder="Specify"
          value={otherCharacter}
          onChangeText={setOtherCharacter}
        />
      )}
            <Text style={styles.sectionTitle}>
        Severity
      </Text>

      <View style={styles.row}>
        {Array.from(
          { length: 10 },
          (_, i) => i + 1
        ).map((num) => (
          <AppChip
            key={num}
            label={String(num)}
            selected={severity === num}
            onPress={() =>
              setSeverity(num)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Timing
      </Text>

      <View style={styles.row}>
        {[
          "Continuous",
          "Intermittent",
          "Colicky",
          "Episodic",
          "Progressive",
          "Sudden Attacks",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={timing.includes(item)}
            onPress={() =>
              toggle(
                item,
                timing,
                setTiming
              )
            }
          />
        ))}
      </View>

      {timing.includes("Other") && (
        <AppTextField
          placeholder="Specify"
          value={otherTiming}
          onChangeText={setOtherTiming}
        />
      )}

      <Text style={styles.sectionTitle}>
        Postural
      </Text>

      <View style={styles.row}>
        {[
          "Worse Standing",
          "Worse Sitting",
          "Worse Lying",
          "Worse Bending",
          "Worse Walking",
          "Relieved By Rest",
          "Relieved By Position",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={postural.includes(item)}
            onPress={() =>
              toggle(
                item,
                postural,
                setPostural
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Diurnal
      </Text>

      <View style={styles.row}>
        {[
          "Morning",
          "Afternoon",
          "Evening",
          "Night",
          "Nocturnal",
          "Seasonal",
          "No Variation",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={diurnal.includes(item)}
            onPress={() =>
              toggle(
                item,
                diurnal,
                setDiurnal
              )
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,

    padding: SPACING.md,

    borderRadius: 16,

    backgroundColor: COLORS.card,
  },

  title: {
    fontSize: TYPOGRAPHY.body,

    fontWeight: "700",

    color: COLORS.text,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.small,

    fontWeight: "600",

    color: COLORS.text,
  },

  row: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: SPACING.xs,
  },
});