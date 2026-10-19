import { useCallback, useEffect, useState } from "react";
import { useClinicStore } from "@/store/clinicStore";
import { getClinicStatistics, getDoctorStatistics } from "@/services/statisticsApi";
import { useDoctorStore } from "@/store/doctorStore";
import type { ClinicStatistics } from "@/types/statistics";

interface UseClinicStatisticsResult {
  statistics: ClinicStatistics | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isForbidden: boolean;
  refresh: () => Promise<void>;
}

export function useClinicStatistics(scope: "clinic" | "doctor" = "clinic"): UseClinicStatisticsResult {
  const currentClinicId = useClinicStore(
    (state) => state.currentClinicId,
  );
  const doctorId = useDoctorStore((state) => state.doctor?.id ?? null);

  const [statistics, setStatistics] =
    useState<ClinicStatistics | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  const loadStatistics = useCallback(
    async (isRefresh = false) => {
      const scopeId = scope === "doctor" ? doctorId : currentClinicId;
      if (!scopeId) {
        setStatistics(null);
        setLoading(false);
        setRefreshing(false);
        setError(scope === "doctor" ? "Doctor profile is not available." : "No clinic selected.");
        setIsForbidden(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      setIsForbidden(false);

      try {
        const data = scope === "doctor"
          ? await getDoctorStatistics(scopeId)
          : await getClinicStatistics(scopeId);

        // Extra safety against a stale response from
        // a previously selected clinic.
        if (
          (scope === "clinic" && useClinicStore.getState().currentClinicId !== currentClinicId) ||
          (scope === "doctor" && useDoctorStore.getState().doctor?.id !== doctorId)
        ) {
          return;
        }

        setStatistics(data);
      } catch (err) {
        console.error("Failed to load local statistics:", err);
        setStatistics(null);
        setError("Unable to load local statistics. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentClinicId, doctorId, scope],
  );

  useEffect(() => {
    void loadStatistics(false);
  }, [loadStatistics]);

  const refresh = useCallback(async () => {
    await loadStatistics(true);
  }, [loadStatistics]);

  return {
    statistics,
    loading,
    refreshing,
    error,
    isForbidden,
    refresh,
  };
}
