export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  error_code: string | null;
  details?: Record<string, unknown>;
  retryable?: boolean;
}

export interface MetadataOptionDto {
  key: string;
  value: string;
}

export type BackendGenerationStatus =
  | "pending"
  | "generating"
  | "completed"
  | "completed_with_warnings"
  | "failed";

export interface SourcePoemDto {
  poemId: string;
  title: string;
  author: string;
  genre: string;
  period: string;
  contentExcerpt: string;
  url: string | null;
  rank: number;
  denseScore: number;
  bm25Score: number;
  hybridScore: number;
}

export interface GeneratePoemRequestDto {
  firstVerse: string;
  poetryForm: string;
  authorStyle?: string;
  periodStyle?: string;
  topK?: number;
  embeddingK?: number;
  bm25K?: number;
  alpha?: number;
}

export interface GeneratePoemResponseDto {
  id: string;
  status: BackendGenerationStatus;
  title: string;
  lines: string[];
  fullText: string;
  sources: SourcePoemDto[];
  validationPassed: boolean;
  validationErrors: string[];
  attemptCount: number;
  provider: string;
  model: string;
  promptVersion: string;
  corpusVersion: string;
  timingsMs: Record<string, number>;
  createdAt: string;
}

export interface SearchRequestDto {
  firstVerse: string;
  genre?: string;
  author?: string;
  period?: string;
  topK?: number;
  embeddingK?: number;
  bm25K?: number;
  alpha?: number;
}

export interface HistoryListResponseDto {
  items: GeneratePoemResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
