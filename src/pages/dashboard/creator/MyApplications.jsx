import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import axios from '../../../utils/axios'

const creatorLinks = [
  { to: '/creator/dashboard',      icon: '📊', label: 'Dashboard' },
  { to: '/creator/opportunities',  icon: '🔍', label: 'Browse Opportunities' },
  { to: '/creator/applications',   icon: '📋', label: 'My Applications' },
  { to: '/creator/collaborations', icon: '🤝', label: 'Active Collaborations' },
  { to: '/creator/earnings',       icon: '💰', label: 'Earnings' },
  { to: '/creator/profile',        icon: '👤', label: 'Profile Settings' },
]

const statusColors = {
  pending:   'bg-yellow-50 text-yellow-700',
  accepted:  'bg-green-50 text-green-700',
  rejected:  'bg-red-50 text-red-600',
  countered: 'bg-blue-50 text-blue-700',
  withdrawn: 'bg-gray-100 text-gray-500',
}

const statusLabels = {
  pending:   '⏳ Pending',
  accepted:  '✅ Accepted',
  rejected:  '❌ Rejected',
  countered: '🔄 Counter Offer',
  withdrawn: '↩️ Withdrawn',
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [toast, setToast]               = useState('')
  const [counterModal, setCounterModal] = useState(null)
  const [counterAmount, setCounterAmount] = useState('')
  const [counterNote, setCounterNote]   = useState('')

  useEffect(() => { fetchApplications() }, [])

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/applications/my')
      setApplications(res.data)
    } catch {
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleWithdraw = async (id) => {
    try {
      await axios.delete(`/applications/${id}`)
      setApplications(prev => prev.map(a =>
        a._id === id ? { ...a, status: 'withdrawn' } : a
      ))
      showToast('Application withdrawn successfully')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to withdraw')
    }
  }

  const handleCreatorRespond = async (action) => {
    if (action === 'counter' && !counterAmount) return
    try {
      await axios.put(`/applications/${counterModal._id}/creator-respond`, {
        action,
        counterAmount: Number(counterAmount),
        note: counterNote,
      })
      setApplications(prev => prev.map(a =>
        a._id === counterModal._id ? { ...a, status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'countered' } : a
      ))
      showToast(
        action === 'accept' ? 'Counter offer accepted!'
        : action === 'reject' ? 'Counter offer rejected'
        : 'New counter offer sent!'
      )
      setCounterModal(null)
      setCounterAmount('')
      setCounterNote('')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <DashboardLayout links={creatorLinks}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Counter Response Modal */}
      {counterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
            <h3 className="font-bold text-secondary text-lg mb-1">Brand Counter Offer</h3>
            <p className="text-sm text-muted mb-2">
              Brand offered: <span className="font-bold text-primary">
                PKR {counterModal.lastCounterAmount?.toLocaleString()}
              </span>
            </p>
            {counterModal.lastCounterNote && (
              <p className="text-xs text-muted bg-surface rounded-lg px-3 py-2 mb-4">
                "{counterModal.lastCounterNote}"
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Your Counter Amount (PKR) — optional
              </label>
              <input
                type="number" placeholder="Leave empty to accept brand amount"
                value={counterAmount} onChange={e => setCounterAmount(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-secondary mb-1.5">Note (Optional)</label>
              <textarea
                rows={2} placeholder="Add a note..."
                value={counterNote} onChange={e => setCounterNote(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCreatorRespond('accept')}
                className="py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                ✓ Accept
              </button>
              <button
                onClick={() => handleCreatorRespond('counter')}
                className="py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors"
              >
                Counter
              </button>
              <button
                onClick={() => handleCreatorRespond('reject')}
                className="py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                ✕ Reject
              </button>
            </div>
            <button
              onClick={() => setCounterModal(null)}
              className="w-full mt-2 py-2 text-xs text-muted hover:text-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">My Applications</h1>
        <p className="text-muted text-sm mt-1">Track all your opportunity applications.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium text-secondary">No applications yet</p>
          <p className="text-muted text-sm mt-1">Browse opportunities and start applying!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app._id} className="bg-card rounded-2xl border border-border shadow-card p-6 hover:border-primary transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">

                  {/* Title + Status */}
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="font-bold text-secondary">
                      {app.opportunityId?.title || 'Opportunity'}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
                      {statusLabels[app.status]}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted mb-3">
                    <span>💰 Your Offer: <span className="font-bold text-primary">PKR {app.counterAmount?.toLocaleString()}</span></span>
                    <span>📱 {app.opportunityId?.platform}</span>
                    <span>📁 {app.opportunityId?.category}</span>
                    <span>🕐 {new Date(app.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  {/* Note */}
                  {app.note && (
                    <p className="text-xs text-muted bg-surface rounded-lg px-3 py-2 mb-3">
                      Your note: "{app.note}"
                    </p>
                  )}

                  {/* Brand Counter */}
                  {app.status === 'countered' && app.lastCounterBy === 'brand' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-3">
                      <p className="text-xs font-bold text-blue-700 mb-1">Brand sent a counter offer!</p>
                      <p className="text-sm font-bold text-blue-800">
                        PKR {app.lastCounterAmount?.toLocaleString()}
                      </p>
                      {app.lastCounterNote && (
                        <p className="text-xs text-blue-600 mt-1">"{app.lastCounterNote}"</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {app.status === 'countered' && app.lastCounterBy === 'brand' && (
                    <button
                      onClick={() => setCounterModal(app)}
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
                    >
                      Respond
                    </button>
                  )}
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="px-4 py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}