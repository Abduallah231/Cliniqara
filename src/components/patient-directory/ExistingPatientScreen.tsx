import { useMemo, useState } from "react";

import { router, useFocusEffect } from "expo-router";

import { patientsData } from "@/data";
import {
  BackHandler,
  FlatList,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppEmptyState from "@/components/common/AppEmptyState";
import AppSearchBar from "@/components/common/AppSearchBar";
import AppTopBar from "@/components/common/AppTopBar";

import PatientCard from "@/components/patients/PatientCard";

import PatientFilters from "./PatientFilters";


import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function ExistingPatientScreen() {
  useFocusEffect(() => {
  const onBackPress = () => {
    router.replace("/");
    return true;
  };

  const subscription =
    BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

  return () => subscription.remove();
});
  const [search, setSearch] = useState("");

  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const patients = patientsData;

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        query === "" ||
        patient.fullName
          .toLowerCase()
          .includes(query) ||
        patient.id
          .toLowerCase()
          .includes(query) ||
        (patient.phone ?? "")
          .toLowerCase()
          .includes(query);

      if (!matchesSearch) {
        return false;
      }

      switch (selectedFilter) {
        case "Favorites":
          return patient.isFavorite;

        default:
          return true;
      }
    });
  }, [patients, search, selectedFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar
        title="Existing Patients"
        onBack={() => router.replace("/")}
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <View style={styles.content}>
        
          <View style={styles.search}>
        <AppSearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, ID or phone..."
        />
          </View >
        <PatientFilters
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />

        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <AppEmptyState
              title="No Patients Found"
              subtitle="Try another search or change the filter."
              icon="people-outline"
            />
          }
          renderItem={({ item }) => (
            <PatientCard
              patient={item}
              onPress={(patient) =>
  router.push({
    pathname: "/patient-overview",
    params: {
      patientId: patient.id,
    },
  })
}
              onViewPatient={(patient) =>
  router.push({
    pathname: "/patient-overview",
    params: {
      patientId: patient.id,
    },
  })
}
              onStartVisit={(patient) =>
  router.push({
    pathname: "/visit/HistoryScreen",
    params: {
      patientId: patient.id,
    },
  })
}
              onToggleFavorite={(patient) =>
                console.log(
                  "Favorite",
                  patient.id
                )
              }
            />
          )}
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

  content: {
    flex: 1,

    padding: SPACING.lg,
  },

  title: {
    marginBottom: SPACING.lg,

    color: COLORS.text,

    fontSize: TYPOGRAPHY.title,

    fontWeight: "700",
  },

  list: {
    gap: SPACING.lg,

    paddingBottom: SPACING.xl,
  },
  search: {
  marginBottom: SPACING.lg,
},
});