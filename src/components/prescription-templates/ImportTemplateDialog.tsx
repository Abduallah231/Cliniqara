import AppPressable from "@/components/common/AppPressable";
import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, StyleSheet } from "react-native";

import AppButton from "@/components/common/AppButton";

import type {
  PrescriptionTemplate,
} from "@/services/prescriptionTemplateApi";

import {
  COLORS,
  SPACING,
} from "@/theme";

import {
  useEffect,
  useState,
} from "react";

export type ImportMode =
  | "REPLACE"
  | "ADD";

type Props = {
  visible: boolean;
  template: PrescriptionTemplate | null;
  onClose: () => void;
  onConfirm: (
    mode: ImportMode
  ) => void;
};

function IncludedItem({
  icon,
  label,
  included,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  included: boolean;
}) {
  return (
    <AppView style={styles.includedItem}>
      <Ionicons
        name={icon}
        size={18}
        color={
          included
            ? COLORS.primary
            : COLORS.text
        }
      />

      <AppText style={styles.includedLabel}>
        {label}
      </AppText>

      <Ionicons
        name={
          included
            ? "checkmark-circle"
            : "remove-circle-outline"
        }
        size={18}
        color={
          included
            ? COLORS.primary
            : COLORS.text
        }
      />
    </AppView>
  );
}

function ModeOption({
  selected,
  title,
  description,
  onPress,
}: {
  selected: boolean;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <AppPressable
      onPress={onPress}
      style={[
        styles.modeOption,
        selected &&
          styles.modeOptionSelected,
      ]}
    >
      <AppView
        style={[
          styles.radioOuter,
          selected &&
            styles.radioOuterSelected,
        ]}
      >
        {selected && (
          <AppView style={styles.radioInner} />
        )}
      </AppView>

      <AppView style={styles.modeTextContainer}>
        <AppText style={styles.modeTitle}>
          {title}
        </AppText>

        <AppText style={styles.modeDescription}>
          {description}
        </AppText>
      </AppView>
    </AppPressable>
  );
}

export default function ImportTemplateDialog({
  visible,
  template,
  onClose,
  onConfirm,
}: Props) {
  const [mode, setMode] =
    useState<ImportMode>("ADD");

    useEffect(() => {
    if (visible) {
        setMode("ADD");
    }
    }, [visible, template?.id]);

  if (!template) {
    return null;
  }

  const hasAdvice =
    Boolean(template.advice?.trim());

  const hasNotes =
    Boolean(template.notes?.trim());

  const hasFollowUp =
    Boolean(template.followUp?.trim());

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <AppView style={styles.overlay}>
        <AppPressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <AppView style={styles.dialog}>
          <AppView style={styles.header}>
            <AppView style={styles.headerText}>
              <AppText
                style={styles.title}
                numberOfLines={2}
              >
                Import Template
              </AppText>

              <AppText
                style={styles.templateTitle}
                numberOfLines={2}
              >
                {template.title}
              </AppText>
            </AppView>

            <AppPressable
              onPress={onClose}
              hitSlop={10}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={24}
                color={COLORS.text}
              />
            </AppPressable>
          </AppView>

          <AppScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.scrollContent
            }
          >
            <AppView style={styles.summaryCard}>
              <AppView style={styles.summaryRow}>
                <Ionicons
                  name="medkit-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <AppText style={styles.summaryText}>
                  {template.medications.length}{" "}
                  medication
                  {template.medications.length ===
                  1
                    ? ""
                    : "s"}
                </AppText>
              </AppView>

              <IncludedItem
                icon="chatbox-ellipses-outline"
                label="Advice"
                included={hasAdvice}
              />

              <IncludedItem
                icon="document-text-outline"
                label="Notes"
                included={hasNotes}
              />

              <IncludedItem
                icon="calendar-outline"
                label="Follow-up"
                included={hasFollowUp}
              />
            </AppView>

            <AppText style={styles.sectionTitle}>
              How do you want to import it?
            </AppText>

            <ModeOption
              selected={mode === "ADD"}
              title="Add to current prescription"
              description="Medications, advice and notes will be added to the current prescription. Follow-up will be replaced."
              onPress={() =>
                setMode("ADD")
              }
            />

            <ModeOption
              selected={mode === "REPLACE"}
              title="Replace current prescription"
              description="The complete current prescription will be replaced by this template."
              onPress={() =>
                setMode("REPLACE")
              }
            />

            {mode === "REPLACE" && (
              <AppView style={styles.warning}>
                <Ionicons
                  name="warning-outline"
                  size={19}
                  color={COLORS.text}
                />

                <AppText style={styles.warningText}>
                  Your current medications,
                  advice, notes and follow-up
                  will be replaced.
                </AppText>
              </AppView>
            )}

            {mode === "ADD" && (
              <AppView style={styles.info}>
                <Ionicons
                  name="information-circle-outline"
                  size={19}
                  color={COLORS.text}
                />

                <AppText style={styles.infoText}>
                  Medications, advice and notes
                  will be appended. Follow-up
                  will always be replaced by the
                  template follow-up.
                </AppText>
              </AppView>
            )}
          </AppScrollView>

          <AppView style={styles.actions}>
            <AppButton
              title="Cancel"
              variant="secondary"
              style={styles.actionButton}
              onPress={onClose}
            />

            <AppButton
              title="Import Template"
              icon="download-outline"
              style={styles.actionButton}
              onPress={() =>
                onConfirm(mode)
              }
            />
          </AppView>
        </AppView>
      </AppView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  dialog: {
    maxHeight: "88%",
    backgroundColor:
      COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },

  headerText: {
    flex: 1,
    paddingRight: SPACING.md,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  templateTitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingBottom: SPACING.md,
  },

  summaryCard: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  summaryText: {
    marginLeft: SPACING.sm,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  includedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },

  includedLabel: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 14,
    color: COLORS.text,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  modeOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  modeOptionSelected: {
    borderColor: COLORS.primary,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },

  radioOuterSelected: {
    borderColor: COLORS.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  modeTextContainer: {
    flex: 1,
    marginLeft: SPACING.sm,
  },

  modeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  modeDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
  },

  warning: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },

  warningText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
  },

  info: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },

  infoText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingTop: SPACING.md,
  },

  actionButton: {
    flex: 1,
  },
});