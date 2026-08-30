import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import {
  getPastHistory,
  savePastHistory,
  type SavePastHistoryInput,
} from "@/services/visitApi";
import {
  mapPastHistoryFromBackend,
} from "@/hooks/usePastHistoryAutoSave";
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

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDate = (
  value: string
): Date => {
  if (!value) {
    return new Date();
  }

  const parts = value.split("-");

  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
      !Number.isNaN(year) &&
      !Number.isNaN(month) &&
      !Number.isNaN(day)
    ) {
      return new Date(
        year,
        month - 1,
        day
      );
    }
  }

  const parsed = new Date(value);

  return Number.isNaN(
    parsed.getTime()
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
    <View style={styles.dateFieldContainer}>
      <Text style={styles.dateLabel}>
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
     Hydration
  ==================================================== */

  const [
    isHydrating,
    setIsHydrating,
  ] = useState(false);

  const loadedPatientId =
    useRef<string | null>(null);

  /* ====================================================
     Chronic Diseases
  ==================================================== */

  const getValue = (
    fieldId: string
  ) =>
    visit.history.pastHistory.fields.find(
      (field) =>
        field.fieldId === fieldId
    )?.value ?? null;

  const selectedDiseases =
    (getValue(
      "chronicDiseases"
    ) as string[]) ?? [];

  /*
   * We explicitly track whether the user changed
   * Chronic Diseases.
   *
   * This prevents the initial hydration from triggering
   * an unwanted save.
   */

  const [
    chronicDiseasesDirty,
    setChronicDiseasesDirty,
  ] = useState(false);

  const chronicSaveVersion =
    useRef(0);

  const chronicSavingRef =
    useRef(false);

  const [
    chronicSaving,
    setChronicSaving,
  ] = useState(false);

  const toggleMultiSelect = (
    fieldId: string,
    fieldLabel: string,
    value: string
  ) => {
    const current =
      (getValue(fieldId) as string[]) ??
      [];

    const updated =
      current.includes(value)
        ? current.filter(
            (item) =>
              item !== value
          )
        : [
            ...current,
            value,
          ];

    updatePastHistoryField(
      fieldId,
      fieldLabel,
      updated
    );

    /*
     * Mark the field as user-modified.
     *
     * Auto-save will be triggered by the effect below.
     */

    chronicSaveVersion.current += 1;

    setChronicDiseasesDirty(
      true
    );
  };

  const buildChronicDiseases =
    useCallback(
      (
        diseaseCodes: string[]
      ): SavePastHistoryInput["chronicDiseases"] => {
        return diseaseCodes.map(
          (code) => {
            const disease =
              chronicDiseases.find(
                (item) =>
                  item.code === code
              );

            return {
              diseaseCode: code,
              diseaseName:
                disease?.name ??
                code,
              notes: null,
            };
          }
        );
      },
      []
    );

  /* ====================================================
     Persistence Helper
  ==================================================== */

  const saveSnapshot = useCallback(
    async ({
      chronicDiseaseCodes,
      hospitalizations,
      operations,
      bloodTransfusions,
      majorTraumas,
      icuAdmissions,
    }: {
      chronicDiseaseCodes?: string[];
      hospitalizations?: Hospitalization[];
      operations?: Operation[];
      bloodTransfusions?: BloodTransfusion[];
      majorTraumas?: MajorTrauma[];
      icuAdmissions?: ICUAdmission[];
    }) => {
      if (!patientId) {
        return false;
      }

      const payload: SavePastHistoryInput = {
        chronicDiseases:
          buildChronicDiseases(
            chronicDiseaseCodes ??
              selectedDiseases
          ),

        hospitalizations:
          (
            hospitalizations ??
            pastHistory.hospitalizations
          )
            .map((item) => ({
              reason:
                item.reason.trim(),
              date:
                item.date.trim() ||
                null,
              duration:
                item.duration.trim() ||
                null,
            }))
            .filter(
              (item) =>
                item.reason
            ),

        operations:
          (
            operations ??
            pastHistory.operations
          )
            .map((item) => ({
              operationName:
                item.name.trim(),
              date:
                item.date.trim() ||
                null,
              indication:
                item.indication.trim() ||
                null,
            }))
            .filter(
              (item) =>
                item.operationName
            ),

        bloodTransfusions:
          (
            bloodTransfusions ??
            pastHistory.bloodTransfusions
          ).map((item) => ({
            reason:
              item.reason.trim() ||
              null,
            date:
              item.date.trim() ||
              null,
            reaction:
              item.reaction.trim() ||
              null,
          })),

        majorTraumas:
          (
            majorTraumas ??
            pastHistory.majorTraumas
          )
            .map((item) => ({
              traumaType:
                item.type.trim(),
              date:
                item.date.trim() ||
                null,
              complications:
                item.complications.trim() ||
                null,
            }))
            .filter(
              (item) =>
                item.traumaType
            ),

        icuAdmissions:
          (
            icuAdmissions ??
            pastHistory.icuAdmissions
          )
            .map((item) => ({
              reason:
                item.reason.trim(),
              date:
                item.date.trim() ||
                null,
              duration:
                item.duration.trim() ||
                null,
              ventilatorSupport:
                item.ventilatorSupport ??
                false,
            }))
            .filter(
              (item) =>
                item.reason
            ),
      };

      try {
        await savePastHistory(
          patientId,
          payload
        );

        return true;
      } catch (error: any) {
        console.error(
          "PAST HISTORY SAVE FAILED:",
          error?.response?.data ??
            error
        );

        return false;
      }
    },
    [
      patientId,
      buildChronicDiseases,
      selectedDiseases,
      pastHistory.hospitalizations,
      pastHistory.operations,
      pastHistory.bloodTransfusions,
      pastHistory.majorTraumas,
      pastHistory.icuAdmissions,
    ]
  );

  /* ====================================================
     Chronic Diseases Auto Save
  ==================================================== */

  useEffect(() => {
    if (
      !patientId ||
      isHydrating ||
      !chronicDiseasesDirty
    ) {
      return;
    }

    const version =
      chronicSaveVersion.current;

    const timer =
      setTimeout(async () => {
        /*
         * Prevent duplicate concurrent requests.
         */

        if (chronicSavingRef.current) {
          return;
        }

        chronicSavingRef.current =
          true;

        setChronicSaving(true);

        const success =
          await saveSnapshot({
            chronicDiseaseCodes:
              selectedDiseases,
          });

        chronicSavingRef.current =
          false;

        setChronicSaving(false);

        /*
         * Only mark the current change as saved if
         * the user did not change Chronic Diseases
         * again while the request was running.
         */

        if (
          success &&
          chronicSaveVersion.current ===
            version
        ) {
          setChronicDiseasesDirty(
            false
          );
        }
      }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    patientId,
    selectedDiseases,
    chronicDiseasesDirty,
    isHydrating,
    saveSnapshot,
  ]);

  /* ====================================================
     General Saving State
  ==================================================== */

  const [
    savingSection,
    setSavingSection,
  ] = useState<SavingSection>(null);

  const isSaving =
    savingSection !== null ||
    chronicSaving;

  /* ====================================================
     Date Picker
  ==================================================== */

  const [
    datePickerTarget,
    setDatePickerTarget,
  ] =
    useState<DatePickerTarget>(
      null
    );

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
      null
    );

  const clearHospitalizationForm =
    () => {
      setHospitalizationReason(
        ""
      );
      setHospitalizationDate("");
      setHospitalizationDuration(
        ""
      );
      setEditingHospitalizationId(
        null
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
        "hospitalization"
      );

      try {
        if (
          editingHospitalizationId
        ) {
          const updated =
            pastHistory.hospitalizations.map(
              (item) =>
                item.id ===
                editingHospitalizationId
                  ? {
                      ...item,
                      reason:
                        hospitalizationReason.trim(),
                      date:
                        hospitalizationDate,
                      duration:
                        hospitalizationDuration.trim(),
                    }
                  : item
            );

          updateHospitalization(
            editingHospitalizationId,
            {
              reason:
                hospitalizationReason.trim(),
              date:
                hospitalizationDate,
              duration:
                hospitalizationDuration.trim(),
            }
          );

          await saveSnapshot({
            hospitalizations:
              updated,
          });
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
            newItem
          );

          await saveSnapshot({
            hospitalizations: [
              ...pastHistory.hospitalizations,
              newItem,
            ],
          });
        }

        clearHospitalizationForm();
      } finally {
        setSavingSection(null);
      }
    };

  const handleDeleteHospitalization =
    async (id: string) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "hospitalization"
      );

      try {
        const updated =
          pastHistory.hospitalizations.filter(
            (item) =>
              item.id !== id
          );

        removeHospitalization(id);

        await saveSnapshot({
          hospitalizations:
            updated,
        });
      } finally {
        setSavingSection(null);
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
      null
    );

  const clearOperationForm =
    () => {
      setOperationName("");
      setOperationDate("");
      setOperationIndication("");
      setEditingOperationId(
        null
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
        "operation"
      );

      try {
        if (
          editingOperationId
        ) {
          const updated =
            pastHistory.operations.map(
              (item) =>
                item.id ===
                editingOperationId
                  ? {
                      ...item,
                      name:
                        operationName.trim(),
                      date:
                        operationDate,
                      indication:
                        operationIndication.trim(),
                    }
                  : item
            );

          updateOperation(
            editingOperationId,
            {
              name:
                operationName.trim(),
              date:
                operationDate,
              indication:
                operationIndication.trim(),
            }
          );

          await saveSnapshot({
            operations: updated,
          });
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

          addOperation(newItem);

          await saveSnapshot({
            operations: [
              ...pastHistory.operations,
              newItem,
            ],
          });
        }

        clearOperationForm();
      } finally {
        setSavingSection(null);
      }
    };

  const handleDeleteOperation =
    async (id: string) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "operation"
      );

      try {
        const updated =
          pastHistory.operations.filter(
            (item) =>
              item.id !== id
          );

        removeOperation(id);

        await saveSnapshot({
          operations: updated,
        });
      } finally {
        setSavingSection(null);
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
      null
    );

  const clearBloodTransfusionForm =
    () => {
      setTransfusionReason("");
      setTransfusionDate("");
      setTransfusionReaction("");
      setEditingBloodTransfusionId(
        null
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
        "transfusion"
      );

      try {
        if (
          editingBloodTransfusionId
        ) {
          const updated =
            pastHistory.bloodTransfusions.map(
              (item) =>
                item.id ===
                editingBloodTransfusionId
                  ? {
                      ...item,
                      reason:
                        transfusionReason.trim(),
                      date:
                        transfusionDate,
                      reaction:
                        transfusionReaction.trim(),
                    }
                  : item
            );

          updateBloodTransfusion(
            editingBloodTransfusionId,
            {
              reason:
                transfusionReason.trim(),
              date:
                transfusionDate,
              reaction:
                transfusionReaction.trim(),
            }
          );

          await saveSnapshot({
            bloodTransfusions:
              updated,
          });
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
            newItem
          );

          await saveSnapshot({
            bloodTransfusions: [
              ...pastHistory.bloodTransfusions,
              newItem,
            ],
          });
        }

        clearBloodTransfusionForm();
      } finally {
        setSavingSection(null);
      }
    };

  const handleDeleteBloodTransfusion =
    async (id: string) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "transfusion"
      );

      try {
        const updated =
          pastHistory.bloodTransfusions.filter(
            (item) =>
              item.id !== id
          );

        removeBloodTransfusion(id);

        await saveSnapshot({
          bloodTransfusions:
            updated,
        });
      } finally {
        setSavingSection(null);
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
      null
    );

  const clearMajorTraumaForm =
    () => {
      setTraumaType("");
      setTraumaDate("");
      setTraumaComplications("");
      setEditingMajorTraumaId(
        null
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
        "trauma"
      );

      try {
        if (
          editingMajorTraumaId
        ) {
          const updated =
            pastHistory.majorTraumas.map(
              (item) =>
                item.id ===
                editingMajorTraumaId
                  ? {
                      ...item,
                      type:
                        traumaType.trim(),
                      date:
                        traumaDate,
                      complications:
                        traumaComplications.trim(),
                    }
                  : item
            );

          updateMajorTrauma(
            editingMajorTraumaId,
            {
              type:
                traumaType.trim(),
              date:
                traumaDate,
              complications:
                traumaComplications.trim(),
            }
          );

          await saveSnapshot({
            majorTraumas:
              updated,
          });
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

          addMajorTrauma(newItem);

          await saveSnapshot({
            majorTraumas: [
              ...pastHistory.majorTraumas,
              newItem,
            ],
          });
        }

        clearMajorTraumaForm();
      } finally {
        setSavingSection(null);
      }
    };

  const handleDeleteMajorTrauma =
    async (id: string) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "trauma"
      );

      try {
        const updated =
          pastHistory.majorTraumas.filter(
            (item) =>
              item.id !== id
          );

        removeMajorTrauma(id);

        await saveSnapshot({
          majorTraumas:
            updated,
        });
      } finally {
        setSavingSection(null);
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
      null
    );

  const clearICUForm =
    () => {
      setIcuReason("");
      setIcuDate("");
      setIcuDuration("");
      setIcuVentilatorSupport(
        false
      );
      setEditingICUAdmissionId(
        null
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
        "icu"
      );

      try {
        if (
          editingICUAdmissionId
        ) {
          const updated =
            pastHistory.icuAdmissions.map(
              (item) =>
                item.id ===
                editingICUAdmissionId
                  ? {
                      ...item,
                      reason:
                        icuReason.trim(),
                      date:
                        icuDate,
                      duration:
                        icuDuration.trim(),
                      ventilatorSupport:
                        icuVentilatorSupport,
                    }
                  : item
            );

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
            }
          );

          await saveSnapshot({
            icuAdmissions:
              updated,
          });
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
            newItem
          );

          await saveSnapshot({
            icuAdmissions: [
              ...pastHistory.icuAdmissions,
              newItem,
            ],
          });
        }

        clearICUForm();
      } finally {
        setSavingSection(null);
      }
    };

  const handleDeleteICUAdmission =
    async (id: string) => {
      if (savingSection) {
        return;
      }

      setSavingSection(
        "icu"
      );

      try {
        const updated =
          pastHistory.icuAdmissions.filter(
            (item) =>
              item.id !== id
          );

        removeICUAdmission(id);

        await saveSnapshot({
          icuAdmissions:
            updated,
        });
      } finally {
        setSavingSection(null);
      }
    };

  /* ====================================================
     Date Picker Handlers
  ==================================================== */

  const openDatePicker = (
    target: Exclude<
      DatePickerTarget,
      null
    >
  ) => {
    if (
      isHydrating ||
      isSaving
    ) {
      return;
    }

    setDatePickerTarget(
      target
    );
  };

  const getPickerValue = (): Date => {
    switch (
      datePickerTarget
    ) {
      case "hospitalization":
        return parseDate(
          hospitalizationDate
        );

      case "operation":
        return parseDate(
          operationDate
        );

      case "transfusion":
        return parseDate(
          transfusionDate
        );

      case "trauma":
        return parseDate(
          traumaDate
        );

      case "icu":
        return parseDate(
          icuDate
        );

      default:
        return new Date();
    }
  };

  /*
   * DateTimePicker API:
   * onChange is deprecated.
   * Use onValueChange for the selected date
   * and onDismiss for closing the picker.
   */

  const handleDateValueChange: NonNullable<
    ComponentProps<typeof DateTimePicker>["onValueChange"]
  > = (_event, selectedDate) => {
    if (!selectedDate) {
      return;
    }

    const formattedDate =
      formatDate(selectedDate);

    switch (datePickerTarget) {
      case "hospitalization":
        setHospitalizationDate(formattedDate);
        break;

      case "operation":
        setOperationDate(formattedDate);
        break;

      case "transfusion":
        setTransfusionDate(formattedDate);
        break;

      case "trauma":
        setTraumaDate(formattedDate);
        break;

      case "icu":
        setIcuDate(formattedDate);
        break;
    }

    setDatePickerTarget(null);
  };

  const handleDateDismiss = () => {
    setDatePickerTarget(
      null
    );
  };

  /* ====================================================
     Load Existing Past History
  ==================================================== */

  useEffect(() => {
    if (
      !patientId ||
      loadedPatientId.current ===
        patientId
    ) {
      return;
    }

    const existingHospitalizations =
      [
        ...pastHistory.hospitalizations,
      ];

    const existingOperations =
      [
        ...pastHistory.operations,
      ];

    const existingBloodTransfusions =
      [
        ...pastHistory.bloodTransfusions,
      ];

    const existingMajorTraumas =
      [
        ...pastHistory.majorTraumas,
      ];

    const existingICUAdmissions =
      [
        ...pastHistory.icuAdmissions,
      ];

    const loadPastHistory =
      async () => {
        try {
          setIsHydrating(true);

          /*
           * Stop Chronic Disease autosave while
           * Backend data is being loaded.
           */

          setChronicDiseasesDirty(
            false
          );

          const data =
            await getPastHistory(
              patientId
            );

          if (!data) {
            loadedPatientId.current =
              patientId;
            return;
          }

          const mapped =
            mapPastHistoryFromBackend(
              data
            );

          /* ---------------------------------------------
             Chronic Diseases
          --------------------------------------------- */

          updatePastHistoryField(
            "chronicDiseases",
            "Chronic Diseases",
            mapped.chronicDiseases.map(
              (item: any) =>
                item.diseaseCode
            )
          );

          /* ---------------------------------------------
             Hospitalizations
          --------------------------------------------- */

          existingHospitalizations.forEach(
            (item) =>
              removeHospitalization(
                item.id
              )
          );

          mapped.hospitalizations.forEach(
            (item: any) =>
              addHospitalization({
                id:
                  item.id ??
                  `${Date.now()}-${Math.random()}`,
                reason:
                  item.reason ?? "",
                date:
                  item.date ?? "",
                duration:
                  item.duration ?? "",
              })
          );

          /* ---------------------------------------------
             Operations
          --------------------------------------------- */

          existingOperations.forEach(
            (item) =>
              removeOperation(
                item.id
              )
          );

          mapped.operations.forEach(
            (item: any) =>
              addOperation({
                id:
                  item.id ??
                  `${Date.now()}-${Math.random()}`,
                name:
                  item.name ?? "",
                date:
                  item.date ?? "",
                indication:
                  item.indication ?? "",
              })
          );

          /* ---------------------------------------------
             Blood Transfusions
          --------------------------------------------- */

          existingBloodTransfusions.forEach(
            (item) =>
              removeBloodTransfusion(
                item.id
              )
          );

          mapped.bloodTransfusions.forEach(
            (item: any) =>
              addBloodTransfusion({
                id:
                  item.id ??
                  `${Date.now()}-${Math.random()}`,
                reason:
                  item.reason ?? "",
                date:
                  item.date ?? "",
                reaction:
                  item.reaction ?? "",
              })
          );

          /* ---------------------------------------------
             Major Trauma
          --------------------------------------------- */

          existingMajorTraumas.forEach(
            (item) =>
              removeMajorTrauma(
                item.id
              )
          );

          mapped.majorTraumas.forEach(
            (item: any) =>
              addMajorTrauma({
                id:
                  item.id ??
                  `${Date.now()}-${Math.random()}`,
                type:
                  item.type ?? "",
                date:
                  item.date ?? "",
                complications:
                  item.complications ??
                  "",
              })
          );

          /* ---------------------------------------------
             ICU Admissions
          --------------------------------------------- */

          existingICUAdmissions.forEach(
            (item) =>
              removeICUAdmission(
                item.id
              )
          );

          mapped.icuAdmissions.forEach(
            (item: any) =>
              addICUAdmission({
                id:
                  item.id ??
                  `${Date.now()}-${Math.random()}`,
                reason:
                  item.reason ?? "",
                date:
                  item.date ?? "",
                duration:
                  item.duration ?? "",
                ventilatorSupport:
                  item.ventilatorSupport ??
                  false,
              })
          );

          /*
           * Important:
           * We explicitly consider the loaded data
           * already synchronized with the backend.
           */

          setChronicDiseasesDirty(
            false
          );

          loadedPatientId.current =
            patientId;
        } catch (error) {
          console.error(
            "Failed to load past history:",
            error
          );
        } finally {
          setIsHydrating(false);
        }
      };

    loadPastHistory();
  }, [
    patientId,
    updatePastHistoryField,
    addHospitalization,
    removeHospitalization,
    addOperation,
    removeOperation,
    addBloodTransfusion,
    removeBloodTransfusion,
    addMajorTrauma,
    removeMajorTrauma,
    addICUAdmission,
    removeICUAdmission,
  ]);

  /* ====================================================
     Render
  ==================================================== */

  return (
    <View style={styles.container}>
      {/* ==================================================
          Chronic Diseases
      ================================================== */}

      <SectionHeader
        title="Chronic Diseases"
      />

      <View style={styles.chipRow}>
        {chronicDiseases.map(
          (disease) => (
            <AppChip
              key={disease.code}
              label={disease.name}
              selected={selectedDiseases.includes(
                disease.code
              )}
              onPress={() =>
                toggleMultiSelect(
                  "chronicDiseases",
                  "Chronic Diseases",
                  disease.code
                )
              }
            />
          )
        )}
      </View>

      {chronicSaving && (
        <Text style={styles.saveStatus}>
          Saving chronic diseases...
        </Text>
      )}

      <Divider />

      {/* ==================================================
          Hospitalizations
      ================================================== */}

      <SectionHeader
        title="Hospitalizations"
      />

      <View style={styles.card}>
        <AppTextField
          placeholder="Reason"
          value={
            hospitalizationReason
          }
          onChangeText={
            setHospitalizationReason
          }
          editable={
            savingSection !==
            "hospitalization"
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
            savingSection !==
            "hospitalization"
          }
        />

        <DateField
          value={
            hospitalizationDate
          }
          disabled={
            savingSection !==
            null
          }
          onPress={() =>
            openDatePicker(
              "hospitalization"
            )
          }
        />
        
        <Text
          style={styles.helperText}
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
            isHydrating ||
            savingSection !==
              null ||
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
                  isSaving
                }
                onPress={() => {
                  setEditingHospitalizationId(
                    item.id
                  );
                  setHospitalizationReason(
                    item.reason
                  );
                  setHospitalizationDate(
                    item.date
                  );
                  setHospitalizationDuration(
                    item.duration
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isSaving
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
                  isSaving
                }
                onPress={() =>
                  handleDeleteHospitalization(
                    item.id
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isSaving
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )
      )}

      <Divider />

      {/* ==================================================
          Operations
      ================================================== */}

      <SectionHeader
        title="Operations"
      />

      <View style={styles.card}>
        <AppTextField
          placeholder="Operation"
          value={
            operationName
          }
          onChangeText={
            setOperationName
          }
          editable={
            savingSection !==
            "operation"
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
            savingSection !==
            "operation"
          }
        />

        <DateField
          value={
            operationDate
          }
          disabled={
            savingSection !==
            null
          }
          onPress={() =>
            openDatePicker(
              "operation"
            )
          }
        />

        <Text
          style={styles.helperText}
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
            isHydrating ||
            savingSection !==
              null ||
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
                  isSaving
                }
                onPress={() => {
                  setEditingOperationId(
                    item.id
                  );
                  setOperationName(
                    item.name
                  );
                  setOperationDate(
                    item.date
                  );
                  setOperationIndication(
                    item.indication
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isSaving
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
                  isSaving
                }
                onPress={() =>
                  handleDeleteOperation(
                    item.id
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isSaving
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )
      )}

      <Divider />

      {/* ==================================================
          Blood Transfusions
      ================================================== */}

      <SectionHeader
        title="Blood Transfusions"
      />

      <View style={styles.card}>
        <AppTextField
          placeholder="Reason"
          value={
            transfusionReason
          }
          onChangeText={
            setTransfusionReason
          }
          editable={
            savingSection !==
            "transfusion"
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
            savingSection !==
            "transfusion"
          }
        />

        <DateField
          value={
            transfusionDate
          }
          disabled={
            savingSection !==
            null
          }
          onPress={() =>
            openDatePicker(
              "transfusion"
            )
          }
        />

        <Text
          style={styles.helperText}
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
            isHydrating ||
            savingSection !==
              null ||
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
                  isSaving
                }
                onPress={() => {
                  setEditingBloodTransfusionId(
                    item.id
                  );
                  setTransfusionReason(
                    item.reason
                  );
                  setTransfusionDate(
                    item.date
                  );
                  setTransfusionReaction(
                    item.reaction
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isSaving
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
                  isSaving
                }
                onPress={() =>
                  handleDeleteBloodTransfusion(
                    item.id
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isSaving
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )
      )}

      <Divider />

      {/* ==================================================
          Major Trauma
      ================================================== */}

      <SectionHeader
        title="Major Trauma"
      />

      <View style={styles.card}>
        <AppTextField
          placeholder="Type"
          value={
            traumaType
          }
          onChangeText={
            setTraumaType
          }
          editable={
            savingSection !==
            "trauma"
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
            savingSection !==
            "trauma"
          }
        />

        <DateField
          value={
            traumaDate
          }
          disabled={
            savingSection !==
            null
          }
          onPress={() =>
            openDatePicker(
              "trauma"
            )
          }
        />

        <Text
          style={styles.helperText}
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
            isHydrating ||
            savingSection !==
              null ||
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
                  isSaving
                }
                onPress={() => {
                  setEditingMajorTraumaId(
                    item.id
                  );
                  setTraumaType(
                    item.type
                  );
                  setTraumaDate(
                    item.date
                  );
                  setTraumaComplications(
                    item.complications
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isSaving
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
                  isSaving
                }
                onPress={() =>
                  handleDeleteMajorTrauma(
                    item.id
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isSaving
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )
      )}

      <Divider />

      {/* ==================================================
          ICU Admissions
      ================================================== */}

      <SectionHeader
        title="ICU Admissions"
      />

      <View style={styles.card}>
        <AppTextField
          placeholder="Reason"
          value={
            icuReason
          }
          onChangeText={
            setIcuReason
          }
          editable={
            savingSection !==
            "icu"
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
            savingSection !==
            "icu"
          }
        />

        <DateField
          value={
            icuDate
          }
          disabled={
            savingSection !==
            null
          }
          onPress={() =>
            openDatePicker(
              "icu"
            )
          }
        />

        {/* <View
          style={
            styles.chipRow
          }
        >
          <AppChip
            label="Yes"
            selected={
              icuVentilatorSupport ===
              true
            }
            disabled={
              savingSection !==
              null
            }
            onPress={() =>
              setIcuVentilatorSupport(
                true
              )
            }
          />

          <AppChip
            label="No"
            selected={
              icuVentilatorSupport ===
              false
            }
            disabled={
              savingSection !==
              null
            }
            onPress={() =>
              setIcuVentilatorSupport(
                false
              )
            }
          />
        </View> */}

        <Text
          style={styles.helperText}
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
            isHydrating ||
            savingSection !==
              null ||
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
                  isSaving
                }
                onPress={() => {
                  setEditingICUAdmissionId(
                    item.id
                  );
                  setIcuReason(
                    item.reason
                  );
                  setIcuDate(
                    item.date
                  );
                  setIcuDuration(
                    item.duration
                  );
                  setIcuVentilatorSupport(
                    item.ventilatorSupport
                  );
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={
                    isSaving
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
                  isSaving
                }
                onPress={() =>
                  handleDeleteICUAdmission(
                    item.id
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={
                    isSaving
                      ? COLORS.secondaryText
                      : "#D32F2F"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )
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

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  card: {
    gap: SPACING.sm,
  },

  chipRow: {
    flexDirection:
      "row",
    flexWrap: "wrap",
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

  dateFieldContainer: {
    gap: SPACING.xs,
  },

  dateLabel: {
    fontSize:
      TYPOGRAPHY.small,
    color:
      COLORS.secondaryText,
    fontWeight: "600",
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
    fontWeight: "700",
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