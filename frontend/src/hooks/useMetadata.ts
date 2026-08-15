import { useCallback, useEffect, useState } from "react";
import { getPeriods, getPoetryForms } from "../api/metadata";
import type { MetadataOptionDto } from "../api/contracts";

export function useMetadata() {
  const [poetryForms, setPoetryForms] = useState<MetadataOptionDto[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    Promise.all([
      getPoetryForms(controller.signal),
      getPeriods(controller.signal),
    ])
      .then(([forms, periodValues]) => {
        setPoetryForms(forms);
        setPeriods(periodValues);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") {
          return;
        }

        setError(
          cause instanceof Error ? cause : new Error("Failed to load metadata"),
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [reloadKey]);

  return {
    poetryForms,
    periods,
    loading,
    error,
    reload,
  };
}
