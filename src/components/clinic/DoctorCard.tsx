import Ionicons from "@expo/vector-icons/Ionicons";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
} from "@/theme";

type Props = {
  name?: string;
  specialty?: string;
  days?: string;
  hours?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function DoctorCard({
  name = "Dr. Ahmed Hassan",
  specialty = "Family Medicine",
  days = "Sun • Mon • Tue",
  hours = "09:00 AM - 03:00 PM",
  onEdit,
  onDelete,
}: Props) {
  return (
    <AppCard>

      <View style={styles.header}>
        <Ionicons
          name="person-outline"
          size={24}
          color={COLORS.primary}
        />

        <View style={styles.info}>
          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.subtitle}>
            {specialty}
          </Text>
        </View>
      </View>

      <Text style={styles.details}>
        {days}
      </Text>

      <Text style={styles.details}>
        {hours}
      </Text>

      <View style={styles.actions}>
        <AppButton
          title="Edit"
          icon="create-outline"
          variant="secondary"
          style={styles.button}
          onPress={onEdit}
        />

        <AppButton
          title="Delete"
          icon="trash-outline"
          variant="secondary"
          style={styles.button}
          onPress={onDelete}
        />
      </View>

    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  details: {
    marginTop: SPACING.md,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },

  button: {
    flex: 1,
  },
});