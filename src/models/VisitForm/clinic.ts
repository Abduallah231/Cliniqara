export interface Clinic {
  information: ClinicInformation;

  workingHours: ClinicWorkingHours;

  doctors: Doctor[];

  staff: Staff[];
}

export interface ClinicInformation {
  clinicName: string;

  phone: string;

  address: string;
}

export interface ClinicWorkingHours {
  openingTime: string;

  closingTime: string;

  days: string[];
}

export interface Doctor {
  id: string;

  name: string;

  specialty: string;

  openingTime: string;

  closingTime: string;

  days: string[];
}

export interface Staff {
  id: string;

  name: string;

  role: string;

  openingTime: string;

  closingTime: string;

  days: string[];
}

export function createEmptyClinic(): Clinic {
  return {
    information: {
      clinicName: "",

      phone: "",

      address: "",
    },

    workingHours: {
      openingTime: "",

      closingTime: "",

      days: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
      ],
    },

    doctors: [],

    staff: [],
  };
}

