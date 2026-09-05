import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import type { ComponentProps } from "react";

import { MaterialIcons } from "@expo/vector-icons";

import { useVisitStore } from "@/store/visitStore";

import AppButton from "@/components/common/AppButton";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

import chronicDiseases from "@/data/chronicDiseases";

import usePastHistoryAutoSave from "@/hooks/usePastHistoryAutoSave";

import type {
  Hospitalization,
  Operation,
  BloodTransfusion,
  MajorTrauma,
  ICUAdmission,
} from "@/models/VisitForm/history";

/* ======================================================
   Types
====================================================== */

type SavingSection =
  | "hospitalization"
  | "operation"
  | "transfusion"
  | "trauma"
  | "icu"
  | null;

type DatePickerTarget =
  | "hospitalization"
  | "operation"
  | "transfusion"
  | "trauma"
  | "icu"
  | null;

/* ======================================================
   Helpers
====================================================== */

const formatDate = (
  date: Date,
): string => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDate = (
  value: string,
): Date => {
  if (!value) {
    return new Date();
  }

  const parts =
    value.split("-");

  if (parts.length === 3) {
    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const day =
      Number(parts[2]);

    if (
      !Number.isNaN(year) &&
      !Number.isNaN(month) &&
      !Number.isNaN(day)
    ) {
      return new Date(
        year,
        month - 1,
        day,
      );
    }
  }

  const parsed =
    new Date(value);

  return Number.isNaN(
    parsed.getTime(),
  )
    ? new Date()
    : parsed;
};

/* ======================================================
   Date Field
====================================================== */

type DateFieldProps = {
  value: string;
  onPress: () => void;
  disabled?: boolean;
};

function DateField({
  value,
  onPress,
  disabled = false,
}: DateFieldProps) {
  return (
    <View
      style={
        styles.dateFieldContainer
      }
    >
      <Text
        style={
          styles.dateLabel
        }
      >
        Date
      </Text>

      <AppButton
        title={
          value || "Select date"
        }
        variant="secondary"
        disabled={disabled}
        icon="calendar-outline"
        onPress={onPress}
      />
    </View>
  );
}

/* ======================================================
   Component
====================================================== */

export default function PastHistory() {
  /* ====================================================
     Store
  ==================================================== */

  const {
    visit,

    updatePastHistoryField,

    addHospitalization,
    updateHospitalization,
    removeHospitalization,

    addOperation,
    updateOperation,
    removeOperation,

    addBloodTransfusion,
    updateBloodTransfusion,
    removeBloodTransfusion,

    addMajorTrauma,
    updateMajorTrauma,
    removeMajorTrauma,

    addICUAdmission,
    updateICUAdmission,
    removeICUAdmission,
  } = useVisitStore();

  const pastHistory =
    visit.history.pastHistory;

  const patientId =
    visit.patient?.id;

  /* ====================================================
     Persistence
     
     Hook owns:
     - Hydration
     - Chronic autosave
     - Manual save
     - Save status
  ==================================================== */

  const {
    isHydrating,

    isSaving,

    isAutoSaving,

    autoSavingSection,

    saveError,

    saveNow,
  } =
    usePastHistoryAutoSave({
      patientId,
    });

  /* ====================================================
     Chronic Diseases
  ==================================================== */

  const getValue = (
    fieldId: string,
  ) =>
    pastHistory.fields.find(
      (field) =>
        field.fieldId ===
        fieldId,
    )?.value ?? null;

  const selectedDiseases =
    (getValue(
      "chronicDiseases",
    ) as string[]) ?? [];

  const toggleMultiSelect = (
    fieldId: string,
    fieldLabel: string,
    value: string,
  ) => {
    if (isHydrating) {
      return;
    }

    const current =
      (getValue(fieldId) as string[]) ??
      [];

    const updated =
      current.includes(value)
        ? current.filter(
            (item) =>
              item !== value,
          )
        : [
            ...current,
            value,
          ];

    /*
     * No API call here.
     *
     * Hook detects this change and automatically
     * saves Chronic Diseases after 500ms.
     */
    updatePastHistoryField(
      fieldId,
      fieldLabel,
      updated,
    );
  };

  /* ====================================================
     General Saving State
  ==================================================== */

  const [
    savingSection,
    setSavingSection,
  ] =
    useState<SavingSection>(
      null,
    );

  const isBusy =
    isHydrating ||
    isSaving ||
    savingSection !== null;

  /* ====================================================
     Date Picker
  ==================================================== */

  const [
    datePickerTarget,
    setDatePickerTarget,
  ] =
    useState<DatePickerTarget>(
      null,
    );

  const openDatePicker = (
    target: Exclude<
      DatePickerTarget,
      null
    >,
  ) => {
    if (isBusy) {
      return;
    }

    setDatePickerTarget(
      target,
    );
  };

  const getPickerValue =
    (): Date => {
      switch (
        datePickerTarget
      ) {
        case "hospitalization":
          return parseDate(
            hospitalizationDate,
          );

        case "operation":
          return parseDate(
            operationDate,
          );

        case "transfusion":
          return parseDate(
            transfusionDate,
          );

        case "trauma":
          return parseDate(
            traumaDate,
          );

        case "icu":
          return parseDate(
            icuDate,
          );

        default:
          return new Date();
      }
    };

  const handleDateValueChange: NonNullable<
    ComponentProps<
      typeof DateTimePicker
    >["onValueChange"]
  > = (
    _event,
    selectedDate,
  ) => {
    if (!selectedDate) {
      return;
    }

    const formattedDate =
      formatDate(
        selectedDate,
      );

    switch (
      datePickerTarget
    ) {
      case "hospitalization":
        setHospitalizationDate(
          formattedDate,
        );
        break;

      case "operation":
        setOperationDate(
          formattedDate,
        );
        break;

      case "transfusion":
        setTransfusionDate(
          formattedDate,
        );
        break;

      case "trauma":
        setTraumaDate(
          formattedDate,
        );
        break;

      case "icu":
        setIcuDate(
          formattedDate,
        );
        break;
    }

    setDatePickerTarget(
      null,
    );
  };

  const handleDateDismiss =
    () => {
      setDatePickerTarget(
        null,
      );
    };

  /* ====================================================
     Hospitalization Form
  ==================================================== */

  const [
    hospitalizationReason,
    setHospitalizationReason,
  ] = useState("");

  const [
    hospitalizationDate,
    setHospitalizationDate,
  ] = useState("");

  const [
    hospitalizationDuration,
    setHospitalizationDuration,
  ] = useState("");

  const [
    editingHospitalizationId,
    setEditingHospitalizationId,
  ] =
    useState<string | null>(
      null,
    );

  const clearHospitalizationForm =
    () => {
      setHospitalizationReason(
        "",
      );

      setHospitalizationDate(
        "",
      );

      setHospitalizationDuration(
        "",
      );

      setEditingHospitalizationId(
        null,
      );
    };

  const handleAddHospitalization =
    async () => {
      if (
        !hospitalizationReason.trim() ||
        savingSection
      ) {
        return;
      }

      setSavingSection(
        "hospitalization",
      );

      try {
        if (
          editingHospitalizationId
        ) {
          updateHospitalization(
            editingHospitalizationId,
            {
              reason:
                hospitalizationReason.trim(),

              date:
                hospitalizationDate,

              duration:
                hospitalizationDuration.trim(),
            },
          );
        } else {
          const newItem: Hospitalization =
            {
              id: `${Date.now()}`,

              reason:
                hospitalizationReason.trim(),

              date:
                hospitalizationDate,

              duration:
                hospitalizationDuration.trim(),
            };

          addHospitalization(
            newItem,
          );
        }

        /*
         * Zustand has already been updated.
         *
         * saveNow() reads the NEW state directly
         * from Zustand.
         */
        const success =
          await saveNow();

        if (success) {
          clearHospitalizationForm();
        }
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  const handleDeleteHospitalization =
    async (
      id: string,
    ) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "hospitalization",
      );

      try {
        removeHospitalization(
          id,
        );

        await saveNow();
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  /* ====================================================
     Operation Form
  ==================================================== */

  const [
    operationName,
    setOperationName,
  ] = useState("");

  const [
    operationDate,
    setOperationDate,
  ] = useState("");

  const [
    operationIndication,
    setOperationIndication,
  ] = useState("");

  const [
    editingOperationId,
    setEditingOperationId,
  ] =
    useState<string | null>(
      null,
    );

  const clearOperationForm =
    () => {
      setOperationName("");

      setOperationDate("");

      setOperationIndication("");

      setEditingOperationId(
        null,
      );
    };

  const handleAddOperation =
    async () => {
      if (
        !operationName.trim() ||
        savingSection
      ) {
        return;
      }

      setSavingSection(
        "operation",
      );

      try {
        if (
          editingOperationId
        ) {
          updateOperation(
            editingOperationId,
            {
              name:
                operationName.trim(),

              date:
                operationDate,

              indication:
                operationIndication.trim(),
            },
          );
        } else {
          const newItem: Operation =
            {
              id: `${Date.now()}`,

              name:
                operationName.trim(),

              date:
                operationDate,

              indication:
                operationIndication.trim(),
            };

          addOperation(
            newItem,
          );
        }

        const success =
          await saveNow();

        if (success) {
          clearOperationForm();
        }
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  const handleDeleteOperation =
    async (
      id: string,
    ) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "operation",
      );

      try {
        removeOperation(
          id,
        );

        await saveNow();
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  /* ====================================================
     Blood Transfusion Form
  ==================================================== */

  const [
    transfusionReason,
    setTransfusionReason,
  ] = useState("");

  const [
    transfusionDate,
    setTransfusionDate,
  ] = useState("");

  const [
    transfusionReaction,
    setTransfusionReaction,
  ] = useState("");

  const [
    editingBloodTransfusionId,
    setEditingBloodTransfusionId,
  ] =
    useState<string | null>(
      null,
    );

  const clearBloodTransfusionForm =
    () => {
      setTransfusionReason("");

      setTransfusionDate("");

      setTransfusionReaction("");

      setEditingBloodTransfusionId(
        null,
      );
    };

  const handleAddBloodTransfusion =
    async () => {
      if (
        !transfusionReason.trim() ||
        savingSection
      ) {
        return;
      }

      setSavingSection(
        "transfusion",
      );

      try {
        if (
          editingBloodTransfusionId
        ) {
          updateBloodTransfusion(
            editingBloodTransfusionId,
            {
              reason:
                transfusionReason.trim(),

              date:
                transfusionDate,

              reaction:
                transfusionReaction.trim(),
            },
          );
        } else {
          const newItem: BloodTransfusion =
            {
              id: `${Date.now()}`,

              reason:
                transfusionReason.trim(),

              date:
                transfusionDate,

              reaction:
                transfusionReaction.trim(),
            };

          addBloodTransfusion(
            newItem,
          );
        }

        const success =
          await saveNow();

        if (success) {
          clearBloodTransfusionForm();
        }
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  const handleDeleteBloodTransfusion =
    async (
      id: string,
    ) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "transfusion",
      );

      try {
        removeBloodTransfusion(
          id,
        );

        await saveNow();
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  /* ====================================================
     Major Trauma Form
  ==================================================== */

  const [
    traumaType,
    setTraumaType,
  ] = useState("");

  const [
    traumaDate,
    setTraumaDate,
  ] = useState("");

  const [
    traumaComplications,
    setTraumaComplications,
  ] = useState("");

  const [
    editingMajorTraumaId,
    setEditingMajorTraumaId,
  ] =
    useState<string | null>(
      null,
    );

  const clearMajorTraumaForm =
    () => {
      setTraumaType("");

      setTraumaDate("");

      setTraumaComplications("");

      setEditingMajorTraumaId(
        null,
      );
    };

  const handleAddMajorTrauma =
    async () => {
      if (
        !traumaType.trim() ||
        savingSection
      ) {
        return;
      }

      setSavingSection(
        "trauma",
      );

      try {
        if (
          editingMajorTraumaId
        ) {
          updateMajorTrauma(
            editingMajorTraumaId,
            {
              type:
                traumaType.trim(),

              date:
                traumaDate,

              complications:
                traumaComplications.trim(),
            },
          );
        } else {
          const newItem: MajorTrauma =
            {
              id: `${Date.now()}`,

              type:
                traumaType.trim(),

              date:
                traumaDate,

              complications:
                traumaComplications.trim(),
            };

          addMajorTrauma(
            newItem,
          );
        }

        const success =
          await saveNow();

        if (success) {
          clearMajorTraumaForm();
        }
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  const handleDeleteMajorTrauma =
    async (
      id: string,
    ) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "trauma",
      );

      try {
        removeMajorTrauma(
          id,
        );

        await saveNow();
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  /* ====================================================
     ICU Admission Form
  ==================================================== */

  const [
    icuReason,
    setIcuReason,
  ] = useState("");

  const [
    icuDate,
    setIcuDate,
  ] = useState("");

  const [
    icuDuration,
    setIcuDuration,
  ] = useState("");

  const [
    icuVentilatorSupport,
    setIcuVentilatorSupport,
  ] = useState(false);

  const [
    editingICUAdmissionId,
    setEditingICUAdmissionId,
  ] =
    useState<string | null>(
      null,
    );

  const clearICUForm =
    () => {
      setIcuReason("");

      setIcuDate("");

      setIcuDuration("");

      setIcuVentilatorSupport(
        false,
      );

      setEditingICUAdmissionId(
        null,
      );
    };

  const handleAddICUAdmission =
    async () => {
      if (
        !icuReason.trim() ||
        savingSection
      ) {
        return;
      }

      setSavingSection(
        "icu",
      );

      try {
        if (
          editingICUAdmissionId
        ) {
          updateICUAdmission(
            editingICUAdmissionId,
            {
              reason:
                icuReason.trim(),

              date:
                icuDate,

              duration:
                icuDuration.trim(),

              ventilatorSupport:
                icuVentilatorSupport,
            },
          );
        } else {
          const newItem: ICUAdmission =
            {
              id: `${Date.now()}`,

              reason:
                icuReason.trim(),

              date:
                icuDate,

              duration:
                icuDuration.trim(),

              ventilatorSupport:
                icuVentilatorSupport,
            };

          addICUAdmission(
            newItem,
          );
        }

        const success =
          await saveNow();

        if (success) {
          clearICUForm();
        }
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  const handleDeleteICUAdmission =
    async (
      id: string,
    ) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "icu",
      );

      try {
        removeICUAdmission(
          id,
        );

        await saveNow();
      } finally {
        setSavingSection(
          null,
        );
      }
    };

  /* ====================================================
     Render
  ==================================================== */

  return (
    <View
      style={
        styles.container
      }
    >
      {/* ==================================================
          Status
      ================================================== */}

      {isHydrating && (
        <Text
          style={
            styles.saveStatus
          }
        >
          Loading past history...
        </Text>
      )}

      {!isHydrating &&
        isAutoSaving &&
        autoSavingSection ===
          "chronicDiseases" && (
          <Text
            style={
              styles.saveStatus
            }
          >
            Saving chronic diseases...
          </Text>
        )}

      {!!saveError && (
        <Text
          style={
            styles.errorStatus
          }
        >
          {saveError}
        </Text>
      )}

      {/* ==================================================
          Chronic Diseases
      ================================================== */}

      <SectionHeader
        title="Chronic Diseases"
      />

      <View
        style={
          styles.chipRow
        }
      >
        {chronicDiseases.map(
          (disease) => (
            <AppChip
              key={
                disease.code
              }
              label={
                disease.name
              }
              selected={selectedDiseases.includes(
                disease.code,
              )}
              disabled={
                isHydrating ||
                savingSection !== null
              }
              onPress={() =>
                toggleMultiSelect(
                  "chronicDiseases",
                  "Chronic Diseases",
                  disease.code,
                )
              }
            />
          ),
        )}
      </View>

      <Divider />

      {/* ==================================================
          Hospitalizations
      ================================================== */}

      <SectionHeader
        title="Hospitalizations"
      />

      <View
        style={styles.card}
      >
        <AppTextField
          placeholder="Reason"
          value={
            hospitalizationReason
          }
          onChangeText={
            setHospitalizationReason
          }
          editable={
            !isBusy
          }
        />

        <AppTextField
          placeholder="Duration"
          value={
            hospitalizationDuration
          }
          onChangeText={
            setHospitalizationDuration
          }
          editable={
            !isBusy
          }
        />

        <DateField
          value={
            hospitalizationDate
          }
          disabled={
            isBusy
          }
          onPress={() =>
            openDatePicker(
              "hospitalization",
            )
          }
        />

        <Text
          style={
            styles.helperText
          }
        >
          Select the date, then tap
          the button below to save.
        </Text>

        <AppButton
          title={
            editingHospitalizationId
              ? "Update Hospitalization"
              : "Add Hospitalization"
          }
          loading={
            savingSection ===
            "hospitalization"
          }
          disabled={
            isBusy ||
            !hospitalizationReason.trim()
          }
          onPress={
            handleAddHospitalization
          }
        />
      </View>

      {pastHistory.hospitalizations.map(
        (item) => (
          <View
            key={item.id}
            style={
              styles.recordCard
            }
          >
            <Text
              style={
                styles.recordTitle
              }
            >
              {item.reason}
            </Text>

            {!!item.date && (
              <Text
                style={
                  styles.recordText
                }
              >
                Date: {item.date}
              </Text>
            )}

            {!!item.duration && (
              <Text
                style={
                  styles.recordText
                }
              >
                Duration:{" "}
                {item.duration}
              </Text>
            )}

            <View
              style={
                styles.actionRow
              }
            >
              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() => {
                  setEditingHospitalizationId(
                    item.id,
                  );

                  setHospitalizationReason(
                    item.reason,
                  );

                  setHospitalizationDate(
                    item.date,
                  );

                  setHospitalizationDuration(
                    item.duration,
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#1976D2"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() =>
                  handleDeleteHospitalization(
                    item.id,
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      <Divider />

      {/* ==================================================
          Operations
      ================================================== */}

      <SectionHeader
        title="Operations"
      />

      <View
        style={styles.card}
      >
        <AppTextField
          placeholder="Operation"
          value={
            operationName
          }
          onChangeText={
            setOperationName
          }
          editable={
            !isBusy
          }
        />

        <AppTextField
          placeholder="Indication"
          value={
            operationIndication
          }
          onChangeText={
            setOperationIndication
          }
          editable={
            !isBusy
          }
        />

        <DateField
          value={
            operationDate
          }
          disabled={
            isBusy
          }
          onPress={() =>
            openDatePicker(
              "operation",
            )
          }
        />

        <Text
          style={
            styles.helperText
          }
        >
          Select the date, then tap
          the button below to save.
        </Text>

        <AppButton
          title={
            editingOperationId
              ? "Update Operation"
              : "Add Operation"
          }
          loading={
            savingSection ===
            "operation"
          }
          disabled={
            isBusy ||
            !operationName.trim()
          }
          onPress={
            handleAddOperation
          }
        />
      </View>

      {pastHistory.operations.map(
        (item) => (
          <View
            key={item.id}
            style={
              styles.recordCard
            }
          >
            <Text
              style={
                styles.recordTitle
              }
            >
              {item.name}
            </Text>

            {!!item.date && (
              <Text
                style={
                  styles.recordText
                }
              >
                Date: {item.date}
              </Text>
            )}

            {!!item.indication && (
              <Text
                style={
                  styles.recordText
                }
              >
                Indication:{" "}
                {item.indication}
              </Text>
            )}

            <View
              style={
                styles.actionRow
              }
            >
              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() => {
                  setEditingOperationId(
                    item.id,
                  );

                  setOperationName(
                    item.name,
                  );

                  setOperationDate(
                    item.date,
                  );

                  setOperationIndication(
                    item.indication,
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#1976D2"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() =>
                  handleDeleteOperation(
                    item.id,
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      <Divider />

      {/* ==================================================
          Blood Transfusions
      ================================================== */}

      <SectionHeader
        title="Blood Transfusions"
      />

      <View
        style={styles.card}
      >
        <AppTextField
          placeholder="Reason"
          value={
            transfusionReason
          }
          onChangeText={
            setTransfusionReason
          }
          editable={
            !isBusy
          }
        />

        <AppTextField
          placeholder="Reaction"
          value={
            transfusionReaction
          }
          onChangeText={
            setTransfusionReaction
          }
          editable={
            !isBusy
          }
        />

        <DateField
          value={
            transfusionDate
          }
          disabled={
            isBusy
          }
          onPress={() =>
            openDatePicker(
              "transfusion",
            )
          }
        />

        <Text
          style={
            styles.helperText
          }
        >
          Select the date, then tap
          the button below to save.
        </Text>

        <AppButton
          title={
            editingBloodTransfusionId
              ? "Update Blood Transfusion"
              : "Add Blood Transfusion"
          }
          loading={
            savingSection ===
            "transfusion"
          }
          disabled={
            isBusy ||
            !transfusionReason.trim()
          }
          onPress={
            handleAddBloodTransfusion
          }
        />
      </View>

      {pastHistory.bloodTransfusions.map(
        (item) => (
          <View
            key={item.id}
            style={
              styles.recordCard
            }
          >
            <Text
              style={
                styles.recordTitle
              }
            >
              {item.reason ||
                "Blood Transfusion"}
            </Text>

            {!!item.date && (
              <Text
                style={
                  styles.recordText
                }
              >
                Date: {item.date}
              </Text>
            )}

            {!!item.reaction && (
              <Text
                style={
                  styles.recordText
                }
              >
                Reaction:{" "}
                {item.reaction}
              </Text>
            )}

            <View
              style={
                styles.actionRow
              }
            >
              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() => {
                  setEditingBloodTransfusionId(
                    item.id,
                  );

                  setTransfusionReason(
                    item.reason,
                  );

                  setTransfusionDate(
                    item.date,
                  );

                  setTransfusionReaction(
                    item.reaction,
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#1976D2"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() =>
                  handleDeleteBloodTransfusion(
                    item.id,
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      <Divider />

      {/* ==================================================
          Major Trauma
      ================================================== */}

      <SectionHeader
        title="Major Trauma"
      />

      <View
        style={styles.card}
      >
        <AppTextField
          placeholder="Type"
          value={
            traumaType
          }
          onChangeText={
            setTraumaType
          }
          editable={
            !isBusy
          }
        />

        <AppTextField
          placeholder="Complications"
          value={
            traumaComplications
          }
          onChangeText={
            setTraumaComplications
          }
          editable={
            !isBusy
          }
        />

        <DateField
          value={
            traumaDate
          }
          disabled={
            isBusy
          }
          onPress={() =>
            openDatePicker(
              "trauma",
            )
          }
        />

        <Text
          style={
            styles.helperText
          }
        >
          Select the date, then tap
          the button below to save.
        </Text>

        <AppButton
          title={
            editingMajorTraumaId
              ? "Update Major Trauma"
              : "Add Major Trauma"
          }
          loading={
            savingSection ===
            "trauma"
          }
          disabled={
            isBusy ||
            !traumaType.trim()
          }
          onPress={
            handleAddMajorTrauma
          }
        />
      </View>

      {pastHistory.majorTraumas.map(
        (item) => (
          <View
            key={item.id}
            style={
              styles.recordCard
            }
          >
            <Text
              style={
                styles.recordTitle
              }
            >
              {item.type}
            </Text>

            {!!item.date && (
              <Text
                style={
                  styles.recordText
                }
              >
                Date: {item.date}
              </Text>
            )}

            {!!item.complications && (
              <Text
                style={
                  styles.recordText
                }
              >
                Complications:{" "}
                {item.complications}
              </Text>
            )}

            <View
              style={
                styles.actionRow
              }
            >
              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() => {
                  setEditingMajorTraumaId(
                    item.id,
                  );

                  setTraumaType(
                    item.type,
                  );

                  setTraumaDate(
                    item.date,
                  );

                  setTraumaComplications(
                    item.complications,
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#1976D2"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() =>
                  handleDeleteMajorTrauma(
                    item.id,
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      <Divider />

      {/* ==================================================
          ICU Admissions
      ================================================== */}

      <SectionHeader
        title="ICU Admissions"
      />

      <View
        style={styles.card}
      >
        <AppTextField
          placeholder="Reason"
          value={
            icuReason
          }
          onChangeText={
            setIcuReason
          }
          editable={
            !isBusy
          }
        />

        <AppTextField
          placeholder="Duration"
          value={
            icuDuration
          }
          onChangeText={
            setIcuDuration
          }
          editable={
            !isBusy
          }
        />

        <DateField
          value={
            icuDate
          }
          disabled={
            isBusy
          }
          onPress={() =>
            openDatePicker(
              "icu",
            )
          }
        />

        {/*
        <View style={styles.chipRow}>
          <AppChip
            label="Yes"
            selected={
              icuVentilatorSupport === true
            }
            disabled={isBusy}
            onPress={() =>
              setIcuVentilatorSupport(true)
            }
          />

          <AppChip
            label="No"
            selected={
              icuVentilatorSupport === false
            }
            disabled={isBusy}
            onPress={() =>
              setIcuVentilatorSupport(false)
            }
          />
        </View>
        */}

        <Text
          style={
            styles.helperText
          }
        >
          Select the date, then tap
          the button below to save.
        </Text>

        <AppButton
          title={
            editingICUAdmissionId
              ? "Update ICU Admission"
              : "Add ICU Admission"
          }
          loading={
            savingSection ===
            "icu"
          }
          disabled={
            isBusy ||
            !icuReason.trim()
          }
          onPress={
            handleAddICUAdmission
          }
        />
      </View>

      {pastHistory.icuAdmissions.map(
        (item) => (
          <View
            key={item.id}
            style={
              styles.recordCard
            }
          >
            <Text
              style={
                styles.recordTitle
              }
            >
              {item.reason}
            </Text>

            {!!item.date && (
              <Text
                style={
                  styles.recordText
                }
              >
                Date: {item.date}
              </Text>
            )}

            {!!item.duration && (
              <Text
                style={
                  styles.recordText
                }
              >
                Duration:{" "}
                {item.duration}
              </Text>
            )}

            <Text
              style={
                styles.recordText
              }
            >
              Ventilator Support:{" "}
              {item.ventilatorSupport
                ? "Yes"
                : "No"}
            </Text>

            <View
              style={
                styles.actionRow
              }
            >
              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() => {
                  setEditingICUAdmissionId(
                    item.id,
                  );

                  setIcuReason(
                    item.reason,
                  );

                  setIcuDate(
                    item.date,
                  );

                  setIcuDuration(
                    item.duration,
                  );

                  setIcuVentilatorSupport(
                    item.ventilatorSupport,
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#1976D2"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.iconButton
                }
                disabled={
                  isBusy
                }
                onPress={() =>
                  handleDeleteICUAdmission(
                    item.id,
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isBusy
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      {/* ==================================================
          Date Picker
      ================================================== */}

      {datePickerTarget && (
        <DateTimePicker
          value={
            getPickerValue()
          }
          mode="date"
          display="default"
          onValueChange={
            handleDateValueChange
          }
          onDismiss={
            handleDateDismiss
          }
        />
      )}
    </View>
  );
}

/* ======================================================
   Styles
====================================================== */

const styles =
  StyleSheet.create({
    container: {
      gap: SPACING.md,
    },

    card: {
      gap: SPACING.sm,
    },

    chipRow: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap: SPACING.xs,
    },

    helperText: {
      fontSize:
        TYPOGRAPHY.small,

      color:
        COLORS.secondaryText,
    },

    saveStatus: {
      fontSize:
        TYPOGRAPHY.small,

      color:
        COLORS.secondaryText,

      marginTop:
        -SPACING.xs,
    },

    errorStatus: {
      fontSize:
        TYPOGRAPHY.small,

      color:
        "#D32F2F",

      marginTop:
        -SPACING.xs,
    },

    dateFieldContainer: {
      gap: SPACING.xs,
    },

    dateLabel: {
      fontSize:
        TYPOGRAPHY.small,

      color:
        COLORS.secondaryText,

      fontWeight:
        "600",
    },

    recordCard: {
      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 12,

      padding:
        SPACING.md,

      gap: SPACING.xs,

      backgroundColor:
        COLORS.white,
    },

    recordTitle: {
      fontSize:
        TYPOGRAPHY.body,

      fontWeight:
        "700",

      color:
        COLORS.text,
    },

    recordText: {
      fontSize:
        TYPOGRAPHY.small,

      color:
        COLORS.secondaryText,
    },

    actionRow: {
      flexDirection:
        "row",

      justifyContent:
        "flex-end",

      alignItems:
        "center",

      gap: SPACING.md,

      marginTop:
        SPACING.sm,
    },

    iconButton: {
      padding: 6,
    },
  });