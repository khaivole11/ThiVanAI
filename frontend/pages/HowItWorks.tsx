import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Badge from '../components/Badge'

const steps = [
  {
    num: '01',
    title: 'Nhập yêu cầu',
    desc: 'Bạn nhập một câu thơ mở đầu và chọn các yêu cầu như thể thơ, tác giả hoặc thời kỳ.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Xử lý truy vấn',
    desc: 'Hệ thống phân tích nội dung và chuẩn hóa các tiêu chí tìm kiếm để chuẩn bị truy xuất.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Truy xuất thi ca',
    desc: 'Hệ thống tìm các bài thơ phù hợp bằng truy xuất từ khóa (BM25), vector hoặc phương pháp kết hợp (hybrid).',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Lựa chọn ngữ cảnh',
    desc: 'Các bài thơ phù hợp nhất được chọn và xếp hạng để trở thành ngữ cảnh cho bước sáng tác.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Sáng tác bài thơ',
    desc: 'Mô hình ngôn ngữ kết hợp yêu cầu của bạn với ngữ cảnh thi ca để tạo bài thơ mới.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Kết quả và minh bạch',
    desc: 'Bạn nhận được bài thơ cùng danh sách các tác phẩm được tham khảo, giải thích tại sao mỗi bài được chọn.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
]

const retrievalMethods = [
  {
    name: 'BM25',
    badge: 'Từ khóa',
    desc: 'Tìm kiếm dựa trên tần suất từ khóa. Hiệu quả với các truy vấn có từ đặc trưng rõ ràng.',
    variant: 'secondary' as const,
  },
  {
    name: 'Dense Retrieval',
    badge: 'Vector',
    desc: 'Sử dụng embedding để tìm bài thơ có ngữ nghĩa tương đồng, kể cả khi không trùng từ khóa.',
    variant: 'accent' as const,
  },
  {
    name: 'Hybrid',
    badge: 'Kết hợp',
    desc: 'Kết hợp BM25 và Dense để tận dụng ưu điểm của cả hai phương pháp.',
    variant: 'default' as const,
  },
  {
    name: 'HyDE',
    badge: 'Nâng cao',
    desc: 'Tạo văn bản giả định trước khi tìm kiếm để cải thiện khả năng truy xuất ngữ nghĩa.',
    variant: 'info' as const,
  },
]

const faqs = [
  {
    q: 'Bài thơ có phải là bản sao của tác phẩm trong kho dữ liệu không?',
    a: 'Không. Các bài thơ trong kho dữ liệu chỉ được dùng làm ngữ cảnh tham khảo cho mô hình. Bài thơ được tạo là hoàn toàn mới dựa trên câu mở đầu của bạn.',
  },
  {
    q: 'Hệ thống có thể mô phỏng phong cách của một tác giả cụ thể không?',
    a: 'Hệ thống có thể tìm các bài thơ của tác giả đó để làm ngữ cảnh, từ đó ảnh hưởng đến phong cách. Tuy nhiên, đây là mô phỏng gần đúng, không phải tái hiện chính xác phong cách.',
  },
  {
    q: 'Thể thơ có được đảm bảo tuân thủ chính xác không?',
    a: 'Hệ thống cố gắng tuân thủ cấu trúc thể thơ đã chọn, nhưng không thể đảm bảo 100% vì mô hình ngôn ngữ hoạt động theo xác suất. Kết quả nên được kiểm tra bởi người dùng.',
  },
  {
    q: 'Top-K là gì?',
    a: 'Top-K là số lượng bài thơ được truy xuất để làm ngữ cảnh. Giá trị cao hơn cho phép mô hình tham khảo nhiều tác phẩm hơn, nhưng có thể làm giảm tính nhất quán.',
  },
  {
    q: 'Logic OR trong bộ lọc nghĩa là gì?',
    a: 'Khi bạn chọn nhiều bộ lọc (tác giả + thời kỳ + thể thơ), hệ thống sẽ tìm bài thơ phù hợp với ÍT NHẤT một tiêu chí, không phải tất cả. Điều này giúp tăng khả năng tìm được tài liệu tham khảo phù hợp.',
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fcf8f1] border-b border-[#e4e1da] py-16 md:py-20" aria-labelledby="hiw-heading">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <Badge variant="secondary" className="mb-5">Về hệ thống</Badge>
          <h1 id="hiw-heading" className="text-4xl md:text-5xl font-bold text-[#252932] mb-5" style={{ letterSpacing: '-0.02em' }}>
            Hệ thống tạo thơ<br />như thế nào?
          </h1>
          <p className="text-lg text-[#5f6673] leading-relaxed">
            Ứng dụng không chỉ gửi yêu cầu trực tiếp đến mô hình ngôn ngữ. Trước tiên, hệ thống tìm các bài thơ liên quan trong kho dữ liệu và sử dụng chúng làm ngữ cảnh sáng tác.
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-16 md:py-20" aria-labelledby="pipeline-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 id="pipeline-heading" className="text-2xl md:text-3xl font-bold text-[#252932] text-center mb-12">
            Quy trình RAG từng bước
          </h2>
          <ol className="space-y-6">
            {steps.map((step, i) => (
              <li key={step.num} className="flex gap-5 items-start group">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#3f4a6b] text-[#d6b98c] flex items-center justify-center">
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 h-8 bg-[#e4e1da] mt-2" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xs font-bold text-[#7d8490] font-mono">{step.num}</span>
                    <h3 className="font-semibold text-[#252932] text-lg">{step.title}</h3>
                  </div>
                  <p className="text-[#5f6673] leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Retrieval methods */}
      <section className="py-16 md:py-20 bg-[#f4f2ed]" aria-labelledby="retrieval-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 id="retrieval-heading" className="text-2xl md:text-3xl font-bold text-[#252932] text-center mb-4">
            Phương pháp truy xuất
          </h2>
          <p className="text-center text-[#5f6673] mb-10 max-w-xl mx-auto">
            Dự án benchmarks nhiều phương pháp truy xuất để tìm ra cách hiệu quả nhất cho thi ca tiếng Việt.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {retrievalMethods.map((method) => (
              <div key={method.name} className="bg-white rounded-xl border border-[#e4e1da] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant={method.variant}>{method.badge}</Badge>
                  <h3 className="font-semibold text-[#252932]">{method.name}</h3>
                </div>
                <p className="text-sm text-[#5f6673] leading-relaxed">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example walkthrough */}
      <section className="py-16 md:py-20" aria-labelledby="example-heading">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 id="example-heading" className="text-2xl md:text-3xl font-bold text-[#252932] text-center mb-12">
            Ví dụ minh họa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f2f4f8] rounded-xl p-5 border border-[#d5d2ca]">
              <p className="text-xs font-bold text-[#7d8490] uppercase tracking-wide mb-3">Yêu cầu người dùng</p>
              <p className="text-sm text-[#252932] font-medium mb-1">Câu thơ mở đầu:</p>
              <p className="text-base italic font-serif text-[#3f4a6b] mb-3">"Trăng nghiêng qua mái hiên nhà"</p>
              <div className="flex gap-2">
                <Badge variant="secondary">Lục bát</Badge>
                <Badge variant="outline">Hiện đại</Badge>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#e4e1da]">
              <p className="text-xs font-bold text-[#7d8490] uppercase tracking-wide mb-3">Nguồn được truy xuất</p>
              <div className="space-y-3">
                {['Đoạn trường tân thanh (Nguyễn Du)', 'Tự tình II (Hồ Xuân Hương)', 'Câu cá mùa thu (Nguyễn Khuyến)'].map((s, i) => (
                  <div key={s} className="flex gap-2 items-start">
                    <span className="text-xs text-[#7d8490] font-mono flex-shrink-0">#{i + 1}</span>
                    <span className="text-sm text-[#252932]">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fffcf7] rounded-xl p-5 border border-[#d6b98c]">
              <p className="text-xs font-bold text-[#7d8490] uppercase tracking-wide mb-3">Bài thơ được tạo</p>
              <p className="font-serif text-[#292823] text-sm leading-[1.9]">
                Trăng nghiêng qua mái hiên nhà,<br />
                Gió đưa cành trúc la đà bên sông.<br />
                Bóng trăng in xuống dòng trong,<br />
                Lòng ta cũng nhẹ như bông mây chiều.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-16 md:py-20 bg-[#fcf8f1] border-t border-[#e4e1da]" aria-labelledby="limits-heading">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h2 id="limits-heading" className="text-2xl font-bold text-[#252932] mb-6">Giới hạn và lưu ý</h2>
          <ul className="space-y-3">
            {[
              'Bài thơ được tạo có thể chưa tuân thủ hoàn toàn tất cả quy tắc thể thơ.',
              'Mô phỏng phong cách tác giả là tương đối, không đảm bảo chính xác.',
              'Nguồn tham khảo không phải lúc nào cũng có mức độ liên quan đồng đều.',
              'Metadata trong kho dữ liệu có thể chứa thông tin thiếu hoặc không nhất quán.',
              'Nội dung được tạo nên được người dùng xem xét trước khi sử dụng.',
              'Hệ thống không khẳng định bài thơ được tạo là tác phẩm của nhà thơ thực.',
            ].map((limit) => (
              <li key={limit} className="flex gap-3 text-[#5f6673] text-sm">
                <span className="flex-shrink-0 text-[#a36a22] font-bold">⚠</span>
                {limit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h2 id="faq-heading" className="text-2xl font-bold text-[#252932] mb-8">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-[#e4e1da] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#596789]"
                >
                  <span className="font-medium text-[#252932] text-sm pr-4">{faq.q}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`flex-shrink-0 transition-transform text-[#7d8490] ${openFaq === i ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-[#5f6673] leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 border-t border-[#e4e1da] text-center">
        <p className="text-[#5f6673] mb-4">Sẵn sàng thử nghiệm?</p>
        <Button size="lg" onClick={() => navigate('/sang-tac')}>Thử sáng tác một bài thơ →</Button>
      </section>
    </div>
  )
}
