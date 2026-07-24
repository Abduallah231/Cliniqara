# Cliniqara Business Rules

> **Version:** 1.0
>
> This document defines all business rules governing the Cliniqara system.
> Each rule has a unique identifier and specifies where it must be enforced.
>
> ## Rule Layers
>
> - **Database** → Prisma / PostgreSQL Constraints
> - **Service** → NestJS Business Logic
> - **Frontend** → UI Validation & User Experience
>
> ## Rule Status
>
> - ✅ Implemented
> - ⏳ Pending
> - 🚧 In Progress
> - ❌ Rejected

---

# USER MODULE

## BR-USER-001

**Description**

Every user must have a unique UUID.

**Layer**

Database

**Status**

✅ Implemented

---

## BR-USER-002

**Description**

Email must be unique.

**Layer**

Database

**Status**

✅ Implemented

---

## BR-USER-003

**Description**

Phone number must be unique.

**Layer**

Database

**Status**

✅ Implemented

---

## BR-USER-004

**Description**

Medical license number must be unique if provided.

**Layer**

Database

**Status**

✅ Implemented

---

## BR-USER-005

**Description**

Users with account type = DOCTOR must provide a medical license.
إذا لم يتم إدخال medicalLicenseNumber → يرفض الطلب.

**Layer**

Service

**Status**

⏳ Pending

---

## BR-USER-006

**Description**

Reception users must not have a medical license.

**Layer**

Service

**Status**

⏳ Pending

---

# CLINIC MODULE

## BR-CLINIC-001

Clinic code must be unique.

Layer: Database

Status: ✅

---

## BR-CLINIC-002

Every clinic must have an owner.

Layer: Database

Status: ✅

---

## BR-CLINIC-003

A clinic containing patients cannot be deleted.

Layer: Service

Status: ⏳ Pending

---

## BR-CLINIC-004

A clinic containing visits cannot be deleted.

Layer: Service

Status: ⏳ Pending

---

## BR-CLINIC-005

Only one OWNER is allowed per clinic.

Layer: Service

Status: ⏳ Pending

---

## BR-CLINIC-006

The clinic owner cannot remove himself if no other owner exists.

----

## BR-CLINIC-007

An inactive clinic cannot accept new visits.

----


# PATIENT MODULE

## BR-PAT-001

Patient Code must be unique inside each clinic.

Layer: Database

Status: ✅

---

## BR-PAT-002

Patient must belong to one clinic.

Layer: Database

Status: ✅

---

## BR-PAT-003

Patient name is mandatory.

Layer: Frontend + Service

Status: ⏳ Pending

---

## BR-PAT-004

If Identifier Type = NATIONAL_ID,
Identifier Number is required.

Layer: Service

Status: ⏳ Pending

---

## BR-PAT-005

Date of Birth and Estimated Age cannot both be entered.

Layer: Service

Status: ⏳ Pending

---

## BR-PAT-006

If Date of Birth is unknown,
Estimated Age becomes mandatory.

Layer: Service

Status: ⏳ Pending

---

## BR-PAT-007

Verified National ID cannot be modified.

Layer: Service

Status: ⏳ Pending

---

## BR-PAT-008

Patient لا يمكن نقله من Clinic إلى أخرى.

----

## BR-PAT-009

لا يمكن حذف Patient لديه Visits.

----

# VISIT MODULE

## BR-VIS-001

Only one OPEN visit is allowed per patient.

Layer: Service

Status: ⏳ Pending

---

## BR-VIS-002

Completed visits cannot be edited.

Layer: Service

Status: ⏳ Pending

---

## BR-VIS-003

Cancelled visits cannot be edited.

Layer: Service

Status: ⏳ Pending

---

## BR-VIS-004

Deleting visits must follow the project policy.

Layer: Service

Status: ⏳ Pending

---

## BR-VIS-005

Visit must belong to one patient.

Layer: Database

Status: ✅

---

## BR-VIS-006

Visit Code must be unique inside clinic.

Layer: Database

Status: ✅

---
## BR-VIS-007

Completed Visit cannot return to OPEN.

----

## BR-VIS-008

Visit يجب أن تكون مرتبطة بطبيب واحد فقط.

----

# CHIEF COMPLAINT

## BR-CC-001

A visit cannot be completed without a Chief Complaint.

Layer: Service

Status: ⏳ Pending

---

## BR-CC-002

لا يمكن حذف Chief Complaint بعد Completion.

# DIAGNOSIS

## BR-DIAG-001

Primary Diagnosis Required؟
الطبيب قد لا يصل لتشخيص نهائي في أول زيارة.

Layer: Service

Status: ⏳ Pending

---

## BR-DIAG-002

A visit cannot be completed without Diagnosis if required by project policy.

Layer: Service

Status: ⏳ Pending

---

# INVESTIGATIONS

## BR-INV-001

Completed investigations must contain completion date.

Layer: Service

Status: ⏳ Pending

---

## BR-INV-002

Completed investigations must contain result if required.

Layer: Service

Status: ⏳ Pending

---

# PRESCRIPTION

## BR-RX-001

Prescription may contain zero or more medications according to project policy.

Layer: Service

Status: ⏳ Pending

---

## BR-RX-002

Medication instructions requirement must follow project policy.

Layer: Service

Status: ⏳ Pending

---

## BR-RX-003

Follow-up field is optional unless project policy changes.

Layer: Service

Status: ⏳ Pending

---

## BR-RX-004

Prescription لا تعدل بعد Completion.
---

# CHANGE LOG

## Version 1.0

- Initial Business Rules document.
- Database Rules documented.
- Pending Service Rules documented.
- Ready for Service Design Review.


In the future

Security Rules
Permission Rules (RBAC)
Audit Rules
Auto Save Rules
Visit Lifecycle Rules
Investigation Workflow Rules
Prescription Workflow Rules
Report Rules
AI Rules (عند تصميم الـ AI)
Notification Rules
Offline Sync Rules