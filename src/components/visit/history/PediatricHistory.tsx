import { useVisitStore } from "@/store/visitStore";
import { StyleSheet, Text, View } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import { PediatricHistory as PediatricHistoryType } from "@/models/VisitForm/history";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import usePediatricHistoryAutoSave from "@/hooks/usePediatricHistoryAutoSave";
export default function PediatricHistory() {
  const {
    visit,
    updatePediatricHistory,
  } = useVisitStore();
  
  usePediatricHistoryAutoSave({
    visitId: visit.metadata.id,
    pediatricHistory:
      visit.history.pediatricHistory,
  });

  const pediatricHistory =
    visit.history.pediatricHistory;

  const updateField = <
    K extends keyof PediatricHistoryType
  >(
    field: K,
    value: PediatricHistoryType[K]
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
    value: string
  ) => {
    const current =
      pediatricHistory[field] ?? [];

    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    updateField(field, updated);
  };

  const toggleStringArrayFieldWithNone = (
    field:
      | "maternalIllnesses"
      | "pregnancyComplications"
      | "birthComplications",
    value: string
  ) => {
    const current =
      pediatricHistory[field] ?? [];

    if (value === "None") {
      updateField(field, ["None"]);
      return;
    }

    let updated = current.filter(
      (item) => item !== "None"
    );

    if (updated.includes(value)) {
      updated = updated.filter(
        (item) => item !== value
      );
    } else {
      updated.push(value);
    }

    updateField(field, updated);
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Prenatal History" />

      <Text style={styles.label}>
        Antenatal Care
      </Text>

      <View style={styles.row}>
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
                item.value
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.antenatalCare ===
        "IRREGULAR" && (
        <AppTextField
          value={
            pediatricHistory.antenatalCareNotes
          }
          onChangeText={(v) =>
            updateField(
              "antenatalCareNotes",
              v
            )
          }
          placeholder="Antenatal Care Notes"
        />
      )}

      <Divider />

      <Text style={styles.label}>
        Maternal Illnesses
      </Text>

      <View style={styles.row}>
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
              item
            )}
            onPress={() =>
              toggleStringArrayFieldWithNone(
                "maternalIllnesses",
                item
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.maternalIllnesses.includes(
        "Other"
      ) && (
        <AppTextField
          value={
            pediatricHistory.maternalIllnessOther
          }
          onChangeText={(v) =>
            updateField(
              "maternalIllnessOther",
              v
            )
          }
          placeholder="Specify Other Illness"
        />
      )}

      <Divider />

      <Text style={styles.label}>
        Pregnancy Complications
      </Text>

      <View style={styles.row}>
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
              item
            )}
            onPress={() =>
              toggleStringArrayFieldWithNone(
                "pregnancyComplications",
                item
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.pregnancyComplications.includes(
        "Other"
      ) && (
        <AppTextField
          value={
            pediatricHistory.pregnancyComplicationsOther
          }
          onChangeText={(v) =>
            updateField(
              "pregnancyComplicationsOther",
              v
            )
          }
          placeholder="Specify Other Complication"
        />
      )}

      <Divider />

      <Text style={styles.label}>
        Drug Intake During Pregnancy
      </Text>

      <View style={styles.row}>
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
                item === "Yes"
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.drugIntake === true && (
        <AppTextField
          value={
            pediatricHistory.drugIntakeDetails
          }
          onChangeText={(v) =>
            updateField(
              "drugIntakeDetails",
              v
            )
          }
          placeholder="Drug Details"
        />
      )}

      <Divider />

      <Text style={styles.label}>
        Smoking Exposure
      </Text>

      <View style={styles.row}>
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
            value: "MATERNAL_SMOKING" as const,
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
                item.value
              )
            }
          />
        ))}
      </View>

      <Divider />

      <Text style={styles.label}>
        Alcohol Exposure
      </Text>

      <View style={styles.row}>
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
                item === "Yes"
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.alcoholExposure ===
        true && (
        <AppTextField
          value={
            pediatricHistory.alcoholExposureDetails
          }
          onChangeText={(v) =>
            updateField(
              "alcoholExposureDetails",
              v
            )
          }
          placeholder="Alcohol Exposure Details"
        />
      )}

      <Divider />

      {/* =========================
          Birth History
      ========================= */}

      <SectionHeader title="Birth History" />

      <Text style={styles.label}>
        Gestational Age
      </Text>

      <View style={styles.row}>
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
                item.value
              )
            }
          />
        ))}
      </View>

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
                : Number(v)
            )
          }
          placeholder="Gestational Age (Weeks)"
          keyboardType="numeric"
        />
      )}

      <Divider />

      <Text style={styles.label}>
        Delivery Mode
      </Text>

      <View style={styles.row}>
        {[
          {
            label: "Normal Vaginal",
            value: "NORMAL_VAGINAL" as const,
          },
          {
            label: "Cesarean",
            value: "CESAREAN" as const,
          },
          {
            label: "Instrumental",
            value: "INSTRUMENTAL" as const,
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
                item.value
              )
            }
          />
        ))}
      </View>

      <Divider />

      <Text style={styles.label}>
        Birth Weight (g)
      </Text>

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
              : Number(v)
          )
        }
        placeholder="Birth Weight (g)"
        keyboardType="numeric"
      />

      <Divider />

      <SectionHeader title="NICU Admission" />

      <View style={styles.row}>
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
                item === "Yes"
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.nicuAdmission ===
        true && (
        <View style={styles.box}>
          <AppTextField
            value={
              pediatricHistory.nicuReason
            }
            onChangeText={(v) =>
              updateField(
                "nicuReason",
                v
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
                  : Number(v)
              )
            }
            placeholder="NICU Duration (days)"
            keyboardType="numeric"
          />
        </View>
      )}

      <Divider />

      <SectionHeader title="Birth Complications" />

      <View style={styles.row}>
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
              item
            )}
            onPress={() =>
              toggleStringArrayFieldWithNone(
                "birthComplications",
                item
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.birthComplications.includes(
        "Other"
      ) && (
        <AppTextField
          value={
            pediatricHistory.birthComplicationDetails
          }
          onChangeText={(v) =>
            updateField(
              "birthComplicationDetails",
              v
            )
          }
          placeholder="Specify Birth Complication"
        />
      )}

      <Divider />

      {/* =========================
          Neonatal History
      ========================= */}

      <SectionHeader title="Neonatal History" />

      <Text style={styles.label}>
        Neonatal Jaundice
      </Text>

      <View style={styles.row}>
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
                item === "Yes"
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.neonatalJaundice ===
        true && (
        <>
          <Divider />

          <Text style={styles.label}>
            Phototherapy
          </Text>

          <View style={styles.row}>
            {["No", "Yes"].map((item) => (
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
                    item === "Yes"
                  )
                }
              />
            ))}
          </View>

          <Divider />

          <Text style={styles.label}>
            Exchange Transfusion
          </Text>

          <View style={styles.row}>
            {["No", "Yes"].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  pediatricHistory.exchangeTransfusion ===
                  (item === "Yes")
                }
                onPress={() =>
                  updateField(
                    "exchangeTransfusion",
                    item === "Yes"
                  )
                }
              />
            ))}
          </View>
        </>
      )}

      <Divider />

      <Text style={styles.label}>
        Neonatal Seizures
      </Text>

      <View style={styles.row}>
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
                item === "Yes"
              )
            }
          />
        ))}
      </View>

      <Divider />

      {/* =========================
          Feeding History
      ========================= */}

      <SectionHeader title="Feeding History" />

      <Text style={styles.label}>
        Feeding Type
      </Text>

      <View style={styles.row}>
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
              item
            )}
            onPress={() =>
              toggleStringArrayField(
                "feedingTypes",
                item
              )
            }
          />
        ))}
      </View>

      <Divider />

      {/* =========================
          Developmental History
      ========================= */}

      <SectionHeader title="Developmental History" />

      <View style={styles.row}>
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
                item.value
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.development ===
        "DELAYED" && (
        <View style={styles.box}>
          <Text style={styles.label}>
            Delay Type
          </Text>

          <View style={styles.row}>
            {[
              {
                label: "Gross Motor",
                value: "GROSS_MOTOR" as const,
              },
              {
                label: "Fine Motor",
                value: "FINE_MOTOR" as const,
              },
              {
                label: "Speech",
                value: "SPEECH" as const,
              },
              {
                label: "Social",
                value: "SOCIAL" as const,
              },
              {
                label: "Multiple",
                value: "MULTIPLE" as const,
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
                    item.value
                  )
                }
              />
            ))}
          </View>

          <AppTextField
            value={
              pediatricHistory.delayDetails
            }
            onChangeText={(v) =>
              updateField(
                "delayDetails",
                v
              )
            }
            placeholder="Delay Details"
          />
        </View>
      )}

      <Divider />

      {/* =========================
          School History
      ========================= */}

      <SectionHeader title="School History" />

      <Text style={styles.label}>
        Attends School
      </Text>

      <View style={styles.row}>
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
                item === "Yes"
              )
            }
          />
        ))}
      </View>

      {pediatricHistory.attendsSchool ===
        true && (
        <View style={styles.box}>
          <AppTextField
            value={
              pediatricHistory.grade
            }
            onChangeText={(v) =>
              updateField(
                "grade",
                v
              )
            }
            placeholder="School Grade"
          />

          <Text style={styles.label}>
            School Performance
          </Text>

          <View style={styles.row}>
            {[
              {
                label: "Good",
                value: "GOOD" as const,
              },
              {
                label: "Average",
                value: "AVERAGE" as const,
              },
              {
                label: "Poor",
                value: "POOR" as const,
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
                    item.value
                  )
                }
              />
            ))}
          </View>

          {pediatricHistory.schoolPerformance ===
            "POOR" && (
            <AppTextField
              value={
                pediatricHistory.schoolPerformanceDetails
              }
              onChangeText={(v) =>
                updateField(
                  "schoolPerformanceDetails",
                  v
                )
              }
              placeholder="Performance Details"
            />
          )}

          <Text style={styles.label}>
            School Attendance
          </Text>

          <View style={styles.row}>
            {[
              {
                label: "Regular",
                value: "REGULAR" as const,
              },
              {
                label: "Irregular",
                value: "IRREGULAR" as const,
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
                    item.value
                  )
                }
              />
            ))}
          </View>

          {pediatricHistory.schoolAttendance ===
            "IRREGULAR" && (
            <AppTextField
              value={
                pediatricHistory.schoolAttendanceReason
              }
              onChangeText={(v) =>
                updateField(
                  "schoolAttendanceReason",
                  v
                )
              }
              placeholder="Reason"
            />
          )}
        </View>
      )}
    </View>
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