import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useEffect, useState } from "react";
import { Modal, StyleSheet } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  visible: boolean;

  initialValue?: string;

  onClose: () => void;

  onSave: (name: string) => void;
};

export default function TemplateFolderDialog({
  visible,
  initialValue = "",
  onClose,
  onSave,
}: Props) {
  const [name, setName] =
    useState(initialValue);

  useEffect(() => {
    setName(initialValue);
  }, [initialValue, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <AppView style={styles.overlay}>
        <AppView style={styles.dialog}>
          <AppText style={styles.title}>
            Folder Name
          </AppText>

          <AppTextField
            placeholder="Folder Name"
            value={name}
            onChangeText={setName}
          />

          <AppView style={styles.actions}>
            <AppButton
              title="Cancel"
              variant="secondary"
              style={styles.button}
              onPress={onClose}
            />

            <AppButton
              title="Save"
              style={styles.button}
              onPress={() => {
                onSave(name.trim());
                setName("");
              }}
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
      "rgba(0,0,0,0.35)",

    justifyContent: "center",

    padding: SPACING.lg,
  },

  dialog: {
    backgroundColor: COLORS.card,

    borderRadius: RADIUS.xl,

    padding: SPACING.lg,

    gap: SPACING.lg,

    ...SHADOW,
  },

  title: {
    color: COLORS.text,

    fontSize: TYPOGRAPHY.subHeading,

    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",

    gap: SPACING.sm,
  },

  button: {
    flex: 1,
  },
});