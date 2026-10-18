import * as SQLite from "expo-sqlite";
import { LOCAL_DATABASE_SCHEMA_SQL } from "./localSchema";

const LOCAL_DATABASE_VERSION = 2;

function createSQLiteSchemaSql(): string {
  let sql = LOCAL_DATABASE_SCHEMA_SQL.replace(
    /("[^"]+" BOOLEAN(?: NOT NULL)?(?: DEFAULT (?:true|false))?)(,)/g,
    (_match, column: string, comma: string) => `${column} CHECK (${column.split(" ")[0]} IN (0, 1))${comma}`,
  );

  // Prisma emits JSON object/array defaults as bare tokens, which SQLite rejects.
  // Store them as quoted JSON text so SQLite can parse the schema and keep the same defaults.
  sql = sql.replace(/(\bJSONB(?: NOT NULL)? DEFAULT )(\{\}|\[\])/g, "$1'$2'");

  const enumChecks: Array<[string, string]> = [
    ['"accountType" TEXT NOT NULL', "'DOCTOR', 'RECEPTION'"],
    ['"doctorLevel" TEXT', "'DOCTOR'"],
    ['"verificationStatus" TEXT NOT NULL DEFAULT \'PENDING\'', "'PENDING', 'APPROVED', 'REJECTED'"],
    ['"clinicRole" TEXT NOT NULL', "'OWNER', 'DOCTOR', 'RECEPTION'"],
    ['"status" TEXT NOT NULL DEFAULT \'ACTIVE\'', "'PENDING', 'ACTIVE', 'REMOVED'"],
    ['"day" TEXT NOT NULL', "'SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'"],
    ['"visitStatus" TEXT NOT NULL DEFAULT \'WAITING\'', "'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'"],
    ['"gender" TEXT NOT NULL', "'MALE', 'FEMALE'"],
    ['"scope" TEXT NOT NULL', "'USER', 'CLINIC', 'GLOBAL'"],
    ['"status" TEXT NOT NULL DEFAULT \'REQUESTED\'', "'REQUESTED', 'COMPLETED', 'CANCELLED'"],
  ];

  for (const [column, values] of enumChecks) {
    const suffix = column === '"doctorLevel" TEXT'
      ? ` CHECK (${column.split(" ")[0]} IS NULL OR ${column.split(" ")[0]} IN (${values}))`
      : ` CHECK (${column.split(" ")[0]} IN (${values}))`;
    sql = sql.replaceAll(`${column},`, `${column}${suffix},`);
  }

  return sql;
}

export type LocalRecord<T> = {
  id: string;
  clinicId: string | null;
  parentId: string | null;
  value: T;
  updatedAt: string;
};

export type LocalRecordsBackup = {
  format: "cliniqara-local-records-backup";
  version: 1;
  exportedAt: string;
  records: Array<{
    collection: string;
    id: string;
    clinicId: string | null;
    parentId: string | null;
    value: unknown;
    updatedAt: string;
  }>;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      // Avoid reusing a stale Android native connection after Expo Go reloads.
      const db = await SQLite.openDatabaseAsync("cliniqara.db", {
        useNewConnection: true,
      });
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
      `);

      const version = await db.getFirstAsync<{ user_version: number }>(
        "PRAGMA user_version",
      );
      if ((version?.user_version ?? 0) < LOCAL_DATABASE_VERSION) {
        await db.withTransactionAsync(async () => {
          await db.execAsync(createSQLiteSchemaSql());
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS local_records (
              collection TEXT NOT NULL,
              id TEXT NOT NULL,
              clinic_id TEXT,
              parent_id TEXT,
              payload TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              PRIMARY KEY (collection, id)
            );
            CREATE INDEX IF NOT EXISTS local_records_clinic_idx
              ON local_records (collection, clinic_id);
            CREATE INDEX IF NOT EXISTS local_records_parent_idx
              ON local_records (collection, parent_id);
            PRAGMA user_version = ${LOCAL_DATABASE_VERSION};
          `);
        });
      }
      return db;
    })().catch((error) => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

export async function getLocalRecord<T>(
  collection: string,
  id: string,
): Promise<LocalRecord<T> | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    clinic_id: string | null;
    parent_id: string | null;
    payload: string;
    updated_at: string;
  }>(
    "SELECT id, clinic_id, parent_id, payload, updated_at FROM local_records WHERE collection = ? AND id = ?",
    collection,
    id,
  );
  if (!row) return null;
  return {
    id: row.id,
    clinicId: row.clinic_id,
    parentId: row.parent_id,
    value: JSON.parse(row.payload) as T,
    updatedAt: row.updated_at,
  };
}

export async function listLocalRecords<T>(
  collection: string,
  clinicId?: string | null,
  parentId?: string | null,
): Promise<Array<LocalRecord<T>>> {
  const db = await getDatabase();
  const clauses = ["collection = ?"];
  const params: (string | null)[] = [collection];
  if (clinicId !== undefined) {
    clauses.push("clinic_id IS ?");
    params.push(clinicId);
  }
  if (parentId !== undefined) {
    clauses.push("parent_id IS ?");
    params.push(parentId);
  }
  const rows = await db.getAllAsync<{
    id: string;
    clinic_id: string | null;
    parent_id: string | null;
    payload: string;
    updated_at: string;
  }>(
    `SELECT id, clinic_id, parent_id, payload, updated_at FROM local_records WHERE ${clauses.join(" AND ")} ORDER BY updated_at DESC`,
    params,
  );
  return rows.map((row) => ({
    id: row.id,
    clinicId: row.clinic_id,
    parentId: row.parent_id,
    value: JSON.parse(row.payload) as T,
    updatedAt: row.updated_at,
  }));
}

export async function putLocalRecord<T>(input: {
  collection: string;
  id: string;
  clinicId?: string | null;
  parentId?: string | null;
  value: T;
}): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO local_records (collection, id, clinic_id, parent_id, payload, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(collection, id) DO UPDATE SET
       clinic_id = excluded.clinic_id,
       parent_id = excluded.parent_id,
       payload = excluded.payload,
       updated_at = excluded.updated_at`,
    input.collection,
    input.id,
    input.clinicId ?? null,
    input.parentId ?? null,
    JSON.stringify(input.value),
    new Date().toISOString(),
  );
}

export async function deleteLocalRecord(
  collection: string,
  id: string,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "DELETE FROM local_records WHERE collection = ? AND id = ?",
    collection,
    id,
  );
}

export async function exportLocalRecordsBackup(): Promise<LocalRecordsBackup> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    collection: string;
    id: string;
    clinic_id: string | null;
    parent_id: string | null;
    payload: string;
    updated_at: string;
  }>("SELECT collection, id, clinic_id, parent_id, payload, updated_at FROM local_records ORDER BY collection, id");

  return {
    format: "cliniqara-local-records-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    records: rows.map((row) => ({
      collection: row.collection,
      id: row.id,
      clinicId: row.clinic_id,
      parentId: row.parent_id,
      value: JSON.parse(row.payload) as unknown,
      updatedAt: row.updated_at,
    })),
  };
}

function parseLocalRecordsBackup(input: unknown): LocalRecordsBackup {
  if (!input || typeof input !== "object") {
    throw new Error("This file is not a Cliniqara backup.");
  }
  const backup = input as Partial<LocalRecordsBackup>;
  if (
    backup.format !== "cliniqara-local-records-backup" ||
    backup.version !== 1 ||
    !Array.isArray(backup.records)
  ) {
    throw new Error("This file is not a supported Cliniqara backup.");
  }
  for (const record of backup.records) {
    if (
      !record ||
      typeof record.collection !== "string" ||
      typeof record.id !== "string" ||
      !(record.clinicId === null || typeof record.clinicId === "string") ||
      !(record.parentId === null || typeof record.parentId === "string") ||
      typeof record.updatedAt !== "string" ||
      !Object.prototype.hasOwnProperty.call(record, "value")
    ) {
      throw new Error("The backup file contains an invalid record.");
    }
  }
  return backup as LocalRecordsBackup;
}

export async function restoreLocalRecordsBackup(input: unknown): Promise<number> {
  const backup = parseLocalRecordsBackup(input);
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM local_records");
    for (const record of backup.records) {
      await db.runAsync(
        `INSERT INTO local_records (collection, id, clinic_id, parent_id, payload, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)` ,
        record.collection,
        record.id,
        record.clinicId,
        record.parentId,
        JSON.stringify(record.value),
        record.updatedAt,
      );
    }
  });
  return backup.records.length;
}

export async function ensureLocalPrismaIdentity(input: {
  id: string;
  userCode: string;
  accountType: "DOCTOR" | "RECEPTION";
  fullName: string;
  email: string;
  phone: string;
  specialty?: string | null;
  professionalTitle?: string | null;
  clinicId: string;
  clinicCode: string;
  clinicName: string;
  clinicPhone: string;
  clinicEmail?: string | null;
}): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const clinicRole = input.accountType === "RECEPTION" ? "RECEPTION" : "OWNER";

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO users (
        id, userCode, accountType, doctorLevel, fullName, specialty,
        professionalTitle, email, phone, passwordHash, verificationStatus,
        isActive, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED', 1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        userCode = excluded.userCode,
        accountType = excluded.accountType,
        doctorLevel = excluded.doctorLevel,
        fullName = excluded.fullName,
        specialty = excluded.specialty,
        professionalTitle = excluded.professionalTitle,
        email = excluded.email,
        phone = excluded.phone,
        verificationStatus = 'APPROVED',
        isActive = 1,
        updatedAt = excluded.updatedAt`,
      input.id,
      input.userCode,
      input.accountType,
      input.accountType === "DOCTOR" ? "DOCTOR" : null,
      input.fullName,
      input.specialty ?? null,
      input.professionalTitle ?? null,
      input.email,
      input.phone,
      "OFFLINE_AUTH_DISABLED",
      now,
      now,
    );

    await db.runAsync(
      `INSERT INTO clinics (
        id, clinicCode, name, phone, email, isActive, createdById,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        clinicCode = excluded.clinicCode,
        name = excluded.name,
        phone = excluded.phone,
        email = excluded.email,
        isActive = 1,
        updatedAt = excluded.updatedAt`,
      input.clinicId,
      input.clinicCode,
      input.clinicName,
      input.clinicPhone,
      input.clinicEmail ?? null,
      input.id,
      now,
      now,
    );

    await db.runAsync(
      "UPDATE users SET currentClinicId = ?, selectedClinicId = ?, updatedAt = ? WHERE id = ?",
      input.clinicId,
      input.clinicId,
      now,
      input.id,
    );

    await db.runAsync(
      `INSERT INTO clinic_members (
        id, clinicId, userId, clinicRole, status, joinedAt, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?, ?)
      ON CONFLICT(clinicId, userId) DO UPDATE SET
        clinicRole = excluded.clinicRole,
        status = 'ACTIVE',
        updatedAt = excluded.updatedAt`,
      `local-membership-${input.id}`,
      input.clinicId,
      input.id,
      clinicRole,
      now,
      now,
      now,
    );
  });
}
