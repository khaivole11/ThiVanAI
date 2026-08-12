import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";
import {
  POETRY_FORM_LABELS,
  POETRY_FORM_DESCRIPTIONS,
  PERIOD_LABELS,
  EXAMPLE_PROMPTS,
  EXAMPLE_AUTHORS,
  type PoetryForm,
  type LiteraryPeriod,
  type GenerationRequest,
} from "../types";
import { simulateGeneration, savePoem } from "../store";

type Step =
  | "idle"
  | "analyzing"
  | "retrieving"
  | "selecting"
  | "generating"
  | "complete"
  | "error";

const progressSteps: { key: Step; label: string }[] = [
  { key: "analyzing", label: "Đang phân tích yêu cầu" },
  { key: "retrieving", label: "Đang tìm bài thơ liên quan" },
  { key: "selecting", label: "Đang lựa chọn ngữ cảnh" },
  { key: "generating", label: "Đang sáng tác bài thơ" },
];

const CHAR_SOFT_LIMIT = 150;
const CHAR_WARN_LIMIT = 120;

export default function PoetryGenerator() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as Partial<GenerationRequest> | null;

  const [openingVerse, setOpeningVerse] = useState(
    locationState?.openingVerse ?? "",
  );
  const [poetryForm, setPoetryForm] = useState<PoetryForm | "">(
    locationState?.poetryForm ?? "",
  );
  const [authorStyle, setAuthorStyle] = useState(
    locationState?.authorStyle ?? "",
  );
  const [period, setPeriod] = useState<LiteraryPeriod>(
    locationState?.period ?? "",
  );
  const [topK, setTopK] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [authorSuggestions, setAuthorSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [step, setStep] = useState<Step>("idle");
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [errors, setErrors] = useState<{ verse?: string; form?: string }>({});
  const [generationError, setGenerationError] = useState("");

  const authorRef = useRef<HTMLInputElement>(null);

  // Author autocomplete
  useEffect(() => {
    if (authorStyle.length < 2) {
      setAuthorSuggestions([]);
      return;
    }
    const filtered = EXAMPLE_AUTHORS.filter((a) =>
      a.toLowerCase().includes(authorStyle.toLowerCase()),
    );
    setAuthorSuggestions(filtered);
  }, [authorStyle]);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!openingVerse.trim()) newErrors.verse = "Vui lòng nhập câu thơ mở đầu.";
    if (!poetryForm) newErrors.form = "Vui lòng chọn thể thơ.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleGenerate() {
    if (!validate()) return;
    setGenerationError("");
    setStep("analyzing");
    setCurrentStepIdx(0);

    try {
      const request: GenerationRequest = {
        openingVerse: openingVerse.trim(),
        poetryForm: poetryForm as PoetryForm,
        authorStyle,
        period,
        topK,
      };

      const poem = await simulateGeneration(request, (status) => {
        const idx = progressSteps.findIndex((s) => s.key === status);
        setCurrentStepIdx(idx);
        setStep(status as Step);
      });

      savePoem(poem);
      setStep("complete");
      navigate(`/ket-qua/${poem.id}`);
    } catch {
      setStep("error");
      setGenerationError(
        "Không thể gửi yêu cầu tạo thơ. Vui lòng kiểm tra kết nối và thử lại.",
      );
    }
  }

  function handleReset() {
    setOpeningVerse("");
    setPoetryForm("");
    setAuthorStyle("");
    setPeriod("");
    setTopK(5);
    setErrors({});
    setStep("idle");
    setGenerationError("");
  }

  const isGenerating =
    step !== "idle" && step !== "complete" && step !== "error";
  const charCount = openingVerse.length;

  if (isGenerating) {
    return (
      <GenerationProgress
        currentStepIdx={currentStepIdx}
        openingVerse={openingVerse}
        poetryForm={poetryForm as PoetryForm}
        onCancel={() => {
          setStep("idle");
          setCurrentStepIdx(-1);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10">
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#252932] mb-2">
          Sáng tác bài thơ mới
        </h1>
        <p className="text-[#5f6673]">
          Bắt đầu bằng một câu thơ của bạn, sau đó chọn thể thơ và phong cách
          phù hợp.
        </p>
      </header>

      {generationError && (
        <div
          role="alert"
          className="mb-6 bg-[#fceeee] border border-[#edb8b8] text-[#8e3030] rounded-lg px-4 py-3 text-sm flex items-start gap-3"
        >
          <span className="font-bold flex-shrink-0">✕</span>
          <div>
            <p className="font-medium">{generationError}</p>
            <button
              onClick={handleGenerate}
              className="mt-2 text-[#8e3030] underline hover:no-underline text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b54747] rounded"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#e4e1da] p-6 space-y-6">
            {/* Opening verse */}
            <fieldset>
              <legend className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-[#252932]">
                  Câu thơ mở đầu
                </span>
                <Badge variant="error">Bắt buộc</Badge>
              </legend>
              <textarea
                id="opening-verse"
                rows={4}
                value={openingVerse}
                onChange={(e) => {
                  setOpeningVerse(e.target.value);
                  if (errors.verse)
                    setErrors((prev) => ({ ...prev, verse: undefined }));
                }}
                placeholder="Nhập một câu thơ mới mà bạn muốn phát triển..."
                aria-describedby="verse-help verse-error verse-count"
                aria-invalid={!!errors.verse}
                className={`w-full px-4 py-3 rounded-lg border text-base text-[#252932] placeholder:text-[#a8adb5] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] transition-colors ${
                  errors.verse
                    ? "border-[#b54747] bg-[#fceeee]"
                    : charCount > CHAR_WARN_LIMIT
                      ? "border-[#a36a22]"
                      : "border-[#d5d2ca] focus:border-[#7c89aa]"
                }`}
                style={{ fontFamily: "'Lora', serif" }}
                maxLength={CHAR_SOFT_LIMIT}
              />
              <div className="flex justify-between mt-1.5">
                <span id="verse-help" className="text-xs text-[#7d8490]">
                  Câu thơ này sẽ được giữ làm điểm khởi đầu.
                </span>
                <span
                  id="verse-count"
                  className={`text-xs tabular-nums ${charCount > CHAR_WARN_LIMIT ? "text-[#a36a22] font-medium" : "text-[#7d8490]"}`}
                  aria-live="polite"
                >
                  {charCount}/{CHAR_SOFT_LIMIT}
                </span>
              </div>
              {errors.verse && (
                <p
                  id="verse-error"
                  role="alert"
                  className="mt-1 text-sm text-[#b54747]"
                >
                  {errors.verse}
                </p>
              )}

              {/* Example chips */}
              <div className="mt-3">
                <p className="text-xs text-[#7d8490] mb-2">
                  Thử câu thơ gợi ý:
                </p>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="group"
                  aria-label="Câu thơ gợi ý"
                >
                  {EXAMPLE_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setOpeningVerse(p);
                        setErrors((prev) => ({ ...prev, verse: undefined }));
                      }}
                      className="text-xs px-2 py-1 rounded border border-[#e4e1da] text-[#5f6673] hover:border-[#d6b98c] hover:bg-[#fcf8f1] hover:text-[#795936] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            {/* Poetry form */}
            <div>
              <label
                htmlFor="poetry-form"
                className="flex items-center gap-2 mb-2"
              >
                <span className="text-sm font-semibold text-[#252932]">
                  Thể thơ
                </span>
                <Badge variant="error">Bắt buộc</Badge>
              </label>
              <select
                id="poetry-form"
                value={poetryForm}
                onChange={(e) => {
                  setPoetryForm(e.target.value as PoetryForm);
                  if (errors.form)
                    setErrors((prev) => ({ ...prev, form: undefined }));
                }}
                aria-describedby="form-help form-error"
                aria-invalid={!!errors.form}
                className={`w-full px-4 py-3 rounded-lg border text-base text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] transition-colors cursor-pointer ${
                  errors.form ? "border-[#b54747]" : "border-[#d5d2ca]"
                }`}
              >
                <option value="">Chọn thể thơ</option>
                {(
                  Object.entries(POETRY_FORM_LABELS) as [PoetryForm, string][]
                ).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              {poetryForm && (
                <p id="form-help" className="mt-1.5 text-xs text-[#5f6673]">
                  {POETRY_FORM_DESCRIPTIONS[poetryForm as PoetryForm]}
                </p>
              )}
              {errors.form && (
                <p
                  id="form-error"
                  role="alert"
                  className="mt-1 text-sm text-[#b54747]"
                >
                  {errors.form}
                </p>
              )}
            </div>

            {/* Optional fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-[#e4e1da]" />
                <span className="text-xs text-[#7d8490] font-medium">
                  Tùy chọn
                </span>
                <div className="flex-1 h-px bg-[#e4e1da]" />
              </div>

              {/* Author */}
              <div className="relative">
                <label
                  htmlFor="author-style"
                  className="flex items-center gap-2 mb-2"
                >
                  <span className="text-sm font-medium text-[#252932]">
                    Phong cách tác giả
                  </span>
                  <Badge variant="outline">Không bắt buộc</Badge>
                </label>
                <input
                  ref={authorRef}
                  id="author-style"
                  type="text"
                  value={authorStyle}
                  onChange={(e) => setAuthorStyle(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  placeholder="Nhập hoặc tìm tên tác giả"
                  aria-describedby="author-help"
                  aria-autocomplete="list"
                  aria-haspopup="listbox"
                  className="w-full px-4 py-3 rounded-lg border border-[#d5d2ca] text-base text-[#252932] placeholder:text-[#a8adb5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] transition-colors"
                />
                {showSuggestions && authorSuggestions.length > 0 && (
                  <ul
                    role="listbox"
                    aria-label="Gợi ý tác giả"
                    className="absolute z-10 w-full mt-1 bg-white border border-[#d5d2ca] rounded-lg shadow-lg overflow-hidden"
                  >
                    {authorSuggestions.map((author) => (
                      <li
                        key={author}
                        role="option"
                        aria-selected={authorStyle === author}
                      >
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm text-[#252932] hover:bg-[#f2f4f8] transition-colors"
                          onMouseDown={() => {
                            setAuthorStyle(author);
                            setShowSuggestions(false);
                          }}
                        >
                          {author}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p id="author-help" className="mt-1.5 text-xs text-[#7d8490]">
                  Dùng làm tiêu chí tham khảo phong cách, không sao chép nguyên
                  văn.
                </p>
              </div>

              {/* Period */}
              <div>
                <label
                  htmlFor="period"
                  className="block text-sm font-medium text-[#252932] mb-2"
                >
                  Thời kỳ sáng tác
                </label>
                <select
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as LiteraryPeriod)}
                  className="w-full px-4 py-3 rounded-lg border border-[#d5d2ca] text-base text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] transition-colors cursor-pointer"
                >
                  {Object.entries(PERIOD_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* OR logic note */}
              <div className="bg-[#edf5fa] border border-[#b8d5e7] rounded-lg p-3 text-xs text-[#2c5271] leading-relaxed flex gap-2">
                <span className="flex-shrink-0 font-bold">ℹ</span>
                <span>
                  Hệ thống tìm bài thơ phù hợp với ít nhất một tiêu chí đã chọn
                  (logic OR).
                </span>
              </div>
            </div>

            {/* Advanced settings */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                aria-expanded={showAdvanced}
                className="flex items-center gap-2 text-sm font-medium text-[#3f4a6b] hover:text-[#272e44] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded w-full"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${showAdvanced ? "rotate-90" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                Cài đặt nâng cao
              </button>

              {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-[#e4e1da] space-y-4 animate-fade-in">
                  <div>
                    <label
                      htmlFor="top-k"
                      className="block text-sm font-medium text-[#252932] mb-2"
                    >
                      Số bài thơ tham khảo:{" "}
                      <span className="text-[#3f4a6b] font-semibold">
                        {topK}
                      </span>
                    </label>
                    <input
                      id="top-k"
                      type="range"
                      min={1}
                      max={10}
                      value={topK}
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className="w-full accent-[#3f4a6b]"
                      aria-describedby="topk-help"
                    />
                    <div
                      className="flex justify-between text-xs text-[#7d8490] mt-1"
                      id="topk-help"
                    >
                      <span>1 (nhanh hơn)</span>
                      <span>10 (phong phú hơn)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={handleGenerate} size="lg" className="w-full">
                Tạo bài thơ
              </Button>
              <Button
                onClick={handleReset}
                variant="ghost"
                size="md"
                className="w-full"
              >
                Đặt lại
              </Button>
            </div>
          </div>
        </div>

        {/* Center + Right: Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#fffcf7] border border-[#e4e1da] rounded-xl min-h-80 flex flex-col items-center justify-center p-12 text-center">
            <div
              aria-hidden="true"
              className="w-16 h-16 rounded-full bg-[#f4f2ed] flex items-center justify-center mb-5"
            >
              <span className="text-2xl text-[#d6b98c] font-serif">詩</span>
            </div>
            <h2
              className="text-xl font-semibold text-[#252932] mb-2"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Bài thơ của bạn sẽ xuất hiện tại đây.
            </h2>
            <p className="text-[#7d8490] max-w-xs">
              Hoàn thành câu thơ mở đầu và chọn thể thơ để bắt đầu.
            </p>
          </div>

          {/* Guide */}
          <div className="bg-white rounded-xl border border-[#e4e1da] p-6">
            <h3 className="font-semibold text-[#252932] mb-4">
              Hướng dẫn nhanh
            </h3>
            <ol className="space-y-3">
              {[
                "Nhập một câu thơ gốc của bạn vào ô bên trái.",
                "Chọn thể thơ phù hợp (bắt buộc).",
                "Tùy chọn: thêm tác giả hoặc thời kỳ để định hướng phong cách.",
                'Bấm "Tạo bài thơ" — hệ thống sẽ tìm tài liệu tham khảo và sáng tác.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#5f6673]">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e4e7ef] text-[#3f4a6b] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline generation progress component
function GenerationProgress({
  currentStepIdx,
  openingVerse,
  poetryForm,
  onCancel,
}: {
  currentStepIdx: number;
  openingVerse: string;
  poetryForm: PoetryForm;
  onCancel: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-[#e4e1da] p-8 md:p-12 shadow-sm">
        {/* Spinner */}
        <div className="flex justify-center mb-8" aria-hidden="true">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#e4e7ef]" />
            <div className="absolute inset-0 rounded-full border-4 border-[#3f4a6b] border-t-transparent animate-spin" />
            <div className="absolute inset-3 flex items-center justify-center">
              <span className="text-[#d6b98c] font-serif text-xl">詩</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#252932] text-center mb-2">
          Đang sáng tác bài thơ của bạn
        </h1>
        <p className="text-center text-[#5f6673] text-sm mb-8 max-w-sm mx-auto">
          Hệ thống đang tìm những bài thơ phù hợp để làm ngữ cảnh sáng tác.
        </p>

        {/* Steps */}
        <ol className="space-y-3 mb-8" aria-label="Tiến trình sáng tác">
          {progressSteps.map((step, i) => {
            const done = i < currentStepIdx;
            const active = i === currentStepIdx;
            return (
              <li
                key={step.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active ? "bg-[#e4e7ef]" : done ? "opacity-60" : "opacity-40"
                }`}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    done
                      ? "bg-[#4f7a68] text-white"
                      : active
                        ? "bg-[#3f4a6b] text-white"
                        : "bg-[#e4e1da] text-[#7d8490]"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm font-medium ${active ? "text-[#3f4a6b]" : done ? "text-[#5f6673]" : "text-[#a8adb5]"}`}
                >
                  {step.label}
                  {active && "..."}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Request summary */}
        <div className="bg-[#f4f2ed] rounded-lg p-4 mb-6 text-sm space-y-1">
          <div className="text-[#7d8490]">Câu thơ mở đầu</div>
          <div className="text-[#252932] font-serif italic">{openingVerse}</div>
          {poetryForm && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[#7d8490]">Thể thơ:</span>
              <Badge variant="secondary">
                {POETRY_FORM_LABELS[poetryForm]}
              </Badge>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
}
