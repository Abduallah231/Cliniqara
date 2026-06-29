import { useState } from "react";


import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";


const COMMON_COMPLAINTS = [
  "Fever",
  "Cough",
  "Dyspnea",
  "Chest Pain",
  "Palpitations",
  "Headache",
  "Abdominal Pain",
  "Vomiting",
  "Diarrhea",
  "Dizziness",
];

type Props = {
  complaint: string;
  setComplaint: (value: string) => void;
};

export default function ChiefComplaint({
  complaint,
  setComplaint,
}: Props) {
  const [search, setSearch] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] =
    useState("Days");

  const filteredComplaints =
    COMMON_COMPLAINTS.filter((item) =>
      item
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <View
      style={{
        gap: SPACING.sm,
      }}
    >
      <View
  style={{
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.sm,
  }}
>
  <View style={{ flex: 1 }}>
    <AppTextField
      label="Search Complaint"
      placeholder="Search complaint..."
      value={search}
      onChangeText={setSearch}
    />
  </View>

  <AppButton
    title="Add"
    onPress={() => {
      if (search.trim()) {
        setComplaint(search.trim());
      }
    }}
    style={{
      width: 90,
      marginBottom: 2,
    }}
  />
</View>

      
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.xs,
        }}
      >
        {filteredComplaints.map((item) => (
          <AppChip
            
            key={item}
            label={item}
            selected={complaint === item}
            onPress={() =>
              setComplaint(item)
            }
          />
        ))}
      </View>

      <AppTextField
        label="Duration"
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
  <Text style={styles.label}>
    Selected Complaint
  </Text>

  <View style={styles.selectedComplaintBox}>
    <Text style={styles.selectedComplaintText}>
      {complaint || "No complaint selected"}
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
});