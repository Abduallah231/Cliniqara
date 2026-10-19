import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import chronicDiseases from "@/data/chronicDiseases";
import { AI_TREATMENT_SUGGESTIONS_VISIBLE } from "@/config/features";
import {
  buildClinicalSections,
  getAIAPIKey,
  requestAISuggestions,
  requestAITreatmentSuggestions,
  type AISuggestionResult,
  type AITreatmentResult,
} from "@/services/aiClinicalSuggestionsApi";
import { getReadOnlyVisitDetails } from "@/services/visitApi";
import { useAppSettingsStore } from "@/store/appSettingsStore";
import { useVisitStore } from "@/store/visitStore";
import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY, } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import AISuggestionsSection from "./assessment/AISuggestionsSection";
import AITreatmentSuggestionsSection from "./assessment/AITreatmentSuggestionsSection";
import DiagnosisSection from "./assessment/DiagnosisSection";
import InvestigationResultsScreen from "./assessment/InvestigationResultsScreen";
import InvestigationSection from "./assessment/InvestigationSection";
import PrescriptionSection from "./assessment/PrescriptionSection";
import ProceduresReferralsSection from "./assessment/ProceduresReferrals";

interface Props {
  visitId?: string;
}
export default function AssessmentTab({
  visitId,
}: Props) {
  const visit = useVisitStore((state) => state.visit);
  const primaryDiagnosis = useVisitStore((state) => state.visit.assessment.diagnosis.primaryDiagnosis);
  const aiEndpoint = useAppSettingsStore((state) => state.aiEndpoint);
  const aiModel = useAppSettingsStore((state) => state.aiModel);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [treatmentSuggestions, setTreatmentSuggestions] = useState<AITreatmentResult | null>(null);
  const [treatmentLoading, setTreatmentLoading] = useState(false);
  const [treatmentError, setTreatmentError] = useState<string | null>(null);
  const waitingForAISetup = useRef<"diagnosis" | "treatment" | null>(null);

  const [
  showInvestigationResults,
  setShowInvestigationResults,
] = useState(false);

  const confirmAndGenerateSuggestions = useCallback(async (apiKey: string) => {
    let savedVisit: unknown = null;
    if (visitId) {
      try {
        savedVisit = await getReadOnlyVisitDetails(visitId);
      } catch (error) {
        console.warn("Could not load saved visit context for AI:", error);
      }
    }
    const sections = buildClinicalSections(visit, savedVisit);
    if (!sections.length) {
      Alert.alert("No visit information", "Record clinical information in History or Examination before requesting AI suggestions.");
      return;
    }
    Alert.alert(
      "Send clinical information to the selected AI service?",
      `Selected history and examination details will be sent to ${getEndpointHost(aiEndpoint)} for analysis. Patient name, patient code, doctor, and clinic details are excluded. Continue only if you are allowed to use this external AI service for this visit.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send and generate", onPress: () => void (async () => {
          setAiLoading(true);
          setAiError(null);
          setAiSuggestions(null);
          try {
            const result = await requestAISuggestions(apiKey, aiEndpoint, aiModel, sections);
            setAiSuggestions(result);
          } catch (error) {
            const message = error instanceof Error ? error.message : "AI suggestions could not be generated.";
            setAiError(message);
            Alert.alert("AI suggestions unavailable", message);
          } finally {
            setAiLoading(false);
          }
        })() },
      ],
    );
  }, [aiEndpoint, aiModel, visit, visitId]);

  const handleGenerateSuggestions = useCallback(async () => {
    try {
      const apiKey = await getAIAPIKey();
      if (!apiKey || !aiEndpoint || !aiModel) {
        waitingForAISetup.current = "diagnosis";
        router.push("/settings?aiSetup=1");
        return;
      }
      await confirmAndGenerateSuggestions(apiKey);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not read the saved API key.";
      setAiError(message);
      Alert.alert("AI settings unavailable", message);
    }
  }, [aiEndpoint, aiModel, confirmAndGenerateSuggestions]);

  const confirmAndGenerateTreatment = useCallback(async (apiKey: string) => {
    if (!primaryDiagnosis?.diagnosis) {
      Alert.alert("Choose a diagnosis first", "Select the primary diagnosis in the Diagnosis section before requesting treatment options.");
      return;
    }
    let savedVisit: unknown = null;
    if (visitId) {
      try {
        savedVisit = await getReadOnlyVisitDetails(visitId);
      } catch (error) {
        console.warn("Could not load saved visit context for treatment suggestions:", error);
      }
    }
    const relevantTitles = new Set(["Patient demographics", "Past history", "Pediatric history", "Drug history", "Allergy history", "Menstrual history"]);
    const patientContext = {
      age: visit.patient.age || undefined,
      ageUnit: visit.patient.ageUnit || undefined,
      sex: visit.patient.gender || undefined,
      relevantRecordedHistory: buildClinicalSections(visit, savedVisit).filter((section) => relevantTitles.has(section.title)),
    };
    Alert.alert(
      "Send treatment context to the selected AI service?",
      `The selected diagnosis and recorded age and safety history will be sent to ${getEndpointHost(aiEndpoint)}. Patient name, patient code, doctor, and clinic details are excluded. Continue only if this use is permitted.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send and generate", onPress: () => void (async () => {
          setTreatmentLoading(true);
          setTreatmentError(null);
          setTreatmentSuggestions(null);
          try {
            const result = await requestAITreatmentSuggestions(
              apiKey,
              aiEndpoint,
              aiModel,
              { name: primaryDiagnosis.diagnosis, code: primaryDiagnosis.code },
              patientContext,
            );
            setTreatmentSuggestions(result);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Treatment suggestions could not be generated.";
            setTreatmentError(message);
            Alert.alert("Treatment suggestions unavailable", message);
          } finally {
            setTreatmentLoading(false);
          }
        })() },
      ],
    );
  }, [aiEndpoint, aiModel, primaryDiagnosis, visit, visitId]);

  const handleGenerateTreatment = useCallback(async () => {
    if (!primaryDiagnosis?.diagnosis) {
      Alert.alert("Choose a diagnosis first", "Select the primary diagnosis in the Diagnosis section before requesting treatment options.");
      return;
    }
    try {
      const apiKey = await getAIAPIKey();
      if (!apiKey || !aiEndpoint || !aiModel) {
        waitingForAISetup.current = "treatment";
        router.push("/settings?aiSetup=1");
        return;
      }
      await confirmAndGenerateTreatment(apiKey);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not read the saved API key.";
      setTreatmentError(message);
      Alert.alert("AI settings unavailable", message);
    }
  }, [aiEndpoint, aiModel, confirmAndGenerateTreatment, primaryDiagnosis]);

  useFocusEffect(useCallback(() => {
    const pendingAction = waitingForAISetup.current;
    if (!pendingAction) return;
    let active = true;
    waitingForAISetup.current = null;
    void getAIAPIKey().then((apiKey) => {
      if (!active || !apiKey || !aiEndpoint || !aiModel) return;
      if (pendingAction === "treatment") void confirmAndGenerateTreatment(apiKey);
      else void confirmAndGenerateSuggestions(apiKey);
    }).catch((error) => {
      console.warn("Could not resume AI request after setup:", error);
    });
    return () => { active = false; };
  }, [aiEndpoint, aiModel, confirmAndGenerateSuggestions, confirmAndGenerateTreatment]));

  useEffect(() => {
    setTreatmentSuggestions(null);
    setTreatmentError(null);
  }, [primaryDiagnosis?.diagnosis]);

  return (
    <AppView style={styles.container}>
      <ClinicalContextSummary visitId={visitId} visit={visit} />
      <AppPressable
        style={[styles.aiButton, aiLoading && styles.aiButtonDisabled]}
        onPress={() => void handleGenerateSuggestions()}
        disabled={aiLoading}
      >
        <Ionicons
          name="sparkles-outline"
          size={20}
          color={COLORS.white}
        />
        <AppText style={styles.aiButtonText}>
          {aiLoading ? "Generating AI Suggestions..." : "Generate AI Diagnosis"}
        </AppText>
      </AppPressable>

      <AppView style={styles.aiCard}>
        <AppView
          style={styles.aiHeader}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.primary}
          />
          <AppText style={styles.aiTitle}>
            AI Clinical Decision
            Support
          </AppText>
        </AppView>

        <AppText style={styles.aiText}>
          AI-generated diagnoses,
          investigations, and
          treatment suggestions are
          provided solely as
          clinical decision
          support. They may be
          incomplete or inaccurate
          and must not be relied
          upon as a substitute for
          professional medical
          judgment. The treating
          physician is solely
          responsible for all
          clinical decisions and
          patient care.
        </AppText>
      </AppView>

      <CollapsibleSection
        title="AI Suggestions"
        icon={
          <Ionicons
            name="sparkles-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <AISuggestionsSection result={aiSuggestions} loading={aiLoading} error={aiError} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Diagnosis"
        icon={
          <Ionicons
            name="pulse-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        defaultExpanded
      >
        <DiagnosisSection />
      </CollapsibleSection>

      <CollapsibleSection
        title="Investigations"
        icon={
          <Ionicons
            name="flask-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <InvestigationSection
          onOpenResults={() =>
            setShowInvestigationResults(
              !showInvestigationResults
            )
          }
        />

        {showInvestigationResults && (
          <InvestigationResultsScreen visitId={visitId} />
        )}
      </CollapsibleSection>

            <CollapsibleSection
        title="Procedures & Referrals"
        icon={
          <Ionicons
            name="construct-outline"
            size={20}
            color={COLORS.primary}
          />
        }
      >
        <ProceduresReferralsSection />
      </CollapsibleSection>

      {AI_TREATMENT_SUGGESTIONS_VISIBLE && <>
      <AppPressable
        style={[styles.aiButton, styles.treatmentAiButton, treatmentLoading && styles.aiButtonDisabled]}
        onPress={() => void handleGenerateTreatment()}
        disabled={treatmentLoading}
      >
        <Ionicons name="medkit-outline" size={20} color={COLORS.white} />
        <AppText style={styles.aiButtonText}>
          {treatmentLoading ? "Preparing Treatment Options…" : "AI Treatment Options for Selected Diagnosis"}
        </AppText>
      </AppPressable>
      <AppText style={styles.treatmentDisclaimer}>
        AI suggestions are only to support the physician, not to make decisions or prescribe in their place. AI can be wrong. Verify each recommendation, dose, patient-specific risk, and cited source before use.
      </AppText>
      <CollapsibleSection
        title="AI Treatment Options"
        icon={<Ionicons name="medkit-outline" size={20} color={COLORS.primary} />}
      >
        <AITreatmentSuggestionsSection result={treatmentSuggestions} loading={treatmentLoading} error={treatmentError} />
      </CollapsibleSection>
      </>}

      <CollapsibleSection
        title="Prescription"
        icon={
          <Ionicons
            name="document-text-outline"
            size={20}
            color={COLORS.primary}
          />
        }
        defaultExpanded
      >
        <PrescriptionSection />
      </CollapsibleSection>

      <AppView style={{ height: 50 }} />
    </AppView>
  );
}

function ClinicalContextSummary({ visitId, visit }: { visitId?: string; visit: ReturnType<typeof useVisitStore.getState>["visit"] }) {
  const [savedVisit, setSavedVisit] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    let active = true;
    if (!visitId) return () => { active = false; };
    void getReadOnlyVisitDetails(visitId).then((details) => {
      if (active) setSavedVisit(details as Record<string, any>);
    }).catch((error) => {
      console.warn("Could not load saved clinical context:", error);
      if (active) setSavedVisit(null);
    });
    return () => { active = false; };
  }, [visitId]);

  const complaint = savedVisit?.chiefComplaint?.chiefComplaint?.name?.trim() || visit.history?.chiefComplaint?.complaintName?.trim();
  const analysisValue = savedVisit?.chiefComplaint?.analysis?.values ?? savedVisit?.chiefComplaint?.analysis?.answers;
  const analysisRows = getClinicalEntries(analysisValue).length
    ? getClinicalEntries(analysisValue)
    : (visit.history?.hpi?.analysis?.fields ?? []).map((field) => ({ label: field.fieldLabel, value: field.value }));
  const symptomRows = analysisRows.filter((entry) => /symptom/i.test(entry.label));
  const detailRows = analysisRows.filter((entry) => !/symptom/i.test(entry.label));
  const savedChronic = savedVisit?.pastHistory?.chronicDiseases?.map((item: any) => item.diseaseName ?? item.name ?? item.diseaseCode ?? item) ?? null;
  const chronic = savedChronic ?? visit.history?.pastHistory?.fields?.find((field) => field.fieldId === "chronicDiseases")?.value;
  const chronicNames = toDisplayValues(chronic).map((item) => {
    const clean = cleanClinicalText(item);
    return chronicDiseases.find((disease) => disease.code === clean)?.name ?? clean;
  });
  const medications = toDisplayValues(savedVisit?.drugHistory?.medications ?? savedVisit?.drugHistory?.currentMedications ?? visit.history?.drugHistory?.currentMedications)
    .map((item) => typeof item === "object" ? (item as any).medicationName ?? (item as any).medication : item).map(cleanClinicalText).filter(Boolean);
  const allergies = toDisplayValues(savedVisit?.allergyHistory?.allergies ?? visit.history?.allergyHistory?.allergies)
    .map((item) => typeof item === "object" ? [(item as any).type, (item as any).allergen].filter(Boolean).join(" — ") : item).map(cleanClinicalText).filter(Boolean);
  const vitalSigns = Object.entries(asRecord(savedVisit?.vitalSigns ?? visit.examination?.vitalSigns))
    .filter(([key, value]) => hasClinicalValue(value) && key.toLowerCase() !== "bmi")
    .map(([key, value]) => ({ label: humanizeClinicalLabel(key), value: cleanClinicalText(value) }));
  const systems = getSystemExaminationEntries(savedVisit?.systemExaminations ?? visit.examination?.systemExamination?.systems);
  const hasContent = Boolean(complaint || analysisRows.length || chronicNames.length || medications.length || allergies.length || vitalSigns.length || systems.length);
  if (!hasContent) return null;
  return <CollapsibleSection
    title="Visit Summary"
    icon={<Ionicons name="document-text-outline" size={20} color={COLORS.primary} />}
    defaultExpanded={false}
    style={styles.contextCollapsible}
  >
    <AppView style={styles.summaryContent}>
    <AppText style={styles.contextSubtitle}>Key clinical information recorded for this visit</AppText>
    {complaint ? <AppView style={styles.summarySection}>
      <AppText style={styles.contextLabel}>Chief complaint</AppText>
      <AppText style={styles.complaintValue}>{cleanClinicalText(complaint)}</AppText>
    </AppView> : null}
    {analysisRows.some((entry) => toDisplayValues(entry.value).some((item) => !isEmptyAnswer(cleanClinicalText(item)))) ? <AppView style={styles.summarySection}>
      <AppText style={styles.contextLabel}>Symptoms and details</AppText>
      {symptomRows.length ? <AppView style={styles.chipRow}>{symptomRows.flatMap((entry, index) => {
        const values = toDisplayValues(entry.value);
        return values.map((rawValue, valueIndex) => {
          const value = cleanClinicalText(rawValue);
          if (!value || isEmptyAnswer(value)) return null;
          const chipValue = stripSymptomPrefix(value);
          if (!chipValue) return null;
          return <AppView key={`${index}-${valueIndex}-${chipValue}`} style={styles.summaryChip}><AppText style={styles.summaryChipText}>{chipValue}</AppText></AppView>;
        });
      })}</AppView> : null}
      {detailRows.filter((entry) => !/symptom/i.test(entry.label)).map((entry, index) => {
        const values = toDisplayValues(entry.value).map(cleanClinicalText).filter((value) => value && !isEmptyAnswer(value));
        if (!values.length) return null;
        return <AppView key={`${entry.label}-${index}`} style={styles.analysisDetail}>
          <AppText style={styles.findingLabel}>{entry.label}</AppText>
          <AppText style={styles.contextValue}>{values.join(", ")}</AppText>
        </AppView>;
      })}
    </AppView> : null}
    {chronicNames.length ? <SummaryChips title="Chronic conditions" items={chronicNames} /> : null}
    {medications.length ? <SummaryChips title="Current medications" items={medications} /> : null}
    {allergies.length ? <SummaryChips title="Allergies" items={allergies} /> : null}
    {vitalSigns.length ? <AppView style={styles.summarySection}>
      <AppText style={styles.contextLabel}>Vital signs</AppText>
      <AppView style={styles.vitalsGrid}>{vitalSigns.map((item) => <AppView key={item.label} style={styles.vitalCard}>
        <AppText style={styles.vitalLabel}>{item.label}</AppText><AppText style={styles.vitalValue}>{item.value}</AppText>
      </AppView>)}</AppView>
    </AppView> : null}
    {systems.length ? <AppView style={styles.summarySection}>
      <AppText style={styles.contextLabel}>Examination findings</AppText>
      {systems.map((item, index) => <AppView key={`${item.label}-${index}`} style={styles.findingRow}>
        <AppText style={styles.findingLabel}>{item.label}</AppText><AppText style={styles.contextValue}>{item.value}</AppText>
      </AppView>)}
    </AppView> : null}
    </AppView>
  </CollapsibleSection>;
}

function SummaryChips({ title, items }: { title: string; items: string[] }) {
  return <AppView style={styles.summarySection}><AppText style={styles.contextLabel}>{title}</AppText>
    <AppView style={styles.chipRow}>{items.filter(Boolean).map((item, index) => <AppView key={`${title}-${index}-${item}`} style={styles.summaryChip}><AppText style={styles.summaryChipText}>{item}</AppText></AppView>)}</AppView>
  </AppView>;
}

function getClinicalEntries(value: unknown): { label: string; value: unknown }[] {
  if (!value || typeof value !== "object") return [];
  const entries = Array.isArray(value) ? value.map((item, index) => [String(index + 1), item] as const) : Object.entries(value as Record<string, unknown>);
  return entries.filter(([, item]) => hasClinicalValue(item)).map(([key, item]) => ({ label: humanizeClinicalLabel(key), value: item }));
}

function getSystemExaminationEntries(value: unknown): { label: string; value: string }[] {
  const systems = Array.isArray(value) ? value : Array.isArray(asRecord(value).systems) ? asRecord(value).systems as unknown[] : [];
  const findings: { label: string; value: string }[] = [];
  for (const rawSystem of systems) {
    const system = asRecord(rawSystem);
    const systemName = humanizeClinicalLabel(system.systemName ?? system.system ?? system.systemId ?? "Examination");
    const fields = Array.isArray(system.fields)
      ? system.fields.map((field: any) => [field.fieldLabel ?? field.fieldId ?? "Finding", field.value] as const)
      : Object.entries(asRecord(system.fields));
    for (const [rawLabel, rawValue] of fields) {
      if (!hasClinicalValue(rawValue)) continue;
      for (const valueText of toDisplayValues(rawValue).map(cleanClinicalText).filter(Boolean)) {
        findings.push({ label: `${systemName} · ${humanizeClinicalLabel(rawLabel)}`, value: valueText });
      }
    }
  }
  return findings;
}

function asRecord(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, any> : {};
}

function hasClinicalValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0);
}

function toDisplayValues(value: unknown): unknown[] {
  if (Array.isArray(value)) return value.flatMap((item) => toDisplayValues(item));
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return [record.name ?? record.label ?? record.value ?? record.medicationName ?? record.medication ?? ""].filter(Boolean);
  }
  if (typeof value === "string") return value.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "boolean") return value ? ["Yes"] : [];
  return hasClinicalValue(value) ? [value] : [];
}

function humanizeClinicalLabel(value: unknown): string {
  const clean = String(value ?? "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return clean.toLocaleLowerCase().replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
}

function cleanClinicalText(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (/^[A-Z0-9_ -]+$/.test(String(value)) && /[A-Z]/.test(String(value))) return text.toLocaleLowerCase().replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
  return text;
}

function stripSymptomPrefix(value: string): string {
  return value.replace(/^(associated\s+)?symptoms?\s*[:\-]?\s*/i, "").replace(/^(symptom|synpom)\s+/i, "").trim();
}

function isEmptyAnswer(value: string): boolean {
  return /^(no|none|n\/a|not recorded|unknown)$/i.test(value);
}

function getEndpointHost(endpoint: string): string {
  try {
    return new URL(endpoint).host;
  } catch {
    return "the configured AI provider";
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.md,   
  },

  contextCollapsible: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth: 1, borderRadius: RADIUS.xl, marginBottom: 0 },
  summaryContent: { gap: SPACING.md },
  contextSubtitle: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.small },
  summarySection: { gap: SPACING.xs },
  contextLabel: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.small, fontWeight: "700" },
  complaintValue: { color: COLORS.text, fontSize: TYPOGRAPHY.body, fontWeight: "700" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs },
  summaryChip: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.border, borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 6 },
  analysisDetail: { gap: 2, backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.sm },
  summaryChipText: { color: COLORS.primary, fontSize: TYPOGRAPHY.small, fontWeight: "600" },
  vitalsGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs },
  vitalCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.sm, minWidth: "30%", flexGrow: 1, gap: 2 },
  vitalLabel: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.small },
  vitalValue: { color: COLORS.text, fontSize: TYPOGRAPHY.body, fontWeight: "700" },
  findingRow: { gap: 2, borderTopColor: COLORS.border, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: SPACING.xs },
  findingLabel: { color: COLORS.primary, fontSize: TYPOGRAPHY.small, fontWeight: "600" },
  contextValue: { color: COLORS.text, fontSize: TYPOGRAPHY.body, lineHeight: 22 },

  patientBanner: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    ...SHADOW,
  },

  patientName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  patientInfo: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  assessmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
  },

  assessmentText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    marginHorizontal: SPACING.xs,
  },

  aiButton: {
    height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
    ...SHADOW,
  },
  aiButtonDisabled: { opacity: 0.7 },
  treatmentAiButton: { backgroundColor: COLORS.primary },

  aiButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },

  aiCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOW,
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  aiTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  aiText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
  },
  treatmentDisclaimer: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
});
