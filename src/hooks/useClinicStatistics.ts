import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { useClinicStore } from "@/store/clinicStore";
import { getClinicStatistics } from "@/services/statisticsApi";
import type { ClinicStatistics } from "@/types/statistics";

interface UseClinicStatisticsResult {
  statistics: ClinicStatistics | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isForbidden: boolean;
  refresh: () => Promise<void>;
}

export function useClinicStatistics(): UseClinicStatisticsResult {
  const currentClinicId = useClinicStore(
    (state) => state.currentClinicId,
  );

  const [statistics, setStatistics] =
    useState<ClinicStatistics | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  const loadStatistics = useCallback(
    async (isRefresh = false) => {
      if (!currentClinicId) {
        setStatistics(null);
        setLoading(false);
        setRefreshing(false);
        setError("No clinic selected.");
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
        const data = await getClinicStatistics(
          currentClinicId,
        );

        // Extra safety against a stale response from
        // a previously selected clinic.
        if (
          useClinicStore.getState().currentClinicId !==
          currentClinicId
        ) {
          return;
        }

        setStatistics(data);
      } catch (err) {
        if (
          axios.isAxiosError(err) &&
          err.response?.status === 403
        ) {
          setStatistics(null);
          setIsForbidden(true);
          setError(
            "Statistics are available only to the clinic owner.",
          );
        } else if (
          axios.isAxiosError(err) &&
          err.response?.status === 404
        ) {
          setStatistics(null);
          setError("Clinic membership was not found.");
        } else {
          setStatistics(null);
          setError(
            "Unable to load clinic statistics. Please try again.",
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentClinicId],
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