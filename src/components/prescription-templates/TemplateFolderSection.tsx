import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

import SectionHeader from "@/components/common/SectionHeader";

import type {
  PrescriptionTemplate,
  PrescriptionTemplateFolder,
} from "@/services/prescriptionTemplateApi";

import TemplateCard from "./TemplateCard";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  folder: PrescriptionTemplateFolder;
  templates: PrescriptionTemplate[];
  onTemplatePress: (
    template: PrescriptionTemplate,
  ) => void;
};

export default function TemplateFolderSection({
  folder,
  templates,
  onTemplatePress,
}: Props) {
  if (templates.length === 0) {
    return null;
  }

  return (
    <AppView
      style={styles.container}
    >
      <AppView style={styles.header}>
        <SectionHeader
          title={folder.name}
        />

        <AppView
          style={styles.count}
        >
          <Ionicons
            name="folder-open-outline"
            size={16}
            color={
              COLORS.secondaryText
            }
          />

          <AppText
            style={
              styles.countText
            }
          >
            {templates.length}
          </AppText>
        </AppView>
      </AppView>

      <AppView style={styles.list}>
        {templates.map(
          (template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPress={() =>
                onTemplatePress(
                  template,
                )
              }
            />
          ),
        )}
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  count: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  countText: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
    fontWeight: "600",
  },

  list: {
    gap: SPACING.sm,
  },
});