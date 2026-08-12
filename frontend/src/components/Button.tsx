import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#3f4a6b] text-white hover:bg-[#323b57] active:bg-[#272e44] disabled:bg-[#c9cfdf] disabled:text-white focus-visible:ring-2 focus-visible:ring-[#596789] focus-visible:ring-offset-2",
  secondary:
    "bg-white text-[#3f4a6b] border border-[#d5d2ca] hover:bg-[#f2f4f8] hover:border-[#a5aec7] active:bg-[#e4e7ef] disabled:bg-[#f4f2ed] disabled:border-[#e4e1da] disabled:text-[#a8adb5] focus-visible:ring-2 focus-visible:ring-[#596789] focus-visible:ring-offset-2",
  ghost:
    "bg-transparent text-[#3f4a6b] hover:bg-[#f2f4f8] active:bg-[#e4e7ef] disabled:text-[#a8adb5] focus-visible:ring-2 focus-visible:ring-[#596789] focus-visible:ring-offset-2",
  destructive:
    "bg-[#b54747] text-white hover:bg-[#9c3939] active:bg-[#7d2d2d] disabled:bg-[#edb8b8] disabled:text-white focus-visible:ring-2 focus-visible:ring-[#b54747] focus-visible:ring-offset-2",
  accent:
    "bg-[#4f7a68] text-white hover:bg-[#3f6254] active:bg-[#324e43] disabled:bg-[#bed5ca] disabled:text-white focus-visible:ring-2 focus-visible:ring-[#4f7a68] focus-visible:ring-offset-2",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm font-semibold gap-1.5",
  md: "h-11 px-5 text-base font-semibold gap-2",
  lg: "h-12 px-6 text-base font-semibold gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
      {!loading && iconRight && (
        <span className="flex-shrink-0">{iconRight}</span>
      )}
    </button>
  );
}
