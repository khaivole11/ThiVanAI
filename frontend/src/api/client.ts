import type { ApiEnvelope } from "./contracts";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() || "/api/v1"
).replace(/\/+$/, "");

type BackendErrorBody = Partial<ApiEnvelope<unknown>> & {
  detail?: unknown;
};

function formatDetail(detail: unknown): string | null {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          return String(item.msg);
        }
        return JSON.stringify(item);
      })
      .join("; ");
  }
  return detail == null ? null : JSON.stringify(detail);
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null,
    public readonly details: unknown,
    public readonly retryable: boolean,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = (await response
    .json()
    .catch(() => null)) as BackendErrorBody | null;

  if (!response.ok) {
    const detailMessage = formatDetail(payload?.detail);
    throw new ApiClientError(
      payload?.message ||
        detailMessage ||
        `Request failed with status ${response.status}`,
      response.status,
      payload?.error_code ?? null,
      payload?.details ?? payload?.detail,
      payload?.retryable ?? response.status >= 500,
    );
  }

  if (!payload || payload.success !== true || payload.data == null) {
    throw new ApiClientError(
      payload?.message || "The backend returned an invalid response envelope",
      response.status,
      payload?.error_code ?? null,
      payload?.details,
      payload?.retryable ?? false,
    );
  }

  return payload.data as T;
}
