import { apiRequest } from "./client";
import { SearchRequestDto, SourcePoemDto } from "./contracts";

export function searchPoems(body: SearchRequestDto, signal?: AbortSignal) {
  return apiRequest<SourcePoemDto[]>("/retrieval/search", {
    method: "POST",
    body: JSON.stringify(body),
    signal,
  });
}
