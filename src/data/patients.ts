import { PatientSummary } from "@/models";

export const patientsData: PatientSummary[] = [
  {
    id: "P-2025-001",
    fullName: "Mohamed Ahmed",
    age: 32,
    gender: "Male",
    phone: "01012345678",
    lastVisit: "Today",
    isFavorite: true,
  },
  {
    id: "P-2025-002",
    fullName: "Sara Ali",
    age: 27,
    gender: "Female",
    phone: "01011111111",
    lastVisit: "Yesterday",
    isFavorite: false,
  },
  {
    id: "P-2025-003",
    fullName: "Omar Hassan",
    age: 58,
    gender: "Male",
    phone: "01033333333",
    lastVisit: "2 Weeks Ago",
    isFavorite: false,
  },
  {
    id: "P-2025-004",
    fullName: "Mona Adel",
    age: 44,
    gender: "Female",
    phone: "01022222222",
    lastVisit: "1 Month Ago",
    isFavorite: true,
  },
];