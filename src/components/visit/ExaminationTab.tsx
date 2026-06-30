import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import GeneralInspectionSection from "./examination/sections/GeneralInspectionSection";
import RegionalExaminationSection from "./examination/sections/RegionalExaminationSection";
import SystemExaminationSection from "./examination/sections/SystemExaminationSection";
import VitalSignsSection from "./examination/sections/VitalSignsSection";

export default function ExaminationTab() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
     <View style={styles.patientBanner}>
  <Text style={styles.patientName}>
    Mohamed Ahmed
  </Text>

  <Text style={styles.patientInfo}>
    32 Years • Male
  </Text>
</View>

<View style={styles.examRow}>
  <Ionicons
    name="medkit-outline"
    size={16}
    color={COLORS.primary}
  />
  <Text style={styles.examText}>
    Medical Examination
  </Text>
</View> 
      <VitalSignsSection />
      <GeneralInspectionSection />
      <RegionalExaminationSection />
      <SystemExaminationSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
      paddingHorizontal: SPACING.md,
        paddingTop: SPACING.sm,
          paddingBottom: 70,
            gap: SPACING.md,
            
  },

  patientBanner: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    ...SHADOW,
  },

  patientName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientInfo: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  
navigationBar: {
  position: "absolute",
  left: SPACING.lg,
  right: SPACING.lg,
  bottom: SPACING.xl,

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",

  
  padding: 4,
borderRadius: 20,
backgroundColor: "rgba(255,255,255,0.15)",
},

backButton: {
  width: 110,
  borderWidth: 1.5,
borderColor: "#FFFFFF",
shadowColor: "#000",
shadowOpacity: 0.15,
shadowRadius: 10,
shadowOffset: {
  width: 0,
  height: 4,
},
elevation: 6,
},

nextButton: {
  width: 110,
  borderWidth: 1.5,
borderColor: "#FFFFFF",
shadowColor: "#000",
shadowOpacity: 0.18,
shadowRadius: 10,
shadowOffset: {
  width: 0,
  height: 4,
},
elevation: 6,
},

  examRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: SPACING.sm,
  marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
},

examText: {
  color: COLORS.primary,
  fontSize: TYPOGRAPHY.small,
  fontWeight: "600",
  marginHorizontal: SPACING.xs,
},
});