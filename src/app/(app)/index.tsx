import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";
import DashboardActionCard from "@/components/dashboard/DashboardActionCard";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import dashboardStats from "@/data/dashboard";
import { currentDoctor } from "@/data/user";
import {
  COLORS,
  SPACING
} from "@/theme";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GuestBanner from "@/components/dashboard/GuestBanner";

export default function DashboardScreen() {
  const isGuest = true;
  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar
        onRightPress={() => router.push("/settings")}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        
        {isGuest ? (
          <GuestBanner
            onCreateAccount={() =>
              router.push("/create-account")
            }
          />
        ) : (
          <WelcomeCard
            doctorName={`Dr. ${currentDoctor.name}`}
            specialty={currentDoctor.specialty}
            clinicName={currentDoctor.clinicName}
          />
        )}

        <View style={styles.statsRow}>
          <StatCard
            title="Today's Patients"
            value={dashboardStats.todayPatients}
            subtitle={dashboardStats.todayPatientsSubtitle}
            icon="people-outline"
            style={styles.flex}
          />

          <StatCard
            title="Waiting"
            value={dashboardStats.waitingPatients}
            subtitle={dashboardStats.waitingSubtitle}
            icon="time-outline"
            color="#16A34A"
            style={styles.flex}
          />
        </View>

        <SectionHeader title="Quick Actions" />

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
            compact
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
            compact
            title="Templates"
            subtitle="Prescription Templates"
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
            compact
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
            compact
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
         <View style={styles.actionsRow}>
          <DashboardActionCard
            compact
            title="Login"
            subtitle="Authentication"
            icon="log-in-outline"
            style={styles.flex}
            variant="primary"
            onPress={() => router.push("/(auth)/login")}
          />

          <DashboardActionCard
            compact
            title="Create Account"
            subtitle="Register"
            icon="person-add-outline"
            style={styles.flex}
            variant="success"
            onPress={() => router.push("/create-account")}
          />
        </View>

        <View style={styles.actionsRow}>
          <DashboardActionCard
            compact
            title="Forgot Password"
            subtitle="Reset password"
            icon="key-outline"
            style={styles.flex}
            variant="orange"
            onPress={() => router.push("/waiting-approval")}
          />

          <DashboardActionCard
            compact
            title="Coming Soon"
            subtitle="Authentication"
            icon="shield-checkmark-outline"
            style={styles.flex}
            variant="cyan"
            onPress={() => {}}
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

  flex: {
    flex: 1,
  },
});