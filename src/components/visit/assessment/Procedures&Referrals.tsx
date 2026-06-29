import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function ProceduresReferralsSection() {
  const [procedures, setProcedures] =
    useState([""]);

  const [referrals, setReferrals] =
    useState([""]);

  const updateProcedure = (
    text: string,
    index: number
  ) => {
    const updated = [...procedures];
    updated[index] = text;
    setProcedures(updated);
  };

  const updateReferral = (
    text: string,
    index: number
  ) => {
    const updated = [...referrals];
    updated[index] = text;
    setReferrals(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Procedures
      </Text>

      {procedures.map((item, index) => (
        <View
          key={index}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Ionicons
              name="construct-outline"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.cardTitle}>
              Procedure {index + 1}
            </Text>

            <Pressable
              onPress={() =>
                setProcedures(
                  procedures.filter(
                    (_, i) =>
                      i !== index
                  )
                )
              }
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color="#ef4444"
              />
            </Pressable>
          </View>

          <AppTextField
            multiline
            placeholder="Procedure details..."
            value={item}
            onChangeText={(text) =>
              updateProcedure(
                text,
                index
              )
            }
          />
        </View>
      ))}

      <Pressable
        style={styles.button}
        onPress={() =>
          setProcedures([
            ...procedures,
            "",
          ])
        }
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={COLORS.white}
        />

        <Text style={styles.buttonText}>
          Add Procedure
        </Text>
      </Pressable>

      <Text style={styles.title}>
        Referrals
      </Text>

      {referrals.map((item, index) => (
        <View
          key={index}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Ionicons
              name="people-outline"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.cardTitle}>
              Referral {index + 1}
            </Text>

            <Pressable
              onPress={() =>
                setReferrals(
                  referrals.filter(
                    (_, i) =>
                      i !== index
                  )
                )
              }
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color="#ef4444"
              />
            </Pressable>
          </View>

          <AppTextField
            multiline
            placeholder="Referral details..."
            value={item}
            onChangeText={(text) =>
              updateReferral(
                text,
                index
              )
            }
          />
        </View>
      ))}

      <Pressable
        style={styles.button}
        onPress={() =>
          setReferrals([
            ...referrals,
            "",
          ])
        }
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={COLORS.white}
        />

        <Text style={styles.buttonText}>
          Add Referral
        </Text>
      </Pressable>
          </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOW,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  cardTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  button: {
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
});