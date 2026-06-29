import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function RegionalExaminationSection() {
  const [headFindings, setHeadFindings] =
    useState<string[]>(["NAD"]);

  const [neckFindings, setNeckFindings] =
    useState<string[]>(["NAD"]);

  const [
    upperLimbFindings,
    setUpperLimbFindings,
  ] = useState<string[]>(["NAD"]);

  const [
    lowerLimbFindings,
    setLowerLimbFindings,
  ] = useState<string[]>(["NAD"]);

  const toggleItem = (
    item: string,
    selected: string[],
    setSelected: (
      value: string[]
    ) => void
  ) => {
    if (item === "NAD") {
      setSelected(["NAD"]);
      return;
    }

    let updated = selected.filter(
      (x) => x !== "NAD"
    );

    if (updated.includes(item)) {
      updated = updated.filter(
        (x) => x !== item
      );
    } else {
      updated.push(item);
    }

    if (updated.length === 0) {
      updated = ["NAD"];
    }

    setSelected(updated);
  };

  const Section = ({
    title,
    items,
    selected,
    setSelected,
  }: {
    title: string;
    items: string[];
    selected: string[];
    setSelected: (
      value: string[]
    ) => void;
  }) => (
    <>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <View style={styles.row}>
        {items.map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={selected.includes(
              item
            )}
            onPress={() =>
              toggleItem(
                item,
                selected,
                setSelected
              )
            }
          />
        ))}
      </View>

      <AppTextField
        
        placeholder="Other findings..."
        value=""
        onChangeText={() => {}}
        multiline
      />
    </>
  );

  return (
    <View style={styles.container}>
      <CollapsibleSection
  title="Regional Examination"
  icon={
    <Ionicons
      name="body-outline"
      size={20}
      color={COLORS.primary}
    />
  }
  defaultExpanded={false}
>
        <Section
          title="Head Examination"
          items={[
            "NAD",
            "Scalp Lesion",
            "Skull Deformity",
            "Facial Asymmetry",
            "Tenderness",
          ]}
          selected={headFindings}
          setSelected={setHeadFindings}
        />

        <Section
          title="Neck Examination"
          items={[
            "NAD",
            "Neck Mass",
            "Lymphadenopathy",
            "Thyroid Enlargement",
            "Tenderness",
            "Restricted Movement",
          ]}
          selected={neckFindings}
          setSelected={setNeckFindings}
        />

        <Section
          title="Upper Limb Examination"
          items={[
            "NAD",
            "Swelling",
            "Deformity",
            "Tenderness",
            "Weakness",
            "Restricted Movement",
          ]}
          selected={
            upperLimbFindings
          }
          setSelected={
            setUpperLimbFindings
          }
        />

        <Section
          title="Lower Limb Examination"
          items={[
            "NAD",
            "Swelling",
            "Deformity",
            "Tenderness",
            "Weakness",
            "Restricted Movement",
            "Edema",
          ]}
          selected={
            lowerLimbFindings
          }
          setSelected={
            setLowerLimbFindings
          }
        />
      </CollapsibleSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginVertical: SPACING.sm,
  },
});
