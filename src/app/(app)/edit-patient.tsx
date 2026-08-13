import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getErrorMessage } from "@/services/errorHandler";
import AppButton from "@/components/common/AppButton";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppTopBar from "@/components/common/AppTopBar";

import PatientContactInformation from "@/components/patient-form/PatientContactInformation";
import PatientOccupationInformation from "@/components/patient-form/PatientOccupationInformation";
import PatientAddressInformation from "@/components/patient-form/PatientAddressInformation";

import {
  updatePatient,
} from "@/services/patientApi";

import { usePatientStore } from "@/store/patientStore";

import {
  COLORS,
  SPACING,
} from "@/theme";
import AppTextField from "@/components/common/AppTextField";

export default function EditPatientScreen() {
  const { patientId } =
    useLocalSearchParams<{
      patientId: string;
    }>();

  const {
    currentPatient,
    setCurrentPatient,
  } = usePatientStore();

  const [phone, setPhone] =
    useState(
      currentPatient?.phone ?? "",
    );

  const [occupation, setOccupation] =
    useState(
      currentPatient?.occupation ?? "",
    );

  const [childrenCount, setChildrenCount] =
    useState(
      currentPatient?.childrenCount != null
        ? String(currentPatient.childrenCount)
        : "",
    );

  const [otherOccupation, setOtherOccupation] =
    useState(
      currentPatient?.otherOccupation ?? "",
    );

  const [governorate, setGovernorate] =
    useState(
      currentPatient?.governorate ?? "",
    );

  const [otherGovernorate, setOtherGovernorate] =
    useState(
      currentPatient?.otherGovernorate ?? "",
    );

  const [city, setCity] = useState(
    currentPatient?.city ?? "",
  );

  const [otherCity, setOtherCity] =
    useState(
      currentPatient?.otherCity ?? "",
    );

  const [district, setDistrict] =
    useState(
      currentPatient?.district ?? "",
    );

  const [streetAddress, setStreetAddress] =
    useState(
      currentPatient?.streetAddress ?? "",
    );

  const [loading, setLoading] =
    useState(false);

  if (!patientId || !currentPatient) {
    return null;
  }

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedPatient =
        await updatePatient(
          patientId,
          {
            phone:
              phone.trim() || undefined,

            occupation:
              occupation.trim() ||
              undefined,

            childrenCount:
              childrenCount.trim() === ""
                ? undefined
                : Number(childrenCount),

            governorate:
              governorate.trim() ||
              undefined,

            city:
              city.trim() || undefined,

            district:
              district.trim() ||
              undefined,

            streetAddress:
              streetAddress.trim() ||
              undefined,
          },
        );

      setCurrentPatient(
        updatedPatient,
      );

      Alert.alert(
        "Patient Updated",
        "Patient information has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () =>
              router.back(),
          },
        ],
      );
    } catch (error) {
    Alert.alert(
        "Unable to Update Patient",
        getErrorMessage(error),
    );
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <AppTopBar
        title="Edit Patient"
        onBack={() =>
          router.back()
        }
      />

      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PatientContactInformation
          phone={phone}
          onPhoneChange={setPhone}
        />

        <PatientOccupationInformation
          occupation={occupation}
          otherOccupation={otherOccupation}
          onOccupationChange={setOccupation}
          onOtherOccupationChange={setOtherOccupation}
        />

        <AppTextField
          label="Number of Children"
          keyboardType="numeric"
          value={childrenCount}
          onChangeText={setChildrenCount}
        />

        <PatientAddressInformation
          governorate={governorate}
          otherGovernorate={otherGovernorate}
          city={city}
          otherCity={otherCity}
          district={district}
          street={streetAddress}

          onGovernorateChange={(value) => {
            setGovernorate(value);
            setCity("");
            setOtherCity("");
          }}

          onOtherGovernorateChange={
            setOtherGovernorate
          }

          onCityChange={(value) => {
            setCity(value);
            setOtherCity("");
          }}

          onOtherCityChange={setOtherCity}

          onDistrictChange={setDistrict}
          onStreetChange={setStreetAddress}
        />

        <AppButton
          title="Save Changes"
          loading={loading}
          onPress={handleSave}
          style={styles.saveButton}
        />

        <AppButton
          title="Cancel"
          variant="secondary"
          disabled={loading}
          onPress={() =>
            router.back()
          }
        />
      </AppKeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  saveButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
});