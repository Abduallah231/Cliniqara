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

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  openingTime: string;
  closingTime: string;
  days: string[];
};

type Props = {
  visible: boolean;
  doctor?: Doctor | null;
  onClose: () => void;
  onSave?: (doctor: {
    name: string;
    specialty: string;
    openingTime: string;
    closingTime: string;
    days: string[];
  }) => void;
};



export default function AddDoctorDialog({
  visible,
  doctor,
  onClose,
  onSave,
}: Props) {
  const [name, setName] =
    useState("");

  const [specialty, setSpecialty] =
    useState("");

  const [openingTime, setOpeningTime] =
    useState("");

  const [closingTime, setClosingTime] =
    useState("");

  const [days, setDays] = useState<
    string[]
  >([]);

  useEffect(() => {
  if (doctor) {
    setName(doctor.name);
    setSpecialty(doctor.specialty);
    setOpeningTime(doctor.openingTime);
    setClosingTime(doctor.closingTime);
    setDays(doctor.days);
  } else {
    setName("");
    setSpecialty("");
    setOpeningTime("");
    setClosingTime("");
    setDays([]);
  }
}, [doctor, visible]);

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
            <SectionHeader title="Doctor Information" />

            <AppTextField
              label="Full Name"
              value={name}
              onChangeText={setName}
            />

            <AppTextField
              label="Specialty"
              value={specialty}
              onChangeText={
                setSpecialty
              }
            />

            <AppTextField
              label="Opening Time"
              placeholder="09:00 AM"
              value={openingTime}
              onChangeText={
                setOpeningTime
              }
            />

            <AppTextField
              label="Closing Time"
              placeholder="03:00 PM"
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
                  doctor ? "Update" : "Save"
                }
                style={styles.button}
                onPress={() => {
                  onSave?.({
                    name,
                    specialty,
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