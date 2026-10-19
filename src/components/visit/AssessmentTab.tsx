import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import CollapsibleSection from "@/components/common/CollapsibleSection";
import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY, } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import AISuggestionsSection from "./assessment/AISuggestionsSection";
import DiagnosisSection from "./assessment/DiagnosisSection";
import InvestigationResultsScreen from "./assessment/InvestigationResultsScreen";
import InvestigationSection from "./assessment/InvestigationSection";
import PrescriptionSection from "./assessment/PrescriptionSection";
import ProceduresReferralsSection from "./assessment/ProceduresReferrals";
import { useVisitStore } from "@/store/visitStore";
import chronicDiseases from "@/data/chronicDiseases";
import { getReadOnlyVisitDetails } from "@/services/visitApi";

interface Props {
  visitId?: string;
}
export default function AssessmentTab({
  visitId,
}: Props) {
  const visit = useVisitStore((state) => state.visit);

  const [
  showInvestigationResults,
  setShowInvestigationResults,
] = useState(false);

  return (
    <AppView style={styles.container}>
      <ClinicalContextSummary visitId={visitId} visit={visit} />
      <AppPressable
        style={styles.aiButton}
        onPress={() => {
          Alert.alert(
            "Coming Soon",
            "AI Suggestions will be available in a future update.",
          );
        }}
      >
        <Ionicons
          name="sparkles-outline"
          size={20}
          color={COLORS.white}
        />
        <AppText style={styles.aiButtonText}>
          Generate AI Suggestions
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
        <AISuggestionsSection />
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
});
