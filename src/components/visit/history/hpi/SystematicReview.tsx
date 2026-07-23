import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useVisitStore } from "@/store/visitStore";

const SYSTEMATIC_REVIEW_DATA = [
  {
    title: "General",
    symptoms: [
      "Fever",
      "Weight Loss",
      "Fatigue",
      "Night Sweats",
      "Appetite Change",
    ],
  },
  {
    title: "CVS",
    symptoms: [
      "Chest Pain",
      "Dyspnea",
      "Palpitations",
      "Orthopnea",
      "PND",
      "Peripheral Edema",
    ],
  },
  {
    title: "Chest",
    symptoms: [
      "Cough",
      "Expectoration",
      "Hemoptysis",
      "Wheeze",
      "Stridor",
    ],
  },
  {
    title: "GIT",
    symptoms: [
      "Abdominal Pain",
      "Vomiting",
      "Dysphagia",
      "Hematemesis",
      "Diarrhea",
      "Constipation",
      "Melena",
      "Hematochezia",
      "Jaundice",
    ],
  },
  {
    title: "Renal",
    symptoms: [
      "Dysuria",
      "Frequency",
      "Urgency",
      "Hematuria",
      "Retention",
      "Nocturia",
      "Weak Stream",
      "Polyuria",
      "Oliguria",
      "Anuria",
      "Loin Pain",
      "Renal Colic",
    ],
  },
  {
    title: "Neuro",
    symptoms: [
      "Headache",
      "Loss Of Consciousness",
      "Seizures",
      "Weakness",
      "Numbness",
      "Diplopia",
      "Visual Loss",
      "Vertigo",
      "Memory Loss",
    ],
  },
  {
    title: "Musculoskeletal",
    symptoms: [
      "Joint Pain",
      "Joint Swelling",
      "Morning Stiffness",
      "Back Pain",
      "Myalgia",
      "Muscle Weakness",
    ],
  },
  {
    title: "Endocrine",
    symptoms: [
      "Weight Gain",
      "Polyuria",
      "Polydipsia",
      "Polyphagia",
      "Heat Intolerance",
      "Cold Intolerance",
      "Tremor",
      "Galactorrhea",
    ],
  },
  {
    title: "Hematology",
    symptoms: [
      "Pallor",
      "Easy Bruising",
      "Petechiae",
      "Lymphadenopathy",
      "Bone Pain",
    ],
  },
  {
    title: "Skin",
    symptoms: [
      "Rash",
      "Pruritus",
      "Skin Lesions",
      "Color Change",
      "Alopecia",
    ],
  },
  {
    title: "Gynecology",
    symptoms: [
      "Amenorrhea",
      "Menorrhagia",
      "Dysmenorrhea",
      "Vaginal Discharge",
      "Pelvic Pain",
      "Dyspareunia",
      "Postcoital Bleeding",
    ],
  },
  {
    title: "Obstetric",
    symptoms: [
      "Reduced Fetal Movement",
      "Vaginal Bleeding",
      "Fluid Leakage",
      "Contractions",
    ],
  },
  {
    title: "ENT",
    symptoms: [
      "Hearing Loss",
      "Tinnitus",
      "Otorrhea",
      "Nasal Obstruction",
      "Epistaxis",
      "Anosmia",
      "Dysphagia",
      "Hoarseness",
      "Neck Swelling",
    ],
  },
  {
    title: "Ophthalmology",
    symptoms: [
      "Eye Pain",
      "Redness",
      "Photophobia",
      "Blurred Vision",
      "Visual Field Loss",
      "Floaters",
      "Flashes",
    ],
  },
];

export default function SystematicReview() {
  const [expanded, setExpanded] =
    useState<string | null>(null);

  const {
    visit,
    updateSystematicReviewField,
  } = useVisitStore();

  const toggleSymptom = (
    system: string,
    symptom: string
  ) => {
    const selected =
      (visit.history.hpi.systematicReview.systems.find(
        (s) => s.fieldId === system
      )?.value as string[]) ?? [];

    const updated = selected.includes(symptom)
      ? selected.filter((x) => x !== symptom)
      : [...selected, symptom];

    updateSystematicReviewField(
      system,
      system,
      updated
    );
  };

  return (
    <View style={styles.container}>
      {SYSTEMATIC_REVIEW_DATA.map(
        (system) => {
          const selected =
            (visit.history.hpi.systematicReview.systems.find(
              (s) =>
                s.fieldId === system.title
            )?.value as string[]) ?? [];

          return (
            <AppCard
              key={system.title}
              style={styles.card}
            >
              <Pressable
                style={styles.header}
                onPress={() =>
                  setExpanded(
                    expanded === system.title
                      ? null
                      : system.title
                  )
                }
              >
                <View style={styles.headerContent}>
                  <View style={styles.titleContainer}>
                    <View style={styles.accent} />

                    <Text style={styles.title}>
                      {system.title}
                    </Text>
                  </View>

                  <Ionicons
                    name={
                      expanded === system.title
                        ? "chevron-down"
                        : "chevron-forward"
                    }
                    size={22}
                    color={COLORS.primary}
                  />
                </View>
              </Pressable>
              {expanded === system.title && (
  <View style={styles.row}>
    {system.symptoms.map(
      (symptom) => (
        <AppChip
          key={symptom}
          label={symptom}
          selected={selected.includes(
            symptom
          )}
          onPress={() =>
            toggleSymptom(
              system.title,
              symptom
            )
          }
        />
      )
    )}
  </View>
)}

          </AppCard>
        );
      }
    )}
  </View>
);}
const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },

  card: {
    padding: SPACING.md,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  accent: {
    width: 4,
    height: 24,
    borderRadius: 99,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.sm,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },
});