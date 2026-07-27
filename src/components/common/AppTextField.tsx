import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SIZING,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;

  icon?: keyof typeof Ionicons.glyphMap;

  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;

  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;

  disabled?: boolean;
  editable?: boolean;

  style?: StyleProp<ViewStyle>;

  showLabel?: boolean;

  maxLength?: number;

  autoFocus?: boolean;

  autoCapitalize?:
    | "none"
    | "sentences"
    | "words"
    | "characters";
};

export default function AppTextField({
  label = "",
  value = "",
  onChangeText = () => {},
  placeholder,

  showLabel = true,

  required = false,

  error,

  icon,

  rightIcon,
  onRightIconPress,

  multiline = false,

  secureTextEntry = false,

  keyboardType = "default",

  disabled = false,

  editable = true,

  style,

  maxLength,

  autoFocus = false,

  autoCapitalize = "sentences",
}: Props) {
  return (
    <View style={style}>
      {showLabel && label.length > 0 && (
        <Text style={styles.label}>
          {label}

          {required && (
            <Text style={styles.required}>
              {" *"}
            </Text>
          )}
        </Text>
      )}

      <View
        style={[
          styles.container,
          error && styles.errorContainer,
          (disabled || !editable) &&
            styles.disabledContainer,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={SIZING.iconMd}
            color={COLORS.secondaryText}
            style={styles.icon}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          editable={!disabled && editable}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          style={[
            styles.input,
            multiline && styles.multiline,
          ]}
        />

        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={SIZING.iconMd}
            color={COLORS.secondaryText}
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  required: {
    color: COLORS.danger,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    minHeight: SIZING.inputHeight,
    ...SHADOW,
  },

  errorContainer: {
    borderColor: COLORS.danger,
  },

  disabledContainer: {
    opacity: 0.65,
    backgroundColor: COLORS.card,
  },

  icon: {
    marginRight: SPACING.md,
  },

  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body,
    paddingVertical: SPACING.md,
  },

  multiline: {
    minHeight: 60,
    textAlignVertical: "top",
  },

  error: {
    color: COLORS.danger,
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.small,
  },

  rightIcon: {
    marginLeft: SPACING.md,
  },
});