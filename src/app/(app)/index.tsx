import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";
import DashboardActionCard from "@/components/dashboard/DashboardActionCard";
import GuestBanner from "@/components/dashboard/GuestBanner";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import dashboardStats from "@/data/dashboard";
import SessionService from "@/services/session.service";
import { useClinicStore } from "@/store/clinicStore";
import { useDoctorStore } from "@/store/doctorStore";
import {
  COLORS,
  SPACING
} from "@/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClinicSelector from "@/components/clinic/ClinicSelector";

export default function DashboardScreen() {
  const doctor = useDoctorStore(
    (state) => state.doctor
  );

  const currentClinic = useClinicStore(
    (state) => state.currentClinic
  );

  const clinic = currentClinic?.clinic ?? null;

  const [isGuest, setIsGuest] = useState(
      !doctor
    );

  useEffect(() => {
    SessionService.isGuestMode().then(
      setIsGuest
    );
  }, [doctor]);
 
  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar
        onRightPress={() => router.push("/(app)/settings")}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        
        {isGuest ? (
          <GuestBanner
            onCreateAccount={() =>
              router.push("/(auth)/create-account")
            }
          />
        ) : (
          <WelcomeCard
            doctorName={`Dr. ${doctor?.fullName ?? ""}`}
            specialty={
              doctor?.specialty ??
              (doctor?.doctorLevel === "INTERN"
                ? "Intern"
                : "")
            }
            clinicName={clinic?.name ?? ""}
          />
        )}

        {!isGuest && (
          <ClinicSelector
            onCreateClinic={() =>
              router.push("/(app)/create-clinic")
            }
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
          onPress={() => router.push("/(app)/waiting-list")}
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
              router.push("/(app)/existing-patients")
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
              router.push("/(app)/prescriptions")
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
            subtitle={
              clinic
                ? "Management"
                : "Create or join a clinic"
            }
            icon="business-outline"
            style={styles.flex}
            variant="red"
            onPress={() => {
              if (clinic) {
                router.push("/(app)/clinic-management");
              } else {
                router.push("/(app)/create-clinic");
              }
            }}
          />
        </View>
         {/* <View style={styles.actionsRow}>
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
            onPress={() => router.push("/(auth)/create-account")}
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
            onPress={() => router.push("/(app)/join-clinic")}
          />

          <DashboardActionCard
            compact
            title="Coming Soon"
            subtitle="Authentication"
            icon="shield-checkmark-outline"
            style={styles.flex}
            variant="cyan"
            onPress={() => router.push("/(app)/join-clinic")}
          />
        </View>  */}
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