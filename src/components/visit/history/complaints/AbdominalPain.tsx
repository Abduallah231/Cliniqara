import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
const LOCATION_OPTIONS = [
  "Epigastric",
  "RUQ",
  "LUQ",
  "RLQ",
  "LLQ",
  "Suprapubic",
  "Flank",
  "Diffuse",
];

const CHARACTER_OPTIONS = [
  "Burning",
  "Colicky",
  "Sharp",
  "Dull Ache",
];

const RADIATION_OPTIONS = [
  "Back",
  "Right Shoulder",
  "Groin",
  "No Radiation",
];

const ASSOCIATED_OPTIONS = [
  "Nausea / Vomiting",
  "Diarrhea",
  "Constipation",
  "Fever",
  "Jaundice",
  "Weight Loss",
  "GI Bleeding",
  "Urinary Symptoms",
  "Gynecological Symptoms",
];

const RED_FLAG_OPTIONS = [
  "GI Bleeding",
  "Persistent Vomiting",
  "Weight Loss",
  "Jaundice",
  "Shock",
  "Syncope",
];

const PMH_OPTIONS = [
  "Gallstones",
  "Peptic Ulcer Disease",
  "Kidney Stones",
  "IBS",
  "IBD",
  "Previous Abdominal Surgery",
];

const MEDICATION_OPTIONS = [
  "NSAIDs",
  "Recent Antibiotics",
];

export default function AbdominalPain() {
  const [location, setLocation] =
    useState("");

  const [radiation, setRadiation] =
    useState("");

  const [character, setCharacter] =
    useState<string[]>([]);

  const [associated, setAssociated] =
    useState<string[]>([]);

  const [redFlags, setRedFlags] =
    useState<string[]>([]);

  const [pmh, setPmh] =
    useState<string[]>([]);

  const [medications, setMedications] =
    useState<string[]>([]);

  const [otherMedication, setOtherMedication] =
    useState("");

  const toggleMulti = (
    value: string,
    list: string[],
    setter: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => {
    setter(
      list.includes(value)
        ? list.filter(
            (item) => item !== value
          )
        : [...list, value]
    );
  };

  return (
    <AppKeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Abdominal Pain
      </Text>

      <AppCard>
        <SectionHeader title="Location" />

        <View style={styles.chipContainer}>
          {LOCATION_OPTIONS.map((item) => (
            <AppChip
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
        <Divider />
        <SectionHeader title="Character" />

        <View style={styles.chipContainer}>
          {CHARACTER_OPTIONS.map(
            (item) => (
              <AppChip
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
            )
          )}
        </View>

        <Divider />
        <SectionHeader title="Radiation" />

        <View style={styles.chipContainer}>
          {RADIATION_OPTIONS.map(
            (item) => (
              <AppChip
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
            )
          )}
        </View>
        <Divider />
        <SectionHeader title="Associated Symptoms" />

        <View style={styles.chipContainer}>
          {ASSOCIATED_OPTIONS.map(
            (item) => (
              <AppChip
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
            )
          )}
        </View>
        <Divider />
        <SectionHeader title="Red Flags" />


        <View style={styles.chipContainer}>
          {RED_FLAG_OPTIONS.map(
            (item) => (
              <AppChip
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
            )
          )}
        </View>
        <Divider />
        <SectionHeader title="Relevant Past Medical
          History" />

        <View style={styles.chipContainer}>
          {PMH_OPTIONS.map((item) => (
            <AppChip
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
        <Divider />
        <SectionHeader title="Relevant Medication History" />

        <View style={styles.chipContainer}>
          {MEDICATION_OPTIONS.map(
            (item) => (
              <AppChip
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
            )
          )}
        </View>
        <Divider />
        <SectionHeader title="Other Medications" />

        <AppTextField
          value={otherMedication}
          onChangeText={
            setOtherMedication
          }
          placeholder="Specify other medications..."
          multiline
        />
      </AppCard>
          </AppKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: SPACING.lg,
  },

  title: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
});