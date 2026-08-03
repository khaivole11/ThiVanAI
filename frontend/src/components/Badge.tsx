import { type ReactNode } from 'react'

type BadgeVariant = 'default' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#e4e7ef] text-[#3f4a6b]',
  secondary: 'bg-[#f7eedc] text-[#795936]',
  accent: 'bg-[#dfebe5] text-[#324e43]',
  success: 'bg-[#eaf5ef] text-[#255b45] border border-[#a8d4be]',
  warning: 'bg-[#fff5e5] text-[#7b4c13] border border-[#ebcb97]',
  error: 'bg-[#fceeee] text-[#8e3030] border border-[#edb8b8]',
  info: 'bg-[#edf5fa] text-[#2c5271] border border-[#b8d5e7]',
  outline: 'bg-transparent border border-[#d5d2ca] text-[#5f6673]',
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
