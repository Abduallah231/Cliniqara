import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppDropdown from "@/components/common/AppDropdown";
import investigations from "@/data/investigations";
import { useVisitStore } from "@/store/visitStore";
import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  onOpenResults: () => void;
};

export default function InvestigationSection({
  onOpenResults,
}: Props) {
  const investigationsState =
    useVisitStore(
      (state) =>
        state.visit.assessment
          .investigations
    );

  const addRequestedInvestigation =
    useVisitStore(
      (state) =>
        state.addRequestedInvestigation
    );

  const removeRequestedInvestigation =
    useVisitStore(
      (state) =>
        state.removeRequestedInvestigation
    );

  const investigationOptions =
    investigations
      .filter(
        (item) =>
          !investigationsState.requestedInvestigations.some(
            (x) =>
              x.name === item.name
          )
      )
      .map((item) => ({
        id: item.name,
        label: item.name,
      }));

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>
        Search Investigation
      </Text>

      <AppDropdown
        placeholder="Search investigation..."
        selected={undefined}
        options={
          investigationOptions
        }
        onChange={(item) =>
          addRequestedInvestigation({
            name: item.label,
            status: "requested",
          })
        }
      />

      <Text style={styles.title}>
        Requested
        Investigations
      </Text>

      {investigationsState.requestedInvestigations.map(
        (item) => (
          <View
            key={item.name}
            style={styles.card}
          >
            <View
              style={
                styles.cardHeader
              }
            >
              <Ionicons
                name="flask-outline"
                size={20}
                color={
                  COLORS.primary
                }
              />

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={
                    styles.cardTitle
                  }
                >
                  {item.name}
                </Text>

                <Text
                  style={
                    styles.cardSubtitle
                  }
                >
                  {item.status}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  removeRequestedInvestigation(
                    item.name
                  )
                }
              >
                <Ionicons
                  name="close-circle"
                  size={22}
                  color={
                    COLORS.danger
                  }
                />
              </Pressable>
            </View>
          </View>
        )
      )}
            {investigationsState
        .requestedInvestigations
        .length > 0 && (
        <Pressable
          style={styles.openButton}
          onPress={onOpenResults}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={COLORS.white}
          />
          <Text
            style={
              styles.openButtonText
            }
          >
            Enter Results
          </Text>
        </Pressable>
      )}
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

  aiCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },

  emptyText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    textAlign: "center",
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOW,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  cardTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    textTransform: "capitalize",
  },

  openButton: {
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.sm,
    ...SHADOW,
  },

  openButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
});