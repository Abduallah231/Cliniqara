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
  address: string;
  country: string;
  city: string;
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

export type JoinCode = {
  id: string;
  clinicId: string;
  code: string;
  expiresAt: string;
  createdAt: string;
};

export type CreateClinicDto = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  country: string;
  city: string;
  workingDays: {
    day: WeekDay;
    startTime?: string;
    endTime?: string;
    isClosed: boolean;
  }[];
};

export type UpdateClinicDto = Partial<
  Omit<CreateClinicDto, "workingDays">
> & {
  workingDays?: CreateClinicDto["workingDays"];
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