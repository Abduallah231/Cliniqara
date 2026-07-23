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

export default function VaccinationHistory() {
  const {
    visit,
    updateVaccinationField,
  } = useVisitStore();

  const updateField = (
    fieldId: string,
    fieldLabel: string,
    value: any
  ) => {
    updateVaccinationField(
      fieldId,
      fieldLabel,
      value
    );
  };

  const getValue = (fieldId: string) =>
    visit.history.vaccinationHistory.fields.find(
      (field) => field.fieldId === fieldId
    )?.value ?? null;

  const toggleMultiSelectWithNone = (
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    const current =
      (getValue(fieldId) as string[]) ?? [];

    if (value === "Unknown") {
      updateVaccinationField(
        fieldId,
        fieldLabel,
        ["Unknown"]
      );
      return;
    }

    let updated = current.filter(
      (item) => item !== "Unknown"
    );

    if (updated.includes(value)) {
      updated = updated.filter(
        (item) => item !== value
      );
    } else {
      updated.push(value);
    }

    updateVaccinationField(
      fieldId,
      fieldLabel,
      updated
    );
  };

  return (
    <View style={styles.container}>
      {/* =========================
          Vaccination Status
      ========================= */}

      <SectionHeader title="Vaccination Status" />

      <View style={styles.row}>
        {[
          "Up to Date",
          "Partially Vaccinated",
          "Unvaccinated",
          "Unknown",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "vaccinationStatus"
              ) === item
            }
            onPress={() => {
              updateField(
                "vaccinationStatus",
                "Vaccination Status",
                item
              );

              if (
                item === "Up to Date"
              ) {
                updateField(
                  "missedVaccines",
                  "Missed Vaccines",
                  []
                );

                updateField(
                  "partialReason",
                  "Partial Reason",
                  ""
                );

                updateField(
                  "partialOtherDetails",
                  "Partial Other Details",
                  ""
                );

                updateField(
                  "unvaccinatedReason",
                  "Unvaccinated Reason",
                  ""
                );

                updateField(
                  "unvaccinatedOtherDetails",
                  "Unvaccinated Other Details",
                  ""
                );
              }

              if (
                item ===
                "Partially Vaccinated"
              ) {
                updateField(
                  "unvaccinatedReason",
                  "Unvaccinated Reason",
                  ""
                );

                updateField(
                  "unvaccinatedOtherDetails",
                  "Unvaccinated Other Details",
                  ""
                );
              }

              if (
                item ===
                "Unvaccinated"
              ) {
                updateField(
                  "missedVaccines",
                  "Missed Vaccines",
                  []
                );

                updateField(
                  "partialReason",
                  "Partial Reason",
                  ""
                );

                updateField(
                  "partialOtherDetails",
                  "Partial Other Details",
                  ""
                );
              }

              if (
                item === "Unknown"
              ) {
                updateField(
                  "missedVaccines",
                  "Missed Vaccines",
                  []
                );

                updateField(
                  "partialReason",
                  "Partial Reason",
                  ""
                );

                updateField(
                  "partialOtherDetails",
                  "Partial Other Details",
                  ""
                );

                updateField(
                  "unvaccinatedReason",
                  "Unvaccinated Reason",
                  ""
                );

                updateField(
                  "unvaccinatedOtherDetails",
                  "Unvaccinated Other Details",
                  ""
                );
              }
            }}
          />
        ))}
      </View>

      {getValue(
        "vaccinationStatus"
      ) !== "Unknown" && <Divider />}

      {/* =========================
          Partially Vaccinated
      ========================= */}

      {getValue(
        "vaccinationStatus"
      ) ===
        "Partially Vaccinated" && (
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
                selected={
                  (
                    (getValue(
                      "missedVaccines"
                    ) as string[]) ??
                    []
                  ).includes(item)
                }
                onPress={() =>
                  toggleMultiSelectWithNone(
                    "missedVaccines",
                    "Missed Vaccines",
                    item
                  )
                }
              />
            ))}
          </View>

          <Divider />

                    <SectionHeader title="Reason" />

          <View style={styles.row}>
            {[
              "Missed Appointment",
              "Vaccine Unavailable",
              "Medical Contraindication",
              "Parent Refused",
              "Unknown",
              "Other",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "partialReason"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "partialReason",
                    "Partial Reason",
                    item
                  )
                }
              />
            ))}
          </View>

          {getValue(
            "partialReason"
          ) === "Other" && (
            <AppTextField
              value={
                (getValue(
                  "partialOtherDetails"
                ) as string) ?? ""
              }
              onChangeText={(v) =>
                updateField(
                  "partialOtherDetails",
                  "Partial Other Details",
                  v
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
        "vaccinationStatus"
      ) === "Unvaccinated" && (
        <>
          <SectionHeader title="Reason" />

          <View style={styles.row}>
            {[
              "Parent Refused",
              "Medical Contraindication",
              "Access Problems",
              "Unknown",
              "Other",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "unvaccinatedReason"
                  ) === item
                }
                onPress={() =>
                  updateField(
                    "unvaccinatedReason",
                    "Unvaccinated Reason",
                    item
                  )
                }
              />
            ))}
          </View>

          {getValue(
            "unvaccinatedReason"
          ) === "Other" && (
            <AppTextField
              value={
                (getValue(
                  "unvaccinatedOtherDetails"
                ) as string) ?? ""
              }
              onChangeText={(v) =>
                updateField(
                  "unvaccinatedOtherDetails",
                  "Unvaccinated Other Details",
                  v
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
        "vaccinationStatus"
      ) !== "Unknown" && (
        <>
          <SectionHeader title="Previous Vaccine Reaction" />

          <View style={styles.row}>
            {["No", "Yes"].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "previousReaction"
                  ) === item
                }
                onPress={() => {
                  updateField(
                    "previousReaction",
                    "Previous Reaction",
                    item
                  );

                  if (item === "No") {
                    updateField(
                      "reactionSeverity",
                      "Reaction Severity",
                      ""
                    );

                    updateField(
                      "reactionDetails",
                      "Reaction Details",
                      ""
                    );
                  }
                }}
              />
            ))}
          </View>
                    {getValue(
            "previousReaction"
          ) === "Yes" && (
            <>
              <Divider />

              <Text style={styles.label}>
                Severity
              </Text>

              <View style={styles.row}>
                {[
                  "Mild",
                  "Moderate",
                  "Severe",
                ].map((item) => (
                  <AppChip
                    key={item}
                    label={item}
                    selected={
                      getValue(
                        "reactionSeverity"
                      ) === item
                    }
                    onPress={() =>
                      updateField(
                        "reactionSeverity",
                        "Reaction Severity",
                        item
                      )
                    }
                  />
                ))}
              </View>

              <AppTextField
                value={
                  (getValue(
                    "reactionDetails"
                  ) as string) ?? ""
                }
                onChangeText={(v) =>
                  updateField(
                    "reactionDetails",
                    "Reaction Details",
                    v
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