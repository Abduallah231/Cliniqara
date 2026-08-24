import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import {
  useEffect,
  useState,
} from "react";
import PatientAddressInformation from "@/components/patient-form/PatientAddressInformation";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export type ClinicInformation = {
  name: string;
  phone: string;
  email: string;
  governorate: string;
  otherGovernorate: string;
  city: string;
  otherCity: string;
  district: string;
  streetAddress: string;
};

type Props = {
  value: ClinicInformation;
  onChange: (
    value: ClinicInformation,
  ) => void;
};

export default function ClinicInformationForm({
  value,
  onChange,
}: Props) {
  const updateField = (
    field: keyof ClinicInformation,
    fieldValue: string,
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const [address, setAddress] = useState({
    governorate: value.governorate,
    otherGovernorate:
      value.otherGovernorate,
    city: value.city,
    otherCity: value.otherCity,
    district: value.district,
    street: value.streetAddress,
  });

  useEffect(() => {
    setAddress({
      governorate: value.governorate,
      otherGovernorate:
        value.otherGovernorate,
      city: value.city,
      otherCity: value.otherCity,
      district: value.district,
      street: value.streetAddress,
    });
  }, [
    value.governorate,
    value.otherGovernorate,
    value.city,
    value.otherCity,
    value.district,
    value.streetAddress,
  ]);

  return (
    <>
      {/* =========================
          Basic Clinic Information
          ========================= */}
      <AppCard>
        <View style={styles.cardHeader}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>
              🏥
            </Text>
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.cardTitle}>
              Clinic Details
            </Text>

            <Text style={styles.cardSubtitle}>
              Basic information about the clinic
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <AppTextField
            label="Clinic Name"
            placeholder="Enter clinic name"
            value={value.name}
            onChangeText={(text) =>
              updateField(
                "name",
                text,
              )
            }
          />

          <Divider />

          <AppTextField
            label="Phone Number"
            placeholder="Enter clinic phone"
            keyboardType="phone-pad"
            value={value.phone}
            onChangeText={(text) =>
              updateField(
                "phone",
                text,
              )
            }
          />

          <Divider />

          <AppTextField
            label="Email"
            placeholder="Enter clinic email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value.email}
            onChangeText={(text) =>
              updateField(
                "email",
                text,
              )
            }
          />
        </View>
      </AppCard>

      {/* =========================
          Clinic Address
          ========================= */}
      <View style={styles.addressSection}>
        <View style={styles.addressHeader}>
          <View style={styles.addressIcon}>
            <Text style={styles.addressIconText}>
              📍
            </Text>
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.addressTitle}>
              Clinic Address
            </Text>

            <Text style={styles.addressSubtitle}>
              Location and contact address
            </Text>
          </View>
        </View>

        <View style={styles.addressCardWrapper}>
          <PatientAddressInformation
            title="Clinic Address"
            governorate={
              address.governorate
            }
            otherGovernorate={
              address.otherGovernorate
            }
            city={
              address.city
            }
            otherCity={
              address.otherCity
            }
            district={
              address.district
            }
            street={
              address.street
            }
            onGovernorateChange={(
              governorate,
            ) => {
              const nextAddress = {
                ...address,
                governorate,
                city: "",
                otherCity: "",
              };

              setAddress(
                nextAddress,
              );

              onChange({
                ...value,
                governorate,
                otherGovernorate:
                  nextAddress.otherGovernorate,
                city: "",
                otherCity: "",
                district:
                  nextAddress.district,
                streetAddress:
                  nextAddress.street,
              });
            }}
            onOtherGovernorateChange={(
              otherGovernorate,
            ) => {
              const nextAddress = {
                ...address,
                otherGovernorate,
              };

              setAddress(
                nextAddress,
              );

              onChange({
                ...value,
                otherGovernorate,
              });
            }}
            onCityChange={(city) => {
              const nextAddress = {
                ...address,
                city,
                otherCity: "",
              };

              setAddress(
                nextAddress,
              );

              onChange({
                ...value,
                governorate:
                  nextAddress.governorate,
                otherGovernorate:
                  nextAddress.otherGovernorate,
                city,
                otherCity: "",
                district:
                  nextAddress.district,
                streetAddress:
                  nextAddress.street,
              });
            }}
            onOtherCityChange={(
              otherCity,
            ) => {
              const nextAddress = {
                ...address,
                otherCity,
              };

              setAddress(
                nextAddress,
              );

              onChange({
                ...value,
                otherCity,
              });
            }}
            onDistrictChange={(
              district,
            ) => {
              const nextAddress = {
                ...address,
                district,
              };

              setAddress(
                nextAddress,
              );

              onChange({
                ...value,
                governorate:
                  nextAddress.governorate,
                otherGovernorate:
                  nextAddress.otherGovernorate,
                city:
                  nextAddress.city,
                otherCity:
                  nextAddress.otherCity,
                district,
                streetAddress:
                  nextAddress.street,
              });
            }}
            onStreetChange={(
              street,
            ) => {
              const nextAddress = {
                ...address,
                street,
              };

              setAddress(
                nextAddress,
              );

              onChange({
                ...value,
                governorate:
                  nextAddress.governorate,
                otherGovernorate:
                  nextAddress.otherGovernorate,
                city:
                  nextAddress.city,
                otherCity:
                  nextAddress.otherCity,
                district:
                  nextAddress.district,
                streetAddress:
                  street,
              });
            }}
          />
        </View>
      </View>
    </>
  );
}

const styles =
  StyleSheet.create({
    /*
     * =========================
     * Basic Information Card
     * =========================
     */

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.md,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor:
        "rgba(0, 122, 140, 0.10)",
    },

    headerIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor:
        "rgba(0, 122, 140, 0.10)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: SPACING.sm,
    },

    headerIconText: {
      fontSize: 21,
    },

    headerTextContainer: {
      flex: 1,
    },

    cardTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "800",
      color:
        COLORS.text,
      marginBottom: 2,
    },

    cardSubtitle: {
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
      lineHeight: 18,
    },

    formSection: {
      gap: SPACING.xs,
    },

    /*
     * =========================
     * Address Section
     * =========================
     */

    addressSection: {
      marginTop: SPACING.sm,
      borderRadius: 16,
      backgroundColor:
        "rgba(46, 125, 50, 0.045)",
      borderWidth: 1,
      borderColor:
        "rgba(46, 125, 50, 0.12)",
      padding: SPACING.sm,
    },

    addressHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal:
        SPACING.xs,
      paddingTop:
        SPACING.xs,
      paddingBottom:
        SPACING.sm,
    },

    addressIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor:
        "rgba(46, 125, 50, 0.11)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: SPACING.sm,
    },

    addressIconText: {
      fontSize: 21,
    },

    addressTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "800",
      color:
        COLORS.text,
      marginBottom: 2,
    },

    addressSubtitle: {
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
      lineHeight: 18,
    },

    addressCardWrapper: {
      backgroundColor:
        COLORS.background,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor:
        "rgba(0, 0, 0, 0.06)",
    },

    /*
     * =========================
     * Existing helper styles
     * =========================
     */

    label: {
      fontSize:
        TYPOGRAPHY.small,
      fontWeight: "600",
      color:
        COLORS.secondaryText,
      marginBottom:
        SPACING.xs,
    },

    fixedValue: {
      fontSize:
        TYPOGRAPHY.body,
      color:
        COLORS.text,
      paddingVertical:
        SPACING.sm,
    },
  });