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

export default function ObstetricExam() {
  const [generalFindings, setGeneralFindings] =
    useState<string[]>(["Normal"]);

  const [htnFindings, setHtnFindings] =
    useState<string[]>(["Absent"]);

  const [abdominalFindings, setAbdominalFindings] =
    useState<string[]>(["Normal"]);

  const [fundalHeight, setFundalHeight] =
    useState("");

  const [fundalAssessment, setFundalAssessment] =
    useState("");

  const [liquorAssessment, setLiquorAssessment] =
    useState("Normal");

  const [fetalLie, setFetalLie] =
    useState("");

  const [fetalPresentation, setFetalPresentation] =
    useState("");

  const [presentationPosition, setPresentationPosition] =
    useState("");

  const [engagement, setEngagement] =
    useState("");

  const [fhr, setFhr] =
    useState("");

  const [fetalMovements, setFetalMovements] =
    useState("");

  const [multiplePregnancy, setMultiplePregnancy] =
    useState("Singleton");

  const [uterineActivity, setUterineActivity] =
    useState("");

  const [redFlags, setRedFlags] =
    useState<string[]>(["None"]);

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
        General
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Pallor",
          "Edema",
          "Jaundice",
        ]}
        selected={generalFindings}
        setSelected={setGeneralFindings}
      />

      <Text style={styles.sectionTitle}>
        Hypertensive Signs
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Pedal Edema",
          "Hyperreflexia",
          "Clonus",
        ]}
        selected={htnFindings}
        setSelected={setHtnFindings}
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        Abdominal Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Scar",
          "Tenderness",
          "Contractions",
        ]}
        selected={abdominalFindings}
        setSelected={setAbdominalFindings}
      />

      <AppTextField
        label="Fundal Height"
        value={fundalHeight}
        onChangeText={setFundalHeight}
        placeholder="cm"
      />

      <AppTextField
        label="Fundal Assessment"
        value={fundalAssessment}
        onChangeText={setFundalAssessment}
        placeholder="Corresponds to GA..."
      />
            <Text style={styles.sectionTitle}>
        Liquor
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Polyhydramnios",
          "Oligohydramnios",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={liquorAssessment === item}
            onPress={() =>
              setLiquorAssessment(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Fetal Lie
      </Text>

      <View style={styles.row}>
        {[
          "Longitudinal",
          "Transverse",
          "Oblique",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={fetalLie === item}
            onPress={() =>
              setFetalLie(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Presentation
      </Text>

      <View style={styles.row}>
        {[
          "Cephalic",
          "Breech",
          "Shoulder",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              fetalPresentation === item
            }
            onPress={() =>
              setFetalPresentation(item)
            }
          />
        ))}
      </View>

      <AppTextField
        label="Position"
        value={presentationPosition}
        onChangeText={
          setPresentationPosition
        }
        placeholder="LOA, ROA..."
      />

      <Text style={styles.sectionTitle}>
        Engagement
      </Text>

      <View style={styles.row}>
        {[
          "Free",
          "5/5",
          "4/5",
          "3/5",
          "2/5",
          "1/5",
          "0/5",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={engagement === item}
            onPress={() =>
              setEngagement(item)
            }
          />
        ))}
      </View>

      <AppTextField
        label="Fetal Heart Rate"
        value={fhr}
        onChangeText={setFhr}
        keyboardType="numeric"
        placeholder="bpm"
      />

      <Text style={styles.sectionTitle}>
        Fetal Movements
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Reduced",
          "Absent",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              fetalMovements === item
            }
            onPress={() =>
              setFetalMovements(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Multiple Pregnancy
      </Text>

      <View style={styles.row}>
        {[
          "Singleton",
          "Twin",
          "Triplet",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              multiplePregnancy === item
            }
            onPress={() =>
              setMultiplePregnancy(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Uterine Activity
      </Text>

      <View style={styles.row}>
        {[
          "None",
          "Irregular",
          "Regular",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              uterineActivity === item
            }
            onPress={() =>
              setUterineActivity(item)
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
          "Antepartum Hemorrhage",
          "Absent Fetal Heart",
          "Severe Abdominal Pain",
          "Cord Prolapse",
          "Severe Hypertension",
          "Eclampsia",
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