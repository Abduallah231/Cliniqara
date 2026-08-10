import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import JoinCodeCard from "@/components/clinic/JoinCodeCard";
import ClinicSelector from "@/components/clinic/ClinicSelector";
import {
  approveMembership,
  createJoinCode,
  getClinicMembers,
  getMembershipRequests,
  rejectMembership,
  updateClinic,
} from "@/services/clinicApi";

import { useClinicStore } from "@/store/clinicStore";
import type {
  ClinicMember,
  JoinCode,
  WeekDay,
} from "@/types/clinic";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

const DAYS: WeekDay[] = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

const DAY_LABELS: Record<WeekDay, string> = {
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

export default function ClinicManagementScreen() {
  const {
    currentClinic,
    setCurrentClinic,
  } = useClinicStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [workingDays, setWorkingDays] = useState<
    {
      day: WeekDay;
      startTime: string;
      endTime: string;
      isClosed: boolean;
    }[]
  >([]);

  const [members, setMembers] = useState<ClinicMember[]>([]);
  const [requests, setRequests] = useState<ClinicMember[]>([]);

  const [joinCode, setJoinCode] =
    useState<JoinCode | null>(null);

  const [saving, setSaving] = useState(false);
  const [loadingMembers, setLoadingMembers] =
    useState(false);
  const [loadingCode, setLoadingCode] =
    useState(false);

  if (!currentClinic) {
    return (
      <SafeAreaView style={styles.container}>
        <AppTopBar
          title="Clinic Management"
          onBack={() => router.back()}
        />

        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No clinic selected.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const clinic = currentClinic.clinic;
  const isOwner = currentClinic.role === "OWNER";

  useEffect(() => {
    setName(clinic.name);
    setPhone(clinic.phone);
    setEmail(clinic.email ?? "");
    setAddress(clinic.address);
    setCountry(clinic.country);
    setCity(clinic.city);

    setWorkingDays(
      DAYS.map((day) => {
        const existing =
          clinic.workingDays.find(
            (item) => item.day === day,
          );

        return {
          day,
          startTime: existing?.startTime ?? "",
          endTime: existing?.endTime ?? "",
          isClosed:
            existing?.isClosed ?? true,
        };
      }),
    );
  }, [clinic.id]);

  useEffect(() => {
    loadMembers();
  }, [clinic.id]);

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);

      const data = await getClinicMembers(
        clinic.id,
      );

      setMembers(data);

      if (isOwner) {
        const pending =
          await getMembershipRequests(
            clinic.id,
          );

        setRequests(pending);
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

  const handleSaveClinic = async () => {
    try {
      setSaving(true);

      const updated = await updateClinic(
        clinic.id,
        {
          name,
          phone,
          email: email || undefined,
          address,
          country,
          city,
          workingDays,
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
      Alert.alert(
        "Unable to Save",
        error?.response?.data?.message ??
          "Unable to update clinic.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateJoinCode = async () => {
    try {
      setLoadingCode(true);

      const code = await createJoinCode(
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

  const handleApprove = async (
    membershipId: string,
  ) => {
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

  const handleReject = async (
    membershipId: string,
  ) => {
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

  const toggleDay = (day: WeekDay) => {
    setWorkingDays((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              isClosed: !item.isClosed,
            }
          : item,
      ),
    );
  };

  const updateDay = (
    day: WeekDay,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setWorkingDays((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Clinic Management"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <ClinicSelector
          onCreateClinic={() =>
            router.push("/(app)/create-clinic")
          }
        />

        {/* Clinic Information */}

        <SectionHeader title="Clinic Information" />

        <AppCard>
          <AppTextField
            label="Clinic Name"
            value={name}
            editable={isOwner}
            onChangeText={setName}
          />

          <Divider />

          <AppTextField
            label="Phone Number"
            value={phone}
            editable={isOwner}
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />

          <Divider />

          <AppTextField
            label="Email"
            value={email}
            editable={isOwner}
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <Divider />

          <AppTextField
            label="Address"
            value={address}
            editable={isOwner}
            multiline
            onChangeText={setAddress}
          />

          <Divider />

          <AppTextField
            label="Country"
            value={country}
            editable={isOwner}
            onChangeText={setCountry}
          />

          <Divider />

          <AppTextField
            label="City"
            value={city}
            editable={isOwner}
            onChangeText={setCity}
          />

          {isOwner && (
            <AppButton
              title="Save Clinic Information"
              loading={saving}
              onPress={handleSaveClinic}
            />
          )}
        </AppCard>

        {/* Working Days */}

        <SectionHeader title="Working Days" />

        <AppCard>
          {workingDays.map((item) => (
            <View key={item.day}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>
                  {DAY_LABELS[item.day]}
                </Text>

                {isOwner && (
                  <AppButton
                    title={
                      item.isClosed
                        ? "Closed"
                        : "Open"
                    }
                    onPress={() =>
                      toggleDay(item.day)
                    }
                  />
                )}
              </View>

              {!item.isClosed && (
                <View style={styles.timeRow}>
                  <View style={styles.timeField}>
                    <AppTextField
                      label="Opening"
                      value={item.startTime}
                      editable={isOwner}
                      placeholder="08:00"
                      onChangeText={(value) =>
                        updateDay(
                          item.day,
                          "startTime",
                          value,
                        )
                      }
                    />
                  </View>

                  <View style={styles.timeField}>
                    <AppTextField
                      label="Closing"
                      value={item.endTime}
                      editable={isOwner}
                      placeholder="17:00"
                      onChangeText={(value) =>
                        updateDay(
                          item.day,
                          "endTime",
                          value,
                        )
                      }
                    />
                  </View>
                </View>
              )}

              <Divider />
            </View>
          ))}
        </AppCard>

        {/* Join Code / QR */}

        {isOwner && (
          <>
            <SectionHeader title="Clinic Join Access" />

            <AppCard>
              <Text style={styles.description}>
                Generate a temporary code that doctors
                or reception staff can use to request
                access to this clinic.
              </Text>

              <AppButton
                title={
                  joinCode
                    ? "Generate New Join Code"
                    : "Generate Join Code"
                }
                loading={loadingCode}
                onPress={handleGenerateJoinCode}
              />

              {joinCode && (
                <JoinCodeCard
                  code={joinCode.code}
                  expiresAt={joinCode.expiresAt}
                />
              )}
            </AppCard>
          </>
        )}

        {/* Membership Requests */}

        {isOwner && (
          <>
            <SectionHeader
              title="Membership Requests"
            />

            {requests.length === 0 ? (
              <AppCard>
                <Text style={styles.emptyText}>
                  No pending membership requests.
                </Text>
              </AppCard>
            ) : (
              requests.map((request) => (
                <AppCard key={request.id}>
                  <Text style={styles.memberName}>
                    {request.user.fullName}
                  </Text>

                  <Text style={styles.memberInfo}>
                    {request.user.accountType}
                    {request.user.specialty
                      ? ` • ${request.user.specialty}`
                      : ""}
                  </Text>

                  <View style={styles.actionRow}>
                    <AppButton
                      title="Approve"
                      onPress={() =>
                        handleApprove(
                          request.id,
                        )
                      }
                    />

                    <AppButton
                      title="Reject"
                      onPress={() =>
                        handleReject(
                          request.id,
                        )
                      }
                    />
                  </View>
                </AppCard>
              ))
            )}
          </>
        )}

        {/* Active Members */}

        <SectionHeader title="Clinic Members" />

        {members.length === 0 ? (
          <AppCard>
            <Text style={styles.emptyText}>
              No active members.
            </Text>
          </AppCard>
        ) : (
          members.map((member) => (
            <AppCard key={member.id}>
              <Text style={styles.memberName}>
                {member.user.fullName}
              </Text>

              <Text style={styles.memberInfo}>
                {member.clinicRole}
                {" • "}
                {member.user.accountType}
              </Text>

              {member.user.specialty && (
                <Text style={styles.memberInfo}>
                  {member.user.specialty}
                </Text>
              )}

              {member.user.professionalTitle && (
                <Text style={styles.memberInfo}>
                  {member.user.professionalTitle}
                </Text>
              )}
            </AppCard>
          ))
        )}

        {loadingMembers && (
          <Text style={styles.loadingText}>
            Updating members...
          </Text>
        )}
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },

  dayName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  timeRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  timeField: {
    flex: 1,
  },

  description: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },

  memberName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  memberInfo: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    marginBottom: 4,
  },

  actionRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.md,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    paddingVertical: SPACING.md,
  },

  loadingText: {
    textAlign: "center",
    color: COLORS.secondaryText,
  },
});