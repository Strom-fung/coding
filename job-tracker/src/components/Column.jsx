import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { JobCard } from './JobCard'

export function Column({ column, jobs, onEdit, onDelete }) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className="flex flex-col gap-3">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <span className="text-sm font-semibold text-zinc-300">{column.label}</span>
          <span className="text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded font-medium">
            {jobs.length}
          </span>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 min-h-[200px]"
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="flex items-center justify-center min-h-[120px] border border-dashed border-zinc-800 rounded-xl">
            <p className="text-xs text-zinc-600">Drop here</p>
          </div>
        )}
      </div>
    </div>
  )
}
