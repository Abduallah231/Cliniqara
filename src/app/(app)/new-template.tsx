import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";

import PrescriptionForm, {
  PrescriptionFormMedication,
} from "@/components/visit/assessment/PrescriptionForm";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function NewTemplateScreen() {
  // ======================================================
  // General
  // ======================================================

  const [title, setTitle] =
    useState("");

  const [folder, setFolder] =
    useState("None");

  // ======================================================
  // Prescription
  // ======================================================

  const [medications, setMedications] =
    useState<
      PrescriptionFormMedication[]
    >([
      {
        medication: "",
        instructions: "",
        durationValue: "",
        durationUnit: "DAYS",
      },
    ]);

  const [advice, setAdvice] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [followUp, setFollowUp] =
    useState("");

  // ======================================================
  // Medication Actions
  // ======================================================

  const addMedication = () => {
    setMedications(
      (current) => [
        ...current,
        {
          medication: "",
          instructions: "",
          durationValue: "",
          durationUnit:
            "DAYS",
        },
      ]
    );
  };

  const updateMedication = (
    index: number,
    updates: Partial<PrescriptionFormMedication>
  ) => {
    setMedications(
      (current) =>
        current.map(
          (item, i) =>
            i === index
              ? {
                  ...item,
                  ...updates,
                }
              : item
        )
    );
  };

  const removeMedication = (
    index: number
  ) => {
    if (
      medications.length === 1
    ) {
      return;
    }

    setMedications(
      (current) =>
        current.filter(
          (_, i) =>
            i !== index
        )
    );
  };

  // ======================================================
  // Save Template
  // ======================================================

  const handleSaveTemplate =
    () => {
      const template = {
        title,
        folder,
        medications,
        advice,
        notes,
        followUp,
      };

      // TODO:
      // Connect this object
      // to Template API / DB.

      console.log(
        "SAVE TEMPLATE:",
        template
      );
    };

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      {/* ==================================================
          Top Bar
      ================================================== */}

      <AppTopBar
        title="New Template"
        onBack={() =>
          router.back()
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* ==================================================
            General
        ================================================== */}

        <SectionHeader title="General" />

        <AppCard
          style={
            styles.generalCard
          }
        >
          <AppTextField
            placeholder="Template Name"
            value={title}
            onChangeText={
              setTitle
            }
          />

          <Text
            style={styles.label}
          >
            Folder
          </Text>

          <View
            style={styles.row}
          >
            <AppChip
              label="None"
              selected={
                folder ===
                "None"
              }
              onPress={() =>
                setFolder(
                  "None"
                )
              }
            />

            <AppChip
              label="Internal Medicine"
              selected={
                folder ===
                "Internal Medicine"
              }
              onPress={() =>
                setFolder(
                  "Internal Medicine"
                )
              }
            />

            <AppChip
              label="Pediatrics"
              selected={
                folder ===
                "Pediatrics"
              }
              onPress={() =>
                setFolder(
                  "Pediatrics"
                )
              }
            />
          </View>

          <Text
            style={styles.label}
          >
            Favorite
          </Text>
        </AppCard>

        {/* ==================================================
            Prescription
        ================================================== */}

        <SectionHeader title="Prescription" />

        <PrescriptionForm
          medications={
            medications
          }
          advice={advice}
          notes={notes}
          followUp={followUp}
          onAddMedication={
            addMedication
          }
          onUpdateMedication={
            updateMedication
          }
          onRemoveMedication={
            removeMedication
          }
          onUpdateAdvice={
            setAdvice
          }
          onUpdateNotes={
            setNotes
          }
          onUpdateFollowUp={
            setFollowUp
          }
        />

        {/* ==================================================
            Save Template
        ================================================== */}

        <AppButton
          title="Save Template"
          icon="save-outline"
          onPress={
            handleSaveTemplate
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    padding:
      SPACING.md,
    paddingBottom: 40,
    gap: SPACING.lg,
  },

  generalCard: {
    gap: SPACING.md,
  },

  label: {
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  row: {
    flexDirection:
      "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
});