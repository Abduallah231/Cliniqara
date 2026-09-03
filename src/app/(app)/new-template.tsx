import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import PrescriptionForm, {
  PrescriptionFormMedication,
} from "@/components/visit/assessment/PrescriptionForm";

import {
  createClinicTemplate,
  createUserTemplate,
  getClinicTemplateFolders,
  getPrescriptionTemplate,
  getUserTemplateFolders,
  updatePrescriptionTemplate,
  type PrescriptionTemplateFolder,
  type PrescriptionTemplateScope,
} from "@/services/prescriptionTemplateApi";

import { useClinicStore } from "@/store/clinicStore";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type TemplateScope =
  | "MY"
  | "CLINIC"
  | "GLOBAL";

const scopeToBackendScope = (
  scope: TemplateScope,
): PrescriptionTemplateScope => {
  if (scope === "MY") {
    return "USER";
  }

  if (scope === "CLINIC") {
    return "CLINIC";
  }

  return "GLOBAL";
};

export default function NewTemplateScreen() {
  const params =
    useLocalSearchParams<{
      scope?: string;
      templateId?: string;
    }>();

  const currentClinicId =
    useClinicStore(
      (state) => state.currentClinicId,
    );

  const scope =
    (Array.isArray(params.scope)
      ? params.scope[0]
      : params.scope) as
      | TemplateScope
      | undefined;

  const templateId =
    Array.isArray(
      params.templateId,
    )
      ? params.templateId[0]
      : params.templateId;

  const isEditing =
    !!templateId;

  const effectiveScope =
    scope ?? "MY";

  // ======================================================
  // General
  // ======================================================

  const [title, setTitle] =
    useState("");

  const [folderId, setFolderId] =
    useState<string | null>(
      null,
    );

  const [folders, setFolders] =
    useState<PrescriptionTemplateFolder[]>(
      [],
    );

  // ======================================================
  // Prescription
  // ======================================================

  const [medications, setMedications] =
    useState<
      PrescriptionFormMedication[]
    >([
      {
        drugId: "",
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
  // State
  // ======================================================

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  // ======================================================
  // Load Folders + Existing Template
  // ======================================================

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // --------------------------------------------------
        // Global templates are read-only.
        // --------------------------------------------------

        if (
          effectiveScope ===
          "GLOBAL"
        ) {
          if (!cancelled) {
            setError(
              "Global templates are read-only.",
            );
          }

          return;
        }

        // --------------------------------------------------
        // Load folders
        // --------------------------------------------------

        let loadedFolders: PrescriptionTemplateFolder[] =
          [];

        if (
          effectiveScope ===
          "MY"
        ) {
          loadedFolders =
            await getUserTemplateFolders();
        }

        if (
          effectiveScope ===
          "CLINIC"
        ) {
          if (!currentClinicId) {
            throw new Error(
              "No clinic is currently selected.",
            );
          }

          loadedFolders =
            await getClinicTemplateFolders(
              currentClinicId,
            );
        }

        if (!cancelled) {
          setFolders(
            loadedFolders,
          );
        }

        // --------------------------------------------------
        // Edit existing template
        // --------------------------------------------------

        if (isEditing) {
          const template =
            await getPrescriptionTemplate(
              templateId!,
            );

          if (cancelled) {
            return;
          }

          setTitle(
            template.title,
          );

          setFolderId(
            template.folderId ??
              null,
          );

          setAdvice(
            template.advice ??
              "",
          );

          setNotes(
            template.notes ??
              "",
          );

          setFollowUp(
            template.followUp ??
              "",
          );

          setMedications(
            template.medications.map(
              (item) => ({
                drugId:
                  item.drugId ?? "",
                medication:
                  item.medication,
                instructions:
                  item.instructions ?? "",
                durationValue:
                  item.durationValue !==
                  null
                    ? String(
                        item.durationValue,
                      )
                    : "",
                durationUnit:
                  item.durationUnit ??
                  "DAYS",
              }),
            ),
          );
        }
      } catch (error) {
        console.error(
          "Failed to load template form:",
          error,
        );

        if (!cancelled) {
          setError(
            error instanceof
              Error
              ? error.message
              : "Failed to load template.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    effectiveScope,
    currentClinicId,
    isEditing,
    templateId,
  ]);

  // ======================================================
  // Medication Actions
  // ======================================================

  const addMedication = () => {
    setMedications(
      (current) => [
        ...current,
        {
          drugId: "",
          medication: "",
          instructions: "",
          durationValue: "",
          durationUnit:
            "DAYS",
        },
      ],
    );
  };

  const updateMedication = (
    index: number,
    updates: Partial<PrescriptionFormMedication>,
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
              : item,
        ),
    );
  };

  const removeMedication = (
    index: number,
  ) => {
    if (
      medications.length ===
      1
    ) {
      return;
    }

    setMedications(
      (current) =>
        current.filter(
          (_, i) =>
            i !== index,
        ),
    );
  };

  // ======================================================
  // Save Template
  // ======================================================

  const handleSaveTemplate =
    async () => {
      setError(null);

      const cleanTitle =
        title.trim();

      if (!cleanTitle) {
        setError(
          "Please enter a template name.",
        );
        return;
      }

      const validMedications =
        medications.filter(
          (item) =>
            item.drugId.trim().length > 0 &&
            item.medication.trim().length > 0,
        );

      if (
        validMedications.length ===
        0
      ) {
        setError(
          "Please add at least one medication.",
        );
        return;
      }

      if (
        effectiveScope ===
        "GLOBAL"
      ) {
        setError(
          "Global templates are read-only.",
        );
        return;
      }

      if (
        effectiveScope ===
          "CLINIC" &&
        !currentClinicId
      ) {
        setError(
          "No clinic is currently selected.",
        );
        return;
      }

      setSaving(true);

      try {
        const dto = {
          title: cleanTitle,

          folderId:
            folderId ?? null,

          advice:
            advice.trim() ||
            null,

          notes:
            notes.trim() ||
            null,

          followUp:
            followUp.trim() ||
            null,

          medications:
            validMedications.map(
              (item, index) => ({
                drugId: item.drugId,

                instructions:
                  item.instructions.trim(),

                durationValue:
                  item.durationValue.trim()
                    ? Number(
                        item.durationValue.trim(),
                      )
                    : null,

                durationUnit:
                  item.durationValue.trim()
                    ? item.durationUnit
                    : null,

                sortOrder: index,
              }),
            ),
        };

        if (isEditing) {
          await updatePrescriptionTemplate(
            templateId!,
            dto,
          );
        } else if (
          effectiveScope ===
          "MY"
        ) {
          await createUserTemplate(
            dto,
          );
        } else if (
          effectiveScope ===
          "CLINIC" &&
          currentClinicId
        ) {
          await createClinicTemplate(
            currentClinicId,
            dto,
          );
        }

        router.replace(
          "/prescriptions",
        );
      } catch (error) {
        console.error(
          "Failed to save prescription template:",
          error,
        );

        setError(
          error instanceof
            Error
            ? error.message
            : "Failed to save template.",
        );
      } finally {
        setSaving(false);
      }
    };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <AppTopBar
          title={
            isEditing
              ? "Edit Template"
              : "New Template"
          }
          onBack={() =>
            router.back()
          }
        />

        <View
          style={styles.center}
        >
          <ActivityIndicator
            size="large"
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ======================================================
  // Global Read-only
  // ======================================================

  if (
    effectiveScope ===
    "GLOBAL"
  ) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <AppTopBar
          title="Global Template"
          onBack={() =>
            router.back()
          }
        />

        <View
          style={styles.center}
        >
          <Text
            style={
              styles.errorTitle
            }
          >
            Global templates are
            read-only.
          </Text>

          <AppButton
            title="Back"
            variant="secondary"
            onPress={() =>
              router.back()
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  // ======================================================
  // Render
  // ======================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      <AppTopBar
        title={
          isEditing
            ? "Edit Template"
            : "New Template"
        }
        onBack={() =>
          router.back()
        }
      />

      <AppKeyboardAwareScrollView
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
            label="Template Name"
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
                folderId === null
              }
              onPress={() =>
                setFolderId(null)
              }
            />

            {folders.map(
              (folder) => (
                <AppChip
                  key={folder.id}
                  label={folder.name}
                  selected={
                    folderId ===
                    folder.id
                  }
                  onPress={() =>
                    setFolderId(
                      folder.id,
                    )
                  }
                />
              ),
            )}
          </View>
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
            Error
        ================================================== */}

        {!!error && (
          <Text
            style={styles.errorText}
          >
            {error}
          </Text>
        )}

        {/* ==================================================
            Save
        ================================================== */}

        <AppButton
          title={
            saving
              ? "Saving..."
              : isEditing
                ? "Update Template"
                : "Save Template"
          }
          icon={
            saving
              ? undefined
              : "save-outline"
          }
          disabled={saving}
          onPress={
            handleSaveTemplate
          }
        />
      </AppKeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    paddingBottom: SPACING.xl,
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

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent:
      "center",
    padding: SPACING.lg,
    gap: SPACING.md,
  },

  loadingText: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
  },

  errorTitle: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
    textAlign: "center",
  },

  errorText: {
    color: "#ef4444",
    fontSize:
      TYPOGRAPHY.small,
    fontWeight: "600",
  },
});