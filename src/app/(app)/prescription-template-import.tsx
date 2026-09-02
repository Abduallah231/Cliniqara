import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useEffect, useMemo, useState } from "react";

import AppTopBar from "@/components/common/AppTopBar";
import TemplateCard from "@/components/prescription-templates/TemplateCard";
import TemplateFolderSection from "@/components/prescription-templates/TemplateFolderSection";
import ImportTemplateDialog, {
  type ImportMode,
} from "@/components/prescription-templates/ImportTemplateDialog";

import {
  getClinicTemplateFolders,
  getClinicTemplates,
  getGlobalTemplateFolders,
  getGlobalTemplates,
  getUserTemplateFolders,
  getUserTemplates,
  type PrescriptionTemplate,
  type PrescriptionTemplateFolder,
} from "@/services/prescriptionTemplateApi";

import { useClinicStore } from "@/store/clinicStore";
import { useVisitStore } from "@/store/visitStore";

import {
  COLORS,
  SPACING,
} from "@/theme";

type Tab =
  | "MY"
  | "CLINIC"
  | "GLOBAL";

export default function PrescriptionTemplateImportScreen() {
  const {
    visitId,
  } = useLocalSearchParams<{
    visitId?: string;
  }>();

  const {
    currentClinicId,
  } = useClinicStore();

  const setVisit =
    useVisitStore(
      (state) => state.setVisit,
    );

  const [activeTab, setActiveTab] =
    useState<Tab>("MY");

  const [templates, setTemplates] =
    useState<PrescriptionTemplate[]>(
      [],
    );

  const [folders, setFolders] =
    useState<PrescriptionTemplateFolder[]>(
      [],
    );

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [selectedTemplate, setSelectedTemplate] =
    useState<PrescriptionTemplate | null>(
      null,
    );

  const [dialogVisible, setDialogVisible] =
    useState(false);

  /*
   * =========================================
   * Load templates
   * =========================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadTemplates = async () => {
      try {
        setLoading(true);

        let loadedTemplates: PrescriptionTemplate[] =
          [];

        let loadedFolders: PrescriptionTemplateFolder[] =
          [];

        if (activeTab === "MY") {
          [
            loadedTemplates,
            loadedFolders,
          ] = await Promise.all([
            getUserTemplates(),
            getUserTemplateFolders(),
          ]);
        }

        if (
          activeTab === "CLINIC" &&
          currentClinicId
        ) {
          [
            loadedTemplates,
            loadedFolders,
          ] = await Promise.all([
            getClinicTemplates(
              currentClinicId,
            ),
            getClinicTemplateFolders(
              currentClinicId,
            ),
          ]);
        }

        if (activeTab === "GLOBAL") {
          [
            loadedTemplates,
            loadedFolders,
          ] = await Promise.all([
            getGlobalTemplates(),
            getGlobalTemplateFolders(),
          ]);
        }

        if (cancelled) {
          return;
        }

        setTemplates(
          loadedTemplates,
        );

        setFolders(
          loadedFolders,
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load prescription templates:",
            error,
          );

          setTemplates([]);
          setFolders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTemplates();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    currentClinicId,
  ]);

  /*
   * =========================================
   * Search
   * =========================================
   */

  const filteredTemplates =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return templates;
      }

      return templates.filter(
        (template) => {
          const title =
            template.title.toLowerCase();

          const medications =
            template.medications
              .map(
                (item) =>
                  item.medication,
              )
              .join(" ")
              .toLowerCase();

          return (
            title.includes(value) ||
            medications.includes(value)
          );
        },
      );
    }, [
      search,
      templates,
    ]);

  /*
   * =========================================
   * Folder helpers
   * =========================================
   */

  const getFolderTemplates = (
    folderId: string,
  ) =>
    filteredTemplates.filter(
      (template) =>
        template.folderId ===
        folderId,
    );

  const unfiledTemplates =
    filteredTemplates.filter(
      (template) =>
        !template.folderId,
    );

  /*
   * =========================================
   * Open confirmation
   * =========================================
   */

  const handleTemplatePress = (
    template: PrescriptionTemplate,
  ) => {
    setSelectedTemplate(
      template,
    );

    setDialogVisible(true);
  };

  /*
   * =========================================
   * Import
   * =========================================
   */

  const appendText = (
    current: string,
    incoming:
      | string
      | null
      | undefined,
  ) => {
    const currentText =
      current ?? "";

    const incomingText =
      incoming ?? "";

    if (!currentText.trim()) {
      return incomingText;
    }

    if (!incomingText.trim()) {
      return currentText;
    }

    return `${currentText}\n\n${incomingText}`;
  };

  const handleImport = (
    mode: ImportMode,
  ) => {
    if (!selectedTemplate) {
      return;
    }

    const currentVisit =
      useVisitStore.getState().visit;

    /*
     * Make sure the page is still operating
     * on the requested visit.
     */
    if (
      visitId &&
      currentVisit.metadata.id !==
        visitId
    ) {
      console.warn(
        "Prescription template import aborted: visit mismatch.",
      );

      setDialogVisible(false);
      setSelectedTemplate(null);
      return;
    }

    const currentPrescription =
      currentVisit.assessment
        .prescription;

    /*
     * IMPORTANT:
     * We create completely new medication
     * objects. Template medication IDs,
     * if present in the backend response,
     * are never copied into the visit.
     */
    const importedMedications =
      selectedTemplate.medications.map(
        (medication) => ({
          medication:
            medication.medication,
          instructions:
            medication.instructions,
          durationValue:
            medication.durationValue ===
            null
              ? ""
              : String(
                  medication.durationValue,
                ),
          durationUnit:
            medication.durationUnit ??
            "DAYS",
        }),
      );

    const nextPrescription =
      mode === "REPLACE"
        ? {
            medications:
              importedMedications,
            advice:
              selectedTemplate.advice ??
              "",
            notes:
              selectedTemplate.notes ??
              "",
            followUp:
              selectedTemplate.followUp ??
              "",
          }
        : {
            medications: [
              ...currentPrescription.medications,
              ...importedMedications,
            ],

            advice: appendText(
              currentPrescription.advice,
              selectedTemplate.advice,
            ),

            notes: appendText(
              currentPrescription.notes,
              selectedTemplate.notes,
            ),

            /*
             * BUSINESS RULE:
             * Follow-up ALWAYS replaces
             * the current follow-up.
             */
            followUp:
              selectedTemplate.followUp ??
              "",
          };

    /*
     * One atomic store update.
     *
     * This avoids triggering several independent
     * prescription updates and lets the existing
     * prescription autosave persist the final state.
     */
    setVisit({
      ...currentVisit,
      assessment: {
        ...currentVisit.assessment,
        prescription:
          nextPrescription,
      },
    });

    setDialogVisible(false);
    setSelectedTemplate(null);

    router.back();
  };

  /*
   * =========================================
   * Render
   * =========================================
   */

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      <AppTopBar
        title="Import Prescription Template"
        onBack={() =>
          router.back()
        }
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <View style={styles.content}>
        <View style={styles.tabs}>
          <TabButton
            label="My Templates"
            active={
              activeTab === "MY"
            }
            onPress={() =>
              setActiveTab("MY")
            }
          />

          <TabButton
            label="Clinic Templates"
            active={
              activeTab === "CLINIC"
            }
            onPress={() =>
              setActiveTab("CLINIC")
            }
          />

          <TabButton
            label="Global Templates"
            active={
              activeTab === "GLOBAL"
            }
            onPress={() =>
              setActiveTab("GLOBAL")
            }
          />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.text}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search templates..."
            placeholderTextColor={
              COLORS.text
            }
            style={styles.searchInput}
            autoCorrect={false}
          />

          {search.length > 0 && (
            <Pressable
              onPress={() =>
                setSearch("")
              }
              hitSlop={10}
            >
              <Ionicons
                name="close-circle"
                size={19}
                color={COLORS.text}
              />
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
              />

              <Text style={styles.loadingText}>
                Loading templates...
              </Text>
            </View>
          ) : (
            <>
              {folders.map(
                (folder) => {
                  const folderTemplates =
                    getFolderTemplates(
                      folder.id,
                    );

                  if (
                    folderTemplates.length ===
                    0
                  ) {
                    return null;
                  }

                  return (
                    <TemplateFolderSection
                      key={folder.id}
                      folder={folder}
                      templates={
                        folderTemplates
                      }
                      onTemplatePress={
                        handleTemplatePress
                      }
                    />
                  );
                },
              )}

              {unfiledTemplates.length >
                0 && (
                <View
                  style={
                    styles.unfiledSection
                  }
                >
                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    Templates
                  </Text>

                  {unfiledTemplates.map(
                    (template) => (
                      <TemplateCard
                        key={
                          template.id
                        }
                        template={
                          template
                        }
                        onPress={() =>
                          handleTemplatePress(
                            template,
                          )
                        }
                      />
                    ),
                  )}
                </View>
              )}

              {!loading &&
                filteredTemplates.length ===
                  0 && (
                  <View
                    style={
                      styles.empty
                    }
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={44}
                      color={COLORS.text}
                    />

                    <Text
                      style={
                        styles.emptyTitle
                      }
                    >
                      No templates found
                    </Text>

                    <Text
                      style={
                        styles.emptyText
                      }
                    >
                      {search.trim()
                        ? "Try another search."
                        : activeTab ===
                            "CLINIC" &&
                          !currentClinicId
                        ? "No clinic is currently selected."
                        : "There are no templates available here yet."}
                    </Text>
                  </View>
                )}
            </>
          )}
        </ScrollView>
      </View>

      <ImportTemplateDialog
        visible={dialogVisible}
        template={
          selectedTemplate
        }
        onClose={() => {
          setDialogVisible(false);
          setSelectedTemplate(
            null,
          );
        }}
        onConfirm={
          handleImport
        }
      />
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tab,
        active &&
          styles.activeTab,
      ]}
    >
      <Text
        style={[
          styles.tabText,
          active &&
            styles.activeTabText,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    flex: 1,
    paddingTop: SPACING.md,
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },

  tab: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderBottomWidth: 2,
    borderBottomColor:
      "transparent",
  },

  activeTab: {
    borderBottomColor:
      COLORS.primary,
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },

  activeTabText: {
    fontWeight: "700",
    color: COLORS.primary,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    minHeight: 46,
    borderWidth: 1,
    borderColor:
      "rgba(0,0,0,0.12)",
    borderRadius: 14,
  },

  searchInput: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  unfiledSection: {
    marginTop: SPACING.md,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  loading: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xl,
  },

  loadingText: {
    marginTop: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
  },

  emptyTitle: {
    marginTop: SPACING.md,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  emptyText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    textAlign: "center",
  },
});