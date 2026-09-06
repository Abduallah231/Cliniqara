import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
      <SafeAreaView style={styles.safeArea}>
        <Header />

        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text style={styles.loadingText}>
            Loading statistics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isForbidden) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />

        <View style={styles.center}>
          <View style={styles.accessIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={30}
              color={COLORS.danger}
            />
          </View>

          <Text style={styles.accessTitle}>
            Access Denied
          </Text>

          <Text style={styles.accessText}>
            Statistics are available only to the
            clinic owner.
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !statistics) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />

        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={42}
            color={COLORS.danger}
          />

          <Text style={styles.errorTitle}>
            Unable to Load Statistics
          </Text>

          <Text style={styles.errorText}>
            {error ??
              "Something went wrong. Please try again."}
          </Text>

          <Pressable
            onPress={() => void refresh()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <ScrollView
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
        <Text style={styles.pageTitle}>
          Clinic Statistics
        </Text>

        <Text style={styles.pageSubtitle}>
          Overview of visits and clinic performance
        </Text>

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

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={10}
        style={styles.headerButton}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={COLORS.primary}
        />
      </Pressable>

      <Text style={styles.headerTitle}>
        Statistics
      </Text>

      <View style={styles.headerButton} />
    </View>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      {children}
    </View>
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