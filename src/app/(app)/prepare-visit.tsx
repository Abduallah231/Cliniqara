import AppButton from "@/components/common/AppButton";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppTopBar from "@/components/common/AppTopBar";
import type {
  MaritalStatus,
  PatientIdentifierType,
} from "@/types/patient";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import {
  useEffect,
  useState,
} from "react";
import {
  Alert,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

import PatientAddressInformation from "@/components/patient-form/PatientAddressInformation";
import PatientBasicInformation from "@/components/patient-form/PatientBasicInformation";
import PatientContactInformation from "@/components/patient-form/PatientContactInformation";
import PatientOccupationInformation from "@/components/patient-form/PatientOccupationInformation";

import { getErrorMessage } from "@/services/errorHandler";
import {
  updatePatient,
  verifyNationalId,
} from "@/services/patientApi";
import { usePatientStore } from "@/store/patientStore";

import {
  COLORS,
  SPACING,
} from "@/theme";
import PatientActions from "@/components/patient-form/PatientActions";


type PatientForm = {
  identifierType: string;
  identifierNumber: string;
  documentType: string;

  fullName: string;
  dateOfBirth: Date | null;

  age: string;
  ageUnit:
    | "Days"
    | "Months"
    | "Years";

  gender:
    | "male"
    | "female";

  maritalStatus:
    | "Single"
    | "Married"
    | "Divorced"
    | "Widowed";

  childrenCount: string;

  phone: string;

  occupation: string;
  otherOccupation: string;

  governorate: string;
  otherGovernorate: string;
  city: string;
  otherCity: string;
  district: string;
  street: string;
};

export default function EditPatientScreen() {
  const { patientId } =
    useLocalSearchParams<{
      patientId: string;
    }>();

  const {
    currentPatient,
    setCurrentPatient,
  } = usePatientStore();

  const [patient, setPatient] =
    useState<PatientForm | null>(null);

  const [loading, setLoading] =
    useState(false);
  
  const [
    verifyingNationalId,
    setVerifyingNationalId,
  ] = useState(false);

  const [
    nationalIdVerified,
    setNationalIdVerified,
  ] = useState(false);

  useEffect(() => {
    if (!currentPatient) {
      return;
    }

    const identifierTypeMap: Record<
      string,
      string
    > = {
      NATIONAL_ID: "National ID",
      PASSPORT: "Passport",
      OTHER: "Other",
      UNKNOWN: "Unknown",
    };

    const genderMap: Record<
      string,
      "male" | "female"
    > = {
      MALE: "male",
      FEMALE: "female",
    };

    const maritalStatusMap: Record<
      MaritalStatus,
      PatientForm["maritalStatus"]
    > = {
      SINGLE: "Single",
      MARRIED: "Married",
      DIVORCED: "Divorced",
      WIDOWED: "Widowed",
    };

    setPatient({
      identifierType:
        identifierTypeMap[
          currentPatient.identifierType
        ] ??
        currentPatient.identifierType,

      identifierNumber:
        currentPatient.identifierNumber ??
        "",

      documentType:
        currentPatient.documentType ??
        "",

      fullName:
        currentPatient.fullName ?? "",

      dateOfBirth:
        currentPatient.dateOfBirth
          ? new Date(
              currentPatient.dateOfBirth,
            )
          : null,

      age:
        currentPatient.estimatedAgeValue !=
        null
          ? String(
              currentPatient.estimatedAgeValue,
            )
          : "",

      ageUnit:
        currentPatient.estimatedAgeUnit ===
        "DAYS"
          ? "Days"
          : currentPatient.estimatedAgeUnit ===
              "MONTHS"
            ? "Months"
            : "Years",

      gender:
        genderMap[
          currentPatient.gender
        ] ?? "male",

      maritalStatus:
        maritalStatusMap[
          currentPatient.maritalStatus
        ] ?? "Single",

      childrenCount:
        currentPatient.childrenCount !=
        null
          ? String(
              currentPatient.childrenCount,
            )
          : "",

      phone:
        currentPatient.phone ?? "",

      occupation:
        currentPatient.occupation ?? "",

      otherOccupation:
        currentPatient.otherOccupation ??
        "",

      governorate:
        currentPatient.governorate ?? "",

      otherGovernorate:
        currentPatient.otherGovernorate ??
        "",

      city:
        currentPatient.city ?? "",

      otherCity:
        currentPatient.otherCity ?? "",

      district:
        currentPatient.district ?? "",

      street:
        currentPatient.streetAddress ?? "",
    });
  }, [currentPatient]);

  if (!patientId || !patient) {
    return null;
  }

  const isOriginalNationalId =
    currentPatient?.identifierType === "NATIONAL_ID";

  const updateField = <
    K extends keyof PatientForm
  >(
    key: K,
    value: PatientForm[K],
  ) => {
    setPatient((previous) =>
      previous
        ? {
            ...previous,
            [key]: value,
          }
        : previous,
    );
  };

  /*
   * ========================================
   * Save
   * ========================================
   *
   * Only editable patient information is sent.
   *
   * Identification / name / DOB / gender
   * are NOT changed here.
   */
  const handleSave = async () => {
    try {
      setLoading(true);

      const identifierTypeMap: Record<
        string,
        PatientIdentifierType
      > = {
        "National ID": "NATIONAL_ID",
        Passport: "PASSPORT",
        Other: "OTHER",
        Unknown: "UNKNOWN",
      };

      const maritalStatusMap: Record<
        PatientForm["maritalStatus"],
        MaritalStatus
      > = {
        Single: "SINGLE",
        Married: "MARRIED",
        Divorced: "DIVORCED",
        Widowed: "WIDOWED",
      };

      const updatePayload = {
        maritalStatus:
          maritalStatusMap[patient.maritalStatus],

        childrenCount:
          patient.childrenCount.trim() === ""
            ? undefined
            : Number(patient.childrenCount),

        phone:
          patient.phone.trim() || undefined,

        occupation:
          patient.occupation.trim() || undefined,

        governorate:
          patient.governorate.trim() || undefined,

        city:
          patient.city.trim() || undefined,

        district:
          patient.district.trim() || undefined,

        streetAddress:
          patient.street.trim() || undefined,

        fullName:
                patient.fullName.trim(),  

        ...(!isOriginalNationalId
          ? {
              identifierType:
                identifierTypeMap[patient.identifierType],

              identifierNumber:
                patient.identifierNumber.trim() ||
                undefined,

              documentType:
                patient.documentType.trim() ||
                undefined,              
            }
          : {}),
      };

      const updatedPatient =
        await updatePatient(
          patientId,
          updatePayload,
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

  /*
   * ========================================
   * National ID
   * ========================================
   *
   * Existing patient data is displayed,
   * but identification is not editable.
   */
  const isNationalId =
    patient.identifierType ===
    "National ID";

  const wasNationalId =
    currentPatient?.identifierType ===
    "NATIONAL_ID";

  const isIdentifierTypeLocked =
    wasNationalId;

  const isAgeLocked =
    wasNationalId ||
    nationalIdVerified;

  const isGenderLocked =
    wasNationalId ||
    nationalIdVerified;

  const calculateAgeFromDateOfBirth = (
    dateOfBirth: string,
  ): {
    age: string;
    ageUnit:
      | "Days"
      | "Months"
      | "Years";
  } => {
    const datePart =
      dateOfBirth.slice(0, 10);

    const [
      yearString,
      monthString,
      dayString,
    ] = datePart.split("-");

    const birthYear =
      Number(yearString);
    const birthMonth =
      Number(monthString);
    const birthDay =
      Number(dayString);

    if (
      !Number.isInteger(
        birthYear,
      ) ||
      !Number.isInteger(
        birthMonth,
      ) ||
      !Number.isInteger(
        birthDay,
      ) ||
      birthMonth < 1 ||
      birthMonth > 12 ||
      birthDay < 1 ||
      birthDay > 31
    ) {
      throw new Error(
        "Invalid date of birth returned by the server.",
      );
    }

    const today =
      new Date();

    let years =
      today.getFullYear() -
      birthYear;

    let months =
      today.getMonth() +
      1 -
      birthMonth;

    let days =
      today.getDate() -
      birthDay;

    if (days < 0) {
      months -= 1;

      const daysInPreviousMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
        ).getDate();

      days +=
        daysInPreviousMonth;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (
      years === 0 &&
      months === 0
    ) {
      return {
        age: String(
          Math.max(0, days),
        ),
        ageUnit: "Days",
      };
    }

    const totalMonths =
      years * 12 + months;

    if (totalMonths < 24) {
      return {
        age: String(
          totalMonths,
        ),
        ageUnit: "Months",
      };
    }

    return {
      age: String(years),
      ageUnit: "Years",
    };
  };

  const handleVerifyNationalId = async () => {
    const nationalId =
      patient.identifierNumber.trim();

    if (!nationalId) {
      Alert.alert(
        "National ID Required",
        "Please enter the National ID.",
      );
      return;
    }

    try {
      setVerifyingNationalId(true);

      const result =
        await verifyNationalId(
          nationalId,
        );

      if (result.alreadyExists) {
        Alert.alert(
          "Patient Already Exists",
          `This National ID already belongs to patient ${result.existingPatient?.patientCode ?? ""}.`,
        );

        setNationalIdVerified(false);
        return;
      }

      const calculatedAge =
        calculateAgeFromDateOfBirth(
          result.dateOfBirth,
        );

      setPatient((previous) =>
        previous
          ? {
              ...previous,

              gender:
                result.gender === "MALE"
                  ? "male"
                  : "female",

              age:
                calculatedAge.age,

              ageUnit:
                calculatedAge.ageUnit,
            }
          : previous,
      );

      setNationalIdVerified(
        true,
      );

      Alert.alert(
        "National ID Verified",
        "The National ID is valid.",
      );
    } catch (error) {
      setNationalIdVerified(
        false,
      );

      Alert.alert(
        "Unable to Verify National ID",
        getErrorMessage(error),
      );
    } finally {
      setVerifyingNationalId(
        false,
      );
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <AppTopBar
        title="Prepare Visit"
        onBack={() =>
          router.back()
        }
        onRightPress={() =>
          router.push(
            "/settings",
          )
        }
      />

      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
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
          fullName={
            patient.fullName
          }
          age={
            patient.age
          }
          ageUnit={
            patient.ageUnit
          }
          gender={
            patient.gender
          }
          maritalStatus={
            patient.maritalStatus
          }
          childrenCount={
            patient.childrenCount
          }

          /*
           * Identification is not
           * editable from Edit Patient.
           */
          onIdentifierTypeChange={(value) => {
            if (isIdentifierTypeLocked) {
              return;
            }

            updateField(
              "identifierType",
              value,
            );

            if (value !== "National ID") {
              setNationalIdVerified(false);
            }
          }}
          onDocumentTypeChange={(value) =>
            !isNationalId &&
            updateField(
              "documentType",
              value,
            )
          }
          onIdentifierNumberChange={(value) => {
            if (isIdentifierTypeLocked) {
              return;
            }

            updateField(
              "identifierNumber",
              value,
            );

            setNationalIdVerified(false);
          }}

          /*
           * Name is protected.
           */
          onFullNameChange={(value) =>
            updateField(
              "fullName",
              value,
            )
          }
          /*
           * Age / Gender are protected
           * for National ID patients.
           */
          onAgeChange={(value) =>
            !isAgeLocked &&
            updateField(
              "age",
              value,
            )
          }

          onAgeUnitChange={(value) =>
            !isAgeLocked &&
            updateField(
              "ageUnit",
              value,
            )
          }

          onGenderChange={(value) =>
            !isGenderLocked &&
            updateField(
              "gender",
              value,
            )
          }

          onMaritalStatusChange={(
            value,
          ) =>
            updateField(
              "maritalStatus",
              value,
            )
          }

          onChildrenCountChange={(
            value,
          ) =>
            updateField(
              "childrenCount",
              value,
            )
          }

          /*
           * No search / verification
           * while editing.
           */
          identifierSearchResults={[]}
          nameSearchResults={[]}
          searchingIdentifier={false}
          searchingName={false}
          nationalIdVerified={
            wasNationalId ||
            nationalIdVerified
          }
          verifyingNationalId={
            verifyingNationalId
          }
          onVerifyNationalId={
            handleVerifyNationalId
          }

          isAgeLocked={
            isAgeLocked
          }

          isGenderLocked={
            isGenderLocked
          }
        />

        <PatientContactInformation
          phone={patient.phone}
          onPhoneChange={(value) =>
            updateField(
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
            patient.otherOccupation
          }
          onOccupationChange={(
            value,
          ) =>
            updateField(
              "occupation",
              value,
            )
          }
          onOtherOccupationChange={(
            value,
          ) =>
            updateField(
              "otherOccupation",
              value,
            )
          }
        />

        <PatientAddressInformation
          governorate={
            patient.governorate
          }
          otherGovernorate={
            patient.otherGovernorate
          }
          city={patient.city}
          otherCity={
            patient.otherCity
          }
          district={
            patient.district
          }
          street={patient.street}
          onGovernorateChange={(
            value,
          ) => {
            setPatient((previous) =>
              previous
                ? {
                    ...previous,
                    governorate:
                      value,
                    city: "",
                    otherCity: "",
                  }
                : previous,
            );
          }}
          onOtherGovernorateChange={(
            value,
          ) =>
            updateField(
              "otherGovernorate",
              value,
            )
          }
          onCityChange={(value) => {
            setPatient((previous) =>
              previous
                ? {
                    ...previous,
                    city: value,
                    otherCity: "",
                  }
                : previous,
            );
          }}
          onOtherCityChange={(value) =>
            updateField(
              "otherCity",
              value,
            )
          }
          onDistrictChange={(value) =>
            updateField(
              "district",
              value,
            )
          }
          onStreetChange={(value) =>
            updateField(
              "street",
              value,
            )
          }
        />

        <PatientActions
            patient={patient}
            existingPatientId={patientId}
        />

      </AppKeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    scroll: {
      flex: 1,
    },

    content: {
      paddingHorizontal:
        SPACING.lg,
      paddingTop:
        SPACING.md,
      paddingBottom:
        SPACING.xl,
    },

    saveButton: {
      marginTop:
        SPACING.lg,
      marginBottom:
        SPACING.md,
    },
  });