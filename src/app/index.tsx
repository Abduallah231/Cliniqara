import { router } from "expo-router";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppTopBar from "@/components/common/AppTopBar";
import DashboardActionCard from "@/components/dashboard/DashboardActionCard";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import { currentDoctor } from "@/data/user";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar
        onRightPress={() => router.push("/settings")}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeCard
    doctorName={`Dr. ${currentDoctor.name}`}
    clinicName={currentDoctor.clinicName}
/>

        <View style={styles.statsRow}>
          <StatCard
            title="Today's Patients"
            value={24}
            subtitle="12% more than yesterday"
            icon="people-outline"
            style={styles.flex}
          />

          <StatCard
            title="Waiting"
            value={5}
            subtitle="Average 15 min"
            icon="time-outline"
            color="#16A34A"
            style={styles.flex}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <DashboardActionCard
          title="New Patient"
          subtitle="Register a new patient"
          icon="person-add-outline"
          variant="primary"
          fullWidth
          onPress={() => router.push("/new-patient")}
        />

        <View style={{ height: SPACING.md }} />

        <DashboardActionCard
          title="Waiting List"
          subtitle="Manage today's waiting patients"
          icon="time-outline"
          variant="success"
          fullWidth
          onPress={() => router.push("/waiting-list")}
        />

        <View style={styles.actionsRow}>
          <DashboardActionCard
          
            title="Existing Patients"
            subtitle="Browse patient records"
            icon="people-outline"
            style={styles.flex}
            variant="purple"
            onPress={() =>
              router.push("/existing-patients")
            }
          />

          <DashboardActionCard
            title="Rx"
            subtitle="Temps"
            icon="document-text-outline"
            style={styles.flex}
             variant="orange"
            onPress={() =>
              router.push("/prescriptions")
            }
          />
        </View>

        <View style={styles.actionsRow}>
          <DashboardActionCard
            title="Statistics"
            subtitle="Clinic analytics"
            icon="bar-chart-outline"
            style={styles.flex}
            variant="cyan"

            onPress={() =>
              router.push("/statistics")
            }
          />

          <DashboardActionCard
            title="Clinic"
            subtitle="Management"
            icon="business-outline"
            style={styles.flex}
            variant="red"
            onPress={() =>
              router.push("/clinic-management")
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },

  statsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },

  actionsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  flex: {
    flex: 1,
  },
});