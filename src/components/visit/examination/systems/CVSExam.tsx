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

export default function CVSExam() {
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
    auscultationFindings,
    setAuscultationFindings,
  ] = useState<string[]>(["NAD"]);

  const [murmurSites, setMurmurSites] =
    useState<string[]>([]);

  const [
    murmurRadiation,
    setMurmurRadiation,
  ] = useState<string[]>([]);

  const [murmurTiming, setMurmurTiming] =
    useState("");

  const [murmurGrade, setMurmurGrade] =
    useState("");

  const [jvpHeight, setJvpHeight] =
    useState("");

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
  }: {
    items: string[];
    selected: string[];
    setSelected: (
      value: string[]
    ) => void;
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
              setSelected
            )
          }
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Neck
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "Raised JVP",
          "Positive HJR",
          "Abnormal Carotid Pulsation",
          "Carotid Bruit",
        ]}
        selected={neckFindings}
        setSelected={setNeckFindings}
      />

      {neckFindings.includes(
        "Raised JVP"
      ) && (
        <AppTextField
          label="JVP Height (cm)"
          value={jvpHeight}
          onChangeText={setJvpHeight}
          keyboardType="numeric"
          placeholder="Enter JVP height"
        />
      )}

      <Text style={styles.sectionTitle}>
        Inspection
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "CABG Scar",
          "Pacemaker",
          "Visible Pulsation",
          "Chest Deformity",
          "Precordial Bulge",
        ]}
        selected={inspectionFindings}
        setSelected={setInspectionFindings}
      />

      <Text style={styles.sectionTitle}>
        Palpation
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "Displaced Apex",
          "Heave",
          "Thrill",
        ]}
        selected={palpationFindings}
        setSelected={setPalpationFindings}
      />

      <Text style={styles.sectionTitle}>
        Auscultation
      </Text>

      <ChipGroup
        items={[
          "NAD",
          "Murmur",
          "S3",
          "S4",
          "Pericardial Rub",
        ]}
        selected={auscultationFindings}
        setSelected={
          setAuscultationFindings
        }
      />
            {auscultationFindings.includes(
        "Murmur"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Timing
          </Text>

          <View style={styles.row}>
            {[
              "Systolic",
              "Diastolic",
              "Continuous",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  murmurTiming === item
                }
                onPress={() =>
                  setMurmurTiming(item)
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Grade
          </Text>

          <View style={styles.row}>
            {[
              "I",
              "II",
              "III",
              "IV",
              "V",
              "VI",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  murmurGrade === item
                }
                onPress={() =>
                  setMurmurGrade(item)
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Best Heard At
          </Text>

          <View style={styles.row}>
            {[
              "Aortic",
              "Pulmonary",
              "Tricuspid",
              "Mitral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={murmurSites.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    murmurSites,
                    setMurmurSites
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Radiation
          </Text>

          <View style={styles.row}>
            {[
              "Neck",
              "Axilla",
              "Back",
              "None",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={murmurRadiation.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    murmurRadiation,
                    setMurmurRadiation
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
        )}
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