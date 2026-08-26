import { apiRequest } from "./client";
import type {
  AnalyzePoemRequestDto,
  FeedbackRequestDto,
  FeedbackResponseDto,
  GeneratePoemRequestDto,
  GeneratePoemResponseDto,
  HistoryListResponseDto,
  PoemAnalysisResponseDto,
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

export function analyzePoem(
  body: AnalyzePoemRequestDto,
  signal?: AbortSignal,
) {
  return apiRequest<PoemAnalysisResponseDto>("/generations/analyze", {
    method: "POST",
    body: JSON.stringify(body),
    signal,
  });
}

export function submitGenerationFeedback(
  generationId: string,
  body: FeedbackRequestDto,
  signal?: AbortSignal,
) {
  return apiRequest<FeedbackResponseDto>(
    `/generations/${encodeURIComponent(generationId)}/feedback`,
    {
      method: "POST",
      body: JSON.stringify(body),
      signal,
    },
  );
}
