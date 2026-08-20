import { router } from "expo-router";
import {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  useFocusEffect,
} from "expo-router";

import AppEmptyState from "@/components/common/AppEmptyState";
import AppTopBar from "@/components/common/AppTopBar";
import WaitingFilters, { WaitingFilter, } from "@/components/waiting-list/WaitingFilters";
import WaitingPatientCard from "@/components/waiting-list/WaitingPatientCard";
import WaitingSummary from "@/components/waiting-list/WaitingSummary";
import { getWaitingVisits } from "@/services/visitApi";
import { useClinicStore } from "@/store/clinicStore";

import {
  COLORS,
  SPACING,
} from "@/theme";

type WaitingVisit = {
  id: string;
  visitCode: string;

  patient: {
    id: string;
    patientCode: string;
    fullName: string;
  };

  doctor: {
    id: string;
    fullName: string;
  };

  visitStatus:
    | "WAITING"
    | "IN_PROGRESS"
    | string;

  createdAt: string;
  startedAt?: string | null;
};

type WaitingPatient = {
  id: string;
  fullName: string;

  status: WaitingFilter;

  visitId: string;
  visitCode: string;

  createdAt: string;
  startedAt?: string | null;

  patientId: string;
  patientCode: string;

  doctorId: string;
  doctorName: string;

  queueNumber?: number;
};

export default function WaitingListScreen() {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<WaitingFilter>("Waiting");

  const [visits, setVisits] =
    useState<WaitingVisit[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const {
    currentClinic,
  } = useClinicStore();

  const clinicId =
    currentClinic?.clinic.id;

  const loadWaitingVisits =
    useCallback(async () => {
      if (!clinicId) {
        setVisits([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data =
          await getWaitingVisits(
            clinicId,
          );

        setVisits(
          Array.isArray(data)
            ? data
            : [],
        );
      } catch (error) {
        console.error(
          "Failed to load waiting list:",
          error,
        );

        setVisits([]);
      } finally {
        setLoading(false);
      }
    }, [clinicId]);

  /*
   * Reload whenever the screen
   * becomes active.
   */
  useFocusEffect(
    useCallback(() => {
      loadWaitingVisits();
    }, [loadWaitingVisits]),
  );

  const handleRefresh =
    useCallback(async () => {
      if (!clinicId) return;

      try {
        setRefreshing(true);

        const data =
          await getWaitingVisits(
            clinicId,
          );

        setVisits(
          Array.isArray(data)
            ? data
            : [],
        );
      } catch (error) {
        console.error(
          "Failed to refresh waiting list:",
          error,
        );
      } finally {
        setRefreshing(false);
      }
    }, [clinicId]);
    

  const waitingPatients =
    useMemo<WaitingPatient[]>(() => {
      const mapped: WaitingPatient[] =
        visits.map((visit) => ({
          id: visit.patient.id,

          patientId:
            visit.patient.id,

          patientCode:
            visit.patient.patientCode,

          fullName:
            visit.patient.fullName,

          visitId:
            visit.id,

          visitCode:
            visit.visitCode,

          createdAt:
            visit.createdAt,

          startedAt:
            visit.startedAt ?? null,

          status:
            visit.visitStatus ===
            "IN_PROGRESS"
              ? "With Doctor"
              : "Waiting",

          doctorId:
            visit.doctor.id,

          doctorName:
            visit.doctor.fullName,
        }));

      /*
       * WAITING ORDER
       *
       * Oldest waiting patient first.
       */
      const waiting =
        mapped
          .filter(
            (patient) =>
              patient.status ===
              "Waiting",
          )
          .sort(
            (a, b) =>
              new Date(
                a.createdAt,
              ).getTime() -
              new Date(
                b.createdAt,
              ).getTime(),
          );

      /*
       * WITH DOCTOR ORDER
       *
       * First patient who started
       * the visit gets Active Visit #1.
       */
      const withDoctor =
        mapped
          .filter(
            (patient) =>
              patient.status ===
              "With Doctor",
          )
          .sort(
            (a, b) =>
              new Date(
                a.startedAt ??
                  a.createdAt,
              ).getTime() -
              new Date(
                b.startedAt ??
                  b.createdAt,
              ).getTime(),
          );

      /*
       * Waiting has its own numbering.
       */
      const waitingMap =
        new Map<string, number>();

      waiting.forEach(
        (patient, index) => {
          waitingMap.set(
            patient.visitId,
            index + 1,
          );
        },
      );

      /*
       * With Doctor has completely
       * separate numbering.
       */
      const withDoctorMap =
        new Map<string, number>();

      withDoctor.forEach(
        (patient, index) => {
          withDoctorMap.set(
            patient.visitId,
            index + 1,
          );
        },
      );

      /*
       * Attach the appropriate number
       * according to the patient's status.
       */
      return mapped.map(
        (patient) => ({
          ...patient,

          queueNumber:
            patient.status ===
            "Waiting"
              ? waitingMap.get(
                  patient.visitId,
                )
              : withDoctorMap.get(
                  patient.visitId,
                ),
        }),
      );
    }, [visits]);

  const filteredPatients =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return waitingPatients
        .filter((patient) => {
          const matchesSearch =
            patient.fullName
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            patient.id
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            patient.visitCode
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            patient.doctorName
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesFilter =
            patient.status === filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        })
        .sort(
          (a, b) =>
            (a.queueNumber ??
              Infinity) -
            (b.queueNumber ??
              Infinity),
        );
    }, [
      waitingPatients,
      search,
      filter,
    ]);

  const waitingCount =
    waitingPatients.filter(
      (patient) =>
        patient.status ===
        "Waiting",
    ).length;

  const withDoctorCount =
    waitingPatients.filter(
      (patient) =>
        patient.status ===
        "With Doctor",
    ).length;

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      <AppTopBar
        title="Waiting List"
        onBack={() =>
          router.replace(
            "/(app)",
          )
        }
        onRightPress={() =>
          router.push(
            "/settings",
          )
        }
      />

      {loading ? (
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={
              COLORS.primary
            }
          />
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) =>
            item.visitId
          }
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListHeaderComponent={
            <>
              <WaitingSummary
                waiting={
                  waitingCount
                }
                withDoctor={
                  withDoctorCount
                }
              />

              <View
                style={
                  styles.headerGap
                }
              />

              <WaitingFilters
                search={search}
                onSearchChange={
                  setSearch
                }
                selectedFilter={
                  filter
                }
                onFilterChange={
                  setFilter
                }
              />
            </>
          }
          renderItem={({
            item,
          }) => (
            <WaitingPatientCard
              patient={item}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={
                styles.separator
              }
            />
          )}
          ListEmptyComponent={
            <AppEmptyState
              icon="people-outline"
              title={
                filter === "Waiting"
                  ? "No Patients Waiting"
                  : "No Patients With Doctor"
              }
              subtitle={
                filter === "Waiting"
                  ? "New patients will appear here after registration."
                  : "Patients currently being seen by a doctor will appear here."
              }
            />
          }
        />
      )}
    </SafeAreaView>
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
      padding:
        SPACING.md,
      paddingBottom: 50,
      gap: SPACING.md,
    },

    headerGap: {
      height:
        SPACING.sm,
    },

    separator: {
      height:
        SPACING.md,
    },

    loadingContainer: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },
  });