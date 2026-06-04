import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { creatorLinks } from './CreatorDashboard'
import axios from '../../../utils/axios'

const statusColors = {
  pending:            'bg-gray-100 text-gray-600',
  screenshot_uploaded:'bg-yellow-50 text-yellow-700',
  verified:           'bg-blue-50 text-blue-700',
  released:           'bg-green-50 text-green-700',
  refunded:           'bg-red-50 text-red-600',
}

const statusLabels = {
  pending:            '⏳ Pending',
  screenshot_uploaded:'📸 Verification Pending',
  verified:           '✅ Verified',
  released:           '💰 Released',
  refunded:           '↩️ Refunded',
}

export default function Earnings() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments/creator')
      setPayments(res.data)
    } catch {
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  const totalEarned   = payments.filter(p => p.status === 'released').reduce((a, p) => a + (p.creatorAmount || 0), 0)
  const totalPending  = payments.filter(p => p.status === 'verified').reduce((a, p) => a + (p.creatorAmount || 0), 0)
  const totalCommission = payments.reduce((a, p) => a + (p.platformCommission || 0), 0)
  const thisMonth     = payments.filter(p => {
    const d = new Date(p.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && p.status === 'released'
  }).reduce((a, p) => a + (p.creatorAmount || 0), 0)

  return (
    <DashboardLayout links={creatorLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Earnings</h1>
        <p className="text-muted text-sm mt-1">Track your income and payment history.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Earned',    value: `PKR ${totalEarned.toLocaleString()}`,     icon: '💰', color: 'bg-green-50 text-green-700' },
          { label: 'This Month',      value: `PKR ${thisMonth.toLocaleString()}`,        icon: '📅', color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending Release', value: `PKR ${totalPending.toLocaleString()}`,     icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Commission Paid', value: `PKR ${totalCommission.toLocaleString()}`,  icon: '📊', color: 'bg-purple-50 text-primary' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-xl font-black text-secondary">{s.value}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Payment History */}
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
            <p className="text-muted text-sm mt-1">Complete collaborations to earn money.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface rounded-xl hover:bg-primary-light transition-colors">
                <div>
                  <p className="text-sm font-bold text-secondary">
                    {p.collaborationId?.opportunityId?.title || 'Collaboration Payment'}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    From: {p.brandId?.brandName || p.brandId?.fullName} ·{' '}
                    {new Date(p.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">PKR {p.creatorAmount?.toLocaleString()}</p>
                    <p className="text-xs text-muted">Commission: PKR {p.platformCommission?.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[p.status]}`}>
                    {statusLabels[p.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}