import type { GeneratedPoem, MatchTag, SourcePoem } from '../types'
import type {
  GeneratePoemRequestDto,
  GeneratePoemResponseDto,
  SourcePoemDto,
} from './contracts'

function normalize(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase('vi-VN')
}

function deriveMatchTags(
  source: SourcePoemDto,
  request: GeneratePoemRequestDto,
): MatchTag[] {
  const tags: MatchTag[] = []

  if (normalize(source.genre) === normalize(request.poetryForm)) {
    tags.push({ key: 'same-form', label: 'Cùng thể thơ' })
  }
  if (
    request.authorStyle &&
    normalize(source.author) === normalize(request.authorStyle)
  ) {
    tags.push({ key: 'same-author', label: 'Cùng tác giả' })
  }
  if (
    request.periodStyle &&
    normalize(source.period) === normalize(request.periodStyle)
  ) {
    tags.push({ key: 'same-period', label: 'Cùng thời kỳ' })
  }

  return tags
}

export function mapSourcePoem(
  source: SourcePoemDto,
  request: GeneratePoemRequestDto,
): SourcePoem {
  return {
    id: source.poemId,
    rank: source.rank,
    title: source.title,
    author: source.author,
    period: source.period,
    poetryForm: source.genre,
    excerpt: source.contentExcerpt,
    url: source.url ?? undefined,
    matchTags: deriveMatchTags(source, request),
    denseScore: source.denseScore,
    bm25Score: source.bm25Score,
    hybridScore: source.hybridScore,
    // Compatibility only. Prefer displaying hybridScore with the correct label.
    similarityScore: source.hybridScore,
  }
}

export function mapGeneratedPoem(
  response: GeneratePoemResponseDto,
  request: GeneratePoemRequestDto,
): GeneratedPoem {
  return {
    id: response.id,
    title: response.title,
    lines: response.lines,
    fullText: response.fullText,
    poetryForm: request.poetryForm,
    authorStyle: request.authorStyle ?? '',
    period: request.periodStyle ?? '',
    openingVerse: request.firstVerse,
    sources: response.sources.map((source) => mapSourcePoem(source, request)),
    createdAt: response.createdAt,
    topK: request.topK ?? response.sources.length,
    saved: false,
    serverPersisted: true,
    backendStatus: response.status,
    validationPassed: response.validationPassed,
    validationErrors: response.validationErrors,
    attemptCount: response.attemptCount,
    provider: response.provider,
    model: response.model,
    promptVersion: response.promptVersion,
    corpusVersion: response.corpusVersion,
    timingsMs: response.timingsMs,
  }
}