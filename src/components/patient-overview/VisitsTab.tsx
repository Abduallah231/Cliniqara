import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppEmptyState from "@/components/common/AppEmptyState";
import AppSearchBar from "@/components/common/AppSearchBar";
import VisitCard from "@/components/patients/VisitCard";

import { SPACING } from "@/theme";

type FilterType =
  | "All"
  | "Completed"
  | "In Progress"
  | "Follow-up";

export default function VisitsTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<FilterType>("All");

  const visits = [
    {
      id: "1",
      date: "29 Jun 2026",
      complaint: "Chest Pain",
      diagnosis: "NSTEMI",
      doctor: "Dr. Abdullah",
      status: "Completed" as const,
    },
    {
      id: "2",
      date: "18 Jun 2026",
      complaint: "Diabetes Follow-up",
      diagnosis: "Type 2 Diabetes",
      doctor: "Dr. Abdullah",
      status: "Follow-up" as const,
    },
    {
      id: "3",
      date: "05 Jun 2026",
      complaint: "Fever",
      diagnosis: "Upper Respiratory Infection",
      doctor: "Dr. Abdullah",
      status: "In Progress" as const,
    },
  ];

  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const matchesSearch =
        visit.complaint
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        visit.diagnosis
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        visit.date
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        visit.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [search, filter]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <AppSearchBar
        placeholder="Search visits..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filters}>
        <AppChip
          label="All"
          selected={filter === "All"}
          onPress={() =>
            setFilter("All")
          }
        />

        <AppChip
          label="Completed"
          selected={
            filter === "Completed"
          }
          onPress={() =>
            setFilter("Completed")
          }
        />

        <AppChip
          label="In Progress"
          selected={
            filter === "In Progress"
          }
          onPress={() =>
            setFilter("In Progress")
          }
        />

        <AppChip
          label="Follow-up"
          selected={
            filter === "Follow-up"
          }
          onPress={() =>
            setFilter("Follow-up")
          }
        />
      </View>

      {filteredVisits.length === 0 ? (
        <AppEmptyState
          title="No Visits Found"
          subtitle="No visit matches your search."
          icon="document-text-outline"
        />
      ) : (
        <>
          <Text style={styles.year}>
            2026
          </Text>

          {filteredVisits.map(
            (visit) => (
              <VisitCard
                key={visit.id}
                date={visit.date}
                complaint={
                  visit.complaint
                }
                diagnosis={
                  visit.diagnosis
                }
                doctor={visit.doctor}
                onOpen={() => {}}
              />
            )
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: 120,
    gap: SPACING.md,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  year: {
    fontSize: 22,
    fontWeight: "700",
  },
});