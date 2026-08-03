import Badge from '../components/Badge'

const dataset = [
  { source: 'Facebook', count: 85378, label: 'bài thơ' },
  { source: 'Tkaraoke', count: 65697, label: 'bài thơ' },
  { source: 'Thi Viện', count: 36875, label: 'bài thơ' },
  { source: 'Lục Bát', count: 10648, label: 'bài thơ' },
]

const totalPoems = dataset.reduce((sum, d) => sum + d.count, 0)

const retrievalMethods = [
  { name: 'BM25', type: 'Từ khóa', desc: 'Tìm kiếm dựa trên tần suất từ và độ dài tài liệu.' },
  { name: 'Dense Retrieval', type: 'Vector', desc: 'Sử dụng embedding đa ngôn ngữ để tìm kiếm theo ngữ nghĩa.' },
  { name: 'Hybrid Retrieval', type: 'Kết hợp', desc: 'Kết hợp điểm BM25 và Dense với trọng số có thể điều chỉnh.' },
  { name: 'HyDE', type: 'Nâng cao', desc: 'Hypothetical Document Embedding — tạo tài liệu giả định trước khi tìm kiếm.' },
  { name: 'Metadata Filtering', type: 'Lọc', desc: 'Lọc tài liệu theo tác giả, thể thơ và thời kỳ trước khi xếp hạng.' },
]

const retrievalMetrics = [
  { name: 'Recall@K', desc: 'Tỷ lệ tài liệu liên quan được tìm thấy trong top-K.' },
  { name: 'Gold Coverage@K', desc: 'Tỷ lệ tài liệu vàng được bao phủ trong top-K kết quả.' },
  { name: 'MRR', desc: 'Mean Reciprocal Rank — đánh giá vị trí kết quả liên quan đầu tiên.' },
  { name: 'MAP', desc: 'Mean Average Precision — trung bình độ chính xác theo thứ hạng.' },
  { name: 'nDCG@K', desc: 'Normalized Discounted Cumulative Gain — đánh giá chất lượng xếp hạng.' },
]

const generationMetrics = [
  { abbr: 'RA', name: 'Response Accuracy', type: 'Tự động' },
  { abbr: 'RC', name: 'Response Continuity', type: 'Tự động' },
  { abbr: 'RR', name: 'Response Relevance', type: 'LLM' },
  { abbr: 'CIV', name: 'Context Information Volume', type: 'Tự động' },
  { abbr: 'CMS', name: 'Context Match Score', type: 'LLM' },
  { abbr: 'PSES', name: 'Poetic Structure Evaluation Score', type: 'Tự động' },
  { abbr: 'LR', name: 'Lexical Richness', type: 'Tự động' },
  { abbr: 'STCR', name: 'Sentiment Trajectory Change Ratio', type: 'Tự động' },
  { abbr: 'BLEU', name: 'BLEU Score', type: 'Tự động' },
  { abbr: 'ROUGE', name: 'ROUGE Score', type: 'Tự động' },
]

const techStack = [
  { name: 'ReactJS + TypeScript', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Vite', category: 'Frontend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'LangChain', category: 'RAG' },
  { name: 'ChromaDB / FAISS', category: 'Vector DB' },
  { name: 'Gemini 2.5 Flash', category: 'Mô hình sinh' },
  { name: 'multilingual-e5-large', category: 'Embedding' },
  { name: 'Vercel', category: 'Triển khai' },
  { name: 'Docker', category: 'Đóng gói' },
]

const teamMembers = [
  { name: 'Thành viên A', role: 'RAG Pipeline & Backend', initial: 'A' },
  { name: 'Thành viên B', role: 'Frontend & UI/UX', initial: 'B' },
  { name: 'Thành viên C', role: 'Data Collection & Preprocessing', initial: 'C' },
  { name: 'Thành viên D', role: 'Evaluation & Benchmarking', initial: 'D' },
]

export default function AboutProject() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#252932] py-16 md:py-20" aria-labelledby="about-heading">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Badge className="mb-5 !bg-[#3f4a6b] !text-[#d6b98c]">Dự án học thuật</Badge>
          <h1 id="about-heading" className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Dự án sinh thơ tiếng Việt bằng RAG
          </h1>
          <p className="text-[#a5aec7] text-lg leading-relaxed max-w-2xl mx-auto">
            Dự án nghiên cứu khả năng kết hợp truy xuất thông tin và mô hình ngôn ngữ để hỗ trợ sáng tác thơ tiếng Việt có định hướng về thể thơ, tác giả và thời kỳ.
          </p>
        </div>
      </section>

      {/* Problem & Objectives */}
      <section className="py-14 md:py-16" aria-labelledby="objectives-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 id="objectives-heading" className="text-2xl font-bold text-[#252932] mb-4">Vấn đề đặt ra</h2>
              <ul className="space-y-3">
                {[
                  'Người dùng có câu thơ mở đầu nhưng khó hoàn thiện bài thơ.',
                  'Mô hình ngôn ngữ tạo thơ thiếu tham chiếu văn học rõ ràng.',
                  'Không có công cụ hỗ trợ nhiều thể thơ tiếng Việt đồng thời.',
                  'Cần giao diện để đánh giá và so sánh các phương pháp RAG cho thi ca.',
                ].map((p) => (
                  <li key={p} className="flex gap-3 text-[#5f6673] text-sm">
                    <span className="flex-shrink-0 text-[#3f4a6b] font-bold">→</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#252932] mb-4">Mục tiêu nghiên cứu</h2>
              <ul className="space-y-3">
                {[
                  'Xây dựng hệ thống RAG cho sinh thơ tiếng Việt.',
                  'So sánh các phương pháp truy xuất: BM25, Dense, Hybrid, HyDE.',
                  'Đánh giá chất lượng thơ sinh ra theo nhiều tiêu chí.',
                  'Cung cấp giao diện minh bạch, thân thiện với người dùng.',
                ].map((o) => (
                  <li key={o} className="flex gap-3 text-[#5f6673] text-sm">
                    <span className="flex-shrink-0 text-[#4f7a68] font-bold">✓</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset */}
      <section className="py-14 md:py-16 bg-[#f4f2ed]" aria-labelledby="dataset-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 id="dataset-heading" className="text-2xl font-bold text-[#252932] mb-2">Kho dữ liệu thi ca</h2>
          <p className="text-[#5f6673] mb-8 max-w-xl">
            Dữ liệu được thu thập và làm sạch từ nhiều nguồn thơ tiếng Việt công khai.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {dataset.map((item) => (
              <div key={item.source} className="bg-white rounded-xl border border-[#e4e1da] p-5 text-center">
                <div className="text-2xl font-bold text-[#3f4a6b]">{item.count.toLocaleString('vi-VN')}</div>
                <div className="text-xs text-[#7d8490] mt-0.5">{item.label}</div>
                <div className="text-sm font-semibold text-[#252932] mt-1">{item.source}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-[#e4e1da] p-5">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <dt className="text-xs text-[#7d8490] uppercase tracking-wide mb-1">Tổng số bài thơ</dt>
                <dd className="text-xl font-bold text-[#252932]">{totalPoems.toLocaleString('vi-VN')}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#7d8490] uppercase tracking-wide mb-1">Số từ trung bình</dt>
                <dd className="text-xl font-bold text-[#252932]">~139.6</dd>
              </div>
              <div>
                <dt className="text-xs text-[#7d8490] uppercase tracking-wide mb-1">Số dòng trung bình</dt>
                <dd className="text-xl font-bold text-[#252932]">~24.5</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-[#7d8490]">
              * Số liệu dựa trên tập dữ liệu đã qua xử lý. Số liệu chính xác sẽ được cập nhật theo phiên bản dữ liệu cuối cùng.
            </p>
          </div>
        </div>
      </section>

      {/* Retrieval methods */}
      <section className="py-14 md:py-16" aria-labelledby="methods-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 id="methods-heading" className="text-2xl font-bold text-[#252932] mb-8">Phương pháp truy xuất</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {retrievalMethods.map((m) => (
              <div key={m.name} className="bg-white border border-[#e4e1da] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">{m.type}</Badge>
                  <span className="font-semibold text-[#252932] text-sm">{m.name}</span>
                </div>
                <p className="text-xs text-[#5f6673] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation */}
      <section className="py-14 md:py-16 bg-[#f4f2ed]" aria-labelledby="eval-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 id="eval-heading" className="text-2xl font-bold text-[#252932] mb-8">Phương pháp đánh giá</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#252932] mb-4 text-lg">Đánh giá truy xuất</h3>
              <div className="space-y-3">
                {retrievalMetrics.map((m) => (
                  <div key={m.abbr} className="flex gap-3">
                    <span className="flex-shrink-0 font-mono text-xs bg-[#e4e7ef] text-[#3f4a6b] px-2 py-0.5 rounded font-medium h-fit mt-0.5">{m.abbr}</span>
                    <div>
                      <div className="text-sm font-medium text-[#252932]">{m.name}</div>
                      <div className="text-xs text-[#5f6673]">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#252932] mb-4 text-lg">Đánh giá sinh thơ</h3>
              <div className="space-y-2">
                {generationMetrics.map((m) => (
                  <div key={m.abbr} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-[#e4e1da]">
                    <span className="font-mono text-xs text-[#3f4a6b] font-medium w-12 flex-shrink-0">{m.abbr}</span>
                    <span className="text-sm text-[#252932] flex-1">{m.name}</span>
                    <Badge variant={m.type === 'LLM' ? 'info' : 'outline'}>{m.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-14 md:py-16" aria-labelledby="stack-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 id="stack-heading" className="text-2xl font-bold text-[#252932] mb-8">Công nghệ sử dụng</h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map((t) => (
              <div key={t.name} className="flex items-center gap-2 bg-white border border-[#e4e1da] rounded-full px-4 py-2">
                <Badge variant="secondary">{t.category}</Badge>
                <span className="text-sm font-medium text-[#252932]">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 md:py-16 bg-[#fcf8f1] border-t border-[#e4e1da]" aria-labelledby="team-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 id="team-heading" className="text-2xl font-bold text-[#252932] mb-8">Nhóm nghiên cứu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-[#e4e1da] p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#3f4a6b] text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {member.initial}
                </div>
                <div className="font-semibold text-[#252932] text-sm">{member.name}</div>
                <div className="text-xs text-[#5f6673] mt-1 leading-relaxed">{member.role}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-[#7d8490] text-center">
            Thông tin thành viên sẽ được cập nhật sau khi nhóm thống nhất công bố.
          </p>
        </div>
      </section>
    </div>
  )
}
