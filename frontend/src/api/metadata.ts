import { apiRequest } from "./client";
import type { MetadataOptionDto } from "./contracts";

export function getPoetryForms(signal?: AbortSignal) {
  return apiRequest<MetadataOptionDto[]>("/metadata/poetry-forms", { signal });
}

export function getPeriods(signal?: AbortSignal) {
  return apiRequest<string[]>("/metadata/periods", { signal });
}
