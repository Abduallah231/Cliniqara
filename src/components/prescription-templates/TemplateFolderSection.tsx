import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import SectionHeader from "@/components/common/SectionHeader";
import TemplateCard from "./TemplateCard";

import {
  PrescriptionTemplate,
  TemplateFolder,
} from "@/models";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  folder: TemplateFolder;

  templates: PrescriptionTemplate[];

  onTemplatePress: (
    template: PrescriptionTemplate
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
    <View style={styles.container}>
      <View style={styles.header}>
        <SectionHeader title={folder.name} />

        <View style={styles.count}>
          <Ionicons
            name="folder-open-outline"
            size={16}
            color={COLORS.secondaryText}
          />

          <Text style={styles.countText}>
            {templates.length}
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPress={() =>
              onTemplatePress(template)
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  count: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  countText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
  },

  list: {
    gap: SPACING.sm,
  },
});