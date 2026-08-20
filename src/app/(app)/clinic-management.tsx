import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ClinicStatus from "@/components/clinic/ClinicStatus";
import {
  getApiError,
} from "@/utils/apiError";

import AppButton from "@/components/common/AppButton";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";

import ClinicSelector from "@/components/clinic/ClinicSelector";

import ClinicInformationForm, {
  type ClinicInformation,
} from "@/components/clinic/ClinicInformationForm";

import ClinicWorkingDays, {
  DAYS,
  type WorkingDay,
} from "@/components/clinic/ClinicWorkingDays";

import ClinicJoinAccess from "@/components/clinic/ClinicJoinAccess";

import ClinicMembershipRequests from "@/components/clinic/ClinicMembershipRequests";

import ClinicMembers from "@/components/clinic/ClinicMembers";

import {
  validateWorkingDays,
} from "@/components/clinic/ClinicWorkingDaysValidation";

import {
  approveMembership,
  createJoinCode,
  deactivateClinic,
  getClinicMembers,
  getMembershipRequests,
  leaveClinic,
  loadClinics,
  reactivateClinic,
  rejectMembership,
  removeMember,
  transferOwnership,
  updateClinic,
} from "@/services/clinicApi";

import { useClinicStore } from "@/store/clinicStore";

import type {
  ClinicMember,
  JoinCode,
} from "@/types/clinic";

import {
  COLORS,
  SPACING,
} from "@/theme";

export default function ClinicManagementScreen() {
  const {
    currentClinic,
    setCurrentClinic,
  } = useClinicStore();

  const [clinicInformation, setClinicInformation] =
    useState<ClinicInformation>({
      name: "",
      phone: "",
      email: "",
      governorate: "",
      otherGovernorate: "",
      city: "",
      otherCity: "",
      district: "",
      streetAddress: "",
    });

  const [workingDays, setWorkingDays] =
    useState<WorkingDay[]>(
      DAYS.map((day) => ({
        day,
        isClosed: true,
        is24Hours: false,
        shifts: [],
      })),
    );

  const [members, setMembers] =
    useState<ClinicMember[]>([]);

  const [requests, setRequests] =
    useState<ClinicMember[]>([]);

  const [joinCode, setJoinCode] =
    useState<JoinCode | null>(null);

  useEffect(() => {
    setJoinCode(null);
  }, [currentClinic?.clinic.id]);

  const [saving, setSaving] =
    useState(false);

  const [loadingMembers, setLoadingMembers] =
    useState(false);

  const [loadingCode, setLoadingCode] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  /*
   * =========================
   * Current Clinic
   * =========================
   */

  const clinic =
    currentClinic?.clinic ?? null;

  const isOwner =
    currentClinic?.role === "OWNER";

  /*
   * =========================
   * Load Clinic Data
   * =========================
   */

  useEffect(() => {
    if (!clinic) {
      return;
    }

    setClinicInformation({
      name: clinic.name,
      phone: clinic.phone,
      email: clinic.email ?? "",
      governorate: clinic.governorate ?? "",
      otherGovernorate: "",
      city: clinic.city ?? "",
      otherCity: "",
      district: clinic.district ?? "",
      streetAddress: clinic.streetAddress ?? "",
    });

    setWorkingDays(
      DAYS.map((day) => {
        const existing =
          clinic.workingDays.find(
            (item) =>
              item.day === day,
          );

        return {
          day,

          isClosed:
            existing?.isClosed ??
            true,

          is24Hours:
            existing?.is24Hours ??
            false,

          shifts:
            existing?.isClosed ||
            existing?.is24Hours
              ? []
              : existing?.shifts?.length
                ? existing.shifts.map(
                    (shift) => ({
                      startTime:
                        shift.startTime ??
                        "",
                      endTime:
                        shift.endTime ??
                        "",
                    }),
                  )
                : [
                    {
                      startTime: "",
                      endTime: "",
                    },
                  ],
        };
      }),
    );
  }, [clinic?.id]);

  /*
   * =========================
   * Load Members
   * =========================
   */

  useEffect(() => {
    if (!clinic) {
      return;
    }

    loadMembers();
  }, [clinic?.id]);

  const loadMembers = async () => {
    if (!clinic) {
      return;
    }

    try {
      setLoadingMembers(true);

      const data =
        await getClinicMembers(
          clinic.id,
        );

      setMembers(data);

      if (isOwner) {
        const pending =
          await getMembershipRequests(
            clinic.id,
          );

        setRequests(pending);
      } else {
        setRequests([]);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ??
          "Unable to load clinic members.",
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleRefresh = async () => {
    if (!clinic || refreshing) {
      return;
    }

    try {
      setRefreshing(true);
      await loadMembers();
    } finally {
      setRefreshing(false);
    }
  };

  /*
   * =========================
   * Save Clinic
   * =========================
   */

  const handleSaveClinic =
    async () => {
      if (!clinic || !isOwner) {
        return;
      }

      /*
       * Clinic Information
       */

      if (
        !clinicInformation.name.trim()
      ) {
        Alert.alert(
          "Required",
          "Enter the clinic name.",
        );
        return;
      }

      if (
        !clinicInformation.phone.trim()
      ) {
        Alert.alert(
          "Required",
          "Enter the clinic phone number.",
        );
        return;
      }

      if (
        !clinicInformation.governorate.trim()
      ) {
        Alert.alert(
          "Required",
          "Select the governorate.",
        );
        return;
      }

      if (
        !clinicInformation.city.trim()
      ) {
        Alert.alert(
          "Required",
          "Enter the city.",
        );
        return;
      }

      if (
        !clinicInformation.district.trim()
      ) {
        Alert.alert(
          "Required",
          "Enter the district.",
        );
        return;
      }

      if (
        !clinicInformation.streetAddress.trim()
      ) {
        Alert.alert(
          "Required",
          "Enter the street address.",
        );
        return;
      }

      /*
       * Working Days Validation
       */

      const validation =
        validateWorkingDays(
          workingDays,
        );

      if (!validation.valid) {
        switch (
          validation.type
        ) {
          case "EMPTY_SHIFTS":
            Alert.alert(
              "Required",
              `Add at least one shift for ${validation.day}.`,
            );
            return;

          case "EMPTY_TIME":
            Alert.alert(
              "Required",
              `Select opening and closing time for Shift ${
                (validation.shiftIndex ??
                  0) + 1
              } on ${validation.day}.`,
            );
            return;

          case "INVALID_TIME":
            Alert.alert(
              "Invalid Time",
              `Invalid time for Shift ${
                (validation.shiftIndex ??
                  0) + 1
              } on ${validation.day}.`,
            );
            return;

          case "OVERLAPPING_SHIFTS":
            if (
              validation.first &&
              validation.second
            ) {
              Alert.alert(
                "Overlapping Shifts",
                `Shifts cannot overlap. Please check ${
                  validation.first.day
                } Shift ${
                  validation.first
                    .shiftIndex + 1
                } and ${
                  validation.second.day
                } Shift ${
                  validation.second
                    .shiftIndex + 1
                }.`,
              );
            }

            return;
        }
      }

      /*
       * Prepare API payload
       */

      const clinicWorkingDays =
        workingDays.map(
          (day) => ({
            day: day.day,
            isClosed:
              day.isClosed,
            is24Hours:
              day.is24Hours,

            shifts:
              day.isClosed ||
              day.is24Hours
                ? []
                : day.shifts,
          }),
        );

      try {
        setSaving(true);

        const updated =
          await updateClinic(
          clinic.id,
          {
            name:
              clinicInformation.name.trim(),
            phone:
              clinicInformation.phone.trim(),
            email:
              clinicInformation.email.trim() ||
              undefined,
            governorate:
              clinicInformation.governorate.trim(),
            city:
              clinicInformation.city.trim(),
            district:
              clinicInformation.district.trim(),
            streetAddress:
              clinicInformation.streetAddress.trim(),
            workingDays:
              clinicWorkingDays,
          },
        );

        setCurrentClinic({
          ...currentClinic,
          clinic: updated,
        });

        Alert.alert(
          "Saved",
          "Clinic information updated successfully.",
        );
      } catch (error: any) {
        console.log(
          "UPDATE CLINIC ERROR:",
          error?.response?.status,
          error?.response?.data,
        );

        const apiError = getApiError(
          error,
          {
            title: "Unable to Save",
            message:
              "We couldn't save the clinic information. Please check the entered information and try again.",
          },
        );

        Alert.alert(
          apiError.title,
          apiError.message,
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * =========================
   * Join Code
   * =========================
   */

  const handleGenerateJoinCode =
    async () => {
      if (!clinic) {
        return;
      }

      try {
        setLoadingCode(true);

        const code =
          await createJoinCode(
            clinic.id,
          );

        setJoinCode(code);
      } catch (error: any) {
        Alert.alert(
          "Unable to Generate Code",
          error?.response?.data?.message ??
            "Unable to generate clinic join code.",
        );
      } finally {
        setLoadingCode(false);
      }
    };

  /*
   * =========================
   * Membership
   * =========================
   */

  const handleApprove =
    async (
      membershipId: string,
    ) => {
      if (!clinic) {
        return;
      }

      try {
        await approveMembership(
          clinic.id,
          membershipId,
        );

        await loadMembers();
      } catch (error: any) {
        Alert.alert(
          "Unable to Approve",
          error?.response?.data?.message ??
            "Unable to approve membership.",
        );
      }
    };

  const handleReject =
    async (
      membershipId: string,
    ) => {
      if (!clinic) {
        return;
      }

      try {
        await rejectMembership(
          clinic.id,
          membershipId,
        );

        await loadMembers();
      } catch (error: any) {
        Alert.alert(
          "Unable to Reject",
          error?.response?.data?.message ??
            "Unable to reject membership.",
        );
      }
    };

    const handleRemoveMember = async (
      membershipId: string,
    ) => {
      if (!clinic) return;

      Alert.alert(
        "Remove Member",
        "Are you sure you want to remove this member from the clinic?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              try {
                await removeMember(
                  clinic.id,
                  membershipId,
                );

                await loadMembers();
              } catch (error: any) {
                Alert.alert(
                  "Unable to Remove",
                  error?.response?.data?.message ??
                    "Unable to remove this member.",
                );
              }
            },
          },
        ],
      );
    };

    const handleLeaveClinic = async () => {
      if (!currentClinic || isOwner) return;

      Alert.alert(
        "Leave Clinic",
        "Are you sure you want to leave this clinic?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Leave",
            style: "destructive",
            onPress: async () => {
              try {
                await leaveClinic(
                  currentClinic.membershipId,
                );

                await loadClinics();

                router.back();
              } catch (error: any) {
                Alert.alert(
                  "Unable to Leave",
                  error?.response?.data?.message ??
                    "Unable to leave this clinic.",
                );
              }
            },
          },
        ],
      );
    };

    const handleTransferOwnership = async (
      membershipId: string,
    ) => {
      if (!clinic || !isOwner) return;

      Alert.alert(
        "Transfer Ownership",
        "Are you sure you want to transfer ownership to this doctor?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Transfer",
            style: "destructive",
            onPress: async () => {
              try {
                await transferOwnership(
                  clinic.id,
                  membershipId,
                );

                await loadClinics();
                await loadMembers();

                Alert.alert(
                  "Ownership Transferred",
                  "Clinic ownership has been transferred successfully.",
                );
              } catch (error: any) {
                Alert.alert(
                  "Unable to Transfer",
                  error?.response?.data?.message ??
                    "Unable to transfer ownership.",
                );
              }
            },
          },
        ],
      );
    };

    const handleDeactivateClinic = async () => {
      if (!clinic || !isOwner) return;

      Alert.alert(
        "Deactivate Clinic",
        "Are you sure you want to deactivate this clinic?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Deactivate",
            style: "destructive",
            onPress: async () => {
              try {
                const updated =
                  await deactivateClinic(
                    clinic.id,
                  );

                setCurrentClinic({
                  ...currentClinic,
                  clinic: updated,
                });

                setJoinCode(null);

                Alert.alert(
                  "Clinic Deactivated",
                  "The clinic has been deactivated.",
                );
              } catch (error: any) {
                Alert.alert(
                  "Unable to Deactivate",
                  error?.response?.data?.message ??
                    "Unable to deactivate clinic.",
                );
              }
            },
          },
        ],
      );
    };

    const handleReactivateClinic = async () => {
      if (!clinic || !isOwner) return;

      try {
        const updated =
          await reactivateClinic(
            clinic.id,
          );

        setCurrentClinic({
          ...currentClinic,
          clinic: updated,
        });

        Alert.alert(
          "Clinic Reactivated",
          "The clinic is active again.",
        );
      } catch (error: any) {
        Alert.alert(
          "Unable to Reactivate",
          error?.response?.data?.message ??
            "Unable to reactivate clinic.",
        );
      }
    };

  /*
   * =========================
   * No Clinic
   * =========================
   */

  if (!clinic) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <AppTopBar
          title="Clinic Management"
          onBack={() =>
            router.back()
          }
        />

        <View
          style={styles.center}
        >
          <Text
            style={
              styles.emptyText
            }
          >
            No clinic selected.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * =========================
   * Screen
   * =========================
   */

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
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
        <ClinicSelector
          onCreateClinic={() =>
            router.push("/(app)/create-clinic")
          }
          onJoinClinic={() =>
            router.push("/(app)/join-clinic")
          }
        />

        {/* Join Code */}

        {isOwner && clinic.isActive && (
          <>
            <SectionHeader
              title="Clinic Join Access"
            />

            <ClinicJoinAccess
              joinCode={joinCode}
              loading={loadingCode}
              onGenerate={
                handleGenerateJoinCode
              }
            />
          </>
        )}

        {/* Membership Requests */}

        {isOwner && (
          <>
            <SectionHeader
              title="Membership Requests"
            />

            <ClinicMembershipRequests
              requests={requests}
              onApprove={
                handleApprove
              }
              onReject={
                handleReject
              }
            />
          </>
        )}

        {/* Clinic Members */}

        <SectionHeader
          title="Clinic Members"
        />

        <ClinicMembers
          members={members}
          loading={loadingMembers}
          isOwner={isOwner}
          currentMembershipId={
            currentClinic?.membershipId ?? ""
          }
          onRemoveMember={
            handleRemoveMember
          }
          onTransferOwnership={
            handleTransferOwnership
          }
          onLeaveClinic={
            handleLeaveClinic
          }
        />

        {/* Clinic Information */}

        <SectionHeader
          title="Clinic Information"
        />

        <ClinicInformationForm
          value={
            clinicInformation
          }
          onChange={
            isOwner
              ? setClinicInformation
              : () => {}
          }
        />

        {isOwner && (
          <AppButton
            title="Save Clinic Information"
            loading={saving}
            onPress={
              handleSaveClinic
            }
          />
        )}

        {/* Working Days */}

        <SectionHeader
          title="Working Days"
        />

        <ClinicWorkingDays
          value={workingDays}
          onChange={
            isOwner
              ? setWorkingDays
              : () => {}
          }
        />

        {isOwner && (
          <AppButton
            title="Save Working Hours"
            loading={saving}
            onPress={
              handleSaveClinic
            }
          />
        )}

        {/* Clinic Status */}

        <SectionHeader title="Clinic Status" />

        <ClinicStatus
          isActive={clinic.isActive}
          isOwner={isOwner}
          onDeactivate={handleDeactivateClinic}
          onReactivate={handleReactivateClinic}
        />
      </ScrollView>

      <Pressable
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={refreshing}
        hitSlop={8}
      >
        {refreshing ? (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
          />
        ) : (
          <Ionicons
            name="refresh"
            size={22}
            color="#FFFFFF"
          />
        )}
      </Pressable>

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

    content: {
      padding: SPACING.md,
      paddingBottom:
        SPACING.xxl,
      gap: SPACING.lg,
    },

    center: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
    },

    emptyText: {
      textAlign:
        "center",
      color:
        COLORS.secondaryText,
      fontSize: 16,
      paddingVertical:
        SPACING.md,
    },

    refreshButton: {
      position: "absolute",
      right: 20,
      bottom: 24,

      width: 50,
      height: 50,
      borderRadius: 25,

      backgroundColor: COLORS.primary,

      justifyContent: "center",
      alignItems: "center",

      elevation: 6,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.25,
      shadowRadius: 5,

      zIndex: 100,
    },
  });