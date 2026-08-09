export type ClinicRole =
  | "OWNER"
  | "DOCTOR"
  | "RECEPTION";

export type MembershipStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REMOVED";

export type WorkingDay = {
  id: string;
  day: string;
  startTime: string | null;
  endTime: string | null;
  isClosed: boolean;
};

export type ClinicMember = {
  id: string;
  clinicRole: ClinicRole;
  status: MembershipStatus;
  joinedAt: string | null;
  removedAt: string | null;

  user: {
    id: string;
    fullName: string;
    accountType: "DOCTOR" | "RECEPTION";
    doctorLevel: "INTERN" | "DOCTOR" | null;
    specialty: string | null;
    professionalTitle: string | null;
  };
};

export type Clinic = {
  id: string;
  clinicCode: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  country: string | null;
  city: string | null;
  isActive: boolean;
  createdById: string;

  workingDays: WorkingDay[];
  members: ClinicMember[];
};