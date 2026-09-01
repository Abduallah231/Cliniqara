import { router } from "expo-router";
import { useMemo, useState } from "react";
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
  prescriptionTemplates,
  templateFolders,
} from "@/data";

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
  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<TemplateTab>("MY");

  const [
    showFolderDialog,
    setShowFolderDialog,
  ] = useState(false);

  /*
   * ======================================================
   * Temporary Data
   * ======================================================
   *
   * Currently using local mock data.
   *
   * Later:
   *
   * MY     -> userId
   * CLINIC -> current clinicId
   * GLOBAL -> system templates
   */

  const templates = useMemo(() => {
    return prescriptionTemplates.filter(
      (template) =>
        template.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
  }, [search]);

  /*
   * ======================================================
   * Current Tab Templates
   * ======================================================
   *
   * For now all tabs use the same mock data.
   * Backend filtering will be added later.
   */

  const currentTemplates =
    useMemo(() => {
      return templates;
    }, [templates]);

  const templatesWithoutFolder =
    currentTemplates.filter(
      (template) =>
        !template.folderId
    );

  /*
   * ======================================================
   * Actions
   * ======================================================
   */

  const handleTemplatePress = (
    templateId: string
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
    router.push({
      pathname: "/new-template",
      params: {
        scope: activeTab,
      },
    });
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* ==================================================
          Top Bar
      ================================================== */}

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
          Fixed Segmented Tabs
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
                onPress={() =>
                  setActiveTab(
                    tab.key
                  )
                }
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
          Scrollable Content
      ================================================== */}

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ==================================================
            Search
        ================================================== */}

        <TemplateSearchFilters
          search={search}
          onSearchChange={setSearch}
        />

        {/* ==================================================
            Folder Templates
        ================================================== */}

        {templateFolders.map(
          (folder) => (
            <TemplateFolderSection
              key={folder.id}
              folder={folder}
              templates={currentTemplates.filter(
                (template) =>
                  template.folderId ===
                  folder.id
              )}
              onTemplatePress={(
                template
              ) =>
                handleTemplatePress(
                  template.id
                )
              }
            />
          )
        )}

        {/* ==================================================
            Templates Without Folder
        ================================================== */}

        {templatesWithoutFolder
          .length > 0 && (
          <>
            <SectionHeader
              title="Other"
            />

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
                        template.id
                      )
                    }
                  />
                )
              )}
            </View>
          </>
        )}

        {/* ==================================================
            Empty State
        ================================================== */}

        {currentTemplates.length ===
          0 && <EmptyTemplates />}
      </ScrollView>

      {/* ==================================================
          Bottom Actions
      ================================================== */}

      <View style={styles.fab}>
        <AppButton
          title="New Section"
          icon="folder-open-outline"
          variant="secondary"
          style={styles.button}
          onPress={() =>
            setShowFolderDialog(
              true
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

      {/* ==================================================
          Folder Dialog
      ================================================== */}

      <TemplateFolderDialog
        visible={
          showFolderDialog
        }
        onClose={() =>
          setShowFolderDialog(
            false
          )
        }
        onSave={(name) => {
          /*
           * TODO:
           *
           * Save folder through backend.
           *
           * The folder will later belong to:
           *
           * MY     -> user
           * CLINIC -> current clinic
           * GLOBAL -> system admin
           */

          console.log(
            "SAVE FOLDER:",
            {
              name,
              scope: activeTab,
            }
          );

          setShowFolderDialog(
            false
          );
        }}
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

  /*
   * ======================================================
   * Fixed Tabs
   * ======================================================
   */

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

  /*
   * ======================================================
   * Scroll Content
   * ======================================================
   */

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

  /*
   * ======================================================
   * Bottom Actions
   * ======================================================
   */

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