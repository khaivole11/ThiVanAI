import Badge from './Badge'
import type { SourcePoem } from '../types'

interface SourceCardProps {
  source: SourcePoem
  onViewDetail?: (source: SourcePoem) => void
  showScores?: boolean
  compact?: boolean
}

const matchTagVariants: Record<string, 'accent' | 'secondary' | 'default'> = {
  'same-form': 'accent',
  'same-author': 'secondary',
  'same-period': 'secondary',
  'similar-content': 'default',
  'similar-imagery': 'default',
}

export default function SourceCard({ source, onViewDetail, showScores, compact }: SourceCardProps) {
  return (
    <article
      className="bg-white border border-[#e4e1da] rounded-lg p-4 hover:border-[#b8b5ad] transition-colors"
      aria-label={`Nguồn tham khảo ${source.rank}: ${source.title}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e4e7ef] text-[#3f4a6b] text-xs font-bold flex items-center justify-center"
          aria-label={`Hạng ${source.rank}`}
        >
          {source.rank}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#252932] leading-tight truncate">{source.title}</h3>
          <p className="text-xs text-[#7d8490] mt-0.5">
            {source.author !== 'Chưa rõ tác giả' ? source.author : <em>Chưa rõ tác giả</em>}
            {source.period && source.period !== 'Chưa xác định thời kỳ' && (
              <> · {source.period}</>
            )}
          </p>
        </div>
        {showScores && source.hybridScore !== undefined && (
          <span className="flex-shrink-0 font-mono text-xs text-[#7d8490]">
            {(source.hybridScore * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline">{source.poetryForm}</Badge>
        {source.matchTags.map((tag) => (
          <Badge key={tag.key} variant={matchTagVariants[tag.key] || 'default'}>
            {tag.label}
          </Badge>
        ))}
      </div>

      {!compact && (
        <blockquote className="text-sm text-[#5f6673] italic leading-relaxed border-l-2 border-[#e4e1da] pl-3 mb-3 line-clamp-3">
          {source.excerpt}
        </blockquote>
      )}

      {showScores && (
        <div className="mb-3 grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="bg-[#f4f2ed] rounded p-1.5 text-center">
            <div className="text-[#7d8490]">Dense</div>
            <div className="text-[#3f4a6b] font-medium">{source.denseScore?.toFixed(3)}</div>
          </div>
          <div className="bg-[#f4f2ed] rounded p-1.5 text-center">
            <div className="text-[#7d8490]">BM25</div>
            <div className="text-[#3f4a6b] font-medium">{source.bm25Score?.toFixed(3)}</div>
          </div>
          <div className="bg-[#f4f2ed] rounded p-1.5 text-center">
            <div className="text-[#7d8490]">Hybrid</div>
            <div className="text-[#3f4a6b] font-medium">{source.hybridScore?.toFixed(3)}</div>
          </div>
        </div>
      )}

      {onViewDetail && (
        <button
          onClick={() => onViewDetail(source)}
          className="text-xs font-medium text-[#3f4a6b] hover:text-[#272e44] hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded"
        >
          Xem chi tiết →
        </button>
      )}
    </article>
  )
}
