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

import AppCard from "@/components/common/AppCard";
import AppTopBar from "@/components/common/AppTopBar";
import type { ReactNode } from "react";

import {
  getAllergyHistory,
  getDrugHistory,
  getFamilyHistory,
  getSocialHistory,
  
  getPatient,
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

type AnyRecord =
  Record<string, any>;

type ClinicalHistoryData = {
  patient: any;
  pastHistory: AnyRecord | null;
  drugHistory: AnyRecord | null;
  allergyHistory: AnyRecord | null;
  familyHistory: AnyRecord | null;
  socialHistory: AnyRecord | null;
  vaccinationHistory: AnyRecord | null;
};

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

function displayValue(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (
    typeof value === "boolean"
  ) {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "—";
    }

    return value
      .map((item) =>
        typeof item ===
        "string"
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
  if (
    typeof value !== "string" ||
    !value
  ) {
    return "—";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0)
          .toUpperCase() +
        part.slice(1),
    )
    .join(" ");
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
      <View style={styles.sectionTitleIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.sectionTitleText}>
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
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <Text style={styles.fieldValue}>
        {displayValue(value)}
      </Text>
    </View>
  );
}

function EmptySection({
  text = "No information recorded.",
}: {
  text?: string;
}) {
  return (
    <Text style={styles.emptyText}>
      {text}
    </Text>
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
    <View style={styles.itemDivider} />
  );
}

function PatientHeader({
  patient,
}: {
  patient: AnyRecord;
}) {
  return (
    <AppCard>
      <View style={styles.patientHeader}>
        <View
          style={styles.patientIcon}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {patient.fullName ??
              "Patient"}
          </Text>

          <Text style={styles.patientCode}>
            {patient.patientCode ??
              "—"}
          </Text>
        </View>
      </View>
    </AppCard>
  );
}

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
          <Text style={styles.loadingText}>
            Loading clinical history...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <PatientHeader
          patient={data.patient}
        />

        {/* Past History */}
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
            <Text
              style={
                styles.subsectionTitle
              }
            >
              Chronic Diseases
            </Text>

            {chronicDiseases.length ===
            0 ? (
              <EmptySection />
            ) : (
              chronicDiseases.map(
                (item, index) => (
                  <View
                    key={
                      item.id ??
                      `${item.diseaseName}-${index}`
                    }
                  >
                    {index > 0 && (
                      <ItemDivider />
                    )}

                    <Field
                      label="Disease"
                      value={
                        item.diseaseName
                      }
                    />

                    {item.diseaseCode && (
                      <Field
                        label="Code"
                        value={
                          item.diseaseCode
                        }
                      />
                    )}

                    {item.notes && (
                      <Field
                        label="Notes"
                        value={
                          item.notes
                        }
                      />
                    )}
                  </View>
                ),
              )
            )}

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

            {hospitalizations.length ===
            0 ? (
              <EmptySection />
            ) : (
              hospitalizations.map(
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
                      value={
                        item.date
                      }
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
              )
            )}

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

            {operations.length ===
            0 ? (
              <EmptySection />
            ) : (
              operations.map(
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
                      value={
                        item.date
                      }
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
              )
            )}

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

            {bloodTransfusions.length ===
            0 ? (
              <EmptySection />
            ) : (
              bloodTransfusions.map(
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
                      value={
                        item.date
                      }
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
              )
            )}

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

            {majorTraumas.length ===
            0 ? (
              <EmptySection />
            ) : (
              majorTraumas.map(
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
                      value={
                        item.date
                      }
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
              )
            )}

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

            {icuAdmissions.length ===
            0 ? (
              <EmptySection />
            ) : (
              icuAdmissions.map(
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
                      value={
                        item.date
                      }
                    />

                    <Field
                      label="Duration"
                      value={
                        item.duration
                      }
                    />

                    <Field
                      label="Ventilator Support"
                      value={
                        item.ventilatorSupport
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
              )
            )}
          </View>
        </MajorSection>

        {/* Drug History */}
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
            <Text
              style={
                styles.subsectionTitle
              }
            >
              Current Medications
            </Text>

            {medications.length ===
            0 ? (
              <EmptySection />
            ) : (
              medications.map(
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

                    <Field
                      label="Duration"
                      value={
                        item.durationValue !=
                        null
                          ? `${item.durationValue} ${
                              formatEnum(
                                item.durationUnit,
                              )
                            }`
                          : null
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
              )
            )}

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
              Medication Compliance
            </Text>

            <Field
              label="Compliance"
              value={formatEnum(
                data.drugHistory
                  ?.medicationCompliance,
              )}
            />

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
              Self Medication
            </Text>

            <Field
              label="Self Medication"
              value={
                data.drugHistory
                  ?.selfMedication
              }
            />

            {data.drugHistory
              ?.selfMedicationDetails && (
              <Field
                label="Details"
                value={
                  data.drugHistory
                    .selfMedicationDetails
                }
              />
            )}

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
              Supplements
            </Text>

            <Field
              label="Takes Supplements"
              value={
                data.drugHistory
                  ?.takesSupplements
              }
            />

            {data.drugHistory
              ?.supplementDetails && (
              <Field
                label="Details"
                value={
                  data.drugHistory
                    .supplementDetails
                }
              />
            )}
          </View>
        </MajorSection>

        {/* Allergy History */}
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
            <Field
              label="Has Allergy"
              value={
                data.allergyHistory
                  ?.hasAllergy
              }
            />

            {allergies.length ===
            0 ? (
              <EmptySection />
            ) : (
              allergies.map(
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

                    <Field
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

                    <Field
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
              )
            )}
          </View>
        </MajorSection>

        {/* Family History */}
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
            {familyHistory.length ===
            0 ? (
              <EmptySection />
            ) : (
              familyHistory.map(
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

                    <Field
                      label="Diseases"
                      value={
                        item.diseases
                      }
                    />

                    <Field
                      label="Alive"
                      value={
                        item.alive
                      }
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
              )
            )}
          </View>
        </MajorSection>

        {/* Social History */}
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
            <Field
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

            <Field
              label="Alcohol"
              value={formatEnum(
                data.socialHistory
                  ?.alcohol,
              )}
            />

            <Field
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

            <Field
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

            <Field
              label="Substance Use"
              value={
                substanceUse
              }
            />

            <Field
              label="Substance Notes"
              value={
                data.socialHistory
                  ?.substanceNotes
              }
            />

            <Field
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

            <Field
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

            <Field
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

            <Field
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

        {/* Vaccination History */}
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
            <Field
              label="Vaccination Status"
              value={formatEnum(
                data.vaccinationHistory
                  ?.vaccinationStatus,
              )}
            />

            <Field
              label="Partial Reason"
              value={formatEnum(
                data.vaccinationHistory
                  ?.partialReason,
              )}
            />

            <Field
              label="Partial Other Details"
              value={
                data.vaccinationHistory
                  ?.partialOtherDetails
              }
            />

            <Field
              label="Unvaccinated Reason"
              value={formatEnum(
                data.vaccinationHistory
                  ?.unvaccinatedReason,
              )}
            />

            <Field
              label="Unvaccinated Other Details"
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

            <Field
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

            <Text
              style={
                styles.subsectionTitle
              }
            >
              Missed Vaccines
            </Text>

            {missedVaccines.length ===
            0 ? (
              <EmptySection />
            ) : (
              <View
                style={
                  styles.list
                }
              >
                {missedVaccines.map(
                  (
                    vaccine,
                    index,
                  ) => (
                    <View
                      key={`${vaccine}-${index}`}
                      style={
                        styles.listItem
                      }
                    >
                      <View
                        style={
                          styles.bullet
                        }
                      />

                      <Text
                        style={
                          styles.listItemText
                        }
                      >
                        {String(
                          vaccine,
                        )}
                      </Text>
                    </View>
                  ),
                )}
              </View>
            )}
          </View>
        </MajorSection>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    justifyContent:
      "center",
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

  patientCode: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

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

  field: {
    gap: 2,
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

  itemDivider: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: SPACING.sm,
  },

  emptyText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    paddingVertical: SPACING.xs,
  },

  list: {
    gap: SPACING.xs,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      COLORS.primary,
  },

  listItemText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },
});