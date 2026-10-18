ALTER TYPE "DoctorLevel" RENAME TO "DoctorLevel_old";

CREATE TYPE "DoctorLevel" AS ENUM ('DOCTOR');

ALTER TABLE "users"
ALTER COLUMN "doctorLevel" TYPE "DoctorLevel"
USING CASE
  WHEN "doctorLevel" IS NULL THEN NULL
  ELSE 'DOCTOR'::"DoctorLevel"
END;

DROP TYPE "DoctorLevel_old";
