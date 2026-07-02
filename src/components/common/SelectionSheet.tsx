import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SelectionOption } from "@/models/selection";
import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  visible: boolean;
  title: string;
  options: SelectionOption[];
  selectedId?: string;
  onClose: () => void;
  onSelect: (option: SelectionOption) => void;
};

export default function SelectionSheet({
  visible,
  title,
  options,
  selectedId,
  onClose,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;

    return options.filter((option) =>
      option.label
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setSearch("");
        onClose();
      }}
    >
      <View style={styles.overlay}>
        
        <AppCard style={styles.sheet}>

          <View style={styles.header}>
    <Text style={styles.title}>
        {title}
    </Text>

    <Pressable onPress={onClose}>
        <Ionicons
            name="close"
            size={22}
            color={COLORS.secondaryText}
        />
    </Pressable>
</View>

          <AppTextField
            value={search}
            onChangeText={setSearch}
            placeholder="Search governorate..."
          />
          <View style={{ height: SPACING.md }} />

          <FlatList
            data={filteredOptions}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.item,
                  item.id === selectedId &&
                    styles.selectedItem,
                ]}
                onPress={() => {
                  onSelect(item);
                  setSearch("");
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.itemText,
                    item.id === selectedId &&
                      styles.selectedText,
                  ]}
                >
                  {item.label}
                </Text>

                {item.id === selectedId && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={COLORS.primary}
                  />
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No governorate found.
              </Text>
            }
          />

        </AppCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000055",
  },

  sheet: {
    height: "75%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: SPACING.lg,
  },

  title: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingVertical: SPACING.md,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  selectedItem: {
    backgroundColor: "#F5F9FF",
  },

  itemText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },

  selectedText: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    color: COLORS.secondaryText,
    paddingVertical: SPACING.xl,
  },
  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: SPACING.md,
},
});