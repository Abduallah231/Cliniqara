import { useVisitStore } from "@/store/visitStore";
import { StyleSheet, Text, View } from "react-native";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type PediatricSection =
  | "prenatalHistory"
  | "birthHistory"
  | "neonatalHistory"
  | "feedingHistory"
  | "developmentHistory"
  | "schoolHistory";

export default function PediatricHistory() {
  const { visit, updatePediatricField } =
    useVisitStore();

  const updateField = (
    section: PediatricSection,
    fieldId: string,
    fieldLabel: string,
    value: any
  ) => {
    updatePediatricField(
      section,
      fieldId,
      fieldLabel,
      value
    );
  };

  const getValue = (
    section: PediatricSection,
    fieldId: string
  ) => {
    const fields =
      visit.history.pediatricHistory[
        section
      ];

    return (
      fields.find(
        (field) =>
          field.fieldId === fieldId
      )?.value ?? null
    );
  };

  const prenatalValue = (
    fieldId: string
  ) => getValue("prenatalHistory", fieldId);

  const birthValue = (
    fieldId: string
  ) => getValue("birthHistory", fieldId);

  const neonatalValue = (
    fieldId: string
  ) => getValue("neonatalHistory", fieldId);

  const feedingValue = (
    fieldId: string
  ) => getValue("feedingHistory", fieldId);

  const developmentValue = (
    fieldId: string
  ) =>
    getValue(
      "developmentHistory",
      fieldId
    );

  const schoolValue = (
    fieldId: string
  ) => getValue("schoolHistory", fieldId);

  const toggleMultiSelect = (
    section: PediatricSection,
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    const current =
      (getValue(
        section,
        fieldId
      ) as string[]) ?? [];

    const updated = current.includes(value)
      ? current.filter(
          (x) => x !== value
        )
      : [...current, value];

    updatePediatricField(
      section,
      fieldId,
      fieldLabel,
      updated
    );
  };

  const toggleMultiSelectWithNone = (
    section: PediatricSection,
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    const current =
      (getValue(
        section,
        fieldId
      ) as string[]) ?? [];

    if (value === "None") {
      updatePediatricField(
        section,
        fieldId,
        fieldLabel,
        ["None"]
      );
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

    updatePediatricField(
      section,
      fieldId,
      fieldLabel,
      updated
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Prenatal History" />

      <Text style={styles.label}>
        Antenatal Care
      </Text>

      <View style={styles.row}>
        {[
          "Regular",
          "Irregular",
          "None",
          "Unknown",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              prenatalValue(
                "antenatalCare"
              ) === item
            }
            onPress={() =>
              updateField(
                "prenatalHistory",
                "antenatalCare",
                "Antenatal Care",
                item
              )
            }
          />
        ))}
      </View>

      {prenatalValue(
        "antenatalCare"
      ) === "Irregular" && (
        <AppTextField
          value={
            (prenatalValue(
              "antenatalCareNotes"
            ) as string) ?? ""
          }
          onChangeText={(v) =>
            updateField(
              "prenatalHistory",
              "antenatalCareNotes",
              "Antenatal Care Notes",
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
            selected={
              (
                (prenatalValue(
                  "maternalIllnesses"
                ) as string[]) ?? []
              ).includes(item)
            }
            onPress={() =>
              toggleMultiSelectWithNone(
                "prenatalHistory",
                "maternalIllnesses",
                "Maternal Illnesses",
                item
              )
            }
          />
        ))}
      </View>

      {(
        (prenatalValue(
          "maternalIllnesses"
        ) as string[]) ?? []
      ).includes("Other") && (
        <AppTextField
          value={
            (prenatalValue(
              "maternalIllnessOther"
            ) as string) ?? ""
          }
          onChangeText={(v) =>
            updateField(
              "prenatalHistory",
              "maternalIllnessOther",
              "Maternal Illness Other",
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
            selected={
              (
                (prenatalValue(
                  "pregnancyComplications"
                ) as string[]) ?? []
              ).includes(item)
            }
            onPress={() =>
              toggleMultiSelectWithNone(
                "prenatalHistory",
                "pregnancyComplications",
                "Pregnancy Complications",
                item
              )
            }
          />
        ))}
      </View>

      {(
        (prenatalValue(
          "pregnancyComplications"
        ) as string[]) ?? []
      ).includes("Other") && (
        <AppTextField
          value={
            (prenatalValue(
              "pregnancyComplicationsOther"
            ) as string) ?? ""
          }
          onChangeText={(v) =>
            updateField(
              "prenatalHistory",
              "pregnancyComplicationsOther",
              "Pregnancy Complications Other",
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
              prenatalValue("drugIntake") ===
              item
            }
            onPress={() =>
              updateField(
                "prenatalHistory",
                "drugIntake",
                "Drug Intake",
                item
              )
            }
          />
        ))}
      </View>

      {prenatalValue("drugIntake") ===
        "Yes" && (
        <AppTextField
          value={
            (prenatalValue(
              "drugIntakeDetails"
            ) as string) ?? ""
          }
          onChangeText={(v) =>
            updateField(
              "prenatalHistory",
              "drugIntakeDetails",
              "Drug Intake Details",
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
          "No",
          "Passive",
          "Maternal Smoking",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              prenatalValue(
                "smokingExposure"
              ) === item
            }
            onPress={() =>
              updateField(
                "prenatalHistory",
                "smokingExposure",
                "Smoking Exposure",
                item
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
              prenatalValue(
                "alcoholExposure"
              ) === item
            }
            onPress={() =>
              updateField(
                "prenatalHistory",
                "alcoholExposure",
                "Alcohol Exposure",
                item
              )
            }
          />
        ))}
      </View>

      {prenatalValue(
        "alcoholExposure"
      ) === "Yes" && (
        <AppTextField
          value={
            (prenatalValue(
              "alcoholExposureDetails"
            ) as string) ?? ""
          }
          onChangeText={(v) =>
            updateField(
              "prenatalHistory",
              "alcoholExposureDetails",
              "Alcohol Exposure Details",
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
          "Term",
          "Preterm",
          "Post-term",
          "Unknown",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              birthValue(
                "gestationalAge"
              ) === item
            }
            onPress={() =>
              updateField(
                "birthHistory",
                "gestationalAge",
                "Gestational Age",
                item
              )
            }
          />
        ))}
      </View>

      {birthValue("gestationalAge") ===
        "Preterm" && (
        <AppTextField
          value={
            (birthValue(
              "gestationalWeeks"
            ) as string) ?? ""
          }
          onChangeText={(v) =>
            updateField(
              "birthHistory",
              "gestationalWeeks",
              "Gestational Weeks",
              v
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
          "Normal Vaginal",
          "Cesarean",
          "Instrumental",
          "Unknown",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              birthValue(
                "deliveryMode"
              ) === item
            }
            onPress={() =>
              updateField(
                "birthHistory",
                "deliveryMode",
                "Delivery Mode",
                item
              )
            }
          />
        ))}
      </View>

      <Divider />

      <Text style={styles.label}>
        Birth Weight
      </Text>

      <AppTextField
        value={
          (birthValue(
            "birthWeight"
          ) as string) ?? ""
        }
        onChangeText={(v) =>
          updateField(
            "birthHistory",
            "birthWeight",
            "Birth Weight",
            v
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
              birthValue("nicuAdmission") ===
              item
            }
            onPress={() =>
              updateField(
                "birthHistory",
                "nicuAdmission",
                "NICU Admission",
                item
              )
            }
          />
        ))}
      </View>

      {birthValue("nicuAdmission") ===
        "Yes" && (
        <View style={styles.box}>
          <AppTextField
            value={
              (birthValue(
                "nicuReason"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "birthHistory",
                "nicuReason",
                "NICU Reason",
                v
              )
            }
            placeholder="Reason for NICU Admission"
          />

          <AppTextField
            value={
              (birthValue(
                "nicuDuration"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "birthHistory",
                "nicuDuration",
                "NICU Duration",
                v
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
            selected={
              (
                (birthValue(
                  "birthComplications"
                ) as string[]) ?? []
              ).includes(item)
            }
            onPress={() =>
              toggleMultiSelectWithNone(
                "birthHistory",
                "birthComplications",
                "Birth Complications",
                item
              )
            }
          />
        ))}
      </View>

      {(
        (birthValue(
          "birthComplications"
        ) as string[]) ?? []
      ).includes("Other") && (
        <AppTextField
          value={
            (birthValue(
              "birthComplicationDetails"
            ) as string) ?? ""
          }
          onChangeText={(v) =>
            updateField(
              "birthHistory",
              "birthComplicationDetails",
              "Birth Complication Details",
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
              neonatalValue(
                "neonatalJaundice"
              ) === item
            }
            onPress={() =>
              updateField(
                "neonatalHistory",
                "neonatalJaundice",
                "Neonatal Jaundice",
                item
              )
            }
          />
        ))}
      </View>

      {neonatalValue(
        "neonatalJaundice"
      ) === "Yes" && (
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
                  neonatalValue(
                    "phototherapy"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "neonatalHistory",
                    "phototherapy",
                    "Phototherapy",
                    item
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
                  neonatalValue(
                    "exchangeTransfusion"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "neonatalHistory",
                    "exchangeTransfusion",
                    "Exchange Transfusion",
                    item
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
              neonatalValue(
                "neonatalSeizures"
              ) === item
            }
            onPress={() =>
              updateField(
                "neonatalHistory",
                "neonatalSeizures",
                "Neonatal Seizures",
                item
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
          "Exclusive Breastfeeding",
          "Formula Feeding",
          "Mixed Feeding",
          "Solid Food",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              (
                (feedingValue(
                  "feeding"
                ) as string[]) ?? []
              ).includes(item)
            }
            onPress={() =>
              toggleMultiSelect(
                "feedingHistory",
                "feeding",
                "Feeding Type",
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
          "Normal",
          "Delayed",
          "Unknown",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              developmentValue(
                "development"
              ) === item
            }
            onPress={() =>
              updateField(
                "developmentHistory",
                "development",
                "Development",
                item
              )
            }
          />
        ))}
      </View>

      {developmentValue(
        "development"
      ) === "Delayed" && (
        <View style={styles.box}>
          <Text style={styles.label}>
            Delay Type
          </Text>

          <View style={styles.row}>
            {[
              "Gross Motor",
              "Fine Motor",
              "Speech",
              "Social",
              "Multiple",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  developmentValue(
                    "delayType"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "developmentHistory",
                    "delayType",
                    "Delay Type",
                    item
                  )
                }
              />
            ))}
          </View>

          <AppTextField
            value={
              (developmentValue(
                "delayDetails"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "developmentHistory",
                "delayDetails",
                "Delay Details",
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
              schoolValue(
                "attendsSchool"
              ) === item
            }
            onPress={() =>
              updateField(
                "schoolHistory",
                "attendsSchool",
                "Attends School",
                item
              )
            }
          />
        ))}
      </View>

      {schoolValue(
        "attendsSchool"
      ) === "Yes" && (
        <View style={styles.box}>
          <AppTextField
            value={
              (schoolValue(
                "grade"
              ) as string) ?? ""
            }
            onChangeText={(v) =>
              updateField(
                "schoolHistory",
                "grade",
                "Grade",
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
              "Good",
              "Average",
              "Poor",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  schoolValue(
                    "schoolPerformance"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "schoolHistory",
                    "schoolPerformance",
                    "School Performance",
                    item
                  )
                }
              />
            ))}
          </View>

          {schoolValue(
            "schoolPerformance"
          ) === "Poor" && (
            <AppTextField
              value={
                (schoolValue(
                  "schoolPerformanceDetails"
                ) as string) ?? ""
              }
              onChangeText={(v) =>
                updateField(
                  "schoolHistory",
                  "schoolPerformanceDetails",
                  "School Performance Details",
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
              "Regular",
              "Irregular",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  schoolValue(
                    "schoolAttendance"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "schoolHistory",
                    "schoolAttendance",
                    "School Attendance",
                    item
                  )
                }
              />
            ))}
          </View>

          {schoolValue(
            "schoolAttendance"
          ) === "Irregular" && (
            <AppTextField
              value={
                (schoolValue(
                  "schoolAttendanceReason"
                ) as string) ?? ""
              }
              onChangeText={(v) =>
                updateField(
                  "schoolHistory",
                  "schoolAttendanceReason",
                  "School Attendance Reason",
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