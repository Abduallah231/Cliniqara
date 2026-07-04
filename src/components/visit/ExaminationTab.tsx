import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { StyleSheet, View } from "react-native";
import GeneralInspectionSection from "./examination/sections/GeneralInspectionSection";
import RegionalExaminationSection from "./examination/sections/RegionalExaminationSection";
import SystemExaminationSection from "./examination/sections/SystemExaminationSection";
import VitalSignsSection from "./examination/sections/VitalSignsSection";
import VisitHeaderCard from "./VisitHeaderCard";
export default function ExaminationTab() {
  return (
    <AppKeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <VisitHeaderCard
        sectionTitle="Medical Examination"
        icon="medkit-outline"
      />
      <VitalSignsSection />
      <GeneralInspectionSection />
      <RegionalExaminationSection />
      <SystemExaminationSection />
      <View style={{ height: 50 }} />
    </AppKeyboardAwareScrollView>
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