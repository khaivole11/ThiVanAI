import { useState } from 'react'
import Button from '../components/Button'
import Badge from '../components/Badge'
import SourceCard from '../components/SourceCard'
import SourceDetailDrawer from '../components/SourceDetailDrawer'
import { showToast } from '../components/Toast'
import { simulateGeneration } from '../store'
import { POETRY_FORM_LABELS, PERIOD_LABELS, EXAMPLE_AUTHORS, type PoetryForm, type LiteraryPeriod, type SourcePoem } from '../types'

type ActiveTab = 'query' | 'retrieval' | 'generation' | 'metrics'

const RETRIEVAL_METHODS = ['BM25', 'Dense (Embedding)', 'Hybrid', 'HyDE']
const EMBEDDING_MODELS = [
  'multilingual-e5-large-instruct',
  'paraphrase-multilingual-MiniLM-L12-v2',
  'PhoBERT-based',
]
const GENERATION_MODELS = ['Gemini 2.5 Flash', 'BARTpho', 'mT5', 'SP-GPT2']
const POETRY_FORMS = Object.entries(POETRY_FORM_LABELS) as [PoetryForm, string][]

export default function ResearchMode() {
  const [tab, setTab] = useState<ActiveTab>('query')

  // Query config
  const [openingVerse, setOpeningVerse] = useState('')
  const [poetryForm, setPoetryForm] = useState<PoetryForm | ''>('')
  const [authorStyle, setAuthorStyle] = useState('')
  const [period, setPeriod] = useState<LiteraryPeriod>('')

  // Retrieval config
  const [retrievalMethod, setRetrievalMethod] = useState('Hybrid')
  const [embeddingModel, setEmbeddingModel] = useState(EMBEDDING_MODELS[0])
  const [topK, setTopK] = useState(5)
  const [reranking, setReranking] = useState(false)
  const [hydeEnabled, setHydeEnabled] = useState(false)

  // Generation config
  const [genModel, setGenModel] = useState(GENERATION_MODELS[0])
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(512)

  // Results
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<SourcePoem[] | null>(null)
  const [generatedLines, setGeneratedLines] = useState<string[]>([])
  const [selectedSource, setSelectedSource] = useState<SourcePoem | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)

  async function handleRun() {
    if (!openingVerse.trim()) {
      showToast('Vui lòng nhập câu thơ mở đầu.', 'warning')
      return
    }
    setRunning(true)
    setResults(null)
    setGeneratedLines([])
    const start = Date.now()

    try {
      const poem = await simulateGeneration(
        {
          openingVerse: openingVerse.trim(),
          poetryForm: poetryForm as PoetryForm || 'tu-do',
          authorStyle,
          period,
          topK,
          retrievalMethod,
          generationModel: genModel,
          temperature,
        },
        () => {},
      )
      setResults(poem.sources.slice(0, topK))
      setGeneratedLines(poem.lines)
      setElapsed(Date.now() - start)
    } catch {
      showToast('Không thể thực hiện thử nghiệm.', 'error')
    } finally {
      setRunning(false)
    }
  }

  function handleExport() {
    if (!results) return
    const data = {
      config: { retrievalMethod, embeddingModel, topK, genModel, temperature },
      query: { openingVerse, poetryForm, authorStyle, period },
      retrievedSources: results,
      generatedPoem: generatedLines,
      elapsedMs: elapsed,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'experiment.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Đã xuất kết quả thử nghiệm.', 'success')
  }

  const sourceIndex = results?.findIndex((s) => s.id === selectedSource?.id) ?? -1

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-[#252932]">Chế độ nghiên cứu</h1>
            <Badge variant="info">Beta</Badge>
          </div>
          <p className="text-[#5f6673] text-sm">Cấu hình và so sánh các phương pháp RAG cho sinh thơ tiếng Việt.</p>
        </div>
        {results && (
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Xuất kết quả JSON
          </Button>
        )}
      </div>

      {/* Warning banner */}
      <div className="bg-[#fff5e5] border border-[#ebcb97] rounded-lg px-4 py-3 text-sm text-[#7b4c13] mb-6 flex gap-2">
        <span className="flex-shrink-0 font-bold">⚠</span>
        Các thiết lập trong trang này dành cho thử nghiệm kỹ thuật và có thể làm thay đổi đáng kể kết quả truy xuất hoặc sinh thơ.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Config sidebar */}
        <aside className="lg:col-span-1 space-y-5" aria-label="Cấu hình thử nghiệm">
          {/* Query */}
          <section className="bg-white border border-[#e4e1da] rounded-xl p-5">
            <h2 className="font-semibold text-[#252932] mb-4 text-sm uppercase tracking-wide">Truy vấn</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="r-verse" className="block text-xs font-medium text-[#252932] mb-1">Câu thơ mở đầu</label>
                <textarea
                  id="r-verse"
                  rows={2}
                  value={openingVerse}
                  onChange={(e) => setOpeningVerse(e.target.value)}
                  placeholder="Nhập câu thơ..."
                  className="w-full px-3 py-2 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] placeholder:text-[#a8adb5] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] font-serif"
                />
              </div>
              <div>
                <label htmlFor="r-form" className="block text-xs font-medium text-[#252932] mb-1">Thể thơ</label>
                <select id="r-form" value={poetryForm} onChange={(e) => setPoetryForm(e.target.value as PoetryForm)} className="w-full px-3 py-2 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] cursor-pointer">
                  <option value="">Tất cả</option>
                  {POETRY_FORMS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="r-author" className="block text-xs font-medium text-[#252932] mb-1">Tác giả</label>
                <input id="r-author" type="text" value={authorStyle} onChange={(e) => setAuthorStyle(e.target.value)} list="author-list" placeholder="Tùy chọn" className="w-full px-3 py-2 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]" />
                <datalist id="author-list">
                  {EXAMPLE_AUTHORS.map((a) => <option key={a} value={a} />)}
                </datalist>
              </div>
              <div>
                <label htmlFor="r-period" className="block text-xs font-medium text-[#252932] mb-1">Thời kỳ</label>
                <select id="r-period" value={period} onChange={(e) => setPeriod(e.target.value as LiteraryPeriod)} className="w-full px-3 py-2 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] cursor-pointer">
                  {Object.entries(PERIOD_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Retrieval config */}
          <section className="bg-white border border-[#e4e1da] rounded-xl p-5">
            <h2 className="font-semibold text-[#252932] mb-4 text-sm uppercase tracking-wide">Truy xuất</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="r-method" className="block text-xs font-medium text-[#252932] mb-1">Phương pháp</label>
                <select id="r-method" value={retrievalMethod} onChange={(e) => setRetrievalMethod(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] cursor-pointer">
                  {RETRIEVAL_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="r-embedding" className="block text-xs font-medium text-[#252932] mb-1">Embedding model</label>
                <select id="r-embedding" value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] cursor-pointer">
                  {EMBEDDING_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="r-topk" className="block text-xs font-medium text-[#252932] mb-1">Top-K: {topK}</label>
                <input id="r-topk" type="range" min={1} max={10} value={topK} onChange={(e) => setTopK(Number(e.target.value))} className="w-full accent-[#3f4a6b]" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={reranking} onChange={(e) => setReranking(e.target.checked)} className="accent-[#3f4a6b]" />
                <span className="text-xs text-[#252932]">Reranking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hydeEnabled} onChange={(e) => setHydeEnabled(e.target.checked)} className="accent-[#3f4a6b]" />
                <span className="text-xs text-[#252932]">HyDE</span>
              </label>
            </div>
          </section>

          {/* Generation config */}
          <section className="bg-white border border-[#e4e1da] rounded-xl p-5">
            <h2 className="font-semibold text-[#252932] mb-4 text-sm uppercase tracking-wide">Sinh thơ</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="r-genmodel" className="block text-xs font-medium text-[#252932] mb-1">Mô hình sinh</label>
                <select id="r-genmodel" value={genModel} onChange={(e) => setGenModel(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] cursor-pointer">
                  {GENERATION_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="r-temp" className="block text-xs font-medium text-[#252932] mb-1">Nhiệt độ: {temperature.toFixed(1)}</label>
                <input id="r-temp" type="range" min={0} max={1} step={0.1} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full accent-[#3f4a6b]" />
              </div>
              <div>
                <label htmlFor="r-tokens" className="block text-xs font-medium text-[#252932] mb-1">Max tokens: {maxTokens}</label>
                <input id="r-tokens" type="range" min={128} max={1024} step={64} value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} className="w-full accent-[#3f4a6b]" />
              </div>
            </div>
          </section>

          <Button onClick={handleRun} loading={running} size="lg" className="w-full">
            {running ? 'Đang chạy...' : 'Chạy thử nghiệm'}
          </Button>
        </aside>

        {/* Results area */}
        <div className="lg:col-span-3 space-y-5">
          {/* Tabs */}
          <div className="flex border-b border-[#e4e1da]" role="tablist" aria-label="Kết quả thử nghiệm">
            {(['query', 'retrieval', 'generation', 'metrics'] as ActiveTab[]).map((t) => {
              const labels: Record<ActiveTab, string> = { query: 'Truy vấn', retrieval: 'Truy xuất', generation: 'Sinh thơ', metrics: 'Chỉ số' }
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#596789] ${
                    tab === t ? 'border-[#3f4a6b] text-[#3f4a6b]' : 'border-transparent text-[#5f6673] hover:text-[#252932]'
                  }`}
                >
                  {labels[t]}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          {tab === 'query' && (
            <div className="bg-white border border-[#e4e1da] rounded-xl p-6" role="tabpanel" aria-label="Truy vấn">
              {!results ? (
                <div className="text-center py-16 text-[#7d8490]">
                  <p className="text-lg font-medium">Thiết lập cấu hình và chạy thử nghiệm đầu tiên.</p>
                  <p className="text-sm mt-2">Kết quả sẽ xuất hiện tại đây sau khi chạy.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="font-semibold text-[#252932]">Tóm tắt thử nghiệm</h2>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-[#f4f2ed] rounded-lg p-3">
                      <dt className="text-xs text-[#7d8490] mb-1">Phương pháp</dt>
                      <dd className="font-medium text-[#252932]">{retrievalMethod}</dd>
                    </div>
                    <div className="bg-[#f4f2ed] rounded-lg p-3">
                      <dt className="text-xs text-[#7d8490] mb-1">Mô hình sinh</dt>
                      <dd className="font-medium text-[#252932]">{genModel}</dd>
                    </div>
                    <div className="bg-[#f4f2ed] rounded-lg p-3">
                      <dt className="text-xs text-[#7d8490] mb-1">Top-K</dt>
                      <dd className="font-medium text-[#252932]">{topK}</dd>
                    </div>
                    <div className="bg-[#f4f2ed] rounded-lg p-3">
                      <dt className="text-xs text-[#7d8490] mb-1">Thời gian chạy</dt>
                      <dd className="font-mono font-medium text-[#252932]">{elapsed ? `${(elapsed / 1000).toFixed(2)}s` : '—'}</dd>
                    </div>
                  </dl>
                  {openingVerse && (
                    <div className="bg-[#fcf8f1] border border-[#e4e1da] rounded-lg p-4">
                      <p className="text-xs text-[#7d8490] mb-1">Câu thơ đã dùng</p>
                      <p className="font-serif text-[#292823] italic">{openingVerse}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'retrieval' && (
            <div role="tabpanel" aria-label="Kết quả truy xuất">
              {!results ? (
                <div className="bg-white border border-[#e4e1da] rounded-xl p-8 text-center text-[#7d8490]">
                  Chạy thử nghiệm để xem kết quả truy xuất.
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-[#5f6673]">
                    Tìm thấy <strong>{results.length}</strong> bài thơ với phương pháp <strong>{retrievalMethod}</strong>.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.map((source) => (
                      <SourceCard key={source.id} source={source} onViewDetail={setSelectedSource} showScores />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'generation' && (
            <div role="tabpanel" aria-label="Bài thơ được tạo">
              {generatedLines.length === 0 ? (
                <div className="bg-white border border-[#e4e1da] rounded-xl p-8 text-center text-[#7d8490]">
                  Chạy thử nghiệm để xem bài thơ được tạo.
                </div>
              ) : (
                <div className="bg-[#fffcf7] border border-[#e4e1da] rounded-xl p-8">
                  <div className="flex items-center justify-between mb-5">
                    <Badge variant="secondary">{POETRY_FORM_LABELS[poetryForm as PoetryForm] || 'Thơ tự do'}</Badge>
                    <span className="text-xs font-mono text-[#7d8490]">{genModel}</span>
                  </div>
                  <div className="max-w-lg">
                    {generatedLines.map((line, i) => (
                      <p key={i} className="text-[#292823] text-lg leading-[1.9]" style={{ fontFamily: "'Lora', serif" }}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#e4e1da]">
                    <h3 className="text-xs font-bold text-[#7d8490] uppercase tracking-wide mb-3">Prompt (mô phỏng)</h3>
                    <pre className="text-xs font-mono text-[#5f6673] bg-[#f4f2ed] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
{`[SYSTEM] Bạn là trợ lý sáng tác thơ tiếng Việt.
[CONTEXT] ${results?.slice(0, 2).map(s => s.excerpt).join('\n---\n') ?? '(Không có)'}
[USER] Hãy phát triển câu thơ sau thành bài ${POETRY_FORM_LABELS[poetryForm as PoetryForm] || 'thơ tự do'}:
"${openingVerse}"`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'metrics' && (
            <div role="tabpanel" aria-label="Chỉ số đánh giá">
              {!results ? (
                <div className="bg-white border border-[#e4e1da] rounded-xl p-8 text-center text-[#7d8490]">
                  Chạy thử nghiệm để xem chỉ số đánh giá.
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Retrieval metrics */}
                  <section className="bg-white border border-[#e4e1da] rounded-xl p-5">
                    <h2 className="font-semibold text-[#252932] mb-4">Chỉ số truy xuất</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Recall@5', value: '0.72', note: 'mô phỏng' },
                        { label: 'MRR', value: '0.68', note: 'mô phỏng' },
                        { label: 'MAP', value: '0.61', note: 'mô phỏng' },
                        { label: 'nDCG@5', value: '0.74', note: 'mô phỏng' },
                        { label: 'Gold Coverage@5', value: '0.80', note: 'mô phỏng' },
                      ].map((m) => (
                        <div key={m.label} className="bg-[#f4f2ed] rounded-lg p-3 text-center">
                          <div className="font-mono text-lg font-bold text-[#3f4a6b]">{m.value}</div>
                          <div className="text-xs text-[#252932] font-medium">{m.label}</div>
                          <div className="text-xs text-[#7d8490]">{m.note}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Generation metrics */}
                  <section className="bg-white border border-[#e4e1da] rounded-xl p-5">
                    <h2 className="font-semibold text-[#252932] mb-4">Chỉ số sinh thơ</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-[#e4e1da]">
                            <th className="text-left py-2 pr-4 text-xs font-semibold text-[#7d8490] uppercase">Chỉ số</th>
                            <th className="text-left py-2 pr-4 text-xs font-semibold text-[#7d8490] uppercase">Giá trị</th>
                            <th className="text-left py-2 text-xs font-semibold text-[#7d8490] uppercase">Loại</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e4e1da]">
                          {[
                            { name: 'RA (Response Accuracy)', value: 'N/A', type: 'Tự động' },
                            { name: 'RC (Response Continuity)', value: '0.65', type: 'Tự động' },
                            { name: 'PSES (Poetic Structure)', value: '0.71', type: 'Tự động' },
                            { name: 'LR (Lexical Richness)', value: '0.58', type: 'Tự động' },
                            { name: 'BLEU', value: '0.12', type: 'Tự động' },
                            { name: 'RR (Response Relevance)', value: 'Cần LLM', type: 'LLM' },
                            { name: 'CMS (Context Match)', value: 'Cần LLM', type: 'LLM' },
                          ].map((m) => (
                            <tr key={m.name}>
                              <td className="py-2 pr-4 text-[#252932] font-mono text-xs">{m.name}</td>
                              <td className="py-2 pr-4 text-[#3f4a6b] font-medium">{m.value}</td>
                              <td className="py-2">
                                <Badge variant={m.type === 'LLM' ? 'info' : 'outline'}>{m.type}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-xs text-[#7d8490]">* Các chỉ số mô phỏng. Giá trị thực tế phụ thuộc vào backend.</p>
                  </section>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Source detail drawer */}
      <SourceDetailDrawer
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
        onPrev={results && sourceIndex > 0 ? () => setSelectedSource(results[sourceIndex - 1]) : undefined}
        onNext={results && sourceIndex < results.length - 1 ? () => setSelectedSource(results[sourceIndex + 1]) : undefined}
        currentIndex={sourceIndex >= 0 ? sourceIndex : undefined}
        total={results?.length}
        showScores
      />
    </div>
  )
}
