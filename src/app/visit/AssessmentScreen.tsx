import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";
import AssessmentTab from "@/components/visit/AssessmentTab";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function AssessmentScreen() {
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
              title="Visit Assessment"
              onBack={() => router.back()}
              onRightPress={() => router.push("/settings")}
            />

      <View style={styles.patientBanner}>
        <Text style={styles.patientName}>
          Mohamed Ahmed
        </Text>

        <Text style={styles.patientInfo}>
          32 Years • Male
        </Text>
</View>

        <View style={styles.assessmentRow}>
          <Ionicons
            name="clipboard-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.assessmentText}>
            Assessment
          </Text>
        </View>
      
      <View style={styles.content}>
        <AssessmentTab />
      </View>

      <View style={styles.navigationBar}>
  <AppButton
    title="Back"
    variant="secondary"
    style={styles.backButton}
    onPress={() => router.back()}
  />

 <AppButton
  title="Save Visit"
  icon="save-outline"
  style={styles.nextButton}
  onPress={() => {}}
/>
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

  assessmentRow: {
    flexDirection: "row",
  alignItems: "center",
  marginTop: SPACING.sm,
  marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
  },

  assessmentText: {
    color: COLORS.primary,
  fontSize: TYPOGRAPHY.small,
  fontWeight: "600",
  marginHorizontal: SPACING.xs,
  },

  content: {
    flex: 1,
    marginTop: SPACING.md,
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
  width: 150,
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

});