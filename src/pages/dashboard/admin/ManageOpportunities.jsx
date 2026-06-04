import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from './AdminDashboard'
import axios from '../../../utils/axios'

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
  const [toast, setToast]                 = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await axios.get('/admin/opportunities')
      setOpportunities(res.data)
    } catch {
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleClose = async (id) => {
    try {
      await axios.put(`/admin/opportunities/${id}/close`)
      setOpportunities(prev => prev.map(o =>
        o._id === id ? { ...o, status: 'closed' } : o
      ))
      showToast('Opportunity closed successfully')
    } catch {
      showToast('Action failed.')
    }
  }

  const filtered = opportunities.filter(o =>
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.brandName?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors = {
    active:    'bg-green-50 text-green-700',
    closed:    'bg-gray-100 text-gray-600',
    completed: 'bg-blue-50 text-blue-700',
  }

  return (
    <DashboardLayout links={adminLinks}>

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">All Opportunities</h1>
        <p className="text-muted text-sm mt-1">Monitor and manage all posted campaigns.</p>
      </div>

      <input
        type="text" placeholder="Search by title or brand..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full sm:w-80 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white mb-6"
      />

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📢</div>
            <p className="font-medium text-secondary">No opportunities found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface text-xs font-bold text-muted uppercase tracking-wide">
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-1">Budget</div>
              <div className="col-span-2">Platform</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Action</div>
            </div>
            {filtered.map(op => (
              <div key={op._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-surface transition-colors items-center">
                <div className="md:col-span-4">
                  <p className="text-sm font-bold text-secondary line-clamp-1">{op.title}</p>
                  <p className="text-xs text-muted">{op.category}</p>
                </div>
                <div className="md:col-span-2 text-sm text-secondary">{op.brandName}</div>
                <div className="md:col-span-1 text-sm font-bold text-primary">
                  {(op.budget / 1000).toFixed(0)}K
                </div>
                <div className="md:col-span-2 text-sm text-muted">{op.platform}</div>
                <div className="md:col-span-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[op.status]}`}>
                    {op.status}
                  </span>
                </div>
                <div className="md:col-span-1">
                  {op.status === 'active' && (
                    <button
                      onClick={() => handleClose(op._id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Close
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