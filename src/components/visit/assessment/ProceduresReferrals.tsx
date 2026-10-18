import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import AppTextField from "@/components/common/AppTextField";

import { useVisitStore } from "@/store/visitStore";

import { useProceduresReferralsAutoSave } from "@/hooks/useProceduresReferralsAutoSave";

import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";

export default function ProceduresReferralsSection() {
  const procedures = useVisitStore(
    state =>
      state.visit.assessment
        .proceduresReferrals.procedures
  );

  const referrals = useVisitStore(
    state =>
      state.visit.assessment
        .proceduresReferrals.referrals
  );

  const addProcedure =
    useVisitStore(state => state.addProcedure);

  const updateProcedure =
    useVisitStore(state => state.updateProcedure);

  const removeProcedure =
    useVisitStore(state => state.removeProcedure);

  const addReferral =
    useVisitStore(state => state.addReferral);

  const updateReferral =
    useVisitStore(state => state.updateReferral);

  const removeReferral =
    useVisitStore(state => state.removeReferral);

  /*
   * ==========================================
   * VISIT ID
   * ==========================================
   */

  const visitId = useVisitStore(
    state => state.visit.metadata.id
  );

  /*
   * ==========================================
   * HYDRATION
   * ==========================================
   */

  const [
    isHydrating,
    setIsHydrating,
  ] = useState(true);

  const [
    loadedVisitId,
    setLoadedVisitId,
  ] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    /*
     * No visit yet.
     */
    if (!visitId) {
      setIsHydrating(false);
      setLoadedVisitId(undefined);
      return;
    }

    /*
     * Already loaded this visit.
     */
    if (loadedVisitId === visitId) {
      return;
    }

    setIsHydrating(true);
    setLoadedVisitId(undefined);

    /*
     * The actual GET + Zustand hydration
     * is handled by the autosave hook.
     *
     * Give it one render cycle to complete
     * before enabling autosave.
     */
    const timer = setTimeout(() => {
      setLoadedVisitId(visitId);
      setIsHydrating(false);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    loadedVisitId,
  ]);

  useProceduresReferralsAutoSave({
    visitId,
    isHydrating,
  });

  return (
    <AppView style={styles.container}>
      <AppText style={styles.title}>
        Procedures
      </AppText>

      {procedures.map((item, index) => (
        <AppView
          key={index}
          style={styles.card}
        >
          <AppView style={styles.cardHeader}>
            <Ionicons
              name="construct-outline"
              size={20}
              color={COLORS.primary}
            />

            <AppText style={styles.cardTitle}>
              Procedure {index + 1}
            </AppText>

            <AppPressable
              onPress={() =>
                removeProcedure(index)
              }
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color="#ef4444"
              />
            </AppPressable>
          </AppView>

          <AppTextField
            multiline
            placeholder="Procedure details..."
            value={item.details}
            onChangeText={text =>
              updateProcedure(
                index,
                text
              )
            }
          />
        </AppView>
      ))}

      <AppPressable
        style={styles.button}
        onPress={() =>
          addProcedure({
            details: "",
          })
        }
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={COLORS.white}
        />

        <AppText style={styles.buttonText}>
          Add Procedure
        </AppText>
      </AppPressable>

      <AppText style={styles.title}>
        Referrals
      </AppText>

      {referrals.map((item, index) => (
        <AppView
          key={index}
          style={styles.card}
        >
          <AppView style={styles.cardHeader}>
            <Ionicons
              name="people-outline"
              size={20}
              color={COLORS.primary}
            />

            <AppText style={styles.cardTitle}>
              Referral {index + 1}
            </AppText>

            <AppPressable
              onPress={() =>
                removeReferral(index)
              }
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color="#ef4444"
              />
            </AppPressable>
          </AppView>

          <AppTextField
            multiline
            placeholder="Referral details..."
            value={item.details}
            onChangeText={text =>
              updateReferral(
                index,
                text
              )
            }
          />
        </AppView>
      ))}

      <AppPressable
        style={styles.button}
        onPress={() =>
          addReferral({
            details: "",
          })
        }
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={COLORS.white}
        />

        <AppText style={styles.buttonText}>
          Add Referral
        </AppText>
      </AppPressable>
    </AppView>
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