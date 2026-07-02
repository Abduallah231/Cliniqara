import { router } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";

import {
    COLORS,
    SPACING,
} from "@/theme";

export default function GenerateReportScreen() {
  const [reportType, setReportType] =
    useState<
      "full" | "summary" | "referral"
    >("full");

  const [scope, setScope] =
    useState<
      "current" | "all"
    >("current");

  const [reason, setReason] =
    useState("");

  const [sections, setSections] =
    useState({
      history: true,
      examination: true,
      assessment: true,
      prescription: true,
    });

  const toggle = (
    key: keyof typeof sections
  ) => {
    setSections({
      ...sections,
      [key]: !sections[key],
    });
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Generate Report"
        onBack={() =>
          router.back()
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
                <SectionHeader title="Patient" />

        <AppCard>
          <AppTextField
            placeholder="Patient Name"
            value="Mohamed Ahmed"
            editable={false}
          />

          <AppTextField
            placeholder="Age / Gender"
            value="32 Years • Male"
            editable={false}
          />

          <AppTextField
            placeholder="Visit"
            value="Current Visit"
            editable={false}
          />
        </AppCard>

        <SectionHeader title="Report Type" />

        <AppCard style={styles.row}>
          <AppChip
            label="Full Report"
            selected={reportType === "full"}
            onPress={() =>
              setReportType("full")
            }
          />

          <AppChip
            label="Summary"
            selected={reportType === "summary"}
            onPress={() =>
              setReportType("summary")
            }
          />

          <AppChip
            label="Referral Letter"
            selected={reportType === "referral"}
            onPress={() =>
              setReportType("referral")
            }
          />
        </AppCard>

        <SectionHeader title="Scope" />

        <AppCard style={styles.row}>
          <AppChip
            label="Current Visit"
            selected={scope === "current"}
            onPress={() =>
              setScope("current")
            }
          />

          <AppChip
            label="All Visits"
            selected={scope === "all"}
            onPress={() =>
              setScope("all")
            }
          />
        </AppCard>

        {reportType === "full" && (
          <>
            <SectionHeader title="Include Sections" />

            <AppCard style={styles.row}>
              <AppChip
                label="History"
                selected={sections.history}
                onPress={() =>
                  toggle("history")
                }
              />

              <AppChip
                label="Examination"
                selected={sections.examination}
                onPress={() =>
                  toggle(
                    "examination"
                  )
                }
              />

              <AppChip
                label="Assessment"
                selected={sections.assessment}
                onPress={() =>
                  toggle(
                    "assessment"
                  )
                }
              />

              <AppChip
                label="Prescription"
                selected={
                  sections.prescription
                }
                onPress={() =>
                  toggle(
                    "prescription"
                  )
                }
              />
            </AppCard>
          </>
        )}

        {reportType === "referral" && (
          <>
            <SectionHeader title="Reason for Referral" />

            <AppCard>
              <AppTextField
                multiline
                placeholder="Reason for referral..."
                value={reason}
                onChangeText={setReason}
              />
            </AppCard>
          </>
        )}
                <AppButton
          title="Generate Preview"
          icon="document-text-outline"
          onPress={() =>
            router.push("/report-preview")
          }
        />
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

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
});