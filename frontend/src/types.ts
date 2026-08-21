import type { BackendGenerationStatus } from './api/contracts'

// Metadata API là nguồn chuẩn; không dùng union slug đóng ở frontend.
export type PoetryForm = string
export type LiteraryPeriod = string

export interface GenerationRequest {
  openingVerse: string
  poetryForm: PoetryForm
  authorStyle?: string
  period?: LiteraryPeriod
}

export type UiGenerationStatus =
  | 'idle'
  | 'analyzing'
  | 'generating'
  | 'complete'
  | 'error'

export interface MatchTag {
  key: string
  label: string
}

export interface SourcePoem {
  id: string
  rank: number
  title: string
  author: string
  period: string
  poetryForm: string
  excerpt: string
  url?: string
  matchTags: MatchTag[]
  similarityScore?: number
  denseScore?: number
  bm25Score?: number
  hybridScore?: number
}

export interface PoemAnalysis {
  summary: string
  form: {
    poemType: string
    lineCount: number
    rhymePattern: string
    rhythmNotes: string
  }
  meaning: {
    mainTheme: string
    emotionalTone: string
    message: string
  }
  literaryDevices: Array<{
    type: string
    quote: string
    effect: string
  }>
  qualityReview: {
    score: number
    strengths: string[]
    weaknesses: string[]
    revisionSuggestions: string[]
  }
  studentFriendlyAnalysis: string
  provider: string
  model: string
  createdAt: string
}

export interface GeneratedPoem {
  id: string
  title: string
  lines: string[]
  fullText: string
  poetryForm: PoetryForm
  authorStyle: string
  period: LiteraryPeriod
  openingVerse: string
  sources: SourcePoem[]
  createdAt: string
  topK: number

  // saved chỉ nên mang nghĩa bookmark cục bộ.
  saved: boolean
  serverPersisted: boolean
  feedback?: string[]

  backendStatus: BackendGenerationStatus
  validationPassed: boolean
  validationErrors: string[]
  attemptCount: number
  provider: string
  model: string
  promptVersion: string
  corpusVersion: string
  timingsMs: Record<string, number>
  analysis?: PoemAnalysis
}
