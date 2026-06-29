
import {
  Pressable,
  StyleSheet,
  Text
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppDivider from "@/components/common/AppDivider";
import AppModal from "@/components/common/AppModal";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  visible: boolean;

  isFavorite?: boolean;

  onClose: () => void;

  onToggleFavorite?: () => void;

  onPrint?: () => void;

  onExportPdf?: () => void;

  onShare?: () => void;

  onDelete?: () => void;
};

export default function PatientMenu({
  visible,
  isFavorite = false,
  onClose,
  onToggleFavorite,
  onPrint,
  onExportPdf,
  onShare,
  onDelete,
}: Props) {
  return (
    <AppModal
      visible={visible}
      onClose={onClose}
    >
      <Text style={styles.title}>
        Patient Options
      </Text>

      <MenuItem
        icon={
          isFavorite
            ? "star"
            : "star-outline"
        }
        label={
          isFavorite
            ? "Remove from Favorites"
            : "Add to Favorites"
        }
        onPress={onToggleFavorite}
      />

      <MenuItem
        icon="print-outline"
        label="Print Summary"
        onPress={onPrint}
      />

      <MenuItem
        icon="document-text-outline"
        label="Export PDF"
        onPress={onExportPdf}
      />

      <MenuItem
        icon="share-social-outline"
        label="Share Report"
        onPress={onShare}
      />

      <AppDivider />

      <MenuItem
        icon="trash-outline"
        label="Delete Patient"
        color={COLORS.danger}
        onPress={onDelete}
      />
    </AppModal>
  );
}

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;

  label: string;

  color?: string;

  onPress?: () => void;
};

function MenuItem({
  icon,
  label,
  color = COLORS.text,
  onPress,
}: MenuItemProps) {
  return (
    <Pressable
      style={styles.item}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={color}
      />

      <Text
        style={[
          styles.label,
          { color },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: TYPOGRAPHY.heading,

    fontWeight: "700",

    color: COLORS.text,

    marginBottom: SPACING.lg,
  },

  item: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: SPACING.md,
  },

  label: {
    marginLeft: SPACING.md,

    fontSize: TYPOGRAPHY.body,
  },
});