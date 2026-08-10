import {
  useState,
} from "react";

import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import Divider from "@/components/common/Divider";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export type WeekDay =
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

export type ClinicShift = {
  startTime: string;
  endTime: string;
};

export type WorkingDay = {
  day: WeekDay;
  isClosed: boolean;
  is24Hours: boolean;
  shifts: ClinicShift[];
};

export const DAYS: WeekDay[] = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

export const DAY_LABELS: Record<
  WeekDay,
  string
> = {
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

type Props = {
  value: WorkingDay[];
  onChange: (value: WorkingDay[]) => void;
};

type TimePickerState = {
  day: WeekDay;
  shiftIndex: number;
  field: "startTime" | "endTime";
};

export default function ClinicWorkingDays({
  value,
  onChange,
}: Props) {
  const [timePicker, setTimePicker] =
    useState<TimePickerState | null>(
      null,
    );

  const toggleDay = (
    day: WeekDay,
  ) => {
    onChange(
      value.map((item) => {
        if (item.day !== day) {
          return item;
        }

        const opening =
          item.isClosed;

        return {
          ...item,

          isClosed:
            !item.isClosed,

          shifts:
            opening &&
            !item.is24Hours
              ? [
                  {
                    startTime: "",
                    endTime: "",
                  },
                ]
              : [],
        };
      }),
    );
  };

  const toggle24Hours = (
    day: WeekDay,
  ) => {
    onChange(
      value.map((item) => {
        if (item.day !== day) {
          return item;
        }

        const enabling24Hours =
          !item.is24Hours;

        return {
          ...item,

          is24Hours:
            enabling24Hours,

          shifts:
            enabling24Hours
              ? []
              : [
                  {
                    startTime: "",
                    endTime: "",
                  },
                ],
        };
      }),
    );
  };

  const updateShift = (
    day: WeekDay,
    shiftIndex: number,
    field:
      | "startTime"
      | "endTime",
    newValue: string,
  ) => {
    onChange(
      value.map((item) =>
        item.day === day
          ? {
              ...item,

              shifts:
                item.shifts.map(
                  (
                    shift,
                    index,
                  ) =>
                    index ===
                    shiftIndex
                      ? {
                          ...shift,
                          [field]:
                            newValue,
                        }
                      : shift,
                ),
            }
          : item,
      ),
    );
  };

  const addShift = (
    day: WeekDay,
  ) => {
    onChange(
      value.map((item) =>
        item.day === day
          ? {
              ...item,

              shifts: [
                ...item.shifts,
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            }
          : item,
      ),
    );
  };

  const removeShift = (
    day: WeekDay,
    shiftIndex: number,
  ) => {
    onChange(
      value.map((item) =>
        item.day === day
          ? {
              ...item,

              shifts:
                item.shifts.filter(
                  (_, index) =>
                    index !==
                    shiftIndex,
                ),
            }
          : item,
      ),
    );
  };

  const formatTime = (
    date: Date,
  ) => {
    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      },
    );
  };

  const parseTime = (
    time: string,
  ) => {
    if (!time) {
      return new Date();
    }

    const [
      timePart,
      period,
    ] = time.split(" ");

    const [
      hours,
      minutes,
    ] = timePart
      .split(":")
      .map(Number);

    const date =
      new Date();

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

    date.setHours(
      hour,
      minutes,
      0,
      0,
    );

    return date;
  };

  const openTimePicker = (
    day: WeekDay,
    shiftIndex: number,
    field:
      | "startTime"
      | "endTime",
  ) => {
    setTimePicker({
      day,
      shiftIndex,
      field,
    });
  };

  return (
    <AppCard>
      {value.map((item) => (
        <View
          key={item.day}
        >
          <View
            style={
              styles.dayHeader
            }
          >
            <Text
              style={
                styles.dayName
              }
            >
              {
                DAY_LABELS[
                  item.day
                ]
              }
            </Text>

            <AppButton
              title={
                item.isClosed
                  ? "Closed"
                  : "Open"
              }
              onPress={() =>
                toggleDay(
                  item.day,
                )
              }
            />
          </View>

          {!item.isClosed && (
            <View>
              <View
                style={
                  styles.fullDayRow
                }
              >
                <Text
                  style={
                    styles.timeLabel
                  }
                >
                  Working Hours
                </Text>

                <AppButton
                  title={
                    item.is24Hours
                      ? "24 Hours"
                      : "Set 24 Hours"
                  }
                  variant={
                    item.is24Hours
                      ? "primary"
                      : "secondary"
                  }
                  onPress={() =>
                    toggle24Hours(
                      item.day,
                    )
                  }
                />
              </View>

              {!item.is24Hours && (
                <View>
                  {item.shifts.map(
                    (
                      shift,
                      shiftIndex,
                    ) => (
                      <View
                        key={`${item.day}-${shiftIndex}`}
                        style={
                          styles.shiftContainer
                        }
                      >
                        <View
                          style={
                            styles.shiftHeader
                          }
                        >
                          <Text
                            style={
                              styles.shiftTitle
                            }
                          >
                            Shift{" "}
                            {shiftIndex +
                              1}
                          </Text>

                          {item
                            .shifts
                            .length >
                            1 && (
                            <AppButton
                              title="Remove"
                              variant="secondary"
                              onPress={() =>
                                removeShift(
                                  item.day,
                                  shiftIndex,
                                )
                              }
                            />
                          )}
                        </View>

                        <View
                          style={
                            styles.timeRow
                          }
                        >
                          <View
                            style={
                              styles.timeField
                            }
                          >
                            <Text
                              style={
                                styles.timeLabel
                              }
                            >
                              Opening
                            </Text>

                            <AppButton
                              title={
                                shift.startTime ||
                                "Select time"
                              }
                              variant="secondary"
                              onPress={() =>
                                openTimePicker(
                                  item.day,
                                  shiftIndex,
                                  "startTime",
                                )
                              }
                            />
                          </View>

                          <View
                            style={
                              styles.timeField
                            }
                          >
                            <Text
                              style={
                                styles.timeLabel
                              }
                            >
                              Closing
                            </Text>

                            <AppButton
                              title={
                                shift.endTime ||
                                "Select time"
                              }
                              variant="secondary"
                              onPress={() =>
                                openTimePicker(
                                  item.day,
                                  shiftIndex,
                                  "endTime",
                                )
                              }
                            />
                          </View>
                        </View>
                      </View>
                    ),
                  )}

                  <AppButton
                    title="+ Add Shift"
                    variant="secondary"
                    onPress={() =>
                      addShift(
                        item.day,
                      )
                    }
                  />
                </View>
              )}

              {item.is24Hours && (
                <Text
                  style={
                    styles.fullDayText
                  }
                >
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
            value.find(
              (item) =>
                item.day ===
                timePicker.day,
            )?.shifts[
              timePicker.shiftIndex
            ]?.[
              timePicker.field
            ] ?? "",
          )}
          mode="time"
          is24Hour={false}
          display="default"
          onValueChange={(
            _event,
            selectedDate,
            ) => {
            if (selectedDate) {
                updateShift(
                timePicker.day,
                timePicker.shiftIndex,
                timePicker.field,
                formatTime(selectedDate),
                );
            }

            setTimePicker(null);
          }}
          onDismiss={() => {
            setTimePicker(
              null,
            );
          }}
        />
      )}
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    dayHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom:
        SPACING.sm,
    },

    dayName: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "700",
      color:
        COLORS.text,
    },

    timeRow: {
      flexDirection:
        "row",
      gap: SPACING.md,
    },

    timeField: {
      flex: 1,
    },

    timeLabel: {
      fontSize:
        TYPOGRAPHY.small,
      fontWeight: "600",
      color:
        COLORS.secondaryText,
      marginBottom:
        SPACING.xs,
    },

    fullDayRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom:
        SPACING.md,
    },

    fullDayText: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "600",
      color:
        COLORS.primary,
      paddingVertical:
        SPACING.sm,
    },

    shiftContainer: {
      marginBottom:
        SPACING.md,
    },

    shiftHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom:
        SPACING.sm,
    },

    shiftTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "700",
      color:
        COLORS.text,
    },
  });