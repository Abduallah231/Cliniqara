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

export default function EndocrineExam() {
  const [generalFindings, setGeneralFindings] =
    useState<string[]>(["Normal"]);

  const [thyroidFindings, setThyroidFindings] =
    useState<string[]>(["Normal"]);

  const [thyroidEyeSigns, setThyroidEyeSigns] =
    useState<string[]>([]);

  const [diabeticFindings, setDiabeticFindings] =
    useState<string[]>(["None"]);

  const [diabeticFootFindings, setDiabeticFootFindings] =
    useState<string[]>([]);

  const [neuropathyType, setNeuropathyType] =
    useState("");

  const [hypothyroidFindings, setHypothyroidFindings] =
    useState<string[]>(["Absent"]);

  const [hyperthyroidFindings, setHyperthyroidFindings] =
    useState<string[]>(["Absent"]);

  const [cushingFindings, setCushingFindings] =
    useState<string[]>(["Absent"]);

  const [acromegalyFindings, setAcromegalyFindings] =
    useState<string[]>(["Absent"]);

  const [addisonFindings, setAddisonFindings] =
    useState<string[]>(["Absent"]);

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
        General Appearance
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Obese",
          "Underweight",
          "Hyperpigmentation",
          "Vitiligo",
        ]}
        selected={generalFindings}
        setSelected={setGeneralFindings}
      />

      <Text style={styles.sectionTitle}>
        Thyroid Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Diffuse Goiter",
          "Nodular Goiter",
          "Thyroid Tenderness",
          "Thyroid Bruit",
        ]}
        selected={thyroidFindings}
        setSelected={setThyroidFindings}
      />

      <Text style={styles.label}>
        Thyroid Eye Signs
      </Text>

      <View style={styles.row}>
        {[
          "Lid Retraction",
          "Exophthalmos",
          "Lid Lag",
          "Ophthalmoplegia",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={thyroidEyeSigns.includes(
              item
            )}
            onPress={() =>
              toggleMulti(
                item,
                thyroidEyeSigns,
                setThyroidEyeSigns
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Diabetes
      </Text>

      <View style={styles.row}>
        {[
          "None",
          "Peripheral Neuropathy",
          "Diabetic Foot",
          "Retinopathy",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={diabeticFindings.includes(
              item
            )}
            onPress={() =>
              toggleFinding(
                item,
                diabeticFindings,
                setDiabeticFindings,
                "None"
              )
            }
          />
        ))}
      </View>
            {diabeticFindings.includes(
        "Diabetic Foot"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Diabetic Foot
          </Text>

          <View style={styles.row}>
            {[
              "Ulcer",
              "Callus",
              "Gangrene",
              "Infection",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={diabeticFootFindings.includes(
                  item
                )}
                onPress={() =>
                  toggleMulti(
                    item,
                    diabeticFootFindings,
                    setDiabeticFootFindings
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      {diabeticFindings.includes(
        "Peripheral Neuropathy"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Neuropathy Type
          </Text>

          <View style={styles.row}>
            {[
              "Sensory",
              "Motor",
              "Mixed",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  neuropathyType === item
                }
                onPress={() =>
                  setNeuropathyType(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Hypothyroidism
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Dry Skin",
          "Coarse Hair",
          "Delayed Reflexes",
          "Bradycardia",
        ]}
        selected={hypothyroidFindings}
        setSelected={
          setHypothyroidFindings
        }
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        Hyperthyroidism
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Fine Tremor",
          "Warm Hands",
          "Tachycardia",
          "Hyperreflexia",
        ]}
        selected={hyperthyroidFindings}
        setSelected={
          setHyperthyroidFindings
        }
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        Cushing Syndrome
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Moon Face",
          "Buffalo Hump",
          "Purple Striae",
          "Proximal Weakness",
        ]}
        selected={cushingFindings}
        setSelected={
          setCushingFindings
        }
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        Acromegaly
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Large Hands",
          "Large Feet",
          "Coarse Facial Features",
          "Macroglossia",
        ]}
        selected={acromegalyFindings}
        setSelected={
          setAcromegalyFindings
        }
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        Addison Disease
      </Text>

      <ChipGroup
  items={[
    "Absent",
    "Hyperpigmentation",
    "Weight Loss",
    "Hypotension",
    "Vitiligo",
  ]}
  selected={addisonFindings}
  setSelected={setAddisonFindings}
  normal="Absent"
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