import AppSafeAreaView from "@/components/common/AppSafeAreaView";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { BackHandler, FlatList, StyleSheet } from "react-native";


import AppEmptyState from "@/components/common/AppEmptyState";
import AppChip from "@/components/common/AppChip";
import AppSearchBar from "@/components/common/AppSearchBar";
import AppTopBar from "@/components/common/AppTopBar";
import PatientCard from "@/components/patients/PatientCard";

import { getPatients } from "@/services/patientApi";
import type { Patient } from "@/types/patient";
import { usePatientStore } from "@/store/patientStore";

import {
  COLORS,
  SPACING
} from "@/theme";

type PatientSort = "created" | "name" | "age";

function patientAgeInYears(patient: Patient): number | null {
  if (typeof patient.estimatedAgeValue === "number") {
    if (patient.estimatedAgeUnit === "DAYS") return patient.estimatedAgeValue / 365.25;
    if (patient.estimatedAgeUnit === "MONTHS") return patient.estimatedAgeValue / 12;
    if (patient.estimatedAgeUnit === "YEARS") return patient.estimatedAgeValue;
  }
  if (!patient.dateOfBirth) return null;
  const birthDate = new Date(patient.dateOfBirth);
  if (!Number.isFinite(birthDate.getTime()) || birthDate > new Date()) return null;
  return (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

export default function ExistingPatientScreen() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<PatientSort>("created");

  const {
    patients,
    setPatients,
    loading,
    setLoading,
    setError,
  } = usePatientStore();

  const loadPatients = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPatients();

        setPatients(data);
      } catch (error: any) {
        setError(
          error?.response?.data?.message ??
            "Unable to load patients.",
        );
      } finally {
        setLoading(false);
      }
    },
    [
      setPatients,
      setLoading,
      setError,
    ],
  );

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [loadPatients]),
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/");
        return true;
      };

      const subscription =
        BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress,
        );

      return () =>
        subscription.remove();
    }, []),
  );

  const filteredPatients = useMemo(() => {
    const uniquePatients = Array.from(
      new Map(
        patients.map((patient) => [
          patient.id,
          patient,
        ]),
      ).values(),
    );

    const query = search.trim().toLowerCase();

    const matchesSearch = uniquePatients.filter((patient) =>
      !query || (
      patient.fullName
        .toLowerCase()
        .includes(query) ||
      patient.patientCode
        .toLowerCase()
        .includes(query) ||
      (patient.phone ?? "")
        .toLowerCase()
        .includes(query)
      ),
    );

    return [...matchesSearch].sort((a, b) => {
      if (sortBy === "name") return a.fullName.localeCompare(b.fullName);
      if (sortBy === "age") {
        const ageA = patientAgeInYears(a);
        const ageB = patientAgeInYears(b);
        if (ageA === null) return ageB === null ? a.fullName.localeCompare(b.fullName) : 1;
        if (ageB === null) return -1;
        return ageA - ageB;
      }
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      return (Number.isFinite(createdB) ? createdB : 0) - (Number.isFinite(createdA) ? createdA : 0);
    });
  }, [patients, search, sortBy]);

  return (
    <AppSafeAreaView
      style={styles.container}
    >
      <AppTopBar
        title="Existing Patients"
        onBack={() =>
          router.replace("/")
        }
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <AppView style={styles.content}>
        <AppView style={styles.search}>
          <AppSearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, ID or phone..."
          />
        </AppView>

        <AppView style={styles.sortSection}>
          <AppText style={styles.sortTitle}>Sort by</AppText>
          <AppView style={styles.sortOptions}>
            <AppChip label="Newest" selected={sortBy === "created"} onPress={() => setSortBy("created")} />
            <AppChip label="Name A–Z" selected={sortBy === "name"} onPress={() => setSortBy("name")} />
            <AppChip label="Youngest" selected={sortBy === "age"} onPress={() => setSortBy("age")} />
          </AppView>
        </AppView>

        <FlatList
          data={filteredPatients}
          keyExtractor={(item) =>
            item.id
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.list
          }
          refreshing={loading}
          onRefresh={loadPatients}
          ListEmptyComponent={
            loading ? null : (
              <AppEmptyState
                title="No Patients Found"
                subtitle="Try another search."
                icon="people-outline"
              />
            )
          }
          renderItem={({ item }) => (
            <PatientCard
              patient={{
                id: item.id,
                fullName: item.fullName,
                age:
                  Math.floor(patientAgeInYears(item) ?? 0),
                gender:
                  item.gender === "MALE"
                    ? "Male"
                    : "Female",
                phone: item.phone ?? "",
                lastVisit: "",
              }}
              patientCode={item.patientCode}
              onPress={(patient) =>
                router.push({
                  pathname:
                    "/patient-overview",
                  params: {
                    patientId:
                      patient.id,
                  },
                })
              }
              onViewPatient={(
                patient,
              ) =>
                router.push({
                  pathname:
                    "/patient-overview",
                  params: {
                    patientId:
                      patient.id,
                  },
                })
              }
              onStartVisit={(patient) =>
                router.push({
                  pathname:
                    "/VisitScreen",
                  params: {
                    patientId:
                      patient.id,
                  },
                })
              }
            />
          )}
        />
      </AppView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    flex: 1,
    padding: SPACING.lg,
  },

  list: {
    gap: SPACING.lg,
    paddingBottom:
      SPACING.xl,
  },

  search: {
    marginBottom:
      SPACING.lg,
  },

  sortSection: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  sortTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  sortOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
});
