import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from './AdminDashboard'
import axios from '../../../utils/axios'

export default function ManagePayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [toast, setToast]       = useState('')

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/admin/payments')
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

  const handleVerify = async (id) => {
    try {
      await axios.put(`/admin/payments/${id}/verify`)
      setPayments(prev => prev.map(p =>
        p._id === id ? { ...p, status: 'verified' } : p
      ))
      showToast('Payment verified successfully')
    } catch {
      showToast('Action failed.')
    }
  }

  const handleRelease = async (id) => {
    try {
      await axios.put(`/admin/payments/${id}/release`)
      setPayments(prev => prev.map(p =>
        p._id === id ? { ...p, status: 'released' } : p
      ))
      showToast('Payment released to creator!')
    } catch {
      showToast('Action failed.')
    }
  }

  const statusColors = {
    pending:  'bg-yellow-50 text-yellow-700',
    verified: 'bg-blue-50 text-blue-700',
    released: 'bg-green-50 text-green-700',
    refunded: 'bg-red-50 text-red-600',
  }

  const stats = [
    { label: 'Total Received', value: `PKR ${payments.reduce((a, p) => a + (p.totalAmount || 0), 0).toLocaleString()}`, icon: '💰' },
    { label: 'Pending Verify', value: payments.filter(p => p.status === 'pending').length, icon: '⏳' },
    { label: 'To Release',     value: payments.filter(p => p.status === 'verified').length, icon: '🔄' },
    { label: 'Released',       value: payments.filter(p => p.status === 'released').length, icon: '✅' },
  ]

  return (
    <DashboardLayout links={adminLinks}>

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Payments & Commission</h1>
        <p className="text-muted text-sm mt-1">Verify incoming payments and release to creators.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-card">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-black text-secondary">{s.value}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platform Account Info */}
      <div className="bg-primary-light rounded-2xl p-5 border border-primary/20 mb-6">
        <h2 className="font-bold text-secondary mb-3">Platform Payment Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted">JazzCash:</span>
            <span className="font-bold text-secondary">0300-XXXXXXX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted">Account Title:</span>
            <span className="font-bold text-secondary">Trendora Official</span>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-secondary">All Transactions</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💳</div>
            <p className="font-medium text-secondary">No payments yet</p>
            <p className="text-muted text-sm mt-1">Payments will appear here when brands pay.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {payments.map(p => (
              <div key={p._id} className="px-6 py-4 hover:bg-surface transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-secondary">{p.collaborationTitle || 'Collaboration Payment'}</p>
                    <p className="text-xs text-muted mt-0.5">
                      Brand: {p.brandName} · Creator: {p.creatorName}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">PKR {p.totalAmount?.toLocaleString()}</p>
                      <p className="text-xs text-muted">Commission: PKR {p.platformCommission?.toLocaleString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                    <div className="flex gap-2">
                      {p.status === 'pending' && (
                        <button
                          onClick={() => handleVerify(p._id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Verify
                        </button>
                      )}
                      {p.status === 'verified' && (
                        <button
                          onClick={() => handleRelease(p._id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          Release
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}