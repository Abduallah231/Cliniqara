import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
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

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function NewTemplateScreen() {
  const [title, setTitle] = useState("");

  const [folder, setFolder] =
    useState("None");

  const [medications, setMedications] =
    useState([""]);

  const [advice, setAdvice] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [followUp, setFollowUp] =
    useState("");

  const followUpOptions = [
    "3 Days",
    "1 Week",
    "2 Weeks",
    "1 Month",
    "3 Months",
    "PRN",
  ];

  const addMedication = () =>
    setMedications([
      ...medications,
      "",
    ]);

  const removeMedication = (
    index: number
  ) => {
    if (medications.length === 1)
      return;

    setMedications(
      medications.filter(
        (_, i) => i !== index
      )
    );
  };

  const updateMedication = (
    text: string,
    index: number
  ) => {
    const updated = [
      ...medications,
    ];

    updated[index] = text;

    setMedications(updated);
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="New Template"
        onBack={() =>
          router.back()
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SectionHeader title="General" />

        <AppCard style={styles.generalCard}>
          <AppTextField
            placeholder="Template Name"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>
            Folder
          </Text>

          <View style={styles.row}>
            <AppChip
              label="None"
              selected={folder === "None"}
              onPress={() =>
                setFolder("None")
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

          <Text style={styles.label}>
            Favorite
          </Text>
          
        </AppCard>
                <SectionHeader title="Prescription" />

        
        {medications.map(
          (medication, index) => (
            <View
              key={index}
              style={styles.card}
            >
              <View
                style={styles.cardHeader}
              >
                <Ionicons
                  name="medical-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <Text
                  style={styles.cardTitle}
                >
                  Medication {index + 1}
                </Text>

                <Pressable
                  onPress={() =>
                    removeMedication(
                      index
                    )
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#ef4444"
                  />
                </Pressable>
              </View>

              <AppTextField
                multiline
                placeholder="Drug • Dose • Route • Frequency • Duration"
                value={medication}
                onChangeText={(
                  text
                ) =>
                  updateMedication(
                    text,
                    index
                  )
                }
              />
            </View>
          )
        )}

        <Pressable
          style={styles.addButton}
          onPress={addMedication}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={COLORS.white}
          />

          <Text
            style={styles.addButtonText}
          >
            Add Medication
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Advice
        </Text>

        <AppTextField
          multiline
          value={advice}
          onChangeText={setAdvice}
          placeholder="Patient advice..."
        />

        <Text style={styles.title}>
          Notes
        </Text>

        <AppTextField
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional notes..."
        />

        <Text style={styles.title}>
          Follow Up
        </Text>

        <View style={styles.chips}>
          {followUpOptions.map(
            (item) => (
              <Pressable
                key={item}
                style={[
                  styles.chip,
                  followUp === item &&
                    styles.selectedChip,
                ]}
                onPress={() =>
                  setFollowUp(item)
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    followUp === item && {
                      color:
                        COLORS.white,
                    },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )
          )}
        </View>

        <AppTextField
          placeholder="Custom follow up..."
          value={followUp}
          onChangeText={setFollowUp}
        />

        <AppButton
          title="Save Template"
          icon="save-outline"
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

  generalCard: {
    gap: SPACING.md,
  },

  label: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOW,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  cardTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  addButton: {
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  chipText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: TYPOGRAPHY.small,
  },
});