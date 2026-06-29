import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function AbdomenExam() {
  const [inspectionFindings, setInspectionFindings] =
    useState<string[]>(["NAD"]);

  const [herniaType, setHerniaType] =
    useState<string[]>([]);

  const [palpationFindings, setPalpationFindings] =
    useState<string[]>(["Soft and Lax"]);

  const [percussionFindings, setPercussionFindings] =
    useState<string[]>(["NAD"]);

  const [auscultationFindings, setAuscultationFindings] =
    useState<string[]>(["NAD"]);

  const [specialSigns, setSpecialSigns] =
    useState<string[]>(["No Special Signs"]);

  const [otherFindings, setOtherFindings] =
    useState("");

  const [distensionSeverity, setDistensionSeverity] =
    useState("");

  const [tendernessSite, setTendernessSite] =
    useState<string[]>([]);

  const [tendernessSeverity, setTendernessSeverity] =
    useState("");

  const [massSite, setMassSite] =
    useState<string[]>([]);

  const [massMobility, setMassMobility] =
    useState("");

  const [liverSpan, setLiverSpan] =
    useState("");

  const [spleenGrade, setSpleenGrade] =
    useState("");

  const [bruitSites, setBruitSites] =
    useState<string[]>([]);

  const toggleFinding = (
    item: string,
    selected: string[],
    setSelected: (value: string[]) => void,
    normalValue = "NAD"
  ) => {
    if (item === normalValue) {
      setSelected([normalValue]);
      return;
    }

    let updated = selected.filter(
      (x) => x !== normalValue
    );

    if (updated.includes(item)) {
      updated = updated.filter(
        (x) => x !== item);
    } else {
      updated.push(item);
    }

    if (updated.length === 0) {
      updated = [normalValue];
    }

    setSelected(updated);
  };

  const toggleMultiSelect = (
    item: string,
    selected: string[],
    setSelected: (value: string[]) => void
  ) => {
    if (selected.includes(item)) {
      setSelected(
        selected.filter((x) => x !== item)
      );
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Inspection
      </Text>

      <View style={styles.row}>
        {[
          "NAD",
          "Distension",
          "Scar",
          "Visible Mass",
          "Dilated Veins",
          "Hernia",
          "Stoma",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={inspectionFindings.includes(item)}
            onPress={() =>
              toggleFinding(
                item,
                inspectionFindings,
                setInspectionFindings
              )
            }
          />
        ))}
      </View>

      {inspectionFindings.includes(
        "Distension"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Distension Severity
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
                  distensionSeverity === item
                }
                onPress={() =>
                  setDistensionSeverity(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      {inspectionFindings.includes(
        "Hernia"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Hernia Type
          </Text>

          <View style={styles.row}>
            {[
              "Inguinal",
              "Femoral",
              "Umbilical",
              "Incisional",
              "Epigastric",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={herniaType.includes(
                  item
                )}
                onPress={() =>
                  toggleMultiSelect(
                    item,
                    herniaType,
                    setHerniaType
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Palpation
      </Text>

      <View style={styles.row}>
        {[
          "Soft and Lax",
          "Tenderness",
          "Guarding",
          "Rigidity",
          "Mass",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={palpationFindings.includes(
              item
            )}
            onPress={() =>
              toggleFinding(
                item,
                palpationFindings,
                setPalpationFindings,
                "Soft and Lax"
              )
            }
          />
        ))}
      </View>
            {palpationFindings.includes(
        "Tenderness"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Site
          </Text>

          <View style={styles.row}>
            {[
              "RUQ",
              "LUQ",
              "RLQ",
              "LLQ",
              "Epigastric",
              "Umbilical",
              "Suprapubic",
              "Generalized",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={tendernessSite.includes(
                  item
                )}
                onPress={() =>
                  toggleMultiSelect(
                    item,
                    tendernessSite,
                    setTendernessSite
                  )
                }
              />
            ))}
          </View>

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
                  tendernessSeverity === item
                }
                onPress={() =>
                  setTendernessSeverity(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      {palpationFindings.includes(
        "Mass"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Mass Site
          </Text>

          <View style={styles.row}>
            {[
              "RUQ",
              "LUQ",
              "RLQ",
              "LLQ",
              "Epigastric",
              "Umbilical",
              "Suprapubic",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={massSite.includes(
                  item
                )}
                onPress={() =>
                  toggleMultiSelect(
                    item,
                    massSite,
                    setMassSite
                  )
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Mobility
          </Text>

          <View style={styles.row}>
            {[
              "Mobile",
              "Fixed",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  massMobility === item
                }
                onPress={() =>
                  setMassMobility(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.label}>
        Liver Span
      </Text>

      <AppTextField
        value={liverSpan}
        onChangeText={setLiverSpan}
        placeholder="cm"
      />

      <Text style={styles.label}>
        Spleen
      </Text>

      <View style={styles.row}>
        {[
          "Not Palpable",
          "Grade I",
          "Grade II",
          "Grade III",
          "Grade IV",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              spleenGrade === item
            }
            onPress={() =>
              setSpleenGrade(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Percussion
      </Text>

      <View style={styles.row}>
        {[
          "NAD",
          "Tympanic",
          "Dullness",
          "Shifting Dullness",
          "Fluid Thrill",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={percussionFindings.includes(
              item
            )}
            onPress={() =>
              toggleFinding(
                item,
                percussionFindings,
                setPercussionFindings
              )
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Auscultation
      </Text>

      <View style={styles.row}>
        {[
          "NAD",
          "Normal Bowel Sounds",
          "Absent",
          "Hyperactive",
          "Bruit",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={auscultationFindings.includes(
              item
            )}
            onPress={() =>
              toggleFinding(
                item,
                auscultationFindings,
                setAuscultationFindings
              )
            }
          />
        ))}
      </View>
            {auscultationFindings.includes(
        "Bruit"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Bruit Site
          </Text>

          <View style={styles.row}>
            {[
              "Aorta",
              "Renal",
              "Iliac",
              "Femoral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={bruitSites.includes(
                  item
                )}
                onPress={() =>
                  toggleMultiSelect(
                    item,
                    bruitSites,
                    setBruitSites
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Special Signs
      </Text>

      <View style={styles.row}>
        {[
          "No Special Signs",
          "Murphy's Sign",
          "McBurney's Point",
          "Rovsing's Sign",
          "Psoas Sign",
          "Obturator Sign",
          "Rebound Tenderness",
          "Succussion Splash",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={specialSigns.includes(
              item
            )}
            onPress={() =>
              toggleFinding(
                item,
                specialSigns,
                setSpecialSigns,
                "No Special Signs"
              )
            }
          />
        ))}
      </View>

      

      <AppTextField
        placeholder="Add other findings..."
        value={otherFindings}
        onChangeText={setOtherFindings}
        multiline
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  group: {
    gap: SPACING.sm,
  },

  inputRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  half: {
    flex: 1,
  },
});