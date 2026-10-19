import * as SecureStore from "expo-secure-store";
const AI_API_KEY_STORAGE = "cliniqara_ai_api_key";
const LEGACY_GEMINI_API_KEY_STORAGE = "cliniqara_gemini_api_key";

export interface ClinicalSection {
  title: string;
  data: unknown;
}

export interface PossibleDiagnosis {
  name: string;
}

export interface DiagnosisReasoning {
  diagnosis: string;
  whyLikely: string;
  questions: string[];
  examinations: string[];
  investigations: string[];
}

export interface AISuggestionResult {
  possibleDiagnoses: PossibleDiagnosis[];
  diagnosticReasoning: DiagnosisReasoning[];
  evidenceLimitations: string;
}

export interface TreatmentRecommendation {
  category: string;
  recommendation: string;
  medicationName: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  ageConsiderations: string;
  source: string;
}

export interface AITreatmentResult {
  recommendations: TreatmentRecommendation[];
  evidenceLimitations: string;
}

export async function getAIAPIKey(): Promise<string | null> {
  const storedKey = (await SecureStore.getItemAsync(AI_API_KEY_STORAGE))
    ?? await SecureStore.getItemAsync(LEGACY_GEMINI_API_KEY_STORAGE);
  return storedKey ? normalizeAPIKey(storedKey) : null;
}

export async function saveAIAPIKey(apiKey: string): Promise<void> {
  const normalizedKey = normalizeAPIKey(apiKey);
  if (!normalizedKey) throw new Error("Enter a valid API key.");
  await SecureStore.setItemAsync(AI_API_KEY_STORAGE, normalizedKey);
}

export async function deleteAIAPIKey(): Promise<void> {
  await SecureStore.deleteItemAsync(AI_API_KEY_STORAGE);
  await SecureStore.deleteItemAsync(LEGACY_GEMINI_API_KEY_STORAGE);
}

export function buildClinicalSections(visit: any, savedVisit: any): ClinicalSection[] {
  const history = visit?.history ?? {};
  const examination = visit?.examination ?? {};
  const saved = savedVisit ?? {};
  const savedComplaint = saved.chiefComplaint;
  const historyComplaint = history.chiefComplaint;
  const analysis = firstClinicalValue(
    savedComplaint?.analysis?.values,
    savedComplaint?.analysis?.answers,
    history.hpi?.analysis?.fields,
  );

  const sections: ClinicalSection[] = [
    { title: "Patient demographics", data: { age: visit?.patient?.age, sex: visit?.patient?.gender } },
    {
      title: "Chief complaint",
      data: {
        complaint: firstClinicalValue(savedComplaint?.chiefComplaint?.name, historyComplaint?.complaintName),
        duration: firstClinicalValue(savedComplaint?.durationValue
          ? `${savedComplaint.durationValue} ${savedComplaint.durationUnit ?? ""}`.trim()
          : undefined, historyComplaint?.durationValue
            ? `${historyComplaint.durationValue} ${historyComplaint.durationUnit ?? ""}`.trim()
            : undefined),
        notes: firstClinicalValue(savedComplaint?.notes, historyComplaint?.notes),
      },
    },
    { title: "Analysis of complaint", data: analysis },
    { title: "Related system symptoms", data: firstClinicalValue(saved.relatedSystems, history.hpi?.relatedSystemSymptoms) },
    { title: "Systematic review", data: history.hpi?.systematicReview },
    { title: "Pediatric history", data: firstClinicalValue(saved.pediatricHistory, history.pediatricHistory) },
    { title: "Past history", data: firstClinicalValue(saved.pastHistory, history.pastHistory) },
    { title: "Social history", data: firstClinicalValue(saved.socialHistory, history.socialHistory) },
    { title: "Drug history", data: firstClinicalValue(saved.drugHistory, history.drugHistory) },
    { title: "Vaccination history", data: firstClinicalValue(saved.vaccinationHistory, history.vaccinationHistory) },
    { title: "Allergy history", data: firstClinicalValue(saved.allergyHistory, history.allergyHistory) },
    { title: "Family history", data: firstClinicalValue(saved.familyHistory, history.familyHistory) },
    { title: "Menstrual history", data: firstClinicalValue(saved.menstrualHistory, history.menstrualHistory) },
    { title: "Vital signs", data: firstClinicalValue(saved.vitalSigns, examination.vitalSigns) },
    { title: "General inspection", data: firstClinicalValue(saved.generalInspection, examination.generalInspection) },
    { title: "Regional examination", data: firstClinicalValue(saved.regionalExaminations, examination.regionalExamination) },
    { title: "System examination", data: firstClinicalValue(saved.systemExaminations, examination.systemExamination) },
  ];

  return sections.flatMap((section) => {
    const data = removeEmptyClinicalData(section.data);
    return data === undefined ? [] : [{ title: section.title, data }];
  });
}

export async function requestAISuggestions(
  apiKey: string,
  endpoint: string,
  model: string,
  sections: ClinicalSection[],
): Promise<AISuggestionResult> {
  if (!sections.length) throw new Error("This visit has no saved clinical information to review yet.");
  const normalizedApiKey = normalizeAPIKey(apiKey);
  if (!normalizedApiKey) throw new Error("Enter a valid API key in AI Settings.");
  const normalizedModel = model.trim();
  if (!normalizedModel || normalizedModel.length > 160) {
    throw new Error("Enter a valid model name in AI Settings.");
  }
  return normalizeSuggestionResult(await requestAIJSON(
    normalizedApiKey,
    endpoint,
    normalizedModel,
    buildClinicalPrompt(sections),
    {
      type: "OBJECT",
      properties: {
        possibleDiagnoses: {
          type: "ARRAY",
          items: { type: "OBJECT", properties: { name: { type: "STRING" } }, required: ["name"] },
        },
        diagnosticReasoning: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              diagnosis: { type: "STRING" },
              whyLikely: { type: "STRING" },
              questions: { type: "ARRAY", items: { type: "STRING" } },
              examinations: { type: "ARRAY", items: { type: "STRING" } },
              investigations: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["diagnosis", "whyLikely", "questions", "examinations", "investigations"],
          },
        },
        evidenceLimitations: { type: "STRING" },
      },
      required: ["possibleDiagnoses", "diagnosticReasoning", "evidenceLimitations"],
    },
  ));
}

export async function requestAITreatmentSuggestions(
  apiKey: string,
  endpoint: string,
  model: string,
  diagnosis: { name: string; code?: string },
  patientContext: unknown,
): Promise<AITreatmentResult> {
  const normalizedApiKey = normalizeAPIKey(apiKey);
  const normalizedModel = model.trim();
  if (!normalizedApiKey) throw new Error("Enter a valid API key in AI Settings.");
  if (!diagnosis.name.trim()) throw new Error("Choose a primary diagnosis first.");
  if (!normalizedModel || normalizedModel.length > 160) throw new Error("Enter a valid model name in AI Settings.");

  const prompt = [
    "You are a cautious clinical decision-support assistant for a licensed treating physician. Do not make the clinical decision or prescribe on the physician's behalf.",
    "The task is to provide concise, ordered treatment options for the physician-selected diagnosis, considering only the patient context below. Never assume missing patient facts.",
    "Use authoritative clinical references only, prioritizing UpToDate, AMBOSS, BMJ Best Practice, NICE, WHO, CDC, and peer-reviewed medical guidelines. Do not use general web search results or informal sources.",
    "This API request does not itself grant access to subscription databases or a reference-search tool. Never claim that you searched or accessed a reference unless the service actually provided that source content. Never invent citations. If a source cannot be verified from available context, omit that recommendation and explain the limitation in evidenceLimitations.",
    "Return short, organized point-by-point recommendations, not an article. Every recommendation must have its own specific source citation in the source field. Do not combine claims from multiple sources without listing each source. A citation must identify the source and, when available, guideline/topic, edition or date, and a direct link. If you cannot give a traceable source for a point, do not include it.",
    "For medicines, include generic medicine name, dose, route, frequency, duration, and the age basis only when supported by a cited source. Consider this patient's stated age. Do not calculate a pediatric or weight-based dose without the required weight and verified dosing reference. If age, weight, allergy, pregnancy, renal/hepatic function, or another safety-critical factor is missing, state what must be checked before dosing; do not guess or present a dose as a prescription.",
    "Include first-line options, reasonable alternatives, non-drug measures, monitoring, and key contraindications only when supported by traceable sources. Keep each as a separate recommendation with one source field. Do not provide emergency management instructions beyond advising urgent escalation when clinically indicated.",
    "Return valid JSON only with keys recommendations and evidenceLimitations. recommendations is an array of objects with keys category, recommendation, medicationName, dose, route, frequency, duration, ageConsiderations, source. Use empty strings for medicine fields when the point is not medication-related. Use an empty array when no recommendation can be properly sourced.",
    `Physician-selected diagnosis: ${diagnosis.name.trim()}${diagnosis.code ? ` (code ${diagnosis.code})` : ""}`,
    `Patient context (only recorded details): ${JSON.stringify(removeEmptyClinicalData(patientContext) ?? {})}`,
  ].join("\n\n");

  const result = await requestAIJSON(normalizedApiKey, endpoint, normalizedModel, prompt, {
    type: "OBJECT",
    properties: {
      recommendations: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            category: { type: "STRING" },
            recommendation: { type: "STRING" },
            medicationName: { type: "STRING" },
            dose: { type: "STRING" },
            route: { type: "STRING" },
            frequency: { type: "STRING" },
            duration: { type: "STRING" },
            ageConsiderations: { type: "STRING" },
            source: { type: "STRING" },
          },
          required: ["category", "recommendation", "medicationName", "dose", "route", "frequency", "duration", "ageConsiderations", "source"],
        },
      },
      evidenceLimitations: { type: "STRING" },
    },
    required: ["recommendations", "evidenceLimitations"],
  });
  return normalizeTreatmentResult(result);
}

async function requestAIJSON(
  apiKey: string,
  endpoint: string,
  model: string,
  prompt: string,
  responseSchema: Record<string, unknown>,
): Promise<unknown> {
  const requestTarget = resolveEndpoint(endpoint, model);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  let response: Response;
  try {
    response = await fetch(requestTarget.url, {
      method: "POST",
      headers: requestTarget.kind === "gemini"
        ? { "Content-Type": "application/json", "x-goog-api-key": apiKey }
        : { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(requestTarget.kind === "gemini" ? {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192, responseMimeType: "application/json", responseSchema },
      } : {
        model,
        messages: [
          { role: "system", content: "Return a JSON object only. Follow the requested response schema exactly. Do not include markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The AI service did not respond in time. Check the configured endpoint and service status, then try again.");
    }
    const detail = error instanceof Error ? error.message : "Unknown network error";
    console.warn("Unable to reach configured AI service:", detail);
    throw new Error("Could not reach the configured AI service. Your internet connection may still be working; check the API endpoint, firewall or network restrictions, and try again.");
  } finally {
    clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const providerMessage = payload?.error?.message;
    if (response.status === 401 || response.status === 403) throw new Error("The AI service rejected this API key. Check or replace it in Settings → AI Suggestions.");
    if (response.status === 429) throw new Error("The AI service request limit was reached. Wait and try again, or check your model's quota and billing.");
    if (response.status === 503) throw new Error("The selected AI model is temporarily overloaded or unavailable (503). This is a provider-side issue, not an internet or API-key problem. Try again later or select another available model in AI Settings.");
    if (response.status === 404) throw new Error("The AI service could not find this model or endpoint. Check them in AI Settings.");
    throw new Error(providerMessage || `AI request failed (${response.status}). Try again later.`);
  }
  const text = requestTarget.kind === "gemini"
    ? payload?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("").trim()
    : typeof payload?.choices?.[0]?.message?.content === "string"
      ? payload.choices[0].message.content.trim()
      : payload?.choices?.[0]?.message?.content?.map((part: { text?: string }) => part.text ?? "").join("").trim();
  if (!text) throw new Error("The AI service returned an empty answer. Try again.");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The AI service returned an unreadable response. Check that the selected endpoint supports JSON responses.");
  }
}

function resolveEndpoint(endpoint: string, model: string): { kind: "gemini" | "openai-compatible"; url: string } {
  let parsed: URL;
  try {
    parsed = new URL(endpoint.trim());
  } catch {
    throw new Error("Enter a complete AI API URL, including https://, in AI Settings.");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("For security, the AI API endpoint must use HTTPS.");
  }

  if (parsed.hostname === "generativelanguage.googleapis.com") {
    return {
      kind: "gemini",
      url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    };
  }

  const path = parsed.pathname.replace(/\/+$/, "");
  if (path.endsWith("/chat/completions")) {
    return { kind: "openai-compatible", url: parsed.toString() };
  }
  if (path.endsWith("/v1")) {
    parsed.pathname = `${path}/chat/completions`;
  } else {
    parsed.pathname = `${path}/v1/chat/completions`;
  }
  return { kind: "openai-compatible", url: parsed.toString() };
}

function buildClinicalPrompt(sections: ClinicalSection[]): string {
  return [
    "You are an evidence-aware clinical decision support assistant helping a licensed treating physician. This output is educational support only, not a diagnosis or a substitute for clinical judgment.",
    "Review only the clinical information supplied below. Do not assume facts that are not present. Point out important missing information and uncertainty.",
    "Prioritize established medical references and databases such as UpToDate, AMBOSS, BMJ Best Practice, NICE, WHO, CDC, and PubMed when they are genuinely available to you. Do not use a general Google search. This request does not provide authenticated access to proprietary resources or external browsing tools: never claim to have searched or consulted a source unless you actually did. Do not invent references, quotes, source names, or citations; say so in evidenceLimitations when source access is unavailable.",
    "Give at most 7 possible diagnoses, in descending order of likelihood. The possibleDiagnoses array must contain only diagnosis names in that order.",
    "For every listed diagnosis, provide a separate diagnosticReasoning item explaining: (1) why this diagnosis is being considered, (2) why it is ranked at this position compared with the other possible diagnoses, (3) which clinical findings support it, (4) which findings are missing or argue against it, and (5) how to assess it further through focused questions, physical examination, and appropriate laboratory tests or imaging.",
    "The ranking must be clinically reasoned. Explicitly explain why the first diagnosis is the most likely, why the second is less likely than the first, why the third is less likely than the first and second, and so on. Do not simply list diagnoses without explaining the reasoning behind their relative order.",
    "When evidence from an identifiable source is used for a paragraph, statement, recommendation, diagnostic reasoning point, or other piece of displayed information, append the source name at the end of that paragraph or displayed block in a visually subtle/small source label. Preserve the existing presentation structure and formatting; do not create a separate References section unless the requested schema explicitly contains one.",
    "Source labels must contain only sources that were actually available and used for that specific information. Never invent or infer a source name. If no identifiable source was actually available or used, do not add a source label and explain the limitation in evidenceLimitations when relevant.",
    "Do not change the existing presentation style, section structure, ordering, or visual hierarchy just to display source names. Source attribution should be concise and visually secondary to the clinical content, for example: 'Source: NICE' or 'Source: PubMed'.",
    "Do not recommend treatment or assert a definitive diagnosis.",
    "Return valid JSON matching the requested schema only. Use clear, concise English. Use empty arrays when a category has no useful suggestion. Keep each suggestion specific to the provided case.",
    "Clinical sections (only sections with recorded information are included):",
    ...sections.map((section) => `\n## ${section.title}\n${JSON.stringify(section.data)}`),
  ].join("\n");
}

function normalizeSuggestionResult(value: unknown): AISuggestionResult {
  const result = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const possibleDiagnoses = Array.isArray(result.possibleDiagnoses)
    ? result.possibleDiagnoses
      .map((item: any) => ({ name: String(item?.name ?? "").trim() }))
      .filter((item) => item.name)
      .slice(0, 7)
    : [];
  const diagnosticReasoning = Array.isArray(result.diagnosticReasoning)
    ? result.diagnosticReasoning.map((item: any) => ({
        diagnosis: String(item?.diagnosis ?? "").trim(),
        whyLikely: String(item?.whyLikely ?? "").trim(),
        questions: stringArray(item?.questions),
        examinations: stringArray(item?.examinations),
        investigations: stringArray(item?.investigations),
      })).filter((item) => item.diagnosis && possibleDiagnoses.some((diagnosis) => diagnosis.name.toLocaleLowerCase() === item.diagnosis.toLocaleLowerCase())).slice(0, 7)
    : [];
  return {
    possibleDiagnoses,
    diagnosticReasoning,
    evidenceLimitations: String(result.evidenceLimitations ?? "").trim(),
  };
}

function normalizeTreatmentResult(value: unknown): AITreatmentResult {
  const result = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const recommendations = Array.isArray(result.recommendations)
    ? result.recommendations.map((item: any) => ({
        category: String(item?.category ?? "").trim(),
        recommendation: String(item?.recommendation ?? "").trim(),
        medicationName: String(item?.medicationName ?? "").trim(),
        dose: String(item?.dose ?? "").trim(),
        route: String(item?.route ?? "").trim(),
        frequency: String(item?.frequency ?? "").trim(),
        duration: String(item?.duration ?? "").trim(),
        ageConsiderations: String(item?.ageConsiderations ?? "").trim(),
        source: String(item?.source ?? "").trim(),
      }))
      .filter((item) => item.recommendation && item.source)
      .slice(0, 15)
    : [];
  return {
    recommendations,
    evidenceLimitations: String(result.evidenceLimitations ?? "").trim(),
  };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];
}

function normalizeAPIKey(apiKey: string): string {
  // Keys copied from a browser or password manager can include line breaks or
  // whitespace. Native Android rejects those characters in HTTP headers.
  return apiKey.replace(/\s+/g, "").trim();
}

function firstClinicalValue(...values: unknown[]): unknown {
  return values.find((value) => removeEmptyClinicalData(value) !== undefined);
}

function removeEmptyClinicalData(value: unknown): unknown {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "boolean") return value ? "Yes" : undefined;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string") return value.trim() || undefined;
  if (Array.isArray(value)) {
    const items = value.map(removeEmptyClinicalData).filter((item) => item !== undefined);
    return items.length ? items : undefined;
  }
  if (typeof value === "object") {
    const source = value as Record<string, unknown>;
    if (("fieldLabel" in source || "fieldId" in source) && "value" in source) {
      const fieldValue = removeEmptyClinicalData(source.value);
      return fieldValue === undefined ? undefined : {
        field: source.fieldLabel ?? source.fieldId,
        value: fieldValue,
        ...(source.unit ? { unit: source.unit } : {}),
      };
    }
    const cleaned: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(source)) {
      if (/^(id|.*Id|.*Code|createdAt|updatedAt|patient|patientId|visitId|clinic|doctor)$/i.test(key)) continue;
      const next = removeEmptyClinicalData(item);
      if (next !== undefined) cleaned[key] = next;
    }
    return Object.keys(cleaned).length ? cleaned : undefined;
  }
  return undefined;
}
