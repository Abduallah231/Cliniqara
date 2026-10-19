import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import type { AISuggestionResult, DiagnosisReasoning } from "@/services/aiClinicalSuggestionsApi";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, StyleSheet } from "react-native";

interface Props {
  result: AISuggestionResult | null;
  loading: boolean;
  error: string | null;
}

export default function AISuggestionsSection({ result, loading, error }: Props) {
  if (loading) {
    return <AppView style={styles.state}>
      <ActivityIndicator color={COLORS.primary} />
      <AppText style={styles.description}>Reviewing the recorded clinical information…</AppText>
    </AppView>;
  }

  if (error) {
    return <AppView style={styles.state}>
      <Ionicons name="alert-circle-outline" size={32} color={COLORS.danger} />
      <AppText style={styles.title}>Suggestions could not be generated</AppText>
      <AppText style={styles.description}>{error}</AppText>
      <AppText style={styles.hint}>{getErrorHint(error)}</AppText>
    </AppView>;
  }

  if (!result) {
    return <AppView style={styles.state}>
      <Ionicons name="sparkles-outline" size={36} color={COLORS.primary} />
      <AppText style={styles.title}>No AI suggestions yet</AppText>
      <AppText style={styles.description}>Generate suggestions to see an ordered differential and a clear explanation of how to assess each possibility.</AppText>
    </AppView>;
  }

  return <AppView style={styles.content}>
    <AppText style={styles.sectionTitle}>Possible diagnoses</AppText>
    {result.possibleDiagnoses.length ? result.possibleDiagnoses.map((item, index) => <AppView key={`${index}-${item.name}`} style={styles.diagnosisRow}>
      <AppView style={styles.rank}><AppText style={styles.rankText}>{index + 1}</AppText></AppView>
      <AppText style={styles.diagnosisName}>{item.name}</AppText>
    </AppView>) : <AppText style={styles.description}>The model did not return possible diagnoses for the information provided.</AppText>}

    {result.diagnosticReasoning.length ? <AppView style={styles.reasoningSection}>
      <AppText style={styles.sectionTitle}>Reasoning and how to assess each possibility</AppText>
      {result.diagnosticReasoning.map((item, index) => <ReasoningCard key={`${index}-${item.diagnosis}`} item={item} />)}
    </AppView> : null}

    {result.evidenceLimitations ? <AppView style={styles.limitationBox}>
      <AppText style={styles.limitationTitle}>Evidence access</AppText>
      <AppText style={styles.description}>{result.evidenceLimitations}</AppText>
    </AppView> : null}
    <AppText style={styles.disclaimer}>AI-generated clinical decision support may be incomplete or incorrect. The treating clinician must verify all suggestions.</AppText>
  </AppView>;
}

function getErrorHint(error: string): string {
  if (/high demand|overloaded|\b503\b|unavailable/i.test(error)) {
    return "The provider is having a temporary capacity problem. Try again later or choose a different available model in Settings → AI Suggestions.";
  }
  if (/request limit|quota|\b429\b/i.test(error)) {
    return "Wait for the provider's request limit to reset, or check the model quota and billing in its dashboard.";
  }
  return "Check the internet connection, API endpoint, model name, and API key, then try again.";
}

function ReasoningCard({ item }: { item: DiagnosisReasoning }) {
  return <AppView style={styles.reasoningCard}>
    <AppText style={styles.reasoningTitle}>{item.diagnosis}</AppText>
    {item.whyLikely ? <DetailGroup title="Why it is considered" text={item.whyLikely} /> : null}
    {item.questions.length ? <DetailGroup title="Questions to ask" items={item.questions} /> : null}
    {item.examinations.length ? <DetailGroup title="Further examination" items={item.examinations} /> : null}
    {item.investigations.length ? <DetailGroup title="Tests or imaging" items={item.investigations} /> : null}
  </AppView>;
}

function DetailGroup({ title, text, items }: { title: string; text?: string; items?: string[] }) {
  return <AppView style={styles.detailGroup}>
    <AppText style={styles.detailTitle}>{title}</AppText>
    {text ? <AppText style={styles.description}>{text}</AppText> : null}
    {items?.map((item, index) => <AppView key={`${index}-${item}`} style={styles.bulletRow}>
      <AppText style={styles.bullet}>•</AppText><AppText style={styles.description}>{item}</AppText>
    </AppView>)}
  </AppView>;
}

const styles = StyleSheet.create({
  content: { gap: SPACING.md },
  state: { alignItems: "center", paddingVertical: SPACING.xl, paddingHorizontal: SPACING.lg, gap: SPACING.md },
  title: { color: COLORS.text, fontSize: TYPOGRAPHY.body, fontWeight: "700", textAlign: "center" },
  description: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.small, lineHeight: 21, flexShrink: 1 },
  hint: { color: COLORS.primary, fontSize: TYPOGRAPHY.small, textAlign: "center" },
  sectionTitle: { color: COLORS.text, fontSize: TYPOGRAPHY.body, fontWeight: "700" },
  diagnosisRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, paddingVertical: SPACING.xs },
  rank: { width: 28, height: 28, borderRadius: RADIUS.pill, backgroundColor: COLORS.primaryLight, alignItems: "center", justifyContent: "center" },
  rankText: { color: COLORS.primary, fontSize: TYPOGRAPHY.small, fontWeight: "700" },
  diagnosisName: { color: COLORS.text, fontSize: TYPOGRAPHY.body, fontWeight: "600", flex: 1 },
  reasoningSection: { gap: SPACING.sm, marginTop: SPACING.sm },
  reasoningCard: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.md, gap: SPACING.sm },
  reasoningTitle: { color: COLORS.primary, fontSize: TYPOGRAPHY.body, fontWeight: "700" },
  detailGroup: { gap: 3 },
  detailTitle: { color: COLORS.text, fontSize: TYPOGRAPHY.small, fontWeight: "700" },
  bulletRow: { flexDirection: "row", gap: SPACING.xs, alignItems: "flex-start" },
  bullet: { color: COLORS.primary, fontSize: TYPOGRAPHY.body },
  limitationBox: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.sm, gap: SPACING.xs },
  limitationTitle: { color: COLORS.primary, fontSize: TYPOGRAPHY.small, fontWeight: "700" },
  disclaimer: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.caption, lineHeight: 18 },
});
