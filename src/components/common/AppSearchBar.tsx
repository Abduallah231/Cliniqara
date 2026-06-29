
import { Ionicons } from "@expo/vector-icons";

import AppTextField from "./AppTextField";

type Props = {
  value: string;

  onChangeText: (text: string) => void;

  placeholder?: string;
};

export default function AppSearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
}: Props) {
  return (
    <AppTextField
      label="Search"
      showLabel={false}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      icon={"search" as keyof typeof Ionicons.glyphMap}
    />
  );
}