import { useClinicStore } from "@/store/clinicStore";
import { useDoctorStore } from "@/store/doctorStore";
import type { Patient } from "@/types/patient";
import type { Visit, WaitingVisit } from "@/types/visit";
import {
  getLocalRecord,
  listLocalRecords,
  putLocalRecord,
} from "./localDatabase";

type Config = { params?: Record<string, unknown> };
const id = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const selectedClinicId = () => useClinicStore.getState().currentClinic?.clinic.id ?? "local-clinic";

async function visitRecord(visitId: string): Promise<Visit> {
  const record = await getLocalRecord<Visit>("visits", visitId);
  if (!record) throw new Error("Visit not found on this device");
  return record.value;
}

async function storeVisit(visit: Visit): Promise<Visit> {
  await putLocalRecord({ collection: "visits", id: visit.id, clinicId: visit.clinicId, parentId: visit.patientId, value: visit });
  return visit;
}

async function section(collection: string, visitId: string) {
  return (await getLocalRecord<unknown>(collection, visitId))?.value ?? null;
}

async function saveSection(collection: string, visitId: string, value: unknown) {
  const visit = await visitRecord(visitId);
  let normalized: any = value;
  const now = new Date().toISOString();
  if (collection === "visit_related-systems") normalized = (value as any)?.systems ?? [];
  if (collection === "visit_regional-examination") normalized = (value as any)?.regionalExaminations ?? [];
  if (collection === "visit_system-examination") normalized = (value as any)?.systems ?? [];
  if (collection === "visit_procedures") normalized = (value as any)?.procedures ?? [];
  if (collection === "visit_referrals") normalized = (value as any)?.referrals ?? [];
  if (collection === "visit_diagnosis") normalized = {
    ...(value as object), id: `local-diagnosis-${visitId}`, visitId,
    primaryDiagnosisCode: (value as any)?.primaryDiagnosisCode ?? null,
    primaryDiagnosisName: (value as any)?.primaryDiagnosisName ?? null,
    differentialDiagnoses: (value as any)?.differentialDiagnoses ?? null,
    createdAt: now, updatedAt: now,
  };
  if (collection === "visit_investigations") {
    const previous = await section(collection, visitId) as any[] | null;
    normalized = ((value as any)?.investigations ?? []).map((item: any, index: number) => ({
      ...item,
      id: previous?.[index]?.id ?? item.id ?? id(),
      visitId,
      requestedAt: previous?.[index]?.requestedAt ?? now,
      completedAt: item.status === "COMPLETED" ? (previous?.[index]?.completedAt ?? now) : null,
      result: item.result ?? null,
      notes: item.notes ?? null,
      images: (item.images ?? []).map((image: any, imageIndex: number) => ({
        id: previous?.[index]?.images?.[imageIndex]?.id ?? id(),
        investigationId: previous?.[index]?.id ?? item.id ?? null,
        fileUrl: image.fileUrl, sortOrder: image.sortOrder ?? imageIndex, createdAt: now,
      })),
    }));
  }
  if (collection === "visit_prescription") {
    normalized = {
      ...(value as object), id: `local-prescription-${visitId}`, visitId,
      advice: (value as any)?.advice ?? null, notes: (value as any)?.notes ?? null,
      followUp: (value as any)?.followUp ?? null, createdAt: now, updatedAt: now,
      medications: ((value as any)?.medications ?? []).map((medication: any, index: number) => ({
        ...medication, id: id(), prescriptionId: `local-prescription-${visitId}`,
        medication: medication.drugId, durationValue: medication.durationValue ?? null,
        durationUnit: medication.durationUnit ?? null, sortOrder: medication.sortOrder ?? index,
      })),
    };
  }
  await putLocalRecord({ collection, id: visitId, clinicId: visit.clinicId, parentId: visitId, value: normalized });
  return normalized;
}

async function get(path: string, config?: Config): Promise<{ data: any }> {
  if (path === "/visits/waiting") {
    const clinicId = String(config?.params?.clinicId ?? selectedClinicId());
    const records = await listLocalRecords<Visit>("visits", clinicId);
    const visits = records.map((record) => record.value).filter((visit) => visit.visitStatus === "WAITING");
    const rows: WaitingVisit[] = [];
    for (const visit of visits) {
      const patient = await getLocalRecord<Patient>("patients", visit.patientId);
      const doctor = useDoctorStore.getState().doctor;
      if (patient) rows.push({
        ...visit,
        patient: { id: patient.value.id, patientCode: patient.value.patientCode, fullName: patient.value.fullName },
        doctor: { id: doctor?.id ?? visit.doctorId, fullName: doctor?.fullName ?? "Doctor" },
      });
    }
    return { data: rows };
  }
  if (path === "/visits/today/count") {
    const clinicId = String(config?.params?.clinicId ?? selectedClinicId());
    const today = new Date().toDateString();
    const records = await listLocalRecords<Visit>("visits", clinicId);
    return { data: { count: records.filter(({ value }) => new Date(value.visitDate).toDateString() === today).length } };
  }
  let match = path.match(/^\/visits\/patient\/([^/]+)\/open$/);
  if (match) {
    const records = await listLocalRecords<Visit>("visits", selectedClinicId(), match[1]);
    return { data: records.map((row) => row.value).find((visit) => visit.visitStatus === "WAITING" || visit.visitStatus === "IN_PROGRESS") ?? null };
  }
  match = path.match(/^\/visits\/patient\/([^/]+)$/);
  if (match) {
    const records = await listLocalRecords<Visit>("visits", selectedClinicId(), match[1]);
    return { data: records.map(({ value: visit }) => ({
      ...visit,
      doctor: { id: visit.doctorId, fullName: useDoctorStore.getState().doctor?.fullName ?? "Doctor" },
      chiefComplaint: null,
      diagnosis: null,
    })) };
  }
  match = path.match(/^\/visits\/([^/]+)\/chief-complaint\/([^/]+)$/);
  if (match) {
    const saved = await section("visit_chief-complaint", match[1]) as Record<string, unknown> | null;
    return { data: saved?.chiefComplaintId === match[2] ? saved : null };
  }
  match = path.match(/^\/patients\/([^/]+)\/([^/]+)$/);
  if (match) return { data: await section(`patient_${match[2]}`, match[1]) };
  match = path.match(/^\/visits\/([^/]+)\/(.+)$/);
  if (match) return { data: await section(`visit_${match[2]}`, match[1]) ?? (match[2].includes("examination") || match[2] === "related-systems" ? [] : null) };
  throw new Error(`Offline operation is not supported: GET ${path}`);
}

async function post(path: string, body?: any): Promise<{ data: any }> {
  if (path === "/visits/waiting") {
    const clinicId = selectedClinicId();
    const doctor = useDoctorStore.getState().doctor;
    const visit: Visit = {
      id: id(), visitCode: `L-${Date.now().toString().slice(-8)}`, secureCode: id().slice(-6).toUpperCase(),
      patientId: body.patientId, clinicId, createdById: doctor?.id ?? "local-user", doctorId: body.doctorId ?? doctor?.id ?? "local-user",
      visitStatus: "WAITING", visitDate: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    return { data: await storeVisit(visit) };
  }
  if (path === "/visits/start") {
    const visit = await visitRecord(body.visitId);
    return { data: await storeVisit({ ...visit, visitStatus: "IN_PROGRESS", startedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }) };
  }
  if (path === "/visits/complete") {
    const visit = await visitRecord(body.visitId);
    return { data: await storeVisit({ ...visit, visitStatus: "COMPLETED", completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }) };
  }
  if (path === "/visits/cancel") {
    const visit = await visitRecord(body.visitId);
    return { data: await storeVisit({ ...visit, visitStatus: "CANCELLED", cancelledAt: new Date().toISOString(), cancellationReason: body.reason ?? null, updatedAt: new Date().toISOString() }) };
  }
  if (path === "/visits/change-doctor") {
    const visit = await visitRecord(body.visitId);
    return { data: await storeVisit({ ...visit, doctorId: body.doctorId, updatedAt: new Date().toISOString() }) };
  }
  if (path === "/visits/details" || path === "/visits/read-only-details") {
    const visit = await visitRecord(body.visitId);
    const patient = await getLocalRecord<Patient>("patients", visit.patientId);
    return { data: {
      ...visit,
      patient: patient ? { id: patient.id, fullName: patient.value.fullName, patientCode: patient.value.patientCode } : null,
      doctor: { id: visit.doctorId, fullName: useDoctorStore.getState().doctor?.fullName ?? "Doctor" },
      chiefComplaint: await section("visit_chief-complaint", visit.id),
      diagnosis: await section("visit_diagnosis", visit.id),
    } };
  }
  let match = path.match(/^\/visits\/([^/]+)\/([^/]+)$/);
  if (match) return { data: await saveSection(`visit_${match[2]}`, match[1], body) };
  match = path.match(/^\/patients\/([^/]+)\/([^/]+)$/);
  if (match) return { data: await savePatientSection(`patient_${match[2]}`, match[1], body) };
  throw new Error(`Offline operation is not supported: POST ${path}`);
}

async function put(path: string, body?: any): Promise<{ data: any }> {
  let match = path.match(/^\/patients\/([^/]+)\/([^/]+)$/);
  if (match) return { data: await savePatientSection(`patient_${match[2]}`, match[1], body) };
  match = path.match(/^\/visits\/([^/]+)\/(.+)$/);
  if (match) return { data: await saveSection(`visit_${match[2]}`, match[1], body) };
  throw new Error(`Offline operation is not supported: PUT ${path}`);
}

async function savePatientSection(collection: string, patientId: string, value: unknown) {
  const patient = await getLocalRecord<Patient>("patients", patientId);
  if (!patient) throw new Error("Patient not found on this device");
  await putLocalRecord({ collection, id: patientId, clinicId: patient.clinicId, parentId: patientId, value });
  return value;
}

export const localVisitApi = { get, post, put };
