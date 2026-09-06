import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ClinicRole,
  MembershipStatus,
  VisitStatus,
} from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

import {
  ClinicStatistics,
  StatisticsAgeDistributionItem,
  StatisticsDiagnosisItem,
  StatisticsDoctorPerformance,
  StatisticsGenderDistribution,
  StatisticsRankingItem,
} from "./types/statistics.types";

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // Main
  // =========================================================

  async getClinicStatistics(
    clinicId: string,
    currentUserId: string,
  ): Promise<ClinicStatistics> {
    await this.assertClinicOwner(
      clinicId,
      currentUserId,
    );

    const now = new Date();

    const startOfWeek =
      this.getStartOfWeek(now);

    const startOfMonth =
      this.getStartOfMonth(now);

    const startOfNextMonth =
      this.getStartOfNextMonth(now);

    const [
      performanceVisits,
      timeVisits,
      rankingVisits,
      demographicVisits,
      doctorVisits,
      overviewVisits,
    ] = await Promise.all([
      this.getPerformanceVisits(
        clinicId,
        startOfWeek,
        startOfMonth,
        startOfNextMonth,
      ),

      this.getTimeVisits(clinicId),

      this.getRankingVisits(clinicId),

      this.getDemographicVisits(clinicId),

      this.getDoctorVisits(clinicId),

      this.getOverviewVisits(clinicId),
    ]);

    return {
      clinicId,

      performance: this.buildPerformance(
        performanceVisits,
        now,
        startOfMonth,
        startOfNextMonth,
      ),

      averageTimes:
        this.buildAverageTimes(timeVisits),

      topChiefComplaints:
        this.buildChiefComplaintRanking(
          rankingVisits,
        ),

      topDiagnoses:
        this.buildDiagnosisRanking(
          rankingVisits,
        ),

      ageDistribution:
        this.buildAgeDistribution(
          demographicVisits,
        ),

      genderDistribution:
        this.buildGenderDistribution(
          demographicVisits,
        ),

      doctorPerformance:
        this.buildDoctorPerformance(
          doctorVisits,
        ),

      visitsOverview:
        this.buildVisitsOverview(
          overviewVisits,
        ),
    };
  }

  // =========================================================
  // Authorization
  // =========================================================

  private async assertClinicOwner(
    clinicId: string,
    currentUserId: string,
  ): Promise<void> {
    const membership =
      await this.prisma.clinicMember.findUnique({
        where: {
          clinicId_userId: {
            clinicId,
            userId: currentUserId,
          },
        },
        select: {
          status: true,
          clinicRole: true,
        },
      });

    if (
      !membership ||
      membership.status !== MembershipStatus.ACTIVE
    ) {
      throw new NotFoundException(
        "Clinic membership not found.",
      );
    }

    if (
      membership.clinicRole !== ClinicRole.OWNER
    ) {
      throw new ForbiddenException(
        "Statistics are available only to the clinic owner.",
      );
    }
  }

  // =========================================================
  // Clinic Performance
  // =========================================================

  private async getPerformanceVisits(
    clinicId: string,
    startOfWeek: Date,
    startOfMonth: Date,
    startOfNextMonth: Date,
  ) {
    return this.prisma.visit.findMany({
      where: {
        clinicId,

        visitStatus: {
          not: VisitStatus.CANCELLED,
        },

        visitDate: {
          gte: startOfWeek,
          lt: startOfNextMonth,
        },
      },

      select: {
        visitDate: true,
      },
    });
  }

  private buildPerformance(
    visits: { visitDate: Date }[],
    now: Date,
    startOfMonth: Date,
    startOfNextMonth: Date,
  ) {
    const startOfWeek =
      this.getStartOfWeek(now);

    const visitsThisWeek = visits.filter(
      (visit) =>
        visit.visitDate >= startOfWeek,
    ).length;

    const visitsThisMonth = visits.filter(
      (visit) =>
        visit.visitDate >= startOfMonth &&
        visit.visitDate < startOfNextMonth,
    ).length;

    const elapsedDays = Math.max(
      1,
      Math.ceil(
        (
          now.getTime() -
          startOfMonth.getTime()
        ) /
          (1000 * 60 * 60 * 24),
      ),
    );

    return {
      averageVisitsPerDay: this.round(
        visitsThisMonth / elapsedDays,
      ),

      visitsThisWeek,

      visitsThisMonth,
    };
  }

  // =========================================================
  // Average Waiting / Consultation
  // =========================================================

  private async getTimeVisits(
    clinicId: string,
  ) {
    return this.prisma.visit.findMany({
      where: {
        clinicId,

        visitStatus: {
          not: VisitStatus.CANCELLED,
        },

        startedAt: {
          not: null,
        },
      },

      select: {
        createdAt: true,
        startedAt: true,
        completedAt: true,
      },
    });
  }

  private buildAverageTimes(
    visits: {
      createdAt: Date;
      startedAt: Date | null;
      completedAt: Date | null;
    }[],
  ) {
    const waitingTimes: number[] = [];

    const consultationTimes: number[] = [];

    for (const visit of visits) {
      // Waiting time
      if (visit.startedAt) {
        const waiting =
          visit.startedAt.getTime() -
          visit.createdAt.getTime();

        if (waiting >= 0) {
          waitingTimes.push(
            waiting / (1000 * 60),
          );
        }
      }

      // Consultation time
      if (
        visit.startedAt &&
        visit.completedAt
      ) {
        const consultation =
          visit.completedAt.getTime() -
          visit.startedAt.getTime();

        if (consultation >= 0) {
          consultationTimes.push(
            consultation / (1000 * 60),
          );
        }
      }
    }

    return {
      waitingMinutes:
        this.average(waitingTimes),

      consultationMinutes:
        this.average(
          consultationTimes,
        ),
    };
  }

  // =========================================================
  // Chief Complaint / Diagnosis
  // =========================================================

  private async getRankingVisits(
    clinicId: string,
  ) {
    return this.prisma.visit.findMany({
      where: {
        clinicId,

        visitStatus: {
          not: VisitStatus.CANCELLED,
        },
      },

      select: {
        chiefComplaint: {
          select: {
            chiefComplaint: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        diagnosis: {
          select: {
            primaryDiagnosisCode: true,
            primaryDiagnosisName: true,
          },
        },
      },
    });
  }

  private buildChiefComplaintRanking(
    visits: Awaited<
      ReturnType<
        StatisticsService["getRankingVisits"]
      >
    >,
  ): StatisticsRankingItem[] {
    const counts = new Map<
      string,
      StatisticsRankingItem
    >();

    for (const visit of visits) {
      const complaint =
        visit.chiefComplaint?.chiefComplaint;

      if (!complaint) {
        continue;
      }

      const existing =
        counts.get(complaint.id);

      if (existing) {
        existing.count += 1;
        continue;
      }

      counts.set(complaint.id, {
        id: complaint.id,
        name: complaint.name,
        count: 1,
      });
    }

    return [...counts.values()].sort(
      (a, b) => b.count - a.count,
    );
  }

  private buildDiagnosisRanking(
    visits: Awaited<
      ReturnType<
        StatisticsService["getRankingVisits"]
      >
    >,
  ): StatisticsDiagnosisItem[] {
    const counts = new Map<
      string,
      StatisticsDiagnosisItem
    >();

    for (const visit of visits) {
      const name =
        visit.diagnosis?.primaryDiagnosisName?.trim();

      if (!name) {
        continue;
      }

      const code =
        visit.diagnosis?.primaryDiagnosisCode?.trim() ||
        null;

      const key = `${code ?? ""}|${name}`;

      const existing = counts.get(key);

      if (existing) {
        existing.count += 1;
        continue;
      }

      counts.set(key, {
        code,
        name,
        count: 1,
      });
    }

    return [...counts.values()].sort(
      (a, b) => b.count - a.count,
    );
  }

  // =========================================================
  // Age / Gender
  // =========================================================

  private async getDemographicVisits(
    clinicId: string,
  ) {
    return this.prisma.visit.findMany({
      where: {
        clinicId,

        visitStatus: {
          not: VisitStatus.CANCELLED,
        },
      },

      select: {
        patient: {
          select: {
            dateOfBirth: true,
            estimatedAgeValue: true,
            estimatedAgeUnit: true,
            gender: true,
          },
        },
      },
    });
  }

  private buildAgeDistribution(
    visits: Awaited<
      ReturnType<
        StatisticsService["getDemographicVisits"]
      >
    >,
  ): StatisticsAgeDistributionItem[] {
    const buckets = [
      { range: "0–6 months", count: 0 },
      { range: "6 months–2 years", count: 0 },
      { range: "2–6 years", count: 0 },
      { range: "6–12 years", count: 0 },
      { range: "12–18 years", count: 0 },
      { range: "18–25 years", count: 0 },
      { range: "25–35 years", count: 0 },
      { range: "35–45 years", count: 0 },
      { range: "45–55 years", count: 0 },
      { range: "55–65 years", count: 0 },
      { range: "65–75 years", count: 0 },
      { range: "75+", count: 0 },
    ];

    for (const visit of visits) {
      const ageInMonths =
        this.getAgeInMonths(
          visit.patient,
        );

      if (ageInMonths === null) {
        continue;
      }

      const bucketIndex =
        this.getAgeBucketIndex(
          ageInMonths,
        );

      if (bucketIndex === null) {
        continue;
      }

      buckets[bucketIndex].count += 1;
    }

    const total = buckets.reduce(
      (sum, bucket) =>
        sum + bucket.count,
      0,
    );

    return buckets.map((bucket) => ({
      range: bucket.range,

      count: bucket.count,

      percentage:
        total > 0
          ? this.round(
              (bucket.count / total) *
                100,
            )
          : 0,
    }));
  }

  private getAgeInMonths(
    patient: {
      dateOfBirth: Date | null;
      estimatedAgeValue: number | null;
      estimatedAgeUnit: string | null;
    },
  ): number | null {
    if (patient.dateOfBirth) {
      const now = new Date();

      let months =
        (now.getFullYear() -
          patient.dateOfBirth.getFullYear()) *
          12 +
        (now.getMonth() -
          patient.dateOfBirth.getMonth());

      if (
        now.getDate() <
        patient.dateOfBirth.getDate()
      ) {
        months -= 1;
      }

      return Math.max(0, months);
    }

    if (
      patient.estimatedAgeValue === null ||
      !patient.estimatedAgeUnit
    ) {
      return null;
    }

    const value =
      patient.estimatedAgeValue;

    const unit =
      patient.estimatedAgeUnit
        .toLowerCase()
        .trim();

    if (
      unit === "month" ||
      unit === "months"
    ) {
      return value;
    }

    if (
      unit === "year" ||
      unit === "years"
    ) {
      return value * 12;
    }

    if (
      unit === "week" ||
      unit === "weeks"
    ) {
      return value / 4.345;
    }

    if (
      unit === "day" ||
      unit === "days"
    ) {
      return value / 30.4375;
    }

    return null;
  }

  private getAgeBucketIndex(
    months: number,
  ): number | null {
    if (months <= 6) return 0;
    if (months <= 24) return 1;
    if (months <= 72) return 2;
    if (months <= 144) return 3;
    if (months <= 216) return 4;
    if (months <= 300) return 5;
    if (months <= 420) return 6;
    if (months <= 540) return 7;
    if (months <= 660) return 8;
    if (months <= 780) return 9;
    if (months <= 900) return 10;

    return 11;
  }

  private buildGenderDistribution(
    visits: Awaited<
      ReturnType<
        StatisticsService["getDemographicVisits"]
      >
    >,
  ): StatisticsGenderDistribution {
    let male = 0;
    let female = 0;

    for (const visit of visits) {
      if (visit.patient.gender === "MALE") {
        male += 1;
      }

      if (
        visit.patient.gender === "FEMALE"
      ) {
        female += 1;
      }
    }

    const total = male + female;

    return {
      male,
      female,

      malePercentage:
        total > 0
          ? this.round(
              (male / total) * 100,
            )
          : 0,

      femalePercentage:
        total > 0
          ? this.round(
              (female / total) * 100,
            )
          : 0,
    };
  }

  // =========================================================
  // Doctor Performance
  // =========================================================

  private async getDoctorVisits(
    clinicId: string,
  ) {
    return this.prisma.visit.findMany({
      where: {
        clinicId,

        visitStatus: {
          not: VisitStatus.CANCELLED,
        },
      },

      select: {
        doctorId: true,

        doctor: {
          select: {
            id: true,
            fullName: true,
          },
        },

        createdAt: true,
        startedAt: true,
        completedAt: true,
      },
    });
  }

  private buildDoctorPerformance(
    visits: Awaited<
      ReturnType<
        StatisticsService["getDoctorVisits"]
      >
    >,
  ): StatisticsDoctorPerformance[] {
    const doctors = new Map<
      string,
      {
        doctorId: string;
        doctorName: string;
        totalVisits: number;
        waitingTimes: number[];
        consultationTimes: number[];
      }
    >();

    for (const visit of visits) {
      let doctor =
        doctors.get(visit.doctorId);

      if (!doctor) {
        doctor = {
          doctorId: visit.doctorId,
          doctorName:
            visit.doctor.fullName,
          totalVisits: 0,
          waitingTimes: [],
          consultationTimes: [],
        };

        doctors.set(
          visit.doctorId,
          doctor,
        );
      }

      doctor.totalVisits += 1;

      if (visit.startedAt) {
        const waiting =
          visit.startedAt.getTime() -
          visit.createdAt.getTime();

        if (waiting >= 0) {
          doctor.waitingTimes.push(
            waiting / (1000 * 60),
          );
        }
      }

      if (
        visit.startedAt &&
        visit.completedAt
      ) {
        const consultation =
          visit.completedAt.getTime() -
          visit.startedAt.getTime();

        if (consultation >= 0) {
          doctor.consultationTimes.push(
            consultation /
              (1000 * 60),
          );
        }
      }
    }

    return [...doctors.values()]
      .map((doctor) => ({
        doctorId: doctor.doctorId,

        doctorName:
          doctor.doctorName,

        totalVisits:
          doctor.totalVisits,

        averageWaitingMinutes:
          this.average(
            doctor.waitingTimes,
          ),

        minimumWaitingMinutes:
          this.minimum(
            doctor.waitingTimes,
          ),

        maximumWaitingMinutes:
          this.maximum(
            doctor.waitingTimes,
          ),

        averageConsultationMinutes:
          this.average(
            doctor.consultationTimes,
          ),

        minimumConsultationMinutes:
          this.minimum(
            doctor.consultationTimes,
          ),

        maximumConsultationMinutes:
          this.maximum(
            doctor.consultationTimes,
          ),
      }))
      .sort(
        (a, b) =>
          b.totalVisits -
          a.totalVisits,
      );
  }

  // =========================================================
  // Visits Overview
  // =========================================================

  private async getOverviewVisits(
    clinicId: string,
  ) {
    return this.prisma.visit.findMany({
      where: {
        clinicId,

        visitStatus: {
          not: VisitStatus.CANCELLED,
        },
      },

      select: {
        visitDate: true,
      },

      orderBy: {
        visitDate: "asc",
      },
    });
  }

  private buildVisitsOverview(
    visits: { visitDate: Date }[],
  ) {
    const yearlyMap = new Map<
      number,
      number
    >();

    const monthlyMap = new Map<
      string,
      {
        year: number;
        month: number;
        count: number;
      }
    >();

    for (const visit of visits) {
      const year =
        visit.visitDate.getFullYear();

      const month =
        visit.visitDate.getMonth() + 1;

      yearlyMap.set(
        year,
        (yearlyMap.get(year) ?? 0) + 1,
      );

      const key = `${year}-${month}`;

      const existing =
        monthlyMap.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        monthlyMap.set(key, {
          year,
          month,
          count: 1,
        });
      }
    }

    const yearly = [
      ...yearlyMap.entries(),
    ]
      .map(([year, count]) => ({
        year,
        count,
      }))
      .sort(
        (a, b) => a.year - b.year,
      );

    const monthly = [
      ...monthlyMap.values(),
    ]
      .sort(
        (a, b) =>
          a.year - b.year ||
          a.month - b.month,
      )
      .map((item) => ({
        year: item.year,

        month: item.month,

        count: item.count,

        averagePerDay:
          this.round(
            item.count /
              this.getDaysInMonth(
                item.year,
                item.month,
              ),
          ),
      }));

    return {
      total: visits.length,
      yearly,
      monthly,
    };
  }

  // =========================================================
  // Date Helpers
  // =========================================================

  private getStartOfWeek(
    date: Date,
  ): Date {
    const result = new Date(date);

    result.setHours(
      0,
      0,
      0,
      0,
    );

    const day =
      result.getDay();

    // Monday = first day
    const diff =
      day === 0
        ? -6
        : 1 - day;

    result.setDate(
      result.getDate() + diff,
    );

    return result;
  }

  private getStartOfMonth(
    date: Date,
  ): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
    );
  }

  private getStartOfNextMonth(
    date: Date,
  ): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1,
    );
  }

  private getDaysInMonth(
    year: number,
    month: number,
  ): number {
    return new Date(
      year,
      month,
      0,
    ).getDate();
  }

  // =========================================================
  // Math Helpers
  // =========================================================

  private average(
    values: number[],
  ): number {
    if (values.length === 0) {
      return 0;
    }

    return this.round(
      values.reduce(
        (sum, value) =>
          sum + value,
        0,
      ) / values.length,
    );
  }

  private minimum(
    values: number[],
  ): number {
    if (values.length === 0) {
      return 0;
    }

    return this.round(
      Math.min(...values),
    );
  }

  private maximum(
    values: number[],
  ): number {
    if (values.length === 0) {
      return 0;
    }

    return this.round(
      Math.max(...values),
    );
  }

  private round(
    value: number,
  ): number {
    return Math.round(
      value * 100,
    ) / 100;
  }
}