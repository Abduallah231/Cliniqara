import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import type { AITreatmentResult, TreatmentRecommendation } from "@/services/aiClinicalSuggestionsApi";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, StyleSheet } from "react-native";

interface Props {
  result: AITreatmentResult | null;
  loading: boolean;
  error: string | null;
}

export default function AITreatmentSuggestionsSection({ result, loading, error }: Props) {
  if (loading) return <AppView style={styles.state}>
    <ActivityIndicator color={COLORS.primary} />
    <AppText style={styles.body}>Preparing sourced treatment options for the selected diagnosis…</AppText>
  </AppView>;

  if (error) return <AppView style={styles.state}>
    <Ionicons name="alert-circle-outline" size={30} color={COLORS.danger} />
    <AppText style={styles.body}>{error}</AppText>
  </AppView>;

  if (!result) return <AppView style={styles.state}>
    <AppText style={styles.body}>Choose a primary diagnosis, then request treatment options.</AppText>
  </AppView>;

  return <AppView style={styles.content}>
    {result.recommendations.length ? result.recommendations.map((item, index) => <RecommendationCard key={`${index}-${item.category}-${item.recommendation}`} item={item} index={index} />)
      : <AppText style={styles.body}>No treatment points with a traceable source were returned.</AppText>}
    {result.evidenceLimitations ? <AppView style={styles.limitation}>
      <AppText style={styles.limitationTitle}>Source access and limitations</AppText>
      <AppText style={styles.body}>{result.evidenceLimitations}</AppText>
    </AppView> : null}
    <AppText style={styles.disclaimer}>AI-generated information may be incomplete or wrong. Verify every point and source in the original reference and use your clinical judgment.</AppText>
  </AppView>;
}

function RecommendationCard({ item, index }: { item: TreatmentRecommendation; index: number }) {
  const dosing = [
    item.dose ? `Dose: ${item.dose}` : "",
    item.route ? `Route: ${item.route}` : "",
    item.frequency ? `Frequency: ${item.frequency}` : "",
    item.duration ? `Duration: ${item.duration}` : "",
  ].filter(Boolean).join(" • ");

  return <AppView style={styles.card}>
    <AppText style={styles.heading}>{index + 1}. {item.category || "Treatment option"}</AppText>
    <AppText style={styles.body}>{item.recommendation}</AppText>
    {item.medicationName ? <AppView style={styles.medication}>
      <AppText style={styles.medicationName}>{item.medicationName}</AppText>
      {dosing ? <AppText style={styles.body}>{dosing}</AppText> : null}
      {item.ageConsiderations ? <AppText style={styles.age}>Age / safety: {item.ageConsiderations}</AppText> : null}
    </AppView> : null}
    <AppView style={styles.sourceBox}>
      <AppText style={styles.sourceLabel}>Source cited by the AI — verify in the original reference</AppText>
      <AppText selectable style={styles.source}>{item.source}</AppText>
    </AppView>
  </AppView>;
}

const styles = StyleSheet.create({
  content: { gap: SPACING.md },
  state: { alignItems: "center", gap: SPACING.sm, padding: SPACING.lg },
  card: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.md, gap: SPACING.sm },
  heading: { color: COLORS.primary, fontSize: TYPOGRAPHY.body, fontWeight: "700" },
  body: { color: COLORS.text, fontSize: TYPOGRAPHY.small, lineHeight: 21 },
  medication: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm, gap: SPACING.xs },
  medicationName: { color: COLORS.text, fontSize: TYPOGRAPHY.body, fontWeight: "700" },
  age: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.small, lineHeight: 20 },
  sourceBox: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border, paddingTop: SPACING.sm, gap: SPACING.xs },
  sourceLabel: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.caption, fontWeight: "700" },
  source: { color: COLORS.primary, fontSize: TYPOGRAPHY.small, lineHeight: 20 },
  limitation: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.xs },
  limitationTitle: { color: COLORS.primary, fontSize: TYPOGRAPHY.small, fontWeight: "700" },
  disclaimer: { color: COLORS.secondaryText, fontSize: TYPOGRAPHY.caption, lineHeight: 18 },
});
