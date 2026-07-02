import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppEmptyState from "@/components/common/AppEmptyState";
import AppTopBar from "@/components/common/AppTopBar";

import WaitingFilters, {
  WaitingFilter,
} from "@/components/waiting-list/WaitingFilters";
import WaitingPatientCard from "@/components/waiting-list/WaitingPatientCard";
import WaitingSummary from "@/components/waiting-list/WaitingSummary";

import { waitingPatientsData } from "@/data/WaitingPatients";

import {
  COLORS,
  SPACING,
} from "@/theme";

export default function WaitingListScreen() {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<WaitingFilter>("All");

  const filteredPatients =
    useMemo(() => {
      return waitingPatientsData.filter(
        (patient) => {
          const matchesSearch =
            patient.fullName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            patient.id
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesFilter =
            filter === "All" ||
            patient.status === filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [search, filter]);

  const waitingCount =
    waitingPatientsData.filter(
      (p) =>
        p.status === "Waiting"
    ).length;

  const withDoctorCount =
    waitingPatientsData.filter(
      (p) =>
        p.status ===
        "With Doctor"
    ).length;

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Waiting List"
        onBack={() =>
          router.replace("/")
        }
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        ListHeaderComponent={
          <>
            <WaitingSummary
              waiting={waitingCount}
              withDoctor={
                withDoctorCount
              }
            />
            <View
    style={{
      height: SPACING.sm,
    }}
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
        renderItem={({ item }) => (
          <WaitingPatientCard
            patient={item}
          />
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: SPACING.md,
            }}
          />
        )}
        ListEmptyComponent={
          <AppEmptyState
            icon="people-outline"
            title="No Patients Waiting"
            subtitle="New patients will appear here after registration."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: 50,
    gap: SPACING.md,
  },
});