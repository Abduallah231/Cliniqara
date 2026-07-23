import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import { useVisitStore } from "@/store/visitStore";
import { Ionicons } from "@expo/vector-icons";
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

type RegionalSection =
  | "head"
  | "neck"
  | "upperLimb"
  | "lowerLimb";

function Section({
  title,
  section,
  items,
}: {
  title: string;
  section: RegionalSection;
  items: string[];
}) {
  const regional = useVisitStore(
    (state) =>
      state.visit.examination
        .regionalExamination
  );

  const updateRegionalSection =
    useVisitStore(
      (state) =>
        state.updateRegionalSection
    );

  const toggleRegionalFinding =
    useVisitStore(
      (state) =>
        state.toggleRegionalFinding
    );

  return (
    <>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <View style={styles.row}>
        {items.map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={regional[
              section
            ].findings.includes(item)}
            onPress={() =>
              toggleRegionalFinding(
                section,
                item
              )
            }
          />
        ))}
      </View>

      {regional[
        section
      ].findings.includes(
        "Others"
      ) && (
        <AppTextField
          placeholder="Other findings..."
          value={
            regional[section].notes
          }
          onChangeText={(
            value
          ) =>
            updateRegionalSection(
              section,
              {
                notes: value,
              }
            )
          }
          multiline
        />
      )}
    </>
  );
}

export default function RegionalExaminationSection() {
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
          section="head"
          items={[
            "NAD",
            "Scalp Lesion",
            "Skull Deformity",
            "Facial Asymmetry",
            "Tenderness",
            "Others",
          ]}
        />

        <Section
          title="Neck Examination"
          section="neck"
          items={[
            "NAD",
            "Neck Mass",
            "Lymphadenopathy",
            "Thyroid Enlargement",
            "Tenderness",
            "Restricted Movement",
            "Others",
          ]}
        />

        <Section
          title="Upper Limb Examination"
          section="upperLimb"
          items={[
            "NAD",
            "Swelling",
            "Deformity",
            "Tenderness",
            "Weakness",
            "Restricted Movement",
            "Others",
          ]}
        />

        <Section
          title="Lower Limb Examination"
          section="lowerLimb"
          items={[
            "NAD",
            "Swelling",
            "Deformity",
            "Tenderness",
            "Weakness",
            "Restricted Movement",
            "Edema",
            "Others",
          ]}
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