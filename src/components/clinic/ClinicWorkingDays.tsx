import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import { COLORS, SPACING, TYPOGRAPHY, } from "@/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useState, } from "react";
import { StyleSheet } from "react-native";

import type {
  WeekDay,
  WorkingDay,
} from "@/types/clinic";

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
    <AppView style={styles.container}>
      {value.map((item) => (
        <AppCard
          key={item.day}
        >
          <AppView
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
            <AppView
              style={
                styles.dayHeader
              }
            >
              <AppView
                style={
                  styles.dayTitleContainer
                }
              >
                <AppView
                  style={[
                    styles.dayIndicator,
                    item.isClosed
                      ? styles.closedIndicator
                      : styles.openIndicator,
                  ]}
                />

                <AppView>
                  <AppText
                    style={
                      styles.dayName
                    }
                  >
                    {
                      DAY_LABELS[
                        item.day
                      ]
                    }
                  </AppText>

                  <AppText
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
                  </AppText>
                </AppView>
              </AppView>

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
            </AppView>

            {!item.isClosed && (
              <AppView
                style={
                  styles.dayContent
                }
              >
                {/* =========================
                    Working Hours Header
                   ========================= */}
                <AppView
                  style={
                    styles.workingHoursHeader
                  }
                >
                  <AppView
                    style={
                      styles.sectionTitleContainer
                    }
                  >
                    <AppText
                      style={
                        styles.sectionTitle
                      }
                    >
                      Working Hours
                    </AppText>

                    <AppText
                      style={
                        styles.sectionSubtitle
                      }
                    >
                      Set the clinic hours
                      for this day
                    </AppText>
                  </AppView>

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
                </AppView>

                {/* =========================
                    Shifts
                   ========================= */}
                {!item.is24Hours && (
                  <AppView
                    style={
                      styles.shiftsSection
                    }
                  >
                    {item.shifts.map(
                      (
                        shift,
                        shiftIndex,
                      ) => (
                        <AppView
                          key={`${item.day}-${shiftIndex}`}
                          style={
                            styles.shiftContainer
                          }
                        >
                          {/* Shift Header */}
                          <AppView
                            style={
                              styles.shiftHeader
                            }
                          >
                            <AppView
                              style={
                                styles.shiftTitleContainer
                              }
                            >
                              <AppView
                                style={
                                  styles.shiftNumber
                                }
                              >
                                <AppText
                                  style={
                                    styles.shiftNumberText
                                  }
                                >
                                  {shiftIndex +
                                    1}
                                </AppText>
                              </AppView>

                              <AppView>
                                <AppText
                                  style={
                                    styles.shiftTitle
                                  }
                                >
                                  Shift{" "}
                                  {shiftIndex +
                                    1}
                                </AppText>

                                <AppText
                                  style={
                                    styles.shiftSubtitle
                                  }
                                >
                                  Clinic working
                                  period
                                </AppText>
                              </AppView>
                            </AppView>

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
                          </AppView>

                          {/* Time Fields */}
                          <AppView
                            style={
                              styles.timeRow
                            }
                          >
                            <AppView
                              style={
                                styles.timeField
                              }
                            >
                              <AppText
                                style={
                                  styles.timeLabel
                                }
                              >
                                Opening
                              </AppText>

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
                            </AppView>

                            <AppView
                              style={
                                styles.timeSeparator
                              }
                            >
                              <AppView
                                style={
                                  styles.separatorDot
                                }
                              />
                              <AppText
                                style={
                                  styles.separatorText
                                }
                              >
                                to
                              </AppText>
                              <AppView
                                style={
                                  styles.separatorDot
                                }
                              />
                            </AppView>

                            <AppView
                              style={
                                styles.timeField
                              }
                            >
                              <AppText
                                style={
                                  styles.timeLabel
                                }
                              >
                                Closing
                              </AppText>

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
                            </AppView>
                          </AppView>
                        </AppView>
                      ),
                    )}

                    {/* Add Shift */}
                    <AppView
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
                    </AppView>
                  </AppView>
                )}

                {/* =========================
                    24 Hours State
                   ========================= */}
                {item.is24Hours && (
                  <AppView
                    style={
                      styles.fullDayContainer
                    }
                  >
                    <AppView
                      style={
                        styles.fullDayIcon
                      }
                    >
                      <AppText
                        style={
                          styles.fullDayIconText
                        }
                      >
                        24
                      </AppText>
                    </AppView>

                    <AppView
                      style={
                        styles.fullDayContent
                      }
                    >
                      <AppText
                        style={
                          styles.fullDayTitle
                        }
                      >
                        Open 24 Hours
                      </AppText>

                      <AppText
                        style={
                          styles.fullDayText
                        }
                      >
                        The clinic is available
                        throughout the entire day.
                      </AppText>
                    </AppView>
                  </AppView>
                )}
              </AppView>
            )}
          </AppView>
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
    </AppView>
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