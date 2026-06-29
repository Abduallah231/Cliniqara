import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppTopBar from "@/components/common/AppTopBar";

import HistoryTab from "@/components/visit/HistoryTab";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar
        title="Visit History"
        onBack={() => router.back()}
        onRightPress={() => router.push("/settings")}
      />

      <View style={styles.content}>
        <AppCard style={styles.patientCard}>
          <Text style={styles.patientName}>
            Mohamed Ahmed
          </Text>

          <Text style={styles.patientInfo}>
            32 Years • Male
          </Text>
        </AppCard>

        <View style={styles.sectionHeader}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color={COLORS.primary}
          />

          <Text style={styles.sectionTitle}>
            Medical History
          </Text>
        </View>

        <HistoryTab />

        <View style={styles.navigationBar}>
  <AppButton
    title="Back"
    variant="secondary"
    style={styles.backButton}
    onPress={() => router.back()}
  />

  <AppButton
    title="Next"
    style={styles.nextButton}
    onPress={() =>
      router.push("/visit/ExaminationScreen")
    }
  />
</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },

  sectionTitle: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
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

  patientCard: {
  paddingVertical: SPACING.md,
},
});