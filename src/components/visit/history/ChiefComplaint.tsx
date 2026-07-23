import AppChip from "@/components/common/AppChip";
import AppDropdown from "@/components/common/AppDropdown";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import chiefComplaints from "@/data/chiefComplaints";
import defaultQuickChiefComplaints from "@/data/defaultQuickChiefComplaints";
import { useVisitStore } from "@/store/visitStore";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ChiefComplaint() {
  const { visit, updateVisit } = useVisitStore();

  const chiefComplaint = visit.history.chiefComplaint;
  const complaint = chiefComplaint.complaintId
  ? {
      id: chiefComplaint.complaintId,
      label: chiefComplaint.complaintName,
    }
  : undefined;
  const updateChiefComplaint = (
    updates: Partial<typeof chiefComplaint>
  ) => {
    updateVisit({
      history: {
        ...visit.history,
        chiefComplaint: {
          ...chiefComplaint,
          ...updates,
        },
      },
    });
  };
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
        updateChiefComplaint({ complaintId: item.id, complaintName: item.label })
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
  onChange={(item) => updateChiefComplaint({ complaintId: item.id, complaintName: item.label })}
/>

<Divider />
<SectionHeader title="Duration" />
      <AppTextField
        value={chiefComplaint.durationValue}
        onChangeText={(text) => updateChiefComplaint({ durationValue: text })}
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
            selected={chiefComplaint.durationUnit === item}
            onPress={() =>
              updateChiefComplaint({ durationUnit: item })
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
      {chiefComplaint.complaintName || "No complaint selected"}
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