// ======================================================
// Patient
// ======================================================

export interface Patient {
  // =========================
  // Identification
  // =========================
  identifierType: string;
  identifierNumber: string;
  documentType: string;

  // =========================
  // Basic Information
  // =========================
  fullName: string;
  dateOfBirth: Date | null;
  age: string;
  ageUnit: "Days" | "Months" | "Years";
  gender: "male" | "female";
  maritalStatus:
    | "Single"
    | "Married"
    | "Divorced"
    | "Widowed";
  childrenCount: string;

  // =========================
  // Contact
  // =========================
  phone: string;

  // =========================
  // Occupation
  // =========================
  occupation: string;
  otherOccupation: string;

  // =========================
  // Address
  // =========================
  governorate: string;
  city: string;
  district: string;
  street: string;
}

// ======================================================
// Create Empty Patient
// ======================================================

export function createEmptyPatient(): Patient {
  return {
    // Identification
    identifierType: "National ID",
    identifierNumber: "",
    documentType: "",

    // Basic Information
    fullName: "",
    dateOfBirth: null,
    age: "",
    ageUnit: "Years",
    gender: "male",
    maritalStatus: "Single",
    childrenCount: "",

    // Contact
    phone: "",

    // Occupation
    occupation: "",
    otherOccupation: "",

    // Address
    governorate: "",
    city: "",
    district: "",
    street: "",
  };
}