import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";
import EmptyTemplates from "@/components/prescription-templates/EmptyTemplates";
import TemplateCard from "@/components/prescription-templates/TemplateCard";
import TemplateFolderDialog from "@/components/prescription-templates/TemplateFolderDialog";
import TemplateFolderSection from "@/components/prescription-templates/TemplateFolderSection";
import TemplateSearchFilters from "@/components/prescription-templates/TemplateSearchFilters";

import {
  createClinicTemplateFolder,
  createUserTemplateFolder,
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

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type TemplateTab =
  | "MY"
  | "CLINIC"
  | "GLOBAL";

const tabs: {
  key: TemplateTab;
  label: string;
}[] = [
  {
    key: "MY",
    label: "My Templates",
  },
  {
    key: "CLINIC",
    label: "Clinic Templates",
  },
  {
    key: "GLOBAL",
    label: "Global Templates",
  },
];

export default function PrescriptionsScreen() {
  const currentClinicId =
    useClinicStore(
      (state) => state.currentClinicId,
    );

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<TemplateTab>("MY");

  const [templates, setTemplates] =
    useState<PrescriptionTemplate[]>(
      [],
    );

  const [folders, setFolders] =
    useState<PrescriptionTemplateFolder[]>(
      [],
    );

  const [loading, setLoading] =
    useState(false);

  const [
    showFolderDialog,
    setShowFolderDialog,
  ] = useState(false);

  // ======================================================
  // Load Templates
  // ======================================================

  useEffect(() => {
    let cancelled = false;

    const loadTemplates = async () => {
      setLoading(true);

      try {
        let loadedTemplates: PrescriptionTemplate[] =
          [];

        let loadedFolders: PrescriptionTemplateFolder[] =
          [];

        if (activeTab === "MY") {
          const [
            userTemplates,
            userFolders,
          ] = await Promise.all([
            getUserTemplates(),
            getUserTemplateFolders(),
          ]);

          loadedTemplates =
            userTemplates;

          loadedFolders =
            userFolders;
        }

        if (
          activeTab === "CLINIC"
        ) {
          if (!currentClinicId) {
            loadedTemplates = [];
            loadedFolders = [];
          } else {
            const [
              clinicTemplates,
              clinicFolders,
            ] = await Promise.all([
              getClinicTemplates(
                currentClinicId,
              ),
              getClinicTemplateFolders(
                currentClinicId,
              ),
            ]);

            loadedTemplates =
              clinicTemplates;

            loadedFolders =
              clinicFolders;
          }
        }

        if (
          activeTab === "GLOBAL"
        ) {
          const [
            globalTemplates,
            globalFolders,
          ] = await Promise.all([
            getGlobalTemplates(),
            getGlobalTemplateFolders(),
          ]);

          loadedTemplates =
            globalTemplates;

          loadedFolders =
            globalFolders;
        }

        if (!cancelled) {
          setTemplates(
            loadedTemplates,
          );

          setFolders(
            loadedFolders,
          );
        }
      } catch (error) {
        console.error(
          "Failed to load prescription templates:",
          error,
        );

        if (!cancelled) {
          setTemplates([]);
          setFolders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTemplates();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    currentClinicId,
  ]);

  // ======================================================
  // Search
  // ======================================================

  const filteredTemplates =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return templates;
      }

      return templates.filter(
        (template) =>
          template.title
            .toLowerCase()
            .includes(query) ||
          template.medications.some(
            (medication) =>
              medication.medication
                .toLowerCase()
                .includes(query),
          ),
      );
    }, [
      templates,
      search,
    ]);

  const templatesWithoutFolder =
    filteredTemplates.filter(
      (template) =>
        !template.folderId,
    );

  // ======================================================
  // Actions
  // ======================================================

  const handleTemplatePress = (
    templateId: string,
  ) => {
    router.push({
      pathname:
        "/prescription-template-details",
      params: {
        templateId,
      },
    });
  };

  const handleNewTemplate = () => {
    if (activeTab === "GLOBAL") {
      return;
    }

    if (
      activeTab === "CLINIC" &&
      !currentClinicId
    ) {
      return;
    }

    router.push({
      pathname: "/new-template",
      params: {
        scope: activeTab,
      },
    });
  };

  const handleCreateFolder = async (
    name: string,
  ) => {
    if (!name.trim()) {
      return;
    }

    try {
      if (activeTab === "MY") {
        const folder =
          await createUserTemplateFolder({
            name: name.trim(),
          });

        setFolders((current) => [
          ...current,
          folder,
        ]);
      }

      if (
        activeTab === "CLINIC" &&
        currentClinicId
      ) {
        const folder =
          await createClinicTemplateFolder(
            currentClinicId,
            {
              name: name.trim(),
            },
          );

        setFolders((current) => [
          ...current,
          folder,
        ]);
      }

      setShowFolderDialog(false);
    } catch (error) {
      console.error(
        "Failed to create prescription template folder:",
        error,
      );
    }
  };

  // ======================================================
  // Render
  // ======================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Prescription Templates"
        onBack={() =>
          router.replace("/(app)")
        }
        onRightPress={() =>
          router.push("/settings")
        }
      />

      {/* ==================================================
          Tabs
      ================================================== */}

      <View
        style={styles.tabsWrapper}
      >
        <View
          style={styles.segmentedControl}
        >
          {tabs.map((tab) => {
            const selected =
              activeTab === tab.key;

            return (
              <Pressable
                key={tab.key}
                style={[
                  styles.segment,
                  selected &&
                    styles.selectedSegment,
                ]}
                onPress={() => {
                  setSearch("");
                  setActiveTab(
                    tab.key,
                  );
                }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    selected &&
                      styles.selectedSegmentText,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ==================================================
          Content
      ================================================== */}

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <TemplateSearchFilters
          search={search}
          onSearchChange={
            setSearch
          }
        />

        {/* ==================================================
            Loading
        ================================================== */}

        {loading && (
          <Text
            style={
              styles.loadingText
            }
          >
            Loading templates...
          </Text>
        )}

        {/* ==================================================
            Folders
        ================================================== */}

        {!loading &&
          folders.map(
            (folder) => (
              <TemplateFolderSection
                key={folder.id}
                folder={folder}
                templates={filteredTemplates.filter(
                  (template) =>
                    template.folderId ===
                    folder.id,
                )}
                onTemplatePress={(
                  template,
                ) =>
                  handleTemplatePress(
                    template.id,
                  )
                }
              />
            ),
          )}

        {/* ==================================================
            Templates Without Folder
        ================================================== */}

        {!loading &&
          templatesWithoutFolder.length >
            0 && (
            <>
              <SectionHeader title="Other" />

              <View
                style={styles.list}
              >
                {templatesWithoutFolder.map(
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
                          template.id,
                        )
                      }
                    />
                  ),
                )}
              </View>
            </>
          )}

        {/* ==================================================
            Empty State
        ================================================== */}

        {!loading &&
          filteredTemplates.length ===
            0 && <EmptyTemplates />}
      </ScrollView>

      {/* ==================================================
          Bottom Actions
      ================================================== */}

      {activeTab !== "GLOBAL" && (
        <View style={styles.fab}>
          <AppButton
            title="New Section"
            icon="folder-open-outline"
            variant="secondary"
            style={styles.button}
            onPress={() =>
              setShowFolderDialog(
                true,
              )
            }
          />

          <AppButton
            title="New Template"
            icon="add-outline"
            style={styles.button}
            onPress={
              handleNewTemplate
            }
          />
        </View>
      )}

      {/* ==================================================
          Folder Dialog
      ================================================== */}

      <TemplateFolderDialog
        visible={
          showFolderDialog
        }
        onClose={() =>
          setShowFolderDialog(
            false,
          )
        }
        onSave={
          handleCreateFolder
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  tabsWrapper: {
    paddingHorizontal:
      SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom:
      SPACING.sm,
    backgroundColor:
      COLORS.background,
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius:
      RADIUS.xl,
    padding: 4,
    gap: 4,
  },

  segment: {
    flex: 1,
    minHeight: 44,
    borderRadius:
      RADIUS.lg,
    alignItems: "center",
    justifyContent:
      "center",
    paddingHorizontal:
      SPACING.xs,
  },

  selectedSegment: {
    backgroundColor:
      COLORS.primary,
  },

  segmentText: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
    fontWeight: "700",
    textAlign: "center",
  },

  selectedSegmentText: {
    color: COLORS.white,
  },

  content: {
    padding:
      SPACING.md,
    paddingTop:
      SPACING.sm,
    paddingBottom: 120,
    gap: SPACING.lg,
  },

  list: {
    gap: SPACING.sm,
  },

  loadingText: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
    textAlign: "center",
    paddingVertical:
      SPACING.md,
  },

  fab: {
    position: "absolute",
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.xl,
    flexDirection: "row",
    gap: SPACING.sm,
  },

  button: {
    flex: 1,
  },
});