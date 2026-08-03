export type PoetryForm =
  | 'luc-bat'
  | 'song-that-luc-bat'
  | 'bon-chu'
  | 'nam-chu'
  | 'sau-chu'
  | 'bay-chu'
  | 'tam-chu'
  | 'tu-do'

export type LiteraryPeriod =
  | ''
  | 'trung-dai'
  | 'can-dai'
  | 'hien-dai'
  | 'duong-dai'

export type GenerationStatus =
  | 'idle'
  | 'analyzing'
  | 'retrieving'
  | 'selecting'
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
  matchTags: MatchTag[]
  similarityScore?: number
  denseScore?: number
  bm25Score?: number
  hybridScore?: number
}

export interface GeneratedPoem {
  id: string
  title: string
  lines: string[]
  poetryForm: PoetryForm
  authorStyle: string
  period: LiteraryPeriod
  openingVerse: string
  sources: SourcePoem[]
  createdAt: string
  topK: number
  saved: boolean
  feedback?: string[]
}

export interface GenerationRequest {
  openingVerse: string
  poetryForm: PoetryForm
  authorStyle: string
  period: LiteraryPeriod
  topK: number
  retrievalMethod?: string
  generationModel?: string
  temperature?: number
}

export const POETRY_FORM_LABELS: Record<PoetryForm, string> = {
  'luc-bat': 'Lục bát',
  'song-that-luc-bat': 'Song thất lục bát',
  'bon-chu': 'Thơ bốn chữ',
  'nam-chu': 'Thơ năm chữ',
  'sau-chu': 'Thơ sáu chữ',
  'bay-chu': 'Thơ bảy chữ',
  'tam-chu': 'Thơ tám chữ',
  'tu-do': 'Thơ tự do',
}

export const POETRY_FORM_DESCRIPTIONS: Record<PoetryForm, string> = {
  'luc-bat': 'Thể thơ truyền thống với cặp câu sáu và tám chữ, gieo vần liên tục.',
  'song-that-luc-bat': 'Hai câu bảy chữ xen với cặp lục bát, thường dùng trong ngâm khúc.',
  'bon-chu': 'Mỗi câu có bốn chữ, nhịp ngắn gọn, thường dùng trong thơ thiếu nhi.',
  'nam-chu': 'Mỗi câu có năm chữ, nhịp điệu linh hoạt, phổ biến trong thơ hiện đại.',
  'sau-chu': 'Mỗi câu có sáu chữ, nhịp điệu trung bình, giàu tính nhạc.',
  'bay-chu': 'Mỗi câu có bảy chữ, phổ biến trong thơ Đường luật Việt Nam.',
  'tam-chu': 'Mỗi câu có tám chữ, cho phép diễn đạt phong phú và linh hoạt.',
  'tu-do': 'Không ràng buộc số chữ hay vần điệu, tự do trong hình thức và cấu trúc.',
}

export const PERIOD_LABELS: Record<string, string> = {
  '': 'Không ưu tiên',
  'trung-dai': 'Trung đại',
  'can-dai': 'Cận đại',
  'hien-dai': 'Hiện đại',
  'duong-dai': 'Đương đại',
}

export const EXAMPLE_PROMPTS = [
  'Trăng nghiêng qua mái hiên nhà',
  'Chiều rơi bên mái chùa xưa',
  'Mưa qua để lại hương đồng',
  'Em đi qua cuối mùa thu',
  'Dòng sông giữ bóng quê nhà',
]

export const EXAMPLE_AUTHORS = [
  'Nguyễn Du',
  'Hồ Xuân Hương',
  'Tố Hữu',
  'Xuân Diệu',
  'Huy Cận',
  'Chế Lan Viên',
  'Nguyễn Bính',
  'Trần Tế Xương',
  'Bà Huyện Thanh Quan',
  'Nguyễn Khuyến',
]
