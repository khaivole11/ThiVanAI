import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import { showToast } from "../components/Toast";
import { getHistory, deletePoem, clearHistory } from "../store";
import type { GeneratedPoem } from "../types";

type SortOption = "newest" | "oldest" | "title";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [poems, setPoems] = useState<GeneratedPoem[]>([]);
  const [search, setSearch] = useState("");
  const [formFilter, setFormFilter] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => setPoems(getHistory()), []);

  const formOptions = Array.from(
    new Set(poems.map((poem) => poem.poetryForm.trim()).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right, "vi"));

  useEffect(() => {
    load();
  }, [load]);

  function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      deletePoem(deleteTarget);
      load();
      showToast("Đã xóa bài thơ khỏi thiết bị này.", "success");
    } catch (error: unknown) {
      console.error("Failed to delete local poem", error);
      showToast("Không thể xóa bài thơ khỏi thiết bị.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  function handleClear() {
    try {
      clearHistory();
      load();
      setClearConfirm(false);

      showToast("Đã xóa toàn bộ lịch sử trên thiết bị.", "success");
    } catch (error: unknown) {
      console.error("Failed to clear local history", error);
      showToast("Không thể xóa lịch sử trên thiết bị.", "error");
    }
  }

  let filtered = poems;
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.openingVerse.toLowerCase().includes(q),
    );
  }
  if (formFilter) {
    filtered = filtered.filter((p) => p.poetryForm === formFilter);
  }
  filtered = [...filtered].sort((a, b) => {
    if (sort === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return a.title.localeCompare(b.title, "vi");
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#252932]">
            Lịch sử trên thiết bị này
          </h1>

          <p className="text-[#5f6673] mt-1">
            Các bài thơ đã được cache hoặc đánh dấu trên trình duyệt hiện tại.
          </p>
        </div>
        <Button onClick={() => navigate("/sang-tac")}>Tạo bài thơ mới</Button>
      </div>

      {/* Storage notice */}
      <div className="bg-[#fff5e5] border border-[#ebcb97] rounded-lg px-4 py-2.5 text-sm text-[#7b4c13] mb-6">
        Xóa bài thơ tại đây chỉ xóa dữ liệu trên trình duyệt hiện tại, không xóa
        bản generation đã lưu.
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8490]"
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
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề hoặc câu thơ..."
            aria-label="Tìm kiếm lịch sử"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] placeholder:text-[#a8adb5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
          />
        </div>
        <select
          value={formFilter}
          onChange={(e) => setFormFilter(e.target.value)}
          aria-label="Lọc theo thể thơ"
          className="px-3 py-2.5 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] cursor-pointer"
        >
          <option value="">Tất cả thể thơ</option>
          {formOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sắp xếp"
          className="px-3 py-2.5 rounded-lg border border-[#d5d2ca] text-sm text-[#252932] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] cursor-pointer"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="title">Theo tiêu đề</option>
        </select>
        {poems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setClearConfirm(true)}
            className="text-[#b54747] hover:bg-[#fceeee]"
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Results */}
      {poems.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-[#e4e1da]">
          <div
            className="w-16 h-16 rounded-full bg-[#f4f2ed] flex items-center justify-center mx-auto mb-5"
            aria-hidden="true"
          >
            <span className="text-2xl font-serif text-[#d6b98c]">詩</span>
          </div>
          <h2 className="text-xl font-semibold text-[#252932] mb-2">
            Bạn chưa có bài thơ nào.
          </h2>
          <p className="text-[#5f6673] mb-6">
            Hãy bắt đầu bằng một câu thơ của riêng bạn.
          </p>
          <Button onClick={() => navigate("/sang-tac")}>
            Tạo bài thơ đầu tiên
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e4e1da]">
          <h2 className="text-lg font-semibold text-[#252932] mb-2">
            {search
              ? "Không tìm thấy bài thơ phù hợp với từ khóa."
              : "Không có bài thơ nào phù hợp với bộ lọc hiện tại."}
          </h2>
          <button
            onClick={() => {
              setSearch("");
              setFormFilter("");
            }}
            className="text-sm text-[#3f4a6b] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="list"
          aria-label="Danh sách bài thơ đã lưu"
        >
          {filtered.map((poem) => (
            <HistoryCard
              key={poem.id}
              poem={poem}
              onOpen={() => navigate(`/ket-qua/${poem.id}`)}
              onReuse={() =>
                navigate("/sang-tac", {
                  state: {
                    openingVerse: poem.openingVerse,
                    poetryForm: poem.poetryForm,
                    authorStyle: poem.authorStyle,
                    period: poem.period,
                  },
                })
              }
              onDelete={() => setDeleteTarget(poem.id)}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Xóa khỏi thiết bị"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              loading={deleting}
              onClick={handleDelete}
            >
              Xóa khỏi thiết bị
            </Button>
          </>
        }
      >
        <p className="text-[#5f6673]">
          Bài thơ sẽ bị xóa khỏi trình duyệt hiện tại. Bản ghi trên backend
          không bị xóa.
        </p>
      </Modal>

      {/* Clear all confirmation */}
      <Modal
        open={clearConfirm}
        onClose={() => setClearConfirm(false)}
        title="Xóa lịch sử trên thiết bị"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setClearConfirm(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              Xóa khỏi thiết bị
            </Button>
          </>
        }
      >
        <p className="text-[#5f6673]">
          Toàn bộ cache và bookmark trên trình duyệt hiện tại sẽ bị xóa. Các
          generation trong database backend vẫn được giữ nguyên.
        </p>
      </Modal>
    </div>
  );
}

function HistoryCard({
  poem,
  onOpen,
  onReuse,
  onDelete,
}: {
  poem: GeneratedPoem;
  onOpen: () => void;
  onReuse: () => void;
  onDelete: () => void;
}) {
  return (
    <article
      role="listitem"
      className="bg-white border border-[#e4e1da] rounded-xl p-5 hover:border-[#b8b5ad] transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-[#252932] truncate text-base">
            {poem.title}
          </h2>
          <p className="text-sm text-[#5f6673] mt-0.5 italic font-serif line-clamp-1">
            "{poem.openingVerse}"
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {poem.serverPersisted && (
            <Badge variant="success">Đã lưu trên máy chủ</Badge>
          )}

          {poem.saved && (
            <Badge variant="accent">Đã đánh dấu trên thiết bị</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="secondary">
          {poem.poetryForm.trim() || "Không xác định thể thơ"}
        </Badge>
        {poem.period.trim() && (
          <Badge variant="outline">{poem.period.trim()}</Badge>
        )}
        {poem.authorStyle && (
          <Badge variant="outline">{poem.authorStyle}</Badge>
        )}
      </div>

      <blockquote className="text-sm text-[#5f6673] italic font-serif leading-relaxed line-clamp-2 mb-4 border-l-2 border-[#e4e1da] pl-3">
        {poem.lines.slice(0, 2).join("\n")}
      </blockquote>

      <div className="flex items-center justify-between">
        <time className="text-xs text-[#7d8490]" dateTime={poem.createdAt}>
          {new Date(poem.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </time>
        <div className="flex gap-1.5">
          <button
            onClick={onReuse}
            className="text-xs px-2.5 py-1.5 rounded border border-[#d5d2ca] text-[#5f6673] hover:border-[#a5aec7] hover:text-[#3f4a6b] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
          >
            Dùng lại yêu cầu
          </button>
          <button
            onClick={onDelete}
            aria-label={`Xóa bài thơ ${poem.title} khỏi thiết bị`}
            className="text-xs px-2.5 py-1.5 rounded border border-[#d5d2ca] text-[#7d8490] hover:border-[#edb8b8] hover:text-[#b54747] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
          >
            Xóa khỏi thiết bị
          </button>
          <button
            onClick={onOpen}
            className="text-xs px-2.5 py-1.5 rounded bg-[#3f4a6b] text-white hover:bg-[#323b57] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
          >
            Mở
          </button>
        </div>
      </div>
    </article>
  );
}
