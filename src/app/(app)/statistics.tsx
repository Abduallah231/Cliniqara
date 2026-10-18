import AppSafeAreaView from "@/components/common/AppSafeAreaView";
import AppPressable from "@/components/common/AppPressable";
import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { ActivityIndicator, RefreshControl, StyleSheet } from "react-native";
import { useState } from "react";

import StatisticsAgeDistribution from "@/components/statistics/StatisticsAgeDistribution";
import StatisticsAverageTimes from "@/components/statistics/StatisticsAverageTimes";
import StatisticsDoctorPerformance from "@/components/statistics/StatisticsDoctorPerformance";
import StatisticsGenderDistribution from "@/components/statistics/StatisticsGenderDistribution";
import StatisticsPerformance from "@/components/statistics/StatisticsPerformance";
import StatisticsRankingList from "@/components/statistics/StatisticsRankingList";
import StatisticsVisitsOverview from "@/components/statistics/StatisticsVisitsOverview";
import { useClinicStatistics } from "@/hooks/useClinicStatistics";
import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";

export default function StatisticsScreen() {
  const {
    statistics,
    loading,
    refreshing,
    error,
    isForbidden,
    refresh,
  } = useClinicStatistics();

  const [showAllComplaints, setShowAllComplaints] =
    useState(false);

  const [showAllDiagnoses, setShowAllDiagnoses] =
    useState(false);

  if (loading) {
    return (
      <AppSafeAreaView style={styles.safeArea}>
        <Header />

        <AppView style={styles.center}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <AppText style={styles.loadingText}>
            Loading statistics...
          </AppText>
        </AppView>
      </AppSafeAreaView>
    );
  }

  if (isForbidden) {
    return (
      <AppSafeAreaView style={styles.safeArea}>
        <Header />

        <AppView style={styles.center}>
          <AppView style={styles.accessIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={30}
              color={COLORS.danger}
            />
          </AppView>

          <AppText style={styles.accessTitle}>
            Access Denied
          </AppText>

          <AppText style={styles.accessText}>
            Statistics are available only to the
            clinic owner.
          </AppText>

          <AppPressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AppText style={styles.backButtonText}>
              Go Back
            </AppText>
          </AppPressable>
        </AppView>
      </AppSafeAreaView>
    );
  }

  if (error || !statistics) {
    return (
      <AppSafeAreaView style={styles.safeArea}>
        <Header />

        <AppView style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={42}
            color={COLORS.danger}
          />

          <AppText style={styles.errorTitle}>
            Unable to Load Statistics
          </AppText>

          <AppText style={styles.errorText}>
            {error ??
              "Something went wrong. Please try again."}
          </AppText>

          <AppPressable
            onPress={() => void refresh()}
            style={styles.backButton}
          >
            <AppText style={styles.backButtonText}>
              Try Again
            </AppText>
          </AppPressable>
        </AppView>
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <Header />

      <AppScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={COLORS.primary}
          />
        }
      >
        <AppText style={styles.pageTitle}>
          Clinic Statistics
        </AppText>

        <AppText style={styles.pageSubtitle}>
          Overview of visits and clinic performance
        </AppText>

        {/* ================================================= */}
        {/* Clinic Performance */}
        {/* ================================================= */}

        <SectionTitle title="Clinic Performance" />

        <StatisticsPerformance
          averageVisitsPerDay={
            statistics.performance
              .averageVisitsPerDay
          }
          visitsThisWeek={
            statistics.performance.visitsThisWeek
          }
          visitsThisMonth={
            statistics.performance.visitsThisMonth
          }
        />

        {/* ================================================= */}
        {/* Average Waiting & Consultation */}
        {/* ================================================= */}

        <SectionTitle title="Average Waiting & Consultation Time" />

        <StatisticsAverageTimes
          waitingMinutes={
            statistics.averageTimes
              .waitingMinutes
          }
          consultationMinutes={
            statistics.averageTimes
              .consultationMinutes
          }
        />

        {/* ================================================= */}
        {/* Chief Complaints */}
        {/* ================================================= */}

        <SectionTitle title="Top Chief Complaints" />

        <Card>
          <StatisticsRankingList
            items={
              statistics.topChiefComplaints
            }
            showAll={showAllComplaints}
            onToggleShowAll={() =>
              setShowAllComplaints(
                (value) => !value,
              )
            }
          />
        </Card>

        {/* ================================================= */}
        {/* Diagnoses */}
        {/* ================================================= */}

        <SectionTitle title="Top Diagnoses" />

        <Card>
          <StatisticsRankingList
            items={statistics.topDiagnoses}
            showAll={showAllDiagnoses}
            onToggleShowAll={() =>
              setShowAllDiagnoses(
                (value) => !value,
              )
            }
          />
        </Card>

        {/* ================================================= */}
        {/* Age */}
        {/* ================================================= */}

        <SectionTitle title="Age Distribution" />

        <Card>
          <StatisticsAgeDistribution
            items={
              statistics.ageDistribution
            }
          />
        </Card>

        {/* ================================================= */}
        {/* Gender */}
        {/* ================================================= */}

        <SectionTitle title="Gender Distribution" />

        <Card>
          <StatisticsGenderDistribution
            male={
              statistics.genderDistribution
                .male
            }
            female={
              statistics.genderDistribution
                .female
            }
            malePercentage={
              statistics.genderDistribution
                .malePercentage
            }
            femalePercentage={
              statistics.genderDistribution
                .femalePercentage
            }
          />
        </Card>

        {/* ================================================= */}
        {/* Doctor Performance */}
        {/* ================================================= */}

        <SectionTitle title="Doctor Performance" />

        <Card>
          <StatisticsDoctorPerformance
            doctors={
              statistics.doctorPerformance
            }
          />
        </Card>

        {/* ================================================= */}
        {/* Visits Overview */}
        {/* ================================================= */}

        <SectionTitle title="Visits Overview" />

        <Card>
          <StatisticsVisitsOverview
            data={
              statistics.visitsOverview
            }
          />
        </Card>

        <AppView style={styles.bottomSpace} />
      </AppScrollView>
    </AppSafeAreaView>
  );
}

function Header() {
  return (
    <AppView style={styles.header}>
      <AppPressable
        onPress={() => router.back()}
        hitSlop={10}
        style={styles.headerButton}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={COLORS.primary}
        />
      </AppPressable>

      <AppText style={styles.headerTitle}>
        Statistics
      </AppText>

      <AppView style={styles.headerButton} />
    </AppView>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <AppText style={styles.sectionTitle}>
      {title}
    </AppText>
  );
}

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppView style={styles.card}>
      {children}
    </AppView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: TYPOGRAPHY.subHeading,
    fontWeight: "700",
    color: COLORS.text,
  },

  content: {
    padding: 16,
  },

  pageTitle: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },

  pageSubtitle: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: TYPOGRAPHY.subHeading,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  accessIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  accessTitle: {
    marginTop: 16,
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
  },

  accessText: {
    marginTop: 8,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 23,
    color: COLORS.secondaryText,
    textAlign: "center",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 22,
  },

  backButtonText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.white,
  },

  errorTitle: {
    marginTop: 12,
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  errorText: {
    marginTop: 8,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 21,
    color: COLORS.secondaryText,
    textAlign: "center",
  },

  bottomSpace: {
    height: 20,
  },
});