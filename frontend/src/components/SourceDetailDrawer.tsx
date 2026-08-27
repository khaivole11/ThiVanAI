import { useEffect } from "react";
import Badge from "./Badge";
import type { SourcePoem } from "../types";

interface SourceDetailDrawerProps {
  source: SourcePoem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  showScores?: boolean;
  currentIndex?: number;
  total?: number;
}

const matchTagVariants: Record<string, "accent" | "secondary" | "default"> = {
  "same-form": "accent",
  "same-author": "secondary",
  "same-period": "secondary",
  "similar-content": "default",
  "similar-imagery": "default",
};

export default function SourceDetailDrawer({
  source,
  onClose,
  onPrev,
  onNext,
  showScores,
  currentIndex,
  total,
}: SourceDetailDrawerProps) {
  useEffect(() => {
    if (!source) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [source, onClose, onPrev, onNext]);

  useEffect(() => {
    if (source) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [source]);

  if (!source) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Chi tiết: ${source.title}`}
        className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e1da] flex-shrink-0">
          <div>
            <p className="text-xs text-[#7d8490] mb-0.5">
              {currentIndex !== undefined && total !== undefined
                ? `Nguồn ${currentIndex + 1} / ${total}`
                : "Chi tiết bài thơ"}
            </p>
            <h2 className="font-semibold text-[#252932] text-base truncate max-w-xs">
              {source.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7d8490] hover:bg-[#f4f2ed] hover:text-[#252932] transition-colors flex-shrink-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-5">
          {/* Metadata */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7d8490] mb-3">
              Thông tin bài thơ
            </h3>
            <dl className="space-y-2">
              <div className="flex gap-2">
                <dt className="text-sm text-[#7d8490] w-24 flex-shrink-0">
                  Tác giả
                </dt>
                <dd className="text-sm text-[#252932] font-medium">
                  {source.author || "Chưa rõ tác giả"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-sm text-[#7d8490] w-24 flex-shrink-0">
                  Thể thơ
                </dt>
                <dd>
                  <Badge variant="outline">{source.poetryForm}</Badge>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-sm text-[#7d8490] w-24 flex-shrink-0">
                  Thời kỳ
                </dt>
                <dd className="text-sm text-[#252932]">
                  {source.period || "Chưa xác định"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-sm text-[#7d8490] w-24 flex-shrink-0">
                  Hạng truy xuất
                </dt>
                <dd className="text-sm text-[#252932] font-medium">
                  #{source.rank}
                </dd>
              </div>
            </dl>
          </section>

          {/* Why selected */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7d8490] mb-3">
              Lý do được chọn
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {source.matchTags.length === 0 ? (
                <Badge variant="default">Tương đồng nội dung</Badge>
              ) : (
                source.matchTags.map((tag) => (
                  <Badge
                    key={tag.key}
                    variant={matchTagVariants[tag.key] || "default"}
                  >
                    {tag.label}
                  </Badge>
                ))
              )}
            </div>
            <p className="text-sm text-[#5f6673] leading-relaxed">
              {source.matchTags.length === 0
                ? "Bài thơ này được chọn theo độ tương đồng nội dung với câu thơ mở đầu."
                : `Bài thơ này được chọn vì ${source.matchTags
                    .map((t) => t.label.toLowerCase())
                    .join(", ")} với yêu cầu của bạn.`}
            </p>
          </section>

          {/* Excerpt */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7d8490] mb-3">
              Trích đoạn
            </h3>
            <blockquote className="bg-[#fffcf7] border border-[#e4e1da] rounded-lg p-4">
              <p className="font-serif text-[#292823] leading-[1.9] whitespace-pre-line text-base">
                {source.excerpt}
              </p>
            </blockquote>
          </section>

          {/* Technical scores - research mode */}
          {showScores && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7d8490] mb-3">
                Điểm truy xuất (Nghiên cứu)
              </h3>
              <div className="bg-[#f4f2ed] rounded-lg p-3 grid grid-cols-2 gap-3 font-mono text-sm">
                <div>
                  <span className="text-[#7d8490] text-xs">Dense score</span>
                  <div className="text-[#3f4a6b] font-medium">
                    {source.denseScore?.toFixed(4)}
                  </div>
                </div>
                <div>
                  <span className="text-[#7d8490] text-xs">BM25 score</span>
                  <div className="text-[#3f4a6b] font-medium">
                    {source.bm25Score?.toFixed(4)}
                  </div>
                </div>
                <div>
                  <span className="text-[#7d8490] text-xs">Hybrid score</span>
                  <div className="text-[#3f4a6b] font-medium">
                    {source.hybridScore?.toFixed(4)}
                  </div>
                </div>
                <div>
                  <span className="text-[#7d8490] text-xs">Doc ID</span>
                  <div className="text-[#5f6673] text-xs">{source.id}</div>
                </div>
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <div className="bg-[#edf5fa] border border-[#b8d5e7] rounded-lg p-3 text-xs text-[#2c5271] leading-relaxed">
            Tác phẩm này được sử dụng làm ngữ cảnh tham khảo cho hệ thống. Bài
            thơ được tạo không sao chép nguyên văn nội dung nguồn.
          </div>
        </div>

        {/* Navigation footer */}
        {(onPrev || onNext) && (
          <div className="flex-shrink-0 border-t border-[#e4e1da] px-5 py-3 flex justify-between">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              aria-label="Nguồn trước"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#3f4a6b] hover:bg-[#f2f4f8] disabled:text-[#a8adb5] disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
            >
              <i className="fas fa-chevron-left"></i> Trước
            </button>
            <button
              onClick={onNext}
              disabled={!onNext}
              aria-label="Nguồn sau"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#3f4a6b] hover:bg-[#f2f4f8] disabled:text-[#a8adb5] disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
            >
              Sau →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
