import { useState, useEffect, useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastHandlers: ((toast: Toast) => void)[] = [];

export function showToast(message: string, type: ToastType = "success") {
  const toast: Toast = { id: Date.now().toString(), message, type };
  toastHandlers.forEach((handler) => handler(toast));
}

const icons: Record<ToastType, string> = {
  success: '<i class="fa-solid fa-check"></i>',
  error: '<i class="fa-solid fa-xmark"></i>',
  warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
  info: '<i class="fa-solid fa-circle-info"></i>',
};

const styles: Record<ToastType, string> = {
  success: "bg-[#eaf5ef] border-[#a8d4be] text-[#255b45]",
  error: "bg-[#fceeee] border-[#edb8b8] text-[#8e3030]",
  warning: "bg-[#fff5e5] border-[#ebcb97] text-[#7b4c13]",
  info: "bg-[#edf5fa] border-[#b8d5e7] text-[#2c5271]",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3500);
  }, []);

  useEffect(() => {
    toastHandlers.push(addToast);
    return () => {
      toastHandlers = toastHandlers.filter((h) => h !== addToast);
    };
  }, [addToast]);

  return (
    <div
      aria-live="polite"
      aria-label="Thông báo"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md text-sm font-medium animate-fade-in max-w-sm ${styles[toast.type]}`}
        >
          <span className="font-bold">{icons[toast.type]}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
