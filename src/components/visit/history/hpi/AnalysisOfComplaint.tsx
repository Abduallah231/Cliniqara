import { Text } from "react-native";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ComplaintTemplateRenderer from "@/features/complaints/components/ComplaintTemplateRenderer";

import useComplaintAutoSave from "@/features/complaints/hooks/useComplaintAutoSave";

import {
  getChiefComplaintTemplate,
} from "@/services/chiefComplaintApi";

import {
  getChiefComplaint,
} from "@/services/visitApi";

import { useVisitStore } from "@/store/visitStore";

import { ComplaintTemplate } from "@/features/complaints/models/ComplaintTemplate";

import GenericAnalysis from "./GenericAnalysis";

export default function AnalysisOfComplaint() {
  const visit =
    useVisitStore(
      (state) => state.visit
    );

  const updateAnalysisField =
    useVisitStore(
      (state) =>
        state.updateAnalysisField
    );

  const setAnalysisFields =
    useVisitStore(
      (state) =>
        state.setAnalysisFields
    );

  const chiefComplaint =
    visit.history.chiefComplaint;

  const visitId =
    visit.metadata.id;

  const complaintId =
    chiefComplaint.complaintId;

  const [template, setTemplate] =
    useState<
      ComplaintTemplate | undefined
    >();

  const [
    isHydrating,
    setIsHydrating,
  ] = useState(false);

  const loadedComplaintKey =
    useRef<string | null>(null);

  const requestId =
    useRef(0);

  /*
   * ======================================================
   * Load Template
   * ======================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadTemplate() {
      if (!complaintId) {
        setTemplate(undefined);
        return;
      }

      try {
        const data =
          await getChiefComplaintTemplate(
            complaintId
          );

        if (!cancelled) {
          setTemplate(
            data.template
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load complaint template:",
            error
          );

          setTemplate(undefined);
        }
      }
    }

    loadTemplate();

    return () => {
      cancelled = true;
    };
  }, [complaintId]);

  /*
   * ======================================================
   * Load Saved Analysis
   * ======================================================
   *
   * This is independent from ChiefComplaint.tsx.
   *
   * It only hydrates:
   *
   * data.analysis.values
   *
   */

  useEffect(() => {
    let cancelled = false;

    if (
      !visitId ||
      !complaintId
    ) {
      loadedComplaintKey.current =
        null;

      setAnalysisFields([]);

      return;
    }

    const key =
      `${visitId}:${complaintId}`;

    /*
     * Already hydrated for this
     * visit + complaint.
     */
    if (
      loadedComplaintKey.current ===
      key
    ) {
      return;
    }

    const currentRequestId =
      ++requestId.current;

    async function loadAnalysis() {
      setIsHydrating(true);

      try {
        const data =
          await getChiefComplaint(
            visitId,
            complaintId
          );

        if (
          cancelled ||
          currentRequestId !==
            requestId.current
        ) {
          return;
        }

        const backendValues =
          data?.analysis?.values;

        if (
          !backendValues ||
          typeof backendValues !==
            "object" ||
          Array.isArray(
            backendValues
          )
        ) {
          setAnalysisFields([]);

          loadedComplaintKey.current =
            key;

          return;
        }

        const templateFields =
          template?.sections?.flatMap(
            (section: any) =>
              section.fields ?? []
          ) ?? [];

        const fields =
          Object.entries(
            backendValues
          ).map(
            ([fieldId, value]) => {
              const templateField =
                templateFields.find(
                  (field: any) =>
                    field.fieldId ===
                    fieldId
                );

              return {
                fieldId,

                fieldLabel:
                  templateField
                    ?.fieldLabel ??
                  fieldId,

                value:
                  value as any,
              };
            }
          );

        setAnalysisFields(
          fields
        );

        loadedComplaintKey.current =
          key;
      } catch (error) {
        if (
          !cancelled &&
          currentRequestId ===
            requestId.current
        ) {
          console.error(
            "Failed to load chief complaint analysis:",
            error
          );

          setAnalysisFields([]);

          loadedComplaintKey.current =
            key;
        }
      } finally {
        if (
          !cancelled &&
          currentRequestId ===
            requestId.current
        ) {
          setIsHydrating(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [
    visitId,
    complaintId,
    template,
    setAnalysisFields,
  ]);

  /*
   * ======================================================
   * Store → Renderer
   * ======================================================
   */

  const values =
    useMemo(() => {
      const result: Record<
        string,
        any
      > = {};

      for (
        const field of
          visit.history.hpi.analysis
            .fields
      ) {
        result[field.fieldId] =
          field.value;
      }

      return result;
    }, [
      visit.history.hpi.analysis
        .fields,
    ]);

  /*
   * ======================================================
   * Renderer → Store
   * ======================================================
   */

  const handleChange = (
    fieldId: string,
    value: any,
    unit?: string
  ) => {
    if (!template) {
      return;
    }

    const field =
      template.sections
        ?.flatMap(
          (section: any) =>
            section.fields ?? []
        )
        .find(
          (item: any) =>
            item.fieldId ===
            fieldId
        );

    updateAnalysisField(
      fieldId,
      field?.fieldLabel ??
        fieldId,
      value,
      unit
    );
  };

  /*
   * ======================================================
   * Autosave
   * ======================================================
   */

  useComplaintAutoSave({
    visitId,
    chiefComplaintId:
      complaintId,
    answers: values,
    isHydrating,
  });

  /*
   * ======================================================
   * UI
   * ======================================================
   */

  if (!complaintId) {
    return (
      <Text>
        Please select a chief complaint first.
      </Text>
    );
  }

  if (!template) {
    return (
      <GenericAnalysis />
    );
  }

  return (
    <ComplaintTemplateRenderer
      template={template}
      values={values}
      onChange={handleChange}
    />
  );
}