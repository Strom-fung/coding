import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const STATUS_LABELS = {
  applied: { text: 'Applied', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  interview: { text: 'Interview', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  offer: { text: 'Offer', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  rejected: { text: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

export function JobCard({ job, isOverlay, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const statusInfo = STATUS_LABELS[job.status] || STATUS_LABELS.applied

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-grab
        active:cursor-grabbing select-none
        hover:border-zinc-700 hover:bg-zinc-850 transition-all duration-150
        ${isDragging ? 'opacity-40 ring-2 ring-indigo-500/40' : ''}
        ${isOverlay ? 'opacity-100 shadow-2xl shadow-black/60 ring-1 ring-zinc-700 rotate-1 scale-105' : ''}
      `}
    >
      {/* Drag Handle */}
      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(job) }}
          className="p-1 rounded-md hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Edit"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(job.id) }}
          className="p-1 rounded-md hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>

      {/* Company */}
      <div className="pr-16 mb-1">
        <h3 className="text-sm font-semibold text-white leading-snug">{job.company}</h3>
      </div>

      {/* Position */}
      <p className="text-xs text-zinc-400 mb-2">{job.position}</p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {job.salary && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {job.salary}
          </span>
        )}
        {job.location && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {job.location}
          </span>
        )}
      </div>

      {/* Notes */}
      {job.notes && (
        <p className="text-xs text-zinc-500 mt-2 leading-relaxed border-t border-zinc-800 pt-2 line-clamp-2">
          {job.notes}
        </p>
      )}

      {/* Link */}
      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View listing
        </a>
      )}

      {/* Status badge */}
      <div className="mt-2">
        <span
          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: statusInfo.color }}
          />
          {statusInfo.text}
        </span>
      </div>
    </div>
  )
}
