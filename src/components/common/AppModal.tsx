import { ReactNode } from "react";
import {
    Modal,
    Pressable,
    StyleProp,
    StyleSheet,
    ViewStyle
} from "react-native";

import {
    COLORS,
    OPACITY,
    RADIUS,
    SHADOW,
    SPACING,
} from "@/theme";

type Props = {
  visible: boolean;

  children: ReactNode;

  onClose: () => void;

  style?: StyleProp<ViewStyle>;
};

export default function AppModal({
  visible,
  children,
  onClose,
  style,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.container,
            style,
          ]}
          onPress={() => {}}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: `rgba(0,0,0,${OPACITY.overlay})`,
  },

  container: {
    width: "90%",

    backgroundColor: COLORS.white,

    borderRadius: RADIUS.xl,

    padding: SPACING.lg,

    ...SHADOW,
  },
});