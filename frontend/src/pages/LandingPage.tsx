import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { POETRY_FORM_LABELS, EXAMPLE_PROMPTS, type PoetryForm } from "../types";

const poetryForms = Object.entries(POETRY_FORM_LABELS) as [
  PoetryForm,
  string,
][];

const benefits = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Khơi nguồn cảm hứng",
    text: "Phát triển một ý thơ ngắn thành bài thơ hoàn chỉnh với ngữ nghĩa mạch lạc.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Tôn trọng thể thơ",
    text: "Hỗ trợ lục bát, năm chữ, bảy chữ, thơ tự do và nhiều thể thơ khác.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: "Tham khảo minh bạch",
    text: "Xem các bài thơ được hệ thống dùng làm ngữ cảnh sáng tác — không có hộp đen.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Nhập câu thơ",
    desc: "Bạn viết một câu thơ mở đầu và chọn thể thơ.",
  },
  {
    step: "02",
    title: "Truy xuất thi ca",
    desc: "Hệ thống tìm các bài thơ liên quan trong kho dữ liệu tiếng Việt.",
  },
  {
    step: "03",
    title: "Lựa chọn ngữ cảnh",
    desc: "Những tác phẩm phù hợp nhất được chọn làm tài liệu tham khảo.",
  },
  {
    step: "04",
    title: "Sáng tác bài thơ",
    desc: "Mô hình tạo bài thơ mới kết hợp yêu cầu và ngữ cảnh đã chọn.",
  },
];

const examplePoem = {
  title: "Trăng khuya",
  form: "Lục bát",
  lines: [
    "Trăng nghiêng qua mái hiên nhà,",
    "Gió đưa cành trúc la đà bên sông.",
    "Bóng trăng in xuống dòng trong,",
    "Lòng ta cũng nhẹ như bông mây chiều.",
  ],
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [openingVerse, setOpeningVerse] = useState("");
  const [selectedForm, setSelectedForm] = useState<PoetryForm | "">("");
  const [errors, setErrors] = useState<{ verse?: string; form?: string }>({});

  function handleStart() {
    const newErrors: typeof errors = {};
    if (!openingVerse.trim()) newErrors.verse = "Vui lòng nhập câu thơ mở đầu.";
    if (!selectedForm) newErrors.form = "Vui lòng chọn thể thơ.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    navigate("/sang-tac", {
      state: { openingVerse: openingVerse.trim(), poetryForm: selectedForm },
    });
  }

  function handleExampleClick(example: string) {
    setOpeningVerse(example);
    setErrors((prev) => ({ ...prev, verse: undefined }));
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="bg-[#fcf8f1] border-b border-[#e4e1da]"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative element */}
            <div className="flex justify-center mb-6" aria-hidden="true">
              <div className="w-12 h-0.5 bg-[#d6b98c]" />
              <div className="mx-3 text-[#d6b98c] text-lg font-serif">詩</div>
              <div className="w-12 h-0.5 bg-[#d6b98c]" />
            </div>

            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#252932] leading-tight tracking-tight mb-5"
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Biến một câu thơ
              <br />
              <span className="text-[#3f4a6b]">
                thành một bài thơ hoàn chỉnh.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#5f6673] leading-relaxed max-w-2xl mx-auto mb-10">
              Nhập câu thơ mở đầu, chọn thể thơ và phong cách. Hệ thống sẽ tìm
              những tác phẩm liên quan để hỗ trợ sáng tác một bài thơ tiếng Việt
              mới.
            </p>

            {/* Quick start */}
            <div className="bg-white rounded-2xl border border-[#e4e1da] shadow-sm p-6 max-w-2xl mx-auto text-left">
              <div className="mb-4">
                <label
                  htmlFor="opening-verse"
                  className="block text-sm font-semibold text-[#252932] mb-2"
                >
                  Câu thơ mở đầu
                </label>
                <textarea
                  id="opening-verse"
                  rows={2}
                  placeholder="Ví dụ: Trăng nghiêng qua mái hiên nhà..."
                  value={openingVerse}
                  onChange={(e) => {
                    setOpeningVerse(e.target.value);
                    if (errors.verse)
                      setErrors((prev) => ({ ...prev, verse: undefined }));
                  }}
                  aria-describedby={errors.verse ? "verse-error" : undefined}
                  aria-invalid={!!errors.verse}
                  className={`w-full px-4 py-3 rounded-lg border text-base text-[#252932] placeholder:text-[#a8adb5] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] transition-colors ${
                    errors.verse
                      ? "border-[#b54747] bg-[#fceeee]"
                      : "border-[#d5d2ca] focus:border-[#7c89aa]"
                  }`}
                  style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                />
                {errors.verse && (
                  <p
                    id="verse-error"
                    role="alert"
                    className="mt-1.5 text-sm text-[#b54747]"
                  >
                    {errors.verse}
                  </p>
                )}

                {/* Example prompts */}
                <div
                  className="flex flex-wrap gap-2 mt-2"
                  role="group"
                  aria-label="Gợi ý câu thơ"
                >
                  {EXAMPLE_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleExampleClick(prompt)}
                      className="text-xs px-2.5 py-1 rounded-full border border-[#e4e1da] text-[#5f6673] hover:border-[#d6b98c] hover:bg-[#fcf8f1] hover:text-[#795936] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="poetry-form"
                  className="block text-sm font-semibold text-[#252932] mb-2"
                >
                  Thể thơ
                </label>
                <select
                  id="poetry-form"
                  value={selectedForm}
                  onChange={(e) => {
                    setSelectedForm(e.target.value as PoetryForm);
                    if (errors.form)
                      setErrors((prev) => ({ ...prev, form: undefined }));
                  }}
                  aria-describedby={errors.form ? "form-error" : undefined}
                  aria-invalid={!!errors.form}
                  className={`w-full px-4 py-3 rounded-lg border text-base text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] transition-colors cursor-pointer ${
                    errors.form ? "border-[#b54747]" : "border-[#d5d2ca]"
                  }`}
                >
                  <option value="">Chọn thể thơ</option>
                  {poetryForms.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.form && (
                  <p
                    id="form-error"
                    role="alert"
                    className="mt-1.5 text-sm text-[#b54747]"
                  >
                    {errors.form}
                  </p>
                )}
              </div>

              <Button
                onClick={handleStart}
                size="lg"
                className="w-full"
                aria-label="Bắt đầu sáng tác bài thơ"
              >
                Bắt đầu sáng tác
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <h2
            id="benefits-heading"
            className="text-2xl md:text-3xl font-bold text-[#252932] text-center mb-3"
          >
            Tại sao dùng Thi Vận AI?
          </h2>
          <p className="text-[#5f6673] text-center mb-12 max-w-xl mx-auto">
            Không chỉ là trợ lý AI thông thường — hệ thống kết hợp kho thi ca
            tiếng Việt với công nghệ truy xuất thông minh.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="bg-white rounded-xl border border-[#e4e1da] p-6 hover:border-[#d6b98c] hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#f2f4f8] text-[#3f4a6b] flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-[#252932] text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[#5f6673] text-sm leading-relaxed">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section
        className="py-16 md:py-20 bg-[#f4f2ed]"
        aria-labelledby="process-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2
              id="process-heading"
              className="text-2xl md:text-3xl font-bold text-[#252932] mb-3"
            >
              Hệ thống hoạt động như thế nào?
            </h2>
            <p className="text-[#5f6673] max-w-xl mx-auto">
              Ứng dụng không gửi yêu cầu trực tiếp đến mô hình ngôn ngữ. Trước
              tiên, hệ thống tìm bài thơ liên quan và dùng chúng làm ngữ cảnh.
            </p>
          </div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-[#d5d2ca]"
              aria-hidden="true"
            />

            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step) => (
                <li
                  key={step.step}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-[#d6b98c] flex items-center justify-center mb-4 z-10">
                    <span className="font-bold text-[#3f4a6b] text-lg font-mono">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#252932] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#5f6673] leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="text-center mt-10">
            <Button
              variant="secondary"
              onClick={() => navigate("/cach-hoat-dong")}
            >
              Tìm hiểu chi tiết →
            </Button>
          </div>
        </div>
      </section>

      {/* Example poem */}
      <section className="py-16 md:py-20" aria-labelledby="example-heading">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                id="example-heading"
                className="text-2xl md:text-3xl font-bold text-[#252932] mb-4"
              >
                Bài thơ được tạo ra trông như thế nào?
              </h2>
              <p className="text-[#5f6673] leading-relaxed mb-6">
                Từ một câu thơ mở đầu đơn giản, hệ thống phát triển thành bài
                thơ hoàn chỉnh, tuân theo thể thơ đã chọn và sử dụng các tác
                phẩm tiếng Việt làm tham chiếu.
              </p>
              <div className="bg-[#f4f2ed] rounded-lg p-4 text-sm">
                <p className="text-[#7d8490] font-medium mb-2">
                  Câu thơ mở đầu:
                </p>
                <p className="text-[#252932] italic font-serif">
                  "Trăng nghiêng qua mái hiên nhà"
                </p>
              </div>
            </div>

            <div className="bg-[#fffcf7] border border-[#e4e1da] rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <Badge variant="secondary">Lục bát</Badge>
                <span className="text-xs text-[#7d8490]">Ví dụ minh họa</span>
              </div>
              <h3
                className="text-2xl font-semibold text-[#292823] mb-5 text-center"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {examplePoem.title}
              </h3>
              <div className="space-y-1">
                {examplePoem.lines.map((line, i) => (
                  <p
                    key={i}
                    className="text-[#292823] leading-[1.9] text-lg"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Poetry forms */}
      <section
        className="py-16 md:py-20 bg-[#fcf8f1] border-t border-[#e4e1da]"
        aria-labelledby="forms-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <h2
            id="forms-heading"
            className="text-2xl font-bold text-[#252932] text-center mb-8"
          >
            Thể thơ được hỗ trợ
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {poetryForms.map(([, label]) => (
              <span
                key={label}
                className="px-4 py-2 rounded-full border border-[#d5d2ca] bg-white text-sm font-medium text-[#5f6673] hover:border-[#d6b98c] hover:bg-[#fef9f0] transition-colors"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dataset info */}
      <section className="py-16 md:py-20" aria-labelledby="dataset-heading">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="bg-[#f2f4f8] rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2
                  id="dataset-heading"
                  className="text-2xl font-bold text-[#252932] mb-3"
                >
                  Kho dữ liệu thi ca tiếng Việt
                </h2>
                <p className="text-[#5f6673] leading-relaxed mb-5">
                  Hệ thống dựa trên kho thơ tiếng Việt được thu thập từ nhiều
                  nguồn uy tín, bao gồm thơ cổ điển và hiện đại.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/ve-du-an")}
                >
                  Xem thông tin dự án →
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { source: "Facebook", count: "85,378", label: "bài thơ" },
                  { source: "Tkaraoke", count: "65,697", label: "bài thơ" },
                  { source: "Thi Viện", count: "36,875", label: "bài thơ" },
                  { source: "Lục Bát", count: "10,648", label: "bài thơ" },
                ].map((item) => (
                  <div
                    key={item.source}
                    className="bg-white rounded-xl border border-[#e4e1da] p-4 text-center"
                  >
                    <div className="text-xl font-bold text-[#3f4a6b]">
                      {item.count}
                    </div>
                    <div className="text-xs text-[#7d8490] mt-0.5">
                      {item.label}
                    </div>
                    <div className="text-xs font-medium text-[#5f6673] mt-1">
                      {item.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 md:py-20 bg-[#3f4a6b]"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center">
          <div className="flex justify-center mb-4" aria-hidden="true">
            <span className="text-[#d6b98c] text-3xl font-serif">詩</span>
          </div>
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Bắt đầu sáng tác hôm nay
          </h2>
          <p className="text-[#a5aec7] text-lg mb-8 max-w-lg mx-auto">
            Nhập một câu thơ của bạn và để hệ thống phát triển thành tác phẩm
            hoàn chỉnh.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/sang-tac")}
            className="!bg-[#d6b98c] !text-[#252932] hover:!bg-[#be9863] active:!bg-[#9d7747]"
          >
            Bắt đầu sáng tác miễn phí
          </Button>
        </div>
      </section>
    </div>
  );
}
