import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";

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
    <View style={styles.container}>
      {value.map((item) => (
        <AppCard
          key={item.day}
        >
          <View
            style={[
              styles.dayCard,
              item.isClosed
                ? styles.closedDayCard
                : styles.openDayCard,
            ]}
          >
            {/* =========================
                Day Header
               ========================= */}
            <View
              style={
                styles.dayHeader
              }
            >
              <View
                style={
                  styles.dayTitleContainer
                }
              >
                <View
                  style={[
                    styles.dayIndicator,
                    item.isClosed
                      ? styles.closedIndicator
                      : styles.openIndicator,
                  ]}
                />

                <View>
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

                  <Text
                    style={[
                      styles.dayStatus,
                      item.isClosed
                        ? styles.closedStatus
                        : styles.openStatus,
                    ]}
                  >
                    {item.isClosed
                      ? "Clinic closed"
                      : "Clinic open"}
                  </Text>
                </View>
              </View>

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
                variant={
                  item.isClosed
                    ? "secondary"
                    : "primary"
                }
              />
            </View>

            {!item.isClosed && (
              <View
                style={
                  styles.dayContent
                }
              >
                {/* =========================
                    Working Hours Header
                   ========================= */}
                <View
                  style={
                    styles.workingHoursHeader
                  }
                >
                  <View
                    style={
                      styles.sectionTitleContainer
                    }
                  >
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      Working Hours
                    </Text>

                    <Text
                      style={
                        styles.sectionSubtitle
                      }
                    >
                      Set the clinic hours
                      for this day
                    </Text>
                  </View>

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

                {/* =========================
                    Shifts
                   ========================= */}
                {!item.is24Hours && (
                  <View
                    style={
                      styles.shiftsSection
                    }
                  >
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
                          {/* Shift Header */}
                          <View
                            style={
                              styles.shiftHeader
                            }
                          >
                            <View
                              style={
                                styles.shiftTitleContainer
                              }
                            >
                              <View
                                style={
                                  styles.shiftNumber
                                }
                              >
                                <Text
                                  style={
                                    styles.shiftNumberText
                                  }
                                >
                                  {shiftIndex +
                                    1}
                                </Text>
                              </View>

                              <View>
                                <Text
                                  style={
                                    styles.shiftTitle
                                  }
                                >
                                  Shift{" "}
                                  {shiftIndex +
                                    1}
                                </Text>

                                <Text
                                  style={
                                    styles.shiftSubtitle
                                  }
                                >
                                  Clinic working
                                  period
                                </Text>
                              </View>
                            </View>

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

                          {/* Time Fields */}
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
                                styles.timeSeparator
                              }
                            >
                              <View
                                style={
                                  styles.separatorDot
                                }
                              />
                              <Text
                                style={
                                  styles.separatorText
                                }
                              >
                                to
                              </Text>
                              <View
                                style={
                                  styles.separatorDot
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

                    {/* Add Shift */}
                    <View
                      style={
                        styles.addShiftContainer
                      }
                    >
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
                  </View>
                )}

                {/* =========================
                    24 Hours State
                   ========================= */}
                {item.is24Hours && (
                  <View
                    style={
                      styles.fullDayContainer
                    }
                  >
                    <View
                      style={
                        styles.fullDayIcon
                      }
                    >
                      <Text
                        style={
                          styles.fullDayIconText
                        }
                      >
                        24
                      </Text>
                    </View>

                    <View
                      style={
                        styles.fullDayContent
                      }
                    >
                      <Text
                        style={
                          styles.fullDayTitle
                        }
                      >
                        Open 24 Hours
                      </Text>

                      <Text
                        style={
                          styles.fullDayText
                        }
                      >
                        The clinic is available
                        throughout the entire day.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </AppCard>
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
                formatTime(
                  selectedDate,
                ),
              );
            }

            setTimePicker(
              null,
            );
          }}
          onDismiss={() => {
            setTimePicker(
              null,
            );
          }}
        />
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      gap: SPACING.md,
    },

    dayCard: {
      borderRadius: 16,
      padding: SPACING.md,
      borderWidth: 1,
    },

    openDayCard: {
      borderColor:
        "rgba(20, 184, 166, 0.35)",
      backgroundColor:
        "rgba(20, 184, 166, 0.035)",
    },

    closedDayCard: {
      borderColor:
        "rgba(100, 116, 139, 0.25)",
      backgroundColor:
        "rgba(100, 116, 139, 0.035)",
    },

    dayHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      gap: SPACING.md,
    },

    dayTitleContainer: {
      flex: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: SPACING.sm,
    },

    dayIndicator: {
      width: 10,
      height: 42,
      borderRadius: 6,
    },

    openIndicator: {
      backgroundColor:
        COLORS.primary,
    },

    closedIndicator: {
      backgroundColor:
        "#94A3B8",
    },

    dayName: {
      fontSize:
        TYPOGRAPHY.title,
      fontWeight: "800",
      color:
        COLORS.text,
      marginBottom:
        2,
    },

    dayStatus: {
      fontSize:
        TYPOGRAPHY.small,
      fontWeight: "600",
    },

    openStatus: {
      color:
        COLORS.primary,
    },

    closedStatus: {
      color:
        COLORS.secondaryText,
    },

    dayContent: {
      marginTop:
        SPACING.md,
      paddingTop:
        SPACING.md,
      borderTopWidth: 1,
      borderTopColor:
        "rgba(100, 116, 139, 0.16)",
    },

    workingHoursHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      gap: SPACING.md,
      marginBottom:
        SPACING.md,
    },

    sectionTitleContainer: {
      flex: 1,
    },

    sectionTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "800",
      color:
        COLORS.text,
      marginBottom:
        3,
    },

    sectionSubtitle: {
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
      lineHeight: 18,
    },

    shiftsSection: {
      gap: SPACING.sm,
    },

    shiftContainer: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        "rgba(59, 130, 246, 0.22)",
      backgroundColor:
        "rgba(59, 130, 246, 0.035)",
      padding: SPACING.md,
    },

    shiftHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      gap: SPACING.sm,
      marginBottom:
        SPACING.md,
    },

    shiftTitleContainer: {
      flex: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: SPACING.sm,
    },

    shiftNumber: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor:
        "rgba(59, 130, 246, 0.12)",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    shiftNumberText: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "800",
      color:
        "#2563EB",
    },

    shiftTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "800",
      color:
        COLORS.text,
      marginBottom:
        2,
    },

    shiftSubtitle: {
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
    },

    timeRow: {
      flexDirection:
        "row",
      alignItems:
        "flex-end",
      gap: SPACING.sm,
    },

    timeField: {
      flex: 1,
    },

    timeLabel: {
      fontSize:
        TYPOGRAPHY.small,
      fontWeight: "700",
      color:
        COLORS.secondaryText,
      marginBottom:
        SPACING.xs,
    },

    timeSeparator: {
      width: 28,
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingBottom:
        14,
      gap: 3,
    },

    separatorDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor:
        "#94A3B8",
    },

    separatorText: {
      fontSize: 11,
      fontWeight: "700",
      color:
        COLORS.secondaryText,
    },

    addShiftContainer: {
      marginTop:
        SPACING.xs,
    },

    fullDayContainer: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: SPACING.md,
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        "rgba(16, 185, 129, 0.28)",
      backgroundColor:
        "rgba(16, 185, 129, 0.07)",
      padding: SPACING.md,
    },

    fullDayIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor:
        "rgba(16, 185, 129, 0.15)",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    fullDayIconText: {
      fontSize: 14,
      fontWeight: "900",
      color:
        "#059669",
    },

    fullDayContent: {
      flex: 1,
    },

    fullDayTitle: {
      fontSize:
        TYPOGRAPHY.body,
      fontWeight: "800",
      color:
        "#047857",
      marginBottom:
        3,
    },

    fullDayText: {
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
      lineHeight: 18,
    },
  });