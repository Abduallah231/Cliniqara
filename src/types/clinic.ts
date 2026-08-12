export type ClinicRole =
  | "OWNER"
  | "DOCTOR"
  | "RECEPTION";

export type MembershipStatus =
  | "PENDING"
  | "ACTIVE"
  | "REMOVED";

export type WeekDay =
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

export interface WorkingShift {
  startTime: string;
  endTime: string;
}

export interface WorkingDay {
  day: WeekDay;
  isClosed: boolean;
  is24Hours: boolean;
  shifts: WorkingShift[];
}

export type ClinicMember = {
  id: string;
  clinicId: string;
  userId: string;
  clinicRole: ClinicRole;
  status: MembershipStatus;
  joinedAt: string;
  removedAt: string | null;

  user: {
    id: string;
    userCode: string;
    accountType: "DOCTOR" | "RECEPTION";
    doctorLevel: "INTERN" | "DOCTOR" | null;
    fullName: string;
    specialty: string | null;
    professionalTitle: string | null;
  };
};

export type Clinic = {
  id: string;
  clinicCode: string;
  name: string;
  phone: string;
  email: string | null;

  governorate: string;
  city: string;
  district: string;
  streetAddress: string;

  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;

  workingDays: WorkingDay[];
};

export type MyClinic = {
  membershipId: string;
  role: ClinicRole;
  clinic: Clinic;
};

export type CreateClinicDto = {
  name: string;
  phone: string;
  email?: string;

  governorate: string;
  city: string;
  district: string;
  streetAddress: string;

  workingDays: WorkingDay[];
};

export type UpdateClinicDto = {
  name?: string;
  phone?: string;
  email?: string;

  governorate?: string;
  city?: string;
  district?: string;
  streetAddress?: string;

  workingDays?: WorkingDay[];
};

export type JoinCode = {
  id: string;
  clinicId: string;
  code: string;
  expiresAt: string;
  createdAt: string;
};

export type MyMembershipRequest = {
  id: string;
  clinicId: string;
  status: MembershipStatus;
  createdAt: string;
  clinic: {
    id: string;
    clinicCode: string;
    name: string;
    city: string;
  };
};