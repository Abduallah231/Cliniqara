import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppCard from "@/components/common/AppCard";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";
import Divider from "@/components/common/Divider";
import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY
} from "@/theme";

export default function StatisticsScreen() {
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Statistics"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <SectionHeader title="Clinic Snapshot" />

        <View style={styles.snapshotGrid}>

          <AppCard style={styles.metricCard}>
            <Ionicons
              name="people-outline"
              size={26}
              color={COLORS.primary}
            />
            <Text style={styles.metricValue}>
              1,254
            </Text>
            <Text style={styles.metricLabel}>
              Total Patients
            </Text>
          </AppCard>

          <AppCard style={styles.metricCard}>
            <Ionicons
              name="medkit-outline"
              size={26}
              color={COLORS.primary}
            />
            <Text style={styles.metricValue}>
              3,846
            </Text>
            <Text style={styles.metricLabel}>
              Total Visits
            </Text>
          </AppCard>

          <AppCard style={styles.metricCard}>
            <Ionicons
              name="person-add-outline"
              size={26}
              color={COLORS.primary}
            />
            <Text style={styles.metricValue}>
              42
            </Text>
            <Text style={styles.metricLabel}>
              New Patients
            </Text>
          </AppCard>

          <AppCard style={styles.metricCard}>
            <Ionicons
              name="repeat-outline"
              size={26}
              color={COLORS.primary}
            />
            <Text style={styles.metricValue}>
              118
            </Text>
            <Text style={styles.metricLabel}>
              Follow-up Visits
            </Text>
          </AppCard>

          <AppCard style={styles.metricWideCard}>
            <Ionicons
              name="calendar-outline"
              size={26}
              color={COLORS.primary}
            />
            <Text style={styles.metricValue}>
              27
            </Text>
            <Text style={styles.metricLabel}>
              Average Visits / Day
            </Text>
          </AppCard>

        </View>

        <SectionHeader title="Top Diagnoses" />

        <AppCard>
          <Text>HTN</Text>
        </AppCard>

        <SectionHeader title="Chief Complaints" />

        <AppCard>
          <Text>Fever</Text>
        </AppCard>
                <SectionHeader title="Patient Demographics" />

        <AppCard style={styles.demographicsCard}>

          <View style={styles.demographicItem}>
            <Ionicons
              name="male-outline"
              size={28}
              color={COLORS.primary}
            />
            <Text style={styles.metricValue}>
              58%
            </Text>
            <Text style={styles.metricLabel}>
              Male
            </Text>
          </View>

          <Divider />

          <View style={styles.demographicItem}>
            <Ionicons
              name="female-outline"
              size={28}
              color={COLORS.primary}
            />
            <Text style={styles.metricValue}>
              42%
            </Text>
            <Text style={styles.metricLabel}>
              Female
            </Text>
          </View>

        </AppCard>

        <AppCard style={styles.ageCard}>

          <Text style={styles.cardTitle}>
            Age Distribution
          </Text>

        </AppCard>

        <SectionHeader title="Average Waiting Time" />

        <AppCard>

          <View style={styles.twoColumn}>

            <View style={styles.metricBox}>
              <Ionicons
                name="time-outline"
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.metricValue}>
                18 min
              </Text>

              <Text style={styles.metricLabel}>
                Waiting Time
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Ionicons
                name="medkit-outline"
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.metricValue}>
                12 min
              </Text>

              <Text style={styles.metricLabel}>
                Consultation
              </Text>
            </View>

          </View>

        </AppCard>

        <SectionHeader title="Follow-up Rate" />

        <AppCard>

          <View style={styles.twoColumn}>

            <View style={styles.metricBox}>
              <Ionicons
                name="repeat-outline"
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.metricValue}>
                64%
              </Text>

              <Text style={styles.metricLabel}>
                Follow-up Rate
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Ionicons
                name="people-outline"
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.metricValue}>
                35 / 65
              </Text>

              <Text style={styles.metricLabel}>
                New / Follow-up
              </Text>
            </View>

          </View>

        </AppCard>
                <SectionHeader title="Clinical Performance" />

        <AppCard>

          <View style={styles.twoColumn}>

            <View style={styles.metricBox}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.metricValue}>
                27
              </Text>

              <Text style={styles.metricLabel}>
                Avg Patients / Day
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Ionicons
                name="today-outline"
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.metricValue}>
                134
              </Text>

              <Text style={styles.metricLabel}>
                This Week
              </Text>
            </View>

          </View>

          <View style={styles.spacer} />

          <View style={styles.twoColumn}>

            <View style={styles.metricBox}>
              <Ionicons
                name="calendar-clear-outline"
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.metricValue}>
                542
              </Text>

              <Text style={styles.metricLabel}>
                This Month
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Ionicons
                name="checkmark-done-outline"
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.metricValue}>
                81%
              </Text>

              <Text style={styles.metricLabel}>
                Follow-up Compliance
              </Text>
            </View>

          </View>

        </AppCard>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },

  snapshotGrid: {
    gap: SPACING.sm,
  },

  metricCard: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    gap: SPACING.sm,
    ...SHADOW,
  },

  metricWideCard: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    gap: SPACING.sm,
    ...SHADOW,
  },

  metricValue: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },

  metricLabel: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    textAlign: "center",
  },

  demographicsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    ...SHADOW,
  },

  demographicItem: {
    flex: 1,
    alignItems: "center",
    gap: SPACING.sm,
  },

  ageCard: {
    marginTop: SPACING.sm,
    ...SHADOW,
  },

  cardTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  cardValue: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.subHeading,
    fontWeight: "700",
    color: COLORS.primary,
  },

  spacer: {
    height: SPACING.lg,
  },

  twoColumn: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  metricBox: {
    flex: 1,
    alignItems: "center",
    gap: SPACING.sm,
  },
});