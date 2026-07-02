import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";

import {
  COLORS,
  SPACING,
} from "@/theme";

export default function ReportPreviewScreen() {
  const [history, setHistory] =
    useState("");

  const [examination, setExamination] =
    useState("");

  const [assessment, setAssessment] =
    useState("");

  const [prescription, setPrescription] =
    useState("");

  const [narrative, setNarrative] =
    useState("");

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Review Report"
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
        </AppCard>

        <SectionHeader title="Report" />

        <AppCard>
          <AppTextField
            multiline
            placeholder="History..."
            value={history}
            onChangeText={setHistory}
          />

          <AppTextField
            multiline
            placeholder="Examination..."
            value={examination}
            onChangeText={setExamination}
          />

          <AppTextField
            multiline
            placeholder="Assessment..."
            value={assessment}
            onChangeText={setAssessment}
          />

          <AppTextField
            multiline
            placeholder="Prescription..."
            value={prescription}
            onChangeText={setPrescription}
          />
        </AppCard>

        <SectionHeader title="Narrative Report" />

        <AppCard>
          <AppTextField
            multiline
            placeholder="Narrative report..."
            value={narrative}
            onChangeText={setNarrative}
          />
        </AppCard>

        <AppButton
          title="Export PDF"
          icon="document-outline"
          onPress={() => {}}
        />

        <AppButton
          title="Print"
          icon="print-outline"
          variant="secondary"
          onPress={() => {}}
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
    paddingBottom: 40,
    gap: SPACING.lg,
  },
});