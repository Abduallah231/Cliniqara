import { useVisitStore } from "@/store/visitStore";
import { StyleSheet, Text, View } from "react-native";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getSocialHistory,
} from "@/services/patientApi";
import useSocialHistoryAutoSave, {
  mapSocialHistoryFromBackend,
} from "@/hooks/useSocialHistoryAutoSave";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function SocialHistory() {
  const {
    visit,
    updateSocialField,
  } = useVisitStore();

  const patientId =
    visit.metadata.patientId;

  const fields =
    visit.history.socialHistory.fields;

  const [
    isHydrating,
    setIsHydrating,
  ] = useState(true);

  const loadedPatientId =
    useRef<string | null>(null);

  const {
    isSectionAutoSaving,
  } =
    useSocialHistoryAutoSave({
      patientId,
      fields,
      isHydrating,
    });

  useEffect(() => {
    if (
      !patientId ||
      loadedPatientId.current ===
        patientId
    ) {
      return;
    }

    let cancelled = false;

    const loadSocialHistory = async () => {
      try {
        setIsHydrating(true);

        const data =
          await getSocialHistory(
            patientId,
          );

        if (cancelled) {
          return;
        }

        if (data) {
          const mappedFields =
            mapSocialHistoryFromBackend(
              data,
            );

          mappedFields.forEach(
            (field) => {
              updateSocialField(
                field.fieldId,
                field.fieldLabel,
                field.value,
              );
            },
          );
        }

        loadedPatientId.current =
          patientId;
      } catch (error) {
        console.error(
          "Failed to load social history:",
          error,
        );
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    };

    loadSocialHistory();

    return () => {
      cancelled = true;
    };
  }, [
    patientId,
    updateSocialField,
  ]);

  const getValue = (fieldId: string) =>
    visit.history.socialHistory.fields.find(
      (field) => field.fieldId === fieldId
    )?.value ?? null;

  const updateField = (
    fieldId: string,
    fieldLabel: string,
    value: any
  ) => {
    if (isHydrating) {
      return;
    }

    updateSocialField(
      fieldId,
      fieldLabel,
      value
    );
  };

  const toggleMultiSelect = (
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    if (isHydrating) {
      return;
    }

    const current =
      (getValue(fieldId) as string[]) ?? [];

    if (current.includes(value)) {
      updateSocialField(
        fieldId,
        fieldLabel,
        current.filter(
          (x) => x !== value
        )
      );
    } else {
      updateSocialField(
        fieldId,
        fieldLabel,
        [...current, value]
      );
    }
  };

  const cigarettesPerDay = Number(
    getValue("cigarettesPerDay") ?? 0
  );

  const yearsSmoking = Number(
    getValue("yearsSmoking") ?? 0
  );

  const packYears =
    cigarettesPerDay > 0 &&
    yearsSmoking > 0
      ? (
          (cigarettesPerDay / 20) *
          yearsSmoking
        ).toFixed(1)
      : "";

  return (
    <View style={styles.container}>

      {/* =========================
          HYDRATION
      ========================= */}

      {isHydrating && (
        <Text
          style={
            styles.statusText
          }
        >
          Loading social history...
        </Text>
      )}

      {/* =========================
          Smoking
      ========================= */}

      <SectionHeader title="Smoking" />

      <View style={styles.row}>
        {[
          "Never",
          "Current",
          "Former",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue("smoking") === item
            }
            disabled={isHydrating}
            onPress={() => {
              if (item === "Never") {
                updateField(
                  "smoking",
                  "Smoking",
                  "Never"
                );

                updateField(
                  "cigarettesPerDay",
                  "Cigarettes Per Day",
                  null
                );

                updateField(
                  "yearsSmoking",
                  "Years Smoking",
                  null
                );

                updateField(
                  "yearsSinceQuitting",
                  "Years Since Quitting",
                  null
                );

                return;
              }

              updateField(
                "smoking",
                "Smoking",
                item
              );
            }}
          />
        ))}
      </View>

      {["Current", "Former"].includes(
        getValue("smoking") as string,
      ) && (
        <View style={styles.box}>

          <AppTextField
            placeholder="Cigarettes Per Day"
            keyboardType="numeric"
            value={
              (getValue(
                "cigarettesPerDay"
              ) as string) ?? ""
            }
            editable={!isHydrating}
            onChangeText={(v) =>
              updateField(
                "cigarettesPerDay",
                "Cigarettes Per Day",
                v
              )
            }
          />

          <AppTextField
            placeholder="Years Smoking"
            keyboardType="numeric"
            value={
              (getValue(
                "yearsSmoking"
              ) as string) ?? ""
            }
            editable={!isHydrating}
            onChangeText={(v) =>
              updateField(
                "yearsSmoking",
                "Years Smoking",
                v
              )
            }
          />

          <View
            style={
              styles.readOnlySection
            }
          >
            <Text style={styles.label}>
              Smoking Index
            </Text>

            <View
              style={
                styles.readOnlyBox
              }
            >
              <Text
                style={
                  styles.readOnlyText
                }
              >
                {packYears
                  ? `${packYears} Pack-years`
                  : "—"}
              </Text>
            </View>
          </View>

          {getValue("smoking") ===
            "Former" && (
            <AppTextField
              placeholder="Years Since Quitting"
              keyboardType="numeric"
              value={
                (getValue(
                  "yearsSinceQuitting"
                ) as string) ?? ""
              }
              editable={!isHydrating}
              onChangeText={(v) =>
                updateField(
                  "yearsSinceQuitting",
                  "Years Since Quitting",
                  v
                )
              }
            />
          )}
        </View>
      )}

      {isSectionAutoSaving("smoking") && (
        <Text style={styles.savingText}>
          Saving changes...
        </Text>
      )}

      <Divider />

      {/* =========================
          Alcohol
      ========================= */}

      <SectionHeader title="Alcohol" />

      <View style={styles.row}>
        {[
          "No",
          "Current",
          "Former",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue("alcohol") === item
            }
            disabled={isHydrating}
            onPress={() => {
              if (item === "No") {
                updateField(
                  "alcohol",
                  "Alcohol",
                  "No"
                );

                updateField(
                  "alcoholFrequency",
                  "Alcohol Frequency",
                  null
                );

                updateField(
                  "yearsSinceStopping",
                  "Years Since Stopping",
                  null
                );

                return;
              }

              updateField(
                "alcohol",
                "Alcohol",
                item
              );
            }}
          />
        ))}
      </View>

      {["Current", "Former"].includes(
        getValue("alcohol") as string,
      ) && (
        <View style={styles.box}>

          <Text style={styles.label}>
            How Often
          </Text>

          <View style={styles.row}>
            {[
              "Occasional",
              "Weekly",
              "Daily",
              "Heavy",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  getValue(
                    "alcoholFrequency"
                  ) === item
                }
                disabled={isHydrating}
                onPress={() =>
                  updateField(
                    "alcoholFrequency",
                    "Alcohol Frequency",
                    item
                  )
                }
              />
            ))}
          </View>

          {getValue("alcohol") ===
            "Former" && (
            <AppTextField
              placeholder="Years Since Stopping"
              keyboardType="numeric"
              value={
                (getValue(
                  "yearsSinceStopping"
                ) as string) ?? ""
              }
              editable={!isHydrating}
              onChangeText={(v) =>
                updateField(
                  "yearsSinceStopping",
                  "Years Since Stopping",
                  v
                )
              }
            />
          )}
        </View>
      )}

      {isSectionAutoSaving("alcohol") && (
        <Text style={styles.savingText}>
          Saving changes...
        </Text>
      )}

      <Divider />

      {/* =========================
          Living Conditions
      ========================= */}

      <SectionHeader title="Living Conditions" />

      <View style={styles.row}>
        {[
          "Lives Alone",
          "Lives With Family",
          "Nursing Home / Assisted Living",
          "Homeless",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "livingCondition"
              ) === item
            }
            disabled={isHydrating}
            onPress={() =>
              updateField(
                "livingCondition",
                "Living Condition",
                item
              )
            }
          />
        ))}
      </View>

      {getValue("livingCondition") ===
        "Other" && (
        <AppTextField
          placeholder="Additional Notes..."
          value={
            (getValue(
              "livingConditionNotes"
            ) as string) ?? ""
          }
          editable={!isHydrating}
          onChangeText={(v) =>
            updateField(
              "livingConditionNotes",
              "Living Condition Notes",
              v
            )
          }
        />
      )}

      {isSectionAutoSaving(
        "livingCondition"
      ) && (
        <Text style={styles.savingText}>
          Saving changes...
        </Text>
      )}

      <Divider />

      {/* =========================
          Substance Use
      ========================= */}

      <SectionHeader title="Substance Use" />

      <View style={styles.row}>
        {[
          "None",
          "Cannabis",
          "Opioids",
          "Cocaine",
          "Amphetamines",
          "Other",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              (
                (getValue(
                  "substanceUse"
                ) as string[]) ?? []
              ).includes(item)
            }
            disabled={isHydrating}
            onPress={() => {
              if (isHydrating) {
                return;
              }

              const current =
                (getValue(
                  "substanceUse"
                ) as string[]) ?? [];

              if (item === "None") {
                updateField(
                  "substanceUse",
                  "Substance Use",
                  ["None"]
                );
                return;
              }

              let updated = current.filter(
                (x) => x !== "None"
              );

              if (updated.includes(item)) {
                updated = updated.filter(
                  (x) => x !== item
                );
              } else {
                updated.push(item);
              }

              updateField(
                "substanceUse",
                "Substance Use",
                updated
              );
            }}
          />
        ))}
      </View>

      {(
        (getValue(
          "substanceUse"
        ) as string[]) ?? []
      ).includes("Other") && (
        <AppTextField
          placeholder="Specify if needed..."
          value={
            (getValue(
              "substanceNotes"
            ) as string) ?? ""
          }
          editable={!isHydrating}
          onChangeText={(v) =>
            updateField(
              "substanceNotes",
              "Substance Notes",
              v
            )
          }
        />
      )}

      {isSectionAutoSaving(
        "substanceUse"
      ) && (
        <Text style={styles.savingText}>
          Saving changes...
        </Text>
      )}

      <Divider />

      {/* =========================
          Physical Activity
      ========================= */}

      <SectionHeader title="Physical Activity" />

      <View style={styles.row}>
        {[
          "Sedentary",
          "Light",
          "Moderate",
          "Heavy",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "physicalActivity"
              ) === item
            }
            disabled={isHydrating}
            onPress={() =>
              updateField(
                "physicalActivity",
                "Physical Activity",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        placeholder="Exercise details..."
        value={
          (getValue(
            "physicalActivityNotes"
          ) as string) ?? ""
        }
        editable={!isHydrating}
        onChangeText={(v) =>
          updateField(
            "physicalActivityNotes",
            "Physical Activity Notes",
            v
          )
        }
      />

      {isSectionAutoSaving(
        "physicalActivity"
      ) && (
        <Text style={styles.savingText}>
          Saving changes...
        </Text>
      )}

      <Divider />

      {/* =========================
          Sleep
      ========================= */}

      <SectionHeader title="Sleep" />

      <View style={styles.row}>
        {[
          "<5 h",
          "5-7 h",
          "7-9 h",
          ">9 h",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "sleepDuration"
              ) === item
            }
            disabled={isHydrating}
            onPress={() =>
              updateField(
                "sleepDuration",
                "Sleep Duration",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        placeholder="Sleep quality..."
        value={
          (getValue(
            "sleepNotes"
          ) as string) ?? ""
        }
        editable={!isHydrating}
        onChangeText={(v) =>
          updateField(
            "sleepNotes",
            "Sleep Notes",
            v
          )
        }
      />

      {isSectionAutoSaving("sleep") && (
        <Text style={styles.savingText}>
          Saving changes...
        </Text>
      )}

      <Divider />

      {/* =========================
          Social Support
      ========================= */}

      <SectionHeader title="Social Support" />

      <View style={styles.row}>
        {[
          "Good",
          "Limited",
          "No Support",
          "Caregiver Available",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "socialSupport"
              ) === item
            }
            disabled={isHydrating}
            onPress={() =>
              updateField(
                "socialSupport",
                "Social Support",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        placeholder="Support notes..."
        value={
          (getValue(
            "socialSupportNotes"
          ) as string) ?? ""
        }
        editable={!isHydrating}
        onChangeText={(v) =>
          updateField(
            "socialSupportNotes",
            "Social Support Notes",
            v
          )
        }
      />

      {isSectionAutoSaving(
        "socialSupport"
      ) && (
        <Text style={styles.savingText}>
          Saving changes...
        </Text>
      )}

      <Divider />

      {/* =========================
          Sexual History (Optional)
      ========================= */}

      <SectionHeader title="Sexual History (Optional)" />

      <View style={styles.row}>
        {[
          "Not Discussed",
          "Sexually Active",
          "Not Active",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              getValue(
                "sexualHistory"
              ) === item
            }
            disabled={isHydrating}
            onPress={() =>
              updateField(
                "sexualHistory",
                "Sexual History",
                item
              )
            }
          />
        ))}
      </View>

      <AppTextField
        placeholder="Optional notes..."
        value={
          (getValue(
            "sexualHistoryNotes"
          ) as string) ?? ""
        }
        editable={!isHydrating}
        onChangeText={(v) =>
          updateField(
            "sexualHistoryNotes",
            "Sexual History Notes",
            v
          )
        }
      />

      {isSectionAutoSaving(
        "sexualHistory"
      ) && (
        <Text style={styles.savingText}>
          Saving changes...
        </Text>
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

  readOnlySection: {
    gap: SPACING.xs,
  },

  readOnlyBox: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },

  readOnlyText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "500",
  },

  statusText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  savingText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
});