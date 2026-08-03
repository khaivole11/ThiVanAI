import type { GeneratedPoem, GenerationRequest, PoetryForm, LiteraryPeriod, SourcePoem } from './types'

const HISTORY_KEY = 'thi-van-ai-history'

export function getHistory(): GeneratedPoem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as GeneratedPoem[]
  } catch {
    return []
  }
}

export function savePoem(poem: GeneratedPoem): void {
  try {
    const history = getHistory()
    const existing = history.findIndex((p) => p.id === poem.id)
    if (existing >= 0) {
      history[existing] = poem
    } else {
      history.unshift(poem)
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    throw new Error('Bộ nhớ trình duyệt không khả dụng hoặc đã đầy.')
  }
}

export function deletePoem(id: string): void {
  try {
    const history = getHistory().filter((p) => p.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    throw new Error('Không thể xóa bài thơ.')
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}

export function getPoemById(id: string): GeneratedPoem | null {
  return getHistory().find((p) => p.id === id) ?? null
}

// Simulate the RAG generation pipeline
const MOCK_SOURCES: SourcePoem[] = [
  {
    id: 'src-001',
    rank: 1,
    title: 'Đoạn trường tân thanh',
    author: 'Nguyễn Du',
    period: 'Trung đại',
    poetryForm: 'Lục bát',
    excerpt: 'Trăm năm trong cõi người ta,\nChữ tài chữ mệnh khéo là ghét nhau.\nTrải qua một cuộc bể dâu,\nNhững điều trông thấy mà đau đớn lòng.',
    matchTags: [
      { key: 'same-form', label: 'Cùng thể thơ' },
      { key: 'similar-content', label: 'Nội dung tương đồng' },
    ],
    similarityScore: 0.87,
    denseScore: 0.89,
    bm25Score: 0.82,
    hybridScore: 0.87,
  },
  {
    id: 'src-002',
    rank: 2,
    title: 'Tự tình II',
    author: 'Hồ Xuân Hương',
    period: 'Trung đại',
    poetryForm: 'Thất ngôn bát cú',
    excerpt: 'Đêm khuya văng vẳng trống canh dồn,\nTrơ cái hồng nhan với nước non.\nChén rượu hương đưa say lại tỉnh,\nVầng trăng bóng xế khuyết chưa tròn.',
    matchTags: [
      { key: 'same-period', label: 'Cùng thời kỳ' },
      { key: 'similar-imagery', label: 'Hình ảnh thơ tương đồng' },
    ],
    similarityScore: 0.79,
    denseScore: 0.81,
    bm25Score: 0.74,
    hybridScore: 0.79,
  },
  {
    id: 'src-003',
    rank: 3,
    title: 'Nhớ rừng',
    author: 'Thế Lữ',
    period: 'Cận đại',
    poetryForm: 'Thơ tự do',
    excerpt: 'Ta sống mãi trong tình thương nỗi nhớ,\nThủa tung hoành hống hách những ngày xưa.\nNhớ cảnh sơn lâm bóng cả cây già,\nVới tiếng gió gào ngàn, với giọng nguồn hét núi.',
    matchTags: [
      { key: 'similar-content', label: 'Nội dung tương đồng' },
      { key: 'similar-imagery', label: 'Hình ảnh thơ tương đồng' },
    ],
    similarityScore: 0.74,
    denseScore: 0.76,
    bm25Score: 0.69,
    hybridScore: 0.74,
  },
  {
    id: 'src-004',
    rank: 4,
    title: 'Mùa thu',
    author: 'Xuân Diệu',
    period: 'Hiện đại',
    poetryForm: 'Thơ bảy chữ',
    excerpt: 'Đây mùa thu tới, mùa thu tới\nVới áo mơ phai dệt lá vàng\nHơn một loài hoa đã rụng cành\nTrong vườn sắc đỏ rũa màu xanh.',
    matchTags: [
      { key: 'similar-imagery', label: 'Hình ảnh thơ tương đồng' },
    ],
    similarityScore: 0.71,
    denseScore: 0.68,
    bm25Score: 0.77,
    hybridScore: 0.71,
  },
  {
    id: 'src-005',
    rank: 5,
    title: 'Câu cá mùa thu',
    author: 'Nguyễn Khuyến',
    period: 'Cận đại',
    poetryForm: 'Thất ngôn bát cú',
    excerpt: 'Ao thu lạnh lẽo nước trong veo,\nMột chiếc thuyền câu bé tẻo teo.\nSóng biếc theo làn hơi gợn tí,\nLá vàng trước gió khẽ đưa vèo.',
    matchTags: [
      { key: 'same-period', label: 'Cùng thời kỳ' },
      { key: 'similar-content', label: 'Nội dung tương đồng' },
    ],
    similarityScore: 0.68,
    denseScore: 0.65,
    bm25Score: 0.73,
    hybridScore: 0.68,
  },
]

function generatePoemLines(request: GenerationRequest): string[] {
  const { openingVerse, poetryForm } = request

  if (poetryForm === 'luc-bat') {
    return [
      openingVerse,
      'Gió đưa cành trúc la đà bên sông.',
      'Bóng trăng in xuống dòng trong,',
      'Lòng ta cũng nhẹ như bông mây chiều.',
      'Tiếng chuông ngân mãi không tiêu,',
      'Vọng về xa tắp những chiều hư không.',
      'Nghe lòng thương nhớ mênh mông,',
      'Cánh chim trắng vỗ trên đồng xa xa.',
    ]
  }

  if (poetryForm === 'nam-chu') {
    return [
      openingVerse,
      'Lá thu vàng rơi,',
      'Khói sương giăng lối.',
      'Tiếng mưa thì thào,',
      'Lòng ta xao xuyến.',
      'Nhớ ai khôn nguôi,',
      'Bóng hình còn đó.',
      'Trăng lên đỉnh đồi,',
      'Soi mình cô đơn.',
    ]
  }

  if (poetryForm === 'bay-chu') {
    return [
      openingVerse,
      'Trăng vàng in bóng mái hiên xưa,',
      'Tiếng gió vi vu qua kẽ lá.',
      'Lòng nhớ ai người xa muôn dặm,',
      'Mà trăng vẫn sáng giữa đêm khuya.',
      'Sông xa giữ mãi bóng quê nhà,',
      'Chiếc lá vàng bay theo gió đưa.',
      'Ta ngồi lắng nghe tiếng đời vọng,',
      'Mà lòng thương nhớ chẳng phai mờ.',
    ]
  }

  return [
    openingVerse,
    'Nghe lòng lay động khẽ khàng,',
    'Như mưa thu nhẹ đổ tràn mái hiên.',
    'Bâng khuâng nhớ những ngày yên,',
    'Khi trời trong xanh dịu hiền bên ta.',
    'Giờ đây xa cách đôi nhà,',
    'Tiếng chim vọng lại thiết tha trong lòng.',
    'Trăng lên soi mảnh ruộng đồng,',
    'Gió đưa kỷ niệm mênh mông trở về.',
  ]
}

export async function simulateGeneration(
  request: GenerationRequest,
  onProgress: (status: string) => void,
): Promise<GeneratedPoem> {
  onProgress('analyzing')
  await delay(1200)

  onProgress('retrieving')
  await delay(1500)

  onProgress('selecting')
  await delay(1000)

  onProgress('generating')
  await delay(2000)

  const id = `poem-${Date.now()}`
  const lines = generatePoemLines(request)
  const topSources = MOCK_SOURCES.slice(0, request.topK || 5)

  const poem: GeneratedPoem = {
    id,
    title: derivePoemTitle(request.openingVerse),
    lines,
    poetryForm: request.poetryForm,
    authorStyle: request.authorStyle,
    period: request.period,
    openingVerse: request.openingVerse,
    sources: topSources,
    createdAt: new Date().toISOString(),
    topK: request.topK || 5,
    saved: false,
  }

  return poem
}

function derivePoemTitle(openingVerse: string): string {
  const words = openingVerse.split(' ')
  if (words.length <= 4) return openingVerse
  return words.slice(0, 4).join(' ') + '...'
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
