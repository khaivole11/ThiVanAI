import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";
import SourceCard from "../components/SourceCard";
import SourceDetailDrawer from "../components/SourceDetailDrawer";
import Modal from "../components/Modal";
import { showToast } from "../components/Toast";
import { getPoemById, savePoem } from "../store";
import type { GeneratedPoem, SourcePoem } from "../types";

const feedbackOptions = [
  { key: "relevant", label: "Phù hợp với yêu cầu" },
  { key: "structured", label: "Cấu trúc tốt" },
  { key: "emotional", label: "Cảm xúc tự nhiên" },
  { key: "wrong-form", label: "Chưa đúng thể thơ" },
  { key: "irrelevant", label: "Chưa liên quan" },
  { key: "unnatural", label: "Ngôn ngữ chưa tự nhiên" },
];

const quickRefinements = [
  "Giàu cảm xúc hơn",
  "Ngôn ngữ cổ điển hơn",
  "Ngắn gọn hơn",
  "Gieo vần rõ hơn",
  "Giữ sát câu mở đầu hơn",
];

export default function GenerationResult() {
  const { generationId } = useParams<{ generationId: string }>();
  const navigate = useNavigate();

  const [poem, setPoem] = useState<GeneratedPoem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourcePoem | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Set<string>>(
    new Set(),
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveNote, setSaveNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSourcesPanel, setShowSourcesPanel] = useState(true);

  useEffect(() => {
    if (!generationId) return;
    const found = getPoemById(generationId);
    if (found) {
      setPoem(found);
      setSaveTitle(found.title);
    } else {
      setNotFound(true);
    }
  }, [generationId]);

  function handleCopy() {
    if (!poem) return;
    const text = `${poem.title}\n\n${poem.lines.join("\n")}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Đã sao chép bài thơ.", "success");
      })
      .catch(() => {
        showToast("Không thể sao chép.", "error");
      });
  }

  function handleBookmarkPoem() {
    if (!poem) return;

    setSaving(true);

    try {
      const updated: GeneratedPoem = {
        ...poem,
        saved: true,
        title: saveTitle.trim() || poem.title,
      };

      savePoem(updated);
      setPoem(updated);

      showToast("Đã đánh dấu bài thơ trên thiết bị này.", "success");
      setShowSaveModal(false);
    } catch (error: unknown) {
      console.error("Failed to bookmark local poem", error);
      showToast("Không thể đánh dấu bài thơ trên thiết bị.", "error");
    } finally {
      setSaving(false);
    }
  }

  function toggleFeedback(key: string) {
    setSelectedFeedback((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const sourceIndex =
    poem?.sources.findIndex((s) => s.id === selectedSource?.id) ?? -1;

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-4xl mb-4" aria-hidden="true">
          ✕
        </p>
        <h1 className="text-2xl font-bold text-[#252932] mb-3">
          Không tìm thấy bài thơ
        </h1>
        <p className="text-[#5f6673] mb-6">
          Bài thơ này có thể đã bị xóa hoặc không tồn tại.
        </p>
        <Button onClick={() => navigate("/sang-tac")}>Tạo bài thơ mới</Button>
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#e4e1da] p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-5 rounded"
                style={{ width: `${60 + (i % 3) * 15}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate("/sang-tac", {
                state: {
                  openingVerse: poem.openingVerse,
                  poetryForm: poem.poetryForm,
                  authorStyle: poem.authorStyle,
                  period: poem.period,
                },
              })
            }
            className="text-sm text-[#3f4a6b] hover:text-[#272e44] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded"
          >
            ← Chỉnh sửa yêu cầu
          </button>
          <span className="text-[#e4e1da]">|</span>
          <h1 className="text-lg font-semibold text-[#252932]">
            Kết quả sáng tác
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {poem.serverPersisted && (
              <Badge variant="success">Đã lưu trên máy chủ</Badge>
            )}

            {poem.saved ? (
              <Badge variant="accent">Đã đánh dấu trên thiết bị</Badge>
            ) : (
              <Badge variant="outline">Chưa đánh dấu trên thiết bị</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSourcesPanel(!showSourcesPanel)}
            className="text-sm text-[#5f6673] hover:text-[#252932] border border-[#d5d2ca] px-3 py-1.5 rounded-lg hover:bg-[#f4f2ed] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] flex items-center gap-1.5"
            aria-expanded={showSourcesPanel}
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
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M15 3v18" />
            </svg>
            {poem.sources.length} nguồn
          </button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${showSourcesPanel ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}
      >
        {/* Main poem area */}
        <div
          className={showSourcesPanel ? "lg:col-span-2 space-y-5" : "space-y-5"}
        >
          {/* Poem card */}
          <article
            className="bg-[#fffcf7] border border-[#e4e1da] rounded-xl p-8 md:p-12"
            aria-label={`Bài thơ: ${poem.title}`}
          >
            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-end mb-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                icon={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                }
              >
                Sao chép
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => setShowSaveModal(true)}
                icon={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                }
              >
                {poem.saved ? "Đã đánh dấu" : "Đánh dấu bài thơ"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  navigate("/sang-tac", {
                    state: {
                      openingVerse: poem.openingVerse,
                      poetryForm: poem.poetryForm,
                      authorStyle: poem.authorStyle,
                      period: poem.period,
                    },
                  })
                }
              >
                Tạo phiên bản khác
              </Button>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">
                {poem.poetryForm.trim() || "Không xác định thể thơ"}
              </Badge>
              {poem.authorStyle && (
                <Badge variant="outline">Phong cách: {poem.authorStyle}</Badge>
              )}
              {poem.period.trim() && (
                <Badge variant="outline">{poem.period.trim()}</Badge>
              )}
              <Badge variant="outline">{poem.topK} bài tham khảo</Badge>
            </div>

            {/* Poem title */}
            <h2
              className="text-2xl md:text-3xl font-semibold text-center text-[#292823] mb-8"
              style={{ fontFamily: "'Lora', serif", letterSpacing: "-0.01em" }}
            >
              {poem.title}
            </h2>

            {/* Poem lines */}
            <div className="max-w-lg mx-auto">
              {poem.lines.map((line, i) => (
                <p
                  key={i}
                  className="text-[#292823] text-xl leading-[1.9]"
                  style={{
                    fontFamily: "'Lora', serif",
                    letterSpacing: "0.005em",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Generation meta */}
            <div className="mt-8 pt-6 border-t border-[#e4e1da] text-xs text-[#7d8490] flex items-center justify-between">
              <time dateTime={poem.createdAt}>
                Tạo lúc:{" "}
                {new Date(poem.createdAt).toLocaleString("vi-VN", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </time>
              <span>AI-generated — Không đại diện tác giả thực</span>
            </div>
          </article>

          {/* Refine section */}
          <div className="bg-white border border-[#e4e1da] rounded-xl p-6">
            <h3 className="font-semibold text-[#252932] mb-4">
              Điều chỉnh bài thơ
            </h3>
            <div
              className="flex flex-wrap gap-2 mb-4"
              role="group"
              aria-label="Điều chỉnh nhanh"
            >
              {quickRefinements.map((r) => (
                <button
                  key={r}
                  className="text-sm px-3 py-1.5 rounded-full border border-[#d5d2ca] text-[#5f6673] hover:border-[#3f4a6b] hover:text-[#3f4a6b] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
                  onClick={() =>
                    showToast("Tính năng đang được phát triển.", "info")
                  }
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Mô tả điều bạn muốn thay đổi..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] placeholder:text-[#a8adb5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
              />
              <Button
                size="sm"
                onClick={() =>
                  showToast("Tính năng đang được phát triển.", "info")
                }
              >
                Tạo phiên bản chỉnh sửa
              </Button>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white border border-[#e4e1da] rounded-xl p-6">
            <h3 className="font-semibold text-[#252932] mb-1">
              Bạn thấy bài thơ này như thế nào?
            </h3>
            <p className="text-sm text-[#7d8490] mb-4">
              Phản hồi của bạn giúp cải thiện hệ thống.
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Đánh giá bài thơ"
            >
              {feedbackOptions.map((fb) => (
                <button
                  key={fb.key}
                  onClick={() => toggleFeedback(fb.key)}
                  aria-pressed={selectedFeedback.has(fb.key)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] ${
                    selectedFeedback.has(fb.key)
                      ? "border-[#3f4a6b] bg-[#e4e7ef] text-[#3f4a6b] font-medium"
                      : "border-[#d5d2ca] text-[#5f6673] hover:border-[#a5aec7]"
                  }`}
                >
                  {fb.label}
                </button>
              ))}
            </div>
            {selectedFeedback.size > 0 && (
              <Button
                size="sm"
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  showToast("Cảm ơn phản hồi của bạn!", "success");
                  setSelectedFeedback(new Set());
                }}
              >
                Gửi phản hồi
              </Button>
            )}
          </div>

          {/* New poem */}
          <div className="text-center">
            <Button variant="secondary" onClick={() => navigate("/sang-tac")}>
              Bắt đầu bài thơ mới
            </Button>
          </div>
        </div>

        {/* Sources panel */}
        {showSourcesPanel && (
          <aside className="lg:col-span-1" aria-label="Các bài thơ tham khảo">
            <div className="bg-white border border-[#e4e1da] rounded-xl p-5 sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[#252932]">
                  Các bài thơ tham khảo
                </h2>
                <Badge variant="outline">{poem.sources.length}</Badge>
              </div>
              <p className="text-xs text-[#5f6673] mb-4 leading-relaxed">
                Hệ thống đã sử dụng {poem.sources.length} bài thơ làm ngữ cảnh
                để hỗ trợ quá trình sáng tác.
              </p>
              <div className="bg-[#edf5fa] border border-[#b8d5e7] rounded-lg p-2.5 text-xs text-[#2c5271] mb-4 leading-relaxed">
                Một bài thơ có thể được chọn khi phù hợp với ít nhất một tiêu
                chí: thể thơ, tác giả hoặc thời kỳ sáng tác.
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[60vh] scrollbar-hide pr-1">
                {poem.sources.map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    onViewDetail={setSelectedSource}
                    compact
                  />
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Source detail drawer */}
      <SourceDetailDrawer
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
        onPrev={
          sourceIndex > 0
            ? () => setSelectedSource(poem.sources[sourceIndex - 1])
            : undefined
        }
        onNext={
          sourceIndex < poem.sources.length - 1
            ? () => setSelectedSource(poem.sources[sourceIndex + 1])
            : undefined
        }
        currentIndex={sourceIndex >= 0 ? sourceIndex : undefined}
        total={poem.sources.length}
      />

      {/* Save modal */}
      <Modal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Đánh dấu bài thơ"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
              Hủy
            </Button>
            <Button loading={saving} onClick={handleBookmarkPoem}>
              Đánh dấu trên thiết bị
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="save-title"
              className="block text-sm font-medium text-[#252932] mb-2"
            >
              Tên bài thơ
            </label>
            <input
              id="save-title"
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#d5d2ca] text-base text-[#252932] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
            />
          </div>
          <div>
            <label
              htmlFor="save-note"
              className="block text-sm font-medium text-[#252932] mb-2"
            >
              Ghi chú{" "}
              <span className="text-[#7d8490] font-normal">
                (không bắt buộc)
              </span>
            </label>
            <textarea
              id="save-note"
              rows={2}
              value={saveNote}
              onChange={(e) => setSaveNote(e.target.value)}
              placeholder="Ghi chú tùy chọn..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#d5d2ca] text-base text-[#252932] placeholder:text-[#a8adb5] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
            />
          </div>
          <div className="bg-[#fff5e5] border border-[#ebcb97] rounded-lg px-3 py-2.5 text-xs text-[#7b4c13]">
            Tiêu đề và trạng thái đánh dấu được lưu trên trình duyệt hiện tại.
            Bản generation gốc đã được lưu riêng trên máy chủ.
          </div>
        </div>
      </Modal>
    </div>
  );
}
