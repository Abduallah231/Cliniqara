import AppView from "@/components/common/AppView";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useDoctorStore, type DoctorProfile } from "@/store/doctorStore";
import { useClinicStore } from "@/store/clinicStore";
import type { ClinicMember, MyClinic } from "@/types/clinic";
import { AUTH_ENABLED } from "@/config/features";
import SessionService from "@/services/session.service";
import { getCachedUser } from "@/services/authApi";
import {
  ensureLocalPrismaIdentity,
  getLocalRecord,
  listLocalRecords,
  putLocalRecord,
} from "@/services/localDatabase";

export default function SplashScreen() {
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    if (AUTH_ENABLED) {
      const token = await SessionService.getAccessToken();
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const authenticatedUser = await getCachedUser();
      if (!authenticatedUser) {
        await SessionService.clearSession();
        router.replace("/(auth)/login");
        return;
      }

      if (authenticatedUser.verificationStatus === "PENDING") {
        router.replace("/(auth)/waiting-approval");
        return;
      }
      if (authenticatedUser.verificationStatus === "REJECTED") {
        router.replace("/(auth)/verification-failed");
        return;
      }
      if (authenticatedUser.verificationStatus !== "APPROVED") {
        await SessionService.clearSession();
        router.replace("/(auth)/login");
        return;
      }
    }

    const savedOfflineProfile = await getLocalRecord<Record<string, unknown>>(
      "offline_profile",
      "current",
    );
    const oldCachedUser = await getLocalRecord<Record<string, unknown>>(
      "auth_user",
      "current",
    );
    // The cached authenticated profile may contain newer edits than the
    // original offline bootstrap profile. Keep both records synchronized.
    const user = oldCachedUser?.value ?? savedOfflineProfile?.value ?? {
      id: "offline-doctor",
      userCode: "LOCAL-DOCTOR",
      fullName: "Offline Doctor",
      email: "offline-doctor@local.cliniqara",
      phone: "LOCAL-OFFLINE-DOCTOR",
      accountType: "DOCTOR",
      doctorLevel: "DOCTOR",
      verificationStatus: "APPROVED",
    };

    await putLocalRecord({
      collection: "offline_profile",
      id: "current",
      value: user,
    });

    const doctor: DoctorProfile = {
      id: String(user.id),
      userCode: String(user.userCode ?? "LOCAL"),
      fullName: String(user.fullName ?? "Doctor"),
      email: String(user.email ?? ""),
      phone: String(user.phone ?? ""),
      nationalId: typeof user.nationalId === "string" ? user.nationalId : null,
      medicalLicenseNumber: typeof user.medicalLicenseNumber === "string" ? user.medicalLicenseNumber : null,
      nationalIdImage: typeof user.nationalIdImage === "string" ? user.nationalIdImage : null,
      medicalLicenseImage: typeof user.medicalLicenseImage === "string" ? user.medicalLicenseImage : null,
      specialty: typeof user.specialty === "string" ? user.specialty : null,
      professionalTitle: typeof user.professionalTitle === "string" ? user.professionalTitle : null,
      accountType: user.accountType === "RECEPTION" ? "RECEPTION" : "DOCTOR",
      doctorLevel: "DOCTOR",
      verificationStatus: "APPROVED",
    };
    useDoctorStore.getState().setDoctor(doctor);

    const clinicId = `local-${doctor.id}`;
    const clinicCode = `LOCAL-${doctor.userCode}`;
    await ensureLocalPrismaIdentity({
      id: doctor.id,
      userCode: doctor.userCode,
      accountType: doctor.accountType,
      fullName: doctor.fullName,
      email: doctor.email || `offline-${doctor.id}@local.cliniqara`,
      phone: doctor.phone || `LOCAL-${doctor.id}`,
      specialty: doctor.specialty,
      professionalTitle: doctor.professionalTitle,
      clinicId,
      clinicCode,
      clinicName: "My Clinic",
      clinicPhone: doctor.phone || `LOCAL-${doctor.id}`,
      clinicEmail: doctor.email || null,
    });
    const clinic: MyClinic = {
      membershipId: `local-membership-${doctor.id}`,
      role: doctor.accountType === "RECEPTION" ? "RECEPTION" : "OWNER",
      clinic: {
        id: clinicId,
        clinicCode,
        name: "My Clinic",
        phone: doctor.phone,
        email: doctor.email || null,
        governorate: "",
        city: "",
        district: "",
        streetAddress: "",
        isActive: true,
        createdById: doctor.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workingDays: [],
      },
    };
    const savedClinic = await getLocalRecord<MyClinic>("clinics", clinicId);
    const activeClinic = savedClinic?.value ?? clinic;
    if (!savedClinic) await putLocalRecord({ collection: "clinics", id: clinicId, value: clinic });
    const membership = {
      id: clinic.membershipId,
      clinicId,
      userId: doctor.id,
      clinicRole: clinic.role,
      status: "ACTIVE" as const,
      joinedAt: clinic.clinic.createdAt,
      removedAt: null,
      user: {
        id: doctor.id,
        userCode: doctor.userCode,
        accountType: doctor.accountType,
        doctorLevel: doctor.accountType === "DOCTOR" ? "DOCTOR" as const : null,
        fullName: doctor.fullName,
        specialty: doctor.specialty,
        professionalTitle: doctor.professionalTitle,
      },
    };
    if (!(await getLocalRecord("clinic_members", membership.id))) {
      await putLocalRecord({ collection: "clinic_members", id: membership.id, clinicId, value: membership });
    }
    const clinicMembers = (await listLocalRecords<ClinicMember>("clinic_members"))
      .map((record) => record.value)
      .filter((member) => member.userId === doctor.id && member.status === "ACTIVE");
    const clinicIds = new Set(clinicMembers.map((member) => member.clinicId));
    const localClinics = (await listLocalRecords<MyClinic>("clinics"))
      .map((record) => record.value)
      .filter((item) => item.clinic.createdById === doctor.id || clinicIds.has(item.clinic.id))
      .map((item) => {
        const membershipForClinic = clinicMembers.find((member) => member.clinicId === item.clinic.id);
        return membershipForClinic
          ? { ...item, membershipId: membershipForClinic.id, role: membershipForClinic.clinicRole }
          : item;
      });
    useClinicStore.getState().setClinics(localClinics);
    const preferredClinicId = (await getLocalRecord<string>("settings", "selected_clinic"))?.value;
    const selectedClinic = localClinics.find((item) => item.clinic.id === preferredClinicId) ?? activeClinic;
    useClinicStore.getState().setCurrentClinic(selectedClinic);

    // --------------------------------
    // ENTER APP
    // --------------------------------
    router.replace("/(app)");
  }

  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </AppView>
  );
}
