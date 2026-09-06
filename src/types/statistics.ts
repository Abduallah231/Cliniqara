export interface StatisticsPerformance {
  averageVisitsPerDay: number;
  visitsThisWeek: number;
  visitsThisMonth: number;
}

export interface StatisticsAverageTimes {
  waitingMinutes: number;
  consultationMinutes: number;
}

export interface StatisticsRankingItem {
  id: string;
  name: string;
  count: number;
}

export interface StatisticsDiagnosisItem {
  code: string | null;
  name: string;
  count: number;
}

export interface StatisticsAgeDistributionItem {
  range: string;
  count: number;
  percentage: number;
}

export interface StatisticsGenderDistribution {
  male: number;
  female: number;
  malePercentage: number;
  femalePercentage: number;
}

export interface StatisticsDoctorPerformance {
  doctorId: string;
  doctorName: string;

  totalVisits: number;

  averageWaitingMinutes: number;
  minimumWaitingMinutes: number;
  maximumWaitingMinutes: number;

  averageConsultationMinutes: number;
  minimumConsultationMinutes: number;
  maximumConsultationMinutes: number;
}

export interface StatisticsYearlyItem {
  year: number;
  count: number;
}

export interface StatisticsMonthlyItem {
  year: number;
  month: number;
  count: number;
  averagePerDay: number;
}

export interface StatisticsVisitsOverview {
  total: number;
  yearly: StatisticsYearlyItem[];
  monthly: StatisticsMonthlyItem[];
}

export interface ClinicStatistics {
  clinicId: string;

  performance: StatisticsPerformance;

  averageTimes: StatisticsAverageTimes;

  topChiefComplaints: StatisticsRankingItem[];

  topDiagnoses: StatisticsDiagnosisItem[];

  ageDistribution: StatisticsAgeDistributionItem[];

  genderDistribution: StatisticsGenderDistribution;

  doctorPerformance: StatisticsDoctorPerformance[];

  visitsOverview: StatisticsVisitsOverview;
}