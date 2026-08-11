import {
  StyleSheet,
} from "react-native";

import { router } from "expo-router";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppTopBar from "@/components/common/AppTopBar";

import PatientBasicInformation from "@/components/patient-form/PatientBasicInformation";
import PatientContactInformation from "@/components/patient-form/PatientContactInformation";
import PatientOccupationInformation from "@/components/patient-form/PatientOccupationInformation";
import PatientAddressInformation from "@/components/patient-form/PatientAddressInformation";
import PatientActions from "@/components/patient-form/PatientActions";

import { useVisitStore } from "@/store/visitStore";

import {
  COLORS,
  SPACING,
} from "@/theme";

export default function NewPatientScreen() {
  const {
    visit,
    updateVisit,
  } = useVisitStore();

  const patient = visit.patient;

  const updatePatient = <
    K extends keyof typeof patient
  >(
    key: K,
    value: (typeof patient)[K],
  ) => {
    updateVisit({
      patient: {
        ...patient,
        [key]: value,
      },
    });
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <AppTopBar
        title="New Patient"
        onBack={() =>
          router.back()
        }
        onRightPress={() =>
          router.push("/settings")
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
        <PatientBasicInformation
          identifierType={
            patient.identifierType
          }
          documentType={
            patient.documentType
          }
          identifierNumber={
            patient.identifierNumber
          }
          fullName={patient.fullName}
          age={patient.age}
          ageUnit={patient.ageUnit}
          gender={patient.gender}
          maritalStatus={
            patient.maritalStatus
          }
          childrenCount={
            patient.childrenCount
          }
          onIdentifierTypeChange={(
            value,
          ) =>
            updatePatient(
              "identifierType",
              value,
            )
          }
          onDocumentTypeChange={(
            value,
          ) =>
            updatePatient(
              "documentType",
              value,
            )
          }
          onIdentifierNumberChange={(
            value,
          ) =>
            updatePatient(
              "identifierNumber",
              value,
            )
          }
          onFullNameChange={(value) =>
            updatePatient(
              "fullName",
              value,
            )
          }
          onAgeChange={(value) =>
            updatePatient(
              "age",
              value,
            )
          }
          onAgeUnitChange={(value) =>
            updatePatient(
              "ageUnit",
              value,
            )
          }
          onGenderChange={(value) =>
            updatePatient(
              "gender",
              value,
            )
          }
          onMaritalStatusChange={(
            value,
          ) =>
            updatePatient(
              "maritalStatus",
              value,
            )
          }
          onChildrenCountChange={(
            value,
          ) =>
            updatePatient(
              "childrenCount",
              value,
            )
          }
        />

        <PatientContactInformation
          phone={patient.phone}
          onPhoneChange={(value) =>
            updatePatient(
              "phone",
              value,
            )
          }
        />

        <PatientOccupationInformation
          occupation={
            patient.occupation
          }
          otherOccupation={
            patient.otherOccupation ??
            ""
          }
          onOccupationChange={(
            value,
          ) =>
            updatePatient(
              "occupation",
              value,
            )
          }
          onOtherOccupationChange={(
            value,
          ) =>
            updatePatient(
              "otherOccupation",
              value,
            )
          }
        />

        <PatientAddressInformation
          governorate={
            patient.governorate
          }
          city={patient.city}
          district={patient.district}
          street={patient.street}
          onGovernorateChange={(
            value,
          ) =>
            updatePatient(
              "governorate",
              value,
            )
          }
          onCityChange={(value) =>
            updatePatient(
              "city",
              value,
            )
          }
          onDistrictChange={(
            value,
          ) =>
            updatePatient(
              "district",
              value,
            )
          }
          onStreetChange={(value) =>
            updatePatient(
              "street",
              value,
            )
          }
        />

        <PatientActions />
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
});