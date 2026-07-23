import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppTextField from "@/components/common/AppTextField";
import { useVisitStore } from "@/store/visitStore";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function ProceduresReferralsSection() {
  const procedures =
    useVisitStore(
      (state) =>
        state.visit.assessment
          .proceduresReferrals
          .procedures
    );

  const referrals =
    useVisitStore(
      (state) =>
        state.visit.assessment
          .proceduresReferrals
          .referrals
    );

  const addProcedure =
    useVisitStore(
      (state) =>
        state.addProcedure
    );

  const updateProcedure =
    useVisitStore(
      (state) =>
        state.updateProcedure
    );

  const removeProcedure =
    useVisitStore(
      (state) =>
        state.removeProcedure
    );

  const addReferral =
    useVisitStore(
      (state) =>
        state.addReferral
    );

  const updateReferral =
    useVisitStore(
      (state) =>
        state.updateReferral
    );

  const removeReferral =
    useVisitStore(
      (state) =>
        state.removeReferral
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Procedures
      </Text>

      {procedures.map(
        (item, index) => (
          <View
            key={index}
            style={styles.card}
          >
            <View
              style={
                styles.cardHeader
              }
            >
              <Ionicons
                name="construct-outline"
                size={20}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.cardTitle
                }
              >
                Procedure{" "}
                {index + 1}
              </Text>

              <Pressable
                onPress={() =>
                  removeProcedure(
                    index
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
              value={item.details}
              onChangeText={(
                text
              ) =>
                updateProcedure(
                  index,
                  text
                )
              }
            />
          </View>
        )
      )}

      <Pressable
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

        <Text
          style={styles.buttonText}
        >
          Add Procedure
        </Text>
      </Pressable>

      <Text style={styles.title}>
        Referrals
      </Text>

      {referrals.map(
        (item, index) => (
          <View
            key={index}
            style={styles.card}
          >
            <View
              style={
                styles.cardHeader
              }
            >
              <Ionicons
                name="people-outline"
                size={20}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.cardTitle
                }
              >
                Referral{" "}
                {index + 1}
              </Text>

              <Pressable
                onPress={() =>
                  removeReferral(
                    index
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
              value={item.details}
              onChangeText={(
                text
              ) =>
                updateReferral(
                  index,
                  text
                )
              }
            />
          </View>
        )
      )}
            <Pressable
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

        <Text
          style={styles.buttonText}
        >
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