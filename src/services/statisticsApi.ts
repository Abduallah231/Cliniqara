import { useDoctorStore } from "@/store/doctorStore";
import type { Patient } from "@/types/patient";
import type { ClinicStatistics } from "@/types/statistics";
import type { Visit } from "@/types/visit";
import { getChiefComplaints } from "./chiefComplaintApi";
import { listLocalRecords } from "./localDatabase";

type SavedComplaint = {
  chiefComplaintId?: string;
};

type SavedDiagnosis = {
  primaryDiagnosisCode?: string | null;
  primaryDiagnosisName?: string | null;
};

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

function validDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function countBy<T>(items: T[], key: (item: T) => string | null | undefined) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const value = key(item)?.trim();
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function ageInYears(patient: Patient, now: Date): number | null {
  if (typeof patient.estimatedAgeValue === "number" && patient.estimatedAgeValue >= 0) {
    if (patient.estimatedAgeUnit === "DAYS") return patient.estimatedAgeValue / 365.25;
    if (patient.estimatedAgeUnit === "MONTHS") return patient.estimatedAgeValue / 12;
    if (patient.estimatedAgeUnit === "YEARS") return patient.estimatedAgeValue;
  }

  const birthDate = validDate(patient.dateOfBirth);
  if (!birthDate || birthDate > now) return null;
  return (now.getTime() - birthDate.getTime()) / (365.25 * DAY);
}

function durationMinutes(start?: string | null, end?: string | null): number | null {
  const startDate = validDate(start);
  const endDate = validDate(end);
  if (!startDate || !endDate || endDate < startDate) return null;
  return (endDate.getTime() - startDate.getTime()) / MINUTE;
}

function average(values: number[]): number {
  return values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

async function calculateStatistics(scope: { clinicId?: string; doctorId?: string }, id: string): Promise<ClinicStatistics> {
  // Keep SQLite reads sequential; this avoids overlapping reads on the Expo connection.
  const visitRecords = await listLocalRecords<Visit>("visits", scope.clinicId);
  const patientRecords = await listLocalRecords<Patient>("patients", scope.clinicId);
  const complaintRecords = await listLocalRecords<SavedComplaint>("visit_chief-complaint", scope.clinicId);
  const diagnosisRecords = await listLocalRecords<SavedDiagnosis>("visit_diagnosis", scope.clinicId);

  const visits = visitRecords
    .map((record) => record.value)
    .filter((visit) => visit.visitStatus === "COMPLETED" && (!scope.doctorId || visit.doctorId === scope.doctorId));
  const activeVisitIds = new Set(visits.map((visit) => visit.id));
  const patientIds = new Set(visits.map((visit) => visit.patientId));
  const patients = patientRecords.map((record) => record.value).filter((patient) => patientIds.has(patient.id));
  const complaints = await getChiefComplaints();
  const complaintNames = new Map(complaints.map((item) => [item.id, item.name]));
  const complaintCounts = countBy(
    complaintRecords
    .filter((record) => activeVisitIds.has(record.parentId ?? record.id))
      .map((record) => record.value),
    (item) => item.chiefComplaintId,
  );
  const diagnosisCounts = new Map<string, { code: string | null; name: string; count: number }>();

  for (const record of diagnosisRecords) {
    if (!activeVisitIds.has(record.parentId ?? record.id)) continue;
    const { value } = record;
    const name = value.primaryDiagnosisName?.trim();
    if (!name) continue;
    const current = diagnosisCounts.get(name);
    diagnosisCounts.set(name, {
      code: value.primaryDiagnosisCode ?? current?.code ?? null,
      name,
      count: (current?.count ?? 0) + 1,
    });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 6 * DAY);
  const thisMonth = visits.filter((visit) => {
    const date = validDate(visit.visitDate);
    return date?.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
  const thisWeek = visits.filter((visit) => {
    const date = validDate(visit.visitDate);
    return Boolean(date && date >= weekStart && date < new Date(todayStart.getTime() + DAY));
  });

  const waitingByDoctor = new Map<string, number[]>();
  const consultationByDoctor = new Map<string, number[]>();
  const doctorVisitCounts = new Map<string, number>();
  const waitingDurations: number[] = [];
  const consultationDurations: number[] = [];
  for (const visit of visits) {
    doctorVisitCounts.set(visit.doctorId, (doctorVisitCounts.get(visit.doctorId) ?? 0) + 1);
    const waiting = durationMinutes(visit.visitDate, visit.startedAt);
    const consultation = durationMinutes(visit.startedAt, visit.completedAt);
    if (waiting !== null) {
      waitingDurations.push(waiting);
      waitingByDoctor.set(visit.doctorId, [...(waitingByDoctor.get(visit.doctorId) ?? []), waiting]);
    }
    if (consultation !== null) {
      consultationDurations.push(consultation);
      consultationByDoctor.set(visit.doctorId, [...(consultationByDoctor.get(visit.doctorId) ?? []), consultation]);
    }
  }

  const doctor = useDoctorStore.getState().doctor;
  const doctorPerformance = [...doctorVisitCounts.entries()].map(([doctorId, totalVisits]) => {
    const waiting = waitingByDoctor.get(doctorId) ?? [];
    const consultation = consultationByDoctor.get(doctorId) ?? [];
    return {
      doctorId,
      doctorName: doctor?.id === doctorId ? doctor.fullName : "Doctor",
      totalVisits,
      averageWaitingMinutes: average(waiting),
      minimumWaitingMinutes: waiting.length ? Math.round(Math.min(...waiting)) : 0,
      maximumWaitingMinutes: waiting.length ? Math.round(Math.max(...waiting)) : 0,
      averageConsultationMinutes: average(consultation),
      minimumConsultationMinutes: consultation.length ? Math.round(Math.min(...consultation)) : 0,
      maximumConsultationMinutes: consultation.length ? Math.round(Math.max(...consultation)) : 0,
    };
  }).sort((a, b) => b.totalVisits - a.totalVisits);

  const ageBuckets = [
    { range: "Under 1", count: 0 },
    { range: "1–12", count: 0 },
    { range: "13–17", count: 0 },
    { range: "18–39", count: 0 },
    { range: "40–64", count: 0 },
    { range: "65+", count: 0 },
  ];
  for (const patient of patients) {
    const age = ageInYears(patient, now);
    if (age === null) continue;
    const index = age < 1 ? 0 : age <= 12 ? 1 : age <= 17 ? 2 : age <= 39 ? 3 : age <= 64 ? 4 : 5;
    ageBuckets[index].count += 1;
  }
  const knownAges = ageBuckets.reduce((sum, item) => sum + item.count, 0);

  const monthlyCounts = new Map<string, { year: number; month: number; count: number }>();
  const yearlyCounts = new Map<number, number>();
  for (const visit of visits) {
    const date = validDate(visit.visitDate);
    if (!date) continue;
    const year = date.getFullYear();
    const month = date.getMonth();
    yearlyCounts.set(year, (yearlyCounts.get(year) ?? 0) + 1);
    const key = dateKey(date);
    const item = monthlyCounts.get(key) ?? { year, month: month + 1, count: 0 };
    item.count += 1;
    monthlyCounts.set(key, item);
  }

  const male = patients.filter((patient) => patient.gender === "MALE").length;
  const female = patients.filter((patient) => patient.gender === "FEMALE").length;
  const genderTotal = male + female;

  return {
    clinicId: id,
    performance: {
      averageVisitsPerDay: Math.round((thisMonth.length / Math.max(now.getDate(), 1)) * 10) / 10,
      visitsThisWeek: thisWeek.length,
      visitsThisMonth: thisMonth.length,
    },
    averageTimes: {
      waitingMinutes: average(waitingDurations),
      consultationMinutes: average(consultationDurations),
    },
    topChiefComplaints: [...complaintCounts.entries()]
      .map(([id, count]) => ({ id, name: complaintNames.get(id) ?? id, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    topDiagnoses: [...diagnosisCounts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    ageDistribution: ageBuckets.map((item) => ({
      ...item,
      percentage: knownAges ? Math.round((item.count * 100) / knownAges) : 0,
    })),
    genderDistribution: {
      male,
      female,
      malePercentage: genderTotal ? Math.round((male * 100) / genderTotal) : 0,
      femalePercentage: genderTotal ? Math.round((female * 100) / genderTotal) : 0,
    },
    doctorPerformance,
    visitsOverview: {
      total: visits.length,
      yearly: [...yearlyCounts].map(([year, count]) => ({ year, count })).sort((a, b) => a.year - b.year),
      monthly: [...monthlyCounts.values()]
        .map((item) => ({
          ...item,
          averagePerDay: Math.round((item.count / (item.year === now.getFullYear() && item.month === now.getMonth() + 1
            ? now.getDate()
            : new Date(item.year, item.month, 0).getDate())) * 10) / 10,
        }))
        .sort((a, b) => a.year - b.year || a.month - b.month),
    },
  };
}

export function getClinicStatistics(clinicId: string): Promise<ClinicStatistics> {
  return calculateStatistics({ clinicId }, clinicId);
}

export function getDoctorStatistics(doctorId: string): Promise<ClinicStatistics> {
  return calculateStatistics({ doctorId }, `doctor:${doctorId}`);
}

export async function getTopChiefComplaintIds(clinicId: string, limit = 5): Promise<string[]> {
  const records = await listLocalRecords<SavedComplaint>("visit_chief-complaint", clinicId);
  const visits = await listLocalRecords<Visit>("visits", clinicId);
  const activeVisitIds = new Set(visits
    .map((record) => record.value)
    .filter((visit) => visit.visitStatus === "COMPLETED")
    .map((visit) => visit.id));
  const counts = countBy(
    records
      .filter((record) => activeVisitIds.has(record.parentId ?? record.id))
      .map((record) => record.value),
    (item) => item.chiefComplaintId,
  );
  const defaults = ["fever", "cough", "abdominal-pain", "chest-pain", "dyspnea", "headache", "vomiting", "diarrhea", "palpitations", "dizziness"];
  return [
    ...[...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([id]) => id),
    ...defaults.filter((id) => !counts.has(id)),
  ].slice(0, limit);
}

export async function getTopDiagnosisNames(clinicId: string, limit = 5): Promise<string[]> {
  const records = await listLocalRecords<SavedDiagnosis>("visit_diagnosis", clinicId);
  const visits = await listLocalRecords<Visit>("visits", clinicId);
  const activeVisitIds = new Set(visits
    .map((record) => record.value)
    .filter((visit) => visit.visitStatus === "COMPLETED")
    .map((visit) => visit.id));
  const counts = new Map<string, number>();
  for (const record of records) {
    if (!activeVisitIds.has(record.parentId ?? record.id)) continue;
    const { value } = record;
    const name = value.primaryDiagnosisName?.trim();
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const defaults = ["Hypertension", "Acute Bronchitis", "Upper Respiratory Tract Infection", "Gastroesophageal Reflux Disease (GERD)", "Type 2 Diabetes Mellitus"];
  return [
    ...[...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name]) => name),
    ...defaults.filter((name) => !counts.has(name)),
  ].slice(0, limit);
}
