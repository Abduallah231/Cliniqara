import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { useVisitStore } from "@/store/visitStore";
import { StyleSheet } from "react-native";
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
    <AppView style={styles.container}>

      {/* =========================
          HYDRATION
      ========================= */}

      {isHydrating && (
        <AppText
          style={
            styles.statusText
          }
        >
          Loading social history...
        </AppText>
      )}

      {/* =========================
          Smoking
      ========================= */}

      <SectionHeader title="Smoking" />

      <AppView style={styles.row}>
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
      </AppView>

      {["Current", "Former"].includes(
        getValue("smoking") as string,
      ) && (
        <AppView style={styles.box}>

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

          <AppView
            style={
              styles.readOnlySection
            }
          >
            <AppText style={styles.label}>
              Smoking Index
            </AppText>

            <AppView
              style={
                styles.readOnlyBox
              }
            >
              <AppText
                style={
                  styles.readOnlyText
                }
              >
                {packYears
                  ? `${packYears} Pack-years`
                  : "—"}
              </AppText>
            </AppView>
          </AppView>

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
        </AppView>
      )}

      {isSectionAutoSaving("smoking") && (
        <AppText style={styles.savingText}>
          Saving changes...
        </AppText>
      )}

      <Divider />

      {/* =========================
          Alcohol
      ========================= */}

      <SectionHeader title="Alcohol" />

      <AppView style={styles.row}>
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
      </AppView>

      {["Current", "Former"].includes(
        getValue("alcohol") as string,
      ) && (
        <AppView style={styles.box}>

          <AppText style={styles.label}>
            How Often
          </AppText>

          <AppView style={styles.row}>
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
          </AppView>

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
        </AppView>
      )}

      {isSectionAutoSaving("alcohol") && (
        <AppText style={styles.savingText}>
          Saving changes...
        </AppText>
      )}

      <Divider />

      {/* =========================
          Living Conditions
      ========================= */}

      <SectionHeader title="Living Conditions" />

      <AppView style={styles.row}>
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
      </AppView>

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
        <AppText style={styles.savingText}>
          Saving changes...
        </AppText>
      )}

      <Divider />

      {/* =========================
          Substance Use
      ========================= */}

      <SectionHeader title="Substance Use" />

      <AppView style={styles.row}>
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
      </AppView>

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
        <AppText style={styles.savingText}>
          Saving changes...
        </AppText>
      )}

      <Divider />

      {/* =========================
          Physical Activity
      ========================= */}

      <SectionHeader title="Physical Activity" />

      <AppView style={styles.row}>
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
      </AppView>

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
        <AppText style={styles.savingText}>
          Saving changes...
        </AppText>
      )}

      <Divider />

      {/* =========================
          Sleep
      ========================= */}

      <SectionHeader title="Sleep" />

      <AppView style={styles.row}>
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
      </AppView>

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
        <AppText style={styles.savingText}>
          Saving changes...
        </AppText>
      )}

      <Divider />

      {/* =========================
          Social Support
      ========================= */}

      <SectionHeader title="Social Support" />

      <AppView style={styles.row}>
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
      </AppView>

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
        <AppText style={styles.savingText}>
          Saving changes...
        </AppText>
      )}

      <Divider />

      {/* =========================
          Sexual History (Optional)
      ========================= */}

      <SectionHeader title="Sexual History (Optional)" />

      <AppView style={styles.row}>
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
      </AppView>

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
        <AppText style={styles.savingText}>
          Saving changes...
        </AppText>
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