import { useEffect, useRef } from "react";
import {
  saveSystemExamination,
  type SaveSystemExaminationInput,
  type SystemExaminationItem,
} from "@/services/visitApi";
import type {
  DynamicFieldValue,
  SystemExamination,
} from "@/models/VisitForm/examination";

interface Props {
  visitId?: string;
  systemExamination: SystemExamination;
  isHydrating?: boolean;
}

/**
 * UI system ids -> Backend system names
 */
const systemToApi: Record<string, string> = {
  abdomen: "GIT",
  chest: "CHEST",
  cvs: "CVS",
  endocrine: "ENDOCRINE",
  ent: "ENT",
  gynecology: "GYNECOLOGY",
  musculoskeletal: "MUSCULOSKELETAL",
  neurology: "NEURO",
  obstetric: "OBSTETRIC",
  ophthalmology: "OPHTHALMOLOGY",
  skin: "SKIN",
};

/**
 * Backend system names -> UI system ids
 */
const systemFromApi: Record<string, string> = {
  GIT: "abdomen",
  CHEST: "chest",
  CVS: "cvs",
  ENDOCRINE: "endocrine",
  ENT: "ent",
  GYNECOLOGY: "gynecology",
  MUSCULOSKELETAL: "musculoskeletal",
  NEURO: "neurology",
  OBSTETRIC: "obstetric",
  OPHTHALMOLOGY: "ophthalmology",
  SKIN: "skin",
};

function fieldsToRecord(
  fields: DynamicFieldValue[],
): Record<string, unknown> {
  return fields.reduce<
    Record<string, unknown>
  >((result, field) => {
    result[field.fieldId] = field.value;
    return result;
  }, {});
}

function recordToFields(
  fields: Record<string, unknown>,
): DynamicFieldValue[] {
  return Object.entries(fields).map(
    ([fieldId, value]) => ({
      fieldId,
      fieldLabel: fieldId,
      value:
        value === null ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        Array.isArray(value)
          ? (value as DynamicFieldValue["value"])
          : String(value ?? ""),
    }),
  );
}

export function mapSystemExaminationToApi(
  systemExamination: SystemExamination,
): SaveSystemExaminationInput {
  const systems: SystemExaminationItem[] =
    systemExamination.systems.map(
      (system) => ({
        system:
          systemToApi[system.systemId] ??
          system.systemId,
        fields: fieldsToRecord(
          system.fields,
        ),
      }),
    );

  return {
    systems,
  };
}

export function mapSystemExaminationFromBackend(
  data: unknown,
): Partial<SystemExamination> {
  if (!Array.isArray(data)) {
    return {
      systems: [],
    };
  }

  const systems =
    data.reduce<
      SystemExamination["systems"]
    >((result, item) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return result;
      }

      const backendItem =
        item as Record<string, unknown>;

      if (
        typeof backendItem.system !==
        "string"
      ) {
        return result;
      }

      const systemId =
        systemFromApi[
          backendItem.system
        ] ?? backendItem.system;

      const backendFields =
        backendItem.fields;

      const fields =
        backendFields &&
        typeof backendFields ===
          "object" &&
        !Array.isArray(backendFields)
          ? recordToFields(
              backendFields as Record<
                string,
                unknown
              >,
            )
          : [];

      result.push({
        systemId,
        systemName: systemId,
        fields,
      });

      return result;
    }, []);

  return {
    systems,
  };
}

export default function useSystemExaminationAutoSave({
  visitId,
  systemExamination,
  isHydrating = false,
}: Props) {
  const isFirstRender = useRef(true);

  const hydratedSignature = useRef<
    string | null
  >(null);

  /**
   * Ensures that only ONE save request
   * is running at a time.
   */
  const saveQueue = useRef<
    Promise<void>
  >(Promise.resolve());

  useEffect(() => {
    if (!visitId) {
      return;
    }

    const signature =
      JSON.stringify(systemExamination);

    /**
     * Ignore the initial render.
     */
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    /**
     * Ignore changes caused by loading
     * data from backend.
     */
    if (isHydrating) {
      hydratedSignature.current =
        signature;
      return;
    }

    /**
     * Ignore the exact state that was
     * produced by hydration.
     */
    if (
      hydratedSignature.current ===
      signature
    ) {
      hydratedSignature.current = null;
      return;
    }

    const timer = setTimeout(() => {
      const payload =
        mapSystemExaminationToApi(
          systemExamination,
        );

      /**
       * Add the save operation to the queue.
       *
       * This prevents concurrent PUT requests
       * for the same visit.
       */
      saveQueue.current =
        saveQueue.current
          .catch(() => {
            /**
             * Keep the queue alive even if
             * the previous request failed.
             */
          })
          .then(async () => {
            try {
              await saveSystemExamination(
                visitId,
                payload,
              );
            } catch (error: any) {
              console.error(
                "SYSTEM EXAMINATION AUTOSAVE FAILED:",
                error?.response?.data ??
                  error,
              );
            }
          });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visitId,
    isHydrating,
    JSON.stringify(systemExamination),
  ]);
}