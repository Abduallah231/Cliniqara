import { WaitingPatient } from "@/models";

export const waitingPatientsData: WaitingPatient[] = [
  {
    id: "P-2025-001",
    queueNumber: 1,
    fullName: "Mohamed Ahmed",
    age: 32,
    gender: "Male",
    arrivalTime: "09:00 AM",
    waitingTime: "35 min",
    previousVisits: 12,
    status: "Waiting",
  },
  {
    id: "P-2025-002",
    queueNumber: 2,
    fullName: "Sara Ali",
    age: 27,
    gender: "Female",
    arrivalTime: "09:15 AM",
    waitingTime: "20 min",
    previousVisits: 5,
    status: "Waiting",
  },
  {
    id: "P-2025-003",
    queueNumber: 3,
    fullName: "Omar Hassan",
    age: 58,
    gender: "Male",
    arrivalTime: "09:30 AM",
    waitingTime: "12 min",
    previousVisits: 23,
    status: "With Doctor",
  },
];