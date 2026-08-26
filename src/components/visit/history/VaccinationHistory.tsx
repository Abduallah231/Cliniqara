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
import { useEffect, useRef, useState } from "react";
import { getVaccinationHistory } from "@/services/visitApi";
import useVaccinationHistoryAutoSave from "@/hooks/useVaccinationHistoryAutoSave";

export default function VaccinationHistory() {
  const {
    visit,
    updateVaccinationField,
  } = useVisitStore();

  const vaccinationHistory =
    visit.history.vaccinationHistory;

  const patientId = visit.patient?.id;

  const [isHydrating, setIsHydrating] = useState(false);

  useVaccinationHistoryAutoSave({
    patientId,
    vaccinationHistory,
    isHydrating,
  });

  const isLoadingHistory = useRef(false);
  const loadedPatientId = useRef<string | null>(null);

  useEffect(() => {
    if (
      !patientId ||
      loadedPatientId.current === patientId
    ) {
      return;
    }

    const loadVaccinationHistory = async () => {
      try {
        isLoadingHistory.current = true;
        setIsHydrating(true);

        const data =
          await getVaccinationHistory(patientId);

        if (!data) {
          loadedPatientId.current = patientId;
          return;
        }

        updateVaccinationField(
          "vaccinationStatus",
          data.vaccinationStatus ?? null,
        );

        updateVaccinationField(
          "missedVaccines",
          data.missedVaccines ?? [],
        );

        updateVaccinationField(
          "partialReason",
          data.partialReason ?? null,
        );

        updateVaccinationField(
          "partialOtherDetails",
          data.partialOtherDetails ?? null,
        );

        updateVaccinationField(
          "unvaccinatedReason",
          data.unvaccinatedReason ?? null,
        );

        updateVaccinationField(
          "unvaccinatedOtherDetails",
          data.unvaccinatedOtherDetails ?? null,
        );

        updateVaccinationField(
          "previousReaction",
          data.previousReaction ?? null,
        );

        updateVaccinationField(
          "reactionSeverity",
          data.reactionSeverity ?? null,
        );

        updateVaccinationField(
          "reactionDetails",
          data.reactionDetails ?? null,
        );

        loadedPatientId.current = patientId;
      } catch (error) {
        console.error(
          "Failed to load vaccination history:",
          error,
        );
      } finally {
        isLoadingHistory.current = false;
        setIsHydrating(false);
      }
    };

    loadVaccinationHistory();
  }, [
    patientId,
    updateVaccinationField,
  ]);

  const updateField = (
    field: any,
    value: any,
  ) => {
    updateVaccinationField(
      field,
      value,
    );
  };

  const getValue = (field: string) =>
    vaccinationHistory?.[
      field as keyof typeof vaccinationHistory
    ] ?? null;

  const toggleMultiSelectWithNone = (
    field: "missedVaccines",
    value: string,
  ) => {
    const current =
      (getValue(field) as string[]) ?? [];

    if (value === "Unknown") {
      updateField(field, ["Unknown"]);
      return;
    }

    let updated = current.filter(
      (item) => item !== "Unknown",
    );

    if (updated.includes(value)) {
      updated = updated.filter(
        (item) => item !== value,
      );
    } else {
      updated.push(value);
    }

    updateField(field, updated);
  };

  return (
    <View style={styles.container}>
      {/* =========================
          Vaccination Status
      ========================= */}

      <SectionHeader title="Vaccination Status" />

      <View style={styles.row}>
        {[
          "UP_TO_DATE",
          "PARTIALLY_VACCINATED",
          "UNVACCINATED",
          "UNKNOWN",
        ].map((item) => (
          <AppChip
            key={item}
            label={
              item === "UP_TO_DATE"
                ? "Up to Date"
                : item ===
                  "PARTIALLY_VACCINATED"
                ? "Partially Vaccinated"
                : item === "UNVACCINATED"
                ? "Unvaccinated"
                : "Unknown"
            }
            selected={
              getValue(
                "vaccinationStatus",
              ) === item
            }
            onPress={() => {
              updateField(
                "vaccinationStatus",
                item,
              );

              if (
                item === "UP_TO_DATE" ||
                item === "UNKNOWN"
              ) {
                updateField(
                  "missedVaccines",
                  [],
                );

                updateField(
                  "partialReason",
                  null,
                );

                updateField(
                  "partialOtherDetails",
                  null,
                );

                updateField(
                  "unvaccinatedReason",
                  null,
                );

                updateField(
                  "unvaccinatedOtherDetails",
                  null,
                );
              }

              if (
                item ===
                "PARTIALLY_VACCINATED"
              ) {
                updateField(
                  "unvaccinatedReason",
                  null,
                );

                updateField(
                  "unvaccinatedOtherDetails",
                  null,
                );
              }

              if (
                item === "UNVACCINATED"
              ) {
                updateField(
                  "missedVaccines",
                  [],
                );

                updateField(
                  "partialReason",
                  null,
                );

                updateField(
                  "partialOtherDetails",
                  null,
                );
              }
            }}
          />
        ))}
      </View>

      {getValue(
        "vaccinationStatus",
      ) !== "UNKNOWN" && <Divider />}

      {/* =========================
          Partially Vaccinated
      ========================= */}

      {getValue(
        "vaccinationStatus",
      ) === "PARTIALLY_VACCINATED" && (
        <>
          <SectionHeader title="Missed Vaccines" />

          <View style={styles.row}>
            {[
              "Birth",
              "2 Months",
              "4 Months",
              "6 Months",
              "9 Months",
              "12 Months",
              "18 Months",
              "School Entry (4–6 Years)",
              "Unknown",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={(
                  (getValue(
                    "missedVaccines",
                  ) as string[]) ?? []
                ).includes(item)}
                onPress={() =>
                  toggleMultiSelectWithNone(
                    "missedVaccines",
                    item,
                  )
                }
              />
            ))}
          </View>

          <Divider />

          <SectionHeader title="Reason" />

          <View style={styles.row}>
            {[
              "MISSED_APPOINTMENT",
              "VACCINE_UNAVAILABLE",
              "MEDICAL_CONTRAINDICATION",
              "PARENT_REFUSED",
              "UNKNOWN",
              "OTHER",
            ].map((item) => (
              <AppChip
                key={item}
                label={
                  item ===
                  "MISSED_APPOINTMENT"
                    ? "Missed Appointment"
                    : item ===
                      "VACCINE_UNAVAILABLE"
                    ? "Vaccine Unavailable"
                    : item ===
                      "MEDICAL_CONTRAINDICATION"
                    ? "Medical Contraindication"
                    : item ===
                      "PARENT_REFUSED"
                    ? "Parent Refused"
                    : item === "UNKNOWN"
                    ? "Unknown"
                    : "Other"
                }
                selected={
                  getValue(
                    "partialReason",
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "partialReason",
                    item,
                  )
                }
              />
            ))}
          </View>

          {getValue(
            "partialReason",
          ) === "OTHER" && (
            <AppTextField
              value={
                (getValue(
                  "partialOtherDetails",
                ) as string) ?? ""
              }
              onChangeText={(value) =>
                updateField(
                  "partialOtherDetails",
                  value,
                )
              }
              placeholder="Details"
            />
          )}

          <Divider />
        </>
      )}

      {/* =========================
          Unvaccinated
      ========================= */}

      {getValue(
        "vaccinationStatus",
      ) === "UNVACCINATED" && (
        <>
          <SectionHeader title="Reason" />

          <View style={styles.row}>
            {[
              "PARENT_REFUSED",
              "MEDICAL_CONTRAINDICATION",
              "ACCESS_PROBLEMS",
              "UNKNOWN",
              "OTHER",
            ].map((item) => (
              <AppChip
                key={item}
                label={
                  item ===
                  "PARENT_REFUSED"
                    ? "Parent Refused"
                    : item ===
                      "MEDICAL_CONTRAINDICATION"
                    ? "Medical Contraindication"
                    : item ===
                      "ACCESS_PROBLEMS"
                    ? "Access Problems"
                    : item === "UNKNOWN"
                    ? "Unknown"
                    : "Other"
                }
                selected={
                  getValue(
                    "unvaccinatedReason",
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "unvaccinatedReason",
                    item,
                  )
                }
              />
            ))}
          </View>

          {getValue(
            "unvaccinatedReason",
          ) === "OTHER" && (
            <AppTextField
              value={
                (getValue(
                  "unvaccinatedOtherDetails",
                ) as string) ?? ""
              }
              onChangeText={(value) =>
                updateField(
                  "unvaccinatedOtherDetails",
                  value,
                )
              }
              placeholder="Details"
            />
          )}

          <Divider />
        </>
      )}

      {/* =========================
          Previous Vaccine Reaction
      ========================= */}

      {getValue(
        "vaccinationStatus",
      ) !== "UNKNOWN" && (
        <>
          <SectionHeader title="Previous Vaccine Reaction" />

          <View style={styles.row}>
            {[
              {
                label: "No",
                value: false,
              },
              {
                label: "Yes",
                value: true,
              },
            ].map((item) => (
              <AppChip
                key={item.label}
                label={item.label}
                selected={
                  getValue(
                    "previousReaction",
                  ) === item.value
                }
                onPress={() => {
                  updateField(
                    "previousReaction",
                    item.value,
                  );

                  if (!item.value) {
                    updateField(
                      "reactionSeverity",
                      null,
                    );

                    updateField(
                      "reactionDetails",
                      null,
                    );
                  }
                }}
              />
            ))}
          </View>

          {getValue(
            "previousReaction",
          ) === true && (
            <>
              <Divider />

              <Text style={styles.label}>
                Severity
              </Text>

              <View style={styles.row}>
                {[
                  "MILD",
                  "MODERATE",
                  "SEVERE",
                ].map((item) => (
                  <AppChip
                    key={item}
                    label={
                      item === "MILD"
                        ? "Mild"
                        : item === "MODERATE"
                        ? "Moderate"
                        : "Severe"
                    }
                    selected={
                      getValue(
                        "reactionSeverity",
                      ) === item
                    }
                    onPress={() =>
                      updateField(
                        "reactionSeverity",
                        item,
                      )
                    }
                  />
                ))}
              </View>

              <AppTextField
                value={
                  (getValue(
                    "reactionDetails",
                  ) as string) ?? ""
                }
                onChangeText={(value) =>
                  updateField(
                    "reactionDetails",
                    value,
                  )
                }
                placeholder="Reaction Details"
              />
            </>
          )}
        </>
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
  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
  },
});