import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useLocalSearchParams,
  router,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ReactNode } from "react";

import AppCard from "@/components/common/AppCard";
import AppTopBar from "@/components/common/AppTopBar";

import {
  getAllergyHistory,
  getDrugHistory,
  getFamilyHistory,
  getPatient,
  getSocialHistory,
} from "@/services/patientApi";

import {
  getPastHistory,
  getVaccinationHistory,
} from "@/services/visitApi";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

// ======================================================
// Types
// ======================================================

type AnyRecord = Record<string, any>;

type ClinicalHistoryData = {
  patient: any;
  pastHistory: AnyRecord | null;
  drugHistory: AnyRecord | null;
  allergyHistory: AnyRecord | null;
  familyHistory: AnyRecord | null;
  socialHistory: AnyRecord | null;
  vaccinationHistory: AnyRecord | null;
};

// ======================================================
// Helpers
// ======================================================

function isRecord(
  value: unknown,
): value is AnyRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function arrayOf(
  value: unknown,
): any[] {
  return Array.isArray(value)
    ? value
    : [];
}

/**
 * Determines whether a value actually
 * contains usable data.
 *
 * Important:
 * false and 0 are valid values.
 */
function hasValue(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      hasValue(item),
    );
  }

  return true;
}

function displayValue(
  value: unknown,
): string {
  if (!hasValue(value)) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value
      .filter((item) =>
        hasValue(item),
      )
      .map((item) =>
        typeof item === "string"
          ? item
          : JSON.stringify(item),
      )
      .join(", ");
  }

  return String(value);
}

function formatEnum(
  value: unknown,
): string {
  if (!hasValue(value)) {
    return "";
  }

  if (typeof value !== "string") {
    return String(value);
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

/**
 * Displays date only.
 *
 * 2026-09-05
 * 2026-09-05T15:30:00.000Z
 *
 * Both become:
 * 05/09/2026
 */
function formatDateOnly(
  value: unknown,
): string {
  if (!hasValue(value)) {
    return "";
  }

  const raw = String(value).trim();

  // Keep the original calendar date from
  // YYYY-MM-DD / ISO values and avoid
  // timezone shifting.
  const dateMatch =
    raw.match(
      /^(\d{4})-(\d{2})-(\d{2})/,
    );

  if (dateMatch) {
    const [, year, month, day] =
      dateMatch;

    return `${day}/${month}/${year}`;
  }

  const parsedDate = new Date(raw);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    "en-GB",
  );
}

function formatBoolean(
  value: unknown,
): string {
  if (value === true) {
    return "Yes";
  }

  if (value === false) {
    return "No";
  }

  return "";
}

// ======================================================
// UI Components
// ======================================================

function Chip({
  label,
}: {
  label: string;
}) {
  if (
    !label ||
    !label.trim()
  ) {
    return null;
  }

  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>
        {label}
      </Text>
    </View>
  );
}

function ChipList({
  values,
}: {
  values: unknown[];
}) {
  const cleanedValues =
    values
      .flatMap((value) =>
        Array.isArray(value)
          ? value
          : [value],
      )
      .filter((value) =>
        hasValue(value),
      )
      .map((value) =>
        typeof value === "string"
          ? value.trim()
          : String(value),
      )
      .filter(
        (value) =>
          value.trim().length > 0,
      );

  if (
    cleanedValues.length === 0
  ) {
    return null;
  }

  return (
    <View
      style={styles.chipContainer}
    >
      {cleanedValues.map(
        (value, index) => (
          <Chip
            key={`${value}-${index}`}
            label={value}
          />
        ),
      )}
    </View>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.sectionTitle}>
      <View
        style={styles.sectionTitleIcon}
      >
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />
      </View>

      <Text
        style={styles.sectionTitleText}
      >
        {title}
      </Text>
    </View>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  if (!hasValue(value)) {
    return null;
  }

  const text =
    displayValue(value);

  if (!text) {
    return null;
  }

  return (
    <View style={styles.field}>
      <Text
        style={styles.fieldLabel}
      >
        {label}
      </Text>

      <Text
        style={styles.fieldValue}
      >
        {text}
      </Text>
    </View>
  );
}

function ChipField({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  if (!hasValue(value)) {
    return null;
  }

  const text =
    typeof value === "string"
      ? value.trim()
      : displayValue(value);

  if (!text) {
    return null;
  }

  return (
    <View style={styles.field}>
      <Text
        style={styles.fieldLabel}
      >
        {label}
      </Text>

      <View
        style={styles.chipContainer}
      >
        <Chip label={text} />
      </View>
    </View>
  );
}

function MajorSection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppCard>
      {children}
    </AppCard>
  );
}

function ItemDivider() {
  return (
    <View
      style={styles.itemDivider}
    />
  );
}

// ======================================================
// Patient Header
// ======================================================

function PatientHeader({
  patient,
}: {
  patient: AnyRecord;
}) {
  return (
    <AppCard>
      <View
        style={styles.patientHeader}
      >
        <View
          style={styles.patientIcon}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={COLORS.primary}
          />
        </View>

        <View
          style={styles.patientInfo}
        >
          <Text
            style={styles.patientName}
          >
            {patient.fullName ??
              "Patient"}
          </Text>

          <Text
            style={
              styles.patientSubtitle
            }
          >
            Clinical History
          </Text>
        </View>
      </View>
    </AppCard>
  );
}

// ======================================================
// Screen
// ======================================================

export default function ClinicalHistoryScreen() {
  const { patientId } =
    useLocalSearchParams<{
      patientId:
        | string
        | string[];
    }>();

  const resolvedPatientId =
    Array.isArray(patientId)
      ? patientId[0]
      : patientId;

  const [data, setData] =
    useState<ClinicalHistoryData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadHistory =
    useCallback(async () => {
      if (!resolvedPatientId) {
        setError(
          "Patient not found.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          patient,
          pastHistory,
          drugHistory,
          allergyHistory,
          familyHistory,
          socialHistory,
          vaccinationHistory,
        ] = await Promise.all([
          getPatient(
            resolvedPatientId,
          ),

          getPastHistory(
            resolvedPatientId,
          ),

          getDrugHistory(
            resolvedPatientId,
          ),

          getAllergyHistory(
            resolvedPatientId,
          ),

          getFamilyHistory(
            resolvedPatientId,
          ),

          getSocialHistory(
            resolvedPatientId,
          ),

          getVaccinationHistory(
            resolvedPatientId,
          ),
        ]);

        setData({
          patient,

          pastHistory:
            isRecord(
              pastHistory,
            )
              ? pastHistory
              : null,

          drugHistory:
            isRecord(
              drugHistory,
            )
              ? drugHistory
              : null,

          allergyHistory:
            isRecord(
              allergyHistory,
            )
              ? allergyHistory
              : null,

          familyHistory:
            isRecord(
              familyHistory,
            )
              ? familyHistory
              : null,

          socialHistory:
            isRecord(
              socialHistory,
            )
              ? socialHistory
              : null,

          vaccinationHistory:
            isRecord(
              vaccinationHistory,
            )
              ? vaccinationHistory
              : null,
        });
      } catch (err) {
        console.error(
          "Failed to load clinical history:",
          err,
        );

        setError(
          "Unable to load clinical history.",
        );
      } finally {
        setLoading(false);
      }
    }, [resolvedPatientId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ====================================================
  // Loading
  // ====================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <AppTopBar
          title="Clinical History"
          onBack={() =>
            router.back()
          }
        />

        <View style={styles.center}>
          <Text
            style={styles.loadingText}
          >
            Loading clinical history...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ====================================================
  // Error
  // ====================================================

  if (error || !data) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <AppTopBar
          title="Clinical History"
          onBack={() =>
            router.back()
          }
        />

        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error ??
              "Unable to load clinical history."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ====================================================
  // Data
  // ====================================================

  const chronicDiseases =
    arrayOf(
      data.pastHistory
        ?.chronicDiseases,
    );

  const hospitalizations =
    arrayOf(
      data.pastHistory
        ?.hospitalizations,
    );

  const operations =
    arrayOf(
      data.pastHistory
        ?.operations,
    );

  const bloodTransfusions =
    arrayOf(
      data.pastHistory
        ?.bloodTransfusions,
    );

  const majorTraumas =
    arrayOf(
      data.pastHistory
        ?.majorTraumas,
    );

  const icuAdmissions =
    arrayOf(
      data.pastHistory
        ?.icuAdmissions,
    );

  const medications =
    arrayOf(
      data.drugHistory
        ?.medications,
    );

  const allergies =
    arrayOf(
      data.allergyHistory
        ?.allergies,
    );

  const familyHistory =
    arrayOf(
      data.familyHistory
        ?.familyHistory,
    );

  const substanceUse =
    arrayOf(
      data.socialHistory
        ?.substanceUse,
    );

  const missedVaccines =
    arrayOf(
      data.vaccinationHistory
        ?.missedVaccines,
    );

  // ====================================================
  // Section visibility
  // ====================================================

  const hasPastHistory =
    chronicDiseases.length > 0 ||
    hospitalizations.length > 0 ||
    operations.length > 0 ||
    bloodTransfusions.length > 0 ||
    majorTraumas.length > 0 ||
    icuAdmissions.length > 0;

  const hasDrugHistory =
    medications.length > 0 ||
    hasValue(
      data.drugHistory
        ?.medicationCompliance,
    );

  const hasAllergyHistory =
    hasValue(
      data.allergyHistory
        ?.hasAllergy,
    ) ||
    allergies.length > 0;

  const hasFamilyHistory =
    familyHistory.length > 0;

  const hasSocialHistory =
    hasValue(
      data.socialHistory?.smoking,
    ) ||
    hasValue(
      data.socialHistory
        ?.cigarettesPerDay,
    ) ||
    hasValue(
      data.socialHistory
        ?.yearsSmoking,
    ) ||
    hasValue(
      data.socialHistory
        ?.yearsSinceQuitting,
    ) ||
    hasValue(
      data.socialHistory?.alcohol,
    ) ||
    hasValue(
      data.socialHistory
        ?.alcoholFrequency,
    ) ||
    hasValue(
      data.socialHistory
        ?.yearsSinceStopping,
    ) ||
    hasValue(
      data.socialHistory
        ?.livingCondition,
    ) ||
    hasValue(
      data.socialHistory
        ?.livingConditionNotes,
    ) ||
    substanceUse.length > 0 ||
    hasValue(
      data.socialHistory
        ?.substanceNotes,
    ) ||
    hasValue(
      data.socialHistory
        ?.physicalActivity,
    ) ||
    hasValue(
      data.socialHistory
        ?.physicalActivityNotes,
    ) ||
    hasValue(
      data.socialHistory
        ?.sleepDuration,
    ) ||
    hasValue(
      data.socialHistory
        ?.sleepNotes,
    ) ||
    hasValue(
      data.socialHistory
        ?.socialSupport,
    ) ||
    hasValue(
      data.socialHistory
        ?.socialSupportNotes,
    ) ||
    hasValue(
      data.socialHistory
        ?.sexualHistory,
    ) ||
    hasValue(
      data.socialHistory
        ?.sexualHistoryNotes,
    );

  const hasVaccinationHistory =
    hasValue(
      data.vaccinationHistory
        ?.vaccinationStatus,
    ) ||
    hasValue(
      data.vaccinationHistory
        ?.partialReason,
    ) ||
    hasValue(
      data.vaccinationHistory
        ?.partialOtherDetails,
    ) ||
    hasValue(
      data.vaccinationHistory
        ?.unvaccinatedReason,
    ) ||
    hasValue(
      data.vaccinationHistory
        ?.unvaccinatedOtherDetails,
    ) ||
    hasValue(
      data.vaccinationHistory
        ?.previousReaction,
    ) ||
    hasValue(
      data.vaccinationHistory
        ?.reactionSeverity,
    ) ||
    hasValue(
      data.vaccinationHistory
        ?.reactionDetails,
    ) ||
    missedVaccines.length > 0;

  // ====================================================
  // Render
  // ====================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <AppTopBar
        title="Clinical History"
        onBack={() =>
          router.back()
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* ==============================================
            Patient
        ============================================== */}

        <PatientHeader
          patient={data.patient}
        />

        {/* ==============================================
            Past Medical History
        ============================================== */}

        {hasPastHistory && (
          <MajorSection>
            <SectionTitle
              icon="medkit-outline"
              title="Past Medical History"
            />

            <View
              style={
                styles.sectionContent
              }
            >
              {/* Chronic Diseases */}

              {chronicDiseases.length >
                0 && (
                <>
                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    Chronic Diseases
                  </Text>

                  <ChipList
                    values={chronicDiseases.map(
                      (item) =>
                        item.diseaseName,
                    )}
                  />
                </>
              )}

              {/* Hospitalizations */}

              {hospitalizations.length >
                0 && (
                <>
                  <View
                    style={
                      styles.subsectionSpacing
                    }
                  />

                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    Hospitalizations
                  </Text>

                  {hospitalizations.map(
                    (item, index) => (
                      <View
                        key={`hospitalization-${index}`}
                      >
                        {index > 0 && (
                          <ItemDivider />
                        )}

                        <Field
                          label="Reason"
                          value={
                            item.reason
                          }
                        />

                        <Field
                          label="Date"
                          value={formatDateOnly(
                            item.date,
                          )}
                        />

                        <Field
                          label="Duration"
                          value={
                            item.duration
                          }
                        />

                        <Field
                          label="Notes"
                          value={
                            item.notes
                          }
                        />
                      </View>
                    ),
                  )}
                </>
              )}

              {/* Operations */}

              {operations.length > 0 && (
                <>
                  <View
                    style={
                      styles.subsectionSpacing
                    }
                  />

                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    Operations
                  </Text>

                  {operations.map(
                    (item, index) => (
                      <View
                        key={`operation-${index}`}
                      >
                        {index > 0 && (
                          <ItemDivider />
                        )}

                        <Field
                          label="Operation"
                          value={
                            item.operationName
                          }
                        />

                        <Field
                          label="Date"
                          value={formatDateOnly(
                            item.date,
                          )}
                        />

                        <Field
                          label="Indication"
                          value={
                            item.indication
                          }
                        />

                        <Field
                          label="Notes"
                          value={
                            item.notes
                          }
                        />
                      </View>
                    ),
                  )}
                </>
              )}

              {/* Blood Transfusions */}

              {bloodTransfusions.length >
                0 && (
                <>
                  <View
                    style={
                      styles.subsectionSpacing
                    }
                  />

                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    Blood Transfusions
                  </Text>

                  {bloodTransfusions.map(
                    (item, index) => (
                      <View
                        key={`transfusion-${index}`}
                      >
                        {index > 0 && (
                          <ItemDivider />
                        )}

                        <Field
                          label="Reason"
                          value={
                            item.reason
                          }
                        />

                        <Field
                          label="Date"
                          value={formatDateOnly(
                            item.date,
                          )}
                        />

                        <Field
                          label="Reaction"
                          value={
                            item.reaction
                          }
                        />

                        <Field
                          label="Notes"
                          value={
                            item.notes
                          }
                        />
                      </View>
                    ),
                  )}
                </>
              )}

              {/* Major Traumas */}

              {majorTraumas.length >
                0 && (
                <>
                  <View
                    style={
                      styles.subsectionSpacing
                    }
                  />

                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    Major Traumas
                  </Text>

                  {majorTraumas.map(
                    (item, index) => (
                      <View
                        key={`trauma-${index}`}
                      >
                        {index > 0 && (
                          <ItemDivider />
                        )}

                        <Field
                          label="Type"
                          value={
                            item.traumaType
                          }
                        />

                        <Field
                          label="Date"
                          value={formatDateOnly(
                            item.date,
                          )}
                        />

                        <Field
                          label="Complications"
                          value={
                            item.complications
                          }
                        />

                        <Field
                          label="Notes"
                          value={
                            item.notes
                          }
                        />
                      </View>
                    ),
                  )}
                </>
              )}

              {/* ICU Admissions */}

              {icuAdmissions.length >
                0 && (
                <>
                  <View
                    style={
                      styles.subsectionSpacing
                    }
                  />

                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    ICU Admissions
                  </Text>

                  {icuAdmissions.map(
                    (item, index) => (
                      <View
                        key={`icu-${index}`}
                      >
                        {index > 0 && (
                          <ItemDivider />
                        )}

                        <Field
                          label="Reason"
                          value={
                            item.reason
                          }
                        />

                        <Field
                          label="Date"
                          value={formatDateOnly(
                            item.date,
                          )}
                        />

                        <Field
                          label="Duration"
                          value={
                            item.duration
                          }
                        />

                        <ChipField
                          label="Ventilator Support"
                          value={formatBoolean(
                            item.ventilatorSupport,
                          )}
                        />

                        <Field
                          label="Notes"
                          value={
                            item.notes
                          }
                        />
                      </View>
                    ),
                  )}
                </>
              )}
            </View>
          </MajorSection>
        )}

        {/* ==============================================
            Drug History
        ============================================== */}

        {hasDrugHistory && (
          <MajorSection>
            <SectionTitle
              icon="medical-outline"
              title="Drug History"
            />

            <View
              style={
                styles.sectionContent
              }
            >
              {medications.length >
                0 && (
                <>
                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    Current Medications
                  </Text>

                  {medications.map(
                    (item, index) => (
                      <View
                        key={
                          item.id ??
                          `medication-${index}`
                        }
                      >
                        {index > 0 && (
                          <ItemDivider />
                        )}

                        <Field
                          label="Medication"
                          value={
                            item.medicationName
                          }
                        />

                        <Field
                          label="Dose"
                          value={
                            item.dose
                          }
                        />

                        {hasValue(
                          item.durationValue,
                        ) && (
                          <Field
                            label="Duration"
                            value={`${item.durationValue} ${formatEnum(
                              item.durationUnit,
                            )}`}
                          />
                        )}

                        <Field
                          label="Notes"
                          value={
                            item.notes
                          }
                        />
                      </View>
                    ),
                  )}
                </>
              )}

              {hasValue(
                data.drugHistory
                  ?.medicationCompliance,
              ) && (
                <>
                  {medications.length >
                    0 && (
                    <View
                      style={
                        styles.subsectionSpacing
                      }
                    />
                  )}

                  <ChipField
                    label="Medication Compliance"
                    value={formatEnum(
                      data.drugHistory
                        ?.medicationCompliance,
                    )}
                  />
                </>
              )}
            </View>
          </MajorSection>
        )}

        {/* ==============================================
            Allergy History
        ============================================== */}

        {hasAllergyHistory && (
          <MajorSection>
            <SectionTitle
              icon="warning-outline"
              title="Allergy History"
            />

            <View
              style={
                styles.sectionContent
              }
            >
              {hasValue(
                data.allergyHistory
                  ?.hasAllergy,
              ) && (
                <ChipField
                  label="Allergy Status"
                  value={formatBoolean(
                    data.allergyHistory
                      ?.hasAllergy,
                  )}
                />
              )}

              {allergies.length > 0 && (
                <>
                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    Allergies
                  </Text>

                  {allergies.map(
                    (item, index) => (
                      <View
                        key={
                          item.id ??
                          `allergy-${index}`
                        }
                      >
                        {index > 0 && (
                          <ItemDivider />
                        )}

                        <Field
                          label="Allergen"
                          value={
                            item.allergen
                          }
                        />

                        <ChipField
                          label="Type"
                          value={formatEnum(
                            item.type,
                          )}
                        />

                        <Field
                          label="Reaction"
                          value={
                            item.reaction
                          }
                        />

                        <ChipField
                          label="Severity"
                          value={formatEnum(
                            item.severity,
                          )}
                        />

                        <Field
                          label="Notes"
                          value={
                            item.notes
                          }
                        />
                      </View>
                    ),
                  )}
                </>
              )}
            </View>
          </MajorSection>
        )}

        {/* ==============================================
            Family History
        ============================================== */}

        {hasFamilyHistory && (
          <MajorSection>
            <SectionTitle
              icon="people-outline"
              title="Family History"
            />

            <View
              style={
                styles.sectionContent
              }
            >
              {familyHistory.map(
                (item, index) => (
                  <View
                    key={
                      item.id ??
                      `family-${index}`
                    }
                  >
                    {index > 0 && (
                      <ItemDivider />
                    )}

                    <Field
                      label="Relation"
                      value={
                        item.otherRelation ??
                        formatEnum(
                          item.relation,
                        )
                      }
                    />

                    {hasValue(
                      item.diseases,
                    ) && (
                      <View
                        style={
                          styles.field
                        }
                      >
                        <Text
                          style={
                            styles.fieldLabel
                          }
                        >
                          Diseases
                        </Text>

                        <ChipList
                          values={[
                            item.diseases,
                          ]}
                        />
                      </View>
                    )}

                    <ChipField
                      label="Status"
                      value={formatBoolean(
                        item.alive,
                      )}
                    />

                    <Field
                      label="Age at Death"
                      value={
                        item.ageAtDeath
                      }
                    />

                    <Field
                      label="Cause of Death"
                      value={
                        item.causeOfDeath
                      }
                    />

                    <Field
                      label="Notes"
                      value={
                        item.notes
                      }
                    />
                  </View>
                ),
              )}
            </View>
          </MajorSection>
        )}

        {/* ==============================================
            Social History
        ============================================== */}

        {hasSocialHistory && (
          <MajorSection>
            <SectionTitle
              icon="home-outline"
              title="Social History"
            />

            <View
              style={
                styles.sectionContent
              }
            >
              <ChipField
                label="Smoking"
                value={formatEnum(
                  data.socialHistory
                    ?.smoking,
                )}
              />

              <Field
                label="Cigarettes Per Day"
                value={
                  data.socialHistory
                    ?.cigarettesPerDay
                }
              />

              <Field
                label="Years Smoking"
                value={
                  data.socialHistory
                    ?.yearsSmoking
                }
              />

              <Field
                label="Years Since Quitting"
                value={
                  data.socialHistory
                    ?.yearsSinceQuitting
                }
              />

              <ChipField
                label="Alcohol"
                value={formatEnum(
                  data.socialHistory
                    ?.alcohol,
                )}
              />

              <ChipField
                label="Alcohol Frequency"
                value={formatEnum(
                  data.socialHistory
                    ?.alcoholFrequency,
                )}
              />

              <Field
                label="Years Since Stopping"
                value={
                  data.socialHistory
                    ?.yearsSinceStopping
                }
              />

              <ChipField
                label="Living Condition"
                value={formatEnum(
                  data.socialHistory
                    ?.livingCondition,
                )}
              />

              <Field
                label="Living Condition Notes"
                value={
                  data.socialHistory
                    ?.livingConditionNotes
                }
              />

              {substanceUse.length >
                0 && (
                <View
                  style={styles.field}
                >
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    Substance Use
                  </Text>

                  <ChipList
                    values={substanceUse}
                  />
                </View>
              )}

              <Field
                label="Substance Notes"
                value={
                  data.socialHistory
                    ?.substanceNotes
                }
              />

              <ChipField
                label="Physical Activity"
                value={formatEnum(
                  data.socialHistory
                    ?.physicalActivity,
                )}
              />

              <Field
                label="Physical Activity Notes"
                value={
                  data.socialHistory
                    ?.physicalActivityNotes
                }
              />

              <ChipField
                label="Sleep Duration"
                value={formatEnum(
                  data.socialHistory
                    ?.sleepDuration,
                )}
              />

              <Field
                label="Sleep Notes"
                value={
                  data.socialHistory
                    ?.sleepNotes
                }
              />

              <ChipField
                label="Social Support"
                value={formatEnum(
                  data.socialHistory
                    ?.socialSupport,
                )}
              />

              <Field
                label="Social Support Notes"
                value={
                  data.socialHistory
                    ?.socialSupportNotes
                }
              />

              <ChipField
                label="Sexual History"
                value={formatEnum(
                  data.socialHistory
                    ?.sexualHistory,
                )}
              />

              <Field
                label="Sexual History Notes"
                value={
                  data.socialHistory
                    ?.sexualHistoryNotes
                }
              />
            </View>
          </MajorSection>
        )}

        {/* ==============================================
            Vaccination History
        ============================================== */}

        {hasVaccinationHistory && (
          <MajorSection>
            <SectionTitle
              icon="shield-checkmark-outline"
              title="Vaccination History"
            />

            <View
              style={
                styles.sectionContent
              }
            >
              <ChipField
                label="Vaccination Status"
                value={formatEnum(
                  data.vaccinationHistory
                    ?.vaccinationStatus,
                )}
              />

              <ChipField
                label="Partial Reason"
                value={formatEnum(
                  data.vaccinationHistory
                    ?.partialReason,
                )}
              />

              <Field
                label="Additional Details"
                value={
                  data.vaccinationHistory
                    ?.partialOtherDetails
                }
              />

              <ChipField
                label="Unvaccinated Reason"
                value={formatEnum(
                  data.vaccinationHistory
                    ?.unvaccinatedReason,
                )}
              />

              <Field
                label="Additional Details"
                value={
                  data.vaccinationHistory
                    ?.unvaccinatedOtherDetails
                }
              />

              <Field
                label="Previous Reaction"
                value={
                  data.vaccinationHistory
                    ?.previousReaction
                }
              />

              <ChipField
                label="Reaction Severity"
                value={formatEnum(
                  data.vaccinationHistory
                    ?.reactionSeverity,
                )}
              />

              <Field
                label="Reaction Details"
                value={
                  data.vaccinationHistory
                    ?.reactionDetails
                }
              />

              {missedVaccines.length >
                0 && (
                <>
                  <Text
                    style={
                      styles.subsectionTitle
                    }
                  >
                    Missed Vaccines
                  </Text>

                  <ChipList
                    values={
                      missedVaccines
                    }
                  />
                </>
              )}
            </View>
          </MajorSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// Styles
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: 120,
    gap: SPACING.md,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },

  loadingText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  errorText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
    textAlign: "center",
  },

  // ====================================================
  // Patient Header
  // ====================================================

  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  patientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.background,
  },

  patientInfo: {
    flex: 1,
    gap: 2,
  },

  patientName: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientSubtitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  // ====================================================
  // Section
  // ====================================================

  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  sectionTitleIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.background,
  },

  sectionTitleText: {
    flex: 1,
    fontSize: TYPOGRAPHY.title,
    fontWeight: "800",
    color: COLORS.text,
  },

  sectionContent: {
    paddingTop: SPACING.md,
    gap: SPACING.sm,
  },

  subsectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  subsectionSpacing: {
    height: SPACING.md,
  },

  // ====================================================
  // Fields
  // ====================================================

  field: {
    gap: SPACING.xs,
  },

  fieldLabel: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  fieldValue: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 21,
  },

  // ====================================================
  // Chips
  // ====================================================

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  chipText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // ====================================================
  // Misc
  // ====================================================

  itemDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
});