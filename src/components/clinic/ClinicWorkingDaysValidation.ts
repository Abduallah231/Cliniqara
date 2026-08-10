import {
  WorkingDay,
  WeekDay,
  DAY_LABELS,
} from "./ClinicWorkingDays";

export type ShiftValidationResult = {
  valid: boolean;
  reason?:
    | "EMPTY_TIME"
    | "INVALID_TIME"
    | "SAME_TIME";
};

export type ShiftOverlapItem = {
  day: WeekDay;
  shiftIndex: number;
  start: number;
  end: number;
};

export type ShiftOverlapResult = {
  overlap: boolean;
  first?: ShiftOverlapItem;
  second?: ShiftOverlapItem;
};

export type WorkingDaysValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      type:
        | "EMPTY_SHIFTS"
        | "EMPTY_TIME"
        | "INVALID_TIME"
        | "OVERLAPPING_SHIFTS";
      day: WeekDay;
      shiftIndex?: number;
      first?: ShiftOverlapItem;
      second?: ShiftOverlapItem;
    };

/**
 * Converts a formatted time such as:
 *
 * 9:00 AM
 * 12:30 PM
 * 11:45 PM
 *
 * into minutes from midnight.
 */
export const timeToMinutes = (
  time: string,
) => {
  const normalized = time
    .replace(/\s+/g, " ")
    .trim();

  const match = normalized.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );

  if (!match) {
    return NaN;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period =
    match[3].toUpperCase();

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

/**
 * Returns true when the shift continues
 * into the following calendar day.
 *
 * Example:
 * 9:00 PM → 3:00 AM = overnight
 */
export const isOvernightShift = (
  startTime: string,
  endTime: string,
): boolean => {
  const start =
    timeToMinutes(startTime);

  const end =
    timeToMinutes(endTime);

  if (
    Number.isNaN(start) ||
    Number.isNaN(end)
  ) {
    return false;
  }

  return end < start;
};

/**
 * Validates one shift.
 *
 * Same exact opening/closing time is invalid.
 * A closing time earlier than opening time
 * is allowed because it represents overnight.
 */
export const validateShift = (
  startTime: string,
  endTime: string,
): ShiftValidationResult => {
  if (
    !startTime ||
    !endTime
  ) {
    return {
      valid: false,
      reason: "EMPTY_TIME",
    };
  }

  const start =
    timeToMinutes(startTime);

  const end =
    timeToMinutes(endTime);

  if (
    Number.isNaN(start) ||
    Number.isNaN(end)
  ) {
    return {
      valid: false,
      reason: "INVALID_TIME",
    };
  }

  if (start === end) {
    return {
      valid: false,
      reason: "SAME_TIME",
    };
  }

  return {
    valid: true,
  };
};

/**
 * Backward-compatible helper.
 */
export const isValidShift = (
  startTime: string,
  endTime: string,
): boolean => {
  return validateShift(
    startTime,
    endTime,
  ).valid;
};

/**
 * Detects overlap between all shifts
 * across the complete weekly schedule.
 *
 * Overnight shifts are extended by 24 hours.
 *
 * Example:
 *
 * Friday 11:00 PM → Saturday 8:00 AM
 * Saturday 7:00 AM → 5:00 PM
 *
 * = overlap detected.
 */
export const hasAnyShiftOverlap = (
  workingDays: WorkingDay[],
): ShiftOverlapResult => {
  const WEEK_MINUTES =
    7 * 24 * 60;

  const intervals: ShiftOverlapItem[] =
    [];

  workingDays.forEach(
    (day, dayIndex) => {
      if (
        day.isClosed ||
        day.is24Hours
      ) {
        return;
      }

      day.shifts.forEach(
        (shift, shiftIndex) => {
          const start =
            timeToMinutes(
              shift.startTime,
            );

          const end =
            timeToMinutes(
              shift.endTime,
            );

          if (
            Number.isNaN(start) ||
            Number.isNaN(end)
          ) {
            return;
          }

          const absoluteStart =
            dayIndex * 24 * 60 +
            start;

          let absoluteEnd =
            dayIndex * 24 * 60 +
            end;

          if (end < start) {
            absoluteEnd +=
              24 * 60;
          }

          intervals.push({
            day: day.day,
            shiftIndex,
            start: absoluteStart,
            end: absoluteEnd,
          });
        },
      );
    },
  );

  for (
    let i = 0;
    i < intervals.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < intervals.length;
      j++
    ) {
      const first =
        intervals[i];

      const second =
        intervals[j];

      /*
       * Check:
       *
       * 1. Same week
       * 2. Previous week boundary
       * 3. Next week boundary
       *
       * This catches:
       *
       * Friday overnight
       * ↔ Saturday morning
       *
       * and also:
       *
       * Friday overnight
       * ↔ Saturday shift
       *
       * including the weekly boundary.
       */
      for (
        const offset of [
          -WEEK_MINUTES,
          0,
          WEEK_MINUTES,
        ]
      ) {
        const secondStart =
          second.start +
          offset;

        const secondEnd =
          second.end +
          offset;

        if (
          first.start <
            secondEnd &&
          secondStart <
            first.end
        ) {
          return {
            overlap: true,
            first,
            second,
          };
        }
      }
    }
  }

  return {
    overlap: false,
  };
};

/**
 * Validates the complete working-days
 * configuration before Create / Update.
 *
 * This function does NOT show alerts.
 * The screen decides how to display errors.
 */
export const validateWorkingDays = (
  workingDays: WorkingDay[],
): WorkingDaysValidationResult => {
  for (
    let dayIndex = 0;
    dayIndex < workingDays.length;
    dayIndex++
  ) {
    const day =
      workingDays[dayIndex];

    /*
     * Closed and 24 Hours don't require
     * normal shift validation.
     */
    if (
      day.isClosed ||
      day.is24Hours
    ) {
      continue;
    }

    /*
     * An opened normal day must have
     * at least one shift.
     */
    if (
      day.shifts.length === 0
    ) {
      return {
        valid: false,
        type: "EMPTY_SHIFTS",
        day: day.day,
      };
    }

    /*
     * Validate every shift.
     */
    for (
      let shiftIndex = 0;
      shiftIndex <
      day.shifts.length;
      shiftIndex++
    ) {
      const shift =
        day.shifts[
          shiftIndex
        ];

      const result =
        validateShift(
          shift.startTime,
          shift.endTime,
        );

      if (!result.valid) {
        if (
          result.reason ===
          "EMPTY_TIME"
        ) {
          return {
            valid: false,
            type: "EMPTY_TIME",
            day: day.day,
            shiftIndex,
          };
        }

        return {
          valid: false,
          type: "INVALID_TIME",
          day: day.day,
          shiftIndex,
        };
      }
    }
  }

  /*
   * Validate overlap only after
   * all individual shifts are valid.
   */
  const overlapResult =
    hasAnyShiftOverlap(
      workingDays,
    );

  if (
    overlapResult.overlap &&
    overlapResult.first &&
    overlapResult.second
  ) {
    return {
      valid: false,
      type: "OVERLAPPING_SHIFTS",
      day:
        overlapResult.first.day,
      shiftIndex:
        overlapResult.first
          .shiftIndex,
      first:
        overlapResult.first,
      second:
        overlapResult.second,
    };
  }

  return {
    valid: true,
  };
};

/**
 * Creates the same human-readable
 * day label used by the UI.
 */
export const getDayLabel = (
  day: WeekDay,
): string => {
  return DAY_LABELS[day];
};