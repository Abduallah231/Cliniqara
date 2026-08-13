import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  StyleSheet,
} from "react-native";

import {
  router,
} from "expo-router";

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

import {
  searchPatients,
  verifyNationalId,
} from "@/services/patientApi";

import {
  COLORS,
  SPACING,
} from "@/theme";

/*
 * =========================
 * Patient Form Type
 * =========================
 *
 * This screen owns the patient form state.
 *
 * No visitStore dependency here.
 */
type PatientForm = {
  id?: string;

  // Identification
  identifierType: string;
  identifierNumber: string;
  documentType: string;

  // Basic Information
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

  // Contact
  phone: string;

  // Occupation
  occupation: string;
  otherOccupation: string;

  // Address
  governorate: string;
  otherGovernorate: string;
  city: string;
  otherCity: string;
  district: string;
  street: string;
};

/*
 * =========================
 * Empty Patient
 * =========================
 */
const createEmptyPatient =
  (): PatientForm => ({
    identifierType:
      "National ID",

    identifierNumber: "",

    documentType: "",

    fullName: "",

    dateOfBirth: null,

    age: "",

    ageUnit: "Years",

    gender: "male",

    maritalStatus:
      "Single",

    childrenCount: "",

    phone: "",

    occupation: "",

    otherOccupation: "",

    governorate: "",

    otherGovernorate: "",

    city: "",

    otherCity: "",

    district: "",

    street: "",
  });

export default function NewPatientScreen() {
  /*
   * =========================
   * Patient State
   * =========================
   *
   * The patient form now belongs
   * entirely to this screen.
   */
  const [
    patient,
    setPatient,
  ] = useState<PatientForm>(
    createEmptyPatient,
  );

  /*
   * =========================
   * Patient Update
   * =========================
   */
  const updatePatient = <
    K extends keyof PatientForm
  >(
    key: K,
    value: PatientForm[K],
  ) => {
    setPatient((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /*
   * =========================
   * Patient Search
   * =========================
   */
  const [
    identifierSearchResults,
    setIdentifierSearchResults,
  ] = useState<any[]>([]);

  const [
    nameSearchResults,
    setNameSearchResults,
  ] = useState<any[]>([]);

  const [
    searchingIdentifier,
    setSearchingIdentifier,
  ] = useState(false);

  const [
    searchingName,
    setSearchingName,
  ] = useState(false);

  const identifierSearchTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const nameSearchTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  /*
   * =========================
   * National ID State
   * =========================
   */
  const [
    nationalIdVerified,
    setNationalIdVerified,
  ] = useState(false);

  const [
    verifyingNationalId,
    setVerifyingNationalId,
  ] = useState(false);

  /*
   * =========================
   * Search By Identifier
   * =========================
   *
   * National ID / Passport only.
   */
  useEffect(() => {
    if (
      identifierSearchTimer.current
    ) {
      clearTimeout(
        identifierSearchTimer.current,
      );
    }

    const query =
      patient.identifierNumber.trim();

    const shouldSearch =
      (
        patient.identifierType ===
          "National ID" ||
        patient.identifierType ===
          "Passport"
      ) &&
      query.length > 0;

    if (!shouldSearch) {
      setIdentifierSearchResults([]);
      setSearchingIdentifier(false);
      return;
    }

    identifierSearchTimer.current =
      setTimeout(async () => {
        try {
          setSearchingIdentifier(true);

          const results =
            await searchPatients(
              query,
            );

          setIdentifierSearchResults(
            results,
          );
        } catch (error) {
          console.error(
            "Identifier search failed:",
            error,
          );

          setIdentifierSearchResults(
            [],
          );
        } finally {
          setSearchingIdentifier(
            false,
          );
        }
      }, 350);

    return () => {
      if (
        identifierSearchTimer.current
      ) {
        clearTimeout(
          identifierSearchTimer.current,
        );
      }
    };
  }, [
    patient.identifierNumber,
    patient.identifierType,
  ]);

  /*
   * =========================
   * Search By Name
   * =========================
   *
   * Name search is allowed only
   * when Identification Number is
   * empty / unknown.
   */
  useEffect(() => {
    if (
      nameSearchTimer.current
    ) {
      clearTimeout(
        nameSearchTimer.current,
      );
    }

    const query =
      patient.fullName.trim();

    const shouldSearch =
      query.length > 0 &&
      (
        patient.identifierType ===
          "Unknown" ||
        patient.identifierNumber.trim() ===
          ""
      );

    if (!shouldSearch) {
      setNameSearchResults([]);
      setSearchingName(false);
      return;
    }

    nameSearchTimer.current =
      setTimeout(async () => {
        try {
          setSearchingName(true);

          const results =
            await searchPatients(
              query,
            );

          setNameSearchResults(
            results,
          );
        } catch (error) {
          console.error(
            "Name search failed:",
            error,
          );

          setNameSearchResults([]);
        } finally {
          setSearchingName(false);
        }
      }, 350);

    return () => {
      if (
        nameSearchTimer.current
      ) {
        clearTimeout(
          nameSearchTimer.current,
        );
      }
    };
  }, [
    patient.fullName,
    patient.identifierNumber,
    patient.identifierType,
  ]);

  /*
   * =========================
   * Identification Type Change
   * =========================
   */
  const handleIdentifierTypeChange =
    (value: string) => {
      setNationalIdVerified(false);

      setIdentifierSearchResults([]);

      setPatient((previous) => ({
        ...previous,

        identifierType:
          value,

        documentType:
          value === "Other"
            ? previous.documentType
            : "",

        identifierNumber:
          value === "Unknown"
            ? ""
            : previous.identifierNumber,

        age:
          value === "National ID"
            ? previous.age
            : "",

        gender:
          value === "National ID"
            ? previous.gender
            : ("" as PatientForm["gender"]),
      }));
    };

  /*
   * =========================
   * Identifier Number Change
   * =========================
   */
  const handleIdentifierNumberChange =
    (value: string) => {
      /*
       * Any modification to the ID
       * invalidates previous verification.
       */
      setNationalIdVerified(false);

      /*
       * Never keep calculated
       * Age/Gender from a previous
       * National ID.
       */
      if (
        patient.identifierType ===
        "National ID"
      ) {
        setPatient((previous) => ({
          ...previous,

          identifierNumber:
            value,

          age: "",

          gender:
            "" as PatientForm["gender"],
        }));

        return;
      }

      updatePatient(
        "identifierNumber",
        value,
      );
    };

  /*
   * =========================
   * Full Name Change
   * =========================
   */
  const handleFullNameChange =
    (value: string) => {
      updatePatient(
        "fullName",
        value,
      );

      /*
       * Search results correspond
       * to the current text only.
       */
      setNameSearchResults([]);
    };

  /*
   * =========================
   * Select Existing Patient
   * =========================
   */
  const handlePatientSelect =
    (selectedPatient: any) => {
      /*
       * The selected patient belongs
       * to the current clinic because
       * searchPatients() sends the
       * current clinic context.
       *
       * Open Patient Overview directly.
       */
      router.push({
        pathname:
          "/patient-overview",

        params: {
          patientId:
            selectedPatient.id,
        },
      });
    };

  /*
   * =========================
   * Calculate Age From DOB
   * =========================
   */
  const calculateAgeFromDateOfBirth =
    (
      dateOfBirth: string,
    ): {
      age: string;
      ageUnit:
        | "Days"
        | "Months"
        | "Years";
    } => {
      /*
       * Extract YYYY-MM-DD directly.
       *
       * This avoids timezone shifts
       * when the backend returns an
       * ISO date.
       */
      const datePart =
        dateOfBirth.slice(0, 10);

      const [
        yearString,
        monthString,
        dayString,
      ] =
        datePart.split("-");

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

      /*
       * Borrow days from the previous
       * month when today's day is
       * before the birth day.
       */
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

      /*
       * Borrow one year when the
       * current month is before
       * the birth month.
       */
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      /*
       * Under 1 month:
       * show Days.
       */
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

      /*
       * Under 2 years:
       * show TOTAL completed months.
       */
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

      /*
       * 2 years or older:
       * show completed years.
       */
      return {
        age: String(years),
        ageUnit: "Years",
      };
    };

  /*
   * =========================
   * National ID Verification
   * =========================
   *
   * Backend is responsible for:
   *
   * - validating National ID
   * - checking whether patient exists
   * - determining Date of Birth
   * - determining Gender
   */
  const handleVerifyNationalId =
    async () => {
      if (
        patient.identifierType !==
        "National ID"
      ) {
        return;
      }

      const nationalId =
        patient.identifierNumber.trim();

      if (
        !/^\d{14}$/.test(
          nationalId,
        )
      ) {
        Alert.alert(
          "Invalid National ID",
          "National ID must be exactly 14 digits.",
        );

        return;
      }

      try {
        setVerifyingNationalId(
          true,
        );

        const result =
          await verifyNationalId(
            nationalId,
          );

        /*
         * Existing patient:
         *
         * Do not create a duplicate.
         * Open the existing patient.
         */
        if (
          result.alreadyExists
        ) {
          setNationalIdVerified(
            false,
          );

          router.push({
            pathname:
              "/patient-overview",

            params: {
              patientId:
                result
                  .existingPatient!
                  .id,
            },
          });

          return;
        }

        /*
         * Calculate Age from the
         * authoritative backend DOB.
         */
        const calculatedAge =
          calculateAgeFromDateOfBirth(
            result.dateOfBirth,
          );

        /*
         * Update Gender + Age +
         * Age Unit in ONE state update.
         */
        setPatient((previous) => ({
          ...previous,

          gender:
            result.gender === "MALE"
              ? "male"
              : "female",

          age:
            calculatedAge.age,

          ageUnit:
            calculatedAge.ageUnit,
        }));

        /*
         * Verification succeeded.
         *
         * Age and Gender will now
         * become locked.
         */
        setNationalIdVerified(
          true,
        );
      } catch (error) {
        console.error(
          "National ID verification failed:",
          error,
        );

        setNationalIdVerified(
          false,
        );

        Alert.alert(
          "National ID Verification Failed",
          error instanceof Error
            ? error.message
            : "Unable to verify the National ID. Please check the number and try again.",
        );
      } finally {
        setVerifyingNationalId(
          false,
        );
      }
    };

  /*
   * =========================
   * Derived State
   * =========================
   */
  const isNationalIdLocked =
    patient.identifierType ===
      "National ID" &&
    nationalIdVerified;

  /*
   * =========================
   * Screen
   * =========================
   */
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
        {/* =========================
            Basic Information
            ========================= */}
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

          onIdentifierTypeChange={
            handleIdentifierTypeChange
          }

          onDocumentTypeChange={(
            value,
          ) =>
            updatePatient(
              "documentType",
              value,
            )
          }

          onIdentifierNumberChange={
            handleIdentifierNumberChange
          }

          onFullNameChange={
            handleFullNameChange
          }

          onAgeChange={(value) =>
            updatePatient(
              "age",
              value,
            )
          }

          onAgeUnitChange={(
            value,
          ) =>
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

          identifierSearchResults={
            identifierSearchResults
          }

          nameSearchResults={
            nameSearchResults
          }

          searchingIdentifier={
            searchingIdentifier
          }

          searchingName={
            searchingName
          }

          onPatientSelect={
            handlePatientSelect
          }

          nationalIdVerified={
            nationalIdVerified
          }

          verifyingNationalId={
            verifyingNationalId
          }

          onVerifyNationalId={
            handleVerifyNationalId
          }

          isAgeLocked={
            isNationalIdLocked
          }

          isGenderLocked={
            isNationalIdLocked
          }
        />

        {/* =========================
            Contact Information
            ========================= */}
        <PatientContactInformation
          phone={
            patient.phone
          }

          onPhoneChange={(value) =>
            updatePatient(
              "phone",
              value,
            )
          }
        />

        {/* =========================
            Occupation
            ========================= */}
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

        {/* =========================
            Address
            ========================= */}
        <PatientAddressInformation
          governorate={
            patient.governorate
          }

          otherGovernorate={
            patient.otherGovernorate
          }

          city={
            patient.city
          }

          otherCity={
            patient.otherCity
          }

          district={
            patient.district
          }

          street={
            patient.street
          }

          onGovernorateChange={(
            value,
          ) => {
            setPatient((previous) => ({
              ...previous,

              governorate:
                value,

              city: "",

              otherCity: "",
            }));
          }}

          onOtherGovernorateChange={(
            value,
          ) =>
            updatePatient(
              "otherGovernorate",
              value,
            )
          }

          onCityChange={(value) => {
            setPatient((previous) => ({
              ...previous,

              city: value,

              otherCity: "",
            }));
          }}

          onOtherCityChange={(value) =>
            updatePatient(
              "otherCity",
              value,
            )
          }

          onDistrictChange={(value) =>
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

        {/* =========================
            Actions
            ========================= */}
        <PatientActions
          patient={patient}
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
  });