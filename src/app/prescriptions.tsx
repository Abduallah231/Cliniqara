import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";
import TemplateFolderDialog from "@/components/prescription-templates/TemplateFolderDialog";
import {
  prescriptionTemplates,
  templateFolders,
} from "@/data";
import EmptyTemplates from "@/components/prescription-templates/EmptyTemplates";
import TemplateCard from "@/components/prescription-templates/TemplateCard";
import TemplateFolderSection from "@/components/prescription-templates/TemplateFolderSection";
import TemplateSearchFilters from "@/components/prescription-templates/TemplateSearchFilters";
import {
  COLORS,
  SPACING,
} from "@/theme";

export default function PrescriptionsScreen() {
  const [search, setSearch] = useState("");

const [showFolderDialog, setShowFolderDialog] =
  useState(false);
  const templates = useMemo(() => {
  return prescriptionTemplates.filter((template) =>
    template.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );
}, [search]);

  const templatesWithoutFolder =
    templates.filter(
      (template) => !template.folderId
    );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Prescription Templates"
        onBack={() =>
          router.replace("/")
        }
        onRightPress={() =>
          router.push("/settings")
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
        <TemplateSearchFilters
          search={search}
          onSearchChange={setSearch}
        />

        {templateFolders.map((folder) => (
          <TemplateFolderSection
            key={folder.id}
            folder={folder}
            templates={templates.filter(
              (template) =>
                template.folderId === folder.id
            )}
            onTemplatePress={(template) =>
              router.push({
                pathname: "/prescription-template-details",
                params: {
                  templateId: template.id,
                },
              })
            }
          />
        ))}

        {templatesWithoutFolder
          .length > 0 && (
          <>
            <SectionHeader title="Other" />

            <View
              style={styles.list}
            >
              {templatesWithoutFolder.map(
                (template) => (
                  <TemplateCard
                    key={template.id}
                    template={
                      template
                    }
                    onPress={() =>
                      router.push({
                        pathname:
                          "/prescription-template-details",
                        params: {
                          templateId:
                            template.id,
                        },
                      })
                    }
                  />
                )
              )}
            </View>
          </>
        )}

        {templates.length === 0 && (
          <EmptyTemplates />
        )}
      </ScrollView>

      <View style={styles.fab}>
        <AppButton
          title="New Folder"
          icon="folder-open-outline"
          variant="secondary"
          style={styles.button}
          onPress={() =>
            setShowFolderDialog(true)
          }
        />

        <AppButton
          title="New Template"
          icon="add-outline"
          style={styles.button}
          onPress={() =>
            router.push("/new-template")
          }
        />
      </View>
      <TemplateFolderDialog
  visible={showFolderDialog}
  onClose={() =>
    setShowFolderDialog(false)
  }
  onSave={(name) => {
    console.log(name);

    setShowFolderDialog(false);
  }}
/>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    content: {
      padding: SPACING.md,
      paddingBottom: 120,
      gap: SPACING.lg,
    },

    list: {
      gap: SPACING.sm,
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