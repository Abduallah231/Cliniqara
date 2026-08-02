import DoctorCard from "@/components/clinic/DoctorCard";
import StaffCard from "@/components/clinic/StaffCard";
import AddDoctorDialog from "@/components/clinic/AddDoctorDialog";
import AddStaffDialog from "@/components/clinic/AddStaffDialog";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import { useVisitStore } from "@/store/visitStore";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import { router } from "expo-router";

import { useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ClinicManagementScreen() {

  const {
    visit,
    updateClinicInformation,
    updateWorkingHours,
    addDoctor,
    updateDoctor,
    removeDoctor,

    addStaff,
    updateStaff,
    removeStaff,

  } = useVisitStore();

  const clinic = visit.clinic;

  const workingDays = [
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ];

  const toggleWorkingDay = (
    day: string
  ) => {
    const current =
      (clinic.workingHours.days as string[]) ?? [];

    const updated =
      current.includes(day)
        ? current.filter(
            (item) =>
              item !== day
          )
        : [...current, day];

    updateWorkingHours({
      days: updated,
    });
  };

  const [editingDoctor, setEditingDoctor] =
    useState<any>(null);

  const [editingStaff, setEditingStaff] =
    useState<any>(null);

  const [
    showDoctorDialog,
    setShowDoctorDialog,
  ] = useState(false);

  const [
    showStaffDialog,
    setShowStaffDialog,
  ] = useState(false);

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

        <SectionHeader
          title="Clinic Information"
        />

        <AppCard>

          <AppTextField
            label="Clinic Name"
            value={
              (clinic.information.clinicName as string) ?? ""
            }
            onChangeText={(v) =>
                updateClinicInformation({
                    clinicName: v,
                })
            }
          />

          <Divider />

          <AppTextField
            label="Phone Number"
            keyboardType="phone-pad"
            value={
              (clinic.information.phone as string) ?? ""
            }
            onChangeText={(v) =>
              updateClinicInformation({
                  phone: v,
              })
            }
          />

          <Divider />

          <AppTextField
            label="Address"
            multiline
            value={
              (clinic.information.address as string) ?? ""
            }
            onChangeText={(v) =>
              updateClinicInformation({
                  address: v,
              })
            }
          />

        </AppCard>

        <SectionHeader
          title="Clinic Working Hours"
        />

        <AppCard>

          <AppTextField
            label="Opening Time"
            placeholder="08:00 AM"
            value={
              (clinic.workingHours.openingTime as string) ?? ""
            }
            onChangeText={(v) =>
              updateWorkingHours({
                  openingTime: v,
              })
            }
          />

          <Divider />

          <AppTextField
            label="Closing Time"
            placeholder="05:00 PM"
            value={
              (clinic.workingHours.closingTime as string) ?? ""
            }
            onChangeText={(v) =>
              updateWorkingHours({
                  closingTime: v,
              })
            }
          />

          <Divider />

          <Text style={styles.label}>
            Working Days
          </Text>

          <View style={styles.chips}>
            {workingDays.map(
              (day) => (
                <AppChip
                  key={day}
                  label={day}
                  selected={
                    (
                      (clinic.workingHours.days as string[]) ??
                      []
                    ).includes(day)
                  }
                  onPress={() =>
                    toggleWorkingDay(
                      day
                    )
                  }
                />
              )
            )}
          </View>

        </AppCard>

                <SectionHeader title="Doctors" />

        {clinic.doctors.map((doctor) => (
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
              removeDoctor(doctor.id)
            }
          />
        ))}

        {clinic.doctors.length === 0 && (
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

        <Divider />

        <SectionHeader title="Staff Members" />

        {clinic.staff.map((staff) => (
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
              removeStaff(staff.id)
            }
          />
        ))}

        {clinic.staff.length === 0 && (
          <AppCard>
            <Text style={styles.emptyText}>
              No staff members added yet
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
              updateDoctor(
                editingDoctor.id,
                doctor
              );
            } else {
              addDoctor({
                id: Date.now().toString(),
                ...doctor,
              });
            }

            setEditingDoctor(null);
            setShowDoctorDialog(false);
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
              updateStaff(
                editingStaff.id,
                staff
              );
            } else {
              addStaff({
                id: Date.now().toString(),
                ...staff,
              });
            }

            setEditingStaff(null);
            setShowStaffDialog(false);
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
    gap: SPACING.xs,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    paddingVertical: SPACING.md,
  },
});