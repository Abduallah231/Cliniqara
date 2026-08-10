import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import AppDropdown from "@/components/common/AppDropdown";
import governorates from "@/data/governorates";
import { createClinic } from "@/services/clinicApi";
import { loadClinics } from "@/services/clinicApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type WeekDay =
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

const DAYS: WeekDay[] = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

const DAY_LABELS: Record<WeekDay, string> = {
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

export default function CreateClinicScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const country = "Egypt";
  const [city, setCity] = useState("");

  const [workingDays, setWorkingDays] = useState(
    DAYS.map((day) => ({
      day,
      startTime: "",
      endTime: "",
      isClosed: true,
      is24Hours: false,
    })),
  );

  const [loading, setLoading] = useState(false);

  const [timePicker, setTimePicker] = useState<{
    day: WeekDay;
    field: "startTime" | "endTime";
  } | null>(null);

  const toggleDay = (day: WeekDay) => {
    setWorkingDays((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              isClosed: !item.isClosed,
            }
          : item,
      ),
    );
  };

  const toggle24Hours = (day: WeekDay) => {
    setWorkingDays((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              is24Hours: !item.is24Hours,
              startTime: "",
              endTime: "",
            }
          : item,
      ),
    );
  };

  const updateDay = (
    day: WeekDay,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setWorkingDays((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const parseTime = (time: string) => {
    if (!time) {
      return new Date();
    }

    const [timePart, period] = time.split(" ");
    const [hours, minutes] =
      timePart.split(":").map(Number);

    const date = new Date();

    let hour = hours;

    if (period === "AM") {
      if (hour === 12) {
        hour = 0;
      }
    } else {
      if (hour !== 12) {
        hour += 12;
      }
    }

    date.setHours(hour, minutes, 0, 0);

    return date;
  };

  const timeToMinutes = (time: string) => {
    const [timePart, period] = time.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);

    let hour = hours;

    if (period === "AM") {
      if (hour === 12) {
        hour = 0;
      }
    } else {
      if (hour !== 12) {
        hour += 12;
      }
    }

    return hour * 60 + minutes;
  };

  const isValidWorkingTime = (
    startTime: string,
    endTime: string,
  ) => {
    const opening = timeToMinutes(startTime);
    const closing = timeToMinutes(endTime);

    // Normal same-day shift
    if (closing > opening) {
      return true;
    }

    const startPeriod = startTime.split(" ")[1];
    const endPeriod = endTime.split(" ")[1];

    // Overnight shift is allowed only:
    // PM -> AM
    if (
      startPeriod === "PM" &&
      endPeriod === "AM"
    ) {
      return true;
    }

    return false;
  };

  const openTimePicker = (
    day: WeekDay,
    field: "startTime" | "endTime",
  ) => {
    setTimePicker({
      day,
      field,
    });
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Enter the clinic name.");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Required", "Enter the clinic phone number.");
      return;
    }

    if (!city.trim()) {
      Alert.alert("Required", "Select the governorate.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Required", "Enter the clinic address.");
      return;
    }

    for (const day of workingDays) {
      if (day.isClosed) {
        continue;
      }

      if (
        !day.is24Hours &&
        (!day.startTime || !day.endTime)
      ) {
        Alert.alert(
          "Required",
          `Select opening and closing time for ${DAY_LABELS[day.day]}.`,
        );
        return;
      }

      if (
        !day.is24Hours &&
        !isValidWorkingTime(
          day.startTime,
          day.endTime,
        )
      ) {
        Alert.alert(
          "Invalid Time",
          `Please select valid opening and closing times for ${DAY_LABELS[day.day]}.`,
        );
        return;
      }
    }

    try {
      setLoading(true);

      await createClinic({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        country: country.trim(),
        city: city.trim(),
        workingDays,
      });

      await loadClinics();

      Alert.alert(
        "Clinic Created",
        "Your clinic has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        "Unable to Create Clinic",
        error?.response?.data?.message ??
          "Something went wrong while creating the clinic.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Create Clinic"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Clinic Information" />

        <AppCard>
          <AppTextField
            label="Clinic Name"
            placeholder="Enter clinic name"
            value={name}
            onChangeText={setName}
          />

          <Divider />

          <AppTextField
            label="Phone Number"
            placeholder="Enter clinic phone"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Divider />

          <AppTextField
            label="Email"
            placeholder="Enter clinic email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Divider />

          <View>
            <Text style={styles.label}>Country</Text>
            <Text style={styles.fixedValue}>Egypt</Text>
          </View>

          <Divider />

          <AppDropdown
            label="Governorate"
            selected={governorates.find(
              (g) => g.label === city
            )}
            options={governorates}
            onChange={(option) =>
              setCity(option.label)
            }
          />

          <Divider />


          <AppTextField
            label="Address"
            placeholder="Enter clinic address"
            multiline
            value={address}
            onChangeText={setAddress}
          />
        </AppCard>

        <SectionHeader title="Working Days" />

        <AppCard>
          {workingDays.map((item) => (
            <View key={item.day}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>
                  {DAY_LABELS[item.day]}
                </Text>

                <AppButton
                  title={item.isClosed ? "Closed" : "Open"}
                  onPress={() => toggleDay(item.day)}
                />
              </View>

              {!item.isClosed && (
                <View>
                  <View style={styles.fullDayRow}>
                    <Text style={styles.timeLabel}>
                      Working Hours
                    </Text>

                    <AppButton
                      title={item.is24Hours ? "24 Hours" : "Set 24 Hours"}
                      variant={item.is24Hours ? "primary" : "secondary"}
                      onPress={() =>
                        toggle24Hours(item.day)
                      }
                    />
                  </View>

                  {!item.is24Hours && (
                    <View style={styles.timeRow}>
                      <View style={styles.timeField}>
                        <Text style={styles.timeLabel}>
                          Opening
                        </Text>

                        <AppButton
                          title={
                            item.startTime || "Select time"
                          }
                          variant="secondary"
                          onPress={() =>
                            openTimePicker(
                              item.day,
                              "startTime",
                            )
                          }
                        />
                      </View>

                      <View style={styles.timeField}>
                        <Text style={styles.timeLabel}>
                          Closing
                        </Text>

                        <AppButton
                          title={
                            item.endTime || "Select time"
                          }
                          variant="secondary"
                          onPress={() =>
                            openTimePicker(
                              item.day,
                              "endTime",
                            )
                          }
                        />
                      </View>
                    </View>
                  )}

                  {item.is24Hours && (
                    <Text style={styles.fullDayText}>
                      Open 24 hours
                    </Text>
                  )}
                </View>
              )}

              <Divider />
            </View>
          ))}

          {timePicker && (
            <DateTimePicker
              value={parseTime(
                workingDays.find(
                  (item) => item.day === timePicker.day,
                )?.[timePicker.field] ?? "",
              )}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                if (
                  event.type === "set" &&
                  selectedDate
                ) {
                  updateDay(
                    timePicker.day,
                    timePicker.field,
                    formatTime(selectedDate),
                  );
                }

                setTimePicker(null);
              }}
            />
          )}
        </AppCard>

        <AppButton
          title="Create Clinic"
          loading={loading}
          onPress={handleCreate}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },

  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },

  dayName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  timeRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  timeField: {
    flex: 1,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.secondaryText,
    marginBottom: SPACING.xs,
  },

  fixedValue: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },

  timeLabel: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.secondaryText,
    marginBottom: SPACING.xs,
  },

  fullDayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },

  fullDayText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.primary,
    paddingVertical: SPACING.sm,
  },
});