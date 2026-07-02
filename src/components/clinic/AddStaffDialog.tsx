import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import SectionHeader from "@/components/common/SectionHeader";

import {
    SPACING
} from "@/theme";
type Staff = {
  id: string;
  name: string;
  role: string;
  openingTime: string;
  closingTime: string;
  days: string[];
};
type Props = {
  visible: boolean;
  staff?: Staff | null;
  onClose: () => void;
  onSave?: (staff: {
    name: string;
    role: string;
    openingTime: string;
    closingTime: string;
    days: string[];
  }) => void;
};

export default function AddStaffDialog({
  visible,
  staff,
  onClose,
  onSave,
}: Props) {
  const [name, setName] =
    useState("");

  const [role, setRole] =
    useState("");

  const [openingTime, setOpeningTime] =
    useState("");

  const [closingTime, setClosingTime] =
    useState("");

  const [days, setDays] = useState<
    string[]
  >([]);
useEffect(() => {
  if (staff) {
    setName(staff.name);
    setRole(staff.role);
    setOpeningTime(staff.openingTime);
    setClosingTime(staff.closingTime);
    setDays(staff.days);
  } else {
    setName("");
    setRole("");
    setOpeningTime("");
    setClosingTime("");
    setDays([]);
  }
}, [staff, visible]);
  const workingDays = [
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ];

  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      setDays(
        days.filter((d) => d !== day)
      );
    } else {
      setDays([...days, day]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <AppCard style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >
            <SectionHeader title="Staff Information" />

            <AppTextField
              label="Full Name"
              value={name}
              onChangeText={setName}
            />

            <AppTextField
              label="Role"
              value={role}
              onChangeText={setRole}
            />

            <AppTextField
              label="Opening Time"
              placeholder="08:00 AM"
              value={openingTime}
              onChangeText={
                setOpeningTime
              }
            />

            <AppTextField
              label="Closing Time"
              placeholder="04:00 PM"
              value={closingTime}
              onChangeText={
                setClosingTime
              }
            />

            <SectionHeader title="Working Days" />

            <View style={styles.chips}>
              {workingDays.map((day) => (
                <AppChip
                  key={day}
                  label={day}
                  selected={days.includes(
                    day
                  )}
                  onPress={() =>
                    toggleDay(day)
                  }
                />
              ))}
            </View>

            <View style={styles.actions}>
              <AppButton
                title="Cancel"
                variant="secondary"
                style={styles.button}
                onPress={onClose}
              />

              <AppButton
                title={
                  staff ? "Update" : "Save"
                }
                style={styles.button}
                onPress={() => {
                  onSave?.({
                    name,
                    role,
                    openingTime,
                    closingTime,
                    days,
                  });

                  onClose();
                }}
              />
            </View>
          </ScrollView>
        </AppCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#00000066",
    padding: SPACING.lg,
  },

  card: {
    maxHeight: "85%",
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.xl,
  },

  button: {
    flex: 1,
  },
});