import { useState, useEffect } from 'react'

const emptyForm = {
  company: '',
  position: '',
  salary: '',
  location: '',
  link: '',
  notes: '',
}

export function AddJobModal({ job, onAdd, onUpdate, onClose }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (job) setForm(job)
    else setForm(emptyForm)
  }, [job])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.position.trim()) return
    if (job) onUpdate(form)
    else onAdd(form)
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-white">
            {job ? 'Edit Job' : 'Add Job'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company *" required>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="e.g. Stripe"
                className="input"
                autoFocus
              />
            </Field>
            <Field label="Position *" required>
              <input
                type="text"
                value={form.position}
                onChange={(e) => handleChange('position', e.target.value)}
                placeholder="e.g. Frontend Engineer"
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Salary">
              <input
                type="text"
                value={form.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                placeholder="e.g. $120k - $160k"
                className="input"
              />
            </Field>
            <Field label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="input"
              />
            </Field>
          </div>

          <Field label="Job Link">
            <input
              type="url"
              value={form.link}
              onChange={(e) => handleChange('link', e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Referral info, interview prep notes..."
              rows={3}
              className="input resize-none"
            />
          </Field>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors disabled:opacity-40"
              disabled={!form.company.trim() || !form.position.trim()}
            >
              {job ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-400">
        {label}
      </label>
      {children}
    </div>
  )
}
