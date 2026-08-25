import AppChip from "@/components/common/AppChip";
import AppDropdown from "@/components/common/AppDropdown";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import { useEffect, useState } from "react";
import { getChiefComplaints } from "@/services/chiefComplaintApi";
import { saveChiefComplaint } from "@/services/visitApi";
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
  const {
    visit,
    setChiefComplaint,
    updateVisit,
  } = useVisitStore();

  const chiefComplaint = visit.history.chiefComplaint;
  const visitId = visit.metadata.id;
  const [complaints, setComplaints] = useState<
    { id: string; label: string }[]
  >([]);

  useEffect(() => {
    async function loadComplaints() {
      try {
        const data = await getChiefComplaints();

        setComplaints(
          data.map((item: any) => ({
            id: item.id,
            label: item.name,
          }))
        );
      } catch (e) {
        console.error(e);
      }
    }

    loadComplaints();
  }, []);
  const complaint = chiefComplaint.complaintId
  ? {
      id: chiefComplaint.complaintId,
      label: chiefComplaint.complaintName,
    }
  : undefined;

  const updateChiefComplaint = async (
    updates: Partial<typeof chiefComplaint>
  ) => {
    const updatedChiefComplaint = {
      ...chiefComplaint,
      ...updates,
    };

    if (
      updates.complaintId &&
      updates.complaintId !== chiefComplaint.complaintId
    ) {
      setChiefComplaint(
        updates.complaintId,
        updates.complaintName ?? ""
      );
    } else {
      updateVisit({
        history: {
          ...visit.history,
          chiefComplaint: updatedChiefComplaint,
        },
      });
    }

    if (
      !visitId ||
      !updatedChiefComplaint.complaintId
    ) {
      return;
    }

    try {
      const payload: {
        durationValue?: number;
        durationUnit?:
          | "HOURS"
          | "DAYS"
          | "WEEKS"
          | "MONTHS"
          | "YEARS";
      } = {};

      if (
        typeof updatedChiefComplaint.durationValue === "number" &&
        Number.isInteger(updatedChiefComplaint.durationValue) &&
        updatedChiefComplaint.durationValue >= 0
      ) {
        payload.durationValue =
          updatedChiefComplaint.durationValue;
      }

      const validDurationUnits = [
        "HOURS",
        "DAYS",
        "WEEKS",
        "MONTHS",
        "YEARS",
      ] as const;

      if (
        updatedChiefComplaint.durationUnit &&
        validDurationUnits.includes(
          updatedChiefComplaint.durationUnit
        )
      ) {
        payload.durationUnit =
          updatedChiefComplaint.durationUnit;
      }

      console.log(
        "CHIEF COMPLAINT PAYLOAD:",
        {
          visitId,
          chiefComplaintId:
            updatedChiefComplaint.complaintId,
          payload,
        }
      );

      await saveChiefComplaint(
        visitId,
        updatedChiefComplaint.complaintId,
        payload,
      );
    } catch (error: any) {
      console.error(
        "Failed to save chief complaint:",
        error?.response?.data ?? error,
      );
    }
  };

  const quickComplaints = complaints.slice(0, 8);

  const dropdownComplaints = complaints.filter(
    (complaint) =>
      !quickComplaints.some(
        (quick) => quick.id === complaint.id
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
        value={
          chiefComplaint.durationValue === undefined
            ? ""
            : String(chiefComplaint.durationValue)
        }
        onChangeText={(text) =>
          updateChiefComplaint({
            durationValue:
              text === "" ? undefined : Number(text),
          })
        }
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
          { label: "Hours", value: "HOURS" as const },
          { label: "Days", value: "DAYS" as const },
          { label: "Weeks", value: "WEEKS" as const },
          { label: "Months", value: "MONTHS" as const },
          { label: "Years", value: "YEARS" as const },
        ].map((item) => (
          <AppChip
            key={item.value}
            label={item.label}
            selected={chiefComplaint.durationUnit === item.value}
            onPress={() =>
              updateChiefComplaint({
                durationUnit: item.value,
              })
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