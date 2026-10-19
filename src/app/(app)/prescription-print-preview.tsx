import AppPressable from "@/components/common/AppPressable";
import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import AppTopBar from "@/components/common/AppTopBar";
import AppView from "@/components/common/AppView";
import { PRESCRIPTION_PRINT_FIELDS, type PrescriptionPrintTemplate } from "@/models/PrescriptionPrintTemplate";
import { getClinicPrescriptionPrintTemplate, getSavedVisitPrescriptionPrintData, type SavedPrescriptionPrintData } from "@/services/prescriptionPrintApi";
import { COLORS, RADIUS, SPACING } from "@/theme";
import * as Print from "expo-print";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, useWindowDimensions } from "react-native";

const paperMm: Record<string, [number, number]> = {
  A4: [210, 297], A5: [148, 210], A6: [105, 148], LETTER: [216, 279], HALF_LETTER: [140, 216], EXECUTIVE: [184, 267],
};
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const cssText = (value: string) => escapeHtml(value).replace(/\n/g, "<br>");

export default function PrescriptionPrintPreviewScreen() {
  const { visitId } = useLocalSearchParams<{ visitId?: string }>();
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [template, setTemplate] = useState<PrescriptionPrintTemplate | null>(null);
  const [data, setData] = useState<SavedPrescriptionPrintData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!visitId) throw new Error("Visit is missing.");
        const savedData = await getSavedVisitPrescriptionPrintData(visitId);
        const savedTemplate = await getClinicPrescriptionPrintTemplate(savedData.clinicId);
        if (!savedTemplate) throw new Error("This clinic has not set a prescription print template yet.");
        if (active) { setData(savedData); setTemplate(savedTemplate); }
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Could not load saved visit data."); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [visitId]);

  const [paperWidth, paperHeight] = useMemo(() => {
    if (!template) return [210, 297];
    const dimensions = paperMm[template.paperSize] ?? [template.customWidthMm, template.customHeightMm];
    return template.orientation === "landscape" ? [dimensions[1], dimensions[0]] : dimensions;
  }, [template]);
  const previewWidth = Math.max(250, windowWidth - 32);
  const previewHeight = previewWidth * paperHeight / paperWidth;
  const printableFields = useMemo(() => template && data ? template.fields
    .map((field) => ({ field, value: data.fields[field.key]?.trim() ?? "" }))
    .filter((item) => item.value.length > 0) : [], [template, data]);

  const print = async () => {
    if (!template || !data) return;
    if (!printableFields.length) { Alert.alert("Nothing to print", "No placed fields have saved data for this visit."); return; }
    setPrinting(true);
    try {
      // Deliberately generate data-only HTML: template.scanUri is never read or referenced here.
      const html = buildPrintHtml(template, paperWidth, paperHeight, printableFields);
      await Print.printAsync({ html, width: paperWidth * 72 / 25.4, height: paperHeight * 72 / 25.4, orientation: template.orientation === "landscape" ? Print.Orientation.landscape : Print.Orientation.portrait });
    } catch (e) { Alert.alert("Could not open print dialog", e instanceof Error ? e.message : "Please try again."); }
    finally { setPrinting(false); }
  };

  if (loading) return <AppView style={styles.root}><AppTopBar title="Print Preview" onBack={() => router.back()} /><AppView style={styles.center}><ActivityIndicator size="large" color={COLORS.primary}/><AppText>Loading saved visit data…</AppText></AppView></AppView>;
  if (!template || !data) return <AppView style={styles.root}><AppTopBar title="Print Preview" onBack={() => router.back()} /><AppView style={styles.center}><AppText style={styles.error}>{error || "No saved prescription template is available."}</AppText></AppView></AppView>;

  return <AppView style={styles.root}>
    <AppTopBar title="Print Preview" onBack={() => router.back()} />
    <AppScrollView contentContainerStyle={styles.content}>
      <AppText style={styles.note}>Preview uses saved visit and prescription data. Empty sections are omitted. The uploaded reference scan is intentionally not shown or printed.</AppText>
      <AppView style={[styles.paper, { width: previewWidth, height: previewHeight }]}>
        {printableFields.map(({ field, value }) => <AppText key={field.id} style={{
          position: "absolute",
          left: `${(template.marginsMm.left + field.x * (paperWidth - template.marginsMm.left - template.marginsMm.right) * template.scale / 100) / paperWidth * 100}%`,
          top: `${(template.marginsMm.top + field.y * (paperHeight - template.marginsMm.top - template.marginsMm.bottom) * template.scale / 100) / paperHeight * 100}%`,
          width: `${field.width * (paperWidth - template.marginsMm.left - template.marginsMm.right) * template.scale / 100 / paperWidth * 100}%`,
          height: `${field.height * (paperHeight - template.marginsMm.top - template.marginsMm.bottom) * template.scale / 100 / paperHeight * 100}%`,
          fontFamily: field.font, fontSize: Math.max(6, field.fontSize * template.scale / 100) * (previewWidth / paperWidth), fontWeight: field.bold ? "700" : "400",
          textAlign: field.alignment, writingDirection: field.direction,
          overflow: field.key === "prescriptionBody" ? "visible" : "hidden", color: "#111",
        }}>{value}</AppText>)}
      </AppView>
      {!printableFields.length ? <AppText style={styles.error}>There is no saved information in the configured print fields.</AppText> : null}
      <AppPressable disabled={printing || !printableFields.length} style={[styles.printButton, (!printableFields.length || printing) && styles.disabled]} onPress={print}>
        {printing ? <ActivityIndicator color="#fff"/> : null}<AppText style={styles.printText}>{printing ? "Opening print dialog…" : "Print"}</AppText>
      </AppPressable>
      <AppText style={styles.footer}>Only the data shown in this preview will be printed. No scan image or template background is included.</AppText>
    </AppScrollView>
  </AppView>;
}

function buildPrintHtml(template: PrescriptionPrintTemplate, widthMm: number, heightMm: number, values: Array<{ field: PrescriptionPrintTemplate["fields"][number]; value: string }>) {
  const contents = values.map(({ field, value }) => {
    const fontSize = (field.fontSize * template.scale / 100).toFixed(2);
    const left = template.marginsMm.left + field.x * (widthMm - template.marginsMm.left - template.marginsMm.right) * template.scale / 100;
    const top = template.marginsMm.top + field.y * (heightMm - template.marginsMm.top - template.marginsMm.bottom) * template.scale / 100;
    const width = field.width * (widthMm - template.marginsMm.left - template.marginsMm.right) * template.scale / 100;
    const height = field.height * (heightMm - template.marginsMm.top - template.marginsMm.bottom) * template.scale / 100;
    const overflow = field.key === "prescriptionBody" ? "visible" : "hidden";
    return `<div style="position:absolute;left:${left.toFixed(2)}mm;top:${top.toFixed(2)}mm;width:${width.toFixed(2)}mm;height:${height.toFixed(2)}mm;font-family:${field.font};font-size:${fontSize}pt;font-weight:${field.bold ? "700" : "400"};text-align:${field.alignment};direction:${field.direction};overflow:${overflow};white-space:normal;line-height:1.2">${cssText(value)}</div>`;
  }).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>@page{size:${widthMm}mm ${heightMm}mm;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;width:${widthMm}mm;height:${heightMm}mm;background:white;color:#111}.page{position:relative;width:${widthMm}mm;height:${heightMm}mm;overflow:hidden}</style></head><body><main class="page">${contents}</main></body></html>`;
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: COLORS.background }, content: { padding: SPACING.md, alignItems: "center", gap: SPACING.md }, center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 24 },
  note: { width: "100%", color: COLORS.secondaryText, lineHeight: 20 }, paper: { backgroundColor: "#fff", borderColor: "#d0d5dd", borderWidth: 1, elevation: 3, overflow: "hidden", position: "relative" }, error: { color: COLORS.danger, textAlign: "center" },
  printButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, minHeight: 52, width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10 }, printText: { color: COLORS.white, fontWeight: "700", fontSize: 16 }, disabled: { opacity: 0.5 }, footer: { textAlign: "center", color: COLORS.secondaryText, paddingBottom: 20 },
});
