import DashboardLayout from '../shared/DashboardLayout'
import { Link } from 'react-router-dom'

export const adminLinks = [
  { to: '/admin/dashboard',       icon: '📊', label: 'Dashboard' },
  { to: '/admin/users',           icon: '👥', label: 'All Users' },
  { to: '/admin/opportunities',   icon: '📢', label: 'All Opportunities' },
  { to: '/admin/collaborations',  icon: '🤝', label: 'All Collaborations' },
  { to: '/admin/payments',        icon: '💳', label: 'Payments & Commission' },
  { to: '/admin/disputes',        icon: '⚖️', label: 'Disputes' },
]

const stats = [
  { label: 'Total Users',          value: '0', icon: '👥', color: 'bg-blue-50 text-blue-700' },
  { label: 'Total Opportunities',  value: '0', icon: '📢', color: 'bg-yellow-50 text-yellow-700' },
  { label: 'Active Collaborations',value: '0', icon: '🤝', color: 'bg-green-50 text-green-700' },
  { label: 'Total Revenue',        value: 'PKR 0', icon: '💰', color: 'bg-purple-50 text-primary' },
]

const quickActions = [
  { title: 'Manage Users',         desc: 'View, ban, or verify user accounts.', icon: '👥', to: '/admin/users',          color: 'from-blue-500 to-blue-700' },
  { title: 'Review Opportunities', desc: 'Monitor and manage posted campaigns.', icon: '📢', to: '/admin/opportunities',  color: 'from-yellow-500 to-yellow-700' },
  { title: 'Payment Releases',     desc: 'Verify and release creator payments.', icon: '💳', to: '/admin/payments',       color: 'from-green-500 to-green-700' },
  { title: 'Resolve Disputes',     desc: 'Handle reported issues between users.', icon: '⚖️', to: '/admin/disputes',      color: 'from-red-500 to-red-700' },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout links={adminLinks}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary">Admin Dashboard 👑</h1>
        <p className="text-muted text-sm mt-1">Full platform overview and control panel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <div className="text-xl font-black text-secondary">{s.value}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {quickActions.map((a, i) => (
          <Link
            key={i} to={a.to}
            className={`bg-gradient-to-br ${a.color} rounded-2xl p-6 text-white hover:opacity-90 transition-opacity`}
          >
            <div className="text-3xl mb-3">{a.icon}</div>
            <h3 className="font-bold text-lg mb-1">{a.title}</h3>
            <p className="text-white/80 text-sm">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h2 className="font-bold text-secondary mb-4">Recent Platform Activity</h2>
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📊</div>
          <p className="text-muted text-sm">No activity yet.</p>
          <p className="text-muted text-xs mt-1">Activity will appear here as users join the platform.</p>
        </div>
      </div>

    </DashboardLayout>
  )
}