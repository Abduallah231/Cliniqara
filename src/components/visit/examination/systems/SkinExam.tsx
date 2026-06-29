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

export default function SkinExam() {
  const [lesionFindings, setLesionFindings] =
    useState<string[]>(["Normal"]);

  const [distributionFindings, setDistributionFindings] =
    useState<string[]>(["Localized"]);

  const [secondaryChanges, setSecondaryChanges] =
    useState<string[]>([]);

  const [colorChanges, setColorChanges] =
    useState<string[]>(["Normal"]);

  const [nailFindings, setNailFindings] =
    useState<string[]>(["Normal"]);

  const [hairFindings, setHairFindings] =
    useState<string[]>(["Normal"]);

  const [redFlags, setRedFlags] =
    useState<string[]>(["None"]);

  const [lesionSites, setLesionSites] =
    useState<string[]>([]);

  const [lesionNumber, setLesionNumber] =
    useState("");

  const [lesionShape, setLesionShape] =
    useState("");

  const [lesionBorder, setLesionBorder] =
    useState("");

  const [lesionColor, setLesionColor] =
    useState("");

  const [lesionSize, setLesionSize] =
    useState("");

  const [lesionSurface, setLesionSurface] =
    useState("");

  const [lesionSymptoms, setLesionSymptoms] =
    useState<string[]>([]);

  const [blanching, setBlanching] =
    useState("");

  const [tenderness, setTenderness] =
    useState("");

  const [mucosalInvolvement, setMucosalInvolvement] =
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
        Skin Lesions
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Macule",
          "Papule",
          "Plaque",
          "Vesicle",
          "Bulla",
          "Pustule",
          "Nodule",
          "Ulcer",
        ]}
        selected={lesionFindings}
        setSelected={setLesionFindings}
      />

      {!lesionFindings.includes("Normal") && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Site
          </Text>

          <View style={styles.row}>
            {[
              "Face",
              "Scalp",
              "Neck",
              "Chest",
              "Back",
              "Upper Limb",
              "Lower Limb",
              "Palm",
              "Sole",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={lesionSites.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    lesionSites,
                    setLesionSites
                  )
                }
              />
            ))}
          </View>
                    <AppTextField
            label="Number"
            value={lesionNumber}
            onChangeText={setLesionNumber}
            placeholder="Single / Multiple"
          />

          <AppTextField
            label="Size"
            value={lesionSize}
            onChangeText={setLesionSize}
            placeholder="cm"
          />

          <AppTextField
            label="Shape"
            value={lesionShape}
            onChangeText={setLesionShape}
          />

          <AppTextField
            label="Border"
            value={lesionBorder}
            onChangeText={setLesionBorder}
          />

          <AppTextField
            label="Color"
            value={lesionColor}
            onChangeText={setLesionColor}
          />

          <AppTextField
            label="Surface"
            value={lesionSurface}
            onChangeText={setLesionSurface}
          />

          <Text style={styles.label}>
            Symptoms
          </Text>

          <View style={styles.row}>
            {[
              "Itching",
              "Pain",
              "Burning",
              "Bleeding",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={lesionSymptoms.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    lesionSymptoms,
                    setLesionSymptoms
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Distribution
      </Text>

      <ChipGroup
        items={[
          "Localized",
          "Generalized",
          "Dermatomal",
          "Flexural",
          "Extensor",
          "Sun Exposed",
        ]}
        selected={distributionFindings}
        setSelected={
          setDistributionFindings
        }
        normal="Localized"
      />

      <Text style={styles.sectionTitle}>
        Secondary Changes
      </Text>

      <View style={styles.row}>
        {[
          "Scale",
          "Crust",
          "Excoriation",
          "Lichenification",
          "Scar",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={secondaryChanges.includes(
              item
            )}
            onPress={() =>
              toggleMulti(
                item,
                secondaryChanges,
                setSecondaryChanges
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Color Changes
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Hypopigmentation",
          "Hyperpigmentation",
          "Erythema",
          "Cyanosis",
          "Jaundice",
        ]}
        selected={colorChanges}
        setSelected={setColorChanges}
      />

      <Text style={styles.sectionTitle}>
        Nails
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Clubbing",
          "Koilonychia",
          "Pitting",
          "Onychomycosis",
        ]}
        selected={nailFindings}
        setSelected={setNailFindings}
      />

      <Text style={styles.sectionTitle}>
        Hair
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Alopecia",
          "Hirsutism",
          "Brittle Hair",
        ]}
        selected={hairFindings}
        setSelected={setHairFindings}
      />
            <Text style={styles.sectionTitle}>
        Blanching
      </Text>

      <View style={styles.row}>
        {["Yes", "No"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={blanching === item}
            onPress={() =>
              setBlanching(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Tenderness
      </Text>

      <View style={styles.row}>
        {["Present", "Absent"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={tenderness === item}
            onPress={() =>
              setTenderness(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Mucosal Involvement
      </Text>

      <View style={styles.row}>
        {["Yes", "No"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              mucosalInvolvement === item
            }
            onPress={() =>
              setMucosalInvolvement(item)
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
          "Necrotic Lesion",
          "Rapidly Spreading Rash",
          "Petechiae/Purpura",
          "Skin Sloughing",
          "Suspected Melanoma",
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