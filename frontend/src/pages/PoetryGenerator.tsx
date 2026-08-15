import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createGeneration } from "../api/generations";
import { isAbortError, toUserMessage } from "../api/errorMessages";
import { mapGeneratedPoem } from "../api/mappers";
import type { GeneratePoemRequestDto } from "../api/contracts";
import Button from "../components/Button";
import { showToast } from "../components/Toast";
import { useMetadata } from "../hooks/useMetadata";
import { EXAMPLE_AUTHORS, EXAMPLE_PROMPTS } from "../data/examples";
import type { GenerationRequest } from "../types";
import { savePoem } from "../store";
type Step = "idle" | "generating" | "error";

export default function PoetryGenerator() {
  const {
    poetryForms,
    periods,
    loading: metadataLoading,
    error: metadataError,
    reload: reloadMetadata,
  } = useMetadata();

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as Partial<GenerationRequest> | null;

  const initialPoetryForm = locationState?.poetryForm?.trim() ?? "";
  const initialPeriod = locationState?.period?.trim() ?? "";

  const [openingVerse, setOpeningVerse] = useState(
    locationState?.openingVerse ?? "",
  );
  const [poetryForm, setPoetryForm] = useState(initialPoetryForm);
  const [authorStyle, setAuthorStyle] = useState(
    locationState?.authorStyle?.trim() ?? "",
  );
  const [period, setPeriod] = useState(initialPeriod);

  const [step, setStep] = useState<Step>("idle");
  const [errors, setErrors] = useState<{
    verse?: string;
    form?: string;
  }>({});
  const [generationError, setGenerationError] = useState("");
  const [navigationWarning, setNavigationWarning] = useState("");

  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (metadataLoading || metadataError) return;

    const warnings: string[] = [];

    if (
      initialPoetryForm &&
      !poetryForms.some((form) => form.value === initialPoetryForm)
    ) {
      setPoetryForm("");
      warnings.push("Thể thơ trước đó không còn được backend hỗ trợ.");
    }

    if (initialPeriod && !periods.includes(initialPeriod)) {
      setPeriod("");
      warnings.push("Thời kỳ trước đó không còn được backend hỗ trợ.");
    }

    setNavigationWarning(warnings.join(" "));
  }, [
    initialPeriod,
    initialPoetryForm,
    metadataError,
    metadataLoading,
    periods,
    poetryForms,
  ]);

  function validate(): boolean {
    const nextErrors: typeof errors = {};

    if (!openingVerse.trim()) {
      nextErrors.verse = "Vui lòng nhập câu thơ mở đầu.";
    }
    if (!poetryForm) {
      nextErrors.form = "Vui lòng chọn thể thơ.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleGenerate() {
    if (step === "generating" || !validate()) return;

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    setGenerationError("");
    setStep("generating");

    const body: GeneratePoemRequestDto = {
      firstVerse: openingVerse.trim(),
      poetryForm,
      ...(authorStyle.trim() ? { authorStyle: authorStyle.trim() } : {}),
      ...(period ? { periodStyle: period } : {}),
    };

    try {
      const response = await createGeneration(body, controller.signal);
      const poem = mapGeneratedPoem(response, body);
      savePoem(poem);
      navigate("/ket-qua/" + poem.id);
    } catch (error: unknown) {
      if (isAbortError(error)) {
        setStep("idle");
        return;
      }

      const message = toUserMessage(error);
      setStep("error");
      setGenerationError(message);
      showToast(message, "error");
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
    }
  }

  function handleCancel() {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setStep("idle");
  }

  function handleReset() {
    handleCancel();
    setOpeningVerse("");
    setPoetryForm("");
    setAuthorStyle("");
    setPeriod("");
    setErrors({});
    setGenerationError("");
    setNavigationWarning("");
  }

  const metadataReady =
    !metadataLoading && !metadataError && poetryForms.length > 0;
  const isGenerating = step === "generating";

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div
          className="animate-spin w-12 h-12 border-4 border-[#3f4a6b] border-t-transparent rounded-full mx-auto mb-6"
          aria-hidden="true"
        />
        <h1 className="text-xl font-bold text-[#252932] mb-2">
          Đang sáng tác bài thơ
        </h1>
        <p className="text-[#5f6673] mb-6">
          Hệ thống đang truy xuất ngữ cảnh và tạo bài thơ theo yêu cầu của bạn.
        </p>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Hủy sáng tác
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-[#252932]">Sáng tác thơ</h1>
        <p className="text-[#5f6673] mt-2">
          Nhập ý thơ và phong cách. Hệ thống sẽ sử dụng cấu hình truy xuất mặc
          định của backend.
        </p>
      </div>

      {navigationWarning && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-[#ebcb97] bg-[#fff5e5] p-4 text-sm text-[#7b4c13]"
        >
          {navigationWarning}
        </div>
      )}

      {metadataError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-[#edb8b8] bg-[#fceeee] p-4"
        >
          <p className="text-sm text-[#8e3030] mb-3">
            Không thể tải cấu hình thể thơ từ backend.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={reloadMetadata}
          >
            Thử lại
          </Button>
        </div>
      )}

      {!metadataLoading && !metadataError && poetryForms.length === 0 && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-[#ebcb97] bg-[#fff5e5] p-4"
        >
          <p className="text-sm text-[#7b4c13] mb-3">
            Backend chưa cung cấp thể thơ nào.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={reloadMetadata}
          >
            Tải lại
          </Button>
        </div>
      )}

      {generationError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-[#ebcb97] bg-[#fff5e5] p-4 text-sm text-[#7b4c13]"
        >
          {generationError}
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleGenerate();
        }}
        className="space-y-6 rounded-xl border border-[#e4e1da] bg-white p-6"
      >
        <div>
          <label
            htmlFor="opening-verse"
            className="block font-medium text-[#252932] mb-2"
          >
            Câu thơ mở đầu *
          </label>
          <input
            id="opening-verse"
            type="text"
            className="w-full p-3 border border-[#d5d2ca] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
            placeholder="Nhập câu thơ mở đầu..."
            value={openingVerse}
            onChange={(event) => {
              setOpeningVerse(event.target.value);
              if (errors.verse) {
                setErrors((current) => ({
                  ...current,
                  verse: undefined,
                }));
              }
            }}
            aria-invalid={Boolean(errors.verse)}
            aria-describedby={errors.verse ? "opening-verse-error" : undefined}
          />
          {errors.verse && (
            <p
              id="opening-verse-error"
              role="alert"
              className="text-[#b54747] text-sm mt-1"
            >
              {errors.verse}
            </p>
          )}

          <div
            className="flex flex-wrap gap-2 mt-3"
            role="group"
            aria-label="Gợi ý câu thơ"
          >
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setOpeningVerse(prompt);
                  setErrors((current) => ({
                    ...current,
                    verse: undefined,
                  }));
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-[#e4e1da] text-[#5f6673] hover:border-[#d6b98c] hover:bg-[#fcf8f1]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="poetry-form"
              className="block font-medium text-[#252932] mb-2"
            >
              Thể thơ *
            </label>
            <select
              id="poetry-form"
              className="w-full p-3 border border-[#d5d2ca] rounded-lg bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
              value={poetryForm}
              onChange={(event) => {
                setPoetryForm(event.target.value);
                if (errors.form) {
                  setErrors((current) => ({
                    ...current,
                    form: undefined,
                  }));
                }
              }}
              disabled={!metadataReady}
              aria-invalid={Boolean(errors.form)}
              aria-describedby={errors.form ? "poetry-form-error" : undefined}
            >
              <option value="">
                {metadataLoading ? "Đang tải thể thơ..." : "Chọn thể thơ"}
              </option>
              {poetryForms.map((form) => (
                <option key={form.key} value={form.value}>
                  {form.value}
                </option>
              ))}
            </select>
            {errors.form && (
              <p
                id="poetry-form-error"
                role="alert"
                className="text-[#b54747] text-sm mt-1"
              >
                {errors.form}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="period-style"
              className="block font-medium text-[#252932] mb-2"
            >
              Thời kỳ phong cách
            </label>
            <select
              id="period-style"
              className="w-full p-3 border border-[#d5d2ca] rounded-lg bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              disabled={!metadataReady}
            >
              <option value="">Không ưu tiên</option>
              {periods.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="author-style"
            className="block font-medium text-[#252932] mb-2"
          >
            Phong cách tác giả
          </label>
          <input
            id="author-style"
            type="text"
            list="author-style-options"
            className="w-full p-3 border border-[#d5d2ca] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
            placeholder="Ví dụ: Nguyễn Du"
            value={authorStyle}
            onChange={(event) => setAuthorStyle(event.target.value)}
          />
          <datalist id="author-style-options">
            {EXAMPLE_AUTHORS.map((author) => (
              <option key={author} value={author} />
            ))}
          </datalist>
          <p className="text-xs text-[#7d8490] mt-1">
            Không bắt buộc. Đây là gợi ý phong cách, không phải yêu cầu mô phỏng
            nguyên văn tác giả.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={!metadataReady || isGenerating}>
            Tạo bài thơ
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset}>
            Đặt lại
          </Button>
          {step === "error" && (
            <Button type="button" variant="secondary" onClick={handleGenerate}>
              Thử tạo lại
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
