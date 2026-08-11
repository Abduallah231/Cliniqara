import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  BackHandler,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppEmptyState from "@/components/common/AppEmptyState";
import AppSearchBar from "@/components/common/AppSearchBar";
import AppTopBar from "@/components/common/AppTopBar";
import PatientCard from "@/components/patients/PatientCard";

import { getPatients } from "@/services/patientApi";
import { usePatientStore } from "@/store/patientStore";

import {
  COLORS,
  SPACING
} from "@/theme";

export default function ExistingPatientScreen() {
  const [search, setSearch] = useState("");

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
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) =>
      patient.fullName
        .toLowerCase()
        .includes(query) ||
      patient.patientCode
        .toLowerCase()
        .includes(query) ||
      (patient.phone ?? "")
        .toLowerCase()
        .includes(query),
    );
  }, [patients, search]);

  return (
    <SafeAreaView
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

      <View style={styles.content}>
        <View style={styles.search}>
          <AppSearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, ID or phone..."
          />
        </View>

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
                  item.estimatedAgeValue ??
                  (item.dateOfBirth
                    ? Math.floor(
                        (Date.now() -
                          new Date(
                            item.dateOfBirth,
                          ).getTime()) /
                          (365.25 *
                            24 *
                            60 *
                            60 *
                            1000),
                      )
                    : 0),
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
                    "/visit/HistoryScreen",
                  params: {
                    patientId:
                      patient.id,
                  },
                })
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
});