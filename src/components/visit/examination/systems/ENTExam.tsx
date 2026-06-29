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

export default function ENTExam() {
  const [earFindings, setEarFindings] =
    useState<string[]>(["Normal"]);

  const [noseFindings, setNoseFindings] =
    useState<string[]>(["Normal"]);

  const [throatFindings, setThroatFindings] =
    useState<string[]>(["Normal"]);

  const [neckFindings, setNeckFindings] =
    useState<string[]>(["Normal"]);

  const [redFlags, setRedFlags] =
    useState<string[]>(["None"]);

  const [hearingSide, setHearingSide] =
    useState("");

  const [dischargeType, setDischargeType] =
    useState("");

  const [tonsilGrade, setTonsilGrade] =
    useState("");

  const [lymphNodes, setLymphNodes] =
    useState<string[]>([]);

  const [thyroidType, setThyroidType] =
    useState("");

  const [neckMassLocation, setNeckMassLocation] =
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
        Ear
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Impacted Wax",
          "Otorrhea",
          "Otitis Externa",
          "Otitis Media",
          "Perforated TM",
          "Hearing Loss",
          "Tinnitus",
          "Vertigo",
        ]}
        selected={earFindings}
        setSelected={setEarFindings}
      />

      {earFindings.includes(
        "Hearing Loss"
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
                  hearingSide === item
                }
                onPress={() =>
                  setHearingSide(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Nose
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Nasal Congestion",
          "Nasal Discharge",
          "Septal Deviation",
          "Nasal Polyp",
          "Epistaxis",
          "Post Nasal Drip",
        ]}
        selected={noseFindings}
        setSelected={setNoseFindings}
      />

      {noseFindings.includes(
        "Nasal Discharge"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Discharge Type
          </Text>

          <View style={styles.row}>
            {[
              "Clear",
              "Purulent",
              "Bloody",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  dischargeType === item
                }
                onPress={() =>
                  setDischargeType(item)
                }
              />
            ))}
          </View>
        </View>
      )}
            <Text style={styles.sectionTitle}>
        Throat
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Pharyngitis",
          "Tonsillitis",
          "Tonsillar Enlargement",
          "Peritonsillar Abscess",
          "Uvula Deviation",
          "Oral Thrush",
          "Hoarseness",
        ]}
        selected={throatFindings}
        setSelected={setThroatFindings}
      />

      {throatFindings.includes(
        "Tonsillar Enlargement"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Tonsil Grade
          </Text>

          <View style={styles.row}>
            {[
              "Grade I",
              "Grade II",
              "Grade III",
              "Grade IV",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  tonsilGrade === item
                }
                onPress={() =>
                  setTonsilGrade(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Neck
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Lymphadenopathy",
          "Thyroid Enlargement",
          "Neck Mass",
          "Tenderness",
        ]}
        selected={neckFindings}
        setSelected={setNeckFindings}
      />

      {neckFindings.includes(
        "Lymphadenopathy"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Lymph Nodes
          </Text>

          <View style={styles.row}>
            {[
              "Anterior Cervical",
              "Posterior Cervical",
              "Submandibular",
              "Submental",
              "Supraclavicular",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={lymphNodes.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    lymphNodes,
                    setLymphNodes
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      {neckFindings.includes(
        "Thyroid Enlargement"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Thyroid
          </Text>

          <View style={styles.row}>
            {[
              "Diffuse",
              "Nodular",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  thyroidType === item
                }
                onPress={() =>
                  setThyroidType(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      {neckFindings.includes(
        "Neck Mass"
      ) && (
        <AppTextField
          label="Mass Location"
          value={neckMassLocation}
          onChangeText={
            setNeckMassLocation
          }
          placeholder="Describe location..."
        />
      )}

      <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <View style={styles.row}>
        {[
          "None",
          "Airway Compromise",
          "Stridor",
          "Neck Swelling",
          "Facial Swelling",
          "Severe Epistaxis",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={redFlags.includes(
              item
            )}
            onPress={() =>
              toggleFinding(
                item,
                redFlags,
                setRedFlags,
                "None"
              )
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
          "Airway Compromise",
          "Stridor",
          "Facial Swelling",
          "Rapidly Enlarging Neck Mass",
          "Profuse Epistaxis",
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