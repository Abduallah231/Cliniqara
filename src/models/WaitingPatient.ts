import { Gender } from "./patient";

export type WaitingStatus =
  | "Waiting"
  | "With Doctor"

export interface WaitingPatient {
  id: string;

  queueNumber: number;

  fullName: string;

  age: number;

  gender: Gender;

  arrivalTime: string;

  waitingTime: string;

  previousVisits: number;

  status: WaitingStatus;
}