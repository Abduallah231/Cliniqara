import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";
import AppTopBar from "@/components/common/AppTopBar";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import AppButton from "@/components/common/AppButton";

import { useDoctorStore } from "@/store/doctorStore";
import { updateDoctorProfile } from "@/services/doctorApi";
import AppDropdown from "@/components/common/AppDropdown";
import { SelectionOption } from "@/models/selection";
import {
  SPECIALTIES,
  PROFESSIONAL_TITLES,
} from "@/data/doctorOptions";

export default function EditProfileScreen() {
  const doctor = useDoctorStore(
    (state) => state.doctor
  );

  const [fullName, setFullName] =
    useState(doctor?.fullName ?? "");

  const [phone, setPhone] =
    useState(doctor?.phone ?? "");

  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SelectionOption | undefined>(
      doctor?.specialty
        ? SPECIALTIES.find(
            (x) => x.label === doctor.specialty
          )
        : undefined
    );

  const [selectedTitle, setSelectedTitle] =
    useState<SelectionOption | undefined>(
      doctor?.professionalTitle
        ? PROFESSIONAL_TITLES.find(
            (x) =>
              x.label ===
              doctor.professionalTitle
          )
        : undefined
    );

  const [loading, setLoading] =
  useState(false); 

  async function handleSave() {
    if (!doctor) return;

    if (
      fullName === doctor.fullName &&
      phone === doctor.phone &&
      selectedSpecialty?.label === doctor.specialty &&
      selectedTitle?.label === doctor.professionalTitle
    ) {
      router.back();
      return;
    }

    if (!fullName.trim()) {
    Alert.alert(
        "Validation",
        "Full name is required."
    );
    return;
    }

    if (!phone.trim()) {
    Alert.alert(
        "Validation",
        "Phone number is required."
    );
    return;
    }

    try {
        setLoading(true);

        await updateDoctorProfile({
          fullName,
          phone,
          specialty: selectedSpecialty?.label,
          professionalTitle: selectedTitle?.label,
        });

        Alert.alert(
        "Success",
        "Profile updated successfully."
        );

        router.dismiss();

    } catch {
        Alert.alert(
        "Error",
        "Failed to update profile."
        );
    } finally {
        setLoading(false);
    }
    }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppTopBar
        title="Edit Profile"
        onBack={() => router.back()}
      />

      <AppKeyboardAwareScrollView>
        <AppCard>

          <AppTextField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <AppTextField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <AppDropdown
            label="Specialty"
            options={SPECIALTIES}
            selected={selectedSpecialty}
            onChange={setSelectedSpecialty}
          />

          <AppDropdown
            label="Professional Title"
            options={PROFESSIONAL_TITLES}
            selected={selectedTitle}
            onChange={setSelectedTitle}
          />

        </AppCard>

        <AppButton
          title="Save Changes"
          loading={loading}
          onPress={handleSave}
        />

      </AppKeyboardAwareScrollView>
    </SafeAreaView>
  );
}