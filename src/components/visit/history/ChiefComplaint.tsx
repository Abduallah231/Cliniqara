import AppChip from "@/components/common/AppChip";
import AppDropdown from "@/components/common/AppDropdown";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import { useEffect, useRef, useState } from "react";

import { getClinicChiefComplaints } from "@/services/chiefComplaintApi";
import { getTopChiefComplaintIds } from "@/services/statisticsApi";
import {
  getChiefComplaint,
  saveChiefComplaint,
} from "@/services/visitApi";
import { useClinicStore } from "@/store/clinicStore";
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
    hydrateChiefComplaint,
    updateVisit,
  } = useVisitStore();

  const currentClinicId =
    useClinicStore(
      (state) => state.currentClinicId,
    );

  const chiefComplaint =
    visit.history.chiefComplaint;

  const visitId =
    visit.metadata.id;

  const [complaints, setComplaints] =
    useState<
      { id: string; label: string }[]
    >([]);

  const [quickComplaintIds, setQuickComplaintIds] =
    useState<string[]>([]);

  /*
   * Prevent an old GET response from overwriting
   * a newer complaint selected by the user.
   */
  const loadRequestId =
    useRef(0);

  /*
   * ======================================================
   * Load Chief Complaints List
   * ======================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadComplaints() {
      if (!currentClinicId) {
        setComplaints([]);
        setQuickComplaintIds([]);
        return;
      }

      try {
        const topComplaintIds =
          await getTopChiefComplaintIds(currentClinicId);
        const data =
          await getClinicChiefComplaints(
            currentClinicId,
          );

        if (cancelled) {
          return;
        }

        setComplaints(
          data.map((item) => ({
            id: item.id,
            label: item.name,
          })),
        );
        setQuickComplaintIds(topComplaintIds);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load clinic chief complaints:",
            error,
          );
        }
      }
    }

    loadComplaints();

    return () => {
      cancelled = true;
    };
  }, [currentClinicId]);

  /*
   * ======================================================
   * Hydrate Selected Chief Complaint
   * ======================================================
   *
   * This load is completely independent from
   * AnalysisOfComplaint.
   *
   * It loads only:
   * - complaint
   * - duration
   *
   * It does NOT load analysis fields.
   */

  useEffect(() => {
    if (
      !visitId ||
      !chiefComplaint.complaintId
    ) {
      return;
    }

    const requestId =
      ++loadRequestId.current;

    const complaintId =
      chiefComplaint.complaintId;

    async function loadChiefComplaint() {
      try {
        const data =
          await getChiefComplaint(
            visitId,
            complaintId
          );

        /*
         * Ignore stale response.
         */
        if (
          requestId !==
          loadRequestId.current
        ) {
          return;
        }

        const backendComplaint =
          data?.chiefComplaint;

        if (!backendComplaint) {
          return;
        }

        hydrateChiefComplaint({
          complaintId:
            backendComplaint.id ??
            complaintId,

          complaintName:
            backendComplaint.name ??
            chiefComplaint.complaintName,

          durationValue:
            data?.durationValue ??
            undefined,

          durationUnit:
            data?.durationUnit ??
            undefined,
        });
      } catch (error: any) {
        if (
          requestId !==
          loadRequestId.current
        ) {
          return;
        }

        console.error(
          "Failed to load saved chief complaint:",
          error?.response?.data ??
            error
        );
      }
    }

    loadChiefComplaint();
  }, [
    visitId,
    chiefComplaint.complaintId,
  ]);

  /*
   * ======================================================
   * Update + Save Chief Complaint
   * ======================================================
   */

  const updateChiefComplaint = async (
    updates: Partial<
      typeof chiefComplaint
    >
  ) => {
    const updatedChiefComplaint = {
      ...chiefComplaint,
      ...updates,
    };

    const complaintChanged =
      Boolean(
        updates.complaintId &&
          updates.complaintId !==
            chiefComplaint.complaintId
      );

    /*
     * User changed the complaint.
     *
     * setChiefComplaint() intentionally clears
     * the previous analysis context.
     */
    if (complaintChanged) {
      setChiefComplaint(
        updates.complaintId!,
        updates.complaintName ?? ""
      );

      /*
       * Invalidate any previous GET request.
       */
      loadRequestId.current += 1;
    } else {
      updateVisit({
        history: {
          ...visit.history,
          chiefComplaint:
            updatedChiefComplaint,
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
        answers?: Record<string, never>;
      } = {};

      // A new complaint starts with a clean analysis. This removes saved answers
      // for the previous complaint and prevents its fields leaking into the new one.
      if (complaintChanged) {
        payload.answers = {};
      }

      if (
        !complaintChanged &&
        typeof
          updatedChiefComplaint.durationValue ===
          "number" &&
        Number.isInteger(
          updatedChiefComplaint.durationValue
        ) &&
        updatedChiefComplaint.durationValue >=
          0
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
        !complaintChanged &&
        updatedChiefComplaint.durationUnit &&
        validDurationUnits.includes(
          updatedChiefComplaint.durationUnit as
            (typeof validDurationUnits)[number]
        )
      ) {
        payload.durationUnit =
          updatedChiefComplaint.durationUnit as
            (typeof validDurationUnits)[number];
      }

      await saveChiefComplaint(
        visitId,
        updatedChiefComplaint.complaintId,
        payload
      );
    } catch (error: any) {
      console.error(
        "Failed to save chief complaint:",
        error?.response?.data ??
          error
      );
    }
  };

  const complaint =
    chiefComplaint.complaintId
      ? {
          id:
            chiefComplaint.complaintId,
          label:
            chiefComplaint.complaintName,
        }
      : undefined;

  const complaintById = new Map(
    complaints.map((item) => [item.id, item]),
  );
  const quickComplaints = quickComplaintIds
    .map((id) => complaintById.get(id))
    .filter((item): item is { id: string; label: string } => Boolean(item));

  const dropdownComplaints =
    complaints;

  /*
   * ======================================================
   * UI
   * ======================================================
   */

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
        {quickComplaints.map(
          (item) => (
            <AppChip
              key={item.id}
              label={item.label}
              selected={
                complaint?.id ===
                item.id
              }
              onPress={() =>
                updateChiefComplaint({
                  complaintId:
                    item.id,
                  complaintName:
                    item.label,
                })
              }
            />
          )
        )}
      </View>

      <Divider />

      <Text style={styles.subTitle}>
        All Chief Complaints
      </Text>

      <AppDropdown
        placeholder="Search all complaints..."
        selected={complaint}
        options={
          dropdownComplaints
        }
        onChange={(item) =>
          updateChiefComplaint({
            complaintId:
              item.id,
            complaintName:
              item.label,
          })
        }
      />

      <Divider />

      <SectionHeader title="Duration" />

      <AppTextField
        value={
          chiefComplaint.durationValue ===
          undefined
            ? ""
            : String(
                chiefComplaint.durationValue
              )
        }
        onChangeText={(text) =>
          updateChiefComplaint({
            durationValue:
              text === ""
                ? undefined
                : Number(text),
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
          {
            label: "Hours",
            value: "HOURS" as const,
          },
          {
            label: "Days",
            value: "DAYS" as const,
          },
          {
            label: "Weeks",
            value: "WEEKS" as const,
          },
          {
            label: "Months",
            value: "MONTHS" as const,
          },
          {
            label: "Years",
            value: "YEARS" as const,
          },
        ].map((item) => (
          <AppChip
            key={item.value}
            label={item.label}
            selected={
              chiefComplaint.durationUnit ===
              item.value
            }
            onPress={() =>
              updateChiefComplaint({
                durationUnit:
                  item.value,
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

        <View
          style={
            styles.selectedComplaintBox
          }
        >
          <Text
            style={
              styles.selectedComplaintText
            }
          >
            {chiefComplaint.complaintName ||
              "No complaint selected"}
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
