import AppTextField from "@/components/common/AppTextField";
import { SelectionOption } from "@/models/selection";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    const keyword = search.trim().toLowerCase();

    const sorted = [...options].sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    if (!keyword) return sorted;

    return sorted.filter((item) =>
      item.label.toLowerCase().includes(keyword)
    );
  }, [options, search]);

  const closeSheet = () => {
    setSearch("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={closeSheet}
    >
      <Pressable
        style={styles.overlay}
        onPress={closeSheet}
      >
        <Pressable
          style={styles.sheet}
          onPress={() => {}}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {title}
            </Text>

            <Pressable onPress={closeSheet}>
              <Ionicons
                name="close"
                size={24}
                color={COLORS.secondaryText}
              />
            </Pressable>
          </View>

          <AppTextField
            value={search}
            onChangeText={setSearch}
            placeholder={`Search ${title.toLowerCase()}...`}
          />

          <View style={{ height: SPACING.md }} />

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: SPACING.md,
            }}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.item,
                  item.id === selectedId &&
                    styles.selectedItem,
                ]}
                onPress={() => {
                  onSelect(item);
                  closeSheet();
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
              <Pressable
                style={styles.item}
                onPress={() => {
                  onSelect({
                    id: "other",
                    label: "Other",
                  });

                  closeSheet();
                }}
              >
                <Text style={styles.itemText}>
                  Other
                </Text>
              </Pressable>
            }
          />
        </Pressable>
      </Pressable>
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
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: "75%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  title: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "700",
    color: COLORS.text,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});