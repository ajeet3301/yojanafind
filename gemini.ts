/**
 * lib/gemini.ts
 * Gemini AI client — used for document OCR (Aadhaar / PAN / Ration Card)
 */

import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

// Singleton client
let _genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is not set in environment variables');
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

/**
 * Get the Gemini 2.0 Flash model (best for vision/OCR tasks, free tier)
 */
export function getVisionModel(): GenerativeModel {
  return getClient().getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
}

/**
 * Get Gemini Pro for longer text tasks
 */
export function getProModel(): GenerativeModel {
  return getClient().getGenerativeModel({ model: 'gemini-1.5-pro' });
}

/**
 * Convert a File/Blob to base64 inline data for Gemini
 */
export async function fileToGenerativePart(file: File | Blob) {
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  return {
    inlineData: {
      mimeType: file.type as string,
      data: base64,
    },
  };
}

/**
 * Extract structured data from an identity document image
 * Returns: { age, state, income, docType, confidence }
 */
export async function extractDocumentData(imageFile: File | Blob): Promise<{
  age?: number;
  state?: string;
  income?: string;
  docType?: string;
  confidence?: string;
  rawDOB?: string;
  rawAddress?: string;
  error?: string;
}> {
  const model = getVisionModel();
  const imagePart = await fileToGenerativePart(imageFile);

  const VALID_STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
    'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
    'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
    'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
    'Uttar Pradesh','Uttarakhand','West Bengal','Andaman & Nicobar','Chandigarh',
    'Dadra & Nagar Haveli','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
  ];

  const INCOME_BANDS = [
    'Below ₹1 Lakh (BPL)',
    '₹1 – ₹2.5 Lakh',
    '₹2.5 – ₹5 Lakh',
    '₹5 – ₹8 Lakh',
    '₹8 – ₹12 Lakh',
    'Above ₹12 Lakh',
  ];

  const prompt = `You are an expert at reading Indian government identity documents.
Analyze this document image carefully and extract the following information.

Return ONLY a valid JSON object. No markdown, no explanation, just JSON:
{
  "age": <calculated age as integer, or null if DOB not found>,
  "state": "<exact state name from this list or null: ${VALID_STATES.slice(0, 15).join(', ')}, etc.>",
  "income": "<one of these exact strings or null: ${INCOME_BANDS.join(' | ')}>",
  "docType": "<aadhaar|pan|ration|voter|other|unknown>",
  "confidence": "<high|medium|low>",
  "rawDOB": "<raw DOB string extracted, or null>",
  "rawAddress": "<raw address text extracted, or null>"
}

Rules:
- Calculate age from DOB as of year 2026
- For state: look at the address on the document. Match to the correct Indian state.
- If it's a PAN card (no address), state will be null
- If income info is on the document (e.g. ration card), extract it
- If document is blurry/unreadable, set confidence to "low" and fields to null
- If not an identity document, return {"error": "not_an_id_document", "docType": "unknown"}`;

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text().trim();

    // Clean markdown fences if present
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean);

    if (parsed.error) return { error: parsed.error };

    // Normalize state name to exact match
    if (parsed.state) {
      const match = VALID_STATES.find(
        s => s.toLowerCase() === parsed.state.toLowerCase()
      ) || VALID_STATES.find(
        s => parsed.state && s.toLowerCase().includes(parsed.state.toLowerCase().slice(0, 6))
      );
      parsed.state = match || null;
    }

    return parsed;
  } catch (err: any) {
    console.error('Gemini OCR error:', err.message);
    return { error: 'gemini_parse_failed' };
  }
}
