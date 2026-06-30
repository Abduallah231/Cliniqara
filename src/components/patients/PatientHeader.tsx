import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";



import { PatientSummary } from "@/models";

import {
  COLORS,
  SIZING,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  patient: PatientSummary;

  onToggleFavorite?: (patient: PatientSummary) => void;

  style?: StyleProp<ViewStyle>;
};

export default function PatientHeader({
  patient,
  onToggleFavorite,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
     

      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={styles.name}
        >
          {patient.fullName}
        </Text>

        <Text style={styles.id}>
          ID: {patient.id}
        </Text>
      </View>

      <Pressable
        onPress={() =>
          onToggleFavorite?.(patient)
        }
        style={styles.favorite}
      >
        <Ionicons
          name={
            patient.isFavorite
              ? "star"
              : "star-outline"
          }
          size={SIZING.iconLg}
          color={COLORS.warning}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    alignItems: "center",
  },

  info: {
    flex: 1,

    marginLeft: SPACING.md,
  },

  name: {
    color: COLORS.text,

    fontSize: TYPOGRAPHY.body,

    fontWeight: "700",
  },

  id: {
    marginTop: 2,

    color: COLORS.secondaryText,

    fontSize: TYPOGRAPHY.small,
  },

  favorite: {
    width: SIZING.touchTarget,

    height: SIZING.touchTarget,

    alignItems: "center",

    justifyContent: "center",
  },
});