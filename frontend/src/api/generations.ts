import { apiRequest } from "./client";
import type {
  GeneratePoemRequestDto,
  GeneratePoemResponseDto,
  HistoryListResponseDto,
} from "./contracts";

export function createGeneration(
  body: GeneratePoemRequestDto,
  signal?: AbortSignal,
) {
  return apiRequest<GeneratePoemResponseDto>("/generations", {
    method: "POST",
    body: JSON.stringify(body),
    signal,
  });
}

export function listGenerations(page = 1, pageSize = 20, signal?: AbortSignal) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  return apiRequest<HistoryListResponseDto>(`/generations?${query}`, {
    signal,
  });
}
