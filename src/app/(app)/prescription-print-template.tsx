import AppPressable from "@/components/common/AppPressable";
import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import AppTextInput from "@/components/common/AppTextInput";
import AppTopBar from "@/components/common/AppTopBar";
import AppView from "@/components/common/AppView";
import {
  DEFAULT_PRESCRIPTION_PRINT_TEMPLATE, PRESCRIPTION_PRINT_FIELDS,
  type PaperSize, type PrescriptionPrintField, type PrescriptionPrintFieldKey,
  type PrescriptionPrintTemplate,
} from "@/models/PrescriptionPrintTemplate";
import { assertClinicPrintAccess, getClinicPrescriptionPrintTemplate, persistPrescriptionTemplateScan, removeReplacedTemplateScan, saveClinicPrescriptionPrintTemplate } from "@/services/prescriptionPrintApi";
import { useClinicStore } from "@/store/clinicStore";
import { COLORS, RADIUS, SPACING } from "@/theme";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View, useWindowDimensions } from "react-native";

const uid = () => `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const paperChoices: Array<{ key: PaperSize; title: string; width: number; height: number }> = [
  { key: "A4", title: "A4", width: 210, height: 297 }, { key: "A5", title: "A5", width: 148, height: 210 },
  { key: "A6", title: "A6", width: 105, height: 148 }, { key: "LETTER", title: "Letter", width: 216, height: 279 },
  { key: "HALF_LETTER", title: "Half Letter", width: 140, height: 216 }, { key: "EXECUTIVE", title: "Executive", width: 184, height: 267 },
  { key: "CUSTOM", title: "Custom", width: 0, height: 0 },
];

export default function PrescriptionPrintTemplateScreen() {
  const params = useLocalSearchParams<{ clinicId?: string }>();
  const selectedClinicId = useClinicStore((s) => s.currentClinicId);
  const clinicId = params.clinicId || selectedClinicId;
  const { width: screenWidth } = useWindowDimensions();
  const [template, setTemplate] = useState<PrescriptionPrintTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanUri, setScanUri] = useState("");
  const [scanWidth, setScanWidth] = useState(0);
  const [scanHeight, setScanHeight] = useState(0);
  const [fields, setFields] = useState<PrescriptionPrintField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [pendingField, setPendingField] = useState<PrescriptionPrintFieldKey | null>(null);
  const [paperSize, setPaperSize] = useState<PaperSize>(DEFAULT_PRESCRIPTION_PRINT_TEMPLATE.paperSize);
  const [customWidthMm, setCustomWidthMm] = useState(210);
  const [customHeightMm, setCustomHeightMm] = useState(297);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [marginsMm, setMarginsMm] = useState(DEFAULT_PRESCRIPTION_PRINT_TEMPLATE.marginsMm);
  const [scale, setScale] = useState(100);
  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? null;
  const canvasWidth = Math.max(260, screenWidth - SPACING.lg * 2);
  const canvasHeight = scanWidth > 0 ? canvasWidth * scanHeight / scanWidth : 0;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!clinicId) throw new Error("Select a clinic first.");
        await assertClinicPrintAccess(clinicId);
        const saved = await getClinicPrescriptionPrintTemplate(clinicId);
        if (!active || !saved) return;
        setTemplate(saved); setScanUri(saved.scanUri); setScanWidth(saved.scanWidth); setScanHeight(saved.scanHeight);
        setFields(saved.fields); setPaperSize(saved.paperSize); setCustomWidthMm(saved.customWidthMm); setCustomHeightMm(saved.customHeightMm);
        setOrientation(saved.orientation); setMarginsMm(saved.marginsMm); setScale(saved.scale);
      } catch (error) { if (active) Alert.alert("Prescription template", error instanceof Error ? error.message : "Could not load the clinic template."); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [clinicId]);

  const chooseScan = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: false, quality: 0.9 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    try {
      const persistentUri = await persistPrescriptionTemplateScan(clinicId!, asset.uri);
      setScanUri(persistentUri); setScanWidth(asset.width); setScanHeight(asset.height); setSelectedFieldId(null);
      Alert.alert("Scan ready", "The scan is stored as an editor reference only. It is never included in the printed document. Use a flat, clear scan; avoid angled phone photos.");
    } catch (error) { Alert.alert("Could not save scan", error instanceof Error ? error.message : "Try another image."); }
  };

  const rotateScan = async (degrees: number) => {
    if (!scanUri) return;
    try {
      const context = ImageManipulator.ImageManipulator.manipulate(scanUri);
      context.rotate(degrees);
      const rendered = await context.renderAsync();
      const result = await rendered.saveAsync({ format: ImageManipulator.SaveFormat.JPEG, compress: 0.92 });
      const uri = await persistPrescriptionTemplateScan(clinicId!, result.uri);
      setScanUri(uri); setScanWidth(rendered.width); setScanHeight(rendered.height);
      Alert.alert("Scan adjusted", "Rotation is the only adjustment available. A flat, straight scan gives the best alignment.");
    } catch { Alert.alert("Could not rotate scan", "Choose the image again and retry."); }
  };

  const addField = (key: PrescriptionPrintFieldKey) => {
    if (!scanUri) { Alert.alert("Upload a scan first", "Choose a flat, clear scan to use as an editor reference."); return; }
    const existing = fields.find((field) => field.key === key);
    if (existing) {
      setSelectedFieldId(existing.id);
      setPendingField(null);
      return;
    }
    setPendingField(key); setSelectedFieldId(null);
  };

  const placeField = (x: number, y: number) => {
    if (!pendingField && selectedFieldId) {
      const selected = fields.find((field) => field.id === selectedFieldId);
      if (selected) setFields((current) => current.map((field) => field.id === selectedFieldId ? {
        ...field, x: Math.max(0, Math.min(1 - field.width, x - field.width / 2)), y: Math.max(0, Math.min(1 - field.height, y - field.height / 2)),
      } : field));
      return;
    }
    if (!pendingField) return;
    const isContentArea = pendingField === "prescriptionBody";
    const fieldWidth = isContentArea ? 0.9 : 0.28;
    const fieldHeight = isContentArea ? 0.58 : 0.06;
    const field: PrescriptionPrintField = {
      id: uid(), key: pendingField,
      x: Math.max(0, Math.min(1 - fieldWidth, x - fieldWidth / 2)),
      y: Math.max(0, Math.min(1 - fieldHeight, y - fieldHeight / 2)),
      width: fieldWidth, height: fieldHeight, font: "sans-serif", fontSize: 12, bold: false, alignment: "left", direction: "ltr",
    };
    setFields((current) => [...current, field]); setSelectedFieldId(field.id); setPendingField(null);
  };

  const updateField = (updates: Partial<PrescriptionPrintField>) => {
    if (!selectedFieldId) return;
    setFields((current) => current.map((field) => field.id === selectedFieldId ? { ...field, ...updates } : field));
  };

  const save = async () => {
    if (!clinicId || !scanUri || scanWidth <= 0 || scanHeight <= 0) { Alert.alert("Scan required", "Upload a clear prescription scan before saving."); return; }
    setSaving(true);
    try {
      const saved = await saveClinicPrescriptionPrintTemplate(clinicId, { scanUri, scanWidth, scanHeight, fields, paperSize, customWidthMm, customHeightMm, orientation, marginsMm, scale });
      const previousUri = template?.scanUri;
      setTemplate(saved);
      if (previousUri && previousUri !== saved.scanUri) await removeReplacedTemplateScan(clinicId, previousUri);
      Alert.alert("Saved", "The clinic now has one active prescription print template.");
    } catch (error) { Alert.alert("Could not save template", error instanceof Error ? error.message : "Try again."); }
    finally { setSaving(false); }
  };

  const adjustMargin = (key: keyof typeof marginsMm, value: string) => setMarginsMm((current) => ({ ...current, [key]: Math.max(0, Number(value) || 0) }));
  return <AppView style={styles.root}>
    <AppTopBar title="Prescription Print Template" onBack={() => router.back()} />
    <AppScrollView contentContainerStyle={styles.content}>
      <AppView style={styles.notice}>
        <AppText style={styles.noticeTitle}>Scan is for alignment only</AppText>
        <AppText>Upload a flat, clear scan. Avoid angled phone photos. You can rotate it, then place Doctor Name, Patient Name, Age, and Date manually. Place the Prescription Content Area over the blank space where Diagnosis, repeating Medication Cards, Advice, Notes, and Follow-up should print. The scan is only an alignment reference and is never part of the final print.</AppText>
      </AppView>
        <AppPressable style={styles.button} onPress={chooseScan}><AppText style={styles.buttonText}>{scanUri ? "Replace clinic scan" : "Upload clinic scan"}</AppText></AppPressable>
      {scanUri ? <>
        <AppView style={styles.row}>
          <AppPressable style={styles.secondary} onPress={() => rotateScan(-1)}><AppText>Rotate −1°</AppText></AppPressable>
          <AppPressable style={styles.secondary} onPress={() => rotateScan(1)}><AppText>Rotate +1°</AppText></AppPressable>
          <AppPressable style={styles.secondary} onPress={() => rotateScan(90)}><AppText>Rotate 90°</AppText></AppPressable>
        </AppView>
        <AppText style={styles.sectionTitle}>{pendingField ? "Tap the scan to place the field" : "Tap a placed field, then tap the scan to move it"}</AppText>
        <AppView style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]} onStartShouldSetResponder={() => !!pendingField || !!selectedFieldId} onResponderRelease={(event) => {
          if (canvasWidth && canvasHeight) placeField(event.nativeEvent.locationX / canvasWidth, event.nativeEvent.locationY / canvasHeight);
        }}>
          <Image source={{ uri: scanUri }} resizeMode="stretch" style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>{fields.map((field) => <View key={field.id} style={[styles.fieldBox, {
            left: `${field.x * 100}%`, top: `${field.y * 100}%`, width: `${field.width * 100}%`, height: `${field.height * 100}%`,
            borderColor: selectedFieldId === field.id ? "#f04438" : COLORS.primary,
          }]}><AppText numberOfLines={1} style={{ color: COLORS.primary, fontSize: 10 }}>{PRESCRIPTION_PRINT_FIELDS.find((item) => item.key === field.key)?.label}</AppText></View>)}</View>
        </AppView>
        <AppView style={styles.chips}>{fields.map((field) => <AppPressable key={field.id} style={[styles.chip, selectedFieldId === field.id && styles.chipActive]} onPress={() => { setSelectedFieldId(field.id); setPendingField(null); }}><AppText style={selectedFieldId === field.id ? styles.buttonText : undefined}>{PRESCRIPTION_PRINT_FIELDS.find((item) => item.key === field.key)?.label}</AppText></AppPressable>)}</AppView>
      </> : null}

      <AppText style={styles.sectionTitle}>Fields (manual placement)</AppText>
      <AppView style={styles.chips}>{PRESCRIPTION_PRINT_FIELDS.map((item) => <AppPressable key={item.key} onPress={() => addField(item.key)} style={[styles.chip, pendingField === item.key && styles.chipActive]}><AppText style={pendingField === item.key ? styles.buttonText : undefined}>{item.label}</AppText></AppPressable>)}</AppView>
      {selectedField ? <AppView style={styles.card}>
        <AppText style={styles.sectionTitle}>Selected: {PRESCRIPTION_PRINT_FIELDS.find((item) => item.key === selectedField.key)?.label}</AppText>
        <AppView style={styles.row}><AppText>Size / width / height</AppText>
          <AppPressable style={styles.secondary} onPress={() => updateField({ fontSize: Math.max(6, selectedField.fontSize - 1), width: Math.max(0.08, selectedField.width - 0.02), height: Math.max(0.025, selectedField.height - 0.01) })}><AppText>−</AppText></AppPressable>
          <AppText>{selectedField.fontSize} pt</AppText>
          <AppPressable style={styles.secondary} onPress={() => updateField({ fontSize: Math.min(48, selectedField.fontSize + 1), width: Math.min(1 - selectedField.x, selectedField.width + 0.02), height: Math.min(1 - selectedField.y, selectedField.height + 0.01) })}><AppText>+</AppText></AppPressable>
        </AppView>
        <AppView style={styles.row}>{["sans-serif", "serif", "monospace"].map((font) => <AppPressable key={font} style={[styles.secondary, selectedField.font === font && styles.selected]} onPress={() => updateField({ font: font as PrescriptionPrintField["font"] })}><AppText>{font}</AppText></AppPressable>)}</AppView>
        <AppView style={styles.row}>{["left", "center", "right"].map((alignment) => <AppPressable key={alignment} style={[styles.secondary, selectedField.alignment === alignment && styles.selected]} onPress={() => updateField({ alignment: alignment as PrescriptionPrintField["alignment"] })}><AppText>{alignment}</AppText></AppPressable>)}
          <AppPressable style={[styles.secondary, selectedField.direction === "rtl" && styles.selected]} onPress={() => updateField({ direction: selectedField.direction === "rtl" ? "ltr" : "rtl" })}><AppText>{selectedField.direction.toUpperCase()}</AppText></AppPressable>
          <AppPressable style={[styles.secondary, selectedField.bold && styles.selected]} onPress={() => updateField({ bold: !selectedField.bold })}><AppText>Bold</AppText></AppPressable>
          <AppPressable style={styles.delete} onPress={() => { setFields((items) => items.filter((field) => field.id !== selectedField.id)); setSelectedFieldId(null); }}><AppText>Remove</AppText></AppPressable>
        </AppView>
      </AppView> : null}

      <AppText style={styles.sectionTitle}>Paper and print settings</AppText>
      <AppView style={styles.chips}>{paperChoices.map((item) => <AppPressable key={item.key} style={[styles.chip, paperSize === item.key && styles.chipActive]} onPress={() => { setPaperSize(item.key); if (item.key !== "CUSTOM") { setCustomWidthMm(item.width); setCustomHeightMm(item.height); } }}><AppText style={paperSize === item.key ? styles.buttonText : undefined}>{item.title}</AppText></AppPressable>)}</AppView>
      {paperSize === "CUSTOM" ? <AppView style={styles.row}><AppTextInput keyboardType="numeric" style={styles.input} value={String(customWidthMm)} onChangeText={(v) => setCustomWidthMm(Math.max(50, Number(v) || 0))} placeholder="Width mm"/><AppTextInput keyboardType="numeric" style={styles.input} value={String(customHeightMm)} onChangeText={(v) => setCustomHeightMm(Math.max(50, Number(v) || 0))} placeholder="Height mm"/></AppView> : null}
      <AppView style={styles.row}>{["portrait", "landscape"].map((item) => <AppPressable key={item} style={[styles.chip, orientation === item && styles.chipActive]} onPress={() => setOrientation(item as "portrait" | "landscape")}><AppText style={orientation === item ? styles.buttonText : undefined}>{item}</AppText></AppPressable>)}</AppView>
      <AppText>Margins (mm) and scale (%)</AppText>
      <AppView style={styles.chips}>{(["top", "right", "bottom", "left"] as const).map((key) => <AppTextInput key={key} keyboardType="numeric" style={styles.smallInput} value={String(marginsMm[key])} onChangeText={(v) => adjustMargin(key, v)} placeholder={key}/>)}</AppView>
      <AppView style={styles.row}><AppTextInput keyboardType="numeric" style={styles.smallInput} value={String(scale)} onChangeText={(v) => setScale(Math.max(50, Math.min(150, Number(v) || 100)))} placeholder="Scale %"/><AppText>Scale {scale}% (50–150%)</AppText></AppView>
      <AppPressable disabled={loading || saving} style={styles.button} onPress={save}><AppText style={styles.buttonText}>{saving ? "Saving…" : "Save clinic template"}</AppText></AppPressable>
    </AppScrollView>
  </AppView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background }, content: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 40 },
  notice: { padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.card, gap: SPACING.xs }, noticeTitle: { fontWeight: "700", color: COLORS.primary },
  button: { backgroundColor: COLORS.primary, minHeight: 48, borderRadius: RADIUS.lg, alignItems: "center", justifyContent: "center", padding: SPACING.sm }, buttonText: { color: COLORS.white, fontWeight: "700" },
  secondary: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: COLORS.card }, row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: SPACING.sm },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text }, canvas: { alignSelf: "center", backgroundColor: "#fff", overflow: "hidden", position: "relative", borderWidth: 1, borderColor: COLORS.border },
  fieldBox: { position: "absolute", borderWidth: 1, borderStyle: "dashed", backgroundColor: "#ffffff99", justifyContent: "center", paddingHorizontal: 2 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs }, chip: { borderRadius: 18, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card }, chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  card: { padding: SPACING.md, gap: SPACING.sm, borderRadius: RADIUS.lg, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border }, selected: { borderColor: COLORS.primary, backgroundColor: "#e8f1ff" }, delete: { padding: 8, backgroundColor: "#fee4e2", borderRadius: 8 },
  input: { minWidth: 100, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.card, padding: 8 }, smallInput: { width: 78, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.card, padding: 8 },
});
