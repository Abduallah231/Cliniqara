import {
  Text,
} from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import JoinCodeCard from "@/components/clinic/JoinCodeCard";

import type { JoinCode } from "@/types/clinic";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  joinCode: JoinCode | null;
  loading: boolean;
  onGenerate: () => void;
};

export default function ClinicJoinAccess({
  joinCode,
  loading,
  onGenerate,
}: Props) {
  return (
    <AppCard>
      <Text
        style={{
          color: COLORS.secondaryText,
          fontSize: TYPOGRAPHY.body,
          lineHeight: 22,
          marginBottom: SPACING.md,
        }}
      >
        Generate a temporary code that doctors or
        reception staff can use to request access to
        this clinic.
      </Text>

      <AppButton
        title={
          joinCode
            ? "Generate New Join Code"
            : "Generate Join Code"
        }
        loading={loading}
        onPress={onGenerate}
      />

      {joinCode && (
        <JoinCodeCard
          code={joinCode.code}
          expiresAt={joinCode.expiresAt}
        />
      )}
    </AppCard>
  );
}