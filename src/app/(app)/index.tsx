import AppPressable from "@/components/common/AppPressable";
import AppSafeAreaView from "@/components/common/AppSafeAreaView";
import AppScrollView from "@/components/common/AppScrollView";
import AppView from "@/components/common/AppView";
import ClinicSelector from "@/components/clinic/ClinicSelector";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";
import DashboardActionCard from "@/components/dashboard/DashboardActionCard";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import dashboardStats from "@/data/dashboard";
import { getWaitingVisits } from "@/services/visitApi";
import { useClinicStore } from "@/store/clinicStore";
import { useDoctorStore } from "@/store/doctorStore";
import {
  getTodayVisitCount, } from "@/services/visitApi";
import {
  COLORS, SPACING, } from "@/theme";
import {
  router, useFocusEffect, } from "expo-router";
import {
  useCallback, useMemo, useState, } from "react";
import { StyleSheet } from "react-native";


type WaitingVisit = {
  id: string;
  visitCode: string;
  visitStatus: string;
  createdAt: string;
};

export default function DashboardScreen() {
  const doctor = useDoctorStore(
    (state) => state.doctor
  );

  const currentClinic = useClinicStore(
    (state) => state.currentClinic
  );

  const clinic =
    currentClinic?.clinic ?? null;

  const [todayVisitCount, setTodayVisitCount] =
    useState(0);

  const [loadingTodayVisits, setLoadingTodayVisits] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadTodayVisitCount = async () => {
        if (!clinic?.id) {
          setTodayVisitCount(0);
          return;
        }

        try {
          setLoadingTodayVisits(true);

          const count =
            await getTodayVisitCount(clinic.id);

          if (mounted) {
            setTodayVisitCount(count);
          }
        } catch (error) {
          console.error(
            "Failed to load today's visit count:",
            error,
          );
        } finally {
          if (mounted) {
            setLoadingTodayVisits(false);
          }
        }
      };

      loadTodayVisitCount();

      return () => {
        mounted = false;
      };
    }, [clinic?.id]),
  );
  
  const [waitingVisits, setWaitingVisits] =
    useState<WaitingVisit[]>([]);

  const [now, setNow] =
    useState(Date.now());

  const loadWaitingStats =
    useCallback(async () => {
      if (!clinic?.id) {
        setWaitingVisits([]);
        return;
      }

      try {
        const data =
          await getWaitingVisits(
            clinic.id
          );

        const waiting = (
          Array.isArray(data)
            ? data
            : []
        ).filter(
          (visit: WaitingVisit) =>
            visit.visitStatus ===
            "WAITING"
        );

        setWaitingVisits(waiting);
      } catch (error) {
        console.error(
          "Failed to load dashboard waiting stats:",
          error
        );

        setWaitingVisits([]);
      }
    }, [clinic?.id]);

  /*
   * Reload waiting data whenever
   * the dashboard becomes active.
   *
   * Also refresh the current time
   * every minute so the average
   * waiting duration stays current.
   */
  useFocusEffect(
    useCallback(() => {
      loadWaitingStats();
      setNow(Date.now());

      const timer =
        setInterval(() => {
          setNow(Date.now());
        }, 60_000);

      return () => {
        clearInterval(timer);
      };
    }, [loadWaitingStats])
  );

  const waitingCount =
    waitingVisits.length;

  const averageWaitingMinutes =
    useMemo(() => {
      if (waitingVisits.length === 0) {
        return 0;
      }

      const totalMinutes =
        waitingVisits.reduce(
          (total, visit) => {
            const createdAt =
              new Date(
                visit.createdAt
              ).getTime();

            if (
              Number.isNaN(
                createdAt
              )
            ) {
              return total;
            }

            const minutes =
              Math.max(
                0,
                (now - createdAt) /
                  60000
              );

            return total + minutes;
          },
          0
        );

      return Math.round(
        totalMinutes /
          waitingVisits.length
      );
    }, [waitingVisits, now]);

  return (
    <AppSafeAreaView
      style={styles.container}
    >
      <AppTopBar
        onRightPress={() =>
          router.push(
            "/(app)/settings"
          )
        }
      />

      <AppScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <WelcomeCard
            doctorName={`Dr. ${
              doctor?.fullName ?? ""
            }`}
            specialty={
              doctor?.specialty ?? ""
            }
            clinicName={
              clinic?.name ?? ""
            }
          />

        <ClinicSelector
            onCreateClinic={() =>
              router.push(
                "/(app)/create-clinic"
              )
            }
            onJoinClinic={() =>
              router.push(
                "/(app)/join-clinic"
              )
            }
          />

        <AppView style={styles.statsRow}>
          <AppPressable
            style={({ pressed }) => [
              styles.flex,
              pressed && styles.pressedCard,
            ]}
            android_ripple={{
              color: COLORS.primary + "18",
            }}
            onPress={() =>
              router.push(
                "/(app)/existing-patients"
              )
            }
          >
            <StatCard
              title="Today's Patients"
              value={
                loadingTodayVisits
                  ? "..."
                  : todayVisitCount
              }
              subtitle="New visits today"
              icon="people-outline"
              style={styles.statCard}
            />
          </AppPressable>

          <AppPressable
            style={({ pressed }) => [
              styles.flex,
              pressed && styles.pressedCard,
            ]}
            android_ripple={{
              color: "#16A34A18",
            }}
            onPress={() =>
              router.push(
                "/(app)/waiting-list"
              )
            }
          >
            <StatCard
              title="Waiting"
              value={waitingCount}
              subtitle={`Average · ${averageWaitingMinutes} min`}
              icon="time-outline"
              color="#16A34A"
              style={styles.statCard}
            />
          </AppPressable>
        </AppView>

        <SectionHeader
          title="Quick Actions"
        />

        <DashboardActionCard
          title="New Patient"
          subtitle="Register a new patient"
          icon="person-add-outline"
          variant="primary"
          fullWidth
          onPress={() =>
            router.push(
              "/new-patient"
            )
          }
        />

        <AppView
          style={{
            height: SPACING.md,
          }}
        />

        <DashboardActionCard
          title="Waiting List"
          subtitle="Manage today's waiting patients"
          icon="time-outline"
          variant="success"
          fullWidth
          onPress={() =>
            router.push(
              "/(app)/waiting-list"
            )
          }
        />

        <AppView
          style={styles.actionsRow}
        >
          <DashboardActionCard
            compact
            title="Existing Patients"
            subtitle="Browse patient records"
            icon="people-outline"
            style={styles.flex}
            variant="purple"
            onPress={() =>
              router.push(
                "/(app)/existing-patients"
              )
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
              router.push(
                "/(app)/prescriptions"
              )
            }
          />
        </AppView>

        <AppView
          style={styles.actionsRow}
        >
          <DashboardActionCard
            compact
            title="Statistics"
            subtitle="Clinic analytics"
            icon="bar-chart-outline"
            style={styles.flex}
            variant="cyan"
            onPress={() =>
              router.push(
                "/statistics"
              )
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
                router.push(
                  "/(app)/clinic-management"
                );
              } else {
                router.push(
                  "/(app)/create-clinic"
                );
              }
            }}
          />
        </AppView>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    content: {
      padding: SPACING.lg,
      paddingBottom:
        SPACING.xl,
    },

    statsRow: {
      flexDirection: "row",
      gap: SPACING.md,
      marginBottom:
        SPACING.xl,
    },

    actionsRow: {
      flexDirection: "row",
      gap: SPACING.sm,
      marginTop:
        SPACING.md,
      justifyContent:
        "space-between",
    },

    flex: {
      flex: 1,
    },

    statCard: {
      flex: 1,
    },

    pressedCard: {
      opacity: 0.82,
      transform: [
        {
          scale: 0.985,
        },
      ],
    },
  });
