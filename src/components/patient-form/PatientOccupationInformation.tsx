import AppCard from "@/components/common/AppCard";
import AppDropdown from "@/components/common/AppDropdown";
import AppTextField from "@/components/common/AppTextField";
import SectionHeader from "@/components/common/SectionHeader";

import occupations from "@/data/occupations";

import {
  SPACING,
} from "@/theme";

type Props = {
  occupation: string;
  otherOccupation?: string;

  onOccupationChange: (
    value: string,
  ) => void;

  onOtherOccupationChange?: (
    value: string,
  ) => void;
};

export default function PatientOccupationInformation({
  occupation,
  otherOccupation,
  onOccupationChange,
  onOtherOccupationChange,
}: Props) {
  return (
    <AppCard style={styles.card}>
      <SectionHeader title="Occupation" />

      <AppDropdown
        label="Occupation"
        selected={occupations.find(
          (item) =>
            item.label === occupation,
        )}
        options={occupations}
        onChange={(option) =>
          onOccupationChange(
            option.label,
          )
        }
      />

      {occupation === "Other" &&
        onOtherOccupationChange && (
            <AppTextField
            placeholder="Specify occupation"
            value={otherOccupation ?? ""}
            onChangeText={
                onOtherOccupationChange
            }
            />
        )}
    </AppCard>
  );
}

const styles = {
  card: {
    marginTop: SPACING.xs,
  },
};