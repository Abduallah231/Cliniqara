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
    setSelected: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => {
    setSelected((prev) => {
      if (item === "NAD") {
        return ["NAD"];
      }

      let updated = prev.filter(
        (x) => x !== "NAD"
      );

      if (updated.includes(item)) {
        updated = updated.filter(
          (x) => x !== item
        );
      } else {
        updated = [...updated, item];
      }

      return updated.length === 0
        ? ["NAD"]
        : updated;
    });
  };
    const [headNotes, setHeadNotes] =
      useState("");

    const [neckNotes, setNeckNotes] =
      useState("");

    const [
      upperLimbNotes,
      setUpperLimbNotes,
    ] = useState("");

    const [
      lowerLimbNotes,
      setLowerLimbNotes,
    ] = useState("");

    const Section = ({
      title,
      items,
      selected,
      setSelected,
      notes,
      setNotes,
    }: {
      title: string;
      items: string[];
      selected: string[];
      setSelected: React.Dispatch<
        React.SetStateAction<string[]>
      >;
      notes: string;
      setNotes: (value: string) => void;
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
                setSelected
              )
            }
          />
        ))}
      </View>

      <AppTextField
        placeholder="Other findings..."
        value={notes}
        onChangeText={setNotes}
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
          notes={headNotes}
          setNotes={setHeadNotes}
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
          notes={neckNotes}
          setNotes={setNeckNotes}
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
          notes={upperLimbNotes}
          setNotes={setUpperLimbNotes}
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
          notes={lowerLimbNotes}
          setNotes={setLowerLimbNotes}
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