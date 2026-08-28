import { useEffect, useRef, useState } from "react";
import { createGeneration } from "../api/generations";
import { isAbortError, toUserMessage } from "../api/errorMessages";
import { mapGeneratedPoem, mapSourcePoem } from "../api/mappers";
import { searchPoems } from "../api/retrieval";
import type { GeneratePoemRequestDto } from "../api/contracts";
import Badge from "../components/Badge";
import Button from "../components/Button";
import SourceCard from "../components/SourceCard";
import { useMetadata } from "../hooks/useMetadata";
import type { GeneratedPoem, SourcePoem } from "../types";

type ActiveOperation = "retrieval" | "generation" | null;

interface RagConfig {
  topK: number;
  embeddingK: number;
  bm25K: number;
  alpha: number;
}

function formatMilliseconds(value: number | null): string {
  return value === null ? "—" : value.toFixed(1) + " ms";
}

export default function ResearchMode() {
  const {
    poetryForms,
    periods,
    loading: metadataLoading,
    error: metadataError,
    reload: reloadMetadata,
  } = useMetadata();

  const [openingVerse, setOpeningVerse] = useState("");
  const [poetryForm, setPoetryForm] = useState("");
  const [authorStyle, setAuthorStyle] = useState("");
  const [period, setPeriod] = useState("");

  const [topK, setTopK] = useState(5);
  const [embeddingK, setEmbeddingK] = useState(20);
  const [bm25K, setBm25K] = useState(20);
  const [alpha, setAlpha] = useState(0.65);

  const [activeOperation, setActiveOperation] =
    useState<ActiveOperation>(null);
  const [runError, setRunError] = useState("");

  const [retrievalHasRun, setRetrievalHasRun] = useState(false);
  const [retrievalSources, setRetrievalSources] = useState<SourcePoem[]>([]);
  const [retrievalElapsed, setRetrievalElapsed] = useState<number | null>(null);
  const [retrievalConfig, setRetrievalConfig] = useState<RagConfig | null>(
    null,
  );

  const [generationResult, setGenerationResult] =
    useState<GeneratedPoem | null>(null);
  const [generationElapsed, setGenerationElapsed] =
    useState<number | null>(null);
  const [generationConfig, setGenerationConfig] = useState<RagConfig | null>(
    null,
  );

  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  function getCurrentConfig(): RagConfig {
    return {
      topK,
      embeddingK,
      bm25K,
      alpha,
    };
  }

  function createController(operation: Exclude<ActiveOperation, null>) {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setActiveOperation(operation);
    setRunError("");
    return controller;
  }

  function finishOperation(controller: AbortController) {
    if (requestControllerRef.current === controller) {
      requestControllerRef.current = null;
      setActiveOperation(null);
    }
  }

  function handleCancel() {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setActiveOperation(null);
  }

  async function handleRetrieval() {
    if (!openingVerse.trim() || !poetryForm) {
      setRunError(
        "Vui lòng nhập câu thơ mở đầu và chọn thể thơ trước khi chạy retrieval.",
      );
      return;
    }

    const controller = createController("retrieval");
    const config = getCurrentConfig();
    const start = performance.now();

    setRetrievalHasRun(false);
    setRetrievalSources([]);
    setRetrievalElapsed(null);

    const requestContext: GeneratePoemRequestDto = {
      firstVerse: openingVerse.trim(),
      poetryForm,
      ...(authorStyle.trim()
        ? { authorStyle: authorStyle.trim() }
        : {}),
      ...(period ? { periodStyle: period } : {}),
      ...config,
    };

    try {
      const response = await searchPoems(
        {
          firstVerse: requestContext.firstVerse,
          genre: poetryForm,
          ...(authorStyle.trim()
            ? { author: authorStyle.trim() }
            : {}),
          ...(period ? { period } : {}),
          ...config,
        },
        controller.signal,
      );

      setRetrievalSources(
        response.map((source) => mapSourcePoem(source, requestContext)),
      );
      setRetrievalConfig(config);
      setRetrievalElapsed(performance.now() - start);
      setRetrievalHasRun(true);
    } catch (error: unknown) {
      if (!isAbortError(error)) {
        setRunError(toUserMessage(error));
      }
    } finally {
      finishOperation(controller);
    }
  }

  async function handleGeneration() {
    if (!openingVerse.trim() || !poetryForm) {
      setRunError(
        "Vui lòng nhập câu thơ mở đầu và chọn thể thơ trước khi sinh thơ.",
      );
      return;
    }

    const controller = createController("generation");
    const config = getCurrentConfig();
    const start = performance.now();

    setGenerationResult(null);
    setGenerationElapsed(null);

    const body: GeneratePoemRequestDto = {
      firstVerse: openingVerse.trim(),
      poetryForm,
      ...(authorStyle.trim()
        ? { authorStyle: authorStyle.trim() }
        : {}),
      ...(period ? { periodStyle: period } : {}),
      ...config,
    };

    try {
      const response = await createGeneration(body, controller.signal);
      setGenerationResult(mapGeneratedPoem(response, body));
      setGenerationConfig(config);
      setGenerationElapsed(performance.now() - start);
    } catch (error: unknown) {
      if (!isAbortError(error)) {
        setRunError(toUserMessage(error));
      }
    } finally {
      finishOperation(controller);
    }
  }

  const metadataReady =
    !metadataLoading &&
    !metadataError &&
    poetryForms.length > 0;
  const controlsDisabled = activeOperation !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <header className="mb-7">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-[#252932]">
            Chế độ nghiên cứu RAG
          </h1>
          <Badge variant="info">Dành cho thử nghiệm</Badge>
        </div>
        <p className="text-[#5f6673] max-w-3xl">
          Chạy retrieval độc lập hoặc chạy toàn bộ pipeline sinh thơ. Kết quả
          bên dưới chỉ hiển thị score, timing và metadata thật từ backend.
        </p>
      </header>

      {metadataError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-[#edb8b8] bg-[#fceeee] p-4"
        >
          <p className="text-sm text-[#8e3030] mb-3">
            Không thể tải metadata nghiên cứu từ backend.
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

      {runError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-[#edb8b8] bg-[#fceeee] p-4 text-sm text-[#8e3030]"
        >
          {runError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-[#e4e1da] bg-white p-5">
          <h2 className="font-semibold text-lg text-[#252932] mb-4">
            Truy vấn và metadata
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="research-opening-verse"
                className="block text-sm font-medium text-[#252932] mb-1.5"
              >
                Câu thơ mở đầu *
              </label>
              <input
                id="research-opening-verse"
                type="text"
                value={openingVerse}
                onChange={(event) => setOpeningVerse(event.target.value)}
                disabled={controlsDisabled}
                placeholder="Nhập câu thơ dùng làm truy vấn..."
                className="w-full p-3 border border-[#d5d2ca] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="research-poetry-form"
                  className="block text-sm font-medium text-[#252932] mb-1.5"
                >
                  Thể thơ
                </label>
                <select
                  id="research-poetry-form"
                  value={poetryForm}
                  onChange={(event) => setPoetryForm(event.target.value)}
                  disabled={!metadataReady || controlsDisabled}
                  className="w-full p-3 border border-[#d5d2ca] rounded-lg bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
                >
                  <option value="">
                    {metadataLoading
                      ? "Đang tải thể thơ..."
                      : "Chọn thể thơ"}
                  </option>
                  {poetryForms.map((form) => (
                    <option key={form.key} value={form.value}>
                      {form.value}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#7d8490] mt-1">
                  Retrieval luôn lọc theo thể thơ; tác giả/thời kỳ là điều kiện
                  bổ sung.
                </p>
              </div>

              <div>
                <label
                  htmlFor="research-period"
                  className="block text-sm font-medium text-[#252932] mb-1.5"
                >
                  Thời kỳ
                </label>
                <select
                  id="research-period"
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  disabled={!metadataReady || controlsDisabled}
                  className="w-full p-3 border border-[#d5d2ca] rounded-lg bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
                >
                  <option value="">Không lọc thời kỳ</option>
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
                htmlFor="research-author"
                className="block text-sm font-medium text-[#252932] mb-1.5"
              >
                Tác giả
              </label>
              <input
                id="research-author"
                type="text"
                value={authorStyle}
                onChange={(event) => setAuthorStyle(event.target.value)}
                disabled={controlsDisabled}
                placeholder="Không bắt buộc"
                className="w-full p-3 border border-[#d5d2ca] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#e4e1da] bg-white p-5">
          <h2 className="font-semibold text-lg text-[#252932] mb-1">
            Tham số RAG backend
          </h2>
          <p className="text-xs text-[#7d8490] mb-4">
            Các giới hạn hiện khớp config backend: Top K tối đa 20, candidate K
            tối đa 100.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="research-top-k"
                className="block text-sm font-medium text-[#252932] mb-1.5"
              >
                Top K sources
              </label>
              <input
                id="research-top-k"
                type="number"
                min={1}
                max={20}
                step={1}
                value={topK}
                onChange={(event) => {
                  const value = event.currentTarget.valueAsNumber;
                  if (Number.isInteger(value) && value >= 1 && value <= 20) {
                    setTopK(value);
                  }
                }}
                disabled={controlsDisabled}
                className="w-full p-3 border border-[#d5d2ca] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
              />
            </div>

            <div>
              <label
                htmlFor="research-embedding-k"
                className="block text-sm font-medium text-[#252932] mb-1.5"
              >
                Embedding K
              </label>
              <input
                id="research-embedding-k"
                type="number"
                min={1}
                max={100}
                step={1}
                value={embeddingK}
                onChange={(event) => {
                  const value = event.currentTarget.valueAsNumber;
                  if (Number.isInteger(value) && value >= 1 && value <= 100) {
                    setEmbeddingK(value);
                  }
                }}
                disabled={controlsDisabled}
                className="w-full p-3 border border-[#d5d2ca] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
              />
            </div>

            <div>
              <label
                htmlFor="research-bm25-k"
                className="block text-sm font-medium text-[#252932] mb-1.5"
              >
                BM25 K
              </label>
              <input
                id="research-bm25-k"
                type="number"
                min={1}
                max={100}
                step={1}
                value={bm25K}
                onChange={(event) => {
                  const value = event.currentTarget.valueAsNumber;
                  if (Number.isInteger(value) && value >= 1 && value <= 100) {
                    setBm25K(value);
                  }
                }}
                disabled={controlsDisabled}
                className="w-full p-3 border border-[#d5d2ca] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] disabled:bg-[#f4f2ed]"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <label
                htmlFor="research-alpha"
                className="text-sm font-medium text-[#252932]"
              >
                Alpha — trọng số Dense
              </label>
              <output
                htmlFor="research-alpha"
                className="font-mono text-sm text-[#3f4a6b]"
              >
                {alpha.toFixed(2)}
              </output>
            </div>
            <input
              id="research-alpha"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={alpha}
              onChange={(event) => setAlpha(Number(event.target.value))}
              disabled={controlsDisabled}
              className="w-full accent-[#3f4a6b]"
            />
            <div className="flex justify-between text-xs text-[#7d8490]">
              <span>0 — ưu tiên BM25</span>
              <span>1 — ưu tiên Dense</span>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => void handleRetrieval()}
          loading={activeOperation === "retrieval"}
          disabled={!metadataReady || activeOperation !== null}
        >
          Chạy retrieval
        </Button>
        <Button
          type="button"
          onClick={() => void handleGeneration()}
          loading={activeOperation === "generation"}
          disabled={!metadataReady || activeOperation !== null}
        >
          Sinh thơ
        </Button>
        {activeOperation && (
          <Button type="button" variant="destructive" onClick={handleCancel}>
            Hủy request
          </Button>
        )}
      </div>

      <div className="mt-10 space-y-8">
        {retrievalHasRun && retrievalConfig && (
          <section aria-labelledby="retrieval-results-heading">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2
                  id="retrieval-results-heading"
                  className="text-xl font-bold text-[#252932]"
                >
                  Kết quả retrieval-only
                </h2>
                <p className="text-sm text-[#5f6673] mt-1">
                  {retrievalSources.length} nguồn ·{" "}
                  {formatMilliseconds(retrievalElapsed)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  topK {retrievalConfig.topK}
                </Badge>
                <Badge variant="outline">
                  embeddingK {retrievalConfig.embeddingK}
                </Badge>
                <Badge variant="outline">
                  bm25K {retrievalConfig.bm25K}
                </Badge>
                <Badge variant="outline">
                  alpha {retrievalConfig.alpha.toFixed(2)}
                </Badge>
              </div>
            </div>

            {retrievalSources.length === 0 ? (
              <div className="rounded-lg border border-[#e4e1da] bg-white p-6 text-[#5f6673]">
                Backend không trả nguồn phù hợp cho truy vấn này.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {retrievalSources.map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    showScores
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {generationResult && generationConfig && (
          <section aria-labelledby="generation-results-heading">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h2
                  id="generation-results-heading"
                  className="text-xl font-bold text-[#252932]"
                >
                  Kết quả generation
                </h2>
                <p className="text-sm text-[#5f6673] mt-1">
                  Client elapsed: {formatMilliseconds(generationElapsed)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    generationResult.validationPassed ? "success" : "warning"
                  }
                >
                  {generationResult.validationPassed
                    ? "Validation đạt"
                    : "Validation có cảnh báo"}
                </Badge>
                <Badge variant="info">
                  {generationResult.provider} / {generationResult.model}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <article className="xl:col-span-2 rounded-xl border border-[#e4e1da] bg-[#fffcf7] p-6">
                <h3 className="text-2xl font-semibold text-[#292823] mb-5">
                  {generationResult.title}
                </h3>
                <div className="font-serif whitespace-pre-line text-lg leading-8 text-[#292823]">
                  {generationResult.fullText}
                </div>
              </article>

              <aside className="rounded-xl border border-[#e4e1da] bg-white p-5">
                <h3 className="font-semibold text-[#252932] mb-3">
                  Trace của run
                </h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-[#7d8490]">Backend status</dt>
                    <dd className="font-mono text-[#252932]">
                      {generationResult.backendStatus}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#7d8490]">Attempt count</dt>
                    <dd>{generationResult.attemptCount}</dd>
                  </div>
                  <div>
                    <dt className="text-[#7d8490]">Prompt version</dt>
                    <dd className="break-all">
                      {generationResult.promptVersion}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#7d8490]">Corpus version</dt>
                    <dd className="break-all">
                      {generationResult.corpusVersion}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#7d8490]">Cấu hình</dt>
                    <dd className="font-mono text-xs">
                      topK={generationConfig.topK}, embeddingK=
                      {generationConfig.embeddingK}, bm25K=
                      {generationConfig.bm25K}, alpha=
                      {generationConfig.alpha.toFixed(2)}
                    </dd>
                  </div>
                </dl>

                <h4 className="font-semibold text-sm text-[#252932] mt-5 mb-2">
                  Backend timings
                </h4>
                {Object.keys(generationResult.timingsMs).length === 0 ? (
                  <p className="text-sm text-[#7d8490]">
                    Backend không trả timing chi tiết.
                  </p>
                ) : (
                  <ul className="space-y-1 text-sm font-mono">
                    {Object.entries(generationResult.timingsMs).map(
                      ([name, value]) => (
                        <li
                          key={name}
                          className="flex justify-between gap-3"
                        >
                          <span>{name}</span>
                          <span>{value.toFixed(1)} ms</span>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </aside>
            </div>

            {!generationResult.validationPassed && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-[#ebcb97] bg-[#fff5e5] p-4"
              >
                <h3 className="font-semibold text-[#7b4c13] mb-2">
                  Validation errors
                </h3>
                {generationResult.validationErrors.length === 0 ? (
                  <p className="text-sm text-[#7b4c13]">
                    Backend đánh dấu không đạt nhưng không trả chi tiết.
                  </p>
                ) : (
                  <ul className="list-disc pl-5 text-sm text-[#7b4c13]">
                    {generationResult.validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold text-[#252932] mb-3">
                Nguồn của generation run ({generationResult.sources.length})
              </h3>
              {generationResult.sources.length === 0 ? (
                <p className="rounded-lg border border-[#e4e1da] bg-white p-5 text-sm text-[#5f6673]">
                  Backend không trả source cho generation này.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generationResult.sources.map((source) => (
                    <SourceCard
                      key={source.id}
                      source={source}
                      showScores
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
