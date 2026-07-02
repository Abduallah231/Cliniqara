import DoctorCard from "@/components/clinic/DoctorCard";
import StaffCard from "@/components/clinic/StaffCard";
import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddDoctorDialog from "@/components/clinic/AddDoctorDialog";
import AddStaffDialog from "@/components/clinic/AddStaffDialog";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  openingTime: string;
  closingTime: string;
  days: string[];
};

type Staff = {
  id: string;
  name: string;
  role: string;
  openingTime: string;
  closingTime: string;
  days: string[];
};

export default function ClinicManagementScreen() {
  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [staffMembers, setStaffMembers] =
    useState<Staff[]>([]);

  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(null);

  const [editingStaff, setEditingStaff] =
    useState<Staff | null>(null);

  const [clinicName, setClinicName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [openingTime, setOpeningTime] =
    useState("");

  const [closingTime, setClosingTime] =
    useState("");

  const [days, setDays] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
  ]);

  const [showDoctorDialog, setShowDoctorDialog] =
  useState(false);

const [showStaffDialog, setShowStaffDialog] =
  useState(false);

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
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Clinic Management"
        onBack={() =>
          router.back()
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <SectionHeader title="Clinic Information" />

        <AppCard>
          <AppTextField
            label="Clinic Name"
            value={clinicName}
            onChangeText={setClinicName}
          />

          <AppTextField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
          />

          <AppTextField
            label="Address"
            multiline
            value={address}
            onChangeText={setAddress}
          />
        </AppCard>

        <SectionHeader title="Clinic Working Hours" />

        <AppCard>
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
            placeholder="05:00 PM"
            value={closingTime}
            onChangeText={
              setClosingTime
            }
          />

          <Text style={styles.label}>
            Working Days
          </Text>

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
          </AppCard>
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            name={doctor.name}
            specialty={doctor.specialty}
            days={doctor.days.join(" • ")}
            hours={`${doctor.openingTime} - ${doctor.closingTime}`}
            onEdit={() => {
              setEditingDoctor(doctor);
              setShowDoctorDialog(true);
            }}
            onDelete={() =>
              setDoctors(
                doctors.filter(
                  (d) => d.id !== doctor.id
                )
              )
            }
          />
        ))}

        {doctors.length === 0 && (
          <AppCard>
            <Text style={styles.emptyText}>
              No doctors added yet
            </Text>
          </AppCard>
        )}

        <AppButton
          title="Add Doctor"
          icon="add-outline"
          onPress={() => {
            setEditingDoctor(null);
            setShowDoctorDialog(true);
          }}
        />

        <SectionHeader title="Staff" />

        {staffMembers.map((staff) => (
          <StaffCard
            key={staff.id}
            name={staff.name}
            role={staff.role}
            days={staff.days.join(" • ")}
            hours={`${staff.openingTime} - ${staff.closingTime}`}
            onEdit={() => {
              setEditingStaff(staff);
              setShowStaffDialog(true);
            }}
            onDelete={() =>
              setStaffMembers(
                staffMembers.filter(
                  (s) => s.id !== staff.id
                )
              )
            }
          />
        ))}

        {staffMembers.length === 0 && (
          <AppCard>
            <Text style={styles.emptyText}>
              No staff members yet
            </Text>
          </AppCard>
        )}

        <AppButton
          title="Add Staff"
          icon="add-outline"
          onPress={() => {
            setEditingStaff(null);
            setShowStaffDialog(true);
          }}
        />
        <AddDoctorDialog
          visible={showDoctorDialog}
          doctor={editingDoctor}
          onClose={() => {
            setEditingDoctor(null);
            setShowDoctorDialog(false);
          }}
          onSave={(doctor) => {
            if (editingDoctor) {
              setDoctors(
                doctors.map((d) =>
                  d.id === editingDoctor.id
                    ? {
                        ...editingDoctor,
                        ...doctor,
                      }
                    : d
                )
              );
            } else {
              setDoctors([
                ...doctors,
                {
                  id: Date.now().toString(),
                  ...doctor,
                },
              ]);
            }
          }}
        />

        <AddStaffDialog
          visible={showStaffDialog}
          staff={editingStaff}
          onClose={() => {
            setEditingStaff(null);
            setShowStaffDialog(false);
          }}
          onSave={(staff) => {
            if (editingStaff) {
              setStaffMembers(
                staffMembers.map((s) =>
                  s.id === editingStaff.id
                    ? {
                        ...editingStaff,
                        ...staff,
                      }
                    : s
                )
              );
            } else {
              setStaffMembers([
                ...staffMembers,
                {
                  id: Date.now().toString(),
                  ...staff,
                },
              ]);
            }
          }}
        />

              </ScrollView>
            </SafeAreaView>
          );
        }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  title: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
  },

  label: {
    marginBottom: SPACING.sm,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
  },

  emptyText: {
  textAlign: "center",
  color: COLORS.secondaryText,
  marginVertical: SPACING.md,
},
});