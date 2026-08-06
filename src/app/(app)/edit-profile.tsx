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

export default function EditProfileScreen() {
  const doctor = useDoctorStore(
    (state) => state.doctor
  );

  const [fullName, setFullName] =
    useState(doctor?.fullName ?? "");

  const [phone, setPhone] =
    useState(doctor?.phone ?? "");

  const [loading, setLoading] =
  useState(false); 

  async function handleSave() {
    if (!doctor) return;

    if (
        fullName === doctor.fullName &&
        phone === doctor.phone
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

          <AppButton
            title="Save Changes"
            loading={loading}
            onPress={handleSave}
            />

        </AppCard>

      </AppKeyboardAwareScrollView>
    </SafeAreaView>
  );
}