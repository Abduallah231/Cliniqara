import {
  ClinicStatistics,
} from "@/types/statistics";
import { listLocalRecords } from "./localDatabase";
import type { Visit } from "@/types/visit";
import type { Patient } from "@/types/patient";

export async function getClinicStatistics(
  clinicId: string,
): Promise<ClinicStatistics> {
  const visits = (await listLocalRecords<Visit>("visits", clinicId)).map((row) => row.value);
  const patients = (await listLocalRecords<Patient>("patients", clinicId)).map((row) => row.value);
  const now = new Date();
  const thisWeek = visits.filter((visit) => now.getTime() - new Date(visit.visitDate).getTime() < 7 * 86400000).length;
  const thisMonth = visits.filter((visit) => new Date(visit.visitDate).getMonth() === now.getMonth() && new Date(visit.visitDate).getFullYear() === now.getFullYear()).length;
  const genderDistribution = {
    male: patients.filter((patient) => patient.gender === "MALE").length,
    female: patients.filter((patient) => patient.gender === "FEMALE").length,
    malePercentage: patients.length ? Math.round(patients.filter((patient) => patient.gender === "MALE").length * 100 / patients.length) : 0,
    femalePercentage: patients.length ? Math.round(patients.filter((patient) => patient.gender === "FEMALE").length * 100 / patients.length) : 0,
  };
  const yearlyCounts = new Map<number, number>();
  for (const visit of visits) {
    const year = new Date(visit.visitDate).getFullYear();
    yearlyCounts.set(year, (yearlyCounts.get(year) ?? 0) + 1);
  }
  return {
    clinicId,
    performance: { averageVisitsPerDay: thisMonth / Math.max(now.getDate(), 1), visitsThisWeek: thisWeek, visitsThisMonth: thisMonth },
    averageTimes: { waitingMinutes: 0, consultationMinutes: 0 },
    topChiefComplaints: [], topDiagnoses: [], ageDistribution: [], genderDistribution,
    doctorPerformance: [],
    visitsOverview: { total: visits.length, yearly: [...yearlyCounts].map(([year, count]) => ({ year, count })), monthly: [] },
  };
}
