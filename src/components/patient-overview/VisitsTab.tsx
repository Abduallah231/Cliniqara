import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import AppChip from "@/components/common/AppChip";
import AppEmptyState from "@/components/common/AppEmptyState";
import AppSearchBar from "@/components/common/AppSearchBar";
import VisitCard from "@/components/patients/VisitCard";

import { getPatientVisits } from "@/services/visitApi";
import type {
  PatientVisitSummary,
  VisitStatus,
} from "@/types/visit";
import { SPACING } from "@/theme";

type FilterType =
  | "All"
  | "Completed"
  | "In Progress"
  | "Waiting"
  | "Cancelled";

type VisitListItem = {
  id: string;
  date: string;
  year: string;
  complaint: string;
  diagnosis: string;
  doctor: string;
  status: FilterType;
};

type VisitsTabProps = {
  patientId: string;
};

function mapVisitStatus(
  status: VisitStatus,
): FilterType {
  switch (status) {
    case "COMPLETED":
      return "Completed";

    case "IN_PROGRESS":
      return "In Progress";

    case "WAITING":
      return "Waiting";

    case "CANCELLED":
      return "Cancelled";

    default:
      return "All";
  }
}

function formatVisitDate(
  dateValue: string,
): {
  date: string;
  year: string;
} {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      date: dateValue,
      year: "",
    };
  }

  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    year: String(date.getFullYear()),
  };
}

function mapVisitToListItem(
  visit: PatientVisitSummary,
): VisitListItem {
  const formattedDate = formatVisitDate(
    visit.createdAt,
  );

  return {
    id: visit.id,
    date: formattedDate.date,
    year: formattedDate.year,
    complaint:
      visit.chiefComplaint?.chiefComplaint?.name ??
      "No chief complaint",
    diagnosis:
      visit.diagnosis?.primaryDiagnosisName ??
      "No diagnosis",
    doctor:
      visit.doctor?.fullName ??
      "Unknown doctor",
    status: mapVisitStatus(
      visit.visitStatus,
    ),
  };
}

export default function VisitsTab({
  patientId,
}: VisitsTabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<FilterType>("All");

  const [visits, setVisits] =
    useState<PatientVisitSummary[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const loadVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPatientVisits(
        patientId,
      );

      setVisits(data);
    } catch (err) {
      console.error(
        "Failed to load patient visits:",
        err,
      );

      setError(
        "Unable to load visits. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void loadVisits();
  }, [loadVisits]);

  const visitItems = useMemo(
    () => visits.map(mapVisitToListItem),
    [visits],
  );

  const filteredVisits = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return visitItems.filter((visit) => {
      const matchesSearch =
        normalizedSearch === "" ||
        visit.complaint
          .toLowerCase()
          .includes(normalizedSearch) ||
        visit.diagnosis
          .toLowerCase()
          .includes(normalizedSearch) ||
        visit.doctor
          .toLowerCase()
          .includes(normalizedSearch) ||
        visit.date
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFilter =
        filter === "All" ||
        visit.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [filter, search, visitItems]);

  const groupedVisits = useMemo(() => {
    return filteredVisits.reduce<
      Record<string, VisitListItem[]>
    >((groups, visit) => {
      const year = visit.year || "Unknown";

      if (!groups[year]) {
        groups[year] = [];
      }

      groups[year].push(visit);

      return groups;
    }, {});
  }, [filteredVisits]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
        ]}
      >
        <ActivityIndicator />
        <Text style={styles.loadingText}>
          Loading visits...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
        ]}
      >
        <AppEmptyState
          title="Unable to Load Visits"
          subtitle={error}
          icon="alert-circle-outline"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
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
          onPress={() => setFilter("All")}
        />

        <AppChip
          label="Completed"
          selected={filter === "Completed"}
          onPress={() =>
            setFilter("Completed")
          }
        />

        <AppChip
          label="In Progress"
          selected={filter === "In Progress"}
          onPress={() =>
            setFilter("In Progress")
          }
        />

        <AppChip
          label="Waiting"
          selected={filter === "Waiting"}
          onPress={() => setFilter("Waiting")}
        />

        <AppChip
          label="Cancelled"
          selected={filter === "Cancelled"}
          onPress={() =>
            setFilter("Cancelled")
          }
        />
      </View>

      {filteredVisits.length === 0 ? (
        <AppEmptyState
          title="No Visits Found"
          subtitle={
            search.trim() || filter !== "All"
              ? "No visit matches your search or filter."
              : "This patient has no visits yet."
          }
          icon="document-text-outline"
        />
      ) : (
        Object.entries(groupedVisits).map(
          ([year, yearVisits]) => (
            <View
              key={year}
              style={styles.yearGroup}
            >
              <Text style={styles.year}>
                {year}
              </Text>

              {yearVisits.map((visit) => (
                <VisitCard
                  key={visit.id}
                  date={visit.date}
                  complaint={visit.complaint}
                  diagnosis={visit.diagnosis}
                  doctor={visit.doctor}
                  onOpen={() => {
                    router.push({
                      pathname: "/visit-details",
                      params: {
                        visitId: visit.id,
                        patientId,
                      },
                    });
                  }}
                />
              ))}
            </View>
          ),
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centered: {
    alignItems: "center",
    justifyContent: "center",
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

  yearGroup: {
    gap: SPACING.md,
  },

  year: {
    fontSize: 22,
    fontWeight: "700",
  },

  loadingText: {
    marginTop: SPACING.sm,
    fontSize: 14,
  },
});
