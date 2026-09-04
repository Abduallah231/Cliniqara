import Ionicons from "@expo/vector-icons/Ionicons";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import AppEmptyState from "@/components/common/AppEmptyState";
import AppTopBar from "@/components/common/AppTopBar";

import {
  getChiefComplaintTemplate,
} from "@/services/chiefComplaintApi";

import {
  getReadOnlyVisitDetails,
} from "@/services/visitApi";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

// ======================================================
// Types
// ======================================================

type VisitStatus =
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

type DynamicField = {
  fieldId?: string;
  fieldLabel?: string;
  value?: unknown;
  unit?: string | null;
};

type ReadOnlyVisit = {
  id: string;
  visitCode: string;
  patientId: string;
  clinicId: string;
  doctorId: string;

  visitStatus: VisitStatus;

  visitDate?: string | null;

  createdAt: string;
  updatedAt?: string | null;

  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;

  cancellationReason?: string | null;
  notes?: string | null;

  patient?: {
    id?: string;

    patientCode?: string | null;
    fullName?: string | null;

    identifierType?: string | null;
    identifierNumber?: string | null;

    documentType?: string | null;

    dateOfBirth?: string | null;

    estimatedAgeValue?: number | null;
    estimatedAgeUnit?: string | null;

    maritalStatus?: string | null;
    childrenCount?: number | null;

    governorate?: string | null;
    city?: string | null;
    district?: string | null;
    streetAddress?: string | null;

    gender?: string | null;
    phone?: string | null;
    occupation?: string | null;
  } | null;

  doctor?: {
    id?: string;

    userCode?: string | null;
    fullName?: string | null;

    accountType?: string | null;
    doctorLevel?: string | null;

    specialty?: string | null;
    professionalTitle?: string | null;
  } | null;

  clinic?: {
    id?: string;

    clinicCode?: string | null;
    name?: string | null;

    phone?: string | null;
    email?: string | null;

    address?: string | null;
    country?: string | null;
    city?: string | null;
  } | null;

  chiefComplaint?: {
    chiefComplaint?: {
      id?: string;
      name?: string | null;
    } | null;

    durationValue?: number | null;
    durationUnit?: string | null;

    analysis?: {
      id?: string;
      templateCode?: string | null;
      templateVersion?: number | null;
      values?: Record<
        string,
        unknown
      > | null;
    } | null;
  } | null;

  relatedSystems?: unknown;
  systematicReview?: unknown;

  pediatricHistory?: unknown;
  menstrualHistory?: unknown;

  vitalSigns?: unknown;
  generalInspection?: unknown;

  regionalExaminations?: unknown;
  systemExaminations?: unknown;

  diagnosis?: {
    id?: string;

    primaryDiagnosisCode?: string | null;
    primaryDiagnosisName?: string | null;

    differentialDiagnoses?:
      | {
          code?: string | null;
          diagnosis?: string | null;
        }[]
      | null;
  } | null;

  investigations?: {
    id?: string;

    code?: string | null;
    name?: string | null;
    status?: string | null;

    result?:
      | DynamicField[]
      | null;

    notes?: string | null;

    images?: {
      id?: string;
      fileUrl?: string | null;
      sortOrder?: number | null;
    }[];
  }[];

  procedures?: {
    details?: string | null;
  }[];

  referrals?: {
    details?: string | null;
  }[];

  prescription?: {
    advice?: string | null;
    notes?: string | null;
    followUp?: string | null;

    medications?: {
      medication?: string | null;
      instructions?: string | null;

      durationValue?: number | null;
      durationUnit?: string | null;

      sortOrder?: number | null;
    }[];
  } | null;
};

// ======================================================
// Constants
// ======================================================

const HIDDEN_KEYS = new Set([
  "id",
  "visitId",
  "patientId",
  "clinicId",
  "doctorId",

  "createdAt",
  "updatedAt",
  "createdById",

  "prescriptionId",
  "investigationId",
  "drugId",

  "sortOrder",

  "templateCode",
  "templateVersion",
]);

// ======================================================
// Helpers
// ======================================================

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isEmptyValue(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return true;
  }

  if (
    typeof value === "string" &&
    value.trim() === ""
  ) {
    return true;
  }

  if (
    Array.isArray(value) &&
    value.length === 0
  ) {
    return true;
  }

  if (
    isPlainObject(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }

  return false;
}

function formatLabel(
  value: string,
): string {
  return value
    .replace(
      /([a-z])([A-Z])/g,
      "$1 $2",
    )
    .replace(
      /[_-]+/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );
}

function formatEnum(
  value?: string | null,
): string {
  if (!value) {
    return "—";
  }

  return formatLabel(value);
}

function formatSimpleValue(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  if (
    typeof value === "boolean"
  ) {
    return value
      ? "Yes"
      : "No";
  }

  if (
    Array.isArray(value)
  ) {
    return value
      .map((item) =>
        formatSimpleValue(item),
      )
      .filter(
        (item) =>
          item !== "—",
      )
      .join(", ");
  }

  if (
    typeof value === "object"
  ) {
    return "—";
  }

  return String(value);
}

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function getStatusLabel(
  status: VisitStatus,
): string {
  switch (status) {
    case "COMPLETED":
      return "Completed";

    case "IN_PROGRESS":
      return "In Progress";

    case "WAITING":
      return "Waiting";

    case "CANCELLED":
      return "Cancelled";

    default:
      return formatEnum(status);
  }
}

function getStatusIcon(
  status: VisitStatus,
): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case "COMPLETED":
      return "checkmark-circle-outline";

    case "IN_PROGRESS":
      return "pulse-outline";

    case "WAITING":
      return "time-outline";

    case "CANCELLED":
      return "close-circle-outline";

    default:
      return "ellipse-outline";
  }
}

function getInvestigationStatusLabel(
  status?: string | null,
): string {
  switch (status) {
    case "COMPLETED":
    case "completed":
      return "Completed";

    case "CANCELLED":
    case "cancelled":
      return "Cancelled";

    case "REQUESTED":
    case "requested":
      return "Requested";

    default:
      return formatEnum(status);
  }
}

function getDurationLabel(
  value?: number | null,
  unit?: string | null,
): string | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const normalizedUnit =
    unit
      ? formatEnum(unit)
      : "";

  return `${value} ${normalizedUnit}`.trim();
}

// ======================================================
// Responsive
// ======================================================

function useColumns(): number {
  const {
    width,
  } = useWindowDimensions();

  if (width >= 1100) {
    return 3;
  }

  if (width >= 650) {
    return 2;
  }

  return 1;
}

// ======================================================
// Major Group Header
// ======================================================

function MajorGroupHeader({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.majorGroupHeader}>
      <View style={styles.majorGroupAccent} />

      <View style={styles.majorGroupIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.majorGroupText}>
        <Text style={styles.majorGroupTitle}>
          {title}
        </Text>

        <Text style={styles.majorGroupSubtitle}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

// ======================================================
// Subsection Header
// ======================================================

function SubsectionHeader({
  icon,
  title,
  count,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  count?: number;
}) {
  return (
    <View style={styles.subsectionHeader}>
      <View style={styles.subsectionIcon}>
        <Ionicons
          name={icon}
          size={17}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.subsectionTitle}>
        {title}
      </Text>

      {count !== undefined ? (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {count}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ======================================================
// Subsection
// ======================================================

function Subsection({
  icon,
  title,
  count,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.subsection}>
      <SubsectionHeader
        icon={icon}
        title={title}
        count={count}
      />

      <View style={styles.subsectionBody}>
        {children}
      </View>
    </View>
  );
}

// ======================================================
// Field
// ======================================================

function Field({
  label,
  value,
  columns = 1,
  emphasized = false,
}: {
  label: string;
  value: unknown;
  columns?: number;
  emphasized?: boolean;
}) {
  if (
    isEmptyValue(value)
  ) {
    return null;
  }

  return (
    <View
      style={[
        styles.field,
        columns === 2 &&
          styles.fieldTwoColumns,
        columns === 3 &&
          styles.fieldThreeColumns,
      ]}
    >
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.fieldValue,
          emphasized &&
            styles.fieldValueEmphasized,
        ]}
      >
        {formatSimpleValue(value)}
      </Text>
    </View>
  );
}

// ======================================================
// Tag
// ======================================================

function Tag({
  children,
}: {
  children: string;
}) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>
        {children}
      </Text>
    </View>
  );
}

// ======================================================
// Tag List
// ======================================================

function TagList({
  values,
}: {
  values?: unknown;
}) {
  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return null;
  }

  const normalized =
    values
      .map((item) =>
        formatSimpleValue(item),
      )
      .filter(
        (item) =>
          item !== "—",
      );

  if (
    normalized.length === 0
  ) {
    return null;
  }

  return (
    <View style={styles.tagList}>
      {normalized.map(
        (value, index) => (
          <Tag
            key={`${value}-${index}`}
          >
            {value}
          </Tag>
        ),
      )}
    </View>
  );
}

// ======================================================
// Dynamic Fields
// ======================================================

function DynamicFields({
  values,
  columns,
}: {
  values?: unknown;
  columns: number;
}) {
  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return null;
  }

  const fields =
    values.filter(
      (item): item is DynamicField =>
        isPlainObject(item) &&
        !isEmptyValue(
          item.value,
        ),
    );

  if (
    fields.length === 0
  ) {
    return null;
  }

  return (
    <View style={styles.fieldGrid}>
      {fields.map(
        (field, index) => (
          <Field
            key={
              field.fieldId ??
              `${field.fieldLabel}-${index}`
            }
            label={
              field.fieldLabel ??
              formatLabel(
                field.fieldId ??
                  `Field ${index + 1}`,
              )
            }
            value={
              field.unit
                ? `${formatSimpleValue(
                    field.value,
                  )} ${field.unit}`
                : field.value
            }
            columns={columns}
          />
        ),
      )}
    </View>
  );
}

// ======================================================
// Generic Clinical Data
// ======================================================

function ClinicalData({
  value,
  columns,
}: {
  value: unknown;
  columns: number;
}) {
  if (
    isEmptyValue(value)
  ) {
    return (
      <Text style={styles.emptyText}>
        No recorded data
      </Text>
    );
  }

  // ----------------------------------------------------
  // Array
  // ----------------------------------------------------

  if (
    Array.isArray(value)
  ) {
    const primitiveValues =
      value.filter(
        (item) =>
          !isPlainObject(
            item,
          ) &&
          !Array.isArray(item),
      );

    if (
      primitiveValues.length ===
      value.length
    ) {
      return (
        <TagList
          values={value}
        />
      );
    }

    return (
      <View style={styles.stack}>
        {value.map(
          (item, index) => (
            <View
              key={index}
              style={
                styles.dynamicItem
              }
            >
              <ClinicalData
                value={item}
                columns={columns}
              />
            </View>
          ),
        )}
      </View>
    );
  }

  // ----------------------------------------------------
  // Object
  // ----------------------------------------------------

  if (
    isPlainObject(value)
  ) {
    const entries =
      Object.entries(
        value,
      ).filter(
        ([key, item]) =>
          !HIDDEN_KEYS.has(
            key,
          ) &&
          !isEmptyValue(
            item,
          ),
      );

    if (
      entries.length === 0
    ) {
      return (
        <Text style={styles.emptyText}>
          No recorded data
        </Text>
      );
    }

    return (
      <View style={styles.fieldGrid}>
        {entries.map(
          ([key, item]) => {
            // ------------------------------------------
            // Dynamic field
            // ------------------------------------------

            if (
              isPlainObject(
                item,
              ) &&
              "fieldLabel" in item &&
              "value" in item
            ) {
              return (
                <Field
                  key={key}
                  label={
                    typeof item.fieldLabel ===
                    "string"
                      ? item.fieldLabel
                      : formatLabel(
                          key,
                        )
                  }
                  value={
                    "unit" in item &&
                    item.unit
                      ? `${formatSimpleValue(
                          item.value,
                        )} ${formatSimpleValue(
                          item.unit,
                        )}`
                      : item.value
                  }
                  columns={columns}
                />
              );
            }

            // ------------------------------------------
            // Nested array
            // ------------------------------------------

            if (
              Array.isArray(item)
            ) {
              return (
                <View
                  key={key}
                  style={
                    styles.complexField
                  }
                >
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    {formatLabel(
                      key,
                    )}
                  </Text>

                  <ClinicalData
                    value={item}
                    columns={columns}
                  />
                </View>
              );
            }

            // ------------------------------------------
            // Nested object
            // ------------------------------------------

            if (
              isPlainObject(item)
            ) {
              return (
                <View
                  key={key}
                  style={
                    styles.complexField
                  }
                >
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    {formatLabel(
                      key,
                    )}
                  </Text>

                  <ClinicalData
                    value={item}
                    columns={columns}
                  />
                </View>
              );
            }

            // ------------------------------------------
            // Simple field
            // ------------------------------------------

            return (
              <Field
                key={key}
                label={formatLabel(key)}
                value={item}
                columns={columns}
              />
            );
          },
        )}
      </View>
    );
  }

  return (
    <Text style={styles.singleValue}>
      {formatSimpleValue(value)}
    </Text>
  );
}

// ======================================================
// Text List
// ======================================================

function TextList({
  values,
}: {
  values: {
    details?: string | null;
  }[];
}) {
  const validItems =
    values.filter(
      (item) =>
        Boolean(
          item.details,
        ),
    );

  if (
    validItems.length === 0
  ) {
    return (
      <Text style={styles.emptyText}>
        No recorded data
      </Text>
    );
  }

  return (
    <View style={styles.textList}>
      {validItems.map(
        (item, index) => (
          <View
            key={index}
            style={styles.textListItem}
          >
            <View
              style={styles.listBullet}
            >
              <Text
                style={
                  styles.listBulletText
                }
              >
                {index + 1}
              </Text>
            </View>

            <Text
              style={
                styles.listItemText
              }
            >
              {item.details}
            </Text>
          </View>
        ),
      )}
    </View>
  );
}

// ======================================================
// Screen
// ======================================================

export default function VisitDetailsScreen() {
  const {
    visitId,
  } = useLocalSearchParams<{
    visitId?: string;
    patientId?: string;
  }>();

  const columns =
    useColumns();

  const [
    visit,
    setVisit,
  ] =
    useState<ReadOnlyVisit | null>(
      null,
    );

  const [
    analysisLabels,
    setAnalysisLabels,
  ] =
    useState<
      Record<string, string>
    >({});

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  // ======================================================
  // Load Visit
  // ======================================================

  const loadVisit =
    useCallback(
      async () => {
        if (!visitId) {
          setError(
            "Visit information is missing.",
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError(null);

          const data =
            await getReadOnlyVisitDetails(
              visitId,
            );

          setVisit(
            data as ReadOnlyVisit,
          );
        } catch (err) {
          console.error(
            "Failed to load visit details:",
            err,
          );

          setError(
            "Unable to load this visit.",
          );
        } finally {
          setLoading(false);
        }
      },
      [visitId],
    );

  useEffect(() => {
    void loadVisit();
  }, [loadVisit]);

  // ======================================================
  // Load Analysis Template
  // ======================================================

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysisTemplate() {
      const complaintId =
        visit
          ?.chiefComplaint
          ?.chiefComplaint
          ?.id;

      if (!complaintId) {
        setAnalysisLabels({});
        return;
      }

      try {
        const response =
          await getChiefComplaintTemplate(
            complaintId,
          );

        if (cancelled) {
          return;
        }

        const fields =
          response
            ?.template
            ?.sections
            ?.flatMap(
              (
                section: any,
              ) =>
                section.fields ?? [],
            ) ?? [];

        const labels: Record<
          string,
          string
        > = {};

        for (
          const field of fields
        ) {
          if (
            field?.fieldId
          ) {
            labels[
              field.fieldId
            ] =
              field.fieldLabel ??
              formatLabel(
                field.fieldId,
              );
          }
        }

        setAnalysisLabels(
          labels,
        );
      } catch (err) {
        console.error(
          "Failed to load analysis template:",
          err,
        );

        if (!cancelled) {
          setAnalysisLabels({});
        }
      }
    }

    void loadAnalysisTemplate();

    return () => {
      cancelled = true;
    };
  }, [
    visit
      ?.chiefComplaint
      ?.chiefComplaint
      ?.id,
  ]);

  // ======================================================
  // Analysis Fields
  // ======================================================

  const analysisFields =
    useMemo(() => {
      const values =
        visit
          ?.chiefComplaint
          ?.analysis
          ?.values;

      if (
        !values ||
        typeof values !==
          "object" ||
        Array.isArray(values)
      ) {
        return [];
      }

      return Object.entries(
        values,
      )
        .filter(
          ([, value]) =>
            !isEmptyValue(
              value,
            ),
        )
        .map(
          ([fieldId, value]) => ({
            fieldId,

            fieldLabel:
              analysisLabels[
                fieldId
              ] ??
              formatLabel(
                fieldId,
              ),

            value,
          }),
        );
    }, [
      visit,
      analysisLabels,
    ]);

    // ======================================================
    // Analysis Answer Chips
    // ======================================================

    function AnalysisAnswerChips({
    value,
    }: {
    value: unknown;
    }) {
    if (isEmptyValue(value)) {
        return null;
    }

    const values = Array.isArray(value)
        ? value
            .map((item) =>
            formatSimpleValue(item),
            )
            .filter(
            (item) => item !== "—",
            )
        : [
            formatSimpleValue(value),
        ].filter(
            (item) => item !== "—",
        );

    if (values.length === 0) {
        return null;
    }

    return (
        <View style={styles.analysisChipList}>
        {values.map(
            (answer, index) => (
            <View
                key={`${answer}-${index}`}
                style={styles.analysisChip}
            >
                <Text
                style={
                    styles.analysisChipText
                }
                >
                {answer}
                </Text>
            </View>
            ),
        )}
        </View>
    );
    }

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <AppTopBar
          title="Visit Details"
          onBack={() =>
            router.back()
          }
        />

        <View
          style={
            styles.centered
          }
        >
          <ActivityIndicator
            size="large"
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading visit details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ======================================================
  // Error
  // ======================================================

  if (
    error ||
    !visit
  ) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <AppTopBar
          title="Visit Details"
          onBack={() =>
            router.back()
          }
        />

        <View
          style={
            styles.centered
          }
        >
          <AppEmptyState
            title="Unable to Load Visit"
            subtitle={
              error ??
              "Visit information is unavailable."
            }
            icon="alert-circle-outline"
          />

          <Pressable
            onPress={() =>
              void loadVisit()
            }
            style={
              styles.retryButton
            }
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={
                COLORS.white
              }
            />

            <Text
              style={
                styles.retryText
              }
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ======================================================
  // Derived Data
  // ======================================================

  const status =
    getStatusLabel(
      visit.visitStatus,
    );

  const duration =
    getDurationLabel(
      visit
        .chiefComplaint
        ?.durationValue,
      visit
        .chiefComplaint
        ?.durationUnit,
    );

  const primaryDiagnosis =
    visit
      .diagnosis
      ?.primaryDiagnosisName;

  const primaryDiagnosisCode =
    visit
      .diagnosis
      ?.primaryDiagnosisCode;

  const differentialDiagnoses =
    visit
      .diagnosis
      ?.differentialDiagnoses ??
    [];

  const investigations =
    visit.investigations ??
    [];

  const medications =
    visit
      .prescription
      ?.medications ??
    [];

  // ======================================================
  // Render
  // ======================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      <AppTopBar
        title="Visit Details"
        onBack={() =>
          router.back()
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ==================================================
            Visit Header
        ================================================== */}

        <View
          style={
            styles.visitHero
          }
        >
          <View
            style={
              styles.heroIcon
            }
          >
            <Ionicons
              name="medical-outline"
              size={28}
              color={
                COLORS.primary
              }
            />
          </View>

          <View
            style={
              styles.heroContent
            }
          >
            <Text
              style={
                styles.visitTitle
              }
            >
              Visit{" "}
              {visit.visitCode}
            </Text>

            <Text
              style={
                styles.visitDate
              }
            >
              {formatDate(
                visit.createdAt,
              )}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              visit.visitStatus ===
                "COMPLETED" &&
                styles.statusCompleted,
              visit.visitStatus ===
                "CANCELLED" &&
                styles.statusCancelled,
              visit.visitStatus ===
                "IN_PROGRESS" &&
                styles.statusInProgress,
              visit.visitStatus ===
                "WAITING" &&
                styles.statusWaiting,
            ]}
          >
            <Ionicons
              name={getStatusIcon(
                visit.visitStatus,
              )}
              size={16}
              color={
                COLORS.primary
              }
            />

            <Text
              style={
                styles.statusText
              }
            >
              {status}
            </Text>
          </View>
        </View>

        {/* ==================================================
            HISTORY
        ================================================== */}

        <View
          style={
            styles.majorGroup
          }
        >
          <MajorGroupHeader
            icon="document-text-outline"
            title="History"
            subtitle="Patient history and presenting complaint"
          />

          {/* ----------------------------------------------
              Visit Information
          ---------------------------------------------- */}

          <Subsection
            icon="information-circle-outline"
            title="Visit Information"
          >
            <View
              style={
                styles.fieldGrid
              }
            >
              <Field
                label="Patient"
                value={
                  visit.patient
                    ?.fullName
                }
                columns={
                  columns
                }
                emphasized
              />

              <Field
                label="Patient Code"
                value={
                  visit.patient
                    ?.patientCode
                }
                columns={
                  columns
                }
              />

              <Field
                label="Doctor"
                value={
                  visit.doctor
                    ?.fullName
                }
                columns={
                  columns
                }
              />

              <Field
                label="Specialty"
                value={
                  visit.doctor
                    ?.specialty
                }
                columns={
                  columns
                }
              />

              <Field
                label="Clinic"
                value={
                  visit.clinic
                    ?.name
                }
                columns={
                  columns
                }
              />

              <Field
                label="Visit Date"
                value={formatDate(
                  visit.visitDate ??
                    visit.createdAt,
                )}
                columns={
                  columns
                }
              />

              <Field
                label="Started"
                value={formatDate(
                  visit.startedAt,
                )}
                columns={
                  columns
                }
              />

              <Field
                label="Completed"
                value={formatDate(
                  visit.completedAt,
                )}
                columns={
                  columns
                }
              />

              {visit.visitStatus ===
              "CANCELLED" ? (
                <Field
                  label="Cancellation Reason"
                  value={
                    visit.cancellationReason
                  }
                  columns={
                    columns
                  }
                />
              ) : null}
            </View>
          </Subsection>

          {/* ----------------------------------------------
              Chief Complaint
          ---------------------------------------------- */}

          <Subsection
            icon="chatbubble-ellipses-outline"
            title="Chief Complaint"
          >
            <View
              style={
                styles.complaintPanel
              }
            >
              <Text
                style={
                  styles.complaintLabel
                }
              >
                Presenting Complaint
              </Text>

              <Text
                style={
                  styles.complaintValue
                }
              >
                {visit
                  .chiefComplaint
                  ?.chiefComplaint
                  ?.name ??
                  "Not recorded"}
              </Text>

              {duration ? (
                <View
                  style={
                    styles.durationRow
                  }
                >
                  <View
                    style={
                      styles.durationIcon
                    }
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View>
                    <Text
                      style={
                        styles.durationLabel
                      }
                    >
                      Duration
                    </Text>

                    <Text
                      style={
                        styles.durationValue
                      }
                    >
                      {duration}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </Subsection>

          {/* ----------------------------------------------
              Analysis of Complaint
          ---------------------------------------------- */}

          <Subsection
            icon="analytics-outline"
            title="Analysis of Complaint"
            count={
              analysisFields.length
            }
          >
            {analysisFields.length >
            0 ? (
              <View
                style={
                  styles.analysisPanel
                }
              >
                <View
                  style={
                    styles.fieldGrid
                  }
                >
                  {analysisFields.map(
                    (
                        field,
                    ) => (
                        <View
                        key={
                            field.fieldId
                        }
                        style={[
                            styles.analysisField,
                            columns === 2 &&
                            styles.analysisFieldTwoColumns,
                            columns === 3 &&
                            styles.analysisFieldThreeColumns,
                        ]}
                        >
                        <Text
                            style={
                            styles.analysisFieldLabel
                            }
                        >
                            {field.fieldLabel}
                        </Text>

                        <AnalysisAnswerChips
                            value={
                            field.value
                            }
                        />
                        </View>
                    ),
                    )}
                </View>
              </View>
            ) : (
              <Text
                style={
                  styles.emptyText
                }
              >
                No analysis recorded
              </Text>
            )}
          </Subsection>

          {/* ----------------------------------------------
              Related Systems
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.relatedSystems,
          ) ? (
            <Subsection
              icon="git-network-outline"
              title="Related Systems"
            >
              <ClinicalData
                value={
                  visit.relatedSystems
                }
                columns={
                  columns
                }
              />
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              Systematic Review
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.systematicReview,
          ) ? (
            <Subsection
              icon="list-outline"
              title="Systematic Review"
            >
              <ClinicalData
                value={
                  visit.systematicReview
                }
                columns={
                  columns
                }
              />
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              Pediatric History
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.pediatricHistory,
          ) ? (
            <Subsection
              icon="happy-outline"
              title="Pediatric History"
            >
              <ClinicalData
                value={
                  visit.pediatricHistory
                }
                columns={
                  columns
                }
              />
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              Menstrual History
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.menstrualHistory,
          ) ? (
            <Subsection
              icon="calendar-outline"
              title="Menstrual History"
            >
              <ClinicalData
                value={
                  visit.menstrualHistory
                }
                columns={
                  columns
                }
              />
            </Subsection>
          ) : null}
        </View>

        {/* ==================================================
            EXAMINATION
        ================================================== */}

        <View
          style={
            styles.majorGroup
          }
        >
          <MajorGroupHeader
            icon="body-outline"
            title="Examination"
            subtitle="Physical examination and clinical findings"
          />

          {/* ----------------------------------------------
              Vital Signs
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.vitalSigns,
          ) ? (
            <Subsection
              icon="pulse-outline"
              title="Vital Signs"
            >
              <ClinicalData
                value={
                  visit.vitalSigns
                }
                columns={
                  columns
                }
              />
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              General Inspection
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.generalInspection,
          ) ? (
            <Subsection
              icon="body-outline"
              title="General Inspection"
            >
              <ClinicalData
                value={
                  visit.generalInspection
                }
                columns={
                  columns
                }
              />
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              Regional Examination
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.regionalExaminations,
          ) ? (
            <Subsection
              icon="scan-outline"
              title="Regional Examination"
            >
              <ClinicalData
                value={
                  visit.regionalExaminations
                }
                columns={
                  columns
                }
              />
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              System Examination
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.systemExaminations,
          ) ? (
            <Subsection
              icon="medical-outline"
              title="System Examination"
            >
              <ClinicalData
                value={
                  visit.systemExaminations
                }
                columns={
                  columns
                }
              />
            </Subsection>
          ) : null}
        </View>

        {/* ==================================================
            ASSESSMENT
        ================================================== */}

        <View
          style={
            styles.majorGroup
          }
        >
          <MajorGroupHeader
            icon="clipboard-outline"
            title="Assessment"
            subtitle="Clinical assessment, investigations and plan"
          />

          {/* ----------------------------------------------
              Diagnosis
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.diagnosis,
          ) ? (
            <Subsection
              icon="clipboard-outline"
              title="Diagnosis"
            >
              {primaryDiagnosis ? (
                <View
                  style={
                    styles.primaryDiagnosis
                  }
                >
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    Primary Diagnosis
                  </Text>

                  <Text
                    style={
                      styles.primaryDiagnosisText
                    }
                  >
                    {
                      primaryDiagnosis
                    }
                  </Text>

                  {primaryDiagnosisCode ? (
                    <View
                      style={
                        styles.diagnosisCode
                      }
                    >
                      <Ionicons
                        name="barcode-outline"
                        size={14}
                        color={
                          COLORS.secondaryText
                        }
                      />

                      <Text
                        style={
                          styles.diagnosisCodeText
                        }
                      >
                        {
                          primaryDiagnosisCode
                        }
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {differentialDiagnoses.length >
              0 ? (
                <View
                  style={
                    styles.differentialSection
                  }
                >
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    Differential Diagnoses
                  </Text>

                  <View
                    style={
                      styles.diagnosisList
                    }
                  >
                    {differentialDiagnoses.map(
                      (
                        item,
                        index,
                      ) => {
                        if (
                          !item.diagnosis
                        ) {
                          return null;
                        }

                        return (
                          <View
                            key={`${item.diagnosis}-${index}`}
                            style={
                              styles.diagnosisItem
                            }
                          >
                            <View
                              style={
                                styles.diagnosisBullet
                              }
                            >
                              <Text
                                style={
                                  styles.diagnosisBulletText
                                }
                              >
                                {index +
                                  1}
                              </Text>
                            </View>

                            <View
                              style={
                                styles.diagnosisItemContent
                              }
                            >
                              <Text
                                style={
                                  styles.diagnosisText
                                }
                              >
                                {
                                  item.diagnosis
                                }
                              </Text>

                              {item.code ? (
                                <Text
                                  style={
                                    styles.differentialCode
                                  }
                                >
                                  {
                                    item.code
                                  }
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        );
                      },
                    )}
                  </View>
                </View>
              ) : null}

              {!primaryDiagnosis &&
              differentialDiagnoses.length ===
                0 ? (
                <Text
                  style={
                    styles.emptyText
                  }
                >
                  No diagnosis recorded
                </Text>
              ) : null}
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              Investigations
          ---------------------------------------------- */}

          {investigations.length >
          0 ? (
            <Subsection
              icon="flask-outline"
              title="Investigations"
              count={
                investigations.length
              }
            >
              <View
                style={
                  styles.investigationList
                }
              >
                {investigations.map(
                  (
                    investigation,
                    index,
                  ) => (
                    <View
                      key={
                        investigation.id ??
                        `${investigation.name}-${index}`
                      }
                      style={
                        styles.investigationItem
                      }
                    >
                      <View
                        style={
                          styles.investigationHeader
                        }
                      >
                        <View
                          style={
                            styles.numberBadge
                          }
                        >
                          <Text
                            style={
                              styles.numberBadgeText
                            }
                          >
                            {index +
                              1}
                          </Text>
                        </View>

                        <View
                          style={
                            styles.investigationTitleContainer
                          }
                        >
                          <Text
                            style={
                              styles.investigationName
                            }
                          >
                            {
                              investigation.name ??
                              "Investigation"
                            }
                          </Text>

                          {investigation.status ? (
                            <Text
                              style={
                                styles.investigationStatus
                              }
                            >
                              {getInvestigationStatusLabel(
                                investigation.status,
                              )}
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      <DynamicFields
                        values={
                          investigation.result
                        }
                        columns={
                          columns
                        }
                      />

                      {investigation.notes ? (
                        <View
                          style={
                            styles.noteBox
                          }
                        >
                          <Text
                            style={
                              styles.noteLabel
                            }
                          >
                            Notes
                          </Text>

                          <Text
                            style={
                              styles.noteText
                            }
                          >
                            {
                              investigation.notes
                            }
                          </Text>
                        </View>
                      ) : null}

                      {investigation.images &&
                      investigation.images.length >
                        0 ? (
                        <View
                          style={
                            styles.imagesContainer
                          }
                        >
                          <Text
                            style={
                              styles.noteLabel
                            }
                          >
                            Images
                          </Text>

                          <View
                            style={
                              styles.imageGrid
                            }
                          >
                            {investigation.images.map(
                              (
                                image,
                                imageIndex,
                              ) =>
                                image.fileUrl ? (
                                  <Image
                                    key={
                                      image.id ??
                                      imageIndex
                                    }
                                    source={{
                                      uri:
                                        image.fileUrl,
                                    }}
                                    style={
                                      styles.investigationImage
                                    }
                                    resizeMode="cover"
                                  />
                                ) : null,
                            )}
                          </View>
                        </View>
                      ) : null}
                    </View>
                  ),
                )}
              </View>
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              Procedures
          ---------------------------------------------- */}

          {visit.procedures &&
          visit.procedures.length >
            0 ? (
            <Subsection
              icon="construct-outline"
              title="Procedures"
              count={
                visit.procedures.length
              }
            >
              <TextList
                values={
                  visit.procedures
                }
              />
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              Referrals
          ---------------------------------------------- */}

          {visit.referrals &&
          visit.referrals.length >
            0 ? (
            <Subsection
              icon="arrow-forward-circle-outline"
              title="Referrals"
              count={
                visit.referrals.length
              }
            >
              <TextList
                values={
                  visit.referrals
                }
              />
            </Subsection>
          ) : null}

          {/* ----------------------------------------------
              Prescription
          ---------------------------------------------- */}

          {!isEmptyValue(
            visit.prescription,
          ) ? (
            <Subsection
              icon="medkit-outline"
              title="Prescription"
              count={
                medications.length
              }
            >
              {medications.length >
              0 ? (
                <View
                  style={
                    styles.medicationList
                  }
                >
                  {medications
                    .slice()
                    .sort(
                      (
                        a,
                        b,
                      ) =>
                        (a.sortOrder ??
                          0) -
                        (b.sortOrder ??
                          0),
                    )
                    .map(
                      (
                        medication,
                        index,
                      ) => {
                        const medicationDuration =
                          getDurationLabel(
                            medication.durationValue,
                            medication.durationUnit,
                          );

                        return (
                          <View
                            key={`${medication.medication}-${index}`}
                            style={
                              styles.medicationItem
                            }
                          >
                            <View
                              style={
                                styles.medicationIndex
                              }
                            >
                              <Text
                                style={
                                  styles.medicationIndexText
                                }
                              >
                                {index +
                                  1}
                              </Text>
                            </View>

                            <View
                              style={
                                styles.medicationContent
                              }
                            >
                              <Text
                                style={
                                  styles.medicationName
                                }
                              >
                                {
                                  medication.medication ??
                                  "Medication"
                                }
                              </Text>

                              <View
                                style={
                                  styles.medicationMeta
                                }
                              >
                                {medicationDuration ? (
                                  <View
                                    style={
                                      styles.medicationMetaItem
                                    }
                                  >
                                    <Ionicons
                                      name="calendar-outline"
                                      size={14}
                                      color={
                                        COLORS.secondaryText
                                      }
                                    />

                                    <Text
                                      style={
                                        styles.medicationMetaText
                                      }
                                    >
                                      {
                                        medicationDuration
                                      }
                                    </Text>
                                  </View>
                                ) : null}
                              </View>

                              {medication.instructions ? (
                                <View
                                  style={
                                    styles.instructionsBlock
                                  }
                                >
                                  <Text
                                    style={
                                      styles.fieldLabel
                                    }
                                  >
                                    Instructions
                                  </Text>

                                  <Text
                                    style={
                                      styles.instructionText
                                    }
                                  >
                                    {
                                      medication.instructions
                                    }
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        );
                      },
                    )}
                </View>
              ) : null}

              {visit.prescription
                ?.advice ? (
                <View
                  style={
                    styles.prescriptionNote
                  }
                >
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    Advice
                  </Text>

                  <Text
                    style={
                      styles.prescriptionNoteText
                    }
                  >
                    {
                      visit
                        .prescription
                        .advice
                    }
                  </Text>
                </View>
              ) : null}

              {visit.prescription
                ?.followUp ? (
                <View
                  style={
                    styles.prescriptionNote
                  }
                >
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    Follow-up
                  </Text>

                  <Text
                    style={
                      styles.prescriptionNoteText
                    }
                  >
                    {
                      visit
                        .prescription
                        .followUp
                    }
                  </Text>
                </View>
              ) : null}

              {visit.prescription
                ?.notes ? (
                <View
                  style={
                    styles.prescriptionNote
                  }
                >
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    Notes
                  </Text>

                  <Text
                    style={
                      styles.prescriptionNoteText
                    }
                  >
                    {
                      visit
                        .prescription
                        .notes
                    }
                  </Text>
                </View>
              ) : null}
            </Subsection>
          ) : null}
        </View>

        {/* ==================================================
            Read Only Notice
        ================================================== */}

        <View
          style={
            styles.readOnlyBanner
          }
        >
          <View
            style={
              styles.readOnlyIcon
            }
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={
                COLORS.primary
              }
            />
          </View>

          <View
            style={
              styles.readOnlyContent
            }
          >
            <Text
              style={
                styles.readOnlyTitle
              }
            >
              Read-only visit
            </Text>

            <Text
              style={
                styles.readOnlyText
              }
            >
              Clinical information on this
              page cannot be edited.
            </Text>
          </View>
        </View>

        <View
          style={
            styles.bottomSpace
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// Styles
// ======================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    content: {
      paddingHorizontal:
        SPACING.md,
      paddingTop:
        SPACING.md,
      paddingBottom:
        50,
    },

    centered: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingHorizontal:
        SPACING.lg,
    },

    loadingText: {
      marginTop:
        SPACING.sm,
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
      fontWeight:
        "500",
    },

    retryButton: {
      marginTop:
        SPACING.md,
      minHeight: 44,
      paddingHorizontal:
        SPACING.lg,
      borderRadius: 12,
      backgroundColor:
        COLORS.primary,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 7,
    },

    retryText: {
      color:
        COLORS.white,
      fontSize: 14,
      fontWeight:
        "700",
    },

    // ====================================================
    // Visit Hero
    // ====================================================

    visitHero: {
      backgroundColor:
        COLORS.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor:
        "#DCE6F2",
      padding:
        SPACING.md,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap:
        SPACING.md,

      marginBottom:
        30,

      shadowColor:
        COLORS.black,
      shadowOpacity:
        0.05,
      shadowRadius:
        10,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      elevation: 2,
    },

    heroIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor:
        "#E7F1FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    heroContent: {
      flex: 1,
    },

    visitTitle: {
      fontSize:
        TYPOGRAPHY.title,
      fontWeight:
        "800",
      color:
        COLORS.text,
      letterSpacing:
        -0.2,
    },

    visitDate: {
      marginTop: 4,
      fontSize:
        TYPOGRAPHY.small,
      color:
        COLORS.secondaryText,
      fontWeight:
        "500",
    },

    statusBadge: {
      minHeight: 34,
      paddingHorizontal:
        10,
      borderRadius: 18,
      backgroundColor:
        "#E7F1FF",
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 5,
    },

    statusCompleted: {
      backgroundColor:
        "#E8F7EE",
    },

    statusCancelled: {
      backgroundColor:
        "#FDECEC",
    },

    statusInProgress: {
      backgroundColor:
        "#FFF4DE",
    },

    statusWaiting: {
      backgroundColor:
        "#E7F1FF",
    },

    statusText: {
      color:
        COLORS.primary,
      fontSize: 12,
      fontWeight:
        "800",
    },

    // ====================================================
    // Major Groups
    // ====================================================

    majorGroup: {
        marginBottom: 24,
        padding: 20,

        backgroundColor:
            COLORS.white,

        borderRadius: 20,

        borderWidth: 1,
        borderColor:
            "#DCE6F2",

        shadowColor:
            COLORS.black,
        shadowOpacity:
            0.04,
        shadowRadius:
            10,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        elevation: 2,
    },

    majorGroupHeader: {
        flexDirection:
            "row",
        alignItems:
            "center",

        marginBottom:
            22,

        minHeight: 64,

        paddingBottom:
            16,

        borderBottomWidth:
            1,

        borderBottomColor:
            "#E7EDF4",
    },

    majorGroupAccent: {
      width: 4,
      height: 52,
      borderRadius: 4,
      backgroundColor:
        COLORS.primary,
      marginRight:
        12,
    },

    majorGroupIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor:
        "#EAF3FF",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight:
        12,
    },

    majorGroupText: {
      flex: 1,
    },

    majorGroupTitle: {
      fontSize: 22,
      lineHeight: 27,
      fontWeight:
        "800",
      color:
        COLORS.text,
    },

    majorGroupSubtitle: {
      marginTop: 3,
      fontSize: 12,
      lineHeight: 17,
      color:
        COLORS.secondaryText,
      fontWeight:
        "500",
    },

    // ====================================================
    // Subsections
    // ====================================================

    subsection: {
      marginBottom:
        27,
    },

    subsectionHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      minHeight: 34,
      paddingBottom:
        9,
      borderBottomWidth:
        1,
      borderBottomColor:
        "#E7EDF4",
    },

    subsectionIcon: {
      width: 30,
      height: 30,
      borderRadius: 9,
      backgroundColor:
        "#F1F6FC",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight:
        9,
    },

    subsectionTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight:
        "800",
      color:
        COLORS.text,
    },

    countBadge: {
      minWidth: 24,
      height: 24,
      paddingHorizontal:
        7,
      borderRadius: 12,
      backgroundColor:
        "#EAF3FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    countText: {
      fontSize: 11,
      fontWeight:
        "800",
      color:
        COLORS.primary,
    },

    subsectionBody: {
      paddingTop:
        15,
    },

    // ====================================================
    // Fields
    // ====================================================

    fieldGrid: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      marginHorizontal:
        -6,
      rowGap:
        17,
    },

    field: {
      width: "100%",
      paddingHorizontal:
        6,
    },

    fieldTwoColumns: {
      width: "50%",
    },

    fieldThreeColumns: {
      width: "33.333%",
    },

    fieldLabel: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight:
        "600",
      color:
        COLORS.secondaryText,
      marginBottom:
        4,
    },

    fieldValue: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight:
        "600",
      color:
        COLORS.text,
    },

    fieldValueEmphasized: {
      fontSize: 15,
      fontWeight:
        "700",
    },

    complexField: {
      width: "100%",
      paddingHorizontal:
        6,
      gap: 8,
    },

    singleValue: {
      fontSize: 14,
      lineHeight: 20,
      color:
        COLORS.text,
    },

    // ====================================================
    // Chief Complaint
    // ====================================================

    complaintPanel: {
      backgroundColor:
        "#F5F9FE",
      borderWidth: 1,
      borderColor:
        "#DCE8F6",
      borderRadius: 15,
      padding:
        SPACING.md,
    },

    complaintLabel: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight:
        "600",
      color:
        COLORS.secondaryText,
      marginBottom: 6,
    },

    complaintValue: {
      fontSize: 19,
      lineHeight: 25,
      fontWeight:
        "800",
      color:
        COLORS.text,
    },

    durationRow: {
      marginTop:
        15,
      paddingTop:
        12,
      borderTopWidth:
        1,
      borderTopColor:
        "#DFE8F2",
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 9,
    },

    durationIcon: {
      width: 30,
      height: 30,
      borderRadius: 9,
      backgroundColor:
        "#E7F1FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    durationLabel: {
      fontSize: 10,
      fontWeight:
        "600",
      color:
        COLORS.secondaryText,
    },

    durationValue: {
      marginTop: 1,
      fontSize: 13,
      fontWeight:
        "700",
      color:
        COLORS.text,
    },

    // ====================================================
    // Analysis
    // ====================================================

    analysisPanel: {
      backgroundColor:
        "#FAFCFF",
      borderWidth: 1,
      borderColor:
        "#E3EBF4",
      borderRadius: 13,
      padding:
        13,
    },

    analysisField: {
    width: "100%",
    paddingHorizontal: 6,
    },

    analysisFieldTwoColumns: {
    width: "50%",
    },

    analysisFieldThreeColumns: {
    width: "33.333%",
    },

    analysisFieldLabel: {
    fontSize: 11,
    lineHeight: 15,

    fontWeight:
        "600",

    color:
        COLORS.secondaryText,

    marginBottom:
        7,
    },

    analysisChipList: {
    flexDirection:
        "row",

    flexWrap:
        "wrap",

    gap: 7,
    },

    analysisChip: {
    minHeight: 30,

    paddingHorizontal:
        11,

    paddingVertical:
        6,

    borderRadius:
        999,

    backgroundColor:
        "#EAF3FF",

    borderWidth:
        1,

    borderColor:
        "#CFE1F5",

    alignItems:
        "center",

    justifyContent:
        "center",
    },

    analysisChipText: {
    fontSize: 12,
    lineHeight: 16,

    fontWeight:
        "700",

    color:
        COLORS.primary,
    },

    // ====================================================
    // Tags
    // ====================================================

    tagList: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap: 7,
    },

    tag: {
      paddingHorizontal:
        10,
      paddingVertical:
        6,
      borderRadius: 999,
      backgroundColor:
        "#F0F5FA",
      borderWidth:
        1,
      borderColor:
        "#DFE8F1",
    },

    tagText: {
      fontSize: 12,
      lineHeight: 16,
      color:
        COLORS.text,
      fontWeight:
        "600",
    },

    stack: {
      gap: 14,
    },

    dynamicItem: {
      paddingTop: 2,
    },

    // ====================================================
    // Diagnosis
    // ====================================================

    primaryDiagnosis: {
      padding:
        SPACING.md,
      borderRadius: 14,
      backgroundColor:
        "#F5F9FE",
      borderWidth: 1,
      borderColor:
        "#DCE8F6",
    },

    primaryDiagnosisText: {
      fontSize: 17,
      lineHeight: 23,
      fontWeight:
        "800",
      color:
        COLORS.text,
    },

    diagnosisCode: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 5,
      marginTop: 7,
    },

    diagnosisCodeText: {
      fontSize: 11,
      color:
        COLORS.secondaryText,
      fontWeight:
        "600",
    },

    differentialSection: {
      marginTop: 18,
    },

    diagnosisList: {
      marginTop: 9,
      gap: 9,
    },

    diagnosisItem: {
      flexDirection:
        "row",
      alignItems:
        "flex-start",
      gap: 10,
    },

    diagnosisBullet: {
      width: 25,
      height: 25,
      borderRadius: 8,
      backgroundColor:
        "#EEF4FA",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    diagnosisBulletText: {
      fontSize: 11,
      fontWeight:
        "800",
      color:
        COLORS.primary,
    },

    diagnosisItemContent: {
      flex: 1,
      paddingTop: 2,
    },

    diagnosisText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight:
        "600",
      color:
        COLORS.text,
    },

    differentialCode: {
      marginTop: 2,
      fontSize: 10,
      color:
        COLORS.secondaryText,
    },

    // ====================================================
    // Investigations
    // ====================================================

    investigationList: {
      gap: 12,
    },

    investigationItem: {
      padding:
        SPACING.md,
      borderRadius: 14,
      backgroundColor:
        "#FAFCFE",
      borderWidth: 1,
      borderColor:
        "#E1E9F1",
    },

    investigationHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 10,
      marginBottom: 13,
    },

    numberBadge: {
      width: 30,
      height: 30,
      borderRadius: 9,
      backgroundColor:
        "#EAF3FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    numberBadgeText: {
      fontSize: 12,
      fontWeight:
        "800",
      color:
        COLORS.primary,
    },

    investigationTitleContainer: {
      flex: 1,
    },

    investigationName: {
      fontSize: 14,
      lineHeight: 19,
      fontWeight:
        "800",
      color:
        COLORS.text,
    },

    investigationStatus: {
      marginTop: 2,
      fontSize: 10,
      fontWeight:
        "600",
      color:
        COLORS.secondaryText,
    },

    noteBox: {
      marginTop: 13,
      paddingTop: 11,
      borderTopWidth:
        1,
      borderTopColor:
        "#E5EBF1",
    },

    noteLabel: {
      fontSize: 10,
      fontWeight:
        "700",
      color:
        COLORS.secondaryText,
      marginBottom:
        4,
    },

    noteText: {
      fontSize: 13,
      lineHeight: 19,
      color:
        COLORS.text,
    },

    imagesContainer: {
      marginTop: 13,
      paddingTop: 11,
      borderTopWidth:
        1,
      borderTopColor:
        "#E5EBF1",
    },

    imageGrid: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap: 8,
      marginTop: 7,
    },

    investigationImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      backgroundColor:
        "#EEF2F6",
    },

    // ====================================================
    // Procedures / Referrals
    // ====================================================

    textList: {
      gap: 10,
    },

    textListItem: {
      flexDirection:
        "row",
      alignItems:
        "flex-start",
      gap: 10,
    },

    listBullet: {
      width: 25,
      height: 25,
      borderRadius: 8,
      backgroundColor:
        "#EEF4FA",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    listBulletText: {
      fontSize: 11,
      fontWeight:
        "800",
      color:
        COLORS.primary,
    },

    listItemText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color:
        COLORS.text,
      fontWeight:
        "600",
      paddingTop: 2,
    },

    // ====================================================
    // Prescription
    // ====================================================

    medicationList: {
      gap: 11,
    },

    medicationItem: {
      flexDirection:
        "row",
      alignItems:
        "flex-start",
      gap: 11,
      padding:
        SPACING.md,
      borderRadius: 14,
      backgroundColor:
        "#FAFCFE",
      borderWidth: 1,
      borderColor:
        "#E1E9F1",
    },

    medicationIndex: {
      width: 29,
      height: 29,
      borderRadius: 9,
      backgroundColor:
        "#EAF3FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    medicationIndexText: {
      fontSize: 11,
      fontWeight:
        "800",
      color:
        COLORS.primary,
    },

    medicationContent: {
      flex: 1,
    },

    medicationName: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight:
        "800",
      color:
        COLORS.text,
    },

    medicationMeta: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop: 5,
    },

    medicationMetaItem: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 4,
    },

    medicationMetaText: {
      fontSize: 11,
      color:
        COLORS.secondaryText,
      fontWeight:
        "600",
    },

    instructionsBlock: {
      marginTop: 12,
      paddingTop: 10,
      borderTopWidth:
        1,
      borderTopColor:
        "#E5EBF1",
    },

    instructionText: {
      fontSize: 13,
      lineHeight: 19,
      color:
        COLORS.text,
      fontWeight:
        "500",
    },

    prescriptionNote: {
      marginTop: 14,
      padding:
        SPACING.md,
      borderRadius: 13,
      backgroundColor:
        "#FAFCFE",
      borderWidth: 1,
      borderColor:
        "#E1E9F1",
    },

    prescriptionNoteText: {
      fontSize: 13,
      lineHeight: 20,
      color:
        COLORS.text,
      fontWeight:
        "500",
    },

    // ====================================================
    // Empty
    // ====================================================

    emptyText: {
      fontSize: 13,
      lineHeight: 19,
      color:
        COLORS.secondaryText,
      fontWeight:
        "500",
    },

    // ====================================================
    // Read Only
    // ====================================================

    readOnlyBanner: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 11,

      marginTop: 5,

      padding:
        SPACING.md,

      borderRadius: 14,

      backgroundColor:
        "#F4F8FC",

      borderWidth: 1,
      borderColor:
        "#DCE6F0",
    },

    readOnlyIcon: {
      width: 36,
      height: 36,
      borderRadius: 11,
      backgroundColor:
        "#E7F1FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    readOnlyContent: {
      flex: 1,
    },

    readOnlyTitle: {
      fontSize: 13,
      fontWeight:
        "800",
      color:
        COLORS.text,
    },

    readOnlyText: {
      marginTop: 2,
      fontSize: 11,
      lineHeight: 16,
      color:
        COLORS.secondaryText,
    },

    bottomSpace: {
      height: 30,
    },
  });