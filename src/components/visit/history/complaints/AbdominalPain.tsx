import { visitStyles as styles } from "@/theme/visitStyles";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
export default function AbdominalPain() {
  const [location, setLocation] = useState("");

  const [character, setCharacter] = useState<string[]>([]);
  const [associated, setAssociated] = useState<string[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [pmh, setPmh] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);

  const [radiation, setRadiation] = useState("");

  const toggleMulti = (
    value: string,
    list: string[],
    setList: (value: string[]) => void
  ) => {
    if (list.includes(value)) {
      setList(list.filter((x) => x !== value));
    } else {
      setList([...list, value]);
    }
  };

  const Chip = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.selectedChip,
      ]}
    >
      <Text
        style={
          selected
            ? styles.selectedChipText
            : styles.chipText
        }
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Abdominal Pain
      </Text>

      {/* Location */}

      <Text style={styles.sectionTitle}>
        Location
      </Text>

      <View style={styles.row}>
        {[
          "Epigastric",
          "RUQ",
          "LUQ",
          "RLQ",
          "LLQ",
          "Suprapubic",
          "Flank",
          "Diffuse",
        ].map((item) => (
          <Chip
            key={item}
            label={item}
            selected={location === item}
            onPress={() =>
              setLocation(
                location === item
                  ? ""
                  : item
              )
            }
          />
        ))}
      </View>

      {/* Character */}

      <Text style={styles.sectionTitle}>
        Character
      </Text>

      <View style={styles.row}>
        {[
          "Burning",
          "Colicky",
          "Sharp",
          "Dull Ache",
        ].map((item) => (
          <Chip
            key={item}
            label={item}
            selected={character.includes(
              item
            )}
            onPress={() =>
              toggleMulti(
                item,
                character,
                setCharacter
              )
            }
          />
        ))}
      </View>

      {/* Radiation */}

      <Text style={styles.sectionTitle}>
        Radiation
      </Text>

      <View style={styles.row}>
        {[
          "Back",
          "Right Shoulder",
          "Groin",
          "No Radiation",
        ].map((item) => (
          <Chip
            key={item}
            label={item}
            selected={
              radiation === item
            }
            onPress={() =>
              setRadiation(
                radiation === item
                  ? ""
                  : item
              )
            }
          />
        ))}
      </View>

      {/* Associated Symptoms */}

      <Text style={styles.sectionTitle}>
        Associated Symptoms
      </Text>

      <View style={styles.row}>
        {[
          "Nausea/Vomiting",
          "Diarrhea",
          "Constipation",
          "Fever",
          "Jaundice",
          "Weight Loss",
          "GI Bleeding",
          "Urinary Symptoms",
          "Gynecological Symptoms",
        ].map((item) => (
          <Chip
            key={item}
            label={item}
            selected={associated.includes(
              item
            )}
            onPress={() =>
              toggleMulti(
                item,
                associated,
                setAssociated
              )
            }
          />
        ))}
      </View>

      {/* Red Flags */}

      <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <View style={styles.row}>
        {[
          "GI Bleeding",
          "Persistent Vomiting",
          "Weight Loss",
          "Jaundice",
          "Shock",
          "Syncope",
        ].map((item) => (
          <Chip
            key={item}
            label={item}
            selected={redFlags.includes(
              item
            )}
            onPress={() =>
              toggleMulti(
                item,
                redFlags,
                setRedFlags
              )
            }
          />
        ))}
      </View>

      {/* PMH */}

      <Text style={styles.sectionTitle}>
        Relevant Past Medical History
      </Text>

      <View style={styles.row}>
        {[
          "Gallstones",
          "Peptic Ulcer Disease",
          "Kidney Stones",
          "IBS",
          "IBD",
          "Previous Abdominal Surgery",
        ].map((item) => (
          <Chip
            key={item}
            label={item}
            selected={pmh.includes(
              item
            )}
            onPress={() =>
              toggleMulti(
                item,
                pmh,
                setPmh
              )
            }
          />
        ))}
      </View>

      {/* Medication History */}

      <Text style={styles.sectionTitle}>
        Relevant Medication History
      </Text>

      <View style={styles.row}>
        {[
          "NSAIDs",
          "Recent Antibiotics",
        ].map((item) => (
          <Chip
            key={item}
            label={item}
            selected={medications.includes(
              item
            )}
            onPress={() =>
              toggleMulti(
                item,
                medications,
                setMedications
              )
            }
          />
        ))}
      </View>

      <TextInput
        placeholder="Other relevant medications..."
        style={styles.input}
      />
    </ScrollView>
  );
}

