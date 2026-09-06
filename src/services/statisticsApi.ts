import { api } from "./api";

import {
  ClinicStatistics,
} from "@/types/statistics";

export async function getClinicStatistics(
  clinicId: string,
): Promise<ClinicStatistics> {
  const { data } =
    await api.get<ClinicStatistics>(
      `/clinics/${clinicId}/statistics`,
    );

  return data;
}