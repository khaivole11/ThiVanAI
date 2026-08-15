import type { GeneratedPoem } from "./types";

const CACHE_KEY = "thi-van-ai-history";
const CACHE_VERSION = 1;

interface CachedHistory {
  version: number;
  items: GeneratedPoem[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGeneratedPoem(value: unknown): value is GeneratedPoem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    Array.isArray(value.lines) &&
    typeof value.poetryForm === "string" &&
    typeof value.openingVerse === "string" &&
    Array.isArray(value.sources) &&
    typeof value.createdAt === "string"
  );
}

function writeHistory(items: GeneratedPoem[]): void {
  const payload: CachedHistory = {
    version: CACHE_VERSION,
    items,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

export function getHistory(): GeneratedPoem[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    // Tương thích với format cũ (dạng mảng trực tiếp)
    if (Array.isArray(parsed)) {
      const validItems = parsed.filter(isGeneratedPoem);
      writeHistory(validItems);
      return validItems;
    }

    if (!isRecord(parsed)) return [];
    if (parsed.version !== CACHE_VERSION) return [];
    if (!Array.isArray(parsed.items)) return [];

    return parsed.items.filter(isGeneratedPoem);
  } catch {
    return [];
  }
}

export function savePoem(poem: GeneratedPoem): void {
  try {
    const items = getHistory();
    const index = items.findIndex((item) => item.id === poem.id);

    if (index >= 0) items[index] = poem;
    else items.unshift(poem);

    writeHistory(items);
  } catch {
    throw new Error("Bộ nhớ trình duyệt không khả dụng hoặc đã đầy.");
  }
}

export function getPoemById(id: string): GeneratedPoem | null {
  return getHistory().find((item) => item.id === id) ?? null;
}

export function deletePoem(id: string): void {
  try {
    writeHistory(getHistory().filter((item) => item.id !== id));
  } catch {
    throw new Error("Không thể xóa bài thơ khỏi bộ nhớ thiết bị.");
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    throw new Error("Không thể xóa lịch sử trình duyệt.");
  }
}
