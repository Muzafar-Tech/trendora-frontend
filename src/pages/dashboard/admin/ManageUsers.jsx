import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from './AdminDashboard'
import axios from '../../../utils/axios'

const roleColors = {
  creator: 'bg-blue-50 text-blue-700',
  brand:   'bg-yellow-50 text-yellow-700',
  admin:   'bg-purple-50 text-primary',
}

const avatarColors = [
  'from-purple-400 to-purple-700',
  'from-blue-400 to-blue-700',
  'from-green-400 to-green-700',
  'from-pink-400 to-pink-700',
]

export default function ManageUsers() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [toast, setToast]       = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users')
      setUsers(res.data)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleBan = async (userId, isBanned) => {
    try {
      await axios.put(`/admin/users/${userId}/ban`, { isBanned: !isBanned })
      setUsers(prev => prev.map(u =>
        u._id === userId ? { ...u, isBanned: !isBanned } : u
      ))
      showToast(isBanned ? 'User unbanned successfully' : 'User banned successfully')
    } catch {
      showToast('Action failed. Please try again.')
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.role === filter
    return matchSearch && matchFilter
  })

  return (
    <DashboardLayout links={adminLinks}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">All Users</h1>
        <p className="text-muted text-sm mt-1">Manage creators, brands, and admins.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
        />
        <div className="flex gap-2">
          {['all', 'creator', 'brand', 'admin'].map(r => (
            <button
              key={r} onClick={() => setFilter(r)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === r
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👥</div>
            <p className="font-medium text-secondary">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface text-xs font-bold text-muted uppercase tracking-wide">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-3">Joined</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Action</div>
            </div>

            {filtered.map((u, i) => (
              <div key={u._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-surface transition-colors items-center">
                {/* User */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {u.fullName?.[0] || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-secondary truncate">{u.fullName}</p>
                    <p className="text-xs text-muted truncate">{u.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="md:col-span-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColors[u.role]}`}>
                    {u.role}
                  </span>
                </div>

                {/* Joined */}
                <div className="md:col-span-3 text-xs text-muted">
                  {new Date(u.createdAt).toLocaleDateString('en-PK', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    u.isBanned
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {u.isBanned ? 'Banned' : 'Active'}
                  </span>
                </div>

                {/* Action */}
                <div className="md:col-span-1">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleBan(u._id, u.isBanned)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        u.isBanned
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {u.isBanned ? 'Unban' : 'Ban'}
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