import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { JobCard } from './components/JobCard'
import { Column } from './components/Column'
import { AddJobModal } from './components/AddJobModal'

const COLUMNS = [
  { id: 'applied', label: 'Applied', color: '#6366f1' },
  { id: 'interview', label: 'Interview', color: '#f59e0b' },
  { id: 'offer', label: 'Offer', color: '#22c55e' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444' },
]

const STORAGE_KEY = 'job-tracker-data'

function getInitialData() {
  return [
    {
      id: 'sample-1',
      company: 'Stripe',
      position: 'Senior Frontend Engineer',
      salary: '$180k - $220k',
      location: 'San Francisco, CA (Remote)',
      link: 'https://stripe.com/jobs',
      notes: 'Referred by @alex. Focus on dashboard team.',
      status: 'applied',
    },
    {
      id: 'sample-2',
      company: 'Vercel',
      position: 'Full Stack Developer',
      salary: '$150k - $190k',
      location: 'Remote (US)',
      link: 'https://vercel.com/careers',
      notes: 'Take-home project: build a deploy preview UI.',
      status: 'interview',
    },
    {
      id: 'sample-3',
      company: 'Linear',
      position: 'Product Engineer',
      salary: '$160k - $200k',
      location: 'Remote (Global)',
      link: 'https://linear.app/careers',
      notes: 'Strong culture fit, love the product.',
      status: 'offer',
    },
    {
      id: 'sample-4',
      company: 'Notion',
      position: 'UI Engineer',
      salary: '$140k - $170k',
      location: 'New York, NY',
      link: 'https://notion.so/jobs',
      notes: 'Passed on salary. Moving forward.',
      status: 'rejected',
    },
  ]
}

export default function App() {
  const [jobs, setJobs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return getInitialData()
  })

  const [activeId, setActiveId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  }, [jobs])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const getColumnJobs = useCallback(
    (columnId) => jobs.filter((j) => j.status === columnId),
    [jobs]
  )

  const findColumn = (id) => {
    if (COLUMNS.find((c) => c.id === id)) return id
    const job = jobs.find((j) => j.id === id)
    return job ? job.status : null
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    const activeColumn = findColumn(active.id)
    const overColumn = findColumn(over.id)

    if (!activeColumn || !overColumn || activeColumn === overColumn) return

    setJobs((prev) => {
      const activeJob = prev.find((j) => j.id === active.id)
      if (!activeJob) return prev
      return prev.map((j) =>
        j.id === active.id ? { ...j, status: overColumn } : j
      )
    })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeColumn = findColumn(active.id)
    const overColumn = findColumn(over.id)

    if (!activeColumn) return

    if (activeColumn === overColumn) {
      const columnJobs = jobs.filter((j) => j.status === activeColumn)
      const oldIndex = columnJobs.findIndex((j) => j.id === active.id)
      const newIndex = columnJobs.findIndex((j) => j.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(columnJobs, oldIndex, newIndex)
        setJobs((prev) => {
          const others = prev.filter((j) => j.status !== activeColumn)
          return [...others, ...reordered]
        })
      }
    }
  }

  const handleAddJob = (job) => {
    const newJob = {
      ...job,
      id: `job-${Date.now()}`,
      status: 'applied',
    }
    setJobs((prev) => [newJob, ...prev])
    setShowModal(false)
  }

  const handleUpdateJob = (updated) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)))
    setEditingJob(null)
    setShowModal(false)
  }

  const handleDeleteJob = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  const activeJob = activeId ? jobs.find((j) => j.id === activeId) : null

  const totalJobs = jobs.length
  const interviewCount = jobs.filter((j) => j.status === 'interview').length
  const offerCount = jobs.filter((j) => j.status === 'offer').length

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-zinc-200">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-[#0d0d0f]/90 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h1 className="text-base font-semibold text-white tracking-tight">Job Tracker</h1>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Total</span>
              <span className="font-medium text-white">{totalJobs}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"/>
              <span className="text-zinc-500">Interview</span>
              <span className="font-medium text-white">{interviewCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"/>
              <span className="text-zinc-500">Offer</span>
              <span className="font-medium text-white">{offerCount}</span>
            </div>
          </div>

          <button
            onClick={() => { setEditingJob(null); setShowModal(true) }}
            className="flex items-center gap-2 px-3 py-2 bg-white text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Job
          </button>
        </div>
      </header>

      {/* Board */}
      <main className="max-w-screen-xl mx-auto px-6 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((column) => {
              const columnJobs = getColumnJobs(column.id)
              return (
                <Column
                  key={column.id}
                  column={column}
                  jobs={columnJobs}
                  onEdit={(job) => { setEditingJob(job); setShowModal(true) }}
                  onDelete={handleDeleteJob}
                />
              )
            })}
          </div>

          <DragOverlay>
            {activeJob ? (
              <JobCard job={activeJob} isOverlay onEdit={() => {}} onDelete={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {showModal && (
        <AddJobModal
          job={editingJob}
          onAdd={handleAddJob}
          onUpdate={handleUpdateJob}
          onClose={() => { setShowModal(false); setEditingJob(null) }}
        />
      )}
    </div>
  )
}
