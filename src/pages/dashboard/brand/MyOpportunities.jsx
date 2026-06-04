import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { brandLinks } from './BrandDashboard'
import axios from '../../../utils/axios'
import { Link } from 'react-router-dom'

export default function MyOpportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    fetchMyOpportunities()
  }, [])

 const fetchMyOpportunities = async () => {
  try {
    const res = await axios.get('/opportunities/my/list')
    setOpportunities(res.data)
  } catch {
    setOpportunities([])
  } finally {
    setLoading(false)
  }
}

  const statusColors = {
    active:    'bg-green-50 text-green-700',
    closed:    'bg-gray-100 text-gray-600',
    completed: 'bg-blue-50 text-blue-700',
  }

  return (
    <DashboardLayout links={brandLinks}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-secondary">My Opportunities</h1>
          <p className="text-muted text-sm mt-1">All campaigns you have posted.</p>
        </div>
        <Link
          to="/brand/post-opportunity"
          className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
        >
          + Post New
        </Link>
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
      ) : opportunities.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
          <div className="text-5xl mb-3">📢</div>
          <p className="font-medium text-secondary">No opportunities posted yet</p>
          <p className="text-muted text-sm mt-1">Post your first campaign to get started.</p>
          <Link
            to="/brand/post-opportunity"
            className="inline-block mt-4 px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Post Opportunity
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map(op => (
            <div key={op._id} className="bg-card rounded-2xl border border-border shadow-card p-6 hover:border-primary transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-bold text-secondary">{op.title}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[op.status]}`}>
                      {op.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted line-clamp-1 mb-3">{op.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted">
                    <span>💰 PKR {op.budget?.toLocaleString()}</span>
                    <span>📱 {op.platform}</span>
                    <span>⏰ {op.deadline} days</span>
                    <span>📁 {op.category}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-3 py-1.5 text-xs font-semibold border border-border text-muted rounded-lg hover:border-primary hover:text-primary transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}