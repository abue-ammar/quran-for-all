import type { Language } from "@/types";

export const LANGUAGES: Language[] = [
  { id: 22, name: "English – Saheeh Intl", code: "en" },
  { id: 131, name: "Urdu – Jalandhry", code: "ur" },
  { id: 20, name: "Indonesian", code: "id" },
  { id: 59, name: "French", code: "fr" },
  { id: 17, name: "Turkish", code: "tr" },
  { id: 161, name: "Bengali – Muhiuddin Khan", code: "bn" },
  { id: 31, name: "German", code: "de" },
  { id: 83, name: "Spanish", code: "es" },
  { id: 79, name: "Hindi", code: "hi" },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0];

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export function getLanguageById(id: number): Language | undefined {
  return LANGUAGES.find((l) => l.id === id);
}
