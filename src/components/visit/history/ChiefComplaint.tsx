import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import { useState } from "react";
import chiefComplaints from "@/data/chiefComplaints";
import AppDropdown from "@/components/common/AppDropdown";
import type { SelectionOption } from "@/models/selection";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import defaultQuickChiefComplaints from "@/data/defaultQuickChiefComplaints";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  complaint?: SelectionOption;
  setComplaint: (
    value: SelectionOption | undefined
  ) => void;
};

export default function ChiefComplaint({
  complaint,
  setComplaint,
}: Props) {
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] =
    useState("Days");
  const quickComplaints =
    defaultQuickChiefComplaints;

  const dropdownComplaints =
    chiefComplaints.filter(
      (complaint) =>
        !quickComplaints.some(
          (quick) =>
            quick.id === complaint.id
        )
    );
  return (
    <View
      style={{
        gap: SPACING.sm,
      }}
    >
<SectionHeader title="Chief Complaint" />

<Text style={styles.subTitle}>
  Quick Selection
</Text>

<View style={styles.quickRow}>
  {quickComplaints.map((item) => (
    <AppChip
      key={item.id}
      label={item.label}
      selected={
        complaint?.id === item.id
      }
      onPress={() =>
        setComplaint(item)
      }
    />
  ))}
</View>

<Divider />
<Text style={styles.subTitle}>
  All Chief Complaints
</Text>

<AppDropdown
  placeholder="Search all complaints..."
  selected={complaint}
  options={dropdownComplaints}
  onChange={setComplaint}
/>

<Divider />
<SectionHeader title="Duration" />
      <AppTextField
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g. 3"
        keyboardType="numeric"
      />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.xs,
        }}
      >
        {[
          "Hours",
          "Days",
          "Weeks",
          "Months",
          "Years",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={durationUnit === item}
            onPress={() =>
              setDurationUnit(item)
            }
          />
        ))}
      </View>

      <View
  style={{
    gap: SPACING.xs,
  }}
>
  <SectionHeader title="Selected Complaint" />


  <View style={styles.selectedComplaintBox}>
    
    <Text style={styles.selectedComplaintText}>
      {complaint?.label ?? "No complaint selected"}
    </Text>
  </View>
</View>
    </View>
  );
}
const styles = StyleSheet.create({
selectedComplaintBox: {
  minHeight: 48,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 12,
  backgroundColor: COLORS.card,
  justifyContent: "center",
  paddingHorizontal: SPACING.md,
},

selectedComplaintText: {
  color: COLORS.text,
  fontSize: TYPOGRAPHY.body,
  fontWeight: "500",
},
label: {
  fontSize: TYPOGRAPHY.small,
  fontWeight: "600",
  color: COLORS.text,
  marginBottom: SPACING.xs,
},
quickRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: SPACING.xs,
},
subTitle: {
  fontSize: TYPOGRAPHY.small,
  fontWeight: "600",
  color: COLORS.secondaryText,
  marginBottom: SPACING.xs,
},
});