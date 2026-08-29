import { useState } from "react";
import type {
  FamilyRelation,
} from "@/models/VisitForm/history";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useVisitStore } from "@/store/visitStore";

import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import chronicDiseases from "@/data/chronicDiseases";
import { familyRelatives } from "@/data/familyRelatives";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function FamilyHistory() {
  const {
    visit,
    addFamilyDisease,
    updateFamilyDisease,
    removeFamilyDisease,
  } = useVisitStore();

  const [relationship, setRelationship] =
    useState<FamilyRelation | "">("");

  const [otherRelative, setOtherRelative] =
    useState("");

  const [diseases, setDiseases] =
    useState<string[]>([]);

  const [otherDisease, setOtherDisease] =
    useState("");

  const [alive, setAlive] =
    useState(true);

  const [ageAtDeath, setAgeAtDeath] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [causeOfDeath, setCauseOfDeath] =
    useState("");

  const [editingRecordId, setEditingRecordId] =
    useState<string | null>(null);

  const toggleDisease = (
    disease: string
  ) => {
    setDiseases((prev) =>
      prev.includes(disease)
        ? prev.filter(
            (item) => item !== disease
          )
        : [...prev, disease]
    );
  };

  const clearForm = () => {
    setRelationship("");
    setOtherRelative("");
    setDiseases([]);
    setOtherDisease("");
    setAlive(true);
    setAgeAtDeath("");
    setCauseOfDeath("");
    setNotes("");
    setEditingRecordId(null);
  };

  const handleAddFamilyHistory = () => {
    if (!relationship) return;

    const finalDiseases = [...diseases];

    if (
      otherDisease.trim() &&
      !finalDiseases.includes(otherDisease.trim())
    ) {
      finalDiseases.push(otherDisease.trim());
    }

    if (finalDiseases.length === 0) return;

    const parsedAgeAtDeath =
      !alive && ageAtDeath.trim()
        ? Number(ageAtDeath)
        : null;

    if (
      !alive &&
      ageAtDeath.trim() &&
      Number.isNaN(parsedAgeAtDeath)
    ) {
      return;
    }

    const familyDisease = {
      id:
        editingRecordId ??
        Date.now().toString(),
      relation: relationship,
      otherRelation:
        relationship === "OTHER"
          ? otherRelative.trim() || null
          : null,
      diseases: finalDiseases,
      alive,
      ageAtDeath: parsedAgeAtDeath,
      causeOfDeath:
        !alive
          ? causeOfDeath.trim() || null
          : null,
      notes: notes.trim() || null,
    };

    if (editingRecordId) {
      updateFamilyDisease(
        editingRecordId,
        familyDisease
      );
    } else {
      addFamilyDisease(familyDisease);
    }

    clearForm();
  };
    return (
    <View style={styles.container}>
      <SectionHeader title="Family History" />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Relationship
        </Text>

        <View style={styles.row}>
          {familyRelatives.map((relative) => (
            <AppChip
              key={relative}
              label={relative}
              selected={
                relationship === relative
              }
              onPress={() =>
                setRelationship(
                  relative as FamilyRelation
                )
              }
            />
          ))}
        </View>

        {relationship === "OTHER" && (
          <AppTextField
            placeholder="Specify Relative"
            value={otherRelative}
            onChangeText={setOtherRelative}
          />
        )}

        <Divider />

        <Text style={styles.sectionTitle}>
          Diseases
        </Text>

        <View style={styles.row}>
          {chronicDiseases.map((disease) => (
            <AppChip
              key={disease.code}
              label={disease.name}
              selected={diseases.includes(disease.code)}
              onPress={() =>
                toggleDisease(disease.code)
              }
            />
          ))}
        </View>

        <AppTextField
          label="Other Disease"
          placeholder="Type disease and it will be added"
          value={otherDisease}
          onChangeText={setOtherDisease}
        />

        <Divider />

        <Text style={styles.sectionTitle}>
          Alive
        </Text>

        <View style={styles.row}>
          <AppChip
            label="Yes"
            selected={alive}
            onPress={() => setAlive(true)}
          />

          <AppChip
            label="No"
            selected={!alive}
            onPress={() => setAlive(false)}
          />
        </View>

        {!alive && (
          <>
            <AppTextField
              placeholder="Age at Death"
              keyboardType="numeric"
              value={ageAtDeath}
              onChangeText={setAgeAtDeath}
            />

            <AppTextField
              placeholder="Cause of Death"
              value={causeOfDeath}
              onChangeText={setCauseOfDeath}
            />
          </>
        )}

        <AppTextField
          placeholder="Additional Notes..."
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title={
            editingRecordId
              ? "Update Family History"
              : "Add Family History"
          }
          onPress={handleAddFamilyHistory}
        />
      </View>

      {visit.history.familyHistory.familyDiseases.map(
        (item) => (
          <View
            key={item.id}
            style={styles.recordCard}
          >
            <Text style={styles.recordTitle}>
              {item.relation === "OTHER"
                ? item.otherRelation
                : item.relation}
            </Text>

            <Text style={styles.recordText}>
              Diseases:
            </Text>

            {item.diseases.map(
              (disease) => (
                <Text
                  key={disease}
                  style={styles.recordText}
                >
                  • {disease}
                </Text>
              )
            )}

            <Text style={styles.recordText}>
              Alive: {item.alive ? "Yes" : "No"}
            </Text>

            {!item.alive && (
              <>
                {!!item.ageAtDeath && (
                  <Text style={styles.recordText}>
                    Age at Death: {item.ageAtDeath}
                  </Text>
                )}
                {!!item.causeOfDeath && (
                  <Text style={styles.recordText}>
                    Cause: {item.causeOfDeath}
                  </Text>
                )}
              </>
            )}

            {!!item.notes && (
              <Text style={styles.recordText}>
                Notes: {item.notes}
              </Text>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setEditingRecordId(item.id);

                  setRelationship(item.relation);

                  setOtherRelative(
                    item.otherRelation ?? ""
                  );

                  setDiseases(item.diseases);

                  setOtherDisease("");

                  setAlive(item.alive);

                  setAgeAtDeath(
                    item.ageAtDeath != null
                      ? String(item.ageAtDeath)
                      : ""
                  );

                  setCauseOfDeath(
                    item.causeOfDeath ?? ""
                  );

                  setNotes(item.notes ?? "");
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color="#1976D2"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  removeFamilyDisease(item.id)
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color="#D32F2F"
                />
              </TouchableOpacity>
            </View>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  card: {
    gap: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  helperText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  recordCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.xs,
    backgroundColor: COLORS.white,
  },

  recordTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  recordText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },

  iconButton: {
    padding: 6,
  },
});