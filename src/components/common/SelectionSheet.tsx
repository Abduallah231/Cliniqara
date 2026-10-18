import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import AppTextField from "@/components/common/AppTextField";
import { SelectionOption } from "@/models/selection";
import {
  COLORS, SPACING, TYPOGRAPHY, } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet } from "react-native";

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
      <AppPressable
        style={styles.overlay}
        onPress={closeSheet}
      >
        <AppPressable
          style={styles.sheet}
          onPress={() => {}}
        >
          <AppView style={styles.header}>
            <AppText style={styles.title}>
              {title}
            </AppText>

            <AppPressable onPress={closeSheet}>
              <Ionicons
                name="close"
                size={24}
                color={COLORS.secondaryText}
              />
            </AppPressable>
          </AppView>

          <AppTextField
            value={search}
            onChangeText={setSearch}
            placeholder={`Search ${title.toLowerCase()}...`}
          />

          <AppView style={{ height: SPACING.md }} />

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: SPACING.md,
            }}
            renderItem={({ item }) => (
              <AppPressable
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
                <AppText
                  style={[
                    styles.itemText,
                    item.id === selectedId &&
                      styles.selectedText,
                  ]}
                >
                  {item.label}
                </AppText>

                {item.id === selectedId && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={COLORS.primary}
                  />
                )}
              </AppPressable>
            )}
            ListEmptyComponent={
              <AppPressable
                style={styles.item}
                onPress={() => {
                  onSelect({
                    id: "other",
                    label: "Other",
                  });

                  closeSheet();
                }}
              >
                <AppText style={styles.itemText}>
                  Other
                </AppText>
              </AppPressable>
            }
          />
        </AppPressable>
      </AppPressable>
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