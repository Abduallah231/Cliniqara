import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/common/AppCard";
import AppButton from "@/components/common/AppButton";
import { useClinicStore } from "@/store/clinicStore";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  SHADOW,
} from "@/theme";

type Props = {
  onCreateClinic: () => void;
  onJoinClinic: () => void;
};

export default function ClinicSelector({
  onCreateClinic,
  onJoinClinic,
}: Props) {
  const {
    clinics,
    currentClinic,
    setCurrentClinic,
  } = useClinicStore();

  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>
        My Clinics
      </Text>

      {clinics.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.clinicsList}
        >
          {clinics.map((item) => {
            const selected =
              item.clinic.id ===
              currentClinic?.clinic.id;

            return (
              <Pressable
                key={item.clinic.id}
                style={[
                  styles.clinicRow,
                  selected && styles.selected,
                ]}
                onPress={() =>
                  setCurrentClinic(item)
                }
              >
                <View style={styles.icon}>
                  <Ionicons
                    name="business-outline"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.info}>
                  <Text
                    style={styles.name}
                    numberOfLines={1}
                  >
                    {item.clinic.name}
                  </Text>

                  <Text style={styles.role}>
                    {item.role}
                  </Text>
                </View>

                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={COLORS.primary}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="business-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            No Clinic Yet
          </Text>

          <Text style={styles.emptyText}>
            Create a new clinic or join an existing
            clinic using a join code.
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <AppButton
          title="Create New Clinic"
          icon="add-outline"
          style={styles.actionButton}
          onPress={onCreateClinic}
        />

        <Pressable
          style={styles.joinButton}
          onPress={onJoinClinic}
        >
          <Ionicons
            name="enter-outline"
            size={20}
            color={COLORS.primary}
          />

          <Text style={styles.joinButtonText}>
            Join Existing Clinic
          </Text>
        </Pressable>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    ...SHADOW,
    marginBottom: SPACING.lg,
  },

  clinicsList: {
    gap: SPACING.sm,
    paddingBottom: SPACING.xs,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  clinicRow: {
    width: 220,
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  selected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  name: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  role: {
    marginTop: 3,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    marginBottom: SPACING.sm,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptyText: {
    marginTop: 5,
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  joinButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  joinButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  actionButton: {
    flex: 1,
  },
});