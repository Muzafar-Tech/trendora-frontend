import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { brandLinks } from './BrandDashboard'
import axios from '../../../utils/axios'

const statusColors = {
  pending:             'bg-gray-100 text-gray-600',
  screenshot_uploaded: 'bg-yellow-50 text-yellow-700',
  verified:            'bg-blue-50 text-blue-700',
  released:            'bg-green-50 text-green-700',
  refunded:            'bg-red-50 text-red-600',
}

const statusLabels = {
  pending:             '⏳ Pending Payment',
  screenshot_uploaded: '📸 Verification Pending',
  verified:            '✅ Verified',
  released:            '💰 Released',
  refunded:            '↩️ Refunded',
}

export default function BrandPayments() {
  const [payments, setPayments]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [uploadModal, setUploadModal]   = useState(null)
  const [screenshot, setScreenshot]     = useState('')
  const [jazzCash, setJazzCash]         = useState('')
  const [payNote, setPayNote]           = useState('')
  const [uploading, setUploading]       = useState(false)
  const [toast, setToast]               = useState('')

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments/brand')
      setPayments(res.data)
    } catch {
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleUpload = async () => {
    if (!screenshot.trim()) return
    setUploading(true)
    try {
      await axios.put(`/payments/${uploadModal._id}/upload-screenshot`, {
        screenshotUrl: screenshot,
        brandJazzCash: jazzCash,
        paymentNote:   payNote,
      })
      setPayments(prev => prev.map(p =>
        p._id === uploadModal._id ? { ...p, status: 'screenshot_uploaded' } : p
      ))
      showToast('✅ Screenshot uploaded! Admin will verify soon.')
      setUploadModal(null)
      setScreenshot('')
      setJazzCash('')
      setPayNote('')
    } catch {
      showToast('Failed to upload screenshot')
    } finally {
      setUploading(false)
    }
  }

  const totalSpent   = payments.filter(p => p.status === 'released').reduce((a, p) => a + (p.totalAmount || 0), 0)
  const totalPending = payments.filter(p => ['pending', 'screenshot_uploaded'].includes(p.status)).reduce((a, p) => a + (p.totalAmount || 0), 0)
  const totalCommission = payments.filter(p => p.status === 'released').reduce((a, p) => a + (p.platformCommission || 0), 0)

  return (
    <DashboardLayout links={brandLinks}>

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
            <h3 className="font-bold text-secondary text-lg mb-1">Upload Payment Proof</h3>
            <p className="text-sm text-muted mb-2">Amount: <span className="font-bold text-primary">PKR {uploadModal.totalAmount?.toLocaleString()}</span></p>

            {/* Platform Account */}
            <div className="bg-primary-light rounded-xl p-4 mb-5">
              <p className="text-xs font-bold text-primary mb-2">Send Payment To:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">JazzCash:</span>
                  <span className="font-bold text-secondary">0300-XXXXXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Account Title:</span>
                  <span className="font-bold text-secondary">Trendora Official</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Amount:</span>
                  <span className="font-bold text-primary">PKR {uploadModal.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Screenshot URL / Transaction ID
                </label>
                <input
                  type="text"
                  placeholder="Paste Google Drive link or Transaction ID"
                  value={screenshot} onChange={e => setScreenshot(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Your JazzCash Number</label>
                <input
                  type="text" placeholder="03XX-XXXXXXX"
                  value={jazzCash} onChange={e => setJazzCash(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Note (Optional)</label>
                <input
                  type="text" placeholder="Any additional info..."
                  value={payNote} onChange={e => setPayNote(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setUploadModal(null)}
                className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
              <button onClick={handleUpload} disabled={uploading}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60">
                {uploading ? 'Uploading...' : 'Submit Proof'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Payments</h1>
        <p className="text-muted text-sm mt-1">Track all your campaign payments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Spent',       value: `PKR ${totalSpent.toLocaleString()}`,      icon: '💳', color: 'bg-green-50 text-green-700' },
          { label: 'Pending Payments',  value: `PKR ${totalPending.toLocaleString()}`,    icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Commission Paid',   value: `PKR ${totalCommission.toLocaleString()}`, icon: '📊', color: 'bg-purple-50 text-primary' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-xl font-black text-secondary">{s.value}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div className="bg-primary-light rounded-2xl p-5 border border-primary/20 mb-6">
        <h2 className="font-bold text-secondary mb-4">How Payments Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Collaboration Confirmed', desc: 'Send payment to Trendora JazzCash and upload screenshot below.' },
            { step: '2', title: 'Admin Verifies',          desc: 'Admin verifies your payment within 24 hours.' },
            { step: '3', title: 'Work & Release',          desc: 'After you approve work, creator receives payment minus 10% commission.' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <p className="text-sm font-bold text-secondary">{s.title}</p>
                <p className="text-xs text-muted mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h2 className="font-bold text-secondary mb-5">Payment History</h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💳</div>
            <p className="font-medium text-secondary">No payments yet</p>
            <p className="text-muted text-sm mt-1">Payments appear here after collaboration is confirmed.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface rounded-xl hover:bg-primary-light transition-colors">
                <div>
                  <p className="text-sm font-bold text-secondary">
                    Creator: {p.creatorId?.fullName}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-right">
                    <p className="text-sm font-bold text-secondary">PKR {p.totalAmount?.toLocaleString()}</p>
                    <p className="text-xs text-muted">Commission: PKR {p.platformCommission?.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[p.status]}`}>
                    {statusLabels[p.status]}
                  </span>
                  {p.status === 'pending' && (
                    <button
                      onClick={() => setUploadModal(p)}
                      className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}