import AppCard from "@/components/common/AppCard";
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
import { useVisitStore } from "@/store/visitStore";
type Props = {
  sectionTitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function VisitHeaderCard({
  sectionTitle,
  icon,
}: Props){

  const patient = useVisitStore(
    (state) => state.visit.patient
  );
  
  const genderLabel =
  patient.gender === "male"
    ? "Male"
    : "Female";

  const patientInfo = [
    genderLabel,
    patient.age
      ? `${patient.age} ${patient.ageUnit}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");


  return (
    <>
      <AppCard style={styles.patientCard}>
        <Text style={styles.patientName}>
          {patient.fullName || "New Patient"}
        </Text>

        <Text style={styles.patientInfo}>
          {patientInfo}
        </Text>

        
      </AppCard>

      <View style={styles.sectionHeader}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.sectionTitle}>
          {sectionTitle}
        </Text>
        
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  patientCard: {
    paddingVertical: SPACING.md,
  },

  patientName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientInfo: {
    marginTop: SPACING.xs,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },

  sectionTitle: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },
});