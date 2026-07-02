import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SelectionSheet from "./SelectionSheet";
import { SelectionOption } from "@/models/selection";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  label?: string;
  placeholder?: string;
  selected?: SelectionOption;
  options: SelectionOption[];
  onChange: (option: SelectionOption) => void;
};

export default function AppDropdown({
  label,
  placeholder = "Select...",
  selected,
  options,
  onChange,
}: Props) {
  const [visible, setVisible] =
    useState(false);

  return (
    <>
      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}

      <Pressable
        style={styles.field}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            styles.value,
            !selected && styles.placeholder,,
          ]}
        >
          {selected?.label ?? placeholder}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color={COLORS.secondaryText}
        />
      </Pressable>

      <SelectionSheet
        visible={visible}
        title={label ?? "Select"}
        options={options}
        selectedId={selected?.id}
        onClose={() => setVisible(false)}
        onSelect={(option) => {
        onChange(option);
        setVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: SPACING.sm,
    color: COLORS.secondaryText,
    fontWeight: "600",
    fontSize: TYPOGRAPHY.small,
  },

  field: {
    minHeight: 52,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    ...SHADOW,
  },

  value: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
  },

  placeholder: {
    color: COLORS.placeholder,
  },
});