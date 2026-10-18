import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import {
  PediatricHistory as PediatricHistoryType,
} from "@/models/VisitForm/history";

import { useVisitStore } from "@/store/visitStore";

import {
  getPediatricHistory,
} from "@/services/visitApi";

import usePediatricHistoryAutoSave, {
  mapPediatricHistoryFromBackend,
} from "@/hooks/usePediatricHistoryAutoSave";

export default function PediatricHistory() {
  const {
    visit,
    updatePediatricHistory,
  } = useVisitStore();

  const [isHydrating, setIsHydrating] =
    useState(false);

  const loadedVisitId =
    useRef<string | null>(null);

  const pediatricHistory =
    visit.history.pediatricHistory;

  const {
    markHydrated,
  } =
    usePediatricHistoryAutoSave({
      visitId:
        visit.metadata.id,
      pediatricHistory:
        pediatricHistory,
    });

  /*
   * Load pediatric history from backend
   * once for the current visit.
   */
  useEffect(() => {
    const visitId =
      visit.metadata.id;

    if (!visitId) {
      return;
    }

    /*
     * Prevent loading the same visit repeatedly
     * while this component remains mounted.
     */
    if (
      loadedVisitId.current ===
      visitId
    ) {
      return;
    }

    let cancelled = false;

    const loadPediatricHistory =
      async () => {
        try {
          setIsHydrating(true);

          const data =
            await getPediatricHistory(
              visitId,
            );

          if (cancelled) {
            return;
          }

          /*
           * No pediatric history has been
           * saved yet for this visit.
           */
          if (!data) {
            loadedVisitId.current =
              visitId;

            return;
          }

          const mappedHistory =
            mapPediatricHistoryFromBackend(
              data,
            );

          /*
           * Update the complete pediatric
           * history in Zustand.
           */
          updatePediatricHistory(
            mappedHistory,
          );

          /*
           * Tell the autosave hook that this
           * exact state came from the backend.
           *
           * This prevents an unnecessary save
           * immediately after hydration.
           */
          markHydrated(
            mappedHistory,
          );

          loadedVisitId.current =
            visitId;
        } catch (error: any) {
          console.error(
            "PEDIATRIC HISTORY LOAD FAILED:",
            error?.response?.data ??
              error,
          );
        } finally {
          if (!cancelled) {
            setIsHydrating(false);
          }
        }
      };

    loadPediatricHistory();

    return () => {
      cancelled = true;
    };
  }, [
    visit.metadata.id,
    updatePediatricHistory,
    markHydrated,
  ]);

  const updateField = <
    K extends keyof PediatricHistoryType
  >(
    field: K,
    value: PediatricHistoryType[K],
  ) => {
    updatePediatricHistory({
      [field]: value,
    });
  };

  const toggleStringArrayField = (
    field:
      | "maternalIllnesses"
      | "pregnancyComplications"
      | "birthComplications"
      | "feedingTypes",
    value: string,
  ) => {
    const current =
      pediatricHistory[field] ??
      [];

    const updated =
      current.includes(value)
        ? current.filter(
            (item) =>
              item !== value,
          )
        : [
            ...current,
            value,
          ];

    updateField(
      field,
      updated,
    );
  };

  const toggleStringArrayFieldWithNone = (
    field:
      | "maternalIllnesses"
      | "pregnancyComplications"
      | "birthComplications",
    value: string,
  ) => {
    const current =
      pediatricHistory[field] ??
      [];

    if (value === "None") {
      updateField(
        field,
        ["None"],
      );

      return;
    }

    let updated =
      current.filter(
        (item) =>
          item !== "None",
      );

    if (
      updated.includes(value)
    ) {
      updated =
        updated.filter(
          (item) =>
            item !== value,
        );
    } else {
      updated.push(value);
    }

    updateField(
      field,
      updated,
    );
  };

  /*
   * Keep the component rendering the same UI.
   *
   * `isHydrating` is intentionally not used
   * to hide the form.
   */
  return (
    <AppView style={styles.container}>
      <SectionHeader title="Prenatal History" />

      <AppText style={styles.label}>
        Antenatal Care
      </AppText>

      <AppView style={styles.row}>
        {[
          {
            label: "Regular",
            value: "REGULAR" as const,
          },
          {
            label: "Irregular",
            value: "IRREGULAR" as const,
          },
          {
            label: "None",
            value: "NONE" as const,
          },
          {
            label: "Unknown",
            value: "UNKNOWN" as const,
          },
        ].map((item) => (
          <AppChip
            key={item.value}
            label={item.label}
            selected={
              pediatricHistory.antenatalCare ===
              item.value
            }
            onPress={() =>
              updateField(
                "antenatalCare",
                item.value,
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.antenatalCare ===
        "IRREGULAR" && (
        <AppTextField
          value={
            pediatricHistory.antenatalCareNotes
          }
          onChangeText={(v) =>
            updateField(
              "antenatalCareNotes",
              v,
            )
          }
          placeholder="Antenatal Care Notes"
        />
      )}

      <Divider />

      <AppText style={styles.label}>
        Maternal Illnesses
      </AppText>

      <AppView style={styles.row}>
        {[
          "None",
          "Diabetes",
          "Hypertension",
          "Thyroid Disease",
          "Infection",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={pediatricHistory.maternalIllnesses.includes(
              item,
            )}
            onPress={() =>
              toggleStringArrayFieldWithNone(
                "maternalIllnesses",
                item,
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.maternalIllnesses.includes(
        "Other",
      ) && (
        <AppTextField
          value={
            pediatricHistory.maternalIllnessOther
          }
          onChangeText={(v) =>
            updateField(
              "maternalIllnessOther",
              v,
            )
          }
          placeholder="Specify Other Illness"
        />
      )}

      <Divider />

      <AppText style={styles.label}>
        Pregnancy Complications
      </AppText>

      <AppView style={styles.row}>
        {[
          "PIH",
          "GDM",
          "PROM",
          "Oligohydramnios",
          "Polyhydramnios",
          "Bleeding",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={pediatricHistory.pregnancyComplications.includes(
              item,
            )}
            onPress={() =>
              toggleStringArrayFieldWithNone(
                "pregnancyComplications",
                item,
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.pregnancyComplications.includes(
        "Other",
      ) && (
        <AppTextField
          value={
            pediatricHistory.pregnancyComplicationsOther
          }
          onChangeText={(v) =>
            updateField(
              "pregnancyComplicationsOther",
              v,
            )
          }
          placeholder="Specify Other Complication"
        />
      )}

      <Divider />

      <AppText style={styles.label}>
        Drug Intake During Pregnancy
      </AppText>

      <AppView style={styles.row}>
        {["No", "Yes"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              pediatricHistory.drugIntake ===
              (item === "Yes")
            }
            onPress={() =>
              updateField(
                "drugIntake",
                item === "Yes",
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.drugIntake ===
        true && (
        <AppTextField
          value={
            pediatricHistory.drugIntakeDetails
          }
          onChangeText={(v) =>
            updateField(
              "drugIntakeDetails",
              v,
            )
          }
          placeholder="Drug Details"
        />
      )}

      <Divider />

      <AppText style={styles.label}>
        Smoking Exposure
      </AppText>

      <AppView style={styles.row}>
        {[
          {
            label: "No",
            value: "NO" as const,
          },
          {
            label: "Passive",
            value: "PASSIVE" as const,
          },
          {
            label: "Maternal Smoking",
            value:
              "MATERNAL_SMOKING" as const,
          },
        ].map((item) => (
          <AppChip
            key={item.value}
            label={item.label}
            selected={
              pediatricHistory.smokingExposure ===
              item.value
            }
            onPress={() =>
              updateField(
                "smokingExposure",
                item.value,
              )
            }
          />
        ))}
      </AppView>

      <Divider />

      <AppText style={styles.label}>
        Alcohol Exposure
      </AppText>

      <AppView style={styles.row}>
        {["No", "Yes"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              pediatricHistory.alcoholExposure ===
              (item === "Yes")
            }
            onPress={() =>
              updateField(
                "alcoholExposure",
                item === "Yes",
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.alcoholExposure ===
        true && (
        <AppTextField
          value={
            pediatricHistory.alcoholExposureDetails
          }
          onChangeText={(v) =>
            updateField(
              "alcoholExposureDetails",
              v,
            )
          }
          placeholder="Alcohol Exposure Details"
        />
      )}

      <Divider />

      <SectionHeader title="Birth History" />

      <AppText style={styles.label}>
        Gestational Age
      </AppText>

      <AppView style={styles.row}>
        {[
          {
            label: "Term",
            value: "TERM" as const,
          },
          {
            label: "Preterm",
            value: "PRETERM" as const,
          },
          {
            label: "Post-term",
            value: "POST_TERM" as const,
          },
          {
            label: "Unknown",
            value: "UNKNOWN" as const,
          },
        ].map((item) => (
          <AppChip
            key={item.value}
            label={item.label}
            selected={
              pediatricHistory.gestationalAge ===
              item.value
            }
            onPress={() =>
              updateField(
                "gestationalAge",
                item.value,
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.gestationalAge ===
        "PRETERM" && (
        <AppTextField
          value={
            pediatricHistory.gestationalWeeks?.toString() ??
            ""
          }
          onChangeText={(v) =>
            updateField(
              "gestationalWeeks",
              v === ""
                ? undefined
                : Number(v),
            )
          }
          placeholder="Gestational Age (Weeks)"
          keyboardType="numeric"
        />
      )}

      <Divider />

      <AppText style={styles.label}>
        Delivery Mode
      </AppText>

      <AppView style={styles.row}>
        {[
          {
            label: "Normal Vaginal",
            value:
              "NORMAL_VAGINAL" as const,
          },
          {
            label: "Cesarean",
            value:
              "CESAREAN" as const,
          },
          {
            label: "Instrumental",
            value:
              "INSTRUMENTAL" as const,
          },
          {
            label: "Unknown",
            value: "UNKNOWN" as const,
          },
        ].map((item) => (
          <AppChip
            key={item.value}
            label={item.label}
            selected={
              pediatricHistory.deliveryMode ===
              item.value
            }
            onPress={() =>
              updateField(
                "deliveryMode",
                item.value,
              )
            }
          />
        ))}
      </AppView>

      <Divider />

      <AppText style={styles.label}>
        Birth Weight (g)
      </AppText>

      <AppTextField
        value={
          pediatricHistory.birthWeight?.toString() ??
          ""
        }
        onChangeText={(v) =>
          updateField(
            "birthWeight",
            v === ""
              ? undefined
              : Number(v),
          )
        }
        placeholder="Birth Weight (g)"
        keyboardType="numeric"
      />

      <Divider />

      <SectionHeader title="NICU Admission" />

      <AppView style={styles.row}>
        {["No", "Yes"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              pediatricHistory.nicuAdmission ===
              (item === "Yes")
            }
            onPress={() =>
              updateField(
                "nicuAdmission",
                item === "Yes",
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.nicuAdmission ===
        true && (
        <AppView style={styles.box}>
          <AppTextField
            value={
              pediatricHistory.nicuReason
            }
            onChangeText={(v) =>
              updateField(
                "nicuReason",
                v,
              )
            }
            placeholder="Reason for NICU Admission"
          />

          <AppTextField
            value={
              pediatricHistory.nicuDuration?.toString() ??
              ""
            }
            onChangeText={(v) =>
              updateField(
                "nicuDuration",
                v === ""
                  ? undefined
                  : Number(v),
              )
            }
            placeholder="NICU Duration (days)"
            keyboardType="numeric"
          />
        </AppView>
      )}

      <Divider />

      <SectionHeader title="Birth Complications" />

      <AppView style={styles.row}>
        {[
          "None",
          "Birth Asphyxia",
          "Meconium Aspiration",
          "Birth Trauma",
          "Neonatal Sepsis",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={pediatricHistory.birthComplications.includes(
              item,
            )}
            onPress={() =>
              toggleStringArrayFieldWithNone(
                "birthComplications",
                item,
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.birthComplications.includes(
        "Other",
      ) && (
        <AppTextField
          value={
            pediatricHistory.birthComplicationDetails
          }
          onChangeText={(v) =>
            updateField(
              "birthComplicationDetails",
              v,
            )
          }
          placeholder="Specify Birth Complication"
        />
      )}

      <Divider />

      <SectionHeader title="Neonatal History" />

      <AppText style={styles.label}>
        Neonatal Jaundice
      </AppText>

      <AppView style={styles.row}>
        {["No", "Yes"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              pediatricHistory.neonatalJaundice ===
              (item === "Yes")
            }
            onPress={() =>
              updateField(
                "neonatalJaundice",
                item === "Yes",
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.neonatalJaundice ===
        true && (
        <>
          <Divider />

          <AppText style={styles.label}>
            Phototherapy
          </AppText>

          <AppView style={styles.row}>
            {["No", "Yes"].map(
              (item) => (
                <AppChip
                  key={item}
                  label={item}
                  selected={
                    pediatricHistory.phototherapy ===
                    (item === "Yes")
                  }
                  onPress={() =>
                    updateField(
                      "phototherapy",
                      item ===
                        "Yes",
                    )
                  }
                />
              ),
            )}
          </AppView>

          <Divider />

          <AppText style={styles.label}>
            Exchange Transfusion
          </AppText>

          <AppView style={styles.row}>
            {["No", "Yes"].map(
              (item) => (
                <AppChip
                  key={item}
                  label={item}
                  selected={
                    pediatricHistory.exchangeTransfusion ===
                    (item ===
                      "Yes")
                  }
                  onPress={() =>
                    updateField(
                      "exchangeTransfusion",
                      item ===
                        "Yes",
                    )
                  }
                />
              ),
            )}
          </AppView>
        </>
      )}

      <Divider />

      <AppText style={styles.label}>
        Neonatal Seizures
      </AppText>

      <AppView style={styles.row}>
        {["No", "Yes"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              pediatricHistory.neonatalSeizures ===
              (item === "Yes")
            }
            onPress={() =>
              updateField(
                "neonatalSeizures",
                item === "Yes",
              )
            }
          />
        ))}
      </AppView>

      <Divider />

      <SectionHeader title="Feeding History" />

      <AppText style={styles.label}>
        Feeding Type
      </AppText>

      <AppView style={styles.row}>
        {[
          "Breastfeeding",
          "Formula Feeding",
          "Mixed Feeding",
          "Solid Food",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={pediatricHistory.feedingTypes.includes(
              item,
            )}
            onPress={() =>
              toggleStringArrayField(
                "feedingTypes",
                item,
              )
            }
          />
        ))}
      </AppView>

      <Divider />

      <SectionHeader title="Developmental History" />

      <AppView style={styles.row}>
        {[
          {
            label: "Normal",
            value: "NORMAL" as const,
          },
          {
            label: "Delayed",
            value: "DELAYED" as const,
          },
          {
            label: "Unknown",
            value: "UNKNOWN" as const,
          },
        ].map((item) => (
          <AppChip
            key={item.value}
            label={item.label}
            selected={
              pediatricHistory.development ===
              item.value
            }
            onPress={() =>
              updateField(
                "development",
                item.value,
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.development ===
        "DELAYED" && (
        <AppView style={styles.box}>
          <AppText style={styles.label}>
            Delay Type
          </AppText>

          <AppView style={styles.row}>
            {[
              {
                label: "Gross Motor",
                value:
                  "GROSS_MOTOR" as const,
              },
              {
                label: "Fine Motor",
                value:
                  "FINE_MOTOR" as const,
              },
              {
                label: "Speech",
                value:
                  "SPEECH" as const,
              },
              {
                label: "Social",
                value:
                  "SOCIAL" as const,
              },
              {
                label: "Multiple",
                value:
                  "MULTIPLE" as const,
              },
            ].map((item) => (
              <AppChip
                key={item.value}
                label={item.label}
                selected={
                  pediatricHistory.delayType ===
                  item.value
                }
                onPress={() =>
                  updateField(
                    "delayType",
                    item.value,
                  )
                }
              />
            ))}
          </AppView>

          <AppTextField
            value={
              pediatricHistory.delayDetails
            }
            onChangeText={(v) =>
              updateField(
                "delayDetails",
                v,
              )
            }
            placeholder="Delay Details"
          />
        </AppView>
      )}

      <Divider />

      <SectionHeader title="School History" />

      <AppText style={styles.label}>
        Attends School
      </AppText>

      <AppView style={styles.row}>
        {["Yes", "No"].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              pediatricHistory.attendsSchool ===
              (item === "Yes")
            }
            onPress={() =>
              updateField(
                "attendsSchool",
                item === "Yes",
              )
            }
          />
        ))}
      </AppView>

      {pediatricHistory.attendsSchool ===
        true && (
        <AppView style={styles.box}>
          <AppTextField
            value={
              pediatricHistory.grade
            }
            onChangeText={(v) =>
              updateField(
                "grade",
                v,
              )
            }
            placeholder="School Grade"
          />

          <AppText style={styles.label}>
            School Performance
          </AppText>

          <AppView style={styles.row}>
            {[
              {
                label: "Good",
                value:
                  "GOOD" as const,
              },
              {
                label: "Average",
                value:
                  "AVERAGE" as const,
              },
              {
                label: "Poor",
                value:
                  "POOR" as const,
              },
            ].map((item) => (
              <AppChip
                key={item.value}
                label={item.label}
                selected={
                  pediatricHistory.schoolPerformance ===
                  item.value
                }
                onPress={() =>
                  updateField(
                    "schoolPerformance",
                    item.value,
                  )
                }
              />
            ))}
          </AppView>

          {pediatricHistory.schoolPerformance ===
            "POOR" && (
            <AppTextField
              value={
                pediatricHistory.schoolPerformanceDetails
              }
              onChangeText={(v) =>
                updateField(
                  "schoolPerformanceDetails",
                  v,
                )
              }
              placeholder="Performance Details"
            />
          )}

          <AppText style={styles.label}>
            School Attendance
          </AppText>

          <AppView style={styles.row}>
            {[
              {
                label: "Regular",
                value:
                  "REGULAR" as const,
              },
              {
                label: "Irregular",
                value:
                  "IRREGULAR" as const,
              },
            ].map((item) => (
              <AppChip
                key={item.value}
                label={item.label}
                selected={
                  pediatricHistory.schoolAttendance ===
                  item.value
                }
                onPress={() =>
                  updateField(
                    "schoolAttendance",
                    item.value,
                  )
                }
              />
            ))}
          </AppView>

          {pediatricHistory.schoolAttendance ===
            "IRREGULAR" && (
            <AppTextField
              value={
                pediatricHistory.schoolAttendanceReason
              }
              onChangeText={(v) =>
                updateField(
                  "schoolAttendanceReason",
                  v,
                )
              }
              placeholder="Reason"
            />
          )}
        </AppView>
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  box: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },
  sectionTitle: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },
});