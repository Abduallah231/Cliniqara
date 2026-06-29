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

export default function OphthalmologyExam() {
  const [visualFindings, setVisualFindings] =
    useState<string[]>(["Normal"]);

  const [externalFindings, setExternalFindings] =
    useState<string[]>(["Normal"]);

  const [
    conjunctivaFindings,
    setConjunctivaFindings,
  ] = useState<string[]>(["Normal"]);

  const [corneaFindings, setCorneaFindings] =
    useState<string[]>(["Clear"]);

  const [pupilFindings, setPupilFindings] =
    useState<string[]>(["Normal"]);

  const [ocularMovementFindings, setOcularMovementFindings] =
    useState<string[]>(["Full"]);

  const [fundusFindings, setFundusFindings] =
    useState<string[]>(["Normal"]);

  const [redFlags, setRedFlags] =
    useState<string[]>(["None"]);

  const [visualAcuity, setVisualAcuity] =
    useState("");

  const [visualSide, setVisualSide] =
    useState("");

  const [pupilSize, setPupilSize] =
    useState("");

  const [otherFindings, setOtherFindings] =
    useState("");

  const toggleFinding = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<
      React.SetStateAction<string[]>
    >,
    normal = "Normal"
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

  const ChipGroup = ({
    items,
    selected,
    setSelected,
    normal = "Normal",
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
        Visual Acuity
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Reduced",
          "Blindness",
        ]}
        selected={visualFindings}
        setSelected={setVisualFindings}
      />

      {visualFindings.includes(
        "Reduced"
      ) && (
        <>
          <AppTextField
            label="Visual Acuity"
            value={visualAcuity}
            onChangeText={setVisualAcuity}
            placeholder="6/6"
          />

          <Text style={styles.label}>
            Side
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Both",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  visualSide === item
                }
                onPress={() =>
                  setVisualSide(item)
                }
              />
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>
        External Eye
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Ptosis",
          "Proptosis",
          "Swelling",
          "Redness",
        ]}
        selected={externalFindings}
        setSelected={setExternalFindings}
      />

      <Text style={styles.sectionTitle}>
        Conjunctiva
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Pallor",
          "Injection",
          "Hemorrhage",
          "Discharge",
        ]}
        selected={conjunctivaFindings}
        setSelected={setConjunctivaFindings}
      />
            <Text style={styles.sectionTitle}>
        Cornea
      </Text>

      <ChipGroup
        items={[
          "Clear",
          "Opacity",
          "Ulcer",
          "Scar",
          "Foreign Body",
        ]}
        selected={corneaFindings}
        setSelected={setCorneaFindings}
        normal="Clear"
      />

      <Text style={styles.sectionTitle}>
        Pupils
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Dilated",
          "Constricted",
          "RAPD",
          "Irregular",
        ]}
        selected={pupilFindings}
        setSelected={setPupilFindings}
      />

      {pupilFindings.some(
        (x) => x !== "Normal"
      ) && (
        <AppTextField
          label="Pupil Size (mm)"
          value={pupilSize}
          onChangeText={setPupilSize}
          keyboardType="numeric"
          placeholder="e.g. 3"
        />
      )}

      <Text style={styles.sectionTitle}>
        Extraocular Movements
      </Text>

      <ChipGroup
        items={[
          "Full",
          "Restricted",
          "Painful",
          "Nystagmus",
        ]}
        selected={ocularMovementFindings}
        setSelected={
          setOcularMovementFindings
        }
        normal="Full"
      />

      <Text style={styles.sectionTitle}>
        Fundus
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Papilledema",
          "Optic Atrophy",
          "Diabetic Retinopathy",
          "Hypertensive Retinopathy",
          "Retinal Hemorrhage",
        ]}
        selected={fundusFindings}
        setSelected={setFundusFindings}
      />

      <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <ChipGroup
        items={[
          "None",
          "Sudden Vision Loss",
          "Acute Painful Red Eye",
          "Corneal Ulcer",
          "Retinal Detachment",
          "Chemical Injury",
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